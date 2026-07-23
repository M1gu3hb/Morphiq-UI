"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Donut Chart
 *
 * A ring chart drawn entirely by hand as inline SVG — no charting library, no
 * WebGL, no global stylesheet. Each slice is one concentric `<circle>` sharing
 * the same centre and radius; its arc is carved out with a normalized
 * `stroke-dasharray` (`pathLength={1}`, so a slice's fraction of the total is its
 * dash length) and positioned by a deterministic cumulative `rotate()`. Copying
 * this file plus `src/lib/cn.ts` reproduces the full look.
 *
 * This is a material-AGNOSTIC data component: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and reflected on `data-material`; it drives no separate recipe.
 *
 * Theming knobs are local CSS variables, each referenced with a literal
 * fallback:
 *
 *   --mq-text        centre value + legend label/value text
 *   --mq-muted       centre caption + percent text
 *   --mq-track       the empty ring behind the slices
 *   --mq-slice-1..6  the categorical slice palette (light + dark tuned)
 *
 * Data-accessibility contract (the defining rule of this component):
 *   - The authoritative accessible equivalent is a real `sr-only` <table>: a
 *     <caption> names it, a header row labels the Category, Value and Share
 *     columns, one row per datum carries the exact figures via <th scope="row">
 *     + <td>, and a <tfoot> row carries the total. The decorative SVG ring and
 *     the visible legend are `aria-hidden`, so a screen reader announces the
 *     table's precise numbers rather than trying to interpret a drawing (and the
 *     legend is not double-announced).
 *   - COLOR is never the sole carrier of meaning: the centre prints the total as
 *     text, and every legend row pairs its colour swatch with the category
 *     label, the numeric value and the percent share — all as text — so the data
 *     reads without perceiving any hue.
 *   - Contrast: the centre value and legend label/value use `--mq-text` and the
 *     caption/percent use `--mq-muted`, each at or above 4.5:1 against a light
 *     and a dark surface; every slice colour clears the 3:1 bar for an
 *     informative graphic in both schemes.
 *   - Slices draw on mount reduced-motion-safe WITHOUT JS: a slice's resting
 *     dash is its FINAL arc (so SSR, no-JS and reduced-motion all show the true
 *     share), and the from-nothing entrance is expressed with `@starting-style`
 *     (the `starting:` variant) as a constant `stroke-dasharray: 0 1` growing to
 *     the resting dash, with a matching `transition-[stroke-dasharray]` and
 *     `motion-reduce:transition-none` landing straight on the final ring.
 *   - forced-colors: the decorative track is dropped, every slice repaints to
 *     `CanvasText` with the largest slice marked in `Highlight`, and the legend
 *     text and swatch outlines become `CanvasText` (Highlight for the largest),
 *     so the shares stay perceivable without author colour.
 *   - Every figure is a prop and percentages are computed deterministically, so
 *     nothing in render is time-dependent or random.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

type Variant = "default";
type Size = "sm" | "md" | "lg";

export type DonutChartDatum = {
  /** Category name for this slice. Shown in the legend and the table row. */
  label: string;
  /** Numeric magnitude. Negative values are clamped to 0 for drawing only. */
  value: number;
  /** Optional explicit slice colour; falls back to the adaptive palette by index. */
  color?: string;
};

/** Fixed 100x100 drawing box; the centre is (50, 50) for every size. */
const CX = 50;
const CY = 50;
const VB = 100;

/**
 * A tiny angular gap subtracted from each slice's dash so neighbouring arcs read
 * as separate wedges. Applied only when a slice is comfortably larger than the
 * gap, so a thin slice never collapses to nothing.
 */
const GAP = 0.006;

/** Per-size rendered SVG box, ring thickness, and centre font sizes (viewBox units). */
const DONUT: Record<Size, { svg: string; ring: number; value: number; caption: number }> = {
  sm: { svg: "h-[120px] w-[120px]", ring: 13, value: 19, caption: 8 },
  md: { svg: "h-[150px] w-[150px]", ring: 15, value: 22, caption: 9 },
  lg: { svg: "h-[184px] w-[184px]", ring: 17, value: 26, caption: 10 },
};

/** Adaptive default palette. Light values double as the literal var() fallbacks. */
const SLICE_FALLBACK = ["#3f5bd9", "#15703f", "#b7791f", "#9c2f22", "#6d28d9", "#0e7490"];

const donutChartVariants = cva(
  [
    "relative isolate inline-flex flex-col items-center gap-3 text-left",
    // Adaptive light+dark token vocabulary.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e] [--mq-track:rgba(23,24,23,0.08)]",
    "[--mq-slice-1:#3f5bd9] [--mq-slice-2:#15703f] [--mq-slice-3:#b7791f]",
    "[--mq-slice-4:#9c2f22] [--mq-slice-5:#6d28d9] [--mq-slice-6:#0e7490]",
    "text-[color:var(--mq-text,#1c1c19)]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] dark:[--mq-track:rgba(255,255,255,0.10)]",
    "dark:[--mq-slice-1:#8ea2ff] dark:[--mq-slice-2:#5ad18b] dark:[--mq-slice-3:#e6b35c]",
    "dark:[--mq-slice-4:#ff9d8e] dark:[--mq-slice-5:#b794f6] dark:[--mq-slice-6:#5fd0e0]",
    "forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      // Single variant: a donut has one composition. The axis exists so the
      // registry can list it and the preview can coerce an incoming value.
      variant: { default: "" },
      size: {
        sm: "text-[11px]",
        md: "text-[12px]",
        lg: "text-[13px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** The slice draw-on: a constant hidden dash grows to the resting arc. */
const SLICE_ANIM =
  "transition-[stroke-dasharray] duration-[700ms] ease-out starting:[stroke-dasharray:0_1] motion-reduce:transition-none";

const CENTER_VALUE = "[fill:var(--mq-text,#1c1c19)] forced-colors:[fill:CanvasText] font-bold tabular-nums";
const CENTER_CAPTION = "[fill:var(--mq-muted,#55554e)] forced-colors:[fill:CanvasText]";

/** Trims a trailing `.0` so whole numbers read cleanly. */
function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}

/** Percent share rounded to at most one decimal. */
function formatPercent(pct: number): string {
  return `${trimNumber(Math.round(pct * 10) / 10)}%`;
}

/** Resolves a slice's colour: an explicit prop, else an adaptive palette token. */
function sliceColor(index: number, custom?: string): string {
  if (custom) return custom;
  const slot = index % SLICE_FALLBACK.length;
  return `var(--mq-slice-${slot + 1}, ${SLICE_FALLBACK[slot]})`;
}

type ComputedSlice = {
  label: string;
  value: number;
  color?: string;
  index: number;
  frac: number;
  startFrac: number;
  pct: number;
};

/** Cumulative slice geometry — deterministic offsets from the clamped values. */
function computeSlices(data: DonutChartDatum[], total: number): ComputedSlice[] {
  let cumulative = 0;
  return data.map((datum, index) => {
    const value = Math.max(0, datum.value);
    const frac = total > 0 ? value / total : 0;
    const startFrac = cumulative;
    cumulative += frac;
    return {
      label: datum.label,
      value,
      color: datum.color,
      index,
      frac,
      startFrac,
      pct: total > 0 ? (value / total) * 100 : 0,
    };
  });
}

/** Index of the largest slice (first on ties); -1 when there is no data. */
function largestIndex(slices: ComputedSlice[]): number {
  let best = -1;
  let bestValue = -Infinity;
  for (const slice of slices) {
    if (slice.value > bestValue) {
      bestValue = slice.value;
      best = slice.index;
    }
  }
  return best;
}

export type DonutChartProps = Omit<React.ComponentPropsWithRef<"div">, "children"> &
  Omit<VariantProps<typeof donutChartVariants>, "variant" | "size"> & {
    /** The categories to plot, in display order. The single source of the data. */
    data: DonutChartDatum[];
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: Variant;
    size?: Size;
    /** Accessible name for the data table. Rendered as the table's <caption>. */
    caption: React.ReactNode;
    /** Header for the category column in the accessible table. Defaults to "Category". */
    categoryLabel?: string;
    /** Header for the value column in the accessible table. Defaults to "Value". */
    valueLabel?: string;
    /** Header for the percent column in the accessible table. Defaults to "Share". */
    shareLabel?: string;
    /** Headline value shown at the centre. Defaults to the formatted total. */
    centerValue?: React.ReactNode;
    /** Small caption under the centre value. Defaults to "Total". */
    centerLabel?: React.ReactNode;
    /** Unit appended to every value in labels and the table, e.g. "%", "k". */
    unit?: string;
    /** Formats a value for the visible labels and the table. Defaults to a trimmed number. */
    formatValue?: (value: number) => string;
    /** Draw the slices on mount. Reduced motion always lands on the final ring. */
    animate?: boolean;
  };

/**
 * The donut chart. Uncontrolled and stateless: the series is a prop, so nothing
 * is time-dependent or random in render and there is nothing to hydrate.
 */
export function DonutChart({
  animate = true,
  caption,
  categoryLabel = "Category",
  centerLabel = "Total",
  centerValue,
  className,
  data,
  formatValue,
  material = "adaptive",
  shareLabel = "Share",
  size = "md",
  unit = "",
  valueLabel = "Value",
  variant = "default",
  ...props
}: DonutChartProps) {
  const fmt = formatValue ?? trimNumber;
  const withUnit = (value: number) => `${fmt(value)}${unit}`;
  const total = data.reduce((sum, datum) => sum + Math.max(0, datum.value), 0);
  const slices = computeSlices(data, total);
  const largest = largestIndex(slices);
  const geometry = DONUT[size];
  const radius = CX - geometry.ring / 2 - 3;
  const resolvedCenterValue = centerValue ?? withUnit(total);

  // The authoritative accessible equivalent — a real table, always rendered.
  const accessibleTable = (
    <table className={SR_ONLY}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{categoryLabel}</th>
          <th scope="col">{valueLabel}</th>
          <th scope="col">{shareLabel}</th>
        </tr>
      </thead>
      <tbody>
        {slices.map((slice) => (
          <tr key={`${slice.label}-${slice.index}`}>
            <th scope="row">{slice.label}</th>
            <td>{withUnit(slice.value)}</td>
            <td>{formatPercent(slice.pct)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">{centerLabel}</th>
          <td>{withUnit(total)}</td>
          <td>{formatPercent(total > 0 ? 100 : 0)}</td>
        </tr>
      </tfoot>
    </table>
  );

  if (data.length === 0) {
    return (
      <div
        {...props}
        className={cn(donutChartVariants({ variant, size }), className)}
        data-material={material}
      >
        <span className={SR_ONLY}>No data available.</span>
        <p className="m-0 text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
          No data available.
        </p>
      </div>
    );
  }

  return (
    <div
      {...props}
      className={cn(donutChartVariants({ variant, size }), className)}
      data-material={material}
    >
      {accessibleTable}

      {/* Decoration: the table above is what assistive tech announces. */}
      <svg
        aria-hidden="true"
        className={cn("block shrink-0", geometry.svg)}
        focusable="false"
        viewBox={`0 0 ${VB} ${VB}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Empty ring behind the slices; dropped in forced-colors. */}
        <circle
          className="[stroke:var(--mq-track,rgba(23,24,23,0.08))] forced-colors:hidden"
          cx={CX}
          cy={CY}
          fill="none"
          r={radius}
          strokeWidth={geometry.ring}
        />

        {slices.map((slice) => {
          if (slice.frac <= 0) return null;
          const drawFrac = slice.frac > GAP * 2 ? slice.frac - GAP : slice.frac;
          const rotation = slice.startFrac * 360 - 90;
          const isLargest = slice.index === largest;
          return (
            <circle
              key={`slice-${slice.label}-${slice.index}`}
              className={cn(
                "[fill:none]",
                isLargest ? "forced-colors:[stroke:Highlight]" : "forced-colors:[stroke:CanvasText]",
                animate && SLICE_ANIM,
              )}
              cx={CX}
              cy={CY}
              pathLength={1}
              r={radius}
              stroke={sliceColor(slice.index, slice.color)}
              strokeDasharray={`${drawFrac} ${1 - drawFrac}`}
              strokeWidth={geometry.ring}
              style={animate ? { transitionDelay: `${slice.index * 70}ms` } : undefined}
              transform={`rotate(${rotation} ${CX} ${CY})`}
            >
              <title>{`${slice.label}: ${withUnit(slice.value)} (${formatPercent(slice.pct)})`}</title>
            </circle>
          );
        })}

        {/* Centre readout: the total (or a headline value) as plain text. */}
        <text className={CENTER_VALUE} dominantBaseline="middle" fontSize={geometry.value} textAnchor="middle" x={CX} y={CY - geometry.caption * 0.4}>
          {resolvedCenterValue}
        </text>
        <text className={CENTER_CAPTION} dominantBaseline="middle" fontSize={geometry.caption} textAnchor="middle" x={CX} y={CY + geometry.value * 0.62}>
          {centerLabel}
        </text>
      </svg>

      {/* Visual legend: a duplicate of the accessible table, so aria-hidden to
          avoid a double announcement. Colour is reinforcement only — the label,
          value and percent are all text. */}
      <ul aria-hidden="true" className="m-0 flex list-none flex-col gap-1 p-0">
        {slices.map((slice) => {
          const isLargest = slice.index === largest;
          return (
            <li
              key={`legend-${slice.label}-${slice.index}`}
              className="flex items-center gap-2 rounded-[4px] px-1 py-0.5 transition-[background-color] duration-150 ease-out hover:bg-[color:var(--mq-track,rgba(23,24,23,0.08))] motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-2.5 w-2.5 shrink-0 rounded-[3px] forced-colors:border",
                  isLargest ? "forced-colors:border-[Highlight]" : "forced-colors:border-[CanvasText]",
                )}
                style={{ backgroundColor: sliceColor(slice.index, slice.color) }}
              />
              <span
                className={cn(
                  "grow tabular-nums forced-colors:text-[CanvasText]",
                  isLargest ? "font-semibold" : "font-medium",
                )}
              >
                {slice.label}
              </span>
              <span className="tabular-nums font-medium forced-colors:text-[CanvasText]">
                {withUnit(slice.value)}
              </span>
              <span className="tabular-nums text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
                {formatPercent(slice.pct)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { donutChartVariants };
