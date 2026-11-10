"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "./cn";
import { LabButton } from "./lab-hero/LabButton";

export type NavLink = {
  label: string;
  href: string;
  /** On Home, the link scrolls to this section id and the marker follows the section in view. */
  section?: string;
};

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);
const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)";

/**
 * Sticky site nav: logo + wordmark, mono labels with a sliding teal marker,
 * a plain stars label and the primary button. On Home it is fixed (takes no space) and hidden while the [data-under-nav] hero
 * is in view, so the field owns the whole screen; it slides in past the hero, or as soon as keyboard focus enters it.
 * Elsewhere it is sticky and always shown. Below 768 the links move into a modal sheet (Escape closes it).
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
  // Home renders hidden from the server (the page loads at the top, over the hero); the observer corrects it from there.
  const [overHero, setOverHero] = useState(true);
  // Keyboard focus (focus-visible only, so a clicked #link doesn't pin it open over the hero) reveals it.
  const [focused, setFocused] = useState(false);
  const hidden = home && overHero && !focused && !open;

  useEffect(() => {
    const hero = document.querySelector("[data-under-nav]");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setOverHero(e.isIntersecting), { rootMargin: "-64px 0px 0px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, [path]);

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
    // The sheet is modal: the page behind it doesn't scroll.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const hrefFor = (l: NavLink) => (home && l.section ? `#${l.section}` : l.href);
  const activeFor = (l: NavLink) => (home ? !!l.section && section === l.section : isActive(path, l.href));

  return (
    <>
      <header
        aria-hidden={hidden || undefined}
        onFocus={(e) => e.target.matches(":focus-visible") && setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
        className={cn(
          "top-0 z-50 bg-(--bg)/88 shadow-[0_1px_0_var(--line)] backdrop-blur-md backdrop-saturate-[1.4] transition-[translate,opacity] duration-(--d-3) ease-(--ease-ui) motion-reduce:transition-none!",
          home ? "fixed inset-x-0" : "sticky",
          hidden && "pointer-events-none -translate-y-full opacity-0",
        )}
      >
        <nav aria-label="Main" className="mx-auto flex h-16 w-full max-w-(--container) items-center gap-3 px-(--gutter) font-mono text-[13px]">
          <Link href="/" aria-label={`${brand.name}, home`} className={cn(focus, "mr-auto flex items-center gap-2.5 md:mr-6")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo} alt="" width={24} height={24} className="size-6 rounded-md" />
            <span className="font-medium tracking-[0.02em] whitespace-nowrap text-(--fg)">{brand.name}</span>
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
          {/* Below 640 the wordmark needs the room; the sheet carries the button. */}
          <LabButton href={contribute.href} size="sm" className="max-sm:hidden">
            {contribute.label}
          </LabButton>

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
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
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
            <LabButton href={contribute.href} onClick={() => setOpen(false)} className="mt-auto w-full">
              {contribute.label}
            </LabButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
