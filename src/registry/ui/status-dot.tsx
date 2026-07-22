"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Status Dot
 *
 * A presence indicator — online / away / busy / offline — carried by three
 * redundant channels so meaning never rests on colour alone:
 *
 *   1. a COLOUR per status,
 *   2. a distinct SHAPE (filled disc / half-moon / dashed disc / hollow ring),
 *   3. a real TEXT label (visible, or `sr-only` when `labelHidden`).
 *
 * This is a material-AGNOSTIC component: it ships a single style built on the
 * adaptive light+dark token vocabulary. `material` is accepted only for catalog
 * parity and is reflected on `data-material`; it drives no separate recipe.
 *
 * Self-contained by design: every local custom property carries a literal
 * fallback, no class comes from a global stylesheet, and the pulse keyframes
 * travel with the component through React 19's deduplicated `<style href>`
 * hoisting rather than living somewhere a copier would have to find.
 *
 * Accessibility:
 *
 * - The wrapper is a `role="status"` live region (which implies polite +
 *   atomic), so a presence that changes in place is announced. It is announced
 *   by its *contents* — the real text label — not by a name, which is the usual
 *   way a status region is got wrong.
 * - The glyph is decoration and carries `aria-hidden`; its shape is a visual
 *   redundancy for the label, never the sole carrier of meaning.
 * - The pulse is pure decoration on the already-hidden glyph, so reduced motion
 *   stops it outright and the dot is simply present.
 *
 * Local theming knobs (each used with a literal fallback):
 *
 *   --mq-dot   the status colour (also the pulse colour)
 *   --mq-text  the label colour
 *   --mq-size  the dot diameter
 *   --mq-font  the label font size
 *   --mq-gap   the space between dot and label
 */

export type StatusDotStatus = "online" | "away" | "busy" | "offline";
type StatusDotSize = "sm" | "md" | "lg";

/** Default accessible word for each status. Real text, never `aria-label`. */
const STATUS_LABEL: Record<StatusDotStatus, string> = {
  online: "Online",
  away: "Away",
  busy: "Busy",
  offline: "Offline",
};

/**
 * Pulse keyframes travel with the component. React 19 hoists this and
 * deduplicates by `href`, so a wall of presence dots emits one rule. The
 * animation drives the standalone `scale` and `opacity` properties, so a
 * caller's own `transform` never fights it, and the resting `opacity-0` base
 * means `motion-reduce:animate-none` leaves nothing visible rather than a
 * frozen disc parked over the glyph.
 */
const PULSE_KEYFRAMES =
  "@keyframes mq-status-pulse{0%{opacity:0.5;scale:1}70%{opacity:0;scale:2.4}100%{opacity:0;scale:2.4}}";

function StatusDotKeyframes() {
  return (
    <style href="mq-status-pulse" precedence="medium">
      {PULSE_KEYFRAMES}
    </style>
  );
}

const dotVariants = cva(
  [
    "relative isolate inline-flex items-center align-middle",
    "gap-[var(--mq-gap,7px)]",
    // Adaptive light+dark foreground for the label. Tuned well past 4.5:1 on a
    // light and a dark surface alike.
    "[--mq-text:#1c1c19] dark:[--mq-text:#f1efe9]",
    "text-[color:var(--mq-text,#1c1c19)]",
  ].join(" "),
  {
    variants: {
      // The status is a prop, not the catalog `variant` (which is "default"):
      // it drives the dot's colour token, while the glyph shape and the label
      // word are chosen in the render below. Colours hold at least 3:1 against
      // their surface — WCAG 1.4.11 for a non-text graphic — in both schemes.
      status: {
        online: "[--mq-dot:#15803d] dark:[--mq-dot:#3fb950]",
        away: "[--mq-dot:#a35a08] dark:[--mq-dot:#e3b341]",
        busy: "[--mq-dot:#b3261e] dark:[--mq-dot:#f85149]",
        offline: "[--mq-dot:#57534e] dark:[--mq-dot:#8f8b84]",
      },
      size: {
        sm: "[--mq-size:8px] [--mq-font:11px] [--mq-gap:6px]",
        md: "[--mq-size:10px] [--mq-font:12px] [--mq-gap:7px]",
        lg: "[--mq-size:13px] [--mq-font:14px] [--mq-gap:8px]",
      },
    },
    defaultVariants: { status: "online", size: "md" },
  },
);

/**
 * The status glyph, drawn as inline SVG in a fixed 16-unit box so it scales
 * cleanly to any `--mq-size`. Every status is a *shape*, not just a colour:
 *
 *   online  — a filled disc
 *   away    — a half-moon (left half filled inside a full ring)
 *   busy    — a disc with a horizontal slot ("do not disturb")
 *   offline — a hollow ring
 *
 * All marks are `currentColor`, so forced-colors mode only has to repaint one
 * colour (`CanvasText`) and the negative space of each shape survives intact.
 * The busy slot and offline hole are carved with `fill-rule="evenodd"`, both
 * subtracting shapes sitting fully inside the outer disc so nothing spills out.
 */
function StatusGlyph({
  status,
  className,
}: {
  status: StatusDotStatus;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className={cn(
        "relative block size-[var(--mq-size,10px)] shrink-0",
        "text-[color:var(--mq-dot,#15803d)] forced-colors:text-[CanvasText]",
        className,
      )}
    >
      {status === "online" ? <circle cx="8" cy="8" r="5" fill="currentColor" /> : null}
      {status === "away" ? (
        <>
          <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8,3 A5,5 0 0,0 8,13 Z" fill="currentColor" />
        </>
      ) : null}
      {status === "busy" ? (
        <path
          d="M3,8 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 Z M4.6,7 H11.4 V9 H4.6 Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      ) : null}
      {status === "offline" ? (
        <path
          d="M3,8 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 Z M5.3,8 a2.7,2.7 0 1,0 5.4,0 a2.7,2.7 0 1,0 -5.4,0 Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      ) : null}
    </svg>
  );
}

/**
 * Whether a node would actually put text on the page.
 *
 * A live region is announced by its contents, so a `label` that renders to
 * nothing — `""` from a missed i18n lookup, or the `false` a `cond && text`
 * collapses to — must not send the component down the "has a label" path and
 * produce a region with no text. Same guard the Spinner uses.
 */
function rendersText(node: React.ReactNode): boolean {
  if (node == null || typeof node === "boolean") return false;
  if (typeof node === "string") return node.trim() !== "";
  return true;
}

export type StatusDotProps = Omit<
  React.ComponentPropsWithRef<"span">,
  "role" | "color" | "children"
> & {
  /** Presence to display. Drives the colour, the glyph shape and the default word. */
  status?: StatusDotStatus;
  size?: StatusDotSize;
  /** Catalog-parity only; reflected on `data-material`, drives no recipe. */
  material?: MaterialSlug;
  /** Overrides the default status word. Empty content falls back to the default. */
  label?: React.ReactNode;
  /** Hides the label visually while keeping it as real text in the live region. */
  labelHidden?: boolean;
  /** Adds a decorative pulse ring; stopped entirely under reduced motion. */
  pulse?: boolean;
  /**
   * Live-region policy, mirroring Alert's `urgency`. `"polite"` (default) makes
   * the dot a `role="status"` region that announces changes; `"off"` renders it
   * as a plain labelled indicator (still read in reading order via its text
   * label) for static presence lists that would otherwise announce on every mount.
   */
  live?: "polite" | "off";
  glyphClassName?: string;
  labelClassName?: string;
};

export function StatusDot({
  className,
  glyphClassName,
  label,
  labelClassName,
  labelHidden = false,
  live = "polite",
  material = "adaptive",
  pulse = false,
  size = "md",
  status = "online",
  ...props
}: StatusDotProps) {
  const shownLabel = rendersText(label) ? label : STATUS_LABEL[status];

  return (
    <>
      <StatusDotKeyframes />
      {/* `props` is spread first so the derived role and data-* attributes below
          always win over anything a caller passes through. */}
      <span
        {...props}
        className={cn(dotVariants({ status, size }), className)}
        data-material={material}
        data-status={status}
        role={live === "off" ? undefined : "status"}
      >
        <span className="relative grid size-[var(--mq-size,10px)] shrink-0 place-items-center">
          {pulse ? (
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 rounded-full opacity-0",
                "bg-[var(--mq-dot,#15803d)]",
                "animate-[mq-status-pulse_1.8s_cubic-bezier(0.4,0,0.6,1)_infinite]",
                // Decoration on an already-hidden glyph: reduced motion stops it,
                // and forced-colors (which would repaint the fill anyway) drops it.
                "motion-reduce:animate-none forced-colors:hidden",
              )}
            />
          ) : null}
          <StatusGlyph status={status} className={glyphClassName} />
        </span>
        {labelHidden ? (
          // Real text, not `aria-label`: the region is announced by what it
          // contains. `sr-only` keeps it out of the visual layout while leaving
          // it in the accessibility tree.
          <span className="sr-only">{shownLabel}</span>
        ) : (
          <span
            className={cn(
              "text-[length:var(--mq-font,12px)] leading-none font-semibold tracking-[-0.01em]",
              "text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]",
              labelClassName,
            )}
          >
            {shownLabel}
          </span>
        )}
      </span>
    </>
  );
}

export { dotVariants };
