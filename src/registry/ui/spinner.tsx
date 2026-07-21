"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Spinner
 *
 * An indeterminate "working on it" indicator. Distinct from its neighbours by
 * intent, not just looks: `Skeleton` stands in for content whose shape is
 * already known, `Progress` reports how far along a task is, and this one says
 * only that something is happening and cannot say how long for.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and the rotation keyframes
 * ship with the component rather than in a global stylesheet a copier would
 * have to find. They are emitted through React 19's hoisted
 * `<style href precedence>`, which deduplicates by `href`, so a page with many
 * spinners still carries one rule.
 *
 * Accessibility: the ring is decorative and carries `aria-hidden`. The wrapper
 * is the `role="status"` live region, and it always contains real **text** —
 * either the visible `label` or a visually hidden fallback.
 *
 * That distinction is the whole point, and it is the usual way this component
 * is got wrong: a live region is announced by its *contents*, not by its name.
 * `role="status"` whose only child is `aria-hidden`, relying on `aria-label`
 * for meaning, passes a static audit — the name is right there in the
 * accessibility tree — and then says nothing at all when it actually mounts.
 * Firefox is explicit about it, mapping a nameless status to a role that skips
 * subtree name computation entirely. So the name here is carried by an sr-only
 * text node, not by `aria-label`.
 *
 * `sr-only` is the clip-rect technique. `display:none` or `visibility:hidden`
 * would remove the text from the accessibility tree too, which is the other
 * half of this same mistake.
 *
 * Local theming knobs:
 *
 *   --mq-track  the full ring behind the arc
 *   --mq-arc    the moving arc
 *   --mq-label  visible label colour
 *   --mq-size   ring diameter
 *   --mq-width  ring thickness
 */

/**
 * Keyframes travel with the component.
 *
 * `rotate` is the standalone property rather than `transform: rotate(...)`, so
 * a caller who puts their own `transform` on the spinner does not fight the
 * animation for the same property.
 */
const SPINNER_KEYFRAMES = `@keyframes mq-spinner-rotate{to{rotate:1turn}}`;

function SpinnerKeyframes() {
  // React 19 hoists this to <head> and deduplicates it by `href`, so rendering
  // many spinners emits one rule, not one per instance.
  return (
    <style href="mq-spinner-rotate" precedence="medium">
      {SPINNER_KEYFRAMES}
    </style>
  );
}

/**
 * Palette per material.
 *
 * The arc is held to at least 3:1 against its own track — WCAG 1.4.11, which
 * does apply here: the spinner is not decoration, it is the only thing on
 * screen saying the interface is still alive.
 */
const MATERIAL_TOKENS = {
  clay: "[--mq-track:#f0dcd0] [--mq-arc:#9f2f23] [--mq-label:#3a2b22]",
  // Translucent track, so the arc has to hold up over whatever shows through.
  // A lighter track failed over dark backdrops; 0.62 is where it stops failing.
  glass:
    "[--mq-track:rgba(255,255,255,0.62)] [--mq-arc:#0b3f4c] [--mq-label:#24313a]",
  skeuo: "[--mq-track:#d6d0c4] [--mq-arc:#3f4641] [--mq-label:#29261f]",
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  adaptive: [
    "[--mq-track:#d8dad5] [--mq-arc:#171817] [--mq-label:#171817]",
    "dark:[--mq-track:#42443f] dark:[--mq-arc:#f5f3ee] dark:[--mq-label:#f5f3ee]",
  ].join(" "),
} as const;

type SpinnerMaterial = keyof typeof MATERIAL_TOKENS;
type SpinnerVariant = "ring" | "arc";
type SpinnerSize = "sm" | "md" | "lg";

const wrapperVariants = cva("inline-flex items-center gap-[var(--mq-gap,9px)] align-middle", {
  variants: {
    material: MATERIAL_TOKENS,
    size: {
      sm: "[--mq-size:16px] [--mq-width:2px] [--mq-gap:7px] [--mq-font:11px]",
      md: "[--mq-size:22px] [--mq-width:3px] [--mq-gap:9px] [--mq-font:12px]",
      lg: "[--mq-size:32px] [--mq-width:4px] [--mq-gap:11px] [--mq-font:13px]",
    },
  },
  defaultVariants: { material: "clay", size: "md" },
});

const ringVariants = cva(
  [
    "block shrink-0 rounded-full",
    "size-[var(--mq-size,22px)]",
    // The border trick: a full ring in the track colour, with a subset of the
    // sides repainted in the arc colour. Rotating that ring reads as an arc
    // travelling around a track — two tones from two properties, no gradient,
    // no mask, no extra element.
    "border-[length:var(--mq-width,3px)] border-solid",
    "border-[color:var(--mq-track,#f0dcd0)]",
    "animate-[mq-spinner-rotate_0.85s_linear_infinite]",
    // Reduced motion stops the rotation outright, leaving a still two-tone
    // ring. The meaning does not depend on the movement: it is carried by the
    // `role="status"` text, which is present either way.
    //
    // This is a deliberate call against the common alternative of substituting
    // a slow opacity pulse or merely slowing the rotation. Both keep animating
    // something, and the point of the preference is to stop. Nothing in WCAG
    // compels either choice — honouring the preference at all is AAA territory,
    // and only SC 2.3.1 (nothing flashing above 3Hz) is binding, which a static
    // ring satisfies trivially and a pulse only satisfies if tuned carefully.
    // The cost is honest: a frozen ring is a weaker "still working" signal than
    // a moving one, which is exactly why the text is not optional here.
    "motion-reduce:animate-none",
    // Forced colours discard author border colours; naming system colours keeps
    // both tones, and keeps them distinguishable from each other.
    "forced-colors:border-[GrayText]",
  ].join(" "),
  {
    variants: {
      variant: {
        // A quarter arc: three sides track, one side arc.
        arc: [
          "border-t-[color:var(--mq-arc,#9f2f23)]",
          "forced-colors:border-t-[CanvasText]",
        ].join(" "),
        // A half ring: two adjacent sides arc, reads heavier and slower.
        ring: [
          "border-t-[color:var(--mq-arc,#9f2f23)] border-r-[color:var(--mq-arc,#9f2f23)]",
          "forced-colors:border-t-[CanvasText] forced-colors:border-r-[CanvasText]",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "arc" },
  },
);

export type SpinnerProps = Omit<React.ComponentPropsWithRef<"div">, "role"> & {
  material?: SpinnerMaterial;
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  /**
   * Visible text beside the ring. When present it also becomes the accessible
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
  ringClassName?: string;
  labelClassName?: string;
};

/**
 * Whether a node would actually put text on the page.
 *
 * `label != null` is not good enough here. A live region is announced by its
 * contents, so a label that renders to nothing — `""` from a missed i18n
 * lookup, or the `false` a `cond && text` expression collapses to — would send
 * the component down the "has a label" path and produce a region with no text
 * at all. That is silent to a screen reader while still looking correct on
 * screen and still passing a static audit, which is the exact failure this
 * component exists to avoid.
 */
function rendersText(node: React.ReactNode): boolean {
  if (node == null || typeof node === "boolean") return false;
  if (typeof node === "string") return node.trim() !== "";
  return true;
}

export function Spinner({
  className,
  label,
  labelClassName,
  material = "clay",
  ringClassName,
  size = "md",
  srLabel = "Loading",
  variant = "arc",
  ...props
}: SpinnerProps) {
  const hasVisibleLabel = rendersText(label);
  // A default parameter only fills in for `undefined`, so an explicit `""`
  // would otherwise reach the DOM as an empty announcement.
  const announced = srLabel.trim() === "" ? "Loading" : srLabel;

  return (
    <>
      <SpinnerKeyframes />
      <div
        {...props}
        // A live region rather than a plain graphic: what matters is that the
        // wait is announced when it begins, and `status` is the polite role for
        // that. No explicit `aria-live` — `role="status"` already implies
        // `aria-live="polite"` and `aria-atomic="true"`, and restating them adds
        // nothing but noise.
        className={cn(wrapperVariants({ material, size }), className)}
        data-material={material}
        role="status"
      >
        <span aria-hidden="true" className={cn(ringVariants({ variant }), ringClassName)} />
        {hasVisibleLabel ? (
          <span
            className={cn(
              "text-[length:var(--mq-font,12px)] leading-none font-bold",
              "text-[color:var(--mq-label,#3a2b22)] forced-colors:text-[CanvasText]",
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

export { ringVariants, wrapperVariants };
