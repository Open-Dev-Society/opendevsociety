import { Fragment } from "react";

/**
 * A lab record head: the mono record line ("§02 · EXPERIMENTS · 15 records · updated 20h ago"), then the display title.
 * `meta` items are joined with " · "; pass nodes to emphasise a value. Compose the rest of the section yourself.
 */
export function Record({
  n,
  name,
  meta = [],
  title,
  as: H = "h2",
  size = "section",
  id,
  className = "",
  children,
}: {
  /** Section number: "02" → "§02". */
  n: string;
  /** Record name, set in caps: "Experiments". */
  name: string;
  meta?: React.ReactNode[];
  title: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  /** page: the h1 scale (like the hero); section: a step down. */
  size?: "page" | "section";
  id?: string;
  className?: string;
  /** Anything under the title (a lede, plates). */
  children?: React.ReactNode;
}) {
  return (
    <header className={className}>
      <p className="t-mono flex flex-wrap items-baseline gap-x-2 border-t border-(--fg) pt-2 text-[12px] leading-[1.5] text-(--fg-muted)">
        <span className="text-(--fg)">§{n}</span>
        {[name, ...meta].map((m, i) => (
          <Fragment key={i}>
            <span aria-hidden>·</span>
            <span className={i === 0 ? "text-(--fg) uppercase" : undefined}>{m}</span>
          </Fragment>
        ))}
      </p>
      <H
        id={id}
        className={`mt-5 font-[800] tracking-[-0.018em] text-balance text-(--fg) [font-stretch:75%] ${
          size === "page" ? "text-[clamp(2.75rem,1rem+5.5vw,6.5rem)] leading-[0.9]" : "text-[clamp(2rem,1rem+3vw,4rem)] leading-[0.92]"
        }`}
      >
        {title}
      </H>
      {children}
    </header>
  );
}
