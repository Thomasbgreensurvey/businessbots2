import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const blogPosts = [
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Blog</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 py-20 px-6">
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
            className="text-xl text-white/80"
          >
            Insights, tips, and stories about AI employees and business automation
          </motion.p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
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
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-indigo-600 font-medium">
                  Read more <ChevronRight className="w-4 h-4" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
