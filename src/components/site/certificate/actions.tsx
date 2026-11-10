"use client";

import { useState } from "react";
import { Check, Download, Link2 } from "lucide-react";
import { cn } from "../cn";
import { labButton } from "../lab-hero/LabButton";

type Variant = "primary" | "secondary" | "quiet";

/** Button styling for <button>s in the tool pages: LabButton's square classes; quiet is a bare mono text button. */
export const toolButton = (variant: Variant = "secondary", className?: string) =>
  cn(
    variant === "quiet"
      ? "inline-flex min-h-11 items-center justify-center rounded-[2px] px-3 font-mono text-[13px] whitespace-nowrap text-(--fg-muted) transition-colors duration-(--d-2) hover:text-(--fg) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)"
      : labButton(variant, "md"),
    "shrink-0 gap-1.5 disabled:pointer-events-none disabled:opacity-60",
    className,
  );

/**
 * Brief §12: clone .cert-document into #cert-print-clone on <body>, add body.printing-cert, print.
 * The @media print block in globals.css turns that clone into exactly one A4 landscape page.
 */
export function printCertificate() {
  const cert = document.querySelector(".cert-document") as HTMLElement | null;
  if (!cert) {
    window.print();
    return;
  }
  document.getElementById("cert-print-clone")?.remove();

  const clone = cert.cloneNode(true) as HTMLElement;
  clone.id = "cert-print-clone";
  clone.querySelectorAll<HTMLElement>("[contenteditable]").forEach((el) => el.removeAttribute("contenteditable"));

  document.body.appendChild(clone);
  document.body.classList.add("printing-cert");

  const cleanup = () => {
    clone.remove();
    document.body.classList.remove("printing-cert");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  requestAnimationFrame(() => {
    setTimeout(() => window.print(), 50);
  });
}

export function DownloadButton({ variant = "secondary", className }: { variant?: Variant; className?: string }) {
  return (
    <button type="button" onClick={printCertificate} className={toolButton(variant, className)}>
      <Download className="size-4" strokeWidth={1.75} /> Download PDF
    </button>
  );
}

/** Copies `text` as an absolute URL (a path is fine; default: this page). If the clipboard is blocked, says so inline instead of a prompt(). */
export function CopyLinkButton({ text, label = "Copy link", variant = "secondary", className }: { text?: string; label?: string; variant?: Variant; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(new URL(text ?? "", window.location.href).href);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  }
  return (
    <button type="button" onClick={copy} className={toolButton(variant, className)} aria-live="polite">
      {state === "copied" ? <Check className="size-4" strokeWidth={1.75} /> : <Link2 className="size-4" strokeWidth={1.75} />}
      {state === "copied" ? "Copied" : state === "failed" ? "Couldn't copy" : label}
    </button>
  );
}
