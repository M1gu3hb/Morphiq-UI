"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Card
 *
 * Self-contained by design: every material recipe lives in this file. It does
 * not read `:root` custom properties and it does not depend on any class from
 * a global stylesheet, so copying this file (plus `src/lib/cn.ts`) into another
 * project reproduces the full look.
 *
 * Theming knobs are local CSS variables declared on the card itself, each used
 * with a literal fallback. Because custom properties inherit, the subcomponents
 * below read the same tokens without any React context — `<Card>` is the single
 * place that decides material and density:
 *
 *   --mq-body    surface color
 *   --mq-lit     top highlight color (gradient materials)
 *   --mq-edge    extruded bottom edge color
 *   --mq-text    primary foreground color
 *   --mq-muted   secondary foreground color (descriptions, meta)
 *   --mq-rule    hairline color for the footer divider
 *   --mq-brd     border color
 *   --mq-ring    focus ring color
 *   --mq-pad     inner padding
 *   --mq-gap     vertical rhythm between sections
 *   --mq-radius  corner radius
 *   --mq-title   title font size
 *
 * Contrast contract: on every filled material both `--mq-text` and `--mq-muted`
 * stay at or above 4.5:1 against the surface — for glass, against a white and a
 * black backdrop alike, because glass must never borrow its legibility from
 * whatever happens to sit behind it. The `outline` variant is transparent by
 * design and therefore inherits the host's text color instead of pinning one.
 */

/**
 * Focus ring. Declared for real `:focus-visible`, for `:focus-within` (so a card
 * that merely *contains* the link is outlined when that link is tabbed to), and
 * identically for a `data-focus="true"` attribute so documentation surfaces and
 * visual-regression tests can render the focused look without synthesising a
 * keyboard event.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * `:focus-within` is scoped to interactive cards only. On an inert card that
 * merely contains a button, outlining the whole card as well as the button
 * double-rings the same focus and reads as two separate targets.
 */
const FOCUS_WITHIN_RING =
  "focus-within:outline-2 focus-within:outline-offset-[3px] " +
  "focus-within:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-within:outline-[Highlight]";

const cardVariants = cva(
  [
    "relative isolate flex flex-col",
    "border text-left",
    "gap-[var(--mq-gap,14px)] p-[var(--mq-pad,22px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    // `translate`, not `transform`: Tailwind v4's `translate-*` utilities write
    // the standalone `translate` property (`.translate-x-0{translate:var(...)}`),
    // so listing `transform` here animated nothing and the interactive hover
    // lift snapped instead of moving. Nothing in this file sets `transform` —
    // no rotate, scale, skew or arbitrary transform — so it is dropped rather
    // than kept alongside.
    "transition-[translate,box-shadow,background-color,backdrop-filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    // Shadows and translucency are erased in forced-colors mode, so the card
    // would dissolve into the page. A system-colored border keeps its bounds.
    "forced-colors:border-[CanvasText]",
    FOCUS_RING,
    // Non-interactive states, driven by `data-state` so the busy look never
    // inherits the faded disabled look.
    "data-[state=disabled]:opacity-55",
    "data-[state=disabled]:hover:translate-y-0 data-[state=disabled]:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#f6e7dd)]",
          "border-[var(--mq-brd,rgba(120,80,55,0.16))]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)] [--mq-shadow-hover:inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_10px_0_var(--mq-edge,#dcc4b2),0_26px_44px_rgba(90,60,45,0.189)] [--mq-shadow-press:inset_0_3px_4px_rgba(255,255,255,0.938),inset_0_-5px_8px_rgba(140,90,60,0.15),0_3px_0_var(--mq-edge,#dcc4b2),0_7px_12px_rgba(90,60,45,0.136)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(255,255,255,0.66))]",
          "border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.85),0_23px_55px_rgba(24,20,40,0.236)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),0_6px_15px_rgba(24,20,40,0.17)]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_9px_0_var(--mq-edge,#a8a49b),0_20px_32px_rgba(38,36,31,0.283)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.175),0_2px_0_var(--mq-edge,#a8a49b),0_6px_9px_rgba(38,36,31,0.204)]",
        ].join(" "),
        // Polymorphic: almost no ornament. It adapts instead — palette follows
        // the color scheme, rhythm follows the pointer type. Unlike the Button's
        // ghost intent, flipping on `prefers-color-scheme` is safe here because
        // the surface is opaque and flips together with the text.
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)] [--mq-shadow-hover:0_1px_3px_rgba(20,20,18,0.118),0_14px_35px_rgba(20,20,18,0.071)] [--mq-shadow-press:0_0px_1px_rgba(20,20,18,0.085),0_4px_10px_rgba(20,20,18,0.051)]",
          // Only ever *grows* the rhythm: padding stays owned by the size axis,
          // so this cannot shrink `lg` on a touch device. The underscores are
          // Tailwind's escape for the spaces `calc()` requires around `+`.
          "pointer-coarse:gap-[calc(var(--mq-gap,14px)_+_4px)]",
        ].join(" "),
        // Liquid glass: a refracting pane. It reuses the glass tokens (in the
        // compound variants below) so body and muted text keep glass's measured
        // contrast; the refraction, the chromatic rim and the specular filo are
        // decoration layered on top.
        "liquid-glass": [
          "bg-[var(--mq-body,rgba(255,255,255,0.66))]",
          "border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          // Frosted base, always on, as one arbitrary property — the fallback.
          "[backdrop-filter:blur(16px)_saturate(1.7)]",
          "[-webkit-backdrop-filter:blur(16px)_saturate(1.7)]",
          // Enhancement where `url()` in backdrop-filter is parsed: refract the
          // backdrop through the inlined filter, blur+saturate re-declared so the
          // frost survives, and no `-webkit-` here (Chromium would clobber it).
          "supports-[backdrop-filter:url('#m')]:[backdrop-filter:url(#mq-liquid-glass)_blur(16px)_saturate(1.7)]",
          // Specular filo + chromatic fringe + cool cast shadow. The hover and
          // press variants keep the same four layers in the same inset order so
          // an interactive card's shadow interpolates rather than swapping.
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_1.5px_0_0_rgba(120,190,255,0.24),inset_-1.5px_0_0_rgba(255,120,190,0.20),0_16px_38px_rgba(24,20,40,0.20)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.92),inset_1.5px_0_0_rgba(120,190,255,0.28),inset_-1.5px_0_0_rgba(255,120,190,0.24),0_24px_55px_rgba(24,20,40,0.26)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),inset_1.5px_0_0_rgba(120,190,255,0.20),inset_-1.5px_0_0_rgba(255,120,190,0.18),0_7px_16px_rgba(24,20,40,0.17)]",
          // Forced colours discard the backdrop filter and shadows; the border
          // keeps the card's bounds once the glass is gone.
          "forced-colors:[backdrop-filter:none] forced-colors:shadow-none forced-colors:border-[CanvasText]",
        ].join(" "),
      },
      variant: {
        default: "",
        elevated: "",
        outline: "",
      },
      size: {
        sm: "[--mq-pad:16px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:15px]",
        md: "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:17px]",
        lg: "[--mq-pad:28px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:20px]",
      },
      /**
       * Visual affordance for a card whose whole surface leads somewhere.
       *
       * It does NOT fake button semantics on a container: a `role="button"` div
       * makes its contents presentational to some assistive tech and cannot
       * legally contain the links and buttons cards usually hold. Use `asChild`
       * with an `<a>` when the entire card is one link, or leave the card inert
       * and let a real control inside it own the interaction — `:focus-within`
       * above draws the ring either way.
       */
      interactive: {
        true:
          "cursor-pointer hover:-translate-y-[2px] motion-reduce:hover:translate-y-0 " +
          // The lift and the shadow tell the same story: the card rises and its
          // contact shadow grows with it, then collapses when pressed. Each
          // surface derives its own hover and press lists from the resting one,
          // so the layer count and the inset order always match and `box-shadow`
          // interpolates instead of swapping discretely.
          "hover:shadow-[var(--mq-shadow-hover,0_14px_35px_rgba(20,20,18,0.12))] " +
          // Press sinks below the resting plane — the same language the Button
          // uses, so a card that leads somewhere feels like the same material.
          "active:translate-y-[1px] " +
          "active:shadow-[var(--mq-shadow-press,0_4px_10px_rgba(20,20,18,0.09))] " +
          // Both are pure feedback nobody has to read — the card is already a
          // link or a button — so reduced motion cancels them outright rather
          // than keeping an end state.
          "motion-reduce:active:translate-y-0 " +
          `${FOCUS_WITHIN_RING}`,
        false: "",
      },
    },
    compoundVariants: [
      // ---------------------------------------------------------------- clay
      {
        material: "clay",
        variant: "default",
        class:
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817]",
      },
      {
        material: "clay",
        variant: "elevated",
        class:
          "[--mq-body:#fff3ea] [--mq-edge:#d8bda9] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.14)] [--mq-ring:#171817] " +
          "shadow-[inset_0_4px_5px_rgba(255,255,255,0.85),inset_0_-6px_10px_rgba(140,90,60,0.14),0_11px_0_var(--mq-edge,#d8bda9),0_26px_44px_rgba(90,60,45,0.22)] [--mq-shadow-hover:inset_0_4px_5px_rgba(255,255,255,0.85),inset_0_-6px_10px_rgba(140,90,60,0.14),0_16px_0_var(--mq-edge,#d8bda9),0_38px_64px_rgba(90,60,45,0.26)] [--mq-shadow-press:inset_0_4px_5px_rgba(255,255,255,0.98),inset_0_-6px_10px_rgba(140,90,60,0.175),0_4px_0_var(--mq-edge,#d8bda9),0_10px_18px_rgba(90,60,45,0.187)]",
      },
      {
        material: "clay",
        variant: "outline",
        class:
          "[--mq-body:transparent] [--mq-edge:transparent] [--mq-brd:rgba(120,80,55,0.34)] " +
          "[--mq-rule:rgba(120,80,55,0.26)] [--mq-ring:currentColor] shadow-none",
      },
      // --------------------------------------------------------------- glass
      {
        material: "glass",
        variant: "default",
        class:
          // `--mq-muted` is #36362f rather than a lighter grey: at 0.66 opacity
          // this tint composites to #a8a8a8 over a black backdrop, where a
          // lighter muted measured only 4.27:1. This holds at 5.14:1 there and
          // 12.17:1 over white.
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        variant: "elevated",
        class:
          "[--mq-body:rgba(255,255,255,0.78)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.9)] [--mq-ring:#171817] " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_26px_54px_rgba(24,20,40,0.28)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.95),0_38px_78px_rgba(24,20,40,0.33)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),0_10px_22px_rgba(24,20,40,0.238)]",
      },
      {
        material: "glass",
        variant: "outline",
        class:
          "[--mq-body:transparent] [--mq-brd:rgba(255,255,255,0.85)] " +
          "[--mq-rule:rgba(255,255,255,0.5)] [--mq-ring:currentColor] " +
          "backdrop-blur-none backdrop-saturate-100 shadow-none",
      },
      // -------------------------------------------------------- liquid-glass
      // Tokens mirror the glass intents so body and muted text keep glass's
      // measured contrast; only the refraction and chromatic rim differ.
      {
        material: "liquid-glass",
        variant: "default",
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817]",
      },
      {
        material: "liquid-glass",
        variant: "elevated",
        class:
          "[--mq-body:rgba(255,255,255,0.78)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.9)] [--mq-ring:#171817]",
      },
      {
        material: "liquid-glass",
        variant: "outline",
        class:
          "[--mq-body:transparent] [--mq-brd:rgba(255,255,255,0.85)] " +
          "[--mq-rule:rgba(255,255,255,0.5)] [--mq-ring:currentColor] " +
          // Outline has no pane to refract, so it drops back to a hairline.
          "[backdrop-filter:none] [-webkit-backdrop-filter:none] shadow-none",
      },
      // --------------------------------------------------------------- skeuo
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817]",
      },
      {
        material: "skeuo",
        variant: "elevated",
        class:
          "[--mq-lit:#fbfaf6] [--mq-body:#dedad0] [--mq-edge:#9c988f] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.3)] [--mq-ring:#171817] " +
          "shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_7px_rgba(0,0,0,0.16),0_10px_0_var(--mq-edge,#9c988f),0_24px_36px_rgba(38,36,31,0.3)] [--mq-shadow-hover:inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_7px_rgba(0,0,0,0.16),0_14px_0_var(--mq-edge,#9c988f),0_35px_52px_rgba(38,36,31,0.354)] [--mq-shadow-press:inset_0_2px_0_rgba(255,255,255,0.98),inset_0_-4px_7px_rgba(0,0,0,0.2),0_4px_0_var(--mq-edge,#9c988f),0_10px_14px_rgba(38,36,31,0.255)]",
      },
      {
        material: "skeuo",
        variant: "outline",
        class:
          "[--mq-lit:transparent] [--mq-body:transparent] [--mq-edge:transparent] " +
          "[--mq-brd:rgba(25,25,23,0.38)] [--mq-rule:rgba(25,25,23,0.26)] [--mq-ring:currentColor] " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.55)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.688)]",
      },
      // ------------------------------------------------------------ adaptive
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        variant: "elevated",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.10)] [--mq-ring:#171817] " +
          "shadow-[0_2px_4px_rgba(20,20,18,0.10),0_22px_44px_rgba(20,20,18,0.16)] [--mq-shadow-hover:0_3px_6px_rgba(20,20,18,0.118),0_32px_64px_rgba(20,20,18,0.189)] [--mq-shadow-press:0_1px_2px_rgba(20,20,18,0.085),0_9px_18px_rgba(20,20,18,0.136)] " +
          "dark:[--mq-body:#2a2a2f] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.14)] dark:[--mq-ring:#f1efe9] " +
          "dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_22px_44px_rgba(0,0,0,0.55)] [--mq-shadow-hover:0_3px_6px_rgba(0,0,0,0.59),0_32px_64px_rgba(0,0,0,0.649)] [--mq-shadow-press:0_1px_2px_rgba(0,0,0,0.425),0_9px_18px_rgba(0,0,0,0.468)]",
      },
      {
        material: "adaptive",
        variant: "outline",
        class:
          "[--mq-body:transparent] [--mq-brd:rgba(23,24,23,0.28)] [--mq-rule:rgba(23,24,23,0.16)] " +
          "[--mq-ring:currentColor] shadow-none " +
          "dark:[--mq-brd:rgba(255,255,255,0.3)] dark:[--mq-rule:rgba(255,255,255,0.18)]",
      },
      // The outline variant has no surface of its own, so pinning a text colour
      // would be guessing at the host's background. It inherits instead — the
      // same reasoning (and the same `currentColor`, never `inherit`) as the
      // Button's ghost intent: a CSS-wide keyword written into a custom property
      // is resolved as that property inheriting its parent's unset value, which
      // makes it invalid and silently falls back to the material default.
      {
        variant: "outline",
        class: "[--mq-text:currentColor] [--mq-muted:currentColor]",
      },
    ],
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
      interactive: false,
    },
  },
);

export type CardProps = React.ComponentPropsWithRef<"div"> &
  VariantProps<typeof cardVariants> & {
    /** Render the child element instead of a `<div>`, merging props onto it. */
    asChild?: boolean;
    /** Marks the card busy: sets `aria-busy` and sweeps a shimmer over it. */
    loading?: boolean;
    /** Fades the card and, when interactive, removes the hover affordance. */
    disabled?: boolean;
  };

/**
 * Busy overlay. Purely decorative and inert, so it is hidden from assistive
 * tech — `aria-busy` on the card is what actually carries the meaning.
 *
 * Uses Tailwind's built-in `animate-pulse` rather than a custom sweep: a
 * bespoke `@keyframes` would have to live in a global stylesheet, which is
 * exactly the dependency this component refuses to have. Under
 * `prefers-reduced-motion` the pulse stops and a static wash remains, so the
 * busy state is still visible without any movement.
 */
function Shimmer() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-10 rounded-[inherit]",
        "bg-[rgba(255,255,255,0.42)] animate-pulse motion-reduce:animate-none",
      )}
    />
  );
}

/**
 * The SVG displacement filter referenced by the `liquid-glass` recipe from
 * `backdrop-filter: url(#mq-liquid-glass)`. Inlined so the material stays
 * self-contained, rendered as a zero-size aria-hidden sibling of the card only
 * when that material is active — a sibling, not a child, so it never disturbs
 * `asChild`. The id is shared with the same filter in `button.tsx`; both copies
 * are byte-identical, so a page with both resolves to one and the reference is
 * stable. The static seed leaves nothing for reduced-motion to switch off.
 */
function LiquidGlassFilter() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute size-0" focusable="false">
      <filter
        colorInterpolationFilters="sRGB"
        height="140%"
        id="mq-liquid-glass"
        width="140%"
        x="-20%"
        y="-20%"
      >
        <feTurbulence baseFrequency="0.012 0.014" numOctaves="1" result="noise" seed="7" type="fractalNoise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

export function Card({
  asChild = false,
  children,
  className,
  disabled = false,
  interactive,
  loading = false,
  material,
  size,
  variant,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot : "div";
  const state = disabled ? "disabled" : loading ? "loading" : "idle";
  const isLiquidGlass = material === "liquid-glass";

  return (
    <>
      {isLiquidGlass ? <LiquidGlassFilter /> : null}
      {/* `props` is spread first on purpose: the accessibility and state
          attributes below are derived from `loading`/`disabled` and must win
          over anything a caller passes through. */}
      <Comp
        {...props}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        className={cn(cardVariants({ material, variant, size, interactive }), className)}
        data-material={material ?? "clay"}
        data-state={state}
      >
        {loading ? <Shimmer /> : null}
        {children}
      </Comp>
    </>
  );
}

/**
 * Header block. Wraps rather than truncates, so a title sitting next to a badge
 * degrades to two rows in a narrow card instead of clipping.
 */
export function CardHeader({ className, ...props }: React.ComponentPropsWithRef<"div">) {
  return (
    <div
      {...props}
      className={cn("flex flex-wrap items-start justify-between gap-[10px]", className)}
    />
  );
}

export type CardTitleProps = React.ComponentPropsWithRef<"h3"> & {
  /**
   * Render the child element instead of an `<h3>`.
   *
   * Heading rank has to match the document outline around the card, and only
   * the page knows that — so the level is deliberately overridable rather than
   * hardcoded.
   */
  asChild?: boolean;
};

export function CardTitle({ asChild = false, className, ...props }: CardTitleProps) {
  const Comp = asChild ? Slot : "h3";
  return (
    <Comp
      {...props}
      className={cn(
        "m-0 font-extrabold tracking-[-0.02em]",
        // Size and colour are both `text-*` utilities, so each carries an
        // explicit data-type hint: without it `tailwind-merge` reads them as one
        // conflicting group and silently drops the first. `leading-*` comes
        // after the font-size for the same reason — font-size conflicts with
        // leading, so a line-height declared before it would be dropped.
        "text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.2]",
        className,
      )}
    />
  );
}

export function CardDescription({ className, ...props }: React.ComponentPropsWithRef<"p">) {
  return (
    <p
      {...props}
      className={cn(
        "m-0 text-[color:var(--mq-muted,#5c5b55)] text-[length:12px] leading-[1.65]",
        className,
      )}
    />
  );
}

export function CardBody({ className, ...props }: React.ComponentPropsWithRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col gap-[8px] text-[color:var(--mq-text,#2b2b26)] text-[length:13px] leading-[1.65]",
        className,
      )}
    />
  );
}

export type CardFooterProps = React.ComponentPropsWithRef<"div"> & {
  /** Draws a hairline above the footer, inset by the card's padding. */
  divided?: boolean;
};

export function CardFooter({ className, divided = false, ...props }: CardFooterProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-wrap items-center gap-[10px]",
        divided &&
          "border-t border-[var(--mq-rule,rgba(23,24,23,0.14))] pt-[var(--mq-gap,14px)]",
        className,
      )}
    />
  );
}

export { cardVariants };
