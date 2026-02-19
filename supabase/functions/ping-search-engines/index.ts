import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SignJWT, importPKCS8 } from "npm:jose@5.2.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_URL = "https://businessbotsuk.lovable.app";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_KEY = "businessbotsuk2024key";

async function getGoogleAccessToken(): Promise<string> {
  const credsJson = Deno.env.get("GOOGLE_INDEXING_CREDENTIALS");
  if (!credsJson) throw new Error("GOOGLE_INDEXING_CREDENTIALS secret not set");

  const creds = JSON.parse(credsJson);
  const privateKey = await importPKCS8(creds.private_key, "RS256");

  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .sign(privateKey);

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`Google OAuth failed: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

async function notifyGoogleIndexing(accessToken: string, url: string): Promise<{ status: number; body: any }> {
  const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });
  const body = await res.json();
  return { status: res.status, body };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, urls } = await req.json();
    const results: { engine: string; status: number; url: string; response?: any }[] = [];

    if (action === "ping_sitemap") {
      // Google Indexing API v3 — VIP notification
      try {
        const accessToken = await getGoogleAccessToken();
        const mainUrl = SITE_URL + "/";
        const googleResult = await notifyGoogleIndexing(accessToken, mainUrl);
        results.push({
          engine: "Google",
          status: googleResult.status,
          url: mainUrl,
          response: googleResult.body,
        });
      } catch (googleErr: any) {
        results.push({
          engine: "Google",
          status: 500,
          url: SITE_URL,
          response: { error: googleErr.message },
        });
      }

      // Bing sitemap ping
      const bingRes = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`);
      await bingRes.text();
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
      await indexNowRes.text();
      results.push({ engine: "IndexNow", status: indexNowRes.status, url: urls.join(", ") });
    }

    if (action === "google_index_urls" && urls?.length) {
      // Batch Google Indexing API for specific URLs
      try {
        const accessToken = await getGoogleAccessToken();
        for (const u of urls) {
          const fullUrl = u.startsWith("http") ? u : `${SITE_URL}${u}`;
          const result = await notifyGoogleIndexing(accessToken, fullUrl);
          results.push({
            engine: "Google",
            status: result.status,
            url: fullUrl,
            response: result.body,
          });
        }
      } catch (googleErr: any) {
        results.push({
          engine: "Google",
          status: 500,
          url: "batch",
          response: { error: googleErr.message },
        });
      }
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
