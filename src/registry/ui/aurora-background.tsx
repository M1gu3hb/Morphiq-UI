"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Aurora Background
 *
 * A full-bleed container that drifts soft aurora light behind its content. The
 * effect is pure CSS — layered radial gradients on a blurred sheet whose
 * position animates through a local `@keyframes` that travels with the component
 * — so there is no animation library and no global stylesheet. It is a single
 * agnostic style rather than a per-material recipe.
 *
 * The aurora is an `aria-hidden` layer behind the content; children sit on top
 * and carry their own contrast. `prefers-reduced-motion` freezes the drift and
 * `forced-colors` removes it entirely, leaving a plain system surface.
 *
 * Local theming knobs:
 *
 *   --mq-bg  base surface behind the aurora
 *   --mq-fg  suggested content colour (inherited by children)
 *   --mq-a1..a3  the aurora's gradient colours
 */

const AURORA_KEYFRAMES = `@keyframes mq-aurora{0%{background-position:0% 50%,100% 50%,50% 0%}50%{background-position:100% 50%,0% 50%,50% 100%}100%{background-position:0% 50%,100% 50%,50% 0%}}`;

function AuroraKeyframes() {
  return (
    <style href="mq-aurora" precedence="medium">
      {AURORA_KEYFRAMES}
    </style>
  );
}

const auroraBackgroundVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#0b1020)] text-[color:var(--mq-fg,#f4f6ff)]",
    // A fixed night-sky palette; agnostic to material, so the tokens live on the
    // base rather than in a per-material axis.
    "[--mq-a1:rgba(59,240,208,0.55)] [--mq-a2:rgba(139,92,246,0.55)] [--mq-a3:rgba(56,189,248,0.5)]",
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
 * The drifting sheet. Three radial gradients on a `200%` canvas whose position
 * loops; the heavy blur turns them into soft aurora bands. `will-change` keeps
 * the paint off the critical path.
 */
const AURORA_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(40% 55% at 20% 30%, var(--mq-a1, rgba(59,240,208,0.55)), transparent 70%), radial-gradient(45% 60% at 80% 25%, var(--mq-a2, rgba(139,92,246,0.55)), transparent 70%), radial-gradient(50% 55% at 50% 90%, var(--mq-a3, rgba(56,189,248,0.5)), transparent 72%)",
  backgroundSize: "200% 200%, 200% 200%, 200% 200%",
};

type AuroraBackgroundVariant = "default";
type AuroraBackgroundSize = "sm" | "md" | "lg";

export type AuroraBackgroundProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof auroraBackgroundVariants>, "variant" | "size"> & {
    /** Agnostic background: `material` is accepted for catalog parity and only
     *  reflected on `data-material`. The effect is a single style. */
    material?: MaterialSlug;
    variant?: AuroraBackgroundVariant;
    size?: AuroraBackgroundSize;
  };

export function AuroraBackground({
  children,
  className,
  material = "adaptive",
  size = "md",
  variant = "default",
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      {...props}
      className={cn(auroraBackgroundVariants({ size, variant }), className)}
      data-material={material}
    >
      <AuroraKeyframes />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-[-25%] z-0 blur-[64px] saturate-[125%]",
          "animate-[mq-aurora_18s_ease-in-out_infinite] motion-reduce:animate-none",
          "forced-colors:hidden",
        )}
        style={AURORA_STYLE}
      />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { auroraBackgroundVariants };
