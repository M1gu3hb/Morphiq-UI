"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Line Chart
 *
 * A multi-series line chart drawn entirely by hand as inline SVG — polylines,
 * x/y axes, gridlines, tick labels and per-point markers are computed from a
 * `series: { name, color?, data:number[] }[]` array and mapped deterministically
 * into a fixed viewBox, so copying this file plus `src/lib/cn.ts` reproduces the
 * full look. No charting library, no WebGL, no global stylesheet.
 *
 * This is a material-AGNOSTIC data component: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and reflected on `data-material`; it drives no separate recipe.
 *
 * Theming knobs are local CSS variables, each referenced with a literal
 * fallback:
 *
 *   --mq-text        primary text (legend series names)
 *   --mq-muted       axis + category tick-label text
 *   --mq-grid        interior gridline color
 *   --mq-axis        left / bottom axis + zero line color
 *   --mq-s1…--mq-s6  the six-hue series palette (adaptive per scheme)
 *   --mq-sw          line stroke width (set by size)
 *
 * Data-accessibility contract (the defining rule of this component):
 *   - The authoritative accessible equivalent is a real `sr-only` <table>, a
 *     series × points grid: a <caption> names it, the header row labels the
 *     series column and one column per x position, and each series is a row of
 *     <th scope="row"> + one <td> per point carrying the exact figure. The SVG
 *     chart and the legend are decoration and are `aria-hidden`.
 *   - COLOR is never the sole carrier of meaning: each legend entry pairs its
 *     colored line-swatch with the series NAME in text, and the sr-only table
 *     carries every value in words — the data reads without perceiving any hue.
 *   - Contrast: legend names use the primary text token and axis/tick labels the
 *     muted token, each at or above 4.5:1 against a light and a dark surface; the
 *     six series hues each clear the 3:1 bar asked of an informative mark in both
 *     schemes.
 *   - Lines draw on mount reduced-motion-safe WITHOUT JS: a line's resting state
 *     is the FULLY DRAWN path (`stroke-dashoffset:0`), so SSR, no-JS and reduced
 *     motion all show the complete series, and the one-shot draw is expressed
 *     with `@starting-style` (the `starting:` variant) from offset 1 → 0.
 *     `pathLength={1}` normalizes the length so no JS measurement is needed, and
 *     `motion-reduce:transition-none` lands straight on the final line.
 *   - forced-colors: decorative fills are dropped by the UA; the lines, markers
 *     and legend swatches repaint to CanvasText and the axes/labels to CanvasText
 *     so the trends stay perceivable, with series still separable via the table.
 *   - Every figure is a prop, so nothing in render is time-dependent or random.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

type Size = "sm" | "md" | "lg";

export type LineSeries = {
  /** Series name. Shown in the legend and as the accessible table's row header. */
  name: string;
  /** Optional explicit line color (any CSS color). Falls back to the palette. */
  color?: string;
  /** The numeric values in x order. One point per index on the shared x-axis. */
  data: number[];
};

/** Per-size drawing geometry, in SVG user units (rendered 1:1). */
const LAYOUT: Record<Size, { plotW: number; plotH: number; ml: number; mr: number; mt: number; mb: number }> = {
  sm: { plotW: 250, plotH: 130, ml: 38, mr: 14, mt: 14, mb: 30 },
  md: { plotW: 330, plotH: 170, ml: 44, mr: 16, mt: 16, mb: 32 },
  lg: { plotW: 430, plotH: 220, ml: 50, mr: 18, mt: 20, mb: 36 },
};

/** Font sizes per size, matching the 1:1 viewBox so text renders at these px. */
const FONT: Record<Size, { axis: number; cat: number; legend: number }> = {
  sm: { axis: 10, cat: 10, legend: 11 },
  md: { axis: 11, cat: 11, legend: 12 },
  lg: { axis: 12, cat: 12, legend: 13 },
};

/** Per-point marker radius per size. */
const MARKER: Record<Size, number> = { sm: 2, md: 2.3, lg: 2.7 };

/**
 * Palette classes, one per series slot. Kept as className strings (not inline
 * colors) so the `forced-colors:` overrides below actually win, exactly like the
 * Bar Chart's bar fill. Each carries a literal fallback beside its adaptive var.
 */
const SERIES_STROKE: readonly string[] = [
  "[stroke:var(--mq-s1,#3f5bd9)]",
  "[stroke:var(--mq-s2,#1f9d6b)]",
  "[stroke:var(--mq-s3,#c65a12)]",
  "[stroke:var(--mq-s4,#a83291)]",
  "[stroke:var(--mq-s5,#1f8fb0)]",
  "[stroke:var(--mq-s6,#8a6d1f)]",
];

const SERIES_FILL: readonly string[] = [
  "[fill:var(--mq-s1,#3f5bd9)]",
  "[fill:var(--mq-s2,#1f9d6b)]",
  "[fill:var(--mq-s3,#c65a12)]",
  "[fill:var(--mq-s4,#a83291)]",
  "[fill:var(--mq-s5,#1f8fb0)]",
  "[fill:var(--mq-s6,#8a6d1f)]",
];

const GRID_LINE = "[stroke:var(--mq-grid,rgba(23,24,23,0.10))] forced-colors:[stroke:CanvasText]";
const AXIS_LINE = "[stroke:var(--mq-axis,rgba(23,24,23,0.30))] forced-colors:[stroke:CanvasText]";
const TICK_TEXT = "[fill:var(--mq-muted,#55554e)] forced-colors:[fill:CanvasText] tabular-nums";
const CAT_TEXT = "[fill:var(--mq-muted,#55554e)] forced-colors:[fill:CanvasText]";

const lineChartVariants = cva(
  [
    "relative isolate w-full overflow-x-auto text-left",
    // Adaptive light+dark token vocabulary.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-grid:rgba(23,24,23,0.10)] [--mq-axis:rgba(23,24,23,0.30)]",
    // Six-hue series palette, each ≥ 3:1 on a light surface.
    "[--mq-s1:#3f5bd9] [--mq-s2:#1f9d6b] [--mq-s3:#c65a12] [--mq-s4:#a83291] [--mq-s5:#1f8fb0] [--mq-s6:#8a6d1f]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-grid:rgba(255,255,255,0.12)] dark:[--mq-axis:rgba(255,255,255,0.30)]",
    // Lighter tints of the same hues, each ≥ 3:1 on a dark surface.
    "dark:[--mq-s1:#8ea2ff] dark:[--mq-s2:#5ad18b] dark:[--mq-s3:#ffab6b] dark:[--mq-s4:#f39bdc] dark:[--mq-s5:#68c7e6] dark:[--mq-s6:#dcc067]",
  ].join(" "),
  {
    variants: {
      // A line chart has one composition; the axis exists so the registry can
      // list it and the preview can coerce an incoming value.
      variant: { default: "" },
      // Size scales geometry (computed in JS) and the stroke width token only.
      size: {
        sm: "[--mq-sw:1.75]",
        md: "[--mq-sw:2]",
        lg: "[--mq-sw:2.5]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** Rounds up to a friendly axis maximum (1/1.5/2/3/4/5/6/8/10 × 10^n). */
function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const magnitude = Math.pow(10, exponent);
  const fraction = value / magnitude;
  const steps = [1, 1.5, 2, 3, 4, 5, 6, 8, 10];
  const nice = steps.find((step) => fraction <= step) ?? 10;
  return nice * magnitude;
}

/**
 * Rounds to at most two decimals WITHOUT a forced fixed width, so a fractional
 * tick like 12.5 prints as "12.5" — matching the gridline it annotates.
 */
function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}

/** Snaps a coordinate to two decimals so server and client emit identical paths. */
function r2(value: number): number {
  return Number(value.toFixed(2));
}

export type LineChartProps = Omit<React.ComponentPropsWithRef<"div">, "children"> &
  Omit<VariantProps<typeof lineChartVariants>, "variant" | "size"> & {
    /** The series to plot, in legend order. The single source of the data. */
    series: LineSeries[];
    /** x-axis tick labels, one per point index. Defaults to 1-based positions. */
    labels?: string[];
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: Size;
    /** Accessible name for the data table. Rendered as the table's <caption>. */
    caption: React.ReactNode;
    /** Header for the series column in the accessible table. Defaults to "Series". */
    seriesLabel?: string;
    /** Unit appended to values in the legend/table, e.g. "%", "k". */
    unit?: string;
    /** Formats a value for the ticks and table. Defaults to a trimmed number. */
    formatValue?: (value: number) => string;
    /** Show the colored legend below the chart. Defaults to true. */
    showLegend?: boolean;
    /** Draw a marker at each data point. Defaults to true. */
    showMarkers?: boolean;
    /** Draw the lines on mount. Reduced motion always lands on the full line. */
    animate?: boolean;
  };

/**
 * The line chart. Uncontrolled and stateless: the series is a prop, so nothing
 * is time-dependent or random in render and there is nothing to hydrate.
 */
export function LineChart({
  animate = true,
  caption,
  className,
  formatValue,
  labels,
  material = "adaptive",
  series,
  seriesLabel = "Series",
  showLegend = true,
  showMarkers = true,
  size = "md",
  unit = "",
  variant = "default",
  ...props
}: LineChartProps) {
  const fmt = formatValue ?? trimNumber;
  const withUnit = (value: number) => `${fmt(value)}${unit}`;

  const seriesList = series ?? [];
  const pointCount = seriesList.reduce((max, item) => Math.max(max, item.data.length), 0);
  const xLabels = Array.from({ length: pointCount }, (_, index) => labels?.[index] ?? String(index + 1));

  // Resolve each series to its palette slot (or a caller-supplied color).
  const resolved = seriesList.map((item, index) => {
    const custom = typeof item.color === "string" && item.color.length > 0;
    return {
      name: item.name,
      data: item.data,
      color: item.color,
      custom,
      strokeClass: custom ? "" : SERIES_STROKE[index % SERIES_STROKE.length],
      fillClass: custom ? "" : SERIES_FILL[index % SERIES_FILL.length],
    };
  });

  // The authoritative accessible equivalent — a real series × points table.
  const accessibleTable = (
    <table className={SR_ONLY}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{seriesLabel}</th>
          {xLabels.map((label, index) => (
            <th key={`head-${index}`} scope="col">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {resolved.map((item, seriesIndex) => (
          <tr key={`row-${item.name}-${seriesIndex}`}>
            <th scope="row">{item.name}</th>
            {xLabels.map((_, index) => (
              <td key={`cell-${index}`}>{index < item.data.length ? withUnit(item.data[index]) : "—"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (pointCount === 0) {
    return (
      <div {...props} className={cn(lineChartVariants({ variant, size }), className)} data-material={material} data-variant={variant}>
        {accessibleTable}
        <p className="m-0 text-[13px] text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
          No data available.
        </p>
      </div>
    );
  }

  const layout = LAYOUT[size];
  const font = FONT[size];
  const markerR = MARKER[size];

  const allValues = seriesList.flatMap((item) => item.data);
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  let yMax = dataMax <= 0 ? 0 : niceCeil(dataMax);
  const yMin = dataMin >= 0 ? 0 : -niceCeil(-dataMin);
  if (yMax === yMin) yMax = yMin + 1;
  const range = yMax - yMin;

  const width = layout.ml + layout.plotW + layout.mr;
  const height = layout.mt + layout.plotH + layout.mb;
  const plotBottom = layout.mt + layout.plotH;

  const xAt = (index: number) =>
    layout.ml + (pointCount === 1 ? layout.plotW / 2 : (index / (pointCount - 1)) * layout.plotW);
  const yAt = (value: number) => plotBottom - ((value - yMin) / range) * layout.plotH;

  const ticks = Array.from({ length: 5 }, (_, step) => yMin + (range * step) / 4);

  return (
    <div {...props} className={cn(lineChartVariants({ variant, size }), className)} data-material={material} data-variant={variant}>
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
        {/* Horizontal gridlines + value ticks. */}
        {ticks.map((tick, step) => {
          const gy = yAt(tick);
          const isZero = tick === 0 && yMin < 0 && yMax > 0;
          return (
            <g key={`gy-${step}`}>
              {step === 0 ? null : (
                <line
                  className={isZero ? AXIS_LINE : GRID_LINE}
                  strokeWidth={isZero ? 1.25 : 1}
                  x1={layout.ml}
                  x2={layout.ml + layout.plotW}
                  y1={gy}
                  y2={gy}
                />
              )}
              <text
                className={TICK_TEXT}
                dominantBaseline="middle"
                fontSize={font.axis}
                textAnchor="end"
                x={layout.ml - 8}
                y={gy}
              >
                {fmt(tick)}
              </text>
            </g>
          );
        })}

        {/* Vertical gridlines + x-axis category labels. */}
        {xLabels.map((label, index) => {
          const gx = xAt(index);
          return (
            <g key={`gx-${index}`}>
              <line className={GRID_LINE} strokeWidth={1} x1={gx} x2={gx} y1={layout.mt} y2={plotBottom} />
              <text
                className={CAT_TEXT}
                dominantBaseline="hanging"
                fontSize={font.cat}
                textAnchor="middle"
                x={gx}
                y={plotBottom + 8}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Left value axis + bottom category axis. */}
        <line className={AXIS_LINE} strokeWidth={1.25} x1={layout.ml} x2={layout.ml} y1={layout.mt} y2={plotBottom} />
        <line
          className={AXIS_LINE}
          strokeWidth={1.25}
          x1={layout.ml}
          x2={layout.ml + layout.plotW}
          y1={plotBottom}
          y2={plotBottom}
        />

        {/* One <g> per series: the line, then its markers. */}
        {resolved.map((item, seriesIndex) => {
          const points = item.data.map((value, index) => ({ x: xAt(index), y: yAt(value), value }));
          const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${r2(point.x)} ${r2(point.y)}`).join(" ");
          const pathStyle: React.CSSProperties | undefined =
            item.custom || animate
              ? {
                  ...(item.custom ? { stroke: item.color } : {}),
                  ...(animate ? { transitionDelay: `${seriesIndex * 120}ms` } : {}),
                }
              : undefined;
          return (
            <g key={`series-${item.name}-${seriesIndex}`}>
              {points.length >= 2 ? (
                <path
                  className={cn(
                    "[stroke-linecap:round] [stroke-linejoin:round] [stroke-width:var(--mq-sw,2)]",
                    item.strokeClass,
                    "forced-colors:[stroke:CanvasText]",
                    animate &&
                      "[stroke-dasharray:1] [stroke-dashoffset:0] starting:[stroke-dashoffset:1] " +
                        "transition-[stroke-dashoffset] duration-[900ms] ease-out motion-reduce:transition-none",
                  )}
                  d={linePath}
                  fill="none"
                  pathLength={1}
                  style={pathStyle}
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
              {showMarkers
                ? points.map((point, index) => (
                    <circle
                      key={`marker-${index}`}
                      className={cn(item.fillClass, "forced-colors:[fill:CanvasText]")}
                      cx={point.x}
                      cy={point.y}
                      r={markerR}
                      style={item.custom ? { fill: item.color } : undefined}
                    >
                      <title>{`${item.name}, ${xLabels[index]}: ${withUnit(point.value)}`}</title>
                    </circle>
                  ))
                : null}
            </g>
          );
        })}
      </svg>

      {showLegend ? (
        // Visual duplicate of the table's row headers, so it is aria-hidden to
        // avoid a double announcement — swatch + NAME serve sighted readers.
        <ul
          aria-hidden="true"
          className="m-0 mt-2 flex list-none flex-wrap gap-x-4 gap-y-1 p-0"
          style={{ fontSize: font.legend }}
        >
          {resolved.map((item, seriesIndex) => (
            <li
              key={`legend-${item.name}-${seriesIndex}`}
              className="inline-flex items-center gap-[6px] leading-none [color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]"
            >
              <svg className="h-[8px] w-[18px] shrink-0 overflow-visible" focusable="false" viewBox="0 0 18 8" xmlns="http://www.w3.org/2000/svg">
                <line
                  className={cn(item.strokeClass, "forced-colors:[stroke:CanvasText]")}
                  strokeLinecap="round"
                  strokeWidth={2.5}
                  style={item.custom ? { stroke: item.color } : undefined}
                  x1={1}
                  x2={17}
                  y1={4}
                  y2={4}
                />
                <circle
                  className={cn(item.fillClass, "forced-colors:[fill:CanvasText]")}
                  cx={9}
                  cy={4}
                  r={2.4}
                  style={item.custom ? { fill: item.color } : undefined}
                />
              </svg>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export { lineChartVariants };
