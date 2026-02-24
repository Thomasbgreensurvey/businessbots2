import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, Loader2, Sparkles, User, Mail, Phone, Building } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ReCaptcha, { ReCaptchaRef } from "@/components/ReCaptcha";

const GetStarted = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCaptchaRef>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    plan_interest: "",
    message: "",
  });

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
  };

  useEffect(() => {
    document.title = "Get Started | Business Bots UK";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }
    
    setIsSubmitting(true);
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
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1
            className="text-3xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            You're All Set!
          </h1>
          <p className="text-gray-600 mb-6">
            Thanks for reaching out, <strong>{formData.name}</strong>! Our team will contact you within 24 hours.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            A confirmation has been sent to <strong>{formData.email}</strong>
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-full font-semibold text-white bg-[#4B5FD1] hover:bg-[#3a4db8] transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Get Started</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4B5FD1] mb-4"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Let's Get You Set Up
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Share your details and our team will reach out within 24 hours.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#4B5FD1]" />
            <h3 className="text-lg font-semibold text-gray-900">Your Details</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-gray-700 flex items-center gap-2 mb-2 text-sm font-medium">
                <User className="w-4 h-4" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4B5FD1] focus:ring-2 focus:ring-[#4B5FD1]/20 transition-all"
                placeholder="John Smith"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 flex items-center gap-2 mb-2 text-sm font-medium">
                <Mail className="w-4 h-4" />
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4B5FD1] focus:ring-2 focus:ring-[#4B5FD1]/20 transition-all"
                placeholder="john@company.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-700 flex items-center gap-2 mb-2 text-sm font-medium">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4B5FD1] focus:ring-2 focus:ring-[#4B5FD1]/20 transition-all"
                placeholder="+44 800 654 6949"
              />
            </div>

            {/* Company */}
            <div>
              <label className="text-gray-700 flex items-center gap-2 mb-2 text-sm font-medium">
                <Building className="w-4 h-4" />
                Company Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4B5FD1] focus:ring-2 focus:ring-[#4B5FD1]/20 transition-all"
                placeholder="Acme Inc."
              />
            </div>

            {/* Plan Interest */}
            <div>
              <label className="text-gray-700 flex items-center gap-2 mb-2 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Plan Interest <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.plan_interest}
                onChange={(e) => setFormData({ ...formData, plan_interest: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#4B5FD1] focus:ring-2 focus:ring-[#4B5FD1]/20 transition-all"
              >
                <option value="">Select a plan...</option>
                <option value="Starter - £49/month">Starter — £49/month</option>
                <option value="Business - £149/month">Business — £149/month</option>
                <option value="Business Plus - £249/month">Business Plus — £249/month</option>
                <option value="Pro - £499/month">Pro — £499/month</option>
                <option value="Custom Premium - From £999/month">Custom Premium — From £999/month</option>
                <option value="Not sure yet">Not sure yet — Need advice</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Additional Information
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4B5FD1] focus:ring-2 focus:ring-[#4B5FD1]/20 transition-all resize-none"
                placeholder="Tell us about your business needs..."
              />
            </div>

            {/* reCAPTCHA */}
            <ReCaptcha
              ref={recaptchaRef}
              onChange={handleRecaptchaChange}
              onExpired={handleRecaptchaExpired}
              className="flex flex-col items-center"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !recaptchaToken}
              className="w-full py-4 rounded-lg font-semibold text-white bg-[#4B5FD1] hover:bg-[#3a4db8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-2"
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

            <p className="text-xs text-gray-500 text-center mt-4">
              By submitting, you agree to our{" "}
              <Link to="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>
              {" "}and{" "}
              <Link to="/terms" className="underline hover:text-gray-700">Terms & Conditions</Link>.
            </p>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            We'll get back to you within 24 hours
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default GetStarted;
