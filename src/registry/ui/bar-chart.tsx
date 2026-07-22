"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Bar Chart
 *
 * A categorical bar chart drawn entirely by hand as inline SVG — no charting
 * library, no WebGL, no global stylesheet. Bars, axes, gridlines and every label
 * are computed from a `{ label, value }[]` array and mapped deterministically
 * into a fixed 1:1 viewBox, so copying this file plus `src/lib/cn.ts` reproduces
 * the full look.
 *
 * This is a material-AGNOSTIC data component: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and reflected on `data-material`; it drives no separate recipe.
 *
 * Orientation is the VARIANT:
 *   "vertical"    bars grow up from a bottom baseline
 *   "horizontal"  bars grow right from a left axis
 *
 * Theming knobs are local CSS variables, each referenced with a literal
 * fallback:
 *
 *   --mq-text        primary label / value text
 *   --mq-muted       category + tick-label text
 *   --mq-bar         bar fill
 *   --mq-bar-strong  bar fill on hover
 *   --mq-grid        interior gridline color
 *   --mq-axis        baseline / value-axis color
 *
 * Data-accessibility contract (the defining rule of this component):
 *   - The authoritative accessible equivalent is a real `sr-only` <table>: a
 *     <caption> names it, a header row labels the Category and Value columns, and
 *     one row per datum carries the exact figures via <th scope="row"> + <td>.
 *     The SVG chart is decoration layered on top and is `aria-hidden`.
 *   - COLOR is never the sole carrier of meaning: every bar prints its numeric
 *     value as visible text and is named by its category label, so the data reads
 *     without perceiving the fill color at all — it is one series, one hue.
 *   - Contrast: value labels use `--mq-text` and category/tick labels `--mq-muted`,
 *     each at or above 4.5:1 against a light and a dark surface; the bar fill
 *     clears the 3:1 informative-glyph bar in both schemes.
 *   - Bars grow on mount reduced-motion-safe WITHOUT JS: a bar's resting state is
 *     its FINAL size (so SSR, no-JS and reduced-motion all show the true value),
 *     and the from-zero entrance is expressed with `@starting-style` (the
 *     `starting:` variant) on the standalone `scale` property with a matching
 *     `transition-[scale]` and a baseline-anchored `transform-origin`.
 *     `motion-reduce:transition-none` lands straight on the final size.
 *   - Every figure is a prop, so nothing in render is time-dependent or random.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

type Orientation = "vertical" | "horizontal";
type Size = "sm" | "md" | "lg";

export type BarChartDatum = {
  /** Category name for this bar. Shown on the axis and as the table row header. */
  label: string;
  /** Numeric magnitude. Negative values are clamped to 0 for drawing only. */
  value: number;
};

/** Per-size, per-orientation drawing geometry, in SVG user units (rendered 1:1). */
const V_LAYOUT: Record<Size, { band: number; plot: number; ml: number; mr: number; mt: number; mb: number }> = {
  sm: { band: 46, plot: 150, ml: 42, mr: 12, mt: 18, mb: 28 },
  md: { band: 58, plot: 190, ml: 46, mr: 14, mt: 20, mb: 30 },
  lg: { band: 70, plot: 230, ml: 52, mr: 16, mt: 24, mb: 34 },
};

const H_LAYOUT: Record<Size, { band: number; plot: number; ml: number; mr: number; mt: number; mb: number }> = {
  sm: { band: 32, plot: 190, ml: 76, mr: 42, mt: 10, mb: 24 },
  md: { band: 40, plot: 260, ml: 90, mr: 48, mt: 12, mb: 26 },
  lg: { band: 48, plot: 320, ml: 104, mr: 54, mt: 14, mb: 30 },
};

/** Font sizes per size, matching the 1:1 viewBox so text renders at these px. */
const FONT: Record<Size, { axis: number; cat: number; val: number }> = {
  sm: { axis: 10, cat: 10, val: 10 },
  md: { axis: 11, cat: 11, val: 11 },
  lg: { axis: 12, cat: 12, val: 13 },
};

const BAR_RATIO = 0.56;

const barChartVariants = cva(
  [
    "relative isolate w-full overflow-x-auto text-left",
    // Adaptive light+dark token vocabulary. One series, one accent hue.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-bar:#3f5bd9] [--mq-bar-strong:#2f47b8]",
    "[--mq-grid:rgba(23,24,23,0.10)] [--mq-axis:rgba(23,24,23,0.30)]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-bar:#8ea2ff] dark:[--mq-bar-strong:#aab8ff]",
    "dark:[--mq-grid:rgba(255,255,255,0.12)] dark:[--mq-axis:rgba(255,255,255,0.30)]",
  ].join(" "),
  {
    variants: {
      // Orientation is the real axis; layout is computed in JS from it.
      variant: { vertical: "", horizontal: "" },
      // Size only scales geometry (computed in JS); no token depends on it.
      size: { sm: "", md: "", lg: "" },
    },
    defaultVariants: { variant: "vertical", size: "md" },
  },
);

const GRID_LINE = "[stroke:var(--mq-grid,rgba(23,24,23,0.10))] forced-colors:[stroke:CanvasText]";
const AXIS_LINE = "[stroke:var(--mq-axis,rgba(23,24,23,0.30))] forced-colors:[stroke:CanvasText]";
const TICK_TEXT = "[fill:var(--mq-muted,#55554e)] forced-colors:[fill:CanvasText] tabular-nums";
const CAT_TEXT = "[fill:var(--mq-muted,#55554e)] forced-colors:[fill:CanvasText]";
const VAL_TEXT = "[fill:var(--mq-text,#1c1c19)] forced-colors:[fill:CanvasText] font-bold tabular-nums";
// Used when a horizontal value label is placed INSIDE its bar to avoid clipping:
// white on the light-scheme bar, dark ink on the light-blue dark-scheme bar, and
// HighlightText over the forced-colors Highlight fill — each ≥ 4.5:1.
const VAL_TEXT_INSIDE =
  "[fill:#ffffff] dark:[fill:#1c1c19] forced-colors:[fill:HighlightText] font-bold tabular-nums";

/**
 * The bar fill. The value it encodes is carried by the visible value label, so
 * in forced-colors the fill switches to `Highlight` to read as "the measured
 * quantity" against the system `CanvasText` axes. The from-zero growth is a
 * standalone `scale` (never `transform`, so `transition-[scale]` animates it),
 * anchored to the baseline edge so the bar rises / extends rather than centering.
 */
function barClass(variant: Orientation, animate: boolean): string {
  return cn(
    "[fill:var(--mq-bar,#3f5bd9)] hover:[fill:var(--mq-bar-strong,#2f47b8)]",
    "forced-colors:[fill:Highlight]",
    animate
      ? cn(
          "[transform-box:fill-box] [scale:1_1]",
          "transition-[scale,fill] duration-[700ms] ease-out motion-reduce:transition-none",
          variant === "vertical"
            ? "[transform-origin:bottom] starting:[scale:1_0]"
            : "[transform-origin:left] starting:[scale:0_1]",
        )
      : "transition-[fill] duration-150 ease-out motion-reduce:transition-none",
  );
}

/** Rounds up to a friendly axis maximum (1/1.5/2/3/4/5/6/8/10 x 10^n). */
function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const magnitude = Math.pow(10, exponent);
  const fraction = value / magnitude;
  const steps = [1, 1.5, 2, 3, 4, 5, 6, 8, 10];
  const nice = steps.find((step) => fraction <= step) ?? 10;
  return nice * magnitude;
}

/** Five evenly spaced ticks from 0 to the nice maximum, inclusive. */
function buildTicks(niceMax: number): number[] {
  const count = 4;
  return Array.from({ length: count + 1 }, (_, index) => (niceMax / count) * index);
}

/**
 * Rounds to at most two decimals WITHOUT a forced fixed width, so a fractional
 * axis tick like 0.75 prints as "0.75" — matching the gridline it annotates —
 * instead of `toFixed(1)`'s "0.8", which would sit at the wrong position.
 */
function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}

export type BarChartProps = Omit<React.ComponentPropsWithRef<"div">, "children"> &
  Omit<VariantProps<typeof barChartVariants>, "variant" | "size"> & {
    /** The categories to plot, in display order. The single source of the data. */
    data: BarChartDatum[];
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: Orientation;
    size?: Size;
    /** Accessible name for the data table. Rendered as the table's <caption>. */
    caption: React.ReactNode;
    /** Header for the category column in the accessible table. Defaults to "Category". */
    categoryLabel?: string;
    /** Header for the value column in the accessible table. Defaults to "Value". */
    valueLabel?: string;
    /** Unit appended to every value in labels and the table, e.g. "%", "k". */
    unit?: string;
    /** Formats a value for the visible labels, ticks and table. Defaults to a trimmed number. */
    formatValue?: (value: number) => string;
    /** Grow the bars on mount. Reduced motion always lands on the final size. */
    animate?: boolean;
  };

/**
 * The bar chart. Uncontrolled and stateless: the series is a prop, so nothing is
 * time-dependent or random in render and there is nothing to hydrate.
 */
export function BarChart({
  animate = true,
  caption,
  categoryLabel = "Category",
  className,
  data,
  formatValue,
  material = "adaptive",
  size = "md",
  unit = "",
  valueLabel = "Value",
  variant = "vertical",
  ...props
}: BarChartProps) {
  const fmt = formatValue ?? trimNumber;
  const withUnit = (value: number) => `${fmt(value)}${unit}`;
  const count = data.length;

  // The authoritative accessible equivalent — a real table, always rendered.
  const accessibleTable = (
    <table className={SR_ONLY}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{categoryLabel}</th>
          <th scope="col">{valueLabel}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((datum, index) => (
          <tr key={`${datum.label}-${index}`}>
            <th scope="row">{datum.label}</th>
            <td>{withUnit(datum.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (count === 0) {
    return (
      <div
        {...props}
        className={cn(barChartVariants({ variant, size }), className)}
        data-material={material}
        data-orientation={variant}
      >
        {accessibleTable}
        <p className="m-0 text-[13px] text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
          No data available.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((datum) => Math.max(0, datum.value)));
  const niceMax = niceCeil(maxValue);
  const ticks = buildTicks(niceMax);
  const font = FONT[size];
  const isVertical = variant === "vertical";
  const layout = isVertical ? V_LAYOUT[size] : H_LAYOUT[size];

  const width = isVertical
    ? layout.ml + count * layout.band + layout.mr
    : layout.ml + layout.plot + layout.mr;
  const height = isVertical
    ? layout.mt + layout.plot + layout.mb
    : layout.mt + count * layout.band + layout.mb;

  return (
    <div
      {...props}
      className={cn(barChartVariants({ variant, size }), className)}
      data-material={material}
      data-orientation={variant}
    >
      {accessibleTable}

      {/* Decoration: the table above is what assistive tech announces. */}
      <svg
        aria-hidden="true"
        className="block"
        focusable="false"
        height={height}
        role="presentation"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        xmlns="http://www.w3.org/2000/svg"
      >
        {isVertical
          ? renderVertical({ data, layout, niceMax, ticks, font, width, animate, variant, fmt, withUnit })
          : renderHorizontal({ data, layout, niceMax, ticks, font, height, animate, variant, fmt, withUnit })}
      </svg>
    </div>
  );
}

type RenderArgs = {
  data: BarChartDatum[];
  layout: { band: number; plot: number; ml: number; mr: number; mt: number; mb: number };
  niceMax: number;
  ticks: number[];
  font: { axis: number; cat: number; val: number };
  animate: boolean;
  variant: Orientation;
  fmt: (value: number) => string;
  withUnit: (value: number) => string;
};

/** Vertical: value axis on the left, category axis along the bottom, bars up. */
function renderVertical({
  data,
  layout,
  niceMax,
  ticks,
  font,
  width,
  animate,
  variant,
  fmt,
  withUnit,
}: RenderArgs & { width: number }) {
  const baselineY = layout.mt + layout.plot;
  const barWidth = layout.band * BAR_RATIO;
  const bar = barClass(variant, animate);

  return (
    <>
      {ticks.map((tick) => {
        const gy = baselineY - (tick / niceMax) * layout.plot;
        const isBase = tick === 0;
        return (
          <g key={`grid-${tick}`}>
            <line
              className={isBase ? AXIS_LINE : GRID_LINE}
              strokeWidth={isBase ? 1.25 : 1}
              x1={layout.ml}
              x2={width - layout.mr}
              y1={gy}
              y2={gy}
            />
            <text className={TICK_TEXT} dominantBaseline="middle" fontSize={font.axis} textAnchor="end" x={layout.ml - 8} y={gy}>
              {fmt(tick)}
            </text>
          </g>
        );
      })}

      {data.map((datum, index) => {
        const bandX = layout.ml + index * layout.band;
        const barX = bandX + (layout.band - barWidth) / 2;
        const barHeight = (Math.max(0, datum.value) / niceMax) * layout.plot;
        const barY = baselineY - barHeight;
        return (
          <g key={`bar-${datum.label}-${index}`}>
            <title>{`${datum.label}: ${withUnit(datum.value)}`}</title>
            <rect
              className={bar}
              height={barHeight}
              rx={2.5}
              style={animate ? { transitionDelay: `${index * 55}ms` } : undefined}
              width={barWidth}
              x={barX}
              y={barY}
            />
            <text className={VAL_TEXT} fontSize={font.val} textAnchor="middle" x={barX + barWidth / 2} y={barY - 6}>
              {withUnit(datum.value)}
            </text>
            <text className={CAT_TEXT} dominantBaseline="hanging" fontSize={font.cat} textAnchor="middle" x={bandX + layout.band / 2} y={baselineY + 8}>
              {datum.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

/** Horizontal: category axis on the left, value axis along the bottom, bars right. */
function renderHorizontal({
  data,
  layout,
  niceMax,
  ticks,
  font,
  animate,
  variant,
  fmt,
  withUnit,
}: RenderArgs & { height: number }) {
  const axisX = layout.ml;
  const plotBottom = layout.mt + data.length * layout.band;
  const barHeight = layout.band * BAR_RATIO;
  const bar = barClass(variant, animate);

  return (
    <>
      {ticks.map((tick) => {
        const gx = axisX + (tick / niceMax) * layout.plot;
        const isBase = tick === 0;
        return (
          <g key={`grid-${tick}`}>
            <line
              className={isBase ? AXIS_LINE : GRID_LINE}
              strokeWidth={isBase ? 1.25 : 1}
              x1={gx}
              x2={gx}
              y1={layout.mt}
              y2={plotBottom}
            />
            <text className={TICK_TEXT} dominantBaseline="hanging" fontSize={font.axis} textAnchor="middle" x={gx} y={plotBottom + 8}>
              {fmt(tick)}
            </text>
          </g>
        );
      })}

      {data.map((datum, index) => {
        const bandY = layout.mt + index * layout.band;
        const barY = bandY + (layout.band - barHeight) / 2;
        const barWidth = (Math.max(0, datum.value) / niceMax) * layout.plot;
        // Keep the value label from overflowing the SVG on a near-max bar: if the
        // outside label would run past the right edge (plot + right margin) and the
        // bar is wide enough to hold it, draw it INSIDE the bar's end instead.
        const valueLabel = withUnit(datum.value);
        const labelWidth = valueLabel.length * font.val * 0.62;
        const labelInside =
          barWidth + 6 + labelWidth > layout.plot + layout.mr - 2 && barWidth > labelWidth + 12;
        return (
          <g key={`bar-${datum.label}-${index}`}>
            <title>{`${datum.label}: ${valueLabel}`}</title>
            <rect
              className={bar}
              height={barHeight}
              rx={2.5}
              style={animate ? { transitionDelay: `${index * 55}ms` } : undefined}
              width={barWidth}
              x={axisX}
              y={barY}
            />
            <text
              className={labelInside ? VAL_TEXT_INSIDE : VAL_TEXT}
              dominantBaseline="middle"
              fontSize={font.val}
              textAnchor={labelInside ? "end" : "start"}
              x={labelInside ? axisX + barWidth - 6 : axisX + barWidth + 6}
              y={barY + barHeight / 2}
            >
              {valueLabel}
            </text>
            <text className={CAT_TEXT} dominantBaseline="middle" fontSize={font.cat} textAnchor="end" x={axisX - 8} y={barY + barHeight / 2}>
              {datum.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

export { barChartVariants };
