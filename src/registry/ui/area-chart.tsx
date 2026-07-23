"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Area Chart
 *
 * A time-series area chart drawn entirely by hand as inline SVG — no charting
 * library, no WebGL, no global stylesheet. Every series is a stroked line plus a
 * closed, gradient-filled area, computed from a `{ name, values }[]` list and an
 * x-axis `categories` array and mapped deterministically into a fixed viewBox,
 * so copying this file plus `src/lib/cn.ts` reproduces the full look.
 *
 * This is a material-AGNOSTIC data component: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and reflected on `data-material`; it drives no separate recipe.
 *
 * Composition is the VARIANT:
 *   "default"  one or more areas, each measured from the zero baseline
 *   "stacked"  each area is the cumulative band summed from a zero baseline
 *
 * Theming knobs are local CSS variables, each referenced with a literal
 * fallback:
 *
 *   --mq-text        legend text
 *   --mq-muted       axis tick + category text
 *   --mq-grid        interior gridline color
 *   --mq-axis        baseline / value-axis color
 *   --mq-s1..--mq-s5 per-series line + swatch color
 *   --mq-a1..--mq-a5 per-series area tint (top gradient stop)
 *   --mq-sw          line stroke width (set by size)
 *
 * Data-accessibility contract (the defining rule of this component):
 *   - The authoritative accessible equivalent is a real `sr-only` <table>: a
 *     <caption> names it, a header row carries the category (x-axis) labels, and
 *     one row per series (its name a <th scope="row">) carries the exact value
 *     for every category. The SVG chart is decoration layered on top and is
 *     `aria-hidden`, so a screen reader announces the figures, not a drawing.
 *   - COLOR is never the sole carrier of meaning: every series hue is paired
 *     with its NAME in the visible legend and with a full row of values in the
 *     accessible table, so a series is identifiable without perceiving its color.
 *   - Contrast: legend text uses `--mq-text` (>= 4.5:1 on a light and a dark
 *     surface); axis and category labels use `--mq-muted` (>= 4.5:1); each series
 *     line clears the 3:1 bar asked of an informative graphic in both schemes.
 *   - Areas grow on mount reduced-motion-safe WITHOUT JS: the resting state is
 *     the FINAL drawing (so SSR, no-JS and reduced-motion all show true values),
 *     and the entrance is expressed with `@starting-style` (the `starting:`
 *     variant) on the standalone `scale` property, anchored to the baseline via
 *     `transform-box:fill-box` + `transform-origin:bottom`, with a matching
 *     `transition-[scale,opacity]` and `motion-reduce:transition-none`.
 *   - Every figure is a prop, so nothing in render is time-dependent or random.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

type Variant = "default" | "stacked";
type Size = "sm" | "md" | "lg";

export type AreaChartSeries = {
  /** Series name. Shown in the legend and as the table row header. */
  name: string;
  /** One value per category, in the same order as `categories`. */
  values: number[];
};

type Layout = { plotW: number; plotH: number; ml: number; mr: number; mt: number; mb: number };

/** Per-size drawing geometry, in SVG user units (rendered 1:1). */
const LAYOUT: Record<Size, Layout> = {
  sm: { plotW: 250, plotH: 116, ml: 34, mr: 12, mt: 12, mb: 26 },
  md: { plotW: 330, plotH: 148, ml: 40, mr: 14, mt: 14, mb: 30 },
  lg: { plotW: 430, plotH: 188, ml: 46, mr: 16, mt: 16, mb: 34 },
};

/** Font sizes per size, matching the 1:1 viewBox so text renders at these px. */
const FONT: Record<Size, { axis: number; cat: number; legend: number }> = {
  sm: { axis: 10, cat: 10, legend: 11 },
  md: { axis: 11, cat: 11, legend: 12 },
  lg: { axis: 12, cat: 12, legend: 13 },
};

const areaChartVariants = cva(
  [
    "relative isolate w-full overflow-x-auto text-left",
    // Adaptive light+dark token vocabulary. Categorical series palette.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-grid:rgba(23,24,23,0.10)] [--mq-axis:rgba(23,24,23,0.30)]",
    "[--mq-s1:#3f5bd9] [--mq-s2:#0f766e] [--mq-s3:#b45309] [--mq-s4:#be185d] [--mq-s5:#6d28d9]",
    "[--mq-a1:rgba(63,91,217,0.32)] [--mq-a2:rgba(15,118,110,0.30)] [--mq-a3:rgba(180,83,9,0.30)] [--mq-a4:rgba(190,24,93,0.30)] [--mq-a5:rgba(109,40,217,0.30)]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-grid:rgba(255,255,255,0.12)] dark:[--mq-axis:rgba(255,255,255,0.30)]",
    "dark:[--mq-s1:#8ea2ff] dark:[--mq-s2:#2dd4bf] dark:[--mq-s3:#fbbf24] dark:[--mq-s4:#f472b6] dark:[--mq-s5:#a78bfa]",
    "dark:[--mq-a1:rgba(142,162,255,0.34)] dark:[--mq-a2:rgba(45,212,191,0.30)] dark:[--mq-a3:rgba(251,191,36,0.30)] dark:[--mq-a4:rgba(244,114,182,0.30)] dark:[--mq-a5:rgba(167,139,250,0.30)]",
  ].join(" "),
  {
    variants: {
      // Composition is the real axis; the geometry is computed in JS from it.
      variant: { default: "", stacked: "" },
      // Size scales geometry (computed in JS) and the line stroke width.
      size: {
        sm: "[--mq-sw:1.75]",
        md: "[--mq-sw:2]",
        lg: "[--mq-sw:2.25]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const GRID_LINE = "[stroke:var(--mq-grid,rgba(23,24,23,0.10))] forced-colors:[stroke:CanvasText]";
const AXIS_LINE = "[stroke:var(--mq-axis,rgba(23,24,23,0.30))] forced-colors:[stroke:CanvasText]";
const TICK_TEXT = "[fill:var(--mq-muted,#55554e)] forced-colors:[fill:CanvasText] tabular-nums";
const CAT_TEXT = "[fill:var(--mq-muted,#55554e)] forced-colors:[fill:CanvasText]";

/** Per-series line stroke class, indexed by series position (cycled). */
const SERIES_STROKE: readonly string[] = [
  "[stroke:var(--mq-s1,#3f5bd9)]",
  "[stroke:var(--mq-s2,#0f766e)]",
  "[stroke:var(--mq-s3,#b45309)]",
  "[stroke:var(--mq-s4,#be185d)]",
  "[stroke:var(--mq-s5,#6d28d9)]",
];

/** Legend swatch background class, indexed by series position (cycled). */
const SERIES_SWATCH: readonly string[] = [
  "[background-color:var(--mq-s1,#3f5bd9)]",
  "[background-color:var(--mq-s2,#0f766e)]",
  "[background-color:var(--mq-s3,#b45309)]",
  "[background-color:var(--mq-s4,#be185d)]",
  "[background-color:var(--mq-s5,#6d28d9)]",
];

/** Top gradient stop per series (fades to transparent at the bottom). */
const AREA_STOP: readonly string[] = [
  "var(--mq-a1, rgba(63,91,217,0.32))",
  "var(--mq-a2, rgba(15,118,110,0.30))",
  "var(--mq-a3, rgba(180,83,9,0.30))",
  "var(--mq-a4, rgba(190,24,93,0.30))",
  "var(--mq-a5, rgba(109,40,217,0.30))",
];

/**
 * The from-baseline grow. Applied to ONE group wrapping every area + line, so
 * the whole plot rises together from the shared zero baseline. The resting
 * state is the final drawing; `@starting-style` collapses it to `scale:1 0`
 * (baseline-anchored) and `opacity:0`, and the transition names exactly the two
 * properties that change. `transform-box:fill-box` makes `bottom` resolve to the
 * group's own bounding-box floor, which is the baseline the areas close onto.
 */
const GROW =
  "[transform-box:fill-box] [transform-origin:bottom] [scale:1_1] opacity-100 " +
  "starting:[scale:1_0] starting:opacity-0 " +
  "transition-[scale,opacity] duration-[720ms] ease-out motion-reduce:transition-none";

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

/** Rounds to at most two decimals without forcing a fixed width. */
function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}

/** Snaps a coordinate to two decimals so server and client emit identical paths. */
function r(value: number): number {
  return Number(value.toFixed(2));
}

type Band = { areaPath: string; linePath: string };

/**
 * Builds one area polygon + one boundary line per series.
 *
 * `default` measures every area from the zero baseline; `stacked` stacks each
 * area on the running sum below it. The area closes along its lower edge (the
 * baseline, or the series beneath it) so bands never overlap in `stacked` mode.
 */
function buildBands(variant: Variant, safe: number[][], count: number, niceMax: number, layout: Layout): Band[] {
  const baselineY = layout.mt + layout.plotH;
  const xAt = (index: number) =>
    count === 1 ? layout.ml + layout.plotW / 2 : layout.ml + (index / (count - 1)) * layout.plotW;
  const yAt = (value: number) => baselineY - (value / niceMax) * layout.plotH;

  const lower = Array.from({ length: count }, () => 0);
  const bands: Band[] = [];

  for (let s = 0; s < safe.length; s += 1) {
    const topY: number[] = [];
    const botY: number[] = [];
    for (let i = 0; i < count; i += 1) {
      const value = safe[s][i] ?? 0;
      if (variant === "stacked") {
        const lo = lower[i];
        const hi = lo + value;
        botY.push(yAt(lo));
        topY.push(yAt(hi));
        lower[i] = hi;
      } else {
        botY.push(baselineY);
        topY.push(yAt(value));
      }
    }

    const linePath = topY.map((y, i) => `${i === 0 ? "M" : "L"}${r(xAt(i))} ${r(y)}`).join(" ");
    let areaPath = linePath;
    for (let i = count - 1; i >= 0; i -= 1) areaPath += ` L${r(xAt(i))} ${r(botY[i])}`;
    areaPath += " Z";
    bands.push({ areaPath, linePath });
  }

  return bands;
}

export type AreaChartProps = Omit<React.ComponentPropsWithRef<"div">, "children"> &
  Omit<VariantProps<typeof areaChartVariants>, "variant" | "size"> & {
    /** The series to plot, in stacking / legend order. The source of the data. */
    data: AreaChartSeries[];
    /** The x-axis labels, one per data point. Length defines the point count. */
    categories: string[];
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: Variant;
    size?: Size;
    /** Accessible name for the data table. Rendered as the table's <caption>. */
    caption: React.ReactNode;
    /** Header for the series (row) column in the accessible table. Defaults to "Series". */
    seriesLabel?: string;
    /** Unit appended to every value in the table, e.g. "k", "%". */
    unit?: string;
    /** Formats a value for the table and axis ticks. Defaults to a trimmed number. */
    formatValue?: (value: number) => string;
    /** Grow the areas on mount. Reduced motion always lands on the final drawing. */
    animate?: boolean;
  };

/**
 * The area chart. Uncontrolled and stateless: the series are props, so nothing
 * is time-dependent or random in render and there is nothing to hydrate.
 */
export function AreaChart({
  animate = true,
  caption,
  categories,
  className,
  data,
  formatValue,
  material = "adaptive",
  seriesLabel = "Series",
  size = "md",
  unit = "",
  variant = "default",
  ...props
}: AreaChartProps) {
  const rawId = React.useId();
  // `useId` can contain ":" which is invalid inside an SVG id / url() reference.
  const uid = rawId.replace(/:/g, "");
  const gradId = (index: number) => `mq-area-${uid}-${index}`;

  const fmt = formatValue ?? trimNumber;
  const withUnit = (value: number) => `${fmt(value)}${unit}`;
  const count = categories.length;
  const font = FONT[size];

  // The authoritative accessible equivalent — a real table, always rendered.
  const accessibleTable = (
    <table className={SR_ONLY}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{seriesLabel}</th>
          {categories.map((category, index) => (
            <th key={`col-${category}-${index}`} scope="col">
              {category}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((series, si) => (
          <tr key={`row-${series.name}-${si}`}>
            <th scope="row">{series.name}</th>
            {categories.map((category, ci) => (
              <td key={`cell-${si}-${ci}`}>{withUnit(series.values[ci] ?? 0)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (data.length === 0 || count === 0) {
    return (
      <div
        {...props}
        className={cn(areaChartVariants({ variant, size }), className)}
        data-material={material}
        data-variant={variant}
      >
        {accessibleTable}
        <p className="m-0 text-[13px] text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
          No data available.
        </p>
      </div>
    );
  }

  const layout = LAYOUT[size];
  const baselineY = layout.mt + layout.plotH;
  const width = layout.ml + layout.plotW + layout.mr;
  const height = layout.mt + layout.plotH + layout.mb;
  const xAt = (index: number) =>
    count === 1 ? layout.ml + layout.plotW / 2 : layout.ml + (index / (count - 1)) * layout.plotW;

  // Clamp non-finite / negative points to 0 for drawing; the table shows raw values.
  const safe = data.map((series) =>
    categories.map((_, i) => {
      const value = series.values[i];
      return Number.isFinite(value) && value > 0 ? value : 0;
    }),
  );

  let maxValue = 0;
  if (variant === "stacked") {
    for (let i = 0; i < count; i += 1) {
      let sum = 0;
      for (let s = 0; s < safe.length; s += 1) sum += safe[s][i] ?? 0;
      maxValue = Math.max(maxValue, sum);
    }
  } else {
    for (const arr of safe) for (const value of arr) maxValue = Math.max(maxValue, value);
  }

  const niceMax = niceCeil(maxValue);
  const ticks = buildTicks(niceMax);
  const bands = buildBands(variant, safe, count, niceMax, layout);

  return (
    <div
      {...props}
      className={cn(areaChartVariants({ variant, size }), className)}
      data-material={material}
      data-variant={variant}
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
        <defs>
          {data.map((series, si) => {
            const stop = AREA_STOP[si % AREA_STOP.length];
            return (
              <linearGradient key={`grad-${si}`} id={gradId(si)} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={stop} />
                <stop offset="100%" stopColor={stop} stopOpacity="0" />
              </linearGradient>
            );
          })}
        </defs>

        {ticks.map((tick) => {
          const gy = baselineY - (tick / niceMax) * layout.plotH;
          const isBase = tick === 0;
          return (
            <g key={`grid-${tick}`}>
              <line
                className={isBase ? AXIS_LINE : GRID_LINE}
                strokeWidth={isBase ? 1.25 : 1}
                x1={layout.ml}
                x2={layout.ml + layout.plotW}
                y1={gy}
                y2={gy}
              />
              <text className={TICK_TEXT} dominantBaseline="middle" fontSize={font.axis} textAnchor="end" x={layout.ml - 8} y={gy}>
                {fmt(tick)}
              </text>
            </g>
          );
        })}

        {/* One group so every area + line grows together from the baseline. */}
        <g className={animate ? GROW : undefined}>
          {bands.map((band, si) => (
            <path
              key={`area-${si}`}
              className="forced-colors:hidden"
              d={band.areaPath}
              fill={`url(#${gradId(si)})`}
            />
          ))}
          {bands.map((band, si) => (
            <path
              key={`line-${si}`}
              className={cn(
                "[stroke-linecap:round] [stroke-linejoin:round] [stroke-width:var(--mq-sw,2)]",
                SERIES_STROKE[si % SERIES_STROKE.length],
                "forced-colors:[stroke:CanvasText]",
              )}
              d={band.linePath}
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {categories.map((category, index) => (
          <text
            key={`cat-${category}-${index}`}
            className={CAT_TEXT}
            dominantBaseline="hanging"
            fontSize={font.cat}
            textAnchor="middle"
            x={xAt(index)}
            y={baselineY + 8}
          >
            {category}
          </text>
        ))}
      </svg>

      {/* Visual legend. The sr-only table already names every series, so this is
          aria-hidden to avoid a double announcement; its NAME text is what pairs
          each color with meaning for sighted readers. */}
      <ul aria-hidden="true" className="m-0 mt-2 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
        {data.map((series, si) => (
          <li
            key={`legend-${series.name}-${si}`}
            className="inline-flex items-center gap-1.5 leading-none text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]"
            style={{ fontSize: font.legend }}
          >
            <span
              aria-hidden="true"
              className={cn(
                "inline-block h-2.5 w-2.5 shrink-0 rounded-[3px] forced-colors:border forced-colors:border-[CanvasText]",
                SERIES_SWATCH[si % SERIES_SWATCH.length],
              )}
            />
            <span>{series.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { areaChartVariants };
