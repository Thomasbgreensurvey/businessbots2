import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const GetStarted = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    plan_interest: "",
    message: "",
  });

  useEffect(() => {
    document.title = "Get Started | Business Bots UK";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contacts").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: `Plan Interest: ${formData.plan_interest}\nCompany: ${formData.company}\n\nAdditional Message: ${formData.message || "N/A"}`,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Request submitted successfully!", {
        description: "We'll be in touch within 24 hours.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong", {
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">You're All Set!</h1>
          <p className="text-white/60 mb-8">
            Thanks for reaching out. Our team will contact you within 24 hours to get you started with Business Bots UK.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn-primary px-8 py-3"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 bg-background/80 backdrop-blur-md border-b border-white/5"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/pricing")}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <img src={logo} alt="Business Bots UK" className="h-10 w-auto" />
          </div>
          <span className="font-robotic text-white font-bold text-sm md:text-base tracking-wide">
            Business Bots UK
          </span>
        </div>
      </motion.header>

      {/* Main Content */}
      <section className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Let's Get You Set Up
            </h1>
            <p className="text-white/60 text-lg">
              Fill in your details below and our team will reach out to help you get started with the perfect plan for your business.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-8"
          >
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="John Smith"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="john@company.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="07123 456789"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="Your Company Ltd"
                />
              </div>

              {/* Plan Interest */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Plan Interest *
                </label>
                <select
                  required
                  value={formData.plan_interest}
                  onChange={(e) => setFormData({ ...formData, plan_interest: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                >
                  <option value="" className="bg-zinc-900">Select a plan...</option>
                  <option value="Starter - £49/month" className="bg-zinc-900">Starter - £49/month</option>
                  <option value="Business - £149/month" className="bg-zinc-900">Business - £149/month</option>
                  <option value="Business Plus - £249/month" className="bg-zinc-900">Business Plus - £249/month</option>
                  <option value="Pro - £499/month" className="bg-zinc-900">Pro - £499/month</option>
                  <option value="Custom Premium - From £999/month" className="bg-zinc-900">Custom Premium - From £999/month</option>
                  <option value="Not sure yet" className="bg-zinc-900">Not sure yet - Need advice</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Additional Information
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                  placeholder="Tell us about your business needs..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Get Started"
                )}
              </button>
            </div>
          </motion.form>

          <p className="text-center text-white/40 text-sm mt-6">
            By submitting, you agree to be contacted about Business Bots UK services.
          </p>
        </div>
      </section>
    </div>
  );
};

export default GetStarted;
