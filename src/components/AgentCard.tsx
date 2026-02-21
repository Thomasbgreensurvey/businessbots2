import { motion } from "framer-motion";
import { Agent, GlowColor } from "@/data/agents";
import OptimizedImage from "@/components/OptimizedImage";

interface AgentCardProps {
  agent: Agent;
  onClick: () => void;
  index: number;
}

export const AgentCard = ({ agent, onClick, index }: AgentCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.06, 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      onClick={onClick}
      className="
        group relative flex flex-col items-center
        w-[200px] min-w-[200px] md:w-full md:min-w-0
        snap-center
      "
    >
      {/* Card Container */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden"
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
        
        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      </motion.div>

      {/* Agent Info */}
      <div className="mt-4 text-center">
        <h3 className="text-foreground font-bold text-lg tracking-tight">{agent.name}</h3>
        <p className="text-muted-foreground text-sm font-medium mt-1">{agent.shortRole}</p>
      </div>
    </motion.button>
  );
};

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