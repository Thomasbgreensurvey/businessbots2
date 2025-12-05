import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Users, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

const caseStudies = [
  {
    id: 1,
    company: "TechStart Solutions",
    industry: "SaaS",
    title: "How TechStart Increased Leads by 340% with AI",
    result: "340% more leads",
    description: "A small SaaS company transformed their lead generation using Like, our AI lead generation specialist.",
    stats: { leads: "+340%", time: "-60%", revenue: "+180%" }
  },
  {
    id: 2,
    company: "Fresh Foods Co.",
    industry: "E-commerce",
    title: "Reducing Customer Support Tickets by 75%",
    result: "75% fewer tickets",
    description: "Fresh Foods deployed Timi to handle customer inquiries, dramatically reducing response times.",
    stats: { tickets: "-75%", satisfaction: "+45%", savings: "£8k/mo" }
  },
  {
    id: 3,
    company: "HR Dynamics",
    industry: "Recruitment",
    title: "Filling 3x More Positions with Skoot",
    result: "3x placements",
    description: "A recruitment agency scaled their operations using our AI recruiter to screen candidates.",
    stats: { placements: "3x", screening: "-80%", quality: "+60%" }
  },
  {
    id: 4,
    company: "Growth Marketing Ltd",
    industry: "Marketing Agency",
    title: "Automating Social Media for 50+ Clients",
    result: "50+ clients managed",
    description: "Banjo now manages social media content creation and scheduling for their entire client base.",
    stats: { clients: "50+", content: "10x", engagement: "+120%" }
  }
];

const CaseStudies = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Case Studies - AI Automation Success Stories UK"
        description="Real results from UK businesses using AI employees. See how companies increased leads, reduced costs, and scaled operations with Business Bots UK."
        keywords="AI case studies, business automation results, AI success stories UK, chatbot ROI"
        canonicalUrl="https://businessbotsuk.com/case-studies"
      />
      <div className="min-h-screen bg-white">
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
          <h1 className="text-xl font-bold text-gray-900">Case Studies</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Customer Success Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80"
          >
            Real results from businesses using our AI employees
          </motion.p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                        {study.industry}
                      </span>
                      <span className="text-gray-500 text-sm">{study.company}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {study.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{study.description}</p>
                    <div className="flex items-center gap-2 text-emerald-600 font-medium">
                      Read full story <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-4 md:gap-3 md:text-right">
                    {Object.entries(study.stats).map(([key, value]) => (
                      <div key={key} className="bg-white rounded-xl px-4 py-3 shadow-sm">
                        <div className="text-2xl font-bold text-emerald-600">{value}</div>
                        <div className="text-xs text-gray-500 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default CaseStudies;
