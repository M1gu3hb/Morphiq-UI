"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CalendarCheck, CalendarPlus, Clock, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Event Card
 *
 * An event listing: a torn-stub date plaque (big day + short month), a semantic
 * heading, the venue and the time as real text, an optional cover image, and an
 * "Attend" control that toggles to a confirmed "Attending" state.
 *
 * Self-contained by design — the four material recipes (clay / glass / skeuo /
 * adaptive) are copied and owned here, straight from `card.tsx`, so dropping
 * this file plus `src/lib/cn.ts` into another project reproduces the full
 * tactile look with no global stylesheet and no `:root` custom properties.
 * Every `var()` carries a literal fallback.
 *
 * Local theming knobs (custom properties declared on the card, inherited down):
 *
 *   --mq-body           surface colour
 *   --mq-lit            top highlight (skeuo gradient)
 *   --mq-edge           extruded bottom edge colour
 *   --mq-text           primary foreground
 *   --mq-muted          secondary foreground (venue, time, attendance)
 *   --mq-rule           hairline / image well wash / perforation dots
 *   --mq-brd            border colour
 *   --mq-ring           focus ring colour
 *   --mq-acc            accent fill for the Attend control
 *   --mq-acc-fg         text on the accent fill
 *   --mq-acc-edge       extruded edge under the accent fill
 *   --mq-plaque         date-stub surface
 *   --mq-plaque-text    date-stub foreground
 *   --mq-plaque-shadow  date-stub depth (per material)
 *   --mq-pad            inner padding
 *   --mq-gap            vertical rhythm between blocks
 *   --mq-radius         corner radius
 *   --mq-title          title font size
 *   --mq-day            day-number font size
 *   --mq-stub           date-stub width (fixed, so the row never reflows)
 *   --mq-meta           venue / time font size
 *
 * Contrast contract (inherited from the Card recipe): on every filled material
 * both --mq-text and --mq-muted stay at or above 4.5:1 against the surface, the
 * glass tokens carry their own tint so that holds over a white and a black
 * backdrop alike, and --mq-plaque-text clears 4.5:1 against --mq-plaque on each
 * material (clay 8.8:1, skeuo 9.6:1, adaptive 10.8:1 dark / 16:1 light, glass
 * >= 12:1 over either backdrop).
 *
 * Dates NEVER come from the clock: `dateTime`, `day`, `month`, `dateLabel` and
 * `timeLabel` all arrive as props, so a statically generated page renders the
 * same bytes on the server and the client. Nothing calls `Date.now()`.
 *
 * Whole-card link: when `href` is set the TITLE renders as a single <a> whose
 * `::after` overlay stretches across the card, making the entire surface one
 * link WITHOUT nesting the Attend button inside it. The button is raised on
 * `relative z-10` so it stays independently clickable and focusable — the
 * "stretched link" pattern, the only correct way to make a card that both leads
 * somewhere and holds its own controls.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type EventCardVariant = "default";
type EventCardSize = "sm" | "md" | "lg";

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
 * `:focus-within` is scoped to the linked (interactive) card only: tabbing to
 * the title link or the Attend button outlines the whole card, so the stretched
 * link never loses its visible focus. An inert event card skips this to avoid
 * double-ringing the Attend button's own focus.
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
 * The stub rises a hair ahead of the card on hover, so the date reads as a
 * separate physical ticket sitting on the surface. Applied ONLY together with
 * `INTERACTIVE_LIFT` — on an inert card nothing would change these properties
 * and the transition would be a phantom.
 */
const PLAQUE_LIFT =
  // Only `translate` is named: the stub's shadow is a fixed material token and
  // nothing changes it, so listing `box-shadow` here would be a phantom.
  "transition-[translate] duration-200 ease-out motion-reduce:transition-none " +
  "group-hover:-translate-y-[3px] motion-reduce:group-hover:translate-y-0";

/**
 * Stretched link: a single <a> whose transparent `::after` covers the card (the
 * nearest positioned ancestor is the `relative` article). Everything the reader
 * must still reach independently — the Attend button — sits on a higher
 * `z-index`, so it stays clickable while the rest of the surface routes to the
 * event page. The <a> itself drops its own outline; the card's `:focus-within`
 * ring is what shows the focus.
 */
const STRETCHED_LINK =
  "text-inherit no-underline outline-none " +
  "[&::after]:absolute [&::after]:inset-0 [&::after]:z-[1] [&::after]:content-['']";

/**
 * The Attend control.
 *
 * The two states are told by the LABEL ("Attend" -> "Attending") and by the
 * ICON (a plus calendar -> a check calendar) first; the fill dropping away to an
 * outlined, inset "confirmed" look is a third, redundant signal — never the only
 * one. `aria-pressed` carries the same state to assistive tech.
 *
 * Every property named in the transition really changes: `translate` on hover
 * and press, `box-shadow` with them, `background-color` and `color` when the
 * state flips, `opacity` when it is disabled. `border-color` is deliberately
 * NOT named — the accent border is kept in both states, so it would be a
 * phantom. `translate`, not `transform`: Tailwind v4 writes its `translate-*`
 * utilities to the standalone `translate` property.
 */
const ATTEND_BUTTON =
  "relative z-10 inline-flex shrink-0 items-center justify-center gap-[7px] cursor-pointer appearance-none " +
  "rounded-[calc(var(--mq-radius,24px)_-_12px)] px-[15px] py-[9px] " +
  "text-[length:13px] font-bold whitespace-nowrap tracking-[-0.01em] " +
  "border border-[var(--mq-acc,#1c1c19)] " +
  "bg-[var(--mq-acc,#1c1c19)] text-[color:var(--mq-acc-fg,#ffffff)] " +
  "shadow-[0_2px_0_var(--mq-acc-edge,rgba(0,0,0,0.35)),0_9px_18px_rgba(20,20,18,0.18)] " +
  "transition-[translate,box-shadow,background-color,color,opacity] duration-200 ease-out " +
  "motion-reduce:transition-none " +
  "hover:-translate-y-[1px] " +
  "hover:shadow-[0_4px_0_var(--mq-acc-edge,rgba(0,0,0,0.35)),0_14px_26px_rgba(20,20,18,0.22)] " +
  "motion-reduce:hover:translate-y-0 " +
  "active:translate-y-[1px] " +
  "active:shadow-[0_1px_0_var(--mq-acc-edge,rgba(0,0,0,0.35)),0_4px_10px_rgba(20,20,18,0.16)] " +
  "motion-reduce:active:translate-y-0 " +
  // Confirmed state: the fill is spent, the control sinks into the surface.
  "data-[attending=true]:bg-transparent " +
  "data-[attending=true]:text-[color:var(--mq-text,#2b2b26)] " +
  "data-[attending=true]:shadow-[inset_0_2px_4px_rgba(20,20,18,0.18)] " +
  "data-[attending=true]:hover:shadow-[inset_0_2px_4px_rgba(20,20,18,0.18)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] " +
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 " +
  // Forced colours discard the fill entirely, so the pressed state repaints to
  // the system Highlight pair and the resting state to the button pair.
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] " +
  "forced-colors:shadow-none " +
  "forced-colors:data-[attending=true]:border-[Highlight] " +
  "forced-colors:data-[attending=true]:bg-[Highlight] " +
  "forced-colors:data-[attending=true]:text-[HighlightText] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Visually hidden but present in the accessibility tree — the classic sr-only,
 * inlined as utilities so nothing depends on a global `.sr-only` class.
 */
const VISUALLY_HIDDEN =
  "absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]";

const eventCardVariants = cva(
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
          // The backdrop filter is meaningless once the palette is forced.
          "forced-colors:[backdrop-filter:none] forced-colors:shadow-none",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#e6e3da))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_9px_0_var(--mq-edge,#a8a49b),0_20px_32px_rgba(38,36,31,0.283)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.175),0_2px_0_var(--mq-edge,#a8a49b),0_6px_9px_rgba(38,36,31,0.204)]",
          // Gradients survive forced colours untouched, so the warm greige wash
          // is cleared by hand rather than sitting on a system-coloured surface.
          "forced-colors:[background-image:none] forced-colors:bg-[Canvas]",
        ].join(" "),
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)] [--mq-shadow-hover:0_1px_3px_rgba(20,20,18,0.118),0_14px_35px_rgba(20,20,18,0.071)] [--mq-shadow-press:0_0px_1px_rgba(20,20,18,0.085),0_4px_10px_rgba(20,20,18,0.051)]",
          // Only ever *grows* the rhythm, so this cannot shrink `lg` on touch.
          "pointer-coarse:gap-[calc(var(--mq-gap,14px)_+_4px)]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-pad:16px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:15px] [--mq-day:22px] [--mq-stub:54px] [--mq-meta:11px]",
        md: "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:17px] [--mq-day:28px] [--mq-stub:64px] [--mq-meta:12px]",
        lg: "[--mq-pad:28px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:20px] [--mq-day:34px] [--mq-stub:76px] [--mq-meta:13px]",
      },
    },
    compoundVariants: [
      {
        material: "clay",
        variant: "default",
        class:
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817] " +
          "[--mq-acc:#33261e] [--mq-acc-fg:#fff3ea] [--mq-acc-edge:rgba(60,40,28,0.55)] " +
          "[--mq-plaque:#e9cfbe] [--mq-plaque-text:#33261e] " +
          "[--mq-plaque-shadow:inset_0_2px_4px_rgba(120,80,55,0.30),inset_0_-1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(255,255,255,0.70)]",
      },
      {
        material: "glass",
        variant: "default",
        // --mq-muted #36362f (not a lighter grey) holds 5.14:1 over a black
        // backdrop at 0.66 opacity, where a lighter muted measured only 4.27:1.
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817] " +
          "[--mq-acc:#1e1e1b] [--mq-acc-fg:#ffffff] [--mq-acc-edge:rgba(9,9,8,0.50)] " +
          "[--mq-plaque:rgba(255,255,255,0.86)] [--mq-plaque-text:#1e1e1b] " +
          "[--mq-plaque-shadow:inset_0_1px_0_rgba(255,255,255,0.95),0_7px_18px_rgba(24,20,40,0.20)]",
      },
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#e6e3da] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817] " +
          "[--mq-acc:#23231f] [--mq-acc-fg:#f6f4ee] [--mq-acc-edge:rgba(0,0,0,0.55)] " +
          "[--mq-plaque:#cfcabe] [--mq-plaque-text:#23231f] " +
          "[--mq-plaque-shadow:inset_0_2px_4px_rgba(40,37,31,0.34),inset_0_-1px_0_rgba(255,255,255,0.60),0_1px_0_rgba(255,255,255,0.75)]",
      },
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817] " +
          "[--mq-acc:#1c1c19] [--mq-acc-fg:#ffffff] [--mq-acc-edge:rgba(0,0,0,0.35)] " +
          "[--mq-plaque:#f2f1ed] [--mq-plaque-text:#1c1c19] " +
          "[--mq-plaque-shadow:inset_0_0_0_1px_rgba(23,24,23,0.07),0_2px_6px_rgba(20,20,18,0.10)] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9] " +
          "dark:[--mq-acc:#f1efe9] dark:[--mq-acc-fg:#1c1c19] dark:[--mq-acc-edge:rgba(0,0,0,0.55)] " +
          "dark:[--mq-plaque:#33333a] dark:[--mq-plaque-text:#f1efe9] " +
          "dark:[--mq-plaque-shadow:inset_0_0_0_1px_rgba(255,255,255,0.09),0_2px_6px_rgba(0,0,0,0.45)] " +
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
 * Motion, shipped with the component instead of a global sheet. React 19 hoists
 * this `<style>` and dedupes it by `href`, so a page full of event cards emits
 * one rule.
 *
 * `mq-event-stamp` RESTS at exactly the confirmed appearance (opacity 1,
 * scale 1), so `motion-reduce:animate-none` leaves the check glyph fully
 * rendered — only the travel is dropped, never the state change. The ring is
 * pure celebration, ends invisible, and is removed outright under reduced
 * motion and forced colours.
 */
const EVENT_CARD_KEYFRAMES = `
@keyframes mq-event-stamp{0%{opacity:0;scale:0.5}55%{opacity:1;scale:1.14}100%{opacity:1;scale:1}}
@keyframes mq-event-ring{0%{opacity:0.7;scale:0.8}100%{opacity:0;scale:1.3}}`;

function EventCardKeyframes() {
  return (
    <style href="mq-event-card" precedence="medium">
      {EVENT_CARD_KEYFRAMES}
    </style>
  );
}

export type EventCardProps = Omit<React.ComponentPropsWithRef<"article">, "title"> &
  Omit<VariantProps<typeof eventCardVariants>, "material" | "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: EventCardVariant;
    size?: EventCardSize;
    /** Event name — the card's heading and, when `href` is set, the link text. */
    title: string;
    /** When set, the whole card becomes one link via the stretched-link pattern. */
    href?: string;
    /**
     * Machine-readable start, e.g. "2026-03-14T19:00". Supplied as a prop and
     * never derived from the clock, so SSG output is byte-stable.
     */
    dateTime: string;
    /** Big day number on the stub, e.g. "14". */
    day: string;
    /** Short month on the stub, e.g. "MAR". */
    month: string;
    /** Full spoken date, e.g. "Saturday, 14 March 2026". Read instead of the stub. */
    dateLabel: string;
    /** Display time, e.g. "7:00 – 9:30 PM". A prop, never formatted from "now". */
    timeLabel: string;
    /** Venue text, e.g. "Rialto Hall, Lisbon". */
    location: string;
    /** People already going, NOT counting the reader. Omit to hide the row. */
    attendeeCount?: number;
    /** Optional short flag, e.g. "Free" or "Last tickets". Text, not colour. */
    badge?: string;
    /** Optional cover image URL. */
    imageSrc?: string;
    /**
     * Alternative text for the cover image. Required for any informative
     * banner; the empty default is only correct when the art says nothing the
     * heading and meta rows do not already say.
     */
    imageAlt?: string;
    /**
     * Heading rank for the title. The correct level depends on the surrounding
     * document outline, so it is overridable rather than hardcoded.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    /** Controlled attending state. Omit for uncontrolled. */
    attending?: boolean;
    /** Initial attending state when uncontrolled. */
    defaultAttending?: boolean;
    /** Fired after a toggle with the next attending state. */
    onAttendingChange?: (attending: boolean) => void;
    /** Visible label while NOT attending. Also part of the accessible name. */
    attendLabel?: string;
    /** Visible label while attending. Also part of the accessible name. */
    attendingLabel?: string;
    /** Marks the event closed: dims the card, disables the control, drops the link. */
    disabled?: boolean;
  };

export function EventCard({
  attendLabel = "Attend",
  attendeeCount,
  attending,
  attendingLabel = "Attending",
  badge,
  className,
  dateLabel,
  dateTime,
  day,
  defaultAttending = false,
  disabled = false,
  headingLevel = 3,
  href,
  imageAlt = "",
  imageSrc,
  location,
  material = "clay",
  month,
  onAttendingChange,
  size = "md",
  timeLabel,
  title,
  variant = "default",
  ...props
}: EventCardProps) {
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

  const isControlled = attending !== undefined;
  const [internalAttending, setInternalAttending] = React.useState(defaultAttending);
  const isAttending = isControlled ? attending : internalAttending;

  // `pulse` remounts the stamp so its CSS animation replays on each toggle. It
  // starts at 0 so nothing animates on first paint, which keeps the server and
  // the client render identical.
  const [pulse, setPulse] = React.useState(0);
  const [message, setMessage] = React.useState("");

  const isLinked = Boolean(href) && !disabled;
  // A `const` union rather than a boolean flag: narrowing on it survives into
  // the click handler's closure without any cast.
  const baseCount = typeof attendeeCount === "number" ? attendeeCount : null;
  // Derived, never stored: the reader is counted in only while attending, so
  // the number cannot drift out of sync with the button.
  const goingCount = baseCount === null ? null : baseCount + (isAttending ? 1 : 0);

  function handleAttendToggle() {
    const next = !isAttending;
    if (!isControlled) setInternalAttending(next);
    setPulse((value) => value + 1);

    const nextCount = baseCount === null ? null : baseCount + (next ? 1 : 0);
    const tail =
      nextCount === null
        ? ""
        : ` ${nextCount} ${nextCount === 1 ? "person" : "people"} going.`;
    setMessage(`${next ? attendingLabel : `Not ${attendingLabel.toLowerCase()}`}: ${title}.${tail}`);

    onAttendingChange?.(next);
  }

  return (
    <>
      <EventCardKeyframes />
      <article
        {...props}
        className={cn(
          eventCardVariants({ material, variant, size }),
          // Gate the whole-card affordances on `!disabled` too: a dimmed card
          // must not lift, ring, or render a live stretched link.
          isLinked && INTERACTIVE_LIFT,
          isLinked && FOCUS_WITHIN_RING,
          className,
        )}
        data-attending={isAttending ? "true" : "false"}
        data-material={material}
        data-state={disabled ? "disabled" : "idle"}
      >
        {imageSrc ? (
          // Fixed aspect ratio around an object-cover image: the box is laid out
          // before the bytes arrive, so nothing shifts on load.
          <div className="relative overflow-hidden rounded-[calc(var(--mq-radius,24px)_-_10px)] aspect-[16/9] bg-[var(--mq-rule,rgba(120,80,55,0.20))]">
            {/* eslint-disable-next-line @next/next/no-img-element -- copy-and-own component stays framework-agnostic */}
            <img
              src={imageSrc}
              alt={imageAlt}
              loading="lazy"
              decoding="async"
              className={cn(
                // The arbitrary `[transform:…]` form (not `scale-105`) is used
                // deliberately so `transition-[transform]` names the property
                // that actually animates.
                "size-full object-cover [transform:scale(1)]",
                "transition-[transform] duration-500 ease-out",
                "group-hover:[transform:scale(1.04)]",
                "motion-reduce:transition-none motion-reduce:group-hover:[transform:none]",
              )}
            />
          </div>
        ) : null}

        <div className="flex items-start gap-[var(--mq-gap,14px)]">
          {/*
            The date stub. Its parts are real text — selectable, zoomable and
            translatable — but they are hidden from assistive tech because "14
            MAR" read aloud is an abbreviation, not a date. The <time> carries
            the machine value in `dateTime` and the spoken form in `dateLabel`.
            Its width is fixed (`--mq-stub`) so the row never reflows.
          */}
          <time
            className={cn(
              "flex shrink-0 flex-col items-center justify-center gap-[2px]",
              "w-[var(--mq-stub,64px)] rounded-[calc(var(--mq-radius,24px)_-_10px)] px-[6px] py-[10px]",
              "border border-[var(--mq-brd,rgba(120,80,55,0.16))]",
              "bg-[var(--mq-plaque,#e9cfbe)] text-[color:var(--mq-plaque-text,#33261e)]",
              "shadow-[var(--mq-plaque-shadow,inset_0_2px_4px_rgba(120,80,55,0.30))]",
              "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]",
              "forced-colors:text-[CanvasText] forced-colors:shadow-none",
              isLinked && PLAQUE_LIFT,
            )}
            dateTime={dateTime}
          >
            <span className={VISUALLY_HIDDEN}>{dateLabel}</span>
            <span
              aria-hidden="true"
              className="text-[length:var(--mq-day,28px)] font-extrabold leading-none tracking-[-0.04em] [font-variant-numeric:tabular-nums]"
            >
              {day}
            </span>
            <span
              aria-hidden="true"
              className="text-[length:10px] font-bold uppercase leading-none tracking-[0.16em]"
            >
              {month}
            </span>
          </time>

          {/* Perforation: pure ticket ornament, so it is hidden and it clears
              its background image in forced colours rather than painting a
              white dotted column across the system palette. */}
          <span
            aria-hidden="true"
            className={cn(
              "w-px shrink-0 self-stretch rounded-full",
              "[background-image:repeating-linear-gradient(to_bottom,var(--mq-rule,rgba(120,80,55,0.20))_0_4px,transparent_4px_9px)]",
              "forced-colors:[background-image:none] forced-colors:bg-[CanvasText]",
            )}
          />

          <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
            {badge ? (
              <span
                className={cn(
                  "inline-flex w-fit items-center rounded-full px-[9px] py-[3px]",
                  "border border-[var(--mq-brd,rgba(120,80,55,0.16))]",
                  "bg-[var(--mq-plaque,#e9cfbe)] text-[color:var(--mq-plaque-text,#33261e)]",
                  "text-[length:10px] font-bold uppercase leading-none tracking-[0.12em]",
                  "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
                )}
              >
                {badge}
              </span>
            ) : null}

            <HeadingTag className="m-0 font-extrabold tracking-[-0.02em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.25]">
              {isLinked ? (
                <a href={href} className={STRETCHED_LINK}>
                  {title}
                </a>
              ) : (
                title
              )}
            </HeadingTag>

            <ul className="m-0 flex list-none flex-col gap-[5px] p-0">
              <li
                className={cn(
                  "flex items-center gap-[7px]",
                  "text-[color:var(--mq-muted,#5c5b55)] text-[length:var(--mq-meta,12px)] leading-[1.5]",
                  "forced-colors:text-[CanvasText]",
                )}
              >
                <Clock aria-hidden="true" className="size-[14px] shrink-0" strokeWidth={2} />
                <span className={VISUALLY_HIDDEN}>Time: </span>
                <span>{timeLabel}</span>
              </li>
              <li
                className={cn(
                  "flex items-center gap-[7px]",
                  "text-[color:var(--mq-muted,#5c5b55)] text-[length:var(--mq-meta,12px)] leading-[1.5]",
                  "forced-colors:text-[CanvasText]",
                )}
              >
                <MapPin aria-hidden="true" className="size-[14px] shrink-0" strokeWidth={2} />
                <span className={VISUALLY_HIDDEN}>Location: </span>
                <span className="min-w-0 break-words">{location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center gap-[10px]",
            goingCount === null ? "justify-end" : "justify-between",
            "border-t border-[var(--mq-rule,rgba(23,24,23,0.14))] pt-[var(--mq-gap,14px)]",
            "forced-colors:border-[CanvasText]",
          )}
        >
          {goingCount === null ? null : (
            <p
              className={cn(
                "m-0 flex items-center gap-[7px]",
                "text-[color:var(--mq-muted,#5c5b55)] text-[length:var(--mq-meta,12px)] leading-none",
                "forced-colors:text-[CanvasText]",
              )}
            >
              <Users aria-hidden="true" className="size-[14px] shrink-0" strokeWidth={2} />
              <span>
                <span className="font-bold text-[color:var(--mq-text,#2b2b26)] [font-variant-numeric:tabular-nums]">
                  {goingCount}
                </span>{" "}
                going
              </span>
            </p>
          )}

          <button
            aria-pressed={isAttending}
            className={ATTEND_BUTTON}
            data-attending={isAttending ? "true" : "false"}
            disabled={disabled}
            onClick={handleAttendToggle}
            type="button"
          >
            <span className="relative grid size-[16px] shrink-0 place-items-center">
              {/* Celebration only: ends invisible, and is removed outright under
                  reduced motion and forced colours. */}
              {pulse > 0 && isAttending ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-[-7px] rounded-full",
                    "border-2 border-[var(--mq-acc,#1c1c19)]",
                    "animate-[mq-event-ring_620ms_ease-out_forwards]",
                    "motion-reduce:hidden forced-colors:hidden",
                  )}
                  key={`ring-${pulse}`}
                />
              ) : null}
              {/* The glyph CHANGES SHAPE with the state (plus -> check), so the
                  confirmation never rests on colour. The stamp animation ends at
                  the resting appearance, so reduced motion keeps the check. */}
              <span
                className={cn(
                  "relative z-10 grid place-items-center",
                  pulse > 0 &&
                    "animate-[mq-event-stamp_420ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
                )}
                key={`glyph-${pulse}-${isAttending ? "on" : "off"}`}
              >
                {isAttending ? (
                  <CalendarCheck aria-hidden="true" className="size-[16px]" strokeWidth={2.25} />
                ) : (
                  <CalendarPlus aria-hidden="true" className="size-[16px]" strokeWidth={2.25} />
                )}
              </span>
            </span>
            <span>{isAttending ? attendingLabel : attendLabel}</span>
            {/* Disambiguates one card's control from the next in a list. The
                leading space is explicit so the accessible name reads
                "Attending Rooftop listening session", never one run-on word. */}
            <span className={VISUALLY_HIDDEN}>
              {" "}
              {title}
            </span>
          </button>
        </div>

        {/* Present in the DOM before any text arrives, so the toggle result is
            announced instead of the region itself being what appears. */}
        <p aria-atomic="true" aria-live="polite" className={cn("m-0", VISUALLY_HIDDEN)}>
          {message}
        </p>
      </article>
    </>
  );
}

export { eventCardVariants };
