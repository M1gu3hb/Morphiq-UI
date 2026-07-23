import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const STARFIELD_KEYFRAMES = `@keyframes mq-star-drift{0%{background-position:0 0,20px 18px;opacity:.48}50%{opacity:1}100%{background-position:72px 120px,96px 156px;opacity:.54}}@keyframes mq-star-near{0%,100%{transform:translate3d(0,0,0) scale(1);opacity:.62}50%{transform:translate3d(-12px,18px,0) scale(1.02);opacity:1}}`;

function StarfieldKeyframes() {
  return (
    <style href="mq-starfield" precedence="medium">
      {STARFIELD_KEYFRAMES}
    </style>
  );
}

const starfieldVariants = cva(
  [
    "relative isolate overflow-hidden bg-[var(--mq-stars-bg,#050814)] text-[color:var(--mq-stars-fg,#f8fafc)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        deep: "[--mq-stars-a:#ffffff] [--mq-stars-b:#93c5fd] [--mq-stars-glow:rgba(147,197,253,0.8)]",
        dawn: "[--mq-stars-a:#fff7ed] [--mq-stars-b:#f9a8d4] [--mq-stars-glow:rgba(249,168,212,0.74)] [--mq-stars-bg:#140a18]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-5",
        md: "min-h-[280px] rounded-[24px] p-7",
        lg: "min-h-[380px] rounded-[30px] p-9",
      },
    },
    defaultVariants: { variant: "deep", size: "md" },
  },
);

type StarfieldVariant = "deep" | "dawn";
type StarfieldSize = "sm" | "md" | "lg";
type StarfieldStyle = React.CSSProperties &
  Partial<Record<"--mq-stars-a" | "--mq-stars-b" | "--mq-stars-intensity", string>>;

const STAR_LAYER_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, var(--mq-stars-a, #ffffff) 0 1px, transparent 1.4px), radial-gradient(circle, var(--mq-stars-b, #93c5fd) 0 1.2px, transparent 1.7px)",
  backgroundSize: "44px 44px, 68px 68px",
};

export type StarfieldProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof starfieldVariants>, "variant" | "size"> & {
    variant?: StarfieldVariant;
    size?: StarfieldSize;
    height?: React.CSSProperties["minHeight"];
    intensity?: number;
    colors?: readonly [string, string];
  };

export function Starfield({
  children,
  className,
  colors,
  height,
  intensity = 0.86,
  size = "md",
  style,
  variant = "deep",
  ...props
}: StarfieldProps) {
  const safeIntensity = Math.min(1, Math.max(0.2, intensity));
  const starStyle: StarfieldStyle = {
    ...style,
    minHeight: height ?? style?.minHeight,
    "--mq-stars-intensity": String(safeIntensity),
    ...(colors ? { "--mq-stars-a": colors[0], "--mq-stars-b": colors[1] } : {}),
  };

  return (
    <div
      {...props}
      className={cn(starfieldVariants({ variant, size }), className)}
      data-material="adaptive"
      style={starStyle}
    >
      <StarfieldKeyframes />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-20%] z-0 animate-[mq-star-drift_24s_linear_infinite] opacity-[var(--mq-stars-intensity,0.86)] motion-reduce:animate-none forced-colors:hidden"
        style={STAR_LAYER_STYLE}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 animate-[mq-star-near_12s_ease-in-out_infinite] bg-[radial-gradient(circle_at_18%_24%,var(--mq-stars-a,#ffffff)_0_1.5px,transparent_2px),radial-gradient(circle_at_72%_18%,var(--mq-stars-b,#93c5fd)_0_1.5px,transparent_2.2px),radial-gradient(circle_at_84%_72%,var(--mq-stars-a,#ffffff)_0_1px,transparent_1.8px),radial-gradient(circle_at_36%_82%,var(--mq-stars-b,#93c5fd)_0_1.3px,transparent_2px)] shadow-[inset_0_0_70px_rgba(5,8,20,0.62)] motion-reduce:animate-none forced-colors:hidden"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(3,5,14,0.08),rgba(3,5,14,0.56))] forced-colors:hidden" />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { starfieldVariants };
