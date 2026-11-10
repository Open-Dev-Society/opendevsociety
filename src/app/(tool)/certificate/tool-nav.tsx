"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/site";

const links = [
  { label: "Manage", href: "/certificate/manage" },
  { label: "New", href: "/certificate" },
];
const item = "relative inline-flex h-11 items-center px-2.5 font-mono text-[13px] transition-colors duration-(--d-2) ease-(--ease-ui)";

/** Manage · New · Sign out. Hidden on the login page, where there's nothing to manage yet. */
export function ToolNav() {
  const pathname = usePathname();
  if (pathname === "/certificate/login") return null;

  async function signOut() {
    await fetch("/api/cert-auth", { method: "DELETE" });
    window.location.href = "/certificate/login";
  }

  return (
    <nav aria-label="Certificates" className="-mr-2.5 flex items-center">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={pathname === l.href ? "page" : undefined}
          className={cn(item, pathname === l.href ? "text-(--fg)" : "text-(--fg-muted) hover:text-(--fg)")}
        >
          {pathname === l.href && <span aria-hidden className="absolute inset-x-2.5 bottom-1.5 h-0.5 bg-(--accent-brand)" />}
          {l.label}
        </Link>
      ))}
      <span aria-hidden className="text-(--fg-subtle)">
        ·
      </span>
      <button type="button" onClick={signOut} className={cn(item, "text-(--fg-muted) hover:text-(--fg)")}>
        Sign out
      </button>
    </nav>
  );
}
