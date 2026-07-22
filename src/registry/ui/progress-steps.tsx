"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Progress Steps
 *
 * A horizontal step indicator built from a real ordered list: completed,
 * current and pending steps with a connector rule between each. It is
 * material-agnostic — it ships one adaptive recipe on the light+dark token
 * vocabulary rather than four surfaces — but still accepts a `material` prop so
 * it can sit in a catalog page beside the four-material components; that value
 * is reflected only on `data-material` and never drives a style branch.
 *
 * Self-contained by design: every local custom property carries a literal
 * fallback, no class comes from a global stylesheet, and the one keyframe ships
 * with the component through React 19's hoisted `<style href precedence>` so a
 * page of indicators emits a single rule.
 *
 * Accessibility policy:
 *
 * - The list is an `<ol>` of `<li>`; each step is named by its visible label,
 *   never by colour alone. A visually hidden status word ("Completed",
 *   "Current step", "Pending") prefixes every label, and the completed marker
 *   additionally carries a check glyph — so the state is a shape and a word, not
 *   just a hue.
 * - The current step sets `aria-current="step"` and is emphasised with a solid
 *   ring and an underlined label.
 * - Markers and connectors are decoration and are `aria-hidden`.
 *
 * Local theming knobs (each used with a literal fallback):
 *
 *   --mq-ps-text            completed / current label colour
 *   --mq-ps-muted           step description colour
 *   --mq-ps-active          completed fill and current border
 *   --mq-ps-active-text     content on a completed marker
 *   --mq-ps-pending         pending marker and label colour
 *   --mq-ps-connector       filled (completed) connector colour
 *   --mq-ps-connector-track unfinished connector colour
 *   --mq-ps-ring            current-step emphasis outline
 *   --mq-ps-marker-shadow   completed marker depth
 *   --mq-ps-marker          marker diameter
 *   --mq-ps-num             marker number font size
 *   --mq-ps-label           label font size
 */

/** The four catalog materials. Declared locally so this file imports nothing
 * from the site's component-data; here it only tags `data-material`. */
export type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

export type StepState = "completed" | "current" | "pending";

/**
 * Keyframes travel with the component. `scale` is the standalone property
 * Tailwind v4 writes its `scale-*` utilities to, so this animates the same
 * property the connector fill transitions — there is no `transform` in the file
 * for either to fight with. React 19 hoists and dedupes this by `href`.
 */
const PROGRESS_STEPS_KEYFRAMES = `@keyframes mq-ps-pop{0%{scale:0.82}60%{scale:1.06}100%{scale:1}}`;

function ProgressStepsKeyframes() {
  return (
    <style href="mq-ps-pop" precedence="medium">
      {PROGRESS_STEPS_KEYFRAMES}
    </style>
  );
}

const listVariants = cva(
  [
    "m-0 flex w-full list-none items-start p-0",
    "text-[color:var(--mq-ps-text,#171817)] forced-colors:text-[CanvasText]",
    // One adaptive recipe, light and dark. No material axis: the component is
    // agnostic, so `material` only tags `data-material` and never selects here.
    "[--mq-ps-text:#171817] [--mq-ps-muted:#565851]",
    "[--mq-ps-active:#252724] [--mq-ps-active-text:#ffffff] [--mq-ps-pending:#5f615b]",
    "[--mq-ps-connector:#252724] [--mq-ps-connector-track:#b7b9b2] [--mq-ps-ring:#171817]",
    "[--mq-ps-marker-shadow:0_2px_5px_rgba(23,24,23,0.22)]",
    "dark:[--mq-ps-text:#f5f3ee] dark:[--mq-ps-muted:#c1bfb8]",
    "dark:[--mq-ps-active:#f5f3ee] dark:[--mq-ps-active-text:#171817] dark:[--mq-ps-pending:#a8a8a1]",
    "dark:[--mq-ps-connector:#f5f3ee] dark:[--mq-ps-connector-track:#55574f] dark:[--mq-ps-ring:#ffffff]",
    "dark:[--mq-ps-marker-shadow:0_2px_5px_rgba(0,0,0,0.52)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-ps-marker:26px] [--mq-ps-num:11px] [--mq-ps-label:12px]",
        md: "[--mq-ps-marker:32px] [--mq-ps-num:13px] [--mq-ps-label:13px]",
        lg: "[--mq-ps-marker:40px] [--mq-ps-num:15px] [--mq-ps-label:15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const itemVariants = cva(
  "relative flex min-w-0 flex-1 flex-col items-center px-[4px] text-center",
);

const markerVariants = cva(
  [
    "relative z-10 inline-flex size-[var(--mq-ps-marker,32px)] shrink-0 items-center justify-center",
    "rounded-full border-2 text-[length:var(--mq-ps-num,13px)] font-black tabular-nums",
    "[&>svg]:size-[calc(var(--mq-ps-marker,32px)*0.5)]",
    // Fills and shadows are dropped in forced colours; background images are NOT,
    // so any wash has to be cleared by hand rather than left on a system surface.
    "forced-colors:shadow-none forced-colors:[background-image:none]",
  ].join(" "),
  {
    variants: {
      state: {
        completed: [
          "border-[var(--mq-ps-active,#252724)] bg-[var(--mq-ps-active,#252724)]",
          "text-[color:var(--mq-ps-active-text,#ffffff)]",
          "shadow-[var(--mq-ps-marker-shadow,0_2px_5px_rgba(23,24,23,0.22))]",
          // The completed mark is the progress signal, so it takes Highlight.
          "forced-colors:border-[Highlight] forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
        ].join(" "),
        current: [
          "border-[var(--mq-ps-active,#252724)] bg-transparent",
          "text-[color:var(--mq-ps-active,#252724)]",
          "outline-2 outline-offset-[3px] outline-[var(--mq-ps-ring,#171817)]",
          // Signature: the marker that just became current lands with a spring.
          // It is a keyframe, not a transition, because the element is already
          // mounted and only changes state — a transition has nothing to run
          // from on the frame it renders in its final state.
          "animate-[mq-ps-pop_420ms_cubic-bezier(0.34,1.56,0.64,1)]",
          // The pop is decoration: the step is already named by aria-current and
          // the visually hidden status word. Reduced motion drops it and the
          // marker simply rests at full size.
          "motion-reduce:animate-none",
          "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText] forced-colors:outline-[CanvasText]",
        ].join(" "),
        pending: [
          "border-dashed border-[var(--mq-ps-pending,#5f615b)] bg-transparent",
          "text-[color:var(--mq-ps-pending,#5f615b)]",
          "forced-colors:border-[GrayText] forced-colors:text-[GrayText]",
        ].join(" "),
      },
    },
    defaultVariants: { state: "pending" },
  },
);

const labelVariants = cva(
  "mt-[8px] block text-[length:var(--mq-ps-label,13px)] leading-[1.3]",
  {
    variants: {
      state: {
        completed: "font-bold text-[color:var(--mq-ps-text,#171817)]",
        current:
          "font-black text-[color:var(--mq-ps-text,#171817)] underline decoration-2 underline-offset-[4px]",
        pending: "font-medium text-[color:var(--mq-ps-pending,#5f615b)]",
      },
    },
    defaultVariants: { state: "pending" },
  },
);

/**
 * The connector track — the unfinished rule between one marker and the next.
 * Positioned relative to the step whose right edge it leaves, so with no gap on
 * the list the two `+4px`/`-8px` insets leave a symmetric breath around each
 * marker. Always dashed: what marks a segment finished is the solid fill that
 * grows over it, so completed vs pending is a shape difference, not only colour.
 */
const connectorVariants = cva(
  [
    "pointer-events-none absolute top-[calc(var(--mq-ps-marker,32px)/2_-_1px)]",
    "left-[calc(50%_+_var(--mq-ps-marker,32px)/2_+_4px)]",
    "w-[calc(100%_-_var(--mq-ps-marker,32px)_-_8px)] border-t-2 border-dashed",
    "border-[var(--mq-ps-connector-track,#b7b9b2)]",
    "forced-colors:border-[CanvasText]",
  ].join(" "),
);

/**
 * The line that advances over a connector once its step is finished.
 *
 * Drawn as a child so it can grow from one end — a border cannot: it is either
 * there or it is not. It scales from the inline start, a compositor-only
 * property that reads correctly on a 2px rule.
 *
 * `scale`, not `transform`: Tailwind v4 writes its scale utilities to the
 * standalone property, so a transition naming `transform` would animate nothing.
 * Only `scale` changes between the two states, so it is the only thing listed.
 */
const connectorFillVariants = cva(
  [
    "pointer-events-none absolute inset-x-0 top-[-2px] h-[2px] origin-left rounded-full",
    "bg-[var(--mq-ps-connector,#252724)]",
    "transition-[scale] duration-[420ms] ease-[cubic-bezier(0.22,1.25,0.36,1)]",
    // Reduced motion keeps the end state and drops only the travel: the filled
    // connector is what says "this step is done", so it must never be cancelled.
    "motion-reduce:transition-none",
    // Background colours are discarded in forced colours, so the finished run
    // takes Highlight to stay distinct from the dashed CanvasText track.
    "forced-colors:bg-[Highlight]",
  ].join(" "),
  {
    variants: {
      state: {
        completed: "scale-100",
        pending: "scale-0",
      },
    },
    defaultVariants: { state: "pending" },
  },
);

export type ProgressStep = {
  /** Stable identity used as the React key. */
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  state: StepState;
};

export type ProgressStepsStatusLabels = Record<StepState, string>;

const DEFAULT_STATUS_LABELS: ProgressStepsStatusLabels = {
  completed: "Completed",
  current: "Current step",
  pending: "Pending",
};

export type ProgressStepsProps = Omit<
  React.ComponentPropsWithRef<"ol">,
  "children"
> &
  VariantProps<typeof listVariants> & {
    /** The ordered steps to render, each with its own state. */
    steps: readonly ProgressStep[];
    /** Catalog material tag. Purely reflected on `data-material`; no style branch. */
    material?: MaterialSlug;
    /** Overrides the visually hidden status words for localisation. */
    statusLabels?: Partial<ProgressStepsStatusLabels>;
  };

export function ProgressSteps({
  className,
  material,
  size = "md",
  statusLabels,
  steps,
  variant = "default",
  ...props
}: ProgressStepsProps) {
  const labels = { ...DEFAULT_STATUS_LABELS, ...statusLabels };

  return (
    <>
      <ProgressStepsKeyframes />
      <ol
        {...props}
        // `list-none` (from the variant) drops the implicit list role in
        // Safari/VoiceOver; restore it explicitly so the step count/sequence
        // stays exposed even though the ordinal number is aria-hidden.
        role="list"
        className={cn(listVariants({ size, variant }), className)}
        data-material={material ?? "adaptive"}
        data-variant={variant}
      >
        {steps.map((step, index) => {
          const isCompleted = step.state === "completed";
          const isCurrent = step.state === "current";
          const connectorState = isCompleted ? "completed" : "pending";

          return (
            <li
              aria-current={isCurrent ? "step" : undefined}
              className={itemVariants()}
              data-step-state={step.state}
              key={step.id}
            >
              <span aria-hidden="true" className={markerVariants({ state: step.state })}>
                {isCompleted ? <Check strokeWidth={3} /> : index + 1}
              </span>

              <span className="min-w-0">
                <span className="sr-only">{labels[step.state]}: </span>
                <span className={labelVariants({ state: step.state })}>{step.label}</span>
                {step.description ? (
                  <span className="mt-[3px] block text-[0.86em] leading-[1.45] text-[color:var(--mq-ps-muted,#565851)] forced-colors:text-[CanvasText]">
                    {step.description}
                  </span>
                ) : null}
              </span>

              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={connectorVariants()}
                  data-step-connector={connectorState}
                >
                  <span className={connectorFillVariants({ state: connectorState })} />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </>
  );
}

export { listVariants as progressStepsVariants };
