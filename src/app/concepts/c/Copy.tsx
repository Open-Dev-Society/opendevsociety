"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

export function useCopy() {
  const [copied, setCopied] = useState(false);
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); the text stays selectable.
    }
  }
  return { copied, copy };
}

// Copy → check morph: scale 0.25→1, blur 4→0, spring with no bounce.
export function CopyIcon({ copied, className = "size-4" }: { copied: boolean; className?: string }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={copied ? "check" : "copy"}
        className="grid place-items-center"
        initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      >
        {copied ? <Check className={`${className} text-[#9fd49f]`} /> : <Copy className={className} />}
      </motion.span>
    </AnimatePresence>
  );
}

export function CopyChip({ text }: { text: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={copied ? "Copied" : `Copy: ${text}`}
      className="group inline-flex h-12 max-w-full items-center gap-3 rounded-full bg-white/[0.06] pl-5 pr-2 font-mono text-[13px] text-white/80 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)] transition-[background-color,scale] duration-150 hover:bg-white/10 active:scale-[0.96]"
    >
      <span className="truncate">
        <span className="select-none text-(--accent)">$ </span>
        {text}
      </span>
      <span className="grid size-8 shrink-0 place-items-center rounded-full text-white/60 group-hover:text-white">
        <CopyIcon copied={copied} />
      </span>
    </button>
  );
}
