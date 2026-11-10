"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Link2,
  RefreshCw,
  Check,
  Globe2,
  ExternalLink,
  AlertTriangle,
  ListChecks,
  LogOut,
} from "lucide-react";
import Link from "next/link";

const ROLES = {
  member: {
    label: "Active Member",
    mono: "MEMBERSHIP",
    description:
      "in recognition of their active participation in the Open Dev Society — a decentralized network of developers, designers, and writers building free, open-source public goods.",
  },
  contributor: {
    label: "Code Contributor",
    mono: "CONTRIBUTION",
    description:
      "for meaningful contributions to open-source modules under the Open Dev Society — shipping code, fixing bugs, and advancing software made freely available to the world.",
  },
  maintainer: {
    label: "Core Maintainer",
    mono: "MAINTAINERSHIP",
    description:
      "for stewardship of Open Dev Society — reviewing pull requests, guiding contributors, and keeping public-good software healthy and shipping.",
  },
  mentor: {
    label: "Mentor & Educator",
    mono: "MENTORSHIP",
    description:
      "for sharing knowledge with the Open Dev Society community — teaching, writing, and lifting the next generation of open-source operators.",
  },
} as const;

type RoleKey = keyof typeof ROLES;

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
  const [name, setName] = useState("Recipient Name");
  const [role, setRole] = useState<RoleKey>("contributor");
  const [date, setDate] = useState("YYYY.MM.DD");
  const [certId, setCertId] = useState("ODS-XXXX-XXXX");
  const [description, setDescription] = useState<string>(
    ROLES.contributor.description
  );
  const [issuer, setIssuer] = useState("Ravi Pratap Singh");
  const [issuerHandle, setIssuerHandle] = useState("@ravixalgorithm");
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    id: string;
    verifyUrl: string;
  } | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [verifyCopied, setVerifyCopied] = useState(false);

  // Hydrate from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("n");
    const r = params.get("r") as RoleKey | null;
    const d = params.get("d");
    const id = params.get("id");
    const desc = params.get("desc");
    const iss = params.get("by");
    const issH = params.get("byh");

    if (n) setName(n);
    if (r && r in ROLES) {
      setRole(r);
      if (!desc) setDescription(ROLES[r].description);
    }
    setDate(d || todayISO());
    setCertId(id || generateId());
    if (desc) setDescription(desc);
    if (iss) setIssuer(iss);
    if (issH) setIssuerHandle(issH);
    setHydrated(true);
  }, []);

  // Sync state to URL once hydrated
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
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [hydrated, name, role, date, certId, description, issuer, issuerHandle]);

  const onRoleChange = (newRole: RoleKey) => {
    setRole(newRole);
    setDescription(ROLES[newRole].description);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — fall back to selection
      window.prompt("Copy this link:", window.location.href);
    }
  };

  const downloadPDF = () => {
    const cert = document.querySelector(".cert-document") as HTMLElement | null;
    if (!cert) {
      window.print();
      return;
    }
    document.getElementById("cert-print-clone")?.remove();

    const clone = cert.cloneNode(true) as HTMLElement;
    clone.id = "cert-print-clone";
    clone
      .querySelectorAll<HTMLElement>("[contenteditable]")
      .forEach((el) => el.removeAttribute("contenteditable"));

    document.body.appendChild(clone);
    document.body.classList.add("printing-cert");

    const cleanup = () => {
      clone.remove();
      document.body.classList.remove("printing-cert");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);

    requestAnimationFrame(() => {
      setTimeout(() => window.print(), 50);
    });
  };

  const reset = () => {
    setName("Recipient Name");
    setRole("contributor");
    setDate(todayISO());
    setCertId(generateId());
    setDescription(ROLES.contributor.description);
    setIssuer("Ravi Pratap Singh");
    setIssuerHandle("@ravixalgorithm");
    setPublishResult(null);
    setPublishError(null);
  };

  const publish = async () => {
    if (!name.trim() || name.trim() === "Recipient Name") {
      setPublishError("Set the recipient name before publishing.");
      return;
    }
    const confirmMsg =
      `Publish this certificate to the public registry?\n\n` +
      `• Recipient: ${name}\n` +
      `• Role: ${ROLES[role].label}\n` +
      `• Cert ID: ${certId}\n\n` +
      `This commits to data/certificates.json on GitHub and creates a public verify page.`;
    if (!window.confirm(confirmMsg)) return;

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
          issuerHandle: issuerHandle,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.cert) {
        throw new Error(data?.error || "Publish failed.");
      }
      const finalId = data.cert.id as string;
      if (finalId !== certId) setCertId(finalId);
      const verifyUrl = `${window.location.origin}/verify/${finalId}`;
      setPublishResult({ id: finalId, verifyUrl });
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Publish failed.");
    } finally {
      setPublishing(false);
    }
  };

  const copyVerifyUrl = async () => {
    if (!publishResult) return;
    try {
      await navigator.clipboard.writeText(publishResult.verifyUrl);
      setVerifyCopied(true);
      setTimeout(() => setVerifyCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", publishResult.verifyUrl);
    }
  };

  const logout = async () => {
    await fetch("/api/cert-auth", { method: "DELETE" });
    window.location.href = "/certificate/login";
  };

  const handleBlur =
    (setter: (v: string) => void) =>
    (e: React.FocusEvent<HTMLElement>) => {
      setter(e.currentTarget.innerText.trim());
    };

  // Strip formatting on paste so layout stays clean
  const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <>
      <style>{`
        .editable {
          outline: none;
          transition: background-color 0.15s ease, box-shadow 0.15s ease;
          border-radius: 1px;
          cursor: text;
        }
        @media (hover: hover) {
          .editable:hover {
            background-color: rgba(13, 148, 136, 0.06);
            box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.06);
          }
        }
        .editable:focus {
          background-color: rgba(13, 148, 136, 0.10);
          box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.12);
        }
        @media print {
          .editable,
          .editable:hover,
          .editable:focus {
            background-color: transparent !important;
            box-shadow: none !important;
            outline: none !important;
          }
        }
      `}</style>

      <section className="px-8 py-12 border-b border-dashed border-gray-300">
        {/* Toolbar */}
        <div className="no-print max-w-5xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-[var(--color-brand-teal)] rounded-full animate-pulse-slow"></span>
            <span className="text-mono">// CERTIFICATE_GENERATOR</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-3 leading-tight tracking-tight">
            Issue a <span className="not-italic font-bold">Certificate.</span>
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mb-8">
            Click any field on the certificate below to edit it directly. The URL
            updates as you type — copy the share link to send a pre-filled
            certificate, or download the final version as a PDF.
          </p>

          {/* Action bar */}
          <div className="border border-dashed border-gray-300 bg-gray-50 p-4 flex flex-col gap-4 mb-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <label className="font-mono text-[10px] uppercase tracking-widest text-gray-500 md:w-16">
                Role
              </label>
              <div className="flex flex-wrap gap-2 flex-1">
                {(Object.keys(ROLES) as RoleKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => onRoleChange(key)}
                    className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                      role === key
                        ? "bg-black text-white border-black"
                        : "bg-white border-gray-300 hover:border-black"
                    }`}
                  >
                    [ {ROLES[key].label} ]
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-dashed border-gray-300">
              <button
                onClick={publish}
                disabled={publishing}
                className="px-6 py-2 font-mono text-xs uppercase tracking-widest border border-[var(--color-brand-teal)] bg-[var(--color-brand-teal)] text-white hover:bg-teal-700 hover:border-teal-700 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                <Globe2 className="w-3 h-3" />
                {publishing ? "PUBLISHING..." : "PUBLISH_TO_REGISTRY"}
              </button>
              <button
                onClick={copyShareLink}
                className="btn-tech flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" /> LINK_COPIED
                  </>
                ) : (
                  <>
                    <Link2 className="w-3 h-3" /> COPY_DRAFT_LINK
                  </>
                )}
              </button>
              <button
                onClick={downloadPDF}
                className="btn-tech flex items-center gap-2"
              >
                <Download className="w-3 h-3" /> DOWNLOAD_PDF
              </button>
              <button
                onClick={reset}
                className="px-6 py-2 font-mono text-xs uppercase tracking-widest border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-3 h-3" /> RESET
              </button>
              <Link
                href="/certificate/manage"
                className="px-6 py-2 font-mono text-xs uppercase tracking-widest border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <ListChecks className="w-3 h-3" /> MANAGE_REGISTRY
              </Link>
              <button
                onClick={logout}
                className="ml-auto px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-[var(--color-brand-rose)] transition-colors flex items-center gap-1.5"
                title="Sign out of the certificate generator"
              >
                <LogOut className="w-3 h-3" /> LOGOUT
              </button>
            </div>
          </div>

          {publishError && (
            <div className="border border-dashed border-[var(--color-brand-rose)] bg-rose-50/40 p-4 mb-4 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-[var(--color-brand-rose)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-[var(--color-brand-rose)]">
                  // PUBLISH_FAILED
                </div>
                <div className="text-xs text-gray-700 mt-1 break-all">
                  {publishError}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mt-2">
                  CHECK_THAT_GITHUB_TOKEN_HAS_CONTENTS_WRITE_SCOPE_ON_THE_REPO
                </div>
              </div>
            </div>
          )}

          {publishResult && (
            <div className="border border-dashed border-[var(--color-brand-teal)] bg-teal-50/40 p-5 mb-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[var(--color-brand-teal)] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-[var(--color-brand-teal)]">
                    // PUBLISHED_TO_REGISTRY
                  </div>
                  <div className="text-sm text-gray-800 mt-1 mb-3">
                    Certificate{" "}
                    <span className="font-mono font-bold">
                      {publishResult.id}
                    </span>{" "}
                    is now live. Share the verify URL with the recipient.
                  </div>
                  <div className="bg-white border border-dashed border-gray-300 p-2.5 font-mono text-xs break-all mb-3">
                    {publishResult.verifyUrl}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={copyVerifyUrl}
                      className="btn-tech flex items-center gap-2"
                    >
                      {verifyCopied ? (
                        <>
                          <Check className="w-3 h-3" /> COPIED
                        </>
                      ) : (
                        <>
                          <Link2 className="w-3 h-3" /> COPY_VERIFY_URL
                        </>
                      )}
                    </button>
                    <a
                      href={publishResult.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 font-mono text-xs uppercase tracking-widest border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" /> OPEN_VERIFY_PAGE
                    </a>
                    <Link
                      href="/certificate/manage"
                      className="px-6 py-2 font-mono text-xs uppercase tracking-widest border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <ListChecks className="w-3 h-3" /> VIEW_REGISTRY
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
            // CLICK_ANY_TEXT_ON_THE_CERTIFICATE_TO_EDIT
          </p>
        </div>

        {/* Certificate Document — A4 landscape proportions (297 × 210mm) */}
        <div className="max-w-5xl mx-auto">
          <div
            className="cert-document bg-white relative shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-gray-300 overflow-hidden"
            style={{
              aspectRatio: "297 / 210",
              backgroundImage:
                "radial-gradient(#e5e7eb 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            {/* Decorative blur accents */}
            <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-gray-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div
              className="absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ background: "var(--color-brand-teal)" }}
            />

            {/* Nested frames */}
            <div className="absolute inset-[14px] border border-dashed border-gray-400 pointer-events-none" />
            <div className="absolute inset-[22px] border border-gray-200 pointer-events-none" />

            {/* Corner brackets */}
            <div className="absolute top-[14px] left-[14px] w-6 h-6 border-l-2 border-t-2 border-[var(--color-brand-teal)] pointer-events-none" />
            <div className="absolute top-[14px] right-[14px] w-6 h-6 border-r-2 border-t-2 border-[var(--color-brand-teal)] pointer-events-none" />
            <div className="absolute bottom-[14px] left-[14px] w-6 h-6 border-l-2 border-b-2 border-[var(--color-brand-teal)] pointer-events-none" />
            <div className="absolute bottom-[14px] right-[14px] w-6 h-6 border-r-2 border-b-2 border-[var(--color-brand-teal)] pointer-events-none" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col px-[6%] py-[5%]">
              {/* Header */}
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
                  <div
                    className="editable font-mono text-[10px] uppercase tracking-wider mt-0.5 inline-block"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur(setCertId)}
                    onPaste={handlePaste}
                  >
                    {certId}
                  </div>
                </div>
              </div>

              {/* Subtitle marker */}
              <div className="flex items-center gap-2.5 mb-[1.5%]">
                <span className="w-1.5 h-1.5 bg-[var(--color-brand-teal)] rounded-full"></span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-brand-teal)] font-bold">
                  // CERTIFICATE_OF_{ROLES[role].mono}
                </span>
              </div>

              {/* Main intro */}
              <div className="font-serif italic text-[clamp(20px,3.2cqw,38px)] leading-[1] tracking-tight mb-[1.5%] text-gray-700">
                This certifies that
              </div>

              {/* Recipient name */}
              <div
                className="editable font-serif text-[clamp(34px,6.2cqw,76px)] font-bold leading-[1] tracking-tighter mb-[2%] text-black inline-block self-start max-w-full"
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur(setName)}
                onPaste={handlePaste}
              >
                {name}
              </div>

              {/* Role tag */}
              <div className="mb-[2.5%]">
                <span className="inline-flex items-center gap-2 border border-black px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest bg-white">
                  [ {ROLES[role].label.toUpperCase()} ]
                </span>
              </div>

              {/* Description */}
              <div
                className="editable text-[clamp(11px,1.35cqw,15px)] text-gray-700 leading-relaxed max-w-[92%] flex-1"
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur(setDescription)}
                onPaste={handlePaste}
              >
                {description}
              </div>

              {/* Footer */}
              <div className="pt-[2%] mt-[2%] border-t border-dashed border-gray-300 grid grid-cols-3 gap-4 items-end">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">
                    // ISSUED_ON
                  </div>
                  <div
                    className="editable font-mono text-[12px] uppercase tracking-wider text-black inline-block"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur(setDate)}
                    onPaste={handlePaste}
                  >
                    {date}
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
                  <div
                    className="editable font-serif italic text-[clamp(13px,1.7cqw,18px)] leading-tight inline-block"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur(setIssuer)}
                    onPaste={handlePaste}
                  >
                    {issuer}&nbsp;
                  </div>
                  <div
                    className="editable font-mono text-[9px] uppercase tracking-wider text-gray-500 inline-block ml-1"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur(setIssuerHandle)}
                    onPaste={handlePaste}
                  >
                    {issuerHandle}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help footer */}
        <div className="no-print max-w-5xl mx-auto mt-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
            // PRINT_DIALOG → DESTINATION: SAVE_AS_PDF — ORIENTATION: LANDSCAPE
          </p>
        </div>
      </section>
    </>
  );
}
