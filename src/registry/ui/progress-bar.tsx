"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Progress Bar Group
 *
 * A stack of labelled horizontal progress / metric bars driven by an
 * `items: { label, value, max?, unit?, tone? }[]` prop. Every row is a label, a
 * recessed track with a filled bar, and the reading as real numeric TEXT. No
 * charting library, no WebGL, no global stylesheet: each bar's proportion is a
 * deterministic ratio mapped straight to a standalone `scale`, so copying this
 * file plus `src/lib/cn.ts` reproduces the whole look.
 *
 * This is a material-AGNOSTIC data component: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and is reflected on `data-material`; it drives no separate
 * recipe.
 *
 * Local theming knobs are CSS variables, each referenced with a literal
 * fallback:
 *
 *   --mq-text       label + value text
 *   --mq-muted      denominator / caption text
 *   --mq-track      the recessed, unfilled track
 *   --mq-accent / --mq-positive / --mq-warning / --mq-critical / --mq-neutral
 *                   the five semantic fill tones (reinforcement only)
 *   --mq-bar-h      track height (set by size)
 *   --mq-row-gap    vertical gap between rows (set by size)
 *   --mq-head-gap   gap between a row's label line and its track (set by size)
 *   --mq-fill       a row's final fill ratio 0..1 — the resting value (set inline)
 *
 * Data-accessibility contract (the defining rule of this component):
 *   - Each bar is a native `role="progressbar"` carrying aria-valuenow /
 *     -valuemin / -valuemax, an aria-valuetext that spells the reading, and an
 *     accessible name via aria-labelledby → the visible label. That native
 *     semantics IS the authoritative accessible equivalent; the fill div is
 *     decoration and the visible value text (a duplicate of aria-valuetext) is
 *     aria-hidden so nothing is announced twice.
 *   - COLOUR is never the sole carrier: every row prints its value / max as real
 *     text and is named by its label, so a row reads without perceiving the fill
 *     tone at all. The per-item `tone` is reinforcement layered on top.
 *   - Contrast: the value uses the primary text token and the denominator /
 *     caption the muted token, each at or above 4.5:1 against a light and a dark
 *     surface; every fill tone clears the 3:1 bar for an informative graphic mark
 *     against the track in both schemes.
 *   - Bars grow on mount reduced-motion-safe WITHOUT JS: a bar's resting `scale`
 *     IS its final ratio (so SSR, no-JS and reduced motion all show the true
 *     value), and the from-empty entrance is expressed with the `starting:`
 *     variant (@starting-style) on the standalone `scale` property anchored to the
 *     left edge, over `transition-[scale]`. `motion-reduce:transition-none` lands
 *     straight on the final size. There is no setState-driven count-up.
 *   - forced-colors: the fill becomes Highlight over a Canvas track bounded by a
 *     CanvasText border, and every label becomes CanvasText, so the proportion
 *     and the reading stay perceivable.
 *   - Every figure is a prop, so nothing in render depends on time or randomness.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

type Size = "sm" | "md" | "lg";
/** Semantic fill tone. Reinforcement only — the numeric value carries meaning. */
type Tone = "accent" | "positive" | "warning" | "critical" | "neutral";

export type ProgressBarItem = {
  /** Row name. Shown as the label and used as the bar's accessible name. */
  label: string;
  /** Current magnitude. Clamped to [0, max] for drawing and for aria-valuenow. */
  value: number;
  /** Upper bound. Defaults to 100; a non-positive max falls back to 100. */
  max?: number;
  /** Unit appended to the reading, e.g. "GB", "%". A "%" unit hides "/ 100%". */
  unit?: string;
  /** Semantic fill tone. Reinforcement only; defaults to "accent". */
  tone?: Tone;
};

const progressBarVariants = cva(
  [
    "w-full text-left",
    // Adaptive light+dark token vocabulary. One track colour, five fill tones.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e] [--mq-track:rgba(23,24,23,0.09)]",
    "[--mq-accent:#3f5bd9] [--mq-positive:#15703f] [--mq-warning:#8a5a00] [--mq-critical:#9c2f22] [--mq-neutral:#55554e]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] dark:[--mq-track:rgba(255,255,255,0.13)]",
    "dark:[--mq-accent:#8ea2ff] dark:[--mq-positive:#5ad18b] dark:[--mq-warning:#f0b24a] dark:[--mq-critical:#ff9d8e] dark:[--mq-neutral:#b9b7b0]",
    "text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      // Single composition; the axis exists so the registry can list it and the
      // preview can coerce an incoming value.
      variant: { default: "" },
      // Size scales the track height, type and rhythm via local CSS vars.
      size: {
        sm: "text-[11px] [--mq-bar-h:6px] [--mq-row-gap:12px] [--mq-head-gap:5px]",
        md: "text-[12px] [--mq-bar-h:9px] [--mq-row-gap:16px] [--mq-head-gap:6px]",
        lg: "text-[13px] [--mq-bar-h:13px] [--mq-row-gap:20px] [--mq-head-gap:8px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** Per-tone fill colour. forced-colors switches every tone to Highlight below. */
const TONE_FILL: Record<Tone, string> = {
  accent: "[background-color:var(--mq-accent,#3f5bd9)]",
  positive: "[background-color:var(--mq-positive,#15703f)]",
  warning: "[background-color:var(--mq-warning,#8a5a00)]",
  critical: "[background-color:var(--mq-critical,#9c2f22)]",
  neutral: "[background-color:var(--mq-neutral,#55554e)]",
};

const CAPTION_VISIBLE =
  "mb-3 text-[13px] font-semibold tracking-[0.01em] text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]";

// The recessed track (the role="progressbar" element). An inset shadow gives it
// depth; forced-colors drops the shadow and keeps the bound with a CanvasText
// border over Canvas so the empty portion of the bar is still perceivable.
const TRACK_CLASS = cn(
  "relative w-full overflow-hidden rounded-full h-[var(--mq-bar-h,9px)]",
  "[background-color:var(--mq-track,rgba(23,24,23,0.09))]",
  "shadow-[inset_0_1px_2px_rgba(23,24,23,0.16)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)]",
  "forced-colors:[background-color:Canvas] forced-colors:[border:1px_solid_CanvasText]",
);

/**
 * Rounds to at most two decimals without a forced fixed width, so "8.2" reads as
 * "8.2" and an integer stays clean.
 */
function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}

export type ProgressBarGroupProps = Omit<React.ComponentPropsWithRef<"div">, "children"> &
  Omit<VariantProps<typeof progressBarVariants>, "variant" | "size"> & {
    /** The metrics to plot, in display order. The single source of the data. */
    items: ProgressBarItem[];
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: Size;
    /** Accessible name for the whole group. Rendered as a caption (sr-only unless visible). */
    caption?: React.ReactNode;
    /** Show the caption above the group instead of only exposing it to AT. */
    captionVisible?: boolean;
    /** Formats the reading for BOTH the visible value and aria-valuetext. */
    formatValue?: (value: number, max: number) => string;
    /** Grow the bars on mount. Reduced motion always lands on the final size. */
    animate?: boolean;
  };

/**
 * The progress bar group. Uncontrolled and stateless: the metrics are a prop, so
 * nothing in render is time-dependent or random and there is nothing to hydrate.
 */
export function ProgressBarGroup({
  animate = true,
  caption,
  captionVisible = false,
  className,
  formatValue,
  items,
  material = "adaptive",
  size = "md",
  variant = "default",
  ...props
}: ProgressBarGroupProps) {
  const baseId = React.useId();
  const captionId = `${baseId}-caption`;

  const captionNode = caption ? (
    <p id={captionId} className={captionVisible ? CAPTION_VISIBLE : SR_ONLY}>
      {caption}
    </p>
  ) : null;

  if (items.length === 0) {
    return (
      <div
        {...props}
        className={cn(progressBarVariants({ variant, size }), className)}
        data-material={material}
      >
        {captionNode}
        <p className="m-0 text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
          No data available.
        </p>
      </div>
    );
  }

  return (
    <div
      {...props}
      className={cn(progressBarVariants({ variant, size }), className)}
      data-material={material}
    >
      {captionNode}

      <ul
        aria-labelledby={caption ? captionId : undefined}
        className="flex flex-col gap-[var(--mq-row-gap,16px)]"
        role="list"
      >
        {items.map((item, index) => {
          const resolvedMax =
            typeof item.max === "number" && Number.isFinite(item.max) && item.max > 0
              ? item.max
              : 100;
          const clamped = Math.min(Math.max(item.value, 0), resolvedMax);
          const ratio = Math.round((clamped / resolvedMax) * 10000) / 10000;
          const pct = Math.round(ratio * 100);

          const unit = item.unit ?? "";
          const unitSuffix = unit ? (unit === "%" ? "%" : ` ${unit}`) : "";
          // A "% of 100" bar reads cleaner as just "42%" without the "/ 100%".
          const showDenominator = !(unit === "%" && resolvedMax === 100);

          const valueStr = showDenominator ? trimNumber(clamped) : `${trimNumber(clamped)}${unitSuffix}`;
          const denomStr = showDenominator ? `${trimNumber(resolvedMax)}${unitSuffix}` : "";

          const formatted = formatValue ? formatValue(clamped, resolvedMax) : null;
          const ariaValueText =
            formatted ??
            (showDenominator
              ? `${trimNumber(clamped)} of ${trimNumber(resolvedMax)}${unitSuffix} (${pct}%)`
              : `${trimNumber(clamped)}${unitSuffix}`);

          const tone: Tone = item.tone ?? "accent";
          const labelId = `${baseId}-label-${index}`;

          // The resting fill ratio rides on a custom property so the entrance can
          // animate from @starting-style's `scale: 0 1` to this final value with
          // no JS measurement; the optional stagger delays each row a little.
          const fillStyle = {
            "--mq-fill": ratio,
            ...(animate ? { transitionDelay: `${index * 60}ms` } : {}),
          } as React.CSSProperties;

          return (
            <li key={`${item.label}-${index}`} className="flex flex-col gap-[var(--mq-head-gap,6px)]">
              <div className="flex items-baseline justify-between gap-3 leading-tight">
                <span
                  id={labelId}
                  className="font-medium text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]"
                >
                  {item.label}
                </span>
                {/* Visual duplicate of aria-valuetext, so it is aria-hidden to
                    avoid a double announcement. */}
                <span
                  aria-hidden="true"
                  className="shrink-0 tabular-nums text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]"
                >
                  {formatted ?? (
                    <>
                      <strong className="font-semibold text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]">
                        {valueStr}
                      </strong>
                      {denomStr ? ` / ${denomStr}` : null}
                    </>
                  )}
                </span>
              </div>

              <div
                aria-labelledby={labelId}
                aria-valuemax={resolvedMax}
                aria-valuemin={0}
                aria-valuenow={clamped}
                aria-valuetext={ariaValueText}
                className={TRACK_CLASS}
                role="progressbar"
              >
                <div
                  className={cn(
                    "block h-full w-full origin-left rounded-full [scale:var(--mq-fill,0)_1]",
                    TONE_FILL[tone],
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
                    "forced-colors:[background-color:Highlight]",
                    animate &&
                      "transition-[scale] duration-[700ms] ease-out motion-reduce:transition-none starting:[scale:0_1]",
                  )}
                  style={fillStyle}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { progressBarVariants };
