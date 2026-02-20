import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, CheckCircle, Clock, Loader2, Radio, Monitor, Smartphone, Tablet } from "lucide-react";

interface Conversion {
  id: string;
  type: "contact" | "booking";
  name: string;
  created_at: string;
}

interface JourneyEvent {
  id: string;
  created_at: string;
  action: string;
  page: string;
  duration?: number;
  referrer?: string;
  screen?: string;
  sessionId?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DeviceIcon = ({ screen }: { screen?: string }) => {
  if (!screen) return <Monitor className="w-3.5 h-3.5 text-white/30" />;
  const w = parseInt(screen.split("x")[0] || "0");
  if (w <= 480) return <Smartphone className="w-3.5 h-3.5 text-blue-400" />;
  if (w <= 1024) return <Tablet className="w-3.5 h-3.5 text-purple-400" />;
  return <Monitor className="w-3.5 h-3.5 text-emerald-400" />;
};

const AdminIntelligenceTab = () => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [journeys, setJourneys] = useState<JourneyEvent[]>([]);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [contactsRes, bookingsRes, logsRes, visitorRes] = await Promise.all([
      supabase.from("contacts").select("id, name, created_at").order("created_at", { ascending: false }).limit(30),
      supabase.from("demo_bookings").select("id, name, created_at").order("created_at", { ascending: false }).limit(30),
      supabase.from("audit_logs").select("created_at").order("created_at", { ascending: false }).limit(500),
      supabase.from("audit_logs").select("*").eq("entity_type", "visitor").order("created_at", { ascending: false }).limit(100),
    ]);

    const contacts: Conversion[] = (contactsRes.data || []).map(c => ({ ...c, type: "contact" as const }));
    const bookings: Conversion[] = (bookingsRes.data || []).map(b => ({ ...b, type: "booking" as const }));
    const merged = [...contacts, ...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setConversions(merged);

    // Parse visitor journeys
    const parsed: JourneyEvent[] = (visitorRes.data || []).map((log: any) => {
      const d = log.details as any || {};
      return {
        id: log.id,
        created_at: log.created_at,
        action: log.action,
        page: log.entity_id || "/",
        duration: d.duration,
        referrer: d.referrer,
        screen: d.screen,
        sessionId: d.sessionId,
      };
    });
    setJourneys(parsed);

    // Build heatmap
    const grid: number[][] = DAYS.map(() => Array(24).fill(0));
    (logsRes.data || []).forEach((log: any) => {
      const d = new Date(log.created_at);
      const day = (d.getDay() + 6) % 7;
      const hour = d.getHours();
      grid[day][hour]++;
    });
    setHeatmapData(grid);
    setLoading(false);
  };

  const maxHeat = Math.max(1, ...heatmapData.flat());
  const formatDate = (d: string) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const formatDuration = (dur?: number) => {
    if (dur == null) return "—";
    if (dur < 60) return `${dur}s`;
    return `${Math.floor(dur / 60)}m ${dur % 60}s`;
  };

  const formatReferrer = (ref?: string) => {
    if (!ref) return "Direct";
    try {
      return new URL(ref).hostname.replace("www.", "");
    } catch {
      return ref.slice(0, 30);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Live Journey Feed */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Journey Feed</h3>
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/30 text-xs">{journeys.length} events</span>
          </div>
        </div>

        {/* Desktop */}
        <div className="rounded-xl border border-white/10 overflow-hidden hidden md:block">
          <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  {["Timestamp", "Page Path", "Dwell Time", "Referrer", "Device"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {journeys.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-white/30 text-xs">No visitor data yet.</td></tr>
                ) : journeys.map((j) => (
                  <tr key={j.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-2.5 text-white/50 font-mono text-xs">{formatDate(j.created_at)}</td>
                    <td className="px-4 py-2.5 text-white font-mono text-xs">{j.page}</td>
                    <td className="px-4 py-2.5">
                      {j.action === "page_exit" && j.duration != null ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono border ${
                          j.duration >= 30 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                          j.duration >= 10 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                          "text-red-400 bg-red-500/10 border-red-500/20"
                        }`}>{formatDuration(j.duration)}</span>
                      ) : <span className="text-white/20 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-white/40 text-xs">{formatReferrer(j.referrer)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <DeviceIcon screen={j.screen} />
                        <span className="text-white/30 text-[10px] font-mono">{j.screen || "—"}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {journeys.length === 0 ? (
            <p className="text-center text-white/30 text-xs py-8">No visitor data yet.</p>
          ) : journeys.map((j) => (
            <div key={j.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/50 font-mono text-xs">{formatDate(j.created_at)}</span>
                <div className="flex items-center gap-1.5">
                  <DeviceIcon screen={j.screen} />
                  <span className="text-white/30 text-[10px] font-mono">{j.screen || "—"}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400/60 text-[10px] uppercase tracking-wider">Page</span>
                <span className="text-white font-mono text-xs">{j.page}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400/60 text-[10px] uppercase tracking-wider">Dwell</span>
                {j.action === "page_exit" && j.duration != null ? (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono border ${
                    j.duration >= 30 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                    j.duration >= 10 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                    "text-red-400 bg-red-500/10 border-red-500/20"
                  }`}>{formatDuration(j.duration)}</span>
                ) : <span className="text-white/20 text-xs">—</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400/60 text-[10px] uppercase tracking-wider">Referrer</span>
                <span className="text-white/40 text-xs">{formatReferrer(j.referrer)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Path to Conversion */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Path to Conversion</h3>
          <span className="text-white/30 text-xs ml-auto">{conversions.length} total</span>
        </div>

        {/* Desktop */}
        <div className="rounded-xl border border-white/10 overflow-hidden hidden md:block">
          <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Timestamp</th>
                  <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Lead</th>
                  <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Channel</th>
                  <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {conversions.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-white/30 text-xs">No conversions recorded yet.</td></tr>
                ) : conversions.map((c) => (
                  <tr key={`${c.type}-${c.id}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/50 font-mono text-xs">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3 text-white text-xs font-medium">{c.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        c.type === "booking" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>{c.type === "booking" ? "Demo Booking" : "Contact Form"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Converted</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {conversions.length === 0 ? (
            <p className="text-center text-white/30 text-xs py-8">No conversions recorded yet.</p>
          ) : conversions.map((c) => (
            <div key={`${c.type}-${c.id}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/50 font-mono text-xs">{formatDate(c.created_at)}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  c.type === "booking" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>{c.type === "booking" ? "Demo" : "Contact"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400/60 text-[10px] uppercase tracking-wider">Lead</span>
                <span className="text-white text-xs font-medium">{c.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400/60 text-[10px] uppercase tracking-wider">Status</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Converted</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Activity Heatmap */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Peak Activity Heatmap</h3>
        </div>

        <div className="rounded-xl border border-white/10 p-4 bg-white/[0.02] overflow-x-auto">
          <div className="flex mb-1 ml-10">
            {HOURS.map(h => (
              <div key={h} className="flex-1 text-center text-[9px] text-white/30 font-mono min-w-[20px]">
                {h % 3 === 0 ? `${h.toString().padStart(2, "0")}` : ""}
              </div>
            ))}
          </div>
          {DAYS.map((day, di) => (
            <div key={day} className="flex items-center gap-1 mb-0.5">
              <span className="w-8 text-[10px] text-white/40 font-mono text-right shrink-0">{day}</span>
              <div className="flex flex-1 gap-0.5">
                {HOURS.map(h => {
                  const val = heatmapData[di]?.[h] || 0;
                  const intensity = val / maxHeat;
                  return (
                    <div
                      key={h}
                      title={`${day} ${h}:00 — ${val} events`}
                      className="flex-1 aspect-square rounded-sm min-w-[14px] transition-colors"
                      style={{
                        backgroundColor: val === 0
                          ? "rgba(255,255,255,0.03)"
                          : `rgba(16, 185, 129, ${0.15 + intensity * 0.85})`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-end gap-2 mt-3">
            <span className="text-[9px] text-white/30">Less</span>
            {[0.1, 0.3, 0.5, 0.7, 1].map(i => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(16, 185, 129, ${0.15 + i * 0.85})` }} />
            ))}
            <span className="text-[9px] text-white/30">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIntelligenceTab;
