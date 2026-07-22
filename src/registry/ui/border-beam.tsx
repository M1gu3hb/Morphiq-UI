import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const BORDER_BEAM_KEYFRAMES = `@keyframes mq-border-beam{to{offset-distance:100%}}`;

function BorderBeamKeyframes() {
  return (
    <style href="mq-border-beam" precedence="medium">
      {BORDER_BEAM_KEYFRAMES}
    </style>
  );
}

const borderBeamVariants = cva(
  [
    "relative isolate overflow-hidden border border-[rgba(244,246,255,0.2)]",
    "bg-[#11131a] text-[#f5f7ff] shadow-[0_18px_48px_rgba(7,9,16,0.28)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        forward: "",
        reverse: "",
      },
      size: {
        sm: "min-h-[128px] rounded-[18px] p-[18px] [--mq-beam-radius:18px]",
        md: "min-h-[164px] rounded-[24px] p-[24px] [--mq-beam-radius:24px]",
        lg: "min-h-[204px] rounded-[30px] p-[30px] [--mq-beam-radius:30px]",
      },
    },
    defaultVariants: { variant: "forward", size: "md" },
  },
);

const MASK = "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)";

type BorderBeamVariant = "forward" | "reverse";
type BorderBeamSize = "sm" | "md" | "lg";

export type BorderBeamProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof borderBeamVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: BorderBeamVariant;
    size?: BorderBeamSize;
    beamSize?: number;
    borderWidth?: number;
    duration?: number;
    delay?: number;
    colorFrom?: string;
    colorTo?: string;
  };

export function BorderBeam({
  beamSize = 64,
  borderWidth = 2,
  children,
  className,
  colorFrom = "#9cff72",
  colorTo = "#7ddcff",
  delay = 0,
  duration = 6,
  material = "adaptive",
  size = "md",
  variant = "forward",
  ...props
}: BorderBeamProps) {
  const safeBeamSize = Math.max(12, beamSize);
  const safeBorderWidth = Math.max(1, borderWidth);
  const safeDuration = Math.max(1.5, duration);

  return (
    <div
      {...props}
      className={cn(borderBeamVariants({ size, variant }), className)}
      data-material={material}
      data-variant={variant}
    >
      <BorderBeamKeyframes />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] forced-colors:hidden"
        style={{
          padding: `${safeBorderWidth}px`,
          WebkitMask: MASK,
          WebkitMaskComposite: "xor",
          mask: MASK,
          maskComposite: "exclude",
        }}
      >
        <span
          className={cn(
            "absolute left-0 top-0 aspect-square rounded-full blur-[2px]",
            "animate-[mq-border-beam_6s_linear_infinite] [will-change:offset-distance]",
            variant === "reverse" && "[animation-direction:reverse]",
            "motion-reduce:animate-none forced-colors:animate-none",
          )}
          style={{
            width: `${safeBeamSize}px`,
            offsetPath: "rect(0 auto auto 0 round var(--mq-beam-radius, 24px))",
            offsetDistance: "0%",
            animationDelay: `${-Math.abs(delay)}s`,
            animationDuration: `${safeDuration}s`,
            backgroundImage: `linear-gradient(90deg, transparent, ${colorFrom}, ${colorTo}, transparent)`,
          }}
        />
      </span>
      <div className="relative z-[2] flex size-full flex-col">{children}</div>
    </div>
  );
}

export { borderBeamVariants };
