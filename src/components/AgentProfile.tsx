import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import OptimizedImage from "@/components/OptimizedImage";
import SEOSchema from "@/components/SEOSchema";
import { ArrowLeft, ArrowRight, Check, Menu, Sparkles, Lightbulb, Calendar, MessageCircle, CreditCard } from "lucide-react";
import { Agent, GlowColor, agents } from "@/data/agents";
import sproutTablet from "@/assets/agents/sprout-tablet.png";
import likePhone from "@/assets/agents/like-phone.jpeg";
import tobbyHand from "@/assets/agents/tobby-hand.jpeg";
import zenPhone from "@/assets/agents/zen-phone.jpeg";
import nanoHeadset from "@/assets/agents/nano-headset.png";
import lillyHeadset from "@/assets/agents/lilly-headset.jpeg";
import banjoSweater from "@/assets/agents/banjo-sweater.jpeg";
import skootTablet from "@/assets/agents/skoot-tablet.jpeg";
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

  const handleDemoClick = () => {
    navigate('/book-demo');
    toast.success("Book your personalized demo", { description: `See ${agent.name} in action.` });
  };

  const handleContactClick = () => {
    navigate('/contact');
    toast.success("Get in touch with us", { description: "We'd love to hear from you." });
  };

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: getAgentGradient(agent.glowColor),
      }}
    >
      {/* Product Schema for this AI Employee */}
      <SEOSchema
        pageTitle={`${agent.name} - ${agent.role} | Business Bots UK`}
        pageDescription={agent.description}
        products={[{
          name: `${agent.name} - ${agent.role}`,
          description: agent.extendedDescription,
          image: `https://businessbotsuk.com/agents/${agent.id}.png`,
          sku: `BBUK-${agent.id.toUpperCase()}`,
          price: "499",
          priceCurrency: "GBP",
          ratingValue: "5",
          reviewCount: "12",
        }]}
      />
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
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-8 px-4 overflow-hidden max-w-full">
        {/* Cursive Watermark */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none max-w-full">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-[32vw] md:text-[22vw] whitespace-nowrap select-none -translate-y-[8vh] md:-translate-y-[5vh]"
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

        {/* Agent Name - Large, Centered, Handwriting Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="z-20 mb-0 text-center"
        >
          <h2 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-white/90"
            style={{ 
              fontFamily: "'Dancing Script', 'Pacifico', cursive",
            }}
          >
            {agent.name}
          </h2>
        </motion.div>

        {/* Agent Image */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10 w-full max-w-lg md:max-w-2xl flex-1 flex items-end justify-center"
        >
          <OptimizedImage
            src={agent.image}
            alt={agent.name}
            className="w-full h-auto object-contain max-h-[50vh] md:max-h-[55vh]"
            width={600}
            height={800}
            priority
          />
        </motion.div>
      </section>

      {/* Hero CTA - Single elegant button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-20 -mt-4 mb-8 flex flex-col items-center gap-4"
      >
        {agent.id === "zen" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/autopilot-seo")}
            className="flex items-center gap-2 px-12 py-5 rounded-full font-bold text-white text-xl shadow-2xl"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #4338CA 100%)", boxShadow: "0 10px 40px rgba(37,99,235,0.4)" }}
          >
            <Sparkles className="w-6 h-6" />
            Try Zen SEO
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDemoClick}
          className="flex items-center gap-2 px-10 py-4 rounded-full font-bold text-white text-lg shadow-2xl"
          style={{ background: getAgentGradient(agent.glowColor) }}
        >
          <Calendar className="w-5 h-5" />
          Book Your Free Demo
        </motion.button>
      </motion.div>

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
          
          {/* CTA after description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleHireClick}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white"
              style={{ background: getAgentGradient(agent.glowColor) }}
            >
              <CreditCard className="w-5 h-5" />
              View Pricing
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContactClick}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-gray-700 border-2 border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Sales
            </motion.button>
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

      {/* Sprout Special Section - Tablet Image */}
      {agent.id === 'sprout' && (
        <section className="relative bg-black py-16 md:py-24 overflow-hidden">
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.4) 0%, rgba(34, 197, 94, 0.2) 40%, transparent 70%)',
            }}
          />
          
          <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Stylish Name */}
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                style={{ 
                  fontFamily: "'Dancing Script', 'Pacifico', cursive",
                  color: '#10B981',
                }}
              >
                Sprout
              </motion.h2>
              
              {/* Tablet Image */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-sm md:max-w-md"
              >
                <OptimizedImage
                  src={sproutTablet}
                  alt="Sprout with tablet showing email campaign"
                  className="w-full h-auto object-contain"
                  width={448}
                  height={448}
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Like Special Section - Phone Image */}
      {agent.id === 'like' && (
        <section className="relative bg-black py-16 md:py-24 overflow-hidden">
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.4) 0%, rgba(249, 115, 22, 0.2) 40%, transparent 70%)',
            }}
          />
          
          <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Stylish Name */}
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                style={{ 
                  fontFamily: "'Dancing Script', 'Pacifico', cursive",
                  color: '#FBBF24',
                }}
              >
                Like
              </motion.h2>
              
              {/* Phone Image */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-sm md:max-w-md"
              >
                <OptimizedImage
                  src={likePhone}
                  alt="Like with phone for social media management"
                  className="w-full h-auto object-contain"
                  width={448}
                  height={448}
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Tobby Special Section - Hand Image */}
      {agent.id === 'tobby' && (
        <section className="relative bg-black py-16 md:py-24 overflow-hidden">
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.4) 0%, rgba(249, 115, 22, 0.2) 40%, transparent 70%)',
            }}
          />
          
          <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Stylish Name */}
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                style={{ 
                  fontFamily: "'Dancing Script', 'Pacifico', cursive",
                  color: '#EF4444',
                }}
              >
                Tobby
              </motion.h2>
              
              {/* Hand Image */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-sm md:max-w-md"
              >
                <OptimizedImage
                  src={tobbyHand}
                  alt="Tobby figurine in hand for outbound sales"
                  className="w-full h-auto object-contain"
                  width={448}
                  height={448}
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Zen Special Section - Phone Image */}
      {agent.id === 'zen' && (
        <section className="relative bg-black py-16 md:py-24 overflow-hidden">
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.4) 0%, rgba(6, 182, 212, 0.2) 40%, transparent 70%)',
            }}
          />
          
          <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Stylish Name */}
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                style={{ 
                  fontFamily: "'Dancing Script', 'Pacifico', cursive",
                  color: '#14B8A6',
                }}
              >
                Zen
              </motion.h2>
              
              {/* Phone Image */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-sm md:max-w-md"
              >
                <OptimizedImage
                  src={zenPhone}
                  alt="Zen with phone for lead generation"
                  className="w-full h-auto object-contain"
                  width={448}
                  height={448}
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Nano Special Section - Headset Image */}
      {agent.id === 'nano' && (
        <section className="relative bg-black py-16 md:py-24 overflow-hidden">
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.4) 0%, rgba(20, 184, 166, 0.2) 40%, transparent 70%)',
            }}
          />
          
          <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Stylish Name */}
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                style={{ 
                  fontFamily: "'Dancing Script', 'Pacifico', cursive",
                  color: '#06B6D4',
                }}
              >
                Nano
              </motion.h2>
              
              {/* Headset Image */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-sm md:max-w-md"
              >
                <OptimizedImage
                  src={nanoHeadset}
                  alt="Nano with headset for inbound sales"
                  className="w-full h-auto object-contain"
                  width={448}
                  height={448}
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Lilly Special Section - Headset Image */}
      {agent.id === 'lilly' && (
        <section className="relative bg-black py-16 md:py-24 overflow-hidden">
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.4) 0%, rgba(244, 114, 182, 0.2) 40%, transparent 70%)',
            }}
          />
          
          <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Stylish Name */}
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                style={{ 
                  fontFamily: "'Dancing Script', 'Pacifico', cursive",
                  color: '#EC4899',
                }}
              >
                Lilly
              </motion.h2>
              
              {/* Headset Image */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-sm md:max-w-md"
              >
                <OptimizedImage
                  src={lillyHeadset}
                  alt="Lilly with headset for HR support"
                  className="w-full h-auto object-contain"
                  width={448}
                  height={448}
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Banjo Special Section - Sweater Image */}
      {agent.id === 'banjo' && (
        <section className="relative bg-black py-16 md:py-24 overflow-hidden">
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.4) 0%, rgba(129, 140, 248, 0.2) 40%, transparent 70%)',
            }}
          />
          
          <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Stylish Name */}
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                style={{ 
                  fontFamily: "'Dancing Script', 'Pacifico', cursive",
                  color: '#6366F1',
                }}
              >
                Banjo
              </motion.h2>
              
              {/* Sweater Image */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-sm md:max-w-md"
              >
                <OptimizedImage
                  src={banjoSweater}
                  alt="Banjo for customer support"
                  className="w-full h-auto object-contain"
                  width={448}
                  height={448}
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Skoot Special Section - Tablet Image */}
      {agent.id === 'skoot' && (
        <section className="relative bg-black py-16 md:py-24 overflow-hidden">
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(217, 70, 239, 0.4) 0%, rgba(232, 121, 249, 0.2) 40%, transparent 70%)',
            }}
          />
          
          <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Stylish Name */}
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                style={{ 
                  fontFamily: "'Dancing Script', 'Pacifico', cursive",
                  color: '#D946EF',
                }}
              >
                Skoot
              </motion.h2>
              
              {/* Tablet Image */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-sm md:max-w-md"
              >
                <OptimizedImage
                  src={skootTablet}
                  alt="Skoot with tablet for recruitment"
                  className="w-full h-auto object-contain"
                  width={448}
                  height={448}
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

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

          {/* Single CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDemoClick}
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-white text-lg shadow-lg"
              style={{ background: getAgentGradient(agent.glowColor) }}
            >
              <Calendar className="w-5 h-5" />
              Book a Demo with {agent.name}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              How {agent.name} Works
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get started in minutes with a simple 3-step process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Tell Us Your Goals",
                description: `Share your ${agent.shortRole.toLowerCase()} needs and objectives. ${agent.name} learns your brand voice, preferences, and business context.`
              },
              {
                step: "2", 
                title: "AI Gets to Work",
                description: `${agent.name} uses advanced AI to handle tasks 24/7 - from ${agent.capabilities[0]?.toLowerCase() || 'automation'} to ${agent.capabilities[1]?.toLowerCase() || 'optimization'}.`
              },
              {
                step: "3",
                title: "Review & Approve",
                description: `Stay in control with approval workflows. Review ${agent.name}'s work, provide feedback, and watch results improve over time.`
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold"
                  style={{ background: getAgentGradient(agent.glowColor) }}
                >
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats/Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { stat: "24/7", label: "Always Available" },
              { stat: "100+", label: "Languages Supported" },
              { stat: "10x", label: "Faster Than Manual" },
              { stat: "99%", label: "Accuracy Rate" }
            ].map((item, index) => (
              <div key={item.label} className="text-center p-4">
                <p 
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: getAgentAccentColor(agent.glowColor) }}
                >
                  {item.stat}
                </p>
                <p className="text-gray-600 text-sm">{item.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Final CTA - single elegant button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 flex justify-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleHireClick}
              className="flex items-center justify-center gap-2 px-12 py-5 rounded-full font-bold text-white text-lg shadow-lg"
              style={{ background: getAgentGradient(agent.glowColor) }}
            >
              <CreditCard className="w-5 h-5" />
              Get Started with {agent.name}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Pre-Footer CTA Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: getAgentGradient(agent.glowColor) }}
        />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Let {agent.name} handle your {agent.shortRole.toLowerCase()} tasks while you focus on growing your business.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDemoClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg bg-white text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Book Your Free Demo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContactClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/40 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Sales
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleHireClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/40 transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                View Plans
              </motion.button>
            </div>
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
                  <OptimizedImage
                    src={otherAgent.image}
                    alt={otherAgent.name}
                    className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-300"
                    width={200}
                    height={200}
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
