import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Loader2, CheckCircle, AlertTriangle, XCircle, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ScanResult {
  path: string;
  score: number;
  issues: string[];
  statuses: Record<string, string>;
}

const StatusDot = ({ status }: { status: string }) => {
  if (status === "good") return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
  if (status === "warning") return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
  return <XCircle className="w-3.5 h-3.5 text-red-400" />;
};

const ScoreCell = ({ score }: { score: number }) => {
  const color = score >= 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
    score >= 50 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
    "text-red-400 bg-red-500/10 border-red-500/20";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono border ${color}`}>
      {score}
    </span>
  );
};

const AdminContentHealthTab = ({ onAuditLog }: { onAuditLog: (action: string, entityType: string, entityId: string, details?: object) => void }) => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [avgScore, setAvgScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);

  useEffect(() => { runScan(); }, []);

  const runScan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("seo-scan");
      if (error) throw error;
      setResults(data.results || []);
      setAvgScore(data.avgScore || 0);
      setLastScan(new Date().toISOString());
    } catch (e: any) {
      toast.error(`Scan failed: ${e.message}`);
    }
    setLoading(false);
  };

  const autoGenerateMeta = async () => {
    // Find pages missing title or description
    const gaps = results.filter(r =>
      r.statuses.title !== "good" || r.statuses.description !== "good" || r.statuses.keywords !== "good" || r.statuses.og_image !== "good"
    );

    if (gaps.length === 0) {
      toast.info("All pages already have complete meta data!");
      return;
    }

    setGenerating(true);
    let updated = 0;

    try {
      for (const page of gaps) {
        const { data, error } = await supabase.functions.invoke("generate-blog-content", {
          body: {
            prompt: `Generate SEO metadata for a page at path "${page.path}" on "Business Bots UK" — an AI employee automation agency in Newcastle upon Tyne, North East England. Return ONLY a JSON object with "title" (under 60 chars, include main keyword), "description" (under 155 chars, compelling, action-oriented), and "keywords" (a comma-separated string of 5-8 high-intent SEO keywords targeting AI automation, AI employees, and local North East searches). No markdown, no code fences, just raw JSON.`,
            type: "seo-meta",
          },
        });

        if (error) {
          console.error(`Meta gen failed for ${page.path}:`, error);
          continue;
        }

        let meta: { title?: string; description?: string; keywords?: string } = {};
        try {
          const raw = typeof data === "string" ? data : data?.content || data?.html || JSON.stringify(data);
          const jsonMatch = raw.match(/\{[\s\S]*?\}/);
          if (jsonMatch) {
            meta = JSON.parse(jsonMatch[0]);
          }
        } catch {
          console.error(`Failed to parse meta for ${page.path}`);
          continue;
        }

        const upsertData: any = {
          // Always ensure og_image is populated
          og_image: "https://businessbotsuk.com/og-image.png",
        };
        if (meta.title) upsertData.title = meta.title;
        if (meta.description) upsertData.description = meta.description;
        if (meta.keywords) upsertData.keywords = meta.keywords;

        const { data: existing } = await supabase
          .from("seo_metadata")
          .select("id")
          .eq("page_path", page.path)
          .maybeSingle();

        if (existing) {
          await supabase.from("seo_metadata").update(upsertData).eq("id", existing.id);
        } else {
          await supabase.from("seo_metadata").insert({
            page_path: page.path,
            ...upsertData,
          });
        }

        updated++;
      }

      onAuditLog("auto_generate_meta", "seo", "batch", { pagesProcessed: gaps.length, pagesUpdated: updated });
      toast.success(`Generated meta for ${updated}/${gaps.length} pages`);

      // Re-scan to show updated results
      await runScan();
    } catch (e: any) {
      toast.error(`Auto-generate failed: ${e.message}`);
    }

    setGenerating(false);
  };

  const goodCount = results.filter(r => r.score >= 80).length;
  const warnCount = results.filter(r => r.score >= 50 && r.score < 80).length;
  const critCount = results.filter(r => r.score < 50).length;
  const gapCount = results.filter(r => r.statuses.title !== "good" || r.statuses.description !== "good" || r.statuses.keywords !== "good" || r.statuses.og_image !== "good").length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Content SEO Health</h3>
            {lastScan && <p className="text-white/30 text-xs mt-0.5">Last scan: {new Date(lastScan).toLocaleString("en-GB")}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={autoGenerateMeta}
            disabled={generating || loading || gapCount === 0}
            className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs font-medium hover:bg-purple-600/30 transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${generating ? "animate-pulse" : ""}`} />
            {generating ? `Generating...` : `Auto-Gen (${gapCount})`}
          </button>
          <button
            onClick={runScan}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-600/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Rescan
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "AVG SCORE", value: `${avgScore}/100`, color: avgScore >= 80 ? "text-emerald-400" : avgScore >= 50 ? "text-amber-400" : "text-red-400" },
          { label: "HEALTHY", value: goodCount, color: "text-emerald-400" },
          { label: "WARNINGS", value: warnCount, color: "text-amber-400" },
          { label: "CRITICAL", value: critCount, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Full-width Audit Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden hidden md:block">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                {["Page Path", "Title", "Meta Desc", "OG Image", "Keywords", "SEO Score"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-white/30" /></td></tr>
              ) : results.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-white/30 text-xs">No results. Run a scan.</td></tr>
              ) : (
                results.map((r) => (
                  <tr key={r.path} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white font-mono text-xs">{r.path}</td>
                    <td className="px-4 py-3"><StatusDot status={r.statuses.title || "missing"} /></td>
                    <td className="px-4 py-3"><StatusDot status={r.statuses.description || "missing"} /></td>
                    <td className="px-4 py-3"><StatusDot status={r.statuses.og_image || "missing"} /></td>
                    <td className="px-4 py-3"><StatusDot status={r.statuses.keywords || "missing"} /></td>
                    <td className="px-4 py-3"><ScoreCell score={r.score} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
        ) : results.length === 0 ? (
          <p className="text-center text-white/30 text-xs py-12">No results. Run a scan.</p>
        ) : results.map((r) => (
          <div key={r.path} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-mono text-xs">{r.path}</span>
              <ScoreCell score={r.score} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Title", key: "title" },
                { label: "Desc", key: "description" },
                { label: "OG", key: "og_image" },
                { label: "Keywords", key: "keywords" },
              ].map(({ label, key }) => (
                <div key={key} className="flex items-center gap-1.5">
                  <StatusDot status={r.statuses[key] || "missing"} />
                  <span className="text-white/40 text-[10px] uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContentHealthTab;
