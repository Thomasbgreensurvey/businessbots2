import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Copy, Mail, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const PHONE_NUMBER = "08006546949";
const PHONE_DISPLAY = "0800 654 6949";

const Call = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if likely mobile device
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setIsMobile(checkMobile);

    // Auto-trigger call on mobile
    if (checkMobile) {
      window.location.href = `tel:${PHONE_NUMBER}`;
    }
  }, []);

  const copyNumber = async () => {
    await navigator.clipboard.writeText(PHONE_DISPLAY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        {/* Logo */}
        <motion.img
          src={logo}
          alt="Business Bots UK"
          className="w-20 h-20 mx-auto mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {isMobile ? (
          <>
            {/* Mobile: Calling indicator */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#4B5FD1] flex items-center justify-center"
            >
              <Phone className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Connecting you now...
            </h1>
            <p className="text-gray-600 mb-8">
              Your phone app should open automatically
            </p>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="inline-flex items-center gap-2 bg-[#4B5FD1] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#3a4bc0] transition-colors"
            >
              <Phone className="w-5 h-5" />
              Tap to Call
            </a>
          </>
        ) : (
          <>
            {/* Desktop: Show number with copy */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Call Business Bots UK
            </h1>
            <p className="text-gray-600 mb-8">
              Give us a call to discuss your AI employee needs
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <p className="text-4xl font-bold text-[#4B5FD1] mb-4 font-['Orbitron']">
                {PHONE_DISPLAY}
              </p>
              <Button
                onClick={copyNumber}
                variant="outline"
                className="gap-2 border-[#4B5FD1] text-[#4B5FD1] hover:bg-[#4B5FD1] hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Number
                  </>
                )}
              </Button>
            </div>

            <p className="text-gray-500 text-sm mb-6">Or reach us another way:</p>

            <div className="flex flex-col gap-3">
              <a
                href="mailto:ai@businessbotsuk.com"
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
              <Link
                to="/book-demo"
                className="flex items-center justify-center gap-2 bg-[#4B5FD1] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3a4bc0] transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Book a Demo
              </Link>
            </div>
          </>
        )}

        <Link
          to="/"
          className="inline-block mt-8 text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          ← Back to website
        </Link>
      </motion.div>
    </div>
  );
};

export default Call;
