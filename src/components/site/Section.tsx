import { ArrowRight } from "lucide-react";
import { cn } from "./cn";

type Tone = "default" | "muted" | "inverse";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-(--container) px-(--gutter)", className)}>{children}</div>;
}

/** Full-bleed band with the one section rhythm. `tone` re-points the tokens for everything inside. */
export function Section({
  id,
  tone = "default",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-16 py-(--section-y)", tone === "muted" && "tone-muted", tone === "inverse" && "tone-inverse", className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/** The rail label: meta, subtle, never accent, no numerals. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("t-meta text-(--fg-subtle)", className)}>{children}</p>;
}

/**
 * The rail (brief §5): label and live count in cols 1–3, heading and dek in cols 4–12.
 * Below 1024 the rail collapses to one line above the heading: "Work · 15 tools".
 * The section's "→" link goes under the content: use <SectionLink>.
 */
export function SectionHeader({
  eyebrow,
  count,
  title,
  description,
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  count?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("mb-8 grid grid-cols-1 gap-y-3 lg:mb-12 lg:grid-cols-12 lg:gap-x-(--grid-gap)", className)}>
      {eyebrow && (
        <div className="t-meta flex flex-wrap items-baseline gap-x-1.5 text-(--fg-subtle) lg:col-span-3 lg:flex-col lg:gap-1 lg:pt-3">
          <span>{eyebrow}</span>
          {count && (
            <>
              <span aria-hidden className="lg:hidden">
                ·
              </span>
              <span className="t-mono text-(--fg-muted)">{count}</span>
            </>
          )}
        </div>
      )}
      <div className={cn("min-w-0", eyebrow ? "lg:col-span-9" : "lg:col-span-12")}>
        <Heading className="display-2 max-w-[22ch] text-(--fg)">{title}</Heading>
        {description && <p className="t-lede mt-4 max-w-[52ch] text-(--fg-muted)">{description}</p>}
      </div>
    </div>
  );
}

/** The section's escape hatch, right-aligned under the content. */
export function SectionLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mt-8 flex justify-end", className)}>
      <a
        href={href}
        className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-(--fg) transition-colors duration-(--d-2) hover:text-(--accent)"
      >
        {children}
        <ArrowRight className="size-4 transition-transform duration-(--d-2) ease-(--ease-ui) group-hover:translate-x-0.5" strokeWidth={1.75} />
      </a>
    </div>
  );
}
