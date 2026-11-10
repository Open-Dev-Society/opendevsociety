"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "./cn";

// Shared across tooltips: while one is open (or closed < 150ms ago), the next opens at once with no entrance,
// so sweeping across the wall swaps the label instead of replaying the animation.
let warmUntil = 0;
const isWarm = () => Date.now() < warmUntil;

/**
 * Inverse label on hover or keyboard focus (brief §9). Mouse only: touch taps go straight to the child's link.
 * The child is wrapped in a `relative` block, so give it `className` to take part in a grid.
 */
export function Tooltip({
  content,
  children,
  className,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const [shift, setShift] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tip = useRef<HTMLDivElement>(null);

  function show(delay: number) {
    clearTimeout(timer.current);
    const warm = isWarm();
    timer.current = setTimeout(() => {
      setInstant(warm);
      setOpen(true);
    }, warm ? 0 : delay);
  }
  function hide() {
    clearTimeout(timer.current);
    warmUntil = Date.now() + 150;
    setOpen(false);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  // Keep the label inside the viewport (seats at the wall's edges): measure, then nudge sideways.
  useLayoutEffect(() => {
    if (!open || !tip.current) return;
    const r = tip.current.getBoundingClientRect();
    const pad = 8;
    const natural = r.left - shift;
    const right = natural + r.width;
    setShift(natural < pad ? pad - natural : right > window.innerWidth - pad ? window.innerWidth - pad - right : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- measuring once per open
  }, [open]);

  return (
    <div
      className={cn("relative", className)}
      onPointerEnter={(e) => e.pointerType === "mouse" && show(80)}
      onPointerLeave={hide}
      onFocus={(e) => e.target.matches(":focus-visible") && show(0)}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && hide()}
    >
      <div aria-describedby={open ? id : undefined} className="contents">
        {children}
      </div>
      {open && (
        <div
          ref={tip}
          id={id}
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 w-max max-w-[260px]"
          style={{ translate: `calc(-50% + ${shift}px) 0` }}
        >
          <motion.div
            initial={instant ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-(--radius-sm) bg-(--inv-bg) px-2.5 py-2 text-[13px] leading-[1.4] text-(--inv-fg) shadow-(--shadow-md)"
          >
            {content}
          </motion.div>
        </div>
      )}
    </div>
  );
}
