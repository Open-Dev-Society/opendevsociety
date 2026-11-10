"use client";

import { useState } from "react";

/** A LabButton-styled (secondary, sm) copy action; the text stays selectable if the clipboard is blocked. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {}
      }}
      className="inline-flex min-h-9 min-w-[9.5rem] items-center justify-center rounded-[2px] bg-(--bg) px-3.5 py-2 font-mono text-[13px] leading-none whitespace-nowrap text-(--fg) shadow-[inset_0_0_0_1px_var(--fg)] transition-[translate,background-color,color] duration-(--d-2) ease-(--ease-ui) hover:bg-(--fg) hover:text-(--bg) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus) active:translate-y-px"
    >
      <span aria-live="polite">{done ? "Copied ✓" : label}</span>
    </button>
  );
}
