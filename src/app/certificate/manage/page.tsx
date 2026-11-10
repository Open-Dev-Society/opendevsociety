"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  ExternalLink,
  ShieldOff,
  ShieldCheck,
  Plus,
  AlertTriangle,
  Check,
  Search,
} from "lucide-react";
import Link from "next/link";

type CertRole = "member" | "contributor" | "maintainer" | "mentor";
type CertStatus = "active" | "revoked";

interface Cert {
  id: string;
  name: string;
  role: CertRole;
  description: string;
  issuedOn: string;
  issuedBy: string;
  issuerHandle: string;
  status: CertStatus;
  revokedOn?: string;
  revokedReason?: string;
  createdAt: string;
  updatedAt: string;
}

const ROLE_LABELS: Record<CertRole, string> = {
  member: "Active Member",
  contributor: "Code Contributor",
  maintainer: "Core Maintainer",
  mentor: "Mentor & Educator",
};

export default function ManagePage() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/certs", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load.");
      setCerts(data.certs ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: CertStatus) {
    let reason: string | undefined;
    if (status === "revoked") {
      const input = window.prompt(
        `Revoke certificate ${id}?\n\nOptional reason (shown publicly on the verify page):`,
        ""
      );
      if (input === null) return;
      reason = input.trim() || undefined;
    } else {
      const ok = window.confirm(`Restore certificate ${id} to ACTIVE status?`);
      if (!ok) return;
    }

    setBusyId(id);
    try {
      const res = await fetch(`/api/certs/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed.");
      setCerts((prev) => prev.map((c) => (c.id === id ? data.cert : c)));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function copyVerifyUrl(id: string) {
    const url = `${window.location.origin}/verify/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  const filtered = certs.filter((c) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  });

  const activeCount = certs.filter((c) => c.status === "active").length;
  const revokedCount = certs.filter((c) => c.status === "revoked").length;

  return (
    <section className="px-8 py-12 border-b border-dashed border-gray-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 bg-[var(--color-brand-teal)] rounded-full animate-pulse-slow"></span>
          <span className="text-mono">// CERTIFICATE_REGISTRY</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif italic mb-3 leading-tight tracking-tight">
              Manage <span className="not-italic font-bold">Certificates.</span>
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl">
              Every certificate issued through the registry, with controls to
              revoke or restore. Status changes are committed to{" "}
              <span className="font-mono">data/certificates.json</span> in the
              repo.
            </p>
          </div>
          <Link
            href="/certificate"
            className="btn-tech inline-flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-3 h-3" /> ISSUE_NEW
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-px bg-gray-200 border border-gray-200 mb-6">
          <div className="bg-white p-4">
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
              // TOTAL_ISSUED
            </div>
            <div className="font-bold text-2xl mt-1 font-mono">
              {certs.length}
            </div>
          </div>
          <div className="bg-white p-4">
            <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-brand-teal)]">
              // ACTIVE
            </div>
            <div className="font-bold text-2xl mt-1 font-mono text-[var(--color-brand-teal)]">
              {activeCount}
            </div>
          </div>
          <div className="bg-white p-4">
            <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-brand-rose)]">
              // REVOKED
            </div>
            <div className="font-bold text-2xl mt-1 font-mono text-[var(--color-brand-rose)]">
              {revokedCount}
            </div>
          </div>
        </div>

        {/* Filter + Refresh */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="FILTER_BY_ID_NAME_ROLE_STATUS..."
              className="w-full bg-white border border-dashed border-gray-300 pl-9 pr-3 py-2 font-mono text-xs uppercase tracking-wider focus:outline-none focus:border-[var(--color-brand-teal)]"
            />
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="px-5 py-2 font-mono text-xs uppercase tracking-widest border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            REFRESH
          </button>
        </div>

        {error && (
          <div className="border border-dashed border-[var(--color-brand-rose)] bg-rose-50/40 p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[var(--color-brand-rose)] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-[var(--color-brand-rose)]">
                // REGISTRY_ERROR
              </div>
              <div className="text-xs text-gray-700 mt-1 break-all">{error}</div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="border border-dashed border-gray-300 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center font-mono text-xs text-gray-400">
              LOADING_REGISTRY...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-gray-400">
              {certs.length === 0
                ? "NO_CERTIFICATES_ISSUED_YET"
                : "NO_MATCHES_FOR_FILTER"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-dashed border-gray-300">
                  <tr className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Issued</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-dashed border-gray-200 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-3 font-mono text-xs">{c.id}</td>
                      <td className="p-3">{c.name}</td>
                      <td className="p-3 font-mono text-xs">
                        {ROLE_LABELS[c.role]}
                      </td>
                      <td className="p-3 font-mono text-xs text-gray-500">
                        {c.issuedOn}
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 ${
                            c.status === "active"
                              ? "bg-[var(--color-brand-teal)] text-white"
                              : "bg-[var(--color-brand-rose)] text-white"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <Link
                            href={`/verify/${c.id}`}
                            target="_blank"
                            className="font-mono text-[10px] uppercase tracking-widest border border-gray-300 px-2.5 py-1 hover:bg-black hover:text-white hover:border-black transition-colors flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> VERIFY
                          </Link>
                          <button
                            onClick={() => copyVerifyUrl(c.id)}
                            className="font-mono text-[10px] uppercase tracking-widest border border-gray-300 px-2.5 py-1 hover:bg-gray-100 transition-colors flex items-center gap-1"
                          >
                            {copiedId === c.id ? (
                              <>
                                <Check className="w-3 h-3" /> COPIED
                              </>
                            ) : (
                              <>COPY_LINK</>
                            )}
                          </button>
                          {c.status === "active" ? (
                            <button
                              onClick={() => setStatus(c.id, "revoked")}
                              disabled={busyId === c.id}
                              className="font-mono text-[10px] uppercase tracking-widest border border-[var(--color-brand-rose)] text-[var(--color-brand-rose)] px-2.5 py-1 hover:bg-[var(--color-brand-rose)] hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              <ShieldOff className="w-3 h-3" />
                              {busyId === c.id ? "..." : "REVOKE"}
                            </button>
                          ) : (
                            <button
                              onClick={() => setStatus(c.id, "active")}
                              disabled={busyId === c.id}
                              className="font-mono text-[10px] uppercase tracking-widest border border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] px-2.5 py-1 hover:bg-[var(--color-brand-teal)] hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              {busyId === c.id ? "..." : "RESTORE"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mt-8 text-center">
          // EACH_ACTION_COMMITS_TO_GITHUB — VERIFY_PAGE_UPDATES_WITHIN_SECONDS
        </p>
      </div>
    </section>
  );
}
