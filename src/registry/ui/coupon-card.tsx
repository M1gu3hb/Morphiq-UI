"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Coupon Card
 *
 * A voucher: a headline value ("25% OFF"), the terms, an expiry, and a promo
 * code that can be revealed and copied. The silhouette is a real ticket — two
 * notches punched into the left and right edges plus a dashed tear line — cut
 * with a radial-gradient MASK rather than two page-coloured circles, so the
 * ticket keeps its shape on any background, including a photograph.
 *
 * Self-contained by design: the four material recipes (clay / glass / skeuo /
 * adaptive) are copied and owned here, straight from `card.tsx`, so dropping
 * this file plus `src/lib/cn.ts` into another project reproduces the full
 * tactile look with no global stylesheet and no `:root` custom properties.
 * Every `var()` carries a literal fallback.
 *
 * Local theming knobs (declared on the card, inherited by everything inside):
 *
 *   --mq-body        surface colour
 *   --mq-lit         top highlight (skeuo gradient)
 *   --mq-edge        extruded bottom edge colour
 *   --mq-text        primary foreground
 *   --mq-muted       secondary foreground (terms, expiry, captions)
 *   --mq-rule        dashed tear line / code-well hairline
 *   --mq-brd         border colour
 *   --mq-ring        focus ring colour
 *   --mq-acc         accent fill for the Copy control
 *   --mq-acc-fg      text on the accent fill
 *   --mq-well        recessed code-well surface
 *   --mq-stub-grad   wash over the value band
 *   --mq-drop        resting depth, as a `drop-shadow()` filter list
 *   --mq-shadow-hover / --mq-shadow-press  the same list, lifted and sunk
 *   --mq-pad         inner padding
 *   --mq-gap         vertical rhythm in the detail block
 *   --mq-radius      corner radius
 *   --mq-stub        height of the value band — and therefore the notch/tear Y
 *   --mq-notch       notch radius
 *   --mq-value       headline value font size
 *   --mq-title       offer title font size
 *   --mq-code        promo code font size
 *   --mq-fine        terms / expiry font size
 *   --mq-eyebrow     caption font size
 *
 * Depth note: a mask clips everything the element paints, box-shadow included,
 * so the outer depth is a `filter: drop-shadow()` list instead — which has the
 * happy side effect of following the notched silhouette rather than the box.
 * Inset shadows stay on the surface itself, where the mask trimming them at the
 * notch is exactly right. `--mq-shadow-hover` / `--mq-shadow-press` keep their
 * Card names and role (lift and press) but hold filter lists here; every
 * material sets all three, so an inherited box-shadow value can never leak in.
 *
 * Contrast contract (inherited from the Card recipe): on every filled material
 * --mq-text and --mq-muted stay at or above 4.5:1 against the surface, and the
 * glass tokens carry their own tint so that holds over a white and a black
 * backdrop alike.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type CouponCardVariant = "default";
type CouponCardSize = "sm" | "md" | "lg";

/** Fallback material, single-sourced so the default and `data-material` agree. */
const DEFAULT_MATERIAL: MaterialSlug = "clay";

/** How long the copied state lingers before reverting to idle, in ms. */
const COPIED_DURATION_MS = 1800;

/** Bounds for the masked placeholder shown before the code is revealed. */
const MIN_MASK_DOTS = 6;
const MAX_MASK_DOTS = 12;

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
 * `:focus-within` is scoped to the LINKED card only: tabbing to the title link
 * outlines the whole ticket, so the stretched link never loses its visible
 * focus. An inert coupon skips it — outlining the card as well as the Copy
 * button would double-ring the same focus.
 */
const FOCUS_WITHIN_RING =
  "focus-within:outline-2 focus-within:outline-offset-[3px] " +
  "focus-within:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-within:outline-[Highlight]";

/**
 * Stretched link: a single <a>, inside the heading so the offer title is its
 * accessible name, whose transparent `::after` covers the ticket (the nearest
 * positioned ancestor). Everything that must stay independently reachable — the
 * code well, the Reveal toggle, the Copy button — sits on a higher `z-index`,
 * so the code stays selectable and the controls stay clickable while the rest
 * of the surface routes to the offer. No <a> or <button> is ever nested inside
 * another. The <a> drops its own outline; the card's `:focus-within` ring shows
 * the focus.
 */
const STRETCHED_LINK =
  "text-inherit no-underline outline-none " +
  "[&::after]:absolute [&::after]:inset-0 [&::after]:z-[1] [&::after]:content-['']";

/**
 * The ticket notches.
 *
 * Two mask layers, each sized to slightly more than half the ticket and pinned
 * to opposite edges, so they never overlap and the default `add` compositing
 * keeps both holes — no `mask-composite`, which is the least portable part of
 * the masking spec. The opaque stop is `#fff` rather than `#000` so the mask
 * reads the same whether the UA resolves it in alpha or luminance mode, and
 * `no-repeat` is mandatory: at 50.5% width a repeating layer would tile extra
 * notches across the card.
 */
const NOTCH_MASK =
  "[--mq-notch-mask:radial-gradient(circle_var(--mq-notch,13px)_at_left_var(--mq-stub,102px),rgba(255,255,255,0)_98%,#fff_100%),radial-gradient(circle_var(--mq-notch,13px)_at_right_var(--mq-stub,102px),rgba(255,255,255,0)_98%,#fff_100%)] " +
  "[mask-image:var(--mq-notch-mask,none)] [mask-size:50.5%_100%,50.5%_100%] " +
  "[mask-position:left_top,right_top] [mask-repeat:no-repeat] " +
  "[-webkit-mask-image:var(--mq-notch-mask,none)] [-webkit-mask-size:50.5%_100%,50.5%_100%] " +
  "[-webkit-mask-position:left_top,right_top] [-webkit-mask-repeat:no-repeat]";

/** Recessed well the promo code sits in. Real, selectable text — never an image. */
const CODE_WELL =
  "inline-flex max-w-full select-text items-center overflow-hidden " +
  "rounded-[calc(var(--mq-radius,22px)_-_12px)] border border-dashed " +
  "border-[var(--mq-rule,rgba(120,80,55,0.34))] bg-[var(--mq-well,rgba(255,255,255,0.62))] " +
  "px-[12px] py-[7px] font-mono font-bold tracking-[0.12em] " +
  "text-[length:var(--mq-code,16px)] text-[color:var(--mq-text,#33261e)] " +
  "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]";

const CAPTION =
  "text-[length:var(--mq-eyebrow,11px)] font-bold uppercase tracking-[0.16em] " +
  "text-[color:var(--mq-muted,#6a5346)] forced-colors:text-[CanvasText]";

/**
 * Shared control chrome. `translate` (not `transform`) is what Tailwind v4's
 * `translate-*` utilities write, so the transition names it — otherwise the
 * hover nudge would snap. Both listed properties really change, so there is no
 * phantom transition.
 */
const CONTROL_BASE =
  "relative z-10 inline-flex cursor-pointer items-center justify-center gap-[6px] " +
  "rounded-[calc(var(--mq-radius,22px)_-_12px)] px-[14px] py-[9px] " +
  "text-[length:13px] font-bold whitespace-nowrap " +
  "transition-[translate,opacity] duration-150 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[1px] motion-reduce:hover:translate-y-0 active:translate-y-0 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 " +
  "forced-colors:focus-visible:outline-[Highlight]";

const COPY_CONTROL =
  `${CONTROL_BASE} ` +
  "border border-transparent bg-[var(--mq-acc,#33261e)] " +
  "text-[color:var(--mq-acc-fg,#fff3ea)] hover:opacity-90 " +
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]";

const REVEAL_CONTROL =
  `${CONTROL_BASE} ` +
  "border border-[var(--mq-rule,rgba(120,80,55,0.34))] bg-transparent " +
  "text-[color:var(--mq-text,#33261e)] hover:opacity-80 " +
  "forced-colors:border-[ButtonText] forced-colors:text-[ButtonText]";

/**
 * Local keyframes, rendered with the component. `href` + `precedence` so React
 * 19 hoists and deduplicates them: a bare <style> would emit one identical copy
 * per coupon on the page. Each animation ENDS at the element's resting state,
 * so `motion-reduce:animate-none` leaves it fully rendered at that end value.
 */
const COUPON_KEYFRAMES = `
@keyframes mq-coupon-reveal {
  from { opacity: 0; translate: 0 5px; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes mq-coupon-stamp {
  from { opacity: 0; scale: 0.62; }
  to { opacity: 1; scale: 1; }
}`;

const couponCardVariants = cva(
  [
    "group relative isolate block text-left",
    "rounded-[var(--mq-radius,22px)] text-[color:var(--mq-text,#33261e)]",
    "data-[state=disabled]:opacity-60",
    FOCUS_RING,
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#f6e7dd] [--mq-lit:#fffaf6] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346]",
          "[--mq-rule:rgba(120,80,55,0.34)] [--mq-brd:rgba(120,80,55,0.18)] [--mq-ring:#171817]",
          "[--mq-acc:#33261e] [--mq-acc-fg:#fff3ea] [--mq-well:rgba(255,255,255,0.62)]",
          "[--mq-stub-grad:linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0))]",
          "[--mq-drop:drop-shadow(0_6px_0_var(--mq-edge,#dcc4b2))_drop-shadow(0_14px_22px_rgba(90,60,45,0.20))]",
          "[--mq-shadow-hover:drop-shadow(0_9px_0_var(--mq-edge,#dcc4b2))_drop-shadow(0_22px_34px_rgba(90,60,45,0.24))]",
          "[--mq-shadow-press:drop-shadow(0_3px_0_var(--mq-edge,#dcc4b2))_drop-shadow(0_7px_12px_rgba(90,60,45,0.18))]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-lit:rgba(255,255,255,0.9)] [--mq-text:#1e1e1b] [--mq-muted:#36362f]",
          "[--mq-rule:rgba(23,24,23,0.32)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817]",
          "[--mq-acc:#1e1e1b] [--mq-acc-fg:#ffffff] [--mq-well:rgba(255,255,255,0.58)]",
          "[--mq-stub-grad:linear-gradient(180deg,rgba(255,255,255,0.5),rgba(255,255,255,0))]",
          "[--mq-drop:drop-shadow(0_12px_26px_rgba(24,20,40,0.22))]",
          "[--mq-shadow-hover:drop-shadow(0_20px_40px_rgba(24,20,40,0.28))]",
          "[--mq-shadow-press:drop-shadow(0_5px_12px_rgba(24,20,40,0.18))]",
        ].join(" "),
        // Warm greige, lit from the top edge like a printed card stock.
        skeuo: [
          "[--mq-lit:#f7f5f0] [--mq-body:#e6e3da] [--mq-edge:#b4b0a6] [--mq-text:#23231f] [--mq-muted:#4a4943]",
          "[--mq-rule:rgba(25,25,23,0.36)] [--mq-brd:rgba(25,25,23,0.30)] [--mq-ring:#171817]",
          "[--mq-acc:#23231f] [--mq-acc-fg:#f7f5f0] [--mq-well:#f7f5f0]",
          "[--mq-stub-grad:linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0))]",
          "[--mq-drop:drop-shadow(0_5px_0_var(--mq-edge,#b4b0a6))_drop-shadow(0_12px_18px_rgba(38,36,31,0.26))]",
          "[--mq-shadow-hover:drop-shadow(0_8px_0_var(--mq-edge,#b4b0a6))_drop-shadow(0_18px_28px_rgba(38,36,31,0.30))]",
          "[--mq-shadow-press:drop-shadow(0_2px_0_var(--mq-edge,#b4b0a6))_drop-shadow(0_6px_9px_rgba(38,36,31,0.22))]",
        ].join(" "),
        // Almost no ornament: the palette flips with the colour scheme instead.
        adaptive: [
          "[--mq-body:#ffffff] [--mq-lit:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
          "[--mq-rule:rgba(23,24,23,0.28)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817]",
          "[--mq-acc:#1c1c19] [--mq-acc-fg:#ffffff] [--mq-well:#f2f2ef]",
          "[--mq-stub-grad:linear-gradient(180deg,rgba(23,24,23,0.05),rgba(23,24,23,0))]",
          "[--mq-drop:drop-shadow(0_1px_2px_rgba(20,20,18,0.12))_drop-shadow(0_8px_18px_rgba(20,20,18,0.10))]",
          "[--mq-shadow-hover:drop-shadow(0_2px_4px_rgba(20,20,18,0.14))_drop-shadow(0_14px_28px_rgba(20,20,18,0.14))]",
          "[--mq-shadow-press:drop-shadow(0_1px_1px_rgba(20,20,18,0.10))_drop-shadow(0_4px_9px_rgba(20,20,18,0.08))]",
          "dark:[--mq-body:#232327] dark:[--mq-lit:#2b2b30] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
          "dark:[--mq-rule:rgba(255,255,255,0.30)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9]",
          "dark:[--mq-acc:#f1efe9] dark:[--mq-acc-fg:#1c1c19] dark:[--mq-well:#17171a]",
          "dark:[--mq-stub-grad:linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0))]",
          "dark:[--mq-drop:drop-shadow(0_2px_4px_rgba(0,0,0,0.55))_drop-shadow(0_12px_26px_rgba(0,0,0,0.50))]",
          "dark:[--mq-shadow-hover:drop-shadow(0_3px_6px_rgba(0,0,0,0.60))_drop-shadow(0_20px_38px_rgba(0,0,0,0.55))]",
          "dark:[--mq-shadow-press:drop-shadow(0_1px_2px_rgba(0,0,0,0.50))_drop-shadow(0_6px_12px_rgba(0,0,0,0.45))]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      // `--mq-stub` is the single source of truth for the ticket's geometry: the
      // value band is exactly that tall, and the notches and tear line are cut
      // at exactly that Y, so the silhouette can never drift out of alignment.
      size: {
        sm: "[--mq-pad:14px] [--mq-gap:8px] [--mq-radius:16px] [--mq-title:14px] [--mq-value:30px] [--mq-stub:82px] [--mq-notch:11px] [--mq-code:14px] [--mq-fine:11px] [--mq-eyebrow:10px]",
        md: "[--mq-pad:20px] [--mq-gap:11px] [--mq-radius:22px] [--mq-title:16px] [--mq-value:40px] [--mq-stub:102px] [--mq-notch:13px] [--mq-code:16px] [--mq-fine:12px] [--mq-eyebrow:11px]",
        lg: "[--mq-pad:26px] [--mq-gap:14px] [--mq-radius:28px] [--mq-title:19px] [--mq-value:50px] [--mq-stub:124px] [--mq-notch:16px] [--mq-code:18px] [--mq-fine:13px] [--mq-eyebrow:12px]",
      },
    },
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

const couponTicketVariants = cva(
  [
    "relative isolate overflow-hidden rounded-[var(--mq-radius,22px)] border",
    NOTCH_MASK,
    "[filter:var(--mq-drop,drop-shadow(0_8px_18px_rgba(20,20,18,0.14)))]",
    "transition-[translate,filter,backdrop-filter] duration-200 ease-out",
    "motion-reduce:transition-none",
    // Forced colours discard fills, shadows and translucency, and may ignore the
    // mask outright — a system-coloured border is what keeps the ticket reading
    // as one bounded object. The washes are cleared by hand because background
    // IMAGES survive forced colours and would otherwise sit on a system surface
    // they were never designed against.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]",
    "forced-colors:[background-image:none] forced-colors:[filter:none]",
    "forced-colors:[backdrop-filter:none]",
    "forced-colors:[mask-image:none] forced-colors:[-webkit-mask-image:none]",
  ].join(" "),
  {
    variants: {
      material: {
        clay:
          "bg-[var(--mq-body,#f6e7dd)] border-[var(--mq-brd,rgba(120,80,55,0.18))] " +
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12)]",
        glass:
          "bg-[var(--mq-body,rgba(255,255,255,0.66))] border-[var(--mq-brd,rgba(255,255,255,0.75))] " +
          "backdrop-blur-[18px] backdrop-saturate-[170%] " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]",
        skeuo:
          "bg-[linear-gradient(180deg,var(--mq-lit,#f7f5f0),var(--mq-body,#e6e3da))] " +
          "border-[var(--mq-brd,rgba(25,25,23,0.30))] " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-3px_5px_rgba(0,0,0,0.12)]",
        adaptive:
          "bg-[var(--mq-body,#ffffff)] border-[var(--mq-brd,rgba(23,24,23,0.14))]",
      },
      /**
       * Only a linked coupon lifts. The lift and the drop-shadow tell the same
       * story — the ticket rises off the page and its contact shadow grows with
       * it, then collapses when pressed — and both are pure feedback nobody has
       * to read, so reduced motion cancels the travel outright.
       */
      interactive: {
        true:
          "group-hover:-translate-y-[2px] motion-reduce:group-hover:translate-y-0 " +
          "group-hover:[filter:var(--mq-shadow-hover,drop-shadow(0_14px_28px_rgba(20,20,18,0.18)))] " +
          "group-active:translate-y-[1px] motion-reduce:group-active:translate-y-0 " +
          "group-active:[filter:var(--mq-shadow-press,drop-shadow(0_4px_10px_rgba(20,20,18,0.12)))]",
        false: "",
      },
    },
    defaultVariants: {
      material: "clay",
      interactive: false,
    },
  },
);

export type CouponCardProps = Omit<
  React.ComponentPropsWithRef<"article">,
  "title" | "onCopy"
> & {
  material?: MaterialSlug;
  variant?: CouponCardVariant;
  size?: CouponCardSize;
  /** Headline value, e.g. "25% OFF". Real text, never an image. */
  value: string;
  /** Short label above the value, e.g. "Spring sale". */
  kicker?: string;
  /** Offer title — the card's heading and, when `href` is set, the link text. */
  title: string;
  /** Fine print. Real text. */
  terms?: string;
  /** The promo code. Rendered as real, selectable text. */
  code: string;
  /** Visible caption for the code. Doubles as its programmatic label. */
  codeLabel?: string;
  /** Start with the code hidden behind a reveal toggle. */
  revealable?: boolean;
  /** Reveal toggle label while the code is hidden. */
  revealLabel?: string;
  /** Reveal toggle label while the code is showing. */
  hideLabel?: string;
  /** Machine-readable expiry for `<time dateTime>`. Comes from props, never `new Date()`. */
  expiresOn?: string;
  /** Human-readable expiry, supplied by the caller so render stays deterministic. */
  expiresLabel?: string;
  /** Word before the expiry date. */
  expiresPrefix?: string;
  /** When set, the whole ticket becomes one link via the stretched-link pattern. */
  href?: string;
  /** Short status text such as "Expired". Text, never colour alone. */
  status?: string;
  /**
   * Heading rank for the title. The correct level depends on the surrounding
   * document outline, so it is overridable rather than hardcoded.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Idle label on the copy control. */
  copyLabel?: string;
  /** Label shown for a moment after a successful copy. */
  copiedLabel?: string;
  /** Text announced in the live region on success. Defaults to `Code <code> copied`. */
  copyAnnouncement?: string;
  /** Called with the code after it reaches the clipboard. */
  onCopyCode?: (code: string) => void;
  /** Called with the next visibility whenever the reveal toggle is used. */
  onRevealChange?: (revealed: boolean) => void;
  /** Marks the coupon unusable: dims it, disables the controls, drops the link. */
  disabled?: boolean;
};

export function CouponCard({
  className,
  code,
  codeLabel = "Promo code",
  copiedLabel = "Copied",
  copyAnnouncement,
  copyLabel = "Copy",
  disabled = false,
  expiresLabel,
  expiresOn,
  expiresPrefix = "Expires",
  headingLevel = 3,
  hideLabel = "Hide code",
  href,
  kicker,
  material = DEFAULT_MATERIAL,
  onCopyCode,
  onRevealChange,
  revealLabel = "Reveal code",
  revealable = false,
  size = "md",
  status,
  terms,
  title,
  value,
  variant = "default",
  ...props
}: CouponCardProps) {
  const [revealed, setRevealed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactId = React.useId();
  const codeId = `${reactId}-code`;

  // Clear a pending revert on unmount so a late timer never calls setState on an
  // unmounted component. The state change itself happens in the handler, never
  // synchronously in an effect body.
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
  const isLinked = Boolean(href) && !disabled;
  const showCode = !revealable || revealed;
  const maskLength = Math.min(Math.max(code.length, MIN_MASK_DOTS), MAX_MASK_DOTS);
  const announcement = copyAnnouncement ?? `Code ${code} copied`;
  // Label-in-name: the accessible name always contains the visible label, so a
  // voice-control user can say what they can see in either state.
  const copyAccessibleName = copied
    ? `${copiedLabel} code ${code}`
    : `${copyLabel} code ${code}`;

  function toggleReveal() {
    setRevealed((current) => {
      const next = !current;
      onRevealChange?.(next);
      return next;
    });
  }

  async function handleCopy() {
    if (disabled) return;

    // Guarded INSIDE the handler — never at module scope and never during
    // render, so server rendering and browsers without the async Clipboard API
    // are both safe.
    const clipboard = typeof navigator !== "undefined" ? navigator.clipboard : undefined;
    if (!clipboard?.writeText) return;

    try {
      await clipboard.writeText(code);
    } catch {
      // Permission denied or an insecure context: leave the idle state intact
      // rather than announcing a copy that never happened.
      return;
    }

    onCopyCode?.(code);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), COPIED_DURATION_MS);
  }

  return (
    <>
      <style href="mq-coupon-card" precedence="medium">
        {COUPON_KEYFRAMES}
      </style>
      <article
        {...props}
        className={cn(
          couponCardVariants({ material, variant, size }),
          isLinked && FOCUS_WITHIN_RING,
          className,
        )}
        data-material={material}
        data-revealed={showCode ? "true" : "false"}
        data-state={disabled ? "disabled" : "idle"}
      >
        <div className={couponTicketVariants({ material, interactive: isLinked })}>
          {/* Value band. Its height IS `--mq-stub`, which is also where the
              notches and the tear line are cut. */}
          <div
            className={cn(
              "flex h-[var(--mq-stub,102px)] items-center justify-between gap-[10px]",
              "px-[var(--mq-pad,20px)]",
              "[background-image:var(--mq-stub-grad,none)] forced-colors:[background-image:none]",
            )}
          >
            <p className="m-0 flex min-w-0 flex-col gap-[4px]">
              {kicker ? <span className={CAPTION}>{kicker}</span> : null}
              <span
                className={cn(
                  "font-black leading-none tracking-[-0.03em]",
                  "text-[length:var(--mq-value,40px)] text-[color:var(--mq-text,#33261e)]",
                  "forced-colors:text-[CanvasText]",
                )}
              >
                {value}
              </span>
            </p>
            {status ? (
              <span
                className={cn(
                  "shrink-0 rounded-full border px-[10px] py-[4px]",
                  "border-[var(--mq-rule,rgba(120,80,55,0.34))]",
                  "text-[length:var(--mq-eyebrow,11px)] font-bold uppercase tracking-[0.12em]",
                  "text-[color:var(--mq-muted,#6a5346)]",
                  "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]",
                )}
              >
                {status}
              </span>
            ) : null}
          </div>

          {/* Tear line, inset past the notches so the perforation reads as one
              continuous cut. Decoration only — the sections are already
              distinguished by their content. */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute z-[2] h-0",
              "top-[var(--mq-stub,102px)]",
              "left-[calc(var(--mq-notch,13px)_+_9px)] right-[calc(var(--mq-notch,13px)_+_9px)]",
              "border-t-2 border-dashed border-[var(--mq-rule,rgba(120,80,55,0.34))]",
              "forced-colors:border-[CanvasText]",
            )}
          />

          <div className="flex flex-col gap-[var(--mq-gap,11px)] p-[var(--mq-pad,20px)]">
            <HeadingTag
              className={cn(
                "m-0 font-extrabold tracking-[-0.02em] leading-[1.25]",
                "text-[color:var(--mq-text,#33261e)] text-[length:var(--mq-title,16px)]",
                "forced-colors:text-[CanvasText]",
              )}
            >
              {isLinked ? (
                <a className={STRETCHED_LINK} href={href}>
                  {title}
                </a>
              ) : (
                title
              )}
            </HeadingTag>

            {terms ? (
              <p
                className={cn(
                  "m-0 text-[length:var(--mq-fine,12px)] leading-[1.6]",
                  "text-[color:var(--mq-muted,#6a5346)] forced-colors:text-[CanvasText]",
                )}
              >
                {terms}
              </p>
            ) : null}

            {expiresOn && expiresLabel ? (
              <p
                className={cn(
                  "m-0 text-[length:var(--mq-fine,12px)] font-semibold leading-[1.5]",
                  "text-[color:var(--mq-muted,#6a5346)] forced-colors:text-[CanvasText]",
                )}
              >
                {`${expiresPrefix} `}
                <time dateTime={expiresOn}>{expiresLabel}</time>
              </p>
            ) : null}

            {/* Raised above the stretched link's overlay so the code stays
                SELECTABLE and both controls stay independently clickable and
                focusable. */}
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-[10px] pt-[2px]">
              <dl className="m-0 flex min-w-0 flex-col gap-[5px]" id={codeId}>
                <dt className={CAPTION}>{codeLabel}</dt>
                <dd className="m-0 min-w-0">
                  {showCode ? (
                    <span
                      className={cn(
                        CODE_WELL,
                        // Only a coupon that STARTED hidden animates: a card
                        // whose code was always visible would otherwise replay
                        // this on every page load.
                        revealable && "animate-[mq-coupon-reveal_240ms_ease-out]",
                        "motion-reduce:animate-none",
                      )}
                    >
                      {code}
                    </span>
                  ) : (
                    <>
                      {/* The hidden code is genuinely absent from the DOM, so it
                          is absent from the accessibility tree too. */}
                      <span className="sr-only">Hidden</span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          CODE_WELL,
                          "select-none tracking-[0.3em] text-[color:var(--mq-muted,#6a5346)]",
                        )}
                      >
                        {"•".repeat(maskLength)}
                      </span>
                    </>
                  )}
                </dd>
              </dl>

              <div className="flex flex-wrap items-center gap-[8px]">
                {revealable ? (
                  <button
                    aria-controls={codeId}
                    aria-expanded={revealed}
                    className={REVEAL_CONTROL}
                    disabled={disabled}
                    onClick={toggleReveal}
                    type="button"
                  >
                    {revealed ? (
                      <EyeOff aria-hidden="true" className="size-[16px]" strokeWidth={2} />
                    ) : (
                      <Eye aria-hidden="true" className="size-[16px]" strokeWidth={2} />
                    )}
                    <span>{revealed ? hideLabel : revealLabel}</span>
                  </button>
                ) : null}

                {showCode ? (
                  <button
                    aria-label={copyAccessibleName}
                    className={COPY_CONTROL}
                    data-copied={copied || undefined}
                    disabled={disabled}
                    onClick={handleCopy}
                    type="button"
                  >
                    {copied ? (
                      <Check
                        aria-hidden="true"
                        className="size-[16px] animate-[mq-coupon-stamp_180ms_ease-out] motion-reduce:animate-none"
                        strokeWidth={2.75}
                      />
                    ) : (
                      <Copy aria-hidden="true" className="size-[16px]" strokeWidth={2.25} />
                    )}
                    {/* Both labels share one grid cell so the control sizes to
                        the wider of the two and never reflows on the swap. */}
                    <span className="grid">
                      <span className={cn("[grid-area:1/1]", copied && "invisible")}>
                        {copyLabel}
                      </span>
                      <span className={cn("[grid-area:1/1]", !copied && "invisible")}>
                        {copiedLabel}
                      </span>
                    </span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Persistent polite live region: it is in the DOM long BEFORE any text
            arrives, so the content change is what gets announced. Kept outside
            every control so its text is never folded into a button's name. */}
        <span aria-live="polite" className="sr-only" role="status">
          {copied ? announcement : ""}
        </span>
      </article>
    </>
  );
}

export { couponCardVariants, couponTicketVariants };
