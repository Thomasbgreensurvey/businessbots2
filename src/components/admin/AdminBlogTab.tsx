import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye, Save, X, Tag } from "lucide-react";
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

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

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

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [postsRes, catsRes, tagsRes] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_categories").select("*").order("name"),
      supabase.from("blog_tags").select("*").order("name"),
    ]);
    if (postsRes.data) setPosts(postsRes.data);
    if (catsRes.data) setCategories(catsRes.data);
    if (tagsRes.data) setTags(tagsRes.data);
    setLoading(false);
  };

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleNew = () => {
    setEditing({
      id: "",
      title: "",
      slug: "",
      content: "",
      excerpt: null,
      featured_image: null,
      status: "draft",
      category_id: null,
      published_at: null,
      created_at: "",
      updated_at: "",
    });
    setSelectedTags([]);
    setIsNew(true);
  };

  const handleEdit = async (post: BlogPost) => {
    setEditing(post);
    setIsNew(false);
    const { data } = await supabase
      .from("blog_post_tags")
      .select("tag_id")
      .eq("post_id", post.id);
    setSelectedTags(data?.map((t) => t.tag_id) || []);
  };

  const handleSave = async () => {
    if (!editing) return;
    const slug = editing.slug || slugify(editing.title);
    const payload = {
      title: editing.title,
      slug,
      content: editing.content,
      excerpt: editing.excerpt,
      featured_image: editing.featured_image,
      status: editing.status,
      category_id: editing.category_id,
      published_at: editing.status === "published" ? editing.published_at || new Date().toISOString() : editing.published_at,
    };

    if (isNew) {
      const { data, error } = await supabase.from("blog_posts").insert(payload).select().single();
      if (error) { toast.error(error.message); return; }
      if (data && selectedTags.length > 0) {
        await supabase.from("blog_post_tags").insert(selectedTags.map((t) => ({ post_id: data.id, tag_id: t })));
      }
      onAuditLog("create", "blog_post", data?.id || "", { title: editing.title });
      toast.success("Post created");
    } else {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      await supabase.from("blog_post_tags").delete().eq("post_id", editing.id);
      if (selectedTags.length > 0) {
        await supabase.from("blog_post_tags").insert(selectedTags.map((t) => ({ post_id: editing.id, tag_id: t })));
      }
      onAuditLog("update", "blog_post", editing.id, { title: editing.title });
      toast.success("Post updated");
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
          <h3 className="text-lg font-semibold text-white">{isNew ? "New Post" : "Edit Post"}</h3>
          <Button variant="ghost" size="sm" onClick={() => { setEditing(null); setIsNew(false); }}>
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/50 mb-1 block">Title</label>
            <Input
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: slugify(e.target.value) })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Post title"
            />
          </div>
          <div>
            <label className="text-sm text-white/50 mb-1 block">Slug</label>
            <Input
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-white/50 mb-1 block">Excerpt</label>
            <Input
              value={editing.excerpt || ""}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Short description"
            />
          </div>
          <div>
            <label className="text-sm text-white/50 mb-1 block">Featured Image URL</label>
            <Input
              value={editing.featured_image || ""}
              onChange={(e) => setEditing({ ...editing, featured_image: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/50 mb-1 block">Status</label>
              <select
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                className="w-full h-10 rounded-md border border-white/10 bg-white/5 text-white px-3 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-white/50 mb-1 block">Category</label>
              <select
                value={editing.category_id || ""}
                onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}
                className="w-full h-10 rounded-md border border-white/10 bg-white/5 text-white px-3 text-sm"
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-white/50 mb-1 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag.id) ? prev.filter((t) => t !== tag.id) : [...prev, tag.id]
                    )
                  }
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag.id)
                      ? "bg-accent text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-white/50 mb-1 block">Content (Markdown)</label>
            <textarea
              value={editing.content}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              rows={16}
              className="w-full rounded-md border border-white/10 bg-white/5 text-white px-3 py-2 text-sm font-mono resize-y"
              placeholder="Write your post content here..."
            />
          </div>
          <Button onClick={handleSave} className="bg-accent hover:bg-accent/90">
            <Save className="w-4 h-4 mr-1" /> Save Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Blog Posts</h3>
        <Button onClick={handleNew} size="sm" className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-1" /> New Post
        </Button>
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-white/40 text-sm text-center py-8">No posts yet. Create your first one!</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium truncate">{post.title}</span>
                  <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-[10px] shrink-0">
                    {post.status}
                  </Badge>
                </div>
                <p className="text-white/40 text-xs truncate">/{post.slug}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-3">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white" onClick={() => handleEdit(post)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-red-400" onClick={() => handleDelete(post)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Categories & Tags management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
        <div>
          <h4 className="text-sm font-medium text-white/70 mb-3">Categories</h4>
          <div className="flex gap-2 mb-3">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
              className="bg-white/5 border-white/10 text-white text-sm"
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <Button size="sm" variant="outline" onClick={addCategory} className="border-white/10 text-white shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Badge key={c.id} variant="outline" className="text-white/60 border-white/20">{c.name}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-white/70 mb-3">Tags</h4>
          <div className="flex gap-2 mb-3">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag"
              className="bg-white/5 border-white/10 text-white text-sm"
              onKeyDown={(e) => e.key === "Enter" && addTag()}
            />
            <Button size="sm" variant="outline" onClick={addTag} className="border-white/10 text-white shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge key={t.id} variant="outline" className="text-white/60 border-white/20">
                <Tag className="w-3 h-3 mr-1" />{t.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogTab;
