"use client";

import { useId, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "./cn";

export type Segment<T extends string> = { value: T; label: React.ReactNode; count?: number };

/**
 * Tabs-style control with a spring pill. Arrow keys move the selection (roving tabindex).
 * `wrap` lets it break onto several lines (the bench's repo chips). In .tone-inverse the tokens re-point by themselves.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  wrap,
  className,
}: {
  options: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  /** accessible name for the group */
  label: string;
  wrap?: boolean;
  className?: string;
}) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "inline-flex max-w-full gap-1 rounded-(--radius-sm) bg-(--surface-2) p-1",
        wrap ? "flex-wrap" : "overflow-x-auto",
        className,
      )}
    >
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[calc(var(--radius-sm)-4px)] px-3 text-sm font-medium whitespace-nowrap",
              "transition-colors duration-(--d-2) ease-(--ease-ui)",
              selected ? "text-(--fg)" : "text-(--fg-muted) hover:text-(--fg)",
            )}
          >
            {selected && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-[inherit] bg-(--surface) shadow-(--shadow-sm)"
                transition={{ type: "spring", duration: 0.35, bounce: 0 }}
              />
            )}
            <span className="relative">{o.label}</span>
            {o.count !== undefined && <span className="relative font-mono text-xs tabular-nums text-(--fg-subtle)">{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
