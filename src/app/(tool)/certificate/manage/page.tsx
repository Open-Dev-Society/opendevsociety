"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, External, Plus, Refresh } from "@/components/site/Icon";
import { Badge, Container, Field, Ledger, type LedgerColumn } from "@/components/site";
import { CopyLinkButton, toolButton } from "@/components/site/certificate/actions";
import { certificateRoles, type CertRoleKey } from "@/content";

type CertStatus = "active" | "revoked";

interface Cert {
  id: string;
  name: string;
  role: CertRoleKey;
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

const columns: LedgerColumn[] = [
  { key: "id", label: "ID", width: "9.5rem", mono: true },
  { key: "name", label: "Name", width: "minmax(0,1.4fr)" },
  { key: "role", label: "Role", width: "minmax(0,1fr)" },
  { key: "issued", label: "Issued", width: "6.5rem", mono: true },
  { key: "status", label: "Status", width: "5.5rem" },
  { key: "actions", label: "", width: "15.5rem", align: "end" },
];

export default function ManagePage() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  // The inline confirmation that replaces window.prompt/confirm: which cert, which way, and the optional reason.
  const [pending, setPending] = useState<{ cert: Cert; status: CertStatus } | null>(null);
  const [reason, setReason] = useState("");

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

  function ask(cert: Cert, status: CertStatus) {
    setReason("");
    setError(null);
    setPending({ cert, status });
  }

  async function confirm() {
    if (!pending) return;
    const { cert, status } = pending;
    const why = status === "revoked" ? reason.trim() || undefined : undefined;
    setPending(null);
    setBusyId(cert.id);
    try {
      const res = await fetch(`/api/certs/${encodeURIComponent(cert.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason: why }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed.");
      setCerts((prev) => prev.map((c) => (c.id === cert.id ? data.cert : c)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  const q = filter.trim().toLowerCase();
  const filtered = certs.filter(
    (c) =>
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q),
  );
  const active = certs.filter((c) => c.status === "active").length;

  const rows = filtered.map((c) => ({
    key: c.id,
    cells: {
      id: c.id,
      name: <span className="sign text-(--fg)">{c.name}</span>,
      role: certificateRoles[c.role]?.label ?? c.role,
      issued: c.issuedOn,
      status: c.status === "active" ? <Badge tone="live">Active</Badge> : <Badge tone="accent">Revoked</Badge>,
      actions: (
        <span className="-mx-3 flex flex-wrap items-center gap-0 md:justify-end">
          <a href={`/verify/${c.id}`} target="_blank" rel="noopener noreferrer" className={toolButton("quiet")}>
            View <External />
          </a>
          <CopyLinkButton text={`/verify/${c.id}`} label="Copy" variant="quiet" />
          <button
            type="button"
            disabled={busyId === c.id}
            onClick={() => ask(c, c.status === "active" ? "revoked" : "active")}
            className={toolButton("quiet")}
          >
            {busyId === c.id ? "Saving…" : c.status === "active" ? "Revoke" : "Restore"}
          </button>
        </span>
      ),
    },
  }));

  return (
    <Container className="py-10 pb-40 lg:py-16 lg:pb-40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="t-title">Registry</h1>
          <p className="mt-2 text-sm text-(--fg-muted)">
            {loading ? (
              "Checking…"
            ) : (
              <>
                <span className="tabular-nums">{certs.length}</span> issued · <span className="tabular-nums">{active}</span> active ·{" "}
                <span className="tabular-nums">{certs.length - active}</span> revoked. Every change commits to data/certificates.json.
              </>
            )}
          </p>
        </div>
        <Link href="/certificate" className={toolButton("primary", "self-start sm:self-auto")}>
          <Plus /> New certificate
        </Link>
      </div>

      <div className="mt-8 flex items-end gap-2">
        <Field
          label="Filter"
          placeholder="Filter by ID, name, role or status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="min-w-0 flex-1"
        />
        <button type="button" onClick={load} disabled={loading} className={toolButton("secondary")} aria-label="Refresh">
          <Refresh className={loading ? "animate-spin motion-reduce:animate-none" : undefined} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="mt-6 flex gap-3 border-l-[3px] border-(--fg-muted) bg-(--surface-2) p-4">
          <Alert className="mt-0.5 shrink-0 text-(--fg-muted)" />
          <p className="min-w-0 text-sm break-words text-(--fg-muted)">{error}</p>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="border-t border-(--line) py-8 text-sm text-(--fg-muted)">Checking…</p>
        ) : filtered.length === 0 ? (
          <p className="border-t border-(--line) py-8 text-sm text-(--fg-muted)">
            {certs.length === 0 ? "No certificates yet." : "Nothing matches that filter."}
          </p>
        ) : (
          <Ledger columns={columns} rows={rows} caption="Certificates" />
        )}
      </div>

      {pending && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-(--line) bg-(--surface) shadow-(--shadow-lg)" role="alertdialog" aria-label="Confirm change">
          <Container className="flex flex-col gap-3 py-4 md:flex-row md:items-end">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-(--fg)">
                {pending.status === "revoked" ? "Revoke" : "Restore"} <span className="font-mono">{pending.cert.id}</span> for{" "}
                <span className="sign">{pending.cert.name}</span>?
                {pending.status === "active" && <span className="text-(--fg-muted)"> It becomes valid again.</span>}
              </p>
              {pending.status === "revoked" && (
                <Field
                  label="Reason (optional, shown on the verify page)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setPending(null)}
                  autoFocus
                  className="mt-3"
                />
              )}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={confirm} className={toolButton("primary")} autoFocus={pending.status === "active"}>
                {pending.status === "revoked" ? "Revoke" : "Restore"}
              </button>
              <button type="button" onClick={() => setPending(null)} className={toolButton("quiet")}>
                Cancel
              </button>
            </div>
          </Container>
        </div>
      )}

    </Container>
  );
}
