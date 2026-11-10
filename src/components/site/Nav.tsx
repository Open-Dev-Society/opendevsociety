"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { Link } from "@/content";
import { cn } from "./cn";

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

/** Sticky site nav. The active route gets a sliding pill; below md the links move into a menu sheet. */
export function Nav({
  brand,
  links,
  cta,
}: {
  brand: { name: string; logo: string };
  links: Link[];
  cta?: Link;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--bg)/80 backdrop-blur-md backdrop-saturate-150">
      <nav aria-label="Main" className="mx-auto flex h-14 w-full max-w-(--container) items-center gap-4 px-(--gutter)">
        <a href="/" className="flex items-center gap-2.5 rounded-md" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={brand.logo} alt="" width={24} height={24} className="size-6 rounded-md" />
          <span className="font-display text-[15px] font-semibold text-(--fg)">{brand.name}</span>
        </a>

        <ul className="ml-auto hidden items-center md:flex">
          {links.map((l) => {
            const active = isActive(path, l.href);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative block rounded-full px-3.5 py-1.5 text-sm transition-colors duration-150",
                    active ? "text-(--fg)" : "text-(--fg-muted) hover:text-(--fg)",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="site-nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-(--surface) shadow-(--shadow-sm)"
                      transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                    />
                  )}
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        {cta && (
          <a
            href={cta.href}
            {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="ml-auto hidden h-9 items-center gap-1 rounded-full bg-(--fg) px-4 text-sm font-medium text-(--bg) transition-[opacity,scale] duration-150 hover:opacity-90 active:scale-[0.96] sm:inline-flex md:ml-2"
          >
            {cta.label}
            {cta.external && <ArrowUpRight className="size-3.5" strokeWidth={2} />}
          </a>
        )}

        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 ml-auto grid size-11 place-items-center rounded-full text-(--fg) sm:ml-0 md:hidden"
        >
          {open ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
        </button>
      </nav>

      {open && (
        <div id="site-mobile-nav" className="border-t border-(--line) px-(--gutter) pb-4 md:hidden">
          <ul className="divide-y divide-(--line)">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={isActive(path, l.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[15px] font-medium text-(--fg) aria-[current=page]:text-(--accent)"
                >
                  {l.label}
                </a>
              </li>
            ))}
            {cta && (
              <li>
                <a href={cta.href} className="flex items-center gap-1 py-3 text-[15px] font-medium text-(--fg)">
                  {cta.label} {cta.external && <ArrowUpRight className="size-4" />}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
