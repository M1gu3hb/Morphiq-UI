"use client";

import * as React from "react";
import {
  Activity,
  CircleCheck,
  CircleMinus,
  CircleX,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Status Summary
 *
 * A statuspage-style panel: one headline state for the whole system, then a real
 * `<ul>` of individual services, each with its own state, an optional detail line
 * and an optional link to a status detail page.
 *
 * Self-contained by design. Every material recipe lives in this file, every
 * custom-property reference carries a literal fallback, no site-level variable
 * and no global class is read, and the keyframes travel with the component
 * through a React 19
 * `<style href precedence>` that is hoisted and deduplicated. Copying this file
 * plus `src/lib/cn.ts` reproduces the entire look.
 *
 * Accessibility contract — the defining rule of this component:
 *
 * - STATE IS NEVER COLOUR ALONE. Each state is carried three ways at once: the
 *   full state name as real, visible text; a decorative lucide glyph; and a
 *   decorative geometric SHAPE that differs per state (filled disc, triangle,
 *   hollow ring, diamond, bar). A reader who cannot separate the hues gets the
 *   identical information from the words and the silhouette.
 * - The headline is a REAL heading whose level is configurable, because only the
 *   host page knows the surrounding document outline.
 * - The banner is a live region: `urgency="auto"` maps every state except a
 *   major outage to `role="status"` + `aria-live="polite"`, and a major outage to
 *   `role="alert"` + `aria-live="assertive"`. Both are `aria-atomic` so the
 *   headline and its caption are announced as one sentence. `urgency` overrides
 *   that policy when the product flow knows better than the state does.
 * - The services are a real list, so assistive tech announces the count and can
 *   navigate item by item.
 * - While `loading`, the list wrapper carries `aria-busy="true"`, a veil covers
 *   the stale rows, and the list itself is `inert` so a keyboard user cannot tab
 *   into content hidden behind that veil. `disabled` inerts the list too.
 * - `prefers-reduced-motion`: every animation's resting state IS its final state,
 *   so `motion-reduce:animate-none` renders the panel fully — same headline, same
 *   rows, same states — with no movement. The busy veil stops pulsing but stays
 *   painted, and "Refreshing…" remains in the caption as words.
 * - `forced-colors`: bounds are kept with `border-[CanvasText]`, gradients and
 *   backdrop blur are cleared, glyphs and shapes repaint to `CanvasText`, and the
 *   focus ring becomes `Highlight`.
 * - Contrast: text and informative glyphs measure at or above 4.5:1 on every
 *   material, including both skeuo gradient stops, glass over a light and a dark
 *   backdrop, and both adaptive colour schemes.
 *
 * SSR / SSG safety: nothing in render reads `Date.now()`, `new Date()`, `window`
 * or storage. "Last updated" is a prop, so a statically generated page and its
 * hydrated counterpart always agree.
 *
 * Local theming knobs (each used with a literal fallback):
 *
 *   --mq-body       panel surface
 *   --mq-lit        top gradient stop (skeuo)
 *   --mq-edge       extruded bottom edge
 *   --mq-text       primary foreground
 *   --mq-muted      caption / detail foreground
 *   --mq-rule       hairline divider
 *   --mq-brd        panel border
 *   --mq-ring       focus ring colour
 *   --mq-row        service row surface
 *   --mq-row-brd    service row border
 *   --mq-row-shadow service row depth
 *   --mq-well       headline icon well
 *   --mq-veil       busy overlay
 *   --mq-tone-*     the five state colours (ok / warn / part / bad / info)
 */

export type StatusState =
  | "operational"
  | "degraded"
  | "partial"
  | "outage"
  | "maintenance";

export type StatusUrgency = "auto" | "polite" | "assertive" | "off";

export type StatusHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** One service row. `state` is echoed in words, a glyph and a shape. */
export type StatusService = {
  /** Visible service name. Also the link text when `href` is supplied. */
  name: string;
  state: StatusState;
  /** Optional second line: what is actually wrong, or a scope note. */
  detail?: React.ReactNode;
  /** When present the name becomes a real link to the service's detail page. */
  href?: string;
  /** Localised or custom replacement for the visible state wording. */
  stateLabel?: string;
};

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

/** The state name, in words. This — not the hue — is the source of truth. */
const STATE_LABEL: Record<StatusState, string> = {
  operational: "Operational",
  degraded: "Degraded performance",
  partial: "Partial outage",
  outage: "Major outage",
  maintenance: "Under maintenance",
};

/** Default headline copy per overall state; every word is overridable. */
const STATE_HEADLINE: Record<StatusState, string> = {
  operational: "All systems operational",
  degraded: "Degraded performance",
  partial: "Partial service outage",
  outage: "Major service outage",
  maintenance: "Maintenance in progress",
};

/** Decorative glyph. Always `aria-hidden`; the state is named in adjacent text. */
const STATE_ICON: Record<StatusState, LucideIcon> = {
  operational: CircleCheck,
  degraded: TriangleAlert,
  partial: CircleMinus,
  outage: CircleX,
  maintenance: Activity,
};

/**
 * The shape axis — the key accessibility move of this component.
 *
 * Five silhouettes inside one 16×16 box: a filled disc, an upright triangle, a
 * hollow ring, a diamond and a horizontal bar. They are drawn as a single path
 * each so `currentColor` and `fill-rule` are enough; no gradients, no strokes to
 * be erased by forced colours. Two rows are distinguishable at a glance without
 * perceiving a single hue.
 */
const STATE_PATH: Record<StatusState, string> = {
  operational: "M8 1.6a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8Z",
  degraded: "M8 1.3 15.4 14.7H0.6Z",
  partial:
    "M8 1.2a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 0 0 0-13.6Zm0 3.4a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8Z",
  outage: "M8 0.7 15.3 8 8 15.3 0.7 8Z",
  maintenance: "M2.2 5.9h11.6a2.1 2.1 0 0 1 0 4.2H2.2a2.1 2.1 0 0 1 0-4.2Z",
};

/**
 * Colour is the third, redundant channel. Each token is set per material so the
 * measured contrast holds on that material's surface, and forced colours flatten
 * every one of them to `CanvasText` — the words and shapes still separate them.
 */
const STATE_TONE: Record<StatusState, string> = {
  operational: "text-[color:var(--mq-tone-ok,#135f36)]",
  degraded: "text-[color:var(--mq-tone-warn,#6b4a00)]",
  partial: "text-[color:var(--mq-tone-part,#8a3d0a)]",
  outage: "text-[color:var(--mq-tone-bad,#8a1f28)]",
  maintenance: "text-[color:var(--mq-tone-info,#1e4b80)]",
};

const HEADING_TAG: Record<StatusHeadingLevel, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

/**
 * Focus ring for the only focusable things in the panel: service links.
 *
 * Declared three ways — for real `:focus-visible`, for a `data-focus="true"` on
 * the link itself, and for a `data-focus="true"` on the panel via the `group/mq`
 * marker, so a documentation surface can force the focused look without
 * synthesising a keyboard event. The panel itself is never focusable and
 * therefore never draws a ring of its own.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "group-data-[focus=true]/mq:outline-2 group-data-[focus=true]/mq:outline-offset-[3px] " +
  "group-data-[focus=true]/mq:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] " +
  "forced-colors:group-data-[focus=true]/mq:outline-[Highlight]";

/**
 * Keyframes travel with the component. Every one ends on the element's natural
 * resting style — the panel at full opacity and zero offset, a row at full
 * opacity and zero offset, the headline mark at `scale: 1` — so
 * `motion-reduce:animate-none` leaves the panel fully rendered at its END value
 * rather than stranded mid-entrance.
 */
const STATUS_KEYFRAMES =
  "@keyframes mq-status-panel{from{opacity:0;translate:0 10px}to{opacity:1;translate:0 0}}" +
  "@keyframes mq-status-row{from{opacity:0;translate:-8px 0}to{opacity:1;translate:0 0}}" +
  "@keyframes mq-status-mark{0%{scale:0.84}58%{scale:1.06}100%{scale:1}}";

function StatusKeyframes() {
  return (
    <style href="mq-status-summary" precedence="medium">
      {STATUS_KEYFRAMES}
    </style>
  );
}

const statusSummaryVariants = cva(
  [
    "group/mq relative isolate flex w-full max-w-[min(680px,100%)] flex-col overflow-hidden border",
    "gap-[var(--mq-gap,14px)] rounded-[var(--mq-radius,24px)] p-[var(--mq-pad,20px)]",
    "border-[var(--mq-brd,rgba(82,70,56,0.18))] text-[color:var(--mq-text,#2f2a24)]",
    // The panel arrives rather than appearing. Keyframes, not a transition: it is
    // mounted in its final state and a transition would have nothing to run from.
    "animate-[mq-status-panel_360ms_cubic-bezier(0.22,1.1,0.36,1)]",
    "motion-reduce:animate-none",
    "data-[state=disabled]:opacity-55 data-[state=loading]:cursor-progress",
    // Shadows, gradients and backdrop blur all vanish in forced colours, so the
    // panel would dissolve into the page without a system-coloured border.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
    "forced-colors:shadow-none forced-colors:[background-image:none] forced-colors:[backdrop-filter:none]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#ece7df)]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.72),inset_0_-5px_8px_rgba(120,80,55,0.10),0_6px_0_var(--mq-edge,#cfc4b6),0_18px_30px_rgba(90,60,45,0.16)]",
          "[--mq-body:#ece7df] [--mq-edge:#cfc4b6] [--mq-text:#2f2a24] [--mq-muted:#5a5248]",
          "[--mq-rule:rgba(82,70,56,0.20)] [--mq-brd:rgba(82,70,56,0.18)] [--mq-ring:#171817]",
          "[--mq-row:rgba(255,255,255,0.55)] [--mq-row-brd:rgba(82,70,56,0.14)]",
          "[--mq-row-shadow:inset_0_1px_0_rgba(255,255,255,0.88)] [--mq-well:rgba(255,255,255,0.62)]",
          "[--mq-veil:rgba(236,231,223,0.74)]",
          "[--mq-tone-ok:#135f36] [--mq-tone-warn:#6b4a00] [--mq-tone-part:#8a3d0a] [--mq-tone-bad:#8a1f28] [--mq-tone-info:#1e4b80]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(38,40,45,0.94))] backdrop-blur-[18px] backdrop-saturate-[155%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_18px_38px_rgba(24,20,40,0.28)]",
          "[--mq-body:rgba(38,40,45,0.94)] [--mq-text:#f7f8fa] [--mq-muted:#d8dbe0]",
          "[--mq-rule:rgba(255,255,255,0.18)] [--mq-brd:rgba(255,255,255,0.30)] [--mq-ring:#f7f8fa]",
          "[--mq-row:rgba(255,255,255,0.08)] [--mq-row-brd:rgba(255,255,255,0.16)]",
          "[--mq-row-shadow:inset_0_1px_0_rgba(255,255,255,0.16)] [--mq-well:rgba(255,255,255,0.14)]",
          "[--mq-veil:rgba(38,40,45,0.76)]",
          "[--mq-tone-ok:#7fe0a8] [--mq-tone-warn:#f5cd6a] [--mq-tone-part:#ffb185] [--mq-tone-bad:#ffb3b3] [--mq-tone-info:#9dc4ff]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f5f3ee),var(--mq-body,#e6e3da))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-4px_6px_rgba(0,0,0,0.13),0_6px_0_var(--mq-edge,#b8b3a6),0_14px_24px_rgba(38,36,31,0.24)]",
          "[--mq-lit:#f5f3ee] [--mq-body:#e6e3da] [--mq-edge:#b8b3a6] [--mq-text:#25231d] [--mq-muted:#4a473f]",
          "[--mq-rule:rgba(37,35,29,0.22)] [--mq-brd:rgba(37,35,29,0.26)] [--mq-ring:#171817]",
          "[--mq-row:rgba(255,255,255,0.52)] [--mq-row-brd:rgba(37,35,29,0.16)]",
          "[--mq-row-shadow:inset_0_1px_0_rgba(255,255,255,0.90)] [--mq-well:rgba(255,255,255,0.58)]",
          "[--mq-veil:rgba(240,238,231,0.74)]",
          "[--mq-tone-ok:#135f36] [--mq-tone-warn:#6b4a00] [--mq-tone-part:#8a3d0a] [--mq-tone-bad:#8a1f28] [--mq-tone-info:#1e4b80]",
        ].join(" "),
        // Almost no ornament: it adapts instead. The surface is opaque and flips
        // together with its text and its five state tokens, so the dark scheme
        // keeps exactly the same measured contrast as the light one.
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_12px_28px_rgba(20,20,18,0.07)]",
          "dark:shadow-[0_1px_2px_rgba(0,0,0,0.50),0_12px_28px_rgba(0,0,0,0.50)]",
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817]",
          "[--mq-row:#f7f7f5] [--mq-row-brd:rgba(23,24,23,0.10)]",
          "[--mq-row-shadow:none] [--mq-well:#f2f2ef]",
          "[--mq-veil:rgba(255,255,255,0.76)]",
          "[--mq-tone-ok:#135f36] [--mq-tone-warn:#6b4a00] [--mq-tone-part:#8a3d0a] [--mq-tone-bad:#8a1f28] [--mq-tone-info:#1e4b80]",
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9]",
          "dark:[--mq-row:rgba(255,255,255,0.05)] dark:[--mq-row-brd:rgba(255,255,255,0.12)]",
          "dark:[--mq-well:rgba(255,255,255,0.08)] dark:[--mq-veil:rgba(35,35,39,0.78)]",
          "dark:[--mq-tone-ok:#7fe0a8] dark:[--mq-tone-warn:#f5cd6a] dark:[--mq-tone-part:#ffb185] dark:[--mq-tone-bad:#ffb3b3] dark:[--mq-tone-info:#9dc4ff]",
        ].join(" "),
      },
      // A status panel has one composition. `default` exists so the registry can
      // list a variant and the preview can coerce an incoming value.
      variant: { default: "" },
      size: {
        sm: [
          "[--mq-pad:14px] [--mq-gap:11px] [--mq-radius:18px]",
          "[--mq-row-gap:6px] [--mq-row-pad:9px] [--mq-row-x:11px] [--mq-row-radius:12px]",
          "[--mq-headline:15px] [--mq-caption:11px] [--mq-name:12px] [--mq-detail:11px] [--mq-state:11px]",
          "[--mq-icon-box:34px] [--mq-icon-radius:11px] [--mq-glyph:19px] [--mq-shape:11px] [--mq-chip-glyph:13px]",
        ].join(" "),
        md: [
          "[--mq-pad:20px] [--mq-gap:14px] [--mq-radius:24px]",
          "[--mq-row-gap:8px] [--mq-row-pad:11px] [--mq-row-x:13px] [--mq-row-radius:15px]",
          "[--mq-headline:18px] [--mq-caption:12px] [--mq-name:13px] [--mq-detail:12px] [--mq-state:12px]",
          "[--mq-icon-box:42px] [--mq-icon-radius:14px] [--mq-glyph:23px] [--mq-shape:13px] [--mq-chip-glyph:15px]",
        ].join(" "),
        lg: [
          "[--mq-pad:26px] [--mq-gap:18px] [--mq-radius:30px]",
          "[--mq-row-gap:10px] [--mq-row-pad:14px] [--mq-row-x:16px] [--mq-row-radius:18px]",
          "[--mq-headline:22px] [--mq-caption:13px] [--mq-name:15px] [--mq-detail:13px] [--mq-state:13px]",
          "[--mq-icon-box:50px] [--mq-icon-radius:16px] [--mq-glyph:27px] [--mq-shape:15px] [--mq-chip-glyph:17px]",
        ].join(" "),
      },
    },
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

/**
 * The state's silhouette. Decorative — the state is spelled out in the adjacent
 * chip text — but it is the channel that survives when hue cannot be perceived,
 * so it repaints to `CanvasText` rather than disappearing in forced colours.
 */
function StateShape({ state }: { state: StatusState }) {
  return (
    <svg
      aria-hidden="true"
      className="block size-[var(--mq-shape,13px)] forced-colors:[fill:CanvasText]"
      fill="currentColor"
      focusable="false"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={STATE_PATH[state]} fillRule="evenodd" />
    </svg>
  );
}

/** Decorative lucide glyph for a state; never the sole carrier of meaning. */
function StateGlyph({ state }: { state: StatusState }) {
  const Icon = STATE_ICON[state];
  return <Icon aria-hidden="true" focusable="false" />;
}

/**
 * `urgency="auto"`: only a MAJOR outage is worth interrupting a screen-reader
 * user mid-sentence. Everything else — including a partial outage — is polite.
 */
function resolveUrgency(
  state: StatusState,
  urgency: StatusUrgency,
): Exclude<StatusUrgency, "auto"> {
  if (urgency !== "auto") return urgency;
  return state === "outage" ? "assertive" : "polite";
}

export type StatusSummaryProps = Omit<
  React.ComponentPropsWithRef<"section">,
  "aria-live" | "children" | "role" | "title"
> &
  VariantProps<typeof statusSummaryVariants> & {
    /** The headline state for the whole system. */
    overall?: StatusState;
    /** Visible headline. Defaults to the copy for `overall`. */
    headline?: React.ReactNode;
    /**
     * sr-only prefix naming the state before the headline, exactly as Alert
     * prefixes its title. Override it to localise the state vocabulary.
     */
    stateLabel?: React.ReactNode;
    /** Heading rank, so the panel fits the host page's outline. Defaults to 2. */
    headingLevel?: StatusHeadingLevel;
    /** Individual services, rendered as a real list. */
    services?: readonly StatusService[];
    /** Accessible name for the services list. */
    servicesLabel?: string;
    /** "Last updated" caption. A PROP, never a clock read during render. */
    updatedAt?: React.ReactNode;
    /** Replaces the derived "n of m services operational" sentence. */
    summary?: React.ReactNode;
    /** Hide the derived count sentence when the caption is already crowded. */
    showCounts?: boolean;
    /** Live-region policy; `auto` derives urgency from `overall`. */
    urgency?: StatusUrgency;
    /** Marks the list busy: veils it, sets `aria-busy` and makes it `inert`. */
    loading?: boolean;
    /** Wording used in the caption while `loading`. */
    loadingLabel?: React.ReactNode;
    /** Fades the panel and takes the service links out of the tab order. */
    disabled?: boolean;
    /** Optional trailing slot below a hairline, e.g. a link to the full history. */
    footer?: React.ReactNode;
  };

export function StatusSummary({
  className,
  disabled = false,
  footer,
  headline,
  headingLevel = 2,
  loading = false,
  loadingLabel = "Refreshing…",
  material,
  overall = "operational",
  services,
  servicesLabel = "Service status",
  showCounts = true,
  size,
  stateLabel,
  summary,
  updatedAt,
  urgency = "auto",
  variant,
  ...props
}: StatusSummaryProps) {
  const generatedId = React.useId();
  const headingId = `${generatedId}-headline`;

  const rows = services ?? [];
  const total = rows.length;
  const okCount = rows.filter((service) => service.state === "operational").length;

  const resolvedUrgency = resolveUrgency(overall, urgency);
  const liveRole =
    resolvedUrgency === "assertive"
      ? "alert"
      : resolvedUrgency === "polite"
        ? "status"
        : undefined;

  const Heading = HEADING_TAG[headingLevel];
  const isInert = loading || disabled;
  const state = disabled ? "disabled" : loading ? "loading" : "idle";

  const derivedCounts =
    summary !== undefined
      ? summary
      : showCounts && total > 0
        ? `${okCount} of ${total} services operational`
        : null;

  // Built by filtering a literal rather than by pushing into a mutable array, so
  // nothing declared in the component body is reassigned after render.
  const captionParts: React.ReactNode[] = [
    derivedCounts,
    updatedAt,
    loading ? loadingLabel : null,
  ].filter((part) => part !== null && part !== undefined && part !== false && part !== "");

  return (
    <>
      <StatusKeyframes />
      {/* `props` is spread first on purpose: everything derived from `overall`,
          `loading` and `disabled` below must win over anything a caller passes. */}
      <section
        {...props}
        aria-labelledby={headingId}
        className={cn(statusSummaryVariants({ material, variant, size }), className)}
        data-material={material ?? "clay"}
        data-state={state}
        data-status={overall}
        data-urgency={resolvedUrgency}
      >
        {/* The live region. It holds the heading and the caption and is atomic, so
            a state change is announced as one complete sentence rather than as a
            stream of fragments. */}
        <div
          aria-atomic={liveRole ? true : undefined}
          aria-live={liveRole ? resolvedUrgency : undefined}
          className="relative z-10 flex items-center gap-[12px]"
          data-status-banner=""
          role={liveRole}
        >
          <span
            aria-hidden="true"
            className={cn(
              "grid shrink-0 place-items-center",
              "size-[var(--mq-icon-box,42px)] rounded-[var(--mq-icon-radius,14px)]",
              "bg-[var(--mq-well,rgba(255,255,255,0.62))]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
              "[&>svg]:size-[var(--mq-glyph,23px)]",
              STATE_TONE[overall],
              // A beat behind the panel, so the eye lands on the state mark last.
              // Pure decoration on an already-hidden glyph; reduced motion drops
              // it and the mark simply sits at its resting scale.
              "animate-[mq-status-mark_380ms_cubic-bezier(0.34,1.56,0.64,1)_60ms_both]",
              "motion-reduce:animate-none",
              "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]",
              "forced-colors:text-[CanvasText] forced-colors:shadow-none",
            )}
            data-status-mark=""
          >
            <StateGlyph state={overall} />
          </span>

          <div className="flex min-w-0 flex-col gap-[3px]">
            <Heading
              className="m-0 text-[length:var(--mq-headline,18px)] leading-[1.2] font-extrabold tracking-[-0.02em]"
              data-status-headline=""
              id={headingId}
            >
              {/* The state, in words, ahead of whatever headline copy the product
                  chose — so the meaning never rides on the hue or the glyph. */}
              <span className={SR_ONLY} data-status-state-label="">
                {stateLabel ?? STATE_LABEL[overall]}:{" "}
              </span>
              {headline ?? STATE_HEADLINE[overall]}
            </Heading>

            {captionParts.length > 0 ? (
              <p
                className={cn(
                  "m-0 text-[length:var(--mq-caption,12px)] leading-[1.5] font-medium",
                  "text-[color:var(--mq-muted,#5a5248)] forced-colors:text-[CanvasText]",
                )}
                data-status-caption=""
              >
                {captionParts.map((part, index) => (
                  <React.Fragment key={`caption-${index}`}>
                    {index > 0 ? <span aria-hidden="true">{" · "}</span> : null}
                    {part}
                  </React.Fragment>
                ))}
              </p>
            ) : null}
          </div>
        </div>

        {total > 0 ? (
          <div
            aria-busy={loading || undefined}
            className="relative z-10"
            data-status-services=""
          >
            {loading ? (
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-[-4px] z-20 rounded-[var(--mq-row-radius,15px)]",
                  "bg-[var(--mq-veil,rgba(236,231,223,0.74))]",
                  // Reduced motion stops the pulse but KEEPS the veil painted, so
                  // the busy state is still carried visually — and "Refreshing…"
                  // is still in the caption as real words either way.
                  "animate-pulse motion-reduce:animate-none",
                  "forced-colors:[background-color:Canvas]",
                )}
              />
            ) : null}

            {/* `inert` genuinely removes the covered rows from the tab order, so a
                keyboard user cannot land on a link hidden behind the veil. */}
            <ul
              aria-label={servicesLabel}
              className="m-0 flex list-none flex-col gap-[var(--mq-row-gap,8px)] p-0"
              data-status-list=""
              inert={isInert || undefined}
            >
              {rows.map((service, index) => (
                <li
                  className={cn(
                    "flex items-start gap-[10px] border",
                    "rounded-[var(--mq-row-radius,15px)]",
                    "border-[var(--mq-row-brd,rgba(82,70,56,0.14))]",
                    "bg-[var(--mq-row,rgba(255,255,255,0.55))]",
                    "px-[var(--mq-row-x,13px)] py-[var(--mq-row-pad,11px)]",
                    "shadow-[var(--mq-row-shadow,inset_0_1px_0_rgba(255,255,255,0.88))]",
                    // Staggered arrival. The delay is derived from the map's own
                    // index — no cursor declared in the component body is ever
                    // reassigned from inside this callback.
                    "animate-[mq-status-row_300ms_cubic-bezier(0.22,1.1,0.36,1)_both]",
                    "motion-reduce:animate-none",
                    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none",
                  )}
                  data-service-state={service.state}
                  key={`${service.name}-${index}`}
                  style={{ animationDelay: `${90 + index * 45}ms` }}
                >
                  {/* Channel one: the silhouette. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-[3px] shrink-0",
                      STATE_TONE[service.state],
                      "forced-colors:text-[CanvasText]",
                    )}
                    data-service-shape=""
                  >
                    <StateShape state={service.state} />
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span
                      className="text-[length:var(--mq-name,13px)] leading-[1.35] font-bold"
                      data-service-name=""
                    >
                      {service.href ? (
                        <a
                          className={cn(
                            "inline-flex items-center rounded-[6px] underline-offset-[3px] hover:underline",
                            // Tailwind v4 writes `translate-x-*` to the standalone
                            // `translate` property, so the transition names
                            // `translate` — not `transform`, which would animate
                            // nothing here.
                            "transition-[translate] duration-200 ease-out",
                            "hover:translate-x-[2px]",
                            "motion-reduce:transition-none motion-reduce:hover:translate-x-0",
                            FOCUS_RING,
                          )}
                          href={service.href}
                        >
                          {service.name}
                        </a>
                      ) : (
                        service.name
                      )}
                    </span>

                    {service.detail !== undefined && service.detail !== null ? (
                      <span
                        className={cn(
                          "text-[length:var(--mq-detail,12px)] leading-[1.5] font-medium",
                          "text-[color:var(--mq-muted,#5a5248)] forced-colors:text-[CanvasText]",
                        )}
                        data-service-detail=""
                      >
                        {service.detail}
                      </span>
                    ) : null}
                  </div>

                  {/* Channels two and three: the glyph, and the state as real,
                      visible text that reads identically to every user. */}
                  <span
                    className={cn(
                      "ml-auto flex shrink-0 items-center gap-[6px] pt-[1px]",
                      "text-[length:var(--mq-state,12px)] leading-[1.3] font-bold",
                      "[&>svg]:size-[var(--mq-chip-glyph,15px)] [&>svg]:shrink-0",
                      STATE_TONE[service.state],
                      "forced-colors:text-[CanvasText]",
                    )}
                    data-service-chip=""
                  >
                    <StateGlyph state={service.state} />
                    <span>{service.stateLabel ?? STATE_LABEL[service.state]}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {footer !== undefined && footer !== null ? (
          <div
            className={cn(
              "relative z-10 flex flex-wrap items-center gap-[10px] border-t pt-[var(--mq-gap,14px)]",
              "border-[var(--mq-rule,rgba(82,70,56,0.20))]",
              "text-[length:var(--mq-caption,12px)] leading-[1.5] font-medium",
              "text-[color:var(--mq-muted,#5a5248)]",
              "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]",
            )}
            data-status-footer=""
          >
            {footer}
          </div>
        ) : null}
      </section>
    </>
  );
}

export { statusSummaryVariants };
