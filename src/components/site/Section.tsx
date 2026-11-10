import { ArrowRight } from "lucide-react";
import { cn } from "./cn";

type Tone = "default" | "muted" | "inverse";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-(--container) px-(--gutter)", className)}>{children}</div>;
}

/** Full-bleed band with the standard vertical rhythm. `tone` re-points the tokens for everything inside. */
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

export function Eyebrow({ index, children, className }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 text-sm font-medium", className)}>
      {index && <span className="font-mono text-xs tabular-nums text-(--fg-subtle)">{index}</span>}
      <span className="text-(--accent)">{children}</span>
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  index,
  title,
  description,
  action,
  align = "start",
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  index?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: { label: string; href: string };
  align?: "start" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div
      className={cn(
        "mb-10 flex flex-wrap gap-x-8 gap-y-4",
        center ? "flex-col items-center text-center" : "items-end justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", center && "flex flex-col items-center")}>
        {eyebrow && <Eyebrow index={index}>{eyebrow}</Eyebrow>}
        <Heading
          className={cn(
            "font-display text-balance tracking-tight text-(--fg)",
            eyebrow && "mt-3",
            Heading === "h1" ? "text-[40px] leading-[1] sm:text-6xl" : "text-[32px] leading-[1.08] sm:text-[44px]",
          )}
        >
          {title}
        </Heading>
        {description && <p className="mt-4 max-w-xl text-pretty text-[17px] leading-relaxed text-(--fg-muted)">{description}</p>}
      </div>
      {action && (
        <a
          href={action.href}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-(--fg-muted) transition-colors duration-150 hover:text-(--fg)"
        >
          {action.label}
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      )}
    </div>
  );
}
