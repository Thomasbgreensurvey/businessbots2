import sproutImg from "@/assets/agents/sprout-new.png";
import lillyImg from "@/assets/agents/lilly.png";
import banjoImg from "@/assets/agents/banjo-new.png";
import likeImg from "@/assets/agents/like-new.png";
import zenImg from "@/assets/agents/zen-new.png";
import tobbyImg from "@/assets/agents/tobby-new.png";
import nanoImg from "@/assets/agents/nano-new.png";
import skootImg from "@/assets/agents/skoot-new.png";

export type GlowColor = "emerald" | "rose" | "indigo" | "cyan" | "amber" | "orange" | "teal" | "fuchsia";

export interface Agent {
  id: string;
  name: string;
  role: string;
  shortRole: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  description: string;
  extendedDescription: string;
  image: string;
  glowColor: GlowColor;
  capabilities: string[];
  useCases: string[];
  expertise: string[];
  surprisingFact: string;
  hiddenTalent: string;
  hobbies: string[];
}

export const agents: Agent[] = [
  {
    id: "sprout",
    name: "Sprout",
    role: "AI Email Marketer",
    shortRole: "Email Marketing",
    tagline: "Your Email Growth Partner on AI",
    heroHeadline: "Turn Every Email Into Revenue",
    heroSubtext: "AI-powered campaigns that convert subscribers into customers while you focus on growing your business.",
    description: "Helps create email campaigns, automation flows, newsletters, and follow-up sequences.",
    extendedDescription: "Meet Sprout. The AI-powered email marketer that transforms your inbox into a revenue machine. Trained on thousands of successful campaigns, Sprout optimizes your email strategy from subject lines to send times. Traditional marketers spend hours crafting emails, but Sprout delivers personalized campaigns in seconds.",
    image: sproutImg,
    glowColor: "emerald",
    capabilities: [
      "Automated email sequences",
      "A/B testing campaigns",
      "Audience segmentation",
      "Lead nurturing flows",
      "Analytics & reporting"
    ],
    useCases: [
      "Sprout, write a welcome email sequence for new subscribers.",
      "Sprout, create a re-engagement campaign for inactive users.",
      "Sprout, design a product launch email series.",
      "Sprout, segment my audience by engagement level."
    ],
    expertise: ["Email Automation", "Copywriting", "A/B Testing", "Segmentation", "Analytics"],
    surprisingFact: "Can write 50 unique subject lines in under 30 seconds.",
    hiddenTalent: "Predicting the perfect send time for maximum open rates using behavioral analysis.",
    hobbies: ["📧 Crafting perfect subject lines", "📊 Analyzing open rates", "🎯 Segmenting audiences", "💡 Testing new ideas"]
  },
  {
    id: "lilly",
    name: "Lilly",
    role: "AI HR Specialist",
    shortRole: "HR Manager",
    tagline: "Your People Partner on AI",
    heroHeadline: "Your Team Deserves Better HR",
    heroSubtext: "Instant answers, seamless onboarding, and happier employees. Let AI handle the admin while you build culture.",
    description: "Assists with internal workflows, process automation, and operational support tasks.",
    extendedDescription: "Meet Lilly. The AI-powered HR specialist that transforms employee experience. Trained on best HR practices, Lilly manages everything from onboarding to policy questions with care. Traditional HR tasks take hours, but Lilly handles them instantly while maintaining the human touch.",
    image: lillyImg,
    glowColor: "rose",
    capabilities: [
      "Employee onboarding",
      "HR policy Q&A",
      "Leave management",
      "Internal announcements",
      "Performance tracking"
    ],
    useCases: [
      "Lilly, create an onboarding checklist for new hires.",
      "Lilly, draft a company-wide announcement about the new policy.",
      "Lilly, help me understand our vacation policy.",
      "Lilly, prepare performance review templates."
    ],
    expertise: ["Onboarding", "Policy Management", "Employee Relations", "Compliance", "Culture Building"],
    surprisingFact: "Can onboard 100 employees simultaneously without missing a single detail.",
    hiddenTalent: "Remembering every employee's work anniversary and sending personalized messages.",
    hobbies: ["👥 Building team culture", "📋 Organizing onboarding", "💬 Answering HR questions", "🎉 Celebrating milestones"]
  },
  {
    id: "banjo",
    name: "Banjo",
    role: "Customer Support AI",
    shortRole: "Support",
    tagline: "Your Customer Hero on AI",
    heroHeadline: "Happy Customers, Zero Wait Time",
    heroSubtext: "Instant support that resolves 80% of issues on the spot. Turn complaints into compliments automatically.",
    description: "Helps automate customer support responses, FAQs, and enquiry handling.",
    extendedDescription: "Meet Banjo. The AI-powered support agent that turns frustrated customers into loyal fans. Trained on millions of support interactions, Banjo resolves issues instantly with patience and accuracy. Traditional support means long wait times, but Banjo responds in seconds.",
    image: banjoImg,
    glowColor: "indigo",
    capabilities: [
      "24/7 instant responses",
      "Multi-language support",
      "Ticket escalation",
      "Knowledge base integration",
      "Customer satisfaction tracking"
    ],
    useCases: [
      "Banjo, help this customer track their order.",
      "Banjo, explain our refund policy clearly.",
      "Banjo, escalate this complex issue to the team.",
      "Banjo, update our FAQ with common questions."
    ],
    expertise: ["Customer Care", "Problem Solving", "Multi-language", "Ticket Management", "Knowledge Base"],
    surprisingFact: "Can handle 1,000 conversations simultaneously without breaking a sweat.",
    hiddenTalent: "Turning angry customers into 5-star reviewers with patience and empathy.",
    hobbies: ["💬 Chatting with customers", "🔍 Finding solutions", "📚 Learning products", "⭐ Collecting happy reviews"]
  },
  {
    id: "like",
    name: "Like",
    role: "Social Media Manager",
    shortRole: "Social Media",
    tagline: "Your Social Growth Partner on AI",
    heroHeadline: "Go Viral Without The Grind",
    heroSubtext: "Content that stops the scroll, grows your following, and turns engagement into sales. 24/7 social presence made easy.",
    description: "Assists with social media profile setup, optimisation, content creation, and scheduling to support a consistent and professional online presence.",
    extendedDescription: "Meet Like. The AI-powered social media manager that makes your brand unforgettable. Trained on viral content patterns, Like creates scroll-stopping posts and manages your community around the clock. Traditional social media management takes teams, but Like handles it all solo.",
    image: likeImg,
    glowColor: "cyan",
    capabilities: [
      "Content creation",
      "Multi-platform scheduling",
      "Community engagement",
      "Trend monitoring",
      "Analytics dashboard"
    ],
    useCases: [
      "Like, create a week's worth of Instagram posts.",
      "Like, write engaging captions for our product photos.",
      "Like, respond to comments on our latest post.",
      "Like, find trending hashtags in our niche."
    ],
    expertise: ["Content Strategy", "Community Management", "Trend Analysis", "Copywriting", "Visual Planning"],
    surprisingFact: "Has analyzed over 1 million viral posts to understand what makes content spread.",
    hiddenTalent: "Predicting which content will go viral before it's posted.",
    hobbies: ["📱 Scrolling trends", "✍️ Writing captions", "🎨 Planning feeds", "💬 Engaging followers"]
  },
  {
    id: "zen",
    name: "Zen SEO",
    role: "Autopilot SEO Expert",
    shortRole: "SEO",
    tagline: "Your SEO Engine on Autopilot",
    heroHeadline: "Automate Your SEO Growth",
    heroSubtext: "1 fully optimised blog post every 24 hours. AI-powered keyword targeting, content creation, and auto-publishing.",
    description: "AI-powered SEO automation that scans your website, identifies keyword opportunities, and generates optimised content daily.",
    extendedDescription: "Meet Zen SEO. The AI-powered SEO engine that puts your content strategy on autopilot. Zen SEO scans your website, analyses competitors, and generates fully optimised blog posts every 24 hours — complete with AI images and keyword targeting. Traditional SEO takes months, but Zen SEO delivers results in days.",
    image: zenImg,
    glowColor: "amber",
    capabilities: [
      "Website SEO scanning",
      "Keyword opportunity detection",
      "AI blog generation",
      "Auto-publishing to CMS",
      "Competitor analysis"
    ],
    useCases: [
      "Zen SEO, scan my website for SEO opportunities.",
      "Zen SEO, generate a blog post targeting these keywords.",
      "Zen SEO, publish today's optimised article to WordPress.",
      "Zen SEO, show me my 30-day content strategy."
    ],
    expertise: ["SEO Strategy", "Content Generation", "Keyword Research", "Auto-Publishing", "Site Auditing"],
    surprisingFact: "Can generate and publish a fully optimised 1,500-word blog post in under 3 minutes.",
    hiddenTalent: "Finding high-intent keywords that competitors haven't targeted yet.",
    hobbies: ["🔍 Scanning websites", "📝 Writing blogs", "📊 Tracking rankings", "🚀 Publishing content"]
  },
  {
    id: "tobby",
    name: "Tobby",
    role: "Outbound Telesales",
    shortRole: "Outbound Sales",
    tagline: "Your Sales Partner on AI",
    heroHeadline: "Book More Meetings, Close More Deals",
    heroSubtext: "500 personalised calls a day with zero burnout. Your tireless sales machine that never stops closing.",
    description: "Assists with outbound messaging, follow-ups, and sales pipeline organisation.",
    extendedDescription: "Meet Tobby. The AI-powered sales rep that never stops dialing. Trained on winning sales scripts, Tobby makes personalized calls that book meetings. Traditional cold calling burns out reps, but Tobby stays energetic call after call.",
    image: tobbyImg,
    glowColor: "orange",
    capabilities: [
      "Automated cold calling",
      "Appointment setting",
      "Follow-up sequences",
      "Call recording & analysis",
      "CRM sync"
    ],
    useCases: [
      "Tobby, call this list of 100 prospects today.",
      "Tobby, follow up with leads who showed interest.",
      "Tobby, book a demo for tomorrow afternoon.",
      "Tobby, analyze why calls aren't converting."
    ],
    expertise: ["Cold Calling", "Appointment Setting", "Objection Handling", "Follow-ups", "Sales Analysis"],
    surprisingFact: "Can make 500 personalized calls in a single day without fatigue.",
    hiddenTalent: "Adapting tone and pitch based on the prospect's communication style in real-time.",
    hobbies: ["📞 Making calls", "📅 Booking meetings", "🎯 Hitting quotas", "📈 Crushing targets"]
  },
  {
    id: "nano",
    name: "Nano",
    role: "Inbound Telesales",
    shortRole: "Inbound Sales",
    tagline: "Your Revenue Partner on AI",
    heroHeadline: "Never Miss Another Sales Call",
    heroSubtext: "Instant answers, perfect routing, and orders processed 24/7. Every call becomes a conversion opportunity.",
    description: "Supports website chat conversations, lead qualification, and booking hand-offs through AI chatbots.",
    extendedDescription: "Meet Nano. The AI-powered inbound specialist that never misses a call. Trained on customer service excellence, Nano handles inquiries, takes orders, and routes calls perfectly. Traditional call centers mean hold times, but Nano answers instantly.",
    image: nanoImg,
    glowColor: "teal",
    capabilities: [
      "Instant call answering",
      "Intelligent routing",
      "Order processing",
      "FAQ handling",
      "Call transcription"
    ],
    useCases: [
      "Nano, answer all incoming calls today.",
      "Nano, process this phone order.",
      "Nano, route this call to the right department.",
      "Nano, transcribe today's important calls."
    ],
    expertise: ["Call Handling", "Order Processing", "Call Routing", "Transcription", "Customer Service"],
    surprisingFact: "Can handle 200 simultaneous calls with zero wait time.",
    hiddenTalent: "Understanding caller intent within the first 3 seconds of conversation.",
    hobbies: ["📱 Answering calls", "🛒 Processing orders", "🔀 Routing perfectly", "📝 Taking notes"]
  },
  {
    id: "skoot",
    name: "Skoot",
    role: "AI Recruiter",
    shortRole: "Recruitment",
    tagline: "Your Recruitment Partner on AI",
    heroHeadline: "Hire Top Talent 10x Faster",
    heroSubtext: "From sourcing to screening to scheduling. Your AI recruiter finds perfect matches while you focus on interviews that matter.",
    description: "Supports recruitment funnels, candidate screening workflows, and hiring automation.",
    extendedDescription: "Meet Skoot. The AI-powered recruiter that transforms hiring challenges into opportunities. Trained on thousands of best HR practices, Skoot optimizes your recruitment process from outreach to onboarding. Traditional recruiters spend hours on repetitive tasks, but Skoot handles them in minutes.",
    image: skootImg,
    glowColor: "fuchsia",
    capabilities: [
      "Candidate sourcing",
      "Resume screening",
      "Interview scheduling",
      "Skill assessment",
      "Talent pipeline management"
    ],
    useCases: [
      "Skoot, write a job description for a senior developer.",
      "Skoot, screen the resumes we received.",
      "Skoot, create a personalized outreach for LinkedIn.",
      "Skoot, craft a concise interview plan."
    ],
    expertise: ["Talent Acquisition", "Resume Screening", "Job Descriptions", "Interview Coordination", "Onboarding"],
    surprisingFact: "Can review 100 resumes in under 10 minutes.",
    hiddenTalent: "Finding the perfect match in a haystack of candidates using pattern recognition.",
    hobbies: ["🌐 Networking with talent", "📝 Crafting job posts", "📅 Organizing interviews", "🎉 Welcoming new hires"]
  }
];

export const getAgent = (id: string): Agent | undefined => {
  return agents.find(agent => agent.id === id);
};

// Preload all agent images on app start for instant loading
export const preloadAgentImages = () => {
  agents.forEach(agent => {
    const img = new Image();
    img.src = agent.image;
  });
};
