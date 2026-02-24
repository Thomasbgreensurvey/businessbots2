import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, Send, CheckCircle, Clock, MapPin } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import ReCaptcha, { ReCaptchaRef } from "@/components/ReCaptcha";

const SKOOL_BLUE = "#4B5FD1";

const contactTimeOptions = [
  "Morning (9am - 12pm)",
  "Afternoon (12pm - 5pm)",
  "Evening (5pm - 8pm)",
  "Anytime",
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(30, "Phone number is too long").optional().or(z.literal("")),
  bestTimeToContact: z.string().min(1, "Please select a preferred contact time"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

const Contact = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bestTimeToContact: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCaptchaRef>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contacts").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        message: formData.message.trim(),
      });

      if (error) {
        throw error;
      }

      // Send confirmation email via edge function
      try {
        const { error: emailError } = await supabase.functions.invoke('send-contact-confirmation', {
          body: {
            customerName: formData.name.trim(),
            customerEmail: formData.email.trim(),
            phone: formData.phone.trim() || undefined,
            bestTimeToContact: formData.bestTimeToContact,
            message: formData.message.trim(),
          }
        });

        if (emailError) {
          console.error("Email sending failed:", emailError);
        }
      } catch (emailErr) {
        console.error("Error calling email function:", emailErr);
      }

      setIsSubmitted(true);
      toast.success("Message sent successfully!", { description: "We'll get back to you soon." });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send message", { description: "Please try again or email us directly." });
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Contact Us</h1>
          <div className="w-16" />
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 
            className="font-cursive text-5xl sm:text-6xl md:text-7xl mb-6"
            style={{ color: SKOOL_BLUE }}
          >
            Get in Touch
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Have questions about our AI employees? We'd love to hear from you. 
            Reach out and our team will get back to you as soon as possible.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-3xl mx-auto mb-8"
        >
          <a
            href="tel:08006546949"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors w-full sm:w-auto"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: SKOOL_BLUE }}
            >
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Call us</p>
              <p className="font-semibold text-gray-900">0800 654 6949</p>
            </div>
          </a>

          <a
            href="mailto:ai@businessbotsuk.com"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors w-full sm:w-auto"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: SKOOL_BLUE }}
            >
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Email us</p>
              <p className="font-semibold text-gray-900">ai@businessbotsuk.com</p>
            </div>
          </a>
        </motion.div>

        {/* Address Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mx-auto mb-12"
        >
          <a
            href="https://maps.google.com/?q=The+Beacon+Business+Centre+Westgate+Road+Newcastle+upon+Tyne+NE4+9PQ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors w-full"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: SKOOL_BLUE }}
            >
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Visit us</p>
              <p className="font-semibold text-gray-900">The Beacon Business Centre</p>
              <p className="text-gray-600 text-sm">Westgate Road, Newcastle upon Tyne, NE4 9PQ</p>
            </div>
          </a>
        </motion.div>
      </section>

      {/* Contact Form */}
      <section className="pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mx-auto"
        >
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-6 bg-gray-50 rounded-3xl"
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${SKOOL_BLUE}20` }}
              >
                <CheckCircle className="w-10 h-10" style={{ color: SKOOL_BLUE }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h3>
              <p className="text-gray-600 mb-8">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: SKOOL_BLUE }}
              >
                Back to Home
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-6 md:p-10 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-gray-900 transition-all`}
                  style={{ '--tw-ring-color': SKOOL_BLUE } as React.CSSProperties}
                  placeholder="Your name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-gray-900 transition-all`}
                  style={{ '--tw-ring-color': SKOOL_BLUE } as React.CSSProperties}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-gray-900 transition-all`}
                  style={{ '--tw-ring-color': SKOOL_BLUE } as React.CSSProperties}
                  placeholder="Your phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="bestTimeToContact" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: SKOOL_BLUE }} />
                    Best time to contact you *
                  </span>
                </label>
                <select
                  id="bestTimeToContact"
                  name="bestTimeToContact"
                  value={formData.bestTimeToContact}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.bestTimeToContact ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-gray-900 transition-all appearance-none cursor-pointer`}
                  style={{ '--tw-ring-color': SKOOL_BLUE } as React.CSSProperties}
                >
                  <option value="" className="text-gray-400">Select a time</option>
                  {contactTimeOptions.map((option) => (
                    <option key={option} value={option} className="text-gray-900">
                      {option}
                    </option>
                  ))}
                </select>
                {errors.bestTimeToContact && <p className="text-red-500 text-sm mt-1">{errors.bestTimeToContact}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-gray-900 transition-all resize-none`}
                  style={{ '--tw-ring-color': SKOOL_BLUE } as React.CSSProperties}
                  placeholder="How can we help you?"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <ReCaptcha
                ref={recaptchaRef}
                onChange={handleRecaptchaChange}
                onExpired={handleRecaptchaExpired}
                className="flex flex-col items-center"
              />

              <motion.button
                type="submit"
                disabled={isSubmitting || !recaptchaToken}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                style={{ backgroundColor: SKOOL_BLUE }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting, you agree to our{" "}
                <Link to="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>
                {" "}and{" "}
                <Link to="/terms" className="underline hover:text-gray-700">Terms & Conditions</Link>.
              </p>
            </form>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
              Terms & Conditions
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Business Bots UK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
