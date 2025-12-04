import { motion } from "framer-motion";
import { ArrowLeft, Bot, Zap, Clock, TrendingUp, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WhatIsAIHelper = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Bot,
      title: "Intelligent Automation",
      description: "AI Helpers understand context and intent, making decisions like a human team member would."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Never miss an opportunity. Your AI Helpers work around the clock without breaks or holidays."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Complete tasks in seconds that would take humans hours. Scale your output instantly."
    },
    {
      icon: TrendingUp,
      title: "Continuous Learning",
      description: "AI Helpers improve over time, learning from every interaction to get better results."
    },
    {
      icon: Shield,
      title: "Consistent Quality",
      description: "No bad days, no mistakes from fatigue. AI Helpers deliver consistent performance always."
    },
    {
      icon: Sparkles,
      title: "Specialized Skills",
      description: "Each AI Helper is an expert in their domain, trained on thousands of best practices."
    },
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

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              What is an AI Helper?
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              AI Helpers are intelligent virtual team members that automate complex business tasks with human-like understanding.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <main className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Intro Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white py-16 -mx-6 px-6 md:px-12 mb-16"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
                <span className="text-primary">Imagine having a team</span> of tireless experts working for you around the clock. That's exactly what AI Helpers provide. Powered by advanced artificial intelligence, each Helper is specialized to excel at specific business functions—from marketing and sales to HR and customer support.
              </h2>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-foreground mb-8 text-center"
            >
              Why AI Helpers?
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-card rounded-2xl p-12 border border-border"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to meet your AI team?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Explore our 8 specialized AI Helpers and find the perfect match for your business needs.
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn-primary px-8 py-4 text-lg"
            >
              Meet the Team
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default WhatIsAIHelper;