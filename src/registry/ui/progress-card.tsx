"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheck, TrendingUp, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Progress Card
 *
 * A goal/target surface: an eyebrow, a semantic heading, a big current-vs-target
 * metric, a real `role="progressbar"` bar and a status line. Savings goal,
 * fundraiser, quota — anything with a number climbing toward a number.
 *
 * Self-contained by design. The four material recipes (clay / glass / skeuo /
 * adaptive) are copied and owned here, straight from `card.tsx`, so dropping this
 * file plus `src/lib/cn.ts` into another project reproduces the full tactile look
 * with no global stylesheet and no `:root` custom properties. Every `var()`
 * carries a literal fallback.
 *
 * Local theming knobs (custom properties declared on the card, inherited down):
 *
 *   --mq-body         surface colour
 *   --mq-lit          top highlight (skeuo gradient)
 *   --mq-edge         extruded bottom edge colour
 *   --mq-text         primary foreground
 *   --mq-muted        secondary foreground (eyebrow, meta, "of target")
 *   --mq-rule         hairline for the footer divider and the status chip
 *   --mq-brd          border colour
 *   --mq-ring         focus ring colour
 *   --mq-acc          accent fill for the action button
 *   --mq-acc-fg       text on the accent fill
 *   --mq-track        progress track surface
 *   --mq-track-brd    progress track border
 *   --mq-track-shadow recessed track depth
 *   --mq-fill         filled-run surface
 *   --mq-fill-shadow  raised filled-run depth
 *   --mq-fill-w       the filled run's own width (set inline from the value)
 *   --mq-tick         quarter marks drawn across the track
 *   --mq-ok           status colour for "on track" / "complete"
 *   --mq-warn         status colour for "behind"
 *   --mq-pad          inner padding
 *   --mq-gap          vertical rhythm between blocks
 *   --mq-radius       corner radius
 *   --mq-title        heading font size
 *   --mq-metric       big current-value font size
 *   --mq-bar          track thickness
 *
 * Contrast contract (inherited from the Card recipe): on every filled material
 * both --mq-text and --mq-muted stay at or above 4.5:1 against the surface, and
 * the glass tokens carry their own tint so that holds over a white and a black
 * backdrop alike. --mq-ok and --mq-warn are measured the same way (5.1:1 or
 * better on every material), and they only ever REINFORCE a status that is
 * already a word plus a distinct glyph.
 *
 * Track vs fill differ by more than hue: the track is recessed and ruled with
 * quarter marks, the filled run is raised and glossy — and under forced colours
 * the fill repaints to Highlight while the track falls back to GrayText, so the
 * reading survives when every author colour is discarded.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type ProgressCardVariant = "default";
type ProgressCardSize = "sm" | "md" | "lg";

/** Where the goal stands. Always rendered as a word AND a distinct glyph. */
export type ProgressCardStatus = "on-track" | "behind" | "complete";

const STATUS_LABEL: Record<ProgressCardStatus, string> = {
  "on-track": "On track",
  behind: "Behind",
  complete: "Complete",
};

/**
 * Colour is the third signal, never the first: the chip already says "Behind"
 * and already shows a warning triangle instead of a trend arrow.
 */
const STATUS_TONE: Record<ProgressCardStatus, string> = {
  "on-track": "text-[color:var(--mq-ok,#1f5c3d)]",
  behind: "text-[color:var(--mq-warn,#8f3d12)]",
  complete: "text-[color:var(--mq-ok,#1f5c3d)]",
};

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
 * `:focus-within` is scoped to the linked (interactive) card only: tabbing to the
 * title link or the action button outlines the whole card, so the stretched link
 * never loses its visible focus. An inert card skips this to avoid double-ringing
 * the action button's own focus.
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
 * Stretched link: a single <a>, INSIDE the heading so the title is its accessible
 * name, whose transparent `::after` covers the card (the nearest positioned
 * ancestor). Everything the reader must still reach independently — the action
 * button — sits on a higher `z-index`, so it stays clickable and focusable while
 * the rest of the surface routes to the goal link. No <a> or <button> is ever
 * nested inside another.
 */
const STRETCHED_LINK =
  "text-inherit no-underline outline-none " +
  "[&::after]:absolute [&::after]:inset-0 [&::after]:z-[1] [&::after]:content-['']";

const ACTION_BUTTON =
  "relative z-10 inline-flex items-center justify-center " +
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

const STATUS_CHIP =
  "ml-auto inline-flex shrink-0 items-center gap-[6px] rounded-full " +
  "border border-[var(--mq-rule,rgba(23,24,23,0.14))] px-[10px] py-[4px] " +
  "text-[length:11px] font-bold leading-none " +
  "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]";

/**
 * The filled run grows from zero to its resting width once, on mount.
 *
 * The animation's END state is exactly the width the element already carries
 * inline, so `motion-reduce:animate-none` leaves the bar fully rendered at the
 * correct value rather than collapsed at zero. No fill mode: once the run ends
 * the element falls back to that same inline width, which lets a later value
 * change transition instead of being frozen by the animation.
 */
const PROGRESS_CARD_KEYFRAMES = `
@keyframes mq-progress-card-fill {
  from { width: 0%; }
  to { width: var(--mq-fill-w, 0%); }
}`;

const progressCardVariants = cva(
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
          // Forced colours discard the backdrop filter anyway; clearing it by
          // hand keeps the surface from compositing against a system palette it
          // was never designed for.
          "forced-colors:backdrop-blur-none forced-colors:backdrop-saturate-100",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_9px_0_var(--mq-edge,#a8a49b),0_20px_32px_rgba(38,36,31,0.283)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.175),0_2px_0_var(--mq-edge,#a8a49b),0_6px_9px_rgba(38,36,31,0.204)]",
          // A gradient survives forced colours untouched, so it has to go by hand
          // or it would paint over the system surface.
          "forced-colors:[background-image:none]",
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
        sm: "[--mq-pad:16px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:15px] [--mq-metric:24px] [--mq-bar:8px]",
        md: "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:17px] [--mq-metric:30px] [--mq-bar:10px]",
        lg: "[--mq-pad:28px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:20px] [--mq-metric:38px] [--mq-bar:14px]",
      },
    },
    compoundVariants: [
      {
        material: "clay",
        variant: "default",
        class:
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817] " +
          "[--mq-acc:#33261e] [--mq-acc-fg:#fff3ea] " +
          "[--mq-track:#e8d2c3] [--mq-track-brd:rgba(120,80,55,0.34)] [--mq-fill:#9f2f23] [--mq-tick:rgba(120,80,55,0.42)] " +
          "[--mq-track-shadow:inset_0_2px_3px_rgba(94,55,38,0.22),inset_0_-1px_0_rgba(255,255,255,0.55)] " +
          "[--mq-fill-shadow:inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_-2px_3px_rgba(78,20,17,0.28)] " +
          "[--mq-ok:#1f5c3d] [--mq-warn:#8f3d12]",
      },
      {
        material: "glass",
        variant: "default",
        // --mq-muted #36362f (not a lighter grey) holds 5.14:1 over a black
        // backdrop at 0.66 opacity, where a lighter muted measured only 4.27:1.
        // --mq-ok / --mq-warn are darkened for the same reason: the surface
        // composites to roughly #a8a8a8 over black, so a mid-tone green would
        // fall under 4.5:1 there even though it passes over white.
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817] " +
          "[--mq-acc:#1e1e1b] [--mq-acc-fg:#ffffff] " +
          "[--mq-track:rgba(226,236,240,0.94)] [--mq-track-brd:rgba(31,76,88,0.36)] [--mq-fill:#0b4a5a] [--mq-tick:rgba(23,49,59,0.34)] " +
          "[--mq-track-shadow:inset_0_1px_3px_rgba(17,49,59,0.28),inset_0_-1px_0_rgba(255,255,255,0.7)] " +
          "[--mq-fill-shadow:inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-2px_3px_rgba(4,32,40,0.34)] " +
          "[--mq-ok:#0d3d26] [--mq-warn:#5e1f06]",
      },
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817] " +
          "[--mq-acc:#23231f] [--mq-acc-fg:#f6f4ee] " +
          "[--mq-track:#c4c0b7] [--mq-track-brd:rgba(25,25,23,0.38)] [--mq-fill:#3f4641] [--mq-tick:rgba(25,25,23,0.34)] " +
          "[--mq-track-shadow:inset_0_2px_4px_rgba(40,37,31,0.32),inset_0_-1px_0_rgba(255,255,255,0.6)] " +
          "[--mq-fill-shadow:inset_0_1px_0_rgba(255,255,255,0.32),inset_0_-2px_2px_rgba(0,0,0,0.3)] " +
          "[--mq-ok:#1a5236] [--mq-warn:#7a3410]",
      },
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817] " +
          "[--mq-acc:#1c1c19] [--mq-acc-fg:#ffffff] " +
          "[--mq-track:#e4e5e1] [--mq-track-brd:rgba(23,24,23,0.22)] [--mq-fill:#171817] [--mq-tick:rgba(23,24,23,0.28)] " +
          "[--mq-track-shadow:inset_0_1px_2px_rgba(23,24,23,0.20)] [--mq-fill-shadow:none] " +
          "[--mq-ok:#14603b] [--mq-warn:#8a3311] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9] " +
          "dark:[--mq-acc:#f1efe9] dark:[--mq-acc-fg:#1c1c19] " +
          "dark:[--mq-track:#3c3c41] dark:[--mq-track-brd:rgba(255,255,255,0.24)] dark:[--mq-fill:#f1efe9] dark:[--mq-tick:rgba(255,255,255,0.30)] " +
          "dark:[--mq-track-shadow:inset_0_1px_2px_rgba(0,0,0,0.55)] " +
          "dark:[--mq-ok:#6ee7a8] dark:[--mq-warn:#f0a868] " +
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
 * Status glyph. Written as an explicit branch rather than a lookup table so each
 * status is guaranteed a DIFFERENT shape — the second, non-colour signal that
 * pairs with the status word.
 */
function StatusGlyph({ status }: { status: ProgressCardStatus }) {
  if (status === "behind") {
    return <TriangleAlert aria-hidden="true" className="size-[14px] shrink-0" strokeWidth={2.25} />;
  }
  if (status === "complete") {
    return <CircleCheck aria-hidden="true" className="size-[14px] shrink-0" strokeWidth={2.25} />;
  }
  return <TrendingUp aria-hidden="true" className="size-[14px] shrink-0" strokeWidth={2.25} />;
}

export type ProgressCardProps = Omit<
  React.ComponentPropsWithRef<"article">,
  | "aria-valuemax"
  | "aria-valuemin"
  | "aria-valuenow"
  | "aria-valuetext"
  | "children"
  | "role"
  | "title"
> &
  Omit<VariantProps<typeof progressCardVariants>, "material" | "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: ProgressCardVariant;
    size?: ProgressCardSize;
    /** Goal name — the card's heading and, when `href` is set, the link text. */
    title: string;
    /** Small label above the heading, e.g. "Savings goal". */
    eyebrow?: string;
    /** Optional sentence under the heading. */
    description?: string;
    /** Current amount. Clamped into `[0, target]`. */
    value: number;
    /** Goal amount. Non-finite or non-positive values fall back to 100. */
    target: number;
    /** Formatted current amount, e.g. "$3,200". Defaults to the clamped number. */
    valueLabel?: string;
    /** Formatted goal amount, e.g. "$5,000". Defaults to the clamped target. */
    targetLabel?: string;
    /** Where the goal stands. Rendered as a word plus its own glyph. */
    status?: ProgressCardStatus;
    /** Overrides the default status wording ("On track" / "Behind" / "Complete"). */
    statusLabel?: string;
    /** Footer note, e.g. "$1,800 to go". */
    remainingLabel?: string;
    /** ISO date for the deadline. Never computed here — dates arrive as props. */
    dueDateIso?: string;
    /** Human-readable deadline, e.g. "Dec 31, 2026". Rendered inside <time>. */
    dueDateLabel?: string;
    /** When set, the whole card becomes one link via the stretched-link pattern. */
    href?: string;
    /**
     * Heading rank. The correct level depends on the surrounding document
     * outline, so it is overridable rather than hardcoded.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    /** Visible label on the footer action. */
    actionLabel?: string;
    /** Click handler for the footer action. */
    onAction?: React.MouseEventHandler<HTMLButtonElement>;
    /**
     * Message for the polite live region, which is in the DOM from first render
     * so a later confirmation ("Contribution added") is actually announced.
     */
    announcement?: string;
    /** Dims the card, drops the stretched link and disables the action. */
    disabled?: boolean;
  };

export function ProgressCard({
  actionLabel,
  announcement,
  className,
  description,
  disabled = false,
  dueDateIso,
  dueDateLabel,
  eyebrow,
  headingLevel = 3,
  href,
  material = "clay",
  onAction,
  remainingLabel,
  size = "md",
  status = "on-track",
  statusLabel,
  target,
  targetLabel,
  title,
  value,
  valueLabel,
  variant = "default",
  ...props
}: ProgressCardProps) {
  const headingId = React.useId();
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

  // Values are clamped here so a caller can never desync the visible reading,
  // the bar's width and the ARIA numbers — they are all derived from these.
  const safeTarget = Number.isFinite(target) && target > 0 ? target : 100;
  const safeValue = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), safeTarget);
  const percentage = (safeValue / safeTarget) * 100;
  const percentRounded = Math.round(percentage);
  const currentText = valueLabel ?? String(safeValue);
  const targetText = targetLabel ?? String(safeTarget);
  const statusText = statusLabel ?? STATUS_LABEL[status];
  const hasFooter = Boolean(remainingLabel || (dueDateIso && dueDateLabel) || actionLabel);
  const isLinked = Boolean(href) && !disabled;

  return (
    <>
      {/*
        `href` + `precedence` so React 19 hoists this and deduplicates it: a bare
        <style> emits one identical copy per card rendered on the page.
      */}
      <style href="mq-progress-card" precedence="medium">
        {PROGRESS_CARD_KEYFRAMES}
      </style>
      <article
        {...props}
        className={cn(
          progressCardVariants({ material, variant, size }),
          isLinked && INTERACTIVE_LIFT,
          isLinked && FOCUS_WITHIN_RING,
          className,
        )}
        data-material={material}
        data-state={disabled ? "disabled" : "idle"}
        data-status={status}
      >
        {/*
          Present before any text arrives, so a confirmation pushed in later is
          announced instead of being read as a fresh region.
        */}
        <span aria-atomic="true" aria-live="polite" className="sr-only">
          {announcement ?? ""}
        </span>

        <div className="flex flex-wrap items-center gap-[10px]">
          {eyebrow ? (
            <p className="m-0 text-[length:11px] font-bold uppercase leading-none tracking-[0.14em] text-[color:var(--mq-muted,#5c5b55)]">
              {eyebrow}
            </p>
          ) : null}
          <span className={cn(STATUS_CHIP, STATUS_TONE[status])}>
            <StatusGlyph status={status} />
            <span>{statusText}</span>
          </span>
        </div>

        <div className="flex flex-col gap-[6px]">
          <HeadingTag
            className="m-0 font-extrabold tracking-[-0.02em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.25]"
            id={headingId}
          >
            {isLinked ? (
              <a className={STRETCHED_LINK} href={href}>
                {title}
              </a>
            ) : (
              title
            )}
          </HeadingTag>
          {description ? (
            <p className="m-0 text-[color:var(--mq-muted,#5c5b55)] text-[length:12px] leading-[1.6]">
              {description}
            </p>
          ) : null}
        </div>

        {/* The reading is real text: "3,200 of 5,000" and "64%" both sit here. */}
        <p className="m-0 flex flex-wrap items-baseline gap-x-[8px] gap-y-[2px]">
          <span className="font-extrabold tabular-nums tracking-[-0.03em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-metric,30px)] leading-[1.05]">
            {currentText}
          </span>
          <span className="font-semibold text-[color:var(--mq-muted,#5c5b55)] text-[length:13px] leading-[1.4]">
            {`of ${targetText}`}
          </span>
          <span className="ml-auto font-extrabold tabular-nums text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.2]">
            {`${percentRounded}%`}
          </span>
        </p>

        <div
          aria-labelledby={headingId}
          aria-valuemax={safeTarget}
          aria-valuemin={0}
          aria-valuenow={safeValue}
          aria-valuetext={`${currentText} of ${targetText}, ${percentRounded} percent`}
          className={cn(
            "relative isolate h-[var(--mq-bar,10px)] w-full overflow-hidden rounded-full border",
            "border-[var(--mq-track-brd,rgba(120,80,55,0.34))] bg-[var(--mq-track,#e8d2c3)]",
            "shadow-[var(--mq-track-shadow,inset_0_2px_3px_rgba(94,55,38,0.22))]",
            // GrayText for the track and Highlight for the fill keeps the two
            // apart once every author colour is discarded.
            "forced-colors:border-[CanvasText] forced-colors:bg-[GrayText] forced-colors:shadow-none",
          )}
          role="progressbar"
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-y-0 left-0 rounded-[inherit]",
              "bg-[var(--mq-fill,#9f2f23)] shadow-[var(--mq-fill-shadow,inset_0_1px_1px_rgba(255,255,255,0.45))]",
              "animate-[mq-progress-card-fill_760ms_cubic-bezier(0.22,1,0.36,1)]",
              "transition-[width] duration-500 ease-out",
              "motion-reduce:animate-none motion-reduce:transition-none",
              "forced-colors:bg-[Highlight] forced-colors:shadow-none",
            )}
            style={
              {
                "--mq-fill-w": `${percentage.toFixed(2)}%`,
                width: `${percentage.toFixed(2)}%`,
              } as React.CSSProperties
            }
          />
          {/* Quarter marks: the track is ruled, the fill is smooth — a second,
              non-colour difference between the two, kept in forced colours. */}
          {[25, 50, 75].map((tick) => (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 z-[1] w-px bg-[var(--mq-tick,rgba(120,80,55,0.42))] forced-colors:bg-[CanvasText]"
              key={tick}
              style={{ left: `${tick}%` }}
            />
          ))}
        </div>

        {hasFooter ? (
          <div className="flex flex-wrap items-center justify-between gap-[10px] border-t border-[var(--mq-rule,rgba(23,24,23,0.14))] pt-[var(--mq-gap,14px)]">
            <p className="m-0 flex flex-wrap items-center gap-x-[8px] gap-y-[2px] text-[color:var(--mq-muted,#5c5b55)] text-[length:12px] leading-[1.5]">
              {remainingLabel ? (
                <span className="font-semibold text-[color:var(--mq-text,#2b2b26)]">
                  {remainingLabel}
                </span>
              ) : null}
              {remainingLabel && dueDateIso && dueDateLabel ? (
                <span aria-hidden="true">·</span>
              ) : null}
              {dueDateIso && dueDateLabel ? (
                // Never `new Date()` in render: the ISO value and the display
                // string are both props, so the markup is identical on the
                // server and the client.
                <time dateTime={dueDateIso}>{dueDateLabel}</time>
              ) : null}
            </p>
            {actionLabel ? (
              <button
                className={ACTION_BUTTON}
                disabled={disabled}
                onClick={onAction}
                type="button"
              >
                {actionLabel}
              </button>
            ) : null}
          </div>
        ) : null}
      </article>
    </>
  );
}

export { progressCardVariants };
