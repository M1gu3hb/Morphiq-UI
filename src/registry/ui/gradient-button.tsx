"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Gradient Button
 *
 * Two coordinated CSS gradients flow at different speeds: the outer layer is
 * a luminous material edge and the inner layer is the stable, readable
 * surface. All keyframes and material variables travel with this source file.
 */

const GRADIENT_KEYFRAMES =
  "@keyframes mq-gradient-button-flow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}";

function GradientButtonKeyframes() {
  return (
    <style href="mq-gradient-button-flow" precedence="medium">
      {GRADIENT_KEYFRAMES}
    </style>
  );
}

const gradientButtonVariants = cva(
  [
    "group relative isolate inline-flex shrink-0 appearance-none items-stretch justify-stretch",
    "cursor-pointer select-none border border-transparent p-[2px] font-extrabold tracking-[-0.01em]",
    "[background-image:linear-gradient(115deg,var(--mq-grad-a,#8e2f23),var(--mq-grad-b,#fff0e7),var(--mq-grad-c,#ec6b4f),var(--mq-grad-a,#8e2f23))]",
    "[background-size:260%_100%] animate-[mq-gradient-button-flow_4.2s_ease-in-out_infinite]",
    "transition-[translate,box-shadow,opacity] duration-200 ease-out",
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
          "[--mq-grad-a:#8e2f23] [--mq-grad-b:#fff0e7] [--mq-grad-c:#ec6b4f]",
          "[--mq-body-a:#ff9b83] [--mq-body-b:#ffcfbe] [--mq-text:#4a1d13] [--mq-edge:#c9482f] [--mq-ring:#171817]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.48),0_5px_0_var(--mq-edge,#c9482f),0_12px_22px_rgba(75,40,31,0.2)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.58),0_7px_0_var(--mq-edge,#c9482f),0_17px_29px_rgba(75,40,31,0.26)]",
          "active:shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_2px_0_var(--mq-edge,#c9482f),0_5px_10px_rgba(75,40,31,0.16)]",
        ].join(" "),
        glass: [
          "[--mq-grad-a:#7fe8ff] [--mq-grad-b:#cab7ff] [--mq-grad-c:#ffffff]",
          "[--mq-body-a:#171918] [--mq-body-b:#30343a] [--mq-text:#ffffff] [--mq-ring:#171817]",
          "backdrop-blur-[16px] backdrop-saturate-[165%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_25px_rgba(33,27,58,0.27)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.62),0_13px_34px_rgba(33,27,58,0.34)]",
          "active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.28),0_4px_12px_rgba(33,27,58,0.22)]",
        ].join(" "),
        skeuo: [
          "[--mq-grad-a:#77736a] [--mq-grad-b:#fffdf6] [--mq-grad-c:#b0a99e]",
          "[--mq-body-a:#e6e3da] [--mq-body-b:#f7f4ec] [--mq-text:#23231f] [--mq-edge:#a8a49b] [--mq-ring:#171817]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_3px_rgba(0,0,0,0.13),0_4px_0_var(--mq-edge,#a8a49b),0_10px_18px_rgba(38,36,31,0.26)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-2px_3px_rgba(0,0,0,0.12),0_6px_0_var(--mq-edge,#a8a49b),0_14px_23px_rgba(38,36,31,0.31)]",
          "active:shadow-[inset_0_3px_7px_rgba(0,0,0,0.22),0_1px_0_var(--mq-edge,#a8a49b),0_4px_8px_rgba(38,36,31,0.2)]",
        ].join(" "),
        adaptive: [
          "[--mq-grad-a:#2d4f38] [--mq-grad-b:#dfffe7] [--mq-grad-c:#6fbf82]",
          "[--mq-body-a:#171817] [--mq-body-b:#343532] [--mq-text:#f6f5f1] [--mq-ring:#171817]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.16),0_8px_18px_rgba(20,20,18,0.14)]",
          "hover:shadow-[0_2px_4px_rgba(20,20,18,0.18),0_13px_25px_rgba(20,20,18,0.19)]",
          "active:shadow-[0_1px_2px_rgba(20,20,18,0.14),0_4px_10px_rgba(20,20,18,0.11)]",
          "dark:[--mq-grad-a:#9d9a92] dark:[--mq-grad-b:#171817] dark:[--mq-grad-c:#d9d6cd]",
          "dark:[--mq-body-a:#f1efe9] dark:[--mq-body-b:#d9d6cd] dark:[--mq-text:#171817] dark:[--mq-ring:#f1efe9]",
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

const gradientButtonBodyVariants = cva(
  [
    "relative z-[1] inline-flex size-full items-center justify-center gap-[8px]",
    "text-[color:var(--mq-text,#4a1d13)]",
    "[background-image:linear-gradient(115deg,var(--mq-body-a,#ff9b83),var(--mq-body-b,#ffcfbe),var(--mq-body-a,#ff9b83))]",
    "[background-size:220%_100%] animate-[mq-gradient-button-flow_5.4s_ease-in-out_infinite_reverse]",
    "shadow-[inset_0_2px_3px_rgba(255,255,255,0.33),inset_0_-3px_5px_rgba(0,0,0,0.12)]",
    "group-disabled:animate-none motion-reduce:animate-none",
    "forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]",
    "forced-colors:[background-image:none] forced-colors:shadow-none",
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

export type GradientButtonProps = Omit<React.ComponentPropsWithRef<"button">, "color"> &
  VariantProps<typeof gradientButtonVariants>;

export function GradientButton({
  children,
  className,
  material = "clay",
  size = "md",
  type = "button",
  variant = "default",
  ...props
}: GradientButtonProps) {
  return (
    <>
      <GradientButtonKeyframes />
      <button
        {...props}
        className={cn(gradientButtonVariants({ material, size, variant }), className)}
        data-material={material}
        type={type}
      >
        <span className={cn(gradientButtonBodyVariants({ size }))}>{children}</span>
      </button>
    </>
  );
}

export { gradientButtonVariants };
