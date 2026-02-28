import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, Radar, Shield, Eye, FileText, TrendingUp, Activity, ListTodo } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminSearchForceTab from "@/components/admin/AdminSearchForceTab";
import AdminContentHealthTab from "@/components/admin/AdminContentHealthTab";
import AdminIntelligenceTab from "@/components/admin/AdminIntelligenceTab";
import AdminBlogTab from "@/components/admin/AdminBlogTab";
import AdminPerformanceTab from "@/components/admin/AdminPerformanceTab";
import AdminAuditTab from "@/components/admin/AdminAuditTab";
import AdminQueueTab from "@/components/admin/AdminQueueTab";

const TABS = [
  { key: "queue", label: "Queue", icon: ListTodo },
  { key: "search", label: "Search Force", icon: Radar },
  { key: "health", label: "Content Health", icon: Shield },
  { key: "intel", label: "Intelligence", icon: Eye },
  { key: "blog", label: "Blog CMS", icon: FileText },
  { key: "performance", label: "Performance", icon: TrendingUp },
  { key: "audit", label: "Audit Log", icon: Activity },
] as const;

type TabKey = typeof TABS[number]["key"];

const Admin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("queue");
  const inputRef = useRef<HTMLInputElement>(null);

  const logAudit = async (action: string, entityType: string, entityId: string, details?: object) => {
    await supabase.from("audit_logs").insert([{
      action, entity_type: entityType, entity_id: entityId,
      details: details ? JSON.parse(JSON.stringify(details)) : null,
    }]);
  };

  const handleSubmit = async () => {
    if (!pin || checking) return;
    setChecking(true);
    setError(false);
    try {
      const res = await supabase.functions.invoke("verify-admin-pin", {
        body: { pin },
      });
      if (res.data?.success) {
        setAuthenticated(true);
        logAudit("login_success", "admin", "pin");
      } else {
        setError(true);
        logAudit("login_fail", "admin", "pin");
        setTimeout(() => { setPin(""); setError(false); }, 1200);
      }
    } catch {
      setError(true);
      setTimeout(() => { setPin(""); setError(false); }, 1200);
    }
    setChecking(false);
  };

  if (authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white max-w-[100vw] overflow-x-hidden">
        {/* Header */}
        <div className="border-b border-emerald-500/10 px-4 sm:px-6 py-3">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <ArrowLeft className="w-4 h-4 text-white/40" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h1 className="text-sm font-bold tracking-tight uppercase">Business Bots Intelligence</h1>
                  <p className="text-emerald-400/40 text-[10px] uppercase tracking-[0.2em]">Mainframe • Active</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setAuthenticated(false); setPin(""); }}
              className="text-[10px] text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 uppercase tracking-wider"
            >
              Lock
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/5 px-4 sm:px-6 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-30">
          <div className="max-w-[1600px] mx-auto flex gap-0.5 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === key
                    ? "border-emerald-400 text-emerald-400"
                    : "border-transparent text-white/30 hover:text-white/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 max-w-[100vw] overflow-x-hidden">
          {activeTab === "queue" && <AdminQueueTab onAuditLog={logAudit} />}
          {activeTab === "search" && <AdminSearchForceTab onAuditLog={logAudit} />}
          {activeTab === "health" && <AdminContentHealthTab onAuditLog={logAudit} />}
          {activeTab === "intel" && <AdminIntelligenceTab />}
          {activeTab === "blog" && <AdminBlogTab onAuditLog={logAudit} />}
          {activeTab === "performance" && <AdminPerformanceTab />}
          {activeTab === "audit" && <AdminAuditTab />}
        </div>
      </div>
    );
  }

  // PIN Screen — secure text input, no digit hints
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Lock className="w-7 h-7 text-emerald-400/60" />
        </div>
        <div className="text-center">
          <h1 className="text-white/60 text-xs font-bold tracking-[0.3em] uppercase">Intelligence Access</h1>
          <p className="text-white/20 text-[10px] mt-1 uppercase tracking-wider">Enter Access Code</p>
        </div>

        <motion.div
          animate={error ? { x: [0, -6, 6, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-64"
        >
          <input
            ref={inputRef}
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="••••••••"
            autoFocus
            className={`w-full text-center text-lg tracking-[0.3em] bg-white/[0.03] border ${
              error ? "border-red-500" : "border-white/10 focus:border-emerald-400/50"
            } rounded-xl px-4 py-3 text-white placeholder-white/15 outline-none transition-colors`}
          />
        </motion.div>

        {error && (
          <p className="text-red-400/60 text-[10px] uppercase tracking-wider">Access denied</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!pin || checking}
          className="px-8 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400/60 text-xs uppercase tracking-wider hover:bg-emerald-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {checking ? "Verifying..." : "Authenticate"}
        </button>

        <button onClick={() => navigate("/")} className="text-white/15 text-[10px] hover:text-white/30 transition-colors mt-4 uppercase tracking-wider">
          Back to site
        </button>
      </motion.div>
    </div>
  );
};

export default Admin;
