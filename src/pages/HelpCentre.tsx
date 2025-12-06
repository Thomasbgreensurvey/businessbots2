import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SKOOL_BLUE = "#4B5FD1";

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const categories = [
  {
    title: "Getting Started",
    description: "Learn the basics of setting up your AI Employees",
    articles: [
      { title: "How to set up your first AI Employee", slug: "setup-first-ai-employee" },
      { title: "Quick start guide", slug: "quick-start-guide" },
      { title: "Understanding the dashboard", slug: "understanding-dashboard" },
      { title: "Creating your account", slug: "creating-account" }
    ]
  },
  {
    title: "Using AI Employees",
    description: "Tips and tricks for getting the most out of your team",
    articles: [
      { title: "Customizing AI responses", slug: "customizing-responses" },
      { title: "Training your AI Employee", slug: "training-ai-employee" },
      { title: "Best practices for prompts", slug: "best-practices-prompts" },
      { title: "Managing multiple AI Employees", slug: "managing-multiple-employees" }
    ]
  },
  {
    title: "Integrations",
    description: "Connect with your favourite tools and platforms",
    articles: [
      { title: "Connecting to your CRM", slug: "connecting-crm" },
      { title: "Email integration setup", slug: "email-integration" },
      { title: "Slack and Teams integration", slug: "slack-teams-integration" },
      { title: "API documentation overview", slug: "api-documentation" }
    ]
  },
  {
    title: "Billing & Plans",
    description: "Manage your subscription and payments",
    articles: [
      { title: "Understanding usage and billing", slug: "usage-billing" },
      { title: "Upgrading your plan", slug: "upgrading-plan" },
      { title: "Payment methods", slug: "payment-methods" },
      { title: "Cancellation policy", slug: "cancellation-policy" }
    ]
  },
  {
    title: "Security & Privacy",
    description: "Keep your data safe and secure",
    articles: [
      { title: "Data protection practices", slug: "data-protection" },
      { title: "Two-factor authentication", slug: "two-factor-auth" },
      { title: "Privacy settings", slug: "privacy-settings" },
      { title: "Compliance and certifications", slug: "compliance" }
    ]
  },
  {
    title: "Troubleshooting",
    description: "Solutions for common issues",
    articles: [
      { title: "AI Employee not responding", slug: "not-responding" },
      { title: "Integration connection failed", slug: "connection-failed" },
      { title: "Unexpected responses", slug: "unexpected-responses" },
      { title: "Performance issues", slug: "performance-issues" }
    ]
  }
];

const popularArticles = [
  { title: "How to set up your first AI Employee", category: "Getting Started", slug: "setup-first-ai-employee" },
  { title: "Connecting to your CRM", category: "Integrations", slug: "connecting-crm" },
  { title: "Customizing AI responses", category: "Using AI Employees", slug: "customizing-responses" },
  { title: "Understanding usage and billing", category: "Billing & Plans", slug: "usage-billing" }
];

const HelpCentre = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const allArticles = useMemo(() => {
    return categories.flatMap(cat => 
      cat.articles.map(article => ({ ...article, category: cat.title }))
    );
  }, []);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return popularArticles;
    return allArticles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allArticles]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(cat =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.articles.some(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const handleArticleClick = (slug: string) => {
    navigate(`/help-centre/article/${slug}`);
  };

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@businessbotsuk.com";
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
          <h1 className="text-xl font-bold text-gray-900">Help Centre</h1>
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
            We're here to help
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            How can we{" "}
            <span className="font-dancing-script italic" style={{ color: SKOOL_BLUE }}>
              help?
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-lg border border-gray-200 focus:border-[#4B5FD1] focus:ring-2 focus:ring-[#4B5FD1]/20 outline-none transition-all bg-white"
            />
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {filteredCategories.map((category) => (
              <motion.div
                key={category.title}
                variants={fadeInUp}
                className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors"
              >
                <motion.button
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setExpandedCategory(expandedCategory === category.title ? null : category.title)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {category.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{category.description}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedCategory === category.title ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown 
                      className={`w-5 h-5 transition-colors ${
                        expandedCategory === category.title ? 'text-[#4B5FD1]' : 'text-gray-400'
                      }`}
                    />
                  </motion.div>
                </motion.button>

                {/* Articles */}
                <motion.div
                  initial={false}
                  animate={{ 
                    height: expandedCategory === category.title ? 'auto' : 0,
                    opacity: expandedCategory === category.title ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-2">
                    {category.articles.map((article) => (
                      <motion.button
                        key={article.slug}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleArticleClick(article.slug)}
                        className="w-full flex items-center justify-between p-4 text-left rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-700">{article.title}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-12 px-4 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {searchQuery ? `Search Results (${filteredArticles.length})` : "Popular Articles"}
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <motion.button
                  key={article.slug}
                  whileHover={{ backgroundColor: 'rgba(75, 95, 209, 0.03)' }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleArticleClick(article.slug)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors"
                >
                  <div>
                    <span className="text-gray-900 font-medium block">{article.title}</span>
                    <span className="text-sm text-gray-500">{article.category}</span>
                  </div>
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

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Still Need{" "}
              <span className="font-dancing-script italic" style={{ color: SKOOL_BLUE }}>
                Help?
              </span>
            </h2>
            <p className="text-gray-600 mb-8">Our support team is here to assist you</p>
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEmailSupport}
              className="px-8 py-4 text-white rounded-full font-bold"
              style={{ backgroundColor: SKOOL_BLUE }}
            >
              Contact Support
            </motion.button>
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

export default HelpCentre;
