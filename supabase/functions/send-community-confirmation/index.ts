import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CommunityEmailRequest {
  name: string;
  email: string;
  phone?: string;
}

const SKOOL_LINK = "https://www.skool.com/sales-ai-business-marketing-7663/about?ref=002573a2eb4443249a5fce3b6607713d";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone }: CommunityEmailRequest = await req.json();

    console.log("Sending community confirmation to:", email);

    // Send confirmation to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Business Bots UK <onboarding@resend.dev>",
      to: [email],
      subject: "🎉 Welcome to the AI Learning Community!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4B5FD1 0%, #3B4FC1 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .cta-button { display: inline-block; background: #4B5FD1; color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; margin: 20px 0; }
            .benefit-list { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .benefit-item { padding: 8px 0; border-bottom: 1px solid #eee; }
            .benefit-item:last-child { border-bottom: none; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">Welcome to the Community! 🚀</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>You're in! We're thrilled to have you join our FREE AI Learning Community.</p>
              
              <div class="benefit-list">
                <h3 style="margin-top: 0; color: #4B5FD1;">What You'll Get Access To:</h3>
                <div class="benefit-item">✅ Free AI lessons in 15-minute increments</div>
                <div class="benefit-item">✅ AI-powered sales & marketing strategies</div>
                <div class="benefit-item">✅ No-code app building tutorials</div>
                <div class="benefit-item">✅ Business automation blueprints</div>
                <div class="benefit-item">✅ Direct access to industry experts</div>
              </div>
              
              <p style="text-align: center;">
                <a href="${SKOOL_LINK}" class="cta-button">Join the Community Now →</a>
              </p>
              
              <p>Click the button above to access our Skool community and start your AI journey today!</p>
              
              <p>Questions? Reply to this email or call us at <strong>0191 673 3290</strong>.</p>
              
              <p>Let's transform your future together!</p>
              <p>The Business Bots UK Team</p>
            </div>
            <div class="footer">
              <p>Business Bots UK | ai@businessbotsuk.com | 0191 673 3290</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Send notification to team
    const teamEmailResponse = await resend.emails.send({
      from: "Business Bots UK <onboarding@resend.dev>",
      to: ["ai@businessbotsuk.com"],
      subject: `🎓 New Community Lead: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4B5FD1; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f4f4f4; padding: 20px; border-radius: 0 0 8px 8px; }
            .detail-row { background: white; padding: 12px 16px; margin: 8px 0; border-radius: 6px; }
            .label { color: #666; font-size: 12px; text-transform: uppercase; }
            .source-badge { display: inline-block; background: #4B5FD1; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🎓 New Community Lead</h2>
              <span class="source-badge">Skool Funnel</span>
            </div>
            <div class="content">
              <div class="detail-row">
                <div class="label">Name</div>
                <strong>${name}</strong>
              </div>
              <div class="detail-row">
                <div class="label">Email</div>
                <strong>${email}</strong>
              </div>
              ${phone ? `
              <div class="detail-row">
                <div class="label">Phone</div>
                <strong>${phone}</strong>
              </div>
              ` : ''}
              <p style="margin-top: 16px; color: #666; font-size: 14px;">
                This lead came from the Community page funnel (free AI lessons offer).
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Team notification sent:", teamEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmail: customerEmailResponse,
        teamEmail: teamEmailResponse 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending community confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
