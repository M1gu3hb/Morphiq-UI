"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Timeline
 *
 * A vertical, semantic timeline built from a real ordered list. Order is carried
 * by the `<ol>`/`<li>` structure, each event stamps a machine-readable
 * `<time dateTime>`, and status (done / current / upcoming) is conveyed by a
 * marker shape AND a text tag — never by colour alone. Markers and connectors
 * are `aria-hidden` decoration; the list content is the authoritative source,
 * and an `sr-only` aggregate summary precedes it.
 *
 * Agnostic material: this component ships a single adaptive style that follows
 * the colour scheme (light / dark). `material` is accepted for catalog parity
 * and only reflected on `data-material`.
 *
 * Self-contained by design: every token lives on the list itself, and every
 * `var()` use carries a literal fallback, so copying this file (plus
 * `src/lib/cn.ts`) reproduces the full look with no global stylesheet.
 *
 * Local theming knobs (declared on the `<ol>`, inherited by its parts):
 *
 *   --mq-tl-surface      list surface
 *   --mq-tl-text         primary title text
 *   --mq-tl-muted        timestamp + description text
 *   --mq-tl-border       surface + tag border
 *   --mq-tl-line         unfinished connector (dashed)
 *   --mq-tl-line-done     finished connector (solid)
 *   --mq-tl-done         done marker fill
 *   --mq-tl-done-text    content on a done marker
 *   --mq-tl-current      current marker accent
 *   --mq-tl-upcoming     upcoming marker + dashed ring
 *   --mq-tl-marker-shadow filled-marker depth
 */

/** Accepted only for catalog parity; the visual style is a single adaptive one. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/** Visually-hidden but readable: an off-screen box that stays in the a11y tree. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

export type TimelineStatus = "done" | "current" | "upcoming";
export type TimelineVariant = "default";
export type TimelineSize = "sm" | "md" | "lg";

const timelineVariants = cva(
  [
    "m-0 flex w-full list-none flex-col",
    "rounded-[var(--mq-tl-radius,20px)] border p-[var(--mq-tl-pad,20px)]",
    // Light palette. Kept on the list so every part inherits it without context.
    "[--mq-tl-surface:#ffffff] [--mq-tl-text:#191a18] [--mq-tl-muted:#55574e]",
    "[--mq-tl-border:rgba(23,24,23,0.12)] [--mq-tl-line:#8f8e86] [--mq-tl-line-done:#3a3b36]",
    "[--mq-tl-done:#232823] [--mq-tl-done-text:#ffffff]",
    "[--mq-tl-current:#2358c8] [--mq-tl-upcoming:#7b7a72]",
    "[--mq-tl-marker-shadow:0_1px_2px_rgba(20,20,18,0.16),0_2px_5px_rgba(20,20,18,0.10)]",
    "[--mq-tl-shadow:0_1px_2px_rgba(20,20,18,0.08),0_10px_26px_rgba(20,20,18,0.07)]",
    "bg-[var(--mq-tl-surface,#ffffff)] text-[color:var(--mq-tl-text,#191a18)]",
    "border-[var(--mq-tl-border,rgba(23,24,23,0.12))] shadow-[var(--mq-tl-shadow,0_10px_26px_rgba(20,20,18,0.07))]",
    // Dark palette follows prefers-color-scheme, safe because the surface is
    // opaque and flips together with the text on it.
    "dark:[--mq-tl-surface:#1b1c1f] dark:[--mq-tl-text:#f4f2ec] dark:[--mq-tl-muted:#b7b5ae]",
    "dark:[--mq-tl-border:rgba(255,255,255,0.14)] dark:[--mq-tl-line:#6c6b63] dark:[--mq-tl-line-done:#cfcdc6]",
    "dark:[--mq-tl-done:#f4f2ec] dark:[--mq-tl-done-text:#17181b]",
    "dark:[--mq-tl-current:#7ea8ff] dark:[--mq-tl-upcoming:#86857d]",
    "dark:[--mq-tl-marker-shadow:0_1px_2px_rgba(0,0,0,0.55),0_2px_5px_rgba(0,0,0,0.45)]",
    "dark:[--mq-tl-shadow:0_1px_2px_rgba(0,0,0,0.5),0_12px_28px_rgba(0,0,0,0.5)]",
    // Fills and shadows are discarded in forced colours; a system border keeps
    // the list's bounds and its surface readable.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      // Single visual variant; declared so the axis exists for catalog parity.
      variant: { default: "" },
      size: {
        sm: "[--mq-tl-marker:22px] [--mq-tl-gap:16px] [--mq-tl-radius:16px] [--mq-tl-pad:16px] gap-[var(--mq-tl-gap,16px)]",
        md: "[--mq-tl-marker:28px] [--mq-tl-gap:22px] [--mq-tl-radius:20px] [--mq-tl-pad:20px] gap-[var(--mq-tl-gap,22px)]",
        lg: "[--mq-tl-marker:34px] [--mq-tl-gap:28px] [--mq-tl-radius:24px] [--mq-tl-pad:26px] gap-[var(--mq-tl-gap,28px)]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const ITEM_CLASS = [
  "relative grid items-start",
  "grid-cols-[var(--mq-tl-marker,28px)_minmax(0,1fr)] gap-x-[14px]",
  // Subtle staggered reveal. The resting/base state IS the final value, so
  // SSR, no-JS and reduced-motion all render the finished item; the entrance
  // is expressed with @starting-style. `translate`, not `transform`: Tailwind
  // v4 writes `translate-*` to the standalone property, so the transition names
  // `translate` (and `opacity`) — both genuinely change on mount, so this is
  // not a phantom transition.
  "opacity-100 translate-y-0",
  "transition-[opacity,translate] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
  "starting:opacity-0 starting:translate-y-[8px]",
  // Reduced motion drops the travel and lands on the final value immediately.
  "motion-reduce:transition-none",
].join(" ");

const markerVariants = cva(
  [
    "relative z-[1] inline-flex size-[var(--mq-tl-marker,28px)] shrink-0 items-center justify-center",
    "row-start-1 col-start-1 rounded-full border-2 bg-[var(--mq-tl-surface,#ffffff)]",
    // Background images survive forced colours, so clear any wash by hand and
    // drop the shadow the system would ignore anyway.
    "forced-colors:shadow-none forced-colors:[background-image:none]",
  ].join(" "),
  {
    variants: {
      status: {
        done: [
          "border-[var(--mq-tl-done,#232823)] bg-[var(--mq-tl-done,#232823)]",
          "text-[color:var(--mq-tl-done-text,#ffffff)]",
          "shadow-[var(--mq-tl-marker-shadow,0_2px_5px_rgba(20,20,18,0.10))]",
          "forced-colors:border-[Highlight] forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
        ].join(" "),
        current: [
          "border-[var(--mq-tl-current,#2358c8)] text-[color:var(--mq-tl-current,#2358c8)]",
          "outline-2 outline-offset-[3px] outline-[var(--mq-tl-current,#2358c8)]",
          "shadow-[var(--mq-tl-marker-shadow,0_2px_5px_rgba(20,20,18,0.10))]",
          "forced-colors:border-[Highlight] forced-colors:text-[Highlight] forced-colors:outline-[Highlight]",
        ].join(" "),
        upcoming: [
          "border-dashed border-[var(--mq-tl-upcoming,#7b7a72)] text-[color:var(--mq-tl-upcoming,#7b7a72)]",
          "forced-colors:border-[GrayText] forced-colors:text-[GrayText]",
        ].join(" "),
      },
    },
    defaultVariants: { status: "upcoming" },
  },
);

const connectorVariants = cva(
  [
    "pointer-events-none absolute z-0 w-0 border-l-2",
    "left-[calc(var(--mq-tl-marker,28px)/2_-_1px)]",
    "top-[calc(var(--mq-tl-marker,28px)_+_6px)]",
    "h-[calc(100%_-_var(--mq-tl-marker,28px)_+_var(--mq-tl-gap,22px)_-_12px)]",
  ].join(" "),
  {
    variants: {
      // A finished segment (below a done event) reads as a solid rule; an
      // unfinished one stays dashed. This only reinforces the marker + text
      // status; order and status are never carried by the connector alone.
      segment: {
        done: "border-solid border-[var(--mq-tl-line-done,#3a3b36)] forced-colors:border-[CanvasText]",
        pending: "border-dashed border-[var(--mq-tl-line,#c9c8c1)] forced-colors:border-[GrayText]",
      },
    },
    defaultVariants: { segment: "pending" },
  },
);

const timeVariants = cva(
  "font-bold uppercase tracking-[0.08em] text-[color:var(--mq-tl-muted,#55574e)] forced-colors:text-[CanvasText]",
  {
    variants: {
      size: { sm: "text-[length:10px]", md: "text-[length:11px]", lg: "text-[length:12px]" },
    },
    defaultVariants: { size: "md" },
  },
);

const titleVariants = cva(
  "mt-[3px] block font-bold leading-[1.3] tracking-[-0.01em] text-[color:var(--mq-tl-text,#191a18)] forced-colors:text-[CanvasText]",
  {
    variants: {
      size: { sm: "text-[length:13px]", md: "text-[length:15px]", lg: "text-[length:17px]" },
    },
    defaultVariants: { size: "md" },
  },
);

const bodyVariants = cva(
  "m-0 mt-[4px] leading-[1.55] text-[color:var(--mq-tl-muted,#55574e)] forced-colors:text-[CanvasText]",
  {
    variants: {
      size: { sm: "text-[length:12px]", md: "text-[length:13px]", lg: "text-[length:14px]" },
    },
    defaultVariants: { size: "md" },
  },
);

const tagVariants = cva(
  [
    "inline-flex items-center rounded-full border px-[7px] py-[1px]",
    "text-[length:10px] font-black uppercase leading-[1.6] tracking-[0.08em]",
    "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      status: {
        done: "border-[var(--mq-tl-border,rgba(23,24,23,0.12))] text-[color:var(--mq-tl-muted,#55574e)]",
        current:
          "border-[var(--mq-tl-current,#2358c8)] text-[color:var(--mq-tl-current,#2358c8)] forced-colors:border-[Highlight] forced-colors:text-[Highlight]",
        upcoming:
          "border-dashed border-[var(--mq-tl-upcoming,#7b7a72)] text-[color:var(--mq-tl-muted,#55574e)] forced-colors:border-[GrayText]",
      },
    },
    defaultVariants: { status: "upcoming" },
  },
);

export type TimelineItem = {
  /** Stable identity used as the React key. */
  id: string;
  /** Machine-readable timestamp for `<time dateTime>` (e.g. "2026-07-22"). */
  dateTime?: string;
  /** Human-readable timestamp; falls back to `dateTime` when omitted. */
  time?: React.ReactNode;
  title: React.ReactNode;
  /** Optional supporting body copy. */
  description?: React.ReactNode;
  /** Progress status. Defaults to `upcoming`. */
  status?: TimelineStatus;
};

export type TimelineStatusLabels = Record<TimelineStatus, string>;

export type TimelineProps = Omit<React.ComponentPropsWithRef<"ol">, "children"> &
  Omit<VariantProps<typeof timelineVariants>, "variant" | "size"> & {
    /** The events, in order. */
    items: readonly TimelineItem[];
    /** Accepted for catalog parity; only reflected on `data-material`. */
    material?: MaterialSlug;
    variant?: TimelineVariant;
    size?: TimelineSize;
    /** Localizable status words, used in the summary and per-event tag. */
    statusLabels?: Partial<TimelineStatusLabels>;
  };

const DEFAULT_STATUS_LABELS: TimelineStatusLabels = {
  done: "Done",
  current: "In progress",
  upcoming: "Upcoming",
};

/** Drawn by hand so the file needs no icon dependency. */
function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[calc(var(--mq-tl-marker,28px)*0.5)]"
      fill="none"
      focusable="false"
      viewBox="0 0 16 16"
    >
      <path
        d="m3.25 8.25 3 3 6.5-6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
    </svg>
  );
}

export function Timeline({
  className,
  items,
  material = "adaptive",
  size = "md",
  statusLabels,
  variant = "default",
  ...props
}: TimelineProps) {
  const labels = { ...DEFAULT_STATUS_LABELS, ...statusLabels };

  const counts = items.reduce(
    (acc, item) => {
      const status = item.status ?? "upcoming";
      acc[status] += 1;
      return acc;
    },
    { done: 0, current: 0, upcoming: 0 } as Record<TimelineStatus, number>,
  );

  const summary =
    `Timeline with ${items.length} ${items.length === 1 ? "event" : "events"}: ` +
    `${counts.done} ${labels.done.toLowerCase()}, ` +
    `${counts.current} ${labels.current.toLowerCase()}, ` +
    `${counts.upcoming} ${labels.upcoming.toLowerCase()}.`;

  return (
    <>
      {/* Authoritative aggregate, read in document order before the list. */}
      <p className={SR_ONLY}>{summary}</p>
      <ol
        aria-label="Timeline"
        {...props}
        className={cn(timelineVariants({ size, variant }), className)}
        data-material={material}
      >
        {items.map((item, index) => {
          const status = item.status ?? "upcoming";
          const isLast = index === items.length - 1;
          const segment = status === "done" ? "done" : "pending";
          // Cap the stagger so a long list never accumulates a long wait; the
          // delay only affects the entrance, which reduced motion cancels.
          const delayMs = Math.min(index, 8) * 55;

          return (
            <li
              className={ITEM_CLASS}
              data-status={status}
              key={item.id}
              style={{ transitionDelay: `${delayMs}ms` }}
            >
              <span aria-hidden="true" className={markerVariants({ status })}>
                {status === "done" ? (
                  <CheckIcon />
                ) : status === "current" ? (
                  <span className="size-[calc(var(--mq-tl-marker,28px)*0.32)] rounded-full bg-current" />
                ) : null}
              </span>

              {!isLast ? (
                <span aria-hidden="true" className={connectorVariants({ segment })} />
              ) : null}

              <div className="col-start-2 row-start-1 min-w-0 pb-[2px]">
                <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
                  {item.dateTime != null ? (
                    // A real <time> only when there is a machine-readable value —
                    // a <time> with human text and no dateTime is an invalid
                    // machine timestamp, so a label-only timestamp degrades to a
                    // plain span.
                    <time className={timeVariants({ size })} dateTime={item.dateTime}>
                      {item.time ?? item.dateTime}
                    </time>
                  ) : item.time != null ? (
                    <span className={timeVariants({ size })}>{item.time}</span>
                  ) : null}
                  {/* Status carried by TEXT (this tag) + shape (the marker),
                      so colour is never the sole cue. */}
                  <span className={tagVariants({ status })}>{labels[status]}</span>
                </div>
                <span className={titleVariants({ size })}>{item.title}</span>
                {item.description != null ? (
                  <p className={bodyVariants({ size })}>{item.description}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export { timelineVariants };
