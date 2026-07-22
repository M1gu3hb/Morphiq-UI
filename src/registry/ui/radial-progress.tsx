"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Radial Progress
 *
 * A circular gauge: a full track ring, a foreground value arc, the value as
 * real centred text, and a label. It has a surface of its own, so it ships the
 * four material recipes — clay, glass, skeuo and adaptive — whose token VALUES
 * and depth mirror the Card, keeping one tactile family across the library.
 *
 * Self-contained by design: every recipe lives in this file, no `:root`
 * property and no global class are read, so copying this file plus
 * `src/lib/cn.ts` reproduces the full look. Every custom-property reference
 * carries a literal fallback.
 *
 * Local theming knobs (each used with a fallback at its use site):
 *
 *   --mq-body     surface color
 *   --mq-lit      top highlight (skeuo gradient)
 *   --mq-edge     extruded bottom edge
 *   --mq-text     primary text — the % value
 *   --mq-muted    label / secondary text
 *   --mq-brd      border color
 *   --mq-track    track ring stroke
 *   --mq-arc      value arc stroke
 *   --mq-pad / --mq-gap / --mq-radius   surface density (set by size)
 *   --mq-ring-size / --mq-pct / --mq-lbl  gauge diameter and type (set by size)
 *   --mq-circ     arc circumference (empty-state offset, set inline)
 *   --mq-offset   arc target dash offset (final value, set inline)
 *
 * Accessibility contract: the gauge is a native `role="progressbar"` carrying
 * aria-valuenow/min/max, aria-valuetext and aria-label — that, plus an sr-only
 * summary, is the authoritative source. The decorative SVG is aria-hidden and
 * so are the visible number and label, so nothing is announced twice. Colour is
 * never the sole carrier: the percentage is real text. Contrast holds — the
 * value text measures at or above 4.5:1 on every material and the arc at or
 * above 3:1 against its surface.
 *
 * Draw-on-mount without JS: the arc's resting stroke-dashoffset IS the final
 * value (so SSR, no-JS and reduced-motion all render the correct full arc), and
 * the entrance is expressed with the `starting:` variant (@starting-style) that
 * begins from the empty circumference and transitions to the target. Reduced
 * motion drops the transition and lands straight on the final value. There is
 * no setState-driven count-up and no getTotalLength — the dash math is done from
 * the value prop at render, which is deterministic and server-safe.
 */

/** Inline visually-hidden utility — kept local so the file has no global-class dependency. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

const round3 = (value: number) => Math.round(value * 1000) / 1000;

/**
 * Ring geometry in the SVG's own 0–100 user space, so it is identical at every
 * rendered pixel size. RADIUS 42 leaves room for the 9-unit stroke and its
 * round cap inside the 100×100 box. CIRCUMFERENCE (2·π·42 ≈ 263.894) is the
 * length the value arc's dasharray/offset are expressed in.
 */
const CENTER = 50;
const RADIUS = 42;
const STROKE = 9;
const CIRCUMFERENCE = round3(2 * Math.PI * RADIUS);

const radialVariants = cva(
  [
    "relative isolate inline-flex flex-col items-center justify-center text-center",
    "border",
    "gap-[var(--mq-gap,10px)] p-[var(--mq-pad,20px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    // Shadows and translucency are erased in forced-colors mode, so a
    // system-colored border keeps the gauge's bounds and text stays legible.
    "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346]",
          "[--mq-brd:rgba(120,80,55,0.16)] [--mq-track:#ecd6c6] [--mq-arc:#9f2f23]",
          "bg-[var(--mq-body,#f6e7dd)] border-[var(--mq-brd,rgba(120,80,55,0.16))]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f]",
          "[--mq-brd:rgba(255,255,255,0.75)] [--mq-track:rgba(30,30,27,0.18)] [--mq-arc:#075d70]",
          "bg-[var(--mq-body,rgba(255,255,255,0.66))] border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)]",
          // Backdrop filter is not auto-cleared in forced colors — drop it by hand.
          "forced-colors:[backdrop-filter:none]",
        ].join(" "),
        skeuo: [
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943]",
          "[--mq-brd:rgba(25,25,23,0.28)] [--mq-track:#bdb8ac] [--mq-arc:#3f4641]",
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)]",
          // Background images survive forced colors, so the gradient is cleared
          // by hand; the border keeps the bounds once it is gone.
          "forced-colors:[background-image:none]",
        ].join(" "),
        // Polymorphic: almost no ornament, palette follows the color scheme.
        // Safe because the surface is opaque and flips together with its text.
        adaptive: [
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
          "[--mq-brd:rgba(23,24,23,0.14)] [--mq-track:#e2e0da] [--mq-arc:#171817]",
          "bg-[var(--mq-body,#ffffff)] border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)]",
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
          "dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-track:#3a3a40] dark:[--mq-arc:#f1efe9]",
          "dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_22px_44px_rgba(0,0,0,0.55)]",
        ].join(" "),
      },
      // Single style: the component's one visual axis is its material. `default`
      // exists so the registry has a variant option and the preview a literal.
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-pad:16px] [--mq-gap:8px] [--mq-radius:18px] [--mq-ring-size:96px] [--mq-pct:20px] [--mq-lbl:11px]",
        md: "[--mq-pad:20px] [--mq-gap:10px] [--mq-radius:24px] [--mq-ring-size:128px] [--mq-pct:26px] [--mq-lbl:12px]",
        lg: "[--mq-pad:26px] [--mq-gap:12px] [--mq-radius:30px] [--mq-ring-size:168px] [--mq-pct:34px] [--mq-lbl:13px]",
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

export type RadialProgressProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "children" | "role"
> &
  VariantProps<typeof radialVariants> & {
    /** Progress as a percentage-of-`max`. Clamped to `[0, max]`. */
    value: number;
    /** Upper bound for `value`; invalid or non-positive values fall back to 100. */
    max?: number;
    /** Optional label rendered under the ring. A string also names the gauge. */
    label?: React.ReactNode;
    /** Optional replacement for the centred percentage text. */
    valueLabel?: React.ReactNode;
  };

/**
 * A passive, server-friendly circular gauge. Uncontrolled: it holds no state of
 * its own, so there is nothing to get out of sync — pass a new `value` and the
 * arc transitions to it.
 */
export function RadialProgress({
  "aria-label": ariaLabel,
  "aria-valuetext": ariaValueText,
  className,
  label,
  material = "clay",
  max = 100,
  size = "md",
  value,
  valueLabel,
  variant = "default",
  ...props
}: RadialProgressProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const rawValue = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(Math.max(rawValue, 0), safeMax);
  const fraction = clamped / safeMax;
  const percent = Math.round(fraction * 100);
  // stroke-dashoffset = circumference · (1 − value/100): the resting/base value,
  // i.e. the final arc. @starting-style begins from the full circumference.
  const offset = round3(CIRCUMFERENCE * (1 - fraction));

  const accessibleName = ariaLabel ?? (typeof label === "string" ? label : "Progress");
  const valueText = ariaValueText ?? `${percent}%`;
  const centerText = valueLabel ?? `${percent}%`;
  const summaryLabel = typeof label === "string" ? label : accessibleName;

  return (
    <div
      {...props}
      aria-label={accessibleName}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={percent}
      aria-valuetext={valueText}
      className={cn(radialVariants({ material, size, variant }), className)}
      data-material={material}
      role="progressbar"
    >
      {/*
        The authoritative textual equivalent. The progressbar role announces its
        name + value from the aria-* attributes, so this sr-only sentence is a
        redundant, greppable equivalent that range-widget traversal does not
        double-announce. Everything visual below is aria-hidden.
      */}
      <span className={SR_ONLY}>{`${summaryLabel}: ${percent} percent`}</span>

      <div className="relative grid h-[var(--mq-ring-size,128px)] w-[var(--mq-ring-size,128px)] place-items-center">
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          focusable="false"
          viewBox="0 0 100 100"
        >
          {/* Track ring — decorative, so its stroke carries no meaning; forced
              colors gives it a system stroke to keep the ring perceivable. */}
          <circle
            className="[stroke:var(--mq-track,#ecd6c6)] forced-colors:[stroke:CanvasText]"
            cx={CENTER}
            cy={CENTER}
            fill="none"
            r={RADIUS}
            strokeWidth={STROKE}
          />
          {/* Value arc. Rotated −90° so it starts at 12 o'clock and sweeps
              clockwise (a static SVG attribute, untouched by the transition). */}
          <circle
            className={cn(
              "[stroke:var(--mq-arc,#9f2f23)] forced-colors:[stroke:Highlight]",
              "[stroke-dashoffset:var(--mq-offset,0)] starting:[stroke-dashoffset:var(--mq-circ,263.894)]",
              "transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none",
            )}
            cx={CENTER}
            cy={CENTER}
            fill="none"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeLinecap="round"
            strokeWidth={STROKE}
            style={{ "--mq-circ": CIRCUMFERENCE, "--mq-offset": offset } as React.CSSProperties}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          />
        </svg>
        <span
          aria-hidden="true"
          className="font-extrabold tabular-nums tracking-[-0.02em] text-[color:var(--mq-text,#33261e)] text-[length:var(--mq-pct,26px)] leading-none"
        >
          {centerText}
        </span>
      </div>

      {label != null && (
        <span
          aria-hidden="true"
          className="font-semibold text-[color:var(--mq-muted,#6a5346)] text-[length:var(--mq-lbl,12px)] leading-[1.3]"
        >
          {label}
        </span>
      )}
    </div>
  );
}

export { radialVariants };
