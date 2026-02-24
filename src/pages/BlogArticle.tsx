import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SEOSchema from "@/components/SEOSchema";
import SiteFooter from "@/components/SiteFooter";
import { trackPageView } from "@/lib/beacon";

const SKOOL_BLUE = "#4B5FD1";

// Location silos for blog geo-footer
const blogLocationSilos = {
  "North East AI Services": [
    { label: "AI Automation Newcastle", query: "AI Automation Newcastle" },
    { label: "AI Employees Gateshead", query: "AI Employees Gateshead" },
    { label: "AI Voice Agents Jesmond", query: "AI Voice Agents Jesmond" },
    { label: "Lead Gen Bots Gosforth", query: "Lead Gen Bots Gosforth" },
    { label: "AI Chatbots Sunderland", query: "AI Chatbots Sunderland" },
    { label: "Business Bots Durham", query: "Business Bots Durham" },
  ],
  "Nationwide": [
    { label: "AI Employees London", query: "AI Employees London" },
    { label: "AI Automation Manchester", query: "AI Automation Manchester" },
    { label: "AI Chatbots Birmingham", query: "AI Chatbots Birmingham" },
    { label: "AI Voice Agents Leeds", query: "AI Voice Agents Leeds" },
    { label: "AI Employees Edinburgh", query: "AI Employees Edinburgh" },
    { label: "AI Automation Glasgow", query: "AI Automation Glasgow" },
  ],
};

const BlogArticle = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (slug) trackPageView(`/blog/${slug}`);
  }, [slug]);

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, blog_categories(name)")
        .eq("slug", slug!)
        .eq("status", "published")
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Extract H2/H3 from HTML content for FAQ schema
  const extractFaqFromContent = (html: string) => {
    const faqItems: { question: string; answer: string }[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headings = doc.querySelectorAll("h2, h3");
    headings.forEach((heading) => {
      const question = heading.textContent?.trim();
      if (!question) return;
      // Collect text until the next heading
      let answer = "";
      let sibling = heading.nextElementSibling;
      while (sibling && !["H2", "H3"].includes(sibling.tagName)) {
        answer += sibling.textContent?.trim() + " ";
        sibling = sibling.nextElementSibling;
      }
      if (answer.trim()) {
        faqItems.push({ question, answer: answer.trim() });
      }
    });
    return faqItems;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Article not found</h1>
          <p className="text-gray-400 mb-8">The article you're looking for doesn't exist or has been moved.</p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/blog")}
            className="px-6 py-3 rounded-full font-medium text-white" style={{ backgroundColor: SKOOL_BLUE }}>
            Back to Blog
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const categoryName = (post as any).blog_categories?.name || "AI Insights";
  const publishedDate = post.published_at || post.created_at;
  const faqItems = post.content ? extractFaqFromContent(post.content) : [];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Dynamic SEO Schema */}
      <SEOSchema
        pageTitle={`${post.title} | Business Bots UK Blog`}
        pageDescription={post.excerpt || `Read about ${post.title} on the Business Bots UK blog.`}
        breadcrumbs={[
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
        articleData={{
          headline: post.title,
          datePublished: publishedDate,
          dateModified: post.updated_at,
          image: post.featured_image || undefined,
        }}
        faqItems={faqItems.length > 0 ? faqItems : undefined}
      />

      {/* Header */}
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Blog</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Featured Image */}
      {post.featured_image && (
        <section className="px-4 pt-8">
          <div className="max-w-3xl mx-auto">
            <img src={post.featured_image} alt={post.title} className="w-full rounded-2xl object-cover max-h-[400px] shadow-lg bg-black" />
          </div>
        </section>
      )}

      {/* Article Header */}
      <section className="py-12 md:py-20 px-4 bg-black">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: `${SKOOL_BLUE}10`, color: SKOOL_BLUE }}>
              {categoryName}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span>{new Date(publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Article Content — rendered as raw HTML */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div
              className="prose prose-lg prose-invert max-w-none blog-dark-override"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>
        </div>
      </section>

      {/* Geo-Dominance Footer for Blog */}
      <section className="py-12 px-4 bg-black/50 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6 text-center">AI Automation Services Across the UK</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(blogLocationSilos).map(([region, items]) => (
              <div key={region}>
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">{region}</h3>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link to={`/?location=${encodeURIComponent(item.query)}`} className="text-gray-500 text-sm hover:text-blue-400 transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">Quick Links</h3>
              <ul className="space-y-1">
                <li><Link to="/book-demo" className="text-gray-500 text-sm hover:text-blue-400 transition-colors">Book a Demo</Link></li>
                <li><Link to="/pricing" className="text-gray-500 text-sm hover:text-blue-400 transition-colors">Pricing Plans</Link></li>
                <li><Link to="/case-studies" className="text-gray-500 text-sm hover:text-blue-400 transition-colors">Case Studies</Link></li>
                <li><Link to="/community" className="text-gray-500 text-sm hover:text-blue-400 transition-colors">Join Community</Link></li>
                <li><Link to="/contact" className="text-gray-500 text-sm hover:text-blue-400 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default BlogArticle;
