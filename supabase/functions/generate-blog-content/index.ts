const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, title, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const seoMetaPrompt = `You are an SEO specialist for Business Bots UK, an AI automation agency in Newcastle upon Tyne, North East England. Generate metadata as a JSON object with "title", "description", and "keywords" keys. Title must be under 60 chars with primary keyword. Description must be under 155 chars, compelling, action-oriented. Keywords must be a comma-separated string of exactly 5 relevant SEO keywords for the page. Return ONLY raw JSON, no markdown, no code fences.`;

    const blogPrompt = `You are a senior content writer for Business Bots UK, an AI automation agency based in Newcastle upon Tyne, North East England.

STRICT RULES:
- Return ONLY raw HTML with Tailwind CSS classes. No markdown whatsoever.
- Never use ---, ###, >, **, or any markdown syntax.
- Write professional, stylish prose. Zero AI-isms (no "In today's fast-paced world", "game-changer", "revolutionize", "leverage", "delve", "It's important to note").
- Use <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <strong>, <em> tags.
- Apply Tailwind classes: text-gray-700, text-lg, leading-relaxed, mb-6, font-bold, text-2xl, text-xl, etc.
- Include North East UK personality — mention Newcastle, Tyne and Wear, the region where relevant.
- Reference Business Bots UK AI employees by name (Sprout, Lilly, Banjo, Timi, Like, Tobby, Nano, Skoot) where natural.
- End with a clear CTA linking to /book-demo.
- Aim for 800-1200 words of rich, engaging content.`;

    const systemPrompt = type === "seo-meta" ? seoMetaPrompt : blogPrompt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt || `Write a blog post titled: "${title}"` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Top up in workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      throw new Error(`AI gateway error ${response.status}: ${text}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
