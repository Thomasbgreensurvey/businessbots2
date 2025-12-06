import { motion } from "framer-motion";
import { ArrowLeft, Users, Rocket, BookOpen, Award, Target, Zap, TrendingUp, ExternalLink, CheckCircle, GraduationCap, Briefcase, ChevronRight, Sparkles, Star, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import skoolBadge from "@/assets/skool-badge.png";
import skoolBanner from "@/assets/skool-banner.jpeg";
import skoolLogo from "@/assets/skool-logo.jpeg";

const SKOOL_LINK = "https://www.skool.com/sales-ai-business-marketing-7663/about?ref=002573a2eb4443249a5fce3b6607713d";

// Skool brand blue color
const SKOOL_BLUE = "#4B5FD1";

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 }
};

const Community = () => {
  const navigate = useNavigate();

  const handleJoinCommunity = () => {
    window.open(SKOOL_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoinCommunity}
            className="px-4 py-2 rounded-full text-white font-semibold text-sm flex items-center gap-2"
            style={{ backgroundColor: SKOOL_BLUE }}
          >
            Join Free
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden" style={{ background: `linear-gradient(135deg, ${SKOOL_BLUE}15 0%, white 50%, ${SKOOL_BLUE}10 100%)` }}>
        {/* Floating decorative elements */}
        <motion.div 
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-16 h-16 rounded-2xl opacity-20"
          style={{ backgroundColor: SKOOL_BLUE }}
        />
        <motion.div 
          animate={{ y: [8, -8, 8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-10"
          style={{ backgroundColor: SKOOL_BLUE }}
        />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ backgroundColor: `${SKOOL_BLUE}15`, color: SKOOL_BLUE }}
          >
            <Sparkles className="w-4 h-4" />
            FREE to Join
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Become an AI
            <br />
            <span style={{ color: SKOOL_BLUE }}>Solutions Expert</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Join Business Bots UK's exclusive learning community. Develop cutting-edge AI skills for business development, sales automation, and marketing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinCommunity}
              className="px-8 py-4 rounded-full text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: SKOOL_BLUE, boxShadow: `0 10px 40px ${SKOOL_BLUE}40` }}
            >
              Join Free Community
              <ExternalLink className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { stat: "FREE", label: "To Join" },
              { stat: "50+", label: "Years Experience" },
              { stat: "24/7", label: "Community Access" },
              { stat: "100%", label: "Career Focused" }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02 }}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: SKOOL_BLUE }}>
                  {item.stat}
                </p>
                <p className="text-gray-600 text-sm">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Banner Image Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
            onClick={handleJoinCommunity}
          >
            <img 
              src={skoolBanner} 
              alt="Sales & AI Business Marketing Academy" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What You'll Learn
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Master the skills that businesses are desperately seeking
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: TrendingUp, title: "AI-Powered Sales", description: "Leverage AI to automate prospecting and close more deals" },
              { icon: Target, title: "Digital Marketing Mastery", description: "Master AI-driven marketing strategies and automation" },
              { icon: Zap, title: "Business Automation", description: "Streamline operations with AI employees" },
              { icon: BookOpen, title: "App Design & No-Code", description: "Build applications without coding" },
              { icon: Users, title: "Client Acquisition", description: "Attract high-value clients using AI-enhanced outreach" },
              { icon: Award, title: "AI Certification Path", description: "Become a certified AI Solutions Expert" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${SKOOL_BLUE}15` }}
                >
                  <item.icon className="w-7 h-7" style={{ color: SKOOL_BLUE }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Career Opportunity Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl overflow-hidden shadow-lg cursor-pointer"
              onClick={handleJoinCommunity}
            >
              <img src={skoolLogo} alt="Sales & AI Business Marketing" className="w-full h-auto" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{ backgroundColor: `${SKOOL_BLUE}15`, color: SKOOL_BLUE }}
              >
                <Briefcase className="w-4 h-4" />
                Career Opportunity
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Join Our Team & Build Your AI Career
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Business Bots UK is actively recruiting passionate individuals who want to develop their AI expertise.
              </p>
              
              <div className="space-y-3 mb-8">
                {[
                  "Access to exclusive AI training resources",
                  "Direct mentorship from industry experts",
                  "Networking with like-minded professionals",
                  "Pathway to join Business Bots UK team",
                  "Real-world project experience"
                ].map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: SKOOL_BLUE }} />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinCommunity}
                className="px-8 py-4 rounded-full text-white font-bold flex items-center gap-2 shadow-lg"
                style={{ backgroundColor: SKOOL_BLUE, boxShadow: `0 10px 40px ${SKOOL_BLUE}40` }}
              >
                Start Your Journey Today
                <ExternalLink className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Who Is This For?
            </h2>
            <p className="text-lg text-gray-600">
              Our community welcomes anyone with a passion for AI
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              { icon: GraduationCap, title: "Students & Career Changers", description: "Break into the AI industry with practical, job-ready skills" },
              { icon: Briefcase, title: "Business Owners", description: "Understand how AI can transform your operations" },
              { icon: TrendingUp, title: "Sales & Marketing Professionals", description: "10x your results with AI-powered automation" },
              { icon: Rocket, title: "Aspiring Entrepreneurs", description: "Start an AI-focused business or add AI services" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.01 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${SKOOL_BLUE}15` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: SKOOL_BLUE }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Badge Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-gray-50"
          >
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="w-24 h-24 flex-shrink-0"
            >
              <img src={skoolBadge} alt="Skool Badge" className="w-full h-full object-contain" />
            </motion.div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Skool Community</h3>
              <p className="text-gray-600 mb-4">
                Get instant access to lessons, resources, and a supportive community of AI enthusiasts.
              </p>
              <motion.button
                whileHover={{ x: 5 }}
                onClick={handleJoinCommunity}
                className="flex items-center gap-2 font-medium mx-auto md:mx-0"
                style={{ color: SKOOL_BLUE }}
              >
                Access the community <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 px-4" style={{ background: `linear-gradient(135deg, ${SKOOL_BLUE} 0%, #3B4FC1 100%)` }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Star className="w-12 h-12 text-white/80" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our free community today and take the first step towards becoming an AI Solutions Expert.
            </p>
            <motion.button
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinCommunity}
              className="px-10 py-5 bg-white font-bold text-lg rounded-full flex items-center gap-3 mx-auto shadow-2xl"
              style={{ color: SKOOL_BLUE }}
            >
              Join Business Bots UK Community
              <ExternalLink className="w-6 h-6" />
            </motion.button>
            <p className="text-white/70 mt-6 text-sm">
              100% Free • No Credit Card Required • Instant Access
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Business Bots UK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Community;
