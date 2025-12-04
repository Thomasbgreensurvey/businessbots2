import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents, Agent } from "@/data/agents";
import { AgentProfile } from "@/components/AgentProfile";
import { SideNav } from "@/components/SideNav";
import { Menu } from "lucide-react";
import logo from "@/assets/logo.png";

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Side Navigation */}
      <SideNav
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        onSelectAgent={setSelectedAgent}
        selectedAgentId={selectedAgent?.id}
      />

      <AnimatePresence mode="wait">
        {selectedAgent ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto"
          >
            <AgentProfile
              agent={selectedAgent}
              onBack={() => setSelectedAgent(null)}
              onOpenNav={() => setIsNavOpen(true)}
              onSelectAgent={setSelectedAgent}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onSelectAgent={setSelectedAgent} onOpenNav={() => setIsNavOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface HomePageProps {
  onSelectAgent: (agent: Agent) => void;
  onOpenNav: () => void;
}

const HomePage = ({ onSelectAgent, onOpenNav }: HomePageProps) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredAgent = agents[featuredIndex];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenNav}
              className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <img src={logo} alt="Business Bots UK" className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:block text-white/80 hover:text-white transition-colors text-sm font-medium px-4 py-2">
              Log in
            </button>
            <button className="btn-primary flex items-center gap-2 text-sm">
              Get Started
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Full Viewport with Sintra-style layout */}
      <section 
        className="relative min-h-screen overflow-hidden transition-colors duration-700"
        style={{
          background: getAgentGradient(featuredAgent.glowColor),
        }}
      >
        {/* Atmospheric overlay - darker at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }} />

        {/* Watermark Name - More subtle */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <motion.span 
            key={featuredAgent.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[10rem] sm:text-[14rem] md:text-[18rem] lg:text-[24rem] font-extrabold text-white/[0.04] whitespace-nowrap select-none"
            style={{ letterSpacing: '-0.04em', lineHeight: 0.8 }}
          >
            {featuredAgent.name}
          </motion.span>
        </div>

      {/* Hero Content - Left aligned like Sintra */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-12 lg:left-20 z-20 max-w-xl">
          <motion.div
            key={featuredAgent.id + '-content'}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6" style={{ letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              AI Bots: Your Helpers That Never Sleep
            </h1>
            <p className="text-white/60 text-base md:text-lg mb-8 max-w-md font-medium">
              Build, grow, and scale your business with a team of AI employees.
            </p>
            <button 
              onClick={() => onSelectAgent(featuredAgent)}
              className="btn-primary text-base px-8 py-4 shadow-lg shadow-accent/25"
            >
              Get Business Bots
            </button>
          </motion.div>
        </div>

        {/* Featured Agent Image - Right side, large like Sintra */}
        <motion.div
          key={featuredAgent.id}
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute right-0 bottom-0 z-10 w-[60%] md:w-[50%] lg:w-[45%] h-full flex items-end justify-center"
        >
          <img
            src={featuredAgent.image}
            alt={featuredAgent.name}
            className="w-full h-auto object-contain max-h-[85vh] cursor-pointer drop-shadow-2xl"
            onClick={() => onSelectAgent(featuredAgent)}
          />
        </motion.div>

        {/* Agent indicator dots - bottom center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {agents.map((agent, index) => (
            <button
              key={agent.id}
              onClick={() => setFeaturedIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                featuredIndex === index 
                  ? 'bg-white w-6' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Agent Roster Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Your AI Team
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              8 specialized AI agents ready to automate your business operations 24/7.
            </p>
          </motion.div>

          {/* Agent Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {agents.map((agent, index) => (
              <AgentThumbnail
                key={agent.id}
                agent={agent}
                index={index}
                isActive={featuredIndex === index}
                onHover={() => setFeaturedIndex(index)}
                onClick={() => onSelectAgent(agent)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Automation Section */}
      <section className="bg-gradient-to-b from-background to-background/95 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
              Automates work.<br />
              <span className="text-muted-foreground">Even while you sleep.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Automate tasks with intelligent AI tools—create social media posts, respond to customers, manage emails, and more—freeing your team from repetitive tasks.
            </p>
          </motion.div>

          {/* Automation Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                agent: "Banjo",
                task: "Schedule social media posts for me",
                description: "Automate your social media game. Write, create, and post content effortlessly with AI-powered solutions.",
                gradient: "from-indigo-500/20 to-purple-500/20"
              },
              {
                agent: "Timi",
                task: "Check my customer messages",
                description: "Engage your audience with intelligent responses. Use AI for customer support to analyze and craft personalized replies.",
                gradient: "from-cyan-500/20 to-blue-500/20"
              },
              {
                agent: "Sprout",
                task: "Create my email campaigns",
                description: "Boost productivity with AI. Streamline email marketing with automated campaigns and personalized content.",
                gradient: "from-emerald-500/20 to-green-500/20"
              }
            ].map((item, index) => (
              <motion.div
                key={item.agent}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-3xl bg-gradient-to-br ${item.gradient} border border-white/10 p-8 backdrop-blur-sm hover:border-white/20 transition-colors`}
              >
                <p className="text-accent font-semibold mb-2">{item.agent}</p>
                <h3 className="text-xl font-bold text-foreground mb-4">"{item.task}"</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
                A co-worker who's always on the clock.
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🌙</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Available 24/7</h3>
                    <p className="text-muted-foreground">AI tools are always on and available around the clock to support your business. The only helpers who love overtime.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Speaks 100+ languages</h3>
                    <p className="text-muted-foreground">Go global—communicate and complete your work in over 100 languages with native-level fluency.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Lightning fast</h3>
                    <p className="text-muted-foreground">Complete tasks in seconds that would take humans hours. Save your most valuable asset—your time.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent/20 via-accent/5 to-transparent border border-white/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-8xl mb-4">🤖</div>
                  <p className="text-2xl font-bold text-foreground">Never sleeps</p>
                  <p className="text-muted-foreground">Always ready to help</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Section */}
      <section className="bg-gradient-to-b from-background to-background/95 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
              They learn your business.<br />
              <span className="text-muted-foreground">Just like real employees.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Add files, instructions, and your website for more unique results. The more information they have, the better the outcome.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🧠", title: "Improves over time", desc: "Your AI team gets smarter with every interaction, learning your preferences and business needs." },
              { icon: "📁", title: "Remembers everything", desc: "Files, websites, facts—they never forget the context that matters to your business." },
              { icon: "💬", title: "Asks guided questions", desc: "Smart follow-ups ensure they understand exactly what you need before delivering results." }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
              Ready to meet your new team?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join thousands of businesses already scaling with AI employees. Start your journey today.
            </p>
            <button 
              onClick={() => onSelectAgent(agents[0])}
              className="btn-primary text-lg px-10 py-5 shadow-lg shadow-accent/25"
            >
              Get Started with Business Bots
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <img src={logo} alt="Business Bots UK" className="h-8 w-auto" />
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Business Bots UK. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface AgentThumbnailProps {
  agent: Agent;
  index: number;
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
}

const AgentThumbnail = ({ agent, index, isActive, onHover, onClick }: AgentThumbnailProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={onHover}
      onClick={onClick}
      className={`
        group relative rounded-2xl overflow-hidden aspect-[3/4]
        transition-all duration-300
        ${isActive ? 'ring-2 ring-accent ring-offset-2 ring-offset-background scale-[1.02]' : ''}
      `}
      style={{
        background: getAgentGradient(agent.glowColor),
      }}
    >
      {/* Agent Image */}
      <div className="absolute inset-0 flex items-end justify-center">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Agent Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <h3 className="text-white font-bold text-lg">{agent.name}</h3>
        <p className="text-white/70 text-sm">{agent.shortRole}</p>
      </div>
    </motion.button>
  );
};

function getAgentGradient(color: string): string {
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

export default Index;