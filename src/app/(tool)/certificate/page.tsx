"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { Alert, ArrowRight, Check, External, Refresh } from "@/components/site/Icon";
import { Container, Field, SegmentedControl } from "@/components/site";
import { CertificateDocument } from "@/components/site/certificate/CertificateDocument";
import { CopyLinkButton, DownloadButton, toolButton } from "@/components/site/certificate/actions";
import { certificateDefaults, certificateRoles, type CertRoleKey } from "@/content";

const ROLES = Object.keys(certificateRoles) as CertRoleKey[];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function generateId() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ODS-${year}-${rand}`;
}

export default function CertificatePage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<CertRoleKey>(certificateDefaults.role);
  const [date, setDate] = useState(certificateDefaults.date);
  const [certId, setCertId] = useState(certificateDefaults.certId);
  const [description, setDescription] = useState<string>(certificateRoles[certificateDefaults.role].description);
  const [issuer, setIssuer] = useState(certificateDefaults.issuer);
  const [issuerHandle, setIssuerHandle] = useState(certificateDefaults.issuerHandle);
  const [host, setHost] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ id: string; verifyUrl: string } | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const descId = useId();

  // Hydrate from the URL on mount, so a copied draft link reopens pre-filled.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("n");
    const r = params.get("r") as CertRoleKey | null;
    const d = params.get("d");
    const id = params.get("id");
    const desc = params.get("desc");
    const iss = params.get("by");
    const issH = params.get("byh");

    // eslint-disable-next-line react-hooks/set-state-in-effect -- the draft lives in the URL, only readable after mount
    if (n && n !== certificateDefaults.name) setName(n);
    if (r && r in certificateRoles) {
      setRole(r);
      if (!desc) setDescription(certificateRoles[r].description);
    }
    setDate(d || todayISO());
    setCertId(id || generateId());
    if (desc) setDescription(desc);
    if (iss) setIssuer(iss);
    if (issH) setIssuerHandle(issH);
    setHost(window.location.host);
    setHydrated(true);
  }, []);

  // Keep the URL in step with the draft once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    params.set("n", name);
    params.set("r", role);
    params.set("d", date);
    params.set("id", certId);
    params.set("desc", description);
    params.set("by", issuer);
    params.set("byh", issuerHandle);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [hydrated, name, role, date, certId, description, issuer, issuerHandle]);

  const onRoleChange = (next: CertRoleKey) => {
    setRole(next);
    setDescription(certificateRoles[next].description);
  };

  const reset = () => {
    setName("");
    setRole(certificateDefaults.role);
    setDate(todayISO());
    setCertId(generateId());
    setDescription(certificateRoles[certificateDefaults.role].description);
    setIssuer(certificateDefaults.issuer);
    setIssuerHandle(certificateDefaults.issuerHandle);
    setConfirming(false);
    setPublishResult(null);
    setPublishError(null);
    setNameError(null);
  };

  const askPublish = () => {
    setPublishResult(null);
    setPublishError(null);
    if (!name.trim()) {
      setNameError("Add the recipient's name before publishing.");
      return;
    }
    setConfirming(true);
  };

  const publish = async () => {
    setConfirming(false);
    setPublishing(true);
    setPublishError(null);
    setPublishResult(null);
    try {
      const res = await fetch("/api/certs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: certId,
          name,
          role,
          description,
          issuedOn: date,
          issuedBy: issuer,
          issuerHandle,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.cert) throw new Error(data?.error || "Publish failed.");
      const finalId = data.cert.id as string;
      if (finalId !== certId) setCertId(finalId);
      setPublishResult({ id: finalId, verifyUrl: `${window.location.origin}/verify/${finalId}` });
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Publish failed.");
    } finally {
      setPublishing(false);
    }
  };

  const cert = { id: certId, name, role, description, issuedOn: date, issuedBy: issuer, issuerHandle };

  return (
    <Container className="py-10 lg:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
        {/* Preview first on small screens, on the right from 1024 */}
        <div className="min-w-0 lg:order-2 lg:col-span-7">
          <div className="lg:sticky lg:top-8">
            <CertificateDocument cert={cert} verifyHost={host || "…"} className="shadow-(--shadow-lg)" />
            <p className="t-meta mt-3 text-(--fg-subtle)">
              Preview at A4 landscape. Download PDF prints exactly this, on one page.
            </p>
          </div>
        </div>

        <div className="min-w-0 lg:order-1 lg:col-span-5">
          <h1 className="t-title">Issue a certificate</h1>
          <p className="mt-2 text-sm text-(--fg-muted)">
            Edit the fields and the preview follows. The address bar keeps the draft, so a copied link reopens it.
          </p>

          <form
            className="mt-6 flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              askPublish();
            }}
          >
            <Field label="Recipient" placeholder={certificateDefaults.name} value={name} onChange={(e) => (setName(e.target.value), setNameError(null))} autoComplete="off" error={nameError ?? undefined} />

            <div>
              <span className="t-meta mb-1.5 block text-(--fg-muted)">Role</span>
              <SegmentedControl
                label="Role"
                wrap
                value={role}
                onChange={onRoleChange}
                options={ROLES.map((r) => ({ value: r, label: r }))}
              />
            </div>

            <div>
              <label htmlFor={descId} className="t-meta mb-1.5 block text-(--fg-muted)">
                Description
              </label>
              <textarea
                id={descId}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="block w-full resize-y rounded-(--radius-sm) bg-(--surface) px-3 py-2.5 text-[15px] leading-normal text-(--fg) shadow-(--shadow-sm) outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Field label="Date" value={date} onChange={(e) => setDate(e.target.value)} mono />
              <Field label="Certificate ID" value={certId} onChange={(e) => setCertId(e.target.value)} mono />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Field label="Issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
              <Field label="Issuer handle" value={issuerHandle} onChange={(e) => setIssuerHandle(e.target.value)} mono />
            </div>

            {confirming ? (
              <div className="rounded-(--radius-sm) bg-(--surface-2) p-4" role="alertdialog" aria-label="Confirm publish">
                <p className="text-sm text-(--fg)">
                  Publish <span className="font-mono">{certId}</span> for <span className="sign">{name}</span> ({certificateRoles[role].label})?
                </p>
                <p className="mt-1 text-sm text-(--fg-muted)">
                  This commits to data/certificates.json on GitHub and creates a public verify page.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={publish} className={toolButton("primary")} autoFocus>
                    Yes, publish
                  </button>
                  <button type="button" onClick={() => setConfirming(false)} className={toolButton("quiet")}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button type="submit" disabled={publishing} className={toolButton("primary", "flex-1 sm:flex-none")}>
                  {publishing ? "Publishing…" : "Publish"}
                </button>
                <DownloadButton className="flex-1 sm:flex-none" />
              </div>
            )}

            <div className="-mt-2 flex flex-wrap gap-1 -ml-3">
              <CopyLinkButton label="Copy draft link" variant="quiet" />
              <button type="button" onClick={reset} className={toolButton("quiet")}>
                <Refresh /> Reset
              </button>
            </div>
          </form>

          {publishError && (
            <div role="alert" className="mt-6 flex gap-3 border-l-[3px] border-(--fg-muted) bg-(--surface-2) p-4">
              <Alert className="mt-0.5 shrink-0 text-(--fg-muted)" />
              <div className="min-w-0 text-sm">
                <p className="font-medium text-(--fg)">Couldn&apos;t publish.</p>
                <p className="mt-1 break-words text-(--fg-muted)">{publishError}</p>
                <p className="t-meta mt-2 text-(--fg-subtle)">Check that GITHUB_TOKEN can write contents on the registry repo.</p>
              </div>
            </div>
          )}

          {publishResult && (
            <div role="status" className="mt-6 rounded-(--radius-sm) bg-(--surface) p-4 shadow-(--shadow-sm)">
              <p className="flex items-center gap-2 text-sm font-medium text-(--live)">
                <Check /> Published
              </p>
              <p className="mt-1 text-sm text-(--fg-muted)">
                <span className="font-mono text-(--fg)">{publishResult.id}</span> is live. Send the recipient this link.
              </p>
              <p className="t-mono mt-3 rounded-(--radius-sm) bg-(--surface-2) px-3 py-2 break-all">{publishResult.verifyUrl}</p>
              <div className="mt-3 flex flex-wrap gap-1 -ml-3">
                <CopyLinkButton text={publishResult.verifyUrl} variant="quiet" />
                <a href={publishResult.verifyUrl} target="_blank" rel="noopener noreferrer" className={toolButton("quiet")}>
                  Open verify page <External />
                </a>
                <Link href="/certificate/manage" className={toolButton("quiet")}>
                  View in registry <ArrowRight />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
