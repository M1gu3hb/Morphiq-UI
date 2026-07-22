"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Dot Pattern
 *
 * A full-bleed container tiled with a dot grid behind its content. Pure CSS: a
 * single repeated radial-gradient, with an optional radial mask that fades the
 * dots out toward the edges. No animation, no library, no global stylesheet — a
 * single agnostic style.
 *
 * The dots are an `aria-hidden` layer behind the content; children sit on top
 * and carry their own contrast. `forced-colors` removes the pattern, leaving a
 * plain system surface. There is nothing to animate, so reduced motion is a
 * no-op.
 *
 * Local theming knobs:
 *
 *   --mq-bg   base surface behind the dots
 *   --mq-fg   suggested content colour (inherited by children)
 *   --mq-dot  dot colour
 */

const dotPatternVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#ffffff)] text-[color:var(--mq-fg,#1c1c19)]",
    "[--mq-dot:rgba(23,24,23,0.22)]",
    "dark:[--mq-bg:#101014] dark:[--mq-fg:#f1efe9] dark:[--mq-dot:rgba(255,255,255,0.24)]",
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

const DOT_STYLE: React.CSSProperties = {
  backgroundImage: "radial-gradient(var(--mq-dot, rgba(23,24,23,0.22)) 1.1px, transparent 1.1px)",
  backgroundSize: "18px 18px",
};

type DotPatternVariant = "default" | "faded";
type DotPatternSize = "sm" | "md" | "lg";

export type DotPatternProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof dotPatternVariants>, "variant" | "size"> & {
    /** Agnostic background: `material` is accepted for catalog parity and only
     *  reflected on `data-material`. The effect is a single style. */
    material?: MaterialSlug;
    variant?: DotPatternVariant;
    size?: DotPatternSize;
  };

export function DotPattern({
  children,
  className,
  material = "adaptive",
  size = "md",
  variant = "default",
  ...props
}: DotPatternProps) {
  return (
    <div
      {...props}
      className={cn(dotPatternVariants({ size, variant }), className)}
      data-material={material}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-0",
          // `faded` dissolves the dots toward the edges with a radial mask so the
          // pattern reads as a vignette rather than a hard-edged tile.
          variant === "faded" &&
            "[mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_78%)]",
          "forced-colors:hidden",
        )}
        style={DOT_STYLE}
      />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { dotPatternVariants };
