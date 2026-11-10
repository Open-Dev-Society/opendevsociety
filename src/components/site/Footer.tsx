import { social } from "@/content";
import { Button } from "./Button";
import { CopyCommand } from "./CopyCommand";
import { VerifyForm } from "./Field";
import { Container } from "./Section";

export const FORK_COMMAND = "gh repo fork Open-Dev-Society/OpenStock --clone";

const society = [
  { label: "Work", href: "/projects" },
  { label: "People", href: "/contributors" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "Word of mouth", href: "/word-of-mouth" },
  { label: "Contribute", href: "/contribute" },
];
const elsewhere = [social.github, social.discord, social.linkedin, { ...social.twitter, label: "X" }, social.email];

const link = "text-[15px] text-(--fg-muted) transition-colors duration-(--d-2) hover:text-(--fg)";

/** The closing statement on every non-tool page (brief §10 §6): the manifesto line, the actions, the columns. */
export function Footer() {
  return (
    <footer className="tone-inverse py-(--section-y)">
      <Container>
        <p className="display-1 max-w-[14ch] text-[calc(0.85*clamp(2.75rem,1.5rem+4.4vw,5.25rem))] text-(--fg)">
          Technology should belong to <span className="sign text-(--accent)">everyone.</span>
        </p>
        <p className="t-lede mt-6 max-w-[52ch] text-(--fg-muted)">
          So we give ours away. We will never lock knowledge, charge for access, or trade trust for money.{" "}
          <a href="/manifesto" className="ink-link whitespace-nowrap">
            Read the manifesto →
          </a>
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button href="/contribute" size="lg" icon="arrow">
            Make your first PR
          </Button>
          <Button href={social.discord.href} size="lg" variant="secondary" external>
            Join the Discord
          </Button>
          <CopyCommand command={FORK_COMMAND} className="sm:w-[22rem]" />
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-(--grid-gap) gap-y-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="t-meta text-(--fg-subtle)">Society</p>
            <ul className="mt-4 space-y-2">
              {society.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="t-meta text-(--fg-subtle)">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              {elsewhere.map((l) => (
                <li key={l.href}>
                  <a href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-4 md:col-start-9">
            <p className="t-meta text-(--fg-subtle)">Credentials</p>
            <div className="mt-4">
              <VerifyForm />
            </div>
            <a href="/contribute#values" className={`${link} mt-4 inline-block`}>
              Code of conduct
            </a>
          </div>
        </div>

        <p className="t-meta mt-16 border-t border-(--line) pt-6 text-(--fg-subtle)">
          © {new Date().getFullYear()} Open Dev Society · Founded July 2024 ·{" "}
          <a href={`${social.github.href}/opendevsociety`} target="_blank" rel="noopener noreferrer" className="hover:text-(--fg)">
            This site is open source too ↗
          </a>
        </p>
      </Container>
    </footer>
  );
}
