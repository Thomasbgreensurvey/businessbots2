import { motion } from "framer-motion";
import { ArrowLeft, Book, MessageCircle, Video, Mail, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const HelpCenter = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics and set up your first AI Helper",
      articles: 12
    },
    {
      icon: MessageCircle,
      title: "Using AI Helpers",
      description: "Tips and tricks for getting the most out of your bots",
      articles: 24
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video guides for all features",
      articles: 18
    },
    {
      icon: Mail,
      title: "Integrations",
      description: "Connect your AI Helpers to other tools",
      articles: 32
    },
  ];

  const popularArticles = [
    "How to set up your first email campaign with Sprout",
    "Connecting your CRM to Like for lead enrichment",
    "Best practices for customer support automation",
    "Training your AI Helper with custom data",
    "Understanding usage and billing",
  ];

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
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers, guides, and resources to help you succeed.
            </p>

            {/* Search */}
            <div className="relative mb-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles..."
                className="pl-12 py-6 text-lg bg-card border-border"
              />
            </div>

            {/* Categories Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <category.icon className="w-10 h-10 text-primary mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">{category.title}</h2>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <span className="text-sm text-primary">{category.articles} articles</span>
                </motion.div>
              ))}
            </div>

            {/* Popular Articles */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">Popular Articles</h3>
              <ul className="space-y-4">
                {popularArticles.map((article, index) => (
                  <motion.li
                    key={article}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {article}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <p className="text-muted-foreground mb-4">Still need help?</p>
              <button className="btn-primary px-8 py-3">
                Contact Support
              </button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default HelpCenter;