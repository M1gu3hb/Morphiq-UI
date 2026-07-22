"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Stat Card
 *
 * A KPI tile: a muted label, one large tabular value, a signed delta (arrow +
 * sign + percentage) and an optional inline sparkline. It has its OWN surface,
 * so it ships all four material recipes, copied token-for-token from the Card so
 * a stat placed next to a card reads as the same material.
 *
 * Self-contained by design: every recipe lives in this file. It reads no `:root`
 * custom property and depends on no class from a global stylesheet, so copying
 * this file plus `src/lib/cn.ts` reproduces the full look. Theming knobs are
 * local CSS variables, each referenced with a literal fallback:
 *
 *   --mq-body    surface color
 *   --mq-lit     top highlight (the skeuo gradient's light stop)
 *   --mq-edge    extruded bottom edge color
 *   --mq-text    the value's foreground
 *   --mq-muted   the label's foreground (and the flat-delta color)
 *   --mq-brd     border color
 *   --mq-rule    hairline color (reserved for dividers)
 *   --mq-pos     positive-delta color
 *   --mq-neg     negative-delta color
 *   --mq-spark   sparkline stroke color
 *   --mq-pad / --mq-gap / --mq-radius   density (set by size)
 *   --mq-value / --mq-label / --mq-delta  type scale (set by size)
 *
 * Data-accessibility contract:
 *   - The value, label and delta are real text. `--mq-text` and `--mq-muted`
 *     stay at or above 4.5:1 against every material surface (glass over a white
 *     AND a black backdrop alike, since glass must not borrow legibility from
 *     whatever sits behind it).
 *   - The delta never leans on color alone: an arrow ICON plus a signed
 *     percentage carry the direction, and an sr-only phrase ("up 12.5% vs last
 *     month") is what assistive tech announces.
 *   - `--mq-pos` / `--mq-neg` are each tuned to 4.5:1 against their surface, so
 *     the colored delta text still meets body-text contrast.
 *   - The sparkline is decoration layered over data the numbers already carry;
 *     it is `aria-hidden`, and an sr-only summary states its span and trend.
 *   - The value renders statically — no count-up — so SSR, no-JS and
 *     reduced-motion all show the final number with nothing to animate.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

/**
 * Palette per material, as local custom properties only — no layout, no
 * decoration. Copied from the Card's material recipes so a stat and a card sit
 * on the same surface, extended with the semantic delta and sparkline colors.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346]",
    "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)]",
    "[--mq-pos:#15703f] [--mq-neg:#9c2f22] [--mq-spark:#a5674a]",
  ].join(" "),
  glass: [
    // `--mq-muted` #36362f (not a lighter grey) so it holds 5.14:1 over glass
    // composited on black and 12.17:1 over white; the delta colors are dark for
    // the same reason — they must survive the darkest composite (~#a8a8a8).
    "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f]",
    "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)]",
    "[--mq-pos:#0a4023] [--mq-neg:#6e1a12] [--mq-spark:#2f2f4a]",
  ].join(" "),
  skeuo: [
    "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943]",
    "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)]",
    "[--mq-pos:#0f5c34] [--mq-neg:#9c2f22] [--mq-spark:#5c584f]",
  ].join(" "),
  adaptive: [
    "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)]",
    "[--mq-pos:#15703f] [--mq-neg:#9c2f22] [--mq-spark:#6b6a63]",
    "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-pos:#5ad18b] dark:[--mq-neg:#ff9d8e] dark:[--mq-spark:#9a9992]",
  ].join(" "),
} as const;

/** Tactile depth per material — a single resting shadow list; the stat card is a
 *  display surface, so it never lifts or presses and needs no hover/press set. */
const DEPTH = {
  clay: "bg-[var(--mq-body,#f6e7dd)] shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)]",
  glass:
    "bg-[var(--mq-body,rgba(255,255,255,0.66))] backdrop-blur-[18px] backdrop-saturate-[170%] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)]",
  skeuo:
    "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)]",
  adaptive:
    "bg-[var(--mq-body,#ffffff)] shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_22px_44px_rgba(0,0,0,0.55)]",
} as const;

const statCardVariants = cva(
  [
    "relative isolate flex flex-col text-left",
    "border border-[var(--mq-brd,rgba(120,80,55,0.16))]",
    "gap-[var(--mq-gap,10px)] p-[var(--mq-pad,22px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    // Shadows, translucency and the skeuo gradient are all discarded in
    // forced-colors mode, so the tile would dissolve into the page. A
    // system-colored border keeps its bounds; text falls to CanvasText.
    "forced-colors:border-[CanvasText] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: `${MATERIAL_TOKENS.clay} ${DEPTH.clay}`,
        glass: `${MATERIAL_TOKENS.glass} ${DEPTH.glass}`,
        skeuo: `${MATERIAL_TOKENS.skeuo} ${DEPTH.skeuo}`,
        adaptive: `${MATERIAL_TOKENS.adaptive} ${DEPTH.adaptive}`,
      },
      // Single variant: a stat card has one composition. The axis exists so the
      // registry can list it and the preview can coerce an incoming value.
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-pad:16px] [--mq-gap:8px] [--mq-radius:18px] [--mq-value:26px] [--mq-label:11px] [--mq-delta:12px]",
        md: "[--mq-pad:22px] [--mq-gap:10px] [--mq-radius:24px] [--mq-value:34px] [--mq-label:12px] [--mq-delta:13px]",
        lg: "[--mq-pad:28px] [--mq-gap:12px] [--mq-radius:30px] [--mq-value:44px] [--mq-label:13px] [--mq-delta:15px]",
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

type StatMaterial = keyof typeof MATERIAL_TOKENS;
type Direction = "up" | "down" | "flat";

const DELTA_ICON: Record<Direction, typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  flat: Minus,
};

const DELTA_COLOR: Record<Direction, string> = {
  up: "[color:var(--mq-pos,#15703f)]",
  down: "[color:var(--mq-neg,#9c2f22)]",
  flat: "[color:var(--mq-muted,#5c5b55)]",
};

const DELTA_WORD: Record<Direction, string> = {
  up: "up",
  down: "down",
  flat: "no change",
};

function directionOf(delta: number): Direction {
  if (delta > 0) return "up";
  if (delta < 0) return "down";
  return "flat";
}

/** Signed, printable magnitude. `−` is the true minus glyph (U+2212). */
function formatDelta(delta: number, unit: string): string {
  const magnitude = `${Math.abs(delta)}${unit}`;
  if (delta > 0) return `+${magnitude}`;
  if (delta < 0) return `−${magnitude}`;
  return magnitude;
}

/**
 * The delta chip: arrow + signed percentage. The arrow direction and the sign
 * carry the meaning, so color is reinforcement, never the sole cue. The visible
 * pieces are `aria-hidden` and an sr-only phrase is announced instead, so a
 * screen reader hears "up 12.5% vs last month" rather than each glyph in turn.
 */
function Delta({
  delta,
  unit,
  caption,
}: {
  delta: number;
  unit: string;
  caption?: string;
}) {
  const direction = directionOf(delta);
  const Icon = DELTA_ICON[direction];
  const magnitude = direction === "flat" ? "" : `${Math.abs(delta)}${unit}`;
  const srLabel = [DELTA_WORD[direction], magnitude, caption].filter(Boolean).join(" ");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-[4px] font-bold leading-none",
        "text-[length:var(--mq-delta,13px)] tabular-nums",
        DELTA_COLOR[direction],
        "forced-colors:text-[CanvasText]",
      )}
    >
      <Icon
        aria-hidden="true"
        focusable="false"
        strokeWidth={2.75}
        className="size-[1.05em] shrink-0 forced-colors:[stroke:CanvasText]"
      />
      <span aria-hidden="true">{formatDelta(delta, unit)}</span>
      <span className={SR_ONLY}>{srLabel}</span>
    </span>
  );
}

/**
 * Inline trend sparkline. Purely decorative — the value and delta already carry
 * the data — so the SVG is `aria-hidden` and an sr-only summary is authoritative.
 *
 * The line's resting state is the FULLY DRAWN path (`stroke-dashoffset:0`), so
 * SSR, no-JS and reduced-motion all show the complete trend. The entrance is a
 * one-shot draw expressed with `@starting-style` (the `starting:` variant) from
 * offset 1 → 0; `pathLength={1}` normalizes the length so no JS measurement is
 * needed, and `motion-reduce:transition-none` lands straight on the final line.
 */
function Sparkline({ points, label }: { points: number[]; label?: string }) {
  const width = 76;
  const height = 28;
  const pad = 3;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = points.length > 1 ? (width - pad * 2) / (points.length - 1) : 0;

  const d = points
    .map((value, index) => {
      const x = pad + step * index;
      const y = height - pad - ((value - min) / range) * (height - pad * 2);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const first = points[0];
  const last = points[points.length - 1];
  const trend = last > first ? "trending up" : last < first ? "trending down" : "flat";
  const summary = label ?? `Trend line, ${points.length} points from ${first} to ${last}, ${trend}.`;

  return (
    <>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${width} ${height}`}
        className="h-[28px] w-[76px] shrink-0 overflow-visible"
      >
        <path
          d={d}
          fill="none"
          pathLength={1}
          strokeWidth={2}
          className={cn(
            "[stroke:var(--mq-spark,#a5674a)] [stroke-linecap:round] [stroke-linejoin:round]",
            "[stroke-dasharray:1] [stroke-dashoffset:0] starting:[stroke-dashoffset:1]",
            "transition-[stroke-dashoffset] duration-[900ms] ease-out motion-reduce:transition-none",
            "forced-colors:[stroke:CanvasText]",
          )}
        />
      </svg>
      <span className={SR_ONLY}>{summary}</span>
    </>
  );
}

export type StatCardProps = React.ComponentPropsWithRef<"div"> &
  VariantProps<typeof statCardVariants> & {
    /** Short, muted caption above the value, e.g. "Monthly revenue". */
    label: React.ReactNode;
    /** The headline figure. Pre-formatted by the caller, e.g. "$48.2k". */
    value: React.ReactNode;
    /** Signed change: the sign picks the arrow, `Math.abs` is displayed. */
    delta?: number;
    /** Unit appended to the delta magnitude. Defaults to "%". */
    deltaUnit?: string;
    /** Extra context folded into the delta's sr-only label, e.g. "vs last month". */
    deltaCaption?: string;
    /** Optional decorative trend line. The numbers remain the source of truth. */
    sparkline?: number[];
    /** Overrides the auto-generated sr-only sparkline summary. */
    sparklineLabel?: string;
  };

/**
 * The KPI tile. Uncontrolled and stateless: every figure is a prop, so there is
 * nothing to hydrate and no time-dependent or random value in render.
 */
export function StatCard({
  className,
  delta,
  deltaCaption,
  deltaUnit = "%",
  label,
  material,
  size,
  sparkline,
  sparklineLabel,
  value,
  variant,
  ...props
}: StatCardProps) {
  const resolvedMaterial: StatMaterial = material ?? "clay";
  const hasDelta = typeof delta === "number";
  const hasSparkline = Array.isArray(sparkline) && sparkline.length > 1;

  return (
    <div
      {...props}
      className={cn(statCardVariants({ material, variant, size }), className)}
      data-material={resolvedMaterial}
    >
      <p
        className={cn(
          "m-0 font-bold uppercase tracking-[0.08em] leading-[1.2]",
          "text-[color:var(--mq-muted,#5c5b55)] text-[length:var(--mq-label,12px)]",
          "forced-colors:text-[CanvasText]",
        )}
      >
        {label}
      </p>

      <p
        className={cn(
          "m-0 font-extrabold tracking-[-0.02em] leading-[1.05] tabular-nums",
          "text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-value,34px)]",
          "forced-colors:text-[CanvasText]",
        )}
      >
        {value}
      </p>

      {(hasDelta || hasSparkline) && (
        <div className="flex items-center justify-between gap-[12px]">
          {/* Inline the guards so TypeScript narrows `delta`/`sparkline` at the
              call site — an aliased boolean would not. */}
          {typeof delta === "number" ? (
            <Delta delta={delta} unit={deltaUnit} caption={deltaCaption} />
          ) : (
            <span aria-hidden="true" />
          )}
          {Array.isArray(sparkline) && sparkline.length > 1 ? (
            <Sparkline points={sparkline} label={sparklineLabel} />
          ) : null}
        </div>
      )}
    </div>
  );
}

export { statCardVariants };
