const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const sbHeaders = {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    // 1. Fetch all paid users
    const profilesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?is_paid=eq.true&select=id,email,full_name`,
      { headers: sbHeaders }
    );
    const paidUsers = await profilesRes.json();

    if (!Array.isArray(paidUsers) || paidUsers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No paid users found. Engine idle.", processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: Array<{ user_id: string; email: string; status: string; error?: string }> = [];

    // 2. Loop through each paid user
    for (const user of paidUsers) {
      try {
        // Generate blog content via the existing sovereign-blog-engine
        const genRes = await fetch(`${SUPABASE_URL}/functions/v1/sovereign-blog-engine`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "generate" }),
        });

        if (!genRes.ok) {
          const errText = await genRes.text();
          throw new Error(`Blog generation failed: ${errText.slice(0, 200)}`);
        }

        const genData = await genRes.json();
        const postId = genData?.post_id;

        // 3. Check oauth_connections for this user
        const connRes = await fetch(
          `${SUPABASE_URL}/rest/v1/oauth_connections?user_id=eq.${user.id}&is_active=eq.true&select=provider,access_token,refresh_token,page_id,page_name,location_id,location_name,token_expires_at`,
          { headers: sbHeaders }
        );
        const connections = await connRes.json();

        if (Array.isArray(connections)) {
          for (const conn of connections) {
            try {
              if (conn.provider === "facebook" && conn.access_token && conn.page_id) {
                await publishToFacebook(conn, postId, SUPABASE_URL, sbHeaders);
              } else if (conn.provider === "google_business" && conn.access_token && conn.location_id) {
                await publishToGoogle(conn, postId, SUPABASE_URL, sbHeaders);
              }
            } catch (pubErr) {
              console.error(`Publishing error for user ${user.id}, provider ${conn.provider}:`, pubErr);
              // Don't break the loop — continue with other connections/users
            }
          }
        }

        results.push({ user_id: user.id, email: user.email || "unknown", status: "success" });
      } catch (userErr: any) {
        console.error(`Error processing user ${user.id}:`, userErr);
        results.push({
          user_id: user.id,
          email: user.email || "unknown",
          status: "error",
          error: userErr.message?.slice(0, 200),
        });
        // Continue to next user — don't break the loop
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Daily SEO Engine fatal error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ─── Facebook Publishing Helper ───
async function publishToFacebook(
  conn: any,
  postId: string,
  supabaseUrl: string,
  sbHeaders: Record<string, string>
) {
  // Fetch the blog post content
  const postRes = await fetch(
    `${supabaseUrl}/rest/v1/blog_posts?id=eq.${postId}&select=title,slug,excerpt`,
    { headers: sbHeaders }
  );
  const posts = await postRes.json();
  const post = posts?.[0];
  if (!post) return;

  const postUrl = `https://businessbotsuk.com/blog/${post.slug}`;
  const message = `📰 ${post.title}\n\n${post.excerpt || ""}\n\n🔗 Read more: ${postUrl}\n\n🤖 Powered by Business Bots UK - AI solutions for businesses`;

  const fbRes = await fetch(
    `https://graph.facebook.com/v19.0/${conn.page_id}/feed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        link: postUrl,
        access_token: conn.access_token,
      }),
    }
  );

  if (!fbRes.ok) {
    const fbErr = await fbRes.text();
    throw new Error(`Facebook API error: ${fbErr.slice(0, 200)}`);
  }

  console.log(`✅ Published to Facebook page ${conn.page_name} for post ${postId}`);
}

// ─── Google Business Publishing Helper ───
async function publishToGoogle(
  conn: any,
  postId: string,
  supabaseUrl: string,
  sbHeaders: Record<string, string>
) {
  // Check if token is expired and refresh if needed
  let accessToken = conn.access_token;
  if (conn.token_expires_at) {
    const expiresAt = new Date(conn.token_expires_at);
    if (expiresAt <= new Date()) {
      // Token expired — refresh it
      if (!conn.refresh_token) {
        throw new Error("Google token expired and no refresh token available");
      }

      const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
      const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");

      if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        throw new Error("Google OAuth credentials not configured");
      }

      const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          refresh_token: conn.refresh_token,
          grant_type: "refresh_token",
        }),
      });

      if (!refreshRes.ok) {
        throw new Error(`Google token refresh failed: ${(await refreshRes.text()).slice(0, 200)}`);
      }

      const refreshData = await refreshRes.json();
      accessToken = refreshData.access_token;

      // Update stored token
      const newExpiry = new Date(Date.now() + (refreshData.expires_in || 3600) * 1000).toISOString();
      await fetch(
        `${supabaseUrl}/rest/v1/oauth_connections?id=eq.${conn.id}`,
        {
          method: "PATCH",
          headers: sbHeaders,
          body: JSON.stringify({
            access_token: accessToken,
            token_expires_at: newExpiry,
          }),
        }
      );
    }
  }

  // Fetch the blog post
  const postRes = await fetch(
    `${supabaseUrl}/rest/v1/blog_posts?id=eq.${postId}&select=title,slug,excerpt`,
    { headers: sbHeaders }
  );
  const posts = await postRes.json();
  const post = posts?.[0];
  if (!post) return;

  const postUrl = `https://businessbotsuk.com/blog/${post.slug}`;

  // Post to Google Business Profile
  const gbpRes = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/me/locations/${conn.location_id}/localPosts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        languageCode: "en-GB",
        summary: `${post.title}\n\n${post.excerpt || ""}\n\nRead more at BusinessBotsUK.com`,
        callToAction: {
          actionType: "LEARN_MORE",
          url: postUrl,
        },
        topicType: "STANDARD",
      }),
    }
  );

  if (!gbpRes.ok) {
    const gbpErr = await gbpRes.text();
    throw new Error(`Google Business API error: ${gbpErr.slice(0, 200)}`);
  }

  console.log(`✅ Published to Google Business ${conn.location_name} for post ${postId}`);
}
