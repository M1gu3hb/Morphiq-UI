import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Progress
 *
 * A passive, server-friendly progressbar. Determinate progress moves a
 * full-width indicator with the individual CSS `translate` property;
 * indeterminate progress uses the local keyframes rendered with the component.
 * No site-level custom property or global class is required.
 *
 * Local theming knobs (all carry literal fallbacks at their use sites):
 *
 *   --mq-track        track surface
 *   --mq-fill         primary indicator surface
 *   --mq-fill-alt     alternate stripe surface
 *   --mq-label        visible label and value colour
 *   --mq-brd          track border
 *   --mq-track-shadow material track depth
 *   --mq-fill-shadow  material indicator depth
 *   --mq-height       track thickness
 */

const progressVariants = cva(
  [
    "grid w-full gap-[var(--mq-gap,7px)]",
    "text-[length:var(--mq-font-size,12px)] leading-none font-bold",
    "text-[color:var(--mq-label,#3a2b22)] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      material: {
        clay:
          "[--mq-track:#f4ded2] [--mq-fill:#9f2f23] [--mq-fill-alt:#c2543f] [--mq-label:#3a2b22] [--mq-brd:#b9947f] [--mq-track-shadow:inset_0_2px_3px_rgba(94,55,38,0.18),0_1px_0_rgba(255,255,255,0.82)] [--mq-fill-shadow:inset_0_1px_1px_rgba(255,255,255,0.42),inset_0_-2px_3px_rgba(78,20,17,0.24)] [--mq-track-grad:linear-gradient(180deg,rgba(94,55,38,0.14),rgba(255,255,255,0.30))] [--mq-gloss:rgba(255,255,255,0.42)]",
        glass:
          "[--mq-track:rgba(232,242,245,0.88)] [--mq-fill:#075d70] [--mq-fill-alt:#12798c] [--mq-label:#24313a] [--mq-brd:rgba(31,76,88,0.34)] [--mq-track-shadow:inset_0_1px_0_rgba(255,255,255,0.72),0_5px_16px_rgba(17,49,59,0.14)] [--mq-fill-shadow:inset_0_1px_0_rgba(255,255,255,0.34),0_2px_8px_rgba(7,54,66,0.26)] [--mq-track-grad:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))] [--mq-gloss:rgba(255,255,255,0.58)]",
        skeuo:
          "[--mq-track:#d6d0c4] [--mq-fill:#3f4641] [--mq-fill-alt:#667068] [--mq-label:#29261f] [--mq-brd:#8e8a80] [--mq-track-shadow:inset_0_2px_4px_rgba(40,37,31,0.28),0_1px_0_#ffffff] [--mq-fill-shadow:inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-2px_2px_rgba(0,0,0,0.28),0_1px_0_rgba(255,255,255,0.50)] [--mq-track-grad:linear-gradient(180deg,#c4c0b7,#dbd7ce)] [--mq-gloss:rgba(255,255,255,0.36)]",
        adaptive:
          "[--mq-track:#d8dad5] [--mq-fill:#171817] [--mq-fill-alt:#4a4d47] [--mq-label:#171817] [--mq-brd:#777a73] [--mq-track-shadow:inset_0_1px_2px_rgba(23,24,23,0.20)] [--mq-fill-shadow:none] [--mq-track-grad:none] [--mq-gloss:rgba(255,255,255,0.22)] dark:[--mq-track:#42443f] dark:[--mq-fill:#f5f3ee] dark:[--mq-fill-alt:#c7cbc2] dark:[--mq-label:#f5f3ee] dark:[--mq-brd:#b9bdb4]",
      },
      variant: {
        default: "",
        striped: "",
      },
      size: {
        sm: "[--mq-height:6px] [--mq-gap:5px] [--mq-font-size:11px]",
        md: "[--mq-height:10px] [--mq-gap:7px] [--mq-font-size:12px]",
        lg: "[--mq-height:14px] [--mq-gap:9px] [--mq-font-size:13px]",
      },
    },
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

const progressTrackVariants = cva(
  [
    "relative isolate h-[var(--mq-height,10px)] w-full overflow-hidden rounded-full border",
    "border-[var(--mq-brd,#b9947f)] bg-[var(--mq-track,#f4ded2)]",
    // The wash is an explicit property rather than a `bg-*` utility: a colour
    // and a gradient through the same utility land in one `tailwind-merge`
    // group where one silently drops the other.
    "[background-image:var(--mq-track-grad,none)]",
    "shadow-[var(--mq-track-shadow,inset_0_2px_3px_rgba(94,55,38,0.18))]",
    // Forced colours discard fills and shadows but NOT background images, so the
    // wash has to be cleared by hand or it would sit on a system-coloured
    // surface it was never designed against.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none",
    "forced-colors:[background-image:none]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: "",
        glass: "backdrop-blur-[12px] backdrop-saturate-[135%]",
        skeuo: "",
        adaptive: "",
      },
    },
    defaultVariants: { material: "clay" },
  },
);

/**
 * The travelling highlight on the filled run.
 *
 * A child rather than a background on the indicator itself, for two reasons:
 * the `striped` variant already owns `background-image`, and a child is clipped
 * by the indicator's own `overflow-hidden`, so the gloss stays inside the filled
 * portion however wide that happens to be.
 */
const glossVariants = cva(
  [
    "pointer-events-none absolute inset-0 rounded-[inherit]",
    "[background-image:linear-gradient(100deg,transparent_38%,var(--mq-gloss,rgba(255,255,255,0.42))_50%,transparent_62%)]",
    "[background-size:220%_100%] [background-repeat:no-repeat]",
    "animate-[mq-progress-gloss_2.2s_linear_infinite]",
    // Reduced motion stops the travel AND drops the band, rather than leaving a
    // bright stripe parked across the bar. The gloss is pure decoration — the
    // value is carried by aria-valuenow and by the fill's own width — so it is
    // cancelled outright rather than having its end state kept.
    "motion-reduce:animate-none motion-reduce:[background-image:none]",
    // Background images survive forced colours untouched, so without this the
    // gloss would paint a white band straight across the system palette.
    "forced-colors:[background-image:none]",
  ].join(" "),
);

const progressIndicatorVariants = cva(
  [
    "absolute inset-y-0 left-0 overflow-hidden rounded-[inherit] bg-[var(--mq-fill,#9f2f23)]",
    "shadow-[var(--mq-fill-shadow,inset_0_1px_1px_rgba(255,255,255,0.42))]",
    "forced-colors:!bg-[Highlight] forced-colors:bg-none forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        striped:
          "bg-[repeating-linear-gradient(135deg,var(--mq-fill,#9f2f23)_0_8px,var(--mq-fill-alt,#c2543f)_8px_16px)]",
      },
      mode: {
        determinate:
          "w-full transition-[translate] duration-500 ease-out motion-reduce:transition-none",
        indeterminate:
          "w-[42%] animate-[mq-progress-indeterminate_1.4s_ease-in-out_infinite] motion-reduce:animate-none",
      },
    },
    defaultVariants: {
      variant: "default",
      mode: "determinate",
    },
  },
);

const PROGRESS_KEYFRAMES = `
@keyframes mq-progress-gloss {
  from { background-position: 150% 0; }
  to { background-position: -50% 0; }
}
@keyframes mq-progress-indeterminate {
  0% { translate: -115% 0; }
  55% { translate: 90% 0; }
  100% { translate: 245% 0; }
}`;

export type ProgressProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "children" | "role"
> &
  VariantProps<typeof progressVariants> & {
    /** Current progress. `null` or `undefined` selects indeterminate mode. */
    value?: number | null;
    /** Upper bound for determinate values; invalid or non-positive values fall back to 100. */
    max?: number;
    /** Optional visible task label. A string also becomes the accessible name. */
    label?: React.ReactNode;
    /** Optional visible replacement for the percentage or indeterminate copy. */
    valueLabel?: React.ReactNode;
    /** Keep numeric state in ARIA while hiding the visible value when space is tight. */
    showValue?: boolean;
    trackClassName?: string;
    indicatorClassName?: string;
    labelClassName?: string;
  };

export function Progress({
  "aria-label": ariaLabel,
  "aria-valuetext": ariaValueText,
  className,
  indicatorClassName,
  label,
  labelClassName,
  material = "clay",
  max = 100,
  showValue = true,
  size = "md",
  trackClassName,
  value,
  valueLabel,
  variant = "default",
  ...props
}: ProgressProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const isIndeterminate = value === null || value === undefined;
  const safeValue = isIndeterminate
    ? null
    : Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), safeMax);
  const percentage = safeValue === null ? null : (safeValue / safeMax) * 100;
  const visibleValue =
    valueLabel ?? (percentage === null ? "In progress" : `${Math.round(percentage)}%`);
  const accessibleName = ariaLabel ?? (typeof label === "string" ? label : "Progress");

  return (
    <>
      {/*
        `href` + `precedence` so React 19 hoists this and deduplicates it: a bare
        <style> emits one identical copy per Progress rendered on the page.
      */}
      <style href="mq-progress" precedence="medium">
        {PROGRESS_KEYFRAMES}
      </style>
      <div
        {...props}
        aria-label={accessibleName}
        aria-valuemax={safeMax}
        aria-valuemin={0}
        aria-valuenow={safeValue ?? undefined}
        aria-valuetext={ariaValueText}
        className={cn(progressVariants({ material, size, variant }), className)}
        data-material={material}
        data-mode={isIndeterminate ? "indeterminate" : "determinate"}
        data-variant={variant}
        role="progressbar"
      >
        {(label !== undefined || showValue) && (
          <span
            aria-hidden="true"
            className={cn("flex items-center justify-between gap-3", labelClassName)}
            data-progress-label=""
          >
            <span>{label}</span>
            {showValue && <span className="shrink-0 tabular-nums">{visibleValue}</span>}
          </span>
        )}
        <span
          aria-hidden="true"
          className={cn(progressTrackVariants({ material }), trackClassName)}
          data-progress-track=""
        >
          <span
            className={cn(
              progressIndicatorVariants({
                mode: isIndeterminate ? "indeterminate" : "determinate",
                variant,
              }),
              indicatorClassName,
            )}
            data-progress-indicator=""
            style={
              percentage === null
                ? undefined
                : { translate: `${percentage - 100}% 0` }
            }
          >
            {/*
              Decorative: the value is already carried by `aria-valuenow` and by
              the fill's own width, so the gloss says nothing and is hidden.
            */}
            <span aria-hidden="true" className={glossVariants()} />
          </span>
        </span>
      </div>
    </>
  );
}

export type ProgressVariantProps = VariantProps<typeof progressVariants>;

export { progressIndicatorVariants, progressTrackVariants, progressVariants };
