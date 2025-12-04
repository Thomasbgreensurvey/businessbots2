import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What are AI Helpers?",
      answer: "AI Helpers are intelligent virtual assistants powered by advanced artificial intelligence. Each helper is specialized for specific business tasks like email marketing, customer support, sales, HR, and more. They work 24/7 to automate repetitive tasks and help your business scale efficiently."
    },
    {
      question: "How do I get started with Business Bots UK?",
      answer: "Getting started is simple! Choose the AI Helper that fits your needs, sign up for an account, and follow our guided setup process. Most customers are up and running within 24 hours. Our team is also available to help with onboarding."
    },
    {
      question: "Can I use multiple AI Helpers together?",
      answer: "Absolutely! Our AI Helpers are designed to work together seamlessly. For example, Like can find leads, Tobby can call them, and Timi can handle their support inquiries. The Full Team package gives you access to all 8 helpers."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, security is our top priority. All data is encrypted in transit and at rest. We comply with GDPR and other data protection regulations. We never share your data with third parties and you maintain full ownership of all your information."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer 24/7 support through chat, email, and phone. All customers have access to our comprehensive knowledge base and video tutorials. Enterprise customers receive a dedicated success manager."
    },
    {
      question: "Can I try before I buy?",
      answer: "Yes! We offer a 14-day free trial with full access to any AI Helper. No credit card required to start. You can experience the full power of our AI before making any commitment."
    },
    {
      question: "How are AI Helpers different from chatbots?",
      answer: "Traditional chatbots follow scripted responses. Our AI Helpers use advanced language models to understand context, learn from interactions, and perform complex tasks autonomously. They can handle nuanced conversations and execute multi-step workflows."
    },
    {
      question: "What integrations do you support?",
      answer: "We integrate with 100+ popular business tools including Salesforce, HubSpot, Slack, Zapier, Google Workspace, Microsoft 365, and many more. Custom API integrations are also available for enterprise customers."
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

      {/* Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Everything you need to know about Business Bots UK.
            </p>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card rounded-xl border border-border px-6"
                  >
                    <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;