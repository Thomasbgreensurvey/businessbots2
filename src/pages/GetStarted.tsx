import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
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
      // Save to database
      const { error } = await supabase.from("contacts").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: `Plan Interest: ${formData.plan_interest}\nCompany: ${formData.company}\n\nAdditional Message: ${formData.message || "N/A"}`,
      });

      if (error) throw error;

      // Send confirmation emails
      try {
        await supabase.functions.invoke("send-getstarted-confirmation", {
          body: {
            customerName: formData.name,
            customerEmail: formData.email,
            phone: formData.phone || undefined,
            company: formData.company || undefined,
            planInterest: formData.plan_interest,
            message: formData.message || undefined,
          },
        });
      } catch (emailError) {
        console.error("Email error (non-blocking):", emailError);
      }

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
          <h1 className="text-3xl font-bold text-foreground mb-4">You're All Set!</h1>
          <p className="text-muted-foreground mb-8">
            Thanks for reaching out. Our team will contact you within 24 hours to get you started with Business Bots UK.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-full font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity"
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
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/pricing")}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <img src={logo} alt="Business Bots UK" className="h-8 w-auto" />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Get Started</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Let's Get You Set Up
            </h1>
            <p className="text-muted-foreground">
              Fill in your details and our team will reach out within 24 hours.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Name */}
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="John Smith"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="john@company.com"
              />
            </div>

            {/* Phone & Company row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="07123 456789"
                />
              </div>
              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Your Company Ltd"
                />
              </div>
            </div>

            {/* Plan Interest */}
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Plan Interest <span className="text-destructive">*</span>
              </label>
              <select
                required
                value={formData.plan_interest}
                onChange={(e) => setFormData({ ...formData, plan_interest: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="">Select a plan...</option>
                <option value="Starter - £49/month">Starter - £49/month</option>
                <option value="Business - £149/month">Business - £149/month</option>
                <option value="Business Plus - £249/month">Business Plus - £249/month</option>
                <option value="Pro - £499/month">Pro - £499/month</option>
                <option value="Custom Premium - From £999/month">Custom Premium - From £999/month</option>
                <option value="Not sure yet">Not sure yet - Need advice</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Additional Information
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                placeholder="Tell us about your business needs..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>

            <p className="text-center text-muted-foreground text-xs">
              By submitting, you agree to be contacted about Business Bots UK services.
            </p>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default GetStarted;