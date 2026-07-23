import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const WARP_GRID_KEYFRAMES = `@keyframes mq-warp-grid{0%{background-position:0 0,0 0;transform:perspective(480px) rotateX(66deg) scale(1.55) translate3d(0,10%,0)}50%{transform:perspective(480px) rotateX(68deg) scale(1.62) translate3d(-1.5%,6%,0)}100%{background-position:0 96px,96px 0;transform:perspective(480px) rotateX(66deg) scale(1.55) translate3d(0,10%,0)}}`;

function WarpGridKeyframes() {
  return (
    <style href="mq-warp-grid" precedence="medium">
      {WARP_GRID_KEYFRAMES}
    </style>
  );
}

const warpGridVariants = cva(
  [
    "relative isolate overflow-hidden bg-[var(--mq-warp-bg,#070711)] text-[color:var(--mq-warp-fg,#f8fafc)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        violet: "[--mq-warp-line:rgba(167,139,250,0.46)] [--mq-warp-glow:rgba(124,58,237,0.42)]",
        emerald: "[--mq-warp-line:rgba(110,231,183,0.42)] [--mq-warp-glow:rgba(16,185,129,0.36)]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-5",
        md: "min-h-[280px] rounded-[24px] p-7",
        lg: "min-h-[380px] rounded-[30px] p-9",
      },
    },
    defaultVariants: { variant: "violet", size: "md" },
  },
);

type WarpGridVariant = "violet" | "emerald";
type WarpGridSize = "sm" | "md" | "lg";
type WarpGridStyle = React.CSSProperties &
  Partial<Record<"--mq-warp-line" | "--mq-warp-intensity" | "--mq-warp-cell", string>>;

export type WarpGridProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof warpGridVariants>, "variant" | "size"> & {
    variant?: WarpGridVariant;
    size?: WarpGridSize;
    height?: React.CSSProperties["minHeight"];
    intensity?: number;
    cellSize?: number;
    lineColor?: string;
    speed?: number;
  };

export function WarpGrid({
  cellSize = 42,
  children,
  className,
  height,
  intensity = 0.9,
  lineColor,
  size = "md",
  speed = 1,
  style,
  variant = "violet",
  ...props
}: WarpGridProps) {
  const safeCellSize = Math.min(72, Math.max(26, cellSize));
  const safeIntensity = Math.min(1, Math.max(0.2, intensity));
  const safeSpeed = Math.max(0.45, speed);
  const containerStyle: WarpGridStyle = {
    ...style,
    minHeight: height ?? style?.minHeight,
    "--mq-warp-cell": `${safeCellSize}px`,
    "--mq-warp-intensity": String(safeIntensity),
    ...(lineColor ? { "--mq-warp-line": lineColor } : {}),
  };

  return (
    <div
      {...props}
      className={cn(warpGridVariants({ variant, size }), className)}
      data-material="adaptive"
      style={containerStyle}
    >
      <WarpGridKeyframes />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-28%] bottom-[-52%] top-[8%] z-0 animate-[mq-warp-grid_11s_linear_infinite] opacity-[var(--mq-warp-intensity,0.9)] motion-reduce:animate-none forced-colors:hidden"
        style={{
          animationDuration: `${11 / safeSpeed}s`,
          backgroundImage:
            "linear-gradient(var(--mq-warp-line, rgba(167,139,250,0.46)) 1px, transparent 1px), linear-gradient(90deg, var(--mq-warp-line, rgba(167,139,250,0.46)) 1px, transparent 1px)",
          backgroundSize:
            "var(--mq-warp-cell, 42px) var(--mq-warp-cell, 42px)",
          transformOrigin: "50% 100%",
        }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[26%] z-0 h-[42%] bg-[radial-gradient(ellipse_at_center,var(--mq-warp-glow,rgba(124,58,237,0.42)),transparent_66%)] blur-xl forced-colors:hidden" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(4,4,12,0.24),rgba(4,4,12,0.68))] forced-colors:hidden" />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { warpGridVariants };
