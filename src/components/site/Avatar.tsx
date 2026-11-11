import Image from "next/image";
import { Tooltip } from "./Tooltip";

/** GitHub avatars are sized at 2× the display size. */
export const sizedAvatar = (src: string, px: number) => `${src}${src.includes("?") ? "&" : "?"}s=${px * 2}`;

/** "Jul 2024" */
export const month = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

const plural = (n: number, one: string) => `${n.toLocaleString("en-US")} ${one}${n === 1 ? "" : "s"}`;

/** "142 commits · 3 projects · since Jul 2024": only the facts we have. */
export const facts = ({ contributions, repos, joined }: { contributions: number; repos?: unknown[]; joined?: string }) =>
  [contributions > 0 && plural(contributions, "commit"), repos?.length && plural(repos.length, "project"), joined && `since ${month(joined)}`]
    .filter((f): f is string => !!f)
    .map((f) => f.replaceAll(" ", "\u00a0")) // each fact wraps whole
    .join(" · ");

/**
 * A contributor's real photo: square, a hairline just inside its edge so light photos keep their shape on the paper.
 * `px` is the largest size it shows at (the GitHub request is 2× that); CSS in `className` may draw it smaller.
 */
export function Photo({ src, px, alt = "", className = "" }: { src: string; px: number; alt?: string; className?: string }) {
  return (
    <Image
      src={sizedAvatar(src, px)}
      alt={alt}
      width={px}
      height={px}
      className={`block aspect-square bg-(--surface-2) object-cover outline -outline-offset-1 outline-(--fg)/12 ${className}`}
    />
  );
}

export type Person = { login: string; name?: string; avatar: string; url: string; role?: string; line?: string };

/** A face that links to the person's GitHub profile, with a tooltip card: name, @login, role and a line of facts. */
export function Face({ p, px, className = "", photoClassName = "" }: { p: Person; px: number; className?: string; photoClassName?: string }) {
  return (
    <Tooltip
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus) ${className}`}
      tip={
        <>
          {p.name && <span className="sign block text-[18px] leading-tight">{p.name}</span>}
          <span className={`t-mono block ${p.name ? "text-[12px] text-(--fg-muted)" : "text-[13px]"}`}>
            @{p.login}
            {p.role && <span className="text-(--accent)"> · {p.role}</span>}
          </span>
          {p.line && <span className="t-mono mt-2 block border-t border-(--line) pt-2 text-[11px] leading-snug">{p.line}</span>}
        </>
      }
    >
      <Photo src={p.avatar} px={px} alt={p.name ?? `@${p.login}`} className={photoClassName} />
    </Tooltip>
  );
}
