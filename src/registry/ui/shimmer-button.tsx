"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Shimmer Button
 *
 * A native action control whose travelling highlight is painted into the
 * material edge rather than across the label. The surface therefore keeps a
 * stable foreground/background pair for the whole animation. Every material
 * recipe, token and keyframe ships in this file; copying it together with
 * `src/lib/cn.ts` reproduces the complete control without globals.css.
 *
 * Local theming knobs:
 *
 *   --mq-body       inner surface
 *   --mq-lit        optional top light / gradient endpoint
 *   --mq-text       label colour
 *   --mq-edge       tactile side wall
 *   --mq-brd-a/b/c  colours in the animated perimeter
 *   --mq-ring       focus ring
 */

const SHIMMER_KEYFRAMES =
  "@keyframes mq-shimmer-button-sweep{from{background-position:180% 0}to{background-position:-80% 0}}";

function ShimmerButtonKeyframes() {
  return (
    <style href="mq-shimmer-button-sweep" precedence="medium">
      {SHIMMER_KEYFRAMES}
    </style>
  );
}

const shimmerButtonVariants = cva(
  [
    "relative isolate inline-flex shrink-0 appearance-none items-stretch justify-stretch",
    "cursor-pointer select-none border border-transparent p-[2px] font-extrabold tracking-[-0.01em]",
    "[background-image:linear-gradient(110deg,var(--mq-brd-a,#9e3d2b)_0%,var(--mq-brd-a,#9e3d2b)_34%,var(--mq-brd-b,#fff6ef)_47%,var(--mq-brd-c,#ffb29f)_54%,var(--mq-brd-a,#9e3d2b)_68%,var(--mq-brd-a,#9e3d2b)_100%)]",
    "[background-size:260%_100%] [background-repeat:no-repeat]",
    "animate-[mq-shimmer-button-sweep_2.35s_linear_infinite]",
    "transition-[translate,box-shadow,filter,opacity] duration-200 ease-out",
    "hover:-translate-y-[1px] active:translate-y-[2px]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "disabled:cursor-not-allowed disabled:opacity-55 disabled:animate-none",
    "disabled:hover:translate-y-0 disabled:active:translate-y-0",
    "motion-reduce:animate-none motion-reduce:transition-none",
    "motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
    "forced-colors:border-[ButtonText] forced-colors:[background-image:none] forced-colors:bg-[ButtonFace]",
    "forced-colors:shadow-none forced-colors:focus-visible:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#ff9077] [--mq-lit:#ffb09e] [--mq-text:#4a1d13]",
          "[--mq-edge:#c9482f] [--mq-brd-a:#9e3d2b] [--mq-brd-b:#fff6ef] [--mq-brd-c:#ffb29f]",
          "[--mq-ring:#171817]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.48),0_5px_0_var(--mq-edge,#c9482f),0_12px_22px_rgba(75,40,31,0.2)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.56),0_7px_0_var(--mq-edge,#c9482f),0_16px_28px_rgba(75,40,31,0.24)]",
          "active:shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_2px_0_var(--mq-edge,#c9482f),0_5px_10px_rgba(75,40,31,0.16)]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(23,24,23,0.88)] [--mq-lit:rgba(64,67,65,0.9)] [--mq-text:#ffffff]",
          "[--mq-edge:rgba(18,18,18,0.78)] [--mq-brd-a:rgba(255,255,255,0.26)] [--mq-brd-b:#ffffff] [--mq-brd-c:#9ee9ff]",
          "[--mq-ring:#171817]",
          "backdrop-blur-[16px] backdrop-saturate-[165%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_8px_24px_rgba(24,20,40,0.24)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.52),0_12px_32px_rgba(24,20,40,0.3)]",
          "active:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_4px_12px_rgba(24,20,40,0.2)]",
        ].join(" "),
        skeuo: [
          "[--mq-body:#d7d3c9] [--mq-lit:#f4f2ec] [--mq-text:#23231f]",
          "[--mq-edge:#a8a49b] [--mq-brd-a:#79766f] [--mq-brd-b:#fffef9] [--mq-brd-c:#c7c3ba]",
          "[--mq-ring:#171817]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-2px_3px_rgba(0,0,0,0.16),0_4px_0_var(--mq-edge,#a8a49b),0_10px_17px_rgba(38,36,31,0.26)]",
          "hover:brightness-[1.04] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_3px_rgba(0,0,0,0.16),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.3)]",
          "active:brightness-100 active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.24),inset_0_-1px_2px_rgba(0,0,0,0.12),0_1px_0_var(--mq-edge,#a8a49b),0_4px_8px_rgba(38,36,31,0.2)]",
        ].join(" "),
        adaptive: [
          "[--mq-body:#171817] [--mq-lit:#2c2d2b] [--mq-text:#f6f5f1]",
          "[--mq-edge:#0b0c0b] [--mq-brd-a:#323330] [--mq-brd-b:#ffffff] [--mq-brd-c:#b6ffc7]",
          "[--mq-ring:#171817]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.15),0_8px_18px_rgba(20,20,18,0.12)]",
          "hover:shadow-[0_2px_4px_rgba(20,20,18,0.17),0_12px_24px_rgba(20,20,18,0.16)]",
          "active:shadow-[0_1px_2px_rgba(20,20,18,0.14),0_4px_10px_rgba(20,20,18,0.1)]",
          "dark:[--mq-body:#f1efe9] dark:[--mq-lit:#ffffff] dark:[--mq-text:#171817]",
          "dark:[--mq-edge:#aaa79f] dark:[--mq-brd-a:#b9b6ae] dark:[--mq-brd-b:#171817] dark:[--mq-brd-c:#5d8a67]",
          "dark:[--mq-ring:#f1efe9]",
          "pointer-coarse:min-h-[48px]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "h-[36px] rounded-[12px] text-[12px]/[1]",
        md: "h-[44px] rounded-[15px] text-[13px]/[1]",
        lg: "h-[52px] rounded-[18px] text-[14px]/[1]",
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

const shimmerButtonBodyVariants = cva(
  [
    "relative z-[1] inline-flex size-full items-center justify-center",
    "gap-[8px] px-[20px] text-[color:var(--mq-text,#4a1d13)]",
    "[background-color:var(--mq-body,#ff9077)]",
    "[background-image:linear-gradient(180deg,var(--mq-lit,#ffb09e),var(--mq-body,#ff9077))]",
    "shadow-[inset_0_2px_3px_rgba(255,255,255,0.34),inset_0_-3px_5px_rgba(0,0,0,0.12)]",
    "forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]",
    "forced-colors:[background-image:none] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "gap-[6px] rounded-[9px] px-[13px]",
        md: "gap-[8px] rounded-[12px] px-[19px]",
        lg: "gap-[10px] rounded-[15px] px-[25px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type ShimmerButtonProps = Omit<React.ComponentPropsWithRef<"button">, "color"> &
  VariantProps<typeof shimmerButtonVariants>;

export function ShimmerButton({
  children,
  className,
  material = "clay",
  size = "md",
  type = "button",
  variant = "default",
  ...props
}: ShimmerButtonProps) {
  return (
    <>
      <ShimmerButtonKeyframes />
      <button
        {...props}
        className={cn(shimmerButtonVariants({ material, size, variant }), className)}
        data-material={material}
        type={type}
      >
        <span className={cn(shimmerButtonBodyVariants({ size }))}>{children}</span>
      </button>
    </>
  );
}

export { shimmerButtonVariants };
