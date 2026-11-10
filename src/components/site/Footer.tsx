import { contactEmail, social } from "@/content";
import { VerifyForm } from "./Field";
import { DitherEdge } from "./lab/DitherEdge";
import { Container } from "./Section";

export const FORK_COMMAND = "gh repo fork Open-Dev-Society/OpenStock --clone";

// Each section by the artefact it is and the numbering it uses (docs/lab.md).
const artefacts = [
  { code: "EXP-001…", label: "Experiments", href: "/projects" },
  { code: "R-01…", label: "Researchers", href: "/contributors" },
  { code: "ODS-WP-001", label: "Working paper", href: "/manifesto" },
  { code: "PROTOCOL 01", label: "Protocol", href: "/contribute" },
  { code: "[1]…", label: "Citations", href: "/word-of-mouth" },
];
const address = [social.github, social.discord, social.linkedin, { ...social.twitter, label: "X" }, social.email].map((l) => ({
  ...l,
  shown: l.href.startsWith("mailto:") ? contactEmail : l.href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
}));

const link = "transition-colors duration-(--d-2) hover:text-(--fg)";
const cell = "bg-(--bg) p-5 md:p-6";
const label = "t-mono mb-4 block text-[11px] tracking-[0.08em] text-(--fg-subtle) uppercase";

/** The colophon on every (site) page: what it's set in, where the lab is, what it publishes, and a certificate check. */
export function Footer() {
  return (
    <footer>
      {/* Paper dissolving into ink. */}
      <DitherEdge from="var(--bg)" to="var(--inv-bg)" />

      <div className="tone-inverse pt-10 pb-8 md:pt-14">
        <Container>
          <p className="t-mono flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-(--line) pb-3 text-[12px] text-(--fg-subtle)">
            <span>
              <span className="text-(--fg)">Colophon</span> · ODS·LAB
            </span>
            <span>Open Dev Society · est. July 2024</span>
          </p>

          {/* Each typeface named in itself, as a specimen sheet would. */}
          <p className="mt-8 max-w-[22ch] text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-[0.98] font-[800] tracking-[-0.015em] text-balance text-(--fg) [font-stretch:75%] md:mt-12">
            Set in Mona Sans &amp; <span className="font-mono text-[0.82em] font-[500] tracking-[-0.04em] whitespace-nowrap [font-stretch:100%]">Geist Mono</span>.{" "}
            <span className="text-(--fg-muted)">Dithered <span className="whitespace-nowrap">in-browser.</span> Built in public.</span>
          </p>

          <div className="mt-10 grid gap-px bg-(--line) shadow-[0_0_0_1px_var(--line)] md:mt-14 md:grid-cols-12">
            <div className={`${cell} md:col-span-4`}>
              <span className={label}>Lab address</span>
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

            <nav aria-label="Artefacts" className={`${cell} md:col-span-4`}>
              <span className={label}>Artefacts</span>
              <ul className="space-y-1">
                {artefacts.map((a) => (
                  <li key={a.href}>
                    <a href={a.href} className={`group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 text-(--fg-muted) ${link}`}>
                      <span className="text-[15px]">{a.label}</span>
                      <span className="t-mono text-[12px] text-(--fg-subtle) group-hover:text-(--accent)">{a.code}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={`${cell} md:col-span-4`}>
              <span className={label}>Credentials</span>
              <VerifyForm />
              <a href="/contribute#values" className={`t-mono mt-4 inline-block text-[12px] text-(--fg-muted) ${link}`}>
                Safety notes: code of conduct →
              </a>
            </div>
          </div>

          <p className="t-mono mt-6 flex flex-wrap justify-between gap-x-6 gap-y-1 text-[12px] text-(--fg-subtle)">
            <span>© {new Date().getFullYear()} Open Dev Society · free, open source</span>
            <a href={`${social.github.href}/opendevsociety`} target="_blank" rel="noopener noreferrer" className={link}>
              This site is open source ↗
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
