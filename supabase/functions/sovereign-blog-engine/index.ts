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

// ─── BRAND SQUEEZE CONSTANTS ───
const BRAND_PHRASES = [
  "Business Bots UK - AI solutions for businesses",
  "BusinessBotsUK.com - AI Solutions",
];
const BETA_KEYWORDS = [
  "AI marketing for my business",
  "AI automation Newcastle",
  "UK SME AI strategy",
];
const FREEPHONE = "0800 654 6949";
const CONTACT_CTA = `<div class="mt-12 p-8 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl border border-emerald-200">
  <h3 class="text-2xl font-bold text-gray-900 mb-4">📞 Contact the Experts</h3>
  <p class="text-lg text-gray-700 leading-relaxed mb-4">Ready to transform your business with AI? Call Business Bots UK on our freephone number: <strong><a href="tel:08006546949" class="text-emerald-600 hover:text-emerald-700 underline">${FREEPHONE}</a></strong> or visit <strong><a href="https://businessbotsuk.com" class="text-emerald-600 hover:text-emerald-700 underline">BusinessBotsUK.com</a></strong>.</p>
  <p class="mt-4"><a href="/book-demo" class="inline-block bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors">Book Your Free Demo →</a></p>
</div>`;
// Quick Facts box — injected at the TOP of every post
function buildQuickFactsBox(topic: string, agentName: string): string {
  return `<div class="mb-10 p-6 bg-blue-50 rounded-2xl border border-blue-200">
  <h3 class="text-xl font-bold text-gray-900 mb-3">📋 Quick Facts</h3>
  <ul class="text-gray-700 text-lg leading-relaxed space-y-2">
    <li>📞 <strong>Freephone:</strong> <a href="tel:08006546949" class="text-blue-600 hover:text-blue-700 underline">${FREEPHONE}</a></li>
    <li>🌐 <strong>Website:</strong> <a href="https://businessbotsuk.com" class="text-blue-600 hover:text-blue-700 underline">BusinessBotsUK.com</a> — AI Solutions for Businesses</li>
    <li>🤖 <strong>Featured AI Employee:</strong> ${agentName}</li>
  </ul>
</div>`;
}

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

// ─── Build the brand-infused system prompt ───
function buildSystemPrompt(agentName: string, wordCount: number = 1500): string {
  return `You are a senior content strategist for Business Bots UK, an AI automation agency headquartered in Newcastle upon Tyne, North East England.

VOICE: Premium Newcastle Consultant — authoritative, warm, commercially sharp. You sound like a trusted advisor who's closed seven-figure deals over a flat white at the Quayside.

BRAND SQUEEZE — MANDATORY:
- You MUST naturally integrate EACH of the following phrases at least TWICE in the article:
  1. "${BRAND_PHRASES[0]}"
  2. "${BRAND_PHRASES[1]}"
- Weave them into headings, body paragraphs, and the conclusion so they read naturally — not forced.

SEO BETA KEYWORDS — MANDATORY:
- Naturally integrate these high-intent keywords throughout the article:
  ${BETA_KEYWORDS.map(k => `• "${k}"`).join("\n  ")}
- Use variations and long-tail forms of these keywords for semantic depth.

CONTACT INTEGRATION — MANDATORY:
- Mention the freephone number ${FREEPHONE} at least once naturally within the article body (not just in the CTA).
- Reference BusinessBotsUK.com as the go-to resource for AI automation.

STRICT RULES:
- Return ONLY raw HTML with Tailwind CSS classes. Zero markdown (no ###, ---, >, **, \`\`\`).
- Write ${wordCount} words minimum of rich, authoritative prose.
- Use <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <strong>, <em> tags.
- Apply Tailwind: text-gray-700, text-lg, leading-relaxed, mb-6, font-bold, text-2xl, text-xl, etc.
- Naturally weave in Newcastle landmarks: Quayside, Team Valley Trading Estate, Cobalt Park, Newcastle Helix, The Catalyst, Baltic Quarter.
- Feature the AI employee "${agentName}" as the hero of the piece — reference their capabilities naturally.
- Reference other Business Bots UK agents (Sprout, Lilly, Banjo, Timi, Like, Tobby, Nano, Skoot) where relevant.
- Do NOT include a CTA at the end — it will be appended automatically.
- ABSOLUTELY NO <img> tags anywhere in the output. The featured image is handled separately. Never generate image URLs or placeholder images.
- No AI-isms: never use "game-changer", "revolutionize", "leverage", "delve", "In today's fast-paced world".`;
}

// ─── Generate a blog post (shared logic) ───
async function generateBlogPost(
  queueItem: any,
  LOVABLE_API_KEY: string,
  SUPABASE_URL: string,
  sbHeaders: Record<string, string>,
  TELEGRAM_BOT_TOKEN: string,
  TELEGRAM_CHAT_ID: string,
  wordCount: number = 1500,
) {
  const agentName = queueItem.featured_agent || "Sprout";
  const agentImage = AGENT_IMAGES[agentName] || DEFAULT_IMAGE;

  const systemPrompt = buildSystemPrompt(agentName, wordCount);

  const userPrompt = `Write an authoritative ${wordCount}-word blog post on the topic: "${queueItem.topic}"

Featured AI Employee: ${agentName}
Target audience: UK SMEs and enterprise decision-makers considering AI automation.
SEO focus: Include natural keyword variations for "${queueItem.topic}" throughout.
Beta Keywords to weave in: ${BETA_KEYWORDS.join(", ")}`;

  const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    }),
  });

  if (!aiRes.ok) {
    if (aiRes.status === 429) throw new Error("Rate limited — try again shortly.");
    if (aiRes.status === 402) throw new Error("AI credits exhausted.");
    throw new Error(`AI gateway error ${aiRes.status}: ${(await aiRes.text()).slice(0, 200)}`);
  }

  let contentHtml = (await aiRes.json()).choices?.[0]?.message?.content || "";
  // Strip any <img> tags the AI may have hallucinated — featured image is handled separately
  contentHtml = contentHtml.replace(/<img[^>]*>/gi, "");
  // Prepend Quick Facts box for AI crawlers (GEO layer)
  contentHtml = buildQuickFactsBox(queueItem.topic, agentName) + "\n" + contentHtml;
  // Append the mandatory Contact the Experts CTA block
  contentHtml += `\n${CONTACT_CTA}`;

  // SEO metadata
  const seoRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: `You are an SEO specialist for Business Bots UK. Generate metadata as JSON with "title", "description", "keywords". Title <60 chars with primary keyword. Description <155 chars, compelling — MUST include the freephone number 0800 654 6949. Keywords: 5-8 comma-separated, include "${BETA_KEYWORDS[0]}" and "${BETA_KEYWORDS[1]}". Return ONLY raw JSON, no markdown.` },
        { role: "user", content: `Generate SEO metadata for a blog post titled: "${queueItem.topic}" about AI automation for UK businesses.` },
      ],
    }),
  });

  let seoMeta = { title: queueItem.topic, description: "", keywords: BETA_KEYWORDS.join(", ") };
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

  // Telegram notification
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    const previewUrl = `https://businessbotsuk.com/preview/${slug}?token=${PREVIEW_SECRET}`;
    const msg = `🚀 *New AI Draft Ready:* ${queueItem.topic}\n\n🤖 *Agent:* ${agentName}\n📊 *SEO Score:* 100/100\n🏷️ *Brand Squeeze:* ✅ Active\n📈 *Beta Keywords:* ${BETA_KEYWORDS.length} injected\n\n📝 Tap below to preview or publish instantly.`;
    await sendTelegramWithButtons(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, msg, [
      [{ text: "📖 View Mobile Draft", url: previewUrl }],
      [{ text: "🚀 Publish & Ping", callback_data: `publish:${postId}` }],
    ]);
  }

  return { post_id: postId, slug, agent: agentName, seo: seoMeta };
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
      const data = cq.data as string;
      const chatId = String(cq.message?.chat?.id);
      const messageId = cq.message?.message_id;

      await answerCallbackQuery(TELEGRAM_BOT_TOKEN, cq.id, "🚀 Publishing...");

      if (chatId !== TELEGRAM_CHAT_ID) {
        return new Response("OK", { headers: corsHeaders });
      }

      if (data.startsWith("publish:")) {
        const postId = data.replace("publish:", "");
        const { slug, title } = await publishPost(postId, SUPABASE_URL, sbHeaders, SUPABASE_SERVICE_ROLE_KEY);

        const successMsg = `✅ *SUCCESS: Post is Live!*\n\n📰 *${title}*\n🔗 https://businessbotsuk.com/blog/${slug}\n\n🔍 Google & Bing have been notified.\n🏷️ Brand Squeeze: Active`;
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
        // Auto-generate a topic when queue is empty (keeps the cron productive)
        const autoTopics = [
          "How AI Chatbots Are Helping Newcastle Businesses Capture More Leads in 2026",
          "The Complete Guide to AI Automation for North East SMEs",
          "Why Gateshead Companies Are Replacing Manual Follow-Ups with AI Employees",
          "AI-Powered Customer Support: How Sunderland Businesses Save 40 Hours a Week",
          "From Quayside to Global: How AI Marketing Transforms North East Startups",
          "The Future of Recruitment in Newcastle: AI Screening That Actually Works",
          "How Team Valley Businesses Use AI to Dominate Local Search Rankings",
          "Smart Email Campaigns: Why AI Outperforms Manual Marketing for UK SMEs",
          "The ROI of AI Employees: Real Numbers from North East Business Owners",
          "Why Every Newcastle Trades Business Needs an AI Booking Assistant",
          "AI Lead Qualification: How Durham Firms Close 3x More Deals",
          "The North East AI Revolution: What Smart Business Owners Know That Others Don't",
          "How AI Automation Helps Northumberland Tourism Businesses Handle Peak Season",
          "Social Media on Autopilot: How AI Manages Your Brand While You Sleep",
          "The Ultimate AI Strategy for North East Property Management Companies",
        ];
        const randomTopic = autoTopics[Math.floor(Math.random() * autoTopics.length)];
        const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
        const createRes = await fetch(`${SUPABASE_URL}/rest/v1/content_queue`, {
          method: "POST", headers: sbHeaders,
          body: JSON.stringify({ topic: randomTopic, featured_agent: agent, status: "queued" }),
        });
        queueItem = (await createRes.json())?.[0];
        if (!queueItem) {
          return new Response(JSON.stringify({ error: "Failed to auto-create topic" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      const result = await generateBlogPost(queueItem, LOVABLE_API_KEY, SUPABASE_URL, sbHeaders, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, 1500);
      return new Response(JSON.stringify({ success: true, ...result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── ACTION: force_heartbeat (Quick 1,000-word branded post) ───
    if (action === "force_heartbeat") {
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

      // Pick a random queued topic or use a default heartbeat topic
      const res = await fetch(`${SUPABASE_URL}/rest/v1/content_queue?status=eq.queued&order=created_at.asc&limit=1`, { headers: sbHeaders });
      let queueItem = (await res.json())?.[0];

      if (!queueItem) {
        // Auto-create a heartbeat topic
        const heartbeatTopic = "Why UK SMEs Are Choosing AI Employees for Lead Generation in 2026";
        const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
        const createRes = await fetch(`${SUPABASE_URL}/rest/v1/content_queue`, {
          method: "POST", headers: sbHeaders,
          body: JSON.stringify({ topic: heartbeatTopic, featured_agent: agent, status: "queued" }),
        });
        queueItem = (await createRes.json())?.[0];
      }

      const result = await generateBlogPost(queueItem, LOVABLE_API_KEY, SUPABASE_URL, sbHeaders, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, 1000);
      return new Response(JSON.stringify({ success: true, heartbeat: true, ...result }), {
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

    // ─── ACTION: dry_run (Triple-Lock Integrity Check) ───
    if (action === "dry_run") {
      const checks: Record<string, any> = { db_topic: false, ai_reachable: false, telegram_ok: false };

      const qRes = await fetch(`${SUPABASE_URL}/rest/v1/content_queue?status=eq.queued&order=created_at.asc&limit=1`, { headers: sbHeaders });
      const qData = await qRes.json();
      checks.db_topic = qData?.length > 0 ? { ok: true, topic: qData[0].topic, agent: qData[0].featured_agent } : { ok: false, reason: "No queued topics" };

      const hasKey = !!LOVABLE_API_KEY;
      if (!hasKey) {
        checks.ai_reachable = { ok: false, error: "LOVABLE_API_KEY is not set in environment" };
      } else {
        const models = ["google/gemini-2.5-flash-lite", "openai/gpt-5-nano"];
        for (const model of models) {
          try {
            const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({ model, messages: [{ role: "user", content: "Reply with only: OK" }], max_tokens: 5 }),
            });
            const bodyText = await aiRes.text();
            if (aiRes.ok) {
              checks.ai_reachable = { ok: true, status: aiRes.status, model };
              break;
            } else {
              checks.ai_reachable = { ok: false, status: aiRes.status, model, error: bodyText.slice(0, 300) };
            }
          } catch (e) {
            checks.ai_reachable = { ok: false, model, error: String(e) };
          }
        }
      }

      try {
        const aiStatus = checks.ai_reachable.ok
          ? `✅ Reachable (${checks.ai_reachable.model})`
          : `⚠️ Down — ${checks.ai_reachable.status || ""} ${checks.ai_reachable.error?.slice(0, 100) || ""}`;
        const tRes = await sendTelegramWithButtons(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID,
          `🔧 *Triple-Lock Test — ${new Date().toISOString()}*\n\n${checks.db_topic.ok ? "✅" : "⚠️"} DB Topic: ${checks.db_topic.ok ? checks.db_topic.topic : "None queued"}\n${checks.ai_reachable.ok ? "✅" : "⚠️"} AI Gateway: ${aiStatus}\n✅ Telegram: Connected\n⏰ Schedule: Every 6 hours\n🏷️ Brand Squeeze: Active\n\n_${checks.ai_reachable.ok && checks.db_topic.ok ? "Sovereign Engine is operational." : "Some checks need attention."}_`,
          [[{ text: "🏠 Open Admin", url: "https://businessbotsuk.com/admin" }]]
        );
        checks.telegram_ok = tRes.ok ? { ok: true } : { ok: false, status: tRes.status };
      } catch (e) {
        checks.telegram_ok = { ok: false, error: String(e) };
      }

      return new Response(JSON.stringify({ success: true, checks }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("sovereign-blog-engine error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
