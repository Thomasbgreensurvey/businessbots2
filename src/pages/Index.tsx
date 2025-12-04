import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents, Agent } from "@/data/agents";
import { AgentProfile } from "@/components/AgentProfile";
import { SideNav } from "@/components/SideNav";
import { Menu } from "lucide-react";
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
          <div className="flex items-center gap-3">
            <button className="hidden md:block text-white/80 hover:text-white transition-colors text-sm font-medium px-4 py-2">
              Log in
            </button>
            <button className="btn-primary flex items-center gap-2 text-sm">
              Get Started
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Full Viewport with Sintra-style layout */}
      <section 
        className="relative min-h-screen overflow-hidden transition-colors duration-700"
        style={{
          background: getAgentGradient(featuredAgent.glowColor),
        }}
      >
        {/* Atmospheric overlay - darker at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
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

        {/* Hero Content - Left aligned like Sintra */}
        <div className="absolute bottom-[20%] md:bottom-[25%] left-6 md:left-12 lg:left-20 z-20 max-w-xl">
          <motion.div
            key={featuredAgent.id + '-content'}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6" style={{ letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              AI Bots: Your Helpers That Never Sleep
            </h1>
            <p className="text-white/60 text-base md:text-lg mb-8 max-w-md font-medium">
              Build, grow, and scale your business with a team of AI employees.
            </p>
            <button 
              onClick={() => onSelectAgent(featuredAgent)}
              className="btn-primary text-base px-8 py-4 shadow-lg shadow-accent/25"
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
          className="absolute right-0 bottom-0 z-10 w-[60%] md:w-[50%] lg:w-[45%] h-full flex items-end justify-center"
        >
          <img
            src={featuredAgent.image}
            alt={featuredAgent.name}
            className="w-full h-auto object-contain max-h-[85vh] cursor-pointer drop-shadow-2xl"
            onClick={() => onSelectAgent(featuredAgent)}
          />
        </motion.div>

        {/* Agent indicator dots - bottom center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {agents.map((agent, index) => (
            <button
              key={agent.id}
              onClick={() => setFeaturedIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                featuredIndex === index 
                  ? 'bg-white w-6' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Agent Roster Section */}
      <section className="bg-background py-16 md:py-24">
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