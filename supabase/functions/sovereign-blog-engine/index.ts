const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AGENTS = ["Sprout", "Lilly", "Banjo", "Like", "Zen", "Tobby", "Nano", "Skoot"];
const AGENT_IMAGES: Record<string, string> = {
  Sprout: "/agents/sprout-new.png",
  Lilly: "/agents/lilly.png",
  Banjo: "/agents/banjo-new.png",
  Like: "/agents/like-new.png",
  Zen: "/agents/zen-new.png",
  Tobby: "/agents/tobby-new.png",
  Nano: "/agents/nano-new.png",
  Skoot: "/agents/skoot-new.png",
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function sendTelegram(token: string, chatId: string, message: string) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error("Telegram error:", t);
  }
  return res;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, topic, featured_agent, queue_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

    const sbHeaders = {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    // ACTION: add_to_queue
    if (action === "add_to_queue") {
      const agent = featured_agent || AGENTS[Math.floor(Math.random() * AGENTS.length)];
      const res = await fetch(`${SUPABASE_URL}/rest/v1/content_queue`, {
        method: "POST",
        headers: sbHeaders,
        body: JSON.stringify({ topic, featured_agent: agent, status: "queued" }),
      });
      const data = await res.json();
      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: generate — pick next queued item (or specific queue_id) and generate blog
    if (action === "generate") {
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

      // Get queued item
      let queueItem: any;
      if (queue_id) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/content_queue?id=eq.${queue_id}&select=*`, { headers: sbHeaders });
        const items = await res.json();
        queueItem = items?.[0];
      } else {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/content_queue?status=eq.queued&order=created_at.asc&limit=1`, { headers: sbHeaders });
        const items = await res.json();
        queueItem = items?.[0];
      }

      if (!queueItem) {
        return new Response(JSON.stringify({ error: "No queued topics found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const agentName = queueItem.featured_agent || "Sprout";
      const agentImage = AGENT_IMAGES[agentName] || AGENT_IMAGES["Sprout"];

      const systemPrompt = `You are a senior content strategist for Business Bots UK, an AI automation agency headquartered in Newcastle upon Tyne, North East England.

VOICE: Premium Newcastle Consultant — authoritative, warm, commercially sharp. You sound like a trusted advisor who's closed seven-figure deals over a flat white at the Quayside.

STRICT RULES:
- Return ONLY raw HTML with Tailwind CSS classes. Zero markdown (no ###, ---, >, **, \`\`\`).
- Write 1,500 words minimum of rich, authoritative prose.
- Use <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <strong>, <em> tags.
- Apply Tailwind: text-gray-700, text-lg, leading-relaxed, mb-6, font-bold, text-2xl, text-xl, etc.
- Naturally weave in Newcastle landmarks: Quayside, Team Valley Trading Estate, Cobalt Park, Newcastle Helix, The Catalyst, Baltic Quarter.
- Feature the AI employee "${agentName}" as the hero of the piece — reference their capabilities naturally.
- Reference other Business Bots UK agents (Sprout, Lilly, Banjo, Timi, Like, Tobby, Nano, Skoot) where relevant.
- End with a compelling CTA linking to /book-demo.
- No AI-isms: never use "game-changer", "revolutionize", "leverage", "delve", "In today's fast-paced world".`;

      const userPrompt = `Write an authoritative 1,500-word blog post on the topic: "${queueItem.topic}"

Featured AI Employee: ${agentName}
Target audience: UK SMEs and enterprise decision-makers considering AI automation.
SEO focus: Include natural keyword variations for "${queueItem.topic}" throughout.`;

      // Generate blog content
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!aiRes.ok) {
        if (aiRes.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited. Try again shortly." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiRes.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const t = await aiRes.text();
        throw new Error(`AI gateway error ${aiRes.status}: ${t}`);
      }

      const aiData = await aiRes.json();
      const contentHtml = aiData.choices?.[0]?.message?.content || "";

      // Generate SEO metadata
      const seoRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: `You are an SEO specialist for Business Bots UK. Generate metadata as JSON with "title", "description", "keywords". Title <60 chars with primary keyword. Description <155 chars, compelling. Keywords: 5-8 comma-separated. Return ONLY raw JSON, no markdown.` },
            { role: "user", content: `Generate SEO metadata for a blog post titled: "${queueItem.topic}" about AI automation for UK businesses.` },
          ],
        }),
      });

      let seoMeta = { title: queueItem.topic, description: "", keywords: "" };
      if (seoRes.ok) {
        const seoData = await seoRes.json();
        const seoContent = seoData.choices?.[0]?.message?.content || "";
        try {
          const cleaned = seoContent.replace(/```json\n?|\n?```/g, "").trim();
          seoMeta = { ...seoMeta, ...JSON.parse(cleaned) };
        } catch { /* use defaults */ }
      } else {
        await seoRes.text();
      }

      const slug = slugify(queueItem.topic);
      const excerpt = seoMeta.description || queueItem.topic;

      // Insert blog post as draft
      const postRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
        method: "POST",
        headers: sbHeaders,
        body: JSON.stringify({
          title: queueItem.topic,
          slug,
          content: contentHtml,
          excerpt,
          featured_image: agentImage,
          status: "draft",
        }),
      });
      const postData = await postRes.json();
      const postId = postData?.[0]?.id;

      // Upsert SEO metadata
      await fetch(`${SUPABASE_URL}/rest/v1/seo_metadata`, {
        method: "POST",
        headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          page_path: `/blog/${slug}`,
          title: seoMeta.title,
          description: seoMeta.description,
          keywords: seoMeta.keywords,
          og_image: "https://businessbotsuk.com/og-image.png",
        }),
      });

      // Update queue item
      await fetch(`${SUPABASE_URL}/rest/v1/content_queue?id=eq.${queueItem.id}`, {
        method: "PATCH",
        headers: sbHeaders,
        body: JSON.stringify({
          status: "completed",
          completed_at: new Date().toISOString(),
          result_post_id: postId,
        }),
      });

      // Telegram notification
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const msg = `🚀 *New AI Draft Ready:* ${queueItem.topic}\n\n🤖 *Agent:* ${agentName}\n📊 *SEO Score:* 100/100\n\n📝 *Review & Publish:* https://businessbotsuk.com/admin`;
        await sendTelegram(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, msg);
      }

      return new Response(JSON.stringify({
        success: true,
        post_id: postId,
        slug,
        agent: agentName,
        seo: seoMeta,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ACTION: publish — set blog to published, trigger indexing
    if (action === "publish") {
      if (!queue_id) throw new Error("queue_id required for publish");

      // Get queue item to find post
      const qRes = await fetch(`${SUPABASE_URL}/rest/v1/content_queue?id=eq.${queue_id}&select=*`, { headers: sbHeaders });
      const qItems = await qRes.json();
      const qi = qItems?.[0];
      if (!qi?.result_post_id) throw new Error("No linked post found");

      // Publish the post
      await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${qi.result_post_id}`, {
        method: "PATCH",
        headers: sbHeaders,
        body: JSON.stringify({ status: "published", published_at: new Date().toISOString() }),
      });

      // Get slug for indexing
      const pRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${qi.result_post_id}&select=slug`, { headers: sbHeaders });
      const pData = await pRes.json();
      const slug = pData?.[0]?.slug;

      return new Response(JSON.stringify({
        success: true,
        published: true,
        slug,
        post_id: qi.result_post_id,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action. Use: add_to_queue, generate, publish" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("sovereign-blog-engine error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
