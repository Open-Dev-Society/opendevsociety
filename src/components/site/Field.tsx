"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, ArrowRight } from "@/components/site/Icon";
import { cn } from "./cn";

/** 44px input: label above (meta), optional prefix (e.g. "@"), error below in muted text with an icon. Never red. */
export function Field({
  label,
  prefix,
  error,
  mono,
  className,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; prefix?: string; error?: string; mono?: boolean }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="t-meta mb-1.5 block text-(--fg-muted)">
        {label}
      </label>
      <div className="flex h-11 items-center rounded-(--radius-sm) bg-(--surface) shadow-(--shadow-sm) focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--focus)">
        {prefix && <span className="pl-3 font-mono text-[15px] text-(--fg-subtle)">{prefix}</span>}
        <input
          id={id}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] text-(--fg) outline-none placeholder:text-(--fg-subtle)",
            prefix && "pl-1",
            mono && "font-mono",
          )}
          {...input}
        />
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-sm text-(--fg-muted)">
          <Alert className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** Footer form: a certificate ID that routes to /verify/[id]. */
export function VerifyForm() {
  const router = useRouter();
  const [id, setId] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = id.trim();
        if (v) router.push(`/verify/${encodeURIComponent(v)}`);
      }}
      className="flex items-end gap-2"
    >
      <Field label="Verify a certificate" placeholder="ODS-2026-…" value={id} onChange={(e) => setId(e.target.value)} mono className="min-w-0 flex-1" />
      <button
        type="submit"
        aria-label="Verify certificate"
        className="grid size-11 shrink-0 place-items-center rounded-(--radius-sm) bg-(--surface) text-(--fg) shadow-(--shadow-sm) transition-[background-color,scale] duration-(--d-2) hover:bg-(--surface-2) active:scale-[0.97]"
      >
        <ArrowRight />
      </button>
    </form>
  );
}
