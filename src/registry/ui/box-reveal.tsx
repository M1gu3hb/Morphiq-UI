import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const BOX_REVEAL_KEYFRAMES = `@keyframes mq-box-sweep{0%{translate:-101% 0}42%,58%{translate:0 0}100%{translate:101% 0}}@keyframes mq-box-content{0%,49%{opacity:0}50%,100%{opacity:1}}`;

function BoxRevealKeyframes() {
  return (
    <style href="mq-box-reveal" precedence="medium">
      {BOX_REVEAL_KEYFRAMES}
    </style>
  );
}

const boxRevealVariants = cva(
  [
    "relative isolate overflow-hidden border border-[rgba(244,246,255,0.18)]",
    "bg-[#11131a] text-[#f5f7ff] shadow-[0_18px_48px_rgba(7,9,16,0.28)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        left: "",
        right: "",
      },
      size: {
        sm: "min-h-[118px] rounded-[16px] p-[18px]",
        md: "min-h-[152px] rounded-[22px] p-[24px]",
        lg: "min-h-[190px] rounded-[28px] p-[30px]",
      },
    },
    defaultVariants: { variant: "left", size: "md" },
  },
);

type BoxRevealVariant = "left" | "right";
type BoxRevealSize = "sm" | "md" | "lg";

export type BoxRevealProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof boxRevealVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: BoxRevealVariant;
    size?: BoxRevealSize;
    direction?: BoxRevealVariant;
    duration?: number;
    delay?: number;
    revealColor?: string;
  };

export function BoxReveal({
  children,
  className,
  delay = 0,
  direction,
  duration = 1.25,
  material = "adaptive",
  revealColor = "#a8ff78",
  size = "md",
  variant = "left",
  ...props
}: BoxRevealProps) {
  const resolvedDirection = direction ?? variant;
  const animationStyle = {
    animationDelay: `${Math.max(0, delay)}s`,
    animationDuration: `${Math.max(0.45, duration)}s`,
  };

  return (
    <div
      {...props}
      className={cn(boxRevealVariants({ size, variant: resolvedDirection }), className)}
      data-material={material}
      data-variant={resolvedDirection}
    >
      <BoxRevealKeyframes />
      <div
        className={cn(
          "relative z-0 flex size-full flex-col",
          "animate-[mq-box-content_1.25s_linear_both]",
          "motion-reduce:animate-none motion-reduce:!opacity-100",
          "forced-colors:animate-none forced-colors:!opacity-100",
        )}
        style={animationStyle}
      >
        {children}
      </div>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-10 rounded-[inherit]",
          "animate-[mq-box-sweep_1.25s_cubic-bezier(0.76,0,0.24,1)_both] [will-change:translate]",
          resolvedDirection === "right" && "[animation-direction:reverse]",
          "motion-reduce:hidden motion-reduce:animate-none forced-colors:hidden",
        )}
        style={{ ...animationStyle, backgroundColor: revealColor }}
      />
    </div>
  );
}

export { boxRevealVariants };
