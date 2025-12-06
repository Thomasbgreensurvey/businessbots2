import { motion } from "framer-motion";
import { ArrowLeft, Users, Rocket, BookOpen, Award, Target, Zap, TrendingUp, ExternalLink, CheckCircle, GraduationCap, Briefcase, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import skoolBadge from "@/assets/skool-badge.png";
import skoolBanner from "@/assets/skool-banner.jpeg";
import skoolLogo from "@/assets/skool-logo.jpeg";

const SKOOL_LINK = "https://www.skool.com/sales-ai-business-marketing-7663/about?ref=002573a2eb4443249a5fce3b6607713d";

const Community = () => {
  const navigate = useNavigate();

  const handleJoinCommunity = () => {
    window.open(SKOOL_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Join Our Community</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6"
          >
            <Rocket className="w-4 h-4" />
            FREE to Join
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Become an AI Solutions Expert
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Join Business Bots UK's exclusive learning community. Develop cutting-edge AI skills for business development, sales automation, and marketing.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoinCommunity}
            className="px-8 py-4 bg-white text-amber-600 font-bold rounded-full flex items-center gap-2 mx-auto hover:bg-gray-50 transition-all"
          >
            Join Free Community
            <ExternalLink className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: "FREE", label: "To Join" },
              { stat: "50+", label: "Years Experience" },
              { stat: "24/7", label: "Community Access" },
              { stat: "100%", label: "Career Focused" }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-amber-500 mb-2">
                  {item.stat}
                </p>
                <p className="text-gray-600 text-sm">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Image Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden shadow-xl"
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
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the skills that businesses are desperately seeking. Our curriculum is designed by experts with 50+ years building high-growth, high-ticket businesses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "AI-Powered Sales",
                description: "Learn how to leverage AI to automate prospecting, lead nurturing, and close more deals with intelligent automation.",
                color: "bg-emerald-500"
              },
              {
                icon: Target,
                title: "Digital Marketing Mastery",
                description: "Master AI-driven marketing strategies including content creation, SEO optimization, and campaign automation.",
                color: "bg-blue-500"
              },
              {
                icon: Zap,
                title: "Business Automation",
                description: "Discover how to streamline operations with AI employees, reducing costs and scaling without hiring additional staff.",
                color: "bg-purple-500"
              },
              {
                icon: BookOpen,
                title: "App Design & No-Code",
                description: "Build professional applications without coding using the latest AI tools and no-code platforms.",
                color: "bg-amber-500"
              },
              {
                icon: Users,
                title: "Client Acquisition",
                description: "Learn proven strategies to attract and retain high-value clients using AI-enhanced outreach and engagement.",
                color: "bg-rose-500"
              },
              {
                icon: Award,
                title: "AI Certification Path",
                description: "Work towards becoming a certified AI Solutions Expert with our structured learning pathway and mentorship.",
                color: "bg-cyan-500"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-5`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Opportunity Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <img src={skoolLogo} alt="Sales & AI Business Marketing" className="w-full h-auto" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                Career Opportunity
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Join Our Team & Build Your AI Career
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Business Bots UK is actively recruiting passionate individuals who want to develop their AI expertise. Whether you're looking to start a new career or enhance your existing skills, our community provides the foundation for success.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Access to exclusive AI training resources and workshops",
                  "Direct mentorship from industry experts",
                  "Networking opportunities with like-minded professionals",
                  "Pathway to join Business Bots UK as a team member",
                  "Real-world project experience and portfolio building"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinCommunity}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full flex items-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Start Your Journey Today
                <ExternalLink className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Who Is This For?
            </h2>
            <p className="text-xl text-gray-600">
              Our community welcomes anyone with a passion for AI and business growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "Students & Career Changers",
                description: "Looking to break into the AI industry with practical, job-ready skills that employers are actively seeking."
              },
              {
                icon: Briefcase,
                title: "Business Owners",
                description: "Want to understand how AI can transform your operations and give you a competitive edge in the market."
              },
              {
                icon: TrendingUp,
                title: "Sales & Marketing Professionals",
                description: "Ready to 10x your results by mastering AI-powered sales and marketing automation strategies."
              },
              {
                icon: Rocket,
                title: "Aspiring Entrepreneurs",
                description: "Planning to start an AI-focused business or add AI services to your existing offerings."
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Badge Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-32 h-32 flex-shrink-0"
          >
            <img src={skoolBadge} alt="Skool Badge" className="w-full h-full object-contain" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Join Our Skool Community</h3>
            <p className="text-gray-600 mb-4">
              Get instant access to our learning platform with lessons, resources, and a supportive community of AI enthusiasts and professionals.
            </p>
            <button
              onClick={handleJoinCommunity}
              className="flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors"
            >
              Access the community <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our free community today and take the first step towards becoming an AI Solutions Expert. Connect with industry experts, access exclusive resources, and build your career in AI.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinCommunity}
              className="px-10 py-5 bg-white text-amber-600 font-bold text-lg rounded-full flex items-center gap-3 mx-auto hover:bg-gray-50 transition-all"
            >
              Join Business Bots UK Community
              <ExternalLink className="w-6 h-6" />
            </motion.button>
            <p className="text-white/80 mt-6 text-sm">
              100% Free • No Credit Card Required • Instant Access
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-gray-100">
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