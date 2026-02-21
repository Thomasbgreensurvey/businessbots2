import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Briefcase, HelpCircle, LifeBuoy, Bot, CreditCard, Users, MessageCircle, CalendarDays } from "lucide-react";
import { agents, Agent } from "@/data/agents";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import OptimizedImage from "@/components/OptimizedImage";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgent: (agent: Agent) => void;
  selectedAgentId?: string;
}

// Skool brand blue
const SKOOL_BLUE = "#4B5FD1";

const resourceLinks = [
  { icon: FileText, label: "Blog", path: "/blog" },
  { icon: Briefcase, label: "Case Studies", path: "/case-studies" },
  { icon: CreditCard, label: "Pricing", path: "/pricing" },
  { icon: CalendarDays, label: "Book a Demo", path: "/book-demo" },
  { icon: HelpCircle, label: "FAQ", path: "/faq" },
  { icon: LifeBuoy, label: "Help Centre", path: "/help-centre" },
  { icon: Bot, label: "What is an AI Employee?", path: "/what-is-ai-employee" },
  { icon: MessageCircle, label: "Contact Us", path: "/contact" },
];

export const SideNav = ({ isOpen, onClose, onSelectAgent, selectedAgentId }: SideNavProps) => {
  const navigate = useNavigate();

  const handleResourceClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleCommunityClick = () => {
    navigate("/community");
    onClose();
  };

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
                <OptimizedImage src={logo} alt="Business Bots UK" className="h-10 w-auto" width={40} height={40} priority />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-6 px-5">
              {/* Section Label */}
              <p className="text-white/50 text-sm font-medium mb-4 px-1">Products</p>

              {/* Full Team Card */}
              <div className="bg-white/[0.06] rounded-2xl p-4 mb-6">
                {/* Card Header */}
                <div className="text-center mb-5">
                  <h3 className="text-white font-semibold text-base">Full Team</h3>
                  <p className="text-white/50 text-sm">Business Bots UK</p>
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

              {/* Resources Section */}
              <p className="text-white/50 text-sm font-medium mb-4 px-1">Resources</p>
              <div className="space-y-1">
                {resourceLinks.map((link) => (
                  <motion.button
                    key={link.path}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResourceClick(link.path)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors bg-transparent hover:bg-white/[0.06]"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                      <link.icon className="w-5 h-5 text-white/70" />
                    </div>
                    <span className="text-white/80 font-medium text-[15px]">{link.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Community Section - Separate with blue styling */}
              <p className="text-white/50 text-sm font-medium mb-4 px-1 mt-6">Community</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCommunityClick}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all"
                style={{ 
                  background: `linear-gradient(135deg, ${SKOOL_BLUE}30 0%, ${SKOOL_BLUE}10 100%)`,
                  border: `1px solid ${SKOOL_BLUE}40`
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: SKOOL_BLUE }}
                >
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-[15px]" style={{ color: '#7B8FE1' }}>Join Our Community</span>
              </motion.button>

            </div>

            {/* Footer with Social Links */}
            <div className="px-5 py-5 border-t border-white/10">
              {/* Social Media Links */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <a 
                  href="https://www.facebook.com/share/1GBJ3HR7T2/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:scale-110 transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a 
                  href="https://www.tiktok.com/@businessbotsai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-black hover:ring-2 hover:ring-[#00f2ea] hover:scale-110 transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
                <a 
                  href="https://youtube.com/@businessbotsai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:scale-110 transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a 
                  href="https://www.instagram.com/businessbotsai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:scale-110 transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a 
                  href="https://x.com/businessbotsai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-black hover:ring-2 hover:ring-white hover:scale-110 transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/business-bots-uk/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0A66C2] hover:scale-110 transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
              <p className="text-white/40 text-xs text-center">
                © {new Date().getFullYear()} Business Bots UK
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
          loading="eager"
          decoding="async"
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
