import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const GRADIENT_MESH_KEYFRAMES = `@keyframes mq-gradient-mesh{0%,100%{background-position:0% 18%,100% 8%,18% 100%,82% 92%;opacity:.76}50%{background-position:36% 0%,72% 54%,0% 72%,100% 40%;opacity:1}}`;

function GradientMeshKeyframes() {
  return (
    <style href="mq-gradient-mesh" precedence="medium">
      {GRADIENT_MESH_KEYFRAMES}
    </style>
  );
}

const gradientMeshVariants = cva(
  [
    "relative isolate overflow-hidden bg-[var(--mq-mesh-bg,#080c18)] text-[color:var(--mq-mesh-fg,#f8fafc)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        aurora:
          "[--mq-mesh-a:#22d3ee] [--mq-mesh-b:#8b5cf6] [--mq-mesh-c:#ec4899] [--mq-mesh-d:#34d399]",
        ember:
          "[--mq-mesh-a:#fb7185] [--mq-mesh-b:#f97316] [--mq-mesh-c:#a855f7] [--mq-mesh-d:#facc15]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-5",
        md: "min-h-[280px] rounded-[24px] p-7",
        lg: "min-h-[380px] rounded-[30px] p-9",
      },
    },
    defaultVariants: { variant: "aurora", size: "md" },
  },
);

type GradientMeshVariant = "aurora" | "ember";
type GradientMeshSize = "sm" | "md" | "lg";
type GradientMeshStyle = React.CSSProperties &
  Partial<Record<"--mq-mesh-a" | "--mq-mesh-b" | "--mq-mesh-c" | "--mq-mesh-d" | "--mq-mesh-intensity", string>>;

export type GradientMeshProps = Omit<React.ComponentPropsWithRef<"div">, "color"> &
  Omit<VariantProps<typeof gradientMeshVariants>, "variant" | "size"> & {
    variant?: GradientMeshVariant;
    size?: GradientMeshSize;
    height?: React.CSSProperties["minHeight"];
    intensity?: number;
    colors?: readonly [string, string, string, string];
  };

export function GradientMesh({
  children,
  className,
  colors,
  height,
  intensity = 0.9,
  size = "md",
  style,
  variant = "aurora",
  ...props
}: GradientMeshProps) {
  const safeIntensity = Math.min(1, Math.max(0.2, intensity));
  const meshStyle: GradientMeshStyle = {
    ...style,
    minHeight: height ?? style?.minHeight,
    "--mq-mesh-intensity": String(safeIntensity),
    ...(colors
      ? {
          "--mq-mesh-a": colors[0],
          "--mq-mesh-b": colors[1],
          "--mq-mesh-c": colors[2],
          "--mq-mesh-d": colors[3],
        }
      : {}),
  };

  return (
    <div
      {...props}
      className={cn(gradientMeshVariants({ variant, size }), className)}
      data-material="adaptive"
      style={meshStyle}
    >
      <GradientMeshKeyframes />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-18%] z-0 animate-[mq-gradient-mesh_18s_ease-in-out_infinite] opacity-[var(--mq-mesh-intensity,0.9)] motion-reduce:animate-none forced-colors:hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 12%, var(--mq-mesh-a, #22d3ee), transparent 38%), radial-gradient(circle at 88% 10%, var(--mq-mesh-b, #8b5cf6), transparent 40%), radial-gradient(circle at 16% 88%, var(--mq-mesh-c, #ec4899), transparent 42%), radial-gradient(circle at 86% 86%, var(--mq-mesh-d, #34d399), transparent 38%)",
          backgroundSize: "150% 150%, 165% 165%, 155% 155%, 145% 145%",
          filter: "saturate(1.15)",
        }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[rgba(3,7,18,0.58)] forced-colors:hidden" />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { gradientMeshVariants };
