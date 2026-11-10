import { ago } from "@/lib/format";
import type { Activity } from "./data";
import { TypeLine } from "./live";
import { Container } from "../Section";
import { band, display, ext, focus, label } from "./ui";

function line(a: Activity) {
  const who = a.who ? `@${a.who}` : "Someone";
  if (a.kind === "release") return `${a.repo} ${a.tag ?? a.title} released`;
  if (a.kind === "contributor") return `${who} made a first contribution: ${a.title}`;
  return `${who} merged “${a.title}”`;
}

/** 03 · ink: the latest merged PRs, releases and first contributions across every project. The newest line types itself in. */
export function Now({ activity, now }: { activity: Activity[]; now: number }) {
  const feed = activity.slice(0, 8);
  return (
    <section aria-labelledby="now-h" data-grid="Happening now" className={`tone-inverse ${band}`}>
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
        <div className="lg:col-span-4">
          <h2 id="now-h" className={`${display} text-[clamp(2.5rem,1.6rem+3.6vw,5rem)]`}>
            Happening now
          </h2>
          <p className="mt-4 max-w-[34ch] text-[17px] leading-relaxed text-(--fg-muted)">
            Merged pull requests, releases and new contributors, straight from GitHub.
          </p>
          <p className={`${label} mt-6 flex items-center gap-2`}>
            <span aria-hidden className="size-2 bg-(--accent)" /> live · checked hourly
          </p>
        </div>

        <ol className="border-t border-(--fg) lg:col-span-8">
          {feed.map((a, i) => (
            <li key={`${a.url}-${a.at}`} className={i > 4 ? "max-sm:hidden" : ""}>
              <a
                href={a.url}
                {...ext}
                className={`grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-(--line) py-3 transition-colors duration-(--d-2) hover:bg-(--surface) sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:items-baseline ${focus}`}
              >
                <span className="t-mono text-[12px] text-(--fg-subtle)">{ago(a.at, now)}</span>
                <span className={`text-[15px] leading-snug ${i ? "text-(--fg-muted)" : "text-(--fg)"}`}>
                  {i ? line(a) : <TypeLine text={line(a)} />}
                </span>
                <span className="t-mono col-start-2 text-[12px] text-(--accent) sm:col-start-auto">{a.repo}</span>
              </a>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
