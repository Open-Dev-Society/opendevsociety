import { cn } from "./cn";

/**
 * Surface for grouped content. With `href` the whole card is one link and lifts on hover
 * (only navigating cards move: in --d-2, out --d-3).
 */
export function Card({
  href,
  external,
  className,
  children,
}: {
  href?: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const base = "block rounded-(--radius-md) bg-(--surface) p-5 shadow-(--shadow-md) lg:p-6";
  if (!href) return <div className={cn(base, className)}>{children}</div>;
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        base,
        "transition-[box-shadow,translate] duration-(--d-3) ease-(--ease-ui) hover:-translate-y-0.5 hover:shadow-(--shadow-lg) hover:duration-(--d-2)",
        className,
      )}
    >
      {children}
    </a>
  );
}

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: "neutral" | "accent" | "live";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-(--radius-sm) px-2 text-xs font-medium",
        tone === "accent" && "bg-(--accent-soft) text-(--accent-hover)",
        tone === "live" && "bg-(--live)/12 text-(--live)",
        tone === "neutral" && "bg-(--surface-2) text-(--fg-muted)",
        className,
      )}
    >
      {children}
    </span>
  );
}
