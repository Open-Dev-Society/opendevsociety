import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-(--accent) text-(--accent-fg) hover:brightness-110",
  secondary: "bg-(--surface) text-(--fg) shadow-(--shadow-sm) hover:shadow-(--shadow-md)",
  ghost: "text-(--fg-muted) hover:bg-(--surface-2) hover:text-(--fg)",
};
const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm gap-1.5",
  lg: "h-12 px-5 text-[15px] gap-2",
};

/**
 * A link styled as a button (every CTA on the site navigates). `icon="arrow"` for in-site, `"external"` for off-site.
 * External links open in a new tab.
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  icon,
  external,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: "arrow" | "external";
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const Icon = icon === "arrow" ? ArrowRight : icon === "external" ? ArrowUpRight : null;
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap",
        "transition-[background-color,color,box-shadow,filter,scale] duration-150 active:scale-[0.96]",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
      {Icon && (
        <Icon
          className={cn(
            "size-4 transition-transform duration-200",
            icon === "arrow" ? "group-hover:translate-x-0.5" : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
          )}
          strokeWidth={2}
        />
      )}
    </a>
  );
}
