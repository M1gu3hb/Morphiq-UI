"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Post Card
 *
 * ONE social post: the author's avatar, display name, handle and timestamp, the
 * post body, optional media, and an action row of like / comment / share with
 * real counts. Distinct from `notification-card` (a system message) and from
 * `blog-card` (an article teaser) — this is the feed unit, the thing you stack
 * a hundred of.
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
 *   --mq-text        primary foreground (name, body copy)
 *   --mq-muted       secondary foreground (handle, timestamp, resting actions)
 *   --mq-rule        hairline above the action row, and the media well's fill
 *   --mq-brd         border colour
 *   --mq-ring        focus ring colour
 *   --mq-well        avatar well fill, action hover wash, pressed-like wash
 *   --mq-like        filled-heart tint (>= 4.5:1 on both the surface and the well)
 *   --mq-pad         inner padding
 *   --mq-gap         vertical rhythm between blocks
 *   --mq-radius      corner radius
 *   --mq-title       display-name font size
 *   --mq-copy        post body font size
 *   --mq-meta        handle / timestamp font size
 *   --mq-act         action-row font size
 *   --mq-avatar      avatar edge length
 *   --mq-icon        action glyph size
 *
 * Contrast contract (inherited from the Card recipe): on every filled material
 * both --mq-text and --mq-muted stay at or above 4.5:1 against the surface, and
 * the glass tokens carry their own tint so that holds over a white and a black
 * backdrop alike. --mq-like clears 4.5:1 against the surface AND against the
 * pressed action wash, because a filled heart is informative, not decoration.
 *
 * Time is never computed here. `new Date()` / `Date.now()` during render is
 * non-deterministic and desynchronises a statically generated page from its
 * hydration, so the ISO value and the human-readable string both arrive as
 * props; the fallback formatter slices the ISO string, which is timezone-stable.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type PostCardVariant = "default";
type PostCardSize = "sm" | "md" | "lg";
type PostCardAspect = "16/9" | "4/3" | "1/1";

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
  "forced-colors:focus-visible:outline-[Highlight] forced-colors:data-[focus=true]:outline-[Highlight]";

/**
 * `:focus-within` is scoped to the LINKED card only. Tabbing to the stretched
 * permalink outlines the whole card, which is the only way that link can show
 * focus — its own box is a transparent overlay. An inert post that merely holds
 * like / comment / share buttons skips this, because outlining the card as well
 * as the button double-rings one focus and reads as two separate targets.
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
 * Stretched link: a single <a>, INSIDE the heading so the display name is its
 * accessible name, whose transparent `::after` covers the card (the nearest
 * positioned ancestor is the `relative isolate` article). It deliberately
 * carries no `relative` of its own — that would make the anchor the containing
 * block and shrink the overlay back to the text. The three action buttons sit on
 * a higher z-index, so they keep their own click and focus while the rest of the
 * surface routes to the permalink. No <a> or <button> is ever nested inside the
 * link. The <a> drops its own outline; the card's `:focus-within` ring shows the
 * focus instead.
 */
const STRETCHED_LINK =
  "text-inherit no-underline outline-none underline-offset-[3px] hover:underline " +
  "[&::after]:absolute [&::after]:inset-0 [&::after]:z-[1] [&::after]:content-['']";

/**
 * Media zoom, applied only on a linked card — an inert post has no hover state,
 * so declaring the transition there would name a property nothing changes.
 *
 * Tailwind v4 writes `scale-*` to the standalone `scale` property, so the
 * transition NAMES `scale`; an arbitrary `transition-[transform]` would animate
 * nothing and the zoom would snap.
 */
const MEDIA_ZOOM =
  "scale-100 transition-[scale] duration-500 ease-out " +
  "group-hover:scale-[1.04] " +
  "motion-reduce:transition-none motion-reduce:group-hover:scale-100";

/**
 * Like / comment / share.
 *
 * Sits at `relative z-10`, above the stretched link's overlay, so each stays
 * clickable and focusable on a card whose whole surface is a link. The pressed
 * look is routed through three local variables rather than being set directly
 * under `aria-pressed:`. An `aria-pressed:bg-*` utility carries an attribute
 * selector, so it would outrank the flat `forced-colors:bg-*` reset and a
 * pressed toggle would keep painting its own wash where the system palette must
 * win. Swapping variables instead leaves the forced-colors rules free to
 * override a same-specificity declaration by source order.
 */
const ACTION_BUTTON =
  "relative z-10 inline-flex cursor-pointer items-center gap-[7px] whitespace-nowrap " +
  "min-h-[38px] pointer-coarse:min-h-[44px] rounded-full border px-[12px] py-[7px] " +
  "text-[length:var(--mq-act,12px)] font-bold leading-none " +
  "[--mq-act-brd:transparent] [--mq-act-bg:transparent] [--mq-act-fg:var(--mq-muted,#5c5b55)] " +
  "border-[var(--mq-act-brd,transparent)] bg-[var(--mq-act-bg,transparent)] " +
  "text-[color:var(--mq-act-fg,#5c5b55)] " +
  "transition-[translate,background-color,color,border-color] duration-150 ease-out " +
  "motion-reduce:transition-none " +
  "hover:-translate-y-[1px] hover:[--mq-act-bg:var(--mq-well,rgba(255,255,255,0.55))] " +
  "hover:[--mq-act-fg:var(--mq-text,#2b2b26)] " +
  "motion-reduce:hover:translate-y-0 active:translate-y-0 " +
  "aria-pressed:[--mq-act-brd:var(--mq-brd,rgba(120,80,55,0.16))] " +
  "aria-pressed:[--mq-act-bg:var(--mq-well,rgba(255,255,255,0.55))] " +
  "aria-pressed:[--mq-act-fg:var(--mq-text,#2b2b26)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] " +
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 " +
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] " +
  "forced-colors:aria-pressed:bg-[Highlight] forced-colors:aria-pressed:text-[HighlightText] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Local keyframes, hoisted and deduplicated by React 19 via `href` +
 * `precedence`: a bare <style> would emit one identical copy per card on the
 * page. The pop ENDS on the heart's resting `scale: 1` and declares no fill
 * mode, so `motion-reduce:animate-none` leaves the glyph fully rendered at that
 * end state — only the travel is dropped, never the fill change or the count.
 */
const POST_CARD_KEYFRAMES = `
@keyframes mq-post-card-pop {
  0% { scale: 1; }
  35% { scale: 1.28; }
  70% { scale: 0.95; }
  100% { scale: 1; }
}`;

const postCardVariants = cva(
  [
    "group relative isolate flex flex-col text-left border",
    "gap-[var(--mq-gap,14px)] p-[var(--mq-pad,22px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
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
        sm: "[--mq-pad:16px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:15px] [--mq-copy:13px] [--mq-meta:11px] [--mq-act:12px] [--mq-avatar:36px] [--mq-icon:15px]",
        md: "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:17px] [--mq-copy:14px] [--mq-meta:12px] [--mq-act:12px] [--mq-avatar:44px] [--mq-icon:16px]",
        lg: "[--mq-pad:28px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:20px] [--mq-copy:16px] [--mq-meta:13px] [--mq-act:13px] [--mq-avatar:52px] [--mq-icon:18px]",
      },
    },
    compoundVariants: [
      {
        material: "clay",
        variant: "default",
        // --mq-like #8c1226 measures 7.8:1 on #f6e7dd and 7.0:1 on the pressed
        // well #efd9cc, so the filled heart reads as informative, not as tint.
        class:
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817] " +
          "[--mq-well:#efd9cc] [--mq-like:#8c1226]",
      },
      {
        material: "glass",
        variant: "default",
        // --mq-muted #36362f (not a lighter grey) holds 5.14:1 over a black
        // backdrop at 0.66 opacity, where a lighter muted measured only 4.27:1.
        // --mq-like is pushed to #6b0f1f for the same reason: over a black
        // backdrop the pressed wash composites to ~#9e9e9e, where the softer
        // crimson measured 4.04:1 and this one holds 4.58:1.
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817] " +
          "[--mq-well:rgba(255,255,255,0.62)] [--mq-like:#6b0f1f]",
      },
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#e6e3da] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817] " +
          "[--mq-well:#f2efe8] [--mq-like:#7a1020]",
      },
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817] " +
          "[--mq-well:#f2f1ec] [--mq-like:#a3122b] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9] " +
          "dark:[--mq-well:#2e2f34] dark:[--mq-like:#ff9aad] " +
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
 * Static class per ratio so Tailwind's scanner sees every value it must emit —
 * an interpolated `aspect-[${ratio}]` would never be generated. The well is what
 * guarantees the media has stable dimensions before it loads, so nothing below
 * it shifts when the bytes land.
 */
const MEDIA_ASPECT: Record<PostCardAspect, string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-[1/1]",
};

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
 * Formats a prop-supplied ISO timestamp without ever touching `Date`.
 *
 * `new Date("2026-03-04")` is parsed as UTC midnight and printed in the viewer's
 * zone, so a statically generated page can render one day on the server and
 * another in the browser — a hydration mismatch that only shows up west of
 * Greenwich. Slicing the string is timezone-stable and pure, and an unparseable
 * value is returned untouched rather than guessed at.
 */
function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  const name = MONTH_NAMES[Number(month) - 1];
  if (!year || !day || !name) return iso;
  return `${name} ${Number(day)}, ${year}`;
}

/** Deterministic, locale-free compact count (SSR-safe for SSG). */
function stripTrailingZero(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

function formatCount(value: number): string {
  const magnitude = Math.abs(value);
  if (magnitude < 1000) return `${value}`;
  if (magnitude < 1_000_000) return `${stripTrailingZero(magnitude / 1000)}K`;
  return `${stripTrailingZero(magnitude / 1_000_000)}M`;
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
 * One action in the footer row. A real <button>, so Enter and Space work
 * natively and the accessible name always contains the visible label plus the
 * visible count — never an abbreviation the reader cannot see.
 */
function PostAction({
  accessibleName,
  count,
  disabled,
  glyph,
  label,
  onClick,
  pressed,
}: {
  accessibleName: string;
  count?: string;
  disabled: boolean;
  glyph: React.ReactNode;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  pressed?: boolean;
}) {
  return (
    <button
      aria-label={accessibleName}
      aria-pressed={pressed}
      className={ACTION_BUTTON}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {glyph}
      <span>{label}</span>
      {count === undefined ? null : (
        <span className="[font-variant-numeric:tabular-nums]">{count}</span>
      )}
    </button>
  );
}

type PostCardOwnProps = {
  material?: MaterialSlug;
  variant?: PostCardVariant;
  size?: PostCardSize;
  /** Display name of the author. Becomes the card's heading and its link text. */
  authorName: string;
  /** Handle as it should read, including the sigil, e.g. "@ada". */
  authorHandle?: string;
  /** Avatar image URL. Omit to fall back to deterministic initials. */
  avatarSrc?: string;
  /**
   * Alternative text for the avatar. Defaults to "" — the author's name sits
   * immediately beside the image, so a descriptive alt would announce the same
   * person twice. Pass a real string only if the portrait carries information
   * the name does not.
   */
  avatarAlt?: string;
  /** Shows a verified glyph plus `verifiedLabel` as text for assistive tech. */
  verified?: boolean;
  /** Accessible wording behind the verified glyph. */
  verifiedLabel?: string;
  /** ISO timestamp for the <time> element, e.g. "2026-07-21T09:30:00Z". */
  timestamp?: string;
  /** Human-readable timestamp. Falls back to a pure format of `timestamp`. */
  timestampLabel?: string;
  /** The post body. Newlines are preserved. */
  content: string;
  /** Optional media URL rendered inside a fixed aspect-ratio well. */
  mediaSrc?: string;
  /** Real alternative text for the media. Leave "" only if truly decorative. */
  mediaAlt?: string;
  /** Aspect ratio of the media well. Defaults to 16/9. */
  mediaAspect?: PostCardAspect;
  /** When set, the whole card becomes one link via the stretched-link pattern. */
  href?: string;
  /** Appended to the permalink's accessible name after the author's name. */
  permalinkLabel?: string;
  /**
   * Heading rank. A post can appear at any depth of a page, so the correct level
   * is the document's business, not this component's.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Controlled liked state. Omit for uncontrolled (the card owns it). */
  liked?: boolean;
  /** Initial liked state when uncontrolled. */
  defaultLiked?: boolean;
  /** Controlled like count. Omit for uncontrolled. */
  likeCount?: number;
  /** Initial like count when uncontrolled. */
  defaultLikeCount?: number;
  /** Fired after a toggle with the next liked state and count. */
  onLikeChange?: (liked: boolean, count: number) => void;
  /** Replies behind the comment action. Omit to hide its count. */
  commentCount?: number;
  /** Click handler for the comment action. */
  onComment?: React.MouseEventHandler<HTMLButtonElement>;
  /** Reshares behind the share action. Omit to hide its count. */
  shareCount?: number;
  /** Click handler for the share action. */
  onShare?: React.MouseEventHandler<HTMLButtonElement>;
  /** Dims the card, drops the whole-card link and disables every action. */
  disabled?: boolean;
};

/**
 * The own props are subtracted from the native `<article>` props (the `Omit<>`
 * pattern) so everything else — `id`, `data-*`, `aria-*`, `onClick`, `ref` (a
 * normal prop in React 19) — spreads straight onto the element. `children` is
 * removed because the card composes its own content.
 */
export type PostCardProps = PostCardOwnProps &
  Omit<React.ComponentPropsWithRef<"article">, keyof PostCardOwnProps | "children">;

export function PostCard({
  "aria-label": ariaLabel,
  authorHandle,
  authorName,
  avatarAlt = "",
  avatarSrc,
  className,
  commentCount,
  content,
  defaultLikeCount = 0,
  defaultLiked = false,
  disabled = false,
  headingLevel = 3,
  href,
  likeCount,
  liked,
  material = "clay",
  mediaAlt = "",
  mediaAspect = "16/9",
  mediaSrc,
  onComment,
  onLikeChange,
  onShare,
  permalinkLabel = "view post",
  shareCount,
  size = "md",
  timestamp,
  timestampLabel,
  variant = "default",
  verified = false,
  verifiedLabel = "Verified account",
  ...props
}: PostCardProps) {
  const [internalLiked, setInternalLiked] = React.useState(defaultLiked);
  const [internalCount, setInternalCount] = React.useState(defaultLikeCount);
  // Bumping a counter remounts the heart so its CSS animation replays on every
  // toggle. It starts at 0, so nothing animates on first paint (SSR-stable).
  const [pulse, setPulse] = React.useState(0);
  // Present in the DOM from the first render, empty, so assistive tech has
  // already adopted it as a live region by the time a message lands in it.
  const [statusMessage, setStatusMessage] = React.useState("");

  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
  const isLinked = typeof href === "string" && href.length > 0 && !disabled;

  const currentLiked = liked ?? internalLiked;
  const currentCount = likeCount ?? internalCount;
  const likeText = formatCount(currentCount);
  const likeLabel = currentLiked ? "Liked" : "Like";
  const likeNoun = currentCount === 1 ? "like" : "likes";

  const timeText = timestampLabel ?? (timestamp ? formatIsoDate(timestamp) : "");
  const initials = initialsFrom(authorName);
  const hasMeta = Boolean(authorHandle) || Boolean(timestamp);

  // The state change lives in the handler that causes it, never in an effect:
  // calling setState synchronously from an effect body is exactly what
  // react-hooks/set-state-in-effect flags.
  function toggleLike() {
    const nextLiked = !currentLiked;
    const nextCount = Math.max(0, currentCount + (nextLiked ? 1 : -1));
    if (liked === undefined) setInternalLiked(nextLiked);
    if (likeCount === undefined) setInternalCount(nextCount);
    setPulse((value) => value + 1);
    setStatusMessage(
      `${nextLiked ? "Liked" : "Like removed"}. ${formatCount(nextCount)} ${
        nextCount === 1 ? "like" : "likes"
      }.`,
    );
    onLikeChange?.(nextLiked, nextCount);
  }

  return (
    <>
      {/*
        `href` + `precedence` so React 19 hoists this into the head and
        deduplicates it: a bare <style> emits one identical copy per card, and a
        feed renders many.
      */}
      <style href="mq-post-card" precedence="medium">
        {POST_CARD_KEYFRAMES}
      </style>
      <article
        {...props}
        aria-label={ariaLabel ?? `Post by ${authorName}`}
        className={cn(
          postCardVariants({ material, variant, size }),
          isLinked && INTERACTIVE_LIFT,
          isLinked && FOCUS_WITHIN_RING,
          className,
        )}
        data-material={material}
        data-state={disabled ? "disabled" : "idle"}
      >
        {/* In the DOM before any text arrives, so the toggle is announced. */}
        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {statusMessage}
        </p>

        <header className="flex items-center gap-[12px]">
          <span
            className={cn(
              "grid size-[var(--mq-avatar,44px)] shrink-0 place-items-center overflow-hidden",
              "rounded-full border border-[var(--mq-brd,rgba(120,80,55,0.16))]",
              "bg-[var(--mq-well,#efd9cc)] text-[length:var(--mq-meta,12px)] font-extrabold",
              "text-[color:var(--mq-text,#2b2b26)]",
              "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
            )}
          >
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element -- copy-and-own component stays framework-agnostic
              <img
                alt={avatarAlt}
                className="size-full object-cover"
                decoding="async"
                loading="lazy"
                src={avatarSrc}
              />
            ) : (
              // The name is right beside it, so the monogram says nothing new.
              <span aria-hidden="true">{initials}</span>
            )}
          </span>

          <div className="flex min-w-0 flex-col gap-[3px]">
            <div className="flex min-w-0 flex-wrap items-center gap-[6px]">
              <HeadingTag
                className={cn(
                  "m-0 font-extrabold tracking-[-0.02em] break-words",
                  "text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.2]",
                )}
              >
                {isLinked ? (
                  <a className={STRETCHED_LINK} href={href}>
                    {authorName}
                    {/* Keeps the link's purpose in its accessible name while the
                        visible label stays exactly the author's name. */}
                    <span className="sr-only">, {permalinkLabel}</span>
                  </a>
                ) : (
                  authorName
                )}
              </HeadingTag>
              {verified ? (
                <span className="inline-flex items-center">
                  <BadgeCheck
                    aria-hidden="true"
                    className="size-[var(--mq-icon,16px)] shrink-0 text-[color:var(--mq-text,#2b2b26)] forced-colors:text-[CanvasText]"
                    strokeWidth={2.25}
                  />
                  {/* The badge is never colour or glyph alone. */}
                  <span className="sr-only">{verifiedLabel}</span>
                </span>
              ) : null}
            </div>

            {hasMeta ? (
              <p className="m-0 flex flex-wrap items-center text-[length:var(--mq-meta,12px)] leading-[1.4] text-[color:var(--mq-muted,#5c5b55)] forced-colors:text-[CanvasText]">
                {authorHandle ? <span>{authorHandle}</span> : null}
                {authorHandle && timestamp ? <span aria-hidden="true">&nbsp;·&nbsp;</span> : null}
                {timestamp ? <time dateTime={timestamp}>{timeText}</time> : null}
              </p>
            ) : null}
          </div>
        </header>

        <p className="m-0 whitespace-pre-line break-words text-[length:var(--mq-copy,14px)] leading-[1.6] text-[color:var(--mq-text,#2b2b26)]">
          {content}
        </p>

        {mediaSrc ? (
          <div
            className={cn(
              "relative overflow-hidden rounded-[calc(var(--mq-radius,24px)_-_10px)]",
              MEDIA_ASPECT[mediaAspect],
              "bg-[var(--mq-rule,rgba(120,80,55,0.20))]",
              "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- copy-and-own component stays framework-agnostic */}
            <img
              alt={mediaAlt}
              className={cn("size-full object-cover", isLinked && MEDIA_ZOOM)}
              decoding="async"
              loading="lazy"
              src={mediaSrc}
            />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-[8px] border-t border-[var(--mq-rule,rgba(23,24,23,0.14))] pt-[var(--mq-gap,14px)] forced-colors:border-[CanvasText]">
          <PostAction
            accessibleName={`${likeLabel}, ${likeText} ${likeNoun}`}
            count={likeText}
            disabled={disabled}
            glyph={
              <span
                className={cn(
                  "inline-flex",
                  pulse > 0 &&
                    "animate-[mq-post-card-pop_360ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
                )}
                key={`heart-${pulse}`}
              >
                <Heart
                  aria-hidden="true"
                  className={cn(
                    "size-[var(--mq-icon,16px)] shrink-0",
                    currentLiked && "text-[color:var(--mq-like,#8c1226)]",
                    // Inside a button whose forced-colors fill flips between
                    // ButtonFace and Highlight, the glyph must take that same
                    // forced foreground rather than pin one of its own.
                    "forced-colors:text-[color:currentColor]",
                  )}
                  fill={currentLiked ? "currentColor" : "none"}
                  strokeWidth={2.25}
                />
              </span>
            }
            label={likeLabel}
            onClick={toggleLike}
            pressed={currentLiked}
          />

          <PostAction
            accessibleName={
              commentCount === undefined
                ? "Comment on this post"
                : `Comment on this post, ${formatCount(commentCount)} ${
                    commentCount === 1 ? "comment" : "comments"
                  }`
            }
            count={commentCount === undefined ? undefined : formatCount(commentCount)}
            disabled={disabled}
            glyph={
              <MessageCircle
                aria-hidden="true"
                className="size-[var(--mq-icon,16px)] shrink-0 forced-colors:text-[color:currentColor]"
                strokeWidth={2.25}
              />
            }
            label="Comment"
            onClick={onComment}
          />

          <PostAction
            accessibleName={
              shareCount === undefined
                ? "Share this post"
                : `Share this post, ${formatCount(shareCount)} ${
                    shareCount === 1 ? "share" : "shares"
                  }`
            }
            count={shareCount === undefined ? undefined : formatCount(shareCount)}
            disabled={disabled}
            glyph={
              <Share2
                aria-hidden="true"
                className="size-[var(--mq-icon,16px)] shrink-0 forced-colors:text-[color:currentColor]"
                strokeWidth={2.25}
              />
            }
            label="Share"
            onClick={onShare}
          />
        </div>
      </article>
    </>
  );
}

export type PostCardVariantProps = VariantProps<typeof postCardVariants>;

export { postCardVariants };
