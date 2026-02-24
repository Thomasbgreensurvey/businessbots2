import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import blogStudio from "@/assets/blog-studio.jpeg";
import OptimizedImage from "@/components/OptimizedImage";
const SKOOL_BLUE = "#4B5FD1";

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const Blog = () => {
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, published_at, status, category_id, blog_categories(name)")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </motion.button>
          <h1 className="text-xl font-bold text-white">Blog</h1>
          <div className="w-16" />
        </div>
      </motion.header>

      {/* Hero */}
      <section className="py-16 md:py-24 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 bg-white/10 text-gray-300"
          >
            Latest Insights
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Business Bots{" "}
            <span className="font-dancing-script italic" style={{ color: SKOOL_BLUE }}>
              Blog
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Insights, tips, and stories about AI employees and business automation
          </motion.p>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <OptimizedImage 
              src={blogStudio}
              alt="Business Bots UK studio with AI assistants"
              className="w-full h-auto object-cover"
              width={896}
              height={504}
            />
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Blog Posts */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : !posts?.length ? (
            <p className="text-center text-gray-500 py-20">No posts published yet. Check back soon!</p>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handlePostClick(post.slug)}
                  className="group p-6 md:p-8 rounded-2xl border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 cursor-pointer bg-white/5"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {(post as any).blog_categories?.name && (
                      <span 
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{ backgroundColor: `${SKOOL_BLUE}10`, color: SKOOL_BLUE }}
                      >
                        {(post as any).blog_categories.name}
                      </span>
                    )}
                    {post.published_at && (
                      <span className="text-gray-500 text-sm">
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#4B5FD1] transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-400 mb-4 leading-relaxed">{post.excerpt}</p>
                  )}
                  <span className="font-medium transition-colors" style={{ color: SKOOL_BLUE }}>
                    Read article →
                  </span>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Business Bots UK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
