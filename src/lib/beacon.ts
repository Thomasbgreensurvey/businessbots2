/**
 * Stealth analytics beacon — uses navigator.sendBeacon + first-party endpoint
 * to bypass ad-blocker filters (uBlock, AdGuard, etc.)
 */

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-intelligence`;

let sessionId = "";
let pageEntryTime = 0;

function getSid(): string {
  if (!sessionId) {
    sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  return sessionId;
}

function send(events: Record<string, unknown>[]) {
  const payload = JSON.stringify(events);
  // sendBeacon is fire-and-forget, works even on page unload
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(ENDPOINT, blob);
  } else {
    // Fallback for older browsers
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

export function trackPageView(page: string) {
  pageEntryTime = Date.now();
  send([
    {
      action: "page_view",
      page,
      sid: getSid(),
      ref: document.referrer || "",
      ua: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      ts: new Date().toISOString(),
    },
  ]);
}

export function trackPageExit(page: string) {
  if (!pageEntryTime) return;
  const dur = Math.round((Date.now() - pageEntryTime) / 1000);
  send([
    {
      action: "page_exit",
      page,
      sid: getSid(),
      dur,
      ts: new Date().toISOString(),
    },
  ]);
  pageEntryTime = 0;
}

export function trackEvent(action: string, page: string, meta?: Record<string, unknown>) {
  send([
    {
      action,
      page,
      sid: getSid(),
      ts: new Date().toISOString(),
      ...meta,
    },
  ]);
}

// Auto-track page exits on unload
if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      trackPageExit(window.location.pathname);
    }
  });
}
