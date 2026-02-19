import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://businessbotsuk.lovable.app";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_KEY = "businessbotsuk2024key";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, urls } = await req.json();
    const results: { engine: string; status: number; url: string }[] = [];

    if (action === "ping_sitemap") {
      // Ping Google
      const googleRes = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`);
      results.push({ engine: "Google", status: googleRes.status, url: SITEMAP_URL });

      // Ping Bing via IndexNow
      const bingRes = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`);
      results.push({ engine: "Bing", status: bingRes.status, url: SITEMAP_URL });
    }

    if (action === "indexnow" && urls?.length) {
      // IndexNow batch submission
      const indexNowRes = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "businessbotsuk.lovable.app",
          key: INDEXNOW_KEY,
          keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
          urlList: urls.map((u: string) => `${SITE_URL}${u}`),
        }),
      });
      results.push({ engine: "IndexNow", status: indexNowRes.status, url: urls.join(", ") });
    }

    // Log to audit
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    await supabase.from("audit_logs").insert({
      action: "search_ping",
      entity_type: "seo",
      entity_id: action,
      details: { results, timestamp: new Date().toISOString() },
    });

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
