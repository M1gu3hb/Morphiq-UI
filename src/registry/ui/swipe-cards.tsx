"use client";

import * as React from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Swipe Cards
 *
 * A deck the reader triages one card at a time: reject to the left, accept to
 * the right. The top card follows the pointer while dragging and flies out once
 * it passes the threshold, revealing the card beneath it.
 *
 * DRAG IS NEVER THE ONLY WAY. Two real `<button>`s ("Reject" / "Accept") sit in
 * a control tray under the deck and do exactly what a swipe does, and the whole
 * region answers ArrowLeft (reject) / ArrowRight (accept). Enter and Space
 * activate whichever control has focus, natively — nothing here fakes a button.
 * Every decision is announced through an `aria-live="polite"` region that is in
 * the DOM from the first render, so the text arrives into a region assistive
 * tech is already watching.
 *
 * Focus is never dropped. The decision buttons live OUTSIDE the stack, so the
 * top card unmounting cannot take focus with it; if focus happens to be on a
 * link inside the leaving card it is moved deliberately onto the control that
 * made the decision, and when the last card leaves (which unmounts nothing but
 * disables the two decision buttons) focus is reclaimed onto "Start over".
 *
 * Self-contained by design: the four material recipes (clay / glass / skeuo /
 * adaptive) are copied and owned here, straight from `card.tsx`, so dropping
 * this file plus `src/lib/cn.ts` into another project reproduces the full
 * tactile look with no global stylesheet and no `:root` custom properties.
 * Every `var()` carries a literal fallback.
 *
 * Local theming knobs (declared on the deck root, inherited by cards and tray):
 *
 *   --mq-body      card / tray surface
 *   --mq-lit       top highlight (skeuo gradient)
 *   --mq-edge      extruded bottom edge
 *   --mq-text      primary foreground
 *   --mq-muted     secondary foreground (meta, description, counter)
 *   --mq-rule      hairline, image-well wash, progress border
 *   --mq-brd       border colour
 *   --mq-ring      focus ring colour
 *   --mq-track     progress track surface
 *   --mq-yes       accept fill        --mq-yes-fg  label on the accept fill
 *   --mq-no        reject accent      --mq-no-wash reject hover wash
 *   --mq-wash      neutral hover wash for the tertiary control
 *   --mq-pad       card padding       --mq-gap     vertical rhythm
 *   --mq-radius    corner radius      --mq-title   title font size
 *   --mq-deck      deck well height   --mq-media   image-well height cap
 *
 * Contrast contract: on every material `--mq-text` and `--mq-muted` stay at or
 * above 4.5:1 against the surface, and the glass tokens carry their own tint so
 * that holds over a white and a black backdrop alike. `--mq-yes` / `--mq-no`
 * clear 4.5:1 against their own surface too, but they never carry meaning on
 * their own: every decision is spelled out in words.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type SwipeCardsVariant = "default";
type SwipeCardsSize = "sm" | "md" | "lg";

/** Which way a card left the deck. */
export type SwipeDecision = "accept" | "reject";

/* -------------------------------------------------------------------------- */
/* Tunables                                                                    */
/* -------------------------------------------------------------------------- */

/** Cards kept in the DOM: the live one plus two peeking behind it. */
const VISIBLE_COUNT = 3;
/** Vertical offset added per card of depth in the stack. */
const STACK_STEP_PX = 22;
/** Scale removed per card of depth, so the deck reads as receding. */
const STACK_SCALE_STEP = 0.032;
/** Degrees of tilt per pixel dragged, and the cap on that tilt. */
const TILT_PER_PX = 0.055;
const MAX_TILT_DEG = 13;
/** Release animation: how far, how high and how hard the card spins out. */
const FLY_DISTANCE_PX = 560;
const FLY_LIFT_PX = 28;
const FLY_TILT_DEG = 20;
/** Must outlast the 300ms card transition so the flight finishes on screen. */
const FLIGHT_MS = 320;
/** Drag distance that commits a decision, per size. */
const SWIPE_THRESHOLD_PX: Record<SwipeCardsSize, number> = { sm: 72, md: 92, lg: 112 };
/** Drag distance before the intent stamp starts fading in. */
const STAMP_START_PX = 14;

/* -------------------------------------------------------------------------- */
/* Focus                                                                       */
/* -------------------------------------------------------------------------- */

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
 * The docs preview forces its focus state on the deck ROOT, so the accept
 * button — the control a reader reaches first — mirrors the ring through a
 * group selector. It is deliberately scoped to that one control: ringing all
 * three at once would show a focus that can never really exist.
 */
const GROUP_FOCUS_RING =
  "group-data-[focus=true]/deck:outline-2 group-data-[focus=true]/deck:outline-offset-[3px] " +
  "group-data-[focus=true]/deck:outline-[var(--mq-ring,#171817)]";

/* -------------------------------------------------------------------------- */
/* Materials                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Card and tray surface per material — the `card.tsx` recipes verbatim, plus a
 * `--mq-shadow-hover` each so the raised look while dragging interpolates from
 * the resting shadow instead of swapping layer counts.
 */
const SURFACE: Record<MaterialSlug, string> = {
  clay: [
    "bg-[var(--mq-body,#f6e7dd)] border-[var(--mq-brd,rgba(120,80,55,0.16))]",
    "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)]",
    "[--mq-shadow-hover:inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_12px_0_var(--mq-edge,#dcc4b2),0_30px_50px_rgba(90,60,45,0.22)]",
  ].join(" "),
  glass: [
    "bg-[var(--mq-body,rgba(255,255,255,0.66))] border-[var(--mq-brd,rgba(255,255,255,0.75))]",
    "backdrop-blur-[18px] backdrop-saturate-[170%]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)]",
    "[--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.92),0_26px_58px_rgba(24,20,40,0.28)]",
    "forced-colors:[backdrop-filter:none]",
  ].join(" "),
  // Warm greige — the #e6e3da family — moulded under a lit top edge.
  skeuo: [
    "bg-[linear-gradient(180deg,var(--mq-lit,#f4f1ea),var(--mq-body,#e6e3da))]",
    "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)]",
    "[--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-3px_5px_rgba(0,0,0,0.14),0_10px_0_var(--mq-edge,#a8a49b),0_24px_38px_rgba(38,36,31,0.30)]",
  ].join(" "),
  // Polymorphic: almost no ornament. The palette follows the colour scheme.
  adaptive: [
    "bg-[var(--mq-body,#ffffff)] border-[var(--mq-brd,rgba(23,24,23,0.14))]",
    "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)]",
    "[--mq-shadow-hover:0_2px_5px_rgba(20,20,18,0.14),0_20px_44px_rgba(20,20,18,0.10)]",
    "dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_14px_30px_rgba(0,0,0,0.55)]",
    "dark:[--mq-shadow-hover:0_3px_7px_rgba(0,0,0,0.60),0_24px_50px_rgba(0,0,0,0.62)]",
  ].join(" "),
};

/**
 * The deck root paints nothing: it only declares the tokens (material axis) and
 * the density (size axis) that the stack and the tray inherit.
 */
const swipeCardsVariants = cva(
  "group/deck relative isolate flex w-full flex-col gap-[var(--mq-gap,14px)] text-[color:var(--mq-text,#2b2b26)] data-[state=disabled]:opacity-60",
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#f6e7dd] [--mq-lit:#fff4ec] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346]",
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817]",
          "[--mq-track:#e8d3c6] [--mq-wash:rgba(51,38,30,0.08)]",
          "[--mq-yes:#1f5d3a] [--mq-yes-fg:#f4fbf6] [--mq-no:#9f2f23] [--mq-no-wash:rgba(159,47,35,0.12)]",
        ].join(" "),
        // --mq-muted #36362f (not a lighter grey) holds 5.14:1 over a black
        // backdrop at 0.66 opacity, where a lighter muted measured only 4.27:1.
        // --mq-yes / --mq-no are darkened for the same reason.
        glass: [
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f]",
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817]",
          "[--mq-track:rgba(23,24,23,0.16)] [--mq-wash:rgba(23,24,23,0.08)]",
          "[--mq-yes:#0c3f26] [--mq-yes-fg:#ffffff] [--mq-no:#6d1a10] [--mq-no-wash:rgba(109,26,16,0.12)]",
        ].join(" "),
        skeuo: [
          "[--mq-lit:#f4f1ea] [--mq-body:#e6e3da] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943]",
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817]",
          "[--mq-track:#c6c2b8] [--mq-wash:rgba(35,35,31,0.08)]",
          "[--mq-yes:#1f5233] [--mq-yes-fg:#f2f8f3] [--mq-no:#8f2a1d] [--mq-no-wash:rgba(143,42,29,0.12)]",
        ].join(" "),
        adaptive: [
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817]",
          "[--mq-track:#d8dad5] [--mq-wash:rgba(23,24,23,0.06)]",
          "[--mq-yes:#14532d] [--mq-yes-fg:#ffffff] [--mq-no:#9f1f14] [--mq-no-wash:rgba(159,31,20,0.10)]",
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9]",
          "dark:[--mq-track:#42443f] dark:[--mq-wash:rgba(255,255,255,0.08)]",
          "dark:[--mq-yes:#7fd6a4] dark:[--mq-yes-fg:#10281a] dark:[--mq-no:#f2a7a0] dark:[--mq-no-wash:rgba(242,167,160,0.14)]",
        ].join(" "),
      },
      variant: { default: "" },
      size: {
        sm: "[--mq-pad:16px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:15px] [--mq-deck:318px] [--mq-media:150px]",
        md: "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:17px] [--mq-deck:392px] [--mq-media:196px]",
        lg: "[--mq-pad:28px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:20px] [--mq-deck:452px] [--mq-media:232px]",
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

/**
 * Shared card chrome. Every card is absolutely positioned inside a well of a
 * definite height, so promoting the next card to the top never reflows the page
 * and the deck occupies the same box whatever the content is.
 *
 * The transition NAMES `translate`, `rotate` and `scale` individually: Tailwind
 * v4 writes those utilities — and this component writes its drag offsets — to
 * the standalone CSS properties, which `transition-[transform]` would not cover.
 * Every listed property really changes over a card's life: it is promoted (
 * translate + scale), dragged (translate + rotate), raised while held
 * (box-shadow) and flown out (translate + rotate + opacity).
 */
const CARD_BASE = [
  "absolute inset-x-0 top-0 flex h-[var(--mq-deck,392px)] origin-top flex-col overflow-hidden",
  "gap-[calc(var(--mq-gap,14px)_-_2px)] rounded-[var(--mq-radius,24px)] border p-[var(--mq-pad,22px)] text-left",
  "text-[color:var(--mq-text,#2b2b26)]",
  "transition-[translate,rotate,scale,opacity,box-shadow] duration-300 ease-out motion-reduce:transition-none",
  // Shadows, translucency and gradients are erased or misread in forced-colors
  // mode, so the card would dissolve into the page. System colours keep it.
  "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  "forced-colors:shadow-none forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
].join(" ");

/**
 * The live card. `touch-none` hands every pointer gesture to the drag instead of
 * to the page scroller — safe precisely because the two buttons and the arrow
 * keys already do the same job without any gesture at all.
 */
const TOP_CARD = [
  "cursor-grab touch-none select-none active:cursor-grabbing",
  "data-[dragging=true]:cursor-grabbing data-[dragging=true]:transition-none",
  "data-[dragging=true]:shadow-[var(--mq-shadow-hover,0_14px_35px_rgba(20,20,18,0.12))]",
  "data-[flying=true]:pointer-events-none",
].join(" ");

/**
 * Intent stamp shown while the card is past the commit threshold. Decorative:
 * the words on it are duplicated by the live-region announcement that fires the
 * moment the decision lands, so it is hidden from assistive tech. It carries a
 * WORD and an icon, never a colour on its own.
 */
const STAMP = [
  "pointer-events-none absolute top-[calc(var(--mq-pad,22px)_+_4px)] z-[3] inline-flex items-center gap-[6px]",
  "rounded-[10px] border-2 px-[10px] py-[5px] text-[length:12px] font-extrabold uppercase tracking-[0.10em]",
  "transition-[opacity] duration-150 ease-out motion-reduce:transition-none",
  "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
].join(" ");

const CONTROL_BASE = [
  "relative z-10 inline-flex h-[44px] items-center justify-center gap-[8px] px-[18px]",
  "cursor-pointer appearance-none rounded-[calc(var(--mq-radius,24px)_-_10px)] border",
  "text-[length:13px] font-extrabold tracking-[-0.01em] whitespace-nowrap",
  "transition-[translate,box-shadow,background-color,border-color,opacity] duration-200 ease-out",
  "motion-reduce:transition-none",
  "hover:-translate-y-[2px] motion-reduce:hover:translate-y-0",
  "active:translate-y-[1px] motion-reduce:active:translate-y-0",
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-none",
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]",
  "forced-colors:focus-visible:outline-[Highlight]",
  FOCUS_RING,
].join(" ");

const REJECT_CONTROL = [
  "bg-transparent border-[var(--mq-brd,rgba(120,80,55,0.16))] text-[color:var(--mq-text,#2b2b26)] shadow-none",
  "hover:border-[var(--mq-no,#9f2f23)] hover:bg-[var(--mq-no-wash,rgba(159,47,35,0.12))]",
  "hover:shadow-[0_6px_16px_rgba(20,20,18,0.12)]",
].join(" ");

const ACCEPT_CONTROL = [
  "border-transparent bg-[var(--mq-yes,#1f5d3a)] text-[color:var(--mq-yes-fg,#f4fbf6)]",
  "shadow-[0_5px_14px_rgba(20,20,18,0.18)] hover:shadow-[0_10px_22px_rgba(20,20,18,0.24)]",
  "active:shadow-[0_2px_6px_rgba(20,20,18,0.16)]",
].join(" ");

const RESET_CONTROL = [
  "relative z-10 inline-flex h-[32px] cursor-pointer appearance-none items-center gap-[6px] rounded-[10px]",
  "border border-transparent bg-transparent px-[10px] text-[length:12px] font-bold",
  "text-[color:var(--mq-muted,#5c5b55)]",
  "transition-[color,background-color] duration-150 ease-out motion-reduce:transition-none",
  "hover:bg-[var(--mq-wash,rgba(23,24,23,0.06))] hover:text-[color:var(--mq-text,#2b2b26)]",
  "disabled:cursor-not-allowed disabled:opacity-55",
  "forced-colors:border-[ButtonText] forced-colors:text-[ButtonText]",
  FOCUS_RING,
].join(" ");

/**
 * The end state of this keyframe IS the resting state, so
 * `motion-reduce:animate-none` leaves the panel fully rendered at its final
 * value instead of stranding it mid-rise.
 *
 * `href` + `precedence` so React 19 hoists and deduplicates it: a bare <style>
 * emits one identical copy per deck on the page.
 */
const SWIPE_CARDS_KEYFRAMES = `
@keyframes mq-swipe-cards-rise {
  from { opacity: 0; translate: 0 12px; scale: 0.96; }
  to { opacity: 1; translate: 0 0; scale: 1; }
}`;

/* -------------------------------------------------------------------------- */
/* Pure helpers                                                                */
/* -------------------------------------------------------------------------- */

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Depth-derived resting placement. Pure in its argument — nothing is carried. */
function stackedStyle(depth: number): React.CSSProperties {
  return {
    translate: `0 ${depth * STACK_STEP_PX}px`,
    scale: (1 - depth * STACK_SCALE_STEP).toFixed(3),
    opacity: depth === 1 ? 0.92 : 0.78,
    zIndex: VISIBLE_COUNT - depth,
  };
}

/**
 * Read the user's motion preference at the moment a decision is made. Called
 * only from event handlers, never at module scope or during render, and guarded
 * so a server render can never touch `window`.
 */
function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                  */
/* -------------------------------------------------------------------------- */

export type SwipeCardItem = {
  /** Stable key; also seeds the heading id the card is labelled by. */
  id: string;
  /** The card's heading — and its accessible name. */
  title: string;
  /** One short supporting line (role, place, price…). */
  meta?: string;
  /** A sentence or two of body copy. */
  description?: string;
  /** Optional image. Sits in a well with a definite height, so nothing shifts. */
  imageSrc?: string;
  /** Required whenever `imageSrc` is set. Use "" only if truly decorative. */
  imageAlt?: string;
  /** Optional destination for the title, rendered as a real <a> in the heading. */
  href?: string;
  /** Short text flags. Text, so no attribute is signalled by colour alone. */
  tags?: readonly string[];
};

type SwipeCardsOwnProps = {
  /** The deck, top card first. Cards already decided are simply skipped. */
  items: readonly SwipeCardItem[];
  material?: MaterialSlug;
  variant?: SwipeCardsVariant;
  size?: SwipeCardsSize;
  /**
   * Heading rank for each card title. The correct level depends on the
   * surrounding document outline, so it is overridable rather than hardcoded.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Accessible name for the deck region. */
  label?: string;
  /** Accessible name for the progress bar. */
  progressLabel?: string;
  rejectLabel?: string;
  acceptLabel?: string;
  resetLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Fired with the card and the direction it left in, before it animates out. */
  onDecide?: (item: SwipeCardItem, decision: SwipeDecision) => void;
  /** Fired when the deck is restarted from the beginning. */
  onReset?: () => void;
  /** Dims the deck and switches every control and the drag off. */
  disabled?: boolean;
};

export type SwipeCardsProps = SwipeCardsOwnProps &
  Omit<React.ComponentPropsWithRef<"section">, keyof SwipeCardsOwnProps | "children">;

export function SwipeCards({
  acceptLabel = "Accept",
  className,
  disabled = false,
  emptyDescription = "You have reviewed every card in this deck.",
  emptyTitle = "Nothing left to review",
  headingLevel = 3,
  items,
  label = "Swipe deck",
  material = "clay",
  onDecide,
  onReset,
  progressLabel = "Deck progress",
  ref,
  rejectLabel = "Reject",
  resetLabel = "Start over",
  size = "md",
  variant = "default",
  ...props
}: SwipeCardsProps) {
  const baseId = React.useId();
  const [cursor, setCursor] = React.useState(0);
  const [offset, setOffset] = React.useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [flying, setFlying] = React.useState<SwipeDecision | null>(null);
  const [announcement, setAnnouncement] = React.useState("");

  const rootRef = React.useRef<HTMLElement | null>(null);
  const stackRef = React.useRef<HTMLDivElement | null>(null);
  const acceptRef = React.useRef<HTMLButtonElement | null>(null);
  const rejectRef = React.useRef<HTMLButtonElement | null>(null);
  const resetRef = React.useRef<HTMLButtonElement | null>(null);
  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const focusWasInsideRef = React.useRef(false);
  const hadCardsRef = React.useRef(false);

  const total = items.length;
  // Derived, never stored: if `items` shrinks under a live deck the cursor is
  // clamped here rather than corrected by a setState inside an effect.
  const decided = Math.min(cursor, total);
  const remaining = total - decided;
  const isEmpty = remaining === 0;
  const visible = items.slice(decided, decided + VISIBLE_COUNT);
  const threshold = SWIPE_THRESHOLD_PX[size];
  const percentage = total === 0 ? 0 : (decided / total) * 100;
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

  const setRootRef = React.useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  /**
   * The flight is SCHEDULED here, never performed: the effect body only starts a
   * timer, and the state transition happens inside that timer's callback, which
   * is a subscribed callback rather than the render/effect pass.
   */
  React.useEffect(() => {
    if (!flying) return;
    const timer = window.setTimeout(() => {
      setCursor((current) => current + 1);
      setFlying(null);
      setOffset(null);
    }, FLIGHT_MS);
    return () => window.clearTimeout(timer);
  }, [flying]);

  /**
   * Focus must survive the deck emptying. The last decision disables both
   * decision buttons, and a browser blurs a focused element the moment it is
   * disabled — so when focus really was ours and really has fallen to <body>,
   * it is reclaimed onto "Start over". Focus is never stolen from elsewhere.
   */
  React.useEffect(() => {
    if (!isEmpty) {
      hadCardsRef.current = true;
      return;
    }
    if (!hadCardsRef.current || !focusWasInsideRef.current) return;
    hadCardsRef.current = false;
    focusWasInsideRef.current = false;
    const active = document.activeElement;
    if (active === null || active === document.body) resetRef.current?.focus();
  }, [isEmpty]);

  function decide(decision: SwipeDecision) {
    if (disabled || flying) return;
    const item = items[decided];
    if (!item) return;

    const active = typeof document === "undefined" ? null : document.activeElement;
    const root = rootRef.current;
    focusWasInsideRef.current = active instanceof Node && root !== null && root.contains(active);

    // If focus sits on a link inside the card that is about to leave, move it
    // deliberately onto the control that made the decision — that control stays
    // mounted, so focus can never land on <body>.
    if (active instanceof HTMLElement && stackRef.current?.contains(active)) {
      (decision === "accept" ? acceptRef.current : rejectRef.current)?.focus();
      focusWasInsideRef.current = true;
    }

    const left = total - decided - 1;
    setAnnouncement(
      `${decision === "accept" ? "Accepted" : "Rejected"} ${item.title}. ` +
        (left === 0 ? "No cards remaining." : `${left} of ${total} remaining.`),
    );
    onDecide?.(item, decision);

    setDragging(false);
    // Reduced motion: no fling. The card simply goes, the next one is shown, and
    // the announcement does the work.
    if (prefersReducedMotion()) {
      setOffset(null);
      setCursor((current) => current + 1);
      return;
    }
    setFlying(decision);
  }

  function handleReset() {
    if (disabled) return;
    setCursor(0);
    setOffset(null);
    setFlying(null);
    setDragging(false);
    setAnnouncement(
      total === 0 ? "This deck is empty." : `Deck restarted. ${total} of ${total} remaining.`,
    );
    onReset?.();
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if (disabled || isEmpty || flying) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    // Never hijack a press that starts on a real control inside the card.
    const target = event.target as HTMLElement | null;
    if (target?.closest("a,button,input,select,textarea")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
    setOffset({ x: 0, y: 0 });
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const start = dragStartRef.current;
    if (!start || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    setOffset({ x: event.clientX - start.x, y: event.clientY - start.y });
  }

  function endDrag(event: React.PointerEvent<HTMLElement>, cancelled: boolean) {
    const start = dragStartRef.current;
    if (!start) return;
    dragStartRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const dx = cancelled ? 0 : event.clientX - start.x;
    if (Math.abs(dx) >= threshold) {
      // Keep the live offset: the flight starts exactly where the finger left.
      decide(dx > 0 ? "accept" : "reject");
      return;
    }
    setDragging(false);
    setOffset({ x: 0, y: 0 });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (disabled || isEmpty || flying) return;
    // Arrow keys belong to text fields and native widgets first.
    const target = event.target as HTMLElement | null;
    if (target?.closest("input,textarea,select,[role='slider'],[contenteditable='true']")) return;
    event.preventDefault();
    decide(event.key === "ArrowRight" ? "accept" : "reject");
  }

  /** Live placement of the top card. Pure in `flying` / `offset`. */
  function topCardStyle(): React.CSSProperties {
    if (flying) {
      const sign = flying === "accept" ? 1 : -1;
      return {
        translate: `${sign * FLY_DISTANCE_PX}px ${(offset?.y ?? 0) - FLY_LIFT_PX}px`,
        rotate: `${sign * FLY_TILT_DEG}deg`,
        scale: "1",
        opacity: 0,
        zIndex: VISIBLE_COUNT,
      };
    }
    if (offset) {
      const tilt = clamp(offset.x * TILT_PER_PX, -MAX_TILT_DEG, MAX_TILT_DEG);
      return {
        translate: `${offset.x}px ${offset.y}px`,
        rotate: `${tilt.toFixed(2)}deg`,
        scale: "1",
        opacity: 1,
        zIndex: VISIBLE_COUNT,
      };
    }
    return { translate: "0 0", rotate: "0deg", scale: "1", opacity: 1, zIndex: VISIBLE_COUNT };
  }

  // Intent preview. While flying the stamp is pinned on so the decision reads
  // clearly as the card leaves.
  const intentX = flying ? (flying === "accept" ? threshold : -threshold) : (offset?.x ?? 0);
  const stampOpacity = clamp(
    (Math.abs(intentX) - STAMP_START_PX) / Math.max(1, threshold - STAMP_START_PX),
    0,
    1,
  );
  const acceptStamp = intentX > 0 ? stampOpacity : 0;
  const rejectStamp = intentX < 0 ? stampOpacity : 0;

  return (
    <section
      {...props}
      aria-label={label}
      className={cn(swipeCardsVariants({ material, variant, size }), className)}
      data-material={material}
      data-state={disabled ? "disabled" : "idle"}
      onKeyDown={handleKeyDown}
      ref={setRootRef}
    >
      <style href="mq-swipe-cards" precedence="medium">
        {SWIPE_CARDS_KEYFRAMES}
      </style>

      {/*
        Present from the first render, and empty, so the decision text arrives
        into a region assistive tech is already observing.
      */}
      <p aria-live="polite" className="sr-only" role="status">
        {announcement}
      </p>

      {/* The deck well. Its height is definite, so promoting the next card to
          the top never reflows the page around it. */}
      <div
        className="relative h-[calc(var(--mq-deck,392px)_+_30px)] w-full"
        ref={stackRef}
      >
        {isEmpty ? (
          <div
            className={cn(
              CARD_BASE,
              SURFACE[material],
              "items-center justify-center gap-[10px] text-center",
              "animate-[mq-swipe-cards-rise_260ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
            )}
          >
            <HeadingTag className="m-0 font-extrabold tracking-[-0.02em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.25]">
              {emptyTitle}
            </HeadingTag>
            <p className="m-0 max-w-[34ch] text-[length:13px] leading-[1.65] text-[color:var(--mq-muted,#5c5b55)]">
              {emptyDescription}
            </p>
          </div>
        ) : (
          visible.map((item, depth) => {
            const isTop = depth === 0;
            const titleId = `${baseId}-title-${item.id}`;
            return (
              <article
                aria-hidden={isTop ? undefined : true}
                aria-labelledby={titleId}
                className={cn(
                  CARD_BASE,
                  SURFACE[material],
                  isTop ? TOP_CARD : "pointer-events-none",
                )}
                data-dragging={isTop && dragging ? "true" : "false"}
                data-flying={isTop && flying ? "true" : "false"}
                // Cards under the top one must not be reachable by Tab: a
                // keyboard reader would otherwise land inside a card they
                // cannot see and cannot act on.
                inert={isTop ? undefined : true}
                key={item.id}
                onPointerCancel={isTop ? (event) => endDrag(event, true) : undefined}
                onPointerDown={isTop ? handlePointerDown : undefined}
                onPointerMove={isTop ? handlePointerMove : undefined}
                onPointerUp={isTop ? (event) => endDrag(event, false) : undefined}
                style={isTop ? topCardStyle() : stackedStyle(depth)}
              >
                {item.imageSrc ? (
                  <div className="relative aspect-[4/3] max-h-[var(--mq-media,196px)] w-full shrink-0 overflow-hidden rounded-[calc(var(--mq-radius,24px)_-_10px)] bg-[var(--mq-rule,rgba(120,80,55,0.20))]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- copy-and-own component stays framework-agnostic */}
                    <img
                      alt={item.imageAlt ?? ""}
                      className="size-full object-cover"
                      decoding="async"
                      draggable={false}
                      loading="lazy"
                      src={item.imageSrc}
                    />
                  </div>
                ) : null}

                <HeadingTag
                  className="m-0 font-extrabold tracking-[-0.02em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.25]"
                  id={titleId}
                >
                  {item.href ? (
                    // The link lives INSIDE the heading, so the title is its
                    // accessible name. It is deliberately NOT given the
                    // stretched-link ::after overlay: this card is a pointer
                    // DRAG surface, and a full-bleed overlay would swallow
                    // pointerdown and make the gesture impossible. It sits at
                    // z-10 above the drag layer instead, independently
                    // clickable and independently focusable, and no button or
                    // link is ever nested inside it.
                    <a
                      className={cn(
                        "relative z-10 text-inherit underline decoration-[1.5px] underline-offset-[3px]",
                        "hover:decoration-[2.5px]",
                        FOCUS_RING,
                      )}
                      href={item.href}
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </HeadingTag>

                {item.meta ? (
                  <p className="m-0 text-[length:12px] font-bold leading-[1.5] text-[color:var(--mq-muted,#5c5b55)]">
                    {item.meta}
                  </p>
                ) : null}

                {item.description ? (
                  <p className="m-0 line-clamp-3 text-[length:13px] leading-[1.65] text-[color:var(--mq-muted,#5c5b55)]">
                    {item.description}
                  </p>
                ) : null}

                {item.tags && item.tags.length > 0 ? (
                  <ul className="m-0 mt-auto flex list-none flex-wrap gap-[6px] p-0">
                    {item.tags.map((tag) => (
                      <li
                        className={cn(
                          "rounded-full border border-[var(--mq-rule,rgba(23,24,23,0.14))] px-[9px] py-[3px]",
                          "text-[length:11px] font-bold text-[color:var(--mq-text,#2b2b26)]",
                          "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]",
                        )}
                        key={tag}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {isTop ? (
                  <>
                    <span
                      aria-hidden="true"
                      className={cn(
                        STAMP,
                        "left-[calc(var(--mq-pad,22px)_+_4px)] -rotate-[8deg]",
                        "border-[var(--mq-no,#9f2f23)] text-[color:var(--mq-no,#9f2f23)]",
                        dragging && "transition-none",
                      )}
                      style={{ opacity: rejectStamp }}
                    >
                      <X aria-hidden="true" className="size-[14px]" strokeWidth={3} />
                      {rejectLabel}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        STAMP,
                        "right-[calc(var(--mq-pad,22px)_+_4px)] rotate-[8deg]",
                        "border-[var(--mq-yes,#1f5d3a)] text-[color:var(--mq-yes,#1f5d3a)]",
                        dragging && "transition-none",
                      )}
                      style={{ opacity: acceptStamp }}
                    >
                      <Check aria-hidden="true" className="size-[14px]" strokeWidth={3} />
                      {acceptLabel}
                    </span>
                  </>
                ) : null}
              </article>
            );
          })
        )}
      </div>

      {/* Control tray. The buttons live OUTSIDE the stack on purpose: nothing a
          reader can focus is ever unmounted by a decision. */}
      <div
        className={cn(
          SURFACE[material],
          "flex flex-col gap-[10px] rounded-[calc(var(--mq-radius,24px)_-_6px)] border p-[12px]",
          "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none",
          "forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-[8px]">
          <p className="m-0 text-[length:12px] font-extrabold text-[color:var(--mq-text,#2b2b26)]">
            {isEmpty ? `All ${total} reviewed` : `Card ${decided + 1} of ${total}`}
          </p>
          <button
            className={RESET_CONTROL}
            disabled={disabled}
            onClick={handleReset}
            ref={resetRef}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="size-[14px]" strokeWidth={2.25} />
            {resetLabel}
          </button>
        </div>

        <div
          aria-label={progressLabel}
          aria-valuemax={Math.max(1, total)}
          aria-valuemin={0}
          aria-valuenow={decided}
          aria-valuetext={`${decided} of ${total} reviewed`}
          className={cn(
            "relative h-[6px] w-full overflow-hidden rounded-full border",
            "border-[var(--mq-rule,rgba(23,24,23,0.14))] bg-[var(--mq-track,#e8d3c6)]",
            "forced-colors:border-[CanvasText] forced-colors:bg-[GrayText]",
          )}
          role="progressbar"
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-y-0 left-0 w-full rounded-full bg-[var(--mq-text,#2b2b26)]",
              "transition-[translate] duration-300 ease-out motion-reduce:transition-none",
              "forced-colors:bg-[Highlight]",
            )}
            style={{ translate: `${percentage - 100}% 0` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-[10px]">
          <button
            className={cn(CONTROL_BASE, REJECT_CONTROL)}
            disabled={disabled || isEmpty}
            onClick={() => decide("reject")}
            ref={rejectRef}
            type="button"
          >
            <X aria-hidden="true" className="size-[16px] text-[color:var(--mq-no,#9f2f23)] forced-colors:text-[ButtonText]" strokeWidth={2.5} />
            {rejectLabel}
          </button>
          <button
            className={cn(CONTROL_BASE, ACCEPT_CONTROL, GROUP_FOCUS_RING)}
            disabled={disabled || isEmpty}
            onClick={() => decide("accept")}
            ref={acceptRef}
            type="button"
          >
            <Check aria-hidden="true" className="size-[16px]" strokeWidth={2.5} />
            {acceptLabel}
          </button>
        </div>

        <p className="m-0 text-[length:11px] leading-[1.5] text-[color:var(--mq-muted,#5c5b55)]">
          Drag the top card, press the buttons, or use the left and right arrow keys.
        </p>
      </div>
    </section>
  );
}

export type SwipeCardsVariantProps = VariantProps<typeof swipeCardsVariants>;

export { swipeCardsVariants };
