"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Funnel Chart
 *
 * A vertical funnel of stages, drawn entirely by hand as centered CSS bars — no
 * charting library, no WebGL, no global stylesheet. Every stage in the
 * `stages: { label, value }[]` prop becomes a centered bar whose width is
 * proportional to its value, so the stack tapers into a funnel silhouette;
 * copying this file plus `src/lib/cn.ts` reproduces the full look.
 *
 * This is a material-AGNOSTIC data component: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and reflected on `data-material`; it drives no separate recipe.
 *
 * Theming knobs are local CSS variables, each referenced with a literal
 * fallback:
 *
 *   --mq-text        stage label / value text
 *   --mq-muted       conversion connector text
 *   --mq-bar         bar fill
 *   --mq-bar-strong  bar fill on hover
 *   --mq-bar-h       bar height (set by size)
 *   --mq-gap         vertical rhythm between stages (set by size)
 *
 * Data-accessibility contract (the defining rule of this component):
 *   - The authoritative accessible equivalent is a real `sr-only` <table>: a
 *     <caption> names it, a header row labels the Stage, Value and Conversion
 *     columns, and one row per stage carries the exact figures via
 *     <th scope="row"> + <td> — including the stage-to-stage conversion. The
 *     drawn funnel is decoration layered on top and is `aria-hidden`.
 *   - COLOR is never the sole carrier of meaning: every stage prints its LABEL,
 *     its VALUE and its CONVERSION % from the previous stage as visible text, so
 *     the funnel reads without perceiving the fill color — the bar width is only
 *     a redundant restatement of a number already spelled out.
 *   - Contrast: label / value text uses `--mq-text` and the conversion
 *     connectors `--mq-muted`, each at or above 4.5:1 against a light and a dark
 *     surface; the bar fill clears the 3:1 bar for an informative glyph in both
 *     schemes.
 *   - Bars grow on mount reduced-motion-safe WITHOUT JS: a bar's resting state is
 *     its FINAL width (so SSR, no-JS and reduced-motion all show the true
 *     magnitude), and the entrance is expressed with `@starting-style` (the
 *     `starting:` variant) on the standalone `scale` property with a centered
 *     `transform-origin` and a matching `transition-[scale]`.
 *     `motion-reduce:transition-none` lands straight on the final width.
 *   - Conversion is computed deterministically as current ÷ previous with a
 *     divide-by-zero guard, so nothing in render is time-dependent or random.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

type Size = "sm" | "md" | "lg";

export type FunnelStage = {
  /** Stage name. Shown above the bar and as the table row header. */
  label: string;
  /** Count reaching this stage. Negative values are clamped to 0 for drawing only. */
  value: number;
};

const funnelChartVariants = cva(
  [
    "relative isolate w-full text-left",
    // Adaptive light+dark token vocabulary. One series, one accent hue.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-bar:#3f5bd9] [--mq-bar-strong:#2f47b8]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-bar:#8ea2ff] dark:[--mq-bar-strong:#aab8ff]",
    "text-[color:var(--mq-text,#1c1c19)]",
    "forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      // Single variant: a funnel has one composition. The axis exists so the
      // registry can list it and the preview can coerce an incoming value.
      variant: { default: "" },
      // Size scales geometry only; no token of meaning depends on it.
      size: {
        sm: "[--mq-bar-h:26px] [--mq-gap:10px] text-[11px]",
        md: "[--mq-bar-h:38px] [--mq-gap:14px] text-[12px]",
        lg: "[--mq-bar-h:50px] [--mq-gap:18px] text-[13px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/**
 * The centered stage bar. Its magnitude is carried by the visible value label, so
 * in forced-colors the fill becomes a solid `CanvasText` block with a `CanvasText`
 * border to keep its bounds. The from-zero growth is a standalone `scale` (never
 * `transform`, so `transition-[scale]` animates it), anchored to the center so the
 * bar opens outward like a funnel rather than sliding from an edge.
 */
function barClass(animate: boolean): string {
  return cn(
    "mx-auto rounded-[6px] [height:var(--mq-bar-h,38px)]",
    "[background-color:var(--mq-bar,#3f5bd9)] hover:[background-color:var(--mq-bar-strong,#2f47b8)]",
    "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(23,24,23,0.16)]",
    "forced-colors:[background-color:CanvasText] forced-colors:border forced-colors:border-[CanvasText]",
    animate
      ? cn(
          "[scale:1_1] [transform-origin:center]",
          "transition-[scale,background-color] duration-[700ms] ease-out motion-reduce:transition-none",
          "starting:[scale:0_1]",
        )
      : "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
  );
}

/** Rounds to at most two decimals without a forced fixed width. */
function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}

/** Formats a conversion ratio (already a percentage) to one trimmed decimal. */
function formatPct(pct: number): string {
  const rounded = Math.round(pct * 10) / 10;
  return `${Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)}%`;
}

export type FunnelChartProps = Omit<React.ComponentPropsWithRef<"div">, "children"> &
  Omit<VariantProps<typeof funnelChartVariants>, "variant" | "size"> & {
    /** The funnel stages, top (widest) to bottom. The single source of the data. */
    stages: FunnelStage[];
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: Size;
    /** Accessible name for the data table. Rendered as the table's <caption>. */
    caption: React.ReactNode;
    /** Header for the stage column in the accessible table. Defaults to "Stage". */
    stageLabel?: string;
    /** Header for the value column in the accessible table. Defaults to "Value". */
    valueLabel?: string;
    /** Header for the conversion column in the accessible table. Defaults to "Conversion". */
    conversionLabel?: string;
    /** Unit appended to every value in labels and the table, e.g. "%", "k". */
    unit?: string;
    /** Formats a value for the visible labels and the table. Defaults to a trimmed number. */
    formatValue?: (value: number) => string;
    /** Grow the bars on mount. Reduced motion always lands on the final width. */
    animate?: boolean;
  };

/**
 * The funnel chart. Uncontrolled and stateless: the series is a prop, so nothing
 * is time-dependent or random in render and there is nothing to hydrate.
 */
export function FunnelChart({
  animate = true,
  caption,
  className,
  conversionLabel = "Conversion",
  formatValue,
  material = "adaptive",
  size = "md",
  stageLabel = "Stage",
  stages,
  unit = "",
  valueLabel = "Value",
  variant = "default",
  ...props
}: FunnelChartProps) {
  const fmt = formatValue ?? trimNumber;
  const withUnit = (value: number) => `${fmt(value)}${unit}`;
  const count = stages.length;

  // Conversion per stage: current ÷ previous. `null` for the first stage (no
  // previous) or when the previous value is 0 (the divide-by-zero guard).
  const conversions = stages.map((stage, index) => {
    if (index === 0) return null;
    const previous = stages[index - 1].value;
    if (previous === 0) return null;
    return (stage.value / previous) * 100;
  });

  // The authoritative accessible equivalent — a real table, always rendered.
  const accessibleTable = (
    <table className={SR_ONLY}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{stageLabel}</th>
          <th scope="col">{valueLabel}</th>
          <th scope="col">{conversionLabel}</th>
        </tr>
      </thead>
      <tbody>
        {stages.map((stage, index) => {
          const pct = conversions[index];
          return (
            <tr key={`${stage.label}-${index}`}>
              <th scope="row">{stage.label}</th>
              <td>{withUnit(stage.value)}</td>
              <td>{pct === null ? "—" : formatPct(pct)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  if (count === 0) {
    return (
      <div
        {...props}
        className={cn(funnelChartVariants({ variant, size }), className)}
        data-material={material}
      >
        {accessibleTable}
        <p className="m-0 text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
          No data available.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...stages.map((stage) => Math.max(0, stage.value)));
  const bar = barClass(animate);

  return (
    <div
      {...props}
      className={cn(funnelChartVariants({ variant, size }), className)}
      data-material={material}
    >
      {accessibleTable}

      {/* Decoration: the sr-only table above is what assistive tech announces. */}
      <ol aria-hidden="true" className="m-0 flex list-none flex-col p-0 [gap:var(--mq-gap,14px)]">
        {stages.map((stage, index) => {
          const pct = conversions[index];
          const safeValue = Math.max(0, stage.value);
          const widthPct = maxValue > 0 ? Math.round((safeValue / maxValue) * 1000) / 10 : 0;
          return (
            <li className="flex flex-col gap-[6px]" key={`${stage.label}-${index}`}>
              {pct === null ? null : (
                <p className="m-0 flex items-center justify-center gap-[4px] text-center leading-none text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
                  <svg
                    aria-hidden="true"
                    className="h-[0.85em] w-[0.85em] shrink-0 [fill:var(--mq-muted,#55554e)] forced-colors:[fill:CanvasText]"
                    focusable="false"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 4 10 4 6 9.5 Z" />
                  </svg>
                  <span className="tabular-nums">{formatPct(pct)}</span>
                </p>
              )}

              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{stage.label}</span>
                <span className="font-bold tabular-nums">{withUnit(stage.value)}</span>
              </div>

              <div
                className={bar}
                style={{
                  width: `${widthPct}%`,
                  ...(stage.value > 0 ? { minWidth: "2px" } : {}),
                  ...(animate ? { transitionDelay: `${index * 60}ms` } : {}),
                }}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export { funnelChartVariants };
