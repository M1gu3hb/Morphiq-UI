"use client";

import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Segmented Progress
 *
 * A progress bar split into N DISCRETE segments, where the completed segments
 * are filled. It is deliberately distinct from two neighbours in the catalog:
 *
 *   - `progress` is a CONTINUOUS bar — one uninterrupted run whose width is a
 *     percentage. This one counts whole units: "Step 3 of 7".
 *   - `progress-steps` is a labelled STEPPER — every step carries its own title
 *     and description. This one carries no per-segment label at all; it is a
 *     compact discrete-progress READOUT that fits on one line beside a task.
 *
 * Passive and stateless: the reading is a prop, so nothing in render depends on
 * the clock, on randomness, on `window` or on storage, and the server and the
 * client draw exactly the same markup on a statically generated page.
 *
 * This is a material-AGNOSTIC inline component: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and is reflected on `data-material`; it drives no recipe.
 *
 * Local theming knobs (every one is read with a literal fallback):
 *
 *   --mq-text        label and numeric readout colour
 *   --mq-muted       status pill colour
 *   --mq-track       an unfilled segment's surface
 *   --mq-brd         segment border — the track outline that survives forced colours
 *   --mq-fill        a filled segment's surface
 *   --mq-fill-edge   a filled segment's border
 *   --mq-empty-rule  the hairline drawn inside an unfilled segment
 *   --mq-lead-halo   the halo around the most recently filled segment
 *   --mq-pill        the status pill's surface
 *   --mq-seg-h       segment height          (set by size)
 *   --mq-gap         gap between segments    (set by size)
 *   --mq-row-gap     gap between header/track(set by size)
 *   --mq-font        readout type size       (set by size)
 *   --mq-status-font status pill type size   (set by size)
 *   --mq-seg-fill    one segment's fill fraction — the FINAL value (set inline)
 *   --mq-seg-op      one segment's fill opacity  — the FINAL value (set inline)
 *   --mq-seg-delay   one segment's stagger offset (set inline, from its index)
 *   --mq-ring        focus ring colour
 *
 * Accessibility contract:
 *   - The wrapper is a native `role="progressbar"` carrying aria-valuemin=0,
 *     aria-valuemax=N, aria-valuenow=completed and an aria-valuetext that SPELLS
 *     the reading in words ("Step 3 of 7, in progress"). Those four attributes
 *     and `role` are Omitted from the public props type, so a caller cannot
 *     desync the announced value from the drawn one.
 *   - Every segment is decorative and `aria-hidden`; the visible "3 of 7" text
 *     and status word carry the reading for sighted readers, and they too are
 *     `aria-hidden` so the same figure is never announced twice.
 *   - STATE IS NEVER COLOUR ALONE. Filled and unfilled segments differ by fill,
 *     by border token, and by SHAPE — an unfilled segment draws a short hairline
 *     across its middle that a filled one replaces with a solid run — and the
 *     count plus the status word ("Not started" / "In progress" / "Complete")
 *     state the same thing in real text.
 *   - Reduced motion keeps the END STATE: the resting `scale`/`opacity` of every
 *     fill IS its final value, so `motion-reduce:transition-none` and
 *     `motion-reduce:animate-none` land straight on the correct fill.
 *   - forced-colors: an unfilled segment keeps a GrayText outline, a filled one a
 *     CanvasText outline and a Highlight fill, gradients and shadows are cleared,
 *     text is CanvasText and the focus ring is Highlight.
 */

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

type Size = "sm" | "md" | "lg";

/** Stagger between consecutive segments, for the entrance and the fill sweep. */
const SEGMENT_STAGGER_MS = 55;

/**
 * Focus ring. A segmented progress bar owns no interactive control, so it is not
 * focusable by default — but a caller may make the readout a tab stop (a
 * `tabIndex`, or a link wrapped around it), and it must never be focusable
 * without a visible ring. The parallel `data-[focus=true]` selector lets the
 * documentation preview render the focused look without synthesising a key event.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] " +
  "forced-colors:data-[focus=true]:outline-[Highlight]";

/**
 * Keyframes travel with the component rather than living in a global stylesheet
 * a copier would have to find. React 19 hoists this and deduplicates it by
 * `href`, so ten of these on a page emit one rule rather than ten.
 *
 * The resting end state of `mq-segprog-in` is the element's own resting style
 * (opaque, untranslated), which is why `motion-reduce:animate-none` leaves the
 * bar fully drawn instead of blank. `translate` is the standalone property
 * Tailwind v4 writes its utilities to, and nothing in this file sets `transform`
 * for it to fight with.
 */
const SEGMENTED_PROGRESS_KEYFRAMES =
  "@keyframes mq-segprog-in{from{opacity:0;translate:0 5px}to{opacity:1;translate:0 0}}";

const segmentedProgressVariants = cva(
  [
    "grid w-full gap-[var(--mq-row-gap,8px)]",
    "text-[color:var(--mq-text,#1c1c19)] text-[length:var(--mq-font,12px)] leading-none font-bold",
    // Adaptive light+dark token vocabulary. The fill and "done" hues are shared
    // token for token with the Gauge, so a segmented bar reads as the same system.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-track:#e6e4dd] [--mq-brd:#a8a69d] [--mq-empty-rule:#8f8d84]",
    "[--mq-fill:#3f5bd9] [--mq-fill-edge:rgba(28,40,110,0.48)] [--mq-lead-halo:rgba(63,91,217,0.22)]",
    "[--mq-pill:rgba(23,24,23,0.05)] [--mq-ring:#171817]",
    "[--mq-done:#15703f] [--mq-done-edge:rgba(8,54,30,0.50)] [--mq-done-halo:rgba(21,112,63,0.24)]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-track:#33333a] dark:[--mq-brd:#6b6b74] dark:[--mq-empty-rule:#8a8a93]",
    "dark:[--mq-fill:#8ea2ff] dark:[--mq-fill-edge:rgba(226,231,255,0.42)] dark:[--mq-lead-halo:rgba(142,162,255,0.26)]",
    "dark:[--mq-pill:rgba(255,255,255,0.08)] dark:[--mq-ring:#f1efe9]",
    "dark:[--mq-done:#5ad18b] dark:[--mq-done-edge:rgba(226,255,238,0.42)] dark:[--mq-done-halo:rgba(90,209,139,0.26)]",
    // Colour used SEMANTICALLY, never alone: reaching the last segment retints
    // the run, and the word "Complete" says the same thing beside it.
    //
    // One rule per token rather than a light and a dark copy: the scheme already
    // lives in `--mq-done*`, and an attribute selector outranks the plain class
    // the `dark:` recipe uses, so the completed palette wins by SPECIFICITY
    // rather than by hoping the generated stylesheet ordered the two variants.
    "data-[complete=true]:[--mq-fill:var(--mq-done,#15703f)]",
    "data-[complete=true]:[--mq-fill-edge:var(--mq-done-edge,rgba(8,54,30,0.50))]",
    "data-[complete=true]:[--mq-lead-halo:var(--mq-done-halo,rgba(21,112,63,0.24))]",
    // Passive states, driven by data-state so a busy readout never inherits the
    // faded disabled look.
    "data-[state=disabled]:opacity-55 data-[state=loading]:cursor-progress",
    "forced-colors:text-[CanvasText]",
    FOCUS_RING,
  ].join(" "),
  {
    variants: {
      // A segmented bar has one composition. `default` exists so the registry can
      // list a variant and the preview can coerce an incoming value.
      variant: { default: "" },
      size: {
        sm: "[--mq-seg-h:8px] [--mq-gap:4px] [--mq-row-gap:6px] [--mq-font:11px] [--mq-status-font:9px] [--mq-seg-min:8px] [--mq-seg-radius:999px]",
        md: "[--mq-seg-h:12px] [--mq-gap:5px] [--mq-row-gap:8px] [--mq-font:12px] [--mq-status-font:10px] [--mq-seg-min:10px] [--mq-seg-radius:999px]",
        lg: "[--mq-seg-h:16px] [--mq-gap:6px] [--mq-row-gap:10px] [--mq-font:13px] [--mq-status-font:11px] [--mq-seg-min:12px] [--mq-seg-radius:999px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/**
 * One segment cell — the track for a single unit of work.
 *
 * The border is load-bearing rather than ornamental: it is what keeps a filled
 * and an unfilled segment apart once forced colours have discarded every fill,
 * gradient and shadow (GrayText for the track, CanvasText once filled).
 */
const segmentVariants = cva(
  [
    "relative min-w-[var(--mq-seg-min,10px)] flex-1 overflow-hidden",
    "h-[var(--mq-seg-h,12px)] rounded-[var(--mq-seg-radius,999px)]",
    "border border-[var(--mq-brd,#a8a69d)] bg-[var(--mq-track,#e6e4dd)]",
    "shadow-[inset_0_1px_2px_rgba(23,24,23,0.16)]",
    // The bar assembles left to right on mount. The keyframes end on the cell's
    // own resting style, so reduced motion simply skips to the assembled bar.
    "animate-[mq-segprog-in_360ms_cubic-bezier(0.22,1.2,0.36,1)_both] motion-reduce:animate-none",
    "data-[filled=true]:border-[var(--mq-fill-edge,rgba(28,40,110,0.48))]",
    // The most recently filled segment gets a halo, so the eye lands on the
    // frontier of the work rather than counting from the left every time.
    "data-[lead=true]:shadow-[inset_0_1px_2px_rgba(23,24,23,0.16),0_0_0_2px_var(--mq-lead-halo,rgba(63,91,217,0.22))]",
    "forced-colors:border-[GrayText] forced-colors:bg-[Canvas] forced-colors:shadow-none",
    "forced-colors:data-[filled=true]:border-[CanvasText]",
  ].join(" "),
);

/**
 * The filled run inside one segment.
 *
 * Its resting `scale` and `opacity` ARE the final reading, set from an inline
 * custom property, so SSR, no-JS and reduced motion all render the true fill.
 * The sweep is expressed twice over: `@starting-style` (the `starting:` variant)
 * animates the first paint from empty, and the transition animates every later
 * change of `value`. `transition-[scale,opacity]` names `scale` explicitly
 * because Tailwind v4 writes scale utilities to the STANDALONE `scale` property,
 * which a bare `transition-transform` shorthand would be the only other way to
 * cover — and both properties really do change, so neither is a phantom.
 */
const segmentFillVariants = cva(
  [
    "pointer-events-none absolute inset-0 origin-left rounded-[inherit]",
    "bg-[var(--mq-fill,#3f5bd9)]",
    // The sheen is an explicit property rather than a `bg-*` utility: a colour
    // and a gradient through the same utility land in one `tailwind-merge` group
    // where one silently drops the other.
    "[background-image:linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.34)]",
    "[scale:var(--mq-seg-fill,1)_1] [opacity:var(--mq-seg-op,1)]",
    "transition-[scale,opacity] duration-[420ms] ease-out [transition-delay:var(--mq-seg-delay,0ms)]",
    "starting:[scale:0_1] starting:[opacity:0]",
    "motion-reduce:transition-none",
    // Forced colours discard fills and shadows but NOT background images, so the
    // sheen has to be cleared by hand or it would sit on a system-coloured run.
    "forced-colors:bg-[Highlight] forced-colors:[background-image:none] forced-colors:shadow-none",
  ].join(" "),
);

/**
 * The hairline drawn across an UNFILLED segment. This is the shape difference
 * that keeps "done" and "not done" apart for a reader who cannot separate the
 * two hues: a solid run versus a thin rule, before any colour is perceived.
 */
const emptyRuleVariants = cva(
  [
    "pointer-events-none absolute top-1/2 left-1/2 h-[2px] w-[38%] rounded-full",
    "-translate-x-1/2 -translate-y-1/2",
    "bg-[var(--mq-empty-rule,#8f8d84)]",
    "forced-colors:bg-[GrayText]",
  ].join(" "),
);

const statusPillVariants = cva(
  [
    "inline-flex shrink-0 items-center rounded-full border px-[7px] py-[3px]",
    "border-[var(--mq-brd,#a8a69d)] bg-[var(--mq-pill,rgba(23,24,23,0.05))]",
    "text-[color:var(--mq-muted,#55554e)] text-[length:var(--mq-status-font,10px)]",
    "font-extrabold uppercase tracking-[0.09em]",
    "data-[complete=true]:text-[color:var(--mq-fill,#3f5bd9)]",
    "data-[complete=true]:border-[var(--mq-fill-edge,rgba(28,40,110,0.48))]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
);

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/** Trims a trailing `.0` so whole counts read cleanly in the readout. */
function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}

export type SegmentedProgressProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "children" | "role"
> &
  Omit<VariantProps<typeof segmentedProgressVariants>, "variant" | "size"> & {
    /** Completed units. Clamped into `[0, total]`; fractions partly fill one segment. */
    value: number;
    /** How many segments the bar is split into. Falls back to 1 if not a positive number. */
    total?: number;
    /** Optional visible task label. A string also becomes the accessible name. */
    label?: React.ReactNode;
    /** Noun used in aria-valuetext, e.g. "Step 3 of 7". Defaults to "Step". */
    unitLabel?: string;
    /** Replaces the visible "3 of 7" readout without touching the ARIA value. */
    valueLabel?: React.ReactNode;
    /** Replaces the derived status word. Pass `null` to drop the pill entirely. */
    statusLabel?: React.ReactNode;
    /** Hides the visible readout row; aria-valuetext still carries the reading. */
    showValue?: boolean;
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: Size;
    segmentClassName?: string;
    trackClassName?: string;
    labelClassName?: string;
  };

export function SegmentedProgress({
  "aria-label": ariaLabel,
  "aria-valuetext": ariaValueText,
  className,
  label,
  labelClassName,
  material = "adaptive",
  segmentClassName,
  showValue = true,
  size = "md",
  statusLabel,
  total = 5,
  trackClassName,
  unitLabel = "Step",
  value,
  valueLabel,
  variant = "default",
  ...props
}: SegmentedProgressProps) {
  // Every figure is clamped before it reaches ARIA *or* the drawing, so the two
  // can never disagree — 0, N and out-of-range inputs all resolve identically.
  const count = Number.isFinite(total) && total >= 1 ? Math.round(total) : 1;
  const clamped = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), count);

  const isComplete = clamped >= count;
  const isEmpty = clamped <= 0;
  // Derived purely from `clamped`: no cursor is incremented inside the map below,
  // so nothing is reassigned after render completes.
  const leadIndex = Math.ceil(clamped) - 1;
  const fractions = Array.from({ length: count }, (_, index) => clamp01(clamped - index));

  const derivedStatus = isComplete ? "Complete" : isEmpty ? "Not started" : "In progress";
  const resolvedStatus = statusLabel === undefined ? derivedStatus : statusLabel;
  const statusText = typeof resolvedStatus === "string" ? resolvedStatus : derivedStatus;

  const readingText = `${trimNumber(clamped)} of ${trimNumber(count)}`;
  const accessibleName = ariaLabel ?? (typeof label === "string" ? label : "Progress");
  // The reading is SPELLED in words, and the state is spelled with it, so the
  // announcement never leans on the drawn segments.
  const valueText =
    ariaValueText ?? `${unitLabel} ${readingText}, ${statusText.toLowerCase()}`;

  return (
    <>
      {/*
        `href` + `precedence` so React 19 hoists this and deduplicates it: a bare
        <style> would emit one identical copy per bar rendered on the page.
      */}
      <style href="mq-segmented-progress" precedence="medium">
        {SEGMENTED_PROGRESS_KEYFRAMES}
      </style>
      <div
        {...props}
        aria-label={accessibleName}
        aria-valuemax={count}
        aria-valuemin={0}
        aria-valuenow={clamped}
        aria-valuetext={valueText}
        className={cn(segmentedProgressVariants({ variant, size }), className)}
        data-complete={isComplete ? "true" : undefined}
        data-material={material}
        role="progressbar"
      >
        {showValue && (label !== undefined || resolvedStatus != null) ? (
          // aria-hidden: role="progressbar" already announces the name and the
          // aria-valuetext above, so this row is a sighted-reader duplicate.
          <span
            aria-hidden="true"
            className={cn("flex items-center justify-between gap-[12px]", labelClassName)}
            data-segmented-progress-label=""
          >
            <span className="min-w-0 truncate">{label}</span>
            <span className="flex shrink-0 items-center gap-[8px]">
              <span className="tabular-nums">{valueLabel ?? readingText}</span>
              {resolvedStatus != null ? (
                <span
                  className={statusPillVariants()}
                  data-complete={isComplete ? "true" : undefined}
                  data-segmented-progress-status=""
                >
                  {resolvedStatus}
                </span>
              ) : null}
            </span>
          </span>
        ) : null}

        {/* The segments are decoration: the reading lives in aria-valuetext and,
            for sighted readers, in the row above. */}
        <span
          aria-hidden="true"
          className={cn(
            "flex w-full items-center gap-[var(--mq-gap,5px)]",
            trackClassName,
          )}
          data-segmented-progress-track=""
        >
          {fractions.map((fraction, index) => (
            <span
              className={cn(segmentVariants(), segmentClassName)}
              data-filled={fraction > 0 ? "true" : "false"}
              data-lead={index === leadIndex ? "true" : undefined}
              data-segmented-progress-segment=""
              key={`segment-${index}`}
              style={
                {
                  // The stagger is derived from the index alone, so the markup is
                  // deterministic and identical on the server and the client.
                  animationDelay: `${index * SEGMENT_STAGGER_MS}ms`,
                  "--mq-seg-delay": `${index * SEGMENT_STAGGER_MS}ms`,
                  "--mq-seg-fill": String(fraction),
                  "--mq-seg-op": fraction > 0 ? "1" : "0",
                } as React.CSSProperties
              }
            >
              <span className={segmentFillVariants()} data-segmented-progress-fill="" />
              {fraction === 0 ? (
                <span className={emptyRuleVariants()} data-segmented-progress-empty="" />
              ) : null}
            </span>
          ))}
        </span>
      </div>
    </>
  );
}

export type SegmentedProgressVariantProps = VariantProps<typeof segmentedProgressVariants>;

export { segmentFillVariants, segmentVariants, segmentedProgressVariants };
