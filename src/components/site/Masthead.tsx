import { manualContributors } from "@/data/contributors";
import { cn } from "./cn";

type Person = (typeof manualContributors)[number];
const by = (re: RegExp) => manualContributors.filter((c) => c.role && re.test(c.role));

function Signed({ people }: { people: Person[] }) {
  return people.map((c, i) => (
    <span key={c.login}>
      {i > 0 && (i === people.length - 1 ? " and " : ", ")}
      <a href={c.html_url} target="_blank" rel="noopener noreferrer" className="sign text-(--fg) transition-colors duration-(--d-2) hover:text-(--accent)">
        {c.name}
      </a>
    </span>
  ));
}

/** One line naming the core crew, names signed (brief §10 §3). Faces appear once, on the wall; names live here. */
export function Masthead({ className }: { className?: string }) {
  return (
    <p className={cn("text-sm text-(--fg-muted)", className)}>
      Founded by <Signed people={by(/^(?!.*Co-Founder).*Founder/i)} />. Co-founded by <Signed people={by(/Co-Founder/i)} />. Maintained with{" "}
      <Signed people={by(/Maintainer/i)} />.
    </p>
  );
}
