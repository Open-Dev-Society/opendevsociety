"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Field } from "@/components/site";
import { toolButton } from "@/components/site/certificate/actions";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  // Only same-site paths: the middleware sets this, but anyone can craft the link.
  const raw = params.get("from") || "";
  const from = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/certificate";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/cert-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Sign-in failed.");
      router.replace(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100dvh-8rem)] place-items-center px-(--gutter) py-16">
      <Card className="w-full max-w-[400px]">
        <h1 className="t-title">Sign in to issue certificates</h1>
        <p className="mt-2 text-sm text-(--fg-muted)">The certificate tool is private. Enter the access key to continue.</p>
        <form onSubmit={onSubmit} className="mt-6">
          <Field
            label="Access key"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            error={error ?? undefined}
          />
          <button type="submit" disabled={submitting || !password} className={toolButton("primary", "mt-5 w-full")}>
            {submitting ? "Checking…" : "Sign in"}
          </button>
        </form>
        <p className="t-meta mt-4 text-(--fg-subtle)">You stay signed in for 30 days on this device.</p>
      </Card>
    </div>
  );
}

export default function CertificateLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
