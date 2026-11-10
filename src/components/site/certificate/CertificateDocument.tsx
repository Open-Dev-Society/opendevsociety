import { certificateRoles, siteName, logo, type CertRoleKey } from "@/content";
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
const nameSize = (name: string) => (name.length <= 22 ? "6.6cqw" : name.length <= 32 ? "5.6cqw" : name.length <= 44 ? "4.8cqw" : "4cqw");

const tick = "absolute size-[1.6cqw] border-(--accent)";

/**
 * The certificate (brief §12): one A4 landscape page. Every inner size is in cqw, so the screen
 * preview and the print clone (#cert-print-clone, 297×210mm) lay out identically. Read-only;
 * /certificate edits it through its form. `revokedOn` marks a revoked copy, so a printout can't pass as valid.
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
  return (
    <div
      className={cn("cert-document relative overflow-hidden bg-(--surface) text-(--fg) font-(family-name:--font-sans)", className)}
      style={{ aspectRatio: "297 / 210", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      {/* Frame: one hairline at 3.2%, with ink corner ticks */}
      <div aria-hidden className="pointer-events-none absolute inset-[3.2cqw] border-[length:max(1px,0.08cqw)] border-(--line)">
        <span className={cn(tick, "-top-px -left-px border-t-[0.18cqw] border-l-[0.18cqw]")} />
        <span className={cn(tick, "-top-px -right-px border-t-[0.18cqw] border-r-[0.18cqw]")} />
        <span className={cn(tick, "-bottom-px -left-px border-b-[0.18cqw] border-l-[0.18cqw]")} />
        <span className={cn(tick, "-right-px -bottom-px border-r-[0.18cqw] border-b-[0.18cqw]")} />
      </div>

      <div className="absolute inset-[3.2cqw] flex flex-col px-[4.4cqw] py-[3.6cqw]">
        <div className="flex items-start justify-between gap-[2cqw]">
          <div className="flex items-center gap-[1cqw]">
            {/* eslint-disable-next-line @next/next/no-img-element -- must survive cloneNode into the print clone */}
            <img src={logo.src} alt="" className="size-[3.4cqw] object-contain" />
            <span className="text-[1.4cqw] font-semibold tracking-[-0.01em]" style={{ fontVariationSettings: '"wdth" 108' }}>
              {siteName}
            </span>
          </div>
          <div className="text-right">
            <div className="text-[0.95cqw] font-medium text-(--fg-subtle)">Certificate</div>
            <div className="mt-[0.2cqw] font-mono text-[1.1cqw] tabular-nums">{cert.id}</div>
            {revokedOn && <div className="mt-[0.3cqw] text-[0.95cqw] font-medium text-(--fg-muted)">Revoked {formatDate(revokedOn)}</div>}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <p className="text-[1.7cqw] text-(--fg-muted)">This certifies that</p>
          <p
            className="mt-[0.8cqw] line-clamp-2 font-(family-name:--font-sign) leading-[1.04] tracking-[-0.015em] text-balance italic"
            style={{ fontSize: nameSize(cert.name), fontVariationSettings: '"opsz" 72' }}
          >
            {cert.name || "Recipient name"}
          </p>
          <span className="mt-[1.6cqw] self-start rounded-[0.5cqw] bg-(--accent-soft) px-[0.9cqw] py-[0.35cqw] text-[1.1cqw] font-semibold text-(--accent-hover)">
            {role.label}
          </span>
          <p className="mt-[1.6cqw] max-w-[60ch] text-[1.4cqw] leading-[1.55] text-pretty text-(--fg-muted)">{cert.description}</p>
        </div>

        <div className="grid grid-cols-3 items-end gap-[2cqw] border-t-[length:max(1px,0.08cqw)] border-(--line) pt-[1.6cqw]">
          <div>
            <div className="text-[0.95cqw] font-medium text-(--fg-subtle)">Issued</div>
            <div className="mt-[0.3cqw] font-mono text-[1.2cqw] tabular-nums">{cert.issuedOn}</div>
          </div>
          <div className="text-center">
            <div className="text-[0.95cqw] font-medium text-(--fg-subtle)">Verify at</div>
            <div className="mt-[0.3cqw] font-mono text-[1cqw] break-all text-(--accent)">
              {verifyHost}/verify/{cert.id}
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block min-w-[60%] border-b-[length:max(1px,0.08cqw)] border-(--line) pb-[0.3cqw] font-(family-name:--font-sign) text-[2.2cqw] leading-tight text-(--accent) italic">
              {cert.issuedBy}
            </div>
            <div className="mt-[0.5cqw] text-[1cqw] font-medium">
              {cert.issuedBy} <span className="font-mono text-(--fg-muted)">{cert.issuerHandle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
