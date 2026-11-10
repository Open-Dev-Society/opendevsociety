// On the emerald ground (.tone-emerald) everything reads in white, mint and pale rose. Shared type and link styles for the home bands (docs/lab.md: condensed display, mono labels).
export const display = "font-[800] leading-[0.9] tracking-[-0.018em] text-balance text-(--fg) [font-stretch:75%]";
export const label = "t-mono text-[12px] tracking-[0.06em] uppercase text-(--fg-muted)";
export const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)";
export const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
/** Band padding: tighter than --section-y so the whole home stays short on phones. */
export const band = "py-12 md:py-24";
