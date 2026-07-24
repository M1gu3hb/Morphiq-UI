"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight, Quote, Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Testimonial Card
 *
 * ONE testimonial: a pull quote, the author's avatar, their name and role, and a
 * star rating whose VALUE is real text. Distinct from `testimonial-section`,
 * which composes many of these into a marketing block — this is the single unit,
 * the thing you drop next to a pricing table or inside a case study.
 *
 * Self-contained by design: the four material recipes (clay / glass / skeuo /
 * adaptive) are copied and owned here, straight from `card.tsx`, so dropping
 * this file plus `src/lib/cn.ts` into another project reproduces the full
 * tactile look with no global stylesheet and no `:root` custom properties.
 * Every `var()` carries a literal fallback.
 *
 * Local theming knobs (custom properties declared on the card, inherited down):
 *
 *   --mq-body        surface colour
 *   --mq-lit         top highlight (skeuo gradient)
 *   --mq-edge        extruded bottom edge colour
 *   --mq-text        primary foreground
 *   --mq-muted       secondary foreground (role, date, helpful count)
 *   --mq-rule        hairline above the attribution
 *   --mq-brd         border colour
 *   --mq-ring        focus ring colour
 *   --mq-acc         accent fill (pressed "Helpful" toggle)
 *   --mq-acc-fg      text on the accent fill
 *   --mq-star        star colour
 *   --mq-glyph       decorative quotation mark colour
 *   --mq-well        avatar well fill (also the toggle's hover wash)
 *   --mq-pad         inner padding
 *   --mq-gap         vertical rhythm between blocks
 *   --mq-radius      corner radius
 *   --mq-title       headline font size
 *   --mq-quote       pull-quote font size
 *   --mq-avatar      avatar well edge length
 *   --mq-glyph-size  quotation mark size
 *   --mq-star-size   star size
 *
 * Contrast contract (inherited from the Card recipe): on every filled material
 * both --mq-text and --mq-muted stay at or above 4.5:1 against the surface, and
 * the glass tokens carry their own tint so that holds over a white and a black
 * backdrop alike. The stars are decoration — the numeric value sits beside them
 * as text — but each --mq-star still measures 4.5:1 or better on its surface, so
 * the rating reads as informative even though nothing depends on it.
 *
 * Semantics: a <figure> wrapping a <blockquote> and a <figcaption>. That is the
 * HTML pairing for a quotation and its source, and it is why the attribution can
 * sit outside the blockquote (a quotation must not swallow its own citation).
 * A <figcaption> is only legal as the FIRST or LAST child of its <figure>, which
 * is why the actions row is rendered BEFORE the caption and the live region is
 * rendered first — anything appended after the caption would make it a middle
 * child and invalid.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type TestimonialCardVariant = "default";
type TestimonialCardSize = "sm" | "md" | "lg";

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
 * `:focus-within` is scoped to the LINKED card only. Tabbing to the stretched
 * link outlines the whole card, which is the only way that link can show focus —
 * its own box is a transparent overlay. An inert testimonial that merely holds a
 * "Helpful" button skips this, because outlining the card as well as the button
 * double-rings one focus and reads as two separate targets.
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
 * `box-shadow`, which also changes). Both listed properties really change, so
 * there is no phantom transition. Reduced motion cancels the travel outright —
 * the card is already a link, so nothing is lost by holding it still.
 */
const INTERACTIVE_LIFT =
  "cursor-pointer transition-[translate,box-shadow] duration-200 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[2px] motion-reduce:hover:translate-y-0 " +
  "hover:shadow-[var(--mq-shadow-hover,0_14px_35px_rgba(20,20,18,0.12))] " +
  "active:translate-y-[1px] active:shadow-[var(--mq-shadow-press,0_4px_10px_rgba(20,20,18,0.09))] " +
  "motion-reduce:active:translate-y-0";

/**
 * Stretched link: a single <a> whose transparent `::after` covers the card (the
 * nearest positioned ancestor is the `relative isolate` figure). It deliberately
 * carries NO `relative` of its own — that would make the anchor the containing
 * block and shrink the overlay back to the text. Everything that must stay
 * independently reachable — the "Helpful" toggle — sits on a higher z-index, so
 * it keeps its own click and focus while the rest of the surface routes to the
 * link. The <a> drops its own outline; the card's `:focus-within` ring shows the
 * focus instead.
 */
const STRETCHED_LINK =
  "text-inherit no-underline outline-none " +
  "[&::after]:absolute [&::after]:inset-0 [&::after]:z-[1] [&::after]:content-['']";

const HEADLINE_LINK = `${STRETCHED_LINK} underline-offset-[3px] hover:underline`;

// The colour is inherited from the card (`text-inherit`, already in
// STRETCHED_LINK) rather than re-pinned here: two `color` declarations of equal
// specificity on one element would leave the winner to stylesheet order.
const SOURCE_LINK =
  `${STRETCHED_LINK} inline-flex items-center gap-[4px] ` +
  "text-[length:12px] font-bold underline-offset-[3px] hover:underline " +
  "forced-colors:text-[LinkText]";

/**
 * The "Helpful" vote.
 *
 * Sits at `relative z-10`, above the stretched link's overlay, so it stays
 * clickable and focusable on a card whose whole surface is a link. Its state is
 * carried by `aria-pressed`, by a changed label ("Helpful" -> "Marked helpful")
 * and by a filled icon — never by the accent colour alone.
 */
const HELPFUL_BUTTON =
  "relative z-10 inline-flex items-center gap-[6px] whitespace-nowrap " +
  "rounded-full border px-[12px] py-[6px] text-[length:12px] font-bold " +
  // The pressed look is routed through three local variables rather than being
  // set directly under `aria-pressed:`. An `aria-pressed:bg-*` utility carries an
  // attribute selector, so it would outrank the flat `forced-colors:bg-*` reset
  // and a pressed toggle would keep painting its own accent where the system
  // palette must win. Swapping variables instead leaves the forced-colors rules
  // free to override a same-specificity declaration by source order.
  "[--mq-toggle-brd:var(--mq-brd,rgba(120,80,55,0.16))] [--mq-toggle-bg:transparent] " +
  "[--mq-toggle-fg:var(--mq-text,#2b2b26)] " +
  "border-[var(--mq-toggle-brd,rgba(120,80,55,0.16))] bg-[var(--mq-toggle-bg,transparent)] " +
  "text-[color:var(--mq-toggle-fg,#2b2b26)] " +
  "transition-[translate,background-color,color,border-color] duration-150 ease-out " +
  "motion-reduce:transition-none " +
  "hover:-translate-y-[1px] hover:[--mq-toggle-bg:var(--mq-well,rgba(255,255,255,0.55))] " +
  "motion-reduce:hover:translate-y-0 active:translate-y-0 " +
  "aria-pressed:[--mq-toggle-brd:transparent] " +
  "aria-pressed:[--mq-toggle-bg:var(--mq-acc,#1c1c19)] " +
  "aria-pressed:[--mq-toggle-fg:var(--mq-acc-fg,#ffffff)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] " +
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 " +
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] " +
  "forced-colors:aria-pressed:bg-[Highlight] forced-colors:aria-pressed:text-[HighlightText] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Local keyframes, hoisted and deduplicated by React 19 via `href` +
 * `precedence`: a bare <style> would emit one identical copy per card on the
 * page. Both animations END on the component's resting styles — opacity 1,
 * `translate: 0 0`, `scale: 1` — and neither declares a fill mode, so
 * `motion-reduce:animate-none` leaves the card fully rendered at that end state
 * and the hover lift is never frozen by a lingering filled `translate`.
 */
const TESTIMONIAL_KEYFRAMES = `
@keyframes mq-testimonial-rise {
  from { opacity: 0; translate: 0 8px; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes mq-testimonial-mark {
  from { scale: 0.7; }
  to { scale: 1; }
}`;

const testimonialCardVariants = cva(
  [
    "group relative isolate flex flex-col text-left border",
    "gap-[var(--mq-gap,14px)] p-[var(--mq-pad,22px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    "animate-[mq-testimonial-rise_460ms_ease-out] motion-reduce:animate-none",
    // Shadows and translucency are erased in forced-colors mode, so the card
    // would dissolve into the page. A system-coloured border keeps its bounds.
    "forced-colors:border-[CanvasText] forced-colors:shadow-none",
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
          // Forced colours discard the fill but NOT the blur, which would smear
          // the system canvas behind the card.
          "forced-colors:[backdrop-filter:none] forced-colors:bg-[Canvas]",
        ].join(" "),
        skeuo: [
          // Warm greige body under a lit top edge — the moulded-plastic recipe.
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#e6e3da))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_9px_0_var(--mq-edge,#a8a49b),0_20px_32px_rgba(38,36,31,0.283)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.175),0_2px_0_var(--mq-edge,#a8a49b),0_6px_9px_rgba(38,36,31,0.204)]",
          // Background IMAGES survive forced colours untouched, so the gradient
          // has to be cleared by hand or it would sit on a system surface it was
          // never designed against.
          "forced-colors:[background-image:none] forced-colors:bg-[Canvas]",
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
        sm: "[--mq-pad:16px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:15px] [--mq-quote:14px] [--mq-avatar:38px] [--mq-glyph-size:22px] [--mq-star-size:13px]",
        md: "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:17px] [--mq-quote:16px] [--mq-avatar:46px] [--mq-glyph-size:28px] [--mq-star-size:15px]",
        lg: "[--mq-pad:28px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:20px] [--mq-quote:19px] [--mq-avatar:54px] [--mq-glyph-size:34px] [--mq-star-size:17px]",
      },
    },
    compoundVariants: [
      {
        material: "clay",
        variant: "default",
        // --mq-star #9c4d16 measures 4.98:1 on #f6e7dd; the softer terracotta
        // this started from measured 4.37:1.
        class:
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817] " +
          "[--mq-acc:#33261e] [--mq-acc-fg:#fff3ea] [--mq-star:#9c4d16] " +
          "[--mq-glyph:rgba(120,80,55,0.42)] [--mq-well:#efd9cc]",
      },
      {
        material: "glass",
        variant: "default",
        // --mq-muted #36362f (not a lighter grey) holds 5.14:1 over a black
        // backdrop at 0.66 opacity, where a lighter muted measured only 4.27:1.
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817] " +
          "[--mq-acc:#1e1e1b] [--mq-acc-fg:#ffffff] [--mq-star:#8a4e0c] " +
          "[--mq-glyph:rgba(30,30,27,0.36)] [--mq-well:rgba(255,255,255,0.62)]",
      },
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#e6e3da] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817] " +
          "[--mq-acc:#23231f] [--mq-acc-fg:#f6f4ee] [--mq-star:#6e4a0c] " +
          "[--mq-glyph:rgba(35,35,31,0.34)] [--mq-well:#f2efe8]",
      },
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817] " +
          "[--mq-acc:#1c1c19] [--mq-acc-fg:#ffffff] [--mq-star:#8a5a12] " +
          "[--mq-glyph:rgba(28,28,25,0.30)] [--mq-well:#f2f1ec] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9] " +
          "dark:[--mq-acc:#f1efe9] dark:[--mq-acc-fg:#1c1c19] dark:[--mq-star:#e8b45a] " +
          "dark:[--mq-glyph:rgba(241,239,233,0.34)] dark:[--mq-well:#2e2f34] " +
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

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Formats a prop-supplied ISO date without ever touching `Date`.
 *
 * `new Date("2026-03-04")` is parsed as UTC midnight and then printed in the
 * viewer's zone, so a statically generated page can render one day on the server
 * and another in the browser — a hydration mismatch that only shows up west of
 * Greenwich. Slicing the string is timezone-stable and pure, and an unparseable
 * value is returned untouched rather than guessed at.
 */
function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  const name = MONTH_NAMES[Number(month) - 1];
  if (!year || !day || !name) return iso;
  return `${name} ${Number(day)}, ${year}`;
}

/** "4.5" for a fractional rating, "5" for a whole one. */
function formatRatingValue(value: number): string {
  const fixed = value.toFixed(1);
  return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
}

/** Deterministic initials for the avatar fallback — pure, so SSG-safe. */
function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return `${first}${last}`.toUpperCase();
}

/**
 * Decorative star row. Aria-hidden: the numeric value renders as visible text
 * beside it ("4.5 out of 5"), so the rating is never conveyed by star-count or
 * gold colour alone. Each position paints an empty star and clips a filled copy
 * to the exact fractional fill, computed deterministically from the value.
 */
function RatingStars({ max, value }: { max: number; value: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center gap-[2px] text-[color:var(--mq-star,#9c4d16)] forced-colors:text-[CanvasText]"
    >
      {Array.from({ length: max }, (_, index) => index).map((index) => {
        const fill = Math.max(0, Math.min(1, value - index));
        return (
          <span className="relative inline-flex" key={index}>
            <Star className="size-[var(--mq-star-size,15px)]" fill="none" strokeWidth={1.75} />
            {fill > 0 ? (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(fill * 100).toFixed(2)}%` }}
              >
                <Star
                  className="size-[var(--mq-star-size,15px)]"
                  fill="currentColor"
                  strokeWidth={1.75}
                />
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

export type TestimonialCardProps = Omit<
  React.ComponentPropsWithRef<"figure">,
  "children"
> &
  Omit<VariantProps<typeof testimonialCardVariants>, "material" | "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: TestimonialCardVariant;
    size?: TestimonialCardSize;
    /** The testimonial itself. Rendered inside a <blockquote>. */
    quote: string;
    /** Who said it. Also names the avatar's context and the Helpful toggle. */
    authorName: string;
    /** Their role and company, e.g. "Design director, Northstar". */
    authorRole?: string;
    /** Avatar image URL. Omit to fall back to deterministic initials. */
    avatarSrc?: string;
    /**
     * Alternative text for the avatar. Defaults to "" — the author's name sits
     * immediately beside the image, so a descriptive alt would make a screen
     * reader announce the same person twice. Pass a real string only if the
     * portrait carries information the caption does not.
     */
    avatarAlt?: string;
    /** Rating out of `ratingMax`. Omit to hide the rating row entirely. */
    rating?: number;
    /** Upper bound for the rating. Defaults to 5. */
    ratingMax?: number;
    /** Optional short pull-headline. When set it becomes the card's link text. */
    headline?: string;
    /**
     * Heading rank. A testimonial can appear at any depth of a page, so the
     * correct level is the document's business, not this component's.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    /** When set, the whole card becomes one link via the stretched-link pattern. */
    href?: string;
    /** Visible label for the link when there is no headline to carry it. */
    sourceLabel?: string;
    /** ISO date the testimonial was given, e.g. "2026-05-14". Never computed. */
    dateTime?: string;
    /** Human-readable date. Falls back to a pure format of `dateTime`. */
    dateLabel?: string;
    /** Number of readers who found this helpful. Omit to hide the vote entirely. */
    helpfulCount?: number;
    /** Initial pressed state of the Helpful toggle. */
    defaultHelpful?: boolean;
    /** Notified after every toggle with the new pressed state. */
    onHelpfulChange?: (helpful: boolean) => void;
    /** Dims the card, drops the whole-card link and disables the Helpful vote. */
    disabled?: boolean;
  };

export function TestimonialCard({
  authorName,
  authorRole,
  avatarAlt = "",
  avatarSrc,
  className,
  dateLabel,
  dateTime,
  defaultHelpful = false,
  disabled = false,
  headingLevel = 3,
  headline,
  helpfulCount,
  href,
  material = "clay",
  onHelpfulChange,
  quote,
  rating,
  ratingMax = 5,
  size = "md",
  sourceLabel = "Read the full story",
  variant = "default",
  ...props
}: TestimonialCardProps) {
  const [isHelpful, setIsHelpful] = React.useState(defaultHelpful);
  // Present in the DOM from the first render, empty, so assistive tech has
  // already adopted it as a live region by the time a message lands in it.
  const [statusMessage, setStatusMessage] = React.useState("");

  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
  const hasHeadline = typeof headline === "string" && headline.trim().length > 0;
  const isLinked = typeof href === "string" && href.length > 0 && !disabled;

  const safeMax = Number.isFinite(ratingMax) && ratingMax > 0 ? Math.round(ratingMax) : 5;
  const safeRating =
    typeof rating === "number" && Number.isFinite(rating)
      ? Math.min(Math.max(rating, 0), safeMax)
      : null;

  const baseHelpfulCount =
    typeof helpfulCount === "number" && Number.isFinite(helpfulCount)
      ? Math.max(0, Math.round(helpfulCount))
      : null;
  // Derived, never assigned from a callback: the React Compiler rejects a
  // variable declared in the component body that a handler reassigns.
  const helpfulDelta = isHelpful === defaultHelpful ? 0 : isHelpful ? 1 : -1;
  const helpfulTotal =
    baseHelpfulCount === null ? 0 : Math.max(0, baseHelpfulCount + helpfulDelta);

  const dateText = dateLabel ?? (dateTime ? formatIsoDate(dateTime) : undefined);
  const initials = initialsFrom(authorName);
  const showsSourceLink = isLinked && !hasHeadline;
  const showsActions = showsSourceLink || baseHelpfulCount !== null;

  // The state change lives in the handler, not in an effect: calling setState
  // synchronously from an effect body is exactly what react-hooks flags.
  function toggleHelpful() {
    const next = !isHelpful;
    const nextTotal =
      baseHelpfulCount === null
        ? 0
        : Math.max(0, baseHelpfulCount + (next === defaultHelpful ? 0 : next ? 1 : -1));
    setIsHelpful(next);
    setStatusMessage(
      `${next ? "Marked as helpful" : "Helpful mark removed"}. ${nextTotal} ${
        nextTotal === 1 ? "person" : "people"
      } found this testimonial helpful.`,
    );
    onHelpfulChange?.(next);
  }

  return (
    <>
      {/*
        `href` + `precedence` so React 19 hoists this into the head and
        deduplicates it: a bare <style> emits one identical copy per card.
      */}
      <style href="mq-testimonial-card" precedence="medium">
        {TESTIMONIAL_KEYFRAMES}
      </style>
      <figure
        {...props}
        className={cn(
          testimonialCardVariants({ material, variant, size }),
          isLinked && INTERACTIVE_LIFT,
          isLinked && FOCUS_WITHIN_RING,
          className,
        )}
        data-material={material}
        data-state={disabled ? "disabled" : "idle"}
      >
        {/* First child, so the <figcaption> below can stay the last one. */}
        <p aria-live="polite" className="sr-only">
          {statusMessage}
        </p>

        <div className="flex items-start justify-between gap-[10px]">
          <Quote
            aria-hidden="true"
            className="size-[var(--mq-glyph-size,28px)] shrink-0 text-[color:var(--mq-glyph,rgba(120,80,55,0.42))] forced-colors:text-[CanvasText]"
            fill="currentColor"
            strokeWidth={1.5}
          />
          {safeRating === null ? null : (
            <p className="m-0 flex items-center gap-[8px] text-[length:12px] leading-none">
              <RatingStars max={safeMax} value={safeRating} />
              {/* The VALUE, as text. The stars above are decoration. */}
              <span className="font-bold text-[color:var(--mq-text,#2b2b26)] forced-colors:text-[CanvasText]">
                {formatRatingValue(safeRating)} out of {safeMax}
              </span>
            </p>
          )}
        </div>

        <HeadingTag
          className={cn(
            "m-0 font-extrabold tracking-[-0.02em]",
            "text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.25]",
            // With no visible headline the card still contributes a real heading
            // to the document outline, so screen-reader users can jump to it.
            !hasHeadline && "sr-only",
          )}
        >
          {hasHeadline ? (
            isLinked ? (
              <a className={HEADLINE_LINK} href={href}>
                {headline}
              </a>
            ) : (
              headline
            )
          ) : (
            `Testimonial from ${authorName}`
          )}
        </HeadingTag>

        <blockquote
          cite={href}
          className="m-0 text-[length:var(--mq-quote,16px)] font-semibold leading-[1.55] tracking-[-0.01em] text-[color:var(--mq-text,#2b2b26)]"
        >
          <p className="m-0">{`“${quote}”`}</p>
        </blockquote>

        {showsActions ? (
          <div
            className={cn(
              "flex flex-wrap items-center gap-[10px]",
              showsSourceLink ? "justify-between" : "justify-end",
            )}
          >
            {showsSourceLink ? (
              <a className={SOURCE_LINK} href={href}>
                <span>{sourceLabel}</span>
                <span className="sr-only"> from {authorName}</span>
                <span
                  className={cn(
                    "inline-flex transition-[translate] duration-200 ease-out",
                    "group-hover:translate-x-[2px] group-hover:-translate-y-[2px]",
                    "motion-reduce:transition-none motion-reduce:group-hover:translate-x-0",
                    "motion-reduce:group-hover:translate-y-0",
                  )}
                >
                  <ArrowUpRight aria-hidden="true" className="size-[14px]" strokeWidth={2.25} />
                </span>
              </a>
            ) : null}

            {baseHelpfulCount === null ? null : (
              <span className="flex items-center gap-[10px]">
                {/* The count is real text, not a badge colour. */}
                <span className="text-[length:12px] leading-none text-[color:var(--mq-muted,#5c5b55)] forced-colors:text-[CanvasText]">
                  {helpfulTotal} found this helpful
                </span>
                <button
                  aria-pressed={isHelpful}
                  className={HELPFUL_BUTTON}
                  disabled={disabled}
                  onClick={toggleHelpful}
                  type="button"
                >
                  <span
                    className={cn(
                      "inline-flex",
                      "data-[on=true]:animate-[mq-testimonial-mark_320ms_ease-out]",
                      "motion-reduce:animate-none",
                    )}
                    data-on={isHelpful ? "true" : "false"}
                  >
                    <ThumbsUp
                      aria-hidden="true"
                      className="size-[14px]"
                      fill={isHelpful ? "currentColor" : "none"}
                      strokeWidth={2}
                    />
                  </span>
                  <span>{isHelpful ? "Marked helpful" : "Helpful"}</span>
                  <span className="sr-only"> — {authorName}&apos;s testimonial</span>
                </button>
              </span>
            )}
          </div>
        ) : null}

        <figcaption
          className={cn(
            "flex flex-wrap items-center gap-[12px]",
            "border-t border-[var(--mq-rule,rgba(23,24,23,0.14))] pt-[var(--mq-gap,14px)]",
            "forced-colors:border-[CanvasText]",
          )}
        >
          {/* Fixed-size well: the avatar can never resize the caption while the
              image loads, and the intrinsic width/height keep the box square
              even if the file is not. That is the CLS guarantee. */}
          <span
            className={cn(
              "relative grid aspect-square size-[var(--mq-avatar,46px)] shrink-0 place-items-center",
              "overflow-hidden rounded-full border",
              "border-[var(--mq-brd,rgba(120,80,55,0.16))] bg-[var(--mq-well,#efd9cc)]",
              "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]",
            )}
          >
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element -- copy-and-own component stays framework-agnostic
              <img
                alt={avatarAlt}
                className="size-full object-cover"
                decoding="async"
                height={96}
                loading="lazy"
                src={avatarSrc}
                width={96}
              />
            ) : (
              <span
                aria-hidden="true"
                className="text-[length:13px] font-black text-[color:var(--mq-text,#2b2b26)] forced-colors:text-[CanvasText]"
              >
                {initials}
              </span>
            )}
          </span>

          <span className="flex min-w-0 flex-col gap-[2px]">
            {/* Plain text, not <cite>: that element is defined for the title of
                a work, and a person is not a work. */}
            <span className="text-[length:13px] font-black leading-[1.3] text-[color:var(--mq-text,#2b2b26)]">
              {authorName}
            </span>
            {authorRole ? (
              <span className="text-[length:12px] leading-[1.4] text-[color:var(--mq-muted,#5c5b55)] forced-colors:text-[CanvasText]">
                {authorRole}
              </span>
            ) : null}
            {dateText ? (
              dateTime ? (
                <time
                  className="text-[length:11px] leading-[1.4] text-[color:var(--mq-muted,#5c5b55)] forced-colors:text-[CanvasText]"
                  dateTime={dateTime}
                >
                  {dateText}
                </time>
              ) : (
                <span className="text-[length:11px] leading-[1.4] text-[color:var(--mq-muted,#5c5b55)] forced-colors:text-[CanvasText]">
                  {dateText}
                </span>
              )
            ) : null}
          </span>
        </figcaption>
      </figure>
    </>
  );
}

export { testimonialCardVariants };
