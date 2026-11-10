import { getImageProps } from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AvatarStack, sizedAvatar, type Person } from "./Avatar";
import { cn } from "./cn";

type Shot = { src: string; width: number; height: number };

/** The ink plate (docs/references.md, after Cursor): a textured cobalt ground that dark captures are mounted on. */
export function Plate({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("plate rounded-(--radius-lg)", className)}>{children}</div>;
}

/** A multiplayer cursor with a name tag. Builders get a bone tag with their face; `you` gets the highlighter. */
function Cursor({ label, avatar, href, you, className, i }: { label: string; avatar?: string; href: string; you?: boolean; className?: string; i: number }) {
  return (
    <a
      href={href}
      {...(you ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className={cn("rise group absolute z-10 flex items-start", className)}
      style={{ "--i": i } as React.CSSProperties}
    >
      <svg viewBox="0 0 16 16" className="size-4 shrink-0 drop-shadow-[0_1px_1px_oklch(0_0_0/0.4)]" aria-hidden>
        <path d="M1.5 1.5 14 6.6 8.2 8.2 6.6 14z" fill={you ? "var(--mark)" : "var(--surface)"} stroke="var(--inv-bg)" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span
        className={cn(
          "-ml-0.5 mt-3 inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 text-[13px] font-medium whitespace-nowrap shadow-[0_6px_16px_-6px_oklch(0_0_0/0.5)] transition-transform duration-(--d-2) ease-(--ease-ui) group-hover:-translate-y-0.5",
          you ? "bg-(--mark) pl-2.5 text-(--inv-bg)" : "bg-(--surface) pl-0.5 text-(--fg)",
        )}
      >
        {avatar && (
          // eslint-disable-next-line @next/next/no-img-element -- external GitHub avatars
          <img src={sizedAvatar(avatar, 20)} alt="" width={20} height={20} className="size-5 rounded-full" />
        )}
        {label}
      </span>
    </a>
  );
}

// Where the cursors sit on the plate, as if mid-work. The last spot is always the open seat.
const SPOTS = ["left-[9%] top-[38%] lg:left-[11%] lg:top-[44%]", "right-[6%] top-[20%] lg:right-[9%] lg:top-[30%]", "max-lg:hidden left-[46%] top-[72%]"];
const YOU = "left-[38%] bottom-[8%] lg:left-[64%] lg:bottom-[14%]";

/**
 * The home hero's showpiece: the live OpenStock capture on the ink plate, cropped at the bottom edge, with the
 * real builders' cursors on it and one highlighter cursor for whoever is next. Same data as <Print>.
 */
export function Showpiece({
  desktop,
  mobile,
  alt,
  url,
  href,
  name,
  tagline,
  people,
  builders,
  youHref = "#start",
  className,
}: {
  desktop: Shot;
  mobile?: Shot;
  alt: string;
  url: string;
  href: string;
  name: string;
  tagline: string;
  people: Person[];
  builders: number;
  /** where the "you" cursor goes */
  youHref?: string;
  className?: string;
}) {
  const common = { alt, priority: true } as const;
  const { props: d } = getImageProps({ ...common, ...desktop, sizes: "(min-width: 1408px) 1180px, 86vw" });
  const m = mobile ? getImageProps({ ...common, ...mobile, sizes: "(min-width: 768px) 46vw, 78vw" }).props : null;

  return (
    <figure className={className}>
      <Plate className="aspect-[4/5] md:aspect-[16/10] lg:aspect-[2/1]">
        <span className="t-mono absolute top-4 left-5 text-xs text-(--inv-fg-subtle) lg:top-6 lg:left-8">{url}</span>
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name}, live`} className="absolute inset-x-0 top-[11%] bottom-0 block lg:top-[13%]">
          <picture>
            {m && <source media="(max-width: 1023px)" srcSet={m.srcSet} sizes={m.sizes} />}
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
            <img
              {...d}
              className="mx-auto block h-auto w-[78%] rounded-t-(--radius-md) shadow-[0_0_0_1px_oklch(1_0_0/0.12),0_40px_80px_-24px_oklch(0_0_0/0.7)] md:w-[46%] lg:w-[86%]"
            />
          </picture>
        </a>
        {people.slice(0, SPOTS.length).map((p, k) => (
          <Cursor key={p.name} i={4 + k} label={`@${p.name}`} avatar={p.src} href={p.href ?? `https://github.com/${p.name}`} className={SPOTS[k]} />
        ))}
        <Cursor i={4 + SPOTS.length} label="you?" href={youHref} you className={YOU} />
      </Plate>
      <figcaption className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>
          <span className="t-title text-(--fg)">{name}</span>
          <span className="ml-2 text-sm text-(--fg-muted)">{tagline}</span>
        </span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="flex items-center gap-2">
            <AvatarStack people={people} />
            <span className="text-(--fg-muted)">
              Signed by <span className="sign text-(--accent)">{builders} builders</span>
            </span>
          </span>
          <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-0.5 font-medium text-(--fg) hover:text-(--accent)">
            Open it <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
