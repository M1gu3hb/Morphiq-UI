"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Skeleton
 *
 * A loading placeholder. Self-contained by design: all four material recipes
 * live in this file, every local custom property carries a literal fallback,
 * and no class comes from the site's global stylesheet — including the
 * `@keyframes`, which ship with the component rather than living in a global
 * sheet a copier would have to find.
 *
 * The keyframes are emitted through React 19's hoisted `<style href precedence>`.
 * React deduplicates by `href`, so a page with fifty skeletons still has exactly
 * one rule, and the component stays copy-and-own with nothing to wire up.
 *
 * Accessibility: a skeleton is decorative — it stands for content that is not
 * there yet, so it carries `aria-hidden` by default and announces nothing. The
 * *region* is what should speak. Wrap it:
 *
 *   <div aria-busy={loading} aria-live="polite">
 *     {loading ? <Skeleton variant="line" /> : <p>{text}</p>}
 *   </div>
 *
 * or, when the wait is worth interrupting for, give the wrapper
 * `role="status"` so the change is announced when it resolves. Marking every
 * individual bar instead would announce "loading" once per bar, which is noise.
 *
 * Local theming knobs:
 *
 *   --mq-base   the placeholder surface
 *   --mq-sheen  the travelling highlight
 */

/**
 * Keyframes travel with the component.
 *
 * `background-position` is animated rather than `transform` on a pseudo-element:
 * it needs no extra node, and it cannot collide with a caller's own transform.
 */
const SHIMMER_KEYFRAMES = `@keyframes mq-skeleton-shimmer{from{background-position:150% 0}to{background-position:-50% 0}}`;

function SkeletonKeyframes() {
  // React 19 hoists this to <head> and deduplicates it by `href`, so rendering
  // many skeletons emits one rule, not one per instance.
  return (
    <style href="mq-skeleton-shimmer" precedence="medium">
      {SHIMMER_KEYFRAMES}
    </style>
  );
}

/**
 * Palette per material. Low-key, but not invisible: a placeholder nobody can
 * see is just a blank page. Each opaque fill is held to at least 1.35:1 against
 * the page it sits on — no WCAG rule demands it, since a decorative placeholder
 * is exempt from 1.4.11, but a skeleton that cannot be made out is not doing
 * the one job it has.
 *
 * Glass is the awkward one: a translucent fill takes its lightness from
 * whatever is behind it, so no single tint can stay visible over both a white
 * and a black backdrop. It gets both — a dark wash that carries it on light
 * surfaces and a bright edge that carries it on dark ones, which is also what
 * frosted glass actually looks like.
 */
const MATERIAL_TOKENS = {
  clay: "[--mq-base:#ddcaba] [--mq-sheen:rgba(255,255,255,0.72)]",
  glass: [
    "[--mq-base:rgba(41,37,32,0.16)] [--mq-sheen:rgba(255,255,255,0.55)]",
    "[--mq-edge:rgba(255,255,255,0.45)]",
  ].join(" "),
  skeuo: "[--mq-base:#cfcbc2] [--mq-sheen:rgba(255,255,255,0.70)]",
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  adaptive: [
    "[--mq-base:#d0cec6] [--mq-sheen:rgba(255,255,255,0.80)]",
    "dark:[--mq-base:#313137] dark:[--mq-sheen:rgba(255,255,255,0.12)]",
  ].join(" "),
} as const;

type SkeletonMaterial = keyof typeof MATERIAL_TOKENS;
type SkeletonVariant = "line" | "circle" | "rect";
type SkeletonSize = "sm" | "md" | "lg";

const skeletonVariants = cva(
  [
    "block shrink-0",
    // Written as explicit properties rather than `bg-*` utilities: the colour
    // and the gradient would otherwise land in the same `tailwind-merge` group
    // and one would silently drop the other.
    "[background-color:var(--mq-base,#ddcaba)]",
    "[background-image:linear-gradient(100deg,transparent_35%,var(--mq-sheen,rgba(255,255,255,0.72))_50%,transparent_65%)]",
    "[background-size:220%_100%] [background-repeat:no-repeat]",
    // Only glass sets an edge; for every other material this resolves to
    // `transparent` and draws nothing.
    "[box-shadow:inset_0_0_0_1px_var(--mq-edge,transparent)]",
    "animate-[mq-skeleton-shimmer_1.6s_ease-in-out_infinite]",
    // Reduced motion leaves a calm, *static* block rather than a pulse: a
    // placeholder that keeps blinking is exactly what someone with a motion
    // sensitivity asked not to see. Dropping the gradient leaves the flat base.
    "motion-reduce:animate-none motion-reduce:[background-image:none]",
    // Forced colours discard the fill entirely, so the placeholder would occupy
    // space while showing nothing. An outline keeps the shape legible.
    "forced-colors:border forced-colors:border-[GrayText] forced-colors:[background-image:none]",
  ].join(" "),
  {
    variants: {
      material: MATERIAL_TOKENS,
      variant: {
        line: "w-full rounded-full",
        circle: "aspect-square rounded-full",
        rect: "w-full",
      },
      size: { sm: "", md: "", lg: "" },
    },
    compoundVariants: [
      // Each shape scales on the dimension that means something for it: a line
      // by its height, a circle by its diameter, a block by its own height and
      // corner radius.
      { variant: "line", size: "sm", class: "h-[9px]" },
      { variant: "line", size: "md", class: "h-[12px]" },
      { variant: "line", size: "lg", class: "h-[15px]" },
      { variant: "circle", size: "sm", class: "size-[32px]" },
      { variant: "circle", size: "md", class: "size-[40px]" },
      { variant: "circle", size: "lg", class: "size-[52px]" },
      { variant: "rect", size: "sm", class: "h-[72px] rounded-[10px]" },
      { variant: "rect", size: "md", class: "h-[104px] rounded-[13px]" },
      { variant: "rect", size: "lg", class: "h-[136px] rounded-[16px]" },
    ],
    defaultVariants: { material: "clay", variant: "line", size: "md" },
  },
);

export type SkeletonProps = React.ComponentPropsWithRef<"div"> & {
  material?: SkeletonMaterial;
  variant?: SkeletonVariant;
  size?: SkeletonSize;
};

export function Skeleton({
  className,
  material = "clay",
  size = "md",
  variant = "line",
  ...props
}: SkeletonProps) {
  return (
    <>
      <SkeletonKeyframes />
      <div
        // Decorative by default: the placeholder stands for absent content, so
        // it has nothing to announce. The surrounding region carries the
        // `aria-busy` — see the note at the top of this file. A caller can still
        // override this by passing their own `aria-hidden`.
        aria-hidden="true"
        {...props}
        className={cn(skeletonVariants({ material, variant, size }), className)}
        data-material={material}
      />
    </>
  );
}

export { skeletonVariants };
