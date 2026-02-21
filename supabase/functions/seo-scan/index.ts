import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_PAGES = [
  "/", "/pricing", "/blog", "/community", "/faq", "/help-centre",
  "/contact", "/book-demo", "/get-started", "/case-studies",
  "/what-is-an-ai-employee", "/call", "/connect",
  "/privacy-policy", "/terms",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: seoEntries } = await supabase.from("seo_metadata").select("*");
    const entryMap = new Map((seoEntries || []).map((e: any) => [e.page_path, e]));

    const results = SITE_PAGES.map((path) => {
      const entry = entryMap.get(path) as any;
      let score = 100;
      const issues: string[] = [];
      const statuses: Record<string, string> = {};

      if (!entry) {
        return { path, score: 0, issues: ["No SEO metadata"], statuses: { title: "missing", description: "missing", og_image: "missing", keywords: "missing" } };
      }

      // Title
      if (!entry.title) { score -= 30; issues.push("Missing title"); statuses.title = "missing"; }
      else if (entry.title.length > 60) { score -= 10; issues.push("Title >60 chars"); statuses.title = "warning"; }
      else { statuses.title = "good"; }

      // Description
      if (!entry.description) { score -= 30; issues.push("Missing meta description"); statuses.description = "missing"; }
      else if (entry.description.length > 160) { score -= 10; issues.push("Description >160 chars"); statuses.description = "warning"; }
      else if (entry.description.length < 50) { score -= 5; issues.push("Description too short"); statuses.description = "warning"; }
      else { statuses.description = "good"; }

      // OG Image
      if (!entry.og_image) { score -= 15; issues.push("Missing OG image"); statuses.og_image = "missing"; }
      else { statuses.og_image = "good"; }

      // Keywords — 15 points at stake
      if (!entry.keywords || entry.keywords.trim() === "") { score -= 15; issues.push("No keywords"); statuses.keywords = "missing"; }
      else if (entry.keywords.split(",").filter((k: string) => k.trim()).length < 3) { score -= 5; issues.push("Few keywords (<3)"); statuses.keywords = "warning"; }
      else { statuses.keywords = "good"; }

      return { path, score: Math.max(0, score), issues, statuses };
    });

    const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);

    // Log the scan
    await supabase.from("audit_logs").insert({
      action: "seo_scan",
      entity_type: "seo",
      entity_id: "full_scan",
      details: { avgScore, pagesScanned: results.length, timestamp: new Date().toISOString() },
    });

    return new Response(JSON.stringify({ success: true, results, avgScore }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
