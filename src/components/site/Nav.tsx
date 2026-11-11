"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Close, Menu } from "./Icon";
import { cn } from "./cn";
import { LabButton } from "./lab-hero/LabButton";

export type NavLink = { label: string; href: string };

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);
const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)";
// A title-block cell: full bar height, a hairline on its left.
const cell = "flex h-full shrink-0 items-center border-l border-(--line) px-4";

type Here = { letter: string; name: string };

// The section under the viewport centre, lettered like the rails (Rails.tsx): [data-grid] sections below the home hero, A, B, C…
function sectionHere(): Here | null {
  const hero = document.querySelector("[data-under-nav]");
  const start = hero ? hero.getBoundingClientRect().bottom : -Infinity;
  const refs = [...document.querySelectorAll<HTMLElement>("[data-grid]")].filter((el) => el.getBoundingClientRect().top >= start - 1);
  if (!refs.length) return null;
  let i = 0;
  refs.forEach((el, j) => el.getBoundingClientRect().top <= innerHeight / 2 && (i = j));
  return { letter: String.fromCharCode(65 + i), name: refs[i].dataset.grid ?? "" };
}

/**
 * The site nav as a drawing sheet's title block: hairline-divided cells for the name, the pages (one segmented track, an ink thumb on
 * the current page), a live "you are here" readout of the rails' section letter, the stars and the button. Fixed height (64px).
 * On Home it is fixed (takes no space) and hidden while the [data-under-nav] hero is in view, so the field owns the whole screen; it
 * slides in past the hero, or as soon as keyboard focus enters it. Elsewhere it is sticky and always shown; it frosts once the page
 * scrolls under it. Below 1024 the links move into a modal sheet (Escape closes it).
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
  // Home renders hidden from the server (the page loads at the top, over the hero); the observer corrects it from there.
  const [overHero, setOverHero] = useState(true);
  // Keyboard focus (focus-visible only, so a clicked #link doesn't pin it open over the hero) reveals it.
  const [focused, setFocused] = useState(false);
  const hidden = home && overHero && !focused && !open;
  const [scrolled, setScrolled] = useState(false);
  const [here, setHere] = useState<Here | null>(null);
  const current = links.find((l) => isActive(path, l.href));

  useEffect(() => {
    const hero = document.querySelector("[data-under-nav]");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setOverHero(e.isIntersecting), { rootMargin: "-64px 0px 0px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, [path]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(scrollY > 0);
      const h = sectionHere();
      setHere((p) => (p?.letter === h?.letter && p?.name === h?.name ? p : h));
    };
    const onScroll = () => {
      raf ||= requestAnimationFrame(update);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [path]);

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

  return (
    <MotionConfig reducedMotion="user">
      <header
        aria-hidden={hidden || undefined}
        onFocus={(e) => e.target.matches(":focus-visible") && setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
        className={cn(
          "top-0 z-50 shadow-[0_1px_0_var(--line)] transition-[translate,opacity,background-color] duration-(--d-3) ease-(--ease-ui) motion-reduce:transition-none!",
          home ? "fixed inset-x-0" : "sticky",
          scrolled || open ? "bg-(--bg)/85 backdrop-blur-md backdrop-saturate-[1.4]" : "bg-(--bg)",
          hidden && "pointer-events-none -translate-y-full opacity-0",
        )}
      >
        <nav aria-label="Main" className="mx-auto flex h-16 w-full max-w-(--container) items-center px-(--gutter) font-mono text-[13px]">
          <Link href="/" aria-label={`${brand.name}, home`} className={cn(focus, "flex h-full min-w-0 shrink-0 items-center gap-3 pr-5")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo} alt="" width={28} height={28} className="size-7" />
            <span className="flex flex-col gap-1 leading-none whitespace-nowrap">
              <span className="text-[17px] font-[800] tracking-[-0.01em] text-(--fg) [font-stretch:75%]">{brand.name}</span>
              <span className="text-[10px] tracking-[0.04em] text-(--fg-subtle)">free, open source</span>
            </span>
          </Link>

          <div className={cn(cell, "hidden lg:flex")}>
            <ul className="flex h-11 shadow-[inset_0_0_0_1px_var(--line)]">
              {links.map((l) => {
                const active = l === current;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        focus,
                        "relative flex h-11 items-center px-3.5 whitespace-nowrap transition-colors duration-(--d-2)",
                        active ? "text-(--bg)" : "text-(--fg-muted) hover:text-(--fg)",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="site-nav-thumb"
                          aria-hidden
                          className="absolute inset-1 bg-(--fg)"
                          transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                        />
                      )}
                      <span className="relative">{l.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* You are here: the rails' letter for the section at the viewport centre, or the page's name. */}
          <div aria-hidden className={cn(cell, "hidden min-w-0 flex-1 flex-col items-start justify-center gap-1 md:flex lg:hidden xl:flex")}>
            <span className="flex items-center gap-1.5 text-[10px] tracking-[0.04em] text-(--fg-subtle)">
              <i className="size-1.5 bg-(--mark)" />
              you are here
            </span>
            <span className="flex max-w-full min-w-0 items-center gap-2 text-[12px] leading-none text-(--fg)">
              {here?.letter && (
                <span className="grid size-4 shrink-0 place-items-center text-[10px] shadow-[inset_0_0_0_1px_var(--fg-subtle)]">{here.letter}</span>
              )}
              <span className="truncate">{here?.name || current?.label || "Home"}</span>
            </span>
          </div>
          <span className="flex-1 md:hidden xl:hidden lg:flex" />

          <a
            href={stars.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${stars.label} stars on GitHub`}
            className={cn(focus, cell, "hidden flex-col items-start justify-center gap-1 transition-colors duration-(--d-2) hover:bg-(--surface-2) xl:flex")}
          >
            <span className="text-[10px] tracking-[0.04em] text-(--fg-subtle)">on GitHub</span>
            <span className="text-[12px] leading-none text-(--fg) tabular-nums">
              {stars.label}&nbsp;<span aria-hidden>★</span>
            </span>
          </a>

          {/* Below 640 the wordmark needs the room; the sheet carries the button. */}
          <div className={cn(cell, "pr-0 max-sm:hidden lg:pr-0")}>
            <LabButton href={contribute.href} size="md">
              {contribute.label}
            </LabButton>
          </div>

          <div className={cn(cell, "-mr-2.5 pr-0 pl-1.5 lg:hidden")}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="site-sheet"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className={cn(focus, "grid size-11 place-items-center text-(--fg)")}
            >
              {open ? <Close size={20} /> : <Menu size={20} />}
            </button>
          </div>
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
            className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto bg-(--bg) px-(--gutter) pb-8 pt-4 lg:hidden"
          >
            <ul className="flex flex-col font-mono">
              {links.map((l, i) => (
                <li key={l.href} className="border-b border-(--line)">
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={l === current ? "page" : undefined}
                    className={cn(focus, "flex items-baseline gap-4 py-4 text-[22px] text-(--fg) aria-[current]:text-(--accent)")}
                  >
                    <span aria-hidden className="text-[12px] text-(--fg-subtle) tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l.label}
                    {l === current && (
                      <span aria-hidden className="ml-auto flex items-center gap-1.5 self-center text-[11px] text-(--fg-subtle)">
                        <i className="size-1.5 bg-(--mark)" />
                        you are here
                      </span>
                    )}
                  </Link>
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
    </MotionConfig>
  );
}
