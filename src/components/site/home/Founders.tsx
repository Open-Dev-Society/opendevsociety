import { mentions } from "@/data/mentions";
import Link from "next/link";
import { activePartners } from "@/data/partners";
import { PartnerLogo } from "../PartnerLogo";
import { LabButton } from "../lab-hero/LabButton";
import { Container } from "../Section";
import { Rotator } from "./live";
import { band, display, ext, focus, label } from "./ui";
import { ArrowRight, External } from "../Icon";

const promises = [
  {
    title: "Ownership stays yours.",
    body: "You stay the owner and the lead maintainer. Your license, your name on it.",
  },
  {
    title: "You get contributors.",
    body: "Developers, designers and writers who pick up issues and ship.",
  },
  {
    title: "Visibility and review.",
    body: "Listed on this site, shared with the community, reviewed in public.",
  },
];

// Every outside quote about us (not our own posts), short enough for the stack (it is as tall as the longest),
// cleaned of the quote marks they are stored with.
const quotes = mentions
  // English lines only on Home (the full list, in every language, is on What people say).
  .filter((m) => m.highlight && m.highlight.length <= 240 && !m.author.startsWith("Ravi Pratap Singh") && !/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(m.highlight))
  .map((m) => ({
    text: m.highlight!.replace(/^["“]|["”]$/g, "").replace(/'/g, "’"),
    who: m.author.split(/ (?:at|via) /)[0],
    where: m.author.split(/ (?:at|via) /)[1] ?? "",
    url: m.url,
  }));

/** 06 · paper: the pitch to founders, a rotating press quote and the active sponsors and partners. */
export function Founders() {
  return (
    <section id="signal" aria-labelledby="founders-h" data-grid="For founders" className={`scroll-mt-16 border-t border-(--line) ${band}`}>
      <Container>
        <p className={label}>For founders</p>
        <h2 id="founders-h" className={`${display} mt-3 text-[clamp(2.75rem,1.4rem+5.4vw,7rem)]`}>
          Bring your project. Keep the credit.
        </h2>

        <ol className="mt-10 grid border-t border-(--fg) md:mt-14 md:grid-cols-3">
          {promises.map((p) => (
            <li key={p.title} className="border-b border-(--line) py-5 md:border-r md:border-b-0 md:px-5 md:first:pl-0 md:last:border-r-0">
              <p className="text-[20px] leading-tight font-[700] text-(--fg)">{p.title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-(--fg-muted)">{p.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
          <figure className="lg:col-span-7">
            <Rotator label="What the press says">
              {quotes.map((q) => (
                <blockquote key={q.url}>
                  <p className="text-[clamp(1.375rem,1.1rem+1.2vw,2rem)] leading-[1.15] font-[650] tracking-[-0.01em] text-balance text-(--fg)">
                    “{q.text}”
                  </p>
                  <footer className="t-mono mt-3 text-[12px] text-(--fg-muted)">
                    <a href={q.url} {...ext} className={`underline-offset-4 hover:underline ${focus}`}>
                      <span className="sign text-[16px] text-(--fg)">{q.who}</span>
                      {q.where && <>, {q.where}</>} <External size="1em" />
                    </a>
                  </footer>
                </blockquote>
              ))}
            </Rotator>
          </figure>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className={label}>Sponsors and partners</p>
            <ul className={`mt-3 grid border-t border-l border-(--line) ${activePartners.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {activePartners.map((p) => (
                <li key={p.name} className="border-r border-b border-(--line)">
                  <a
                    href={p.url}
                    {...ext}
                    aria-label={`${p.name} (opens in a new tab)`}
                    className={`flex h-16 items-center justify-center px-3 text-(--fg) hover:bg-(--surface-2) hover:text-(--accent) ${focus}`}
                  >
                    <PartnerLogo p={p} position="center" className="h-6 w-full text-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/word-of-mouth#partners" className={`t-mono mt-3 inline-block text-[12px] text-(--fg-muted) hover:text-(--accent) ${focus}`}>
              + past sponsors →
            </Link>
          </div>
        </div>

        <p className="mt-10 flex flex-wrap gap-3 md:mt-12">
          <LabButton href="/contribute">
            Bring your project <ArrowRight size="1em" />
          </LabButton>
          <LabButton href="/manifesto" variant="secondary">
            Read the manifesto
          </LabButton>
        </p>
      </Container>
    </section>
  );
}
