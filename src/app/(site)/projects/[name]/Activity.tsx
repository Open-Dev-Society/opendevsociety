import { labDate } from "@/lib/lab";

const CHECKER = "bg-[repeating-conic-gradient(var(--accent-brand)_0_25%,transparent_0_50%)] bg-size-[2px_2px]";

/** A year of commits, one 1-bit bar per week (oldest left). The busiest week prints solid. */
export function Activity({ weeks }: { weeks: { week: string; commits: number }[] }) {
  const max = Math.max(...weeks.map((w) => w.commits));
  const peak = max > 0 ? weeks.findIndex((w) => w.commits === max) : -1;
  const total = weeks.reduce((n, w) => n + w.commits, 0);
  return (
    <figure>
      <div
        role="img"
        aria-label={peak < 0 ? "No commits in the last 52 weeks." : `${total} commits in the last 52 weeks; the busiest week, ${labDate(weeks[peak].week)}, had ${max}.`}
        className="grid h-40 grid-cols-[repeat(52,minmax(0,1fr))] items-end gap-px border-b border-(--fg) md:h-56"
      >
        {weeks.map((w, i) => (
          <span
            key={w.week}
            title={`Week of ${labDate(w.week)}: ${w.commits} commit${w.commits === 1 ? "" : "s"}`}
            className={`block min-h-px ${i === peak ? "bg-(--accent-brand)" : w.commits ? CHECKER : "bg-(--line)"}`}
            style={{ height: `${(w.commits / Math.max(1, max)) * 100}%` }}
          />
        ))}
      </div>
      <figcaption className="t-mono mt-2 flex justify-between gap-4 text-[11px] text-(--fg-subtle)">
        <span>{labDate(weeks[0].week)}</span>
        <span className="hidden text-(--fg-muted) sm:inline">
          {peak < 0 ? "no commits this year" : `busiest: ${max} in the week of ${labDate(weeks[peak].week)}`}
        </span>
        <span>this week</span>
      </figcaption>
    </figure>
  );
}
