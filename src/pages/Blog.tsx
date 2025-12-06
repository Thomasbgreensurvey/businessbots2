import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, ChevronRight, Users, Rocket, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import skoolBadge from "@/assets/skool-badge.png";

const SKOOL_LINK = "https://www.skool.com/ai-business-marketing";

const blogPosts = [
  {
    id: "community",
    title: "Join Our Free AI Learning Community",
    excerpt: "Become an AI Solutions Expert with Business Bots UK. Access exclusive training, connect with industry professionals, and launch your career in AI-powered business development.",
    date: "Featured",
    readTime: "Free to Join",
    category: "Community",
    isFeatured: true
  },
  {
    id: 1,
    title: "How AI Employees Are Transforming Small Businesses",
    excerpt: "Discover how small businesses are leveraging AI employees to automate tasks, reduce costs, and scale their operations without hiring additional staff.",
    date: "Dec 2, 2024",
    readTime: "5 min read",
    category: "AI Insights"
  },
  {
    id: 2,
    title: "The Future of Customer Support: AI vs Human",
    excerpt: "Exploring the balance between AI-powered support and human touch in creating exceptional customer experiences.",
    date: "Nov 28, 2024",
    readTime: "7 min read",
    category: "Customer Support"
  },
  {
    id: 3,
    title: "5 Ways to Automate Your Email Marketing Today",
    excerpt: "Practical tips for setting up automated email campaigns that nurture leads and drive conversions on autopilot.",
    date: "Nov 22, 2024",
    readTime: "4 min read",
    category: "Marketing"
  },
  {
    id: 4,
    title: "Building Your AI Team: A Step-by-Step Guide",
    excerpt: "Learn how to identify which AI employees your business needs and how to integrate them into your workflow.",
    date: "Nov 15, 2024",
    readTime: "8 min read",
    category: "Getting Started"
  }
];

const Blog = () => {
  const navigate = useNavigate();

  const handlePostClick = (post: typeof blogPosts[0]) => {
    if (post.id === "community") {
      navigate("/community");
    } else {
      // For other posts, could navigate to individual post pages in the future
      navigate("/community");
    }
  };

  const handleJoinCommunity = () => {
    window.open(SKOOL_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-white">Blog</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900/60 via-purple-900/50 to-black py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Business Bots Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70"
          >
            Insights, tips, and stories about AI employees and business automation
          </motion.p>
        </div>
      </section>

      {/* Featured Community Card */}
      <section className="py-12 px-6 bg-gradient-to-b from-black via-amber-950/10 to-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-purple-500/10 border border-amber-500/30 rounded-3xl p-8 md:p-10 overflow-hidden"
          >
            <div className="absolute top-4 right-4 md:top-6 md:right-6">
              <img src={skoolBadge} alt="Skool" className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
            </div>
            
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
              <Rocket className="w-4 h-4" />
              Featured
            </span>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 pr-20">
              Become an AI Solutions Expert
            </h2>
            <p className="text-white/70 text-lg mb-6 max-w-2xl">
              Join our free Skool community and develop cutting-edge AI skills for sales, marketing, and business automation. Learn from experts with 50+ years of combined experience building high-growth businesses.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/community")}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-full flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Learn More
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinCommunity}
                className="px-6 py-3 border border-white/20 text-white font-semibold rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                Join Community
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Latest Articles</h2>
          <div className="space-y-6">
            {blogPosts.filter(post => post.id !== "community").map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handlePostClick(post)}
                className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-white/60 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-indigo-400 font-medium">
                  Read more <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Want to Learn AI for Business?
          </h2>
          <p className="text-white/60 mb-6">
            Join our free community and start your journey to becoming an AI Solutions Expert
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/community")}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-full"
          >
            Join Our Community
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default Blog;
