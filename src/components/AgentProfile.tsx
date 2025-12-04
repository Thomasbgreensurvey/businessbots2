import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { Agent, GlowColor } from "@/data/agents";
import { useIsMobile } from "@/hooks/use-mobile";

interface AgentProfileProps {
  agent: Agent;
  onBack: () => void;
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

const accentTextClasses: Record<GlowColor, string> = {
  emerald: "text-glow-emerald",
  rose: "text-glow-rose",
  indigo: "text-glow-indigo",
  cyan: "text-glow-cyan",
  amber: "text-glow-amber",
  orange: "text-glow-orange",
  teal: "text-glow-teal",
  fuchsia: "text-glow-fuchsia",
};

const accentBgClasses: Record<GlowColor, string> = {
  emerald: "bg-glow-emerald/20",
  rose: "bg-glow-rose/20",
  indigo: "bg-glow-indigo/20",
  cyan: "bg-glow-cyan/20",
  amber: "bg-glow-amber/20",
  orange: "bg-glow-orange/20",
  teal: "bg-glow-teal/20",
  fuchsia: "bg-glow-fuchsia/20",
};

export const AgentProfile = ({ agent, onBack }: AgentProfileProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileProfile agent={agent} onBack={onBack} />;
  }

  return <DesktopProfile agent={agent} onBack={onBack} />;
};

const DesktopProfile = ({ agent, onBack }: AgentProfileProps) => {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
      {/* Left Side - Character Display */}
      <div className="w-1/2 h-full relative flex items-center justify-center">
        {/* Glow Background */}
        <div 
          className={`
            absolute inset-0 
            ${glowClasses[agent.glowColor]}
            animate-pulse-glow
          `}
        />
        
        {/* Agent Image */}
        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          src={agent.image}
          alt={agent.name}
          className="relative z-10 h-[85%] w-auto object-contain animate-float"
        />
      </div>

      {/* Right Side - Content */}
      <div className="w-1/2 h-full overflow-y-auto scrollbar-hide">
        <div className="min-h-full p-12 flex flex-col">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onBack}
            className="
              flex items-center gap-2 text-muted-foreground hover:text-foreground
              transition-colors duration-200 press-effect self-start mb-12
            "
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </motion.button>

          {/* Agent Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            {/* Role Badge */}
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
              ${accentBgClasses[agent.glowColor]}
            `}>
              <Sparkles className={`w-4 h-4 ${accentTextClasses[agent.glowColor]}`} />
              <span className={`text-sm font-medium ${accentTextClasses[agent.glowColor]}`}>
                {agent.role}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-6xl font-bold text-foreground mb-6">
              {agent.name}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-lg">
              {agent.description}
            </p>

            {/* Capabilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Capabilities
              </h3>
              <ul className="space-y-3">
                {agent.capabilities.map((capability, index) => (
                  <motion.li
                    key={capability}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center
                      ${accentBgClasses[agent.glowColor]}
                    `}>
                      <Check className={`w-3.5 h-3.5 ${accentTextClasses[agent.glowColor]}`} />
                    </div>
                    <span>{capability}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`
                mt-12 px-8 py-4 rounded-2xl font-semibold text-lg
                bg-foreground text-background
                hover:opacity-90 transition-opacity duration-200
                press-effect
              `}
            >
              Activate {agent.name}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const MobileProfile = ({ agent, onBack }: AgentProfileProps) => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Top - Character Display */}
      <div className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        {/* Glow Background */}
        <div 
          className={`
            absolute inset-0 
            ${glowClasses[agent.glowColor]}
            animate-pulse-glow
          `}
        />
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="
            absolute top-6 left-6 z-20
            flex items-center gap-2 text-foreground/80 hover:text-foreground
            transition-colors duration-200 press-effect
          "
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        {/* Agent Image */}
        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={agent.image}
          alt={agent.name}
          className="relative z-10 h-full w-auto object-contain"
        />
      </div>

      {/* Bottom Sheet - Content */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", damping: 25 }}
        className="flex-1 bg-card rounded-t-[2rem] -mt-8 relative z-20 px-6 pt-8 pb-12"
      >
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

        {/* Role Badge */}
        <div className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4
          ${accentBgClasses[agent.glowColor]}
        `}>
          <Sparkles className={`w-3.5 h-3.5 ${accentTextClasses[agent.glowColor]}`} />
          <span className={`text-xs font-medium ${accentTextClasses[agent.glowColor]}`}>
            {agent.role}
          </span>
        </div>

        {/* Name */}
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {agent.name}
        </h1>

        {/* Description */}
        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          {agent.description}
        </p>

        {/* Capabilities */}
        <div className="space-y-3 mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Capabilities
          </h3>
          <ul className="space-y-2.5">
            {agent.capabilities.map((capability) => (
              <li
                key={capability}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                  ${accentBgClasses[agent.glowColor]}
                `}>
                  <Check className={`w-3 h-3 ${accentTextClasses[agent.glowColor]}`} />
                </div>
                <span>{capability}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          className={`
            w-full px-6 py-4 rounded-2xl font-semibold
            bg-foreground text-background
            hover:opacity-90 transition-opacity duration-200
            press-effect
          `}
        >
          Activate {agent.name}
        </button>
      </motion.div>
    </div>
  );
};
