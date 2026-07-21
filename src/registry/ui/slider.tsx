"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Slider
 *
 * Radix owns all interaction: pointer capture, value ordering, keyboard
 * commands, form integration and the slider ARIA contract. Morphiq maps onto
 * Root, Track, Range and Thumb and only adds four self-contained material
 * recipes plus the variant/size axes.
 *
 * Local theming knobs (every use includes a literal fallback):
 *
 *   --mq-track        track surface
 *   --mq-range        selected range surface
 *   --mq-thumb        thumb surface
 *   --mq-thumb-hover  hovered thumb surface
 *   --mq-brd          track border
 *   --mq-thumb-brd    thumb border
 *   --mq-ring         keyboard focus ring
 *   --mq-tick         decorative tick mark
 *   --mq-track-size   track thickness
 *   --mq-thumb-size   thumb diameter
 */

const sliderVariants = cva(
  [
    "group/slider relative flex touch-none select-none items-center",
    "data-[orientation=horizontal]:h-[var(--mq-thumb-size,20px)] data-[orientation=horizontal]:w-full",
    "data-[orientation=vertical]:h-[180px] data-[orientation=vertical]:w-[var(--mq-thumb-size,20px)] data-[orientation=vertical]:flex-col",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    "forced-colors:[--mq-track:Canvas] forced-colors:[--mq-range:Highlight]",
    "forced-colors:[--mq-thumb:ButtonFace] forced-colors:[--mq-thumb-hover:ButtonFace]",
    "forced-colors:[--mq-brd:CanvasText] forced-colors:[--mq-thumb-brd:Highlight]",
    "forced-colors:[--mq-ring:Highlight] forced-colors:[--mq-tick:CanvasText]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-track:#f4ded2] [--mq-range:#9f2f23] [--mq-thumb:#fff4eb] [--mq-thumb-hover:#ffe3d3]",
          "[--mq-brd:#b9947f] [--mq-thumb-brd:#7c281f] [--mq-ring:#171817] [--mq-tick:rgba(58,43,34,0.46)]",
          "[--mq-track-shadow:inset_0_2px_3px_rgba(94,55,38,0.18),0_1px_0_rgba(255,255,255,0.82)]",
          "[--mq-range-shadow:inset_0_1px_1px_rgba(255,255,255,0.40),inset_0_-2px_3px_rgba(78,20,17,0.24)]",
          "[--mq-thumb-shadow:inset_0_2px_2px_rgba(255,255,255,0.86),inset_0_-2px_3px_rgba(92,43,28,0.18),0_3px_0_#b7654e,0_7px_14px_rgba(72,38,29,0.24)]",
          "[--mq-thumb-shadow-hover:inset_0_2px_2px_rgba(255,255,255,0.90),inset_0_-2px_3px_rgba(92,43,28,0.18),0_4px_0_#b7654e,0_9px_18px_rgba(72,38,29,0.28)]",
          "[--mq-value-bg:#3a2b22] [--mq-value-text:#ffffff] [--mq-value-brd:#3a2b22]",
        ].join(" "),
        glass: [
          "[--mq-track:rgba(232,242,245,0.88)] [--mq-range:#075d70] [--mq-thumb:#f7fbfc] [--mq-thumb-hover:#e4f5f8]",
          "[--mq-brd:rgba(31,76,88,0.34)] [--mq-thumb-brd:#064c5c] [--mq-ring:#073f4d] [--mq-tick:rgba(7,78,93,0.52)]",
          "[--mq-track-shadow:inset_0_1px_0_rgba(255,255,255,0.74),0_5px_16px_rgba(17,49,59,0.14)]",
          "[--mq-range-shadow:inset_0_1px_0_rgba(255,255,255,0.34),0_2px_8px_rgba(7,54,66,0.26)]",
          "[--mq-thumb-shadow:inset_0_1px_0_rgba(255,255,255,0.92),0_3px_10px_rgba(7,54,66,0.32)]",
          "[--mq-thumb-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.96),0_5px_14px_rgba(7,54,66,0.38)]",
          "[--mq-value-bg:#24313a] [--mq-value-text:#ffffff] [--mq-value-brd:#24313a]",
        ].join(" "),
        skeuo: [
          "[--mq-track:#d6d0c4] [--mq-range:#3f4641] [--mq-thumb:#f3f0e8] [--mq-thumb-hover:#ffffff]",
          "[--mq-brd:#8e8a80] [--mq-thumb-brd:#3f4641] [--mq-ring:#171817] [--mq-tick:rgba(41,38,31,0.50)]",
          "[--mq-track-shadow:inset_0_2px_4px_rgba(40,37,31,0.28),0_1px_0_#ffffff]",
          "[--mq-range-shadow:inset_0_1px_0_rgba(255,255,255,0.30),inset_0_-2px_2px_rgba(0,0,0,0.28)]",
          "[--mq-thumb-shadow:inset_0_2px_2px_rgba(255,255,255,0.96),inset_0_-3px_4px_rgba(0,0,0,0.18),0_3px_0_#918c82,0_7px_13px_rgba(35,33,29,0.28)]",
          "[--mq-thumb-shadow-hover:inset_0_2px_2px_rgba(255,255,255,1),inset_0_-3px_4px_rgba(0,0,0,0.18),0_4px_0_#918c82,0_9px_17px_rgba(35,33,29,0.32)]",
          "[--mq-value-bg:#29261f] [--mq-value-text:#ffffff] [--mq-value-brd:#29261f]",
        ].join(" "),
        adaptive: [
          "[--mq-track:#d8dad5] [--mq-range:#171817] [--mq-thumb:#ffffff] [--mq-thumb-hover:#f0f0ec]",
          "[--mq-brd:#777a73] [--mq-thumb-brd:#171817] [--mq-ring:#171817] [--mq-tick:rgba(23,24,23,0.50)]",
          "[--mq-track-shadow:inset_0_1px_2px_rgba(23,24,23,0.20)] [--mq-range-shadow:none]",
          "[--mq-thumb-shadow:0_2px_8px_rgba(23,24,23,0.24)] [--mq-thumb-shadow-hover:0_4px_12px_rgba(23,24,23,0.30)]",
          "[--mq-value-bg:#171817] [--mq-value-text:#ffffff] [--mq-value-brd:#171817]",
          "dark:[--mq-track:#42443f] dark:[--mq-range:#f5f3ee] dark:[--mq-thumb:#171817] dark:[--mq-thumb-hover:#2b2d29]",
          "dark:[--mq-brd:#b9bdb4] dark:[--mq-thumb-brd:#f5f3ee] dark:[--mq-ring:#f5f3ee] dark:[--mq-tick:rgba(245,243,238,0.58)]",
          "dark:[--mq-value-bg:#f5f3ee] dark:[--mq-value-text:#171817] dark:[--mq-value-brd:#f5f3ee]",
        ].join(" "),
      },
      variant: {
        default: "",
        ticks: "",
      },
      size: {
        sm: "[--mq-track-size:5px] [--mq-thumb-size:16px] [--mq-value-size:10px]",
        md: "[--mq-track-size:8px] [--mq-thumb-size:20px] [--mq-value-size:11px]",
        lg: "[--mq-track-size:12px] [--mq-thumb-size:26px] [--mq-value-size:12px]",
      },
    },
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

const trackVariants = cva(
  [
    "relative isolate grow overflow-hidden rounded-full border",
    "border-[var(--mq-brd,#b9947f)] bg-[var(--mq-track,#f4ded2)]",
    "shadow-[var(--mq-track-shadow,inset_0_2px_3px_rgba(94,55,38,0.18))]",
    "data-[orientation=horizontal]:h-[var(--mq-track-size,8px)] data-[orientation=horizontal]:w-full",
    "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[var(--mq-track-size,8px)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none",
  ].join(" "),
);

const rangeVariants = cva(
  [
    "absolute rounded-[inherit] bg-[var(--mq-range,#9f2f23)]",
    "shadow-[var(--mq-range-shadow,inset_0_1px_1px_rgba(255,255,255,0.40))]",
    // Radix updates horizontal ranges through left/right and vertical ranges
    // through top/bottom. Name those live inset properties exactly so the fill
    // eases without adding a phantom transform transition.
    "transition-[left,right,top,bottom] duration-200 ease-out motion-reduce:transition-none",
    "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
    "forced-colors:bg-[Highlight] forced-colors:shadow-none",
  ].join(" "),
);

const thumbVariants = cva(
  [
    "relative block size-[var(--mq-thumb-size,20px)] shrink-0 rounded-full border-2",
    "cursor-grab touch-none border-[var(--mq-thumb-brd,#7c281f)] bg-[var(--mq-thumb,#fff4eb)]",
    "shadow-[var(--mq-thumb-shadow,0_3px_10px_rgba(72,38,29,0.24))]",
    "transition-[box-shadow,background-color,scale] duration-150 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-thumb-hover,#ffe3d3)] hover:shadow-[var(--mq-thumb-shadow-hover,0_5px_14px_rgba(72,38,29,0.28))]",
    "active:cursor-grabbing active:scale-[1.08]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "group-data-[focus=true]/slider:outline-2 group-data-[focus=true]/slider:outline-offset-[3px] group-data-[focus=true]/slider:outline-[var(--mq-ring,#171817)]",
    "data-[disabled]:cursor-not-allowed data-[disabled]:shadow-none",
    "forced-colors:border-[Highlight] forced-colors:bg-[ButtonFace] forced-colors:shadow-none",
    "forced-colors:focus-visible:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      showValue: {
        false: "",
        true: [
          "after:pointer-events-none after:absolute after:bottom-[calc(100%+8px)] after:left-1/2 after:-translate-x-1/2",
          "after:min-w-[26px] after:rounded-[7px] after:border after:px-[6px] after:py-[4px] after:text-center",
          "after:text-[length:var(--mq-value-size,11px)] after:leading-none after:font-bold after:tabular-nums",
          "after:content-[attr(aria-valuenow)] after:border-[var(--mq-value-brd,#3a2b22)]",
          "after:bg-[var(--mq-value-bg,#3a2b22)] after:text-[color:var(--mq-value-text,#ffffff)]",
          "forced-colors:after:border-[CanvasText] forced-colors:after:bg-[Canvas] forced-colors:after:text-[CanvasText]",
        ].join(" "),
      },
    },
    defaultVariants: { showValue: false },
  },
);

type TickStyle = React.CSSProperties & { "--mq-tick-step": string };

export type SliderTrackProps = React.ComponentPropsWithRef<
  typeof SliderPrimitive.Track
> & {
  orientation?: "horizontal" | "vertical";
  showTicks?: boolean;
  tickStepPercent?: number;
};

export function SliderTrack({
  children,
  className,
  orientation = "horizontal",
  showTicks = false,
  tickStepPercent = 10,
  ...props
}: SliderTrackProps) {
  const safeTickStep = Math.min(Math.max(tickStepPercent, 0.5), 100);
  const tickStyle: TickStyle = {
    "--mq-tick-step": `${safeTickStep}%`,
    backgroundImage: `repeating-linear-gradient(${orientation === "vertical" ? "to top" : "to right"}, transparent 0 calc(var(--mq-tick-step, 10%) - 1px), var(--mq-tick, rgba(58,43,34,0.46)) calc(var(--mq-tick-step, 10%) - 1px) var(--mq-tick-step, 10%))`,
  };

  return (
    <SliderPrimitive.Track
      {...props}
      className={cn(trackVariants(), className)}
      data-slider-track=""
    >
      {showTicks && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          data-slider-ticks=""
          style={tickStyle}
        />
      )}
      {children}
    </SliderPrimitive.Track>
  );
}

export function SliderRange({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof SliderPrimitive.Range>) {
  return (
    <SliderPrimitive.Range
      {...props}
      className={cn("z-10", rangeVariants(), className)}
      data-slider-range=""
    />
  );
}

export type SliderThumbProps = React.ComponentPropsWithRef<
  typeof SliderPrimitive.Thumb
> & {
  showValue?: boolean;
};

export function SliderThumb({
  className,
  showValue = false,
  ...props
}: SliderThumbProps) {
  return (
    <SliderPrimitive.Thumb
      {...props}
      className={cn("z-20", thumbVariants({ showValue }), className)}
      data-slider-thumb=""
    />
  );
}

function defaultThumbLabel(index: number, count: number) {
  if (count === 1) return "Value";
  if (index === 0) return "Minimum value";
  if (index === count - 1) return "Maximum value";
  return `Value ${index + 1}`;
}

export type SliderProps = Omit<
  React.ComponentPropsWithRef<typeof SliderPrimitive.Root>,
  "children"
> &
  VariantProps<typeof sliderVariants> & {
    showValue?: boolean;
    thumbLabels?: readonly string[];
    trackClassName?: string;
    rangeClassName?: string;
    thumbClassName?: string;
  };

export function Slider({
  className,
  defaultValue,
  disabled = false,
  material = "clay",
  max = 100,
  min = 0,
  orientation = "horizontal",
  rangeClassName,
  showValue = false,
  size = "md",
  step = 1,
  thumbClassName,
  thumbLabels,
  trackClassName,
  value,
  variant = "default",
  ...props
}: SliderProps) {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 100;
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const suppliedValues = value ?? defaultValue;
  const thumbCount = Math.max(suppliedValues?.length ?? 1, 1);
  const tickStepPercent = (safeStep / (safeMax - safeMin)) * 100;

  return (
    <SliderPrimitive.Root
      {...props}
      className={cn(sliderVariants({ material, size, variant }), className)}
      data-material={material}
      data-variant={variant}
      defaultValue={defaultValue}
      disabled={disabled}
      max={safeMax}
      min={safeMin}
      orientation={orientation}
      step={safeStep}
      value={value}
    >
      <SliderTrack
        className={trackClassName}
        orientation={orientation}
        showTicks={variant === "ticks"}
        tickStepPercent={tickStepPercent}
      >
        <SliderRange className={rangeClassName} />
      </SliderTrack>
      {Array.from({ length: thumbCount }, (_, index) => (
        <SliderThumb
          aria-label={thumbLabels?.[index] ?? defaultThumbLabel(index, thumbCount)}
          className={thumbClassName}
          key={`thumb-${index + 1}`}
          showValue={showValue}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export type SliderVariantProps = VariantProps<typeof sliderVariants>;

export { rangeVariants, sliderVariants, thumbVariants, trackVariants };
