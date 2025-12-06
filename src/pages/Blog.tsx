import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, ChevronRight, Users, Rocket, ExternalLink, Sparkles, BookOpen, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import skoolBadge from "@/assets/skool-badge.png";

const SKOOL_LINK = "https://www.skool.com/sales-ai-business-marketing-7663/about?ref=002573a2eb4443249a5fce3b6607713d";
const SKOOL_BLUE = "#4B5FD1";

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
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

  const handleJoinCommunity = () => {
    window.open(SKOOL_LINK, "_blank", "noopener,noreferrer");
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
      <section className="py-16 md:py-20 px-4" style={{ background: `linear-gradient(135deg, ${SKOOL_BLUE}10 0%, white 50%, ${SKOOL_BLUE}05 100%)` }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ backgroundColor: `${SKOOL_BLUE}15`, color: SKOOL_BLUE }}
          >
            <BookOpen className="w-4 h-4" />
            Latest Insights
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Business Bots Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600"
          >
            Insights, tips, and stories about AI employees and business automation
          </motion.p>
        </div>
      </section>

      {/* Featured Community Card */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="relative rounded-3xl p-6 md:p-8 overflow-hidden cursor-pointer"
            style={{ 
              background: `linear-gradient(135deg, ${SKOOL_BLUE}15 0%, ${SKOOL_BLUE}05 100%)`,
              border: `1px solid ${SKOOL_BLUE}30`
            }}
            onClick={handleJoinCommunity}
          >
            <div className="absolute top-4 right-4 md:top-6 md:right-6">
              <motion.img 
                whileHover={{ rotate: 10, scale: 1.1 }}
                src={skoolBadge} 
                alt="Skool" 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full" 
              />
            </div>
            
            <span 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: `${SKOOL_BLUE}20`, color: SKOOL_BLUE }}
            >
              <Sparkles className="w-4 h-4" />
              Featured
            </span>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pr-20">
              Become an AI Solutions Expert
            </h2>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl">
              Join our free Skool community and develop cutting-edge AI skills for sales, marketing, and business automation.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/community");
                }}
                className="px-6 py-3 rounded-full text-white font-bold flex items-center gap-2"
                style={{ backgroundColor: SKOOL_BLUE }}
              >
                <Users className="w-5 h-5" />
                Learn More
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinCommunity();
                }}
                className="px-6 py-3 border rounded-full font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                style={{ borderColor: `${SKOOL_BLUE}40`, color: SKOOL_BLUE }}
              >
                Join Community
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {blogPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.01 }}
                onClick={() => handlePostClick(post.slug)}
                className="group bg-gray-50 rounded-2xl p-6 md:p-8 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-100"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span 
                    className="px-3 py-1 text-sm font-medium rounded-full"
                    style={{ backgroundColor: `${SKOOL_BLUE}15`, color: SKOOL_BLUE }}
                  >
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#4B5FD1] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2 font-medium" style={{ color: SKOOL_BLUE }}>
                  Read more <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: SKOOL_BLUE }} />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Want to Learn AI for Business?
            </h2>
            <p className="text-gray-600 mb-6">
              Join our free community and start your journey to becoming an AI Solutions Expert
            </p>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/community")}
              className="px-8 py-4 rounded-full text-white font-bold shadow-lg"
              style={{ backgroundColor: SKOOL_BLUE, boxShadow: `0 10px 40px ${SKOOL_BLUE}40` }}
            >
              Join Our Community
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50">
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
