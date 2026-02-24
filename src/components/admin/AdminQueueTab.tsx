import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Wand2, Rocket, Loader2, Bot, Clock, CheckCircle, Send, Webhook, Zap, BarChart3, Layers, FileCheck, TrendingUp, Activity, Heart } from "lucide-react";
import { toast } from "sonner";

const AGENTS = ["Sprout", "Lilly", "Banjo", "Like", "Zen", "Tobby", "Nano", "Skoot"];

interface QueueItem {
  id: string;
  topic: string;
  featured_agent: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  result_post_id: string | null;
}

interface DashboardStats {
  totalPublished: number;
  inQueue: number;
  draftsReady: number;
  monthlyMomentum: number;
  successRate: number;
}

const AdminQueueTab = ({ onAuditLog }: { onAuditLog: (action: string, entityType: string, entityId: string, details?: object) => void }) => {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState("");
  const [newAgent, setNewAgent] = useState("Sprout");
  const [generating, setGenerating] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [testingCron, setTestingCron] = useState(false);
  const [forcingHeartbeat, setForcingHeartbeat] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({ totalPublished: 0, inQueue: 0, draftsReady: 0, monthlyMomentum: 0, successRate: 0 });

  useEffect(() => { fetchQueue(); fetchStats(); }, []);

  const fetchStats = async () => {
    const [pubRes, queueRes] = await Promise.all([
      supabase.from("blog_posts").select("id, published_at", { count: "exact" }).eq("status", "published"),
      supabase.from("content_queue" as any).select("*"),
    ]);
    const published = pubRes.count ?? 0;
    const queueItems = (queueRes.data as any as QueueItem[]) || [];
    const inQueue = queueItems.filter(i => i.status === "queued").length;
    const draftsReady = queueItems.filter(i => i.status === "completed").length;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    const monthly = (pubRes.data || []).filter((p: any) => p.published_at && p.published_at >= thirtyDaysAgo).length;
    const total = queueItems.length;
    const completed = queueItems.filter(i => i.status === "completed").length + published;
    const successRate = total + published > 0 ? Math.round((completed / (total + published)) * 100) : 0;
    setStats({ totalPublished: published, inQueue, draftsReady, monthlyMomentum: monthly, successRate });
  };

  const fetchQueue = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("content_queue" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as any as QueueItem[]) || []);
    setLoading(false);
  };

  const refreshAll = () => { fetchQueue(); fetchStats(); };

  const handleAddTopic = async () => {
    if (!newTopic.trim()) { toast.error("Enter a topic"); return; }
    try {
      const { error } = await supabase.functions.invoke("sovereign-blog-engine", {
        body: { action: "add_to_queue", topic: newTopic.trim(), featured_agent: newAgent },
      });
      if (error) throw error;
      onAuditLog("queue_topic", "content_queue", "", { topic: newTopic, agent: newAgent });
      toast.success("Topic queued");
      setNewTopic("");
      refreshAll();
    } catch (e: any) {
      toast.error(`Failed: ${e.message}`);
    }
  };

  const handleGenerate = async (item: QueueItem) => {
    setGenerating(item.id);
    try {
      const { data, error } = await supabase.functions.invoke("sovereign-blog-engine", {
        body: { action: "generate", queue_id: item.id },
      });
      if (error) throw error;
      onAuditLog("generate_blog", "content_queue", item.id, { topic: item.topic, agent: item.featured_agent });
      toast.success(`Draft generated for "${item.topic}"`);
      refreshAll();
    } catch (e: any) {
      toast.error(`Generation failed: ${e.message}`);
    }
    setGenerating(null);
  };

  const handlePublishAndPing = async (item: QueueItem) => {
    if (!item.result_post_id) { toast.error("Generate content first"); return; }
    setPublishing(item.id);
    try {
      // Publish via engine
      const { data, error } = await supabase.functions.invoke("sovereign-blog-engine", {
        body: { action: "publish", queue_id: item.id },
      });
      if (error) throw error;
      const slug = (data as any)?.slug;

      // Trigger Google Indexing + IndexNow
      if (slug) {
        await supabase.functions.invoke("ping-search-engines", {
          body: { action: "google_index_urls", urls: [`/blog/${slug}`] },
        });
        await supabase.functions.invoke("ping-search-engines", {
          body: { action: "indexnow", urls: [`/blog/${slug}`] },
        });
      }

      onAuditLog("publish_and_ping", "blog_post", item.result_post_id || "", { topic: item.topic, slug });
      toast.success(`Published & indexed: /blog/${slug}`);
      refreshAll();
    } catch (e: any) {
      toast.error(`Publish failed: ${e.message}`);
    }
    setPublishing(null);
  };

  const handleSetWebhook = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("sovereign-blog-engine", {
        body: { action: "set_webhook" },
      });
      if (error) throw error;
      toast.success("Telegram webhook set successfully!");
      onAuditLog("set_telegram_webhook", "system", "", data);
    } catch (e: any) {
      toast.error(`Webhook setup failed: ${e.message}`);
    }
  };

  const handleTestCron = async () => {
    setTestingCron(true);
    try {
      const { data, error } = await supabase.functions.invoke("sovereign-blog-engine", {
        body: { action: "dry_run" },
      });
      if (error) throw error;
      const checks = (data as any)?.checks;
      const allOk = checks?.db_topic?.ok && checks?.ai_reachable?.ok && checks?.telegram_ok?.ok;
      if (allOk) {
        toast.success("Triple-Lock passed! Check Telegram for confirmation.");
      } else {
        toast.warning("Some checks failed — see Telegram or console for details.");
      }
      onAuditLog("dry_run_test", "system", "", checks);
    } catch (e: any) {
      toast.error(`Dry run failed: ${e.message}`);
    }
    setTestingCron(false);
    fetchStats();
  };

  const handleForceHeartbeat = async () => {
    setForcingHeartbeat(true);
    try {
      const { data, error } = await supabase.functions.invoke("sovereign-blog-engine", {
        body: { action: "force_heartbeat" },
      });
      if (error) throw error;
      onAuditLog("force_heartbeat", "system", "", data);
      toast.success(`🚀 Heartbeat post generated! Agent: ${(data as any)?.agent}. Check Telegram.`);
      refreshAll();
    } catch (e: any) {
      toast.error(`Heartbeat failed: ${e.message}`);
    }
    setForcingHeartbeat(false);
  };

  return (
    <div className="space-y-6">
      {/* Performance Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Published", value: stats.totalPublished, icon: BarChart3, color: "text-emerald-400" },
          { label: "In Queue", value: stats.inQueue, icon: Layers, color: "text-amber-400" },
          { label: "Drafts Ready", value: stats.draftsReady, icon: FileCheck, color: "text-cyan-400" },
          { label: "30-Day Momentum", value: stats.monthlyMomentum, icon: TrendingUp, color: "text-purple-400" },
          { label: "Success Rate", value: `${stats.successRate}%`, icon: Activity, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              <span className="text-white/40 text-[10px] uppercase tracking-wider font-medium">{s.label}</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">{s.value}</span>
          </div>
        ))}
      </div>

      {/* System Controls */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-3">
        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
          <Webhook className="w-3.5 h-3.5" /> System Controls
        </h3>
        <p className="text-white/40 text-xs">Webhook setup & engine diagnostics.</p>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleSetWebhook} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
            <Webhook className="w-3.5 h-3.5 mr-1" /> Set Webhook
          </Button>
          <Button onClick={handleTestCron} size="sm" disabled={testingCron} className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
            {testingCron ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Zap className="w-3.5 h-3.5 mr-1" />}
            Test Cron (Dry Run)
          </Button>
          <Button onClick={handleForceHeartbeat} size="sm" disabled={forcingHeartbeat} className="bg-rose-600 hover:bg-rose-700 text-white text-xs">
            {forcingHeartbeat ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Heart className="w-3.5 h-3.5 mr-1" />}
            🚀 Force Heartbeat Now
          </Button>
        </div>
      </div>

      {/* Add Topic */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-3.5 h-3.5" /> Queue New Topic
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="e.g. How AI Transforms Customer Support in Newcastle"
            className="bg-white/5 border-white/10 text-white flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
          />
          <select
            value={newAgent}
            onChange={(e) => setNewAgent(e.target.value)}
            className="h-10 rounded-md border border-white/10 bg-white/5 text-white px-3 text-sm sm:w-36"
          >
            {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <Button onClick={handleAddTopic} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-4">
            <Send className="w-4 h-4 mr-1" /> Queue
          </Button>
        </div>
      </div>

      {/* Queue List */}
      <div>
        <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Intelligence Queue</h3>
        {loading ? (
          <p className="text-white/40 text-sm">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-8">No topics queued. Add your first one above.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.topic}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge className="text-[10px] bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                        <Bot className="w-3 h-3 mr-1" /> {item.featured_agent}
                      </Badge>
                      <Badge className={`text-[10px] ${
                        item.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      }`}>
                        {item.status === "completed" ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {item.status}
                      </Badge>
                      <span className="text-white/20 text-[10px]">
                        {new Date(item.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {item.status === "queued" && (
                    <Button
                      size="sm"
                      onClick={() => handleGenerate(item)}
                      disabled={generating === item.id}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
                    >
                      {generating === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Wand2 className="w-3.5 h-3.5 mr-1" />}
                      Generate Draft
                    </Button>
                  )}
                  {item.status === "completed" && item.result_post_id && (
                    <Button
                      size="sm"
                      onClick={() => handlePublishAndPing(item)}
                      disabled={publishing === item.id}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    >
                      {publishing === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Rocket className="w-3.5 h-3.5 mr-1" />}
                      Publish & Ping
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQueueTab;
