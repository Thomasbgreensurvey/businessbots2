import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";

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
    <>
      <SEOHead
        title="FAQ - Frequently Asked Questions About AI Employees"
        description="Get answers about AI employees, pricing, integrations, data security, and how Business Bots UK can automate your business operations."
        keywords="AI employee FAQ, AI automation questions, chatbot pricing UK, AI business solutions FAQ"
        canonicalUrl="https://businessbotsuk.com/faq"
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
          <h1 className="text-xl font-bold text-gray-900">FAQ</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80"
          >
            Everything you need to know about AI Employees
          </motion.p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default FAQ;
