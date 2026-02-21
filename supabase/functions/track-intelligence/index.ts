import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://businessbotsuk.com",
  "https://www.businessbotsuk.com",
  "https://businessbotsuk.lovable.app",
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const events = await req.json();
    if (!Array.isArray(events) || events.length === 0) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const rows = events.map((evt: any) => ({
      action: evt.action || "page_view",
      entity_type: "visitor",
      entity_id: evt.page || "/",
      details: {
        sessionId: evt.sid,
        referrer: evt.ref,
        userAgent: evt.ua,
        screen: evt.screen,
        timestamp: evt.ts,
        duration: evt.dur,
        geo: evt.geo,
      },
    }));

    await supabase.from("audit_logs").insert(rows);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
