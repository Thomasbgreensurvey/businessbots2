import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Menu } from "lucide-react";
import { Agent, GlowColor, agents } from "@/data/agents";

interface AgentProfileProps {
  agent: Agent;
  onBack: () => void;
  onOpenNav?: () => void;
}

export const AgentProfile = ({ agent, onBack, onOpenNav }: AgentProfileProps) => {
  return (
    <div 
      className="min-h-screen w-full overflow-y-auto"
      style={{
        background: getAgentGradient(agent.glowColor),
      }}
    >
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Menu Button + Back / Agent Info */}
          <div className="flex items-center gap-3">
            {onOpenNav && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={onOpenNav}
                className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Menu className="w-5 h-5 text-white" />
              </motion.button>
            )}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              <div className="text-left">
                <span className="font-bold">{agent.name}</span>
                <span className="text-white/60 ml-2 text-sm hidden sm:inline">({agent.shortRole})</span>
              </div>
            </motion.button>
          </div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="btn-outline flex items-center gap-2"
          >
            Hire now
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-6 overflow-hidden">
        {/* Watermark Name */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-watermark whitespace-nowrap"
          >
            {agent.name}
          </motion.span>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center z-20 mb-8"
        >
          <h1 className="heading-hero max-w-3xl">
            Your AI {agent.shortRole}: The Future of {getDomain(agent.shortRole)}
          </h1>
        </motion.div>

        {/* Agent Image */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 flex-1 flex items-end justify-center w-full max-w-3xl"
        >
          <img
            src={agent.image}
            alt={agent.name}
            className="w-full h-auto object-contain max-h-[55vh]"
          />
        </motion.div>
      </section>

      {/* Details Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Meet {agent.name}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {agent.description}
            </p>
          </motion.div>

          {/* Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">
              What {agent.name} can do for you
            </h3>
            <ul className="grid gap-4">
              {agent.capabilities.map((capability, index) => (
                <motion.li
                  key={capability}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: getAgentGradient(agent.glowColor) }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground pt-1">{capability}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              className="px-8 py-4 rounded-full font-bold text-white text-lg"
              style={{ background: getAgentGradient(agent.glowColor) }}
            >
              Hire {agent.name} Now
            </button>
            <button className="px-8 py-4 rounded-full font-semibold text-foreground border border-border hover:bg-secondary transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Other Agents */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-foreground mb-8"
          >
            Meet Other Team Members
          </motion.h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agents
              .filter(a => a.id !== agent.id)
              .slice(0, 4)
              .map((otherAgent, index) => (
                <motion.div
                  key={otherAgent.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl overflow-hidden aspect-square relative cursor-pointer group"
                  style={{ background: getAgentGradient(otherAgent.glowColor) }}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <img
                    src={otherAgent.image}
                    alt={otherAgent.name}
                    className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white font-semibold text-sm">{otherAgent.name}</p>
                  </div>
                </motion.div>
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

function getDomain(role: string): string {
  const domains: Record<string, string> = {
    'Email Marketing': 'Email Marketing',
    'HR': 'Human Resources',
    'Social Media': 'Social Media',
    'Support': 'Customer Support',
    'Lead Gen': 'Lead Generation',
    'Outbound Sales': 'Sales',
    'Inbound Sales': 'Sales',
    'Recruitment': 'Recruitment',
  };
  return domains[role] || 'Business';
}