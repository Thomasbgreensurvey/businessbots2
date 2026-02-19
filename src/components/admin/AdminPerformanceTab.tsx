import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AdminPerformanceTab = () => {
  const [trafficData, setTrafficData] = useState<{ date: string; events: number }[]>([]);
  const [crawlData, setCrawlData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);

    // Traffic: aggregate audit_logs by date over the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: logs } = await supabase
      .from("audit_logs")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo)
      .order("created_at");

    const dailyMap: Record<string, number> = {};
    (logs || []).forEach((log: any) => {
      const day = new Date(log.created_at).toISOString().split("T")[0];
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });

    // Fill in last 30 days
    const traffic: { date: string; events: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      traffic.push({ date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), events: dailyMap[key] || 0 });
    }
    setTrafficData(traffic);

    // Crawl status: from seo_metadata completeness
    const { data: seo } = await supabase.from("seo_metadata").select("title, description, og_image, keywords");
    const total = 15; // known pages
    const configured = seo?.length || 0;
    const complete = (seo || []).filter((s: any) => s.title && s.description && s.og_image && s.keywords).length;
    const partial = configured - complete;
    const missing = total - configured;
    setCrawlData([
      { name: "Fully Indexed", value: complete },
      { name: "Partial", value: partial },
      { name: "Not Configured", value: missing },
    ]);

    setLoading(false);
  };

  const CRAWL_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Traffic Growth Line Chart */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Activity Trend (30 Days)</h3>
        </div>
        <div className="rounded-xl border border-white/10 p-4 bg-white/[0.02]">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                itemStyle={{ color: "#10b981" }}
              />
              <Line type="monotone" dataKey="events" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crawl & Index Status Doughnut */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Crawl & Index Status</h3>
        </div>
        <div className="rounded-xl border border-white/10 p-6 bg-white/[0.02] flex flex-col md:flex-row items-center gap-8">
          <div className="w-52 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={crawlData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {crawlData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CRAWL_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {crawlData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CRAWL_COLORS[i] }} />
                <span className="text-white/60 text-sm">{entry.name}</span>
                <span className="text-white font-bold text-sm font-mono ml-auto">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPerformanceTab;
