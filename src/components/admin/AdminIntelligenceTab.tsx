import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, CheckCircle, Clock, MapPin, Loader2 } from "lucide-react";

interface Conversion {
  id: string;
  type: "contact" | "booking";
  name: string;
  created_at: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AdminIntelligenceTab = () => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [contactsRes, bookingsRes, logsRes] = await Promise.all([
      supabase.from("contacts").select("id, name, created_at").order("created_at", { ascending: false }).limit(30),
      supabase.from("demo_bookings").select("id, name, created_at").order("created_at", { ascending: false }).limit(30),
      supabase.from("audit_logs").select("created_at").order("created_at", { ascending: false }).limit(500),
    ]);

    const contacts: Conversion[] = (contactsRes.data || []).map(c => ({ ...c, type: "contact" as const }));
    const bookings: Conversion[] = (bookingsRes.data || []).map(b => ({ ...b, type: "booking" as const }));
    const merged = [...contacts, ...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setConversions(merged);

    // Build heatmap from audit_logs timestamps
    const grid: number[][] = DAYS.map(() => Array(24).fill(0));
    (logsRes.data || []).forEach((log: any) => {
      const d = new Date(log.created_at);
      const day = (d.getDay() + 6) % 7; // Mon=0
      const hour = d.getHours();
      grid[day][hour]++;
    });
    setHeatmapData(grid);
    setLoading(false);
  };

  const maxHeat = Math.max(1, ...heatmapData.flat());

  const formatDate = (d: string) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Path to Conversion */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Path to Conversion</h3>
          <span className="text-white/30 text-xs ml-auto">{conversions.length} total</span>
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
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
              ) : (
                conversions.map((c) => (
                  <tr key={`${c.type}-${c.id}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/50 font-mono text-xs">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3 text-white text-xs font-medium">{c.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        c.type === "booking" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {c.type === "booking" ? "Demo Booking" : "Contact Form"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Converted</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Peak Activity Heatmap */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Peak Activity Heatmap</h3>
        </div>

        <div className="rounded-xl border border-white/10 p-4 bg-white/[0.02] overflow-x-auto">
          {/* Hour labels */}
          <div className="flex mb-1 ml-10">
            {HOURS.map(h => (
              <div key={h} className="flex-1 text-center text-[9px] text-white/30 font-mono min-w-[20px]">
                {h % 3 === 0 ? `${h.toString().padStart(2, "0")}` : ""}
              </div>
            ))}
          </div>
          {/* Grid */}
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
          {/* Legend */}
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
