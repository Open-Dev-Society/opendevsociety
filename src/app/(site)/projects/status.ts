import type { Status } from "@/lib/lab";

/** Plain words for the three states (lab.ts keeps the computation). Not in Log.tsx: a "use client" module's constants are undefined on the server. */
export const STATUS_LABEL: Record<Status, string> = { running: "active", paused: "quiet", archived: "archived" };
