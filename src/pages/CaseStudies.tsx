import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Users, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CaseStudies = () => {
  const navigate = useNavigate();

  const caseStudies = [
    {
      company: "TechFlow Solutions",
      industry: "SaaS",
      result: "340% increase in qualified leads",
      description: "How TechFlow used Like and Tobby to transform their outbound sales process.",
      metrics: [
        { icon: TrendingUp, label: "Lead increase", value: "340%" },
        { icon: Clock, label: "Time saved", value: "25hrs/week" },
      ]
    },
    {
      company: "GreenLeaf Retail",
      industry: "E-commerce",
      result: "92% customer satisfaction score",
      description: "Timi helped GreenLeaf handle 10x support volume during peak seasons.",
      metrics: [
        { icon: Users, label: "CSAT Score", value: "92%" },
        { icon: Zap, label: "Response time", value: "<30 sec" },
      ]
    },
    {
      company: "Innovate HR",
      industry: "Human Resources",
      result: "50% faster onboarding",
      description: "Lilly streamlined employee onboarding for a 500+ person organization.",
      metrics: [
        { icon: Clock, label: "Onboarding time", value: "-50%" },
        { icon: Users, label: "Employees served", value: "500+" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Case Studies
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Real results from real businesses using Business Bots UK.
            </p>

            {/* Case Studies */}
            <div className="space-y-8">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.company}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-primary">{study.industry}</span>
                      <h2 className="text-2xl font-bold text-foreground mt-2 mb-3">{study.company}</h2>
                      <p className="text-muted-foreground mb-4">{study.description}</p>
                      <p className="text-lg font-semibold text-accent">{study.result}</p>
                    </div>
                    <div className="flex gap-6">
                      {study.metrics.map((metric) => (
                        <div key={metric.label} className="text-center">
                          <metric.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                          <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CaseStudies;