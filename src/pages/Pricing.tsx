import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Users, Zap, Globe, Clock, Brain, MessageCircle, Shield, Sparkles } from "lucide-react";
import { agents } from "@/data/agents";
import logo from "@/assets/logo.png";

const Pricing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Pricing | Business Bots UK - AI Employees for Your Business";
  }, []);

  const pricingPlans = [
    {
      name: "Monthly",
      price: "97",
      discountedPrice: "48.50",
      discount: "50",
      period: "month",
      billing: "Pay monthly",
      popular: false,
    },
    {
      name: "Quarterly",
      price: "59",
      discountedPrice: "23.60",
      discount: "60",
      period: "month",
      billing: "Pay every 3 months",
      popular: false,
    },
    {
      name: "Yearly",
      price: "52",
      discountedPrice: "15.60",
      discount: "70",
      period: "month",
      billing: "Pay yearly",
      popular: true,
    },
  ];

  const features = [
    {
      icon: Users,
      title: "All 8 AI Employees for every area of your work",
      description: "Unlock Sprout, Lilly, Banjo, Timi, Like, Tobby, Nano, Skoot and more. From customer support to lead generation, to sales and recruitment. All helpers in one team.",
    },
    {
      icon: Zap,
      title: "Dozens of Use Cases for one-click work",
      description: "Do one-click work with Use Cases. Simply adjust and complete tasks in seconds. From bulk email campaigns, to social media posts, to lead generation.",
    },
    {
      icon: Brain,
      title: "All the features for Brain AI",
      description: "Personalize your outputs for your unique liking based on your knowledge. Helpers can scrape websites and use all the information while completing your tasks.",
    },
    {
      icon: Globe,
      title: "Complete tasks in 100+ languages",
      description: "Business Bots support over 100+ native languages for all your needs. Go global with AI-powered translations and communications.",
    },
    {
      icon: Clock,
      title: "One easy-to-use platform",
      description: "Use your team from any device—desktop or mobile. All your AI employees work seamlessly together on one unified platform.",
    },
    {
      icon: MessageCircle,
      title: "Guided conversations & smart follow-ups",
      description: "Your AI team asks the right questions to understand exactly what you need before delivering perfect results every time.",
    },
    {
      icon: Shield,
      title: "Enterprise-grade security",
      description: "Your data is protected with bank-level encryption. We never share your information with third parties.",
    },
    {
      icon: Sparkles,
      title: "Regular updates & new features",
      description: "Get access to new AI capabilities, improved models, and additional helpers as they're released—at no extra cost.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 bg-background/80 backdrop-blur-md border-b border-white/5"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <img src={logo} alt="Business Bots UK" className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-white/80 hover:text-white transition-colors text-sm font-medium px-4 py-2">
              Log in
            </button>
            <span className="font-robotic text-white font-bold text-sm md:text-base tracking-wide">
              Business Bots UK
            </span>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Agents */}
      <section className="pt-32 pb-16 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Pricing Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-white/10 p-8 md:p-12 mb-12 overflow-hidden"
          >
            {/* Agent Images */}
            <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 flex -space-x-8 md:-space-x-12">
              {agents.slice(0, 4).map((agent, index) => (
                <motion.img
                  key={agent.id}
                  src={agent.image}
                  alt={agent.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-lg"
                  style={{ zIndex: 4 - index }}
                />
              ))}
            </div>

            <div className="max-w-md">
              <p className="text-white/60 text-sm font-medium mb-2">Individual</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Business Bots UK</h1>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-white/60 text-lg">from</span>
                <span className="text-4xl md:text-5xl font-bold text-white">£15.60</span>
                <span className="text-white/60 text-lg">/month</span>
              </div>
              <p className="text-white/60">All 8 Business Bots AI Employees</p>
            </div>
          </motion.div>

          {/* Pricing Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Pricing options</h2>
            
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:scale-105 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-purple-600/20 border-purple-500/50' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-white/40 line-through text-lg">£{plan.price}</span>
                      <span className="text-3xl font-bold text-white">£{plan.discountedPrice}</span>
                      <span className="text-white/60">/month</span>
                    </div>
                    
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                      <span>{plan.discount}% OFF</span>
                    </div>
                    
                    <p className="text-white/60 text-sm">{plan.billing}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-16"
          >
            <button className="btn-primary text-lg px-12 py-4 shadow-lg shadow-purple-500/25">
              Get Business Bots for £15.60/m
            </button>
            <p className="text-white/40 text-sm mt-4">
              You will be redirected to checkout. All purchases are backed by our unconditional 14-day money-back guarantee.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-zinc-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white mb-12"
          >
            Everything you're getting with Business Bots UK
          </motion.h2>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                  <p className="text-white/60 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Agents Section */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white mb-4 text-center"
          >
            Meet Your Complete AI Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/60 text-center mb-12 max-w-xl mx-auto"
          >
            All 8 specialized AI employees included in every plan
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/?agent=${agent.id}`)}
                className="group relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-4 cursor-pointer hover:border-white/20 transition-all hover:scale-105"
              >
                <div 
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, var(--bg-${agent.glowColor}) 0%, transparent 100%)` 
                  }}
                >
                  <img 
                    src={agent.image} 
                    alt={agent.name}
                    className="w-14 h-14 object-contain"
                  />
                </div>
                <h3 className="text-white font-semibold text-center text-sm">{agent.name}</h3>
                <p className="text-white/50 text-xs text-center">{agent.shortRole}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white mb-12 text-center"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. We also offer a 14-day money-back guarantee if you're not satisfied.",
              },
              {
                q: "Do I get all 8 AI employees?",
                a: "Absolutely! Every plan includes full access to all 8 specialized AI employees: Sprout, Lilly, Banjo, Timi, Like, Tobby, Nano, and Skoot.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, we offer a 14-day free trial so you can experience the full power of Business Bots UK before committing.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl bg-white/5 border border-white/10 p-6"
              >
                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                <p className="text-white/60 text-sm">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to transform your business?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/60 mb-8"
          >
            Join thousands of businesses already using AI employees to automate their work.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="btn-primary text-lg px-12 py-4"
          >
            Start Your Free Trial
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white/40 text-sm">
            © 2024 Business Bots UK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
