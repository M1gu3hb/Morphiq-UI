"use client";

import type * as React from "react";
import {
  CircleCheck,
  CircleDashed,
  CircleX,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Inline Feedback
 *
 * The short validation line that lives directly under a form field: a small
 * tone chip plus one sentence. It is deliberately NOT a callout — no card, no
 * page-level surface — so it reads as part of the field it belongs to.
 *
 * This is a material-AGNOSTIC component: it ships a single style built on the
 * adaptive light+dark token vocabulary, because a message that sits inside a
 * form inherits that form's material rather than introducing a second one.
 * `material` is accepted for catalog parity and reflected on `data-material`;
 * it drives no separate recipe.
 *
 * Self-contained by design: every local custom property is used with a literal
 * fallback, no class comes from a global stylesheet, and the entrance keyframes
 * travel with the component through React 19's deduplicated `<style href>`
 * hoisting rather than living somewhere a copier would have to find.
 *
 * Accessibility contract:
 *
 * - THE CONTAINER IS ALWAYS RENDERED, message or not. A live region that is
 *   inserted into the DOM at the same moment it gains text is announced
 *   unreliably (and in several screen reader / browser pairs, not at all). So
 *   `InlineFeedback` mounts once with the field and only its CONTENTS are
 *   swapped, which is the pattern assistive technology actually observes.
 * - `urgency="auto"` maps `error` to `role="alert"` + `aria-live="assertive"`
 *   and every other tone to `role="status"` + `aria-live="polite"`. Both are
 *   `aria-atomic` so the tone word and the message are announced as one unit.
 *   `urgency` overrides that when product context knows better; `"off"` opts
 *   out of the live region entirely for text that was never dynamic.
 * - It accepts an `id` so the field can point at it with `aria-describedby`,
 *   which is what makes the message part of the input's own description rather
 *   than a floating announcement.
 * - Meaning is never colour alone: the tone is stated as REAL TEXT in an
 *   `sr-only` label ahead of the message ("Error: …") — or visibly, with
 *   `toneLabelHidden={false}` — and each tone additionally carries a DISTINCT
 *   GLYPH SHAPE (check / cross / triangle / i / dashed ring). The glyph itself
 *   is decorative and `aria-hidden`, so it is never announced twice.
 *
 * Local theming knobs (each used with a literal fallback):
 *
 *   --mq-tone         message + glyph colour for the current tone
 *   --mq-wash         tone chip fill
 *   --mq-brd          tone chip hairline
 *   --mq-sheen        tone chip top sheen (a gradient, cleared in forced colours)
 *   --mq-ring         focus ring colour
 *   --mq-gap          space between the chip and the message
 *   --mq-font         message type size
 *   --mq-line         reserved height when `reserveSpace` holds the slot open
 *   --mq-chip         tone chip box
 *   --mq-chip-radius  tone chip corner radius
 *   --mq-glyph        glyph size inside the chip
 *   --mq-text-pad     optical nudge that centres line one against the chip
 */

export type InlineFeedbackTone = "success" | "error" | "warning" | "info" | "hint";
export type InlineFeedbackSize = "sm" | "md" | "lg";
export type InlineFeedbackUrgency = "auto" | "polite" | "assertive" | "off";

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

/**
 * One distinct silhouette per tone, so the tone survives greyscale, colour
 * blindness and forced colours even before the text label is read.
 */
const TONE_ICON: Record<InlineFeedbackTone, LucideIcon> = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
  hint: CircleDashed,
};

/** The tone stated in words. This — not the colour — is the carrier of meaning. */
const TONE_LABEL: Record<InlineFeedbackTone, string> = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Information",
  hint: "Hint",
};

/**
 * Declared for real `:focus-visible` — a caller may make the message focusable
 * for a "jump to the first error" flow — and identically for a
 * `data-focus="true"` attribute so the documentation preview can render the
 * focused look without synthesising a keyboard event. `:focus-within` is
 * deliberately absent: a link inside the message already draws its own ring,
 * and outlining the message as well would read as two separate targets.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] " +
  "forced-colors:data-[focus=true]:outline-[Highlight]";

/**
 * The message arrives from under the field it belongs to: a 4px drop plus a
 * fade, and the tone chip pops a beat later so the eye lands on the glyph last.
 *
 * Both animations drive the STANDALONE `translate` and `scale` properties that
 * Tailwind v4 writes its utilities to, so nothing here fights a caller's
 * `transform`. The resting end state of each keyframe IS the final visual state
 * (`translate: 0 0`, `scale: 1`, `opacity: 1`), which is exactly the state the
 * element has with no animation at all — so `motion-reduce:animate-none` leaves
 * the message fully rendered and fully legible, never mid-flight and never
 * hidden.
 */
const INLINE_FEEDBACK_KEYFRAMES =
  "@keyframes mq-inline-feedback-in{from{opacity:0;translate:0 -4px}to{opacity:1;translate:0 0}}" +
  "@keyframes mq-inline-feedback-chip{0%{scale:0.62}62%{scale:1.08}100%{scale:1}}";

function InlineFeedbackKeyframes() {
  return (
    <style href="mq-inline-feedback" precedence="medium">
      {INLINE_FEEDBACK_KEYFRAMES}
    </style>
  );
}

const inlineFeedbackVariants = cva(
  [
    "relative isolate block w-full text-left",
    "text-[length:var(--mq-font,13px)] leading-[1.45] font-semibold tracking-[-0.005em]",
    "text-[color:var(--mq-tone,#55554e)]",
    // The chip sheen is a gradient held in a variable so forced colours can be
    // cleared in one place; `none` is the literal fallback if it is ever unset.
    "[--mq-sheen:linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0))]",
    "[--mq-ring:#171817]",
    "dark:[--mq-sheen:linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0))]",
    "dark:[--mq-ring:#f1efe9]",
    "forced-colors:text-[CanvasText]",
    FOCUS_RING,
  ].join(" "),
  {
    variants: {
      // A validation line has one composition. `default` exists so the registry
      // can list a variant and the preview can coerce an incoming value.
      variant: { default: "" },
      size: {
        sm: [
          "[--mq-font:12px] [--mq-gap:6px] [--mq-line:16px]",
          "[--mq-chip:17px] [--mq-chip-radius:6px] [--mq-glyph:11px] [--mq-text-pad:0px]",
        ].join(" "),
        md: [
          "[--mq-font:13px] [--mq-gap:8px] [--mq-line:20px]",
          "[--mq-chip:20px] [--mq-chip-radius:7px] [--mq-glyph:13px] [--mq-text-pad:1px]",
        ].join(" "),
        lg: [
          "[--mq-font:14px] [--mq-gap:10px] [--mq-line:24px]",
          "[--mq-chip:24px] [--mq-chip-radius:9px] [--mq-glyph:15px] [--mq-text-pad:2px]",
        ].join(" "),
      },
      /**
       * Tone tokens. Every foreground below was picked to clear 4.5:1 against a
       * light page (#ffffff and #f6f5f1) in the light scheme and against a dark
       * page (#171817) in the dark scheme — the message is TEXT, so the graphic
       * 3:1 allowance does not apply to it.
       */
      tone: {
        success: [
          "[--mq-tone:#15703f] [--mq-wash:rgba(21,112,63,0.13)] [--mq-brd:rgba(21,112,63,0.30)]",
          "dark:[--mq-tone:#5ad18b] dark:[--mq-wash:rgba(90,209,139,0.16)] dark:[--mq-brd:rgba(90,209,139,0.34)]",
        ].join(" "),
        error: [
          "[--mq-tone:#b3261e] [--mq-wash:rgba(179,38,30,0.12)] [--mq-brd:rgba(179,38,30,0.30)]",
          "dark:[--mq-tone:#ff9d8e] dark:[--mq-wash:rgba(255,157,142,0.16)] dark:[--mq-brd:rgba(255,157,142,0.34)]",
        ].join(" "),
        warning: [
          "[--mq-tone:#8a5a00] [--mq-wash:rgba(138,90,0,0.13)] [--mq-brd:rgba(138,90,0,0.30)]",
          "dark:[--mq-tone:#e5a54b] dark:[--mq-wash:rgba(229,165,75,0.16)] dark:[--mq-brd:rgba(229,165,75,0.34)]",
        ].join(" "),
        info: [
          "[--mq-tone:#3f5bd9] [--mq-wash:rgba(63,91,217,0.12)] [--mq-brd:rgba(63,91,217,0.30)]",
          "dark:[--mq-tone:#8ea2ff] dark:[--mq-wash:rgba(142,162,255,0.16)] dark:[--mq-brd:rgba(142,162,255,0.34)]",
        ].join(" "),
        hint: [
          "[--mq-tone:#55554e] [--mq-wash:rgba(85,85,78,0.12)] [--mq-brd:rgba(85,85,78,0.28)]",
          "dark:[--mq-tone:#b9b7b0] dark:[--mq-wash:rgba(185,183,176,0.14)] dark:[--mq-brd:rgba(185,183,176,0.30)]",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "default", size: "md", tone: "hint" },
  },
);

/** `error` is the only tone a form owes the user an interruption for. */
function resolveUrgency(
  tone: InlineFeedbackTone,
  urgency: InlineFeedbackUrgency,
): Exclude<InlineFeedbackUrgency, "auto"> {
  if (urgency !== "auto") return urgency;
  return tone === "error" ? "assertive" : "polite";
}

function ToneIcon({ tone }: { tone: InlineFeedbackTone }) {
  const Icon = TONE_ICON[tone];
  return <Icon />;
}

export type InlineFeedbackProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-atomic" | "aria-live" | "children" | "color" | "role"
> & {
  /**
   * The message. Leave it out (or pass `null`) between validations: the live
   * region stays mounted and only its contents are swapped.
   */
  children?: React.ReactNode;
  /** Semantic tone. Drives the glyph, the tone word and the urgency mapping. */
  tone?: InlineFeedbackTone;
  /** Accessible tone word; override it when localising the component. */
  toneLabel?: React.ReactNode;
  /** Keep the tone word `sr-only` (default) or print it in front of the message. */
  toneLabelHidden?: boolean;
  /** Custom decorative glyph. Pass `false` to drop the tone chip entirely. */
  icon?: React.ReactNode;
  /** Live-region policy; `auto` derives urgency from tone. */
  urgency?: InlineFeedbackUrgency;
  /** Hold the slot open while empty so validating a field never shifts the layout. */
  reserveSpace?: boolean;
  /**
   * Replays the entrance when it changes. Defaults to the tone, so a field that
   * goes from invalid to valid re-announces and re-animates; pass the message
   * itself when two consecutive errors share a tone.
   */
  messageKey?: string | number;
  size?: InlineFeedbackSize;
  variant?: "default";
  /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
  material?: MaterialSlug;
};

/**
 * A passive, server-friendly validation line. Stateless and uncontrolled: the
 * message is a prop, nothing in render reads the clock or a random value, and
 * there is no effect and no timer — so it hydrates identically on a statically
 * generated page.
 */
export function InlineFeedback({
  children,
  className,
  icon,
  material = "adaptive",
  messageKey,
  reserveSpace = false,
  size = "md",
  tone = "hint",
  toneLabel,
  toneLabelHidden = true,
  urgency = "auto",
  variant = "default",
  ...props
}: InlineFeedbackProps) {
  const resolvedUrgency = resolveUrgency(tone, urgency);
  const liveRole =
    resolvedUrgency === "assertive"
      ? "alert"
      : resolvedUrgency === "polite"
        ? "status"
        : undefined;

  const hasMessage =
    children !== null && children !== undefined && children !== false && children !== "";
  const resolvedIcon = icon === undefined ? <ToneIcon tone={tone} /> : icon;
  const rowKey = messageKey ?? tone;

  return (
    <>
      <InlineFeedbackKeyframes />
      <div
        {...props}
        aria-atomic={liveRole ? true : undefined}
        aria-live={liveRole ? resolvedUrgency : undefined}
        className={cn(
          inlineFeedbackVariants({ size, tone, variant }),
          reserveSpace && "min-h-[var(--mq-line,20px)]",
          className,
        )}
        data-empty={hasMessage ? undefined : "true"}
        data-material={material}
        data-tone={tone}
        data-urgency={resolvedUrgency}
        role={liveRole}
      >
        {hasMessage ? (
          <span
            className={cn(
              "flex items-start gap-[var(--mq-gap,8px)]",
              "animate-[mq-inline-feedback-in_260ms_cubic-bezier(0.22,1,0.36,1)_both]",
              // The travel is decoration; the message is already announced by
              // the live region. Reduced motion lands straight on the end state.
              "motion-reduce:animate-none",
            )}
            data-inline-feedback-row=""
            key={rowKey}
          >
            {resolvedIcon ? (
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 grid shrink-0 place-items-center",
                  "size-[var(--mq-chip,20px)] rounded-[var(--mq-chip-radius,7px)]",
                  "border border-[var(--mq-brd,rgba(85,85,78,0.28))] bg-[var(--mq-wash,rgba(85,85,78,0.12))]",
                  // An explicit property rather than a `bg-*` utility: a colour
                  // and a gradient through the same utility land in one
                  // `tailwind-merge` group where one silently drops the other.
                  "[background-image:var(--mq-sheen,none)]",
                  "text-[color:var(--mq-tone,#55554e)]",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_1px_rgba(20,20,18,0.06)]",
                  "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]",
                  "[&>svg]:size-[var(--mq-glyph,13px)]",
                  "animate-[mq-inline-feedback-chip_360ms_cubic-bezier(0.34,1.56,0.64,1)_60ms_both]",
                  "motion-reduce:animate-none",
                  // Forced colours erase fills and shadows but NOT background
                  // images, so the sheen has to be cleared by hand or it would
                  // sit on a system-coloured surface it was never drawn against.
                  "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
                  "forced-colors:shadow-none forced-colors:[background-image:none]",
                )}
                data-inline-feedback-icon=""
              >
                {resolvedIcon}
              </span>
            ) : null}
            <span
              className="min-w-0 pt-[var(--mq-text-pad,1px)]"
              data-inline-feedback-message=""
            >
              <span
                className={cn(toneLabelHidden ? SR_ONLY : "font-extrabold")}
                data-inline-feedback-tone-label=""
              >
                {toneLabel ?? TONE_LABEL[tone]}:{" "}
              </span>
              {children}
            </span>
          </span>
        ) : null}
      </div>
    </>
  );
}

export { inlineFeedbackVariants };
