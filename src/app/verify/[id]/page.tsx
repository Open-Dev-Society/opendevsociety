import { getCert, type Cert } from "@/lib/certs";
import { Check, AlertTriangle, ShieldOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ROLE_LABELS: Record<Cert["role"], string> = {
  member: "Active Member",
  contributor: "Code Contributor",
  maintainer: "Core Maintainer",
  mentor: "Mentor & Educator",
};

const ROLE_MONO: Record<Cert["role"], string> = {
  member: "MEMBERSHIP",
  contributor: "CONTRIBUTION",
  maintainer: "MAINTAINERSHIP",
  mentor: "MENTORSHIP",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Verify ${id} — Open Dev Society`,
    description: `Open Dev Society certificate registry: verify the authenticity and status of certificate ${id}.`,
    robots: { index: false, follow: false },
  };
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let cert: Cert | null = null;
  let loadError: string | null = null;
  try {
    cert = await getCert(id);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Lookup failed.";
  }

  if (loadError) {
    return (
      <section className="px-8 py-20 border-b border-dashed border-gray-300 min-h-[70vh]">
        <div className="max-w-md mx-auto text-center">
          <ShieldOff className="w-10 h-10 mx-auto mb-6 text-[var(--color-brand-rose)]" />
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-brand-rose)] mb-3">
            // REGISTRY_UNREACHABLE
          </div>
          <h1 className="text-3xl font-serif italic mb-4 leading-tight tracking-tight">
            Verification unavailable.
          </h1>
          <p className="text-sm text-gray-600 mb-2">
            The certificate registry could not be reached right now.
          </p>
          <p className="font-mono text-[10px] text-gray-400 break-all">
            {loadError}
          </p>
        </div>
      </section>
    );
  }

  if (!cert) {
    return (
      <section className="px-8 py-20 border-b border-dashed border-gray-300 min-h-[70vh]">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-[var(--color-brand-rose)] rounded-full animate-pulse-slow"></span>
            <span className="text-mono text-[var(--color-brand-rose)]">
              // CERT_NOT_FOUND
            </span>
          </div>
          <h1 className="text-4xl font-serif italic mb-4 leading-tight tracking-tight">
            No certificate matches that ID.
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            The identifier{" "}
            <span className="font-mono bg-gray-100 px-2 py-0.5 border border-dashed border-gray-300">
              {id}
            </span>{" "}
            does not appear in the Open Dev Society registry.
          </p>
          <p className="text-xs text-gray-500">
            If you believe this certificate should exist, contact the issuer.
            Newly-issued certificates may take a few seconds to appear here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-8 font-mono text-[11px] uppercase tracking-widest border-b border-black pb-0.5 hover:text-[var(--color-brand-teal)] hover:border-[var(--color-brand-teal)] transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> RETURN_HOME
          </Link>
        </div>
      </section>
    );
  }

  const isRevoked = cert.status === "revoked";

  return (
    <section className="px-8 py-12 border-b border-dashed border-gray-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`w-2 h-2 rounded-full animate-pulse-slow ${
              isRevoked
                ? "bg-[var(--color-brand-rose)]"
                : "bg-[var(--color-brand-teal)]"
            }`}
          ></span>
          <span
            className={`text-mono ${
              isRevoked ? "text-[var(--color-brand-rose)]" : ""
            }`}
          >
            // CERTIFICATE_REGISTRY
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif italic mb-2 leading-tight tracking-tight">
          {isRevoked ? (
            <>
              This certificate has been{" "}
              <span className="not-italic font-bold text-[var(--color-brand-rose)]">
                revoked.
              </span>
            </>
          ) : (
            <>
              This certificate is{" "}
              <span className="not-italic font-bold text-[var(--color-brand-teal)]">
                authentic.
              </span>
            </>
          )}
        </h1>
        <p className="text-sm text-gray-600 mb-8 max-w-2xl">
          Issued by Open Dev Society. Registry record below reflects the current
          status of certificate{" "}
          <span className="font-mono">{cert.id}</span>.
        </p>

        {/* Status banner */}
        <div
          className={`border border-dashed p-4 mb-8 flex items-start gap-3 ${
            isRevoked
              ? "border-[var(--color-brand-rose)] bg-rose-50/40"
              : "border-[var(--color-brand-teal)] bg-teal-50/40"
          }`}
        >
          {isRevoked ? (
            <AlertTriangle className="w-5 h-5 text-[var(--color-brand-rose)] flex-shrink-0 mt-0.5" />
          ) : (
            <Check className="w-5 h-5 text-[var(--color-brand-teal)] flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div
              className={`font-mono text-[11px] uppercase tracking-widest font-bold ${
                isRevoked
                  ? "text-[var(--color-brand-rose)]"
                  : "text-[var(--color-brand-teal)]"
              }`}
            >
              {isRevoked ? "STATUS_REVOKED" : "STATUS_ACTIVE"}
            </div>
            <div className="text-xs text-gray-700 mt-1 leading-relaxed">
              {isRevoked ? (
                <>
                  This certificate was revoked
                  {cert.revokedOn ? ` on ${cert.revokedOn.slice(0, 10)}` : ""}{" "}
                  by Open Dev Society. It is no longer valid.
                  {cert.revokedReason ? (
                    <> Reason: <span className="italic">{cert.revokedReason}</span></>
                  ) : null}
                </>
              ) : (
                <>
                  Recorded in the Open Dev Society registry on{" "}
                  {cert.createdAt.slice(0, 10)}. No revocation has been issued.
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cert document — non-editable preview */}
        <div
          className={`bg-white relative shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-gray-300 overflow-hidden ${
            isRevoked ? "opacity-70" : ""
          }`}
          style={{
            aspectRatio: "297 / 210",
            backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {isRevoked && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="border-[3px] border-[var(--color-brand-rose)] rotate-[-12deg] px-8 py-3 bg-white/80 backdrop-blur-sm">
                <span className="font-mono text-3xl md:text-5xl font-bold tracking-widest text-[var(--color-brand-rose)]">
                  REVOKED
                </span>
              </div>
            </div>
          )}

          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-gray-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div
            className="absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: "var(--color-brand-teal)" }}
          />

          <div className="absolute inset-[14px] border border-dashed border-gray-400 pointer-events-none" />
          <div className="absolute inset-[22px] border border-gray-200 pointer-events-none" />

          <div className="absolute top-[14px] left-[14px] w-6 h-6 border-l-2 border-t-2 border-[var(--color-brand-teal)] pointer-events-none" />
          <div className="absolute top-[14px] right-[14px] w-6 h-6 border-r-2 border-t-2 border-[var(--color-brand-teal)] pointer-events-none" />
          <div className="absolute bottom-[14px] left-[14px] w-6 h-6 border-l-2 border-b-2 border-[var(--color-brand-teal)] pointer-events-none" />
          <div className="absolute bottom-[14px] right-[14px] w-6 h-6 border-r-2 border-b-2 border-[var(--color-brand-teal)] pointer-events-none" />

          <div className="absolute inset-0 flex flex-col px-[6%] py-[5%]">
            <div className="flex items-start justify-between mb-[3%]">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="ODS"
                  className="h-10 w-10 object-contain"
                />
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-widest font-bold">
                    Open Dev Society
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
                    EST. 2024 // GLOBAL_COLLECTIVE
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
                  // CERT_ID
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider mt-0.5">
                  {cert.id}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 mb-[1.5%]">
              <span className="w-1.5 h-1.5 bg-[var(--color-brand-teal)] rounded-full"></span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-brand-teal)] font-bold">
                // CERTIFICATE_OF_{ROLE_MONO[cert.role]}
              </span>
            </div>

            <div className="font-serif italic text-[clamp(20px,3.2cqw,38px)] leading-[1] tracking-tight mb-[1.5%] text-gray-700">
              This certifies that
            </div>

            <div className="font-serif text-[clamp(34px,6.2cqw,76px)] font-bold leading-[1] tracking-tighter mb-[2%] text-black inline-block self-start max-w-full">
              {cert.name}
            </div>

            <div className="mb-[2.5%]">
              <span className="inline-flex items-center gap-2 border border-black px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest bg-white">
                [ {ROLE_LABELS[cert.role].toUpperCase()} ]
              </span>
            </div>

            <div className="text-[clamp(11px,1.35cqw,15px)] text-gray-700 leading-relaxed max-w-[92%] flex-1">
              {cert.description}
            </div>

            <div className="pt-[2%] mt-[2%] border-t border-dashed border-gray-300 grid grid-cols-3 gap-4 items-end">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">
                  // ISSUED_ON
                </div>
                <div className="font-mono text-[12px] uppercase tracking-wider text-black">
                  {cert.issuedOn}
                </div>
              </div>
              <div className="text-center">
                <div className="font-serif italic text-[clamp(14px,1.8cqw,22px)] leading-none mb-1">
                  Open Dev Society
                </div>
                <div className="font-mono text-[8px] uppercase tracking-widest text-gray-400">
                  opendevsociety.vercel.app
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">
                  // AUTHORIZED_BY
                </div>
                <div className="font-serif italic text-[clamp(13px,1.7cqw,18px)] leading-tight inline-block">
                  {cert.issuedBy}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-gray-500 inline-block ml-1">
                  {cert.issuerHandle}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registry metadata */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
          <div className="bg-white p-4">
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
              // CERT_ID
            </div>
            <div className="font-mono text-xs mt-1 break-all">{cert.id}</div>
          </div>
          <div className="bg-white p-4">
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
              // ISSUED
            </div>
            <div className="font-mono text-xs mt-1">{cert.issuedOn}</div>
          </div>
          <div className="bg-white p-4">
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
              // STATUS
            </div>
            <div
              className={`font-mono text-xs mt-1 font-bold uppercase ${
                isRevoked
                  ? "text-[var(--color-brand-rose)]"
                  : "text-[var(--color-brand-teal)]"
              }`}
            >
              {cert.status}
            </div>
          </div>
          <div className="bg-white p-4">
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
              // LAST_UPDATED
            </div>
            <div className="font-mono text-xs mt-1">
              {cert.updatedAt.slice(0, 10)}
            </div>
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mt-8 text-center">
          // SOURCE_OF_TRUTH: {process.env.CERT_REPO_OWNER || "Open-Dev-Society"}/
          {process.env.CERT_REPO_NAME || "opendevsociety"}/data/certificates.json
        </p>
      </div>
    </section>
  );
}
