import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const TOPOGRAPHY_KEYFRAMES = `@keyframes mq-topography{0%{stroke-dashoffset:0;transform:translate3d(0,0,0)}50%{transform:translate3d(-10px,8px,0)}100%{stroke-dashoffset:-120;transform:translate3d(0,0,0)}}`;

function TopographyKeyframes() {
  return (
    <style href="mq-topography" precedence="medium">
      {TOPOGRAPHY_KEYFRAMES}
    </style>
  );
}

const topographyVariants = cva(
  [
    "relative isolate overflow-hidden bg-[var(--mq-topo-bg,#0b1615)] text-[color:var(--mq-topo-fg,#f7faf8)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        contours: "[--mq-topo-line:rgba(110,231,183,0.5)] [--mq-topo-fill:rgba(16,185,129,0.12)]",
        terrain: "[--mq-topo-line:rgba(253,186,116,0.52)] [--mq-topo-fill:rgba(234,88,12,0.12)] [--mq-topo-bg:#18100b]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-5",
        md: "min-h-[280px] rounded-[24px] p-7",
        lg: "min-h-[380px] rounded-[30px] p-9",
      },
    },
    defaultVariants: { variant: "contours", size: "md" },
  },
);

type TopographyVariant = "contours" | "terrain";
type TopographySize = "sm" | "md" | "lg";
type TopographyStyle = React.CSSProperties &
  Partial<Record<"--mq-topo-line" | "--mq-topo-intensity", string>>;

const CONTOURS = [
  "M-40 56 C78 2 146 112 272 54 S476 -8 604 68 S808 132 940 42",
  "M-60 104 C62 44 158 158 286 98 S492 36 622 112 S818 172 958 92",
  "M-48 154 C76 92 174 208 306 148 S516 82 650 164 S836 222 970 140",
  "M-70 208 C58 146 188 258 322 202 S530 138 672 214 S850 270 982 194",
  "M-50 260 C72 204 190 312 326 260 S542 198 682 270 S866 320 980 250",
] as const;

export type TopographyProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof topographyVariants>, "variant" | "size"> & {
    variant?: TopographyVariant;
    size?: TopographySize;
    height?: React.CSSProperties["minHeight"];
    intensity?: number;
    lineColor?: string;
    speed?: number;
  };

export function Topography({
  children,
  className,
  height,
  intensity = 0.82,
  lineColor,
  size = "md",
  speed = 1,
  style,
  variant = "contours",
  ...props
}: TopographyProps) {
  const safeIntensity = Math.min(1, Math.max(0.2, intensity));
  const safeSpeed = Math.max(0.45, speed);
  const containerStyle: TopographyStyle = {
    ...style,
    minHeight: height ?? style?.minHeight,
    "--mq-topo-intensity": String(safeIntensity),
    ...(lineColor ? { "--mq-topo-line": lineColor } : {}),
  };

  return (
    <div
      {...props}
      className={cn(topographyVariants({ variant, size }), className)}
      data-material="adaptive"
      style={containerStyle}
    >
      <TopographyKeyframes />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 size-full opacity-[var(--mq-topo-intensity,0.82)] forced-colors:hidden"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 900 320"
      >
        <path d="M0 320V210C110 144 190 250 310 190S520 112 650 188S790 224 900 158V320Z" fill="var(--mq-topo-fill, rgba(16,185,129,0.12))" />
        {CONTOURS.map((path, index) => (
          <path
            className="animate-[mq-topography_24s_linear_infinite] motion-reduce:animate-none"
            d={path}
            fill="none"
            key={path}
            opacity={1 - index * 0.1}
            stroke="var(--mq-topo-line, rgba(110,231,183,0.5))"
            strokeDasharray="10 8"
            strokeWidth={1.5}
            style={{
              animationDelay: `${-index * 2.4}s`,
              animationDuration: `${(22 + index * 2) / safeSpeed}s`,
            }}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(3,8,8,0.18),rgba(3,8,8,0.58))] forced-colors:hidden" />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { topographyVariants };
