import Image from "next/image";
import { languageColors } from "@/data/catalog";
import { compact } from "@/lib/format";
import { Badge } from "./Card";
import { cn } from "./cn";

export type RepoSummary = {
  name: string;
  url: string;
  tagline: string;
  language: string | null;
  /** pre-computed on the server, e.g. "3d ago", so client renders never drift */
  pushedAgo: string;
  stars: number;
  builders: number;
  badge?: string;
};

/** The dot · pushed · builders · ★ (only ≥ 50) line shared by tiles and index rows. */
export function RepoMeta({ repo, hideBuilders, className }: { repo: RepoSummary; hideBuilders?: boolean; className?: string }) {
  const parts = [
    repo.language && (
      <span key="lang" className="inline-flex items-center gap-1.5">
        <span className="size-2 rounded-full" style={{ background: languageColors[repo.language] ?? "var(--fg-subtle)" }} />
        {repo.language}
      </span>
    ),
    <span key="pushed">pushed {repo.pushedAgo}</span>,
    !hideBuilders && repo.builders > 0 && <span key="b">{repo.builders} {repo.builders === 1 ? "builder" : "builders"}</span>,
    repo.stars >= 50 && <span key="s">★ {compact(repo.stars)}</span>,
  ].filter(Boolean);
  return (
    <span className={cn("t-meta flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums text-(--fg-muted)", className)}>
      {parts.map((p, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          {i > 0 && <span aria-hidden>·</span>}
          {p}
        </span>
      ))}
    </span>
  );
}

/**
 * A featured repo: a 16:10 capture, or (no capture) an inverse panel with the tagline set large.
 * The whole tile is one link and lifts on hover.
 */
export function RepoTile({
  repo,
  shot,
  variant = "card",
  className,
}: {
  repo: RepoSummary;
  shot?: string;
  /** card: the framed tile. plate: mounted on the ink plate and captioned like a signed print (home showcase). */
  variant?: "card" | "plate";
  className?: string;
}) {
  if (variant === "plate") return <PlateTile repo={repo} shot={shot} className={className} />;
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-(--radius-md) bg-(--surface) p-2 shadow-(--shadow-md)",
        "transition-[box-shadow,translate] duration-(--d-3) ease-(--ease-ui) hover:-translate-y-0.5 hover:shadow-(--shadow-lg) hover:duration-(--d-2)",
        className,
      )}
    >
      {shot ? (
        <Image
          src={shot}
          alt=""
          width={2880}
          height={1800}
          sizes="(min-width: 1024px) 400px, 78vw"
          className="aspect-[16/10] w-full rounded-(--radius-sm) bg-(--surface-2) object-cover object-top"
        />
      ) : (
        <div className="tone-inverse flex aspect-[16/10] items-end rounded-(--radius-sm) p-5">
          <p className="display-3 max-w-[16ch] text-(--fg)">{repo.tagline}</p>
        </div>
      )}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <h3 className="t-title flex items-center gap-2 text-(--fg)">
          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-(--radius-md)">
            {repo.name}
          </a>
          {repo.badge && <Badge>{repo.badge}</Badge>}
        </h3>
        {shot && <p className="mt-1 text-sm text-(--fg-muted)">{repo.tagline}</p>}
        <RepoMeta repo={repo} className="mt-auto pt-4" />
      </div>
    </article>
  );
}

/**
 * The showcase tile (docs/references.md: Cursor's plate, Works Studio's two-line caption). The capture sits on the
 * ink plate under an instrument label and is cropped at the bottom edge; without one, the tagline is set on the plate.
 * Size it from outside: the plate fills the tile's height on desktop (`lg:h-…` on className sets it).
 */
function PlateTile({ repo, shot, className }: { repo: RepoSummary; shot?: string; className?: string }) {
  const path = repo.url.replace(/^https:\/\/github\.com\//, "");
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="plate flex aspect-[16/11] min-h-0 flex-1 rounded-(--radius-lg) lg:aspect-auto">
        <span className="t-mono absolute top-4 left-5 z-10 text-xs text-(--inv-fg-subtle) lg:top-5 lg:left-6">{path}</span>
        {shot ? (
          <Image
            src={shot}
            alt=""
            width={2880}
            height={1800}
            sizes="(min-width: 1024px) 720px, 92vw"
            className="absolute top-[14%] left-1/2 h-full w-[86%] -translate-x-1/2 rounded-t-(--radius-md) object-cover object-top shadow-[0_0_0_1px_oklch(1_0_0/0.12),0_30px_60px_-20px_oklch(0_0_0/0.7)] transition-transform duration-(--d-4) ease-(--ease-out) group-hover:-translate-y-1.5"
          />
        ) : (
          <p className="display-2 mt-auto max-w-[16ch] p-6 text-(--inv-fg) sm:p-8 lg:p-10">{repo.tagline}</p>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h3 className="t-title flex items-center gap-2 text-(--fg)">
          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-(--radius-lg)">
            {repo.name}
          </a>
          {repo.badge && <Badge>{repo.badge}</Badge>}
        </h3>
        {repo.builders > 0 && (
          <span className="text-sm text-(--fg-muted)">
            Signed by{" "}
            <span className="sign text-(--accent)">
              {repo.builders} {repo.builders === 1 ? "builder" : "builders"}
            </span>
          </span>
        )}
      </div>
      {shot && <p className="mt-1 text-sm text-(--fg-muted)">{repo.tagline}</p>}
      <RepoMeta repo={repo} hideBuilders className="mt-3" />
    </article>
  );
}
