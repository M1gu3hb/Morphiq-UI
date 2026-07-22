import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const INFINITE_SLIDER_KEYFRAMES = "@keyframes mq-infinite-slider{to{translate:-100% 0}}";

function InfiniteSliderKeyframes() {
  return (
    <style href="mq-infinite-slider" precedence="medium">
      {INFINITE_SLIDER_KEYFRAMES}
    </style>
  );
}

export type InfiniteSliderItem = {
  id: string;
  content: React.ReactNode;
};

const infiniteSliderVariants = cva(
  [
    "group relative isolate flex overflow-hidden border border-[#343842] bg-[#101218] text-[#f5f7ff]",
    "[mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:[mask-image:none]",
  ].join(" "),
  {
    variants: {
      variant: { left: "", right: "" },
      size: {
        sm: "min-h-[72px] rounded-[16px] py-[10px] [--mq-gap:10px]",
        md: "min-h-[96px] rounded-[22px] py-[14px] [--mq-gap:14px]",
        lg: "min-h-[124px] rounded-[28px] py-[18px] [--mq-gap:18px]",
      },
    },
    defaultVariants: { variant: "left", size: "md" },
  },
);

export type InfiniteSliderProps = Omit<React.ComponentPropsWithRef<"div">, "children"> &
  Omit<VariantProps<typeof infiniteSliderVariants>, "variant" | "size"> & {
    items: readonly InfiniteSliderItem[];
    material?: "adaptive";
    variant?: "left" | "right";
    size?: "sm" | "md" | "lg";
    duration?: number;
    pauseOnHover?: boolean;
  };

export function InfiniteSlider({
  "aria-label": ariaLabel = "Scrolling media",
  className,
  duration = 24,
  items,
  material = "adaptive",
  pauseOnHover = true,
  size = "md",
  style,
  variant = "left",
  ...props
}: InfiniteSliderProps) {
  const safeDuration = Math.max(4, duration);

  return (
    <div
      {...props}
      aria-label={ariaLabel}
      className={cn(infiniteSliderVariants({ size, variant }), className)}
      data-material={material}
      role="region"
      style={{ "--mq-duration": `${safeDuration}s`, ...style } as React.CSSProperties}
    >
      <InfiniteSliderKeyframes />
      {[0, 1].map((copyIndex) => {
        const duplicate = copyIndex === 1;
        return (
          <div
            aria-hidden={duplicate || undefined}
            className={cn(
              "flex min-w-max shrink-0 items-center gap-[var(--mq-gap,14px)] pr-[var(--mq-gap,14px)]",
              "animate-[mq-infinite-slider_var(--mq-duration,24s)_linear_infinite]",
              "motion-reduce:animate-none forced-colors:animate-none",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
              variant === "right" && "[animation-direction:reverse]",
              duplicate && "motion-reduce:hidden forced-colors:hidden",
            )}
            data-slider-copy={duplicate ? "duplicate" : "primary"}
            inert={duplicate}
            key={copyIndex}
          >
            {items.map((item) => (
              <div className="shrink-0" key={`${copyIndex}-${item.id}`}>
                {item.content}
              </div>
            ))}
          </div>
        );
      })}
      {items.length === 0 ? <p className="m-0 px-[20px] text-[13px]">Add slider items.</p> : null}
    </div>
  );
}

export { infiniteSliderVariants };
