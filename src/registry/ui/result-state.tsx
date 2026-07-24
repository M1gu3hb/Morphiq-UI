"use client";

import * as React from "react";
import { CircleCheck, CircleX, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Result State
 *
 * The panel a flow lands on when an operation is *over*: a medallion carrying
 * the outcome glyph, a real heading, an explanatory paragraph and up to two
 * caller-supplied actions.
 *
 * Deliberately NOT the Empty State. Empty State is about the absence of data
 * ("no invoices yet") and is static furniture a reader meets by navigating
 * headings. Result State is about the *outcome* of something the reader just
 * did ("payment declined"), so it is announced: it is a live region whose
 * urgency follows the tone, exactly the mapping `alert.tsx` uses.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property is used with a literal fallback, the `sr-only` helper is
 * inlined rather than borrowed from a global stylesheet, and the `@keyframes`
 * travel with the component through React 19's hoisted `<style href precedence>`
 * (deduplicated by `href`, so a page with several panels emits one rule of each).
 *
 * Accessibility contract:
 *
 * - `urgency="auto"` maps success / info / warning to `role="status"` with
 *   `aria-live="polite"`, and error to `role="alert"` with `aria-live="assertive"`
 *   — an error is the only outcome worth interrupting for. `urgency` overrides
 *   that policy with `polite`, `assertive` or `off` when the surrounding product
 *   flow knows more than the visual tone does. Live regions are `aria-atomic`
 *   so the medallion, heading and description are announced as one result.
 * - The tone is stated in WORDS: an sr-only label ("Error: ") sits ahead of the
 *   title inside the heading, so the outcome survives with no colour perception
 *   at all. `toneLabel` localises or replaces it.
 * - Shape is a second, redundant carrier: each tone has its own glyph *and* its
 *   own medallion corner radius (`--mq-well-radius`: a circle for success, a
 *   soft square for info, a tighter one for warning, an almost-square for
 *   error), so the four outcomes are still distinct in greyscale.
 * - The glyph itself is decorative and `aria-hidden` — it never carries meaning
 *   the text does not already carry.
 * - The title renders as a genuine heading whose rank is overridable
 *   (`headingLevel`, 1–6), because the correct level belongs to the document
 *   outline the panel sits in and only the page knows that.
 * - The panel owns no focus trap and no interactive surface: the action slots
 *   hold real `<button>`/`<a>` elements supplied by the caller, each bringing
 *   its own accessible name and focus ring. The panel is still styled for
 *   focus, because a result screen is commonly given `tabIndex={-1}` and focused
 *   programmatically once the flow completes; `data-focus="true"` renders that
 *   same look for docs and visual-regression captures.
 *
 * Local theming knobs (each used with a literal fallback):
 *
 *   --mq-body         panel surface
 *   --mq-lit          top gradient stop (skeuo)
 *   --mq-edge         extruded lower edge (clay / skeuo)
 *   --mq-text         heading and description colour
 *   --mq-accent       tone glyph, glow and halo colour
 *   --mq-brd          panel border colour
 *   --mq-icon-bg      medallion well colour
 *   --mq-ring         focus ring colour
 *   --mq-well-radius  per-tone medallion corner radius
 *   --mq-pad          inner padding
 *   --mq-gap          vertical rhythm
 *   --mq-radius       panel corner radius
 *   --mq-max          content max width
 *   --mq-icon-box     medallion size
 *   --mq-glyph        glyph size
 *   --mq-title-size   heading font size
 *   --mq-desc-size    description font size
 *   --mq-actions-gap  gap between actions
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

export type ResultStateTone = "success" | "error" | "warning" | "info";
export type ResultStateUrgency = "auto" | "polite" | "assertive" | "off";
/** Heading rank the title renders at. Overridable: the right level is a
 * property of the surrounding page, not of this component. */
export type ResultStateHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

/**
 * Four visually distinct outlines — a tick, a cross, a triangle and an "i" —
 * so the glyphs differ in silhouette and not only in hue. They are decorative
 * regardless; `TONE_LABEL` is what actually says the outcome.
 */
const TONE_ICON: Record<ResultStateTone, LucideIcon> = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
};

const TONE_LABEL: Record<ResultStateTone, string> = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Information",
};

/**
 * Focus ring. Declared for real `:focus-visible` (the panel is routinely given
 * `tabIndex={-1}` and focused once the flow ends) and identically for a
 * `data-focus="true"` attribute, so documentation surfaces and visual-regression
 * tests can render the focused look without synthesising a keyboard event.
 * `outline` is never removed without a replacement.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] " +
  "forced-colors:data-[focus=true]:outline-[Highlight]";

/**
 * Keyframes ship with the component instead of living in a global stylesheet a
 * copier would have to hunt for. They animate `opacity`, `translate` and `scale`
 * — the standalone properties Tailwind v4 writes its utilities to — so nothing
 * here fights a `transform` shorthand; there is no `transform` in this file.
 *
 * Every resting end-state equals the element's own CSS default (no offset, unit
 * scale, and — for the halo — the `opacity-0` its base class already declares).
 * That is precisely what `motion-reduce:animate-none` leaves behind: a fully
 * painted, fully legible panel with no leftover ring parked around the glyph.
 */
const RESULT_STATE_KEYFRAMES =
  "@keyframes mq-result-in{from{opacity:0;translate:0 10px}to{opacity:1;translate:0 0}}" +
  "@keyframes mq-result-medallion{0%{opacity:0;scale:0.82}60%{opacity:1;scale:1.06}100%{opacity:1;scale:1}}" +
  "@keyframes mq-result-halo{0%{opacity:0.5;scale:1}100%{opacity:0;scale:1.55}}";

function ResultStateKeyframes() {
  return (
    <style href="mq-result-state" precedence="medium">
      {RESULT_STATE_KEYFRAMES}
    </style>
  );
}

const resultStateVariants = cva(
  [
    "relative isolate mx-auto flex w-full flex-col items-center overflow-hidden text-center",
    "max-w-[var(--mq-max,460px)] gap-[var(--mq-gap,12px)] rounded-[var(--mq-radius,26px)] p-[var(--mq-pad,36px)]",
    "border border-[var(--mq-brd,rgba(82,70,56,0.18))] text-[color:var(--mq-text,#332f2a)]",
    // A result panel is not an interactive surface, so its state changes stay
    // immediate — a reduced-motion reader sees exactly the same UI here.
    "data-[state=disabled]:opacity-55 data-[state=loading]:cursor-progress",
    // Signature: the panel settles into place with a short rise. Keyframes, not
    // a transition — the panel is mounted in its final state and a transition
    // has nothing to run from on the frame an element appears.
    "animate-[mq-result-in_380ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none",
    FOCUS_RING,
    // Forced colours erase shadows, translucency and backdrop filters, so the
    // panel would dissolve into the page. A system border keeps its bounds and
    // system colours keep the outcome legible. `background-image` is NOT erased
    // automatically, so the skeuo gradient is cleared by hand.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
    "forced-colors:shadow-none forced-colors:[background-image:none] forced-colors:[backdrop-filter:none]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#ece7df)] [--mq-icon-bg:rgba(255,255,255,0.50)]",
          "shadow-[inset_0_3px_5px_rgba(255,255,255,0.72),inset_0_-6px_9px_rgba(75,50,35,0.12),0_7px_0_var(--mq-edge,#cfc4b6),0_20px_34px_rgba(64,45,34,0.15)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(38,40,45,0.94))] [--mq-icon-bg:rgba(255,255,255,0.14)]",
          "backdrop-blur-[20px] backdrop-saturate-[160%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_24px_50px_rgba(24,20,40,0.24)]",
        ].join(" "),
        skeuo: [
          // Written as the arbitrary property rather than `bg-[linear-gradient(…)]`
          // so the `forced-colors:` clear above overrides the same declaration
          // instead of racing it across two `tailwind-merge` groups. The greige
          // #e6e3da is the resting skeuo body.
          "bg-[var(--mq-body,#e6e3da)] [--mq-icon-bg:rgba(255,255,255,0.46)]",
          "[background-image:linear-gradient(180deg,var(--mq-lit,#f4f2ec),var(--mq-body,#e6e3da))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.90),inset_0_-5px_8px_rgba(0,0,0,0.16),0_8px_0_var(--mq-edge,#9d998f),0_22px_34px_rgba(35,33,29,0.26)]",
        ].join(" "),
        adaptive: [
          "bg-[var(--mq-body,#171817)] [--mq-icon-bg:rgba(255,255,255,0.14)] dark:[--mq-icon-bg:rgba(0,0,0,0.10)]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.16),0_16px_34px_rgba(20,20,18,0.10)]",
          "dark:shadow-[0_1px_2px_rgba(0,0,0,0.45),0_16px_34px_rgba(0,0,0,0.40)]",
        ].join(" "),
      },
      /**
       * Redundant, colour-free carrier of the outcome: the medallion's corner
       * radius. A circle for success, a soft square for info, a tighter one for
       * warning and an almost-square for error — legible in greyscale, and a
       * second signal alongside the glyph and the sr-only tone label.
       */
      tone: {
        success: "[--mq-well-radius:50%]",
        error: "[--mq-well-radius:10%]",
        warning: "[--mq-well-radius:20%]",
        info: "[--mq-well-radius:32%]",
      },
      // One presentation today; kept as an axis so the catalog's variant
      // switcher has something to bind to and future treatments have a home.
      variant: {
        default: "",
      },
      size: {
        sm: [
          "[--mq-pad:22px] [--mq-gap:10px] [--mq-radius:18px] [--mq-max:360px]",
          "[--mq-icon-box:52px] [--mq-glyph:26px] [--mq-actions-gap:8px]",
          "[--mq-title-size:17px] [--mq-desc-size:12px]",
        ].join(" "),
        md: [
          "[--mq-pad:36px] [--mq-gap:12px] [--mq-radius:26px] [--mq-max:460px]",
          "[--mq-icon-box:72px] [--mq-glyph:34px] [--mq-actions-gap:10px]",
          "[--mq-title-size:22px] [--mq-desc-size:14px]",
        ].join(" "),
        lg: [
          "[--mq-pad:48px] [--mq-gap:16px] [--mq-radius:32px] [--mq-max:560px]",
          "[--mq-icon-box:92px] [--mq-glyph:44px] [--mq-actions-gap:12px]",
          "[--mq-title-size:28px] [--mq-desc-size:16px]",
        ].join(" "),
      },
    },
    /**
     * Material × tone. The palettes are the ones already measured for the Alert:
     * heading and description share `--mq-text` and every pair clears 4.5:1
     * against its surface — including both skeuo gradient stops, glass over a
     * white and a black backdrop, and both adaptive colour schemes. The
     * description is separated from the title by weight and size, never by a
     * lower-contrast tint.
     */
    compoundVariants: [
      // ---------------------------------------------------------------- clay
      {
        material: "clay",
        tone: "success",
        class:
          "[--mq-body:#bfe6c8] [--mq-edge:#92c59f] [--mq-text:#174b2b] [--mq-accent:#174b2b] [--mq-brd:rgba(23,75,43,0.22)] [--mq-ring:#174b2b]",
      },
      {
        material: "clay",
        tone: "error",
        class:
          "[--mq-body:#f5c2bf] [--mq-edge:#d99090] [--mq-text:#6b2027] [--mq-accent:#6b2027] [--mq-brd:rgba(107,32,39,0.22)] [--mq-ring:#6b2027]",
      },
      {
        material: "clay",
        tone: "warning",
        class:
          "[--mq-body:#f4d98b] [--mq-edge:#d2b45f] [--mq-text:#5b3b00] [--mq-accent:#5b3b00] [--mq-brd:rgba(91,59,0,0.22)] [--mq-ring:#5b3b00]",
      },
      {
        material: "clay",
        tone: "info",
        class:
          "[--mq-body:#bdddf5] [--mq-edge:#8ebbdc] [--mq-text:#173f68] [--mq-accent:#173f68] [--mq-brd:rgba(23,63,104,0.22)] [--mq-ring:#173f68]",
      },
      // --------------------------------------------------------------- glass
      {
        material: "glass",
        tone: "success",
        class:
          "[--mq-body:rgba(18,96,62,0.94)] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        tone: "error",
        class:
          "[--mq-body:rgba(134,35,45,0.94)] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        tone: "warning",
        class:
          "[--mq-body:rgba(101,67,10,0.94)] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        tone: "info",
        class:
          "[--mq-body:rgba(26,72,130,0.94)] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      // --------------------------------------------------------------- skeuo
      {
        material: "skeuo",
        tone: "success",
        class:
          "[--mq-lit:#dff0df] [--mq-body:#9fc7a8] [--mq-edge:#7ba889] [--mq-text:#143b23] [--mq-accent:#143b23] [--mq-brd:rgba(20,59,35,0.28)] [--mq-ring:#143b23]",
      },
      {
        material: "skeuo",
        tone: "error",
        class:
          "[--mq-lit:#f2d3d0] [--mq-body:#ca8f91] [--mq-edge:#aa7075] [--mq-text:#5b1a22] [--mq-accent:#5b1a22] [--mq-brd:rgba(91,26,34,0.28)] [--mq-ring:#5b1a22]",
      },
      {
        material: "skeuo",
        tone: "warning",
        class:
          "[--mq-lit:#f6e7b0] [--mq-body:#d3b35e] [--mq-edge:#b18f3f] [--mq-text:#4c3400] [--mq-accent:#4c3400] [--mq-brd:rgba(76,52,0,0.28)] [--mq-ring:#4c3400]",
      },
      {
        material: "skeuo",
        tone: "info",
        class:
          "[--mq-lit:#d9e8f4] [--mq-body:#96b8d4] [--mq-edge:#779bb8] [--mq-text:#153750] [--mq-accent:#153750] [--mq-brd:rgba(21,55,80,0.28)] [--mq-ring:#153750]",
      },
      // ------------------------------------------------------------ adaptive
      {
        material: "adaptive",
        tone: "success",
        class:
          "[--mq-body:#17643d] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(0,0,0,0.32)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#a9e7bd] dark:[--mq-text:#123d24] dark:[--mq-accent:#123d24] dark:[--mq-brd:rgba(18,61,36,0.30)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        tone: "error",
        class:
          "[--mq-body:#8c2531] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(0,0,0,0.32)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#f3b8ba] dark:[--mq-text:#5a1820] dark:[--mq-accent:#5a1820] dark:[--mq-brd:rgba(90,24,32,0.30)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        tone: "warning",
        class:
          "[--mq-body:#7a5109] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(0,0,0,0.32)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#f0d27a] dark:[--mq-text:#4a3200] dark:[--mq-accent:#4a3200] dark:[--mq-brd:rgba(74,50,0,0.30)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        tone: "info",
        class:
          "[--mq-body:#24558d] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(0,0,0,0.32)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#b9d9f4] dark:[--mq-text:#173a5e] dark:[--mq-accent:#173a5e] dark:[--mq-brd:rgba(23,58,94,0.30)] dark:[--mq-ring:#f1efe9]",
      },
    ],
    defaultVariants: {
      material: "clay",
      tone: "success",
      variant: "default",
      size: "md",
    },
  },
);

function resolveUrgency(tone: ResultStateTone, urgency: ResultStateUrgency) {
  if (urgency !== "auto") return urgency;
  // An error is the only outcome worth interrupting a reader for. A success, an
  // informational result and even a warning outcome are reported politely.
  return tone === "error" ? "assertive" : "polite";
}

function ToneIcon({ tone }: { tone: ResultStateTone }) {
  const Icon = TONE_ICON[tone];
  return <Icon />;
}

/**
 * The medallion: a tone-coloured glow, a halo pulse and the well that holds the
 * glyph. Entirely decorative and `aria-hidden` — the outcome is already stated
 * by the sr-only tone label inside the heading.
 *
 * Painting order is DOM order (glow, then halo, then well) with no `z-index`
 * anywhere, so nothing depends on the panel's stacking context.
 */
function Medallion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid shrink-0 place-items-center",
        // A beat behind the panel, so the eye settles on the outcome glyph last.
        // Pure decoration on an already-hidden node, so reduced motion drops it
        // and leaves the medallion at rest — full opacity, unit scale.
        "animate-[mq-result-medallion_460ms_cubic-bezier(0.34,1.56,0.64,1)_120ms_both]",
        "motion-reduce:animate-none",
        className,
      )}
      data-result-medallion=""
    >
      {/* Tone glow. Sits behind the well and never behind text, so it cannot
          erode the heading's measured contrast. */}
      <span
        className={cn(
          "pointer-events-none absolute -inset-[34%] rounded-full opacity-[0.20]",
          "[background-image:radial-gradient(closest-side,var(--mq-accent,#332f2a),transparent)]",
          // Background images survive forced colours untouched, so the glow
          // would paint straight across the system palette without this.
          "forced-colors:[background-image:none]",
        )}
      />
      <span
        className={cn(
          "relative grid place-items-center",
          "size-[var(--mq-icon-box,72px)] rounded-[var(--mq-well-radius,50%)]",
          "bg-[var(--mq-icon-bg,rgba(255,255,255,0.50))] text-[color:var(--mq-accent,#332f2a)]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_6px_16px_rgba(20,20,18,0.12)]",
          "[&>svg]:size-[var(--mq-glyph,34px)]",
          "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]",
          "forced-colors:text-[CanvasText] forced-colors:shadow-none",
        )}
        data-result-well=""
      >
        {/* One outward pulse announcing the result. Its base state is
            `opacity-0`, which is exactly where `animate-none` leaves it — no
            stray ring parked around the glyph for reduced-motion readers. */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-current opacity-0",
            "animate-[mq-result-halo_900ms_cubic-bezier(0.22,1,0.36,1)_260ms_1]",
            "motion-reduce:animate-none forced-colors:border-[CanvasText]",
          )}
        />
        {children}
      </span>
    </span>
  );
}

export type ResultStateProps = Omit<
  React.ComponentPropsWithRef<"div">,
  // `role`, `aria-live` and `aria-atomic` are derived from `tone` + `urgency`;
  // omitting them keeps a caller from desyncing the announced urgency from the
  // outcome the panel is actually showing. Use `urgency` instead. `children` is
  // omitted too: the panel composes its own slots, so a stray child would be
  // dropped by the explicit JSX children below rather than rendered.
  "aria-atomic" | "aria-live" | "children" | "color" | "role" | "title"
> &
  VariantProps<typeof resultStateVariants> & {
    /** Required heading naming the outcome. */
    title: React.ReactNode;
    /** Optional paragraph explaining the outcome or the next step. */
    description?: React.ReactNode;
    /** Accessible tone prefix ("Error: "); override it when localising. */
    toneLabel?: React.ReactNode;
    /** Primary action, normally a real `<button>` or `<a>` with its own name. */
    action?: React.ReactNode;
    /** Optional secondary action rendered beside the primary one. */
    secondaryAction?: React.ReactNode;
    /** Custom decorative glyph. Pass `false` to render no medallion at all. */
    icon?: React.ReactNode;
    /** Live-region policy; `auto` derives urgency from the tone. */
    urgency?: ResultStateUrgency;
    /** Heading rank the title renders at, 1–6. Defaults to 2. */
    headingLevel?: ResultStateHeadingLevel;
    medallionClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    actionsClassName?: string;
  };

export function ResultState({
  action,
  actionsClassName,
  className,
  description,
  descriptionClassName,
  headingLevel = 2,
  icon,
  material,
  medallionClassName,
  secondaryAction,
  size,
  title,
  titleClassName,
  tone,
  toneLabel,
  urgency = "auto",
  variant,
  ...props
}: ResultStateProps) {
  const resolvedTone: ResultStateTone = tone ?? "success";
  const resolvedUrgency = resolveUrgency(resolvedTone, urgency);
  // `icon === undefined` means "use the tone default"; an explicit `false`/`null`
  // renders no medallion, mirroring Alert's `icon={false}` opt-out.
  const resolvedIcon = icon === undefined ? <ToneIcon tone={resolvedTone} /> : icon;
  const HeadingTag = HEADING_TAGS[headingLevel - 1] as React.ElementType;
  const liveRole =
    resolvedUrgency === "assertive"
      ? "alert"
      : resolvedUrgency === "polite"
        ? "status"
        : undefined;

  return (
    <>
      <ResultStateKeyframes />
      {/* `props` is spread first on purpose: the role and live-region attributes
          below are derived from `tone`/`urgency` and must win over anything a
          caller manages to pass through. */}
      <div
        {...props}
        aria-atomic={liveRole ? true : undefined}
        aria-live={liveRole ? resolvedUrgency : undefined}
        className={cn(
          resultStateVariants({ material, size, tone: resolvedTone, variant }),
          className,
        )}
        data-material={material ?? "clay"}
        data-tone={resolvedTone}
        data-urgency={resolvedUrgency}
        data-variant={variant ?? "default"}
        role={liveRole}
      >
        {resolvedIcon ? (
          <Medallion className={medallionClassName}>{resolvedIcon}</Medallion>
        ) : null}
        <HeadingTag
          className={cn(
            "m-0 text-[length:var(--mq-title-size,22px)] leading-[1.18] font-extrabold tracking-[-0.02em]",
            "text-[color:var(--mq-text,#332f2a)] forced-colors:text-[CanvasText]",
            titleClassName,
          )}
          data-result-title=""
        >
          {/* The outcome, in words, ahead of the title — so a reader who cannot
              tell the hues (or the glyphs) apart still hears "Error: ". */}
          <span className={SR_ONLY} data-result-tone-label="">
            {toneLabel ?? TONE_LABEL[resolvedTone]}:{" "}
          </span>
          {title}
        </HeadingTag>
        {description ? (
          <p
            className={cn(
              "m-0 max-w-[52ch] text-[length:var(--mq-desc-size,14px)] leading-[1.6] font-medium",
              // Same token as the heading: the description is separated by
              // weight and size, never by a dimmer tint that would trade away
              // its measured contrast.
              "text-[color:var(--mq-text,#332f2a)] forced-colors:text-[CanvasText]",
              descriptionClassName,
            )}
            data-result-description=""
          >
            {description}
          </p>
        ) : null}
        {action || secondaryAction ? (
          <div
            className={cn(
              "mt-[6px] flex flex-wrap items-center justify-center gap-[var(--mq-actions-gap,10px)]",
              actionsClassName,
            )}
            data-result-actions=""
          >
            {action}
            {secondaryAction}
          </div>
        ) : null}
      </div>
    </>
  );
}

export type ResultStateVariantProps = VariantProps<typeof resultStateVariants>;

export { resultStateVariants };
