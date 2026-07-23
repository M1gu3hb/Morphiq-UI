"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Gauge
 *
 * A SEMICIRCULAR (180°) meter drawn entirely by hand as inline SVG — a muted
 * track, a coloured value arc that fills from the minimum toward the value, a
 * needle that points at the value, and the reading as real numeric text. No
 * charting library, no WebGL, no global stylesheet: every coordinate is computed
 * from `value`, `min`, `max` (and optional `zones`) and mapped deterministically
 * into a fixed viewBox, so copying this file plus `src/lib/cn.ts` reproduces the
 * whole look. It is DISTINCT from Radial Progress, which is a full-circle ring.
 *
 * This is a material-AGNOSTIC data component: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and is reflected on `data-material`; it drives no separate
 * recipe.
 *
 * Local theming knobs are CSS variables, each referenced with a literal
 * fallback:
 *
 *   --mq-text        the numeric reading + primary text
 *   --mq-muted       label / tick text
 *   --mq-track       the unfilled track arc
 *   --mq-arc         the value arc (default, when no zones are given)
 *   --mq-needle      the needle
 *   --mq-hub         the needle's centre hub
 *   --mq-zone-low / --mq-zone-ok / --mq-zone-high / --mq-zone-neutral
 *                    the four semantic zone colours (band + legend swatch)
 *   --mq-w           rendered width (set by size)
 *   --mq-offset      value-arc dash offset — the FINAL value (set inline)
 *   --mq-angle       needle angle — the FINAL value (set inline)
 *   --mq-angle-start needle angle at the minimum, for the entrance (set inline)
 *
 * Data-accessibility contract (the defining rule of this component):
 *   - The wrapper is a native `role="meter"` carrying aria-valuenow / -valuemin /
 *     -valuemax, an aria-valuetext that spells the reading (and its zone), and an
 *     aria-label naming it. That, plus an sr-only summary sentence, is the
 *     authoritative source; every visual part below — the SVG and the visible
 *     label / zone / legend — is aria-hidden, so nothing is announced twice.
 *   - COLOUR is never the sole carrier: the reading is printed as real text, the
 *     needle encodes the value positionally, min/max ticks label the scale, and
 *     each zone is paired with a TEXT label and numeric range in the legend (and
 *     named in aria-valuetext + the summary), so a zone is never colour-alone.
 *   - Contrast: the numeric reading uses the primary text token and labels the
 *     muted token, each at or above 4.5:1 against a light and a dark surface; the
 *     value arc and zone bands clear the 3:1 bar for an informative graphic mark.
 *   - Draw-on-mount reduced-motion-safe WITHOUT JS: the value arc's resting
 *     stroke-dashoffset IS the final value and the needle's resting `rotate` IS
 *     the final angle (so SSR, no-JS and reduced-motion all render the true
 *     reading), and the entrances are expressed with the `starting:` variant
 *     (@starting-style) — the arc from an empty offset, the needle from the
 *     minimum angle — over `transition-[stroke-dashoffset]` and
 *     `transition-[rotate]`. `motion-reduce:transition-none` lands straight on
 *     the value. There is no setState-driven count-up and no getTotalLength.
 *   - forced-colors: the value arc becomes Highlight, the track and needle
 *     CanvasText, and every label CanvasText, so the reading stays perceivable.
 *   - Every figure is a prop, so nothing in render depends on time or randomness.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

type Size = "sm" | "md" | "lg";
/** Semantic tone selecting a zone's colour; paired with a text label everywhere. */
type Tone = "low" | "ok" | "high" | "neutral";

// Fixed drawing box, rendered at a per-size width with the aspect locked so
// uniform scaling never distorts the semicircle. The gauge is centred on
// (CX, CY); the track/value arc sit at TRACK_R and the zone ring at ZONE_R.
const VB_W = 240;
const VB_H = 188;
const CX = 120;
const CY = 130;
const TRACK_R = 86;
const TRACK_SW = 18;
const ZONE_R = 104;
const ZONE_SW = 8;
const NEEDLE_LEN = 70;
const HUB_R = 8;

const gaugeVariants = cva(
  [
    "relative isolate inline-flex flex-col items-center gap-[10px] text-center",
    "w-[var(--mq-w,272px)] max-w-full",
    // Adaptive light+dark token vocabulary. Arc + zone hues are shared token for
    // token with the Bar Chart and Sparkline so a gauge reads as the same system.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-track:#e2e0da] [--mq-arc:#3f5bd9] [--mq-needle:#1c1c19] [--mq-hub:#1c1c19]",
    "[--mq-zone-low:#b06a00] [--mq-zone-ok:#15703f] [--mq-zone-high:#9c2f22] [--mq-zone-neutral:#6b6b62]",
    "text-[color:var(--mq-text,#1c1c19)]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-track:#3a3a40] dark:[--mq-arc:#8ea2ff] dark:[--mq-needle:#f1efe9] dark:[--mq-hub:#f1efe9]",
    "dark:[--mq-zone-low:#e5a54b] dark:[--mq-zone-ok:#5ad18b] dark:[--mq-zone-high:#ff9d8e] dark:[--mq-zone-neutral:#9a9a90]",
    "forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      // Single composition: a gauge has one shape. `default` exists so the
      // registry can list a variant and the preview can coerce an incoming value.
      variant: { default: "" },
      // Size only scales the rendered width (geometry is a fixed viewBox) and the
      // HTML label/legend type; no token depends on it.
      size: {
        sm: "[--mq-w:220px] text-[11px]",
        md: "[--mq-w:272px] text-[12px]",
        lg: "[--mq-w:336px] text-[13px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** Value-arc stroke when a zone is active — coloured by the value's own zone. */
const ARC_TONE: Record<Tone, string> = {
  low: "[stroke:var(--mq-zone-low,#b06a00)]",
  ok: "[stroke:var(--mq-zone-ok,#15703f)]",
  high: "[stroke:var(--mq-zone-high,#9c2f22)]",
  neutral: "[stroke:var(--mq-zone-neutral,#6b6b62)]",
};

/** Zone-band stroke; forced-colors collapses hues to CanvasText (legend disambiguates). */
const ZONE_BAND: Record<Tone, string> = {
  low: "[stroke:var(--mq-zone-low,#b06a00)] forced-colors:[stroke:CanvasText]",
  ok: "[stroke:var(--mq-zone-ok,#15703f)] forced-colors:[stroke:CanvasText]",
  high: "[stroke:var(--mq-zone-high,#9c2f22)] forced-colors:[stroke:CanvasText]",
  neutral: "[stroke:var(--mq-zone-neutral,#6b6b62)] forced-colors:[stroke:CanvasText]",
};

/** Legend swatch fill; the paired text label carries meaning if the fill drops. */
const ZONE_SWATCH: Record<Tone, string> = {
  low: "bg-[var(--mq-zone-low,#b06a00)]",
  ok: "bg-[var(--mq-zone-ok,#15703f)]",
  high: "bg-[var(--mq-zone-high,#9c2f22)]",
  neutral: "bg-[var(--mq-zone-neutral,#6b6b62)]",
};

/** A zone as supplied by the caller: a label, its upper bound and a tone. */
export type GaugeZone = {
  /** Upper bound of this zone; the last zone should reach `max`. */
  upTo: number;
  /** Visible label, shown in the legend and named in aria-valuetext / summary. */
  label: string;
  /** Semantic tone selecting the zone colour. Defaults to "neutral". */
  tone?: Tone;
};

/** A zone resolved into an inclusive lower/upper bound and drawing fractions. */
type ResolvedZone = {
  label: string;
  tone: Tone;
  from: number;
  to: number;
  f0: number;
  f1: number;
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
const round2 = (value: number): number => Math.round(value * 100) / 100;
const round3 = (value: number): number => Math.round(value * 1000) / 1000;

/**
 * Maps a fraction [0,1] onto the semicircle at radius `r`: 0 → left end (min),
 * 0.5 → top, 1 → right end (max). y is inverted because SVG y points down.
 */
function polar(r: number, fraction: number): { x: number; y: number } {
  const theta = Math.PI * (1 - fraction);
  return { x: round2(CX + r * Math.cos(theta)), y: round2(CY - r * Math.sin(theta)) };
}

/** An SVG arc segment of the semicircle between two fractions (always ≤ 180°). */
function arcSegment(r: number, f0: number, f1: number): string {
  const a = polar(r, f0);
  const b = polar(r, f1);
  return `M ${a.x} ${a.y} A ${r} ${r} 0 0 1 ${b.x} ${b.y}`;
}

/** Resolves caller zones into contiguous, clamped bands with drawing fractions. */
function resolveZones(zones: GaugeZone[], min: number, max: number): ResolvedZone[] {
  const span = max - min || 1;
  let lower = min;
  const out: ResolvedZone[] = [];
  for (const zone of zones) {
    const upper = Math.min(Math.max(zone.upTo, lower), max);
    out.push({
      label: zone.label,
      tone: zone.tone ?? "neutral",
      from: lower,
      to: upper,
      f0: clamp01((lower - min) / span),
      f1: clamp01((upper - min) / span),
    });
    lower = upper;
  }
  return out;
}

/** Trims a trailing `.0` so whole numbers read cleanly. */
function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}

export type GaugeProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "children" | "role"
> &
  Omit<VariantProps<typeof gaugeVariants>, "variant" | "size"> & {
    /** The measured value. Clamped to `[min, max]` for drawing. */
    value: number;
    /** Lower bound of the scale. Defaults to 0. */
    min?: number;
    /** Upper bound of the scale; falls back to `min + 1` if not greater. Defaults to 100. */
    max?: number;
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: Size;
    /** Optional label under the reading. A string also names the meter. */
    label?: React.ReactNode;
    /** Unit appended to the reading, ticks and zone ranges, e.g. "%". */
    unit?: string;
    /** Optional coloured zones; each is legended so a zone is never colour-alone. */
    zones?: GaugeZone[];
    /** Formats a value for the reading, ticks and legend. Defaults to a trimmed number. */
    formatValue?: (value: number) => string;
    /** Sweep the arc and needle on mount. Reduced motion always lands on the value. */
    animate?: boolean;
  };

/**
 * A passive, server-friendly semicircular meter. Uncontrolled and stateless: the
 * reading is a prop, so nothing in render is time-dependent or random — pass a
 * new `value` and the arc and needle transition to it.
 */
export function Gauge({
  "aria-label": ariaLabel,
  "aria-valuetext": ariaValueText,
  animate = true,
  className,
  formatValue,
  label,
  material = "adaptive",
  max = 100,
  min = 0,
  size = "md",
  unit = "",
  value,
  variant = "default",
  zones,
  ...props
}: GaugeProps) {
  const fmt = formatValue ?? trimNumber;
  const withUnit = (input: number) => `${fmt(input)}${unit}`;

  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 1;
  const rawValue = Number.isFinite(value) ? value : safeMin;
  const clamped = Math.min(Math.max(rawValue, safeMin), safeMax);
  const fraction = (clamped - safeMin) / (safeMax - safeMin);

  const resolved = zones && zones.length > 0 ? resolveZones(zones, safeMin, safeMax) : [];
  const currentZone =
    resolved.length > 0 ? resolved.find((zone) => clamped <= zone.to) ?? resolved[resolved.length - 1] : undefined;

  // stroke-dashoffset = 1 − fraction reveals the first `fraction` of the arc from
  // the left (min) end. The needle angle sweeps −90° (min) → +90° (max).
  const dashOffset = round3(1 - fraction);
  const angle = round2(180 * fraction - 90);

  const readingText = withUnit(clamped);
  const accessibleName = ariaLabel ?? (typeof label === "string" ? label : "Gauge");
  const zoneClause = currentZone ? `, ${currentZone.label}` : "";
  const valueText = ariaValueText ?? `${readingText}${zoneClause}`;

  const zonesSentence =
    resolved.length > 0
      ? ` Zones: ${resolved.map((zone) => `${zone.label} up to ${withUnit(zone.to)}`).join(", ")}.`
      : "";
  const summary =
    `${accessibleName}: ${readingText} on a scale of ${withUnit(safeMin)} to ${withUnit(safeMax)}` +
    `${currentZone ? `, currently in the ${currentZone.label} zone` : ""}.${zonesSentence}`;

  const arcStroke = currentZone ? ARC_TONE[currentZone.tone] : "[stroke:var(--mq-arc,#3f5bd9)]";
  const fullArc = arcSegment(TRACK_R, 0, 1);

  return (
    <div
      {...props}
      aria-label={accessibleName}
      aria-valuemax={safeMax}
      aria-valuemin={safeMin}
      aria-valuenow={clamped}
      aria-valuetext={valueText}
      className={cn(gaugeVariants({ variant, size }), className)}
      data-material={material}
      data-zone={currentZone?.tone}
      role="meter"
    >
      {/* Authoritative textual equivalent; everything visual below is aria-hidden. */}
      <span className={SR_ONLY}>{summary}</span>

      <svg
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
        focusable="false"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Zone bands: a thin outer ring segmented by tone. Meaning is carried by
            the legend text, so forced-colors may flatten the hues safely. */}
        {resolved.map((zone, index) =>
          zone.f1 > zone.f0 ? (
            <path
              className={ZONE_BAND[zone.tone]}
              d={arcSegment(ZONE_R, zone.f0, zone.f1)}
              fill="none"
              key={`zone-${index}`}
              strokeLinecap="butt"
              strokeWidth={ZONE_SW}
            />
          ) : null,
        )}

        {/* Track: the unfilled scale. Decorative, so forced-colors gives it a
            system stroke to keep the arc's bounds perceivable. */}
        <path
          className="[stroke:var(--mq-track,#e2e0da)] forced-colors:[stroke:CanvasText]"
          d={fullArc}
          fill="none"
          strokeLinecap="round"
          strokeWidth={TRACK_SW}
        />

        {/* Value arc: fills from the minimum to the value. The resting dash offset
            IS the final value; @starting-style begins empty and transitions in. */}
        <path
          className={cn(
            arcStroke,
            "forced-colors:[stroke:Highlight]",
            "[stroke-dashoffset:var(--mq-offset,0)]",
            animate &&
              "starting:[stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[700ms] ease-out motion-reduce:transition-none",
          )}
          d={fullArc}
          fill="none"
          pathLength={1}
          strokeDasharray="1"
          strokeLinecap="round"
          strokeWidth={TRACK_SW}
          style={{ "--mq-offset": dashOffset } as React.CSSProperties}
        />

        {/* Min / max scale ticks, so the range reads without perceiving colour. */}
        <text
          className="[fill:var(--mq-muted,#55554e)] forced-colors:[fill:CanvasText] tabular-nums"
          dominantBaseline="middle"
          fontSize={12}
          textAnchor="middle"
          x={CX - TRACK_R}
          y={CY + 20}
        >
          {withUnit(safeMin)}
        </text>
        <text
          className="[fill:var(--mq-muted,#55554e)] forced-colors:[fill:CanvasText] tabular-nums"
          dominantBaseline="middle"
          fontSize={12}
          textAnchor="middle"
          x={CX + TRACK_R}
          y={CY + 20}
        >
          {withUnit(safeMax)}
        </text>

        {/* The reading, as real numeric text — the value the arc encodes. */}
        <text
          className="[fill:var(--mq-text,#1c1c19)] forced-colors:[fill:CanvasText] font-bold tabular-nums"
          fontSize={32}
          textAnchor="middle"
          x={CX}
          y={CY + 42}
        >
          {readingText}
        </text>

        {/* Needle: points at the value. Resting `rotate` IS the final angle;
            @starting-style begins at the minimum angle and transitions in. The
            rotation origin is the hub, resolved in viewBox units. */}
        <g
          className={cn(
            "[rotate:var(--mq-angle,0deg)]",
            animate &&
              "starting:[rotate:var(--mq-angle-start,-90deg)] transition-[rotate] duration-[800ms] ease-out motion-reduce:transition-none",
          )}
          style={
            {
              transformBox: "view-box",
              transformOrigin: `${CX}px ${CY}px`,
              "--mq-angle": `${angle}deg`,
              "--mq-angle-start": "-90deg",
            } as React.CSSProperties
          }
        >
          <polygon
            className="[fill:var(--mq-needle,#1c1c19)] forced-colors:[fill:CanvasText]"
            points={`${CX},${CY - NEEDLE_LEN} ${CX - 4.5},${CY} ${CX},${CY + 12} ${CX + 4.5},${CY}`}
          />
        </g>
        <circle
          className="[fill:var(--mq-hub,#1c1c19)] forced-colors:[fill:CanvasText]"
          cx={CX}
          cy={CY}
          r={HUB_R}
        />
      </svg>

      {/* Visible label + current zone. aria-hidden: the meter role announces the
          name and value, so this is a sighted-reader duplicate. */}
      {(label != null || currentZone) && (
        <div aria-hidden="true" className="flex flex-col items-center gap-[4px] leading-tight">
          {label != null && (
            <span className="font-semibold text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
              {label}
            </span>
          )}
          {currentZone && (
            <span className="inline-flex items-center gap-[6px] font-bold text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]">
              <span
                className={cn(
                  "inline-block h-[9px] w-[9px] rounded-full border border-black/10 dark:border-white/20",
                  "forced-colors:border-[CanvasText]",
                  ZONE_SWATCH[currentZone.tone],
                )}
              />
              {currentZone.label}
            </span>
          )}
        </div>
      )}

      {/* Zone legend: each colour is paired with a text label and numeric range,
          so a zone's meaning survives without perceiving its hue. aria-hidden as
          the same breakdown is in the sr-only summary. */}
      {resolved.length > 0 && (
        <ul
          aria-hidden="true"
          className="m-0 flex flex-wrap items-center justify-center gap-x-[12px] gap-y-[4px] p-0 [list-style:none]"
        >
          {resolved.map((zone, index) => (
            <li className="inline-flex items-center gap-[6px]" key={`legend-${index}`}>
              <span
                className={cn(
                  "inline-block h-[10px] w-[10px] rounded-[3px] border border-black/10 dark:border-white/20",
                  "forced-colors:border-[CanvasText]",
                  ZONE_SWATCH[zone.tone],
                )}
              />
              <span className="text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
                {zone.label}{" "}
                <span className="tabular-nums opacity-80">
                  {withUnit(zone.from)}–{withUnit(zone.to)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { gaugeVariants };
