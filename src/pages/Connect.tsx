import { motion } from "framer-motion";
import { Phone, Mail, Calendar, GraduationCap, Globe, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const PHONE_NUMBER = "08006546949";

const links = [
  {
    icon: Phone,
    label: "Call Us Now",
    href: `tel:${PHONE_NUMBER}`,
    external: true,
    primary: true,
  },
  {
    icon: Mail,
    label: "Email Us",
    href: "mailto:ai@businessbotsuk.com",
    external: true,
  },
  {
    icon: Calendar,
    label: "Book a Demo",
    href: "/book-demo",
    external: false,
  },
  {
    icon: GraduationCap,
    label: "Free AI Training",
    href: "/community",
    external: false,
  },
  {
    icon: Globe,
    label: "Visit Website",
    href: "/",
    external: false,
  },
];

const Connect = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        {/* Logo & Branding */}
        <motion.img
          src={logo}
          alt="Business Bots UK"
          className="w-24 h-24 mx-auto mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Business Bots UK
        </h1>
        <p className="text-[#4B5FD1] font-medium mb-8">
          AI Employees for Your Business
        </p>

        {/* Links */}
        <div className="flex flex-col gap-3 mb-8">
          {links.map((link, index) => {
            const Icon = link.icon;
            const className = link.primary
              ? "flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full font-semibold text-lg transition-all bg-[#4B5FD1] text-white hover:bg-[#3a4bc0] hover:scale-[1.02]"
              : "flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full font-medium transition-all bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-[1.02]";

            const content = (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-full"
              >
                {link.external ? (
                  <a href={link.href} className={className}>
                    <Icon className="w-5 h-5" />
                    {link.label}
                    {!link.primary && <ExternalLink className="w-4 h-4 ml-auto opacity-50" />}
                  </a>
                ) : (
                  <Link to={link.href} className={className}>
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                )}
              </motion.div>
            );

            return <div key={link.label}>{content}</div>;
          })}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 text-sm"
        >
          © {new Date().getFullYear()} Business Bots UK
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Connect;
