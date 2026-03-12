import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Zap } from "lucide-react";

const BRAND_BLUE = "#0066FF";
const BRAND_BLUE_DARK = "#0052CC";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setIsRecovery(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error("Error", { description: error.message });
    } else {
      toast.success("Password updated successfully!");
      navigate("/autopilot-seo");
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-[#64748B]">Invalid or expired reset link.</p>
          <button onClick={() => navigate("/auth")} className="mt-4 font-bold text-sm" style={{ color: BRAND_BLUE }}>Back to login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8" style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_BLUE_DARK})` }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-[#0F172A]">Set New Password</h1>
          </div>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required minLength={6}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#F8FAFC] border-2 border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all" />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-bold disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_BLUE_DARK})`, boxShadow: `0 8px 25px ${BRAND_BLUE}59` }}>
              {loading ? "Updating..." : "Update Password"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
