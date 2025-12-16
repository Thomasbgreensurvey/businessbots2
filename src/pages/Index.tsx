import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { agents, Agent } from "@/data/agents";
import { AgentProfile } from "@/components/AgentProfile";
import { SideNav } from "@/components/SideNav";
import { Menu, Clock, Globe, Zap, Brain, FolderOpen, MessageCircle, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import integrationsImg from "@/assets/integrations.jpeg";
import robotFigurine from "@/assets/robot-figurine.png";
import robotHighfive from "@/assets/robot-highfive.jpeg";
import phoneApp from "@/assets/phone-app.jpeg";
import phoneIntegrations from "@/assets/phone-integrations.jpeg";
import botsPair from "@/assets/bots-pair.jpeg";
const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Side Navigation */}
      <SideNav
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        onSelectAgent={setSelectedAgent}
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
              onSelectAgent={setSelectedAgent}
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
            <HomePage onSelectAgent={setSelectedAgent} onOpenNav={() => setIsNavOpen(true)} />
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
            <img src={logo} alt="Business Bots UK" className="h-16 md:h-20 w-auto" />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {/* Phone Number */}
            <a 
              href="tel:01916733290"
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-medium text-xs md:text-sm tracking-wide">0191 673 3290</span>
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
          <img
            src={featuredAgent.image}
            alt={featuredAgent.name}
            className="w-full h-auto object-contain max-h-[60vh] sm:max-h-[75vh] md:max-h-[85vh] cursor-pointer drop-shadow-2xl pointer-events-auto"
            onClick={() => onSelectAgent(featuredAgent)}
            loading="eager"
            fetchPriority="high"
            decoding="async"
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
            <img 
              src={robotHighfive} 
              alt="AI Bot giving a high five" 
              className="w-full h-auto object-cover"
            />
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
            <img 
              src={phoneApp} 
              alt="Business Bots UK mobile app" 
              className="w-full h-auto object-cover"
            />
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
            <img 
              src={phoneIntegrations} 
              alt="Business Bots UK integrations" 
              className="w-full h-auto object-cover"
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
            <img 
              src={integrationsImg} 
              alt="Integrations with Facebook, Instagram, Gmail, Google Calendar, Outlook, Google Drive, Strava, and Notion" 
              className="w-full max-w-3xl rounded-2xl"
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
            <img 
              src={botsPair} 
              alt="Business Bots UK AI assistants" 
              className="w-full h-auto object-cover"
            />
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
              <img 
                src={robotFigurine} 
                alt="AI Bot figurine - Your new team member" 
                className="w-full max-w-md drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col items-center gap-8">
            <img src={logo} alt="Business Bots UK" className="h-10 w-auto" />
            
            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/share/1GBJ3HR7T2/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:scale-110 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a 
                href="https://www.tiktok.com/@businessbotsai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-black hover:ring-2 hover:ring-[#00f2ea] hover:scale-110 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
              <a 
                href="https://youtube.com/@businessbotsai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:scale-110 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a 
                href="https://www.instagram.com/businessbotsai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:scale-110 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a 
                href="https://x.com/businessbotsai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-black hover:ring-2 hover:ring-white hover:scale-110 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/business-bots-uk/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0A66C2] hover:scale-110 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 text-white/60 text-sm">
              <a 
                href="mailto:ai@businessbotsuk.com" 
                className="hover:text-white transition-colors"
              >
                ai@businessbotsuk.com
              </a>
              <span className="hidden md:inline">•</span>
              <p>© {new Date().getFullYear()} Business Bots UK. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
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
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
          loading="eager"
          decoding="async"
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
              <img
                src={currentAgent.image}
                alt={currentAgent.name}
                className="w-full h-full object-contain object-bottom"
                loading="eager"
                decoding="async"
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

function getAgentGradient(color: string): string {
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