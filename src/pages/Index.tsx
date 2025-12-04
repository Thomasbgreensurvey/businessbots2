import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents, Agent } from "@/data/agents";
import { AgentProfile } from "@/components/AgentProfile";
import { Zap, ArrowRight } from "lucide-react";

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {selectedAgent ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
          >
            <AgentProfile
              agent={selectedAgent}
              onBack={() => setSelectedAgent(null)}
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
            <HomePage onSelectAgent={setSelectedAgent} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface HomePageProps {
  onSelectAgent: (agent: Agent) => void;
}

const HomePage = ({ onSelectAgent }: HomePageProps) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredAgent = agents[featuredIndex];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-5"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">AI Workforce</span>
          </div>
          <button className="btn-primary flex items-center gap-2">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.header>

      {/* Hero Section - Full Viewport */}
      <section 
        className={`
          relative min-h-screen flex items-end justify-center overflow-hidden
          bg-agent-${featuredAgent.glowColor}
          transition-colors duration-700
        `}
        style={{
          background: getAgentGradient(featuredAgent.glowColor),
        }}
      >
        {/* Watermark Name */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <motion.span 
            key={featuredAgent.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-watermark whitespace-nowrap"
          >
            {featuredAgent.name}
          </motion.span>
        </div>

        {/* Hero Content */}
        <div className="absolute top-1/4 left-6 md:left-10 lg:left-16 z-20 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-subtitle mb-3">
              {featuredAgent.role}
            </p>
            <h1 className="heading-hero mb-6">
              AI Employees: Your Helpers That Never Sleep
            </h1>
            <p className="text-subtitle mb-8 max-w-md">
              Build, grow, and scale your business with a team of AI employees.
            </p>
            <button 
              onClick={() => onSelectAgent(featuredAgent)}
              className="btn-primary text-base px-8 py-4"
            >
              Meet {featuredAgent.name}
            </button>
          </motion.div>
        </div>

        {/* Featured Agent Image */}
        <motion.div
          key={featuredAgent.id}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 w-full max-w-2xl mx-auto px-6"
        >
          <img
            src={featuredAgent.image}
            alt={featuredAgent.name}
            className="w-full h-auto object-contain max-h-[70vh] cursor-pointer"
            onClick={() => onSelectAgent(featuredAgent)}
          />
        </motion.div>
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