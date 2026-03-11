import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { agents, Agent, preloadAgentImages } from "@/data/agents";
import { AgentProfile } from "@/components/AgentProfile";
import { SideNav } from "@/components/SideNav";
import { Menu, Clock, Globe, Zap, Brain, FolderOpen, MessageCircle, ChevronLeft, ChevronRight, Phone, Calendar, CreditCard } from "lucide-react";
import { toast } from "sonner";
import OptimizedImage from "@/components/OptimizedImage";
import logo from "@/assets/logo.png";
import integrationsImg from "@/assets/integrations.jpeg";
import robotFigurine from "@/assets/robot-figurine.png";
import robotHighfive from "@/assets/robot-highfive.jpeg";
import phoneApp from "@/assets/phone-app.jpeg";
import phoneIntegrations from "@/assets/phone-integrations.jpeg";
import botsPair from "@/assets/bots-pair.jpeg";
import SiteFooter from "@/components/SiteFooter";
import SEOSchema from "@/components/SEOSchema";
const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectAgent = useCallback((agent: Agent) => {
    setSelectedAgent(agent);
  }, []);

  // Defer-load remaining agent images after initial paint
  useEffect(() => {
    const timer = setTimeout(() => preloadAgentImages(), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Side Navigation */}
      <SideNav
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        onSelectAgent={handleSelectAgent}
        selectedAgentId={selectedAgent?.id}
      />

      <AnimatePresence mode="wait">
        {selectedAgent ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto"
          >
            <AgentProfile
              agent={selectedAgent}
              onBack={() => setSelectedAgent(null)}
              onOpenNav={() => setIsNavOpen(true)}
              onSelectAgent={handleSelectAgent}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onSelectAgent={handleSelectAgent} onOpenNav={() => setIsNavOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface HomePageProps {
  onSelectAgent: (agent: Agent) => void;
  onOpenNav: () => void;
}

const HomePage = ({ onSelectAgent, onOpenNav }: HomePageProps) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const featuredAgent = agents[featuredIndex];
  const navigate = useNavigate();

  // Hero auto-play - faster interval
  useEffect(() => {
    if (isHeroHovered) return;
    
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % agents.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isHeroHovered]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 px-4 md:px-10 py-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={onOpenNav}
              className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <OptimizedImage src={logo} alt="Business Bots UK" className="h-16 md:h-20 w-auto" width={80} height={80} priority />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {/* Phone Number */}
            <a 
              href="tel:08006546949"
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-medium text-xs md:text-sm tracking-wide">0800 654 6949</span>
            </a>
            <button 
              onClick={() => {
                navigate('/pricing');
                toast.info("Login coming soon!", { description: "Check out our pricing plans." });
              }}
              className="hidden md:block text-white/80 hover:text-white transition-colors text-sm font-medium px-4 py-2"
            >
              Log in
            </button>
            <span className="hidden md:inline font-robotic text-white font-bold text-sm md:text-base tracking-wide">
              Business Bots UK
            </span>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative h-[85vh] md:h-screen overflow-hidden transition-colors duration-700 touch-pan-y"
        style={{
          background: getAgentGradient(featuredAgent.glowColor),
        }}
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = offset.x;
          const swipeThreshold = 50;
          
          if (swipe < -swipeThreshold || velocity.x < -500) {
            // Swiped left - next agent
            setFeaturedIndex((prev) => (prev + 1) % agents.length);
          } else if (swipe > swipeThreshold || velocity.x > 500) {
            // Swiped right - previous agent
            setFeaturedIndex((prev) => (prev - 1 + agents.length) % agents.length);
          }
        }}
      >
        {/* Subtle atmospheric overlay - seamless gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.15) 100%)'
        }} />

        {/* Watermark Name - More subtle */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <motion.span 
            key={featuredAgent.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[10rem] sm:text-[14rem] md:text-[18rem] lg:text-[24rem] font-extrabold text-white/[0.04] whitespace-nowrap select-none"
            style={{ letterSpacing: '-0.04em', lineHeight: 0.8 }}
          >
            {featuredAgent.name}
          </motion.span>
        </div>

        {/* Hero Content - Left aligned */}
        <div className="absolute top-[15%] sm:top-[18%] md:top-[20%] left-6 md:left-12 lg:left-20 z-20 max-w-xl pointer-events-none">
          <motion.div
            key={featuredAgent.id + '-content'}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8" style={{ letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              {featuredAgent.heroHeadline}
            </h1>
            <button 
              onClick={() => onSelectAgent(featuredAgent)}
              className="btn-primary text-base px-8 py-4 shadow-lg shadow-accent/25 pointer-events-auto"
            >
              Get Business Bots
            </button>
          </motion.div>
        </div>

        {/* Featured Agent Image - Right side, large like Sintra */}
        <motion.div
          key={featuredAgent.id}
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute right-[-5%] sm:right-0 bottom-[10%] sm:bottom-0 z-10 w-[75%] sm:w-[60%] md:w-[50%] lg:w-[45%] pointer-events-none"
        >
          <OptimizedImage
            src={featuredAgent.image}
            alt={featuredAgent.name}
            className="w-full h-auto object-contain max-h-[60vh] sm:max-h-[75vh] md:max-h-[85vh] cursor-pointer drop-shadow-2xl pointer-events-auto"
            onClick={() => onSelectAgent(featuredAgent)}
            width={600}
            height={800}
            priority
          />
        </motion.div>

        {/* Agent indicator dots - bottom center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {agents.map((agent, index) => (
            <button
              key={agent.id}
              onClick={() => setFeaturedIndex(index)}
              className="p-2 -m-2 cursor-pointer pointer-events-auto"
              aria-label={`View ${agent.name}`}
            >
              <div className={`h-2 rounded-full transition-all duration-300 ${
                featuredIndex === index 
                  ? 'bg-white w-8' 
                  : 'bg-white/40 w-2 hover:bg-white/60'
              }`} />
            </button>
          ))}
        </div>
      </motion.section>

      {/* Agent Roster Section */}
      <section className="bg-black py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Your AI Team
            </h2>
            <p className="text-white/60 text-lg max-w-xl">
              8 specialized AI agents ready to automate your business operations 24/7.
            </p>
          </motion.div>

          {/* Agent Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {agents.map((agent, index) => (
              <AgentThumbnail
                key={agent.id}
                agent={agent}
                index={index}
                isActive={featuredIndex === index}
                onHover={() => setFeaturedIndex(index)}
                onClick={() => onSelectAgent(agent)}
              />
            ))}
          </div>

          {/* CTA after roster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/book-demo')}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/25"
            >
              <Calendar className="w-5 h-5" />
              Book a Free Demo
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Full-Screen Agent Carousel - Sintra Style */}
      <AgentCarousel agents={agents} onSelectAgent={onSelectAgent} />

      {/* Automation Section */}
      <section className="bg-black py-16 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6">
              Automates work.<br />
              <span className="text-white/60">Even while you sleep.</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto px-4">
              Automate tasks with intelligent AI tools—create social media posts, respond to customers, manage emails, and more.
            </p>
          </motion.div>

          {/* Automation Cards - Large, mobile-first */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
            {[
              {
                agent: "Banjo",
                task: "Schedule social media posts for me",
                description: "Automate your social media game. Write, create, and post content effortlessly with AI-powered solutions.",
                gradient: "from-indigo-600 via-purple-600 to-indigo-800"
              },
              {
                agent: "Timi",
                task: "Check my customer messages",
                description: "Engage your audience with intelligent responses. Use AI for customer support to analyze and craft personalized replies.",
                gradient: "from-cyan-600 via-blue-600 to-cyan-800"
              },
              {
                agent: "Sprout",
                task: "Create my email campaigns",
                description: "Boost productivity with AI. Streamline email marketing with automated campaigns and personalized content.",
                gradient: "from-emerald-600 via-green-600 to-emerald-800"
              }
            ].map((item, index) => (
              <motion.div
                key={item.agent}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-3xl bg-gradient-to-br ${item.gradient} p-6 md:p-8 min-h-[200px] md:min-h-[280px] flex flex-col justify-end overflow-hidden`}
              >
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10">
                  <p className="text-white/80 font-semibold text-sm mb-2">{item.agent}</p>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">"{item.task}"</h3>
                  <p className="text-white/70 text-sm md:text-base">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Break 1 - Robot Highfive */}
      <section className="bg-black py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden"
          >
            <OptimizedImage 
              src={robotHighfive} 
              alt="AI Bot giving a high five" 
              className="w-full h-auto object-cover"
              width={896}
              height={504}
            />
          </motion.div>
          
          {/* CTA after image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25"
            >
              <CreditCard className="w-5 h-5" />
              View Pricing Plans
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/contact')}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white/90 border border-white/20 hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Sales
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-black py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6">
              A co-worker who's<br />
              <span className="text-white/60">always on the clock.</span>
            </h2>
          </motion.div>

          {/* Feature Cards - Large, mobile-first */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
            {[
              { icon: Clock, title: "Available 24/7", desc: "AI tools are always on and available around the clock to support your business. The only helpers who love overtime.", gradient: "from-amber-600 via-orange-600 to-amber-800" },
              { icon: Globe, title: "Speaks 100+ languages", desc: "Go global—communicate and complete your work in over 100 languages with native-level fluency.", gradient: "from-rose-600 via-pink-600 to-rose-800" },
              { icon: Zap, title: "Lightning fast", desc: "Complete tasks in seconds that would take humans hours. Save your most valuable asset—your time.", gradient: "from-violet-600 via-purple-600 to-violet-800" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-3xl bg-gradient-to-br ${item.gradient} p-6 md:p-8 min-h-[200px] md:min-h-[280px] flex flex-col justify-end overflow-hidden`}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                
                {/* Icon */}
                <div className="absolute top-6 right-6">
                  <item.icon className="w-10 h-10 md:w-12 md:h-12 text-white/30" />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/70 text-sm md:text-base">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Break 2 - Phone App */}
      <section className="bg-black py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden"
          >
            <OptimizedImage 
              src={phoneApp} 
              alt="Business Bots UK mobile app" 
              className="w-full h-auto object-cover"
              width={896}
              height={504}
            />
          </motion.div>
          
          {/* CTA after image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/book-demo')}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-rose-500 to-orange-500 shadow-lg shadow-rose-500/25"
            >
              <Calendar className="w-5 h-5" />
              Schedule Your Demo
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Learning Section */}
      <section className="bg-black py-16 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6">
              They learn your business.<br />
              <span className="text-white/60">Just like real employees.</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto px-4">
              Add files, instructions, and your website for more unique results. The more information they have, the better the outcome.
            </p>
          </motion.div>

          {/* Learning Cards - Large, mobile-first */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
            {[
              { icon: Brain, title: "Improves over time", desc: "Your AI team gets smarter with every interaction, learning your preferences and business needs.", gradient: "from-teal-600 via-cyan-600 to-teal-800" },
              { icon: FolderOpen, title: "Remembers everything", desc: "Files, websites, facts—they never forget the context that matters to your business.", gradient: "from-blue-600 via-indigo-600 to-blue-800" },
              { icon: MessageCircle, title: "Asks guided questions", desc: "Smart follow-ups ensure they understand exactly what you need before delivering results.", gradient: "from-fuchsia-600 via-pink-600 to-fuchsia-800" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-3xl bg-gradient-to-br ${item.gradient} p-6 md:p-8 min-h-[200px] md:min-h-[280px] flex flex-col justify-end overflow-hidden`}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                
                {/* Icon */}
                <div className="absolute top-6 right-6">
                  <item.icon className="w-10 h-10 md:w-12 md:h-12 text-white/30" />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/70 text-sm md:text-base">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Break 3 - Phone Integrations */}
      <section className="bg-black py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden"
          >
            <OptimizedImage 
              src={phoneIntegrations} 
              alt="Business Bots UK integrations" 
              className="w-full h-auto object-cover"
              width={896}
              height={504}
            />
          </motion.div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="bg-black py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6">
              Integrates with your<br />
              <span className="text-white/60">favorite tools.</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto px-4">
              Streamline business processes by bringing your favorite tools, systems, and AI employees together.
            </p>
          </motion.div>

          {/* Integration logos - Using actual brand icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <OptimizedImage 
              src={integrationsImg} 
              alt="Integrations with Facebook, Instagram, Gmail, Google Calendar, Outlook, Google Drive, Strava, and Notion" 
              className="w-full max-w-3xl rounded-2xl"
              width={768}
              height={432}
            />
          </motion.div>
        </div>
      </section>

      {/* Image Break 4 - Bots Pair */}
      <section className="bg-black py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden"
          >
            <OptimizedImage 
              src={botsPair} 
              alt="Business Bots UK AI assistants" 
              className="w-full h-auto object-cover"
              width={896}
              height={504}
            />
          </motion.div>
          
          {/* CTA after image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/contact')}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Our Team
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white/90 border border-white/20 hover:bg-white/10 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              See Plans
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Robot Figurine */}
      <section className="bg-black py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                Ready to meet your new team?
              </h2>
              <p className="text-white/60 text-lg mb-10 max-w-xl">
                Join thousands of businesses already scaling with AI employees. Start your journey today.
              </p>
              <button 
                onClick={() => onSelectAgent(agents[0])}
                className="btn-primary text-lg px-10 py-5 shadow-lg shadow-accent/25"
              >
                Get Started with Business Bots
              </button>
            </motion.div>

            {/* Robot Figurine Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <OptimizedImage 
                src={robotFigurine} 
                alt="AI Bot figurine - Your new team member" 
                className="w-full max-w-md drop-shadow-2xl"
                width={448}
                height={448}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEO Schema */}
      <SEOSchema
        pageTitle="AI Employees for Business | Automate Sales, Support & Marketing 24/7 | Business Bots UK"
        pageDescription="Hire AI employees that work 24/7 to automate your business. 8 AI agents for sales automation, customer support, lead generation, email marketing & recruitment."
        breadcrumbs={[]}
        products={agents.map((a) => ({
          name: `${a.name} - ${a.role}`,
          description: a.description,
          image: `https://businessbotsuk.com/agents/${a.id}.png`,
          sku: `BBUK-${a.id.toUpperCase()}`,
          price: "499",
          priceCurrency: "GBP",
          ratingValue: "5",
          reviewCount: "12",
        }))}
      />

      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

interface AgentThumbnailProps {
  agent: Agent;
  index: number;
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
}

const AgentThumbnail = ({ agent, index, isActive, onHover, onClick }: AgentThumbnailProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={onHover}
      onClick={onClick}
      className={`
        group relative rounded-2xl overflow-hidden aspect-[3/4]
        transition-all duration-300
        ${isActive ? 'ring-2 ring-accent ring-offset-2 ring-offset-black scale-[1.02]' : ''}
      `}
      style={{
        background: getAgentGradient(agent.glowColor),
      }}
    >
      {/* Agent Image */}
      <div className="absolute inset-0 flex items-end justify-center">
        <OptimizedImage
          src={agent.image}
          alt={agent.name}
          className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
          width={300}
          height={400}
          priority
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Agent Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <h3 className="text-white font-bold text-lg">{agent.name}</h3>
        <p className="text-white/70 text-sm">{agent.shortRole}</p>
      </div>
    </motion.button>
  );
};

interface AgentCarouselProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
}

const AgentCarousel = ({ agents, onSelectAgent }: AgentCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const currentAgent = agents[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + agents.length) % agents.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % agents.length);
  };

  // Auto-play with pause on hover - faster interval
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % agents.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isHovered, agents.length]);

  return (
    <section 
      className="bg-black py-8 md:py-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Your AI Workforce
          </h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Card */}
          <motion.div
            key={currentAgent.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative mx-auto rounded-3xl overflow-hidden"
            style={{
              background: getAgentGradient(currentAgent.glowColor),
            }}
          >
            {/* Agent Image - Full screen mobile style */}
            <div 
              className="relative aspect-[3/4] md:aspect-[4/3] cursor-pointer"
              onClick={() => onSelectAgent(currentAgent)}
            >
              <OptimizedImage
                src={currentAgent.image}
                alt={currentAgent.name}
                className="w-full h-full object-contain object-bottom"
                width={800}
                height={600}
                priority
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </motion.div>

          {/* Agent Info Below */}
          <motion.div
            key={currentAgent.id + '-info'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-6 px-2"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {currentAgent.name}
            </h3>
            <p className="text-white/60 text-base md:text-lg leading-relaxed">
              {currentAgent.shortRole}. {currentAgent.description}
            </p>
          </motion.div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {agents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-white w-6'
                    : 'bg-white/30 w-2 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

import { GlowColor } from "@/data/agents";

function getAgentGradient(color: GlowColor): string {
  const gradients: Record<string, string> = {
    emerald: 'linear-gradient(145deg, hsl(145 55% 35%) 0%, hsl(155 50% 22%) 100%)',
    rose: 'linear-gradient(145deg, hsl(340 65% 50%) 0%, hsl(350 60% 32%) 100%)',
    indigo: 'linear-gradient(145deg, hsl(250 55% 45%) 0%, hsl(260 50% 28%) 100%)',
    cyan: 'linear-gradient(145deg, hsl(190 65% 45%) 0%, hsl(200 60% 28%) 100%)',
    amber: 'linear-gradient(145deg, hsl(38 85% 50%) 0%, hsl(30 80% 35%) 100%)',
    orange: 'linear-gradient(145deg, hsl(25 90% 50%) 0%, hsl(15 85% 35%) 100%)',
    teal: 'linear-gradient(145deg, hsl(175 65% 40%) 0%, hsl(185 60% 25%) 100%)',
    fuchsia: 'linear-gradient(145deg, hsl(295 60% 50%) 0%, hsl(305 55% 32%) 100%)',
  };
  return gradients[color] || gradients.indigo;
}

export default Index;
