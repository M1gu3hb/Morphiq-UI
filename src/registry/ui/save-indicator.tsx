"use client";

import * as React from "react";
import { Check, CircleAlert, CloudUpload, LoaderCircle, RefreshCw, type LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Save Indicator
 *
 * The autosave chip that sits next to a document title: `idle` / `saving` /
 * `saved` / `error`, each with its own glyph, its own real text label, and an
 * optional relative timestamp ("Saved · 2 minutes ago"). It is driven entirely
 * by props — `status` plus an optional `savedAt` — so it is a pure function of
 * what the editor already knows.
 *
 * This is a material-AGNOSTIC component: it ships a single style built on the
 * adaptive light+dark token vocabulary. `material` is accepted only for catalog
 * parity and is reflected on `data-material`; it drives no separate recipe.
 *
 * Self-contained by design: every local custom property carries a literal
 * fallback, no class comes from a global stylesheet, and the keyframes travel
 * with the component through React 19's deduplicated `<style href>` hoisting.
 *
 * ---------------------------------------------------------------- SSR / SSG
 *
 * A relative timestamp is the classic hydration bug: `Date.now()` on the server
 * during a static build and `Date.now()` in the browser are different numbers,
 * so "2 minutes ago" rendered on the server and "3 hours ago" rendered on the
 * client mismatch and React throws the tree away. This component therefore
 * NEVER reads the clock during render:
 *
 *   - `savedAt` is a prop (epoch ms or a `Date`), converted with `getTime()`,
 *     which is deterministic.
 *   - The first render shows `savedAtLabel` — a caller-formatted absolute
 *     string such as "14:32" — or nothing at all. Both are deterministic.
 *   - The relative phrase is computed for the first time inside an effect, in a
 *     `setTimeout(…, 0)` callback, and refreshed by a `setInterval`. Both timers
 *     are cleared in the effect cleanup, so nothing survives unmount.
 *   - State is only replaced when the phrase actually changes, so an unstable
 *     `formatRelativeTime` cannot drive a render loop.
 *
 * ------------------------------------------------------------ Accessibility
 *
 * - The chip is a live region: `role="status"` + `aria-live="polite"` for the
 *   calm states, escalating to `role="alert"` + `aria-live="assertive"` for
 *   `error`. Both are `aria-atomic` so the label and the timestamp are announced
 *   as one sentence rather than as a stray fragment. `urgency` overrides the
 *   mapping (including `"off"` for a chip that must not interrupt).
 * - `aria-busy` is set while saving.
 * - STATE IS NEVER COLOUR ALONE. It is carried by (1) the visible label
 *   ("Saving…", "Saved", "Could not save"), (2) an `sr-only` state word
 *   ("Error: ", "Success: ") so the meaning survives a caller's custom label,
 *   (3) a distinct icon SHAPE per state, and (4) a shape/weight difference on
 *   the chip itself — the error state squares off the icon well and thickens
 *   the border. The glyph is decorative and `aria-hidden`.
 * - Reduced motion drops the spinner's rotation and the icon's pop, but the
 *   busy state is still carried by the label and by `aria-busy`, and the pop's
 *   resting end state is the fully rendered icon.
 * - Forced colours keep the chip's bounds with a system border, clear the
 *   gradient wash and the shadows, and repaint every glyph and the focus ring
 *   to system colours.
 * - Contrast: label and timestamp clear 4.5:1 against the chip in both colour
 *   schemes and in all four states (measured 5.8:1 – 10.4:1).
 *
 * ------------------------------------------------------------ Theming knobs
 *
 *   --mq-body      chip surface
 *   --mq-lit       top gradient stop
 *   --mq-brd       border colour        --mq-brd-w  border width
 *   --mq-text      label colour
 *   --mq-accent    glyph, timestamp and retry-button colour
 *   --mq-icon-bg   icon well surface
 *   --mq-hover     retry-button hover wash
 *   --mq-shadow    chip depth
 *   --mq-ring      focus ring colour
 */

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

export type SaveIndicatorStatus = "idle" | "saving" | "saved" | "error";
export type SaveIndicatorUrgency = "auto" | "polite" | "assertive" | "off";
type SaveIndicatorSize = "sm" | "md" | "lg";

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

/**
 * Focus ring for the retry button. Declared for real `:focus-visible` and,
 * identically, for a `data-focus="true"` attribute so the docs preview and
 * visual-regression tests can render the focused look without synthesising a
 * keyboard event.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-2 " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] " +
  "forced-colors:data-[focus=true]:outline-[Highlight]";

/** Default visible copy. Real text — this is the primary carrier of the state. */
const STATUS_LABEL: Record<SaveIndicatorStatus, string> = {
  idle: "Autosave on",
  saving: "Saving…",
  saved: "Saved",
  error: "Could not save",
};

/**
 * Semantic word spoken before the label, mirroring Alert's tone label. It names
 * the state category rather than repeating the label, so a caller who passes
 * `label="Hmm"` still ships an announcement that says what happened.
 */
const STATUS_WORD: Record<SaveIndicatorStatus, string> = {
  idle: "Idle",
  saving: "In progress",
  saved: "Success",
  error: "Error",
};

/**
 * Wording placed in front of the relative phrase. `saved` reads "Saved ·
 * 2 minutes ago" on its own; the other states need "last saved" or the phrase
 * would be read as the age of the *current* state.
 */
const TIMESTAMP_PREFIX: Record<SaveIndicatorStatus, string> = {
  idle: "last saved ",
  saving: "",
  saved: "",
  error: "last saved ",
};

/**
 * A distinct SHAPE per state, not just a distinct hue: a cloud with an arrow, a
 * broken ring, a bare checkmark, a circled exclamation. Always decorative — the
 * label and the sr-only state word carry the meaning.
 */
const STATUS_ICON: Record<SaveIndicatorStatus, LucideIcon> = {
  idle: CloudUpload,
  saving: LoaderCircle,
  saved: Check,
  error: CircleAlert,
};

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
/** Below this the phrase is "just now", so second-by-second churn is avoided. */
const JUST_NOW_MS = 45_000;
/** How often the relative phrase is recomputed once the component is mounted. */
const REFRESH_INTERVAL_MS = 15_000;
/** ECMAScript's maximum representable time value; beyond it `Date` is invalid. */
const MAX_TIME_MS = 8_640_000_000_000_000;

/**
 * Keyframes travel with the component. React 19 hoists this and deduplicates it
 * by `href`, so a page full of save chips emits one rule rather than one each.
 *
 * Both animations drive STANDALONE properties (`rotate`, `scale`, `opacity`),
 * which is what Tailwind v4 writes its own utilities to, so a caller's
 * `transform` can never fight them. Every resting end state is the final visual
 * state — a full turn is visually identical to no turn, and the pop ends at
 * `opacity:1; scale:1` — so `motion-reduce:animate-none` leaves the chip fully
 * rendered rather than mid-fade.
 */
const SAVE_INDICATOR_KEYFRAMES =
  "@keyframes mq-save-spin{from{rotate:0deg}to{rotate:360deg}}" +
  "@keyframes mq-save-pop{0%{opacity:0;scale:0.72}60%{opacity:1;scale:1.06}100%{opacity:1;scale:1}}";

function SaveIndicatorKeyframes() {
  return (
    <style href="mq-save-indicator" precedence="medium">
      {SAVE_INDICATOR_KEYFRAMES}
    </style>
  );
}

const saveIndicatorVariants = cva(
  [
    "relative isolate inline-flex max-w-full items-center align-middle",
    "gap-[var(--mq-gap,8px)] rounded-[var(--mq-radius,999px)]",
    "px-[var(--mq-pad-x,11px)] py-[var(--mq-pad-y,6px)]",
    // Border written as explicit properties rather than `border-*` utilities:
    // the width is a token that the error state thickens, and splitting width,
    // style and colour means none of the three can be dropped by a merge.
    "[border-style:solid] [border-width:var(--mq-brd-w,1px)]",
    "[border-color:var(--mq-brd,rgba(23,24,23,0.14))]",
    "bg-[var(--mq-body,#f4f3ef)]",
    // The wash is an explicit property, not a `bg-*` utility: a colour and a
    // gradient through the same utility land in one `tailwind-merge` group where
    // one silently drops the other.
    "[background-image:linear-gradient(180deg,var(--mq-lit,rgba(255,255,255,0.60)),rgba(255,255,255,0))]",
    "shadow-[var(--mq-shadow,0_1px_2px_rgba(20,20,18,0.10))]",
    "[--mq-shadow:0_1px_2px_rgba(20,20,18,0.10)] dark:[--mq-shadow:0_1px_2px_rgba(0,0,0,0.45)]",
    "text-[color:var(--mq-text,#3f3e38)]",
    // The three properties that really do change as `status` changes, and only
    // those — a transition naming a property nothing animates is dead weight.
    "transition-[background-color,border-color,color] duration-200 ease-out",
    "motion-reduce:transition-none",
    // Forced colours already force colour/background-color/border-color, but
    // NOT background-image or box-shadow, so the wash and the depth have to be
    // cleared by hand or they would sit on a system-coloured surface.
    "forced-colors:[--mq-brd:CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
    "forced-colors:shadow-none forced-colors:[background-image:none]",
  ].join(" "),
  {
    variants: {
      status: {
        idle: [
          "[--mq-body:#f4f3ef] [--mq-lit:rgba(255,255,255,0.60)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-brd-w:1px]",
          "[--mq-text:#3f3e38] [--mq-accent:#56554e] [--mq-icon-bg:rgba(255,255,255,0.80)]",
          "[--mq-hover:rgba(23,24,23,0.07)] [--mq-ring:#171817]",
          "dark:[--mq-body:#26262a] dark:[--mq-lit:rgba(255,255,255,0.06)] dark:[--mq-brd:rgba(255,255,255,0.18)]",
          "dark:[--mq-text:#d9d7d0] dark:[--mq-accent:#b0aea6] dark:[--mq-icon-bg:rgba(255,255,255,0.09)]",
          "dark:[--mq-hover:rgba(255,255,255,0.12)] dark:[--mq-ring:#f1efe9]",
        ].join(" "),
        saving: [
          "[--mq-body:#eef2fb] [--mq-lit:rgba(255,255,255,0.66)] [--mq-brd:rgba(31,63,122,0.26)] [--mq-brd-w:1px]",
          "[--mq-text:#1f3f7a] [--mq-accent:#2f4fa0] [--mq-icon-bg:rgba(255,255,255,0.80)]",
          "[--mq-hover:rgba(31,63,122,0.09)] [--mq-ring:#1f3f7a]",
          "dark:[--mq-body:#1c2a44] dark:[--mq-lit:rgba(255,255,255,0.07)] dark:[--mq-brd:rgba(185,208,245,0.28)]",
          "dark:[--mq-text:#b9d0f5] dark:[--mq-accent:#93b6e8] dark:[--mq-icon-bg:rgba(255,255,255,0.09)]",
          "dark:[--mq-hover:rgba(185,208,245,0.14)] dark:[--mq-ring:#b9d0f5]",
        ].join(" "),
        saved: [
          "[--mq-body:#eaf6ee] [--mq-lit:rgba(255,255,255,0.66)] [--mq-brd:rgba(21,84,47,0.26)] [--mq-brd-w:1px]",
          "[--mq-text:#15542f] [--mq-accent:#1c6b3d] [--mq-icon-bg:rgba(255,255,255,0.80)]",
          "[--mq-hover:rgba(21,84,47,0.09)] [--mq-ring:#15542f]",
          "dark:[--mq-body:#14301f] dark:[--mq-lit:rgba(255,255,255,0.07)] dark:[--mq-brd:rgba(169,226,189,0.26)]",
          "dark:[--mq-text:#a9e2bd] dark:[--mq-accent:#86c9a0] dark:[--mq-icon-bg:rgba(255,255,255,0.09)]",
          "dark:[--mq-hover:rgba(169,226,189,0.14)] dark:[--mq-ring:#a9e2bd]",
        ].join(" "),
        // The only state that also changes SHAPE: a thicker border here and a
        // squared-off icon well below, so "something is wrong" is legible to a
        // reader who cannot separate the red from the green.
        error: [
          "[--mq-body:#fdecea] [--mq-lit:rgba(255,255,255,0.62)] [--mq-brd:rgba(122,31,31,0.34)] [--mq-brd-w:2px]",
          "[--mq-text:#7a1f1f] [--mq-accent:#9c2820] [--mq-icon-bg:rgba(255,255,255,0.80)]",
          "[--mq-hover:rgba(122,31,31,0.10)] [--mq-ring:#7a1f1f]",
          "dark:[--mq-body:#3a1618] dark:[--mq-lit:rgba(255,255,255,0.07)] dark:[--mq-brd:rgba(246,189,185,0.38)]",
          "dark:[--mq-text:#f6bdb9] dark:[--mq-accent:#e59a95] dark:[--mq-icon-bg:rgba(255,255,255,0.09)]",
          "dark:[--mq-hover:rgba(246,189,185,0.16)] dark:[--mq-ring:#f6bdb9]",
        ].join(" "),
      },
      size: {
        sm: [
          "[--mq-gap:6px] [--mq-pad-x:8px] [--mq-pad-y:4px] [--mq-radius:999px]",
          "[--mq-icon-box:18px] [--mq-glyph:12px] [--mq-label:11px] [--mq-meta:10px]",
          "[--mq-btn-x:7px] [--mq-btn-y:2px] [--mq-btn-glyph:11px]",
        ].join(" "),
        md: [
          "[--mq-gap:8px] [--mq-pad-x:11px] [--mq-pad-y:6px] [--mq-radius:999px]",
          "[--mq-icon-box:22px] [--mq-glyph:14px] [--mq-label:12px] [--mq-meta:11px]",
          "[--mq-btn-x:9px] [--mq-btn-y:3px] [--mq-btn-glyph:12px]",
        ].join(" "),
        lg: [
          "[--mq-gap:10px] [--mq-pad-x:14px] [--mq-pad-y:8px] [--mq-radius:999px]",
          "[--mq-icon-box:26px] [--mq-glyph:16px] [--mq-label:13px] [--mq-meta:12px]",
          "[--mq-btn-x:11px] [--mq-btn-y:4px] [--mq-btn-glyph:13px]",
        ].join(" "),
      },
      // A save chip has one composition. `default` exists so the registry can
      // list a variant and the preview can coerce an incoming value.
      variant: { default: "" },
    },
    defaultVariants: { status: "idle", size: "md", variant: "default" },
  },
);

/**
 * Whether a node would actually put text on the page.
 *
 * A live region is announced by its contents, so a `label` that renders to
 * nothing — `""` from a missed i18n lookup, or the `false` a `cond && text`
 * collapses to — must not replace the default word and leave the region silent.
 */
function rendersText(node: React.ReactNode): boolean {
  if (node == null || typeof node === "boolean") return false;
  if (typeof node === "string") return node.trim() !== "";
  return true;
}

/**
 * Normalises `savedAt` into epoch milliseconds. `getTime()` on a caller-supplied
 * `Date` is deterministic, so this is safe to run during render; reading the
 * *current* time is not, and never happens here.
 */
function toEpochMs(savedAt: number | Date | null | undefined): number | null {
  if (savedAt === null || savedAt === undefined) return null;
  const ms = savedAt instanceof Date ? savedAt.getTime() : savedAt;
  if (!Number.isFinite(ms) || Math.abs(ms) > MAX_TIME_MS) return null;
  return ms;
}

/** Default English relative phrase. Replace it with `formatRelativeTime`. */
function formatElapsed(elapsedMs: number): string {
  if (!Number.isFinite(elapsedMs) || elapsedMs < JUST_NOW_MS) return "just now";
  if (elapsedMs < HOUR_MS) {
    const minutes = Math.max(1, Math.round(elapsedMs / MINUTE_MS));
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (elapsedMs < DAY_MS) {
    const hours = Math.max(1, Math.round(elapsedMs / HOUR_MS));
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.max(1, Math.round(elapsedMs / DAY_MS));
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function resolveUrgency(
  status: SaveIndicatorStatus,
  urgency: SaveIndicatorUrgency,
): Exclude<SaveIndicatorUrgency, "auto"> {
  if (urgency !== "auto") return urgency;
  return status === "error" ? "assertive" : "polite";
}

/** The decorative state glyph. Only `saving` spins, and only if motion is allowed. */
function StatusGlyph({ status }: { status: SaveIndicatorStatus }) {
  const Icon = STATUS_ICON[status];
  return (
    <Icon
      className={
        status === "saving"
          ? "animate-[mq-save-spin_900ms_linear_infinite] motion-reduce:animate-none"
          : undefined
      }
    />
  );
}

/** The relative phrase together with the timestamp it was computed against. */
type RelativeReading = { at: number; text: string };

export type SaveIndicatorProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-atomic" | "aria-busy" | "aria-live" | "children" | "color" | "role"
> & {
  /** Which autosave state to show. Drives the label, the glyph and the shape. */
  status?: SaveIndicatorStatus;
  size?: SaveIndicatorSize;
  variant?: "default";
  /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
  material?: MaterialSlug;
  /** Overrides the default visible label. Empty content falls back to the default. */
  label?: React.ReactNode;
  /** Overrides the `sr-only` state word ("Error", "Success", …) when localising. */
  statusLabel?: React.ReactNode;
  /** When the document was last saved: epoch milliseconds or a `Date`. */
  savedAt?: number | Date | null;
  /**
   * Deterministic fallback shown before the effect computes the relative phrase
   * — typically a caller-formatted absolute time such as "14:32". Rendered on
   * the server and with JavaScript disabled; leave it out to render nothing.
   */
  savedAtLabel?: string;
  /** Hides the timestamp while keeping the state label. Defaults to `true`. */
  showTimestamp?: boolean;
  /**
   * Formats the elapsed milliseconds. Keep it stable (module scope or memoised):
   * a new function identity restarts the refresh timers.
   */
  formatRelativeTime?: (elapsedMs: number) => string;
  /** Adds a real retry button to the error state. Omit it and none is rendered. */
  onRetry?: () => void;
  /** Accessible name and visible text of the retry button. */
  retryLabel?: React.ReactNode;
  /** Live-region policy; `auto` escalates only the error state. */
  urgency?: SaveIndicatorUrgency;
  /** Custom decorative icon. Pass `false` to remove the default state glyph. */
  icon?: React.ReactNode;
  /** Forces the focused look on the retry button, for docs and visual tests. */
  "data-focus"?: "true" | "false";
  iconClassName?: string;
  labelClassName?: string;
  retryClassName?: string;
};

export function SaveIndicator({
  className,
  "data-focus": dataFocus,
  formatRelativeTime = formatElapsed,
  icon,
  iconClassName,
  label,
  labelClassName,
  material = "adaptive",
  onRetry,
  retryClassName,
  retryLabel = "Retry",
  savedAt,
  savedAtLabel,
  showTimestamp = true,
  size = "md",
  status = "idle",
  statusLabel,
  urgency = "auto",
  variant = "default",
  ...props
}: SaveIndicatorProps) {
  const savedAtMs = toEpochMs(savedAt);
  const [reading, setReading] = React.useState<RelativeReading | null>(null);

  /**
   * The only place in this component that reads the clock, and it is an effect —
   * never render. The first phrase lands from a `setTimeout(…, 0)` callback
   * rather than from the effect body, because calling `setState` synchronously
   * in an effect is exactly what `react-hooks/set-state-in-effect` forbids; a
   * timer callback is a subscription, and setting state from one is correct.
   *
   * The functional update returns the previous object when the phrase has not
   * changed, so an inline `formatRelativeTime` — which re-runs this effect on
   * every render — still cannot drive a render loop.
   */
  React.useEffect(() => {
    if (savedAtMs === null) return;
    const update = () => {
      const text = formatRelativeTime(Date.now() - savedAtMs);
      setReading((previous) =>
        previous !== null && previous.at === savedAtMs && previous.text === text
          ? previous
          : { at: savedAtMs, text },
      );
    };
    const firstRun = window.setTimeout(update, 0);
    const refresh = window.setInterval(update, REFRESH_INTERVAL_MS);
    return () => {
      window.clearTimeout(firstRun);
      window.clearInterval(refresh);
    };
  }, [formatRelativeTime, savedAtMs]);

  const resolvedUrgency = resolveUrgency(status, urgency);
  const liveRole =
    resolvedUrgency === "assertive" ? "alert" : resolvedUrgency === "polite" ? "status" : undefined;

  const shownLabel = rendersText(label) ? label : STATUS_LABEL[status];
  const shownStatusWord = rendersText(statusLabel) ? statusLabel : STATUS_WORD[status];
  const resolvedIcon = icon === undefined ? <StatusGlyph status={status} /> : icon;

  // A phrase computed against an older `savedAt` is never shown: it is tagged
  // with the timestamp it belongs to and discarded the moment that changes.
  const relativeText = reading !== null && reading.at === savedAtMs ? reading.text : null;
  const timestampText =
    showTimestamp && status !== "saving" ? (relativeText ?? savedAtLabel ?? null) : null;
  const timestampIso = savedAtMs === null ? undefined : new Date(savedAtMs).toISOString();
  const timestampPrefix = TIMESTAMP_PREFIX[status];

  // The retry control stays mounted through the retry itself so the chip does
  // not jump width mid-flight — but while the save is in flight it is `inert`,
  // which takes it out of the tab order AND out of the accessibility tree, so a
  // keyboard user can never reach a button that would do nothing.
  const hasRetry = onRetry !== undefined && (status === "error" || status === "saving");
  const retryUnavailable = status !== "error";

  return (
    <>
      <SaveIndicatorKeyframes />
      {/* `props` is spread first on purpose: the role, live-region and data-*
          attributes below are derived from `status` and must win over anything
          a caller passes through. */}
      <div
        {...props}
        aria-atomic={liveRole ? true : undefined}
        aria-busy={status === "saving" || undefined}
        aria-live={liveRole ? resolvedUrgency : undefined}
        className={cn(saveIndicatorVariants({ status, size, variant }), className)}
        data-material={material}
        data-status={status}
        data-urgency={resolvedUrgency}
        role={liveRole}
      >
        {/* The state in words, first in the announcement. Real text, not an
            aria-label: a live region is announced by what it contains. */}
        <span className={SR_ONLY} data-save-status-word="">
          {shownStatusWord}:{" "}
        </span>

        {resolvedIcon ? (
          <span
            aria-hidden="true"
            // Remounting on `status` replays the pop, so a state change is felt
            // as well as read. The resting end state is the fully drawn icon.
            key={status}
            className={cn(
              "relative grid shrink-0 place-items-center",
              "size-[var(--mq-icon-box,22px)]",
              // The error state is the one that squares off: a shape difference
              // that survives a reader who cannot separate the hues.
              status === "error" ? "rounded-[7px]" : "rounded-full",
              "bg-[var(--mq-icon-bg,rgba(255,255,255,0.80))]",
              "text-[color:var(--mq-accent,#56554e)]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
              "[&>svg]:size-[var(--mq-glyph,14px)]",
              "animate-[mq-save-pop_320ms_cubic-bezier(0.34,1.56,0.64,1)_both]",
              "motion-reduce:animate-none",
              "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
              "forced-colors:[border:1px_solid_CanvasText]",
              iconClassName,
            )}
            data-save-icon=""
          >
            {resolvedIcon}
          </span>
        ) : null}

        <span className="flex min-w-0 flex-wrap items-baseline gap-x-[5px] gap-y-[1px]">
          <span
            className={cn(
              "text-[length:var(--mq-label,12px)] leading-[1.35] font-bold tracking-[-0.01em]",
              "text-[color:var(--mq-text,#3f3e38)] forced-colors:text-[CanvasText]",
              labelClassName,
            )}
            data-save-label=""
          >
            {shownLabel}
          </span>
          {timestampText ? (
            <span
              className={cn(
                "text-[length:var(--mq-meta,11px)] leading-[1.4] font-medium",
                "text-[color:var(--mq-accent,#56554e)] forced-colors:text-[CanvasText]",
              )}
              data-save-timestamp=""
            >
              <span aria-hidden="true">·</span> {timestampPrefix}
              <time dateTime={timestampIso}>{timestampText}</time>
            </span>
          ) : null}
        </span>

        {hasRetry ? (
          <button
            className={cn(
              "inline-flex shrink-0 cursor-pointer items-center gap-[4px] rounded-full",
              "px-[var(--mq-btn-x,9px)] py-[var(--mq-btn-y,3px)]",
              "[border-style:solid] [border-width:1px] [border-color:var(--mq-accent,#9c2820)]",
              "bg-transparent text-[color:var(--mq-text,#7a1f1f)]",
              "text-[length:var(--mq-meta,11px)] leading-[1.4] font-bold",
              "[&>svg]:size-[var(--mq-btn-glyph,12px)]",
              "hover:bg-[var(--mq-hover,rgba(122,31,31,0.10))]",
              "hover:shadow-[0_1px_2px_rgba(20,20,18,0.18)]",
              // `translate`, not `transform`: Tailwind v4 writes `translate-*`
              // utilities to the standalone `translate` property, so the
              // transition has to name it or the press would snap.
              "active:translate-y-[1px] active:shadow-none",
              "transition-[translate,box-shadow,background-color] duration-150 ease-out",
              "motion-reduce:transition-none motion-reduce:active:translate-y-0",
              "disabled:cursor-not-allowed disabled:opacity-45",
              FOCUS_RING,
              "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
              "forced-colors:[border-color:CanvasText] forced-colors:shadow-none",
              retryClassName,
            )}
            data-focus={dataFocus}
            data-save-retry=""
            disabled={retryUnavailable}
            inert={retryUnavailable || undefined}
            onClick={onRetry}
            type="button"
          >
            <RefreshCw aria-hidden="true" />
            {retryLabel}
          </button>
        ) : null}
      </div>
    </>
  );
}

export { saveIndicatorVariants };
