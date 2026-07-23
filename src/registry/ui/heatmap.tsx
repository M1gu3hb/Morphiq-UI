"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Heatmap
 *
 * A "contributions"-style grid of intensity cells drawn entirely by hand as
 * inline SVG — no charting library, no WebGL, no global stylesheet. A flat
 * `{ label, value }[]` array is arranged COLUMN-MAJOR into a grid of `rows`
 * (default 7, one per weekday), and each cell's value is bucketed into one of
 * five discrete intensity levels whose fill ramps from an empty tint up to the
 * accent. Copying this file plus `src/lib/cn.ts` reproduces the full look.
 *
 * This is a material-AGNOSTIC data component: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and reflected on `data-material`; it drives no separate recipe.
 *
 * Theming knobs are local CSS variables, each referenced with a literal
 * fallback:
 *
 *   --mq-surface     card background behind the grid
 *   --mq-ring        card border color
 *   --mq-muted       row-label + legend text
 *   --mq-cell-border hairline that separates and bounds every cell
 *   --mq-cell-hover  cell outline on hover
 *   --mq-l0..--mq-l4 the five discrete intensity fills (empty → most)
 *
 * Data-accessibility contract (the defining rule of this component):
 *   - The authoritative accessible equivalent is a real `sr-only` <table>: a
 *     <caption> names it, a header row labels the Label and Value columns, and
 *     one row per datum carries the exact figures via <th scope="row"> + <td>.
 *     The SVG grid is decoration layered on top and is `aria-hidden`.
 *   - COLOR is never the sole carrier of meaning: every cell's <title> spells
 *     out its label, its exact value AND its intensity level as a WORD, and the
 *     legend labels its ramp "Less → More" with a word per swatch — so meaning
 *     survives without perceiving the fill at all.
 *   - Contrast: row + legend labels use `--mq-muted` at or above 4.5:1 against a
 *     light and a dark surface; each discrete fill clears the 3:1 bar asked of an
 *     informative mark in both schemes.
 *   - Static: the resting state is the final grid (SSR, no-JS and reduced motion
 *     all show it). The only transition is a cell's hover outline, expressed with
 *     `transition-[stroke]` + `motion-reduce:transition-none`; nothing draws or
 *     grows on mount, so there is nothing to hydrate.
 *   - forced-colors: fills are discarded, so filled cells switch to `CanvasText`
 *     and keep an OPACITY RAMP (0.35 → 1) so the five levels stay distinguishable
 *     without color; empty cells drop to `Canvas`; the hairline and labels become
 *     `CanvasText` and the hover outline `Highlight` — bounds and levels persist.
 *   - Every figure is a prop, so nothing in render is time-dependent or random.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

type Size = "sm" | "md" | "lg";
type Level = 0 | 1 | 2 | 3 | 4;

export type HeatmapDatum = {
  /** Name for this cell — e.g. a date. Shown in the cell title and table row. */
  label: string;
  /** Numeric magnitude, bucketed into a discrete intensity level for drawing. */
  value: number;
};

/** Per-size geometry, in SVG user units (rendered 1:1 so cells stay crisp). */
const GEO: Record<Size, { cell: number; gap: number; radius: number; label: number; rowLabelW: number }> = {
  sm: { cell: 11, gap: 3, radius: 2, label: 9, rowLabelW: 30 },
  md: { cell: 14, gap: 4, radius: 2.5, label: 10, rowLabelW: 34 },
  lg: { cell: 18, gap: 5, radius: 3, label: 11, rowLabelW: 40 },
};

/** Human-readable name for each intensity level — used in titles and the legend. */
const LEVEL_WORD: Record<Level, string> = {
  0: "None",
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Very high",
};

/**
 * The discrete cell fills. Each level maps to a named token (nice designed ramp
 * in both schemes). In forced-colors the fill is discarded, so filled levels
 * switch to `CanvasText` and carry a `fill-opacity` ramp — opacity survives
 * forced-colors, so the five levels stay distinguishable without any color.
 */
const LEVEL_FILL: Record<Level, string> = {
  0: "[fill:var(--mq-l0,#e6e5df)] forced-colors:[fill:Canvas]",
  1: "[fill:var(--mq-l1,#cdd6fb)] forced-colors:[fill:CanvasText] forced-colors:[fill-opacity:0.35]",
  2: "[fill:var(--mq-l2,#9aabf5)] forced-colors:[fill:CanvasText] forced-colors:[fill-opacity:0.58]",
  3: "[fill:var(--mq-l3,#5f78e4)] forced-colors:[fill:CanvasText] forced-colors:[fill-opacity:0.79]",
  4: "[fill:var(--mq-l4,#2f47b8)] forced-colors:[fill:CanvasText] forced-colors:[fill-opacity:1]",
};

/**
 * Every cell's outline. A subtle hairline bounds and separates cells; on hover
 * it becomes the accent so the pointed-at cell reads without color alone. Only
 * the stroke changes, so `transition-[stroke]` names exactly what animates and
 * `motion-reduce:transition-none` disables it. forced-colors keeps the bounds
 * (CanvasText) and the hover cue (Highlight).
 */
const CELL_CLASS =
  "[stroke:var(--mq-cell-border,rgba(23,24,23,0.08))] [stroke-width:1] " +
  "hover:[stroke:var(--mq-cell-hover,#2f47b8)] " +
  "transition-[stroke] duration-150 ease-out motion-reduce:transition-none " +
  "forced-colors:[stroke:CanvasText] forced-colors:hover:[stroke:Highlight]";

const heatmapVariants = cva(
  [
    "relative isolate w-full overflow-x-auto text-left",
    // Adaptive light+dark token vocabulary. One accent hue ramped by intensity.
    "[--mq-surface:#f4f3ee] [--mq-ring:rgba(23,24,23,0.10)] [--mq-muted:#55554e]",
    "[--mq-cell-border:rgba(23,24,23,0.08)] [--mq-cell-hover:#2f47b8]",
    "[--mq-l0:#e6e5df] [--mq-l1:#cdd6fb] [--mq-l2:#9aabf5] [--mq-l3:#5f78e4] [--mq-l4:#2f47b8]",
    "dark:[--mq-surface:#1b1b1f] dark:[--mq-ring:rgba(255,255,255,0.12)] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-cell-border:rgba(255,255,255,0.10)] dark:[--mq-cell-hover:#aab8ff]",
    "dark:[--mq-l0:#26262b] dark:[--mq-l1:#33407e] dark:[--mq-l2:#4a63c4] dark:[--mq-l3:#7d93f0] dark:[--mq-l4:#aab8ff]",
  ].join(" "),
  {
    variants: {
      // Single composition; the axis exists so the registry can list it and the
      // preview can coerce an incoming value.
      variant: { default: "" },
      // Size only scales geometry (computed in JS); no token depends on it.
      size: { sm: "", md: "", lg: "" },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** Deterministic 5-level bucketing: 0 for empty, else ceil(ratio*4) clamped 1..4. */
function levelFor(value: number, max: number): Level {
  if (value <= 0 || max <= 0) return 0;
  const stepped = Math.ceil((value / max) * 4);
  return Math.min(4, Math.max(1, stepped)) as Level;
}

/** Trims a trailing `.0` so whole numbers read cleanly. */
function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}

export type HeatmapProps = Omit<React.ComponentPropsWithRef<"div">, "children"> &
  Omit<VariantProps<typeof heatmapVariants>, "variant" | "size"> & {
    /** The cells to plot, in display order. The single source of the data. */
    data: HeatmapDatum[];
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: Size;
    /** Rows in the grid; data fills column-major. Defaults to 7 (a week). */
    rows?: number;
    /** Optional label per row, drawn on the left (e.g. weekday abbreviations). */
    rowLabels?: string[];
    /** Accessible name for the data table. Rendered as the table's <caption>. */
    caption: React.ReactNode;
    /** Header for the label column in the accessible table. Defaults to "Label". */
    labelHeader?: string;
    /** Header for the value column in the accessible table. Defaults to "Value". */
    valueHeader?: string;
    /** Unit appended to every value in titles and the table, e.g. "%", "k". */
    unit?: string;
    /** Formats a value for titles and the table. Defaults to a trimmed number. */
    formatValue?: (value: number) => string;
  };

/**
 * The heatmap. Uncontrolled and stateless: the series is a prop, so nothing is
 * time-dependent or random in render and there is nothing to hydrate.
 */
export function Heatmap({
  caption,
  className,
  data,
  formatValue,
  labelHeader = "Label",
  material = "adaptive",
  rowLabels,
  rows = 7,
  size = "md",
  unit = "",
  valueHeader = "Value",
  variant = "default",
  ...props
}: HeatmapProps) {
  const fmt = formatValue ?? trimNumber;
  const withUnit = (value: number) => `${fmt(value)}${unit}`;
  const count = data.length;

  // The authoritative accessible equivalent — a real table, always rendered.
  const accessibleTable = (
    <table className={SR_ONLY}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{labelHeader}</th>
          <th scope="col">{valueHeader}</th>
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
        className={cn(heatmapVariants({ variant, size }), className)}
        data-material={material}
      >
        {accessibleTable}
        <p className="m-0 text-[13px] text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
          No data available.
        </p>
      </div>
    );
  }

  const rowCount = Math.max(1, Math.floor(rows));
  const geo = GEO[size];
  const { cell, gap, radius } = geo;
  const step = cell + gap;
  const cols = Math.ceil(count / rowCount);
  const hasRowLabels = Array.isArray(rowLabels) && rowLabels.length > 0;
  const leftPad = hasRowLabels ? geo.rowLabelW : 0;

  const gridW = cols * cell + (cols - 1) * gap;
  const gridH = rowCount * cell + (rowCount - 1) * gap;
  const svgW = leftPad + gridW;
  const svgH = gridH;

  const maxValue = Math.max(0, ...data.map((datum) => datum.value));

  return (
    <div
      {...props}
      className={cn(heatmapVariants({ variant, size }), className)}
      data-material={material}
    >
      {accessibleTable}

      <div
        className={cn(
          "inline-flex flex-col gap-[10px] rounded-2xl border p-[14px]",
          "[background:var(--mq-surface,#f4f3ee)] [border-color:var(--mq-ring,rgba(23,24,23,0.10))]",
          "shadow-[0_1px_2px_rgba(23,24,23,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.45)]",
          "forced-colors:border-[CanvasText] forced-colors:shadow-none",
        )}
      >
        {/* Decoration: the table above is what assistive tech announces. */}
        <svg
          aria-hidden="true"
          className="block"
          focusable="false"
          height={svgH}
          role="presentation"
          viewBox={`0 0 ${svgW} ${svgH}`}
          width={svgW}
          xmlns="http://www.w3.org/2000/svg"
        >
          {hasRowLabels
            ? Array.from({ length: rowCount }, (_, row) => {
                const rowLabel = rowLabels?.[row];
                if (!rowLabel) return null;
                return (
                  <text
                    key={`row-${row}`}
                    className="[fill:var(--mq-muted,#55554e)] forced-colors:[fill:CanvasText]"
                    dominantBaseline="middle"
                    fontSize={geo.label}
                    textAnchor="end"
                    x={leftPad - 6}
                    y={row * step + cell / 2}
                  >
                    {rowLabel}
                  </text>
                );
              })
            : null}

          {data.map((datum, index) => {
            const level = levelFor(datum.value, maxValue);
            const col = Math.floor(index / rowCount);
            const row = index % rowCount;
            return (
              <rect
                key={`cell-${datum.label}-${index}`}
                className={cn(CELL_CLASS, LEVEL_FILL[level])}
                height={cell}
                rx={radius}
                ry={radius}
                width={cell}
                x={leftPad + col * step}
                y={row * step}
              >
                <title>{`${datum.label}: ${withUnit(datum.value)} — ${LEVEL_WORD[level]}`}</title>
              </rect>
            );
          })}
        </svg>

        {/* Legend: the ramp is decoration; each swatch names its level for hover,
            and the numbers live in the sr-only table, so it is aria-hidden. */}
        <div
          aria-hidden="true"
          className="flex items-center gap-[8px] text-[11px] leading-none [color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]"
        >
          <span>Less</span>
          <svg
            className="block shrink-0"
            focusable="false"
            height={12}
            viewBox="0 0 72 12"
            width={72}
            xmlns="http://www.w3.org/2000/svg"
          >
            {([0, 1, 2, 3, 4] as Level[]).map((level) => (
              <rect
                key={`swatch-${level}`}
                className={cn(CELL_CLASS, LEVEL_FILL[level])}
                height={12}
                rx={2}
                ry={2}
                width={12}
                x={level * 15}
                y={0}
              >
                <title>{LEVEL_WORD[level]}</title>
              </rect>
            ))}
          </svg>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export { heatmapVariants };
