"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const FLICKER_KEYFRAMES = `@keyframes mq-flickering-grid{0%,100%{opacity:.18}35%{opacity:.72}63%{opacity:.28}82%{opacity:.54}}`;

function FlickerKeyframes() {
  return (
    <style href="mq-flickering-grid" precedence="medium">
      {FLICKER_KEYFRAMES}
    </style>
  );
}

const flickeringGridVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#0d111b)] text-[color:var(--mq-fg,#f4f6fb)]",
    "[--mq-cell:rgba(125,211,252,0.38)] [--mq-cell-edge:rgba(186,230,253,0.18)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        subtle: "[--mq-cell:rgba(125,211,252,0.3)]",
        dense: "[--mq-cell:rgba(167,139,250,0.42)] [--mq-cell-edge:rgba(221,214,254,0.22)]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-[20px]",
        md: "min-h-[280px] rounded-[24px] p-[28px]",
        lg: "min-h-[380px] rounded-[30px] p-[36px]",
      },
    },
    defaultVariants: { variant: "subtle", size: "md" },
  },
);

type FlickeringGridVariant = "subtle" | "dense";
type FlickeringGridSize = "sm" | "md" | "lg";

export type FlickeringGridProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof flickeringGridVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: FlickeringGridVariant;
    size?: FlickeringGridSize;
  };

export function FlickeringGrid({
  children,
  className,
  material = "adaptive",
  size = "md",
  variant = "subtle",
  ...props
}: FlickeringGridProps) {
  const columns = variant === "dense" ? 8 : 6;
  const cellCount = columns * 6;

  return (
    <div
      {...props}
      className={cn(flickeringGridVariants({ size, variant }), className)}
      data-material={material}
    >
      <FlickerKeyframes />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-8px] z-0 grid gap-[3px] [mask-image:radial-gradient(ellipse_at_center,#000_25%,transparent_82%)] forced-colors:hidden"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cellCount }, (_unused, index) => (
          <span
            className={cn(
              "rounded-[3px] bg-[color:var(--mq-cell,rgba(125,211,252,0.38))]",
              "border border-[color:var(--mq-cell-edge,rgba(186,230,253,0.18))]",
              "animate-[mq-flickering-grid_3.4s_ease-in-out_infinite]",
              "motion-reduce:animate-none motion-reduce:opacity-35",
            )}
            key={index}
            style={{ animationDelay: `${-((index * 0.37) % 3.4)}s`, animationDuration: `${2.6 + (index % 7) * 0.31}s` }}
          />
        ))}
      </span>
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { flickeringGridVariants };
