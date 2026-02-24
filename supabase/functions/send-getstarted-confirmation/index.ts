import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GetStartedEmailRequest {
  customerName: string;
  customerEmail: string;
  phone?: string;
  company?: string;
  planInterest: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      customerName, 
      customerEmail, 
      phone, 
      company,
      planInterest,
      message 
    }: GetStartedEmailRequest = await req.json();

    console.log("Sending get-started confirmation to:", customerEmail);

    // Send confirmation to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Business Bots UK <onboarding@resend.dev>",
      to: [customerEmail],
      subject: "Welcome to Business Bots UK! - Let's Get You Set Up",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .plan-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9333ea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">Welcome to Business Bots UK!</h1>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p>Thank you for your interest in Business Bots UK! We're excited to help you get started with AI-powered automation for your business.</p>
              
              <div class="plan-box">
                <h3 style="margin-top: 0; color: #9333ea;">Your Interest</h3>
                <p><strong>Plan:</strong> ${planInterest}</p>
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                ${message ? `<p><strong>Additional notes:</strong> ${message}</p>` : ''}
              </div>
              
              <p>Our team will be in touch within 24 hours to discuss your needs and get you set up with the perfect solution.</p>
              
              <p>If you have any questions in the meantime, feel free to call us free on <strong>0800 654 6949</strong>.</p>
              
              <p>Best regards,<br>The Business Bots UK Team</p>
            </div>
            <div class="footer">
              <p>Business Bots UK | ai@businessbotsuk.com | 0800 654 6949</p>
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
      subject: `🚀 New Get Started Request: ${customerName} - ${planInterest}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f4f4f4; padding: 20px; border-radius: 0 0 8px 8px; }
            .detail-row { background: white; padding: 12px 16px; margin: 8px 0; border-radius: 6px; }
            .label { color: #666; font-size: 12px; text-transform: uppercase; }
            .highlight { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 12px 16px; margin: 8px 0; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🚀 New Get Started Request</h2>
            </div>
            <div class="content">
              <div class="highlight">
                <div class="label" style="color: rgba(255,255,255,0.7);">Plan Interest</div>
                <strong style="font-size: 18px;">${planInterest}</strong>
              </div>
              <div class="detail-row">
                <div class="label">Name</div>
                <strong>${customerName}</strong>
              </div>
              <div class="detail-row">
                <div class="label">Email</div>
                <strong>${customerEmail}</strong>
              </div>
              ${phone ? `
              <div class="detail-row">
                <div class="label">Phone</div>
                <strong>${phone}</strong>
              </div>
              ` : ''}
              ${company ? `
              <div class="detail-row">
                <div class="label">Company</div>
                <strong>${company}</strong>
              </div>
              ` : ''}
              ${message ? `
              <div class="detail-row">
                <div class="label">Additional Message</div>
                <p style="margin: 8px 0 0 0; white-space: pre-wrap;">${message}</p>
              </div>
              ` : ''}
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
    console.error("Error sending get-started confirmation:", error);
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