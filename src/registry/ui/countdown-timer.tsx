"use client";

import * as React from "react";
import { Ban, CircleCheck, Clock, Pause, Play, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Countdown Timer
 *
 * A split-flap instrument panel that counts down to a target instant. Each unit
 * is a lit tile with a hinge seam across its middle, a unit plate underneath and
 * real tabular digits; an optional dial shows the fraction of the span still
 * left. When the countdown lands on zero it settles into a completed state and
 * calls `onComplete` exactly once.
 *
 * This is a material-AGNOSTIC readout: it ships a single recipe built on the
 * adaptive light+dark token vocabulary. `material` is accepted for catalog
 * parity and reflected on `data-material`; it drives no separate surface.
 *
 * -- SSR / SSG contract (the crux of a clock component) ----------------------
 * Nothing in render reads the wall clock. `new Date()` and `Date.now()` appear
 * nowhere outside effect and event callbacks, so a statically generated page
 * and its hydration produce identical markup:
 *
 *   - `durationMs` mode starts from a DETERMINISTIC initial state -- the full
 *     duration -- so the server already renders the true first frame.
 *   - `target` mode cannot know the remainder without a clock, so it renders a
 *     placeholder readout marked `aria-busy` until the FIRST clock reading is
 *     taken inside the effect, one tick after hydration.
 *   - `Date.parse` on the `target` string is a pure function of that string, but
 *     an ISO value WITHOUT an offset is parsed in the local zone -- always pass
 *     an offset (`...Z` / `...+02:00`) so server and client agree.
 *   - The interval lives in a `useEffect` and is cleared in its cleanup, always.
 *     `setRemaining` is called from the interval CALLBACK, never synchronously
 *     in the effect body.
 *
 * -- Announcement policy ------------------------------------------------------
 * A per-second live region floods a screen reader. The visible digits therefore
 * live in an `aria-hidden` layer and update every tick, while a separate sr-only
 * sentence inside the same `role="timer"` region is derived from a COARSENED
 * remainder -- per hour above a day, per quarter hour above an hour, per minute
 * above a minute, per ten seconds above ten, and per second for the final ten
 * plus completion. Its text is identical between boundaries, so the DOM node
 * does not change and nothing is announced.
 *
 * Local theming knobs, every one used with a literal fallback:
 *
 *   --mq-text       digits and primary text
 *   --mq-muted      unit plates, label, separators
 *   --mq-plate      the panel surface
 *   --mq-face-lit   top stop of a tile face
 *   --mq-face-base  bottom stop of a tile face and its extruded edge
 *   --mq-seam       the hinge hairline across a tile
 *   --mq-brd        panel and tile border
 *   --mq-ring       focus ring colour
 *   --mq-track      dial track
 *   --mq-arc        dial value arc
 *   --mq-done       completed accent
 *   --mq-offset     dial dash offset -- the FINAL value (set inline)
 *   --mq-gap / --mq-pad / --mq-radius / --mq-tile-w / --mq-tile-h /
 *   --mq-digit / --mq-unit / --mq-sep / --mq-dial   density, set by size
 */

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type Size = "sm" | "md" | "lg";

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] " +
  "forced-colors:data-[focus=true]:outline-[Highlight]";

const MS_SECOND = 1000;
const MS_MINUTE = 60 * MS_SECOND;
const MS_HOUR = 60 * MS_MINUTE;
const MS_DAY = 24 * MS_HOUR;

/** Poll faster than a second so the visible second boundary is never late. */
const TICK_MS = 250;
/** Below this remainder the live region drops to one announcement per second. */
const FINAL_SECONDS_MS = 10 * MS_SECOND;

export type CountdownUnit = "days" | "hours" | "minutes" | "seconds";
export type CountdownStatus = "pending" | "running" | "paused" | "complete" | "disabled";

const UNIT_WORD: Record<CountdownUnit, { one: string; many: string; plate: string }> = {
  days: { one: "day", many: "days", plate: "Days" },
  hours: { one: "hour", many: "hours", plate: "Hrs" },
  minutes: { one: "minute", many: "minutes", plate: "Min" },
  seconds: { one: "second", many: "seconds", plate: "Sec" },
};

/**
 * Every status is carried by THREE independent channels: a distinct glyph, a
 * distinct word, and a shape (the panel's border style, the chip's plate).
 * Colour is never the sole carrier of any of them.
 */
const STATUS_ICON: Record<CountdownStatus, LucideIcon> = {
  pending: Clock,
  running: Clock,
  paused: Pause,
  complete: CircleCheck,
  disabled: Ban,
};

const STATUS_WORD: Record<CountdownStatus, string> = {
  pending: "Starting",
  running: "Counting down",
  paused: "Paused",
  complete: "Time's up",
  disabled: "Unavailable",
};

/**
 * Keyframes travel with the component instead of a global stylesheet. React 19
 * hoists this and deduplicates it by `href`, so a page full of timers emits one
 * rule. The resting end state IS the final visual state -- a digit sits at
 * `opacity:1; translate:0 0` -- so `motion-reduce:animate-none` leaves the
 * readout fully rendered on the correct value rather than blank.
 *
 * `translate` is the standalone property Tailwind v4 writes its utilities to,
 * and it is what these animate; nothing in this file sets `transform`.
 */
const COUNTDOWN_KEYFRAMES = `@keyframes mq-countdown-roll{from{opacity:0;translate:0 -44%}to{opacity:1;translate:0 0}}@keyframes mq-countdown-beat{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}`;

const countdownVariants = cva(
  [
    // Named group so the controls below can mirror a forced `data-focus` from
    // the panel — the docs surface sets one attribute and the real focus look
    // lands on whatever is actually focusable.
    "group/mq-timer relative isolate inline-flex max-w-full flex-col gap-[var(--mq-gap,12px)]",
    "rounded-[var(--mq-radius,17px)] border border-solid p-[var(--mq-pad,16px)]",
    "border-[var(--mq-brd,rgba(23,24,23,0.16))] bg-[var(--mq-plate,#f4f2ec)]",
    "text-[color:var(--mq-text,#141412)]",
    "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_12px_28px_rgba(20,20,18,0.07)]",
    "dark:shadow-[0_1px_2px_rgba(0,0,0,0.55),0_14px_32px_rgba(0,0,0,0.45)]",
    // Adaptive light+dark vocabulary. Digits measure at least 10:1 on both tile
    // faces and the unit plates at least 6.8:1 on both panels.
    "[--mq-text:#141412] [--mq-muted:#54544c] [--mq-plate:#f4f2ec]",
    "[--mq-face-lit:#ffffff] [--mq-face-base:#e7e4db] [--mq-seam:rgba(20,20,18,0.18)]",
    "[--mq-brd:rgba(23,24,23,0.16)] [--mq-ring:#171817]",
    "[--mq-track:#d9d6cd] [--mq-arc:#2f4bd0] [--mq-done:#14653b]",
    "dark:[--mq-text:#f4f2ec] dark:[--mq-muted:#b7b5ad] dark:[--mq-plate:#1c1c20]",
    "dark:[--mq-face-lit:#35353c] dark:[--mq-face-base:#232328] dark:[--mq-seam:rgba(0,0,0,0.62)]",
    "dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9]",
    "dark:[--mq-track:#3a3a41] dark:[--mq-arc:#93a7ff] dark:[--mq-done:#78dfa5]",
    // Shape, not hue: a held clock is drawn with a broken outline and an
    // unavailable one is both broken and faded.
    "data-[status=paused]:border-dashed",
    "data-[status=disabled]:border-dashed data-[status=disabled]:opacity-55",
    // `opacity` is the only property that changes on this element, so it is the
    // only one named -- nothing phantom, nothing animating against `none`.
    "transition-[opacity] duration-200 ease-out motion-reduce:transition-none",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      // A countdown has one composition. `default` exists so the registry can
      // list a variant axis and the preview can coerce an incoming value.
      variant: { default: "" },
      size: {
        sm: "[--mq-gap:9px] [--mq-pad:12px] [--mq-radius:13px] [--mq-tile-w:44px] [--mq-tile-h:52px] [--mq-digit:24px] [--mq-unit:9px] [--mq-sep:15px] [--mq-dial:32px]",
        md: "[--mq-gap:12px] [--mq-pad:16px] [--mq-radius:17px] [--mq-tile-w:58px] [--mq-tile-h:68px] [--mq-digit:32px] [--mq-unit:10px] [--mq-sep:20px] [--mq-dial:40px]",
        lg: "[--mq-gap:15px] [--mq-pad:20px] [--mq-radius:21px] [--mq-tile-w:74px] [--mq-tile-h:86px] [--mq-digit:42px] [--mq-unit:11px] [--mq-sep:26px] [--mq-dial:50px]",
      },
      /**
       * The panel itself is inert. It only borrows the focus look when there is
       * nothing focusable inside it, so a docs surface forcing `data-focus`
       * never draws two rings around one target.
       */
      hasControls: {
        true: "",
        false: FOCUS_RING,
      },
    },
    defaultVariants: { variant: "default", size: "md", hasControls: false },
  },
);

const tileVariants = cva(
  [
    "relative isolate grid h-[var(--mq-tile-h,68px)] min-w-[var(--mq-tile-w,58px)] place-items-center",
    "overflow-hidden rounded-[calc(var(--mq-radius,17px)_-_6px)] border px-[8px]",
    "border-[var(--mq-brd,rgba(23,24,23,0.16))]",
    "[background-image:linear-gradient(180deg,var(--mq-face-lit,#ffffff),var(--mq-face-base,#e7e4db))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-4px_7px_rgba(38,30,20,0.13),0_2px_0_var(--mq-face-base,#e7e4db),0_7px_15px_rgba(20,20,18,0.14)]",
    "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_-4px_8px_rgba(0,0,0,0.55),0_2px_0_#131317,0_8px_17px_rgba(0,0,0,0.50)]",
    // The split-flap hinge. A pseudo-element rather than a border so it never
    // participates in layout and never fights the tile's own rounding.
    "after:pointer-events-none after:absolute after:inset-x-0 after:top-1/2 after:h-px",
    "after:bg-[var(--mq-seam,rgba(20,20,18,0.18))]",
    // Forced colours discard fills and shadows but NOT background images, so the
    // face gradient has to be cleared by hand or it would sit on a system
    // surface it was never designed against.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:after:bg-[CanvasText]",
  ].join(" "),
);

const controlVariants = cva(
  [
    "inline-flex items-center gap-[6px] rounded-full border px-[12px] py-[6px]",
    "text-[11px] leading-none font-bold tracking-[0.01em]",
    "border-[var(--mq-brd,rgba(23,24,23,0.16))] bg-[var(--mq-face-lit,#ffffff)]",
    "text-[color:var(--mq-text,#141412)]",
    "shadow-[0_1px_0_var(--mq-face-base,#e7e4db)]",
    "hover:-translate-y-[1px] hover:bg-[var(--mq-face-base,#e7e4db)]",
    "active:translate-y-[1px]",
    // Tailwind v4 writes `-translate-y-*` to the standalone `translate`
    // property, so the transition names `translate` explicitly rather than
    // relying on a `transform` that nothing here ever sets.
    "transition-[translate,background-color] duration-150 ease-out",
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
    "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0",
    "[&>svg]:size-[13px]",
    FOCUS_RING,
    // Parallel to `data-[focus=true]`, but driven from the panel, so a docs
    // preview can force the button's real focus ring without a keyboard event.
    "group-data-[focus=true]/mq-timer:outline-2 group-data-[focus=true]/mq-timer:outline-offset-[3px]",
    "group-data-[focus=true]/mq-timer:outline-[var(--mq-ring,#171817)]",
    "forced-colors:group-data-[focus=true]/mq-timer:outline-[Highlight]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
);

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
const round3 = (value: number): number => Math.round(value * 1000) / 1000;

/**
 * Parses the target into epoch milliseconds. Pure in its argument -- it never
 * consults the clock -- so it is safe to call during render.
 */
function toEpoch(target: string | number | undefined): number | null {
  if (typeof target === "number") return Number.isFinite(target) ? target : null;
  if (typeof target !== "string") return null;
  const parsed = Date.parse(target);
  return Number.isNaN(parsed) ? null : parsed;
}

function toDuration(durationMs: number | undefined): number | null {
  if (typeof durationMs !== "number" || !Number.isFinite(durationMs)) return null;
  return Math.max(0, durationMs);
}

type Group = { unit: CountdownUnit; value: number };

/** Splits a remainder into unit groups, rolling everything above `maxUnit` up. */
function splitRemaining(ms: number, maxUnit: CountdownUnit): Group[] {
  const total = Math.max(0, Math.ceil(ms / MS_SECOND));
  const seconds = total % 60;
  if (maxUnit === "seconds") return [{ unit: "seconds", value: total }];
  if (maxUnit === "minutes") {
    return [
      { unit: "minutes", value: Math.floor(total / 60) },
      { unit: "seconds", value: seconds },
    ];
  }
  if (maxUnit === "hours") {
    return [
      { unit: "hours", value: Math.floor(total / 3600) },
      { unit: "minutes", value: Math.floor(total / 60) % 60 },
      { unit: "seconds", value: seconds },
    ];
  }
  return [
    { unit: "days", value: Math.floor(total / 86400) },
    { unit: "hours", value: Math.floor(total / 3600) % 24 },
    { unit: "minutes", value: Math.floor(total / 60) % 60 },
    { unit: "seconds", value: seconds },
  ];
}

/** Drops empty groups off the FRONT only, never below the last two. */
function trimLeading(groups: Group[], hide: boolean): Group[] {
  if (!hide) return groups;
  let start = 0;
  while (start < groups.length - 2 && groups[start].value === 0) start += 1;
  return groups.slice(start);
}

/**
 * How wide an announcement bucket should be at a given remainder. Wider buckets
 * further out mean a multi-day countdown speaks once an hour, not 86,400 times.
 */
function bucketFor(ms: number): number {
  if (ms <= FINAL_SECONDS_MS) return MS_SECOND;
  if (ms < MS_MINUTE) return 10 * MS_SECOND;
  if (ms < MS_HOUR) return MS_MINUTE;
  if (ms < MS_DAY) return 15 * MS_MINUTE;
  return MS_HOUR;
}

/**
 * Snaps a remainder to its bucket. The final seconds round UP so the spoken
 * value matches the digits on screen; coarser buckets round DOWN and are
 * introduced with "about", because a countdown must never over-promise time.
 */
function coarsen(ms: number): { ms: number; approximate: boolean } {
  const bucket = bucketFor(ms);
  if (bucket === MS_SECOND) return { ms: Math.ceil(ms / bucket) * bucket, approximate: false };
  return { ms: Math.floor(ms / bucket) * bucket, approximate: true };
}

/** Spells a remainder in words, using the largest two non-empty units. */
function spellDuration(ms: number, maxUnit: CountdownUnit): string {
  const parts = splitRemaining(ms, maxUnit).filter((group) => group.value > 0);
  if (parts.length === 0) return "less than a second";
  return parts
    .slice(0, 2)
    .map((group) => {
      const word = group.value === 1 ? UNIT_WORD[group.unit].one : UNIT_WORD[group.unit].many;
      return `${group.value} ${word}`;
    })
    .join(", ");
}

/**
 * The fraction-remaining dial. Decorative and `aria-hidden`: the remainder is
 * already carried by the digits and by the sr-only sentence. Its RESTING dash
 * offset is the true value, so `motion-reduce:transition-none` lands on the
 * correct geometry instead of an empty ring.
 */
function Dial({ done, fraction }: { done: boolean; fraction: number }) {
  return (
    <svg
      aria-hidden="true"
      className="block size-[var(--mq-dial,40px)] shrink-0 [rotate:-90deg]"
      focusable="false"
      viewBox="0 0 44 44"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="[stroke:var(--mq-track,#d9d6cd)] forced-colors:[stroke:GrayText]"
        cx={22}
        cy={22}
        fill="none"
        r={18}
        strokeWidth={4}
      />
      <circle
        className={cn(
          "[stroke:var(--mq-arc,#2f4bd0)]",
          done && "[stroke:var(--mq-done,#14653b)]",
          "[stroke-dashoffset:var(--mq-offset,0)]",
          "transition-[stroke-dashoffset] duration-[280ms] ease-linear motion-reduce:transition-none",
          "forced-colors:[stroke:Highlight]",
        )}
        cx={22}
        cy={22}
        fill="none"
        pathLength={1}
        r={18}
        strokeDasharray="1"
        strokeLinecap="round"
        strokeWidth={4}
        style={{ "--mq-offset": round3(1 - clamp01(fraction)) } as React.CSSProperties}
      />
    </svg>
  );
}

export type CountdownTimerProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-atomic" | "aria-live" | "children" | "role"
> &
  Omit<VariantProps<typeof countdownVariants>, "hasControls" | "size" | "variant"> & {
    /**
     * The instant to count down to: epoch milliseconds, or an ISO string that
     * CARRIES AN OFFSET (`...Z` / `...+02:00`) so a statically rendered server
     * and the browser resolve it identically. Takes precedence over `durationMs`.
     */
    target?: string | number;
    /**
     * A fixed span counted from the moment the component mounts. Unlike
     * `target` this is fully deterministic at render time, so the very first
     * server-rendered frame already shows the true digits.
     */
    durationMs?: number;
    /** Full span the dial represents in `target` mode; `durationMs` supplies it otherwise. */
    spanMs?: number;
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: Size;
    /** Visible caption above the digits. A string also names the timer. */
    label?: React.ReactNode;
    /** Largest unit shown; everything above it rolls into it. Defaults to days. */
    maxUnit?: CountdownUnit;
    /** Suppress leading groups that are still empty. Never trims below two. */
    hideLeadingZeros?: boolean;
    /** Draw the fraction-remaining dial when a span is known. Defaults to true. */
    showDial?: boolean;
    /** Render real pause / resume buttons beneath the readout. */
    controls?: boolean;
    /** Visible completed message; a string also becomes the announced one. */
    completeLabel?: React.ReactNode;
    /** Fired once, from the interval callback, when the remainder reaches zero. */
    onComplete?: () => void;
    /** Freezes the readout, disables the controls and fades the panel. */
    disabled?: boolean;
    /** Live-region policy. `off` silences the sr-only sentence entirely. */
    announce?: "polite" | "off";
  };

export function CountdownTimer({
  "aria-label": ariaLabel,
  announce = "polite",
  className,
  completeLabel,
  controls = false,
  disabled = false,
  durationMs,
  hideLeadingZeros = true,
  label,
  material = "adaptive",
  maxUnit = "days",
  onComplete,
  showDial = true,
  size = "md",
  spanMs,
  target,
  variant = "default",
  ...props
}: CountdownTimerProps) {
  const targetEpoch = React.useMemo(() => toEpoch(target), [target]);
  const startMs = React.useMemo(() => toDuration(durationMs), [durationMs]);

  /**
   * Deterministic initial state. In duration mode the full span is already
   * known, so server and client agree on the first frame. In target mode the
   * remainder is unknowable without a clock, so it stays `null` (a placeholder
   * readout) until the effect below takes the first reading.
   */
  const [remaining, setRemaining] = React.useState<number | null>(
    targetEpoch === null ? startMs : null,
  );
  const [running, setRunning] = React.useState(true);

  const deadlineRef = React.useRef<number | null>(null);
  const remainingRef = React.useRef<number | null>(targetEpoch === null ? startMs : null);
  const doneRef = React.useRef(false);

  // Re-arm when the countdown is pointed somewhere new. Ref writes only: this
  // effect body never calls setState, and the ticking effect's first scheduled
  // read publishes the new value a frame later.
  React.useEffect(() => {
    doneRef.current = false;
    deadlineRef.current = null;
    remainingRef.current = targetEpoch === null ? startMs : null;
  }, [startMs, targetEpoch]);

  React.useEffect(() => {
    if (disabled || !running) return;
    if (targetEpoch === null && startMs === null) return;

    // FIRST clock reading -- inside the effect, never during render.
    if (targetEpoch !== null) {
      deadlineRef.current = targetEpoch;
    } else {
      deadlineRef.current = Date.now() + (remainingRef.current ?? startMs ?? 0);
    }

    // A holder object rather than a `let` the callback reassigns, so nothing in
    // this closure trips the compiler's "reassigned after render" rule.
    const timers = { kick: 0, interval: 0 };

    const read = () => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      const left = Math.max(0, deadline - Date.now());
      remainingRef.current = left;
      // setState from a scheduled callback, which is exactly where it belongs.
      setRemaining(left);
      if (left > 0) return;
      window.clearInterval(timers.interval);
      if (doneRef.current) return;
      doneRef.current = true;
      onComplete?.();
    };

    timers.kick = window.setTimeout(read, 0);
    timers.interval = window.setInterval(read, TICK_MS);

    return () => {
      window.clearTimeout(timers.kick);
      window.clearInterval(timers.interval);
    };
  }, [disabled, onComplete, running, startMs, targetEpoch]);

  const status: CountdownStatus = disabled
    ? "disabled"
    : remaining === null
      ? "pending"
      : remaining <= 0
        ? "complete"
        : running
          ? "running"
          : "paused";

  const isPending = status === "pending";
  const isComplete = status === "complete";

  const groups = trimLeading(
    splitRemaining(remaining ?? 0, maxUnit),
    hideLeadingZeros && !isPending,
  );

  const span = targetEpoch === null ? startMs : toDuration(spanMs);
  const fraction =
    showDial && span !== null && span > 0 && remaining !== null
      ? clamp01(remaining / span)
      : null;

  const accessibleName = ariaLabel ?? (typeof label === "string" ? label : "Countdown timer");
  const completeText = typeof completeLabel === "string" ? completeLabel : STATUS_WORD.complete;
  const coarse = coarsen(remaining ?? 0);

  /**
   * The ONLY text inside the live region. It is derived from the COARSENED
   * remainder, so between boundaries it is byte-identical, the DOM node never
   * changes and the region is never re-announced -- while the digits below keep
   * ticking every second inside their aria-hidden layer.
   */
  const sentence = isPending
    ? `${accessibleName}: starting.`
    : status === "disabled"
      ? `${accessibleName}: unavailable.`
      : isComplete
        ? `${accessibleName}: ${completeText}.`
        : `${accessibleName}: ${status === "paused" ? "paused, " : ""}${
            coarse.approximate ? "about " : ""
          }${spellDuration(coarse.ms, maxUnit)} remaining.`;

  const StatusIcon = STATUS_ICON[status];

  return (
    <>
      {/*
        `href` + `precedence` so React 19 hoists this and deduplicates it: a bare
        <style> would emit one identical copy per timer on the page.
      */}
      <style href="mq-countdown-timer" precedence="medium">
        {COUNTDOWN_KEYFRAMES}
      </style>
      <div
        {...props}
        className={cn(countdownVariants({ hasControls: controls, size, variant }), className)}
        data-material={material}
        data-status={status}
      >
        {/*
          The readout. `role="timer"` with a POLITE, atomic live region whose
          only contributed text is the coarse sentence -- the digits beneath it
          are aria-hidden, so a per-second repaint says nothing at all.
        */}
        <div
          aria-atomic={announce === "off" ? undefined : true}
          aria-busy={isPending || undefined}
          aria-label={accessibleName}
          aria-live={announce === "off" ? "off" : "polite"}
          className="flex flex-col gap-[var(--mq-gap,12px)]"
          data-countdown-readout=""
          role="timer"
        >
          <span className={SR_ONLY}>{sentence}</span>

          <div aria-hidden="true" className="flex items-center gap-[10px]">
            {fraction !== null ? <Dial done={isComplete} fraction={fraction} /> : null}
            <div className="flex min-w-0 flex-col gap-[4px]">
              {label != null ? (
                <span className="text-[length:var(--mq-unit,10px)] leading-tight font-bold tracking-[0.12em] text-[color:var(--mq-muted,#54544c)] uppercase forced-colors:text-[CanvasText]">
                  {label}
                </span>
              ) : null}
              {/*
                Status chip: a glyph, a word, and -- once the clock has finished
                -- a plate the running state does not have. Three carriers, so
                the state survives without perceiving a single hue.
              */}
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-[6px] text-[11px] leading-none font-bold",
                  "text-[color:var(--mq-text,#141412)] forced-colors:text-[CanvasText]",
                  isComplete &&
                    "rounded-full border border-[var(--mq-done,#14653b)] px-[8px] py-[3px] text-[color:var(--mq-done,#14653b)] forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]",
                  "[&>svg]:size-[14px]",
                )}
                data-countdown-status=""
              >
                <StatusIcon />
                {isComplete ? completeText : STATUS_WORD[status]}
              </span>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="flex flex-wrap items-start gap-[6px]"
            data-countdown-groups=""
          >
            {groups.map((group, index) => (
              <React.Fragment key={group.unit}>
                {index > 0 ? (
                  <span
                    className={cn(
                      "grid h-[var(--mq-tile-h,68px)] place-items-center",
                      "text-[length:var(--mq-sep,20px)] leading-none font-black",
                      "text-[color:var(--mq-muted,#54544c)] forced-colors:text-[CanvasText]",
                      // The clock blink, on decorative punctuation rather than
                      // on any glyph that carries a value. Its resting state is
                      // fully opaque, so reduced motion simply leaves it lit.
                      status === "running" &&
                        "animate-[mq-countdown-beat_1s_ease-in-out_infinite] motion-reduce:animate-none",
                    )}
                    data-countdown-separator=""
                  >
                    :
                  </span>
                ) : null}
                <span className="flex flex-col items-center" data-countdown-group={group.unit}>
                  <span className={tileVariants()}>
                    {/*
                      Keyed by its own value, so a group re-mounts -- and the
                      split-flap roll replays -- only when that group actually
                      changes. The keyframe ENDS at the resting state, so reduced
                      motion renders the right digits immediately and still.
                    */}
                    <span
                      key={isPending ? "pending" : group.value}
                      className={cn(
                        "relative z-10 block text-[length:var(--mq-digit,32px)] leading-none font-extrabold tracking-[-0.03em] tabular-nums",
                        "text-[color:var(--mq-text,#141412)] forced-colors:text-[CanvasText]",
                        "animate-[mq-countdown-roll_300ms_cubic-bezier(0.22,1,0.36,1)]",
                        "motion-reduce:animate-none",
                      )}
                    >
                      {isPending ? "––" : String(group.value).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="mt-[6px] block text-[length:var(--mq-unit,10px)] leading-none font-bold tracking-[0.16em] text-[color:var(--mq-muted,#54544c)] uppercase forced-colors:text-[CanvasText]">
                    {UNIT_WORD[group.unit].plate}
                  </span>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {controls ? (
          // `inert` as well as `disabled`: belt and braces, so a frozen panel can
          // never be reached with the keyboard.
          <div
            className="flex flex-wrap items-center gap-[8px]"
            data-countdown-controls=""
            inert={disabled || undefined}
          >
            <button
              className={controlVariants()}
              disabled={disabled || isComplete || isPending}
              onClick={() => setRunning((current) => !current)}
              type="button"
            >
              {running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              {running ? "Pause countdown" : "Resume countdown"}
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export type CountdownTimerVariantProps = VariantProps<typeof countdownVariants>;

export { controlVariants, countdownVariants, tileVariants };
