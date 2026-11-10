import Link from "next/link";
import { sizedAvatar } from "@/components/site/Avatar";
import { Dither } from "@/components/site/lab/Dither";
import { Plate } from "@/components/site/lab/Plate";

export type Researcher = {
  rid: string;
  login: string;
  name?: string;
  avatar: string;
  url: string;
  role?: string;
  joined?: string;
  exps: { id: string; href: string }[];
  contributions: number;
};

const SHOW_EXPS = 3;
const month = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }) : "—");

// A head and shoulders, dithered rose on the vacant badge.
export const SILHOUETTE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 120 120"><defs><linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="#555"/><stop offset="1" stop-color="#d8d8d8"/></linearGradient></defs><rect width="120" height="120" fill="#fff"/><g fill="url(#g)"><circle cx="60" cy="46" r="22"/><path d="M14 120c4-30 22-44 46-44s42 14 46 44z"/></g></svg>',
)}`;

function Photo({ src, alt, mark }: { src: string; alt: string; mark?: boolean }) {
  return mark ? (
    // The one motion on the page: the vacant photo rests coarse and develops while you hover the badge.
    <Dither src={src} alt={alt} width={1} height={1} variant="mark" tone="duotone" develop className="w-full" />
  ) : (
    <Dither src={sizedAvatar(src, 64)} alt={alt} width={1} height={1} tone="duotone" className="w-full" />
  );
}

const Frame = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  // The lanyard slot reads "ID badge" without a rounded card.
  <div className={`relative grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 p-4 pt-6 sm:grid-cols-[7rem_minmax(0,1fr)] ${className}`}>
    <span aria-hidden className="absolute top-2 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-full shadow-[inset_0_0_0_1px_var(--line)]" />
    {children}
  </div>
);

function Field({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-2">
      <dt className="text-(--fg-subtle)">{k}</dt>
      <dd className="min-w-0 text-(--fg)">{children}</dd>
    </div>
  );
}

export function Badge({ r }: { r: Researcher }) {
  const more = r.exps.length - SHOW_EXPS;
  return (
    <Frame>
      <div>
        <Photo src={r.avatar} alt={`${r.name ?? r.login}, GitHub avatar`} />
        {r.role && (
          <Plate tone="accent" className="mt-2 flex justify-center text-[10px] tracking-[0.08em] uppercase">
            {r.role}
          </Plate>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[2.25rem] leading-[0.85] font-[800] tracking-[-0.01em] text-(--fg) tabular-nums [font-stretch:75%]">{r.rid}</p>
        <p className="mt-2 truncate text-[1.3rem] leading-tight">
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="sign text-(--fg) transition-colors duration-(--d-2) hover:text-(--accent)">
            {r.name ?? r.login}
          </a>
        </p>
        <p className="t-mono truncate text-[12px] text-(--fg-muted)">@{r.login}</p>
        <dl className="t-mono mt-3 space-y-0.5 border-t border-(--line) pt-2 text-[11px] leading-[1.6]">
          <Field k="JOINED">{month(r.joined)}</Field>
          <Field k="EXP">
            {r.exps.length === 0
              ? "—"
              : r.exps.slice(0, SHOW_EXPS).map((e, i) => (
                  <span key={e.id}>
                    {i > 0 && " "}
                    <Link href={e.href} className="text-(--accent) underline-offset-2 hover:underline">
                      {e.id}
                    </Link>
                  </span>
                ))}
            {more > 0 && <span className="text-(--fg-subtle)"> +{more}</span>}
          </Field>
          <Field k="CONTRIB">{r.contributions.toLocaleString("en-US")}</Field>
        </dl>
      </div>
    </Frame>
  );
}

/** R-next: the only rose on the page. */
export function Vacancy({ rid }: { rid: string }) {
  return (
    <Link href="/contribute" className="group block bg-(--mark-soft)/40 transition-colors duration-(--d-2) hover:bg-(--mark-soft) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--focus)">
      <Frame>
        <div>
          <Photo src={SILHOUETTE} alt="Empty photo: this badge has not been issued" mark />
          <Plate tone="mark" className="mt-2 flex justify-center text-[10px] tracking-[0.08em] uppercase">
            Vacant
          </Plate>
        </div>
        <div className="min-w-0 text-(--mark-ink)">
          <p className="text-[2.25rem] leading-[0.85] font-[800] tracking-[-0.01em] tabular-nums [font-stretch:75%]">{rid}</p>
          <p className="sign mt-2 text-[1.3rem] leading-tight">you</p>
          <p className="t-mono text-[12px]">not yet on file</p>
          <dl className="t-mono mt-3 space-y-0.5 border-t border-(--mark)/30 pt-2 text-[11px] leading-[1.6]">
            <div className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-2">
              <dt className="opacity-75">JOINED</dt>
              <dd>your first PR</dd>
            </div>
            <div className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-2">
              <dt className="opacity-75">VIA</dt>
              <dd className="group-hover:underline">Protocol 01 →</dd>
            </div>
          </dl>
        </div>
      </Frame>
    </Link>
  );
}
