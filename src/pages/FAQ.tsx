import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SKOOL_BLUE = "#4B5FD1";

const faqs = [
  {
    question: "What is an AI Employee?",
    answer: "An AI Employee is a specialized artificial intelligence agent designed to handle specific business tasks autonomously. Unlike generic AI tools, our AI Employees are trained for particular roles like customer support, email marketing, lead generation, and more. They work 24/7, never take breaks, and can handle multiple tasks simultaneously."
  },
  {
    question: "How do AI Employees integrate with my existing tools?",
    answer: "Our AI Employees integrate seamlessly with popular business tools including CRMs, email platforms, social media schedulers, and helpdesk software. We support integrations with Slack, HubSpot, Salesforce, Mailchimp, and many more. Setup typically takes less than 15 minutes."
  },
  {
    question: "Is my data secure with AI Employees?",
    answer: "Absolutely. We employ enterprise-grade security measures including end-to-end encryption, SOC 2 compliance, and GDPR compliance. Your data is never used to train our models, and you maintain full ownership and control over all your information."
  },
  {
    question: "Can I customize how my AI Employee works?",
    answer: "Yes! Each AI Employee can be customized to match your brand voice, follow your specific workflows, and adhere to your business rules. You can set parameters, create custom responses, and define escalation procedures."
  },
  {
    question: "What happens if the AI makes a mistake?",
    answer: "Our AI Employees are designed with safeguards. For critical tasks, you can set up approval workflows where the AI prepares responses for your review. Additionally, our AI learns from corrections, improving accuracy over time."
  },
  {
    question: "How much does it cost?",
    answer: "We offer flexible pricing based on usage and the number of AI Employees you need. Plans start from £99/month for small businesses. Contact our team for a custom quote based on your specific requirements."
  },
  {
    question: "Can I try before I buy?",
    answer: "Yes! We offer a 14-day free trial with full access to all AI Employees. No credit card required. This gives you plenty of time to see the value they bring to your business."
  },
  {
    question: "How quickly can I get started?",
    answer: "Most businesses are up and running within 24 hours. Our onboarding team will help you set up your AI Employees, configure integrations, and ensure everything is working smoothly."
  }
];

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
          <h1 className="text-xl font-bold text-gray-900">FAQ</h1>
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
            Got Questions?
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Frequently Asked{" "}
            <span className="font-dancing-script italic" style={{ color: SKOOL_BLUE }}>
              Questions
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to know about AI Employees
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* FAQs */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors"
              >
                <motion.button
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5" style={{ color: SKOOL_BLUE }} />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400" />
                    )}
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Still Have{" "}
              <span className="font-dancing-script italic" style={{ color: SKOOL_BLUE }}>
                Questions?
              </span>
            </h2>
            <p className="text-gray-600 mb-8">
              Our team is here to help you get started
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/help-centre")}
                className="px-8 py-4 rounded-full text-white font-bold"
                style={{ backgroundColor: SKOOL_BLUE }}
              >
                Visit Help Centre
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = "mailto:support@businessbotsuk.com"}
                className="px-8 py-4 rounded-full font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </motion.button>
            </div>
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

export default FAQ;
