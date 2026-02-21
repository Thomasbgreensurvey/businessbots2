import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import caseStudiesBot from "@/assets/case-studies-bot.png";
import OptimizedImage from "@/components/OptimizedImage";

const SKOOL_BLUE = "#4B5FD1";

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const caseStudies = [
  {
    id: 1,
    company: "TechStart Solutions",
    industry: "SaaS",
    title: "How TechStart Increased Leads by 340% with AI",
    description: "A small SaaS company transformed their lead generation using Like, our AI lead generation specialist. Within 3 months, they saw a dramatic increase in qualified leads while reducing manual prospecting time.",
    stats: [
      { label: "More Leads", value: "+340%" },
      { label: "Time Saved", value: "60%" },
      { label: "Revenue Growth", value: "+180%" }
    ]
  },
  {
    id: 2,
    company: "Fresh Foods Co.",
    industry: "E-commerce",
    title: "Reducing Customer Support Tickets by 75%",
    description: "Fresh Foods deployed Timi to handle customer inquiries, dramatically reducing response times and improving customer satisfaction while freeing up their human team for complex issues.",
    stats: [
      { label: "Fewer Tickets", value: "-75%" },
      { label: "Satisfaction", value: "+45%" },
      { label: "Monthly Savings", value: "£8k" }
    ]
  },
  {
    id: 3,
    company: "HR Dynamics",
    industry: "Recruitment",
    title: "Filling 3x More Positions with Skoot",
    description: "A recruitment agency scaled their operations using our AI recruiter to screen candidates, schedule interviews, and manage the hiring pipeline efficiently.",
    stats: [
      { label: "Placements", value: "3x" },
      { label: "Screening Time", value: "-80%" },
      { label: "Quality Score", value: "+60%" }
    ]
  },
  {
    id: 4,
    company: "Growth Marketing Ltd",
    industry: "Marketing Agency",
    title: "Automating Social Media for 50+ Clients",
    description: "Banjo now manages social media content creation and scheduling for their entire client base, enabling the agency to scale without proportionally increasing headcount.",
    stats: [
      { label: "Clients Managed", value: "50+" },
      { label: "Content Output", value: "10x" },
      { label: "Engagement", value: "+120%" }
    ]
  }
];

const CaseStudies = () => {
  const navigate = useNavigate();

  const handleReadMore = (company: string) => {
    toast.info(`Full case study for ${company} coming soon!`);
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
          <h1 className="text-xl font-bold text-gray-900">Case Studies</h1>
          <div className="w-16" />
        </div>
      </motion.header>

      {/* Hero */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 bg-gray-100 text-gray-700"
          >
            Real Results
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Customer{" "}
            <span className="font-dancing-script italic" style={{ color: SKOOL_BLUE }}>
              Success
            </span>{" "}
            Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Real results from businesses using our AI employees
          </motion.p>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-16 px-4 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto"
        >
          <OptimizedImage 
            src={caseStudiesBot}
            alt="Business Bots UK AI assistant"
            className="w-full h-auto object-contain"
            width={448}
            height={448}
          />
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Case Studies */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            {caseStudies.map((study) => (
              <motion.div
                key={study.id}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleReadMore(study.company)}
                className="group p-6 md:p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span 
                    className="px-3 py-1 text-sm font-medium rounded-full"
                    style={{ backgroundColor: `${SKOOL_BLUE}10`, color: SKOOL_BLUE }}
                  >
                    {study.industry}
                  </span>
                  <span className="text-gray-500 text-sm">{study.company}</span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#4B5FD1] transition-colors">
                  {study.title}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">{study.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {study.stats.map((stat) => (
                    <div 
                      key={stat.label}
                      className="text-center p-4 rounded-xl bg-gray-50"
                    >
                      <div 
                        className="text-xl md:text-2xl font-bold mb-1"
                        style={{ color: SKOOL_BLUE }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                <span className="font-medium transition-colors" style={{ color: SKOOL_BLUE }}>
                  Read full story →
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Write Your{" "}
              <span className="font-dancing-script italic" style={{ color: SKOOL_BLUE }}>
                Success
              </span>{" "}
              Story?
            </h2>
            <p className="text-gray-600 mb-8">
              Join hundreds of businesses transforming their operations with AI employees
            </p>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/pricing")}
              className="px-8 py-4 rounded-full text-white font-bold"
              style={{ backgroundColor: SKOOL_BLUE }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Business Bots UK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CaseStudies;
