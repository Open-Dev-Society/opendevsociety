import { contactEmail, social } from "@/content";
import { VerifyForm } from "./Field";
import { ScaleBar } from "./lab/Rails";
import { DitherEdge } from "./lab/DitherEdge";
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

const link = "transition-colors duration-(--d-2) hover:text-(--fg)";
const cell = "bg-(--bg) p-5 md:p-6";
const label = "t-mono mb-4 block text-[11px] tracking-[0.08em] text-(--fg-subtle) uppercase";

/** The footer on every (site) page: what it's set in, where to find us, every page, and a certificate check. */
export function Footer() {
  return (
    <footer>
      {/* Paper dissolving into ink. */}
      <DitherEdge from="var(--bg)" to="var(--inv-bg)" />

      <div className="tone-inverse pt-10 pb-8 md:pt-14">
        <Container>
          <p className="t-mono flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-(--line) pb-3 text-[12px] text-(--fg-subtle)">
            <span>
              <span className="text-(--fg)">Open Dev Society</span>
            </span>
            <span>since July 2024</span>
          </p>

          {/* Each typeface named in itself, as a specimen sheet would. */}
          <p className="mt-8 max-w-[22ch] text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-[0.98] font-[800] tracking-[-0.015em] text-balance text-(--fg) [font-stretch:75%] md:mt-12">
            Set in Mona Sans &amp; <span className="font-mono text-[0.82em] font-[500] tracking-[-0.04em] whitespace-nowrap [font-stretch:100%]">Geist Mono</span>.{" "}
            <span className="text-(--fg-muted)">Dithered <span className="whitespace-nowrap">in-browser.</span> Built in public.</span>
          </p>

          <div className="mt-10 grid gap-px bg-(--line) shadow-[0_0_0_1px_var(--line)] md:mt-14 md:grid-cols-12">
            <div className={`${cell} md:col-span-4`}>
              <span className={label}>Find us</span>
              <ul className="t-mono space-y-1 text-[13px]">
                {address.map((l) => (
                  <li key={l.href} className="grid grid-cols-[9ch_minmax(0,1fr)] gap-x-3">
                    <span className="text-(--fg-subtle)">{l.label}</span>
                    <a href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`truncate text-(--fg-muted) ${link}`}>
                      {l.shown}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-label="Pages" className={`${cell} md:col-span-4`}>
              <span className={label}>Pages</span>
              <ul className="space-y-1">
                {pages.map((a) => (
                  <li key={a.href}>
                    <a href={a.href} className={`group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 text-(--fg-muted) ${link}`}>
                      <span className="text-[15px]">{a.label}</span>
                      <span className="t-mono text-[12px] text-(--fg-subtle) group-hover:text-(--accent)">{a.hint}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={`${cell} md:col-span-4`}>
              <span className={label}>Verify a certificate</span>
              <VerifyForm />
              <a href="/contribute#values" className={`t-mono mt-4 inline-block text-[12px] text-(--fg-muted) ${link}`}>
                Code of conduct →
              </a>
            </div>
          </div>

          <div className="t-mono mt-6 flex flex-wrap justify-between gap-x-6 gap-y-1 text-[12px] text-(--fg-subtle)">
            <span>© {new Date().getFullYear()} Open Dev Society · free, open source</span>
            <ScaleBar className="hidden md:flex" />
            <a href={`${social.github.href}/opendevsociety`} target="_blank" rel="noopener noreferrer" className={link}>
              This site is open source ↗
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
