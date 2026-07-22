import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined to keep the source copy-and-own. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const MARQUEE_KEYFRAMES = `@keyframes mq-marquee-x{to{translate:-100% 0}}@keyframes mq-marquee-y{to{translate:0 -100%}}`;

function MarqueeKeyframes() {
  return (
    <style href="mq-marquee" precedence="medium">
      {MARQUEE_KEYFRAMES}
    </style>
  );
}

const marqueeVariants = cva(
  [
    "group relative isolate flex overflow-hidden border border-[rgba(244,246,255,0.2)]",
    "bg-[#0e1016] text-[#f4f6ff]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
      size: {
        sm: "min-h-[88px] rounded-[16px] p-[10px] [--mq-gap:10px]",
        md: "min-h-[112px] rounded-[22px] p-[14px] [--mq-gap:14px]",
        lg: "min-h-[144px] rounded-[28px] p-[18px] [--mq-gap:18px]",
      },
    },
    defaultVariants: { variant: "horizontal", size: "md" },
  },
);

type MarqueeVariant = "horizontal" | "vertical";
type MarqueeSize = "sm" | "md" | "lg";

export type MarqueeProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof marqueeVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: MarqueeVariant;
    size?: MarqueeSize;
    reverse?: boolean;
    pauseOnHover?: boolean;
    repeat?: number;
    duration?: number;
  };

export function Marquee({
  children,
  className,
  duration = 24,
  material = "adaptive",
  pauseOnHover = true,
  repeat = 2,
  reverse = false,
  size = "md",
  style,
  variant = "horizontal",
  ...props
}: MarqueeProps) {
  const copies = Math.min(8, Math.max(2, Math.floor(repeat)));
  const safeDuration = Math.max(3, duration);
  const vertical = variant === "vertical";

  return (
    <div
      {...props}
      className={cn(marqueeVariants({ size, variant }), className)}
      data-material={material}
      data-orientation={variant}
      style={{ "--mq-duration": `${safeDuration}s`, ...style } as React.CSSProperties}
    >
      <MarqueeKeyframes />
      {Array.from({ length: copies }, (_, index) => {
        const duplicate = index > 0;

        return (
          <div
            aria-hidden={duplicate || undefined}
            className={cn(
              "flex shrink-0 justify-around gap-[var(--mq-gap,14px)]",
              vertical
                ? "w-full flex-col pb-[var(--mq-gap,14px)] animate-[mq-marquee-y_var(--mq-duration,24s)_linear_infinite]"
                : "h-full flex-row items-center pr-[var(--mq-gap,14px)] animate-[mq-marquee-x_var(--mq-duration,24s)_linear_infinite]",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
              reverse && "[animation-direction:reverse]",
              "motion-reduce:animate-none forced-colors:animate-none",
              duplicate && "motion-reduce:hidden forced-colors:hidden",
            )}
            data-mq-copy={duplicate ? "" : undefined}
            inert={duplicate}
            key={index}
          >
            {children}
          </div>
        );
      })}
    </div>
  );
}

export { marqueeVariants };
