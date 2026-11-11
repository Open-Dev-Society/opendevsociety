import { contactEmail, social } from "@/content";
import { catalog } from "@/data/catalog";
import { ago, isLive } from "@/lib/format";
import { getCommitsThisWeek, getOrgRepos } from "@/lib/github";
import { VerifyForm } from "./Field";
import { ArrowRight, Discord, External } from "./Icon";
import { DitherEdge } from "./lab/DitherEdge";
import { LabButton } from "./lab-hero/LabButton";
import { Container } from "./Section";

export const FORK_COMMAND = "gh repo fork Open-Dev-Society/OpenStock --clone";

// Every page, with a one-line hint of what's there.
const pages = [
  { hint: "the work", label: "Projects", href: "/projects" },
  { hint: "the people", label: "Contributors", href: "/contributors" },
  { hint: "what we believe", label: "Manifesto", href: "/manifesto" },
  { hint: "start here", label: "Contribute", href: "/contribute" },
  { hint: "press, partners", label: "What people say", href: "/word-of-mouth" },
];
const address = [social.github, social.discord, social.linkedin, { ...social.twitter, label: "X" }, social.email].map((l) => ({
  ...l,
  shown: l.href.startsWith("mailto:") ? contactEmail : l.href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
}));
const out = { target: "_blank", rel: "noopener noreferrer" } as const;

const link = "transition-colors duration-(--d-2) hover:text-(--fg)";
const label = "t-mono mb-4 block text-[11px] tracking-[0.08em] text-(--fg-subtle) uppercase";
const row = "border-t border-(--line) py-2.5 last:border-b";

// The wordmark's 1-bit ramp, top to bottom: solid emerald, a 2px checker (50%), one cell in four (25%).
const wordmark = "col-start-1 row-start-1 block text-[17.2cqi] leading-[1.04] font-[800] tracking-[-0.02em] whitespace-nowrap [font-stretch:75%]";
const bands = [
  { clip: "[clip-path:inset(72%_0_0_0)]", fill: "bg-[conic-gradient(at_2px_2px,transparent_75%,var(--accent-brand)_0)] bg-size-[4px_4px] bg-clip-text text-transparent" },
  { clip: "[clip-path:inset(40%_0_28%_0)]", fill: "bg-[repeating-conic-gradient(var(--accent-brand)_0_25%,transparent_0_50%)] bg-size-[4px_4px] bg-clip-text text-transparent" },
  // On hover the solid band develops down through the rest in hard steps, like LabButton's sweep.
  { clip: "[clip-path:inset(0_0_60%_0)] transition-[clip-path] duration-(--d-5) ease-[steps(8,end)] group-hover:[clip-path:inset(0)]", fill: "text-(--accent-brand)" },
];

/** The one live line: commits this week across the org (when the count is fresh) and the project pushed to last. */
async function pulse() {
  const [commits, repos] = await Promise.all([getCommitsThisWeek(), getOrgRepos()]);
  const now = Date.now();
  const last = repos.filter((r) => catalog[r.name]).sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))[0];
  // The snapshot fallback's count is for an old week: show it only while it's from the last two days.
  const fresh = now - Date.parse(commits.asOf) < 2 * 864e5;
  return { now, last, count: fresh ? commits.count : null };
}

/** The footer on every (site) page: the closing call, one live line, where to find us, every page, a certificate check, and the name. */
export async function Footer() {
  const { now, last, count } = await pulse();
  const live = !!last && isLive(last.pushed_at, now);
  return (
    <footer>
      {/* Paper dissolving into ink. */}
      <DitherEdge from="var(--bg)" to="var(--inv-bg)" />

      {/* Square corners for the form too; emerald is the footer's one accent. */}
      <div className="tone-inverse overflow-hidden pt-10 pb-3 [--radius-sm:0px] md:pt-14">
        <Container>
          <p className="t-mono flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-(--line) pb-3 text-[12px] text-(--fg-subtle)">
            {last ? (
              <a href={last.html_url} {...out} className={`inline-flex min-w-0 items-center gap-2 ${link}`}>
                <span aria-hidden className="relative inline-flex size-2 shrink-0">
                  {live && <span className="absolute inset-0 bg-(--accent-brand) motion-safe:animate-ping" />}
                  <span className="relative size-2 bg-(--accent-brand)" />
                </span>
                <span>
                  {count !== null && <>{count} commits this week · </>}
                  <span className="text-(--fg-muted)">{last.name}</span> updated {ago(last.pushed_at, now)}
                </span>
              </a>
            ) : (
              <span>Built in public</span>
            )}
            <span className="hidden sm:inline">since July 2024</span>
          </p>

          <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <h2 className="text-[clamp(3rem,1.6rem+6vw,7rem)] leading-[0.9] font-[800] tracking-[-0.02em] text-(--fg) [font-stretch:75%]">Build it with us.</h2>
              <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.55] text-pretty text-(--fg-muted)">
                Free, open-source tools made in public by developers, founders and creators. Pick a project; your first change can ship this week.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 [--accent-fg:var(--inv-fg)] [--accent-hover:color-mix(in_oklch,var(--accent-brand),black_22%)] [--accent:var(--accent-brand)] md:col-span-4 md:justify-end">
              <LabButton href="/contribute">
                Make your first contribution <ArrowRight />
              </LabButton>
              <LabButton href={social.discord.href} variant="secondary" {...out}>
                <Discord /> Join the Discord
              </LabButton>
            </div>
          </div>

          <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12 md:gap-6">
            <nav aria-label="Pages" className="md:col-span-5">
              <span className={label}>Pages</span>
              <ul>
                {pages.map((a) => (
                  <li key={a.href} className={row}>
                    <a href={a.href} className={`group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 text-(--fg-muted) ${link}`}>
                      <span className="text-[15px]">{a.label}</span>
                      <span className="t-mono text-[12px] text-(--fg-subtle) transition-colors duration-(--d-2) group-hover:text-(--fg-muted)">{a.hint}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="md:col-span-4">
              <span className={label}>Find us</span>
              <ul className="t-mono text-[13px]">
                {address.map((l) => (
                  <li key={l.href} className={`${row} grid grid-cols-[9ch_minmax(0,1fr)] gap-x-3`}>
                    <span className="text-(--fg-subtle)">{l.label}</span>
                    <a href={l.href} {...(l.href.startsWith("http") ? out : {})} className={`truncate text-(--fg-muted) ${link}`}>
                      {l.shown}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <span className={label}>Certificates</span>
              <VerifyForm />
              <a href="/contribute#values" className={`t-mono mt-6 inline-block text-[12px] text-(--fg-muted) ${link}`}>
                Code of conduct →
              </a>
            </div>
          </div>

          <div className="t-mono mt-16 flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-(--line) pt-4 text-[12px] text-(--fg-subtle)">
            <span>© {new Date().getFullYear()} Open Dev Society · free, open source</span>
            <a href={`${social.github.href}/opendevsociety`} {...out} className={link}>
              This site is open source <External />
            </a>
          </div>

          {/* The name, set as big as the page allows and printed in the dither. Decorative: the name is in the line above. */}
          <div aria-hidden className="group mt-10 grid select-none [container-type:inline-size] md:mt-14">
            {bands.map((b) => (
              <span key={b.clip} className={`${wordmark} ${b.clip} ${b.fill}`}>
                Open Dev Society
              </span>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
