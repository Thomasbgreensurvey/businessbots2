import sproutImg from "@/assets/agents/sprout.png";
import lillyImg from "@/assets/agents/lilly.png";
import banjoImg from "@/assets/agents/banjo.png";
import timiImg from "@/assets/agents/timi.png";
import likeImg from "@/assets/agents/like.png";
import tobbyImg from "@/assets/agents/tobby.png";
import nanoImg from "@/assets/agents/nano.png";
import skootImg from "@/assets/agents/skoot.png";

export type GlowColor = "emerald" | "rose" | "indigo" | "cyan" | "amber" | "orange" | "teal" | "fuchsia";

export interface Agent {
  id: string;
  name: string;
  role: string;
  shortRole: string;
  description: string;
  image: string;
  glowColor: GlowColor;
  capabilities: string[];
}

export const agents: Agent[] = [
  {
    id: "sprout",
    name: "Sprout",
    role: "AI Email Marketer",
    shortRole: "Email Marketing",
    description: "Sprout crafts high-converting email campaigns, segments audiences automatically, and nurtures leads while you sleep.",
    image: sproutImg,
    glowColor: "emerald",
    capabilities: [
      "Automated email sequences",
      "A/B testing campaigns",
      "Audience segmentation",
      "Lead nurturing flows",
      "Analytics & reporting"
    ]
  },
  {
    id: "lilly",
    name: "Lilly",
    role: "AI HR Specialist",
    shortRole: "HR Manager",
    description: "Lilly handles onboarding, employee queries, and internal communications with empathy and precision.",
    image: lillyImg,
    glowColor: "rose",
    capabilities: [
      "Employee onboarding",
      "HR policy Q&A",
      "Leave management",
      "Internal announcements",
      "Performance tracking"
    ]
  },
  {
    id: "banjo",
    name: "Banjo",
    role: "Social Media Manager",
    shortRole: "Social Media",
    description: "Banjo creates viral content, schedules posts across all platforms, and engages with your community 24/7.",
    image: banjoImg,
    glowColor: "indigo",
    capabilities: [
      "Content creation",
      "Multi-platform scheduling",
      "Community engagement",
      "Trend monitoring",
      "Analytics dashboard"
    ]
  },
  {
    id: "timi",
    name: "Timi",
    role: "Customer Support AI",
    shortRole: "ChatBot",
    description: "Timi provides instant support, resolving 80% of tickets instantly and escalating complex issues when needed.",
    image: timiImg,
    glowColor: "cyan",
    capabilities: [
      "24/7 instant responses",
      "Multi-language support",
      "Ticket escalation",
      "Knowledge base integration",
      "Customer satisfaction tracking"
    ]
  },
  {
    id: "like",
    name: "Like",
    role: "Lead Generation Expert",
    shortRole: "Lead Gen",
    description: "Like scrapes the web for high-quality prospects and enriches data before it hits your CRM.",
    image: likeImg,
    glowColor: "amber",
    capabilities: [
      "Prospect discovery",
      "Data enrichment",
      "CRM integration",
      "Lead scoring",
      "Contact verification"
    ]
  },
  {
    id: "tobby",
    name: "Tobby",
    role: "Outbound Telesales",
    shortRole: "Outbound Sales",
    description: "Tobby makes hundreds of calls daily with a hyper-realistic voice to set appointments and close deals.",
    image: tobbyImg,
    glowColor: "orange",
    capabilities: [
      "Automated cold calling",
      "Appointment setting",
      "Follow-up sequences",
      "Call recording & analysis",
      "CRM sync"
    ]
  },
  {
    id: "nano",
    name: "Nano",
    role: "Inbound Telesales",
    shortRole: "Inbound Sales",
    description: "Nano answers every incoming call instantly, routing customers or taking orders with zero hold time.",
    image: nanoImg,
    glowColor: "teal",
    capabilities: [
      "Instant call answering",
      "Intelligent routing",
      "Order processing",
      "FAQ handling",
      "Call transcription"
    ]
  },
  {
    id: "skoot",
    name: "Skoot",
    role: "AI Recruiter",
    shortRole: "Recruitment",
    description: "Skoot sources top talent, screens resumes, and conducts initial interviews to find your perfect candidate.",
    image: skootImg,
    glowColor: "fuchsia",
    capabilities: [
      "Candidate sourcing",
      "Resume screening",
      "Interview scheduling",
      "Skill assessment",
      "Talent pipeline management"
    ]
  }
];

export const getAgent = (id: string): Agent | undefined => {
  return agents.find(agent => agent.id === id);
};
