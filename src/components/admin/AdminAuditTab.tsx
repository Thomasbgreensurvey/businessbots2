import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, FileText, LogIn, Loader2, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface AuditLog {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const PAGE_SIZE = 20;

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
  const [actionPage, setActionPage] = useState(1);
  const [loginPage, setLoginPage] = useState(1);
  const [cleaningUp, setCleaningUp] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [logsRes, contactsRes, bookingsRes] = await Promise.all([
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("contacts").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("demo_bookings").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    if (logsRes.data) setLogs(logsRes.data as AuditLog[]);
    if (contactsRes.data) setContacts(contactsRes.data);
    if (bookingsRes.data) setBookings(bookingsRes.data);
    setLoading(false);
  };

  const runHousekeeping = async () => {
    setCleaningUp(true);
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 3);
      const cutoffISO = cutoff.toISOString();

      const { error } = await supabase
        .from("audit_logs")
        .delete()
        .lt("created_at", cutoffISO);

      if (error) throw error;
      toast.success("Housekeeping complete — removed logs older than 3 days");
      fetchAll();
    } catch (e: any) {
      toast.error(`Cleanup failed: ${e.message}`);
    }
    setCleaningUp(false);
  };

  const actionLogs = logs.filter((l) => !["login_success", "login_fail"].includes(l.action));
  const loginLogs = logs.filter((l) => ["login_success", "login_fail"].includes(l.action));
  const formatDate = (d: string) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  const paginatedActions = actionLogs.slice(0, actionPage * PAGE_SIZE);
  const paginatedLogins = loginLogs.slice(0, loginPage * PAGE_SIZE);
  const hasMoreActions = actionLogs.length > actionPage * PAGE_SIZE;
  const hasMoreLogins = loginLogs.length > loginPage * PAGE_SIZE;

  const getDetail = (log: AuditLog) => {
    if (log.details && typeof log.details === "object" && "title" in log.details) return String(log.details.title);
    return "—";
  };

  const renderActionTable = () => (
    <>
      {/* Desktop table */}
      <div className="rounded-xl border border-white/10 overflow-hidden hidden md:block">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Time</th>
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Action</th>
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Entity</th>
                <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActions.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-white/30 text-xs">No actions logged yet.</td></tr>
              ) : paginatedActions.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white/40 font-mono text-xs">{formatDate(log.created_at)}</td>
                  <td className="px-4 py-3"><Badge className={`text-[10px] ${actionColors[log.action] || "bg-white/10 text-white/60"}`}>{log.action}</Badge></td>
                  <td className="px-4 py-3 text-white/60 text-xs">{log.entity_type || "—"}</td>
                  <td className="px-4 py-3 text-white/40 text-xs max-w-[200px] truncate">{getDetail(log)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {paginatedActions.length === 0 ? (
          <p className="text-center text-white/30 text-xs py-8">No actions logged yet.</p>
        ) : paginatedActions.map((log) => (
          <div key={log.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/40 font-mono text-xs">{formatDate(log.created_at)}</span>
              <Badge className={`text-[10px] ${actionColors[log.action] || "bg-white/10 text-white/60"}`}>{log.action}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400/60 text-[10px] uppercase tracking-wider">Entity</span>
              <span className="text-white/60 text-xs">{log.entity_type || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400/60 text-[10px] uppercase tracking-wider">Details</span>
              <span className="text-white/40 text-xs truncate max-w-[60%] text-right">{getDetail(log)}</span>
            </div>
          </div>
        ))}
      </div>
      {hasMoreActions && (
        <div className="flex justify-center pt-2">
          <Button variant="ghost" size="sm" onClick={() => setActionPage((p) => p + 1)} className="text-emerald-400 hover:text-emerald-300">
            <ChevronDown className="w-4 h-4 mr-1" /> Load More ({actionLogs.length - paginatedActions.length} remaining)
          </Button>
        </div>
      )}
    </>
  );

  const renderFormsTable = (data: any[], columns: { key: string; label: string }[], title: string) => (
    <div>
      <h4 className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-3">{title} ({data.length})</h4>
      {/* Desktop */}
      <div className="rounded-xl border border-white/10 overflow-hidden hidden md:block">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full text-sm min-w-[500px]">
            <thead><tr className="bg-white/5 border-b border-white/10">
              {columns.map(c => <th key={c.key} className="text-left px-4 py-2 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">{c.label}</th>)}
            </tr></thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={columns.length} className="px-4 py-6 text-center text-white/30 text-xs">No submissions.</td></tr>
              ) : data.map((item: any) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                  {columns.map(c => (
                    <td key={c.key} className="px-4 py-2 text-white/60 text-xs max-w-[200px] truncate">
                      {c.key === "status" ? <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{item[c.key]}</Badge> : (item[c.key] ? String(item[c.key]) : "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {data.length === 0 ? (
          <p className="text-center text-white/30 text-xs py-6">No submissions.</p>
        ) : data.map((item: any) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5">
            {columns.map(c => (
              <div key={c.key} className="flex items-center justify-between">
                <span className="text-emerald-400/60 text-[10px] uppercase tracking-wider">{c.label}</span>
                <span className="text-white/60 text-xs truncate max-w-[60%] text-right">
                  {c.key === "status" ? <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{item[c.key]}</Badge> : (item[c.key] ? String(item[c.key]) : "—")}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderLoginTable = () => (
    <>
      <div className="rounded-xl border border-white/10 overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead><tr className="bg-white/5 border-b border-white/10">
            <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Time</th>
            <th className="text-left px-4 py-3 text-emerald-400/80 font-medium text-[10px] uppercase tracking-wider">Result</th>
          </tr></thead>
          <tbody>
            {paginatedLogins.length === 0 ? (
              <tr><td colSpan={2} className="px-4 py-8 text-center text-white/30 text-xs">No login attempts.</td></tr>
            ) : paginatedLogins.map((log) => (
              <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-white/40 font-mono text-xs">{formatDate(log.created_at)}</td>
                <td className="px-4 py-3"><Badge className={`text-[10px] ${actionColors[log.action]}`}>{log.action === "login_success" ? "✓ Success" : "✗ Failed"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-3">
        {paginatedLogins.length === 0 ? (
          <p className="text-center text-white/30 text-xs py-8">No login attempts.</p>
        ) : paginatedLogins.map((log) => (
          <div key={log.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between">
            <span className="text-white/40 font-mono text-xs">{formatDate(log.created_at)}</span>
            <Badge className={`text-[10px] ${actionColors[log.action]}`}>{log.action === "login_success" ? "✓ Success" : "✗ Failed"}</Badge>
          </div>
        ))}
      </div>
      {hasMoreLogins && (
        <div className="flex justify-center pt-2">
          <Button variant="ghost" size="sm" onClick={() => setLoginPage((p) => p + 1)} className="text-emerald-400 hover:text-emerald-300">
            <ChevronDown className="w-4 h-4 mr-1" /> Load More ({loginLogs.length - paginatedLogins.length} remaining)
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "actions" as const, label: "Admin Actions", icon: Activity },
            { key: "forms" as const, label: "Form Submissions", icon: FileText },
            { key: "logins" as const, label: "Login Attempts", icon: LogIn },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-full text-xs font-medium transition-colors ${tab === key ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={runHousekeeping}
          disabled={cleaningUp}
          className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          {cleaningUp ? "Cleaning..." : "Housekeeping (3d)"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
      ) : tab === "actions" ? renderActionTable()
        : tab === "forms" ? (
          <div className="space-y-6">
            {renderFormsTable(contacts, [
              { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "message", label: "Message" }, { key: "created_at", label: "Date" }
            ], "Contact Submissions")}
            {renderFormsTable(bookings, [
              { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "preferred_date", label: "Date" }, { key: "status", label: "Status" }
            ], "Demo Bookings")}
          </div>
        ) : renderLoginTable()
      }
    </div>
  );
};

export default AdminAuditTab;
