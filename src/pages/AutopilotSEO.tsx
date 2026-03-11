import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Globe, Sparkles, Zap, CheckCircle2, ExternalLink, BarChart3, TrendingUp, Image as ImageIcon, Tag, Wifi, WifiOff } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import zenImg from "@/assets/agents/zen-new.png";

// Mock data for the blog cards
const mockBlogs = [
  {
    id: 1,
    title: "10 Proven SEO Strategies to Dominate Local Search in 2026",
    excerpt: "Discover the latest techniques that top-ranking businesses use to capture local search traffic and convert visitors into loyal customers.",
    image: "/og-image.png",
    seoScore: 94,
    keywords: ["local SEO", "search ranking", "Google Business"],
    status: "ready",
  },
  {
    id: 2,
    title: "How AI Content Creation is Revolutionising Small Business Marketing",
    excerpt: "Learn how artificial intelligence is levelling the playing field for small businesses competing against enterprise-level marketing budgets.",
    image: "/og-image.png",
    seoScore: 91,
    keywords: ["AI marketing", "content creation", "small business"],
    status: "ready",
  },
  {
    id: 3,
    title: "The Ultimate Guide to E-Commerce SEO: Rank Your Products Higher",
    excerpt: "A comprehensive breakdown of on-page and technical SEO tactics specifically designed for online stores and product pages.",
    image: "/og-image.png",
    seoScore: 88,
    keywords: ["e-commerce SEO", "product ranking", "online store"],
    status: "generating",
  },
  {
    id: 4,
    title: "Voice Search Optimisation: Preparing Your Website for 2026",
    excerpt: "With voice search growing rapidly, here's how to optimise your content to capture this emerging traffic source.",
    image: "/og-image.png",
    seoScore: 96,
    keywords: ["voice search", "SEO 2026", "optimisation"],
    status: "published",
  },
];

const cmsConnections = [
  { name: "WordPress", icon: "🔵", connected: true },
  { name: "Shopify", icon: "🟢", connected: false },
  { name: "Webflow", icon: "🔷", connected: false },
  { name: "Wix", icon: "⬛", connected: false },
];

const AutopilotSEO = () => {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "complete">("idle");
  const [keywordMode, setKeywordMode] = useState<"ai" | "custom">("ai");

  const handleScan = () => {
    if (!websiteUrl.trim()) return;
    setScanState("scanning");
    setTimeout(() => setScanState("complete"), 2400);
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 leading-tight">Autopilot SEO</h1>
                <p className="text-[11px] text-slate-500 leading-tight">Powered by Zen</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-700">Active</span>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-200">
              <OptimizedImage src={zenImg} alt="Zen" className="w-full h-full object-cover" width={32} height={32} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-6 md:space-y-8">

        {/* Step 1: Website Scanner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-5 md:p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">Scan Your Website</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Enter your website URL and we'll analyze your site for SEO opportunities, keyword gaps, and content strategy.
          </p>

          {/* URL Input */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleScan}
              disabled={scanState === "scanning"}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 min-w-[140px]"
            >
              {scanState === "scanning" ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Search className="w-4 h-4" />
                  </motion.div>
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Scan Website
                </>
              )}
            </motion.button>
          </div>

          {/* Scan Results */}
          <AnimatePresence>
            {scanState === "complete" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5"
              >
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-800">Website Analysis Complete</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-[11px] text-slate-500 mb-1">Industry</p>
                      <p className="text-sm font-bold text-slate-900">B2B SaaS</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-[11px] text-slate-500 mb-1">Keywords Found</p>
                      <p className="text-sm font-bold text-blue-600">47</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-[11px] text-slate-500 mb-1">SEO Opportunities</p>
                      <p className="text-sm font-bold text-amber-600">23</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Step 2: Keyword Strategy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-5 md:p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">2</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">Keyword Strategy</h2>
          </div>

          {/* Toggle */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setKeywordMode("ai")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                keywordMode === "ai"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Suggested
            </button>
            <button
              onClick={() => setKeywordMode("custom")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                keywordMode === "custom"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              Custom Keywords
            </button>
          </div>

          {/* Input Fields */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Target Keywords</label>
              <input
                type="text"
                placeholder={keywordMode === "ai" ? "Auto-generated from scan..." : "e.g. AI chatbot, SEO tools"}
                disabled={keywordMode === "ai"}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Target Location</label>
              <input
                type="text"
                placeholder="e.g. Newcastle, UK"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Content Tone</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all">
                <option>Professional</option>
                <option>Conversational</option>
                <option>Technical</option>
                <option>Friendly</option>
              </select>
            </div>
          </div>
        </motion.section>

        {/* Step 3: CMS Connections */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-5 md:p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">3</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">Auto-Publish Connections</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Connect your CMS to auto-publish generated blog posts directly to your website.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cmsConnections.map((cms) => (
              <motion.button
                key={cms.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-xl border p-4 text-center transition-all ${
                  cms.connected
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className="text-2xl block mb-2">{cms.icon}</span>
                <span className="text-xs font-semibold text-slate-700 block">{cms.name}</span>
                <div className={`mt-2 flex items-center justify-center gap-1 text-[10px] font-medium ${
                  cms.connected ? "text-emerald-600" : "text-slate-400"
                }`}>
                  {cms.connected ? (
                    <>
                      <Wifi className="w-3 h-3" />
                      Connected
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3" />
                      Connect
                    </>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Step 4: Blog Dashboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">4</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">Generated Content</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{mockBlogs.length} posts</span>
            </div>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {mockBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.08 }}
                className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 overflow-hidden group hover:shadow-md hover:border-slate-300/60 transition-all"
              >
                {/* Hero Image */}
                <div className="relative h-40 bg-gradient-to-br from-blue-100 via-slate-100 to-indigo-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      blog.status === "published"
                        ? "bg-emerald-500 text-white"
                        : blog.status === "generating"
                        ? "bg-amber-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}>
                      {blog.status === "published" ? "Published" : blog.status === "generating" ? "Generating..." : "Ready"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 md:p-5">
                  <h3 className="text-sm md:text-base font-bold text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  {/* SEO Score */}
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${blog.seoScore}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          blog.seoScore >= 90 ? "bg-emerald-500" : blog.seoScore >= 80 ? "bg-blue-500" : "bg-amber-500"
                        }`}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{blog.seoScore}%</span>
                  </div>

                  {/* Keyword Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {blog.keywords.map((kw) => (
                      <span key={kw} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600">
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* Publish Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {blog.status === "published" ? "View Post" : "Publish Now"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pricing Footer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 md:p-8 text-center"
        >
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">Ready to automate your SEO?</h3>
          <p className="text-blue-100 text-sm mb-5 max-w-md mx-auto">
            1 fully optimized blog post every 24 hours. AI-generated images, keyword targeting, and auto-publishing included.
          </p>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">£199</span>
              <span className="text-blue-200 text-sm">/month</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/get-started")}
              className="px-8 py-3 rounded-xl bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/30"
            >
              Start Free Trial
            </motion.button>
          </div>
        </motion.section>

        <div className="h-8" />
      </main>
    </div>
  );
};

export default AutopilotSEO;
