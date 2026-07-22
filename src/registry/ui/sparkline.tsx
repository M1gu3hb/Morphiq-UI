"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Sparkline
 *
 * A mini trend chart — a line stroke over a soft filled area — drawn entirely by
 * hand as inline SVG. No charting library, no WebGL, no global stylesheet: the
 * polyline and the area polygon are computed from a numeric `data` array and
 * mapped deterministically into a fixed viewBox, so copying this file plus
 * `src/lib/cn.ts` reproduces the full look.
 *
 * This is a material-AGNOSTIC component: it ships a single style built on the
 * adaptive light+dark token vocabulary. `material` is accepted only for catalog
 * parity and is reflected on `data-material`; it drives no separate recipe.
 *
 * Theming knobs are local CSS variables, each referenced with a literal
 * fallback. The positive/negative palette is copied from the Stat Card so a
 * sparkline placed beside a stat reads as the same system:
 *
 *   --mq-text       foreground for the delta figure
 *   --mq-muted      flat-trend color
 *   --mq-pos        positive-trend line + delta color
 *   --mq-neg        negative-trend line + delta color
 *   --mq-area-pos   positive-trend area tint (top stop)
 *   --mq-area-neg   negative-trend area tint (top stop)
 *   --mq-area-flat  flat-trend area tint (top stop)
 *   --mq-rule       baseline hairline color
 *   --mq-sw         line stroke width (set by size)
 *
 * Data-accessibility contract:
 *   - The SVG is decoration layered over data an sr-only summary already carries;
 *     it is `aria-hidden` and the summary ("Trend over 12 points: up 8%, from 40
 *     to 43") is what assistive tech announces.
 *   - Trend is NEVER carried by color alone: the visible delta pairs the color
 *     with a directional arrow ICON and a signed value, and the sr-only summary
 *     spells the direction as a WORD ("up" / "down" / "no change").
 *   - `--mq-pos` / `--mq-neg` are tuned to at least 4.5:1 against a light and a
 *     dark surface, so the colored delta figure still meets body-text contrast;
 *     the line stroke clears the 3:1 bar for an informative glyph.
 *   - The line's resting state is the FULLY DRAWN path (`stroke-dashoffset:0`),
 *     so SSR, no-JS and reduced-motion all show the complete trend. The entrance
 *     is a one-shot draw expressed with `@starting-style` (the `starting:`
 *     variant) from offset 1 → 0; `pathLength={1}` normalizes the length so no JS
 *     measurement is needed, and `motion-reduce:transition-none` lands straight
 *     on the final line.
 *   - Every figure is a prop, so there is no time-dependent or random value in
 *     render and nothing to hydrate.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

// Fixed drawing box. All three sizes render this same viewBox at a 3:1 aspect
// ratio so uniform scaling never distorts the endpoint dot into an ellipse.
const VB_W = 120;
const VB_H = 40;
const PAD_X = 4;
const PAD_Y = 6;

type Trend = "up" | "down" | "flat";

const sparklineVariants = cva(
  [
    "relative isolate inline-flex items-center",
    // Adaptive light+dark token vocabulary. Positive/negative palette copied
    // token-for-token from the Stat Card's adaptive recipe.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-pos:#15703f] [--mq-neg:#9c2f22]",
    "[--mq-area-pos:rgba(21,112,63,0.16)] [--mq-area-neg:rgba(156,47,34,0.16)] [--mq-area-flat:rgba(85,85,78,0.12)]",
    "[--mq-rule:rgba(23,24,23,0.14)]",
    "text-[color:var(--mq-text,#1c1c19)]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-pos:#5ad18b] dark:[--mq-neg:#ff9d8e]",
    "dark:[--mq-area-pos:rgba(90,209,139,0.20)] dark:[--mq-area-neg:rgba(255,157,142,0.20)] dark:[--mq-area-flat:rgba(185,183,176,0.16)]",
    "dark:[--mq-rule:rgba(255,255,255,0.16)]",
    "forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      // Single variant: a sparkline has one composition. The axis exists so the
      // registry can list it and the preview can coerce an incoming value.
      variant: {
        default: "",
      },
      size: {
        sm: "gap-[6px] text-[11px] [--mq-sw:1.5]",
        md: "gap-[8px] text-[12px] [--mq-sw:2]",
        lg: "gap-[10px] text-[13px] [--mq-sw:2.25]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** Rendered SVG box per size, each at the viewBox's 3:1 ratio. */
const SVG_SIZE: Record<"sm" | "md" | "lg", string> = {
  sm: "h-[30px] w-[90px]",
  md: "h-[44px] w-[132px]",
  lg: "h-[62px] w-[186px]",
};

const TREND_STROKE: Record<Trend, string> = {
  up: "[stroke:var(--mq-pos,#15703f)]",
  down: "[stroke:var(--mq-neg,#9c2f22)]",
  flat: "[stroke:var(--mq-muted,#55554e)]",
};

const TREND_FILL: Record<Trend, string> = {
  up: "[fill:var(--mq-pos,#15703f)]",
  down: "[fill:var(--mq-neg,#9c2f22)]",
  flat: "[fill:var(--mq-muted,#55554e)]",
};

/** Top stop for the area gradient; the bottom stop fades this to transparent. */
const TREND_AREA: Record<Trend, string> = {
  up: "var(--mq-area-pos,rgba(21,112,63,0.16))",
  down: "var(--mq-area-neg,rgba(156,47,34,0.16))",
  flat: "var(--mq-area-flat,rgba(85,85,78,0.12))",
};

const TREND_TEXT: Record<Trend, string> = {
  up: "text-[color:var(--mq-pos,#15703f)]",
  down: "text-[color:var(--mq-neg,#9c2f22)]",
  flat: "text-[color:var(--mq-muted,#55554e)]",
};

const TREND_WORD: Record<Trend, string> = {
  up: "up",
  down: "down",
  flat: "no change",
};

/** Trims a trailing `.0` so whole numbers read cleanly in the summary. */
function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

type Point = { x: number; y: number };

/** Maps the series into viewBox coordinates: higher value → higher on screen. */
function computePoints(data: number[]): Point[] {
  const count = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const innerW = VB_W - PAD_X * 2;
  const innerH = VB_H - PAD_Y * 2;
  return data.map((value, index) => {
    const x = count === 1 ? VB_W / 2 : PAD_X + (index / (count - 1)) * innerW;
    const y = VB_H - PAD_Y - ((value - min) / range) * innerH;
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
  });
}

function toLinePath(points: Point[]): string {
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
}

/** The line, closed down to the baseline and back, for the filled area. */
function toAreaPath(points: Point[]): string {
  const first = points[0];
  const last = points[points.length - 1];
  return `${toLinePath(points)} L${last.x} ${VB_H} L${first.x} ${VB_H} Z`;
}

export type SparklineProps = Omit<React.ComponentPropsWithRef<"div">, "children"> &
  Omit<VariantProps<typeof sparklineVariants>, "variant" | "size"> & {
    /** The numeric series to plot, in order. The single source of the trend. */
    data: number[];
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: "sm" | "md" | "lg";
    /** Short name of the series, e.g. "Revenue". Prefixes the accessible summary. */
    label?: string;
    /** Unit appended to values in the summary/delta, e.g. "ms". Percentages ignore it. */
    unit?: string;
    /** Show the visible signed delta (arrow + sign + magnitude). Defaults to true. */
    showDelta?: boolean;
    /** Draw the stroke on mount. Reduced motion always lands on the full line. */
    animate?: boolean;
  };

/**
 * The sparkline. Uncontrolled and stateless: the series is a prop, so nothing is
 * time-dependent or random in render.
 */
export function Sparkline({
  animate = true,
  className,
  data,
  label,
  material = "adaptive",
  showDelta = true,
  size = "md",
  unit = "",
  variant = "default",
  ...props
}: SparklineProps) {
  const rawId = React.useId();
  // `useId` can contain ":" which is invalid inside an SVG id / url() reference.
  const gradId = `mq-spark-${rawId.replace(/:/g, "")}`;

  const count = data.length;

  // No data: render an empty, correctly-labeled shell rather than crashing on
  // Math.min() of an empty array.
  if (count === 0) {
    return (
      <div
        {...props}
        className={cn(sparklineVariants({ variant, size }), className)}
        data-material={material}
        data-trend="flat"
      >
        <span className={SR_ONLY}>{`${label ? `${label}. ` : ""}No data available.`}</span>
      </div>
    );
  }

  const first = data[0];
  const last = data[count - 1];
  const diff = last - first;
  const trend: Trend = diff > 0 ? "up" : diff < 0 ? "down" : "flat";

  // Percentage when a nonzero baseline exists; otherwise the absolute change.
  const hasPct = first !== 0;
  const magnitude = hasPct
    ? `${Math.abs(Math.round((diff / Math.abs(first)) * 100))}%`
    : `${trimNumber(Math.abs(diff))}${unit}`;

  const summary =
    `${label ? `${label}. ` : ""}Trend over ${count} ${count === 1 ? "point" : "points"}: ` +
    `${TREND_WORD[trend]}${trend === "flat" ? "" : ` ${magnitude}`}, ` +
    `from ${trimNumber(first)}${unit} to ${trimNumber(last)}${unit}.`;

  // Visible delta text. `−` is the true minus glyph (U+2212).
  const sign = trend === "up" ? "+" : trend === "down" ? "−" : "";
  const deltaText = trend === "flat" ? `0${hasPct ? "%" : unit}` : `${sign}${magnitude}`;

  const points = computePoints(data);
  const hasLine = count >= 2;
  const linePath = hasLine ? toLinePath(points) : "";
  const areaPath = hasLine ? toAreaPath(points) : "";
  const endpoint = points[points.length - 1];

  return (
    <div
      {...props}
      className={cn(sparklineVariants({ variant, size }), className)}
      data-material={material}
      data-trend={trend}
    >
      {/* Authoritative accessible source; the SVG below is aria-hidden. */}
      <span className={SR_ONLY}>{summary}</span>

      <svg
        aria-hidden="true"
        className={cn("shrink-0 overflow-visible", SVG_SIZE[size])}
        focusable="false"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{summary}</title>
        {hasLine ? (
          <>
            <defs>
              <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={TREND_AREA[trend]} />
                <stop offset="100%" stopColor={TREND_AREA[trend]} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area is pure decoration; forced-colors drops it so only the
                meaning-carrying line survives. */}
            <path className="forced-colors:hidden" d={areaPath} fill={`url(#${gradId})`} />
            <line
              className="[stroke:var(--mq-rule,rgba(23,24,23,0.14))] forced-colors:hidden"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              x1={points[0].x}
              x2={endpoint.x}
              y1={VB_H - 0.5}
              y2={VB_H - 0.5}
            />
            <path
              className={cn(
                "[stroke-linecap:round] [stroke-linejoin:round] [stroke-width:var(--mq-sw,2)]",
                TREND_STROKE[trend],
                "forced-colors:[stroke:CanvasText]",
                animate &&
                  "[stroke-dasharray:1] [stroke-dashoffset:0] starting:[stroke-dashoffset:1] " +
                    "transition-[stroke-dashoffset] duration-[800ms] ease-out motion-reduce:transition-none",
              )}
              d={linePath}
              fill="none"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          </>
        ) : null}
        {/* Endpoint marker for the current value; kept visible in forced-colors. */}
        <circle
          className={cn(TREND_FILL[trend], "forced-colors:[fill:CanvasText]")}
          cx={endpoint.x}
          cy={endpoint.y}
          r={2.4}
        />
      </svg>

      {showDelta ? (
        // Visual duplicate of the sr-only summary, so it is aria-hidden to avoid
        // a double announcement — arrow + sign + magnitude serve sighted readers.
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center gap-[3px] font-bold leading-none tabular-nums",
            TREND_TEXT[trend],
            "forced-colors:text-[CanvasText]",
          )}
        >
          <svg
            className={cn("h-[0.9em] w-[0.9em] shrink-0", TREND_FILL[trend], "forced-colors:[fill:CanvasText]")}
            focusable="false"
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
          >
            {trend === "up" ? (
              <path d="M6 2.5 10 8 2 8 Z" />
            ) : trend === "down" ? (
              <path d="M2 4 10 4 6 9.5 Z" />
            ) : (
              <rect height={1.6} rx={0.8} width={8} x={2} y={5.2} />
            )}
          </svg>
          <span>{deltaText}</span>
        </span>
      ) : null}
    </div>
  );
}

export { sparklineVariants };
