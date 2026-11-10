import { mentions } from "@/data/mentions";
import { partners } from "@/data/partners";
import { LabButton } from "../lab-hero/LabButton";
import { Container } from "../Section";
import { Rotator } from "./live";
import { band, display, ext, focus, label } from "./ui";

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

// Short press lines (the stack is as tall as the longest), cleaned of the quote marks they are stored with.
const quotes = mentions
  .filter((m) => m.highlight && m.source === "article" && m.highlight.length < 140)
  .map((m) => ({
    text: m.highlight!.replace(/^["“]|["”]$/g, ""),
    who: m.author.split(/ (?:at|via) /)[0],
    where: m.author.split(/ (?:at|via) /)[1] ?? "",
    url: m.url,
  }));

/** 06 · paper: the pitch to founders, a rotating press quote and the partners. */
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
                      {q.where && <>, {q.where}</>} ↗
                    </a>
                  </footer>
                </blockquote>
              ))}
            </Rotator>
          </figure>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className={label}>Partners</p>
            <ul className="mt-3 grid grid-cols-3 border-t border-l border-(--line)">
              {partners
                .filter((p) => p.logo)
                .map((p) => (
                  <li key={p.name} className="border-r border-b border-(--line)">
                    <a
                      href={p.url}
                      {...ext}
                      aria-label={p.name}
                      title={p.name}
                      className={`flex h-16 items-center justify-center px-3 hover:bg-(--surface-2) ${focus}`}
                    >
                      <span
                        aria-hidden
                        className="block h-6 w-full bg-(--fg)"
                        style={{
                          maskImage: `url(${p.logo})`,
                          WebkitMaskImage: `url(${p.logo})`,
                          maskSize: "contain",
                          WebkitMaskSize: "contain",
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskPosition: "center",
                        }}
                      />
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 flex flex-wrap gap-3 md:mt-12">
          <LabButton href="/contribute">Bring your project →</LabButton>
          <LabButton href="/manifesto" variant="secondary">
            Read the manifesto
          </LabButton>
        </p>
      </Container>
    </section>
  );
}
