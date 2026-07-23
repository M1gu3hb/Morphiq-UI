import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const LIGHT_RAYS_KEYFRAMES = `@keyframes mq-light-rays{0%,100%{transform:rotate(-7deg) scale(1.02);opacity:.54}50%{transform:rotate(8deg) scale(1.1);opacity:1}}`;

function LightRaysKeyframes() {
  return (
    <style href="mq-light-rays" precedence="medium">
      {LIGHT_RAYS_KEYFRAMES}
    </style>
  );
}

const lightRaysVariants = cva(
  [
    "relative isolate overflow-hidden bg-[var(--mq-rays-bg,#0b0d16)] text-[color:var(--mq-rays-fg,#f8fafc)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        sunrise: "[--mq-rays-a:rgba(251,191,36,0.5)] [--mq-rays-b:rgba(251,113,133,0.32)] [--mq-rays-glow:rgba(253,186,116,0.3)]",
        cool: "[--mq-rays-a:rgba(103,232,249,0.46)] [--mq-rays-b:rgba(129,140,248,0.32)] [--mq-rays-glow:rgba(125,211,252,0.28)]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-5",
        md: "min-h-[280px] rounded-[24px] p-7",
        lg: "min-h-[380px] rounded-[30px] p-9",
      },
    },
    defaultVariants: { variant: "sunrise", size: "md" },
  },
);

type LightRaysVariant = "sunrise" | "cool";
type LightRaysSize = "sm" | "md" | "lg";
type LightRaysStyle = React.CSSProperties &
  Partial<Record<"--mq-rays-a" | "--mq-rays-b" | "--mq-rays-intensity" | "--mq-rays-origin-x" | "--mq-rays-origin-y", string>>;

export type LightRaysProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof lightRaysVariants>, "variant" | "size"> & {
    variant?: LightRaysVariant;
    size?: LightRaysSize;
    height?: React.CSSProperties["minHeight"];
    intensity?: number;
    originX?: number;
    originY?: number;
    colors?: readonly [string, string];
  };

export function LightRays({
  children,
  className,
  colors,
  height,
  intensity = 0.88,
  originX = 50,
  originY = 0,
  size = "md",
  style,
  variant = "sunrise",
  ...props
}: LightRaysProps) {
  const safeIntensity = Math.min(1, Math.max(0.2, intensity));
  const safeOriginX = Math.min(100, Math.max(0, originX));
  const safeOriginY = Math.min(100, Math.max(0, originY));
  const containerStyle: LightRaysStyle = {
    ...style,
    minHeight: height ?? style?.minHeight,
    "--mq-rays-intensity": String(safeIntensity),
    "--mq-rays-origin-x": `${safeOriginX}%`,
    "--mq-rays-origin-y": `${safeOriginY}%`,
    ...(colors ? { "--mq-rays-a": colors[0], "--mq-rays-b": colors[1] } : {}),
  };

  return (
    <div
      {...props}
      className={cn(lightRaysVariants({ variant, size }), className)}
      data-material="adaptive"
      style={containerStyle}
    >
      <LightRaysKeyframes />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-45%] z-0 animate-[mq-light-rays_14s_ease-in-out_infinite] opacity-[var(--mq-rays-intensity,0.88)] blur-[2px] motion-reduce:animate-none forced-colors:hidden"
        style={{
          backgroundImage:
            "conic-gradient(from 198deg at var(--mq-rays-origin-x, 50%) var(--mq-rays-origin-y, 0%), transparent 0deg, var(--mq-rays-a, rgba(251,191,36,0.5)) 9deg, transparent 18deg, transparent 31deg, var(--mq-rays-b, rgba(251,113,133,0.32)) 42deg, transparent 54deg, transparent 72deg, var(--mq-rays-a, rgba(251,191,36,0.5)) 82deg, transparent 94deg)",
          transformOrigin:
            "var(--mq-rays-origin-x, 50%) var(--mq-rays-origin-y, 0%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 forced-colors:hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at var(--mq-rays-origin-x, 50%) var(--mq-rays-origin-y, 0%), var(--mq-rays-glow, rgba(253,186,116,0.3)), transparent 58%)",
        }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(3,5,12,0.14),rgba(3,5,12,0.62))] forced-colors:hidden" />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { lightRaysVariants };
