import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const GRID_BEAMS_KEYFRAMES = `@keyframes mq-grid-beam{0%{transform:translate3d(-120%,0,0);opacity:0}18%{opacity:.92}72%{opacity:.58}100%{transform:translate3d(280%,0,0);opacity:0}}@keyframes mq-grid-flow{0%{background-position:0 0,0 0}100%{background-position:0 72px,72px 0}}`;

function GridBeamsKeyframes() {
  return (
    <style href="mq-grid-beams" precedence="medium">
      {GRID_BEAMS_KEYFRAMES}
    </style>
  );
}

const gridBeamsVariants = cva(
  [
    "relative isolate overflow-hidden bg-[var(--mq-beams-bg,#070815)] text-[color:var(--mq-beams-fg,#f8fafc)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        violet: "[--mq-beams-grid:rgba(139,92,246,0.28)] [--mq-beams-light:#c4b5fd] [--mq-beams-glow:rgba(139,92,246,0.62)]",
        cyan: "[--mq-beams-grid:rgba(34,211,238,0.26)] [--mq-beams-light:#67e8f9] [--mq-beams-glow:rgba(6,182,212,0.58)]",
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

type GridBeamsVariant = "violet" | "cyan";
type GridBeamsSize = "sm" | "md" | "lg";
type GridBeamsStyle = React.CSSProperties &
  Partial<Record<"--mq-beams-grid" | "--mq-beams-light" | "--mq-beams-intensity", string>>;

const GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(var(--mq-beams-grid, rgba(139,92,246,0.28)) 1px, transparent 1px), linear-gradient(90deg, var(--mq-beams-grid, rgba(139,92,246,0.28)) 1px, transparent 1px)",
  backgroundSize: "36px 36px",
  transform: "perspective(560px) rotateX(58deg) scale(1.45)",
  transformOrigin: "50% 100%",
};

export type GridBeamsProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof gridBeamsVariants>, "variant" | "size"> & {
    variant?: GridBeamsVariant;
    size?: GridBeamsSize;
    height?: React.CSSProperties["minHeight"];
    intensity?: number;
    gridColor?: string;
    beamColor?: string;
  };

export function GridBeams({
  beamColor,
  children,
  className,
  gridColor,
  height,
  intensity = 0.88,
  size = "md",
  style,
  variant = "violet",
  ...props
}: GridBeamsProps) {
  const safeIntensity = Math.min(1, Math.max(0.2, intensity));
  const containerStyle: GridBeamsStyle = {
    ...style,
    minHeight: height ?? style?.minHeight,
    "--mq-beams-intensity": String(safeIntensity),
    ...(gridColor ? { "--mq-beams-grid": gridColor } : {}),
    ...(beamColor ? { "--mq-beams-light": beamColor } : {}),
  };

  return (
    <div
      {...props}
      className={cn(gridBeamsVariants({ variant, size }), className)}
      data-material="adaptive"
      style={containerStyle}
    >
      <GridBeamsKeyframes />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-20%] bottom-[-48%] top-[10%] z-0 animate-[mq-grid-flow_11s_linear_infinite] opacity-[var(--mq-beams-intensity,0.88)] motion-reduce:animate-none forced-colors:hidden"
        style={GRID_STYLE}
      >
        {[18, 48, 76].map((top, index) => (
          <span
            className="absolute left-0 h-[2px] w-[46%] animate-[mq-grid-beam_7s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,var(--mq-beams-light,#c4b5fd),transparent)] shadow-[0_0_18px_3px_var(--mq-beams-glow,rgba(139,92,246,0.62))] motion-reduce:animate-none"
            key={top}
            style={{ animationDelay: `${-index * 2.1}s`, top: `${top}%` }}
          />
        ))}
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(7,8,21,0.22),rgba(7,8,21,0.62))] forced-colors:hidden" />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { gridBeamsVariants };
