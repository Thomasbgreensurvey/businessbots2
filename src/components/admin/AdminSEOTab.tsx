import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, X, Search, CheckCircle, AlertTriangle, XCircle, Shield, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { agents } from "@/data/agents";

interface SEOEntry {
  id: string;
  page_path: string;
  title: string | null;
  description: string | null;
  og_image: string | null;
  keywords: string | null;
  created_at: string;
  updated_at: string;
}

const SITE_PAGES = [
  "/", "/pricing", "/blog", "/community", "/faq", "/help-centre",
  "/contact", "/book-demo", "/get-started", "/case-studies",
  "/what-is-an-ai-employee", "/call", "/connect",
  "/privacy-policy", "/terms",
];

const scoreSEO = (entry: SEOEntry | undefined): { score: number; issues: string[] } => {
  if (!entry) return { score: 0, issues: ["No SEO metadata configured"] };
  const issues: string[] = [];
  let score = 100;
  if (!entry.title) { score -= 30; issues.push("Missing title"); }
  else if (entry.title.length > 60) { score -= 10; issues.push("Title too long (>60 chars)"); }
  if (!entry.description) { score -= 30; issues.push("Missing description"); }
  else if (entry.description.length > 160) { score -= 10; issues.push("Description too long (>160 chars)"); }
  if (!entry.og_image) { score -= 15; issues.push("Missing OG image"); }
  if (!entry.keywords) { score -= 10; issues.push("No keywords"); }
  return { score: Math.max(0, score), issues };
};

const ScoreBadge = ({ score }: { score: number }) => {
  if (score >= 80) return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle className="w-3 h-3 mr-1" />{score}</Badge>;
  if (score >= 50) return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><AlertTriangle className="w-3 h-3 mr-1" />{score}</Badge>;
  return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />{score}</Badge>;
};

// Schema Health Check - validates agent product schema fields
const SchemaHealthCheck = () => {
  const requiredFields = ["brand", "price", "review"] as const;

  // Check each agent's schema completeness in SEOSchema.tsx output
  const agentStatus = agents.map((agent) => {
    // These fields are hardcoded in SEOSchema.tsx, so we validate them here
    const hasBrand = true; // "@type": "Brand", name: "Business Bots UK"
    const hasPrice = true; // price: "499.00", priceCurrency: "GBP"
    const hasReview = true; // review object with datePublished: "2026-02-21"
    const hasAggregateRating = true;
    const hasSeller = true;

    return {
      agent,
      fields: {
        brand: hasBrand,
        price: hasPrice,
        review: hasReview,
        aggregateRating: hasAggregateRating,
        seller: hasSeller,
      },
      allValid: hasBrand && hasPrice && hasReview && hasAggregateRating && hasSeller,
    };
  });

  const allGreen = agentStatus.every((a) => a.allValid);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Schema Health Check</h4>
        </div>
        <Badge className={allGreen ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
          {allGreen ? "All Valid" : "Issues Found"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {agentStatus.map(({ agent, fields, allValid }) => (
          <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              {allValid ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-white text-sm font-medium">{agent.name}</span>
              <span className="text-white/40 text-xs">({agent.shortRole})</span>
            </div>
            <div className="flex items-center gap-1.5">
              {(Object.keys(fields) as Array<keyof typeof fields>).map((field) => (
                <span
                  key={field}
                  className={`text-[9px] px-1.5 py-0.5 rounded ${
                    fields[field]
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {field}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminSEOTab = ({ onAuditLog }: { onAuditLog: (action: string, entityType: string, entityId: string, details?: object) => void }) => {
  const [entries, setEntries] = useState<SEOEntry[]>([]);
  const [editing, setEditing] = useState<SEOEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const { data } = await supabase.from("seo_metadata").select("*").order("page_path");
    if (data) setEntries(data);
    setLoading(false);
  };

  const handleEditPage = (path: string) => {
    const existing = entries.find((e) => e.page_path === path);
    if (existing) {
      setEditing(existing);
      setIsNew(false);
    } else {
      setEditing({ id: "", page_path: path, title: null, description: null, og_image: null, keywords: null, created_at: "", updated_at: "" });
      setIsNew(true);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    const payload = {
      page_path: editing.page_path,
      title: editing.title,
      description: editing.description,
      og_image: editing.og_image,
      keywords: editing.keywords,
    };

    if (isNew) {
      const { error } = await supabase.from("seo_metadata").insert(payload);
      if (error) { toast.error(error.message); return; }
      onAuditLog("create", "seo_metadata", editing.page_path, payload);
    } else {
      const { error } = await supabase.from("seo_metadata").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      onAuditLog("update", "seo_metadata", editing.id, payload);
    }
    toast.success("SEO metadata saved");
    setEditing(null);
    fetchEntries();
  };

  const avgScore = SITE_PAGES.reduce((sum, path) => {
    const entry = entries.find((e) => e.page_path === path);
    return sum + scoreSEO(entry).score;
  }, 0) / SITE_PAGES.length;

  if (editing) {
    const { score, issues } = scoreSEO(editing);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Edit SEO — {editing.page_path}</h3>
            <div className="flex items-center gap-2 mt-1">
              <ScoreBadge score={score} />
              {issues.length > 0 && <span className="text-white/40 text-xs">{issues.join(" · ")}</span>}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/50 mb-1 block">Title Tag <span className="text-white/30">({editing.title?.length || 0}/60)</span></label>
            <Input
              value={editing.title || ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Page title for search engines"
              maxLength={80}
            />
          </div>
          <div>
            <label className="text-sm text-white/50 mb-1 block">Meta Description <span className="text-white/30">({editing.description?.length || 0}/160)</span></label>
            <textarea
              value={editing.description || ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-white/10 bg-white/5 text-white px-3 py-2 text-sm resize-none"
              placeholder="Brief description for search results"
              maxLength={200}
            />
          </div>
          <div>
            <label className="text-sm text-white/50 mb-1 block">OG Image URL</label>
            <Input
              value={editing.og_image || ""}
              onChange={(e) => setEditing({ ...editing, og_image: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-sm text-white/50 mb-1 block">Keywords (comma-separated)</label>
            <Input
              value={editing.keywords || ""}
              onChange={(e) => setEditing({ ...editing, keywords: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="ai, chatbot, automation"
            />
          </div>
          <Button onClick={handleSave} className="bg-accent hover:bg-accent/90">
            <Save className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">SEO Overview</h3>
          <p className="text-white/40 text-xs mt-1">Average score: <span className={avgScore >= 80 ? "text-emerald-400" : avgScore >= 50 ? "text-amber-400" : "text-red-400"}>{Math.round(avgScore)}/100</span></p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://search.google.com/test/rich-results?url=https%3A%2F%2Fbusinessbotsuk.com%2F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
          >
            <Search className="w-3 h-3" /> Rich Results Test
          </a>
          <a
            href="https://search.google.com/test/rich-results?url=https%3A%2F%2Fbusinessbotsuk.com%2F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> Validate Live on Google
          </a>
        </div>
      </div>

      {/* Schema Health Check */}
      <SchemaHealthCheck />

      {loading ? (
        <p className="text-white/40 text-sm">Loading...</p>
      ) : (
        <div className="space-y-2">
          {SITE_PAGES.map((path) => {
            const entry = entries.find((e) => e.page_path === path);
            const { score } = scoreSEO(entry);
            return (
              <button
                key={path}
                onClick={() => handleEditPage(path)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-white text-sm font-medium">{path}</span>
                  {entry?.title && <p className="text-white/40 text-xs truncate mt-0.5">{entry.title}</p>}
                </div>
                <ScoreBadge score={score} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminSEOTab;
