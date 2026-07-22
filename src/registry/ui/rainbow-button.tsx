"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Rainbow Button
 *
 * A native action wrapped in a moving spectral edge. The rainbow remains a
 * decorative perimeter and halo; the label sits on a stable material surface
 * so its contrast never depends on the animation frame.
 */

const RAINBOW_KEYFRAMES =
  "@keyframes mq-rainbow-button-flow{from{background-position:0% 50%}to{background-position:200% 50%}}";

function RainbowButtonKeyframes() {
  return (
    <style href="mq-rainbow-button-flow" precedence="medium">
      {RAINBOW_KEYFRAMES}
    </style>
  );
}

const rainbowButtonVariants = cva(
  [
    "group relative isolate inline-flex shrink-0 appearance-none items-stretch justify-stretch",
    "cursor-pointer select-none border border-transparent p-[2px] font-extrabold tracking-[-0.01em]",
    "[background-image:linear-gradient(100deg,var(--mq-rainbow-a,#ff5d73),var(--mq-rainbow-b,#ffb45e),var(--mq-rainbow-c,#f5e96b),var(--mq-rainbow-d,#54d8aa),var(--mq-rainbow-e,#55a9ff),var(--mq-rainbow-f,#a878ff),var(--mq-rainbow-g,#ff69c8),var(--mq-rainbow-a,#ff5d73))]",
    "[background-size:200%_100%] animate-[mq-rainbow-button-flow_3.2s_linear_infinite]",
    "transition-[translate,box-shadow,opacity] duration-200 ease-out",
    "hover:-translate-y-[1px] active:translate-y-[2px]",
    "focus-visible:outline-2 focus-visible:outline-offset-[4px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[4px]",
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
          "[--mq-rainbow-a:#d63d55] [--mq-rainbow-b:#ff985c] [--mq-rainbow-c:#f5dc72]",
          "[--mq-rainbow-d:#55bd92] [--mq-rainbow-e:#5795df] [--mq-rainbow-f:#9b6bd3] [--mq-rainbow-g:#e451a8]",
          "[--mq-body:#ff9b83] [--mq-text:#4a1d13] [--mq-edge:#c9482f] [--mq-ring:#171817]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.46),0_5px_0_var(--mq-edge,#c9482f),0_12px_23px_rgba(75,40,31,0.22)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.56),0_7px_0_var(--mq-edge,#c9482f),0_17px_30px_rgba(75,40,31,0.28)]",
          "active:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_0_var(--mq-edge,#c9482f),0_5px_10px_rgba(75,40,31,0.16)]",
        ].join(" "),
        glass: [
          "[--mq-rainbow-a:#ff6e8b] [--mq-rainbow-b:#ffd36a] [--mq-rainbow-c:#eaff77]",
          "[--mq-rainbow-d:#63f0c1] [--mq-rainbow-e:#69c4ff] [--mq-rainbow-f:#bd91ff] [--mq-rainbow-g:#ff80d0]",
          "[--mq-body:rgba(22,24,23,0.94)] [--mq-text:#ffffff] [--mq-ring:#171817]",
          "backdrop-blur-[16px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.46),0_8px_26px_rgba(36,25,61,0.29)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.58),0_13px_36px_rgba(36,25,61,0.37)]",
          "active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.3),0_4px_12px_rgba(36,25,61,0.23)]",
        ].join(" "),
        skeuo: [
          "[--mq-rainbow-a:#b85e6e] [--mq-rainbow-b:#c78b59] [--mq-rainbow-c:#b9a95f]",
          "[--mq-rainbow-d:#659b82] [--mq-rainbow-e:#688cae] [--mq-rainbow-f:#8875ad] [--mq-rainbow-g:#a86691]",
          "[--mq-body:#e6e3da] [--mq-text:#23231f] [--mq-edge:#a8a49b] [--mq-ring:#171817]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-2px_3px_rgba(0,0,0,0.13),0_4px_0_var(--mq-edge,#a8a49b),0_10px_18px_rgba(38,36,31,0.26)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-2px_3px_rgba(0,0,0,0.12),0_6px_0_var(--mq-edge,#a8a49b),0_15px_24px_rgba(38,36,31,0.31)]",
          "active:shadow-[inset_0_3px_7px_rgba(0,0,0,0.22),0_1px_0_var(--mq-edge,#a8a49b),0_4px_8px_rgba(38,36,31,0.2)]",
        ].join(" "),
        adaptive: [
          "[--mq-rainbow-a:#ff5d73] [--mq-rainbow-b:#ffb45e] [--mq-rainbow-c:#f5e96b]",
          "[--mq-rainbow-d:#54d8aa] [--mq-rainbow-e:#55a9ff] [--mq-rainbow-f:#a878ff] [--mq-rainbow-g:#ff69c8]",
          "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-ring:#171817]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.16),0_8px_19px_rgba(20,20,18,0.15)]",
          "hover:shadow-[0_2px_4px_rgba(20,20,18,0.18),0_13px_26px_rgba(20,20,18,0.2)]",
          "active:shadow-[0_1px_2px_rgba(20,20,18,0.14),0_4px_10px_rgba(20,20,18,0.11)]",
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-ring:#f1efe9]",
          "pointer-coarse:min-h-[48px]",
        ].join(" "),
      },
      variant: { default: "" },
      size: {
        sm: "h-[36px] rounded-[12px] text-[12px]/[1]",
        md: "h-[44px] rounded-[15px] text-[13px]/[1]",
        lg: "h-[52px] rounded-[18px] text-[14px]/[1]",
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

const rainbowButtonBodyVariants = cva(
  [
    "relative z-[1] inline-flex size-full items-center justify-center gap-[8px]",
    "bg-[var(--mq-body,#ff9b83)] text-[color:var(--mq-text,#4a1d13)]",
    "shadow-[inset_0_2px_3px_rgba(255,255,255,0.33),inset_0_-3px_5px_rgba(0,0,0,0.13)]",
    "forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "rounded-[9px] px-[13px]",
        md: "rounded-[12px] px-[19px]",
        lg: "rounded-[15px] px-[25px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const rainbowHaloClassName = [
  "pointer-events-none absolute inset-[-5px] -z-[1] rounded-[inherit] opacity-60 blur-[10px]",
  "[background-image:linear-gradient(100deg,var(--mq-rainbow-a,#ff5d73),var(--mq-rainbow-b,#ffb45e),var(--mq-rainbow-c,#f5e96b),var(--mq-rainbow-d,#54d8aa),var(--mq-rainbow-e,#55a9ff),var(--mq-rainbow-f,#a878ff),var(--mq-rainbow-g,#ff69c8),var(--mq-rainbow-a,#ff5d73))]",
  "[background-size:200%_100%] animate-[mq-rainbow-button-flow_3.2s_linear_infinite]",
  "transition-[opacity] duration-200 ease-out group-hover:opacity-85 group-disabled:animate-none group-disabled:opacity-0",
  "motion-reduce:animate-none motion-reduce:transition-none forced-colors:hidden",
].join(" ");

export type RainbowButtonProps = Omit<React.ComponentPropsWithRef<"button">, "color"> &
  VariantProps<typeof rainbowButtonVariants>;

export function RainbowButton({
  children,
  className,
  material = "clay",
  size = "md",
  type = "button",
  variant = "default",
  ...props
}: RainbowButtonProps) {
  return (
    <>
      <RainbowButtonKeyframes />
      <button
        {...props}
        className={cn(rainbowButtonVariants({ material, size, variant }), className)}
        data-material={material}
        type={type}
      >
        <span aria-hidden="true" className={rainbowHaloClassName} />
        <span className={cn(rainbowButtonBodyVariants({ size }))}>{children}</span>
      </button>
    </>
  );
}

export { rainbowButtonVariants };
