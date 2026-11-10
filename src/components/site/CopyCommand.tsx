"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { cn } from "./cn";

/** A one-line shell command with a copy button (copy → check morph). */
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
        "flex h-12 max-w-full items-center gap-2 rounded-full bg-(--surface-2) pl-5 pr-1.5 font-mono text-[13px] text-(--fg) shadow-[inset_0_0_0_1px_var(--line)]",
        className,
      )}
    >
      <code className="min-w-0 truncate">
        <span className="select-none text-(--accent)">$ </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="ml-auto grid size-10 shrink-0 place-items-center rounded-full text-(--fg-muted) transition-[background-color,color,scale] duration-150 hover:bg-(--surface) hover:text-(--fg) active:scale-[0.96]"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={copied ? "check" : "copy"}
            className="grid place-items-center"
            initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            {copied ? <Check className="size-4 text-(--accent)" /> : <Copy className="size-4" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
