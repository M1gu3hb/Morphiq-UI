import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const BUBBLE_KEYFRAMES = `@keyframes mq-floating-bubble{0%{transform:translate3d(0,28px,0) scale(.72);opacity:0}18%{opacity:var(--mq-bubble-alpha,.58)}78%{opacity:calc(var(--mq-bubble-alpha,.58) * .72)}100%{transform:translate3d(var(--mq-bubble-drift,18px),-340px,0) scale(1.18);opacity:0}}`;

function BubbleKeyframes() {
  return (
    <style href="mq-floating-bubbles" precedence="medium">
      {BUBBLE_KEYFRAMES}
    </style>
  );
}

const floatingBubblesVariants = cva(
  [
    "relative isolate overflow-hidden bg-[var(--mq-bubbles-bg,#071522)] text-[color:var(--mq-bubbles-fg,#f8fafc)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        soft: "[--mq-bubble-a:#7dd3fc] [--mq-bubble-b:#a7f3d0] [--mq-bubble-c:#c4b5fd]",
        iridescent: "[--mq-bubble-a:#f0abfc] [--mq-bubble-b:#67e8f9] [--mq-bubble-c:#fda4af]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-5",
        md: "min-h-[280px] rounded-[24px] p-7",
        lg: "min-h-[380px] rounded-[30px] p-9",
      },
    },
    defaultVariants: { variant: "soft", size: "md" },
  },
);

type BubblesVariant = "soft" | "iridescent";
type BubblesSize = "sm" | "md" | "lg";
type BubbleStyle = React.CSSProperties &
  Record<"--mq-bubble-alpha" | "--mq-bubble-drift", string>;
type FloatingBubblesStyle = React.CSSProperties &
  Partial<Record<"--mq-bubble-a" | "--mq-bubble-b" | "--mq-bubble-c", string>>;

export type FloatingBubblesProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof floatingBubblesVariants>, "variant" | "size"> & {
    variant?: BubblesVariant;
    size?: BubblesSize;
    height?: React.CSSProperties["minHeight"];
    intensity?: number;
    count?: number;
    speed?: number;
    colors?: readonly [string, string, string];
  };

export function FloatingBubbles({
  children,
  className,
  colors,
  count = 12,
  height,
  intensity = 0.68,
  size = "md",
  speed = 1,
  style,
  variant = "soft",
  ...props
}: FloatingBubblesProps) {
  const safeCount = Math.min(18, Math.max(4, Math.round(count)));
  const safeIntensity = Math.min(0.9, Math.max(0.2, intensity));
  const safeSpeed = Math.max(0.45, speed);
  const containerStyle: FloatingBubblesStyle = {
    ...style,
    minHeight: height ?? style?.minHeight,
    ...(colors
      ? { "--mq-bubble-a": colors[0], "--mq-bubble-b": colors[1], "--mq-bubble-c": colors[2] }
      : {}),
  };

  return (
    <div
      {...props}
      className={cn(floatingBubblesVariants({ variant, size }), className)}
      data-material="adaptive"
      style={containerStyle}
    >
      <BubbleKeyframes />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 forced-colors:hidden">
        {Array.from({ length: safeCount }, (_unused, index) => {
          const diameter = 18 + (index % 5) * 12;
          const bubbleStyle: BubbleStyle = {
            "--mq-bubble-alpha": String(safeIntensity - (index % 3) * 0.08),
            "--mq-bubble-drift": `${((index * 23) % 66) - 32}px`,
            animationDelay: `${-((index * 1.37) % 12)}s`,
            animationDuration: `${(10 + (index % 6) * 1.8) / safeSpeed}s`,
            bottom: `${-12 - (index % 4) * 8}px`,
            height: `${diameter}px`,
            left: `${4 + ((index * 43) % 91)}%`,
            width: `${diameter}px`,
          };
          const color =
            index % 3 === 0
              ? "var(--mq-bubble-a, #7dd3fc)"
              : index % 3 === 1
                ? "var(--mq-bubble-b, #a7f3d0)"
                : "var(--mq-bubble-c, #c4b5fd)";

          return (
            <span
              className="absolute rounded-full border border-white/55 animate-[mq-floating-bubble_14s_linear_infinite] shadow-[inset_0_0_12px_rgba(255,255,255,0.46),0_0_20px_rgba(125,211,252,0.16)] motion-reduce:animate-none motion-reduce:opacity-45"
              key={index}
              style={{ ...bubbleStyle, backgroundColor: color }}
            />
          );
        })}
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[rgba(3,7,18,0.42)] forced-colors:hidden" />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { floatingBubblesVariants };
