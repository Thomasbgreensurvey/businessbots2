import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Activity, FileText, LogIn, Loader2 } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const actionColors: Record<string, string> = {
  create: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  update: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  delete: "bg-red-500/20 text-red-400 border-red-500/30",
  login_success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  login_fail: "bg-red-500/20 text-red-400 border-red-500/30",
  search_ping: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  seo_scan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  sitemap_rebuild: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  content_optimise: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const AdminAuditTab = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tab, setTab] = useState<"actions" | "forms" | "logins">("actions");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [logsRes, contactsRes, bookingsRes] = await Promise.all([
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("contacts").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("demo_bookings").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    if (logsRes.data) setLogs(logsRes.data as AuditLog[]);
    if (contactsRes.data) setContacts(contactsRes.data);
    if (bookingsRes.data) setBookings(bookingsRes.data);
    setLoading(false);
  };

  const actionLogs = logs.filter((l) => !["login_success", "login_fail"].includes(l.action));
  const loginLogs = logs.filter((l) => ["login_success", "login_fail"].includes(l.action));
  const formatDate = (d: string) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {[
          { key: "actions" as const, label: "Admin Actions", icon: Activity },
          { key: "forms" as const, label: "Form Submissions", icon: FileText },
          { key: "logins" as const, label: "Login Attempts", icon: LogIn },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${tab === key ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
      ) : tab === "actions" ? (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Time</th>
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Action</th>
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Entity</th>
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              {actionLogs.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-white/30 text-xs">No actions logged yet.</td></tr>
              ) : (
                actionLogs.slice(0, 50).map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/40 font-mono text-xs">{formatDate(log.created_at)}</td>
                    <td className="px-4 py-3"><Badge className={`text-[10px] ${actionColors[log.action] || "bg-white/10 text-white/60"}`}>{log.action}</Badge></td>
                    <td className="px-4 py-3 text-white/60 text-xs">{log.entity_type || "—"}</td>
                    <td className="px-4 py-3 text-white/40 text-xs max-w-[200px] truncate">
                      {log.details && typeof log.details === "object" && "title" in log.details ? String(log.details.title) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : tab === "forms" ? (
        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-3">Contact Submissions ({contacts.length})</h4>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-4 py-2 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-2 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-2 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Message</th>
                  <th className="text-left px-4 py-2 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Date</th>
                </tr></thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-6 text-center text-white/30 text-xs">No submissions.</td></tr>
                  ) : contacts.map((c: any) => (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-2 text-white text-xs">{c.name}</td>
                      <td className="px-4 py-2 text-white/50 text-xs">{c.email}</td>
                      <td className="px-4 py-2 text-white/40 text-xs max-w-[200px] truncate">{c.message}</td>
                      <td className="px-4 py-2 text-white/30 text-xs font-mono">{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-3">Demo Bookings ({bookings.length})</h4>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-4 py-2 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-2 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-2 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-2 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Status</th>
                </tr></thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-6 text-center text-white/30 text-xs">No bookings.</td></tr>
                  ) : bookings.map((b: any) => (
                    <tr key={b.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-2 text-white text-xs">{b.name}</td>
                      <td className="px-4 py-2 text-white/50 text-xs">{b.email}</td>
                      <td className="px-4 py-2 text-white/40 text-xs font-mono">{b.preferred_date} {b.preferred_time}</td>
                      <td className="px-4 py-2"><Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{b.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-white/5 border-b border-white/10">
              <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Time</th>
              <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Result</th>
            </tr></thead>
            <tbody>
              {loginLogs.length === 0 ? (
                <tr><td colSpan={2} className="px-4 py-8 text-center text-white/30 text-xs">No login attempts.</td></tr>
              ) : loginLogs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/40 font-mono text-xs">{formatDate(log.created_at)}</td>
                  <td className="px-4 py-3"><Badge className={`text-[10px] ${actionColors[log.action]}`}>{log.action === "login_success" ? "✓ Success" : "✗ Failed"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAuditTab;
