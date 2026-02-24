import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  customerName: string;
  customerEmail: string;
  phone?: string;
  bestTimeToContact: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      customerName, 
      customerEmail, 
      phone, 
      bestTimeToContact,
      message 
    }: ContactEmailRequest = await req.json();

    console.log("Sending contact confirmation to:", customerEmail);

    // Send confirmation to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Business Bots UK <onboarding@resend.dev>",
      to: [customerEmail],
      subject: "We've Received Your Message! - Business Bots UK",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4B5FD1 0%, #3a4db8 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4B5FD1; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">Message Received!</h1>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p>Thank you for reaching out to Business Bots UK! We've received your message and our team will get back to you shortly.</p>
              
              <div class="message-box">
                <h3 style="margin-top: 0; color: #4B5FD1;">Your Message</h3>
                <p style="white-space: pre-wrap;">${message}</p>
                <p style="color: #666; font-size: 14px; margin-bottom: 0;"><strong>Best time to contact:</strong> ${bestTimeToContact}</p>
              </div>
              
              <p>We typically respond within 24 hours. If your matter is urgent, please don't hesitate to call us free on <strong>0800 654 6949</strong>.</p>
              
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
      subject: `New Contact Form: ${customerName}`,
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📬 New Contact Form Submission</h2>
            </div>
            <div class="content">
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
              <div class="detail-row">
                <div class="label">Best Time to Contact</div>
                <strong>${bestTimeToContact}</strong>
              </div>
              <div class="detail-row">
                <div class="label">Message</div>
                <p style="margin: 8px 0 0 0; white-space: pre-wrap;">${message}</p>
              </div>
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
    console.error("Error sending contact confirmation:", error);
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
