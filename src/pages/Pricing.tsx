import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Users, Zap, Globe, Clock, Brain, MessageCircle, Shield, Sparkles, Building2, Star, Quote } from "lucide-react";
import { toast } from "sonner";
import { agents, GlowColor } from "@/data/agents";
import logo from "@/assets/logo.png";

// Gradient helper
const getAgentGradient = (glowColor: GlowColor): string => {
  const gradients: Record<GlowColor, string> = {
    emerald: 'linear-gradient(135deg, #065f46 0%, #10b981 50%, #34d399 100%)',
    rose: 'linear-gradient(135deg, #9f1239 0%, #f43f5e 50%, #fb7185 100%)',
    indigo: 'linear-gradient(135deg, #3730a3 0%, #6366f1 50%, #a5b4fc 100%)',
    cyan: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 50%, #67e8f9 100%)',
    amber: 'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fcd34d 100%)',
    orange: 'linear-gradient(135deg, #c2410c 0%, #f97316 50%, #fdba74 100%)',
    teal: 'linear-gradient(135deg, #115e59 0%, #14b8a6 50%, #5eead4 100%)',
    fuchsia: 'linear-gradient(135deg, #86198f 0%, #d946ef 50%, #f0abfc 100%)',
  };
  return gradients[glowColor] || gradients.indigo;
};

// Urgency Timer Component
const UrgencyTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        else return { hours: 23, minutes: 59, seconds: 59 };
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 bg-black/30 border border-amber-500/30 rounded-full px-4 py-2">
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
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  useEffect(() => {
    document.title = "Pricing | Business Bots UK - AI Employees for Your Business";
  }, []);

  const pricingPlans = [
    {
      id: "starter",
      name: "Starter",
      monthlyPrice: 97,
      annualPrice: 48.50,
      discount: 50,
      gradient: "from-cyan-600 via-cyan-500 to-teal-500",
      features: ["All 8 AI Employees", "1,000 tasks/month", "Email support", "Basic integrations"],
    },
    {
      id: "growth",
      name: "Growth",
      monthlyPrice: 147,
      annualPrice: 73.50,
      discount: 50,
      gradient: "from-rose-600 via-pink-500 to-rose-400",
      features: ["All 8 AI Employees", "5,000 tasks/month", "Priority support", "All integrations", "3 team members"],
    },
    {
      id: "pro",
      name: "Pro",
      monthlyPrice: 197,
      annualPrice: 78.80,
      discount: 60,
      popular: true,
      gradient: "from-purple-600 via-violet-500 to-purple-400",
      features: ["All 8 AI Employees", "Unlimited tasks", "24/7 Priority support", "All integrations", "10 team members", "API access"],
    },
  ];

  const testimonials = [
    { name: "Sarah Mitchell", role: "Marketing Director, TechFlow", quote: "Business Bots cut our email response time by 80%. The ROI was visible within the first week.", avatar: "SM", rating: 5 },
    { name: "James Chen", role: "Founder, ScaleUp Agency", quote: "We replaced 3 part-time roles with Business Bots. It's like having a team that never sleeps.", avatar: "JC", rating: 5 },
    { name: "Emma Roberts", role: "Operations Lead, Retail Plus", quote: "The AI employees understand context better than any tool we've tried. Absolutely game-changing.", avatar: "ER", rating: 5 },
  ];

  const comparisonFeatures = [
    { name: "AI Employees", starter: "8", growth: "8", pro: "8", enterprise: "Unlimited" },
    { name: "Tasks per month", starter: "1,000", growth: "5,000", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "Team members", starter: "1", growth: "3", pro: "10", enterprise: "Unlimited" },
    { name: "Languages", starter: "10", growth: "50", pro: "100+", enterprise: "100+" },
    { name: "Custom integrations", starter: false, growth: true, pro: true, enterprise: true },
    { name: "API access", starter: false, growth: false, pro: true, enterprise: true },
    { name: "Custom training", starter: false, growth: false, pro: false, enterprise: true },
    { name: "Dedicated manager", starter: false, growth: false, pro: false, enterprise: true },
    { name: "SLA guarantee", starter: false, growth: false, pro: true, enterprise: true },
    { name: "White-label", starter: false, growth: false, pro: false, enterprise: true },
    { name: "Priority support", starter: false, growth: true, pro: true, enterprise: true },
  ];

  const features = [
    { icon: Users, title: "All 8 AI Employees", description: "Unlock Sprout, Lilly, Banjo, Timi, Like, Tobby, Nano, Skoot." },
    { icon: Zap, title: "One-click tasks", description: "Complete tasks in seconds with pre-built use cases." },
    { icon: Brain, title: "Brain AI", description: "Personalize outputs based on your knowledge." },
    { icon: Globe, title: "100+ languages", description: "Go global with AI-powered communications." },
    { icon: Clock, title: "24/7 availability", description: "Your team works around the clock." },
    { icon: Shield, title: "Enterprise security", description: "Bank-level encryption for your data." },
  ];

  const getPrice = (plan: typeof pricingPlans[0]) => {
    return billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
  };

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
            <button onClick={() => navigate("/")} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <img src={logo} alt="Business Bots UK" className="h-10 w-auto" />
          </div>
          <span className="font-robotic text-white font-bold text-sm md:text-base tracking-wide">Business Bots UK</span>
        </div>
      </motion.header>

      {/* Urgency Banner */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 py-3 px-4 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <p className="text-white text-sm font-medium text-center">
            🔥 <span className="text-amber-400 font-bold">Limited Time</span> — 14-day free trial
          </p>
          <UrgencyTimer />
          <button 
            onClick={() => document.getElementById('pricing-cards')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-4 py-2 rounded-full transition-colors"
          >
            Claim 60% OFF
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-64 sm:pt-48 pb-8 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, transparent pricing</h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">Choose the plan that scales with your business. All plans include a 14-day free trial.</p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-center mb-10">
            <div className="bg-white/5 border border-white/10 rounded-full p-1 flex items-center">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${billingCycle === "monthly" ? "bg-white text-black" : "text-white/70 hover:text-white"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${billingCycle === "annual" ? "bg-white text-black" : "text-white/70 hover:text-white"}`}
              >
                Annual
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SAVE 60%</span>
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div id="pricing-cards" className="grid md:grid-cols-4 gap-5 mb-12">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  selectedPlan === plan.id ? "ring-2 ring-white ring-offset-2 ring-offset-background" : ""
                }`}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-90`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                
                {plan.popular && (
                  <div className="absolute top-3 right-3 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                
                <div className="relative p-6">
                  <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-white/70 text-xs mb-4">{billingCycle === "annual" ? "Billed annually" : "Billed monthly"}</p>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      {billingCycle === "annual" && <span className="text-white/50 line-through text-sm">£{plan.monthlyPrice}</span>}
                      <span className="text-4xl font-bold text-white">£{getPrice(plan)}</span>
                    </div>
                    <span className="text-white/70 text-sm">/month</span>
                  </div>
                  
                  {billingCycle === "annual" && (
                    <div className="inline-flex items-center gap-1 bg-black/30 text-white px-2 py-1 rounded-md text-xs font-bold mb-4">
                      <Zap className="w-3 h-3" />
                      <span>{plan.discount}% OFF</span>
                    </div>
                  )}

                  <ul className="space-y-2 mb-5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/90 text-sm">
                        <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan.id);
                      toast.success(`${plan.name} plan selected!`, { description: "Checkout coming soon. Start your 14-day free trial." });
                    }}
                    className="w-full py-3 rounded-xl font-semibold text-sm bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all border border-white/20"
                  >
                    {selectedPlan === plan.id ? "Get Started" : "Select Plan"}
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Enterprise Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-500 to-amber-500 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              
              <div className="absolute top-3 right-3 bg-black text-amber-400 text-[10px] font-bold px-2 py-1 rounded-full">
                ENTERPRISE
              </div>
              
              <div className="relative p-6">
                <h3 className="text-white font-bold text-xl mb-1">Enterprise</h3>
                <p className="text-white/70 text-xs mb-4">For large teams</p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">Custom</span>
                  <p className="text-white/70 text-sm">pricing</p>
                </div>
                
                <div className="inline-flex items-center gap-1 bg-black/30 text-white px-2 py-1 rounded-md text-xs font-bold mb-4">
                  <Building2 className="w-3 h-3" />
                  <span>Tailored</span>
                </div>

                <ul className="space-y-2 mb-5">
                  {["Unlimited AI Employees", "Unlimited team members", "Custom training", "Dedicated manager", "White-label option", "SLA guarantee"].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/90 text-sm">
                      <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => window.location.href = 'mailto:sales@businessbotsuk.com?subject=Enterprise%20Plan%20Inquiry'}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-black hover:bg-black/80 text-white transition-all"
                >
                  Contact Sales
                </button>
              </div>
            </motion.div>
          </div>

          <div className="text-center">
            <p className="text-white/40 text-sm mb-6">14-day money-back guarantee • No credit card required for trial</p>
            <button 
              onClick={() => navigate('/book-demo')}
              className="inline-flex items-center gap-2 text-[#4B5FD1] hover:text-[#6B7FE1] font-semibold transition-colors"
            >
              Prefer a live demo? Book a call with our team →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-10 bg-gradient-to-b from-background via-zinc-900/50 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
            Trusted by 10,000+ businesses
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-white/60 text-center mb-12">
            See what our customers have to say
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 p-6"
              >
                <Quote className="w-8 h-8 text-purple-500/30 mb-4" />
                <p className="text-white/80 text-sm mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-white/50 text-xs">{testimonial.role}</p>
                  </div>
                </div>
                <div className="absolute top-6 right-6 flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
            Compare Plans
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-white/60 text-center mb-12">
            Find the perfect plan for your needs
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Features</th>
                  <th className="text-center py-4 px-4 text-cyan-400 font-semibold">Starter</th>
                  <th className="text-center py-4 px-4 text-rose-400 font-semibold">Growth</th>
                  <th className="text-center py-4 px-4 text-purple-400 font-semibold">Pro ⭐</th>
                  <th className="text-center py-4 px-4 text-amber-400 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 text-white/80 text-sm">{feature.name}</td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : <span className="text-white/70 text-sm">{feature.starter}</span>}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.growth === 'boolean' ? (
                        feature.growth ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : <span className="text-white/70 text-sm">{feature.growth}</span>}
                    </td>
                    <td className="text-center py-4 px-4 bg-purple-500/5">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : <span className="text-white font-medium text-sm">{feature.pro}</span>}
                    </td>
                    <td className="text-center py-4 px-4 bg-amber-500/5">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? <Check className="w-5 h-5 text-amber-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : <span className="text-amber-400 font-medium text-sm">{feature.enterprise}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 md:px-10 bg-zinc-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
            Everything included
          </motion.h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-white/50 text-xs">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Your AI Team - Matching Site Style */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
            Meet Your AI Team
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-white/60 text-center mb-12">
            All 8 specialized AI employees included in every plan
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {agents.map((agent, index) => (
              <motion.button
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/?agent=${agent.id}`)}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] transition-all duration-300 hover:scale-[1.02]"
                style={{ background: getAgentGradient(agent.glowColor) }}
              >
                {/* Agent Image */}
                <div className="absolute inset-0 flex items-end justify-center">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Agent Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <h3 className="text-white font-bold text-lg">{agent.name}</h3>
                  <p className="text-white/70 text-sm">{agent.shortRole}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 md:px-10 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4">
            {[
              { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. We also offer a 14-day money-back guarantee." },
              { q: "Do I get all 8 AI employees?", a: "Absolutely! Every plan includes full access to all 8 specialized AI employees." },
              { q: "Is there a free trial?", a: "Yes, we offer a 14-day free trial so you can experience the full power of Business Bots UK." },
              { q: "What's included in Enterprise?", a: "Enterprise includes unlimited AI employees, team members, custom training, dedicated manager, white-label options, and SLA guarantees." },
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
      <section className="py-20 px-6 md:px-10 bg-gradient-to-b from-purple-900/20 to-background">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your business?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-white/60 mb-8">
            Join thousands of businesses already using AI employees.
          </motion.p>
          <motion.button initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="btn-primary text-lg px-12 py-4">
            Start Your Free Trial
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white/40 text-sm">© 2024 Business Bots UK. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
