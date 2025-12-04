import { motion } from "framer-motion";
import { Agent, GlowColor } from "@/data/agents";

interface AgentCardProps {
  agent: Agent;
  onClick: () => void;
  index: number;
}

const glowClasses: Record<GlowColor, string> = {
  emerald: "bg-glow-emerald",
  rose: "bg-glow-rose",
  indigo: "bg-glow-indigo",
  cyan: "bg-glow-cyan",
  amber: "bg-glow-amber",
  orange: "bg-glow-orange",
  teal: "bg-glow-teal",
  fuchsia: "bg-glow-fuchsia",
};

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
      {/* Glass Card Container */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="
          relative w-full aspect-[3/4] rounded-3xl overflow-hidden
          bg-white/[0.05] backdrop-blur-xl 
          border border-white/10
          group-hover:border-[hsl(270_70%_60%/0.5)]
          transition-colors duration-300
        "
        style={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)"
        }}
      >
        {/* Glow Background on Hover */}
        <div 
          className={`
            absolute inset-0 opacity-0 group-hover:opacity-100
            transition-opacity duration-500
            ${glowClasses[agent.glowColor]}
          `}
        />
        
        {/* Agent Image */}
        <div className="absolute inset-0 flex items-end justify-center">
          <motion.img
            src={agent.image}
            alt={agent.name}
            className="w-full h-auto object-cover object-top transform translate-y-4"
            initial={{ y: 16 }}
            whileHover={{ y: 8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Hover Glow Ring */}
        <div 
          className="
            absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100
            transition-opacity duration-300 pointer-events-none
          "
          style={{
            boxShadow: "inset 0 0 30px hsla(270, 70%, 60%, 0.15)"
          }}
        />
      </motion.div>

      {/* Agent Info */}
      <div className="mt-5 text-center">
        <h3 className="text-foreground font-bold text-lg tracking-tight">{agent.name}</h3>
        <p className="text-muted-foreground text-sm font-medium mt-1">{agent.shortRole}</p>
      </div>
    </motion.button>
  );
};