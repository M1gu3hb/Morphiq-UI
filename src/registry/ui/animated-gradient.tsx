"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const GRADIENT_KEYFRAMES = `@keyframes mq-animated-gradient{0%{background-position:0% 20%,100% 0%,50% 100%;filter:hue-rotate(0deg)}50%{background-position:100% 80%,0% 100%,50% 0%;filter:hue-rotate(16deg)}100%{background-position:0% 20%,100% 0%,50% 100%;filter:hue-rotate(0deg)}}`;

function GradientKeyframes() {
  return (
    <style href="mq-animated-gradient" precedence="medium">
      {GRADIENT_KEYFRAMES}
    </style>
  );
}

const animatedGradientVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#0b1020)] text-[color:var(--mq-fg,#f8fafc)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        ocean:
          "[--mq-a:rgba(14,165,233,0.9)] [--mq-b:rgba(45,212,191,0.78)] [--mq-c:rgba(99,102,241,0.86)]",
        sunset:
          "[--mq-a:rgba(244,63,94,0.86)] [--mq-b:rgba(249,115,22,0.78)] [--mq-c:rgba(147,51,234,0.88)]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-[20px]",
        md: "min-h-[280px] rounded-[24px] p-[28px]",
        lg: "min-h-[380px] rounded-[30px] p-[36px]",
      },
    },
    defaultVariants: { variant: "ocean", size: "md" },
  },
);

const GRADIENT_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at 12% 20%, var(--mq-a, rgba(14,165,233,0.9)), transparent 42%), radial-gradient(circle at 88% 22%, var(--mq-b, rgba(45,212,191,0.78)), transparent 40%), radial-gradient(circle at 50% 92%, var(--mq-c, rgba(99,102,241,0.86)), transparent 46%)",
  backgroundSize: "165% 165%, 175% 175%, 155% 155%",
};

type AnimatedGradientVariant = "ocean" | "sunset";
type AnimatedGradientSize = "sm" | "md" | "lg";

export type AnimatedGradientProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof animatedGradientVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: AnimatedGradientVariant;
    size?: AnimatedGradientSize;
  };

export function AnimatedGradient({
  children,
  className,
  material = "adaptive",
  size = "md",
  variant = "ocean",
  ...props
}: AnimatedGradientProps) {
  return (
    <div
      {...props}
      className={cn(animatedGradientVariants({ size, variant }), className)}
      data-material={material}
    >
      <GradientKeyframes />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-0",
          "animate-[mq-animated-gradient_16s_ease-in-out_infinite] motion-reduce:animate-none",
          "forced-colors:hidden",
        )}
        style={GRADIENT_STYLE}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[rgba(3,7,18,0.64)] forced-colors:hidden"
      />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { animatedGradientVariants };
