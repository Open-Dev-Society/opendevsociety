/** "21.4k" for 21406; plain numbers below 1,000. */
export const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));

const HOUR = 36e5;

/** "14h ago", "3d ago", "5w ago", "4mo ago", "2y ago". */
export function ago(iso: string, now = Date.now()) {
  const h = (now - Date.parse(iso)) / HOUR;
  if (h < 1) return "just now";
  if (h < 24) return `${Math.round(h)}h ago`;
  const d = h / 24;
  if (d < 14) return `${Math.round(d)}d ago`;
  if (d < 60) return `${Math.round(d / 7)}w ago`;
  if (d < 365) return `${Math.round(d / 30)}mo ago`;
  return `${Math.round(d / 365)}y ago`;
}

/** A commit within the last 24 hours. */
export const isLive = (iso: string, now = Date.now()) => now - Date.parse(iso) < 24 * HOUR;
