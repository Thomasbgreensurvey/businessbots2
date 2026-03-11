import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Search, Globe, Sparkles, Zap, CheckCircle2,
  BarChart3, TrendingUp, Tag, AlertCircle, Loader2,
  Target, Activity, ArrowUpRight, FileText, Lock, Pencil, Eye
} from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import zenImg from "@/assets/agents/zen-new.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface KeywordResult {
  keyword: string;
  volume: number;
  opportunity: number;
  competition: "Low" | "Medium" | "High";
}

interface ScanResult {
  industry: string;
  seoScore: number;
  summary: string;
  keywordsFound: number;
  opportunitiesFound: number;
  keywords: KeywordResult[];
}

/* ── Official Brand SVG Icons ── */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#26A5E4">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const WordPressIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#21759B">
    <path d="M12.158.001C5.455.001.002 5.455.002 12.158c0 6.703 5.453 12.157 12.156 12.157 6.703 0 12.157-5.454 12.157-12.157C24.315 5.455 18.861.001 12.158.001zM1.89 12.158c0-1.466.313-2.86.875-4.118l4.818 13.2C4.075 19.408 1.89 16.027 1.89 12.158zm10.268 10.378c-1.1 0-2.161-.169-3.16-.482l3.357-9.752 3.439 9.424c.023.056.05.108.077.157a10.24 10.24 0 01-3.713.653zm1.543-15.149c.674-.035 1.28-.105 1.28-.105.603-.07.533-.957-.07-.923 0 0-1.812.142-2.98.142-1.097 0-2.943-.142-2.943-.142-.603-.034-.673.888-.07.923 0 0 .573.07 1.178.105l1.749 4.794-2.457 7.37-4.09-12.164c.674-.035 1.28-.105 1.28-.105.603-.07.533-.957-.07-.923 0 0-1.812.142-2.98.142-.21 0-.457-.005-.716-.014C4.533 3.555 8.1 1.89 12.158 1.89c3.018 0 5.77 1.153 7.833 3.042-.05-.003-.098-.008-.148-.008-1.097 0-1.875.957-1.875 1.984 0 .923.533 1.703 1.098 2.626.426.738.922 1.684.922 3.05 0 .946-.364 2.044-.845 3.573l-1.108 3.702-4.014-11.94z"/>
  </svg>
);

const ShopifyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#96BF48">
    <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.125-.192-.209-.192s-1.723-.125-1.723-.125-.947-.948-1.303-1.303c-.128.042-.274.084-.441.131v.001l-.457.14c-.27-.779-.744-1.496-1.58-1.496-.023 0-.046.001-.069.002C13.81.383 13.392 0 12.895 0c-2.578 0-3.818 3.223-4.203 4.862-.998.31-1.71.53-1.8.558-.531.166-.547.182-.617.681C6.228 6.459 4.682 20.249 4.682 20.249l10.655 3.73zm-2.084-17.48c0 .098 0 .209-.002.328-.616.19-1.29.398-1.968.608.378-1.459 1.089-2.164 1.712-2.429.167.404.258.944.258 1.493zm-1.12-2.596c.112 0 .209.038.298.105-.809.381-1.676 1.34-2.041 3.258l-1.554.481C9.376 5.677 10.363 3.903 12.133 3.903zm.423 8.622s-.659-.354-1.467-.354c-1.187 0-1.246.745-1.246.932 0 1.024 2.668 1.416 2.668 3.816 0 1.888-1.197 3.103-2.812 3.103-1.937 0-2.927-1.205-2.927-1.205l.518-1.713s1.018.875 1.878.875c.562 0 .79-.442.79-.766 0-1.338-2.189-1.397-2.189-3.594 0-1.849 1.326-3.641 4.005-3.641.914 0 1.365.263 1.365.263l-.583 2.284z"/>
  </svg>
);

const WebflowIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#4353FF">
    <path d="M17.802 8.56s-1.946 6.027-2.083 6.467c-.047-.372-1.011-6.467-1.011-6.467s-2.479 0-3.674 0c0 0 1.674 5.463 2.558 8.29-.875 1.855-2.287 3.639-2.287 3.639s2.669.015 3.964.015c0 0 .59-1.276 1.206-2.604 1.282-2.758 2.565-5.53 2.565-5.53l2.96 8.134s2.677 0 3.972 0L24 8.56h-3.674s-1.313 5.993-1.438 6.556c-.109-.533-1.412-6.556-1.412-6.556h-3.674z M6.753 8.342C5.602 8.342 4.56 8.88 3.786 9.76l-.012-.06L4.36 8.56H.748L0 15.5c.732-1.282 2.103-3.024 4.093-3.024.538 0 .846.264.846.69 0 .108-.023.226-.057.348l-.933 3.986h3.638l.997-4.263c.077-.327.112-.647.112-.924.007-2.194-1.31-3.971-1.943-3.971z"/>
  </svg>
);

const initialSocial = [
  { name: "Facebook", icon: FacebookIcon, color: "#1877F2", connected: true },
  { name: "WhatsApp", icon: WhatsAppIcon, color: "#25D366", connected: false },
  { name: "Telegram", icon: TelegramIcon, color: "#26A5E4", connected: false },
];

const initialCms = [
  { name: "WordPress", icon: WordPressIcon, color: "#21759B", connected: true },
  { name: "Shopify", icon: ShopifyIcon, color: "#96BF48", connected: false },
  { name: "Webflow", icon: WebflowIcon, color: "#4353FF", connected: false },
];

const mockBlogs = [
  {
    title: "How AI Chatbots Are Transforming Customer Support in 2025",
    excerpt: "Discover why 78% of businesses now use AI-powered customer service to reduce costs and boost satisfaction rates.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=90",
    seoScore: 96, words: 1450, keywords: 5,
  },
  {
    title: "The Complete Guide to Marketing Automation for Small Businesses",
    excerpt: "Learn how to set up automated email sequences, social media posting, and lead nurturing that works 24/7.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=90",
    seoScore: 92, words: 1280, keywords: 4,
  },
  {
    title: "SEO in 2025: Why Content Quality Beats Keyword Stuffing",
    excerpt: "Google's latest algorithm update rewards depth and expertise. Here's how to adapt your content strategy.",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=90",
    seoScore: 98, words: 1620, keywords: 6,
  },
  {
    title: "5 Ways AI Employees Can Scale Your Agency Without Hiring",
    excerpt: "From content creation to client reporting, AI employees handle repetitive tasks so your team can focus on strategy.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=90",
    seoScore: 94, words: 1350, keywords: 5,
  },
  {
    title: "Local SEO Strategies That Actually Drive Foot Traffic",
    excerpt: "Ranking in the map pack isn't enough. These advanced local tactics convert searchers into customers.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=90",
    seoScore: 91, words: 1180, keywords: 4,
  },
  {
    title: "Why Every Business Needs an AI Content Engine in 2025",
    excerpt: "Stop paying freelancers per article. An automated content pipeline delivers consistent, optimised posts daily.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=90",
    seoScore: 95, words: 1520, keywords: 6,
  },
];

const deepShadow = "shadow-[0_20px_50px_rgba(0,0,0,0.1)]";

/* ── Circular Gauge Component ── */
const SEOGauge = ({ score, size = 160 }: { score: number; size?: number }) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#gaugeGrad)" strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-4xl font-extrabold text-[#0F172A]"
        >
          {score}
        </motion.span>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">SEO Score</span>
      </div>
    </div>
  );
};

/* ── Solid Badge ── */
const SolidBadge = ({ children, color = "blue" }: { children: React.ReactNode; color?: string }) => {
  const colors: Record<string, string> = {
    blue: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
    emerald: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]",
    amber: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
    red: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
    slate: "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

const AutopilotSEO = () => {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "generating" | "complete" | "error">("idle");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState("");
  const [showBlogs, setShowBlogs] = useState(false);
  const [socialChannels, setSocialChannels] = useState(initialSocial);
  const [cmsConnections, setCmsConnections] = useState(initialCms);

  const handleScan = async () => {
    const trimmed = websiteUrl.trim();
    if (!trimmed) { toast.error("Please enter a website URL"); return; }

    setScanState("scanning");
    setScanError("");
    setScanResult(null);
    setShowBlogs(false);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-website", {
        body: { url: trimmed },
      });
      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || "Analysis failed");

      setScanResult(data.data);
      setScanState("generating");
      toast.success("Website analysis complete!");
    } catch (err: any) {
      console.error("Scan error:", err);
      setScanError(err.message || "Something went wrong");
      setScanState("error");
      toast.error("Scan failed", { description: err.message });
    }
  };

  useEffect(() => {
    if (scanState === "generating") {
      const timer = setTimeout(() => {
        setShowBlogs(true);
        setScanState("complete");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [scanState]);

  const getCompColor = (comp: string) => {
    if (comp === "Low") return "emerald";
    if (comp === "Medium") return "amber";
    return "red";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
              className="w-9 h-9 rounded-xl bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#64748B]" />
            </motion.button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center" style={{ boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-[#0F172A] leading-tight">Autopilot SEO</h1>
                <p className="text-[11px] text-[#94A3B8] leading-tight">Powered by Zen AI</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[11px] font-bold text-[#059669]">Engine Active</span>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#BFDBFE] ring-offset-1">
              <OptimizedImage src={zenImg} alt="Zen" className="w-full h-full object-cover" width={32} height={32} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">

        {/* ─── Website Scanner ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl ${deepShadow} p-5 md:p-8`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-base font-bold text-[#0F172A]">Scan Your Website</h2>
          </div>
          <p className="text-sm text-[#64748B] mb-5 ml-9">
            Enter your URL and Zen will crawl your site, analyse your content, and find SEO opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                placeholder="https://yourwebsite.com"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#F8FAFC] border-2 border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6] transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleScan}
              disabled={scanState === "scanning" || scanState === "generating"}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white text-sm font-bold hover:from-[#1D4ED8] hover:to-[#4338CA] transition-all disabled:opacity-60 flex items-center justify-center gap-2 min-w-[160px]"
              style={{ boxShadow: "0 8px 25px rgba(37,99,235,0.35)" }}
            >
              {scanState === "scanning" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analysing...</>
              ) : (
                <><Search className="w-4 h-4" /> Scan Website</>
              )}
            </motion.button>
          </div>

          {/* Scanning animation */}
          <AnimatePresence mode="wait">
            {scanState === "scanning" && (
              <motion.div key="scanning" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6">
                <div className="bg-[#EFF6FF] rounded-xl p-5 border-2 border-[#BFDBFE]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                    <span className="text-sm font-bold text-[#0F172A]">Zen is analysing your website...</span>
                  </div>
                  <div className="space-y-2.5 ml-11">
                    {["Fetching page content", "Extracting SEO signals", "Running AI analysis", "Generating keyword opportunities"].map((step, i) => (
                      <motion.div key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.7 }} className="flex items-center gap-2.5 text-xs text-[#475569] font-medium">
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4 }} className="w-2 h-2 rounded-full bg-[#2563EB]" />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {scanState === "error" && (
              <motion.div key="error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5">
                <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#DC2626] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-[#991B1B]">Scan Failed</p>
                    <p className="text-xs text-[#DC2626] mt-1">{scanError}</p>
                    <button onClick={handleScan} className="mt-2 text-xs font-bold text-[#DC2626] underline hover:no-underline">Try again</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ─── Site Audit Summary ─── */}
        <AnimatePresence>
          {scanResult && (
            <motion.section
              key="audit"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`bg-white rounded-2xl ${deepShadow} p-5 md:p-8`}
            >
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <h2 className="text-base font-bold text-[#0F172A]">Site Audit Summary</h2>
                <SolidBadge color="emerald">Complete</SolidBadge>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
                <div className="shrink-0">
                  <SEOGauge score={scanResult.seoScore} size={160} />
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <p className="text-sm text-[#475569] leading-relaxed">{scanResult.summary}</p>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Industry", value: scanResult.industry, icon: <Globe className="w-3.5 h-3.5" /> },
                      { label: "Keywords Found", value: scanResult.keywordsFound, icon: <Tag className="w-3.5 h-3.5" /> },
                      { label: "Opportunities", value: scanResult.opportunitiesFound, icon: <TrendingUp className="w-3.5 h-3.5" /> },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-xl p-3 border-2 border-[#E2E8F0]">
                        <div className="flex items-center gap-1.5 text-[#94A3B8] mb-1">
                          {stat.icon}
                          <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <p className="text-sm font-extrabold text-[#0F172A]">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Trust Signal */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#FFFBEB] rounded-xl p-4 border-2 border-[#FDE68A]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">
                          We found {scanResult.opportunitiesFound} high-intent keywords your competitors are missing.
                        </p>
                        <p className="text-xs text-[#64748B] mt-1">
                          Zen identified untapped search terms with low competition and high commercial intent.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── SEO Keyword Opportunities ─── */}
        <AnimatePresence>
          {scanResult && scanResult.keywords.length > 0 && (
            <motion.section
              key="keywords"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#9333EA] flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-base font-bold text-[#0F172A]">SEO Opportunity Engine</h2>
                <SolidBadge color="blue">{scanResult.keywords.length} keywords</SolidBadge>
              </div>

              <div className="space-y-3">
                {scanResult.keywords.map((kw, index) => (
                  <motion.div
                    key={kw.keyword}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.08 }}
                    className={`bg-white rounded-xl ${deepShadow} p-4 hover:translate-y-[-2px] transition-all group border-2 border-transparent hover:border-[#3B82F6]`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-3.5 h-3.5 text-[#2563EB]" />
                          <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{kw.keyword}</h3>
                        </div>
                      </div>
                      <SolidBadge color={getCompColor(kw.competition)}>{kw.competition}</SolidBadge>
                    </div>

                    <div className="flex items-center gap-5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-[#94A3B8]" />
                        <span className="text-[#64748B]">Volume:</span>
                        <span className="font-extrabold text-[#0F172A]">{kw.volume.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ArrowUpRight className="w-3 h-3 text-[#10B981]" />
                        <span className="text-[#64748B]">Opportunity:</span>
                        <span className="font-extrabold text-[#059669]">{kw.opportunity}%</span>
                      </div>
                    </div>

                    <div className="mt-3 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${kw.opportunity}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── Generating Content Strategy Animation ─── */}
        <AnimatePresence>
          {scanState === "generating" && (
            <motion.section
              key="generating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`bg-white rounded-2xl ${deepShadow} p-8 md:p-12 text-center`}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center mx-auto mb-5"
                style={{ boxShadow: "0 8px 25px rgba(37,99,235,0.35)" }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Generating your 30-day Content Strategy...</h3>
              <p className="text-sm text-[#64748B] max-w-md mx-auto">
                Zen is crafting optimised blog posts based on your keywords and competitor analysis.
              </p>
              <div className="flex justify-center gap-1.5 mt-5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                    className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── Blog Atlas (Grid) ─── */}
        <AnimatePresence>
          {showBlogs && (
            <motion.section
              key="blogs"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#10B981] to-[#0D9488] flex items-center justify-center">
                    <BarChart3 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-[#0F172A]">Content Atlas</h2>
                  <SolidBadge color="emerald">30-day plan</SolidBadge>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* First 2 visible cards */}
                {mockBlogs.slice(0, 2).map((blog, index) => (
                  <motion.div
                    key={blog.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.1 }}
                    className={`bg-white rounded-2xl ${deepShadow} overflow-hidden group hover:translate-y-[-4px] transition-all duration-300`}
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-[#059669] border-2 border-[#A7F3D0]">
                          <CheckCircle2 className="w-3 h-3" /> {blog.seoScore}%
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0F172A]/80 text-[10px] font-bold text-white">
                          <Eye className="w-3 h-3" /> Live Preview
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <h3 className="text-sm font-bold text-[#0F172A] leading-snug mb-2 line-clamp-2 group-hover:text-[#2563EB] transition-colors">{blog.title}</h3>
                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-4">{blog.excerpt}</p>

                      {/* Stats */}
                      <div className="flex items-center gap-2 mb-4">
                        <SolidBadge color="slate"><FileText className="w-3 h-3" /> {blog.words.toLocaleString()} words</SolidBadge>
                        <SolidBadge color="blue"><Target className="w-3 h-3" /> {blog.keywords} keywords</SolidBadge>
                      </div>

                      {/* Actions */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white text-xs font-bold hover:from-[#1D4ED8] hover:to-[#4338CA] transition-all"
                        style={{ boxShadow: "0 6px 20px rgba(37,99,235,0.3)" }}
                      >
                        Publish Now
                      </motion.button>
                      <button className="w-full mt-2 py-2 text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center justify-center gap-1 transition-colors">
                        <Pencil className="w-3 h-3" /> Edit with Zen AI
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Blurred / Paywalled cards */}
                {mockBlogs.slice(2).map((blog, index) => (
                  <motion.div
                    key={blog.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.08 }}
                    className={`relative bg-white rounded-2xl ${deepShadow} overflow-hidden`}
                  >
                    {/* Frosted background content */}
                    <div className="filter blur-[8px] saturate-150 pointer-events-none select-none">
                      <div className="h-48 overflow-hidden">
                        <img src={blog.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-sm font-bold text-[#0F172A] leading-snug mb-2 line-clamp-2">{blog.title}</h3>
                        <p className="text-xs text-[#64748B] line-clamp-2 mb-3">{blog.excerpt}</p>
                        <div className="flex gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold border border-[#BFDBFE]">{blog.words} words</span>
                          <span className="px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">{blog.seoScore}% SEO</span>
                        </div>
                        <div className="w-full py-3 rounded-xl bg-[#2563EB] text-white text-xs text-center font-bold">Publish Now</div>
                      </div>
                    </div>

                    {/* Lock overlay - Frost effect */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
                      <div className="w-14 h-14 rounded-2xl bg-[#0F172A] flex items-center justify-center mb-3" style={{ boxShadow: "0 8px 25px rgba(15,23,42,0.3)" }}>
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-bold text-[#0F172A] mb-1">Unlock Full Content Engine</p>
                      <p className="text-xs text-[#64748B] mb-4">£199/mo • 1 blog post every 24hrs</p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate("/get-started")}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4338CA] text-white text-[12px] font-bold"
                        style={{ boxShadow: "0 8px 25px rgba(37,99,235,0.4)" }}
                      >
                        Start Free Trial
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── Social Distribution Channels ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`bg-white rounded-2xl ${deepShadow} p-5 md:p-8`}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#EC4899] to-[#F43F5E] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-base font-bold text-[#0F172A]">Social Distribution</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {socialChannels.map((ch) => {
              const Icon = ch.icon;
              return (
                <div
                  key={ch.name}
                  className={`rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${
                    ch.connected
                      ? `bg-white border-[${ch.color}]/30`
                      : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                  style={ch.connected ? { borderColor: ch.color + "50", boxShadow: `0 8px 30px ${ch.color}15` } : {}}
                >
                  <Icon />
                  <span className="text-xs font-bold text-[#0F172A]">{ch.name}</span>
                  {/* iOS toggle */}
                  <button
                    className={`relative w-12 h-[26px] rounded-full transition-colors ${
                      ch.connected ? "" : "bg-[#E2E8F0]"
                    }`}
                    style={ch.connected ? { backgroundColor: ch.color } : {}}
                  >
                    <motion.div
                      className="absolute top-[3px] w-5 h-5 rounded-full bg-white"
                      style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
                      animate={{ left: ch.connected ? 24 : 3 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ─── CMS Auto-Publish Connections ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-white rounded-2xl ${deepShadow} p-5 md:p-8`}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#9333EA] flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-base font-bold text-[#0F172A]">CMS Auto-Publish</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {cmsConnections.map((cms) => {
              const Icon = cms.icon;
              return (
                <div
                  key={cms.name}
                  className={`rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${
                    cms.connected
                      ? "bg-white"
                      : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                  style={cms.connected ? { borderColor: cms.color + "50", boxShadow: `0 8px 30px ${cms.color}15` } : {}}
                >
                  <Icon />
                  <span className="text-xs font-bold text-[#0F172A]">{cms.name}</span>
                  {/* iOS toggle */}
                  <button
                    className={`relative w-12 h-[26px] rounded-full transition-colors ${
                      cms.connected ? "" : "bg-[#E2E8F0]"
                    }`}
                    style={cms.connected ? { backgroundColor: cms.color } : {}}
                  >
                    <motion.div
                      className="absolute top-[3px] w-5 h-5 rounded-full bg-white"
                      style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
                      animate={{ left: cms.connected ? 24 : 3 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ─── Pricing CTA ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0F172A] rounded-2xl p-6 md:p-10 text-center relative overflow-hidden"
          style={{ boxShadow: "0 25px 60px rgba(15,23,42,0.4)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(37,99,235,0.15),transparent_60%)]" />
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2">Ready to automate your SEO?</h3>
            <p className="text-[#94A3B8] text-sm mb-6 max-w-md mx-auto">
              1 fully optimised blog post every 24 hours. AI-generated images, keyword targeting, and auto-publishing included.
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-white">£199</span>
                <span className="text-[#64748B] text-sm font-semibold">/month</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/get-started")}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4338CA] text-white text-sm font-bold hover:from-[#1D4ED8] hover:to-[#3730A3] transition-all"
                style={{ boxShadow: "0 10px 35px rgba(37,99,235,0.5)" }}
              >
                Start Free Trial
              </motion.button>
            </div>
          </div>
        </motion.section>

        <div className="h-8" />
      </main>
    </div>
  );
};

export default AutopilotSEO;
