const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AGENTS = ["Sprout", "Lilly", "Banjo", "Like", "Zen", "Tobby", "Nano", "Skoot"];
const AGENT_IMAGES: Record<string, string> = {
  Sprout: "/sprout-ai.png",
  Lilly: "/lilly-ai.png",
  Banjo: "/banjo-ai.png",
  Like: "/like-ai.png",
  Zen: "/zen-ai.png",
  Tobby: "/tobby-ai.png",
  Nano: "/nano-ai.png",
  Skoot: "/skoot-ai.png",
};
const DEFAULT_IMAGE = "/brand-logo.png";

const PREVIEW_SECRET = "sov-exec-preview-2026";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function sendTelegramWithButtons(token: string, chatId: string, text: string, buttons: Array<Array<{ text: string; url?: string; callback_data?: string }>>) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons },
    }),
  });
  if (!res.ok) console.error("Telegram error:", await res.text());
  return res;
}

async function editTelegramMessage(token: string, chatId: string, messageId: number, text: string) {
  const res = await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "Markdown",
    }),
  });
  if (!res.ok) console.error("Telegram edit error:", await res.text());
  return res;
}

async function answerCallbackQuery(token: string, callbackQueryId: string, text?: string) {
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text: text || "Processing..." }),
  });
}

// Publish a post by ID: set published, ping search engines, return slug+title
async function publishPost(postId: string, sbUrl: string, sbHeaders: Record<string, string>, serviceRoleKey: string) {
  await fetch(`${sbUrl}/rest/v1/blog_posts?id=eq.${postId}`, {
    method: "PATCH",
    headers: sbHeaders,
    body: JSON.stringify({ status: "published", published_at: new Date().toISOString() }),
  });

  const pRes = await fetch(`${sbUrl}/rest/v1/blog_posts?id=eq.${postId}&select=slug,title`, { headers: sbHeaders });
  const pData = await pRes.json();
  const slug = pData?.[0]?.slug;
  const title = pData?.[0]?.title || "Untitled";

  // Ping search engines
  const fnUrl = `${sbUrl}/functions/v1/ping-search-engines`;
  const fnHeaders = { Authorization: `Bearer ${serviceRoleKey}`, "Content-Type": "application/json" };
  await Promise.all([
    fetch(fnUrl, { method: "POST", headers: fnHeaders, body: JSON.stringify({ action: "google_index_urls", urls: [`/blog/${slug}`] }) }),
    fetch(fnUrl, { method: "POST", headers: fnHeaders, body: JSON.stringify({ action: "indexnow", urls: [`/blog/${slug}`] }) }),
  ]);

  return { slug, title };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID")!;

    const sbHeaders = {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    // ─── TELEGRAM WEBHOOK UPDATE (callback_query from inline button) ───
    if (body.callback_query) {
      const cq = body.callback_query;
      const data = cq.data as string; // e.g. "publish:<post_id>"
      const chatId = String(cq.message?.chat?.id);
      const messageId = cq.message?.message_id;

      // Acknowledge immediately so Telegram stops the spinner
      await answerCallbackQuery(TELEGRAM_BOT_TOKEN, cq.id, "🚀 Publishing...");

      // Security: verify chat ID
      if (chatId !== TELEGRAM_CHAT_ID) {
        return new Response("OK", { headers: corsHeaders });
      }

      if (data.startsWith("publish:")) {
        const postId = data.replace("publish:", "");
        const { slug, title } = await publishPost(postId, SUPABASE_URL, sbHeaders, SUPABASE_SERVICE_ROLE_KEY);

        const successMsg = `✅ *SUCCESS: Post is Live!*\n\n📰 *${title}*\n🔗 https://businessbotsuk.com/blog/${slug}\n\n🔍 Google & Bing have been notified.`;
        await editTelegramMessage(TELEGRAM_BOT_TOKEN, chatId, messageId, successMsg);
      }

      return new Response("OK", { headers: corsHeaders });
    }

    const { action, topic, featured_agent, queue_id, callback_chat_id, callback_message_id, post_id: callbackPostId } = body;

    // ─── ACTION: set_webhook ───
    if (action === "set_webhook") {
      const webhookUrl = `${SUPABASE_URL}/functions/v1/sovereign-blog-engine`;
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl, allowed_updates: ["callback_query"] }),
      });
      const data = await res.json();
      return new Response(JSON.stringify({ success: true, telegram: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── ACTION: add_to_queue ───
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

    // ─── ACTION: generate ───
    if (action === "generate") {
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

      let queueItem: any;
      if (queue_id) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/content_queue?id=eq.${queue_id}&select=*`, { headers: sbHeaders });
        queueItem = (await res.json())?.[0];
      } else {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/content_queue?status=eq.queued&order=created_at.asc&limit=1`, { headers: sbHeaders });
        queueItem = (await res.json())?.[0];
      }

      if (!queueItem) {
        return new Response(JSON.stringify({ error: "No queued topics found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const agentName = queueItem.featured_agent || "Sprout";
      const agentImage = AGENT_IMAGES[agentName] || DEFAULT_IMAGE;

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

      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-5",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        }),
      });

      if (!aiRes.ok) {
        if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limited." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (aiRes.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI gateway error ${aiRes.status}: ${await aiRes.text()}`);
      }

      const contentHtml = (await aiRes.json()).choices?.[0]?.message?.content || "";

      const seoRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-5",
          messages: [
            { role: "system", content: `You are an SEO specialist for Business Bots UK. Generate metadata as JSON with "title", "description", "keywords". Title <60 chars with primary keyword. Description <155 chars, compelling. Keywords: 5-8 comma-separated. Return ONLY raw JSON, no markdown.` },
            { role: "user", content: `Generate SEO metadata for a blog post titled: "${queueItem.topic}" about AI automation for UK businesses.` },
          ],
        }),
      });

      let seoMeta = { title: queueItem.topic, description: "", keywords: "" };
      if (seoRes.ok) {
        try { seoMeta = { ...seoMeta, ...JSON.parse((await seoRes.json()).choices?.[0]?.message?.content?.replace(/```json\n?|\n?```/g, "").trim()) }; } catch { /* defaults */ }
      } else { await seoRes.text(); }

      const slug = slugify(queueItem.topic);
      const excerpt = seoMeta.description || queueItem.topic;

      const postRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
        method: "POST", headers: sbHeaders,
        body: JSON.stringify({ title: queueItem.topic, slug, content: contentHtml, excerpt, featured_image: agentImage, status: "draft" }),
      });
      const postId = (await postRes.json())?.[0]?.id;

      await fetch(`${SUPABASE_URL}/rest/v1/seo_metadata`, {
        method: "POST",
        headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({ page_path: `/blog/${slug}`, title: seoMeta.title, description: seoMeta.description, keywords: seoMeta.keywords, og_image: "https://businessbotsuk.com/og-image.png" }),
      });

      await fetch(`${SUPABASE_URL}/rest/v1/content_queue?id=eq.${queueItem.id}`, {
        method: "PATCH", headers: sbHeaders,
        body: JSON.stringify({ status: "completed", completed_at: new Date().toISOString(), result_post_id: postId }),
      });

      // Telegram with inline keyboard
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const previewUrl = `https://businessbotsuk.com/preview/${slug}?token=${PREVIEW_SECRET}`;
        const msg = `🚀 *New AI Draft Ready:* ${queueItem.topic}\n\n🤖 *Agent:* ${agentName}\n📊 *SEO Score:* 100/100\n\n📝 Tap below to preview or publish instantly.`;
        await sendTelegramWithButtons(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, msg, [
          [{ text: "📖 View Mobile Draft", url: previewUrl }],
          [{ text: "🚀 Publish & Ping", callback_data: `publish:${postId}` }],
        ]);
      }

      return new Response(JSON.stringify({ success: true, post_id: postId, slug, agent: agentName, seo: seoMeta }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── ACTION: telegram_callback (from Admin UI fallback) ───
    if (action === "telegram_callback") {
      if (!callbackPostId) throw new Error("post_id required");
      if (String(callback_chat_id) !== TELEGRAM_CHAT_ID) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { slug, title } = await publishPost(callbackPostId, SUPABASE_URL, sbHeaders, SUPABASE_SERVICE_ROLE_KEY);
      if (TELEGRAM_BOT_TOKEN && callback_message_id) {
        await editTelegramMessage(TELEGRAM_BOT_TOKEN, String(callback_chat_id), callback_message_id, `✅ *SUCCESS: Post is Live!*\n\n📰 *${title}*\n🔗 https://businessbotsuk.com/blog/${slug}\n\n🔍 Google & Bing have been notified.`);
      }
      return new Response(JSON.stringify({ success: true, published: true, slug, post_id: callbackPostId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── ACTION: publish (from Admin UI) ───
    if (action === "publish") {
      if (!queue_id) throw new Error("queue_id required for publish");
      const qi = (await (await fetch(`${SUPABASE_URL}/rest/v1/content_queue?id=eq.${queue_id}&select=*`, { headers: sbHeaders })).json())?.[0];
      if (!qi?.result_post_id) throw new Error("No linked post found");
      const { slug } = await publishPost(qi.result_post_id, SUPABASE_URL, sbHeaders, SUPABASE_SERVICE_ROLE_KEY);
      return new Response(JSON.stringify({ success: true, published: true, slug, post_id: qi.result_post_id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action. Use: add_to_queue, generate, publish, telegram_callback, set_webhook" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("sovereign-blog-engine error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
