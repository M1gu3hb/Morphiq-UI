"use client";

import * as React from "react";
import { Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Trend Indicator
 *
 * A compact KPI delta: a direction glyph in a small raised chip, the signed
 * change as real numeric text, and an optional comparison caption
 * ("vs last month"). It is a READOUT — nothing inside it is interactive.
 *
 * This is a material-AGNOSTIC component: it ships a single style built on the
 * adaptive light+dark token vocabulary shared with Gauge and Sparkline, so a
 * dashboard reads as one system. `material` is accepted only for catalog parity
 * and is reflected on `data-material`; it drives no separate recipe.
 *
 * THE INVERTED SEMANTIC (the reason this component exists)
 *
 * On churn, error rate or latency, DOWN is good. `inverted` decouples the TONE
 * (is this good or bad?) from the DIRECTION (which way did the number move?),
 * so a falling churn rate can be green while still reading, in words, as
 * "Down 3.1 percent". Direction and goodness are therefore never conflated:
 *
 *   - DIRECTION is carried by the arrow SHAPE (rising / falling / flat bar),
 *     by the SIGN character in the figure (+ / − / none) and by the word
 *     "Up" / "Down" / "No change" that opens the accessible label.
 *   - GOODNESS is carried by a separate QUALIFIER word — "improvement",
 *     "decline", "no change" — which is always in the accessible label and is
 *     shown visibly whenever tone and direction disagree, exactly the case
 *     where an arrow alone would mislead a sighted reader.
 *
 * Colour is therefore never the sole carrier of anything, and a reader who
 * cannot separate the hues loses no information at all.
 *
 * Accessibility contract:
 *
 *   - The wrapper is `role="img"` with an `aria-label` that spells the whole
 *     reading as a sentence ("Up 12.4 percent versus last month, improvement."),
 *     and every visual part below is additionally `aria-hidden`, so the reading
 *     is announced once, atomically, and never assembled from stray fragments.
 *     One channel, consistently — there is no second sr-only sentence to drift.
 *   - `live="polite"` upgrades that same node to an atomic polite live region
 *     for a tile whose figure is refreshed in place. It is opt-in: a wall of
 *     static KPIs must not announce itself on mount. Errors are not this
 *     component's job — an assertive announcement belongs on the Alert that
 *     explains the failure, not on a number.
 *   - Numbers use tabular numerals so a column of deltas aligns digit for digit.
 *   - Reduced motion: the entrance is expressed as keyframes whose END state IS
 *     the resting state, so `motion-reduce:animate-none` leaves the indicator
 *     fully rendered at its final value rather than mid-flight or invisible.
 *   - forced-colors: bounds are kept with `CanvasText`, the decorative gradient
 *     and the depth shadows are cleared, and every glyph and figure repaints to
 *     `CanvasText` — safe precisely because meaning already lives in words.
 *
 * SSR/SSG safety: every figure is a prop. Nothing reads the clock, the DOM or
 * storage, in render or anywhere else, so a statically generated page and its
 * hydration agree exactly.
 *
 * Local theming knobs (each used with a literal fallback):
 *
 *   --mq-text       primary foreground
 *   --mq-muted      caption / qualifier foreground
 *   --mq-body       pill surface
 *   --mq-brd        pill border
 *   --mq-ring       focus ring colour
 *   --mq-tone       the tone colour: the figure and the arrow glyph
 *   --mq-tone-soft  the glyph chip's wash
 *   --mq-tone-edge  the glyph chip's border
 *   --mq-px/--mq-py/--mq-gap/--mq-radius            pill rhythm
 *   --mq-chip/--mq-chip-radius/--mq-glyph           glyph chip geometry
 *   --mq-figure/--mq-meta                           type scale
 */

export type TrendDirection = "up" | "down" | "flat";
export type TrendTone = "positive" | "negative" | "neutral";
/** `auto` derives the tone from the direction and the `inverted` semantic. */
export type TrendToneOption = TrendTone | "auto";
export type TrendFormat = "percent" | "absolute";
type TrendSize = "sm" | "md" | "lg";

/** Direction glyphs. Three distinct SHAPES, not three colours of one shape. */
const DIRECTION_ICON: Record<TrendDirection, LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

/** The word that opens the accessible label. Direction, never goodness. */
const DIRECTION_WORD: Record<TrendDirection, string> = {
  up: "Up",
  down: "Down",
  flat: "No change",
};

/**
 * The visible sign. `−` is U+2212 MINUS SIGN rather than a hyphen: it is the
 * same width as a tabular digit, so a column of deltas stays on its grid. It is
 * only ever seen, never spoken — the label says "Down" instead.
 */
const DIRECTION_SIGN: Record<TrendDirection, string> = {
  up: "+",
  down: "−",
  flat: "",
};

/** Goodness, in words. Carried separately from direction so the two can differ. */
const TONE_QUALIFIER: Record<TrendTone, string> = {
  positive: "improvement",
  negative: "decline",
  neutral: "no change",
};

/**
 * The indicator is not focusable by itself — it is a readout. The ring is
 * declared anyway for the two real cases: a caller that gives it a `tabIndex`
 * to make it a scan stop, and a caller that wraps it in a link. The parallel
 * `data-[focus=true]` selector lets the documentation preview render the
 * focused look without synthesising a keyboard event.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] " +
  "forced-colors:data-[focus=true]:outline-[Highlight]";

/**
 * Entrance keyframes travel with the component rather than living in a global
 * stylesheet a copier would have to find. React 19 hoists this and deduplicates
 * it by `href`, so a dashboard of forty deltas emits one rule.
 *
 * They animate the STANDALONE `translate` and `scale` properties — the ones
 * Tailwind v4's utilities write to — so nothing here can fight a caller's
 * `transform`, and there is no `transform` anywhere in this file.
 *
 * Every animation ENDS on `opacity:1` with no offset, which is exactly the
 * resting state of an un-animated chip. `motion-reduce:animate-none` therefore
 * leaves the indicator fully drawn at its true value.
 */
const TREND_KEYFRAMES =
  "@keyframes mq-trend-up{from{opacity:0;translate:0 6px}to{opacity:1;translate:0 0}}" +
  "@keyframes mq-trend-down{from{opacity:0;translate:0 -6px}to{opacity:1;translate:0 0}}" +
  "@keyframes mq-trend-flat{from{opacity:0;scale:0.84}to{opacity:1;scale:1}}" +
  "@keyframes mq-trend-figure{from{opacity:0;translate:-5px 0}to{opacity:1;translate:0 0}}";

function TrendKeyframes() {
  return (
    <style href="mq-trend-indicator" precedence="medium">
      {TREND_KEYFRAMES}
    </style>
  );
}

const trendVariants = cva(
  [
    "relative isolate inline-flex max-w-full items-center align-middle",
    "gap-[var(--mq-gap,8px)] rounded-[var(--mq-radius,12px)]",
    "px-[var(--mq-px,10px)] py-[var(--mq-py,5px)]",
    "border border-[var(--mq-brd,rgba(23,24,23,0.12))] bg-[var(--mq-body,rgba(23,24,23,0.035))]",
    // Restrained depth: a lit top edge and a single contact shadow, so the pill
    // sits ON the dashboard surface instead of floating over it.
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.60),0_1px_2px_rgba(20,20,18,0.07)]",
    "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_1px_2px_rgba(0,0,0,0.45)]",
    "text-[color:var(--mq-text,#1c1c19)]",
    // Adaptive light+dark vocabulary, shared token for token with Gauge and
    // Sparkline. Both foregrounds clear 4.5:1 on a light and a dark surface.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-body:rgba(23,24,23,0.035)] [--mq-brd:rgba(23,24,23,0.12)] [--mq-ring:#171817]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-body:rgba(255,255,255,0.06)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9]",
    FOCUS_RING,
    // Forced colours erase translucency and shadow, so the pill would dissolve
    // into the page; a system border keeps its bounds and every mark repaints.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]",
    "forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      /**
       * Goodness, not direction. Hues hold at or above 4.5:1 against a light and
       * a dark page surface, because the figure they colour is real text — and
       * the same tone is always paired with a qualifier word, so flattening the
       * hues costs nothing.
       */
      tone: {
        positive: [
          "[--mq-tone:#15703f] [--mq-tone-soft:rgba(21,112,63,0.13)] [--mq-tone-edge:rgba(21,112,63,0.30)]",
          "dark:[--mq-tone:#5ad18b] dark:[--mq-tone-soft:rgba(90,209,139,0.16)] dark:[--mq-tone-edge:rgba(90,209,139,0.34)]",
        ].join(" "),
        negative: [
          "[--mq-tone:#9c2f22] [--mq-tone-soft:rgba(156,47,34,0.13)] [--mq-tone-edge:rgba(156,47,34,0.30)]",
          "dark:[--mq-tone:#ff9d8e] dark:[--mq-tone-soft:rgba(255,157,142,0.16)] dark:[--mq-tone-edge:rgba(255,157,142,0.34)]",
        ].join(" "),
        neutral: [
          "[--mq-tone:#55554e] [--mq-tone-soft:rgba(85,85,78,0.13)] [--mq-tone-edge:rgba(85,85,78,0.28)]",
          "dark:[--mq-tone:#b9b7b0] dark:[--mq-tone-soft:rgba(185,183,176,0.16)] dark:[--mq-tone-edge:rgba(185,183,176,0.32)]",
        ].join(" "),
      },
      // Single composition: a delta has one shape. `default` exists so the
      // registry can list a variant and the preview can coerce an incoming value.
      variant: { default: "" },
      size: {
        sm: [
          "[--mq-px:8px] [--mq-py:3px] [--mq-gap:6px] [--mq-radius:10px]",
          "[--mq-chip:18px] [--mq-chip-radius:6px] [--mq-glyph:12px]",
          "[--mq-figure:13px] [--mq-meta:11px]",
        ].join(" "),
        md: [
          "[--mq-px:10px] [--mq-py:5px] [--mq-gap:8px] [--mq-radius:12px]",
          "[--mq-chip:22px] [--mq-chip-radius:8px] [--mq-glyph:14px]",
          "[--mq-figure:15px] [--mq-meta:12px]",
        ].join(" "),
        lg: [
          "[--mq-px:13px] [--mq-py:7px] [--mq-gap:10px] [--mq-radius:15px]",
          "[--mq-chip:28px] [--mq-chip-radius:10px] [--mq-glyph:18px]",
          "[--mq-figure:19px] [--mq-meta:13px]",
        ].join(" "),
      },
    },
    defaultVariants: { tone: "neutral", variant: "default", size: "md" },
  },
);

/**
 * The glyph chip.
 *
 * Its lighting is a fourth, silent direction channel: a rising delta is lit
 * from the top like something pushed up into the light, a falling one is lit
 * from below, and a flat one has no gradient at all. Decoration — the arrow
 * shape, the sign and the words already carry the direction — so forced colours
 * drop it without loss.
 */
const glyphVariants = cva(
  [
    "grid shrink-0 place-items-center",
    "size-[var(--mq-chip,22px)] rounded-[var(--mq-chip-radius,8px)]",
    "border border-[var(--mq-tone-edge,rgba(85,85,78,0.28))]",
    "bg-[var(--mq-tone-soft,rgba(85,85,78,0.13))] text-[color:var(--mq-tone,#55554e)]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
    "[&>svg]:size-[var(--mq-glyph,14px)] [&>svg]:shrink-0",
    // Background IMAGES survive forced colours untouched, so the gradient has to
    // be cleared by hand or it would sit on a system-coloured surface.
    "forced-colors:[background-image:none] forced-colors:border-[CanvasText]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      direction: {
        up: "[background-image:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
        down: "[background-image:linear-gradient(0deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
        flat: "[background-image:none]",
      },
      animate: { true: "", false: "" },
    },
    compoundVariants: [
      // The chip arrives FROM the direction it describes: a rise lifts into
      // place, a fall drops into place, a flat delta simply settles. The end
      // state of each is the resting state, so reduced motion loses only travel.
      {
        animate: true,
        direction: "up",
        class:
          "animate-[mq-trend-up_420ms_cubic-bezier(0.22,1.2,0.36,1)_both] motion-reduce:animate-none",
      },
      {
        animate: true,
        direction: "down",
        class:
          "animate-[mq-trend-down_420ms_cubic-bezier(0.22,1.2,0.36,1)_both] motion-reduce:animate-none",
      },
      {
        animate: true,
        direction: "flat",
        class:
          "animate-[mq-trend-flat_360ms_cubic-bezier(0.34,1.4,0.64,1)_both] motion-reduce:animate-none",
      },
    ],
    defaultVariants: { direction: "flat", animate: true },
  },
);

/**
 * Whether a node would actually put text on the page.
 *
 * A caption that renders to nothing — `""` from a missed i18n lookup, or the
 * `false` a `cond && text` collapses to — must not send the component down the
 * "has a caption" path and leave an empty separator dot stranded in the layout.
 */
function rendersText(node: React.ReactNode): boolean {
  if (node == null || typeof node === "boolean") return false;
  if (typeof node === "string") return node.trim() !== "";
  return true;
}

/** Groups an integer run in threes. Deterministic and locale-free, so a static page and its hydration agree. */
function groupInteger(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Formats the unsigned magnitude; the sign is a separate, deliberate glyph. */
function formatMagnitude(value: number, precision: number): string {
  const safe = Number.isFinite(value) ? Math.abs(value) : 0;
  const places = Math.min(Math.max(Math.trunc(precision), 0), 6);
  const [whole, fraction] = safe.toFixed(places).split(".");
  const grouped = groupInteger(whole);
  return fraction ? `${grouped}.${fraction}` : grouped;
}

/** Direction from the sign of the change, when the caller does not pin it. */
function deriveDirection(value: number): TrendDirection {
  if (!Number.isFinite(value) || value === 0) return "flat";
  return value > 0 ? "up" : "down";
}

/** Goodness from direction + the inverted semantic, unless pinned explicitly. */
function resolveTone(
  direction: TrendDirection,
  inverted: boolean,
  tone: TrendToneOption,
): TrendTone {
  if (tone !== "auto") return tone;
  if (direction === "flat") return "neutral";
  const isGood = inverted ? direction === "down" : direction === "up";
  return isGood ? "positive" : "negative";
}

export type TrendIndicatorProps = Omit<
  React.ComponentPropsWithRef<"span">,
  "children" | "color" | "role"
> & {
  /**
   * The change. Its sign picks the direction unless `direction` is given; the
   * figure always renders the unsigned magnitude next to an explicit sign glyph.
   */
  value: number;
  /** Pins the direction, e.g. `flat` for a genuinely unchanged figure. */
  direction?: TrendDirection;
  /** Down is good (churn, error rate, latency). Decouples tone from direction. */
  inverted?: boolean;
  /** Pins the tone. `auto` (default) derives it from direction + `inverted`. */
  tone?: TrendToneOption;
  /** `percent` suffixes `%` and says "percent"; `absolute` uses `unit`. */
  format?: TrendFormat;
  /** Decimal places. Defaults to 1 for percentages and 0 for absolute values. */
  precision?: number;
  /** Visible unit. Defaults to `%` for percentages and nothing for absolutes. */
  unit?: string;
  /** Spoken unit, when the visible one is an abbreviation ("ms" → "milliseconds"). */
  unitLabel?: string;
  /** Visible comparison caption, e.g. "vs last month". */
  comparison?: React.ReactNode;
  /** Spoken comparison; defaults to `comparison` when that is a plain string. */
  comparisonLabel?: string;
  /** Overrides the goodness word ("improvement" / "decline" / "no change"). */
  qualifier?: React.ReactNode;
  /** Spoken goodness word; defaults to `qualifier` when that is a plain string. */
  qualifierLabel?: string;
  /**
   * Shows the goodness word visibly. Defaults to `true` exactly when tone and
   * direction disagree — the inverted case, where the arrow alone would mislead
   * a sighted reader. It is in the accessible label either way.
   */
  showQualifier?: boolean;
  /** Prefixes the accessible label when no visible metric name sits beside it. */
  metric?: string;
  /** Formats the unsigned magnitude. Receives the absolute change. */
  formatValue?: (magnitude: number) => string;
  /** Catalog-parity only; reflected on `data-material`, drives no recipe. */
  material?: MaterialSlug;
  variant?: "default";
  size?: TrendSize;
  /**
   * Announce updates. `off` (default) is a static readout; `polite` makes the
   * node an atomic polite live region for a figure refreshed in place.
   */
  live?: "off" | "polite";
  /** Plays the directional entrance. Reduced motion always lands on the value. */
  animate?: boolean;
  glyphClassName?: string;
  figureClassName?: string;
  metaClassName?: string;
};

/**
 * A passive, server-friendly KPI delta. Uncontrolled and stateless: the reading
 * is a prop, so nothing in render depends on the clock or on randomness.
 */
export function TrendIndicator({
  "aria-label": ariaLabel,
  animate = true,
  className,
  comparison,
  comparisonLabel,
  direction,
  figureClassName,
  format = "percent",
  formatValue,
  glyphClassName,
  inverted = false,
  live = "off",
  material = "adaptive",
  metaClassName,
  metric,
  precision,
  qualifier,
  qualifierLabel,
  showQualifier,
  size = "md",
  tone = "auto",
  unit,
  unitLabel,
  value,
  variant = "default",
  ...props
}: TrendIndicatorProps) {
  const resolvedDirection = direction ?? deriveDirection(value);
  const resolvedTone = resolveTone(resolvedDirection, inverted, tone);
  const Icon = DIRECTION_ICON[resolvedDirection];

  const resolvedPrecision = precision ?? (format === "percent" ? 1 : 0);
  const magnitude = Number.isFinite(value) ? Math.abs(value) : 0;
  const magnitudeText = formatValue
    ? formatValue(magnitude)
    : formatMagnitude(magnitude, resolvedPrecision);

  // `%` hugs its number; a word-like unit ("ms", "tickets") gets a space. The
  // figure is `whitespace-nowrap`, so the unit can never wrap away from the
  // number it measures.
  const visibleUnit = unit ?? (format === "percent" ? "%" : "");
  const unitGap = visibleUnit === "" || visibleUnit === "%" ? "" : " ";
  const spokenUnit = unitLabel ?? (format === "percent" ? "percent" : visibleUnit);

  // Tone and direction disagree only when the semantic is inverted (or pinned
  // against the arrow). That is precisely when a sighted reader needs the
  // goodness spelled out next to the number, so it defaults to visible there.
  const toneDisagrees =
    resolvedTone !== "neutral" && (resolvedTone === "positive") !== (resolvedDirection === "up");
  const showsQualifier = showQualifier ?? toneDisagrees;

  const qualifierNode = rendersText(qualifier) ? qualifier : TONE_QUALIFIER[resolvedTone];
  const spokenQualifier =
    qualifierLabel ??
    (typeof qualifier === "string" && qualifier.trim() !== ""
      ? qualifier
      : TONE_QUALIFIER[resolvedTone]);
  const spokenComparison =
    comparisonLabel ?? (typeof comparison === "string" ? comparison.trim() : "");

  // "Up 12.4 percent versus last month, improvement." Direction first, then the
  // magnitude, then the comparison, then goodness as its own clause — never
  // merged with the direction, so an inverted delta cannot contradict itself.
  const spokenMagnitude = `${magnitudeText}${spokenUnit ? ` ${spokenUnit}` : ""}`;
  const head = DIRECTION_WORD[resolvedDirection];
  const openingClause =
    resolvedDirection === "flat" ? `${head}, ${spokenMagnitude}` : `${head} ${spokenMagnitude}`;
  const comparisonClause = spokenComparison ? ` ${spokenComparison}` : "";
  // A neutral delta already said "No change"; repeating it as a qualifier would
  // only pad the announcement.
  const qualifierClause = resolvedTone === "neutral" ? "" : `, ${spokenQualifier}`;
  const metricClause = metric && metric.trim() !== "" ? `${metric.trim()}: ` : "";
  const label =
    ariaLabel ?? `${metricClause}${openingClause}${comparisonClause}${qualifierClause}.`;

  const hasComparison = rendersText(comparison);
  const hasMeta = showsQualifier || hasComparison;
  const isLive = live === "polite";

  return (
    <>
      <TrendKeyframes />
      {/* `props` is spread first so the derived role, label and data-* below
          always win over anything a caller passes through. */}
      <span
        {...props}
        aria-atomic={isLive ? true : undefined}
        aria-label={label}
        aria-live={isLive ? "polite" : undefined}
        className={cn(trendVariants({ tone: resolvedTone, variant, size }), className)}
        data-direction={resolvedDirection}
        data-inverted={inverted ? "true" : undefined}
        data-material={material}
        data-tone={resolvedTone}
        role="img"
      >
        {/* role="img" already makes descendants presentational; aria-hidden is
            belt and braces so no assistive tech re-reads the fragments. */}
        <span
          aria-hidden="true"
          className={cn(glyphVariants({ animate, direction: resolvedDirection }), glyphClassName)}
          data-trend-glyph=""
        >
          <Icon />
        </span>

        <span
          aria-hidden="true"
          className={cn(
            // Colour and size are both `text-*` utilities, so each carries an
            // explicit data-type hint: without it `tailwind-merge` reads them as
            // one conflicting group and silently drops the first.
            "shrink-0 whitespace-nowrap font-extrabold tracking-[-0.01em] tabular-nums",
            "text-[color:var(--mq-tone,#55554e)] text-[length:var(--mq-figure,15px)] leading-none",
            "forced-colors:text-[CanvasText]",
            animate &&
              "animate-[mq-trend-figure_360ms_cubic-bezier(0.22,1.2,0.36,1)_70ms_both] motion-reduce:animate-none",
            figureClassName,
          )}
          data-trend-figure=""
        >
          {DIRECTION_SIGN[resolvedDirection]}
          {magnitudeText}
          {unitGap}
          {visibleUnit}
        </span>

        {hasMeta ? (
          <span
            aria-hidden="true"
            className={cn(
              "min-w-0 truncate font-medium",
              "text-[color:var(--mq-muted,#55554e)] text-[length:var(--mq-meta,12px)] leading-[1.35]",
              "forced-colors:text-[CanvasText]",
              metaClassName,
            )}
            data-trend-meta=""
          >
            {showsQualifier ? <span data-trend-qualifier="">{qualifierNode}</span> : null}
            {showsQualifier && hasComparison ? (
              <span className="px-[5px] opacity-60">&middot;</span>
            ) : null}
            {hasComparison ? <span data-trend-comparison="">{comparison}</span> : null}
          </span>
        ) : null}
      </span>
    </>
  );
}

export { glyphVariants, trendVariants };
