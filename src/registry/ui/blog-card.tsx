"use client";

import * as React from "react";
import { ArrowUpRight, Bookmark, BookmarkCheck, Clock } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Blog Card
 *
 * ONE post preview — cover, category chip, heading, excerpt, author + date
 * footer. Not a grid: a single editorial surface you place wherever a post has
 * to be advertised. Self-contained by design — the four material recipes
 * (clay / glass / skeuo / adaptive) are copied and owned here, straight from
 * `card.tsx`, so dropping this file plus `src/lib/cn.ts` into another project
 * reproduces the full tactile look with no global stylesheet, no `:root`
 * custom properties and no site variables. Every `var()` carries a literal
 * fallback.
 *
 * Local theming knobs (custom properties declared on the card, inherited down):
 *
 *   --mq-body     surface colour
 *   --mq-lit      top highlight (skeuo gradient)
 *   --mq-edge     extruded bottom edge colour
 *   --mq-text     primary foreground (title, author)
 *   --mq-muted    secondary foreground (excerpt, date, reading time)
 *   --mq-rule     hairline above the footer
 *   --mq-well     cover / avatar placeholder wash, visible before the image
 *   --mq-brd      border colour
 *   --mq-ring     focus ring colour
 *   --mq-acc      accent fill for the category chip and the read affordance
 *   --mq-acc-fg   text on the accent fill
 *   --mq-pad      inner padding
 *   --mq-gap      vertical rhythm between blocks
 *   --mq-radius   corner radius
 *   --mq-title    heading font size
 *   --mq-excerpt  excerpt font size
 *   --mq-avatar   author avatar well size
 *
 * Contrast contract (inherited from the Card recipe): on every filled material
 * `--mq-text` and `--mq-muted` stay at or above 4.5:1 against the surface, and
 * the glass tokens carry their own tint so that holds over a white and a black
 * backdrop alike. `--mq-acc` is measured twice — as text on the card surface
 * (the read affordance) and as a fill under `--mq-acc-fg` (the chip).
 *
 * Whole-card link: when `href` is set the TITLE renders as a single <a> whose
 * `::after` stretches across the card, so the entire surface leads to the post
 * WITHOUT nesting anything inside that <a>. Every other control — the optional
 * category link, the Save toggle — sits on `relative z-10`, above the overlay,
 * and therefore stays independently clickable and independently focusable.
 *
 * Time is never computed here. `dateIso` and `dateLabel` both arrive as props
 * and are rendered as `<time dateTime={dateIso}>{dateLabel}</time>`; calling
 * `new Date()` during render would be non-deterministic and would break
 * hydration on a statically generated page.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type BlogCardVariant = "default";
type BlogCardSize = "sm" | "md" | "lg";

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
 * the title link outlines the whole card, so the stretched link never loses its
 * visible focus. An unlinked card skips this — outlining a card that merely
 * CONTAINS the Save button would double-ring the same focus.
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
 * `box-shadow`, which also changes). Both listed properties really change on
 * hover, so there is no phantom transition. Reduced motion cancels the travel
 * outright because the card is already a link — nothing is lost by removing it.
 */
const INTERACTIVE_LIFT =
  "cursor-pointer transition-[translate,box-shadow] duration-200 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[2px] motion-reduce:hover:translate-y-0 " +
  "hover:shadow-[var(--mq-shadow-hover,0_14px_35px_rgba(20,20,18,0.12))] " +
  "active:translate-y-[1px] active:shadow-[var(--mq-shadow-press,0_4px_10px_rgba(20,20,18,0.09))] " +
  "motion-reduce:active:translate-y-0";

/**
 * Stretched link: a single <a> whose transparent `::after` covers the card (the
 * nearest positioned ancestor is the `relative` article). The <a> drops its own
 * outline — the card's `:focus-within` ring is what shows the focus — and it
 * never wraps another interactive element.
 */
const STRETCHED_LINK =
  "text-inherit no-underline outline-none " +
  "[&::after]:absolute [&::after]:inset-0 [&::after]:z-[1] [&::after]:content-['']";

/** Category chip. A solid accent pill so its label never depends on the cover. */
const CHIP =
  "inline-flex max-w-full items-center gap-[5px] rounded-full px-[10px] py-[4px] " +
  "text-[length:11px] font-bold uppercase leading-none tracking-[0.08em] " +
  "bg-[var(--mq-acc,#8d2f1c)] text-[color:var(--mq-acc-fg,#fff3ea)] " +
  "shadow-[0_2px_8px_rgba(20,16,12,0.30)] " +
  "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] " +
  "forced-colors:text-[CanvasText] forced-colors:shadow-none";

/** Only when the chip is a real link. Raised above the stretched overlay. */
const CHIP_LINK =
  "no-underline transition-[translate] duration-150 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[1px] motion-reduce:hover:translate-y-0 active:translate-y-0 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Save toggle. Sits at `relative z-10`, above the stretched link's `::after`, so
 * it stays clickable and focusable on a card whose whole surface is a link.
 * State rides on `aria-pressed` AND on a different label and a different icon —
 * never on the fill colour alone.
 */
const SAVE_BUTTON =
  "relative z-10 ml-auto inline-flex shrink-0 items-center gap-[6px] " +
  "rounded-full border px-[11px] py-[6px] text-[length:12px] font-bold leading-none " +
  "border-[var(--mq-brd,rgba(23,24,23,0.14))] bg-transparent text-[color:var(--mq-text,#2b2b26)] " +
  "transition-[translate,background-color,color,border-color] duration-150 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[1px] motion-reduce:hover:translate-y-0 active:translate-y-0 " +
  "aria-pressed:border-transparent aria-pressed:bg-[var(--mq-acc,#8d2f1c)] " +
  "aria-pressed:text-[color:var(--mq-acc-fg,#fff3ea)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] " +
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 " +
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] " +
  "forced-colors:aria-pressed:bg-[Highlight] forced-colors:aria-pressed:text-[HighlightText] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Local keyframes.
 *
 * Both end at the component's RESTING visual state: the card finishes fully
 * opaque and untranslated, and the cover sheen finishes back at `opacity: 0`,
 * which is exactly what the sheen's static class already declares. So
 * `motion-reduce:animate-none` leaves the card completely rendered at its end
 * value instead of stranding it half-revealed.
 *
 * Neither animation uses a fill mode on purpose: `forwards` would pin
 * `translate: 0 0` onto the card permanently and quietly kill the hover lift.
 */
const BLOG_CARD_KEYFRAMES = `
@keyframes mq-blog-card-rise {
  from { opacity: 0; translate: 0 10px; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes mq-blog-card-sheen {
  from { opacity: 0; translate: -120% 0; }
  35% { opacity: 0.5; }
  to { opacity: 0; translate: 130% 0; }
}`;

const blogCardVariants = cva(
  [
    "group relative isolate flex flex-col text-left border",
    "gap-[var(--mq-gap,14px)] p-[var(--mq-pad,18px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    // Entrance. Ends at the resting state, so reduced motion simply shows the
    // finished card.
    "animate-[mq-blog-card-rise_520ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
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
          "forced-colors:bg-[Canvas] forced-colors:shadow-none",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(255,255,255,0.66))]",
          "border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.85),0_23px_55px_rgba(24,20,40,0.236)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),0_6px_15px_rgba(24,20,40,0.17)]",
          // The pane is gone in forced colours; without clearing the blur and
          // the wash the card would float on a surface it was never designed
          // against.
          "forced-colors:[backdrop-filter:none] forced-colors:bg-[Canvas] forced-colors:shadow-none",
        ].join(" "),
        skeuo: [
          // Warm greige, lit from above.
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#e6e3da))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_9px_0_var(--mq-edge,#a8a49b),0_20px_32px_rgba(38,36,31,0.283)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.175),0_2px_0_var(--mq-edge,#a8a49b),0_6px_9px_rgba(38,36,31,0.204)]",
          // Forced colours discard fills and shadows but NOT background images,
          // so the gradient has to be cleared by hand.
          "forced-colors:[background-image:none] forced-colors:bg-[Canvas] forced-colors:shadow-none",
        ].join(" "),
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)] [--mq-shadow-hover:0_1px_3px_rgba(20,20,18,0.118),0_14px_35px_rgba(20,20,18,0.071)] [--mq-shadow-press:0_0px_1px_rgba(20,20,18,0.085),0_4px_10px_rgba(20,20,18,0.051)]",
          "forced-colors:bg-[Canvas] forced-colors:shadow-none",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-pad:14px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:16px] [--mq-excerpt:12px] [--mq-avatar:28px]",
        md: "[--mq-pad:18px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:19px] [--mq-excerpt:13px] [--mq-avatar:34px]",
        lg: "[--mq-pad:24px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:23px] [--mq-excerpt:15px] [--mq-avatar:40px]",
      },
    },
    compoundVariants: [
      {
        material: "clay",
        variant: "default",
        // Accent #8d2f1c: 6.8:1 as text on #f6e7dd, and 7.5:1 under #fff3ea
        // when it is the chip's fill.
        class:
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-well:#eed6c6] [--mq-brd:rgba(120,80,55,0.16)] " +
          "[--mq-ring:#171817] [--mq-acc:#8d2f1c] [--mq-acc-fg:#fff3ea]",
      },
      {
        material: "glass",
        variant: "default",
        // --mq-muted #36362f (not a lighter grey) holds 5.1:1 over a BLACK
        // backdrop at 0.66 opacity, where a lighter muted measured only 4.3:1.
        // --mq-acc #33257a is chosen the same way: 5.2:1 over that same worst
        // case, 12.4:1 over white.
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-well:rgba(23,24,23,0.14)] [--mq-brd:rgba(255,255,255,0.75)] " +
          "[--mq-ring:#171817] [--mq-acc:#33257a] [--mq-acc-fg:#ffffff]",
      },
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#e6e3da] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-well:#cfcabd] [--mq-brd:rgba(25,25,23,0.28)] " +
          "[--mq-ring:#171817] [--mq-acc:#4a3418] [--mq-acc-fg:#f6f4ee]",
      },
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-well:#eceae4] [--mq-brd:rgba(23,24,23,0.14)] " +
          "[--mq-ring:#171817] [--mq-acc:#3d2f9e] [--mq-acc-fg:#ffffff] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-well:#33343a] dark:[--mq-brd:rgba(255,255,255,0.16)] " +
          "dark:[--mq-ring:#f1efe9] dark:[--mq-acc:#b9a1ff] dark:[--mq-acc-fg:#1c1c19] " +
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
 * Busy wash. Purely decorative and inert, so it is hidden from assistive tech —
 * `aria-busy` on the article is what carries the meaning. Uses Tailwind's
 * built-in `animate-pulse`; under reduced motion the pulse stops and a static
 * wash remains, so the busy state is still visible without any movement.
 */
function Shimmer() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-20 rounded-[inherit]",
        "bg-[rgba(255,255,255,0.42)] animate-pulse motion-reduce:animate-none",
      )}
    />
  );
}

/**
 * Author initials fallback, derived purely from the name — no randomness, no
 * clock, identical on the server and the client.
 */
function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

export type BlogCardProps = Omit<React.ComponentPropsWithRef<"article">, "title"> &
  Omit<VariantProps<typeof blogCardVariants>, "material" | "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: BlogCardVariant;
    size?: BlogCardSize;
    /** Cover image URL. */
    coverSrc: string;
    /** Real alternative text for the cover. Use "" only if truly decorative. */
    coverAlt: string;
    /** Section or topic shown in the chip. Plain text by default. */
    category: string;
    /**
     * Turns the chip into a real link to the category archive. It is then
     * raised above the stretched overlay so it stays independently clickable.
     */
    categoryHref?: string;
    /** Post title — the heading and, when `href` is set, the whole-card link. */
    title: string;
    /** When set, the whole card becomes one link via the stretched-link pattern. */
    href?: string;
    /** Standfirst / summary shown under the title. */
    excerpt: string;
    /**
     * Heading rank. The correct level depends on the surrounding document
     * outline, so it is overridable rather than hardcoded.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    /** Byline. */
    authorName: string;
    /** Optional avatar URL. Without it the card draws the author's initials. */
    authorAvatarSrc?: string;
    /**
     * Alt text for the avatar. Defaults to "" because the author's name sits
     * right beside it as text — repeating it would be noise.
     */
    authorAvatarAlt?: string;
    /** Machine-readable publication date, e.g. "2026-07-18". A PROP, never computed. */
    dateIso: string;
    /** Human-readable publication date, e.g. "July 18, 2026". Also a PROP. */
    dateLabel: string;
    /** Optional reading estimate, e.g. "6 min read". */
    readingTime?: string;
    /** Decorative label on the read affordance. */
    readMoreLabel?: string;
    /** Renders the Save toggle in the footer. */
    showSave?: boolean;
    /** Visible label while unsaved. */
    saveLabel?: string;
    /** Visible label while saved. */
    savedLabel?: string;
    /** Controlled saved state. Omit for an uncontrolled toggle. */
    saved?: boolean;
    /** Initial saved state when uncontrolled. */
    defaultSaved?: boolean;
    /** Fires with the next saved state on every toggle. */
    onSaveChange?: (saved: boolean) => void;
    /** Polite announcement after saving. */
    savedAnnouncement?: string;
    /** Polite announcement after un-saving. */
    unsavedAnnouncement?: string;
    /** Marks the card busy: sets `aria-busy` and washes it over. */
    loading?: boolean;
    /** Unpublished / unavailable: fades the card and drops the whole-card link. */
    disabled?: boolean;
  };

export function BlogCard({
  authorAvatarAlt = "",
  authorAvatarSrc,
  authorName,
  category,
  categoryHref,
  className,
  coverAlt,
  coverSrc,
  dateIso,
  dateLabel,
  defaultSaved = false,
  disabled = false,
  excerpt,
  headingLevel = 3,
  href,
  loading = false,
  material = "clay",
  onSaveChange,
  readMoreLabel = "Read article",
  readingTime,
  saveLabel = "Save",
  saved,
  savedAnnouncement = "Saved to your reading list",
  savedLabel = "Saved",
  showSave = true,
  size = "md",
  title,
  unsavedAnnouncement = "Removed from your reading list",
  variant = "default",
  ...props
}: BlogCardProps) {
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
  const isLinked = Boolean(href) && !disabled;

  // Uncontrolled fallback. The transition lives in the click handler, never in
  // an effect — a synchronous setState in an effect body is exactly what
  // `react-hooks/set-state-in-effect` forbids, and there is nothing to
  // subscribe to here anyway.
  const [internalSaved, setInternalSaved] = React.useState(defaultSaved);
  const [announcement, setAnnouncement] = React.useState("");
  const isSaved = saved ?? internalSaved;

  function toggleSaved() {
    const next = !isSaved;
    if (saved === undefined) setInternalSaved(next);
    setAnnouncement(next ? savedAnnouncement : unsavedAnnouncement);
    onSaveChange?.(next);
  }

  const initials = initialsFrom(authorName);

  return (
    <>
      {/*
        `href` + `precedence` so React 19 hoists this and deduplicates it: a
        bare <style> would emit one identical copy per BlogCard on the page.
      */}
      <style href="mq-blog-card" precedence="medium">
        {BLOG_CARD_KEYFRAMES}
      </style>
      <article
        {...props}
        aria-busy={loading || undefined}
        className={cn(
          blogCardVariants({ material, variant, size }),
          // Gate every whole-card affordance on `!disabled`: an unpublished
          // card must not lift, must not ring, and must not render a live link.
          isLinked && INTERACTIVE_LIFT,
          isLinked && FOCUS_WITHIN_RING,
          className,
        )}
        data-material={material}
        data-state={disabled ? "disabled" : loading ? "loading" : "idle"}
      >
        {loading ? <Shimmer /> : null}

        {/*
          Aspect-ratio well: the box reserves its exact height before the image
          arrives, so nothing below it shifts on load. That is the CLS
          guarantee — the `--mq-well` wash is what the reader sees meanwhile.
        */}
        <div className="relative overflow-hidden rounded-[calc(var(--mq-radius,24px)_-_8px)] aspect-[16/10] bg-[var(--mq-well,#eed6c6)] forced-colors:bg-[Canvas] forced-colors:border forced-colors:border-[CanvasText]">
          {/* eslint-disable-next-line @next/next/no-img-element -- copy-and-own component stays framework-agnostic */}
          <img
            src={coverSrc}
            alt={coverAlt}
            width={960}
            height={600}
            loading="lazy"
            decoding="async"
            className={cn(
              // `scale-*` is a STANDALONE property in Tailwind v4, so the
              // transition names `scale` — `transition-transform` alone would
              // not have covered it here.
              "size-full object-cover scale-100",
              "transition-[scale] duration-500 ease-out",
              "group-hover:scale-[1.045]",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
            )}
          />

          {/*
            Specular sheen, played once. It rests at `opacity-0`, which is also
            the animation's end value, so `motion-reduce:animate-none` leaves
            the cover exactly as it should finish: clean.
          */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 z-[2] opacity-0",
              "[background-image:linear-gradient(105deg,transparent_36%,rgba(255,255,255,0.72)_50%,transparent_64%)]",
              "animate-[mq-blog-card-sheen_1400ms_ease-out_240ms] motion-reduce:animate-none",
              // Background images survive forced colours untouched, so without
              // this the sheen would paint a white band across the system
              // palette.
              "forced-colors:[background-image:none]",
            )}
          />

          <div className="absolute left-[10px] top-[10px] z-10 max-w-[calc(100%_-_20px)]">
            {categoryHref && !disabled ? (
              <a className={cn(CHIP, CHIP_LINK)} href={categoryHref}>
                <span className="truncate">{category}</span>
              </a>
            ) : (
              // Plain text by default: a chip that were a link would put an
              // interactive element under the stretched overlay unless it is
              // raised, so the inert case simply lets clicks fall through.
              <span className={cn(CHIP, "pointer-events-none")}>
                <span className="truncate">{category}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <HeadingTag className="m-0 font-extrabold tracking-[-0.025em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,19px)] leading-[1.22]">
            {isLinked ? (
              <a className={STRETCHED_LINK} href={href}>
                {title}
              </a>
            ) : (
              title
            )}
          </HeadingTag>

          <p className="m-0 line-clamp-3 text-[color:var(--mq-muted,#5c5b55)] text-[length:var(--mq-excerpt,13px)] leading-[1.65]">
            {excerpt}
          </p>

          {isLinked ? (
            // Decorative: the heading link already carries the destination and
            // its accessible name, so repeating it here as a second link would
            // just add a duplicate tab stop.
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-[6px] text-[length:12px] font-bold text-[color:var(--mq-acc,#8d2f1c)] forced-colors:text-[CanvasText]"
            >
              {readMoreLabel}
              <ArrowUpRight
                className={cn(
                  "size-[14px] transition-[translate] duration-200 ease-out",
                  "group-hover:translate-x-[2px] group-hover:-translate-y-[2px]",
                  "motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0",
                )}
                strokeWidth={2.5}
              />
            </span>
          ) : null}
        </div>

        <footer className="mt-auto flex flex-wrap items-center gap-[10px] border-t border-[var(--mq-rule,rgba(23,24,23,0.14))] pt-[var(--mq-gap,14px)] forced-colors:border-[CanvasText]">
          {/* Fixed-size avatar well: square before the image lands, so the
              byline never reflows. */}
          <span className="grid size-[var(--mq-avatar,34px)] shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--mq-well,#eed6c6)] text-[length:11px] font-bold text-[color:var(--mq-text,#2b2b26)] forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]">
            {authorAvatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element -- copy-and-own component stays framework-agnostic
              <img
                src={authorAvatarSrc}
                alt={authorAvatarAlt}
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            ) : (
              <span aria-hidden="true">{initials}</span>
            )}
          </span>

          <span className="flex min-w-0 flex-col gap-[3px]">
            <span className="truncate text-[length:12px] font-bold leading-none text-[color:var(--mq-text,#2b2b26)]">
              {authorName}
            </span>
            <span className="flex flex-wrap items-center gap-[6px] text-[length:11px] leading-none text-[color:var(--mq-muted,#5c5b55)]">
              {/* The date is rendered, never derived: both halves are props, so
                  the server and the client always agree. */}
              <time dateTime={dateIso}>{dateLabel}</time>
              {readingTime ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-[4px]">
                    <Clock aria-hidden="true" className="size-[12px]" strokeWidth={2.25} />
                    {readingTime}
                  </span>
                </>
              ) : null}
            </span>
          </span>

          {showSave ? (
            <>
              <button
                aria-pressed={isSaved}
                className={SAVE_BUTTON}
                disabled={disabled}
                onClick={toggleSaved}
                type="button"
              >
                {isSaved ? (
                  <BookmarkCheck aria-hidden="true" className="size-[14px]" strokeWidth={2.25} />
                ) : (
                  <Bookmark aria-hidden="true" className="size-[14px]" strokeWidth={2.25} />
                )}
                <span>{isSaved ? savedLabel : saveLabel}</span>
                {/* Leading space: accessible-name computation is not guaranteed
                    to insert one between two inline nodes, and "SaveDesigning…"
                    is not a name anyone can act on. */}
                <span className="sr-only">{` ${title}`}</span>
              </button>
              {/* Present in the DOM from the first render, BEFORE any text is
                  put into it — a live region added at the same moment as its
                  content is frequently missed by screen readers. */}
              <span aria-live="polite" className="sr-only">
                {announcement}
              </span>
            </>
          ) : null}
        </footer>
      </article>
    </>
  );
}

export { blogCardVariants };
