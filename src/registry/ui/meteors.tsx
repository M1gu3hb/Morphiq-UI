"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Meteors
 *
 * A full-bleed container with meteors streaking diagonally behind its content.
 * Pure CSS: each meteor is a thin gradient streak translated by a local
 * `@keyframes` that travels with the component — no animation library, no global
 * stylesheet, a single agnostic style. Positions and timing are derived from the
 * index, so the field is deterministic and safe to server-render.
 *
 * The meteors are an `aria-hidden` layer behind the content; children sit on top
 * and carry their own contrast. `prefers-reduced-motion` stops the streaks and
 * `forced-colors` removes them, leaving a plain system surface.
 *
 * Local theming knobs:
 *
 *   --mq-bg      base surface behind the meteors
 *   --mq-fg      suggested content colour (inherited by children)
 *   --mq-meteor  streak colour
 */

// `translate` and `opacity` are the only things that move; `rotate` is a static
// standalone property set per streak, so the keyframe never touches it.
const METEOR_KEYFRAMES = `@keyframes mq-meteor{0%{translate:0 0;opacity:0}6%{opacity:1}70%{opacity:1}100%{translate:-560px 560px;opacity:0}}`;

function MeteorKeyframes() {
  return (
    <style href="mq-meteor" precedence="medium">
      {METEOR_KEYFRAMES}
    </style>
  );
}

const meteorsVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#0a0a14)] text-[color:var(--mq-fg,#f4f6ff)]",
    "[--mq-meteor:#a9c7ff]",
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

/** How many streaks fill the field. Kept modest so the paint stays cheap. */
const METEOR_COUNT = 16;

type Meteor = { left: number; top: number; delay: number; duration: number };

/**
 * A deterministic field: every value comes from the index, so the server and
 * client render the same positions and hydration never mismatches — no
 * `Math.random`, which would differ across the boundary.
 */
const METEORS: Meteor[] = Array.from({ length: METEOR_COUNT }, (_unused, i) => ({
  left: (i * 61) % 100,
  top: (i * 37) % 45,
  delay: (i % 8) * 0.9,
  duration: 4 + (i % 5),
}));

type MeteorsVariant = "default";
type MeteorsSize = "sm" | "md" | "lg";

export type MeteorsProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof meteorsVariants>, "variant" | "size"> & {
    /** Agnostic background: `material` is accepted for catalog parity and only
     *  reflected on `data-material`. The effect is a single style. */
    material?: MaterialSlug;
    variant?: MeteorsVariant;
    size?: MeteorsSize;
  };

export function Meteors({
  children,
  className,
  material = "adaptive",
  size = "md",
  variant = "default",
  ...props
}: MeteorsProps) {
  return (
    <div
      {...props}
      className={cn(meteorsVariants({ size, variant }), className)}
      data-material={material}
    >
      <MeteorKeyframes />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 forced-colors:hidden">
        {METEORS.map((meteor, index) => (
          <span
            // The keyframe lives in a class so `motion-reduce:animate-none` can
            // override it; the per-streak delay and duration ride on inline
            // longhands, which the reduced-motion `animation: none` still wins
            // over because it clears the animation name.
            className={cn(
              "absolute h-[1.5px] w-[92px] rounded-full rotate-[215deg]",
              "bg-[linear-gradient(90deg,transparent,var(--mq-meteor,#a9c7ff))]",
              "shadow-[0_0_7px_1px_var(--mq-meteor,#a9c7ff)]",
              "animate-[mq-meteor_5s_linear_infinite] motion-reduce:animate-none",
            )}
            key={index}
            style={{
              left: `${meteor.left}%`,
              top: `${meteor.top}%`,
              animationDelay: `${meteor.delay}s`,
              animationDuration: `${meteor.duration}s`,
            }}
          />
        ))}
      </span>
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { meteorsVariants };
