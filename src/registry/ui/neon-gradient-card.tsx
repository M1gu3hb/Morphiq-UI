"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Neon Gradient Card
 *
 * A semantic content surface wrapped in an animated neon frame. The glow is a
 * blurred conic gradient that rotates behind an opaque surface, so it reads as a
 * ring of light around the card while the content sits on solid material — the
 * legibility never depends on the effect. Pure CSS: the rotation is a local
 * `@keyframes` that travels with the component, with no animation library and
 * no global stylesheet.
 *
 * `prefers-reduced-motion` freezes the glow to a static frame; `forced-colors`
 * removes it and restores a system boundary.
 *
 * Local theming knobs:
 *
 *   --mq-body      surface colour
 *   --mq-lit       top gradient colour
 *   --mq-text      primary foreground
 *   --mq-muted     secondary foreground inherited by helper content
 *   --mq-brd       visible boundary
 *   --mq-neon-1..3 the neon frame's gradient stops (tinted per material)
 *   --mq-radius    corner radius (set by size)
 *   --mq-ring      focus ring
 */

/**
 * The rotation keyframe travels with the component. React 19 hoists this and
 * deduplicates it by `href`, so a wall of neon cards emits one rule, not one per
 * instance. `rotate` is the standalone property Tailwind v4 writes its rotate
 * utilities to, and it is what the frame animates — there is no `transform`
 * anywhere for it to fight with.
 */
const NEON_KEYFRAMES = `@keyframes mq-neon-spin{to{rotate:1turn}}`;

function NeonKeyframes() {
  return (
    <style href="mq-neon-spin" precedence="medium">
      {NEON_KEYFRAMES}
    </style>
  );
}

const neonGradientCardVariants = cva(
  [
    "group relative isolate rounded-[var(--mq-radius,24px)] text-left",
    "focus-within:outline-2 focus-within:outline-offset-[3px]",
    "focus-within:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-within:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#f6e7dd] [--mq-lit:#fff3ea] [--mq-text:#33261e] [--mq-muted:#6a5346]",
          "[--mq-brd:#9b6750] [--mq-ring:#171817]",
          "[--mq-neon-1:#ff9077] [--mq-neon-2:#ffd0a8] [--mq-neon-3:#c9482f]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(255,255,255,0.82)] [--mq-lit:rgba(255,255,255,0.96)] [--mq-text:#1e1e1b] [--mq-muted:#36362f]",
          "[--mq-brd:rgba(23,24,23,0.5)] [--mq-ring:#171817]",
          "[--mq-neon-1:#7de0ff] [--mq-neon-2:#c6b4ff] [--mq-neon-3:#4aa8ff]",
        ].join(" "),
        skeuo: [
          "[--mq-body:#e6e3da] [--mq-lit:#f6f4ee] [--mq-text:#23231f] [--mq-muted:#4a4943]",
          "[--mq-brd:#77746d] [--mq-ring:#171817]",
          "[--mq-neon-1:#cdb4ff] [--mq-neon-2:#a0f0d0] [--mq-neon-3:#8a7bd8]",
        ].join(" "),
        adaptive: [
          "[--mq-body:#ffffff] [--mq-lit:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
          "[--mq-brd:#76766f] [--mq-ring:#171817]",
          "[--mq-neon-1:#4ade80] [--mq-neon-2:#8be9ff] [--mq-neon-3:#1f9d55]",
          "dark:[--mq-body:#232327] dark:[--mq-lit:#2d2d32] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
          "dark:[--mq-brd:#a9a8a2] dark:[--mq-ring:#f1efe9]",
          "dark:[--mq-neon-1:#6effa0] dark:[--mq-neon-2:#9be0ff] dark:[--mq-neon-3:#2fd07a]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-radius:18px] min-h-[128px]",
        md: "[--mq-radius:24px] min-h-[160px]",
        lg: "[--mq-radius:30px] min-h-[196px]",
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

/** The rotating neon disc. Blurred, so its square corners never read. */
const NEON_FRAME_STYLE: React.CSSProperties = {
  backgroundImage:
    "conic-gradient(from 0deg, var(--mq-neon-1, #ff9077), var(--mq-neon-2, #ffd0a8), var(--mq-neon-3, #c9482f), var(--mq-neon-1, #ff9077))",
};

const SURFACE_SIZE = {
  sm: "rounded-[inherit] p-[16px]",
  md: "rounded-[inherit] p-[22px]",
  lg: "rounded-[inherit] p-[28px]",
} as const;

type NeonCardMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type NeonCardVariant = "default";
type NeonCardSize = "sm" | "md" | "lg";

export type NeonGradientCardProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof neonGradientCardVariants>, "material" | "variant" | "size"> & {
    material?: NeonCardMaterial;
    variant?: NeonCardVariant;
    size?: NeonCardSize;
  };

export function NeonGradientCard({
  children,
  className,
  material = "clay",
  size = "md",
  variant = "default",
  ...props
}: NeonGradientCardProps) {
  return (
    <div
      {...props}
      className={cn(neonGradientCardVariants({ material, size, variant }), className)}
      data-material={material}
    >
      <NeonKeyframes />
      {/* The glow: a blurred conic disc a few pixels larger than the surface,
          rotating behind it. A sibling painted before the surface, so it sits
          underneath and only its bleed shows as a ring — no negative z-index,
          which would paint above the surface background. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-[3px] rounded-[inherit] blur-[11px]",
          "animate-[mq-neon-spin_7s_linear_infinite] motion-reduce:animate-none",
          // A gradient is a background image, which forced colours preserve, so
          // the frame is cleared by hand or it would paint over the system UI.
          "forced-colors:hidden",
        )}
        style={NEON_FRAME_STYLE}
      />
      <article
        className={cn(
          "relative flex size-full flex-col gap-[10px] overflow-hidden border text-left",
          "text-[color:var(--mq-text,#33261e)] border-[var(--mq-brd,#9b6750)]",
          "[background-color:var(--mq-body,#f6e7dd)]",
          "[background-image:linear-gradient(180deg,var(--mq-lit,#fff3ea),var(--mq-body,#f6e7dd))]",
          "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
          SURFACE_SIZE[size],
        )}
      >
        {children}
      </article>
    </div>
  );
}

export { neonGradientCardVariants };
