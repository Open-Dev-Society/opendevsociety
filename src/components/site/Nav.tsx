"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "./cn";

export type NavLink = {
  label: string;
  href: string;
  /** On Home, the link scrolls to this section id and the marker follows the section in view. */
  section?: string;
};

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);
const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)";
// The lab's call to action: bracketed mono text that inverts to ink on hover, never a pill.
const bracket = "inline-flex items-center font-mono text-(--fg) transition-colors duration-(--d-2) ease-(--ease-ui) hover:bg-(--fg) hover:text-(--bg)";

/**
 * Sticky site nav in the lab's instrument language: logo + ODS·LAB, mono labels with a sliding teal marker,
 * a plain stars label and a bracketed call to action. Below 768 the links move into a sheet that closes on route change and Escape.
 */
export function Nav({
  brand,
  links,
  stars,
  contribute,
  socials,
}: {
  brand: { name: string; logo: string };
  links: NavLink[];
  stars: { label: string; href: string };
  contribute: { label: string; href: string };
  socials: { label: string; href: string }[];
}) {
  const path = usePathname();
  const home = path === "/";
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  // Home: the marker follows the section in view.
  useEffect(() => {
    if (!home) return;
    const els = links.flatMap((l) => (l.section ? [document.getElementById(l.section)] : [])).filter((e): e is HTMLElement => !!e);
    const inView = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inView.add(e.target.id) : inView.delete(e.target.id)));
        setSection(els.find((el) => inView.has(el.id))?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [home, links]);

  // Close the sheet on route change (adjusted during render, no effect) and on Escape.
  const [lastPath, setLastPath] = useState(path);
  if (lastPath !== path) {
    setLastPath(path);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const hrefFor = (l: NavLink) => (home && l.section ? `#${l.section}` : l.href);
  const activeFor = (l: NavLink) => (home ? !!l.section && section === l.section : isActive(path, l.href));

  return (
    <>
      <header className="sticky top-0 z-50 bg-(--bg)/88 shadow-[0_1px_0_var(--line)] backdrop-blur-md backdrop-saturate-[1.4]">
        <nav aria-label="Main" className="mx-auto flex h-16 w-full max-w-(--container) items-center gap-3 px-(--gutter) font-mono text-[13px]">
          <Link href="/" aria-label={`${brand.name}, home`} className={cn(focus, "mr-auto flex items-center gap-2.5 md:mr-6")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo} alt="" width={24} height={24} className="size-6 rounded-md" />
            <span className="font-medium tracking-[0.02em] text-(--fg)">ODS·LAB</span>
          </Link>

          <ul className="hidden items-center md:flex">
            {links.map((l) => {
              const active = activeFor(l);
              return (
                <li key={l.href}>
                  <a
                    href={hrefFor(l)}
                    aria-current={active ? (home ? "location" : "page") : undefined}
                    className={cn(
                      focus,
                      "relative flex h-11 items-center px-3 transition-colors duration-(--d-2)",
                      active ? "text-(--fg)" : "text-(--fg-muted) hover:text-(--fg)",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="site-nav-marker"
                        className="absolute inset-x-3 bottom-1.5 h-0.5 bg-(--accent-brand)"
                        transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                      />
                    )}
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href={stars.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${stars.label} stars on GitHub`}
            className={cn(focus, "ml-auto hidden h-11 items-center px-2 tabular-nums text-(--fg-muted) transition-colors duration-(--d-2) hover:text-(--fg) md:inline-flex")}
          >
            {stars.label}&nbsp;<span aria-hidden>★</span>
          </a>
          <a href={contribute.href} className={cn(focus, bracket, "h-11 px-1")}>
            <span aria-hidden>[&nbsp;</span>
            {contribute.label}
            <span aria-hidden>&nbsp;]</span>
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-sheet"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={cn(focus, "-mr-2.5 grid size-11 place-items-center text-(--fg) md:hidden")}
          >
            {open ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
          </button>
        </nav>
      </header>

      {/* Outside <header>: its backdrop-filter would make it the containing block for this fixed sheet. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-sheet"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.2, 0, 0, 1] } }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto bg-(--bg) px-(--gutter) pb-8 pt-4 md:hidden"
          >
            <ul className="flex flex-col font-mono">
              {links.map((l, i) => (
                <li key={l.href} className="border-b border-(--line)">
                  <a
                    href={hrefFor(l)}
                    onClick={() => setOpen(false)}
                    aria-current={activeFor(l) ? (home ? "location" : "page") : undefined}
                    className={cn(focus, "flex items-baseline gap-4 py-4 text-[22px] text-(--fg) aria-[current]:text-(--accent)")}
                  >
                    <span aria-hidden className="text-[12px] text-(--fg-subtle) tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[13px] text-(--fg-muted)">
              <a href={stars.href} target="_blank" rel="noopener noreferrer" className={cn(focus, "min-h-11 content-center tabular-nums text-(--fg)")}>
                {stars.label}&nbsp;<span aria-hidden>★</span>
              </a>
              {socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className={cn(focus, "min-h-11 content-center hover:text-(--fg)")}>
                  {s.label}
                </a>
              ))}
            </div>
            <a
              href={contribute.href}
              onClick={() => setOpen(false)}
              className={cn(focus, bracket, "mt-auto h-13 justify-center text-[15px] shadow-[0_0_0_1px_var(--fg)]")}
            >
              <span aria-hidden>[&nbsp;</span>
              {contribute.label}
              <span aria-hidden>&nbsp;]</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
