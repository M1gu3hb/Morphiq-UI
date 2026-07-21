"use client";

import * as React from "react";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Alert
 *
 * A structured callout for page-level notes and notices. All material and tone
 * recipes live in this file, every local custom property carries a literal
 * fallback, and no style depends on the Morphiq site chrome.
 *
 * Accessibility policy:
 *
 * - `urgency="auto"` maps neutral/info/success to a polite `status` region.
 * - `urgency="auto"` maps warning/danger to an assertive `alert` region.
 * - `urgency="polite" | "assertive" | "off"` overrides that mapping when the
 *   surrounding product flow knows more than the visual tone.
 * - The title is required and the description is `children`; icons are always
 *   decorative. Meaning therefore never depends on colour or icon shape.
 *
 * Local theming knobs:
 *
 *   --mq-body       surface colour
 *   --mq-lit        top gradient stop for skeuo
 *   --mq-edge       clay lower edge
 *   --mq-text       title, description and icon colour
 *   --mq-brd        border colour
 *   --mq-accent     inset tone marker
 *   --mq-icon-bg    icon well colour
 *   --mq-ring       focus ring colour
 */

export type AlertTone = "neutral" | "info" | "success" | "warning" | "danger";
export type AlertUrgency = "auto" | "polite" | "assertive" | "off";

const TONE_ICON: Record<AlertTone, LucideIcon> = {
  neutral: MessageCircle,
  info: Info,
  success: CircleCheck,
  warning: CircleAlert,
  danger: CircleX,
};

const TONE_LABEL: Record<AlertTone, string> = {
  neutral: "Note",
  info: "Information",
  success: "Success",
  warning: "Warning",
  danger: "Error",
};

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Keyframes travel with the component rather than living in a global stylesheet
 * a copier would have to find. React 19 hoists this and deduplicates it by
 * `href`, so a stack of alerts emits one rule rather than one per callout.
 *
 * `translate` is the standalone property Tailwind v4 writes its utilities to,
 * and it is what this animates — there is no `transform` anywhere in the file
 * for it to fight with.
 */
const ALERT_KEYFRAMES = `@keyframes mq-alert-in{from{opacity:0;translate:-8px 0}to{opacity:1;translate:0 0}}@keyframes mq-alert-icon{0%{scale:0.86}55%{scale:1.06}100%{scale:1}}`;

function AlertKeyframes() {
  return (
    <style href="mq-alert-in" precedence="medium">
      {ALERT_KEYFRAMES}
    </style>
  );
}

const alertVariants = cva(
  [
    "relative isolate grid w-full max-w-[min(620px,100%)] grid-cols-[minmax(0,1fr)] items-start overflow-hidden border",
    "data-[has-icon=true]:grid-cols-[auto_minmax(0,1fr)]",
    "gap-[var(--mq-gap,12px)] rounded-[var(--mq-radius,20px)] p-[var(--mq-pad,16px)]",
    "border-[var(--mq-brd,rgba(82,70,56,0.18))] text-[color:var(--mq-text,#332f2a)]",
    "before:pointer-events-none before:absolute before:inset-y-[var(--mq-accent-inset,12px)] before:left-[6px] before:w-[4px] before:rounded-full before:bg-[var(--mq-accent,#332f2a)]",
    // A callout is not an interactive surface, so its *state* changes stay
    // immediate — a reduced-motion user gets exactly the same UI there.
    "data-[state=disabled]:opacity-55 data-[state=loading]:cursor-progress",
    // Signature: an alert arrives rather than appearing. It fades and slides a
    // few pixels off the accent rule on its inline-start edge, so the movement
    // reads as coming from the marker that identifies its tone.
    //
    // Keyframes rather than a transition, because an alert is mounted in its
    // final state and a transition has nothing to run from on the frame an
    // element appears.
    "animate-[mq-alert-in_320ms_cubic-bezier(0.22,1.25,0.36,1)]",
    // The entrance is decoration: the callout is already announced by its role
    // and, for the assertive tones, by its live region. Reduced motion drops
    // the travel and the alert is simply present — never delayed, never hidden.
    "motion-reduce:animate-none",
    FOCUS_RING,
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none forced-colors:before:bg-[CanvasText]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#ece7df)] [--mq-icon-bg:rgba(255,255,255,0.50)]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.70),inset_0_-4px_6px_rgba(75,50,35,0.11),0_4px_0_var(--mq-edge,#cfc4b6),0_12px_24px_rgba(64,45,34,0.13)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(38,40,45,0.94))] [--mq-icon-bg:rgba(255,255,255,0.14)]",
          "backdrop-blur-[18px] backdrop-saturate-[155%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_18px_38px_rgba(24,20,40,0.20)]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f4f2ec),var(--mq-body,#c8c4ba))] [--mq-icon-bg:rgba(255,255,255,0.46)]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.90),inset_0_-4px_6px_rgba(0,0,0,0.15),0_5px_0_var(--mq-edge,#9d998f),0_13px_24px_rgba(35,33,29,0.23)]",
        ].join(" "),
        adaptive: [
          "bg-[var(--mq-body,#171817)] [--mq-icon-bg:rgba(255,255,255,0.14)] dark:[--mq-icon-bg:rgba(0,0,0,0.10)]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.16),0_10px_24px_rgba(20,20,18,0.08)]",
        ].join(" "),
      },
      tone: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        danger: "",
      },
      size: {
        sm: [
          "[--mq-gap:10px] [--mq-pad:12px] [--mq-radius:16px] [--mq-accent-inset:10px]",
          "[--mq-icon-box:30px] [--mq-icon-radius:10px] [--mq-glyph:16px]",
          "[--mq-title-size:12px] [--mq-desc-size:11px]",
        ].join(" "),
        md: [
          "[--mq-gap:12px] [--mq-pad:16px] [--mq-radius:20px] [--mq-accent-inset:12px]",
          "[--mq-icon-box:36px] [--mq-icon-radius:12px] [--mq-glyph:19px]",
          "[--mq-title-size:14px] [--mq-desc-size:12px]",
        ].join(" "),
        lg: [
          "[--mq-gap:14px] [--mq-pad:20px] [--mq-radius:24px] [--mq-accent-inset:14px]",
          "[--mq-icon-box:42px] [--mq-icon-radius:14px] [--mq-glyph:22px]",
          "[--mq-title-size:16px] [--mq-desc-size:13px]",
        ].join(" "),
      },
    },
    compoundVariants: [
      // ---------------------------------------------------------------- clay
      {
        material: "clay",
        tone: "neutral",
        class:
          "[--mq-body:#ece7df] [--mq-edge:#cfc4b6] [--mq-text:#332f2a] [--mq-accent:#332f2a] [--mq-brd:rgba(82,70,56,0.18)] [--mq-ring:#171817]",
      },
      {
        material: "clay",
        tone: "info",
        class:
          "[--mq-body:#bdddf5] [--mq-edge:#8ebbdc] [--mq-text:#173f68] [--mq-accent:#173f68] [--mq-brd:rgba(23,63,104,0.22)] [--mq-ring:#173f68]",
      },
      {
        material: "clay",
        tone: "success",
        class:
          "[--mq-body:#bfe6c8] [--mq-edge:#92c59f] [--mq-text:#174b2b] [--mq-accent:#174b2b] [--mq-brd:rgba(23,75,43,0.22)] [--mq-ring:#174b2b]",
      },
      {
        material: "clay",
        tone: "warning",
        class:
          "[--mq-body:#f4d98b] [--mq-edge:#d2b45f] [--mq-text:#5b3b00] [--mq-accent:#5b3b00] [--mq-brd:rgba(91,59,0,0.22)] [--mq-ring:#5b3b00]",
      },
      {
        material: "clay",
        tone: "danger",
        class:
          "[--mq-body:#f5c2bf] [--mq-edge:#d99090] [--mq-text:#6b2027] [--mq-accent:#6b2027] [--mq-brd:rgba(107,32,39,0.22)] [--mq-ring:#6b2027]",
      },
      // --------------------------------------------------------------- glass
      {
        material: "glass",
        tone: "neutral",
        class:
          "[--mq-body:rgba(38,40,45,0.94)] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        tone: "info",
        class:
          "[--mq-body:rgba(26,72,130,0.94)] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        tone: "success",
        class:
          "[--mq-body:rgba(18,96,62,0.94)] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        tone: "warning",
        class:
          "[--mq-body:rgba(101,67,10,0.94)] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        tone: "danger",
        class:
          "[--mq-body:rgba(134,35,45,0.94)] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      // --------------------------------------------------------------- skeuo
      {
        material: "skeuo",
        tone: "neutral",
        class:
          "[--mq-lit:#f4f2ec] [--mq-body:#c8c4ba] [--mq-edge:#9d998f] [--mq-text:#25241f] [--mq-accent:#25241f] [--mq-brd:rgba(37,36,31,0.26)] [--mq-ring:#171817]",
      },
      {
        material: "skeuo",
        tone: "info",
        class:
          "[--mq-lit:#d9e8f4] [--mq-body:#96b8d4] [--mq-edge:#779bb8] [--mq-text:#153750] [--mq-accent:#153750] [--mq-brd:rgba(21,55,80,0.28)] [--mq-ring:#153750]",
      },
      {
        material: "skeuo",
        tone: "success",
        class:
          "[--mq-lit:#dff0df] [--mq-body:#9fc7a8] [--mq-edge:#7ba889] [--mq-text:#143b23] [--mq-accent:#143b23] [--mq-brd:rgba(20,59,35,0.28)] [--mq-ring:#143b23]",
      },
      {
        material: "skeuo",
        tone: "warning",
        class:
          "[--mq-lit:#f6e7b0] [--mq-body:#d3b35e] [--mq-edge:#b18f3f] [--mq-text:#4c3400] [--mq-accent:#4c3400] [--mq-brd:rgba(76,52,0,0.28)] [--mq-ring:#4c3400]",
      },
      {
        material: "skeuo",
        tone: "danger",
        class:
          "[--mq-lit:#f2d3d0] [--mq-body:#ca8f91] [--mq-edge:#aa7075] [--mq-text:#5b1a22] [--mq-accent:#5b1a22] [--mq-brd:rgba(91,26,34,0.28)] [--mq-ring:#5b1a22]",
      },
      // ------------------------------------------------------------ adaptive
      {
        material: "adaptive",
        tone: "neutral",
        class:
          "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-accent:#f6f5f1] [--mq-brd:rgba(0,0,0,0.40)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-accent:#171817] dark:[--mq-brd:rgba(0,0,0,0.40)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        tone: "info",
        class:
          "[--mq-body:#24558d] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(0,0,0,0.32)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#b9d9f4] dark:[--mq-text:#173a5e] dark:[--mq-accent:#173a5e] dark:[--mq-brd:rgba(23,58,94,0.30)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        tone: "success",
        class:
          "[--mq-body:#17643d] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(0,0,0,0.32)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#a9e7bd] dark:[--mq-text:#123d24] dark:[--mq-accent:#123d24] dark:[--mq-brd:rgba(18,61,36,0.30)] dark:[--mq-ring:#f1efe9]",
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
        tone: "danger",
        class:
          "[--mq-body:#8c2531] [--mq-text:#ffffff] [--mq-accent:#ffffff] [--mq-brd:rgba(0,0,0,0.32)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#f3b8ba] dark:[--mq-text:#5a1820] dark:[--mq-accent:#5a1820] dark:[--mq-brd:rgba(90,24,32,0.30)] dark:[--mq-ring:#f1efe9]",
      },
    ],
    defaultVariants: {
      material: "clay",
      tone: "neutral",
      size: "md",
    },
  },
);

function resolveUrgency(tone: AlertTone, urgency: AlertUrgency) {
  if (urgency !== "auto") return urgency;
  return tone === "warning" || tone === "danger" ? "assertive" : "polite";
}

function ToneIcon({ tone }: { tone: AlertTone }) {
  const Icon = TONE_ICON[tone];
  return <Icon />;
}

export type AlertProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-live" | "children" | "color" | "role" | "title"
> &
  VariantProps<typeof alertVariants> & {
    /** Required visible heading; carries the tone's meaning in words. */
    title: React.ReactNode;
    /** Accessible semantic label; override it when localising the component. */
    toneLabel?: React.ReactNode;
    /** Required descriptive content announced with the title. */
    children: React.ReactNode;
    /** Optional action supplied by the caller, normally a button or link. */
    action?: React.ReactNode;
    /** Custom decorative icon. Pass `false` to remove the default tone icon. */
    icon?: React.ReactNode;
    /** Live-region policy; `auto` derives urgency from tone. */
    urgency?: AlertUrgency;
  };

export function Alert({
  action,
  children,
  className,
  icon,
  material,
  size,
  title,
  tone,
  toneLabel,
  urgency = "auto",
  ...props
}: AlertProps) {
  const resolvedTone: AlertTone = tone ?? "neutral";
  const resolvedUrgency = resolveUrgency(resolvedTone, urgency);
  const resolvedIcon = icon === undefined ? <ToneIcon tone={resolvedTone} /> : icon;
  const liveRole =
    resolvedUrgency === "assertive"
      ? "alert"
      : resolvedUrgency === "polite"
        ? "status"
        : undefined;

  return (
    <>
      <AlertKeyframes />
      <div
          {...props}
          aria-atomic={liveRole ? true : undefined}
        aria-live={liveRole ? resolvedUrgency : undefined}
        className={cn(alertVariants({ material, tone: resolvedTone, size }), className)}
        data-has-icon={resolvedIcon ? "true" : undefined}
        data-material={material ?? "clay"}
        data-tone={resolvedTone}
        data-urgency={resolvedUrgency}
        role={liveRole}
      >
        {resolvedIcon ? (
          <span
            aria-hidden="true"
            className={cn(
              "relative z-10 grid place-items-center",
              "size-[var(--mq-icon-box,36px)] rounded-[var(--mq-icon-radius,12px)]",
              "bg-[var(--mq-icon-bg,rgba(255,255,255,0.50))] text-[color:var(--mq-accent,#332f2a)]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
              "[&>svg]:size-[var(--mq-glyph,19px)]",
              // A micro-pulse a beat behind the callout itself, so the eye lands
              // on the tone marker last. Decoration on a glyph that is already
              // aria-hidden, so reduced motion simply drops it.
              "animate-[mq-alert-icon_360ms_cubic-bezier(0.34,1.56,0.64,1)_80ms_both]",
              "motion-reduce:animate-none",
              "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
            )}
            data-alert-icon=""
          >
            {resolvedIcon}
          </span>
        ) : null}
      <div className="relative z-10 min-w-0" data-alert-content="">
          <div
            className="text-[length:var(--mq-title-size,14px)] leading-[1.25] font-extrabold tracking-[-0.01em]"
            data-alert-title=""
          >
            <span className="sr-only" data-alert-tone-label="">
              {toneLabel ?? TONE_LABEL[resolvedTone]}:{" "}
            </span>
            {title}
          </div>
          <div
            className="mt-[4px] text-[length:var(--mq-desc-size,12px)] leading-[1.55] font-medium [&>p]:m-0"
            data-alert-description=""
          >
            {children}
          </div>
          {action ? (
            <div className="mt-[10px] flex flex-wrap items-center gap-[8px]" data-alert-action="">
              {action}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export { alertVariants };
