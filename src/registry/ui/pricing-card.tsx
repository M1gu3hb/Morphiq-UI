"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Pricing Card
 *
 * One plan on one card — name, price, feature list and a single call to action —
 * not a comparison table. Self-contained by design: the four material recipes
 * (clay / glass / skeuo / adaptive) are copied into this file from the base Card,
 * so distributing this component plus `src/lib/cn.ts` reproduces the full look
 * with no `:root` variables and no global stylesheet class.
 *
 * Local theming knobs, each read with a literal fallback so nothing depends on a
 * cascade that may not have been copied along:
 *
 *   --mq-body     surface colour
 *   --mq-lit      top highlight (skeuo gradient)
 *   --mq-edge     extruded bottom edge
 *   --mq-text     primary foreground
 *   --mq-muted    secondary foreground (period, description)
 *   --mq-rule     hairline colour
 *   --mq-brd      border colour
 *   --mq-ring     focus ring colour
 *   --mq-cta-bg   call-to-action fill
 *   --mq-cta-fg   call-to-action text on that fill
 *   --mq-cta-brd  call-to-action outline border
 *   --mq-pad / --mq-gap / --mq-radius / --mq-title / --mq-price  density axis
 *
 * The "featured" state is never carried by colour alone: a visible "Most popular"
 * badge (real text + icon) states it, a stronger elevation raises the card above
 * its neighbours, and the badge sits in the reading order so assistive tech
 * announces it too.
 *
 * Contrast contract: on every filled material both `--mq-text` and `--mq-muted`
 * measure at or above 4.5:1 against the surface — for glass, against a white and
 * a black backdrop alike, because glass must never borrow its legibility from
 * whatever sits behind it.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type PricingCardVariant = "default" | "featured";
type PricingCardSize = "sm" | "md" | "lg";
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HEADING_TAGS: Record<HeadingLevel, React.ElementType> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

/**
 * The whole card is a container, never a control, so it is not focusable itself.
 * Its ring is drawn on `:focus-within` (so tabbing to the CTA outlines the card)
 * and, identically, on a `data-focus="true"` attribute so the documentation
 * surface can render the focused look without synthesising a keyboard event.
 */
const CARD_FOCUS =
  "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-within:outline-[Highlight] forced-colors:data-[focus=true]:outline-[Highlight]";

const CTA_FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

const pricingCardVariants = cva(
  [
    "relative isolate flex flex-col text-left",
    "border",
    "gap-[var(--mq-gap,16px)] p-[var(--mq-pad,24px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    // `translate`, not `transform`: Tailwind v4's `translate-*` utilities write
    // the standalone `translate` property, so the transition must NAME
    // `translate` for the hover lift to interpolate instead of snapping. Nothing
    // in this file sets the `transform` property, so it is not listed. Only the
    // two properties that a state actually changes are transitioned.
    "transition-[translate,box-shadow] duration-200 ease-out",
    "hover:-translate-y-[2px] motion-reduce:hover:translate-y-0",
    // Gated on the idle state so a disabled card (which already cancels the
    // translate) does not grow its shadow on hover either — it keeps its resting
    // shadow, so nothing responds to hover while it reads as unavailable.
    "data-[state=idle]:hover:shadow-[var(--mq-shadow-hover,0_14px_35px_rgba(20,20,18,0.12))]",
    "motion-reduce:transition-none",
    // Shadows and translucency are erased in forced-colors mode; a system-coloured
    // border keeps the card's bounds.
    "forced-colors:border-[CanvasText]",
    CARD_FOCUS,
    "data-[state=disabled]:opacity-55 data-[state=disabled]:hover:translate-y-0",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#f6e7dd)]",
          "border-[var(--mq-brd,rgba(120,80,55,0.16))]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)] [--mq-shadow-hover:inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_10px_0_var(--mq-edge,#dcc4b2),0_26px_44px_rgba(90,60,45,0.189)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(255,255,255,0.66))]",
          "border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.85),0_23px_55px_rgba(24,20,40,0.236)]",
          "forced-colors:[backdrop-filter:none]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_9px_0_var(--mq-edge,#a8a49b),0_20px_32px_rgba(38,36,31,0.283)]",
        ].join(" "),
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)] [--mq-shadow-hover:0_1px_3px_rgba(20,20,18,0.118),0_14px_35px_rgba(20,20,18,0.071)]",
        ].join(" "),
      },
      variant: {
        default: "",
        featured: "",
      },
      size: {
        sm: "[--mq-pad:20px] [--mq-gap:12px] [--mq-radius:18px] [--mq-title:16px] [--mq-price:30px]",
        md: "[--mq-pad:24px] [--mq-gap:16px] [--mq-radius:24px] [--mq-title:18px] [--mq-price:38px]",
        lg: "[--mq-pad:30px] [--mq-gap:20px] [--mq-radius:30px] [--mq-title:21px] [--mq-price:46px]",
      },
    },
    compoundVariants: [
      // ---------------------------------------------------------------- clay
      {
        material: "clay",
        variant: "default",
        class:
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817] " +
          "[--mq-cta-bg:#33261e] [--mq-cta-fg:#fff3ea] [--mq-cta-brd:rgba(120,80,55,0.5)]",
      },
      {
        material: "clay",
        variant: "featured",
        class:
          "[--mq-body:#fff3ea] [--mq-edge:#d8bda9] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.28)] [--mq-ring:#171817] " +
          "[--mq-cta-bg:#33261e] [--mq-cta-fg:#fff3ea] [--mq-cta-brd:rgba(120,80,55,0.5)] " +
          "shadow-[inset_0_4px_5px_rgba(255,255,255,0.85),inset_0_-6px_10px_rgba(140,90,60,0.14),0_11px_0_var(--mq-edge,#d8bda9),0_26px_44px_rgba(90,60,45,0.22)] [--mq-shadow-hover:inset_0_4px_5px_rgba(255,255,255,0.85),inset_0_-6px_10px_rgba(140,90,60,0.14),0_16px_0_var(--mq-edge,#d8bda9),0_38px_64px_rgba(90,60,45,0.26)]",
      },
      // --------------------------------------------------------------- glass
      {
        material: "glass",
        variant: "default",
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817] " +
          "[--mq-cta-bg:#1e1e1b] [--mq-cta-fg:#f5f4f0] [--mq-cta-brd:rgba(23,24,23,0.5)]",
      },
      {
        material: "glass",
        variant: "featured",
        class:
          "[--mq-body:rgba(255,255,255,0.78)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.9)] [--mq-ring:#171817] " +
          "[--mq-cta-bg:#1e1e1b] [--mq-cta-fg:#f5f4f0] [--mq-cta-brd:rgba(23,24,23,0.5)] " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_26px_54px_rgba(24,20,40,0.28)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.95),0_38px_78px_rgba(24,20,40,0.33)]",
      },
      // --------------------------------------------------------------- skeuo
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817] " +
          "[--mq-cta-bg:#23231f] [--mq-cta-fg:#f6f4ee] [--mq-cta-brd:rgba(25,25,23,0.5)]",
      },
      {
        material: "skeuo",
        variant: "featured",
        class:
          "[--mq-lit:#fbfaf6] [--mq-body:#dedad0] [--mq-edge:#9c988f] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.3)] [--mq-ring:#171817] " +
          "[--mq-cta-bg:#23231f] [--mq-cta-fg:#f6f4ee] [--mq-cta-brd:rgba(25,25,23,0.5)] " +
          "shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_7px_rgba(0,0,0,0.16),0_10px_0_var(--mq-edge,#9c988f),0_24px_36px_rgba(38,36,31,0.3)] [--mq-shadow-hover:inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_7px_rgba(0,0,0,0.16),0_14px_0_var(--mq-edge,#9c988f),0_35px_52px_rgba(38,36,31,0.354)]",
      },
      // ------------------------------------------------------------ adaptive
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817] " +
          "[--mq-cta-bg:#1c1c19] [--mq-cta-fg:#ffffff] [--mq-cta-brd:rgba(23,24,23,0.4)] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9] " +
          "dark:[--mq-cta-bg:#f1efe9] dark:[--mq-cta-fg:#1c1c19] dark:[--mq-cta-brd:rgba(255,255,255,0.5)]",
      },
      {
        material: "adaptive",
        variant: "featured",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.10)] [--mq-ring:#171817] " +
          "[--mq-cta-bg:#1c1c19] [--mq-cta-fg:#ffffff] [--mq-cta-brd:rgba(23,24,23,0.4)] " +
          "shadow-[0_2px_4px_rgba(20,20,18,0.10),0_22px_44px_rgba(20,20,18,0.16)] [--mq-shadow-hover:0_3px_6px_rgba(20,20,18,0.118),0_32px_64px_rgba(20,20,18,0.189)] " +
          "dark:[--mq-body:#2a2a2f] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.14)] dark:[--mq-ring:#f1efe9] " +
          "dark:[--mq-cta-bg:#f1efe9] dark:[--mq-cta-fg:#1c1c19] dark:[--mq-cta-brd:rgba(255,255,255,0.5)] " +
          "dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_22px_44px_rgba(0,0,0,0.55)] dark:[--mq-shadow-hover:0_3px_6px_rgba(0,0,0,0.59),0_32px_64px_rgba(0,0,0,0.649)]",
      },
    ],
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

const ctaVariants = cva(
  [
    // Raised on its own layer so it is always the clickable target, never covered
    // by a decorative overlay.
    "relative z-10 inline-flex w-full items-center justify-center gap-[6px]",
    "rounded-[calc(var(--mq-radius,24px)_-_8px)]",
    "px-[16px] py-[10px] text-[13px] font-bold tracking-[-0.01em]",
    "border cursor-pointer select-none",
    // Each listed property is changed by a state: `translate` on press, `filter`
    // on the fill variant's hover brightness, `border-color` on the outline
    // variant's hover. No phantom properties.
    "transition-[translate,filter,border-color] duration-150 ease-out",
    "active:translate-y-[1px] motion-reduce:transition-none motion-reduce:active:translate-y-0",
    "disabled:cursor-not-allowed disabled:opacity-60",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-60",
    "forced-colors:border-[ButtonText]",
    CTA_FOCUS,
  ].join(" "),
  {
    variants: {
      emphasis: {
        fill: "bg-[var(--mq-cta-bg,#1c1c19)] text-[color:var(--mq-cta-fg,#ffffff)] border-transparent hover:brightness-110 active:brightness-95",
        outline:
          "bg-transparent text-[color:var(--mq-text,#2b2b26)] border-[var(--mq-cta-brd,rgba(23,24,23,0.4))] hover:border-[var(--mq-text,#2b2b26)]",
      },
    },
    defaultVariants: { emphasis: "outline" },
  },
);

const badgeClass = cn(
  "inline-flex items-center gap-[5px] self-start rounded-full",
  "px-[10px] py-[4px] text-[11px] font-bold uppercase tracking-[0.04em]",
  "bg-[var(--mq-cta-bg,#1c1c19)] text-[color:var(--mq-cta-fg,#ffffff)]",
  "shadow-[0_2px_8px_rgba(20,20,18,0.18)]",
  // In forced-colors the fill and shadow are discarded; a border and system text
  // keep the badge perceivable and readable.
  "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
);

export type PricingCardProps = Omit<
  React.ComponentPropsWithoutRef<"article">,
  "title"
> & {
  material?: MaterialSlug;
  variant?: PricingCardVariant;
  size?: PricingCardSize;
  /** The plan's name, rendered as the card's heading. */
  planName: string;
  /** Optional one-line description under the name. */
  planDescription?: string;
  /** Formatted amount, e.g. "$29". */
  price: string;
  /** Optional billing period, e.g. "/mo". */
  period?: string;
  /** Feature bullets. Each renders as a list item with a decorative check. */
  features: readonly string[];
  /** Accessible name for the call to action. */
  ctaLabel: string;
  /** When set (and not disabled) the CTA renders as a link to this href. */
  ctaHref?: string;
  /** Click handler when the CTA renders as a button. */
  onCtaSelect?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Heading rank for the plan name. The correct level depends on the page's
   * outline, so it is a prop rather than hardcoded. Defaults to 3.
   */
  headingLevel?: HeadingLevel;
  /** Text of the featured badge. Defaults to "Most popular". */
  badgeLabel?: string;
  /** Fades the card and disables the CTA. */
  disabled?: boolean;
};

export function PricingCard({
  badgeLabel = "Most popular",
  className,
  ctaHref,
  ctaLabel,
  disabled = false,
  features,
  headingLevel = 3,
  material = "clay",
  onCtaSelect,
  period,
  planDescription,
  planName,
  price,
  size = "md",
  variant = "default",
  ...rest
}: PricingCardProps) {
  const headingId = React.useId();
  const HeadingTag = HEADING_TAGS[headingLevel];
  const isFeatured = variant === "featured";
  const isLink = typeof ctaHref === "string" && ctaHref.length > 0 && !disabled;
  const ctaClassName = ctaVariants({ emphasis: isFeatured ? "fill" : "outline" });

  return (
    <article
      {...rest}
      aria-labelledby={headingId}
      // No `aria-disabled` here: the implicit `article` role does not support it,
      // and a card is not an interactive control. The disabled look is carried by
      // `data-state`, and the real disabled state belongs on the CTA button below.
      className={cn(pricingCardVariants({ material, variant, size }), className)}
      data-material={material}
      data-state={disabled ? "disabled" : "idle"}
    >
      {isFeatured ? (
        <p className={badgeClass}>
          <Sparkles aria-hidden="true" className="size-[13px]" strokeWidth={2.5} />
          {badgeLabel}
        </p>
      ) : null}

      <header className="flex flex-col gap-[4px]">
        <HeadingTag
          id={headingId}
          className={cn(
            "m-0 font-extrabold tracking-[-0.02em]",
            "text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,18px)] leading-[1.2]",
          )}
        >
          {planName}
        </HeadingTag>
        {planDescription ? (
          <p className="m-0 text-[color:var(--mq-muted,#5c5b55)] text-[12px] leading-[1.55]">
            {planDescription}
          </p>
        ) : null}
      </header>

      <p className="m-0 flex items-baseline gap-[4px]">
        <span className="font-extrabold tracking-[-0.03em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-price,38px)] leading-[1]">
          {price}
        </span>
        {period ? (
          <span className="text-[color:var(--mq-muted,#5c5b55)] text-[13px] font-medium">
            {period}
          </span>
        ) : null}
      </p>

      <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
        {features.map((feature, index) => (
          <li
            key={`${index}-${feature}`}
            className="flex items-start gap-[8px] text-[color:var(--mq-text,#2b2b26)] text-[13px] leading-[1.5]"
          >
            <Check
              aria-hidden="true"
              className="mt-[2px] size-[16px] shrink-0 text-[color:var(--mq-text,#2b2b26)]"
              strokeWidth={2.75}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-[4px]">
        {isLink ? (
          <a className={cn(ctaClassName)} href={ctaHref}>
            {ctaLabel}
          </a>
        ) : (
          <button
            aria-disabled={disabled || undefined}
            className={cn(ctaClassName)}
            disabled={disabled}
            onClick={onCtaSelect}
            type="button"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </article>
  );
}

export { pricingCardVariants };
