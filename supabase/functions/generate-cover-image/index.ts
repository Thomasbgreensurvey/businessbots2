const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(prompt: string, apiKey: string, maxRetries = 3): Promise<Response> {
  const models = [
    "google/gemini-3.1-flash-image-preview",
    "google/gemini-3-pro-image-preview",
  ];

  for (const model of models) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          modalities: ["image", "text"],
        }),
      });

      if (res.ok) return res;

      const body = await res.text();

      if (res.status === 429) {
        const delay = Math.pow(2, attempt + 1) * 1000 + Math.random() * 1000;
        console.log(`Rate limited on ${model}, attempt ${attempt + 1}/${maxRetries}. Waiting ${Math.round(delay)}ms...`);
        await sleep(delay);
        continue;
      }

      // Non-retryable error — return as-is
      return new Response(body, { status: res.status, headers: res.headers });
    }
    console.log(`All retries exhausted for ${model}, trying next model...`);
  }

  return new Response(JSON.stringify({ error: "All models rate limited" }), { status: 429 });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keyword, industry } = await req.json();
    if (!keyword) {
      return new Response(JSON.stringify({ success: false, error: "keyword is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: "AI key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `A high-quality, modern, editorial-style blog cover image representing "${keyword}" in the ${industry || "business"} sector. Minimalist, corporate SaaS aesthetic, no text in the image, photorealistic, professional lighting, clean composition.`;

    console.log("Generating image for:", keyword, "| Industry:", industry);

    const aiRes = await generateWithRetry(prompt, LOVABLE_API_KEY);

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI image error:", aiRes.status, errText);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ success: false, error: "Rate limited. Please try again in a minute." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ success: false, error: "AI credits exhausted. Please top up." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ success: false, error: "Image generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiText = await aiRes.text();
    let aiData: any;
    try {
      aiData = JSON.parse(aiText);
    } catch (_parseErr) {
      console.error("AI gateway returned non-JSON (len:", aiText.length, "):", aiText.substring(0, 300));
      return new Response(JSON.stringify({ success: false, error: "AI gateway returned an invalid response. Please retry." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const imageData = aiData?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageData || !imageData.startsWith("data:image")) {
      console.error("No image returned from AI");
      return new Response(JSON.stringify({ success: false, error: "AI did not return an image" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const base64Match = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!base64Match) {
      return new Response(JSON.stringify({ success: false, error: "Invalid image data format" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ext = base64Match[1] === "jpeg" ? "jpg" : base64Match[1];
    const base64 = base64Match[2];
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const fileName = `covers/${slug}-${Date.now()}.${ext}`;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.49.1");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, bytes, {
        contentType: `image/${base64Match[1]}`,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(JSON.stringify({ success: false, error: "Failed to store image" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: publicUrlData } = supabase.storage.from("blog-images").getPublicUrl(fileName);

    console.log("Image generated and stored:", publicUrlData.publicUrl);

    return new Response(
      JSON.stringify({ success: true, url: publicUrlData.publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("generate-cover-image error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
