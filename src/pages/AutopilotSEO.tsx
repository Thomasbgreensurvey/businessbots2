import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Search, Globe, Sparkles, Zap, CheckCircle2, ExternalLink,
  BarChart3, TrendingUp, Tag, Wifi, WifiOff, AlertCircle, Loader2,
  Target, Activity, ArrowUpRight
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
  { name: "WordPress", icon: "🔵", connected: true },
  { name: "Shopify", icon: "🟢", connected: false },
  { name: "Webflow", icon: "🔷", connected: false },
  { name: "Wix", icon: "⬛", connected: false },
];

const AutopilotSEO = () => {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "complete" | "error">("idle");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState("");
  const [keywordMode, setKeywordMode] = useState<"ai" | "custom">("ai");

  const handleScan = async () => {
    const trimmed = websiteUrl.trim();
    if (!trimmed) {
      toast.error("Please enter a website URL");
      return;
    }

    setScanState("scanning");
    setScanError("");
    setScanResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-website", {
        body: { url: trimmed },
      });

      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || "Analysis failed");

      setScanResult(data.data);
      setScanState("complete");
      toast.success("Website analysis complete!");
    } catch (err: any) {
      console.error("Scan error:", err);
      setScanError(err.message || "Something went wrong");
      setScanState("error");
      toast.error("Scan failed", { description: err.message });
    }
  };

  const getCompColor = (comp: string) => {
    if (comp === "Low") return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (comp === "Medium") return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
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

        {/* ─── Step 1: Website Scanner ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-5 md:p-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">Scan Your Website</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5 ml-8">
            Enter your URL and Zen will crawl your site, analyse your content, and find SEO opportunities.
          </p>

          {/* URL Input */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                placeholder="https://yourwebsite.com"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleScan}
              disabled={scanState === "scanning"}
              className="px-6 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 min-w-[160px] shadow-sm shadow-blue-200"
            >
              {scanState === "scanning" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analysing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Scan Website
                </>
              )}
            </motion.button>
          </div>

          {/* Scanning state */}
          <AnimatePresence mode="wait">
            {scanState === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-sm font-semibold text-blue-800">Zen is scanning your website...</span>
                  </div>
                  <div className="space-y-2">
                    {["Fetching page content", "Extracting SEO signals", "Running AI analysis", "Generating keyword opportunities"].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.6 }}
                        className="flex items-center gap-2 text-xs text-blue-600"
                      >
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4 }}
                          className="w-1.5 h-1.5 rounded-full bg-blue-500"
                        />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {scanState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5"
              >
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Scan Failed</p>
                    <p className="text-xs text-red-600 mt-1">{scanError}</p>
                    <button
                      onClick={handleScan}
                      className="mt-2 text-xs font-medium text-red-700 underline hover:no-underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {scanState === "complete" && scanResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5"
              >
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-800">Website Analysis Complete</span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">{scanResult.summary}</p>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
                      <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-medium">Industry</p>
                      <p className="text-sm font-bold text-slate-900">{scanResult.industry}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
                      <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-medium">SEO Score</p>
                      <p className={`text-xl font-extrabold ${getScoreColor(scanResult.seoScore)}`}>{scanResult.seoScore}<span className="text-xs text-slate-400">/100</span></p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
                      <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-medium">Keywords</p>
                      <p className="text-sm font-bold text-blue-600">{scanResult.keywordsFound}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
                      <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-medium">Opportunities</p>
                      <p className="text-sm font-bold text-amber-600">{scanResult.opportunitiesFound}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ─── Step 2: SEO Keyword Opportunities ─── */}
        <AnimatePresence>
          {scanResult && scanResult.keywords.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <h2 className="text-base font-bold text-slate-900">SEO Opportunity Engine</h2>
                <span className="text-xs text-slate-400 ml-auto">{scanResult.keywords.length} keywords found</span>
              </div>

              <div className="space-y-3">
                {scanResult.keywords.map((kw, index) => (
                  <motion.div
                    key={kw.keyword}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-4 hover:shadow-md hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-3.5 h-3.5 text-blue-500" />
                          <h3 className="text-sm font-bold text-slate-900">{kw.keyword}</h3>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getCompColor(kw.competition)}`}>
                        {kw.competition}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-500">Volume:</span>
                        <span className="font-semibold text-slate-700">{kw.volume.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                        <span className="text-slate-500">Opportunity:</span>
                        <span className="font-semibold text-emerald-600">{kw.opportunity}%</span>
                      </div>
                    </div>

                    {/* Opportunity bar */}
                    <div className="mt-2.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${kw.opportunity}%` }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.7 }}
                        className={`h-full rounded-full ${getScoreBarColor(kw.opportunity)}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── Step 3: Keyword Strategy ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-5 md:p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">3</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">Keyword Strategy</h2>
          </div>

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

        {/* ─── Step 4: CMS Connections ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-5 md:p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">4</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">Auto-Publish Connections</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5 ml-8">
            Connect your CMS to auto-publish AI-generated blog posts directly to your website.
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
                    <><Wifi className="w-3 h-3" /> Connected</>
                  ) : (
                    <><WifiOff className="w-3 h-3" /> Connect</>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* ─── Pricing CTA ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 md:p-8 text-center"
        >
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">Ready to automate your SEO?</h3>
          <p className="text-blue-100 text-sm mb-5 max-w-md mx-auto">
            1 fully optimised blog post every 24 hours. AI-generated images, keyword targeting, and auto-publishing included.
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
