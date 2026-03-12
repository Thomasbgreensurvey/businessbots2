import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2, LogOut } from "lucide-react";

const BRAND_BLUE = "#0066FF";
const BRAND_BLUE_DARK = "#0052CC";

/* ── Official Brand SVGs ── */
const FacebookLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

interface Connection {
  provider: string;
  page_name: string | null;
  location_name: string | null;
  is_active: boolean;
}

const AutoPublishConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadConnections = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      setUserId(session.user.id);

      const { data } = await supabase
        .from("oauth_connections")
        .select("provider, page_name, location_name, is_active")
        .eq("user_id", session.user.id);

      if (data) setConnections(data);
      setLoading(false);
    };
    loadConnections();
  }, []);

  const fbConnection = connections.find(c => c.provider === "facebook");
  const googleConnection = connections.find(c => c.provider === "google_business");

  const handleToggle = async (provider: string, currentState: boolean) => {
    if (!userId) return;
    const { error } = await supabase
      .from("oauth_connections")
      .update({ is_active: !currentState })
      .eq("user_id", userId)
      .eq("provider", provider);

    if (error) {
      toast.error("Failed to update");
    } else {
      setConnections(prev => prev.map(c => c.provider === provider ? { ...c, is_active: !currentState } : c));
      toast.success(!currentState ? "Auto-publishing enabled" : "Auto-publishing paused");
    }
  };

  const handleDisconnect = async (provider: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from("oauth_connections")
      .delete()
      .eq("user_id", userId)
      .eq("provider", provider);

    if (error) {
      toast.error("Failed to disconnect");
    } else {
      setConnections(prev => prev.filter(c => c.provider !== provider));
      toast.success("Disconnected successfully");
    }
  };

  const handleConnect = (provider: string) => {
    toast.info(`${provider === "facebook" ? "Facebook" : "Google Business"} OAuth coming soon — API credentials required.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-[#94A3B8]" />
      </div>
    );
  }

  const cards = [
    {
      provider: "facebook",
      label: "Facebook Pages",
      description: "Auto-publish blog posts to your Facebook Page",
      Logo: FacebookLogo,
      brandColor: "#1877F2",
      connection: fbConnection,
      connectedName: fbConnection?.page_name,
    },
    {
      provider: "google_business",
      label: "Google Business",
      description: "Post updates to your Google Business Profile",
      Logo: GoogleLogo,
      brandColor: "#4285F4",
      connection: googleConnection,
      connectedName: googleConnection?.location_name,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {cards.map((card) => {
        const isConnected = !!card.connection;
        const isActive = card.connection?.is_active ?? false;

        return (
          <motion.div
            key={card.provider}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border-2 transition-all"
            style={{
              borderColor: isConnected ? card.brandColor : "#E2E8F0",
              boxShadow: isConnected
                ? `0 8px 30px ${card.brandColor}20`
                : "0 8px 30px rgb(0,0,0,0.04)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <card.Logo />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#0F172A]">{card.label}</h3>
                <p className="text-[11px] text-[#64748B]">{card.description}</p>
              </div>
            </div>

            {/* State 1: Unconnected */}
            {!isConnected && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleConnect(card.provider)}
                className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all"
                style={{
                  background: `linear-gradient(135deg, ${card.brandColor}, ${card.brandColor}CC)`,
                  boxShadow: `0 6px 20px ${card.brandColor}4D`,
                }}
              >
                Connect {card.label}
              </motion.button>
            )}

            {/* State 3: Active / Connected */}
            {isConnected && (
              <div className="space-y-3">
                {/* Connected badge */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "#ECFDF5", border: "2px solid #A7F3D0" }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: "#10B981" }} />
                  <span className="text-xs font-bold" style={{ color: "#047857" }}>
                    Connected to {card.connectedName || card.label}
                  </span>
                </div>

                {/* Toggle + Disconnect */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]">Auto-publish</span>
                  <button
                    onClick={() => handleToggle(card.provider, isActive)}
                    className="relative w-12 h-[26px] rounded-full transition-colors cursor-pointer"
                    style={{ backgroundColor: isActive ? card.brandColor : "#CBD5E1" }}
                  >
                    <motion.div
                      className="absolute top-[3px] w-5 h-5 rounded-full bg-white"
                      style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
                      animate={{ left: isActive ? 24 : 3 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <button
                  onClick={() => handleDisconnect(card.provider)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-[#EF4444] hover:underline"
                >
                  <LogOut className="w-3 h-3" /> Disconnect
                </button>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default AutoPublishConnections;
