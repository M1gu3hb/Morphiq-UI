"use client";

import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Signal Bars
 *
 * A STEPPED level indicator: N bars climbing left to right, the first `level` of
 * them filled. It reads a discrete level out of a known range — signal strength,
 * connection quality, password strength, battery tier — and is deliberately
 * DISTINCT from Progress (a continuous determinate bar) and from Gauge (a
 * continuous semicircular needle): the scale here has steps, and the step is the
 * unit of meaning.
 *
 * This is a material-AGNOSTIC inline component: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and is reflected on `data-material`; it drives no separate
 * recipe.
 *
 * Local theming knobs are CSS custom properties, every one of them referenced
 * with a literal fallback:
 *
 *   --mq-text        the level label
 *   --mq-muted       the name + the "3/4" count
 *   --mq-track       interior tint of an UNFILLED bar
 *   --mq-track-brd   outline of an UNFILLED bar
 *   --mq-fill        body of a FILLED bar (set by tone)
 *   --mq-ring        focus ring colour
 *   --mq-bar-w / --mq-bar-min / --mq-bar-max / --mq-bar-r / --mq-gap /
 *   --mq-gap-x / --mq-label-size          geometry, all set by `size`
 *
 * Data-accessibility contract (the defining rule of this component):
 *   - The wrapper is a native `role="meter"` carrying aria-valuemin (always 0),
 *     aria-valuemax (the number of bars), aria-valuenow (the current level) and
 *     an aria-valuetext that SPELLS the reading in words — "Good, 3 of 4". Those
 *     four ARIA props and `role` are Omitted from the public props type, so a
 *     caller cannot desync the announced value from the drawn one.
 *   - The bars are decoration and are aria-hidden as a group. The level is
 *     carried THREE ways that survive without colour: how many bars are filled,
 *     the ascending HEIGHT ladder they sit on, and a real TEXT label (visible,
 *     and always present sr-only). Filled bars are SOLID; unfilled bars are an
 *     OUTLINE over a faint track — a shape difference, not a hue difference.
 *   - A level of 0 is a legitimate reading, not an error: every bar renders as a
 *     track, aria-valuenow is 0, and the label falls back to `emptyLabel`
 *     ("None" by default) so the meter still reads "None, 0 of 4".
 *   - Contrast: the label uses the primary text token and the name/count the
 *     muted token, each at or above 4.5:1 on a light and a dark surface; every
 *     bar fill clears the 3:1 bar asked of an informative graphic mark.
 *   - Reduced motion keeps the END STATE. The bars' resting state IS the final
 *     one (full height, opaque); the rise is a keyframe that ENDS there, so
 *     `motion-reduce:animate-none` renders the finished ladder immediately, and
 *     `motion-reduce:transition-none` lands level changes on the new value.
 *   - forced-colors: bounds stay drawn with border-[CanvasText], a FILLED bar
 *     repaints to Highlight and a track to a GrayText outline over Canvas, and
 *     all text becomes CanvasText.
 *   - Nothing here reads the clock, storage or the DOM: the level is a prop, so
 *     the server and the client render byte-identical markup.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

type Size = "sm" | "md" | "lg";

/**
 * Semantic strength band. Derived from the level by default, overridable by the
 * caller. It only ever selects a HUE — the reading itself is carried by the
 * filled count, the height ladder and the text label, so a tone is never the
 * sole carrier of meaning.
 */
export type SignalTone = "none" | "low" | "mid" | "high";

/** Hard bounds on the step count, so a bad prop degrades instead of exploding. */
const MIN_LEVELS = 1;
const MAX_LEVELS = 12;
/** Per-bar stagger for the rise-in, in milliseconds. */
const STAGGER_MS = 55;

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] " +
  "forced-colors:data-[focus=true]:outline-[Highlight]";

/**
 * Keyframes travel with the component instead of living in a global stylesheet a
 * copier would have to hunt down. React 19 hoists this and deduplicates it by
 * `href`, so a list of twenty readouts emits the rule once.
 *
 * The animation ends on `scale: 1 1; opacity: 1` — which is exactly the resting
 * state, nothing is applied at rest — so cancelling it with
 * `motion-reduce:animate-none` leaves the ladder fully drawn at its true value.
 * `scale` is the standalone property Tailwind v4 writes its utilities to, and it
 * is the only thing animated here; there is no `transform` in the file to fight.
 */
const SIGNAL_KEYFRAMES = `@keyframes mq-signal-rise{from{scale:1 0.24;opacity:0}to{scale:1 1;opacity:1}}`;

const signalBarsVariants = cva(
  [
    "relative isolate inline-flex max-w-full items-center gap-[var(--mq-gap-x,10px)]",
    // Adaptive light+dark token vocabulary. The strength hues are shared token
    // for token with Gauge's zones so the two read as one system.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-track:rgba(28,28,25,0.06)] [--mq-track-brd:#a8a69d]",
    "[--mq-ring:#171817]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-track:rgba(241,239,233,0.10)] dark:[--mq-track-brd:#7b7d75]",
    "dark:[--mq-ring:#f1efe9]",
    "text-[color:var(--mq-text,#1c1c19)]",
    FOCUS_RING,
    "forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      // A stepped meter has one composition. `default` exists so the registry can
      // list a variant axis and the preview can coerce an incoming value.
      variant: { default: "" },
      // Size scales the bar geometry and the type; no colour token depends on it.
      size: {
        sm: [
          "[--mq-bar-w:4px] [--mq-bar-min:6px] [--mq-bar-max:17px] [--mq-bar-r:1.5px]",
          "[--mq-gap:3px] [--mq-gap-x:8px] [--mq-label-size:9px] text-[11px]",
        ].join(" "),
        md: [
          "[--mq-bar-w:5px] [--mq-bar-min:8px] [--mq-bar-max:24px] [--mq-bar-r:2px]",
          "[--mq-gap:4px] [--mq-gap-x:10px] [--mq-label-size:10px] text-[12px]",
        ].join(" "),
        lg: [
          "[--mq-bar-w:7px] [--mq-bar-min:11px] [--mq-bar-max:32px] [--mq-bar-r:2.5px]",
          "[--mq-gap:5px] [--mq-gap-x:12px] [--mq-label-size:11px] text-[13px]",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/**
 * Fill colour of the lit bars, one hue per strength band, each with a dark-scheme
 * counterpart. Meaning never rides on these: they tint a reading that is already
 * spelled out in text and drawn as a count plus a height ladder.
 */
const TONE_FILL: Record<SignalTone, string> = {
  none: "[--mq-fill:#6b6b62] dark:[--mq-fill:#9a9a90]",
  low: "[--mq-fill:#9c2f22] dark:[--mq-fill:#ff9d8e]",
  mid: "[--mq-fill:#b06a00] dark:[--mq-fill:#e5a54b]",
  high: "[--mq-fill:#15703f] dark:[--mq-fill:#5ad18b]",
};

/** Default wording when the caller supplies no per-level labels. */
function defaultLevelLabel(fraction: number): string {
  if (fraction <= 0.25) return "Weak";
  if (fraction <= 0.5) return "Fair";
  if (fraction <= 0.75) return "Good";
  return "Excellent";
}

/** Strength band for a level, so 0 is always its own neutral band. */
function toneForLevel(level: number, levels: number): SignalTone {
  if (level <= 0) return "none";
  const fraction = level / levels;
  if (fraction <= 1 / 3) return "low";
  if (fraction <= 2 / 3) return "mid";
  return "high";
}

/** Coerces a caller-supplied count into a whole number of drawable bars. */
function safeLevels(levels: number): number {
  if (!Number.isFinite(levels)) return 4;
  return Math.min(Math.max(Math.round(levels), MIN_LEVELS), MAX_LEVELS);
}

/**
 * Height of bar `index` on the ladder, as a CSS `calc` interpolating the two
 * size tokens. Derived purely from the index — no cursor is reassigned during
 * render, which the React Compiler forbids.
 */
function barHeight(index: number, levels: number): string {
  const step = levels > 1 ? Math.round((index / (levels - 1)) * 1000) / 1000 : 1;
  return `calc(var(--mq-bar-min, 8px) + (var(--mq-bar-max, 24px) - var(--mq-bar-min, 8px)) * ${step})`;
}

/** Bar chrome shared by both states: geometry, the level transition, bounds. */
const BAR_BASE = [
  "block w-[var(--mq-bar-w,5px)] shrink-0 rounded-[var(--mq-bar-r,2px)] border origin-bottom",
  // Only properties that genuinely differ between filled and unfilled are named,
  // so there is no phantom transition and nothing animates against `none`.
  "transition-[background-color,border-color,box-shadow] duration-[260ms] ease-out",
  "motion-reduce:transition-none",
  "forced-colors:shadow-none",
].join(" ");

/** A lit bar: solid body, lit top edge, seated shadow. Highlight when forced. */
const BAR_FILLED = [
  // The explicit `color:` hint keeps `border-[…]` in the border-COLOUR group, so
  // tailwind-merge can never mistake it for a width and drop the 1px `border`.
  "border-[color:var(--mq-fill,#15703f)] bg-[var(--mq-fill,#15703f)]",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.38),inset_0_-2px_3px_rgba(0,0,0,0.20),0_1px_2px_rgba(20,20,18,0.22)]",
  "forced-colors:bg-[Highlight] forced-colors:border-[CanvasText]",
].join(" ");

/**
 * An unlit bar: an OUTLINE over a faint track. The difference from a lit bar is
 * a treatment (hollow vs solid), not only a hue, so the reading survives
 * greyscale, colour blindness and forced colours alike.
 */
const BAR_TRACK = [
  "border-[color:var(--mq-track-brd,#a8a69d)] bg-[var(--mq-track,rgba(28,28,25,0.06))]",
  "shadow-[inset_0_1px_2px_rgba(20,20,18,0.10)]",
  "forced-colors:bg-[Canvas] forced-colors:border-[GrayText]",
].join(" ");

export type SignalBarsProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "children" | "role"
> &
  Omit<VariantProps<typeof signalBarsVariants>, "size" | "variant"> & {
    /** Current level, 0 through `levels`. 0 is a valid, fully readable state. */
    level: number;
    /** How many bars the ladder has. Clamped to 1–12. Defaults to 4. */
    levels?: number;
    /** One label per level, index `level - 1` (e.g. Weak / Fair / Good / Excellent). */
    labels?: readonly string[];
    /** Wording for level 0. Defaults to "None". */
    emptyLabel?: string;
    /** Overrides the strength band that tints the lit bars. */
    tone?: SignalTone;
    /** Optional name shown above the reading. A string also names the meter. */
    label?: React.ReactNode;
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: Size;
    /** Hide the visible text block; the reading stays in ARIA and sr-only text. */
    showText?: boolean;
    /** Hide the "3/4" counter next to the label. */
    showCount?: boolean;
    /** Rise the ladder in on mount. Reduced motion always lands on the reading. */
    animate?: boolean;
  };

/**
 * A passive, server-friendly stepped meter. Uncontrolled and stateless: the
 * reading is a prop, so nothing in render depends on the clock or on randomness
 * and the statically generated markup matches the client exactly.
 */
export function SignalBars({
  "aria-label": ariaLabel,
  "aria-valuetext": ariaValueText,
  animate = true,
  className,
  emptyLabel = "None",
  label,
  labels,
  level,
  levels = 4,
  material = "adaptive",
  showCount = true,
  showText = true,
  size = "md",
  tone,
  variant = "default",
  ...props
}: SignalBarsProps) {
  const levelCount = safeLevels(levels);
  const rawLevel = Number.isFinite(level) ? Math.round(level) : 0;
  const current = Math.min(Math.max(rawLevel, 0), levelCount);
  const fraction = current / levelCount;

  const resolvedTone = tone ?? toneForLevel(current, levelCount);
  const levelLabel =
    current <= 0 ? emptyLabel : (labels?.[current - 1] ?? defaultLevelLabel(fraction));

  const accessibleName = ariaLabel ?? (typeof label === "string" ? label : "Signal level");
  const countText = `${current} of ${levelCount}`;
  const valueText = ariaValueText ?? `${levelLabel}, ${countText}`;
  const summary = `${accessibleName}: ${levelLabel}. ${countText} bars filled.`;

  return (
    <>
      {/*
        `href` + `precedence` so React 19 hoists this and deduplicates it: a bare
        <style> would emit one identical copy per readout on the page.
      */}
      <style href="mq-signal-bars" precedence="medium">
        {SIGNAL_KEYFRAMES}
      </style>
      <div
        {...props}
        aria-label={accessibleName}
        aria-valuemax={levelCount}
        aria-valuemin={0}
        aria-valuenow={current}
        aria-valuetext={valueText}
        className={cn(signalBarsVariants({ size, variant }), TONE_FILL[resolvedTone], className)}
        data-level={current}
        data-levels={levelCount}
        data-material={material}
        data-tone={resolvedTone}
        role="meter"
      >
        {/* Authoritative textual equivalent, always rendered. Everything visual
            below is aria-hidden, so nothing is announced twice. */}
        <span className={SR_ONLY}>{summary}</span>

        {/* The ladder. Decorative: the count, the heights and the label carry the
            reading, and all three are already in the accessible name and value. */}
        <span
          aria-hidden="true"
          className="flex h-[var(--mq-bar-max,24px)] shrink-0 items-end gap-[var(--mq-gap,4px)]"
          data-signal-track=""
        >
          {/* Each bar is derived purely from its own index — nothing declared in
              the component body is reassigned from inside the map. */}
          {Array.from({ length: levelCount }, (_unused, index) => (
            <span
              className={cn(
                BAR_BASE,
                index < current ? BAR_FILLED : BAR_TRACK,
                animate &&
                  "animate-[mq-signal-rise_420ms_cubic-bezier(0.22,1.15,0.36,1)_both] motion-reduce:animate-none",
              )}
              data-filled={index < current ? "true" : "false"}
              key={index}
              style={{
                animationDelay: animate ? `${index * STAGGER_MS}ms` : undefined,
                height: barHeight(index, levelCount),
              }}
            />
          ))}
        </span>

        {/* Visible reading. aria-hidden, because the meter role already announces
            the name, the level and the spelled-out value text. */}
        {showText && (
          <span
            aria-hidden="true"
            className="flex min-w-0 flex-col justify-center gap-[2px] leading-tight"
            data-signal-text=""
          >
            {label != null && (
              <span className="truncate text-[length:var(--mq-label-size,10px)] font-semibold tracking-[0.09em] text-[color:var(--mq-muted,#55554e)] uppercase forced-colors:text-[CanvasText]">
                {label}
              </span>
            )}
            <span className="flex items-baseline gap-[6px]">
              <span className="truncate font-bold text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]">
                {levelLabel}
              </span>
              {showCount && (
                <span className="shrink-0 font-semibold tabular-nums text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
                  {current}/{levelCount}
                </span>
              )}
            </span>
          </span>
        )}
      </div>
    </>
  );
}

export { signalBarsVariants };
