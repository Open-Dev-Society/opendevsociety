import Link from "next/link";

const base =
  "relative isolate inline-flex items-center justify-center gap-[0.5em] rounded-[2px] font-mono leading-none whitespace-nowrap transition-[translate,background-color,color] duration-(--d-2) ease-(--ease-ui) active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)";
const sizes = { lg: "min-h-13 px-6 py-4 text-[15px]", md: "min-h-11 px-5 py-3 text-[14px]", sm: "min-h-9 px-3.5 py-2 text-[13px]" };
const variants = {
  // Solid deep teal (white on it 5.3:1). Hover: a 2px checker of --accent-hover (6.8:1) sweeps in left to right in hard steps: a 1-bit dissolve.
  primary:
    "bg-(--accent) text-(--accent-fg) active:bg-(--accent-hover) before:absolute before:inset-0 before:-z-10 before:bg-[repeating-conic-gradient(var(--accent-hover)_0_25%,transparent_0_50%)] before:bg-size-[4px_4px] before:[clip-path:inset(0_100%_0_0)] before:transition-[clip-path] before:duration-(--d-3) before:ease-[steps(6,end)] hover:before:[clip-path:inset(0)]",
  // A paper plate with an ink hairline that inverts to ink.
  secondary: "bg-(--bg) text-(--fg) shadow-[inset_0_0_0_1px_var(--fg)] hover:bg-(--fg) hover:text-(--bg)",
};

/** LabButton's classes, for a <button> (form submits, actions). */
export const labButton = (variant: keyof typeof variants = "primary", size: keyof typeof sizes = "lg", className = "") =>
  `${base} ${sizes[size]} ${variants[variant]} ${className}`;

/** The lab's buttons: square, mono, a real fill. Used by the hero and the nav. */
export function LabButton({
  href,
  variant = "primary",
  size = "lg",
  className = "",
  children,
  ...rest
}: { href: string; variant?: keyof typeof variants; size?: keyof typeof sizes; className?: string; children: React.ReactNode } & Omit<
  React.ComponentProps<typeof Link>,
  "href" | "className"
>) {
  return (
    <Link href={href} className={labButton(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
