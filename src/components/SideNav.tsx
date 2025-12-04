import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import { agents, Agent } from "@/data/agents";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgent: (agent: Agent) => void;
  selectedAgentId?: string;
}

export const SideNav = ({ isOpen, onClose, onSelectAgent, selectedAgentId }: SideNavProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-[#0a0a0a] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">AI Workforce</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-6 px-5">
              {/* Section Label */}
              <p className="text-white/50 text-sm font-medium mb-4 px-1">Products</p>

              {/* Full Team Card */}
              <div className="bg-white/[0.06] rounded-2xl p-4 mb-2">
                {/* Card Header */}
                <div className="text-center mb-5">
                  <h3 className="text-white font-semibold text-base">Full Team</h3>
                  <p className="text-white/50 text-sm">AI Workforce X</p>
                </div>

                {/* Agent List */}
                <div className="space-y-1">
                  {agents.map((agent) => (
                    <AgentNavItem
                      key={agent.id}
                      agent={agent}
                      isActive={selectedAgentId === agent.id}
                      onClick={() => {
                        onSelectAgent(agent);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-5 border-t border-white/10">
              <p className="text-white/40 text-xs text-center">
                © 2024 AI Workforce
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface AgentNavItemProps {
  agent: Agent;
  isActive: boolean;
  onClick: () => void;
}

const AgentNavItem = ({ agent, isActive, onClick }: AgentNavItemProps) => {
  const gradientMap: Record<string, string> = {
    emerald: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
    rose: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
    indigo: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
    cyan: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
    amber: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    orange: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
    teal: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
    fuchsia: 'linear-gradient(135deg, #e879f9 0%, #c026d3 100%)',
  };

  return (
    <motion.button
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
        transition-colors duration-200
        ${isActive ? 'bg-white/[0.12]' : 'bg-transparent hover:bg-white/[0.06]'}
      `}
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden"
        style={{ background: gradientMap[agent.glowColor] || gradientMap.indigo }}
      >
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full h-full object-cover object-top scale-150 translate-y-2"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-[15px] truncate">
          {agent.shortRole}
        </h4>
        <p className="text-white/50 text-sm truncate">
          {agent.name}
        </p>
      </div>
    </motion.button>
  );
};
