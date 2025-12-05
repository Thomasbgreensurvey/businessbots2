import { motion } from "framer-motion";
import { ArrowLeft, Bot, Zap, Clock, TrendingUp, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

const benefits = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "AI Employees never sleep. They work around the clock, handling tasks even when your human team is offline."
  },
  {
    icon: Zap,
    title: "Instant Response",
    description: "Respond to customer inquiries, process leads, and handle tasks in seconds rather than hours or days."
  },
  {
    icon: TrendingUp,
    title: "Scalable Growth",
    description: "Handle 10x the workload without hiring additional staff. Scale your operations instantly as demand grows."
  },
  {
    icon: Shield,
    title: "Consistent Quality",
    description: "AI Employees deliver consistent results every time. No bad days, no mistakes from fatigue, just reliable performance."
  },
  {
    icon: Users,
    title: "Team Augmentation",
    description: "AI Employees don't replace your team—they amplify it. Free your humans to focus on high-value strategic work."
  },
  {
    icon: Bot,
    title: "Specialized Skills",
    description: "Each AI Employee is trained for specific roles, from marketing to sales to support. Expert performance in every domain."
  }
];

const WhatIsAIEmployee = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="What is an AI Employee? - Guide to AI Business Automation"
        description="Learn what AI employees are and how they can transform your business. Discover the benefits of 24/7 AI agents for customer support, sales, marketing and more."
        keywords="what is AI employee, AI agent definition, AI automation explained, virtual employee UK, AI workforce"
        canonicalUrl="https://businessbotsuk.com/what-is-ai-employee"
      />
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
          <h1 className="text-xl font-bold text-gray-900">What is an AI Employee?</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-violet-800 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8"
          >
            <Bot className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            What is an AI Employee?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            Imagine having a team member who never sleeps, never takes breaks, and can handle thousands of tasks simultaneously.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              An <strong className="text-gray-900">AI Employee</strong> is a specialized artificial intelligence agent designed to perform specific business functions autonomously. Unlike generic chatbots or simple automation tools, AI Employees are trained experts in their domain—whether that's customer support, email marketing, lead generation, sales, or recruitment.
            </p>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Think of them as digital team members who work alongside your human staff. They handle repetitive, time-consuming tasks with precision and speed, freeing your team to focus on strategy, creativity, and building relationships.
            </p>

            <div className="bg-violet-50 rounded-2xl p-8 my-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Business Bots UK Difference</h3>
              <p className="text-gray-600 mb-0">
                Our AI Employees aren't just tools—they're trained specialists. Each one has been developed with deep expertise in their specific role, understanding the nuances, best practices, and strategies that drive real results. Sprout knows email marketing inside out. Timi understands customer psychology. Like knows how to qualify and nurture leads. They're not generic AIs trying to do everything—they're specialists excelling at their craft.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why AI Employees?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to meet your new team?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore our AI Employees and find the perfect match for your business needs.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center px-8 py-4 bg-violet-600 text-white rounded-xl font-medium text-lg hover:bg-violet-700 transition-colors"
          >
            Meet the Team
          </button>
        </div>
      </section>
      </div>
    </>
  );
};

export default WhatIsAIEmployee;
