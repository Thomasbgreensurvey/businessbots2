import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, FileText, Search, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminBlogTab from "@/components/admin/AdminBlogTab";
import AdminSEOTab from "@/components/admin/AdminSEOTab";
import AdminAuditTab from "@/components/admin/AdminAuditTab";

const TABS = [
  { key: "blog", label: "Blog CMS", icon: FileText },
  { key: "seo", label: "SEO Tools", icon: Search },
  { key: "audit", label: "Audit Log", icon: Activity },
] as const;

type TabKey = typeof TABS[number]["key"];

const Admin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("blog");

  const logAudit = async (action: string, entityType: string, entityId: string, details?: object) => {
    await supabase.from("audit_logs").insert([{
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details ? JSON.parse(JSON.stringify(details)) : null,
    }]);
  };

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);

    if (newPin.length === 4) {
      if (newPin === "1234") {
        setAuthenticated(true);
        logAudit("login_success", "admin", "pin");
      } else {
        setError(true);
        logAudit("login_fail", "admin", "pin");
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
        {/* Header */}
        <div className="border-b border-white/10 px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/")} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">Business Bots Intelligence</h1>
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

        {/* Tabs */}
        <div className="border-b border-white/10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === key
                    ? "border-accent text-white"
                    : "border-transparent text-white/40 hover:text-white/60"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {activeTab === "blog" && <AdminBlogTab onAuditLog={logAudit} />}
          {activeTab === "seo" && <AdminSEOTab onAuditLog={logAudit} />}
          {activeTab === "audit" && <AdminAuditTab />}
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
