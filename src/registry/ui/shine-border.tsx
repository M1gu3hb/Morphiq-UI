import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const SHINE_BORDER_KEYFRAMES = `@property --mq-shine-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes mq-shine-border{to{--mq-shine-angle:1turn}}`;

function ShineBorderKeyframes() {
  return (
    <style href="mq-shine-border" precedence="medium">
      {SHINE_BORDER_KEYFRAMES}
    </style>
  );
}

const shineBorderVariants = cva(
  [
    "relative isolate overflow-hidden border border-[rgba(244,246,255,0.18)]",
    "bg-[#11131a] text-[#f5f7ff] shadow-[0_18px_48px_rgba(7,9,16,0.28)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        spectrum: "",
      },
      size: {
        sm: "min-h-[128px] rounded-[18px] p-[18px]",
        md: "min-h-[164px] rounded-[24px] p-[24px]",
        lg: "min-h-[204px] rounded-[30px] p-[30px]",
      },
    },
    defaultVariants: { variant: "spectrum", size: "md" },
  },
);

const MASK = "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)";
const DEFAULT_COLORS = ["#a8ff78", "#7ddcff", "#a78bfa", "#ff8cad"] as const;

type ShineBorderVariant = "spectrum";
type ShineBorderSize = "sm" | "md" | "lg";

export type ShineBorderProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof shineBorderVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: ShineBorderVariant;
    size?: ShineBorderSize;
    borderWidth?: number;
    duration?: number;
    colors?: readonly string[];
  };

export function ShineBorder({
  borderWidth = 2,
  children,
  className,
  colors = DEFAULT_COLORS,
  duration = 8,
  material = "adaptive",
  size = "md",
  variant = "spectrum",
  ...props
}: ShineBorderProps) {
  const safeColors = colors.length > 0 ? colors : DEFAULT_COLORS;

  return (
    <div
      {...props}
      className={cn(shineBorderVariants({ size, variant }), className)}
      data-material={material}
      data-variant={variant}
    >
      <ShineBorderKeyframes />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] rounded-[inherit]",
          "animate-[mq-shine-border_8s_linear_infinite] [will-change:--mq-shine-angle]",
          "motion-reduce:animate-none forced-colors:hidden",
        )}
        style={{
          animationDuration: `${Math.max(2, duration)}s`,
          backgroundImage: `conic-gradient(from var(--mq-shine-angle, 0deg), transparent 0 8%, ${safeColors.join(", ")}, transparent 92% 100%)`,
          padding: `${Math.max(1, borderWidth)}px`,
          WebkitMask: MASK,
          WebkitMaskComposite: "xor",
          mask: MASK,
          maskComposite: "exclude",
        }}
      />
      <div className="relative z-[2] flex size-full flex-col">{children}</div>
    </div>
  );
}

export { shineBorderVariants };
