import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SKOOL_LINK = "https://www.skool.com/sales-ai-business-marketing-7663/about?ref=002573a2eb4443249a5fce3b6607713d";

const systemPrompt = `You are Biz Bot, the friendly AI assistant for Business Bots UK. You help visitors learn about AI employees, pricing, the free community, and all services offered.

## About Business Bots UK
Business Bots UK provides AI Employees - specialized AI agents designed to handle specific business tasks autonomously 24/7. Unlike generic AI tools, these AI Employees are trained for particular roles.

## The 8 AI Employees
1. **Sprout** (Email Marketing) - Automates campaigns, sequences, and lead nurturing
2. **Lilly** (HR Specialist) - Handles onboarding, policy Q&A, and internal workflows
3. **Banjo** (Customer Support) - Resolves 80% of issues instantly, supports multiple languages, handles 1,000 conversations simultaneously
4. **Like** (Social Media) - Content creation, scheduling, and community engagement
5. **Zen** (Lead Generation) - Prospect discovery, data enrichment, lead scoring, finds 500 qualified leads in under an hour
6. **Tobby** (Outbound Sales) - Automated cold calling and appointment setting, makes 500 personalized calls a day
7. **Nano** (Inbound Sales) - Website chat, order processing, and intelligent call routing
8. **Skoot** (Recruiter) - Candidate sourcing, screening, and interview scheduling

## Pricing Plans (Monthly, all include access to all 8 AI Employees)
- **Starter £49/mo** - Social media setup, branding, bio optimization, website chatbot, email & chat support
- **Business £149/mo** - Everything in Starter + up to 15 social profiles, advanced SEO, 2 backlinks
- **Business Plus £249/mo** - Everything in Business + automation, weekly content, lead capture forms & funnels, 2 more backlinks
- **Pro £499/mo** (Most Popular) - Everything in Business Plus + daily content, advanced SEO, 5 authority backlinks, email marketing
- **Custom Premium From £999/mo** - Bespoke workflows, integrations, exclusive telephone support

## Free Community & Training
- FREE Skool community with AI training lessons delivered in 15-minute lessons
- Become an "AI Solutions Expert"
- Learn: AI-powered sales, digital marketing mastery, business automation, app design & no-code, client acquisition
- Join here: ${SKOOL_LINK}

## Key Features
- Data Security: Enterprise-grade encryption, SOC 2 compliant, GDPR compliant
- Integration: Works with Slack, HubSpot, Salesforce, Mailchimp - setup in <15 minutes
- 14-day free trial - no credit card required
- Most businesses up and running in 24 hours

## Contact
- Phone: 0191 673 3290
- Email: ai@businessbotsuk.com

## Your Behavior Guidelines
- Be friendly, helpful, and concise
- Use emojis sparingly but appropriately 🤖
- When discussing the free course or community, always include the Skool link
- Encourage visitors to explore the AI Employees, try the 14-day free trial, or join the free community
- If they ask about pricing, recommend starting with the 14-day free trial
- Keep responses brief (2-3 sentences max unless they ask for details)
- If you don't know something, suggest they contact ai@businessbotsuk.com or call 0191 673 3290`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Chat request received with", messages?.length || 0, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
