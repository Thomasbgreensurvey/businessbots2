import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents, Agent } from "@/data/agents";
import { AgentCard } from "@/components/AgentCard";
import { AgentProfile } from "@/components/AgentProfile";
import { Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-deep-space noise-overlay overflow-hidden">
      <AnimatePresence mode="wait">
        {selectedAgent ? (
          <motion.div
            key="profile"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50"
          >
            <AgentProfile
              agent={selectedAgent}
              onBack={() => setSelectedAgent(null)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Home Content - Scale down when profile is open (iOS style) */}
      <motion.div
        animate={{ 
          scale: selectedAgent ? 0.95 : 1,
          opacity: selectedAgent ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="min-h-screen relative z-10"
      >
        <HomePage 
          onSelectAgent={setSelectedAgent} 
          isMobile={isMobile}
        />
      </motion.div>
    </div>
  );
};

interface HomePageProps {
  onSelectAgent: (agent: Agent) => void;
  isMobile: boolean;
}

const HomePage = ({ onSelectAgent, isMobile }: HomePageProps) => {
  return (
    <div className="min-h-screen flex flex-col px-6 md:px-12 lg:px-16 py-8 md:py-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-16 md:mb-20"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">AI Workforce</span>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-12 md:mb-20 text-center md:text-left"
      >
        <h1 className="heading-xl mb-6 max-w-3xl mx-auto md:mx-0">
          Your AI
          <br />
          <span className="bg-gradient-to-r from-[hsl(239,84%,67%)] to-[hsl(271,81%,56%)] bg-clip-text text-transparent">
            Workforce.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 font-medium">
          8 specialized AI agents ready to automate your business operations 24/7.
        </p>
      </motion.div>

      {/* Agent Grid / Carousel */}
      {isMobile ? (
        <MobileCarousel onSelectAgent={onSelectAgent} />
      ) : (
        <DesktopGrid onSelectAgent={onSelectAgent} />
      )}
    </div>
  );
};

interface GridProps {
  onSelectAgent: (agent: Agent) => void;
}

const DesktopGrid = ({ onSelectAgent }: GridProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
    >
      {agents.map((agent, index) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          index={index}
          onClick={() => onSelectAgent(agent)}
        />
      ))}
    </motion.div>
  );
};

const MobileCarousel = ({ onSelectAgent }: GridProps) => {
  return (
    <div className="flex-1 -mx-6">
      <div 
        className="
          flex gap-5 px-6 overflow-x-auto scrollbar-hide
          snap-x-mandatory scroll-px-6
          pb-8
        "
      >
        {agents.map((agent, index) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            index={index}
            onClick={() => onSelectAgent(agent)}
          />
        ))}
        {/* Spacer for last card */}
        <div className="min-w-[24px]" />
      </div>
    </div>
  );
};

export default Index;