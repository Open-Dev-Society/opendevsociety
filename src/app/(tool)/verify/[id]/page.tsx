import { cache } from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { AlertCircle, CircleCheck } from "lucide-react";
import { getCert, type Cert } from "@/lib/certs";
import { Container, Ledger, VerifyForm } from "@/components/site";
import { CertificateDocument, formatDate } from "@/components/site/certificate/CertificateDocument";
import { CopyLinkButton, DownloadButton } from "@/components/site/certificate/actions";
import { certificateRoles } from "@/content";
import { ToolHeader } from "../../tool-header";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// One registry read per request, shared by generateMetadata and the page.
const lookup = cache(async (id: string): Promise<{ cert: Cert | null; error?: string }> => {
  try {
    return { cert: await getCert(id) };
  } catch (err) {
    return { cert: null, error: err instanceof Error ? err.message : "Lookup failed." };
  }
});

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { cert } = await lookup(id);
  const robots = { index: false, follow: false };
  if (!cert) return { title: `Verify ${id} · Open Dev Society`, robots };
  const role = certificateRoles[cert.role].label;
  return {
    title: `${cert.name}, ${role} · Open Dev Society`,
    description: `Open Dev Society certificate ${cert.id}: ${cert.name}, ${role}. Check its authenticity and status.`,
    robots,
  };
}

export default async function VerifyPage({ params }: Props) {
  const { id } = await params;
  const { cert, error } = await lookup(id);
  const host = (await headers()).get("host") ?? "opendevsociety.vercel.app";

  return (
    <>
      <ToolHeader title="Open Dev Society" href="/" />
      <main className="flex-1">
        <Container className="py-10 lg:py-16">
          {error ? (
            <div className="max-w-xl">
              <h1 className="t-title flex items-center gap-2">
                <AlertCircle className="size-5 shrink-0 text-(--fg-muted)" strokeWidth={1.75} /> Verification is unavailable right now.
              </h1>
              <p className="mt-2 text-sm text-(--fg-muted)">The certificate registry couldn&apos;t be reached. Try again in a minute.</p>
              <p className="t-mono mt-4 break-all text-(--fg-subtle)">{error}</p>
            </div>
          ) : !cert ? (
            <div className="max-w-xl">
              <h1 className="display-2">
                We couldn&apos;t find certificate <span className="font-mono text-[0.7em] font-normal tracking-normal break-all">{id}</span>
              </h1>
              <p className="mt-4 text-(--fg-muted)">
                It isn&apos;t in the Open Dev Society registry. Check the ID for typos, or ask the issuer. A certificate published a moment ago
                can take a few seconds to appear.
              </p>
              <div className="mt-8 max-w-sm">
                <VerifyForm />
              </div>
            </div>
          ) : (
            <Found cert={cert} host={host} />
          )}
        </Container>
      </main>
    </>
  );
}

function Found({ cert, host }: { cert: Cert; host: string }) {
  const revoked = cert.status === "revoked";
  const role = certificateRoles[cert.role].label;
  const details = [
    ["ID", <span key="v" className="font-mono">{cert.id}</span>],
    ["Recipient", <span key="v" className="sign text-(--fg)">{cert.name}</span>],
    ["Role", role],
    ["Issued", <span key="v" className="font-mono">{cert.issuedOn}</span>],
    ["Issuer", <>{cert.issuedBy} <span className="font-mono">{cert.issuerHandle}</span></>],
    ["Status", revoked ? `Revoked${cert.revokedOn ? ` on ${formatDate(cert.revokedOn)}` : ""}` : "Active, no revocation issued"],
    ["Last updated", <span key="v" className="font-mono">{cert.updatedAt.slice(0, 10)}</span>],
  ] as const;

  return (
    <>
      {revoked ? (
        <div role="status" className="flex gap-3 border-l-[3px] border-(--fg-muted) bg-(--surface-2) px-4 py-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-(--fg-muted)" strokeWidth={1.75} />
          <h1 className="t-title text-(--fg)">
            Revoked{cert.revokedOn ? ` on ${formatDate(cert.revokedOn)}` : ""}. This certificate is no longer valid.
            {cert.revokedReason && <span className="block pt-1 text-base font-normal text-(--fg-muted)">Reason: {cert.revokedReason}</span>}
          </h1>
        </div>
      ) : (
        <h1 role="status" className="t-title flex items-start gap-2 text-(--live)">
          <CircleCheck className="mt-0.5 size-5 shrink-0" strokeWidth={2} />
          <span>Verified. Issued by Open Dev Society on {formatDate(cert.issuedOn)}.</span>
        </h1>
      )}

      <CertificateDocument
        cert={cert}
        verifyHost={host}
        revokedOn={revoked ? (cert.revokedOn ?? cert.updatedAt) : undefined}
        className="mt-8 shadow-(--shadow-lg)"
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <DownloadButton className="flex-1 sm:flex-none" />
        <CopyLinkButton className="flex-1 sm:flex-none" />
      </div>

      <Ledger
        className="mt-12 max-w-3xl"
        caption="Certificate details"
        columns={[
          { key: "k", label: "Field", width: "10rem" },
          { key: "v", label: "Value" },
        ]}
        rows={details.map(([k, v]) => ({ key: k, cells: { k: <span className="t-meta text-(--fg-subtle)">{k}</span>, v } }))}
      />
    </>
  );
}
