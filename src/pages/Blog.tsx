import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const blogPosts = [
  {
    id: 1,
    title: "How AI Employees Are Transforming Small Businesses",
    excerpt: "Discover how small businesses are leveraging AI employees to automate tasks, reduce costs, and scale their operations without hiring additional staff.",
    date: "Dec 2, 2024",
    readTime: "5 min read",
    category: "AI Insights",
    slug: "ai-employees-transforming-small-businesses"
  },
  {
    id: 2,
    title: "The Future of Customer Support: AI vs Human",
    excerpt: "Exploring the balance between AI-powered support and human touch in creating exceptional customer experiences.",
    date: "Nov 28, 2024",
    readTime: "7 min read",
    category: "Customer Support",
    slug: "future-of-customer-support"
  },
  {
    id: 3,
    title: "5 Ways to Automate Your Email Marketing Today",
    excerpt: "Practical tips for setting up automated email campaigns that nurture leads and drive conversions on autopilot.",
    date: "Nov 22, 2024",
    readTime: "4 min read",
    category: "Marketing",
    slug: "automate-email-marketing"
  },
  {
    id: 4,
    title: "Building Your AI Team: A Step-by-Step Guide",
    excerpt: "Learn how to identify which AI employees your business needs and how to integrate them into your workflow.",
    date: "Nov 15, 2024",
    readTime: "8 min read",
    category: "Getting Started",
    slug: "building-your-ai-team"
  }
];

const Blog = () => {
  const navigate = useNavigate();

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </motion.button>
          <h1 className="text-xl font-bold text-gray-900">Blog</h1>
          <div className="w-16" />
        </div>
      </motion.header>

      {/* Hero */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 bg-gray-100 text-gray-700"
          >
            Latest Insights
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
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
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Insights, tips, and stories about AI employees and business automation
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Blog Posts */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            {blogPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handlePostClick(post.slug)}
                className="group p-6 md:p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span 
                    className="px-3 py-1 text-sm font-medium rounded-full"
                    style={{ backgroundColor: `${SKOOL_BLUE}10`, color: SKOOL_BLUE }}
                  >
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-sm">{post.date}</span>
                  <span className="text-gray-400 text-sm">·</span>
                  <span className="text-gray-400 text-sm">{post.readTime}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#4B5FD1] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                <span className="font-medium transition-colors" style={{ color: SKOOL_BLUE }}>
                  Read article →
                </span>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Business Bots UK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
