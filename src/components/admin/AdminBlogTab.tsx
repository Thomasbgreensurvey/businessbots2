import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, X, Tag, Eye, Upload, Wand2, Loader2, Globe } from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: string;
  category_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Category { id: string; name: string; slug: string; }
interface BlogTag { id: string; name: string; slug: string; }

const AdminBlogTab = ({ onAuditLog }: { onAuditLog: (action: string, entityType: string, entityId: string, details?: object) => void }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [bulkIndexing, setBulkIndexing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [postsRes, catsRes, tagsRes, viewsRes] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_categories").select("*").order("name"),
      supabase.from("blog_tags").select("*").order("name"),
      supabase.from("audit_logs").select("entity_id").eq("action", "blog_view"),
    ]);
    if (postsRes.data) setPosts(postsRes.data);
    if (catsRes.data) setCategories(catsRes.data);
    if (tagsRes.data) setTags(tagsRes.data);
    
    const counts: Record<string, number> = {};
    (viewsRes.data || []).forEach((v: any) => {
      if (v.entity_id) counts[v.entity_id] = (counts[v.entity_id] || 0) + 1;
    });
    setViewCounts(counts);
    setLoading(false);
  };

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const SITE_PAGES = [
    "/", "/pricing", "/blog", "/community", "/faq", "/help-centre",
    "/contact", "/book-demo", "/get-started", "/case-studies",
    "/what-is-an-ai-employee", "/call", "/connect",
  ];

  const handleBulkIndex = async () => {
    setBulkIndexing(true);
    try {
      // Gather all published blog slugs
      const { data: published } = await supabase
        .from("blog_posts")
        .select("slug")
        .eq("status", "published");
      const blogUrls = (published || []).map((p) => `/blog/${p.slug}`);
      const allUrls = [...SITE_PAGES, ...blogUrls];

      // Google Indexing API batch
      await supabase.functions.invoke("ping-search-engines", {
        body: { action: "google_index_urls", urls: allUrls },
      });
      // IndexNow batch
      await supabase.functions.invoke("ping-search-engines", {
        body: { action: "indexnow", urls: allUrls },
      });

      onAuditLog("bulk_index", "seo", "site", { urlCount: allUrls.length });
      toast.success(`🚀 Bulk indexed ${allUrls.length} URLs to Google & Bing`);
    } catch (e: any) {
      toast.error(`Bulk index failed: ${e.message}`);
    }
    setBulkIndexing(false);
  };

  const handleNew = () => {
    setEditing({ id: "", title: "", slug: "", content: "", excerpt: null, featured_image: null, status: "draft", category_id: null, published_at: null, created_at: "", updated_at: "" });
    setSelectedTags([]);
    setIsNew(true);
  };

  const handleEdit = async (post: BlogPost) => {
    setEditing(post);
    setIsNew(false);
    const { data } = await supabase.from("blog_post_tags").select("tag_id").eq("post_id", post.id);
    setSelectedTags(data?.map((t) => t.tag_id) || []);
  };

  // Auto-ping search engines when publishing
  const autoPingSearchEngines = async (slug: string) => {
    try {
      // Google Indexing API
      await supabase.functions.invoke("ping-search-engines", {
        body: { action: "google_index_urls", urls: [`/blog/${slug}`] },
      });
      // IndexNow
      await supabase.functions.invoke("ping-search-engines", {
        body: { action: "indexnow", urls: [`/blog/${slug}`] },
      });
      toast.success("🚀 Auto-indexed to Google & Bing", { description: `/blog/${slug}` });
    } catch {
      toast.warning("Post saved but auto-index failed");
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    const slug = editing.slug || slugify(editing.title);
    const isPublishing = editing.status === "published";
    const payload = {
      title: editing.title, slug, content: editing.content, excerpt: editing.excerpt,
      featured_image: editing.featured_image, status: editing.status, category_id: editing.category_id,
      published_at: isPublishing ? editing.published_at || new Date().toISOString() : editing.published_at,
    };

    if (isNew) {
      const { data, error } = await supabase.from("blog_posts").insert(payload).select().single();
      if (error) { toast.error(error.message); return; }
      if (data && selectedTags.length > 0) {
        await supabase.from("blog_post_tags").insert(selectedTags.map((t) => ({ post_id: data.id, tag_id: t })));
      }
      onAuditLog("create", "blog_post", data?.id || "", { title: editing.title });
      toast.success("Post created");
      if (isPublishing) await autoPingSearchEngines(slug);
    } else {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      await supabase.from("blog_post_tags").delete().eq("post_id", editing.id);
      if (selectedTags.length > 0) {
        await supabase.from("blog_post_tags").insert(selectedTags.map((t) => ({ post_id: editing.id, tag_id: t })));
      }
      onAuditLog("update", "blog_post", editing.id, { title: editing.title });
      toast.success("Post updated");
      if (isPublishing) await autoPingSearchEngines(slug);
    }
    setEditing(null);
    setIsNew(false);
    fetchAll();
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    await supabase.from("blog_posts").delete().eq("id", post.id);
    onAuditLog("delete", "blog_post", post.id, { title: post.title });
    toast.success("Post deleted");
    fetchAll();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) {
      toast.error(`Upload failed: ${error.message}`);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(path);
    setEditing({ ...editing, featured_image: urlData.publicUrl });
    toast.success("Image uploaded");
    setUploading(false);
  };

  const handleGenerateContent = async () => {
    if (!editing?.title) { toast.error("Enter a title first"); return; }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-content", {
        body: { title: editing.title },
      });
      if (error) throw error;
      if (data?.content) {
        setEditing({ ...editing, content: data.content });
        toast.success("Content generated — review and edit before publishing");
      }
    } catch (e: any) {
      toast.error(`Generation failed: ${e.message}`);
    }
    setGenerating(false);
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const { error } = await supabase.from("blog_categories").insert({ name: newCategory.trim(), slug: slugify(newCategory) });
    if (error) { toast.error(error.message); return; }
    onAuditLog("create", "blog_category", "", { name: newCategory });
    setNewCategory("");
    fetchAll();
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    const { error } = await supabase.from("blog_tags").insert({ name: newTag.trim(), slug: slugify(newTag) });
    if (error) { toast.error(error.message); return; }
    onAuditLog("create", "blog_tag", "", { name: newTag });
    setNewTag("");
    fetchAll();
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{isNew ? "New Post" : "Edit Post"}</h3>
          <Button variant="ghost" size="sm" onClick={() => { setEditing(null); setIsNew(false); }} className="text-white/40 hover:text-white">
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-1 block">Title</label>
            <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: slugify(e.target.value) })} className="bg-white/5 border-white/10 text-white" placeholder="Post title" />
          </div>
          <div>
            <label className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-1 block">Slug</label>
            <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <label className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-1 block">Excerpt</label>
            <Input value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="Short description" />
          </div>
          
          {/* Featured Image Upload */}
          <div>
            <label className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-1 block">Featured Image</label>
            <div className="flex gap-2 items-center">
              <Input value={editing.featured_image || ""} onChange={(e) => setEditing({ ...editing, featured_image: e.target.value })} className="bg-white/5 border-white/10 text-white flex-1" placeholder="URL or upload →" />
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="border-white/10 text-white shrink-0">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              </Button>
            </div>
            {editing.featured_image && (
              <img src={editing.featured_image} alt="Preview" className="mt-2 rounded-lg h-32 object-cover border border-white/10" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-1 block">Status</label>
              <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="w-full h-10 rounded-md border border-white/10 bg-white/5 text-white px-3 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-1 block">Category</label>
              <select value={editing.category_id || ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className="w-full h-10 rounded-md border border-white/10 bg-white/5 text-white px-3 text-sm">
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-1 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button key={tag.id} onClick={() => setSelectedTags((prev) => prev.includes(tag.id) ? prev.filter((t) => t !== tag.id) : [...prev, tag.id])}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedTags.includes(tag.id) ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/40" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] text-emerald-400/60 uppercase tracking-wider">Content (HTML/Tailwind)</label>
              <Button size="sm" variant="outline" onClick={handleGenerateContent} disabled={generating} className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs">
                {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Wand2 className="w-3.5 h-3.5 mr-1" />}
                AI Generate
              </Button>
            </div>
            <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={16}
              className="w-full rounded-md border border-white/10 bg-white/5 text-white px-3 py-2 text-sm font-mono resize-y" placeholder="Write HTML/Tailwind content or click AI Generate..." />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Save className="w-4 h-4 mr-1" /> {editing.status === "published" ? "Publish & Index" : "Save Draft"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Blog Engagement</h3>
        <div className="flex items-center gap-2">
          <Button onClick={handleBulkIndex} size="sm" disabled={bulkIndexing} className="bg-blue-600 hover:bg-blue-700 text-white">
            {bulkIndexing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Globe className="w-4 h-4 mr-1" />}
            {bulkIndexing ? "Indexing..." : "Bulk Index Site"}
          </Button>
          <Button onClick={handleNew} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-1" /> New Post
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-white/40 text-sm text-center py-8">No posts yet. Create your first one!</p>
      ) : (
        <>
        {/* Desktop */}
        <div className="rounded-xl border border-white/10 overflow-hidden hidden md:block">
          <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Post Title</th>
                  <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Views</th>
                  <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Published</th>
                  <th className="text-right px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-white text-xs font-medium">{post.title}</div>
                      <div className="text-white/30 text-[10px] font-mono mt-0.5">/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] ${post.status === "published" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : post.status === "draft" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-white/10 text-white/40"}`}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-white/60 text-xs font-mono">
                        <Eye className="w-3 h-3 text-emerald-400/60" />
                        {viewCounts[post.slug] || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs font-mono">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(post)} className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(post)} className="p-1.5 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-white text-xs font-medium">{post.title}</div>
                  <div className="text-white/30 text-[10px] font-mono mt-0.5">/{post.slug}</div>
                </div>
                <Badge className={`text-[10px] shrink-0 ${post.status === "published" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : post.status === "draft" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-white/10 text-white/40"}`}>
                  {post.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-white/60 text-xs font-mono">
                  <Eye className="w-3 h-3 text-emerald-400/60" /> {viewCounts[post.slug] || 0} views
                </span>
                <span className="text-white/40 text-xs font-mono">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/5">
                <button onClick={() => handleEdit(post)} className="p-2 min-h-[44px] min-w-[44px] rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(post)} className="p-2 min-h-[44px] min-w-[44px] rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {/* Categories & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
        <div>
          <h4 className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-3">Categories</h4>
          <div className="flex gap-2 mb-3">
            <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category" className="bg-white/5 border-white/10 text-white text-sm" onKeyDown={(e) => e.key === "Enter" && addCategory()} />
            <Button size="sm" variant="outline" onClick={addCategory} className="border-white/10 text-white shrink-0"><Plus className="w-3.5 h-3.5" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => <Badge key={c.id} variant="outline" className="text-white/60 border-white/20">{c.name}</Badge>)}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-3">Tags</h4>
          <div className="flex gap-2 mb-3">
            <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="New tag" className="bg-white/5 border-white/10 text-white text-sm" onKeyDown={(e) => e.key === "Enter" && addTag()} />
            <Button size="sm" variant="outline" onClick={addTag} className="border-white/10 text-white shrink-0"><Plus className="w-3.5 h-3.5" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => <Badge key={t.id} variant="outline" className="text-white/60 border-white/20"><Tag className="w-3 h-3 mr-1" />{t.name}</Badge>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogTab;
