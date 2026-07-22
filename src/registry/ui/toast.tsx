"use client";

import * as React from "react";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  MessageCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Toast
 *
 * A transient notice that slides in, announces itself, and auto-closes — with
 * the countdown PAUSED while the pointer or keyboard focus rests on it. All
 * material and tone recipes live in this file, every local custom property
 * carries a literal fallback, and no style depends on the Morphiq site chrome.
 *
 * Accessibility policy (mirrors alert.tsx):
 *
 * - neutral / info / success announce through a polite `status` region.
 * - warning / danger announce through an assertive `alert` region.
 * - `urgency="polite" | "assertive" | "off"` overrides that mapping when the
 *   surrounding flow knows more than the visual tone.
 * - The title is required and the description is `children`; the tone icon is
 *   decorative, and a visually-hidden tone word ("Warning:", …) prefixes the
 *   accessible name — so meaning never rides on colour or icon shape alone.
 * - The toast is non-modal: it never steals focus. A labelled close button
 *   dismisses it; auto-close pauses on hover and on focus so nobody loses a
 *   message mid-read.
 *
 * Stacking: render several `<Toast>` inside a `<ToastViewport>` (a fixed region
 * landmark), or inside any flex column. Each toast owns its own live region, so
 * the viewport is a plain landmark rather than a second, conflicting one.
 *
 * Local theming knobs:
 *
 *   --mq-body       surface colour
 *   --mq-lit        top gradient stop for skeuo
 *   --mq-edge       clay / skeuo lower edge
 *   --mq-text       title, description and glyph colour
 *   --mq-brd        border colour
 *   --mq-accent     inset tone marker + icon glyph
 *   --mq-icon-bg    icon well and close-button hover wash
 *   --mq-ring       focus ring colour
 */

export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";
export type ToastUrgency = "auto" | "polite" | "assertive" | "off";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const DEFAULT_DURATION = 5000;

const TONE_ICON: Record<ToastTone, LucideIcon> = {
  neutral: MessageCircle,
  info: Info,
  success: CircleCheck,
  warning: CircleAlert,
  danger: CircleX,
};

const TONE_LABEL: Record<ToastTone, string> = {
  neutral: "Note",
  info: "Information",
  success: "Success",
  warning: "Warning",
  danger: "Error",
};

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[2px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Keyframes travel with the component rather than living in a global stylesheet
 * a copier would have to find. React 19 hoists this and deduplicates it by
 * `href`, so a stack of toasts emits one rule rather than one per notice.
 *
 * `translate` is the standalone property Tailwind v4 writes its utilities to,
 * and it is what this animates — there is no `transform` anywhere in the file
 * for a `transition` to fight with.
 */
const TOAST_KEYFRAMES = `@keyframes mq-toast-in{from{opacity:0;translate:16px 0}to{opacity:1;translate:0 0}}@keyframes mq-toast-icon{0%{scale:0.86}55%{scale:1.06}100%{scale:1}}`;

function ToastKeyframes() {
  return (
    <style href="mq-toast-in" precedence="medium">
      {TOAST_KEYFRAMES}
    </style>
  );
}

/**
 * The screen-reader announcement, kept OUT of the visible toast.
 *
 * A dynamically inserted `aria-live` region whose text arrives in the SAME
 * mutation as the region itself is frequently NOT spoken by NVDA/JAWS for the
 * polite tones — the region must pre-exist empty and then have its content
 * change. This mounts empty and reveals its text one frame later (a rAF, so it
 * is not a synchronous set-state-in-effect), and because it is only rendered
 * while the toast is open it mounts fresh on every open and re-announces each
 * time. The visible toast carries no live attributes, so there is exactly one
 * announcement path for both polite and assertive urgencies.
 */
function ToastAnnouncer({
  live,
  role,
  children,
}: {
  live: "polite" | "assertive";
  role: "status" | "alert";
  children: React.ReactNode;
}) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div aria-atomic="true" aria-live={live} className="sr-only" role={role}>
      {ready ? children : null}
    </div>
  );
}

const toastVariants = cva(
  [
    "relative isolate grid w-full max-w-[min(420px,100%)] items-start overflow-hidden border",
    "grid-cols-[minmax(0,1fr)_auto] data-[has-icon=true]:grid-cols-[auto_minmax(0,1fr)_auto]",
    "gap-[var(--mq-gap,12px)] rounded-[var(--mq-radius,18px)] p-[var(--mq-pad,14px)]",
    "border-[var(--mq-brd,rgba(82,70,56,0.18))] text-[color:var(--mq-text,#332f2a)]",
    "before:pointer-events-none before:absolute before:inset-y-[var(--mq-accent-inset,11px)] before:left-[6px] before:w-[4px] before:rounded-full before:bg-[var(--mq-accent,#332f2a)]",
    // Signature: a toast arrives rather than appearing. It fades and slides a
    // few pixels in from its inline-end edge (the corner it is usually docked
    // to). Keyframes rather than a transition, because a toast is mounted in its
    // final state and a transition has nothing to run from on the frame it
    // appears.
    "animate-[mq-toast-in_320ms_cubic-bezier(0.22,1.25,0.36,1)]",
    // The entrance is decoration: the toast is already announced by its role and
    // live region. Reduced motion drops the travel and the toast is simply
    // present — never delayed, never hidden.
    "motion-reduce:animate-none",
    // Fills, gradients and shadows are erased in forced-colors mode, so the
    // toast would dissolve into the page; a system-coloured border keeps its
    // bounds and the tone marker stays perceivable.
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
          "[--mq-close-box:24px] [--mq-close-glyph:15px]",
          "[--mq-title-size:12px] [--mq-desc-size:11px]",
        ].join(" "),
        md: [
          "[--mq-gap:12px] [--mq-pad:14px] [--mq-radius:18px] [--mq-accent-inset:11px]",
          "[--mq-icon-box:34px] [--mq-icon-radius:11px] [--mq-glyph:18px]",
          "[--mq-close-box:28px] [--mq-close-glyph:16px]",
          "[--mq-title-size:13px] [--mq-desc-size:12px]",
        ].join(" "),
        lg: [
          "[--mq-gap:14px] [--mq-pad:18px] [--mq-radius:22px] [--mq-accent-inset:13px]",
          "[--mq-icon-box:40px] [--mq-icon-radius:13px] [--mq-glyph:21px]",
          "[--mq-close-box:32px] [--mq-close-glyph:18px]",
          "[--mq-title-size:15px] [--mq-desc-size:13px]",
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

function resolveUrgency(tone: ToastTone, urgency: ToastUrgency) {
  if (urgency !== "auto") return urgency;
  return tone === "warning" || tone === "danger" ? "assertive" : "polite";
}

function ToneIcon({ tone }: { tone: ToastTone }) {
  const Icon = TONE_ICON[tone];
  return <Icon />;
}

export type ToastProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-live" | "children" | "color" | "role" | "title"
> &
  VariantProps<typeof toastVariants> & {
    /** Required visible heading; carries the tone's meaning in words. */
    title: React.ReactNode;
    /** Accessible tone prefix; override it when localising the component. */
    toneLabel?: React.ReactNode;
    /** Required descriptive content announced with the title. */
    children: React.ReactNode;
    /** Custom decorative icon. Pass `false` to remove the default tone icon. */
    icon?: React.ReactNode;
    /** Live-region policy; `auto` derives urgency from tone. */
    urgency?: ToastUrgency;
    /**
     * Auto-close delay in ms. Defaults to 5000. Pass `0` (or a non-finite
     * value) to disable auto-close and require an explicit dismissal.
     */
    duration?: number;
    /** Controlled visibility. Omit to let the toast manage its own. */
    open?: boolean;
    /** Initial visibility for the uncontrolled case. Defaults to `true`. */
    defaultOpen?: boolean;
    /** Fires with the next visibility whenever it changes. */
    onOpenChange?: (open: boolean) => void;
    /** Fires once when the toast closes, for either reason. */
    onClose?: () => void;
    /** Accessible label for the close button. */
    dismissLabel?: string;
  };

export function Toast({
  children,
  className,
  defaultOpen = true,
  dismissLabel = "Dismiss",
  duration = DEFAULT_DURATION,
  icon,
  material,
  onBlur,
  onClose,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  onOpenChange,
  open,
  size,
  title,
  tone,
  toneLabel,
  urgency = "auto",
  ...props
}: ToastProps) {
  const resolvedTone: ToastTone = tone ?? "neutral";
  const resolvedUrgency = resolveUrgency(resolvedTone, urgency);
  const resolvedIcon = icon === undefined ? <ToneIcon tone={resolvedTone} /> : icon;
  const liveRole =
    resolvedUrgency === "assertive"
      ? "alert"
      : resolvedUrgency === "polite"
        ? "status"
        : undefined;

  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;

  // Callbacks are read through a ref so `setOpen` — and therefore the countdown
  // effect below — stays referentially stable even when the caller passes fresh
  // inline handlers each render. Without this the timer would tear down and
  // restart on every parent render.
  const callbacksRef = React.useRef({ onOpenChange, onClose });
  React.useEffect(() => {
    callbacksRef.current = { onOpenChange, onClose };
  });

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      callbacksRef.current.onOpenChange?.(next);
      if (!next) callbacksRef.current.onClose?.();
    },
    [isControlled],
  );

  const autoCloseEnabled = Number.isFinite(duration) && duration > 0;
  const [paused, setPaused] = React.useState(false);

  // Time left on the countdown, banked across pauses. `deadlineRef` is the wall
  // clock the running timer is due to fire at; on teardown the gap between it
  // and now is what remains, so resuming continues rather than restarting.
  const remainingRef = React.useRef(duration);
  const deadlineRef = React.useRef(0);

  // Refill the budget whenever the toast (re)opens or its duration changes.
  // Declared before the countdown effect so, on an opening commit, the refill
  // runs first and the countdown reads the full duration.
  React.useEffect(() => {
    remainingRef.current = duration;
  }, [isOpen, duration]);

  // The countdown. Torn down and rebuilt whenever the toast opens, pauses or
  // resumes; the teardown banks the remaining time and clears the timer, so
  // nothing keeps running after unmount or while the toast is held open.
  React.useEffect(() => {
    if (!isOpen || paused || !autoCloseEnabled) return;
    const budget = remainingRef.current;
    if (budget <= 0) {
      setOpen(false);
      return;
    }
    deadlineRef.current = Date.now() + budget;
    const timer = setTimeout(() => setOpen(false), budget);
    return () => {
      clearTimeout(timer);
      remainingRef.current = Math.max(0, deadlineRef.current - Date.now());
    };
  }, [isOpen, paused, autoCloseEnabled, setOpen]);

  if (!isOpen) return null;

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setPaused(true);
    onMouseEnter?.(event);
  };
  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setPaused(false);
    onMouseLeave?.(event);
  };
  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    setPaused(true);
    onFocus?.(event);
  };
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    // Only resume once focus has actually left the toast, not while it moves
    // between the close button and any action inside it.
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setPaused(false);
    }
    onBlur?.(event);
  };

  return (
    <>
      <ToastKeyframes />
      {liveRole ? (
        <ToastAnnouncer live={resolvedUrgency as "polite" | "assertive"} role={liveRole}>
          {toneLabel ?? TONE_LABEL[resolvedTone]}: {title}
          {children ? <>. {children}</> : null}
        </ToastAnnouncer>
      ) : null}
      <div
        {...props}
        // No live attributes here: the announcement is made by ToastAnnouncer
        // above (a pre-existing region), which the polite tones need to be spoken
        // reliably. This element is the visible, reviewable notification.
        className={cn(toastVariants({ material, tone: resolvedTone, size }), className)}
        data-has-icon={resolvedIcon ? "true" : undefined}
        data-material={material ?? "clay"}
        data-tone={resolvedTone}
        data-urgency={resolvedUrgency}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {resolvedIcon ? (
          <span
            aria-hidden="true"
            className={cn(
              "relative z-10 grid place-items-center",
              "size-[var(--mq-icon-box,34px)] rounded-[var(--mq-icon-radius,11px)]",
              "bg-[var(--mq-icon-bg,rgba(255,255,255,0.50))] text-[color:var(--mq-accent,#332f2a)]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
              "[&>svg]:size-[var(--mq-glyph,18px)]",
              // A micro-pulse a beat behind the toast, so the eye lands on the
              // tone marker last. Decoration on an aria-hidden glyph, so reduced
              // motion simply drops it.
              "animate-[mq-toast-icon_360ms_cubic-bezier(0.34,1.56,0.64,1)_80ms_both]",
              "motion-reduce:animate-none",
              "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
            )}
            data-toast-icon=""
          >
            {resolvedIcon}
          </span>
        ) : null}
        <div className="relative z-10 min-w-0" data-toast-content="">
          <div
            className="text-[length:var(--mq-title-size,13px)] leading-[1.25] font-extrabold tracking-[-0.01em]"
            data-toast-title=""
          >
            <span className="sr-only" data-toast-tone-label="">
              {toneLabel ?? TONE_LABEL[resolvedTone]}:{" "}
            </span>
            {title}
          </div>
          <div
            className="mt-[3px] text-[length:var(--mq-desc-size,12px)] leading-[1.5] font-medium [&>p]:m-0"
            data-toast-description=""
          >
            {children}
          </div>
        </div>
        <button
          aria-label={dismissLabel}
          className={cn(
            "relative z-10 grid shrink-0 cursor-pointer place-items-center self-start",
            "size-[var(--mq-close-box,28px)] rounded-[9px] appearance-none border-0 bg-transparent",
            "text-[color:var(--mq-text,#332f2a)] opacity-70",
            "[&>svg]:size-[var(--mq-close-glyph,16px)]",
            // Only the two properties that change on hover/focus, nothing
            // phantom. No transform or translate is touched, so the Tailwind v4
            // translate/transition trap cannot apply here.
            "transition-[background-color,opacity] duration-150 ease-out motion-reduce:transition-none",
            "hover:bg-[var(--mq-icon-bg,rgba(255,255,255,0.50))] hover:opacity-100",
            "focus-visible:opacity-100",
            FOCUS_RING,
            "forced-colors:text-[CanvasText] forced-colors:hover:bg-[Canvas]",
          )}
          onClick={() => setOpen(false)}
          type="button"
        >
          <X aria-hidden="true" />
        </button>
      </div>
    </>
  );
}

const VIEWPORT_POSITION: Record<ToastPosition, string> = {
  "top-left": "top-0 left-0 items-start",
  "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-0 right-0 items-end",
  "bottom-left": "bottom-0 left-0 items-start",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-0 right-0 items-end",
};

export type ToastViewportProps = React.ComponentPropsWithRef<"div"> & {
  /** Where the stack docks on the screen. Defaults to bottom-right. */
  position?: ToastPosition;
};

/**
 * Fixed container the toasts stack in. It is a region *landmark*, not a second
 * live region: each toast announces itself, so pinning `aria-live` here too
 * would nest live regions and double every announcement. The container ignores
 * the pointer while its children accept it, so the gaps between toasts never
 * swallow clicks on the page beneath.
 */
export function ToastViewport({
  "aria-label": ariaLabel = "Notifications",
  className,
  position = "bottom-right",
  ...props
}: ToastViewportProps) {
  return (
    <div
      {...props}
      aria-label={ariaLabel}
      className={cn(
        "pointer-events-none fixed z-[100] flex max-h-screen w-full max-w-[min(420px,100vw)] flex-col gap-[12px] p-[16px]",
        "[&>*]:pointer-events-auto",
        VIEWPORT_POSITION[position],
        className,
      )}
      role="region"
      tabIndex={-1}
    />
  );
}

export { toastVariants };
