"use client";

import { useState } from "react";
import { Copied } from "@/components/site/Icon";

/** A LabButton-styled (secondary, sm) copy action; the text stays selectable if the clipboard is blocked. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setState("copied");
          } catch {
            setState("failed");
          }
          setTimeout(() => setState("idle"), 1500);
        }}
        className="inline-flex min-h-9 min-w-[9.5rem] items-center justify-center gap-[0.5em] rounded-[2px] bg-(--bg) px-3.5 py-2 font-mono text-[13px] leading-none whitespace-nowrap text-(--fg) shadow-[inset_0_0_0_1px_var(--fg)] transition-[translate,background-color,color] duration-(--d-2) ease-(--ease-ui) hover:bg-(--fg) hover:text-(--bg) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus) active:translate-y-px motion-reduce:transition-none"
      >
        {state === "copied" ? <>Copied <Copied /></> : state === "failed" ? "Select to copy" : label}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "Copied to clipboard" : state === "failed" ? "Couldn't copy. Select the text instead." : ""}
      </span>
    </>
  );
}
