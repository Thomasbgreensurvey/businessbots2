import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Activity, FileText, LogIn, BarChart3 } from "lucide-react";

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
  login_attempt: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  login_success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  login_fail: "bg-red-500/20 text-red-400 border-red-500/30",
};

const AdminAuditTab = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [contacts, setContacts] = useState<{ id: string; name: string; email: string; message: string; created_at: string }[]>([]);
  const [bookings, setBookings] = useState<{ id: string; name: string; email: string; preferred_date: string; preferred_time: string; status: string; created_at: string }[]>([]);
  const [tab, setTab] = useState<"actions" | "forms" | "logins">("actions");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

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

  const actionLogs = logs.filter((l) => !["login_attempt", "login_success", "login_fail"].includes(l.action));
  const loginLogs = logs.filter((l) => ["login_attempt", "login_success", "login_fail"].includes(l.action));

  const formatDate = (d: string) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {[
          { key: "actions" as const, label: "Admin Actions", icon: Activity },
          { key: "forms" as const, label: "Form Submissions", icon: FileText },
          { key: "logins" as const, label: "Login Attempts", icon: LogIn },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              tab === key ? "bg-accent text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Loading...</p>
      ) : tab === "actions" ? (
        actionLogs.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-8">No admin actions logged yet.</p>
        ) : (
          <div className="space-y-2">
            {actionLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <Badge className={actionColors[log.action] || "bg-white/10 text-white/60"}>
                  {log.action}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm">
                    {log.entity_type && <span className="text-white/50">{log.entity_type}</span>}
                    {log.details && typeof log.details === "object" && "title" in log.details && (
                      <span className="ml-1">— {String(log.details.title)}</span>
                    )}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">{formatDate(log.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : tab === "forms" ? (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/70">Contact Submissions ({contacts.length})</h4>
          {contacts.length === 0 ? (
            <p className="text-white/40 text-xs">No submissions yet.</p>
          ) : (
            <div className="space-y-2">
              {contacts.map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{c.name}</span>
                    <span className="text-white/30 text-xs">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-white/50 text-xs">{c.email}</p>
                  <p className="text-white/40 text-xs mt-1 line-clamp-2">{c.message}</p>
                </div>
              ))}
            </div>
          )}

          <h4 className="text-sm font-medium text-white/70 pt-4">Demo Bookings ({bookings.length})</h4>
          {bookings.length === 0 ? (
            <p className="text-white/40 text-xs">No bookings yet.</p>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div key={b.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{b.name}</span>
                    <Badge variant="outline" className="text-white/50 border-white/20 text-[10px]">{b.status}</Badge>
                  </div>
                  <p className="text-white/50 text-xs">{b.email} · {b.preferred_date} at {b.preferred_time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        loginLogs.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-8">No login attempts logged yet.</p>
        ) : (
          <div className="space-y-2">
            {loginLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <Badge className={actionColors[log.action] || "bg-white/10 text-white/60"}>
                  {log.action === "login_success" ? "Success" : log.action === "login_fail" ? "Failed" : "Attempt"}
                </Badge>
                <span className="text-white/30 text-xs">{formatDate(log.created_at)}</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default AdminAuditTab;
