import { getImageProps } from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AvatarStack, type Person } from "./Avatar";
import { cn } from "./cn";

type Shot = { src: string; width: number; height: number };

/**
 * A screenshot pinned in a passe-partout frame (brief §9): a strip with the real URL, the capture,
 * then a museum-label caption signed by the people who built it. `mobile` swaps in below 1024 (art direction).
 */
export function Print({
  desktop,
  mobile,
  alt,
  url,
  href,
  name,
  tagline,
  people,
  builders,
  stats,
  priority,
  className,
}: {
  desktop: Shot;
  mobile?: Shot;
  alt: string;
  /** shown in the frame strip, e.g. "openstock-ods.vercel.app" */
  url: string;
  href: string;
  name: string;
  tagline: string;
  people: Person[];
  builders: number;
  /** pre-formatted, e.g. "★ 21.4k · 2.7k forks" */
  stats: string;
  priority?: boolean;
  className?: string;
}) {
  const common = { alt, priority, quality: 82 } as const;
  const { props: d } = getImageProps({ ...common, ...desktop, sizes: "(min-width: 1216px) 1200px, 100vw" });
  const m = mobile ? getImageProps({ ...common, ...mobile, sizes: "100vw" }).props : null;

  return (
    <figure className={className}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-(--radius-lg) bg-(--surface) p-1.5 shadow-(--shadow-lg) sm:p-2"
      >
        <span className="t-mono flex h-8 items-center px-2.5 text-xs text-(--fg-subtle)">{url}</span>
        <picture>
          {m && <source media="(max-width: 1023px)" srcSet={m.srcSet} sizes={m.sizes} />}
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
          <img
            {...d}
            className={cn(
              "block h-auto w-full rounded-(--radius-sm) bg-(--surface-2) object-cover object-top",
              m ? "aspect-[4/5] lg:aspect-[16/10]" : "aspect-[16/10]",
            )}
          />
        </picture>
      </a>
      <figcaption className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
          <span className="t-mono text-(--fg-muted)">{stats}</span>
          <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-medium text-(--fg) hover:text-(--accent)">
            Open it <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
