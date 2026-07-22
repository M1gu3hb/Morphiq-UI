import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const ORBIT_KEYFRAMES = `@keyframes mq-orbit{from{transform:rotate(0deg) translateX(var(--mq-radius,88px)) rotate(0deg)}to{transform:rotate(1turn) translateX(var(--mq-radius,88px)) rotate(-1turn)}}`;

function OrbitKeyframes() {
  return (
    <style href="mq-orbit" precedence="medium">
      {ORBIT_KEYFRAMES}
    </style>
  );
}

const orbitingCirclesVariants = cva(
  [
    "relative isolate grid place-items-center overflow-hidden border border-[rgba(244,246,255,0.2)]",
    "bg-[#0e1016] text-[#f4f6ff]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        clockwise: "",
        counterclockwise: "",
      },
      size: {
        sm: "size-[210px] rounded-[22px]",
        md: "size-[270px] rounded-[28px]",
        lg: "size-[330px] rounded-[34px]",
      },
    },
    defaultVariants: { variant: "clockwise", size: "md" },
  },
);

const DEFAULT_RADIUS = { sm: 70, md: 94, lg: 120 } as const;
const DEFAULT_ITEM_SIZE = { sm: 36, md: 44, lg: 52 } as const;

type OrbitingCirclesVariant = "clockwise" | "counterclockwise";
type OrbitingCirclesSize = "sm" | "md" | "lg";

export type OrbitingCirclesProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof orbitingCirclesVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: OrbitingCirclesVariant;
    size?: OrbitingCirclesSize;
    center?: React.ReactNode;
    radius?: number;
    itemSize?: number;
    duration?: number;
    speed?: number;
    reverse?: boolean;
    showPath?: boolean;
  };

export function OrbitingCircles({
  center,
  children,
  className,
  duration = 18,
  itemSize,
  material = "adaptive",
  radius,
  reverse,
  showPath = true,
  size = "md",
  speed = 1,
  style,
  variant = "clockwise",
  ...props
}: OrbitingCirclesProps) {
  const items = React.Children.toArray(children);
  const safeRadius = Math.max(24, radius ?? DEFAULT_RADIUS[size]);
  const safeItemSize = Math.max(20, itemSize ?? DEFAULT_ITEM_SIZE[size]);
  const safeSpeed = Math.max(0.15, speed);
  const safeDuration = Math.max(3, duration / safeSpeed);
  const isReverse = reverse ?? variant === "counterclockwise";

  return (
    <div
      {...props}
      className={cn(orbitingCirclesVariants({ size, variant }), className)}
      data-material={material}
      data-variant={variant}
      style={{ "--mq-radius": `${safeRadius}px`, ...style } as React.CSSProperties}
    >
      <OrbitKeyframes />
      {showPath ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full border border-white/15 forced-colors:border-[CanvasText]"
          style={{ height: `${safeRadius * 2}px`, width: `${safeRadius * 2}px` }}
        />
      ) : null}
      <div className="relative z-10 grid max-w-[112px] place-items-center text-center">
        {center}
      </div>
      {items.map((item, index) => {
        const angle = items.length > 0 ? (360 / items.length) * index : 0;

        return (
          <span
            className={cn(
              "absolute left-1/2 top-1/2 z-[2] grid place-items-center rounded-full",
              "border border-white/25 bg-[#1a1e28] text-[#f4f6ff] shadow-[0_7px_20px_rgba(0,0,0,0.32)]",
              "animate-[mq-orbit_18s_linear_infinite] [will-change:transform]",
              isReverse && "[animation-direction:reverse]",
              "motion-reduce:animate-none forced-colors:animate-none",
              "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
            )}
            key={index}
            style={{
              animationDelay: `${(-safeDuration * index) / Math.max(1, items.length)}s`,
              animationDuration: `${safeDuration}s`,
              height: `${safeItemSize}px`,
              marginLeft: `${-safeItemSize / 2}px`,
              marginTop: `${-safeItemSize / 2}px`,
              transform: `rotate(${angle}deg) translateX(${safeRadius}px) rotate(${-angle}deg)`,
              width: `${safeItemSize}px`,
            }}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
}

export { orbitingCirclesVariants };
