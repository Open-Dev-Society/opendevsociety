"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Star, X } from "lucide-react";
import { cn } from "./cn";

export type NavLink = {
  label: string;
  href: string;
  /** On Home, the link scrolls to this section id and the pill follows the section in view. */
  section?: string;
};

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

/**
 * Sticky site nav (brief §9): logo, links with a spring pill, a stars chip and the Contribute button.
 * Below 768 the links move into a full-height sheet that closes on route change and Escape.
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
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 8);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  // Home: the pill follows the section in view.
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
      <header
        className={cn(
          "sticky top-0 z-50 bg-(--bg)/82 backdrop-blur-md backdrop-saturate-[1.4] transition-shadow duration-(--d-2)",
          (scrolled || open) && "shadow-[0_1px_0_var(--line)]",
        )}
      >
        <nav aria-label="Main" className="mx-auto flex h-16 w-full max-w-(--container) items-center gap-3 px-(--gutter)">
          <Link href="/" className="mr-auto flex items-center gap-2.5 rounded-(--radius-sm) md:mr-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo} alt="" width={24} height={24} className="size-6 rounded-md" />
            <span className="text-[15px] font-semibold text-(--fg) [font-variation-settings:'wdth'_104]">{brand.name}</span>
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
                      "relative block rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-(--d-2)",
                      active ? "text-(--fg)" : "text-(--fg-muted) hover:text-(--fg)",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="site-nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-(--surface-2)"
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
            className="ml-auto hidden h-9 items-center gap-1.5 rounded-(--radius-sm) bg-(--surface) px-3 font-mono text-[13px] tabular-nums text-(--fg) shadow-(--shadow-sm) transition-colors duration-(--d-2) hover:bg-(--surface-2) md:inline-flex"
          >
            <Star className="size-3.5" strokeWidth={1.75} />
            {stars.label}
          </a>
          <a
            href={contribute.href}
            className="inline-flex h-10 items-center rounded-full bg-(--accent) px-4 text-sm font-medium text-(--accent-fg) shadow-[inset_0_1px_0_oklch(1_0_0/0.18)] transition-[background-color,scale] duration-(--d-2) ease-(--ease-ui) hover:bg-(--accent-hover) active:scale-[0.97] md:h-11 md:px-5 md:text-[15px]"
          >
            {contribute.label}
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-sheet"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2.5 grid size-11 place-items-center rounded-full text-(--fg) md:hidden"
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
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={hrefFor(l)} onClick={() => setOpen(false)} className="display-3 block py-3 text-(--fg)">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[15px] text-(--fg-muted)">
              <a href={stars.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono tabular-nums text-(--fg)">
                <Star className="size-4" strokeWidth={1.75} />
                {stars.label}
              </a>
              {socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="min-h-11 content-center hover:text-(--fg)">
                  {s.label}
                </a>
              ))}
            </div>
            <a
              href={contribute.href}
              onClick={() => setOpen(false)}
              className="mt-auto inline-flex h-13 items-center justify-center rounded-full bg-(--accent) text-[15px] font-medium text-(--accent-fg)"
            >
              {contribute.label}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
