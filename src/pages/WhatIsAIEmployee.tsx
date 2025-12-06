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

const benefits = [
  {
    title: "24/7 Availability",
    description: "AI Employees never sleep. They work around the clock, handling tasks even when your human team is offline."
  },
  {
    title: "Instant Response",
    description: "Respond to customer inquiries, process leads, and handle tasks in seconds rather than hours or days."
  },
  {
    title: "Scalable Growth",
    description: "Handle 10x the workload without hiring additional staff. Scale your operations instantly as demand grows."
  },
  {
    title: "Consistent Quality",
    description: "AI Employees deliver consistent results every time. No bad days, no mistakes from fatigue, just reliable performance."
  },
  {
    title: "Team Augmentation",
    description: "AI Employees don't replace your team—they amplify it. Free your humans to focus on high-value strategic work."
  },
  {
    title: "Specialized Skills",
    description: "Each AI Employee is trained for specific roles, from marketing to sales to support. Expert performance in every domain."
  }
];

const WhatIsAIEmployee = () => {
  const navigate = useNavigate();

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
          <h1 className="text-xl font-bold text-gray-900">What is an AI Employee?</h1>
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
            Understanding AI Employees
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            What is an{" "}
            <span className="font-dancing-script italic" style={{ color: SKOOL_BLUE }}>
              AI Employee?
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Imagine having a team member who never sleeps, never takes breaks, and can handle thousands of tasks simultaneously.
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              An <strong className="text-gray-900">AI Employee</strong> is a specialized artificial intelligence agent designed to perform specific business functions autonomously. Unlike generic chatbots or simple automation tools, AI Employees are trained experts in their domain—whether that's customer support, email marketing, lead generation, sales, or recruitment.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Think of them as digital team members who work alongside your human staff. They handle repetitive, time-consuming tasks with precision and speed, freeing your team to focus on strategy, creativity, and building relationships.
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-8 my-12 border border-gray-100"
              style={{ backgroundColor: `${SKOOL_BLUE}05` }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                The Business Bots UK{" "}
                <span className="font-dancing-script italic" style={{ color: SKOOL_BLUE }}>
                  Difference
                </span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our AI Employees aren't just tools—they're trained specialists. Each one has been developed with deep expertise in their specific role, understanding the nuances, best practices, and strategies that drive real results. Sprout knows email marketing inside out. Timi understands customer psychology. Like knows how to qualify and nurture leads. They're not generic AIs trying to do everything—they're specialists excelling at their craft.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why{" "}
            <span className="font-dancing-script italic" style={{ color: SKOOL_BLUE }}>
              AI Employees?
            </span>
          </h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-2 gap-6"
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Meet Your{" "}
              <span className="font-dancing-script italic" style={{ color: SKOOL_BLUE }}>
                New Team?
              </span>
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Explore our AI Employees and find the perfect match for your business needs.
            </p>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="px-8 py-4 text-white rounded-full font-bold text-lg"
              style={{ backgroundColor: SKOOL_BLUE }}
            >
              Meet the Team
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

export default WhatIsAIEmployee;
