"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Product Card
 *
 * A commerce surface: a product image, a semantic heading, a price, a star
 * rating whose VALUE lives in text (never colour or star-count alone), and a
 * real "Add to cart" <button>. Self-contained by design — the four material
 * recipes (clay / glass / skeuo / adaptive) are copied and owned here, straight
 * from `card.tsx`, so dropping this file plus `src/lib/cn.ts` into another
 * project reproduces the full tactile look with no global stylesheet and no
 * `:root` custom properties. Every `var()` carries a literal fallback.
 *
 * Local theming knobs (custom properties declared on the card, inherited down):
 *
 *   --mq-body     surface colour
 *   --mq-lit      top highlight (skeuo gradient)
 *   --mq-edge     extruded bottom edge colour
 *   --mq-text     primary foreground
 *   --mq-muted    secondary foreground (review count, compare-at price)
 *   --mq-rule     hairline / image placeholder wash
 *   --mq-brd      border colour
 *   --mq-ring     focus ring colour
 *   --mq-acc      accent fill for the Add button + badge
 *   --mq-acc-fg   text on the accent fill
 *   --mq-star     decorative star colour
 *   --mq-pad      inner padding
 *   --mq-gap      vertical rhythm between blocks
 *   --mq-radius   corner radius
 *   --mq-title    title / price font size
 *
 * Contrast contract (inherited from the Card recipe): on every filled material
 * both --mq-text and --mq-muted stay at or above 4.5:1 against the surface, and
 * the glass tokens carry their own tint so that holds over a white and a black
 * backdrop alike. The rating VALUE is always readable text (--mq-text), so the
 * gold stars are pure decoration and are hidden from assistive tech.
 *
 * Whole-card link: when `href` is set the TITLE renders as a single <a> whose
 * `::after` overlay stretches across the card, making the entire surface one
 * link WITHOUT nesting the Add button inside it. The button is raised on
 * `relative z-10` so it stays independently clickable and focusable — the
 * "stretched link" pattern, the only correct way to make a card that both leads
 * somewhere and holds its own controls.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type ProductCardVariant = "default";
type ProductCardSize = "sm" | "md" | "lg";

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
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * `:focus-within` is scoped to the linked (interactive) card only: tabbing to
 * the title link or the Add button outlines the whole card, so the stretched
 * link never loses its visible focus. An inert product card skips this to avoid
 * double-ringing the Add button's own focus.
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
 * lift outright because the card is already a link.
 */
const INTERACTIVE_LIFT =
  "cursor-pointer transition-[translate,box-shadow] duration-200 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[2px] motion-reduce:hover:translate-y-0 " +
  "hover:shadow-[var(--mq-shadow-hover,0_14px_35px_rgba(20,20,18,0.12))] " +
  "active:translate-y-[1px] active:shadow-[var(--mq-shadow-press,0_4px_10px_rgba(20,20,18,0.09))] " +
  "motion-reduce:active:translate-y-0";

/**
 * Stretched link: a single <a> whose transparent `::after` covers the card
 * (the nearest positioned ancestor is the `relative` card). Everything the
 * reader must still reach independently — the Add button — sits on a higher
 * `z-index`, so it stays clickable while the rest of the surface routes to the
 * product link. The <a> itself drops its own outline; the card's
 * `:focus-within` ring is what shows the focus.
 */
const STRETCHED_LINK =
  "text-inherit no-underline outline-none " +
  "[&::after]:absolute [&::after]:inset-0 [&::after]:z-[1] [&::after]:content-['']";

const ADD_BUTTON =
  "relative z-10 inline-flex items-center justify-center gap-[6px] " +
  "rounded-[calc(var(--mq-radius,24px)_-_12px)] px-[14px] py-[8px] " +
  "text-[length:13px] font-bold whitespace-nowrap " +
  "bg-[var(--mq-acc,#1c1c19)] text-[color:var(--mq-acc-fg,#ffffff)] border border-transparent " +
  "transition-[translate,opacity] duration-150 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[1px] hover:opacity-90 motion-reduce:hover:translate-y-0 " +
  "active:translate-y-0 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] " +
  "disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:translate-y-0 " +
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] " +
  "forced-colors:focus-visible:outline-[Highlight]";

const productCardVariants = cva(
  [
    "group relative isolate flex flex-col text-left border",
    "gap-[var(--mq-gap,14px)] p-[var(--mq-pad,22px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    // Shadows and translucency are erased in forced-colors mode, so the card
    // would dissolve into the page. A system-coloured border keeps its bounds.
    "forced-colors:border-[CanvasText]",
    "data-[state=disabled]:opacity-60",
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
        sm: "[--mq-pad:16px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:15px]",
        md: "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:17px]",
        lg: "[--mq-pad:28px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:20px]",
      },
    },
    compoundVariants: [
      {
        material: "clay",
        variant: "default",
        class:
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817] " +
          "[--mq-acc:#33261e] [--mq-acc-fg:#fff3ea] [--mq-star:#c9762b]",
      },
      {
        material: "glass",
        variant: "default",
        // --mq-muted #36362f (not a lighter grey) holds 5.14:1 over a black
        // backdrop at 0.66 opacity, where a lighter muted measured only 4.27:1.
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817] " +
          "[--mq-acc:#1e1e1b] [--mq-acc-fg:#ffffff] [--mq-star:#a85f10]",
      },
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817] " +
          "[--mq-acc:#23231f] [--mq-acc-fg:#f6f4ee] [--mq-star:#996611]",
      },
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817] " +
          "[--mq-acc:#1c1c19] [--mq-acc-fg:#ffffff] [--mq-star:#b8791a] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9] " +
          "dark:[--mq-acc:#f1efe9] dark:[--mq-acc-fg:#1c1c19] dark:[--mq-star:#e8b45a] " +
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
 * Decorative star row. Aria-hidden: the numeric value below carries the meaning,
 * so the rating is never conveyed by star-count or gold colour alone. Each of
 * the five positions paints an empty star and clips a filled copy to the exact
 * fractional fill, so 4.5 shows four full stars and one half — computed
 * deterministically from the value (SSR-safe, no randomness).
 */
function RatingStars({ value }: { value: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center gap-[2px] text-[color:var(--mq-star,#c9762b)]"
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = Math.max(0, Math.min(1, value - index));
        return (
          <span key={index} className="relative inline-flex">
            <Star className="size-[15px]" strokeWidth={1.75} fill="none" />
            {fill > 0 ? (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(fill * 100).toFixed(2)}%` }}
              >
                <Star className="size-[15px]" strokeWidth={1.75} fill="currentColor" />
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

export type ProductCardProps = Omit<
  React.ComponentPropsWithRef<"article">,
  "title"
> &
  Omit<VariantProps<typeof productCardVariants>, "material" | "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: ProductCardVariant;
    size?: ProductCardSize;
    /** Product image URL. */
    imageSrc: string;
    /** Real alternative text for the product image. Use "" only if decorative. */
    imageAlt: string;
    /** Product name — the card's heading and, when `href` is set, the link text. */
    title: string;
    /** When set, the whole card becomes one link via the stretched-link pattern. */
    href?: string;
    /** Formatted current price, e.g. "$48.00". */
    price: string;
    /** Optional struck-through original price, e.g. "$60.00". */
    compareAtPrice?: string;
    /** Rating out of 5. Omit to hide the rating row entirely. */
    rating?: number;
    /** Number of reviews behind the rating. */
    reviewCount?: number;
    /**
     * Heading rank for the title. The correct level depends on the surrounding
     * document outline, so it is overridable rather than hardcoded.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    /** Optional short flag rendered over the image (e.g. "Sale"). Text, not colour. */
    badge?: string;
    /** Visible label on the Add control. */
    addLabel?: string;
    /** Click handler for the Add control. */
    onAdd?: React.MouseEventHandler<HTMLButtonElement>;
    /** Marks the product unavailable: dims the card and disables the Add button. */
    disabled?: boolean;
  };

export function ProductCard({
  addLabel = "Add",
  badge,
  className,
  compareAtPrice,
  disabled = false,
  headingLevel = 3,
  href,
  imageAlt,
  imageSrc,
  material = "clay",
  onAdd,
  price,
  rating,
  reviewCount,
  size = "md",
  title,
  variant = "default",
  ...props
}: ProductCardProps) {
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
  const hasRating = typeof rating === "number";
  const ratingLabel = hasRating ? rating.toFixed(1) : "";
  const addAccessibleName = `${addLabel} ${title} to cart`;

  return (
    <article
      {...props}
      className={cn(
        productCardVariants({ material, variant, size }),
        // Gate the whole-card affordances on `!disabled` too: a dimmed disabled
        // card must not lift, ring, or (below) render a live stretched link.
        href && !disabled && INTERACTIVE_LIFT,
        href && !disabled && FOCUS_WITHIN_RING,
        className,
      )}
      data-material={material}
      data-state={disabled ? "disabled" : "idle"}
    >
      <div className="relative overflow-hidden rounded-[calc(var(--mq-radius,24px)_-_10px)] aspect-[4/3] bg-[var(--mq-rule,rgba(120,80,55,0.20))]">
        {/* eslint-disable-next-line @next/next/no-img-element -- copy-and-own component stays framework-agnostic */}
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className={cn(
            "size-full object-cover [transform:scale(1)]",
            "transition-[transform] duration-500 ease-out",
            "group-hover:[transform:scale(1.05)]",
            "motion-reduce:transition-none motion-reduce:group-hover:[transform:none]",
          )}
        />
        {badge ? (
          <span
            className={cn(
              "pointer-events-none absolute left-[10px] top-[10px] z-[2]",
              "rounded-full px-[10px] py-[3px] text-[length:11px] font-bold",
              "bg-[var(--mq-acc,#1c1c19)] text-[color:var(--mq-acc-fg,#ffffff)]",
              "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
            )}
          >
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-[8px]">
        <HeadingTag className="m-0 font-extrabold tracking-[-0.02em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.25]">
          {href && !disabled ? (
            <a href={href} className={STRETCHED_LINK}>
              {title}
            </a>
          ) : (
            title
          )}
        </HeadingTag>

        {hasRating ? (
          <div className="flex items-center gap-[8px]">
            <RatingStars value={rating} />
            <p className="m-0 text-[length:12px] leading-none text-[color:var(--mq-muted,#5c5b55)]">
              <span
                // role="img" makes aria-label a valid naming target — on a bare
                // span aria-label is not reliably honoured, so the "Rated … of 5"
                // clarification could be dropped and only the value read.
                role="img"
                aria-label={`Rated ${ratingLabel} of 5`}
                className="font-semibold text-[color:var(--mq-text,#2b2b26)]"
              >
                {ratingLabel}
              </span>
              {typeof reviewCount === "number" ? (
                <>
                  <span aria-hidden="true"> · </span>
                  <span>{`${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`}</span>
                </>
              ) : null}
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-[10px] pt-[2px]">
          <p className="m-0 flex items-baseline gap-[6px]">
            <span className="font-extrabold text-[length:var(--mq-title,17px)] text-[color:var(--mq-text,#2b2b26)]">
              {price}
            </span>
            {compareAtPrice ? (
              <span className="text-[length:12px] font-medium line-through text-[color:var(--mq-muted,#5c5b55)]">
                <span className="sr-only">Original price </span>
                {compareAtPrice}
              </span>
            ) : null}
          </p>

          <button
            type="button"
            aria-label={addAccessibleName}
            className={ADD_BUTTON}
            disabled={disabled}
            onClick={onAdd}
          >
            <ShoppingCart aria-hidden="true" className="size-[16px]" strokeWidth={2} />
            <span>{addLabel}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export { productCardVariants };
