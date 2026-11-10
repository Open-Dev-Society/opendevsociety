"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/site";

const links = [
  { label: "Manage", href: "/certificate/manage" },
  { label: "New", href: "/certificate" },
];
const item = "inline-flex h-11 items-center rounded-(--radius-sm) px-2.5 text-sm font-medium transition-colors duration-(--d-2) ease-(--ease-ui)";

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
