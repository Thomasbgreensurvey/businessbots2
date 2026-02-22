import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Eye } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteFooter from "@/components/SiteFooter";

const PREVIEW_TOKEN = "sov-exec-preview-2026";

const PreviewArticle = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Set noindex meta tag
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const isAuthorized = token === PREVIEW_TOKEN;

  const { data: post, isLoading } = useQuery({
    queryKey: ["preview-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug && isAuthorized,
  });

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">Invalid or missing preview token.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Draft not found</h1>
          <p className="text-gray-500">This preview link may have expired or the post was removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* DRAFT PREVIEW Banner */}
      <div className="sticky top-0 z-50 bg-amber-500 text-black py-2 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-sm font-bold tracking-wide">
          <Eye className="w-4 h-4" />
          DRAFT PREVIEW — NOT PUBLISHED
          <Eye className="w-4 h-4" />
        </div>
      </div>

      {/* Header */}
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="sticky top-[36px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Blog</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Featured Image */}
      {post.featured_image && (
        <section className="px-4 pt-8">
          <div className="max-w-3xl mx-auto">
            <img src={post.featured_image} alt={post.title} className="w-full rounded-2xl object-cover max-h-[400px] shadow-lg" />
          </div>
        </section>
      )}

      {/* Article Header */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 bg-amber-100 text-amber-800">
              Draft — {post.status}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-500">
              <span>Created {new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Article Content */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default PreviewArticle;
