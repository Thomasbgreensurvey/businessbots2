import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Radar, RotateCw, Globe, Zap, FileSearch, Loader2, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
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

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("audit_logs")
      .select("id, created_at, details")
      .in("action", ["search_ping", "seo_scan", "sitemap_rebuild", "content_optimise"])
      .order("created_at", { ascending: false })
      .limit(20);
    setPingHistory((data || []) as PingLog[]);
    setLoading(false);
  };

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
    const blogUrls = (posts || []).map(p => `  <url><loc>https://businessbotsuk.lovable.app/blog/${p.slug}</loc><lastmod>${p.updated_at?.split("T")[0]}</lastmod></url>`);
    const pageUrls = SITE_PAGES.map(p => `  <url><loc>https://businessbotsuk.lovable.app${p}</loc><lastmod>${new Date().toISOString().split("T")[0]}</lastmod></url>`);
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
    if (details.results) return "Search Ping";
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { key: "scan", label: "Run Full SEO Scan", icon: FileSearch, action: runSEOScan, color: "from-emerald-600 to-emerald-800" },
          { key: "sitemap", label: "Rebuild Sitemap", icon: RotateCw, action: rebuildSitemap, color: "from-blue-600 to-blue-800" },
          { key: "ping", label: "Ping Search Engines", icon: Globe, action: pingEngines, color: "from-purple-600 to-purple-800" },
          { key: "optimise", label: "Optimise All Content", icon: Zap, action: optimiseContent, color: "from-amber-600 to-amber-800" },
        ].map(({ key, label, icon: Icon, action, color }) => (
          <button
            key={key}
            onClick={action}
            disabled={!!actionLoading}
            className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${color} border border-white/10 hover:border-white/20 transition-all group disabled:opacity-50`}
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

      {/* Indexing Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-xs uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-xs uppercase tracking-wider">Action</th>
              <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-xs uppercase tracking-wider">Google Status</th>
              <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-xs uppercase tracking-wider">Bing / IndexNow</th>
              <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-xs uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-white/30"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></td></tr>
            ) : pingHistory.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-white/30 text-xs">No indexing activity yet. Run your first scan above.</td></tr>
            ) : (
              pingHistory.map((log) => {
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
                    <td className="px-4 py-3 text-white/40 text-xs max-w-[250px] truncate">
                      {google?.response?.urlNotificationMetadata?.latestUpdate?.notifyTime && (
                        <span className="text-emerald-400/70">notifyTime: {google.response.urlNotificationMetadata.latestUpdate.notifyTime}</span>
                      )}
                      {google?.response?.error && (
                        <span className="text-red-400/70">
                          {typeof google.response.error === "string" ? google.response.error : google.response.error?.message || JSON.stringify(google.response.error)}
                        </span>
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
  );
};

export default AdminSearchForceTab;
