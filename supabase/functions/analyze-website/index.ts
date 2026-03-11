import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ success: false, error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Normalise URL
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    console.log("Scraping:", targetUrl);

    // ── Step 1: Fetch the page HTML ──
    let html = "";
    try {
      const pageRes = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; BusinessBotsUK-SEOBot/1.0; +https://businessbotsuk.com)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      });
      html = await pageRes.text();
    } catch (fetchErr) {
      console.error("Fetch failed:", fetchErr);
      return new Response(
        JSON.stringify({ success: false, error: "Could not reach the website. Please check the URL and try again." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Step 2: Extract key SEO signals ──
    const extract = (regex: RegExp): string => {
      const m = html.match(regex);
      return m ? m[1].replace(/<[^>]*>/g, "").trim() : "";
    };

    const title = extract(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const metaDesc = extract(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i)
      || extract(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i);

    // Grab all h1 and h2
    const headings: string[] = [];
    const hRe = /<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi;
    let hMatch;
    while ((hMatch = hRe.exec(html)) !== null && headings.length < 10) {
      const clean = hMatch[1].replace(/<[^>]*>/g, "").trim();
      if (clean) headings.push(clean);
    }

    // Grab visible body text (rough)
    const bodyText = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 2000);

    const scrapedContext = [
      `Page Title: ${title}`,
      `Meta Description: ${metaDesc}`,
      `Headings: ${headings.join(" | ")}`,
      `Body excerpt: ${bodyText.slice(0, 800)}`,
    ].join("\n");

    console.log("Scraped context length:", scrapedContext.length);

    // ── Step 3: AI Analysis via Lovable AI ──
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: "AI key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert SEO analyst. You will receive scraped data from a website. Analyse it and return a JSON object with EXACTLY this structure (no markdown, no code fences, just raw JSON):

{
  "industry": "string - the business industry/niche",
  "seoScore": number (0-100),
  "summary": "string - 1-2 sentence SEO summary of the site",
  "keywordsFound": number,
  "opportunitiesFound": number,
  "keywords": [
    {
      "keyword": "string",
      "volume": number (estimated monthly search volume),
      "opportunity": number (0-100 percentage),
      "competition": "Low" | "Medium" | "High"
    }
  ]
}

Return EXACTLY 5 keyword objects. Base everything on the REAL content of the website - do not invent unrelated keywords. The keywords should be high-intent, commercially relevant terms this business should target. Be realistic with volumes.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyse this website (${targetUrl}):\n\n${scrapedContext}` },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, errText);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ success: false, error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ success: false, error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiRes.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from the AI response (strip any markdown fences)
    const jsonStr = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let analysis;
    try {
      analysis = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI JSON:", rawContent);
      return new Response(JSON.stringify({ success: false, error: "AI returned invalid analysis. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Analysis complete for:", targetUrl, "Industry:", analysis.industry);

    return new Response(
      JSON.stringify({ success: true, data: analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("analyze-website error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
