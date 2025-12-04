import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Insights, tips, and updates from the Business Bots UK team.
            </p>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "How AI is Transforming Small Business Operations",
                  excerpt: "Discover how artificial intelligence is helping small businesses compete with industry giants.",
                  date: "Dec 3, 2024",
                  category: "AI Trends"
                },
                {
                  title: "5 Ways to Automate Your Email Marketing",
                  excerpt: "Learn the top strategies for creating automated email campaigns that convert.",
                  date: "Nov 28, 2024",
                  category: "Email Marketing"
                },
                {
                  title: "The Future of Customer Support",
                  excerpt: "Why AI-powered support agents are becoming essential for modern businesses.",
                  date: "Nov 20, 2024",
                  category: "Customer Service"
                },
                {
                  title: "Scaling Your Sales Team with AI",
                  excerpt: "How to use AI agents to multiply your sales capacity without hiring.",
                  date: "Nov 15, 2024",
                  category: "Sales"
                }
              ].map((post, index) => (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-medium text-primary">{post.category}</span>
                  <h2 className="text-xl font-semibold text-foreground mt-2 mb-3">{post.title}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Blog;