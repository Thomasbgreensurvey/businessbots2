import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Users, Zap, Globe, Clock, Brain, MessageCircle, Shield, Sparkles, Building2 } from "lucide-react";
import { agents } from "@/data/agents";
import logo from "@/assets/logo.png";

// Urgency Timer Component
const UrgencyTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer
          return { hours: 23, minutes: 59, seconds: 59 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full px-4 py-2">
      <Clock className="w-4 h-4 text-amber-400" />
      <span className="text-amber-400 font-mono font-bold text-sm">
        {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
      </span>
    </div>
  );
};

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>("yearly");

  useEffect(() => {
    document.title = "Pricing | Business Bots UK - AI Employees for Your Business";
  }, []);

  const pricingPlans = [
    {
      id: "monthly",
      name: "Monthly",
      price: 97,
      discountedPrice: 48.50,
      discount: 50,
      billing: "Billed monthly",
      popular: false,
      features: ["All 8 AI Employees", "Unlimited tasks", "Email support", "Basic integrations"],
    },
    {
      id: "quarterly",
      name: "Quarterly",
      price: 59,
      discountedPrice: 23.60,
      discount: 60,
      billing: "Billed every 3 months",
      popular: false,
      features: ["All 8 AI Employees", "Unlimited tasks", "Priority email support", "All integrations", "Custom branding"],
    },
    {
      id: "yearly",
      name: "Yearly",
      price: 52,
      discountedPrice: 15.60,
      discount: 70,
      billing: "Billed annually",
      popular: true,
      features: ["All 8 AI Employees", "Unlimited tasks", "24/7 Priority support", "All integrations", "Custom branding", "API access"],
    },
  ];

  const comparisonFeatures = [
    { name: "AI Employees", monthly: "8", quarterly: "8", yearly: "8", enterprise: "Unlimited" },
    { name: "Tasks per month", monthly: "1,000", quarterly: "5,000", yearly: "Unlimited", enterprise: "Unlimited" },
    { name: "Team members", monthly: "1", quarterly: "3", yearly: "10", enterprise: "Unlimited" },
    { name: "Languages supported", monthly: "10", quarterly: "50", yearly: "100+", enterprise: "100+" },
    { name: "Custom integrations", monthly: false, quarterly: true, yearly: true, enterprise: true },
    { name: "API access", monthly: false, quarterly: false, yearly: true, enterprise: true },
    { name: "Custom training", monthly: false, quarterly: false, yearly: false, enterprise: true },
    { name: "Dedicated account manager", monthly: false, quarterly: false, yearly: false, enterprise: true },
    { name: "SLA guarantee", monthly: false, quarterly: false, yearly: true, enterprise: true },
    { name: "White-label option", monthly: false, quarterly: false, yearly: false, enterprise: true },
    { name: "Priority support", monthly: false, quarterly: true, yearly: true, enterprise: true },
    { name: "Onboarding assistance", monthly: false, quarterly: false, yearly: true, enterprise: true },
  ];

  const features = [
    { icon: Users, title: "All 8 AI Employees for every area of your work", description: "Unlock Sprout, Lilly, Banjo, Timi, Like, Tobby, Nano, Skoot. From customer support to lead generation, to sales and recruitment." },
    { icon: Zap, title: "Dozens of Use Cases for one-click work", description: "Simply adjust and complete tasks in seconds. From bulk email campaigns, to social media posts, to lead generation." },
    { icon: Brain, title: "All the features for Brain AI", description: "Personalize your outputs based on your knowledge. Helpers can scrape websites and use all the information while completing tasks." },
    { icon: Globe, title: "Complete tasks in 100+ languages", description: "Go global with AI-powered translations and communications across all your markets." },
    { icon: Clock, title: "One easy-to-use platform", description: "Use your team from any device—desktop or mobile. All AI employees work seamlessly together." },
    { icon: MessageCircle, title: "Guided conversations & smart follow-ups", description: "Your AI team asks the right questions to understand exactly what you need." },
    { icon: Shield, title: "Enterprise-grade security", description: "Your data is protected with bank-level encryption. We never share your information." },
    { icon: Sparkles, title: "Regular updates & new features", description: "Get access to new AI capabilities and models as they're released—at no extra cost." },
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

      {/* Urgency Banner */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-gradient-to-r from-purple-900/90 via-purple-800/90 to-purple-900/90 backdrop-blur-sm py-3 px-4 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <p className="text-white text-sm md:text-base font-medium text-center">
            🔥 <span className="text-amber-400 font-bold">Limited Time Offer</span> — Start your 14-day free trial of Business Bots
          </p>
          <UrgencyTimer />
          <button className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-4 py-2 rounded-full transition-colors">
            Redeem 70% OFF
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-44 pb-8 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Pricing Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-white/10 p-8 md:p-10 mb-12 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left Content */}
              <div className="flex-1">
                <p className="text-purple-400 text-sm font-semibold mb-2 uppercase tracking-wider">Individual Plan</p>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Business Bots UK</h1>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-white/50 text-lg">from</span>
                  <span className="text-4xl md:text-5xl font-bold text-white">£15.60</span>
                  <span className="text-white/50 text-lg">/month</span>
                </div>
                <p className="text-white/60">All 8 Business Bots AI Employees included</p>
              </div>

              {/* Right - Agent Avatars in a row */}
              <div className="flex items-center justify-center md:justify-end">
                <div className="flex -space-x-3">
                  {agents.slice(0, 6).map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-zinc-800 overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-800"
                      style={{ zIndex: 10 - index }}
                    >
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-full object-cover object-top scale-125"
                      />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-zinc-800 bg-purple-600 flex items-center justify-center"
                  >
                    <span className="text-white font-bold text-sm">+2</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Choose your plan</h2>
            
            <div className="grid md:grid-cols-4 gap-4 md:gap-5">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-2xl p-5 border-2 transition-all duration-300 cursor-pointer ${
                    selectedPlan === plan.id
                      ? plan.popular 
                        ? 'bg-gradient-to-b from-purple-600/30 to-purple-900/30 border-purple-500 shadow-lg shadow-purple-500/20' 
                        : 'bg-gradient-to-b from-white/10 to-white/5 border-white/40'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{plan.name}</h3>
                    <p className="text-white/50 text-xs">{plan.billing}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-white/40 line-through text-sm">£{plan.price}</span>
                      <span className="text-3xl font-bold text-white">£{plan.discountedPrice}</span>
                    </div>
                    <span className="text-white/50 text-sm">/month</span>
                  </div>
                  
                  <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md text-xs font-bold mb-4">
                    <Zap className="w-3 h-3" />
                    <span>{plan.discount}% OFF</span>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    className={`w-full mt-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                      selectedPlan === plan.id
                        ? 'bg-purple-500 hover:bg-purple-400 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {selectedPlan === plan.id ? 'Get Started' : 'Select Plan'}
                  </button>
                </motion.div>
              ))}

              {/* Enterprise Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="relative rounded-2xl p-5 border-2 border-amber-500/30 bg-gradient-to-b from-amber-900/20 to-amber-950/20"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Enterprise
                </div>
                
                <div className="mb-4">
                  <h3 className="text-white font-semibold text-lg mb-1">Enterprise</h3>
                  <p className="text-white/50 text-xs">For large teams & agencies</p>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">Custom</span>
                  <p className="text-white/50 text-sm">pricing</p>
                </div>
                
                <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2 py-1 rounded-md text-xs font-bold mb-4">
                  <Building2 className="w-3 h-3" />
                  <span>Tailored Solution</span>
                </div>

                <ul className="space-y-2">
                  {["Unlimited AI Employees", "Unlimited team members", "Custom training", "Dedicated manager", "White-label option", "SLA guarantee"].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full mt-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black transition-all">
                  Contact Sales
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-8"
          >
            <p className="text-white/40 text-sm">
              14-day money-back guarantee • No credit card required for trial
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white mb-4 text-center"
          >
            Compare Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/60 text-center mb-12 max-w-xl mx-auto"
          >
            Find the perfect plan for your business needs
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/60 font-medium text-sm">Features</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Monthly</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Quarterly</th>
                  <th className="text-center py-4 px-4 text-purple-400 font-semibold">Yearly ⭐</th>
                  <th className="text-center py-4 px-4 text-amber-400 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 text-white/80 text-sm">{feature.name}</td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.monthly === 'boolean' ? (
                        feature.monthly ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : (
                        <span className="text-white/70 text-sm">{feature.monthly}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.quarterly === 'boolean' ? (
                        feature.quarterly ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : (
                        <span className="text-white/70 text-sm">{feature.quarterly}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4 bg-purple-500/5">
                      {typeof feature.yearly === 'boolean' ? (
                        feature.yearly ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : (
                        <span className="text-white font-medium text-sm">{feature.yearly}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4 bg-amber-500/5">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? <Check className="w-5 h-5 text-amber-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : (
                        <span className="text-amber-400 font-medium text-sm">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white mb-12"
          >
            Everything you're getting with Business Bots UK
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-sm">{feature.title}</h3>
                  <p className="text-white/50 text-xs">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Agents Section */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-zinc-900/50">
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
                className="group relative rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 p-4 cursor-pointer hover:border-white/20 transition-all hover:scale-105"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-800">
                  <img 
                    src={agent.image} 
                    alt={agent.name}
                    className="w-full h-full object-cover object-top scale-125"
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
      <section className="py-16 md:py-24 px-6 md:px-10">
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
              { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. We also offer a 14-day money-back guarantee if you're not satisfied." },
              { q: "Do I get all 8 AI employees?", a: "Absolutely! Every plan includes full access to all 8 specialized AI employees: Sprout, Lilly, Banjo, Timi, Like, Tobby, Nano, and Skoot." },
              { q: "Is there a free trial?", a: "Yes, we offer a 14-day free trial so you can experience the full power of Business Bots UK before committing." },
              { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfers for annual plans." },
              { q: "What's included in the Enterprise plan?", a: "Enterprise includes unlimited AI employees, unlimited team members, custom training, a dedicated account manager, white-label options, and SLA guarantees." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl bg-white/[0.03] border border-white/10 p-6"
              >
                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                <p className="text-white/60 text-sm">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-gradient-to-b from-purple-900/20 to-background">
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
