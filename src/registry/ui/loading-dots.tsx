"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Loading Dots
 *
 * Three dots that say only that something is happening. It is the small,
 * inline cousin of `Spinner`: where the spinner occupies a fixed circle, this
 * one reads as a beat of typing or thinking next to a line of text.
 *
 * Material-agnostic on purpose. Unlike Alert or Card there is no surface to
 * give a clay/glass/skeuo identity to — a dot is a dot — so it ships a single
 * adaptive palette that follows the colour scheme. It still accepts a
 * `material` prop for API symmetry across the library, but that value only
 * lands on `data-material`; it never selects a visual recipe. All four values
 * are accepted so a caller threading a catalog-wide `StyleSlug` through never
 * hits a type error.
 *
 * Self-contained by design: the palette lives in this file, every local custom
 * property carries a literal fallback, and the bounce/pulse `@keyframes` ship
 * with the component through React 19's hoisted `<style href precedence>`,
 * which deduplicates by `href` — a page with many indicators still emits one
 * rule of each.
 *
 * Accessibility mirrors Spinner: the dots are decorative and carry
 * `aria-hidden`, and the wrapper is a `role="status"` live region that always
 * contains real **text** — either the visible `label` or a visually hidden
 * fallback. A live region is announced by its contents, not by its name, so a
 * status whose only child is `aria-hidden` and whose meaning sits in
 * `aria-label` passes a static audit and then says nothing when it mounts. The
 * text is not optional here.
 *
 * Local theming knobs:
 *
 *   --mq-dot       the dot fill
 *   --mq-label     the visible label colour
 *   --mq-dot-size  the dot diameter
 *   --mq-gap       spacing between dots and before the label
 *   --mq-font      the visible label size
 */

/**
 * Keyframes travel with the component. Both animate the standalone properties
 * Tailwind v4's utilities write — `translate`, `scale` and `opacity` — rather
 * than `transform`, so a caller who puts their own `transform` on the wrapper
 * never fights the animation for the same property.
 *
 * The resting frame of each is the dot's own default (no offset, full size,
 * full opacity), which is exactly what a reduced-motion reader is left with
 * once `animate-none` removes the loop: three still, fully legible dots.
 */
const DOTS_KEYFRAMES =
  "@keyframes mq-dots-bounce{0%,80%,100%{translate:0 0}40%{translate:0 -70%}}" +
  "@keyframes mq-dots-pulse{0%,80%,100%{opacity:0.35;scale:0.68}40%{opacity:1;scale:1}}";

function LoadingDotsKeyframes() {
  // React 19 hoists this to <head> and deduplicates it by `href`, so rendering
  // many indicators emits one rule of each, not one per instance.
  return (
    <style href="mq-loading-dots" precedence="medium">
      {DOTS_KEYFRAMES}
    </style>
  );
}

/**
 * The full animation shorthand per variant, one entry per dot so the delay is
 * baked into the shorthand rather than layered on as a separate
 * `animation-delay` utility a later class could reorder. The delays stagger the
 * three dots into a wave. Underscores are Tailwind's spaces; the commas inside
 * `cubic-bezier()` stay intact inside the arbitrary value, exactly as Alert's
 * `animate-[…cubic-bezier(…)…]` does.
 */
const DOT_ANIMATIONS = {
  bounce: [
    "animate-[mq-dots-bounce_1300ms_cubic-bezier(0.45,0,0.35,1)_0ms_infinite]",
    "animate-[mq-dots-bounce_1300ms_cubic-bezier(0.45,0,0.35,1)_160ms_infinite]",
    "animate-[mq-dots-bounce_1300ms_cubic-bezier(0.45,0,0.35,1)_320ms_infinite]",
  ],
  pulse: [
    "animate-[mq-dots-pulse_1300ms_ease-in-out_0ms_infinite]",
    "animate-[mq-dots-pulse_1300ms_ease-in-out_160ms_infinite]",
    "animate-[mq-dots-pulse_1300ms_ease-in-out_320ms_infinite]",
  ],
} as const;

/** The four catalog materials. Accepted for symmetry, reflected only on
 * `data-material`; none of them selects a visual recipe here. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type LoadingDotsVariant = keyof typeof DOT_ANIMATIONS;
type LoadingDotsSize = "sm" | "md" | "lg";

const DOT_COUNT = 3;
const DOT_INDICES = [0, 1, 2] as const;

const wrapperVariants = cva(
  [
    "inline-flex items-center gap-[var(--mq-gap,6px)] align-middle",
    // A single adaptive palette: near-black ink on light, warm paper on dark.
    // Set on the wrapper and read by each dot through the cascade, so one
    // declaration themes the whole group.
    "[--mq-dot:#171817] [--mq-label:#26251f]",
    "dark:[--mq-dot:#f5f3ee] dark:[--mq-label:#f5f3ee]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "[--mq-dot-size:6px] [--mq-gap:5px] [--mq-font:11px]",
        md: "[--mq-dot-size:9px] [--mq-gap:6px] [--mq-font:12px]",
        lg: "[--mq-dot-size:12px] [--mq-gap:8px] [--mq-font:13px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const dotBase = [
  "block shrink-0 rounded-full",
  "size-[var(--mq-dot-size,9px)]",
  // Colour and fill are the whole graphic. The arbitrary property keeps it out
  // of tailwind-merge's `bg-*` group and carries a literal fallback so the file
  // is copy-and-own.
  "[background-color:var(--mq-dot,#171817)]",
  // Reduced motion stops the loop outright, leaving three still dots at their
  // default position, size and opacity. The meaning is carried by the
  // role="status" text either way, so nothing is lost by freezing them — and a
  // dot that keeps bouncing is exactly what the preference asked to stop.
  "motion-reduce:animate-none",
  // Forced colours discard author fills, which would leave three invisible
  // holes. Painting the dot in CanvasText keeps it a solid, legible mark.
  "forced-colors:[background-color:CanvasText]",
].join(" ");

export type LoadingDotsProps = Omit<React.ComponentPropsWithRef<"div">, "role"> & {
  /** Accepted for API symmetry; reflected on `data-material` only, never used
   * to pick a visual recipe. */
  material?: MaterialSlug;
  /** `bounce` travels the dots up and back; `pulse` fades and scales them. */
  variant?: LoadingDotsVariant;
  size?: LoadingDotsSize;
  /**
   * Visible text beside the dots. When present it also becomes the accessible
   * name, so the region is never announced twice.
   */
  label?: React.ReactNode;
  /**
   * Text announced when no visible `label` is given. Rendered as a visually
   * hidden text node inside the live region — not as `aria-label`, which a live
   * region does not read. Defaults to "Loading"; override it to say what is
   * loading.
   */
  srLabel?: string;
  dotClassName?: string;
  labelClassName?: string;
};

/**
 * Whether a node would actually put text on the page.
 *
 * `label != null` is not enough: a live region is announced by its contents, so
 * a label that renders to nothing — `""` from a missed i18n lookup, or the
 * `false` a `cond && text` expression collapses to — would take the "has a
 * label" path and produce a region with no text at all. That is silent to a
 * screen reader while still passing a static audit, the exact failure the
 * fallback text exists to prevent.
 */
function rendersText(node: React.ReactNode): boolean {
  if (node == null || typeof node === "boolean") return false;
  if (typeof node === "string") return node.trim() !== "";
  // `count && node` yields the number 0 when count is 0 — the same footgun the
  // `false` guard above catches. A bare 0 (or NaN) is not an informative label,
  // so it must not suppress the "Loading" fallback or render a stray "0".
  if (typeof node === "number") return Number.isFinite(node) && node !== 0;
  return true;
}

export function LoadingDots({
  className,
  dotClassName,
  label,
  labelClassName,
  material = "adaptive",
  size = "md",
  srLabel = "Loading",
  variant = "bounce",
  ...props
}: LoadingDotsProps) {
  const hasVisibleLabel = rendersText(label);
  // A default parameter only fills in for `undefined`, so an explicit `""`
  // would otherwise reach the DOM as an empty announcement.
  const announced = srLabel.trim() === "" ? "Loading" : srLabel;
  const dotAnimations = DOT_ANIMATIONS[variant];

  return (
    <>
      <LoadingDotsKeyframes />
      <div
        {...props}
        // A live region rather than a plain graphic: what matters is that the
        // wait is announced when it begins, and `status` is the polite role for
        // that. No explicit `aria-live` — `role="status"` already implies
        // `aria-live="polite"` and `aria-atomic="true"`.
        className={cn(wrapperVariants({ size }), className)}
        data-material={material}
        data-variant={variant}
        role="status"
      >
        {DOT_INDICES.map((index) => (
          <span
            aria-hidden="true"
            className={cn(dotBase, dotAnimations[index % DOT_COUNT], dotClassName)}
            key={index}
          />
        ))}
        {hasVisibleLabel ? (
          <span
            className={cn(
              "text-[length:var(--mq-font,12px)] leading-none font-bold",
              "text-[color:var(--mq-label,#26251f)] forced-colors:text-[CanvasText]",
              labelClassName,
            )}
          >
            {label}
          </span>
        ) : (
          // Real text, not `aria-label`: the region is announced by what it
          // contains. `sr-only` keeps it out of the visual layout while leaving
          // it in the accessibility tree.
          <span className="sr-only">{announced}</span>
        )}
      </div>
    </>
  );
}

export { wrapperVariants };
