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

const cmsConnections = [
  { name: "WordPress", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg", connected: true },
  { name: "Shopify", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/shopify.svg", connected: false },
  { name: "Webflow", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/webflow.svg", connected: false },
  { name: "Wix", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/wix.svg", connected: false },
];

const mockBlogs = [
  {
    title: "How AI Chatbots Are Transforming Customer Support in 2025",
    excerpt: "Discover why 78% of businesses now use AI-powered customer service to reduce costs and boost satisfaction rates.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    seoScore: 96, words: 1450, keywords: 5,
  },
  {
    title: "The Complete Guide to Marketing Automation for Small Businesses",
    excerpt: "Learn how to set up automated email sequences, social media posting, and lead nurturing that works 24/7.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    seoScore: 92, words: 1280, keywords: 4,
  },
  {
    title: "SEO in 2025: Why Content Quality Beats Keyword Stuffing",
    excerpt: "Google's latest algorithm update rewards depth and expertise. Here's how to adapt your content strategy.",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80",
    seoScore: 98, words: 1620, keywords: 6,
  },
  {
    title: "5 Ways AI Employees Can Scale Your Agency Without Hiring",
    excerpt: "From content creation to client reporting, AI employees handle repetitive tasks so your team can focus on strategy.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    seoScore: 94, words: 1350, keywords: 5,
  },
  {
    title: "Local SEO Strategies That Actually Drive Foot Traffic",
    excerpt: "Ranking in the map pack isn't enough. These advanced local tactics convert searchers into customers.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
    seoScore: 91, words: 1180, keywords: 4,
  },
  {
    title: "Why Every Business Needs an AI Content Engine in 2025",
    excerpt: "Stop paying freelancers per article. An automated content pipeline delivers consistent, optimised posts daily.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
    seoScore: 95, words: 1520, keywords: 6,
  },
];

/* ── Circular Gauge Component ── */
const SEOGauge = ({ score, size = 140 }: { score: number; size?: number }) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const bgColor = score >= 80 ? "rgba(16,185,129,0.08)" : score >= 60 ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill={bgColor} stroke="rgba(0,0,0,0.04)" strokeWidth={8} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
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
          className="text-3xl font-extrabold"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">SEO Score</span>
      </div>
    </div>
  );
};

/* ── Glassmorphism Badge ── */
const GlassBadge = ({ children, color = "blue" }: { children: React.ReactNode; color?: string }) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-700 border-blue-200/50",
    emerald: "bg-emerald-500/10 text-emerald-700 border-emerald-200/50",
    amber: "bg-amber-500/10 text-amber-700 border-amber-200/50",
    red: "bg-red-500/10 text-red-700 border-red-200/50",
    slate: "bg-slate-500/10 text-slate-600 border-slate-200/50",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

const premiumShadow = "shadow-[0_8px_30px_rgb(0,0,0,0.04),0_15px_40px_rgb(0,0,0,0.02)]";

const AutopilotSEO = () => {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "generating" | "complete" | "error">("idle");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState("");
  const [showBlogs, setShowBlogs] = useState(false);

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

  // After scan completes, show "generating content strategy" then reveal blogs
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
    <div className="min-h-screen bg-[#f8f9fb]" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
              className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
            </motion.button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 leading-tight">Autopilot SEO</h1>
                <p className="text-[11px] text-slate-400 leading-tight">Powered by Zen AI</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-200/50 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-700">Engine Active</span>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-blue-100 ring-offset-1">
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
          className={`bg-white rounded-2xl ${premiumShadow} border border-slate-100 p-5 md:p-8`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Scan Your Website</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5 ml-9">
            Enter your URL and Zen will crawl your site, analyse your content, and find SEO opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                placeholder="https://yourwebsite.com"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleScan}
              disabled={scanState === "scanning" || scanState === "generating"}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 min-w-[160px] shadow-lg shadow-blue-500/20"
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">Zen is analysing your website...</span>
                  </div>
                  <div className="space-y-2.5 ml-11">
                    {["Fetching page content", "Extracting SEO signals", "Running AI analysis", "Generating keyword opportunities"].map((step, i) => (
                      <motion.div key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.7 }} className="flex items-center gap-2.5 text-xs text-slate-600">
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4 }} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {scanState === "error" && (
              <motion.div key="error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5">
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Scan Failed</p>
                    <p className="text-xs text-red-600 mt-1">{scanError}</p>
                    <button onClick={handleScan} className="mt-2 text-xs font-medium text-red-700 underline hover:no-underline">Try again</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ─── Site Audit Summary (after scan) ─── */}
        <AnimatePresence>
          {scanResult && (
            <motion.section
              key="audit"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`bg-white rounded-2xl ${premiumShadow} border border-slate-100 p-5 md:p-8`}
            >
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h2 className="text-base font-bold text-slate-900">Site Audit Summary</h2>
                <GlassBadge color="emerald">Complete</GlassBadge>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
                {/* Circular Gauge */}
                <div className="shrink-0">
                  <SEOGauge score={scanResult.seoScore} size={150} />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4 w-full">
                  <p className="text-sm text-slate-600 leading-relaxed">{scanResult.summary}</p>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Industry", value: scanResult.industry, icon: <Globe className="w-3.5 h-3.5" /> },
                      { label: "Keywords Found", value: scanResult.keywordsFound, icon: <Tag className="w-3.5 h-3.5" /> },
                      { label: "Opportunities", value: scanResult.opportunitiesFound, icon: <TrendingUp className="w-3.5 h-3.5" /> },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          {stat.icon}
                          <span className="text-[10px] font-medium uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Trust Signal */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100/60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          We found {scanResult.opportunitiesFound} high-intent keywords your competitors are missing.
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
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
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-base font-bold text-slate-900">SEO Opportunity Engine</h2>
                <GlassBadge color="blue">{scanResult.keywords.length} keywords</GlassBadge>
              </div>

              <div className="space-y-3">
                {scanResult.keywords.map((kw, index) => (
                  <motion.div
                    key={kw.keyword}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.08 }}
                    className={`bg-white rounded-xl border border-slate-100 ${premiumShadow} p-4 hover:border-blue-200/60 transition-all group`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-3.5 h-3.5 text-blue-500" />
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{kw.keyword}</h3>
                        </div>
                      </div>
                      <GlassBadge color={getCompColor(kw.competition)}>{kw.competition}</GlassBadge>
                    </div>

                    <div className="flex items-center gap-5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-slate-300" />
                        <span className="text-slate-400">Volume:</span>
                        <span className="font-bold text-slate-700">{kw.volume.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                        <span className="text-slate-400">Opportunity:</span>
                        <span className="font-bold text-emerald-600">{kw.opportunity}%</span>
                      </div>
                    </div>

                    <div className="mt-3 h-1.5 bg-slate-100/80 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${kw.opportunity}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
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
              className={`bg-white rounded-2xl ${premiumShadow} border border-slate-100 p-8 md:p-12 text-center`}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Generating your 30-day Content Strategy...</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Zen is crafting optimised blog posts based on your keywords and competitor analysis.
              </p>
              <div className="flex justify-center gap-1 mt-5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-blue-500"
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
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <BarChart3 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Content Atlas</h2>
                  <GlassBadge color="emerald">30-day plan</GlassBadge>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* First 2 cards visible */}
                {mockBlogs.slice(0, 2).map((blog, index) => (
                  <motion.div
                    key={blog.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.1 }}
                    className={`bg-white rounded-2xl border border-slate-100 ${premiumShadow} overflow-hidden group hover:border-blue-200/60 transition-all`}
                  >
                    {/* Cover Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <GlassBadge color="emerald">
                          <CheckCircle2 className="w-3 h-3" /> {blog.seoScore}%
                        </GlassBadge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-semibold text-white border border-white/20">
                          <Eye className="w-3 h-3" /> Live Preview
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{blog.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">{blog.excerpt}</p>

                      {/* Stats */}
                      <div className="flex items-center gap-2 mb-4">
                        <GlassBadge color="slate"><FileText className="w-3 h-3" /> {blog.words.toLocaleString()} words</GlassBadge>
                        <GlassBadge color="blue"><Target className="w-3 h-3" /> {blog.keywords} keywords</GlassBadge>
                      </div>

                      {/* Actions */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-blue-500/15 hover:from-blue-700 hover:to-indigo-700 transition-all"
                      >
                        Publish Now
                      </motion.button>
                      <button className="w-full mt-2 py-2 text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 transition-colors">
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
                    className={`relative bg-white rounded-2xl border border-slate-100 ${premiumShadow} overflow-hidden`}
                  >
                    <div className="filter blur-[6px] pointer-events-none select-none">
                      <div className="h-44 overflow-hidden">
                        <img src={blog.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 line-clamp-2">{blog.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{blog.excerpt}</p>
                        <div className="flex gap-2 mb-3">
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-[10px]">{blog.words} words</span>
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-[10px]">{blog.seoScore}% SEO</span>
                        </div>
                        <div className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs text-center font-bold">Publish Now</div>
                      </div>
                    </div>

                    {/* Lock overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg mb-3">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 mb-1">Unlock Full Content Engine</p>
                      <p className="text-[10px] text-slate-500 mb-3">£199/mo • 1 blog post every 24hrs</p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate("/get-started")}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold shadow-lg shadow-blue-500/20"
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

        {/* ─── CMS Connections (Premium toggles) ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-white rounded-2xl ${premiumShadow} border border-slate-100 p-5 md:p-8`}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Auto-Publish Connections</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cmsConnections.map((cms) => (
              <div
                key={cms.name}
                className={`rounded-xl border p-4 flex flex-col items-center gap-3 transition-all ${
                  cms.connected
                    ? `bg-blue-50/50 border-blue-200/60 ${premiumShadow}`
                    : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
                }`}
              >
                <img
                  src={cms.logo}
                  alt={cms.name}
                  className="w-8 h-8 object-contain opacity-80"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-xs font-semibold text-slate-700">{cms.name}</span>

                {/* iOS-style toggle */}
                <button
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    cms.connected ? "bg-blue-500" : "bg-slate-200"
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                    animate={{ left: cms.connected ? 22 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── Pricing CTA ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.08),transparent_60%)]" />
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Ready to automate your SEO?</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              1 fully optimised blog post every 24 hours. AI-generated images, keyword targeting, and auto-publishing included.
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">£199</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/get-started")}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-indigo-700 transition-all"
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
