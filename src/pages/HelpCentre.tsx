import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Book, MessageCircle, Video, FileText, ChevronRight, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Learn the basics of setting up your AI Employees",
    articles: ["How to set up your first AI Employee", "Quick start guide", "Understanding the dashboard", "Creating your account"]
  },
  {
    icon: MessageCircle,
    title: "Using AI Employees",
    description: "Tips and tricks for getting the most out of your team",
    articles: ["Customizing AI responses", "Training your AI Employee", "Best practices for prompts", "Managing multiple AI Employees"]
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides for common tasks",
    articles: ["Getting started video walkthrough", "Advanced features tutorial", "Integration setup guide", "Troubleshooting common issues"]
  },
  {
    icon: FileText,
    title: "Integrations",
    description: "Connect with your favourite tools and platforms",
    articles: ["Connecting to your CRM", "Email integration setup", "Slack and Teams integration", "API documentation overview"]
  }
];

const allArticles = [
  "How to set up your first AI Employee",
  "Connecting to your CRM",
  "Customizing AI responses",
  "Setting up automated workflows",
  "Understanding usage and billing",
  "Quick start guide",
  "Understanding the dashboard",
  "Training your AI Employee",
  "Best practices for prompts",
  "Managing multiple AI Employees",
  "Email integration setup",
  "Slack and Teams integration",
  "API documentation overview",
  "Troubleshooting common issues"
];

const HelpCentre = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return allArticles.slice(0, 5);
    return allArticles.filter(article =>
      article.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(cat =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.articles.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

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
          <h1 className="text-xl font-bold text-gray-900">Help Centre</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-600 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            How can we help?
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-lg border-0 focus:ring-2 focus:ring-white/50 outline-none"
            />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by category</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <category.icon className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                    <span className="text-cyan-600 text-sm font-medium">{category.articles} articles</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {searchQuery ? `Search results (${filteredArticles.length})` : "Popular articles"}
          </h2>
          <div className="bg-white rounded-2xl divide-y divide-gray-100">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <motion.button
                  key={article}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-gray-900 font-medium">{article}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </motion.button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No articles found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-8">Our support team is here to assist you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors">
              <Mail className="w-5 h-5" />
              Email Support
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
              <Phone className="w-5 h-5" />
              Call Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCentre;
