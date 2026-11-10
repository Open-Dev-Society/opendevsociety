import { cn } from "./cn";

/**
 * Surface for grouped content. With `href` the whole card is one link and lifts on hover
 * (only navigating cards move); without it the card is static.
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
  const base = "block rounded-(--radius-lg) bg-(--surface) p-5 shadow-(--shadow-sm) sm:p-6";
  if (!href) return <div className={cn(base, className)}>{children}</div>;
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        base,
        "transition-[box-shadow,translate] duration-200 ease-(--ease-out) hover:-translate-y-0.5 hover:shadow-(--shadow-md)",
        className,
      )}
    >
      {children}
    </a>
  );
}

export function Badge({
  tone = "neutral",
  dot,
  className,
  children,
}: {
  tone?: "neutral" | "accent";
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "accent" ? "bg-(--accent-soft) text-(--accent)" : "bg-(--surface-2) text-(--fg-muted)",
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
