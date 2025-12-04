import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents, Agent } from "@/data/agents";
import { AgentCard } from "@/components/AgentCard";
import { AgentProfile } from "@/components/AgentProfile";
import { Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const pageVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

const pageTransition = {
  type: "spring" as const,
  damping: 30,
  stiffness: 300,
};

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {selectedAgent ? (
          <motion.div
            key="profile"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="absolute inset-0"
          >
            <AgentProfile
              agent={selectedAgent}
              onBack={() => setSelectedAgent(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen"
          >
            <HomePage 
              onSelectAgent={setSelectedAgent} 
              isMobile={isMobile}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface HomePageProps {
  onSelectAgent: (agent: Agent) => void;
  isMobile: boolean;
}

const HomePage = ({ onSelectAgent, isMobile }: HomePageProps) => {
  return (
    <div className="min-h-screen flex flex-col px-6 md:px-12 py-8 md:py-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-12 md:mb-16"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
            <Zap className="w-5 h-5 text-background" />
          </div>
          <span className="text-xl font-bold text-foreground">AI Workforce</span>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-10 md:mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 max-w-2xl leading-tight">
          Meet Your New
          <br />
          <span className="text-muted-foreground">AI Team Members</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {agents.map((agent, index) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          index={index}
          onClick={() => onSelectAgent(agent)}
        />
      ))}
    </div>
  );
};

const MobileCarousel = ({ onSelectAgent }: GridProps) => {
  return (
    <div className="flex-1 -mx-6">
      <div 
        className="
          flex gap-4 px-6 overflow-x-auto scrollbar-hide
          snap-x-mandatory scroll-px-6
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
        <div className="min-w-[1px]" />
      </div>
    </div>
  );
};

export default Index;
