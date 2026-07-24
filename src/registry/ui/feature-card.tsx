"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Feature Card
 *
 * ONE feature, told properly: a glyph sitting in a material well, an optional
 * eyebrow, a real heading, a description, and an optional "Learn more"
 * affordance. Distinct from `feature-grid`, which composes a whole section —
 * this is the single unit, so a page can lay out its own grid, bento or carousel
 * around it.
 *
 * Self-contained by design: the four material recipes (clay / glass / skeuo /
 * adaptive) are copied and owned here, straight from `card.tsx`, so dropping
 * this file plus `src/lib/cn.ts` into another project reproduces the full
 * tactile look with no global stylesheet, no `:root` custom properties and no
 * shared keyframes file. Every `var()` carries a literal fallback.
 *
 * Local theming knobs (custom properties declared on the card, inherited down):
 *
 *   --mq-body        surface colour
 *   --mq-lit         top highlight (skeuo gradient)
 *   --mq-edge        extruded bottom edge colour
 *   --mq-text        primary foreground
 *   --mq-muted       secondary foreground (description, unavailable marker)
 *   --mq-rule        hairline above the link row
 *   --mq-brd         border colour
 *   --mq-ring        focus ring colour
 *   --mq-acc         accent: the eyebrow and the glyph inside the well
 *   --mq-well-bg     icon well fill
 *   --mq-well-brd    icon well border
 *   --mq-well-shadow icon well depth (raised on clay, engraved on skeuo)
 *   --mq-wash        decorative corner atmosphere (background-image)
 *   --mq-pad         inner padding
 *   --mq-gap         vertical rhythm between blocks
 *   --mq-radius      corner radius
 *   --mq-title       heading font size
 *   --mq-desc        description / link font size
 *   --mq-eyebrow     eyebrow font size
 *   --mq-well        icon well box size
 *   --mq-icon        glyph size inside the well
 *
 * Contrast contract (inherited from the Card recipe): on every filled material
 * `--mq-text` and `--mq-muted` stay at or above 4.5:1 against the surface, and
 * the glass tokens carry their own tint so that holds over a white and a black
 * backdrop alike. `--mq-acc` is measured the same way because it paints the
 * eyebrow, which is real text: 6.8:1 on clay, 5.2:1 on glass over a black
 * backdrop, 7.0:1 on skeuo, 9.1:1 / 7.9:1 on adaptive light and dark.
 *
 * Whole-card link: when `href` is set (and `stretchLink` is left on) the TITLE
 * renders as a single <a> whose `::after` overlay stretches across the card, so
 * the entire surface is one link and the title is its accessible name. The
 * visible "Learn more" row is then aria-hidden decoration — announcing the same
 * destination twice is noise. Set `stretchLink={false}` and the card goes inert
 * while the "Learn more" row becomes the real <a>, raised on `relative z-10`
 * and named "Learn more about <title>" via an sr-only span, because "Learn more"
 * on its own is useless in a list of links.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type FeatureCardVariant = "default";
type FeatureCardSize = "sm" | "md" | "lg";

/**
 * Focus ring. Declared for real `:focus-visible` and identically for a
 * `data-focus="true"` attribute so documentation surfaces and visual-regression
 * tests can render the focused look without synthesising a keyboard event.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] " +
  "forced-colors:data-[focus=true]:outline-[Highlight]";

/**
 * `:focus-within` is scoped to the stretched-link card only: tabbing to the
 * title link outlines the whole card, which is exactly the target the reader
 * would click. A card whose only control is the standalone "Learn more" link
 * skips this — outlining the card as well as the link double-rings one focus.
 */
const FOCUS_WITHIN_RING =
  "focus-within:outline-2 focus-within:outline-offset-[3px] " +
  "focus-within:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-within:outline-[Highlight]";

/**
 * Hover lift + press sink for a card that leads somewhere.
 *
 * `translate`, not `transform`: Tailwind v4's `translate-*` utilities write the
 * standalone `translate` property, so the transition NAMES `translate` (with
 * `box-shadow`, which also changes) — never `transform`. Both listed properties
 * really change, so there is no phantom transition. Reduced motion cancels the
 * lift outright rather than keeping an end state, because the card is already a
 * link and the movement carries no information of its own.
 */
const INTERACTIVE_LIFT =
  "cursor-pointer transition-[translate,box-shadow] duration-200 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[2px] motion-reduce:hover:translate-y-0 " +
  "hover:shadow-[var(--mq-shadow-hover,0_14px_35px_rgba(20,20,18,0.12))] " +
  "active:translate-y-[1px] active:shadow-[var(--mq-shadow-press,0_4px_10px_rgba(20,20,18,0.09))] " +
  "motion-reduce:active:translate-y-0";

/**
 * Stretched link: a single <a> whose transparent `::after` covers the card (the
 * nearest positioned ancestor is the `relative` card). Nothing interactive is
 * ever nested inside it; anything that must stay independently clickable sits on
 * a higher `z-index`. The <a> drops its own outline — the card's
 * `:focus-within` ring is what shows the focus.
 */
const STRETCHED_LINK =
  "text-inherit no-underline outline-none " +
  "[&::after]:absolute [&::after]:inset-0 [&::after]:z-[1] [&::after]:content-['']";

/**
 * Keyframes ship with the component instead of living in a global stylesheet a
 * copier would have to hunt for. React 19 hoists and de-duplicates a
 * `<style href precedence>` block, so rendering many cards emits one rule set.
 *
 * They animate `opacity` and `scale` — standalone properties in Tailwind v4 —
 * and nothing else in this file writes `scale`, so the entry never fights the
 * hover `translate`. Both use `backwards` rather than `both`: the fill holds the
 * start frame during the delay but releases afterwards, so the resting card is
 * governed by its own rules again and a caller's hover can still win. Each
 * animation's end state (opacity 1, scale 1) IS the element's default, which is
 * exactly what `motion-reduce:animate-none` leaves behind — a fully painted,
 * fully legible card.
 */
const FEATURE_CARD_KEYFRAMES =
  "@keyframes mq-feature-card-in{from{opacity:0;scale:0.98}to{opacity:1;scale:1}}" +
  "@keyframes mq-feature-well-in{0%{opacity:0;scale:0.7}62%{opacity:1;scale:1.07}100%{opacity:1;scale:1}}";

function FeatureCardKeyframes() {
  return (
    <style href="mq-feature-card" precedence="medium">
      {FEATURE_CARD_KEYFRAMES}
    </style>
  );
}

const featureCardVariants = cva(
  [
    "group relative isolate flex flex-col text-left border",
    "gap-[var(--mq-gap,14px)] p-[var(--mq-pad,22px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    // Signature: the card settles in. Keyframes, not a transition — a card is
    // mounted in its final state and a transition has nothing to run from on the
    // frame an element appears.
    "animate-[mq-feature-card-in_420ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
    "motion-reduce:animate-none",
    // Forced colours discard gradients, translucency, backdrop filters and
    // shadows, so every material collapses to the same system-painted panel and
    // a system border is the only thing keeping the card's bounds. The dim on a
    // disabled card is dropped there too: opacity survives forced-colors and
    // would eat contrast, and the visible "Unavailable" text already says it.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
    "forced-colors:shadow-none forced-colors:backdrop-blur-none",
    "data-[state=disabled]:opacity-60 forced-colors:data-[state=disabled]:opacity-100",
    FOCUS_RING,
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
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)] [--mq-shadow-hover:0_1px_3px_rgba(20,20,18,0.118),0_14px_35px_rgba(20,20,18,0.071)] [--mq-shadow-press:0_0px_1px_rgba(20,20,18,0.085),0_4px_10px_rgba(20,20,18,0.051)]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-pad:16px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:15px] [--mq-desc:12px] [--mq-eyebrow:10px] [--mq-well:38px] [--mq-icon:18px]",
        md: "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:17px] [--mq-desc:13px] [--mq-eyebrow:11px] [--mq-well:46px] [--mq-icon:22px]",
        lg: "[--mq-pad:28px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:20px] [--mq-desc:14px] [--mq-eyebrow:11px] [--mq-well:54px] [--mq-icon:26px]",
      },
    },
    compoundVariants: [
      {
        material: "clay",
        variant: "default",
        class:
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.22)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817] " +
          // #7a3f14 on #f6e7dd measures 6.83:1 — the eyebrow is real text, so the
          // accent is held to the same 4.5:1 bar as the body copy.
          "[--mq-acc:#7a3f14] [--mq-well-bg:#fff3ea] [--mq-well-brd:rgba(120,80,55,0.24)] " +
          "[--mq-well-shadow:inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-3px_5px_rgba(140,90,60,0.14),0_3px_0_rgba(120,80,55,0.18)] " +
          "[--mq-wash:radial-gradient(120%_90%_at_100%_0%,rgba(255,255,255,0.72),rgba(255,255,255,0)_58%)]",
      },
      {
        material: "glass",
        variant: "default",
        // --mq-muted #36362f (not a lighter grey) holds 5.14:1 over a black
        // backdrop at 0.66 opacity, where a lighter muted measured only 4.27:1.
        // --mq-acc #26325a is picked the same way: 5.24:1 in that worst case.
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817] " +
          "[--mq-acc:#26325a] [--mq-well-bg:rgba(255,255,255,0.5)] [--mq-well-brd:rgba(255,255,255,0.85)] " +
          "[--mq-well-shadow:inset_0_1px_0_rgba(255,255,255,0.95),0_6px_14px_rgba(24,20,40,0.16)] " +
          "[--mq-wash:radial-gradient(120%_90%_at_100%_0%,rgba(255,255,255,0.55),rgba(255,255,255,0)_60%)]",
      },
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817] " +
          // The skeuo well is engraved rather than raised — the inset top shadow
          // and the bottom light line read as a milled recess in the panel.
          "[--mq-acc:#2f4538] [--mq-well-bg:#cfcbc1] [--mq-well-brd:rgba(25,25,23,0.34)] " +
          "[--mq-well-shadow:inset_0_2px_4px_rgba(0,0,0,0.28),inset_0_-1px_0_rgba(255,255,255,0.75)] " +
          "[--mq-wash:radial-gradient(110%_80%_at_50%_0%,rgba(255,255,255,0.55),rgba(255,255,255,0)_55%)]",
      },
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817] " +
          "[--mq-acc:#3f3a9e] [--mq-well-bg:#f4f4f2] [--mq-well-brd:rgba(23,24,23,0.12)] " +
          "[--mq-well-shadow:0_1px_2px_rgba(20,20,18,0.08)] " +
          "[--mq-wash:radial-gradient(120%_90%_at_100%_0%,rgba(63,58,158,0.08),rgba(63,58,158,0)_60%)] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9] " +
          "dark:[--mq-acc:#b9aeff] dark:[--mq-well-bg:#2e2e34] dark:[--mq-well-brd:rgba(255,255,255,0.14)] " +
          "dark:[--mq-well-shadow:inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.5)] " +
          "dark:[--mq-wash:radial-gradient(120%_90%_at_100%_0%,rgba(185,174,255,0.12),rgba(185,174,255,0)_60%)] " +
          "dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_14px_30px_rgba(0,0,0,0.55)] dark:[--mq-shadow-hover:0_3px_6px_rgba(0,0,0,0.59),0_20px_44px_rgba(0,0,0,0.62)] dark:[--mq-shadow-press:0_1px_2px_rgba(0,0,0,0.45),0_6px_12px_rgba(0,0,0,0.5)]",
      },
    ],
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

/**
 * Decorative corner atmosphere. Sits on a NEGATIVE z-index so it paints above
 * the card's own background but below every in-flow child — a positioned
 * `z-0` sibling would paint over the text instead. `inset-0` plus
 * `rounded-[inherit]` keeps it inside the corner radius without an
 * `overflow-hidden` that would clip the card's extruded bottom edge.
 */
const WASH =
  "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] " +
  "[background-image:var(--mq-wash,radial-gradient(120%_90%_at_100%_0%,rgba(255,255,255,0.72),rgba(255,255,255,0)_58%))] " +
  "forced-colors:hidden";

/**
 * The icon well. Fixed box size in both axes, so the card's height is decided
 * before the caller's glyph paints and nothing reflows — the same layout-shift
 * guarantee an aspect-ratio well gives an image.
 *
 * `aria-hidden` on purpose: the glyph is ornament. The title says what the
 * feature is, so meaning is never carried by the icon alone.
 */
const WELL =
  "relative inline-flex shrink-0 items-center justify-center " +
  "size-[var(--mq-well,46px)] rounded-[calc(var(--mq-radius,24px)_-_10px)] " +
  "border border-[var(--mq-well-brd,rgba(120,80,55,0.24))] " +
  "bg-[color:var(--mq-well-bg,#fff3ea)] " +
  "shadow-[var(--mq-well-shadow,inset_0_2px_3px_rgba(255,255,255,0.95),0_3px_0_rgba(120,80,55,0.18))] " +
  "text-[color:var(--mq-acc,#7a3f14)] " +
  "[&_svg]:size-[var(--mq-icon,22px)] [&_svg]:shrink-0 " +
  "animate-[mq-feature-well-in_520ms_cubic-bezier(0.22,1,0.36,1)_120ms_backwards] motion-reduce:animate-none " +
  "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none";

/** Only a card that is itself a link responds to the card being hovered. */
const WELL_HOVER =
  "transition-[translate] duration-200 ease-out motion-reduce:transition-none " +
  "group-hover:-translate-y-[2px] motion-reduce:group-hover:translate-y-0";

const EYEBROW =
  "m-0 font-black uppercase " +
  "text-[color:var(--mq-acc,#7a3f14)] text-[length:var(--mq-eyebrow,11px)] leading-[1.2] tracking-[0.14em] " +
  "forced-colors:text-[CanvasText]";

const TITLE =
  "m-0 font-extrabold tracking-[-0.02em] " +
  "text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.25] " +
  "forced-colors:text-[CanvasText]";

const DESCRIPTION =
  "m-0 text-[color:var(--mq-muted,#5c5b55)] text-[length:var(--mq-desc,13px)] leading-[1.7] " +
  "forced-colors:text-[CanvasText]";

const FOOTER_ROW =
  "mt-auto flex items-center border-t border-[var(--mq-rule,rgba(23,24,23,0.14))] " +
  "pt-[var(--mq-gap,14px)] forced-colors:border-[CanvasText]";

const LINK_LOOK =
  "inline-flex items-center gap-[7px] no-underline font-bold " +
  "text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-desc,13px)] leading-[1.3]";

/**
 * The real link, used only when the card is NOT one big stretched link. It is
 * raised above the card's stacking flow so nothing can swallow its clicks, and
 * it owns its own focus ring because the card deliberately does not draw one.
 */
const STANDALONE_LINK =
  "group/link relative z-10 rounded-[6px] " +
  "hover:underline underline-offset-[3px] " +
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:text-[LinkText] forced-colors:focus-visible:outline-[Highlight]";

const ARROW = "transition-[translate] duration-200 ease-out motion-reduce:transition-none";

/**
 * Busy overlay. Purely decorative and inert, so it is hidden from assistive
 * tech — `aria-busy` on the card plus the polite live region carry the meaning.
 * Uses Tailwind's built-in `animate-pulse`; under reduced motion the pulse stops
 * and a static wash remains, so the busy state stays visible without movement.
 */
function Shimmer() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-20 rounded-[inherit]",
        "bg-[rgba(255,255,255,0.42)] animate-pulse motion-reduce:animate-none",
        "forced-colors:hidden",
      )}
    />
  );
}

export type FeatureCardProps = Omit<React.ComponentPropsWithRef<"article">, "title"> &
  Omit<VariantProps<typeof featureCardVariants>, "material" | "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: FeatureCardVariant;
    size?: FeatureCardSize;
    /**
     * Decorative glyph for the well. Any node — the component sizes it via
     * `--mq-icon` and hides it from assistive tech, so it must never be the only
     * thing that says what the feature is.
     */
    icon?: React.ReactNode;
    /** Optional short kicker above the title, e.g. a capability group. */
    eyebrow?: string;
    /** The feature name. Becomes the heading and, when stretched, the link text. */
    title: string;
    /** One or two sentences describing the feature. */
    description: React.ReactNode;
    /** Destination for the "Learn more" affordance. Omit for an inert card. */
    href?: string;
    /** Visible label on the link affordance. */
    linkLabel?: string;
    /**
     * `true` (default): the whole card is one link via the stretched-link
     * pattern and the visible label becomes aria-hidden decoration.
     * `false`: the card stays inert and the label is the only real link.
     */
    stretchLink?: boolean;
    /**
     * Heading rank. The correct level depends on the surrounding document
     * outline, so it is overridable rather than hardcoded.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    /** Marks the feature unavailable: drops the link and shows a text marker. */
    disabled?: boolean;
    /** Visible text that carries the unavailable state — never colour alone. */
    disabledLabel?: string;
    /** Marks the card busy: sets `aria-busy`, announces it, and washes it out. */
    loading?: boolean;
  };

export function FeatureCard({
  className,
  description,
  disabled = false,
  disabledLabel = "Unavailable",
  eyebrow,
  headingLevel = 3,
  href,
  icon,
  linkLabel = "Learn more",
  loading = false,
  material = "clay",
  size = "md",
  stretchLink = true,
  title,
  variant = "default",
  ...props
}: FeatureCardProps) {
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
  const hasLink = Boolean(href) && !disabled;
  // Only the stretched form makes the card itself interactive; the standalone
  // form leaves the card inert so the link keeps a single, unduplicated focus.
  const isStretched = hasLink && stretchLink;
  const showFooter = hasLink || disabled;

  return (
    <>
      <FeatureCardKeyframes />
      {/* `props` is spread first on purpose: the accessibility and state
          attributes below are derived from `loading`/`disabled` and must win
          over anything a caller passes through. */}
      <article
        {...props}
        aria-busy={loading || undefined}
        className={cn(
          featureCardVariants({ material, variant, size }),
          isStretched && INTERACTIVE_LIFT,
          isStretched && FOCUS_WITHIN_RING,
          className,
        )}
        data-material={material}
        data-state={disabled ? "disabled" : loading ? "loading" : "idle"}
      >
        <span aria-hidden="true" className={WASH} />
        {loading ? <Shimmer /> : null}

        {/* Present in the DOM from the first render, empty, so the polite
            announcement actually fires when the busy text arrives later. */}
        <p aria-live="polite" className="sr-only">
          {loading ? `Loading ${title}` : ""}
        </p>

        {icon ? (
          <span aria-hidden="true" className={cn(WELL, isStretched && WELL_HOVER)}>
            {icon}
          </span>
        ) : null}

        <div className="flex flex-col gap-[6px]">
          {eyebrow ? <p className={EYEBROW}>{eyebrow}</p> : null}
          <HeadingTag className={TITLE}>
            {isStretched ? (
              <a href={href} className={STRETCHED_LINK}>
                {title}
              </a>
            ) : (
              title
            )}
          </HeadingTag>
          <p className={DESCRIPTION}>{description}</p>
        </div>

        {showFooter ? (
          <div className={FOOTER_ROW}>
            {disabled ? (
              <p
                className={cn(
                  "m-0 inline-flex items-center gap-[7px] font-bold",
                  "text-[color:var(--mq-muted,#5c5b55)] text-[length:var(--mq-desc,13px)] leading-[1.3]",
                  "forced-colors:text-[GrayText]",
                )}
              >
                {disabledLabel}
              </p>
            ) : isStretched ? (
              // Decoration: the stretched <a> in the heading already announces
              // this destination, and naming it twice is pure noise.
              <span aria-hidden="true" className={cn(LINK_LOOK, "forced-colors:text-[CanvasText]")}>
                <span>{linkLabel}</span>
                <ArrowRight
                  className={cn(
                    ARROW,
                    "group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0",
                  )}
                  strokeWidth={2.25}
                />
              </span>
            ) : (
              <a href={href} className={cn(LINK_LOOK, STANDALONE_LINK)}>
                <span>{linkLabel}</span>
                {/* "Learn more" alone is meaningless in a list of links, so the
                    feature name is appended to the accessible name. */}
                <span className="sr-only">{` about ${title}`}</span>
                <ArrowRight
                  aria-hidden="true"
                  className={cn(
                    ARROW,
                    "group-hover/link:translate-x-[3px] motion-reduce:group-hover/link:translate-x-0",
                  )}
                  strokeWidth={2.25}
                />
              </a>
            )}
          </div>
        ) : null}
      </article>
    </>
  );
}

export { featureCardVariants };
