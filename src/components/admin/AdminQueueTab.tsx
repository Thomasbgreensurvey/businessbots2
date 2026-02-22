import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Wand2, Rocket, Loader2, Bot, Clock, CheckCircle, Send } from "lucide-react";
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

const AdminQueueTab = ({ onAuditLog }: { onAuditLog: (action: string, entityType: string, entityId: string, details?: object) => void }) => {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState("");
  const [newAgent, setNewAgent] = useState("Sprout");
  const [generating, setGenerating] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => { fetchQueue(); }, []);

  const fetchQueue = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("content_queue" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as any as QueueItem[]) || []);
    setLoading(false);
  };

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
      fetchQueue();
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
      fetchQueue();
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
      fetchQueue();
    } catch (e: any) {
      toast.error(`Publish failed: ${e.message}`);
    }
    setPublishing(null);
  };

  return (
    <div className="space-y-6">
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
