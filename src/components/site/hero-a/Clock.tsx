"use client";

import { useSyncExternalStore } from "react";

// One shared second: snapshots must be stable between ticks, so the time is cached per second.
const tick = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const second = () => Math.floor(Date.now() / 1000);

// The server can't know the reader's time zone, so it renders fixed-width placeholders and the client fills them.
export function Clock() {
  const s = useSyncExternalStore(tick, second, () => 0);
  const now = s ? new Date(s * 1000) : null;

  const date = now?.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) ?? "··· ·· ··· ····";
  const time = now?.toLocaleTimeString("en-GB", { hour12: false }) ?? "--:--:--";
  const zone = now ? (new Intl.DateTimeFormat("en-GB", { timeZoneName: "short" }).formatToParts(now).find((p) => p.type === "timeZoneName")?.value ?? "") : "···";

  return (
    <>
      <p className="t-mono text-[12px] text-(--fg-muted)">{date}</p>
      <p className="mt-1 font-mono text-[1.375rem] leading-none tracking-tight text-(--fg) tabular-nums">
        <time dateTime={now?.toISOString()}>{time}</time>
        <span className="ml-2 align-middle text-[12px] tracking-normal text-(--fg-subtle)">{zone}</span>
      </p>
    </>
  );
}
