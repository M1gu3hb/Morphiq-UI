import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Steps
 *
 * A presentational progress sequence built from a real ordered list. The
 * component owns every material token it consumes, and every var() use keeps a
 * literal fallback so the file can be copied without the Morphiq site chrome.
 *
 * Local theming knobs:
 *
 *   --mq-steps-surface            list surface
 *   --mq-steps-text               primary label
 *   --mq-steps-muted              description
 *   --mq-steps-active             completed/current marker
 *   --mq-steps-active-text        content on a completed marker
 *   --mq-steps-pending            pending marker and label
 *   --mq-steps-connector          completed connector
 *   --mq-steps-connector-pending  unfinished connector
 *   --mq-steps-border             surface border
 *   --mq-steps-ring               current-step outline
 */

/**
 * Keyframes travel with the component rather than living in a global stylesheet
 * a copier would have to find. React 19 hoists this and deduplicates it by
 * `href`, so a page of Steps emits one rule rather than one per marker.
 */
const STEP_KEYFRAMES = `@keyframes mq-step-pop{0%{scale:0.82}60%{scale:1.06}100%{scale:1}}`;

function StepsKeyframes() {
  return (
    <style href="mq-step-pop" precedence="medium">
      {STEP_KEYFRAMES}
    </style>
  );
}

const MATERIAL_TOKENS = {
  clay: [
    "[--mq-steps-surface:#fff4eb] [--mq-steps-text:#4a1d13] [--mq-steps-muted:#684b40]",
    "[--mq-steps-active:#7a2d24] [--mq-steps-active-text:#ffffff] [--mq-steps-pending:#745248]",
    "[--mq-steps-connector:#7a2d24] [--mq-steps-connector-pending:#856458]",
    "[--mq-steps-border:#b78674] [--mq-steps-ring:#4a1d13] [--mq-steps-edge:#e0bcac]",
    "[--mq-steps-shadow:inset_0_1px_0_rgba(255,255,255,0.78),0_8px_20px_rgba(92,48,36,0.12)]",
    "[--mq-steps-grad:linear-gradient(180deg,rgba(255,255,255,0.44),rgba(151,92,58,0.05))]",
    // The marker is a 30px disc, so its depth has to be structural rather than
    // a soft stack: a bright bloom on top, a warm inner shade, the slab's own
    // hard side wall, and a tight cast shadow. Warm ink — clay never casts black.
    "[--mq-steps-marker-shadow:inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2px_3px_rgba(92,48,36,0.30),0_2px_0_var(--mq-steps-edge,#e0bcac),0_4px_8px_rgba(92,48,36,0.22)]",
  ].join(" "),
  glass: [
    "[--mq-steps-surface:rgba(245,251,252,0.96)] [--mq-steps-text:#17343b] [--mq-steps-muted:#466068]",
    "[--mq-steps-active:#075d70] [--mq-steps-active-text:#ffffff] [--mq-steps-pending:#466068]",
    "[--mq-steps-connector:#075d70] [--mq-steps-connector-pending:#607c82]",
    "[--mq-steps-border:#75969d] [--mq-steps-ring:#17343b]",
    "[--mq-steps-shadow:inset_0_1px_0_rgba(255,255,255,0.92),0_10px_24px_rgba(14,54,63,0.14)]",
    "[--mq-steps-grad:linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0))]",
    // A 1px specular filo whose geometry never changes, only its intensity, and
    // a wide cool cast shadow. No side wall: glass has no extrusion.
    "[--mq-steps-marker-shadow:inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(255,255,255,0.18),0_0_0_rgba(14,54,63,0),0_3px_9px_rgba(14,54,63,0.28)]",
  ].join(" "),
  skeuo: [
    "[--mq-steps-surface:#efede6] [--mq-steps-text:#292925] [--mq-steps-muted:#55534d]",
    "[--mq-steps-active:#3f4641] [--mq-steps-active-text:#ffffff] [--mq-steps-pending:#5a5a53]",
    "[--mq-steps-connector:#3f4641] [--mq-steps-connector-pending:#717069]",
    "[--mq-steps-border:#8d8a81] [--mq-steps-ring:#292925] [--mq-steps-edge:#a8a49b]",
    "[--mq-steps-shadow:inset_0_2px_1px_rgba(255,255,255,0.86),inset_0_-2px_4px_rgba(37,36,31,0.10),0_7px_16px_rgba(37,36,31,0.14)]",
    // Warm greige, achromatic ink — the convention select.tsx and tabs.tsx use.
    // The surface IS the gradient, lit over body.
    "[--mq-steps-grad:linear-gradient(180deg,#f2efe7,#dcd8ce)]",
    "[--mq-steps-marker-shadow:inset_0_1px_0_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(0,0,0,0.28),0_2px_0_var(--mq-steps-edge,#a8a49b),0_4px_8px_rgba(37,36,31,0.24)]",
  ].join(" "),
  adaptive: [
    "[--mq-steps-surface:#ffffff] [--mq-steps-text:#171817] [--mq-steps-muted:#565851]",
    "[--mq-steps-active:#252724] [--mq-steps-active-text:#ffffff] [--mq-steps-pending:#5f615b]",
    "[--mq-steps-connector:#252724] [--mq-steps-connector-pending:#74766f]",
    "[--mq-steps-border:#8b8d87] [--mq-steps-ring:#171817]",
    "[--mq-steps-shadow:0_8px_20px_rgba(23,24,23,0.10)]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-steps-grad:none]",
    // Two layers, not four. Adaptive earns its presence from a contact shadow.
    "[--mq-steps-marker-shadow:inset_0_0_0_rgba(23,24,23,0),0_2px_5px_rgba(23,24,23,0.22)]",
    "dark:[--mq-steps-surface:#242428] dark:[--mq-steps-text:#f5f3ee] dark:[--mq-steps-muted:#c1bfb8]",
    "dark:[--mq-steps-active:#f5f3ee] dark:[--mq-steps-active-text:#171817] dark:[--mq-steps-pending:#c4c2bb]",
    "dark:[--mq-steps-connector:#f5f3ee] dark:[--mq-steps-connector-pending:#aaa8a2]",
    "dark:[--mq-steps-border:#8c8b85] dark:[--mq-steps-ring:#ffffff]",
    "dark:[--mq-steps-marker-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_5px_rgba(0,0,0,0.52)]",
  ].join(" "),
} as const;

export type StepState = "completed" | "current" | "pending";
export type StepsVariant = "default" | "numbered";
export type StepsSize = "sm" | "md" | "lg";
export type StepsOrientation = "horizontal" | "vertical";

const stepsVariants = cva(
  [
    "m-0 w-full list-none border",
    "bg-[var(--mq-steps-surface,#fff4eb)] text-[color:var(--mq-steps-text,#4a1d13)]",
    "border-[var(--mq-steps-border,#b78674)] shadow-[var(--mq-steps-shadow,0_8px_20px_rgba(92,48,36,0.12))]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: MATERIAL_TOKENS,
      variant: {
        default: "[--mq-steps-marker-radius:999px]",
        numbered: "[--mq-steps-marker-radius:9px]",
      },
      size: {
        sm: [
          "[--mq-steps-marker:24px] [--mq-steps-gap:14px] [--mq-steps-radius:12px]",
          "gap-[var(--mq-steps-gap,14px)] rounded-[var(--mq-steps-radius,12px)] px-[12px] py-[13px]",
        ].join(" "),
        md: [
          "[--mq-steps-marker:30px] [--mq-steps-gap:18px] [--mq-steps-radius:16px]",
          "gap-[var(--mq-steps-gap,18px)] rounded-[var(--mq-steps-radius,16px)] px-[16px] py-[17px]",
        ].join(" "),
        lg: [
          "[--mq-steps-marker:38px] [--mq-steps-gap:22px] [--mq-steps-radius:20px]",
          "gap-[var(--mq-steps-gap,22px)] rounded-[var(--mq-steps-radius,20px)] px-[20px] py-[21px]",
        ].join(" "),
      },
      orientation: {
        horizontal: "flex items-start",
        vertical: "flex flex-col",
      },
    },
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
      orientation: "horizontal",
    },
  },
);

const stepItemVariants = cva("relative min-w-0", {
  variants: {
    orientation: {
      horizontal: "flex flex-1 flex-col items-center text-center",
      vertical:
        "grid w-full grid-cols-[var(--mq-steps-marker,30px)_minmax(0,1fr)] items-start gap-x-[12px] text-left",
    },
  },
  defaultVariants: { orientation: "horizontal" },
});

const markerVariants = cva(
  [
    "relative z-10 inline-flex size-[var(--mq-steps-marker,30px)] shrink-0 items-center justify-center",
    "rounded-[var(--mq-steps-marker-radius,999px)] border-2 text-[length:12px] font-black tabular-nums",
    // Fills and shadows are discarded in forced colours; background images are
    // NOT, so the wash has to be cleared by hand or it would sit on a
    // system-coloured surface it was never designed against.
    "forced-colors:shadow-none forced-colors:[background-image:none]",
  ].join(" "),
  {
    variants: {
      state: {
        completed: [
          "border-[var(--mq-steps-active,#7a2d24)] bg-[var(--mq-steps-active,#7a2d24)]",
          "text-[color:var(--mq-steps-active-text,#ffffff)]",
          // A finished marker is a solid disc, so it takes the material's raised
          // depth in full.
          "shadow-[var(--mq-steps-marker-shadow,0_2px_5px_rgba(92,48,36,0.22))]",
          "forced-colors:border-[Highlight] forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
        ].join(" "),
        current: [
          "border-[var(--mq-steps-active,#7a2d24)] bg-[var(--mq-steps-surface,#fff4eb)]",
          "[background-image:var(--mq-steps-grad,none)]",
          "shadow-[var(--mq-steps-marker-shadow,0_2px_5px_rgba(92,48,36,0.22))]",
          "text-[color:var(--mq-steps-active,#7a2d24)] outline-2 outline-offset-[3px] outline-[var(--mq-steps-ring,#4a1d13)]",
          // Signature: the marker that just became current lands with a spring.
          // It is a keyframe rather than a transition because this element is
          // already mounted and merely changes state — a transition has nothing
          // to run from when the state it depends on is the one it renders with.
          "animate-[mq-step-pop_420ms_cubic-bezier(0.34,1.56,0.64,1)]",
          // The pulse is decoration: the step is already named by aria-current
          // and by the visually hidden state text. Reduced motion drops it and
          // the marker simply sits there at full size.
          "motion-reduce:animate-none",
          "forced-colors:border-[Highlight] forced-colors:bg-[Canvas] forced-colors:text-[Highlight] forced-colors:outline-[Highlight]",
        ].join(" "),
        pending: [
          "border-dashed border-[var(--mq-steps-pending,#745248)] bg-transparent",
          "text-[color:var(--mq-steps-pending,#745248)]",
          "forced-colors:border-[GrayText] forced-colors:text-[GrayText]",
        ].join(" "),
      },
      size: {
        sm: "text-[10px]",
        md: "text-[12px]",
        lg: "text-[14px]",
      },
    },
    defaultVariants: { state: "pending", size: "md" },
  },
);

const contentVariants = cva("min-w-0", {
  variants: {
    orientation: {
      horizontal: "mt-[8px]",
      vertical: "col-start-2 row-start-1 pt-[2px]",
    },
    size: {
      sm: "text-[11px]",
      md: "text-[12px]",
      lg: "text-[14px]",
    },
  },
  defaultVariants: { orientation: "horizontal", size: "md" },
});

const labelVariants = cva("block leading-[1.3]", {
  variants: {
    state: {
      completed: "font-bold text-[color:var(--mq-steps-text,#4a1d13)]",
      current:
        "font-black text-[color:var(--mq-steps-text,#4a1d13)] underline decoration-[3px] underline-offset-[4px]",
      pending: "font-semibold text-[color:var(--mq-steps-pending,#745248)]",
    },
  },
  defaultVariants: { state: "pending" },
});

const connectorVariants = cva("pointer-events-none absolute", {
  variants: {
    orientation: {
      horizontal: [
        "top-[calc(var(--mq-steps-marker,30px)/2_-_1px)]",
        "left-[calc(50%_+_var(--mq-steps-marker,30px)/2_+_4px)]",
        "w-[calc(100%_-_var(--mq-steps-marker,30px)_-_8px)] border-t-2",
      ].join(" "),
      vertical: [
        "left-[calc(var(--mq-steps-marker,30px)/2_-_1px)]",
        "top-[calc(var(--mq-steps-marker,30px)_+_5px)]",
        "h-[calc(100%_-_var(--mq-steps-marker,30px)_+_var(--mq-steps-gap,18px)_-_10px)] border-l-2",
      ].join(" "),
    },
    // The track is always the unfinished rule. What marks a connector finished
    // is the solid line that grows over it — see `connectorFillVariants`.
    state: {
      completed: "border-dashed border-[var(--mq-steps-connector-pending,#856458)] forced-colors:border-[GrayText]",
      pending:
        "border-dashed border-[var(--mq-steps-connector-pending,#856458)] forced-colors:border-[GrayText]",
    },
  },
  defaultVariants: { orientation: "horizontal", state: "pending" },
});

/**
 * The line that advances over a connector once its step is finished.
 *
 * Drawn as a child rather than by switching the parent's border, because a
 * border cannot grow from one end: it is either there or it is not. This scales
 * from zero along the axis the list runs in, which is a compositor-only property
 * and reads correctly on a 2px rule.
 *
 * `scale`, not `transform`: Tailwind v4 writes its scale utilities to the
 * standalone property, so a transition naming `transform` would animate nothing.
 */
const connectorFillVariants = cva(
  [
    "pointer-events-none absolute bg-[var(--mq-steps-connector,#7a2d24)]",
    "transition-[scale] duration-[420ms] ease-[cubic-bezier(0.22,1.25,0.36,1)]",
    // Reduced motion keeps the end state and drops only the travel: the filled
    // connector is what says "this step is done", so it must never be cancelled.
    "motion-reduce:transition-none",
    // Background colours are discarded in forced colours, so the finished run
    // needs a system colour of its own to stay distinct from the dashed track.
    "forced-colors:bg-[Highlight]",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "inset-x-0 top-[-2px] h-[2px] origin-left",
        vertical: "inset-y-0 left-[-2px] w-[2px] origin-top",
      },
      state: {
        completed: "scale-100",
        pending: "scale-0",
      },
    },
    defaultVariants: { orientation: "horizontal", state: "pending" },
  },
);

export type StepItem = {
  /** Stable identity used as the React key. */
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  state: StepState;
};

export type StepsStatusLabels = Record<StepState, string>;

export type StepsProps = Omit<React.ComponentPropsWithRef<"ol">, "children"> &
  VariantProps<typeof stepsVariants> & {
    steps: readonly StepItem[];
    statusLabels?: Partial<StepsStatusLabels>;
  };

const DEFAULT_STATUS_LABELS: StepsStatusLabels = {
  completed: "Completed",
  current: "Current step",
  pending: "Pending",
};

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
      <path
        d="m3.25 8.25 3 3 6.5-6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
    </svg>
  );
}

export function Steps({
  className,
  material,
  orientation = "horizontal",
  size = "md",
  statusLabels,
  steps,
  variant = "default",
  ...props
}: StepsProps) {
  const labels = { ...DEFAULT_STATUS_LABELS, ...statusLabels };

  return (
    <>
      <StepsKeyframes />
      <ol
        {...props}
      className={cn(stepsVariants({ material, orientation, size, variant }), className)}
      data-material={material ?? "clay"}
      data-orientation={orientation}
      data-variant={variant}
    >
      {steps.map((step, index) => {
        const isCompleted = step.state === "completed";
        const isCurrent = step.state === "current";
        const connectorState = isCompleted ? "completed" : "pending";

        return (
          <li
            aria-current={isCurrent ? "step" : undefined}
            className={stepItemVariants({ orientation })}
            data-step-state={step.state}
            key={step.id}
          >
            <span aria-hidden="true" className={markerVariants({ size, state: step.state })}>
              {isCompleted ? (
                <CheckIcon />
              ) : variant === "numbered" ? (
                index + 1
              ) : isCurrent ? (
                <span className="size-[0.42em] rounded-full bg-current" />
              ) : null}
            </span>

            <span className={contentVariants({ orientation, size })}>
              <span className="sr-only">{labels[step.state]}: </span>
              <span className={labelVariants({ state: step.state })}>{step.label}</span>
              {step.description ? (
                <span className="mt-[4px] block text-[0.88em] leading-[1.45] text-[color:var(--mq-steps-muted,#684b40)] forced-colors:text-[CanvasText]">
                  {step.description}
                </span>
              ) : null}
            </span>

            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={connectorVariants({ orientation, state: connectorState })}
                data-step-connector={connectorState}
              >
                <span
                  className={connectorFillVariants({ orientation, state: connectorState })}
                />
              </span>
            ) : null}
          </li>
        );
      })}
      </ol>
    </>
  );
}

export { stepsVariants };
