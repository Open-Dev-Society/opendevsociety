import { Container } from "@/components/site";
import { Rails, ScaleBar } from "@/components/site/lab/Rails";

// Temporary bench for Rails (deleted once it's wired into the layout).
const bands = [
  { name: "Intro", tone: "", h: 900 },
  { name: "Projects", tone: "tone-emerald", h: 1400 },
  { name: "Contributors", tone: "tone-inverse", h: 1200 },
  { name: "Manifesto", tone: "", h: 1100 },
  { name: "Contribute", tone: "tone-muted", h: 800 },
];

export default function RailsBench() {
  return (
    <>
      <Rails />
      {bands.map((b) => (
        <section key={b.name} data-grid={b.name} className={`${b.tone} py-24`} style={{ minHeight: b.h }}>
          <Container>
            <h2 className="display-2 text-5xl font-extrabold">{b.name}</h2>
            <p className="mt-6 max-w-[65ch] text-lg text-(--fg-muted)">
              A long band to scroll past. The rails should stay legible on paper, emerald and ink, and the content column should never sit
              under them.
            </p>
            <div className="mt-10 h-64 w-full bg-(--surface-2) shadow-[0_0_0_1px_var(--line)]" />
          </Container>
        </section>
      ))}
      <section className="tone-inverse py-16">
        <Container>
          <ScaleBar />
        </Container>
      </section>
    </>
  );
}
