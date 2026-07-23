import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const PLUS_KEYFRAMES = `@keyframes mq-plus-pattern{0%,100%{mask-position:0 0;-webkit-mask-position:0 0;opacity:.54}50%{mask-position:18px 18px;-webkit-mask-position:18px 18px;opacity:1}}`;

function PlusKeyframes() {
  return (
    <style href="mq-plus-pattern" precedence="medium">
      {PLUS_KEYFRAMES}
    </style>
  );
}

const plusPatternVariants = cva(
  [
    "relative isolate overflow-hidden bg-[var(--mq-plus-bg,#f7f4ed)] text-[color:var(--mq-plus-fg,#171817)]",
    "dark:[--mq-plus-bg:#0e1118] dark:[--mq-plus-fg:#f8fafc]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        drift: "[--mq-plus-color:rgba(79,70,229,0.34)] [--mq-plus-glow:rgba(129,140,248,0.1)]",
        pulse: "[--mq-plus-color:rgba(219,39,119,0.34)] [--mq-plus-glow:rgba(244,114,182,0.12)]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-5",
        md: "min-h-[280px] rounded-[24px] p-7",
        lg: "min-h-[380px] rounded-[30px] p-9",
      },
    },
    defaultVariants: { variant: "drift", size: "md" },
  },
);

type PlusVariant = "drift" | "pulse";
type PlusSize = "sm" | "md" | "lg";
type PlusStyle = React.CSSProperties &
  Partial<Record<"--mq-plus-color" | "--mq-plus-intensity" | "--mq-plus-cell", string>>;

export type PlusPatternProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof plusPatternVariants>, "variant" | "size"> & {
    variant?: PlusVariant;
    size?: PlusSize;
    height?: React.CSSProperties["minHeight"];
    intensity?: number;
    cellSize?: number;
    color?: string;
  };

export function PlusPattern({
  cellSize = 34,
  children,
  className,
  color,
  height,
  intensity = 0.78,
  size = "md",
  style,
  variant = "drift",
  ...props
}: PlusPatternProps) {
  const safeCellSize = Math.min(64, Math.max(22, cellSize));
  const safeIntensity = Math.min(1, Math.max(0.2, intensity));
  const containerStyle: PlusStyle = {
    ...style,
    minHeight: height ?? style?.minHeight,
    "--mq-plus-cell": `${safeCellSize}px`,
    "--mq-plus-intensity": String(safeIntensity),
    ...(color ? { "--mq-plus-color": color } : {}),
  };

  return (
    <div
      {...props}
      className={cn(plusPatternVariants({ variant, size }), className)}
      data-material="adaptive"
      style={containerStyle}
    >
      <PlusKeyframes />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 animate-[mq-plus-pattern_9s_ease-in-out_infinite] opacity-[var(--mq-plus-intensity,0.78)] motion-reduce:animate-none forced-colors:hidden"
        style={{
          backgroundColor: "var(--mq-plus-color, rgba(79,70,229,0.34))",
          maskImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 34 34'%3E%3Cpath d='M17 11v12M11 17h12' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\")",
          maskSize: "var(--mq-plus-cell, 34px) var(--mq-plus-cell, 34px)",
          WebkitMaskImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 34 34'%3E%3Cpath d='M17 11v12M11 17h12' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\")",
          WebkitMaskSize:
            "var(--mq-plus-cell, 34px) var(--mq-plus-cell, 34px)",
        }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[color:var(--mq-plus-bg,#f7f4ed)] opacity-25 [mask-image:linear-gradient(to_bottom,transparent,#000_22%,#000_78%,transparent)] forced-colors:hidden" />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { plusPatternVariants };
