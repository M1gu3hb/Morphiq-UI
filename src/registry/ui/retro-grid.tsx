"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Retro Grid
 *
 * A full-bleed container with a perspective grid that scrolls toward the
 * horizon. Pure CSS: a plane rotated with `perspective`, a repeating
 * linear-gradient grid, and a local `@keyframes` that scrolls the grid's
 * position — no animation library, no global stylesheet, a single agnostic
 * style. A mask fades the grid out toward the horizon.
 *
 * The grid is an `aria-hidden` layer behind the content; children sit on top and
 * carry their own contrast. `prefers-reduced-motion` freezes the scroll and
 * `forced-colors` removes the grid, leaving a plain system surface.
 *
 * Local theming knobs:
 *
 *   --mq-bg    base surface behind the grid
 *   --mq-fg    suggested content colour (inherited by children)
 *   --mq-line  grid line colour
 */

const RETRO_GRID_KEYFRAMES = `@keyframes mq-retro-grid{to{background-position:0 -60px,0 -60px}}`;

function RetroGridKeyframes() {
  return (
    <style href="mq-retro-grid" precedence="medium">
      {RETRO_GRID_KEYFRAMES}
    </style>
  );
}

const retroGridVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#0a0a14)] text-[color:var(--mq-fg,#f4f6ff)]",
    "[--mq-line:rgba(120,180,255,0.4)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-[20px]",
        md: "min-h-[280px] rounded-[24px] p-[28px]",
        lg: "min-h-[380px] rounded-[30px] p-[36px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/**
 * The receding plane. Two 1px linear-gradients make the grid; a rotateX lays it
 * flat into the distance, and the mask fades it toward the horizon so the far
 * edge dissolves instead of ending in a hard line.
 */
const RETRO_GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, var(--mq-line, rgba(120,180,255,0.4)) 1px, transparent 1px), linear-gradient(to bottom, var(--mq-line, rgba(120,180,255,0.4)) 1px, transparent 1px)",
  backgroundSize: "60px 60px, 60px 60px",
  transform: "perspective(320px) rotateX(58deg)",
  transformOrigin: "50% 0%",
  WebkitMaskImage: "linear-gradient(to top, #000 12%, transparent 78%)",
  maskImage: "linear-gradient(to top, #000 12%, transparent 78%)",
};

type RetroGridVariant = "default";
type RetroGridSize = "sm" | "md" | "lg";

export type RetroGridProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof retroGridVariants>, "variant" | "size"> & {
    /** Agnostic background: `material` is accepted for catalog parity and only
     *  reflected on `data-material`. The effect is a single style. */
    material?: MaterialSlug;
    variant?: RetroGridVariant;
    size?: RetroGridSize;
  };

export function RetroGrid({
  children,
  className,
  material = "adaptive",
  size = "md",
  variant = "default",
  ...props
}: RetroGridProps) {
  return (
    <div
      {...props}
      className={cn(retroGridVariants({ size, variant }), className)}
      data-material={material}
    >
      <RetroGridKeyframes />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute bottom-0 left-[-50%] right-[-50%] top-[-10%] z-0",
          "animate-[mq-retro-grid_1.6s_linear_infinite] motion-reduce:animate-none",
          "forced-colors:hidden",
        )}
        style={RETRO_GRID_STYLE}
      />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { retroGridVariants };
