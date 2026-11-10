import { cn } from "./cn";

export type Person = { src: string; name: string; href?: string };

/** GitHub avatars are sized at 2× the display size. */
export const sizedAvatar = (src: string, px: number) => `${src}${src.includes("?") ? "&" : "?"}s=${px * 2}`;

export function Avatar({
  src,
  name,
  href,
  size = 40,
  shape = "circle",
  className,
}: Person & { size?: number; shape?: "circle" | "square"; className?: string }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- external GitHub avatars; no remotePatterns configured
    <img
      src={sizedAvatar(src, size)}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={cn(
        "shrink-0 bg-(--surface-2) object-cover outline-1 -outline-offset-1 outline-(--img-outline)",
        shape === "circle" ? "rounded-full" : "rounded-(--radius-sm)",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" title={name} className="shrink-0 rounded-full">
      {img}
    </a>
  ) : (
    img
  );
}

/** Up to 5 overlapping 24px faces with a 2px surface ring. */
export function AvatarStack({ people, max = 5, size = 24, className }: { people: Person[]; max?: number; size?: number; className?: string }) {
  return (
    <span className={cn("flex items-center -space-x-1.5", className)}>
      {people.slice(0, max).map((p) => (
        <Avatar key={p.src} src={p.src} name={p.name} size={size} className="ring-2 ring-(--surface)" />
      ))}
    </span>
  );
}
