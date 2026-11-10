"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { cn } from "./cn";

/** A one-line shell command chip with copy → check. Truncates under a fade mask; never wraps. */
export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); the command stays selectable.
    }
  }

  return (
    <div
      className={cn(
        "flex h-11 w-full max-w-full min-w-0 items-center rounded-(--radius-sm) bg-(--surface) pl-4 font-mono text-[13px] text-(--fg) shadow-(--shadow-sm) sm:w-auto",
        className,
      )}
    >
      <code className="min-w-0 flex-1 overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)]">
        <span className="select-none text-(--fg-subtle)">$ </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : `Copy command: ${command}`}
        className="grid size-11 shrink-0 place-items-center rounded-(--radius-sm) text-(--fg-muted) transition-[color,scale] duration-(--d-2) ease-(--ease-ui) hover:text-(--fg) active:scale-[0.97]"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={copied ? "check" : "copy"}
            className="grid place-items-center"
            initial={{ opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
          >
            {copied ? <Check className="size-4 text-(--live)" /> : <Copy className="size-4" strokeWidth={1.75} />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
