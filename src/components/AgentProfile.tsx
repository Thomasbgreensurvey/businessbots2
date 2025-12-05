import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Menu, Sparkles, Lightbulb } from "lucide-react";
import { Agent, GlowColor, agents } from "@/data/agents";
import { toast } from "sonner";

interface AgentProfileProps {
  agent: Agent;
  onBack: () => void;
  onOpenNav?: () => void;
  onSelectAgent?: (agent: Agent) => void;
}

export const AgentProfile = ({ agent, onBack, onOpenNav, onSelectAgent }: AgentProfileProps) => {
  const navigate = useNavigate();

  const handleHireClick = () => {
    navigate('/pricing');
    toast.success(`Let's get ${agent.name} working for you!`, { description: "Choose a plan to get started." });
  };

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        background: getAgentGradient(agent.glowColor),
      }}
    >
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-10 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Menu + Agent Info */}
          <div className="flex items-center gap-2 md:gap-3">
            {onOpenNav && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={onOpenNav}
                className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Menu className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </motion.button>
            )}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-semibold text-sm md:text-base">{agent.name}</span>
              <span className="text-white/60 text-xs md:text-sm">({agent.shortRole})</span>
            </motion.button>
          </div>

          {/* Right: CTA */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleHireClick}
            className="px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            Buy now
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-8 px-4 overflow-hidden">
        {/* Cursive Watermark */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-[28vw] md:text-[18vw] font-script whitespace-nowrap select-none -translate-y-[15vh] md:-translate-y-[5vh]"
            style={{ 
              fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
              color: getAgentAccentColor(agent.glowColor),
            }}
          >
            {agent.name}
          </motion.span>
        </div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center z-20 mb-4 md:mb-8 max-w-4xl"
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Your AI {agent.shortRole}: {agent.tagline}
          </h1>
        </motion.div>

        {/* Agent Name Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="z-20 mb-4"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-white/90">{agent.name}</h2>
        </motion.div>

        {/* Agent Image */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10 w-full max-w-lg md:max-w-2xl flex-1 flex items-end justify-center"
        >
          <img
            src={agent.image}
            alt={agent.name}
            className="w-full h-auto object-contain max-h-[50vh] md:max-h-[55vh]"
          />
        </motion.div>
      </section>

      {/* Description Section - White Background like Sintra */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              <span style={{ color: getAgentAccentColor(agent.glowColor) }}>Meet {agent.name}.</span>{' '}
              {agent.extendedDescription.replace(`Meet ${agent.name}. `, '')}
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-secondary/20 py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-bold text-foreground mb-8 text-center"
          >
            Available at all times. On your command
          </motion.h3>
          <p className="text-muted-foreground text-center mb-10">
            Type your request and start completing tasks in seconds.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {agent.useCases.map((useCase, index) => (
              <motion.div
                key={useCase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-5"
              >
                <p className="text-foreground text-sm md:text-base italic">"{useCase}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise & Fun Facts Section */}
      <section className="bg-background py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Expertise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: getAgentGradient(agent.glowColor) }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Expertise</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {agent.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-foreground text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Surprising Fact */}
              <div className="mt-8 p-5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-muted-foreground mb-2">A surprising thing about {agent.name}...</p>
                <p className="text-foreground font-medium">{agent.surprisingFact}</p>
              </div>
            </motion.div>

            {/* Right Column - Hidden Talent & Hobbies */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {/* Hidden Talent */}
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: getAgentGradient(agent.glowColor) }}
                >
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{agent.name}'s hidden talent</h3>
              </div>
              <p className="text-muted-foreground mb-8">{agent.hiddenTalent}</p>

              {/* Hobbies */}
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-muted-foreground mb-4">Hobbies</p>
                <div className="space-y-2">
                  {agent.hobbies.map((hobby) => (
                    <p key={hobby} className="text-foreground">{hobby}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities-section" className="bg-secondary/20 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-bold text-foreground mb-8"
          >
            What {agent.name} can do for you
          </motion.h3>
          <ul className="grid gap-4">
            {agent.capabilities.map((capability, index) => (
              <motion.li
                key={capability}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: getAgentGradient(agent.glowColor) }}
                >
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-foreground">{capability}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <button 
              onClick={handleHireClick}
              className="px-8 py-4 rounded-full font-bold text-white text-lg"
              style={{ background: getAgentGradient(agent.glowColor) }}
            >
              Hire {agent.name} Now
            </button>
            <button 
              onClick={() => document.getElementById('capabilities-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full font-semibold text-foreground border border-border hover:bg-secondary transition-colors"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Other Agents */}
      <section className="bg-background py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-bold text-foreground mb-8"
          >
            Meet Other Team Members
          </motion.h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {agents
              .filter(a => a.id !== agent.id)
              .slice(0, 4)
              .map((otherAgent, index) => (
                <motion.button
                  key={otherAgent.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    if (onSelectAgent) {
                      onSelectAgent(otherAgent);
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="rounded-xl overflow-hidden aspect-square relative cursor-pointer group"
                  style={{ background: getAgentGradient(otherAgent.glowColor) }}
                >
                  <img
                    src={otherAgent.image}
                    alt={otherAgent.name}
                    className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white font-semibold text-sm">{otherAgent.name}</p>
                    <p className="text-white/70 text-xs">{otherAgent.shortRole}</p>
                  </div>
                </motion.button>
              ))}
          </div>
        </div>
      </section>
    </div>
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

function getAgentAccentColor(color: GlowColor): string {
  const colors: Record<string, string> = {
    emerald: 'hsl(145 55% 35%)',
    rose: 'hsl(340 65% 50%)',
    indigo: 'hsl(250 55% 45%)',
    cyan: 'hsl(190 65% 45%)',
    amber: 'hsl(38 85% 50%)',
    orange: 'hsl(25 90% 50%)',
    teal: 'hsl(175 65% 40%)',
    fuchsia: 'hsl(295 60% 50%)',
  };
  return colors[color] || colors.indigo;
}
