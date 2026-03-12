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

    // Grab all h1, h2, h3
    const headings: string[] = [];
    const hRe = /<h[123][^>]*>([\s\S]*?)<\/h[123]>/gi;
    let hMatch;
    while ((hMatch = hRe.exec(html)) !== null && headings.length < 15) {
      const clean = hMatch[1].replace(/<[^>]*>/g, "").trim();
      if (clean) headings.push(clean);
    }

    // Extract meta keywords if present
    const metaKeywords = extract(/<meta\s+name=["']keywords["']\s+content=["']([\s\S]*?)["']/i);

    // Extract link text for additional context
    const linkTexts: string[] = [];
    const linkRe = /<a[^>]*>([\s\S]*?)<\/a>/gi;
    let linkMatch;
    while ((linkMatch = linkRe.exec(html)) !== null && linkTexts.length < 20) {
      const clean = linkMatch[1].replace(/<[^>]*>/g, "").trim();
      if (clean && clean.length > 3 && clean.length < 60) linkTexts.push(clean);
    }

    // Grab visible body text — increased to 4000 chars for deeper analysis
    const bodyText = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000);

    const scrapedContext = [
      `URL: ${targetUrl}`,
      `Page Title: ${title}`,
      `Meta Description: ${metaDesc}`,
      metaKeywords ? `Meta Keywords: ${metaKeywords}` : "",
      `Headings: ${headings.join(" | ")}`,
      `Navigation/Link Text: ${linkTexts.slice(0, 15).join(" | ")}`,
      `Body excerpt: ${bodyText.slice(0, 2000)}`,
    ].filter(Boolean).join("\n");

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
  "industry": "string - the business industry/niche based on ACTUAL page content",
  "seoScore": number (0-100),
  "summary": "string - 1-2 sentence SEO summary specifically about THIS website's content and positioning",
  "keywordsFound": number (must match the length of the keywords array below),
  "opportunitiesFound": number (must match the length of the keywords array below),
  "keywords": [
    {
      "keyword": "string",
      "volume": number (estimated monthly search volume),
      "opportunity": number (0-100 percentage),
      "competition": "Low" | "Medium" | "High",
      "imageQuery": "string - a 2-3 word Unsplash search query for a photo related to this specific keyword"
    }
  ],
  "technicalHealth": [
    {
      "element": "string - e.g. Meta Description, Title Tag, H1 Tag, Image Alt Tags, HTTPS, Mobile Viewport, Open Graph Tags, Canonical Tag",
      "status": "Pass" | "Warning" | "Fail",
      "recommendation": "string - specific actionable recommendation based on what was found"
    }
  ],
  "contentMetrics": [
    {
      "metric": "string - e.g. Readability, Word Count, Keyword Density, Internal Links, Content Freshness, Heading Structure",
      "value": "string - the actual current value found",
      "optimal": "string - the ideal/optimal target value"
    }
  ],
  "topicClusters": [
    {
      "clusterName": "string - a topic cluster derived from the page content",
      "relevanceScore": number (0-100)
    }
  ]
}

CRITICAL RULES:
1. Return between 4 and 8 keyword objects depending on how rich the site content is. A simple one-page site gets 4; a content-rich site gets 7-8.
2. EVERY keyword MUST be directly derived from the ACTUAL content, products, services, or topics found on the website. Do NOT invent unrelated keywords.
3. DYNAMIC ENTROPY: Every keyword MUST have a DIFFERENT opportunity score AND a DIFFERENT volume number. Never repeat the same values. Spread volumes realistically from hundreds to tens of thousands.
4. The "imageQuery" for each keyword must describe a REAL photo related to that keyword (e.g., for "running shoes" use "running shoes closeup", for "travel agent" use "travel booking office"). Never use generic tech/AI imagery unless the site is actually about AI.
5. The industry, summary, and keywords must ALL reflect the SAME business. If the site sells shoes, everything must be about shoes.
6. The seoScore should reflect actual SEO quality signals: does it have a good title, meta description, headings structure, content depth?
7. technicalHealth MUST have 6-8 items covering real on-page SEO elements found (or missing) in the HTML. Base status on ACTUAL scraped data.
8. contentMetrics MUST have 5-7 items with realistic current values derived from the scraped text.
9. topicClusters MUST have 4-6 items representing genuine topic groupings from the page content. Each MUST have a DIFFERENT relevanceScore.`;

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

    // Parse JSON from the AI response — robust extraction
    let jsonStr = rawContent;
    // Strip markdown code fences
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1];
    }
    // Fallback: find first { to last }
    const firstBrace = jsonStr.indexOf("{");
    const lastBrace = jsonStr.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
    }
    jsonStr = jsonStr.trim();

    let analysis;
    try {
      analysis = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI JSON. Raw length:", rawContent.length, "Extracted:", jsonStr.slice(0, 200));
      // Retry once with lenient cleanup (fix common AI typos like ], instead of },)
      try {
        const fixed = jsonStr.replace(/\]\s*,\s*\{/g, "},\n    {").replace(/\]\s*\n\s*\{/g, "},\n    {");
        analysis = JSON.parse(fixed);
      } catch {
        return new Response(JSON.stringify({ success: false, error: "AI returned invalid analysis. Please try again." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Ensure counts match actual arrays
    analysis.keywordsFound = analysis.keywords?.length || 0;
    analysis.opportunitiesFound = analysis.keywords?.length || 0;

    console.log("Analysis complete for:", targetUrl, "Industry:", analysis.industry, "Keywords:", analysis.keywordsFound);

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
