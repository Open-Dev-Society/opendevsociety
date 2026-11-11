import QRCode from "qrcode";
import { certificateRoles, siteName, logo, type CertRoleKey } from "@/content";
import { roleLabel, signers } from "@/data/contributors";
import { cn } from "../cn";

export type CertificateData = {
  id: string;
  name: string;
  role: CertRoleKey;
  description: string;
  issuedOn: string;
  issuedBy: string;
  issuerHandle: string;
};

/** "2026.05.14" (how dates are stored) → "14 May 2026". Anything unparseable comes back as typed. */
export function formatDate(value: string) {
  const d = new Date(value.replace(/\./g, "-").slice(0, 10) + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

// Long names step down instead of being clipped: a certificate never drops part of someone's name.
// Pure cqw (no px floor), so the preview at any width matches the printed page.
const nameSize = (name: string) => (name.length <= 20 ? "6.4cqw" : name.length <= 30 ? "5.4cqw" : name.length <= 44 ? "4.4cqw" : "3.6cqw");

const hair = "border-[length:max(1px,0.08cqw)] border-(--line)";
const label = "font-mono text-[0.78cqw] leading-none tracking-[0.12em] uppercase text-(--fg-subtle)";

/** The issuer signs first; the other signer (founder or lead maintainer, src/data/contributors.ts) countersigns. */
function signatures(cert: CertificateData) {
  const handle = cert.issuerHandle.replace(/^@/, "").toLowerCase();
  const isIssuer = (s: (typeof signers)[number]) => s.login.toLowerCase() === handle || s.name === cert.issuedBy;
  const issuer = signers.find(isIssuer);
  return [
    { name: cert.issuedBy || "Issuer", title: issuer ? roleLabel(issuer.role) : "Issuer", handle: cert.issuerHandle },
    ...signers.filter((s) => !isIssuer(s)).map((s) => ({ name: s.name!, title: roleLabel(s.role), handle: `@${s.login}` })),
  ].slice(0, 2);
}

/** The verify link as SVG path data, one 1×1 square per dark module (no quiet zone; the plate around it is the margin). */
function qr(text: string) {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" });
  let d = "";
  for (let y = 0; y < modules.size; y++)
    for (let x = 0; x < modules.size; x++) if (modules.data[y * modules.size + x]) d += `M${x} ${y}h1v1h-1z`;
  return { size: modules.size, d };
}

// Guilloche band of the seal: six phase-shifted rosettes, as on banknotes. Computed once, rounded so server and client agree.
const ROSETTES = Array.from({ length: 6 }, (_, p) => {
  const pts = Array.from({ length: 361 }, (_, i) => {
    const t = (i / 360) * Math.PI * 2;
    const r = 77 + 6 * Math.sin(20 * t + (p * Math.PI) / 3) + 2.5 * Math.sin(5 * t);
    return `${(100 + r * Math.sin(t)).toFixed(1)} ${(100 - r * Math.cos(t)).toFixed(1)}`;
  });
  return `M${pts.join("L")}z`;
});

function Seal({ id, year, revoked }: { id: string; year: string; revoked: boolean }) {
  const text = `OPEN DEV SOCIETY · CERTIFIED · ${id} · `;
  const step = 360 / text.length;
  return (
    <div className={cn("relative aspect-square w-full", revoked ? "text-(--fg-subtle)" : "text-(--accent)")}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden>
        <circle cx="100" cy="100" r="98" fill="var(--surface)" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="100" cy="100" r="93.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
        {/* Every character placed by hand: no <textPath>, whose #id would point at the hidden original from the print clone. */}
        {[...text].map((ch, i) => (
          <text
            key={i}
            x="100"
            y="18.5"
            transform={`rotate(${(i * step).toFixed(2)} 100 100)`}
            textAnchor="middle"
            fill="currentColor"
            className="font-mono"
            style={{ fontSize: 8.6, fontWeight: 600 }}
          >
            {ch}
          </text>
        ))}
        <circle cx="100" cy="100" r="84.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
        {ROSETTES.map((d) => (
          <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth="0.45" opacity="0.8" />
        ))}
        <circle cx="100" cy="100" r="64" fill="var(--surface)" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1.2 2" />
        <text x="100" y="146" textAnchor="middle" fill="currentColor" className="font-mono" style={{ fontSize: 9, letterSpacing: "0.2em" }}>
          {year}
        </text>
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element -- must survive cloneNode into the print clone */}
      <img src={logo.src} alt="" className={cn("absolute top-[30%] left-[30%] size-[40%] object-contain", revoked && "grayscale")} />
    </div>
  );
}

/** Drawing-sheet zone marks in the band between the two frame lines: 1–8 across, A–F down. */
function Zones({ side }: { side: "top" | "bottom" | "left" | "right" }) {
  const across = side === "top" || side === "bottom";
  const marks = across ? ["1", "2", "3", "4", "5", "6", "7", "8"] : ["A", "B", "C", "D", "E", "F"];
  const pos = {
    top: "top-[2cqw] right-[3.3cqw] left-[3.3cqw] h-[1.3cqw]",
    bottom: "right-[3.3cqw] bottom-[2cqw] left-[3.3cqw] h-[1.3cqw]",
    left: "top-[3.3cqw] bottom-[3.3cqw] left-[2cqw] w-[1.3cqw] flex-col",
    right: "top-[3.3cqw] right-[2cqw] bottom-[3.3cqw] w-[1.3cqw] flex-col",
  }[side];
  return (
    <div aria-hidden className={cn("absolute flex", pos)}>
      {marks.map((m, i) => (
        <span
          key={m}
          className={cn(
            "flex flex-1 items-center justify-center font-mono text-[0.62cqw] leading-none text-(--fg-subtle)",
            i > 0 && (across ? "border-l-[length:max(1px,0.08cqw)]" : "border-t-[length:max(1px,0.08cqw)]"),
            "border-(--line)",
          )}
        >
          {m}
        </span>
      ))}
    </div>
  );
}

/**
 * The certificate (brief §12): one A4 landscape page, laid out like a drawing sheet with a title block.
 * Every inner size is in cqw, so the screen preview and the print clone (#cert-print-clone, 297×210mm)
 * lay out identically. Nothing is a <canvas> (it wouldn't survive cloneNode): the watermark is a frozen
 * Turing field (public/cert-field.svg, scripts/cert-field.mjs), the seal and QR are inline SVG.
 * Read-only; /certificate edits it through its form. `revokedOn` stamps it, so a printout can't pass as valid.
 */
export function CertificateDocument({
  cert,
  verifyHost,
  revokedOn,
  className,
}: {
  cert: CertificateData;
  /** the site's domain, e.g. "opendevsociety.vercel.app" */
  verifyHost: string;
  revokedOn?: string;
  className?: string;
}) {
  const role = certificateRoles[cert.role];
  const revoked = revokedOn !== undefined;
  const verifyPath = `${verifyHost}/verify/${cert.id}`;
  const code = qr(`${/^(localhost|127\.)/.test(verifyHost) ? "http" : "https"}://${verifyPath}`);
  const year = /^\d{4}/.test(cert.issuedOn) ? cert.issuedOn.slice(0, 4) : "";

  return (
    <div
      className={cn("cert-document relative overflow-hidden bg-(--surface) text-(--fg) font-(family-name:--font-sans)", className)}
      style={{ aspectRatio: "297 / 210", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      {/* Watermark: the hero's reaction–diffusion field in 1-bit pale emerald, dissolving behind the words (fade and tint baked in). */}
      {/* eslint-disable-next-line @next/next/no-img-element -- must survive cloneNode into the print clone */}
      <img
        src="/cert-field.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-[3.3cqw] h-[calc(100%-6.6cqw)] w-[calc(100%-6.6cqw)]"
      />

      {/* Frame: a heavy ink outer line, a zone band, and a hairline inner line, as on a drawing sheet. */}
      <div aria-hidden className="pointer-events-none absolute inset-[2cqw] border-[length:0.16cqw] border-(--fg)" />
      <div aria-hidden className={cn("pointer-events-none absolute inset-[3.3cqw]", hair)} />
      <Zones side="top" />
      <Zones side="bottom" />
      <Zones side="left" />
      <Zones side="right" />

      {/* Corner plate, as in the hero: solid emerald, flush in the inner corner. */}
      <div
        className={cn(
          "absolute top-[3.3cqw] right-[3.3cqw] flex flex-col gap-[0.35cqw] px-[1.3cqw] py-[0.9cqw] font-mono leading-none",
          revoked ? "bg-(--fg) text-(--surface)" : "bg-(--accent) text-(--accent-fg)",
        )}
      >
        <span className="text-[0.72cqw] tracking-[0.14em] uppercase opacity-80">Certificate no.</span>
        <span className="text-[1.15cqw] tabular-nums">{cert.id}</span>
      </div>

      <div className="absolute inset-[3.3cqw] flex flex-col px-[4.2cqw] pt-[3.4cqw] pb-[3cqw]">
        <div className="flex items-center gap-[1cqw]">
          {/* eslint-disable-next-line @next/next/no-img-element -- must survive cloneNode into the print clone */}
          <img src={logo.src} alt="" className="size-[3.2cqw] object-contain" />
          <div>
            <div className="text-[1.45cqw] leading-none font-semibold tracking-[-0.01em]" style={{ fontVariationSettings: '"wdth" 108' }}>
              {siteName}
            </div>
            <div className={cn(label, "mt-[0.45cqw]")}>Free, open-source software, built in public</div>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center gap-[3cqw]">
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[0.95cqw] leading-none tracking-[0.32em] text-(--accent) uppercase">Certificate of</div>
            <h2 className="mt-[0.5cqw] text-[4.6cqw] leading-[0.9] font-[800] tracking-[-0.01em] uppercase [font-stretch:75%]">{role.mono}</h2>

            <p className="mt-[2.4cqw] font-(family-name:--font-sign) text-[1.75cqw] leading-none text-(--fg-muted) italic">This certifies that</p>
            <p
              className="mt-[0.6cqw] line-clamp-2 border-b-[length:max(1px,0.08cqw)] border-(--fg)/25 pb-[0.5cqw] font-(family-name:--font-sign) leading-[1.08] tracking-[-0.015em] text-balance italic"
              style={{ fontSize: nameSize(cert.name), fontVariationSettings: '"opsz" 72' }}
            >
              {cert.name || "Recipient name"}
            </p>

            <div className="mt-[1.5cqw] flex items-center gap-[0.8cqw]">
              <span className={label}>Recognised as</span>
              <span className="bg-(--accent-soft) px-[0.8cqw] py-[0.4cqw] font-mono text-[0.95cqw] leading-none tracking-[0.06em] text-(--accent-hover) uppercase">
                {role.label}
              </span>
            </div>
            <p className="mt-[1.2cqw] line-clamp-4 max-w-[54ch] text-[1.32cqw] leading-[1.5] text-pretty text-(--fg-muted)">{cert.description}</p>
          </div>

          <div className="w-[16cqw] shrink-0 self-center">
            <Seal id={cert.id} year={year} revoked={revoked} />
          </div>
        </div>

        {/* Signatures, then the title block: who signed, when, and how to check it. */}
        <div className="grid grid-cols-[1fr_1fr_1.35fr] items-end gap-[2.6cqw]">
          {signatures(cert).map((s) => (
            <div key={s.name}>
              <div className="signature truncate border-b-[length:max(1px,0.1cqw)] border-(--fg) pb-[0.2cqw] text-[3.3cqw] text-(--fg)">{s.name}</div>
              <div className="mt-[0.6cqw] text-[1.05cqw] leading-tight font-semibold">{s.name}</div>
              <div className="mt-[0.25cqw] text-[0.95cqw] leading-tight text-(--fg-muted)">
                {s.title}, {siteName}
              </div>
            </div>
          ))}

          <div className={cn("flex bg-(--surface)", hair, "border-(--fg)/30")}>
            <dl className="grid min-w-0 flex-1 grid-cols-2">
              <div className={cn("px-[0.9cqw] py-[0.7cqw]", "border-r-[length:max(1px,0.08cqw)] border-b-[length:max(1px,0.08cqw)] border-(--line)")}>
                <dt className={label}>Issued</dt>
                <dd className="mt-[0.45cqw] font-mono text-[1cqw] leading-none tabular-nums">{formatDate(cert.issuedOn)}</dd>
              </div>
              <div className="border-b-[length:max(1px,0.08cqw)] border-(--line) px-[0.9cqw] py-[0.7cqw]">
                <dt className={label}>Issued by</dt>
                <dd className="mt-[0.45cqw] truncate font-mono text-[1cqw] leading-none">{cert.issuerHandle}</dd>
              </div>
              <div className="col-span-2 px-[0.9cqw] py-[0.7cqw]">
                <dt className={label}>Verify at</dt>
                <dd className="mt-[0.45cqw] font-mono text-[0.92cqw] leading-tight break-all text-(--accent)">{verifyPath}</dd>
              </div>
            </dl>
            <div className="border-l-[length:max(1px,0.08cqw)] border-(--line) p-[0.7cqw]">
              <svg
                viewBox={`0 0 ${code.size} ${code.size}`}
                className="block size-[7cqw] text-(--fg)"
                shapeRendering="crispEdges"
                role="img"
                aria-label={`QR code for ${verifyPath}`}
              >
                <path d={code.d} fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {revoked && (
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="-rotate-[12deg] border-[length:0.5cqw] border-(--fg) px-[2.6cqw] py-[1.2cqw] text-center text-(--fg) opacity-85 mix-blend-multiply shadow-[inset_0_0_0_0.25cqw_var(--surface),inset_0_0_0_0.45cqw_var(--fg)]">
            <div className="text-[9cqw] leading-[0.85] font-[800] tracking-[0.04em] uppercase [font-stretch:75%]">Revoked</div>
            <div className="mt-[0.8cqw] font-mono text-[1.1cqw] tracking-[0.16em] uppercase">{formatDate(revokedOn)} · No longer valid</div>
          </div>
        </div>
      )}
    </div>
  );
}
