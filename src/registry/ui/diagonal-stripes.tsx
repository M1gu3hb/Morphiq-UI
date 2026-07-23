import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const STRIPES_KEYFRAMES = `@keyframes mq-diagonal-stripes{0%{background-position:0 0}100%{background-position:var(--mq-stripe-size,28px) 0}}`;

function StripeKeyframes() {
  return (
    <style href="mq-diagonal-stripes" precedence="medium">
      {STRIPES_KEYFRAMES}
    </style>
  );
}

const diagonalStripesVariants = cva(
  [
    "relative isolate overflow-hidden bg-[var(--mq-stripes-bg,#111827)] text-[color:var(--mq-stripes-fg,#f9fafb)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        subtle: "[--mq-stripes-a:rgba(148,163,184,0.16)] [--mq-stripes-b:rgba(15,23,42,0.05)]",
        bold: "[--mq-stripes-a:rgba(251,113,133,0.34)] [--mq-stripes-b:rgba(124,58,237,0.18)]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-5",
        md: "min-h-[280px] rounded-[24px] p-7",
        lg: "min-h-[380px] rounded-[30px] p-9",
      },
    },
    defaultVariants: { variant: "subtle", size: "md" },
  },
);

type StripesVariant = "subtle" | "bold";
type StripesSize = "sm" | "md" | "lg";
type StripesStyle = React.CSSProperties &
  Partial<Record<"--mq-stripes-a" | "--mq-stripes-b" | "--mq-stripes-intensity" | "--mq-stripe-size", string>>;

export type DiagonalStripesProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof diagonalStripesVariants>, "variant" | "size"> & {
    variant?: StripesVariant;
    size?: StripesSize;
    height?: React.CSSProperties["minHeight"];
    intensity?: number;
    stripeSize?: number;
    speed?: number;
    colors?: readonly [string, string];
  };

export function DiagonalStripes({
  children,
  className,
  colors,
  height,
  intensity = 0.9,
  size = "md",
  speed = 1,
  stripeSize = 28,
  style,
  variant = "subtle",
  ...props
}: DiagonalStripesProps) {
  const safeIntensity = Math.min(1, Math.max(0.2, intensity));
  const safeStripeSize = Math.min(72, Math.max(12, stripeSize));
  const safeSpeed = Math.max(0.45, speed);
  const containerStyle: StripesStyle = {
    ...style,
    minHeight: height ?? style?.minHeight,
    "--mq-stripes-intensity": String(safeIntensity),
    "--mq-stripe-size": `${safeStripeSize}px`,
    ...(colors ? { "--mq-stripes-a": colors[0], "--mq-stripes-b": colors[1] } : {}),
  };

  return (
    <div
      {...props}
      className={cn(diagonalStripesVariants({ variant, size }), className)}
      data-material="adaptive"
      style={containerStyle}
    >
      <StripeKeyframes />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 animate-[mq-diagonal-stripes_3.5s_linear_infinite] opacity-[var(--mq-stripes-intensity,0.9)] motion-reduce:animate-none forced-colors:hidden"
        style={{
          animationDuration: `${3.5 / safeSpeed}s`,
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--mq-stripes-a, rgba(148,163,184,0.16)) 0, var(--mq-stripes-a, rgba(148,163,184,0.16)) calc(var(--mq-stripe-size, 28px) * .5), var(--mq-stripes-b, rgba(15,23,42,0.05)) calc(var(--mq-stripe-size, 28px) * .5), var(--mq-stripes-b, rgba(15,23,42,0.05)) var(--mq-stripe-size, 28px))",
          backgroundSize: "var(--mq-stripe-size, 28px) var(--mq-stripe-size, 28px)",
        }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[rgba(3,7,18,0.42)] forced-colors:hidden" />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { diagonalStripesVariants };
