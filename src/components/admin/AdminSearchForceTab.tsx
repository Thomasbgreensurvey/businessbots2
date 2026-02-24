import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Radar, RotateCw, Globe, Zap, FileSearch, Loader2, CheckCircle, XCircle, ShieldCheck, ChevronDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface PingResult {
  engine: string;
  status: number;
  url: string;
  response?: any;
}

interface PingLog {
  id: string;
  created_at: string;
  details: {
    results?: PingResult[];
    timestamp?: string;
  } | null;
}

const SITE_PAGES = [
  "/", "/pricing", "/blog", "/community", "/faq", "/help-centre",
  "/contact", "/book-demo", "/get-started", "/case-studies",
  "/what-is-an-ai-employee", "/call", "/connect",
  "/privacy-policy", "/terms",
];

const AdminSearchForceTab = ({ onAuditLog }: { onAuditLog: (action: string, entityType: string, entityId: string, details?: object) => void }) => {
  const [pingHistory, setPingHistory] = useState<PingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pingPage, setPingPage] = useState(1);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("audit_logs")
      .select("id, created_at, details")
      .in("action", ["search_ping", "seo_scan", "sitemap_rebuild", "content_optimise"])
      .order("created_at", { ascending: false })
      .limit(100);
    setPingHistory((data || []) as PingLog[]);
    setLoading(false);
  };

  const paginatedHistory = pingHistory.slice(0, pingPage * 20);
  const hasMorePings = pingHistory.length > pingPage * 20;

  const runSEOScan = async () => {
    setActionLoading("scan");
    try {
      const { data, error } = await supabase.functions.invoke("seo-scan");
      if (error) throw error;
      toast.success(`SEO Scan complete — Average score: ${data.avgScore}/100`);
      fetchHistory();
    } catch (e: any) {
      toast.error(`Scan failed: ${e.message}`);
    }
    setActionLoading(null);
  };

  const rebuildSitemap = async () => {
    setActionLoading("sitemap");
    const { data: posts } = await supabase.from("blog_posts").select("slug, updated_at").eq("status", "published");
    const blogUrls = (posts || []).map(p => `  <url><loc>https://businessbotsuk.com/blog/${p.slug}</loc><lastmod>${p.updated_at?.split("T")[0]}</lastmod></url>`);
    const pageUrls = SITE_PAGES.map(p => `  <url><loc>https://businessbotsuk.com${p}</loc><lastmod>${new Date().toISOString().split("T")[0]}</lastmod></url>`);
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...pageUrls, ...blogUrls].join("\n")}\n</urlset>`;

    await onAuditLog("sitemap_rebuild", "seo", "sitemap", { urls: SITE_PAGES.length + (posts?.length || 0), timestamp: new Date().toISOString() });
    toast.success(`Sitemap rebuilt with ${SITE_PAGES.length + (posts?.length || 0)} URLs`);
    console.log("Generated sitemap:\n", sitemapContent);
    fetchHistory();
    setActionLoading(null);
  };

  const pingEngines = async () => {
    setActionLoading("ping");
    try {
      // Google Indexing API v3 + Bing sitemap ping
      const { data, error } = await supabase.functions.invoke("ping-search-engines", {
        body: { action: "ping_sitemap" },
      });
      if (error) throw error;

      // IndexNow batch submission
      await supabase.functions.invoke("ping-search-engines", {
        body: { action: "indexnow", urls: SITE_PAGES },
      });

      // Check Google result
      const googleResult = data?.results?.find((r: PingResult) => r.engine === "Google");
      if (googleResult?.status === 200) {
        toast.success("🚀 Google VIP Indexing Request Successful", {
          description: `notifyTime: ${googleResult.response?.urlNotificationMetadata?.latestUpdate?.notifyTime || "confirmed"}`,
          duration: 6000,
        });
      } else {
        const errMsg = typeof googleResult?.response?.error === "string"
          ? googleResult.response.error
          : googleResult?.response?.error?.message || "Check audit logs for details";
        toast.warning(`Google returned status ${googleResult?.status || "unknown"}`, {
          description: errMsg,
        });
      }

      // IndexNow / Bing toast
      const bingResult = data?.results?.find((r: PingResult) => r.engine === "Bing");
      if (bingResult?.status === 200) {
        toast.success("Bing sitemap ping successful");
      }

      fetchHistory();
    } catch (e: any) {
      toast.error(`Ping failed: ${e.message}`);
    }
    setActionLoading(null);
  };

  const forceGlobalReIndex = async () => {
    setActionLoading("global-reindex");
    try {
      // Gather ALL published blog slugs
      const { data: posts } = await supabase.from("blog_posts").select("slug").eq("status", "published");
      const blogUrls = (posts || []).map((p: any) => `/blog/${p.slug}`);
      const allUrls = [...SITE_PAGES, ...blogUrls];

      // Fire IndexNow for all URLs
      const { error: indexError } = await supabase.functions.invoke("ping-search-engines", {
        body: { action: "indexnow", urls: allUrls },
      });
      if (indexError) throw indexError;

      // Also ping Google for the homepage
      const { error: googleError } = await supabase.functions.invoke("ping-search-engines", {
        body: { action: "ping_sitemap" },
      });
      if (googleError) throw googleError;

      await onAuditLog("global_reindex", "seo", "all_urls", { urlCount: allUrls.length, timestamp: new Date().toISOString() });
      toast.success(`♻️ Global Re-Index Complete`, {
        description: `${allUrls.length} URLs submitted to Google & Bing/IndexNow`,
        duration: 8000,
      });
      fetchHistory();
    } catch (e: any) {
      toast.error(`Global re-index failed: ${e.message}`);
    }
    setActionLoading(null);
  };

  const optimiseContent = async () => {
    setActionLoading("optimise");
    try {
      const { data } = await supabase.functions.invoke("seo-scan");
      const lowScorePages = (data?.results || []).filter((r: any) => r.score < 50);
      await onAuditLog("content_optimise", "seo", "batch", { pagesOptimised: lowScorePages.length, timestamp: new Date().toISOString() });
      toast.success(`Content analysis complete — ${lowScorePages.length} pages need attention`);
      fetchHistory();
    } catch (e: any) {
      toast.error(`Optimise failed: ${e.message}`);
    }
    setActionLoading(null);
  };

  const formatDate = (d: string) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const getActionLabel = (details: any) => {
    if (!details) return "Unknown";
    if (details.results) {
      const engines = (details.results as PingResult[]).map(r => r.engine);
      if (engines.includes("Google")) return "Search Ping";
      if (engines.includes("IndexNow")) return "IndexNow Batch";
      return "Search Ping";
    }
    if (details.avgScore !== undefined) return "SEO Scan";
    if (details.urls) return "Sitemap Rebuild";
    if (details.pagesOptimised !== undefined) return "Content Optimise";
    return "Action";
  };

  const renderGoogleStatus = (google: PingResult | undefined) => {
    if (!google) return <span className="text-white/20 text-xs">—</span>;
    if (google.status === 200) {
      return (
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-mono text-emerald-400">Google Verified Index Request</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5">
        <XCircle className="w-3.5 h-3.5 text-red-400" />
        <span className="text-xs font-mono text-red-400">{google.status} Error</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Master Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { key: "scan", label: "Run Full SEO Scan", icon: FileSearch, action: runSEOScan, color: "from-emerald-600 to-emerald-800" },
          { key: "sitemap", label: "Rebuild Sitemap", icon: RotateCw, action: rebuildSitemap, color: "from-blue-600 to-blue-800" },
          { key: "ping", label: "Ping Search Engines", icon: Globe, action: pingEngines, color: "from-purple-600 to-purple-800" },
          { key: "optimise", label: "Optimise All Content", icon: Zap, action: optimiseContent, color: "from-amber-600 to-amber-800" },
          { key: "global-reindex", label: "♻️ Force Global Re-Index", icon: RefreshCw, action: forceGlobalReIndex, color: "from-red-600 to-red-800" },
        ].map(({ key, label, icon: Icon, action, color }) => (
          <button
            key={key}
            onClick={action}
            disabled={!!actionLoading}
            className={`relative overflow-hidden rounded-xl p-4 min-h-[56px] bg-gradient-to-br ${color} border border-white/10 hover:border-white/20 transition-all group disabled:opacity-50`}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              {actionLoading === key ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              )}
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Search Engine Health Header */}
      <div className="flex items-center gap-2">
        <Radar className="w-5 h-5 text-emerald-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Indexing History</h3>
      </div>

      {/* Indexing Table — Desktop */}
      <div className="rounded-xl border border-white/10 overflow-hidden hidden md:block">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-xs uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-xs uppercase tracking-wider">Action</th>
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-xs uppercase tracking-wider">Google Status</th>
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-xs uppercase tracking-wider">Bing / IndexNow</th>
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-xs uppercase tracking-wider">Target Domain</th>
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-xs uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></td></tr>
              ) : pingHistory.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30 text-xs">No indexing activity yet. Run your first scan above.</td></tr>
              ) : (
                paginatedHistory.map((log) => {
                  const results = (log.details as any)?.results as PingResult[] | undefined;
                  const google = results?.find(r => r.engine === "Google");
                  const bing = results?.find(r => r.engine === "Bing" || r.engine === "IndexNow");
                  return (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white/60 font-mono text-xs">{formatDate(log.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className="text-white text-xs font-medium">{getActionLabel(log.details)}</span>
                      </td>
                      <td className="px-4 py-3">{renderGoogleStatus(google)}</td>
                      <td className="px-4 py-3">
                        {bing ? (
                          <span className="flex items-center gap-1.5">
                            {bing.status === 200 || bing.status === 202 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                            <span className={`text-xs font-mono ${bing.status === 200 || bing.status === 202 ? "text-emerald-400" : "text-red-400"}`}>{bing.status} {bing.engine}</span>
                          </span>
                        ) : <span className="text-white/20 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {google?.url ? (
                          <span className="text-xs font-mono text-cyan-400">{google.url}</span>
                        ) : (
                          <span className="text-xs font-mono text-white/30">businessbotsuk.com</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/40 text-xs max-w-[250px] truncate">
                        {google?.response?.urlNotificationMetadata?.latestUpdate?.notifyTime && (
                          <span className="text-emerald-400/70">notifyTime: {google.response.urlNotificationMetadata.latestUpdate.notifyTime}</span>
                        )}
                        {google?.response?.urlNotificationMetadata?.url && !google?.response?.urlNotificationMetadata?.latestUpdate?.notifyTime && (
                          <span className="text-emerald-400/70">✓ Indexed: {google.response.urlNotificationMetadata.url}</span>
                        )}
                        {google?.response?.error && (
                          <span className="text-red-400/70">
                            {typeof google.response.error === "string" ? google.response.error : google.response.error?.message || JSON.stringify(google.response.error)}
                          </span>
                        )}
                        {!google && bing && (
                          <span className="text-cyan-400/70">{bing.url}</span>
                        )}
                        {(log.details as any)?.avgScore !== undefined && `Score: ${(log.details as any).avgScore}/100`}
                        {(log.details as any)?.urls && `${(log.details as any).urls} URLs`}
                        {(log.details as any)?.pagesOptimised !== undefined && `${(log.details as any).pagesOptimised} pages flagged`}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Indexing Cards — Mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
        ) : pingHistory.length === 0 ? (
          <p className="text-center text-white/30 text-xs py-8">No indexing activity yet.</p>
        ) : (
          paginatedHistory.map((log) => {
            const results = (log.details as any)?.results as PingResult[] | undefined;
            const google = results?.find(r => r.engine === "Google");
            const bing = results?.find(r => r.engine === "Bing" || r.engine === "IndexNow");
            return (
              <div key={log.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 font-mono text-xs">{formatDate(log.created_at)}</span>
                  <span className="text-white text-xs font-medium">{getActionLabel(log.details)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400/60 text-[10px] uppercase tracking-wider">Google</span>
                  {renderGoogleStatus(google)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400/60 text-[10px] uppercase tracking-wider">Bing</span>
                  {bing ? (
                    <span className="flex items-center gap-1.5">
                      {bing.status === 200 || bing.status === 202 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                      <span className={`text-xs font-mono ${bing.status === 200 || bing.status === 202 ? "text-emerald-400" : "text-red-400"}`}>{bing.status}</span>
                    </span>
                  ) : <span className="text-white/20 text-xs">—</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400/60 text-[10px] uppercase tracking-wider">Domain</span>
                  <span className="text-xs font-mono text-cyan-400">{google?.url || "businessbotsuk.com"}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Load More */}
      {hasMorePings && (
        <div className="flex justify-center pt-2">
          <Button variant="ghost" size="sm" onClick={() => setPingPage((p) => p + 1)} className="text-emerald-400 hover:text-emerald-300">
            <ChevronDown className="w-4 h-4 mr-1" /> Load More ({pingHistory.length - paginatedHistory.length} remaining)
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminSearchForceTab;
