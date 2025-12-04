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

const borderGlowClasses: Record<GlowColor, string> = {
  emerald: "hover:border-glow-emerald/50",
  rose: "hover:border-glow-rose/50",
  indigo: "hover:border-glow-indigo/50",
  cyan: "hover:border-glow-cyan/50",
  amber: "hover:border-glow-amber/50",
  orange: "hover:border-glow-orange/50",
  teal: "hover:border-glow-teal/50",
  fuchsia: "hover:border-glow-fuchsia/50",
};

export const AgentCard = ({ agent, onClick, index }: AgentCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      className={`
        group relative flex flex-col items-center
        w-[160px] min-w-[160px] md:w-full md:min-w-0
        snap-center
        press-effect
      `}
    >
      {/* Card Container */}
      <div
        className={`
          relative w-full aspect-[3/4] rounded-3xl overflow-hidden
          bg-card border border-border/50
          transition-all duration-300 ease-out
          ${borderGlowClasses[agent.glowColor]}
          group-hover:scale-[1.02] group-hover:border-opacity-100
        `}
      >
        {/* Glow Background */}
        <div 
          className={`
            absolute inset-0 opacity-0 group-hover:opacity-100
            transition-opacity duration-500
            ${glowClasses[agent.glowColor]}
          `}
        />
        
        {/* Agent Image */}
        <div className="absolute inset-0 flex items-end justify-center">
          <img
            src={agent.image}
            alt={agent.name}
            className="w-full h-auto object-cover object-top transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card via-card/80 to-transparent" />
      </div>

      {/* Agent Info */}
      <div className="mt-4 text-center">
        <h3 className="text-foreground font-semibold text-base">{agent.name}</h3>
        <p className="text-muted-foreground text-sm mt-0.5">{agent.shortRole}</p>
      </div>
    </motion.button>
  );
};
