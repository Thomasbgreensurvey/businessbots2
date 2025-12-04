import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents, Agent } from "@/data/agents";
import { AgentProfile } from "@/components/AgentProfile";
import { SideNav } from "@/components/SideNav";
import { Menu, Clock, Globe, Zap, Brain, FolderOpen, MessageCircle, Mail, Calendar, MessageSquare, Camera, User, Briefcase, HardDrive, ChevronLeft, ChevronRight } from "lucide-react";
import logo from "@/assets/logo.png";

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
  const featuredAgent = agents[featuredIndex];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenNav}
              className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
            >
              <Menu className="w-5 h-5 text-white" />
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

      {/* Hero Section */}
      <motion.section 
        className="relative h-[85vh] md:h-screen overflow-hidden transition-colors duration-700 touch-pan-y"
        style={{
          background: getAgentGradient(featuredAgent.glowColor),
        }}
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
        <div className="absolute bottom-[28%] md:bottom-[30%] left-6 md:left-12 lg:left-20 z-20 max-w-xl pointer-events-none">
          <motion.div
            key={featuredAgent.id + '-content'}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6" style={{ letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              {featuredAgent.heroHeadline}
            </h1>
            <p className="text-white/60 text-base md:text-lg mb-8 max-w-md font-medium">
              {featuredAgent.heroSubtext}
            </p>
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
          className="absolute right-0 bottom-0 z-10 w-[60%] md:w-[50%] lg:w-[45%] h-full flex items-end justify-center pointer-events-none"
        >
          <img
            src={featuredAgent.image}
            alt={featuredAgent.name}
            className="w-full h-auto object-contain max-h-[85vh] cursor-pointer drop-shadow-2xl pointer-events-auto"
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
      <section className="bg-background py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Your AI Team
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
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
      <section className="bg-background py-16 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 md:mb-6">
              Automates work.<br />
              <span className="text-muted-foreground">Even while you sleep.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
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

      {/* Features Section */}
      <section className="bg-background py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 md:mb-6">
              A co-worker who's<br />
              <span className="text-muted-foreground">always on the clock.</span>
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

      {/* Learning Section */}
      <section className="bg-background py-16 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 md:mb-6">
              They learn your business.<br />
              <span className="text-muted-foreground">Just like real employees.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
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

      {/* Integrations Section */}
      <section className="bg-background py-16 md:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 md:mb-6">
              Integrates with your<br />
              <span className="text-muted-foreground">favorite tools.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
              Streamline business processes by bringing your favorite tools, systems, and AI employees together.
            </p>
          </motion.div>

          {/* Integration logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-6 md:gap-10"
          >
            {[
              { name: "Gmail", Icon: Mail },
              { name: "Calendar", Icon: Calendar },
              { name: "Slack", Icon: MessageSquare },
              { name: "Instagram", Icon: Camera },
              { name: "Facebook", Icon: User },
              { name: "LinkedIn", Icon: Briefcase },
              { name: "Drive", Icon: HardDrive },
              { name: "Messages", Icon: MessageCircle },
            ].map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all">
                  <tool.Icon className="w-7 h-7 md:w-9 md:h-9 text-white/60" />
                </div>
                <span className="text-xs text-muted-foreground">{tool.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
              Ready to meet your new team?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join thousands of businesses already scaling with AI employees. Start your journey today.
            </p>
            <button 
              onClick={() => onSelectAgent(agents[0])}
              className="btn-primary text-lg px-10 py-5 shadow-lg shadow-accent/25"
            >
              Get Started with Business Bots
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <img src={logo} alt="Business Bots UK" className="h-8 w-auto" />
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Business Bots UK. All rights reserved.
            </p>
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
        ${isActive ? 'ring-2 ring-accent ring-offset-2 ring-offset-background scale-[1.02]' : ''}
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

  // Auto-play with pause on hover
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % agents.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, agents.length]);

  return (
    <section 
      className="bg-background py-8 md:py-16"
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
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
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
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {currentAgent.name}
            </h3>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
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
                    ? 'bg-accent w-6'
                    : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
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