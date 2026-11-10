"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/certificate";
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
      if (!res.ok) throw new Error(data?.error || "Authentication failed.");
      router.replace(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
      setSubmitting(false);
    }
  }

  return (
    <section className="px-8 py-20 border-b border-dashed border-gray-300 min-h-[70vh]">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 bg-[var(--color-brand-rose)] rounded-full animate-pulse-slow"></span>
          <span className="text-mono text-[var(--color-brand-rose)]">
            // RESTRICTED_ACCESS
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif italic mb-3 leading-tight tracking-tight">
          Operator <span className="not-italic font-bold">Auth.</span>
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          The certificate generator is private. Enter the access key to continue.
        </p>

        <form
          onSubmit={onSubmit}
          className="border border-dashed border-gray-300 p-6 bg-gray-50"
        >
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
              <Lock className="w-3 h-3" /> ACCESS_KEY
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full bg-white border border-black px-4 py-2.5 font-mono text-sm tracking-wider focus:outline-none focus:border-[var(--color-brand-teal)]"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="mt-4 font-mono text-[11px] uppercase tracking-widest text-[var(--color-brand-rose)]">
              // ERROR: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="btn-tech w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? (
              <>AUTHENTICATING...</>
            ) : (
              <>
                AUTHENTICATE <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mt-6 text-center">
          // SESSION_PERSISTS_30_DAYS
        </p>
      </div>
    </section>
  );
}

export default function CertificateLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
