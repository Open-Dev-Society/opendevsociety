import { cn } from "./cn";

export type Person = { src: string; name: string; href?: string };

export function Avatar({
  src,
  name,
  href,
  size = 40,
  ring,
  className,
}: Person & { size?: number; ring?: boolean; className?: string }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- external GitHub avatars, no remotePatterns configured
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      className={cn(
        "shrink-0 rounded-full bg-(--surface-2) object-cover outline-1 -outline-offset-1 outline-(--img-outline)",
        ring && "ring-2 ring-(--accent) ring-offset-2 ring-offset-(--bg)",
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

/** Overlapping faces with a "+N" chip when there are more than `max`. */
export function AvatarStack({ people, max = 5, size = 28 }: { people: Person[]; max?: number; size?: number }) {
  const shown = people.slice(0, max);
  const more = people.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((p) => (
        <Avatar key={p.src} {...p} size={size} className="ring-2 ring-(--surface)" />
      ))}
      {more > 0 && (
        <span
          className="grid place-items-center rounded-full bg-(--surface-2) text-xs font-medium tabular-nums text-(--fg-muted) ring-2 ring-(--surface)"
          style={{ width: size, height: size }}
        >
          +{more}
        </span>
      )}
    </div>
  );
}
