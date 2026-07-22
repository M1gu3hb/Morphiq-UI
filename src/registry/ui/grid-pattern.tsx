"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Grid Pattern
 *
 * A full-bleed container tiled with a fine grid behind its content. Pure CSS:
 * two 1px linear-gradients, with an optional radial mask that fades the grid out
 * toward the edges. No animation, no library, no global stylesheet — a single
 * agnostic style.
 *
 * The grid is an `aria-hidden` layer behind the content; children sit on top and
 * carry their own contrast. `forced-colors` removes the pattern, leaving a plain
 * system surface. There is nothing to animate, so reduced motion is a no-op.
 *
 * Local theming knobs:
 *
 *   --mq-bg    base surface behind the grid
 *   --mq-fg    suggested content colour (inherited by children)
 *   --mq-line  grid line colour
 */

const gridPatternVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#ffffff)] text-[color:var(--mq-fg,#1c1c19)]",
    "[--mq-line:rgba(23,24,23,0.12)]",
    "dark:[--mq-bg:#101014] dark:[--mq-fg:#f1efe9] dark:[--mq-line:rgba(255,255,255,0.12)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        faded: "",
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

const GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, var(--mq-line, rgba(23,24,23,0.12)) 1px, transparent 1px), linear-gradient(to bottom, var(--mq-line, rgba(23,24,23,0.12)) 1px, transparent 1px)",
  backgroundSize: "26px 26px, 26px 26px",
};

type GridPatternVariant = "default" | "faded";
type GridPatternSize = "sm" | "md" | "lg";

export type GridPatternProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof gridPatternVariants>, "variant" | "size"> & {
    /** Agnostic background: `material` is accepted for catalog parity and only
     *  reflected on `data-material`. The effect is a single style. */
    material?: MaterialSlug;
    variant?: GridPatternVariant;
    size?: GridPatternSize;
  };

export function GridPattern({
  children,
  className,
  material = "adaptive",
  size = "md",
  variant = "default",
  ...props
}: GridPatternProps) {
  return (
    <div
      {...props}
      className={cn(gridPatternVariants({ size, variant }), className)}
      data-material={material}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-0",
          variant === "faded" &&
            "[mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_78%)]",
          "forced-colors:hidden",
        )}
        style={GRID_STYLE}
      />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { gridPatternVariants };
