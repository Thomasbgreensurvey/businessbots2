import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Users, Zap, Globe, Clock, Brain, MessageCircle, Shield, Sparkles, Building2, Star, Quote } from "lucide-react";
import { toast } from "sonner";
import { agents, GlowColor } from "@/data/agents";
import logo from "@/assets/logo.png";
import OptimizedImage from "@/components/OptimizedImage";

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
    <div className="flex items-center gap-1.5 bg-black/30 border border-amber-500/30 rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5">
      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
      <span className="text-amber-400 font-mono font-bold text-xs sm:text-sm">
        {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
      </span>
    </div>
  );
};

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  useEffect(() => {
    document.title = "Pricing | Business Bots UK - AI Employees for Your Business";
  }, []);

  const pricingPlans = [
    {
      id: "starter",
      name: "Starter",
      price: 49,
      subtitle: "For businesses getting started online",
      gradient: "from-cyan-600 via-cyan-500 to-teal-500",
      features: ["Social media profile setup (core platforms)", "Branding and bio optimisation", "Website chatbot setup", "Initial content seeding", "Email & chat support"],
    },
    {
      id: "business",
      name: "Business",
      price: 149,
      subtitle: "Professional online presence",
      gradient: "from-rose-600 via-pink-500 to-rose-400",
      features: ["Everything in Starter, plus:", "Setup of up to 15 social and business profiles", "Advanced SEO setup", "2 foundational backlinks", "Platform consistency and optimisation", "Email & chat support"],
    },
    {
      id: "business-plus",
      name: "Business Plus",
      price: 249,
      subtitle: "Automation and visibility growth",
      gradient: "from-indigo-600 via-purple-500 to-indigo-400",
      features: ["Everything in Business, plus:", "Social media automation", "Weekly content posting", "Lead capture forms and funnels", "Basic SEO optimisation", "2 additional backlinks", "Email & chat support"],
    },
    {
      id: "pro",
      name: "Pro",
      price: 499,
      subtitle: "Scalable marketing systems",
      popular: true,
      gradient: "from-purple-600 via-violet-500 to-purple-400",
      features: ["Everything in Business Plus, plus:", "Daily social content", "Advanced SEO", "5 authority backlinks", "Email marketing campaigns", "Advertising content creation support", "Email & chat support"],
    },
  ];

  const testimonials = [
    { name: "Sarah Mitchell", role: "Marketing Director, TechFlow", quote: "Business Bots cut our email response time by 80%. The ROI was visible within the first week.", avatar: "SM", rating: 5 },
    { name: "James Chen", role: "Founder, ScaleUp Agency", quote: "We replaced 3 part-time roles with Business Bots. It's like having a team that never sleeps.", avatar: "JC", rating: 5 },
    { name: "Emma Roberts", role: "Operations Lead, Retail Plus", quote: "The AI employees understand context better than any tool we've tried. Absolutely game-changing.", avatar: "ER", rating: 5 },
  ];

  const comparisonFeatures = [
    { name: "AI Social Media Assistant", starter: true, business: true, businessPlus: true, pro: true, enterprise: true },
    { name: "AI Inbound Chatbot", starter: true, business: true, businessPlus: true, pro: true, enterprise: true },
    { name: "Social Profile Setup", starter: "Core", business: "Up to 15", businessPlus: "Up to 15", pro: "Up to 15", enterprise: "Custom" },
    { name: "Content Posting Frequency", starter: "Setup only", business: "Setup only", businessPlus: "Weekly", pro: "Daily", enterprise: "Custom" },
    { name: "Social Media Automation", starter: false, business: false, businessPlus: true, pro: true, enterprise: true },
    { name: "Lead Capture & Funnels", starter: false, business: false, businessPlus: true, pro: true, enterprise: true },
    { name: "Email Marketing", starter: false, business: false, businessPlus: false, pro: true, enterprise: true },
    { name: "Advertising Content Support", starter: false, business: false, businessPlus: false, pro: true, enterprise: true },
    { name: "SEO Setup", starter: "Basic", business: "Advanced", businessPlus: "Advanced", pro: "Advanced+", enterprise: "Custom" },
    { name: "Backlinks", starter: false, business: "2", businessPlus: "7", pro: "10", enterprise: "Custom" },
    { name: "Website / Web App", starter: "Add-on", business: "Add-on", businessPlus: "Add-on", pro: "Add-on", enterprise: "Included / Add-on" },
    { name: "Hosting & Domain", starter: "Add-on", business: "Add-on", businessPlus: "Add-on", pro: "Add-on", enterprise: "Included / Add-on" },
    { name: "AI Inbound Receptionist", starter: "Add-on", business: "Add-on", businessPlus: "Add-on", pro: "Add-on", enterprise: "Included / Add-on" },
    { name: "Analytics & Reporting", starter: false, business: false, businessPlus: "Add-on", pro: "Add-on", enterprise: true },
    { name: "Email & Chat Support", starter: true, business: true, businessPlus: true, pro: true, enterprise: true },
    { name: "Telephone Support", starter: false, business: false, businessPlus: false, pro: false, enterprise: true },
  ];

  const addOns = [
    { name: "Website or Web App Design", price: "from £499" },
    { name: "Hosting, Domain & Business Email", price: "from £99" },
    { name: "AI Inbound Receptionist", price: "from £99 / month" },
    { name: "15-second Advert", price: "from £99" },
    { name: "30-second Advert", price: "from £149" },
    { name: "Sales & Marketing Campaigns", price: "from £299" },
    { name: "Landing Pages", price: "from £149 per page" },
    { name: "CRM Setup & Automation", price: "from £299" },
  ];

  const features = [
    { icon: Users, title: "All 8 AI Employees", description: "Unlock Sprout, Lilly, Banjo, Like, Zen, Tobby, Nano, Skoot." },
    { icon: Zap, title: "One-click tasks", description: "Complete tasks in seconds with pre-built use cases." },
    { icon: Brain, title: "Brain AI", description: "Personalize outputs based on your knowledge." },
    { icon: Globe, title: "100+ languages", description: "Go global with AI-powered communications." },
    { icon: Clock, title: "24/7 availability", description: "Your team works around the clock." },
    { icon: Shield, title: "Enterprise security", description: "Bank-level encryption for your data." },
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
            <button onClick={() => navigate("/")} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <OptimizedImage src={logo} alt="Business Bots UK" className="h-10 w-auto" width={40} height={40} priority />
          </div>
          <span className="font-robotic text-white font-bold text-sm md:text-base tracking-wide">Business Bots UK</span>
        </div>
      </motion.header>

      {/* Urgency Banner */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 py-2 px-3 sm:py-3 sm:px-4 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4">
          <p className="text-white text-xs sm:text-sm font-medium">
            🔥 <span className="text-amber-400 font-bold">Limited</span> — Free consultation
          </p>
          <UrgencyTimer />
          <button 
            onClick={() => navigate('/book-demo')}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-colors whitespace-nowrap"
          >
            Book Demo
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-64 sm:pt-48 pb-8 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, transparent pricing</h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">Choose the plan that scales with your business.</p>
          </motion.div>

          {/* Pricing Cards */}
          <div id="pricing-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
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
                
                <div className="relative p-5">
                  <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                  <p className="text-white/70 text-xs mb-3">{plan.subtitle}</p>

                  <div className="mb-3">
                    <span className="text-3xl font-bold text-white">£{plan.price}</span>
                    <span className="text-white/70 text-sm">/month</span>
                  </div>

                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/90 text-xs">
                        <Check className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/get-started');
                    }}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all border border-white/20"
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Custom Premium Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-500 to-amber-500 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              
              <div className="absolute top-3 right-3 bg-black text-amber-400 text-[10px] font-bold px-2 py-1 rounded-full">
                PREMIUM
              </div>
              
              <div className="relative p-5">
                <h3 className="text-white font-bold text-lg mb-1">Custom Premium</h3>
                <p className="text-white/70 text-xs mb-3">Bespoke AI-powered operations</p>

                <div className="mb-3">
                  <span className="text-2xl font-bold text-white">From £999</span>
                  <span className="text-white/70 text-sm">/month</span>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {["Custom AI workflows", "Tailored automations", "Advanced integrations", "SLA-based onboarding", "Email, Chat & Telephone support"].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/90 text-xs">
                      <Check className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => window.location.href = 'mailto:ai@businessbotsuk.com?subject=Custom%20Premium%20Plan%20Inquiry'}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm bg-black hover:bg-black/80 text-white transition-all"
                >
                  Contact Sales
                </button>
              </div>
            </motion.div>
          </div>

          <p className="text-center text-white/40 text-sm">All prices billed monthly • Cancel anytime</p>
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
        <div className="max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
            Compare Plans
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-white/60 text-center mb-12">
            Find the perfect plan for your needs
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Features</th>
                  <th className="text-center py-4 px-3 text-cyan-400 font-semibold text-sm">Starter</th>
                  <th className="text-center py-4 px-3 text-rose-400 font-semibold text-sm">Business</th>
                  <th className="text-center py-4 px-3 text-indigo-400 font-semibold text-sm">Business Plus</th>
                  <th className="text-center py-4 px-3 text-purple-400 font-semibold text-sm">Pro ⭐</th>
                  <th className="text-center py-4 px-3 text-amber-400 font-semibold text-sm">Custom Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 text-white/80 text-sm">{feature.name}</td>
                    <td className="text-center py-4 px-3">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : <span className="text-white/70 text-xs">{feature.starter}</span>}
                    </td>
                    <td className="text-center py-4 px-3">
                      {typeof feature.business === 'boolean' ? (
                        feature.business ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : <span className="text-white/70 text-xs">{feature.business}</span>}
                    </td>
                    <td className="text-center py-4 px-3">
                      {typeof feature.businessPlus === 'boolean' ? (
                        feature.businessPlus ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : <span className="text-white/70 text-xs">{feature.businessPlus}</span>}
                    </td>
                    <td className="text-center py-4 px-3 bg-purple-500/5">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : <span className="text-white font-medium text-xs">{feature.pro}</span>}
                    </td>
                    <td className="text-center py-4 px-3 bg-amber-500/5">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? <Check className="w-5 h-5 text-amber-400 mx-auto" /> : <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : <span className="text-amber-400 font-medium text-xs">{feature.enterprise}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <p className="text-center text-white/40 text-sm mt-6">Features marked as Add-on are available from an additional cost depending on scope.</p>
        </div>
      </section>

      {/* Add-Ons Section */}
      <section className="py-20 px-6 md:px-10 bg-zinc-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
            Optional Add-Ons
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-white/60 text-center mb-12">
            Enhance your plan with additional services
          </motion.p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {addOns.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors"
              >
                <h3 className="text-white font-semibold text-sm mb-2">{addon.name}</h3>
                <p className="text-purple-400 font-bold text-sm">{addon.price}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm mt-8">Final pricing depends on scope and requirements.</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 md:px-10">
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
      <section className="py-20 px-6 md:px-10 bg-zinc-900/50">
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
                  <OptimizedImage
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
                    width={300}
                    height={400}
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
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4">
            {[
              { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time with no penalty." },
              { q: "Do I get all 8 AI employees?", a: "Yes! Every plan includes access to all 8 specialized AI employees." },
              { q: "What payment methods do you accept?", a: "We accept all major credit cards, debit cards, and bank transfers." },
              { q: "What's included in Custom Premium?", a: "Custom Premium includes custom AI workflows, tailored automations, advanced integrations, SLA-based onboarding, and dedicated telephone support." },
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/get-started')} className="btn-primary text-lg px-12 py-4">
              Get Started
            </button>
            <button onClick={() => navigate('/book-demo')} className="px-12 py-4 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors">
              Book a Demo
            </button>
          </motion.div>
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
