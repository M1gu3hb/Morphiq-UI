"use client";

import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Loading Bar
 *
 * A thin, indeterminate top progress bar in the NProgress idiom: a highlighted
 * segment creeps across a track to say "a navigation is in flight" without ever
 * claiming to know how far along it is. Meant to be pinned to the top of the
 * viewport during route transitions, but it renders inline just as well (the
 * docs preview does exactly that).
 *
 * Agnostic by design — it ships a single adaptive light/dark recipe rather than
 * the four-material vocabulary, so it drops into any surface. The `material`
 * prop is accepted for catalog symmetry and reflected only on `data-material`;
 * it is not a style axis here.
 *
 * Self-contained: the creep keyframe travels with the component through React
 * 19's hoisted `<style href precedence>` (deduplicated by `href`, so a page can
 * never render more than one copy of the rule), every custom property carries a
 * literal fallback, and no class comes from a global stylesheet.
 *
 * Accessibility:
 *
 * - `role="progressbar"` with an `aria-label` ("Loading" by default) and NO
 *   `aria-valuenow`, which is exactly how an indeterminate progressbar is
 *   expressed. The state is therefore carried by role + name, never by colour.
 * - `prefers-reduced-motion` stops the creep and leaves a static partial bar
 *   anchored at the start — still perceivable, just not moving.
 * - Forced colours discard the fill and the glow; the bar falls back to
 *   `Highlight` over a `CanvasText` track so it stays visible.
 *
 * Local theming knobs (each used with a literal fallback):
 *
 *   --mq-track   track surface behind the travelling segment
 *   --mq-bar     the highlighted segment surface (accent)
 *   --mq-glow    soft leading glow around the segment
 *   --mq-height  bar thickness
 */

/**
 * The creep keyframe.
 *
 * `translate` and `scale` are the standalone individual-transform properties
 * Tailwind v4 writes its utilities to — animating them (rather than `transform`)
 * means a caller's own `transform` never fights this animation, and the
 * `transform-origin: left` (via `origin-left`) still applies to both. A segment
 * enters fully off the inline-start edge, widens as it crosses, and exits fully
 * off the inline-end edge; because both loop boundaries are off-screen the
 * infinite repeat has no visible seam.
 */
const LOADING_BAR_KEYFRAMES =
  "@keyframes mq-loading-bar-creep{0%{translate:-100% 0;scale:0.35 1}50%{translate:40% 0;scale:0.7 1}100%{translate:200% 0;scale:0.35 1}}";

function LoadingBarKeyframes() {
  return (
    <style href="mq-loading-bar-creep" precedence="medium">
      {LOADING_BAR_KEYFRAMES}
    </style>
  );
}

const loadingBarVariants = cva(
  [
    // The root IS the progressbar and the track. It is inert decoration for the
    // pointer — a route indicator should never intercept a click — so
    // pointer-events are off.
    "pointer-events-none relative isolate block w-full overflow-hidden",
    "h-[var(--mq-height,3px)]",
    "bg-[var(--mq-track,rgba(23,24,23,0.08))]",
    // Single adaptive recipe: the accent and track follow the colour scheme.
    "[--mq-track:rgba(23,24,23,0.08)] [--mq-bar:#171817] [--mq-glow:rgba(23,24,23,0.42)]",
    "dark:[--mq-track:rgba(255,255,255,0.10)] dark:[--mq-bar:#f5f3ee] dark:[--mq-glow:rgba(245,243,238,0.42)]",
    // Fills and shadows are discarded in forced-colours; a system-coloured track
    // keeps the bar's bounds perceivable once the author fill is gone.
    "forced-colors:bg-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      // Single-value axis: it exists so the catalog's variant contract has a
      // real option to select, and it changes nothing visually.
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-height:2px]",
        md: "[--mq-height:3px]",
        lg: "[--mq-height:5px]",
      },
      // Pins the bar to the top of the viewport (its usual home) or leaves it in
      // normal flow so it can be shown inline, as the preview does.
      fixed: {
        true: "fixed inset-x-0 top-0 z-[9999]",
        false: "relative",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fixed: false,
    },
  },
);

/**
 * The travelling segment. Decorative and inert: the progressbar role and its
 * name already carry the meaning, so a second announcement here would be noise.
 *
 * The resting state (`translate: 0 0; scale: 0.6 1` around the left origin) is
 * what a reduced-motion user sees once `animate-none` cancels the creep — a
 * static ~60% bar anchored at the start, which reads as "in progress" without
 * moving. When the animation runs, its keyframes override both values.
 */
const loadingBarIndicatorVariants = cva(
  [
    "pointer-events-none absolute inset-y-0 left-0 w-full origin-left rounded-full",
    "bg-[var(--mq-bar,#171817)]",
    // A thin top sheen for a little tactility. A literal gradient, so it needs no
    // fallback; cleared by hand in forced colours because background images
    // survive that mode untouched.
    "[background-image:linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0))]",
    // A soft leading glow, the NProgress signature. Shadows vanish in forced
    // colours, which is fine — the bar is still marked there by Highlight.
    "shadow-[0_0_8px_var(--mq-glow,rgba(23,24,23,0.42)),0_0_3px_var(--mq-glow,rgba(23,24,23,0.42))]",
    // Resting state (used verbatim under reduced motion).
    "[translate:0_0] [scale:0.6_1]",
    // The creep. It animates the standalone translate/scale set in the keyframe;
    // reduced motion cancels it outright and the resting state above remains.
    "animate-[mq-loading-bar-creep_1.6s_ease-in-out_infinite]",
    "motion-reduce:animate-none",
    "forced-colors:bg-[Highlight] forced-colors:[background-image:none] forced-colors:shadow-none",
  ].join(" "),
);

/** The four catalog materials. Accepted for symmetry, reflected on data only. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

export type LoadingBarProps = Omit<
  React.ComponentPropsWithRef<"div">,
  // `aria-label` is omitted so the accessible name has exactly one source — the
  // documented `label` prop — instead of a caller's aria-label being silently
  // overridden by the label-derived name.
  "children" | "role" | "aria-label"
> &
  VariantProps<typeof loadingBarVariants> & {
    /** Catalog material. Purely reflected on `data-material`; no visual effect. */
    material?: MaterialSlug;
    /**
     * Accessible name for the indeterminate bar. Defaults to "Loading". An empty
     * or whitespace-only value falls back to "Loading" so the bar is never
     * nameless.
     */
    label?: string;
  };

export function LoadingBar({
  className,
  fixed = false,
  label = "Loading",
  material,
  size = "md",
  variant = "default",
  ...props
}: LoadingBarProps) {
  const accessibleName = label.trim() === "" ? "Loading" : label;

  return (
    <>
      <LoadingBarKeyframes />
      <div
        {...props}
        // Indeterminate: role + accessible name, deliberately no aria-valuenow.
        aria-label={accessibleName}
        className={cn(loadingBarVariants({ variant, size, fixed }), className)}
        data-material={material ?? "adaptive"}
        data-state="loading"
        role="progressbar"
      >
        <span aria-hidden="true" className={loadingBarIndicatorVariants()} data-loading-bar-indicator="" />
      </div>
    </>
  );
}

export { loadingBarIndicatorVariants, loadingBarVariants };
