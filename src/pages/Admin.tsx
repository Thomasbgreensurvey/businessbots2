import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);

    if (newPin.length === 4) {
      if (newPin === "1234") {
        setAuthenticated(true);
      } else {
        setError(true);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 800);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  if (authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="border-b border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Business Bots Intelligence</h1>
                <p className="text-white/40 text-xs">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => { setAuthenticated(false); setPin(""); }}
              className="text-xs text-white/40 hover:text-white transition-colors px-3 py-1 rounded border border-white/10 hover:border-white/20"
            >
              Lock
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="text-white/50 text-lg">Admin panel coming soon.</p>
          <p className="text-white/30 text-sm mt-2">Blog CMS, SEO tools, and audit logging will be built here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8"
      >
        <Lock className="w-10 h-10 text-white/20" />
        <h1 className="text-white/60 text-sm font-medium tracking-widest uppercase">Enter PIN</h1>

        {/* PIN dots */}
        <div className="flex gap-3">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={error ? { x: [0, -6, 6, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-4 h-4 rounded-full border-2 transition-colors ${
                error
                  ? "border-red-500 bg-red-500"
                  : i < pin.length
                  ? "border-white bg-white"
                  : "border-white/20 bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "←"].map((key) =>
            key === "" ? (
              <div key="empty" />
            ) : (
              <button
                key={key}
                onClick={() => (key === "←" ? handleDelete() : handleDigit(key))}
                className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 text-white text-xl font-medium transition-colors flex items-center justify-center active:scale-95"
              >
                {key}
              </button>
            )
          )}
        </div>

        <button onClick={() => navigate("/")} className="text-white/20 text-xs hover:text-white/40 transition-colors mt-4">
          Back to site
        </button>
      </motion.div>
    </div>
  );
};

export default Admin;
