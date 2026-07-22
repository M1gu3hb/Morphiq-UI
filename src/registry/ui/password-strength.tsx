"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Password Strength
 *
 * A password field with a live strength meter and a show/hide toggle, built on a
 * real `<input>` so typing, selection, autofill and form participation are the
 * browser's rather than a reimplementation. Toggling visibility only flips the
 * input's `type` on the same element, so the typed value is never lost.
 *
 * The level is communicated by TEXT, never by colour alone. A segmented bar plus
 * a written label ("Weak" / "Fair" / "Good" / "Strong") sit together: the bar's
 * hue only supplements the word, and the word is repeated into an `aria-live`
 * region so the level is announced as the user types. The score is derived
 * deterministically from length and character variety — no randomness, so it is
 * SSR-safe and stable.
 *
 * Local theming knobs (each used with a literal fallback):
 *
 *   --mq-field         control background
 *   --mq-field-strong  control background for the `filled` variant
 *   --mq-grad          material lighting over the default surface
 *   --mq-grad-strong   material lighting over the filled surface
 *   --mq-edge          tactile contact edge
 *   --mq-brd           resting border (also the meter segment border)
 *   --mq-brd-focus     border once focused
 *   --mq-text          typed text and the visible level label
 *   --mq-placeholder   placeholder text
 *   --mq-icon          the show/hide glyph (informative, held to 4.5:1)
 *   --mq-track         empty meter segment / toggle hover wash
 *   --mq-meter         filled meter segment (set per score tier)
 *   --mq-ring          focus ring
 *   --mq-error         error border + error message
 *   --mq-radius        corner radius (set by size)
 *
 * Contrast contract: typed text AND placeholder both measure at or above 4.5:1
 * against the control's surface on every material — the values are Input's own.
 * The visible level label uses `--mq-text` (the darkest ink), so it clears 4.5:1
 * without leaning on the bar's colour, and the glyph is held to the same bar.
 */

/**
 * Palette per material, as local custom properties only. Applied to the field
 * wrapper (so the meter, level label and message — all siblings of the control —
 * resolve the material's own tokens) and to the control itself (so a copied
 * control is self-contained). The base six tokens are Input's exact literals;
 * `--mq-icon`, `--mq-track` and the tier `--mq-meter` are the additions this
 * component needs.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-field:#f7e9de] [--mq-field-strong:#efd9c8] [--mq-edge:#dcc4b2]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.38),rgba(151,92,58,0.06))]",
    "[--mq-grad-strong:linear-gradient(180deg,rgba(255,255,255,0.26),rgba(151,92,58,0.08))]",
    "[--mq-brd:rgba(120,80,55,0.30)] [--mq-brd-focus:#c9482f]",
    "[--mq-text:#33261e] [--mq-placeholder:#6a5346]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
    "[--mq-icon:#5c463a] [--mq-track:rgba(120,80,55,0.16)]",
  ].join(" "),
  glass: [
    "[--mq-field:rgba(255,255,255,0.66)] [--mq-field-strong:rgba(255,255,255,0.82)] [--mq-edge:rgba(255,255,255,0.86)]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
    "[--mq-grad-strong:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0))]",
    "[--mq-brd:rgba(255,255,255,0.75)] [--mq-brd-focus:rgba(255,255,255,0.98)]",
    "[--mq-text:#1e1e1b] [--mq-placeholder:#36362f]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
    "[--mq-icon:#2c2c26] [--mq-track:rgba(24,20,40,0.22)]",
  ].join(" "),
  skeuo: [
    "[--mq-field:#e6e3da] [--mq-field-strong:#d7d3c9] [--mq-edge:#a8a49b]",
    "[--mq-grad:linear-gradient(180deg,#f2efe7,#dcd8ce)]",
    "[--mq-grad-strong:linear-gradient(180deg,#e4e0d6,#cec9be)]",
    "[--mq-brd:rgba(25,25,23,0.52)] [--mq-brd-focus:rgba(25,25,23,0.60)]",
    "[--mq-text:#23231f] [--mq-placeholder:#4a4943]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
    "[--mq-icon:#3f3e39] [--mq-track:rgba(25,25,23,0.16)]",
  ].join(" "),
  adaptive: [
    "[--mq-field:#ffffff] [--mq-field-strong:#f1f0ec] [--mq-edge:transparent]",
    "[--mq-grad:none] [--mq-grad-strong:none]",
    "[--mq-brd:rgba(23,24,23,0.22)] [--mq-brd-focus:#171817]",
    "[--mq-text:#1c1c19] [--mq-placeholder:#55554e]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
    "[--mq-icon:#494942] [--mq-track:rgba(23,24,23,0.14)]",
    "dark:[--mq-field:#232327] dark:[--mq-field-strong:#2b2b31]",
    "dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-brd-focus:#f1efe9]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-placeholder:#b9b7b0]",
    "dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
    "dark:[--mq-icon:#c8c6bf] dark:[--mq-track:rgba(255,255,255,0.16)]",
  ].join(" "),
} as const;

/**
 * Tactile depth per material — Input's exact recipes. Each keeps the same number
 * of shadow layers, in the same inset order, across rest/hover/focus, so the
 * focus well interpolates instead of swapping discretely: at rest the field sits
 * proud, hover lifts it, focus presses it into a well.
 */
const DEPTH = {
  clay: {
    rest: "shadow-[inset_0_3px_4px_rgba(255,255,255,0.78),inset_0_-4px_7px_rgba(140,90,60,0.14),inset_0_0_0_rgba(120,60,40,0),0_2px_0_var(--mq-edge,#dcc4b2),0_5px_11px_rgba(90,60,45,0.13)]",
    hover:
      "hover:shadow-[inset_0_3px_4px_rgba(255,255,255,0.88),inset_0_-4px_7px_rgba(140,90,60,0.16),inset_0_0_0_rgba(120,60,40,0),0_4px_0_var(--mq-edge,#dcc4b2),0_9px_17px_rgba(90,60,45,0.18)]",
    focus:
      "focus-visible:shadow-[inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_6px_rgba(140,90,60,0.10),inset_0_5px_10px_rgba(120,60,40,0.27),0_1px_0_var(--mq-edge,#dcc4b2),0_2px_4px_rgba(90,60,45,0.10)] " +
      "data-[focus=true]:shadow-[inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_6px_rgba(140,90,60,0.10),inset_0_5px_10px_rgba(120,60,40,0.27),0_1px_0_var(--mq-edge,#dcc4b2),0_2px_4px_rgba(90,60,45,0.10)]",
  },
  glass: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.86),inset_0_-1px_0_rgba(255,255,255,0.22),inset_0_0_0_rgba(24,20,40,0),0_7px_20px_rgba(24,20,40,0.15)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(255,255,255,0.27),inset_0_0_0_rgba(24,20,40,0),0_11px_28px_rgba(24,20,40,0.22)] hover:backdrop-blur-[22px]",
    focus:
      "focus-visible:shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(255,255,255,0.20),inset_0_5px_12px_rgba(24,20,40,0.22),0_2px_6px_rgba(24,20,40,0.12)] " +
      "data-[focus=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(255,255,255,0.20),inset_0_5px_12px_rgba(24,20,40,0.22),0_2px_6px_rgba(24,20,40,0.12)]",
  },
  skeuo: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-3px_5px_rgba(0,0,0,0.15),inset_0_0_0_rgba(0,0,0,0),0_2px_0_var(--mq-edge,#a8a49b),0_5px_10px_rgba(38,36,31,0.20)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.99),inset_0_-3px_5px_rgba(0,0,0,0.17),inset_0_0_0_rgba(0,0,0,0),0_3px_0_var(--mq-edge,#a8a49b),0_8px_15px_rgba(38,36,31,0.25)]",
    focus:
      "focus-visible:shadow-[inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-2px_4px_rgba(0,0,0,0.10),inset_0_5px_11px_rgba(0,0,0,0.32),0_1px_0_var(--mq-edge,#a8a49b),0_2px_3px_rgba(38,36,31,0.15)] " +
      "data-[focus=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-2px_4px_rgba(0,0,0,0.10),inset_0_5px_11px_rgba(0,0,0,0.32),0_1px_0_var(--mq-edge,#a8a49b),0_2px_3px_rgba(38,36,31,0.15)]",
  },
  adaptive: {
    rest: "shadow-[inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.10)]",
    hover: "hover:shadow-[inset_0_0_0_rgba(20,20,18,0),0_6px_16px_rgba(20,20,18,0.16)]",
    focus:
      "focus-visible:shadow-[inset_0_3px_7px_rgba(20,20,18,0.17),0_1px_2px_rgba(20,20,18,0.08)] " +
      "data-[focus=true]:shadow-[inset_0_3px_7px_rgba(20,20,18,0.17),0_1px_2px_rgba(20,20,18,0.08)]",
  },
} as const;

type PasswordMaterial = keyof typeof MATERIAL_TOKENS;

/** Level words, indexed by score (1…4). The word is the source of truth. */
const LEVELS = ["Weak", "Fair", "Good", "Strong"] as const;

const STRENGTH_MAX = 4;

/**
 * Filled-segment colour per score tier. Literal strings so Tailwind emits them.
 * These only supplement the written level; nothing depends on the hue.
 */
const METER_TONE: Record<number, string> = {
  0: "[--mq-meter:#9a938a]",
  1: "[--mq-meter:#b23b1e]",
  2: "[--mq-meter:#b7791f]",
  3: "[--mq-meter:#4d7c0f]",
  4: "[--mq-meter:#1f7a43]",
};

const ICON_SIZE = { sm: "size-[14px]", md: "size-[16px]", lg: "size-[18px]" } as const;
const BUTTON_SIZE = {
  sm: "me-[8px] size-[22px]",
  md: "me-[10px] size-[26px]",
  lg: "me-[13px] size-[30px]",
} as const;
const SEGMENT_HEIGHT = { sm: "h-[5px]", md: "h-[6px]", lg: "h-[7px]" } as const;

const passwordFieldVariants = cva(
  [
    "block w-full appearance-none border [grid-area:1/1]",
    "text-[color:var(--mq-text,#33261e)]",
    "placeholder:text-[color:var(--mq-placeholder,#6a5346)]",
    // Exactly the properties any state changes — Input's exact list. Border on
    // focus/error, box-shadow on hover/focus, backdrop-filter on glass hover,
    // opacity when disabled. The `filled` variant swaps background.
    "transition-[border-color,background-color,box-shadow,backdrop-filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    // Keyboard focus presses the field into a well and draws the outline; the
    // outline is the affordance of record and is never removed.
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "focus-visible:border-[var(--mq-brd-focus,#c9482f)]",
    "data-[focus=true]:border-[var(--mq-brd-focus,#c9482f)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Forced colours drop fills and shadows; a system border keeps the bounds
    // and the invalid state perceivable, and the gradient is cleared by hand.
    "forced-colors:border-[CanvasText] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:backdrop-filter-none",
    "disabled:cursor-not-allowed disabled:opacity-55",
    // `aria-invalid` is the single source of truth for the error look.
    "aria-[invalid=true]:border-[var(--mq-error,#9c2f22)]",
    "aria-[invalid=true]:focus-visible:border-[var(--mq-error,#9c2f22)]",
    "aria-[invalid=true]:data-[focus=true]:border-[var(--mq-error,#9c2f22)]",
    "aria-[invalid=true]:focus-visible:outline-[var(--mq-error,#9c2f22)]",
    "forced-colors:aria-[invalid=true]:border-[Mark]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: `${MATERIAL_TOKENS.clay} ${DEPTH.clay.rest} ${DEPTH.clay.hover} ${DEPTH.clay.focus}`,
        glass: `${MATERIAL_TOKENS.glass} backdrop-blur-[18px] backdrop-saturate-[170%] ${DEPTH.glass.rest} ${DEPTH.glass.hover} ${DEPTH.glass.focus}`,
        skeuo: `${MATERIAL_TOKENS.skeuo} ${DEPTH.skeuo.rest} ${DEPTH.skeuo.hover} ${DEPTH.skeuo.focus}`,
        adaptive: `${MATERIAL_TOKENS.adaptive} ${DEPTH.adaptive.rest} ${DEPTH.adaptive.hover} ${DEPTH.adaptive.focus} pointer-coarse:min-h-[48px]`,
      },
      size: {
        // Inline-end padding reserves the toggle's lane so typed text never runs
        // under the glyph; logical properties so the control mirrors under RTL.
        sm: "[--mq-radius:10px] h-[34px] ps-[10px] pe-[38px] text-[12px]/[1.3]",
        md: "[--mq-radius:13px] h-[42px] ps-[13px] pe-[44px] text-[13px]/[1.3]",
        lg: "[--mq-radius:16px] h-[50px] ps-[16px] pe-[52px] text-[14px]/[1.3]",
      },
      variant: {
        default: [
          "rounded-[var(--mq-radius,13px)] border-[var(--mq-brd,rgba(120,80,55,0.30))]",
          "[background-color:var(--mq-field,#f7e9de)]",
          "[background-image:var(--mq-grad,none)]",
        ].join(" "),
        filled: [
          "rounded-[var(--mq-radius,13px)] border-transparent",
          "[background-color:var(--mq-field-strong,#efd9c8)]",
          "[background-image:var(--mq-grad-strong,none)]",
        ].join(" "),
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

const LABEL =
  // `currentColor`: the label sits on the host's surface, not one of ours.
  "text-[color:currentColor] text-[length:12px] leading-[1.3] font-extrabold tracking-[-0.01em]";

const TOGGLE_BASE = [
  "[grid-area:1/1] z-[1] inline-flex items-center justify-center self-center justify-self-end",
  "cursor-pointer rounded-full text-[color:var(--mq-icon,#5c463a)]",
  // Only colour and background change (background on hover, colour on hover);
  // the outline is not transitioned so it lands the instant focus does.
  "transition-[color,background-color] duration-200 ease-out motion-reduce:transition-none",
  "hover:text-[color:var(--mq-text,#33261e)] hover:[background-color:var(--mq-track,rgba(120,80,55,0.16))]",
  "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
  "forced-colors:focus-visible:outline-[Highlight] forced-colors:text-[CanvasText]",
  "disabled:cursor-not-allowed disabled:opacity-55",
].join(" ");

/**
 * Deterministic strength score in 0…4 from length and character variety. Empty
 * is 0; any non-empty value is at least 1. No randomness, so it is SSR-stable.
 */
export function passwordScore(value: string): number {
  if (value.length === 0) return 0;

  let variety = 0;
  if (/[a-z]/.test(value)) variety += 1;
  if (/[A-Z]/.test(value)) variety += 1;
  if (/\d/.test(value)) variety += 1;
  if (/[^A-Za-z0-9]/.test(value)) variety += 1;

  let points = 0;
  if (value.length >= 8) points += 1;
  if (value.length >= 12) points += 1;
  if (variety >= 2) points += 1;
  if (variety >= 3) points += 1;
  if (variety >= 4 || value.length >= 16) points += 1;

  return Math.min(STRENGTH_MAX, Math.max(1, points));
}

export type PasswordStrengthProps = Omit<
  React.ComponentPropsWithRef<"input">,
  "size" | "color" | "type"
> &
  VariantProps<typeof passwordFieldVariants> & {
    /** Visible label. Rendered as a real `<label htmlFor>`. */
    label: React.ReactNode;
    /** Guidance / rules shown under the field while it is valid. */
    helperText?: React.ReactNode;
    /** Error shown instead of `helperText`. Its presence implies `invalid`. */
    errorText?: React.ReactNode;
    /** Marks the control invalid. Drives `aria-invalid` and the error styling. */
    invalid?: boolean;
    /** Class for the field wrapper. `className` still targets the control. */
    fieldClassName?: string;
    /** Toggle label while the password is hidden. */
    showLabel?: string;
    /** Toggle label while the password is visible. */
    hideLabel?: string;
    /** Force the focus ring in a static preview. */
    "data-focus"?: "true" | "false";
  };

/**
 * Label + control (with an in-field show/hide toggle) + strength meter + message,
 * wired together. `aria-describedby` is composed, never overwritten, so a
 * caller's own description survives; both the strength text and the message live
 * in `aria-live="polite"` regions that are always mounted, so announcements are
 * reliable. Uncontrolled by default (`defaultValue`); pass `value` + `onChange`
 * to control it.
 */
export function PasswordStrength({
  "aria-describedby": ariaDescribedBy,
  className,
  "data-focus": dataFocus,
  defaultValue,
  disabled = false,
  errorText,
  fieldClassName,
  helperText,
  hideLabel = "Hide password",
  id,
  invalid = false,
  label,
  material,
  onChange,
  placeholder,
  showLabel = "Show password",
  size,
  value,
  variant,
  ...rest
}: PasswordStrengthProps) {
  const mat: PasswordMaterial = material ?? "clay";
  const sz = size ?? "md";
  const vnt = variant ?? "default";

  const generatedId = React.useId();
  const inputId = id ?? `${generatedId}-input`;
  const strengthId = `${generatedId}-strength`;
  const messageId = `${generatedId}-message`;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(
    typeof defaultValue === "string" ? defaultValue : "",
  );
  const currentValue = isControlled ? String(value ?? "") : internalValue;

  const [visible, setVisible] = React.useState(false);

  const hasError = typeof errorText === "string" ? errorText.trim() !== "" : errorText != null;
  const isInvalid = invalid || hasError;
  const message = hasError ? errorText : helperText;

  const score = passwordScore(currentValue);
  const levelLabel = score === 0 ? "" : LEVELS[score - 1];
  const strengthText =
    score === 0 ? "Enter a password to measure its strength." : `Password strength: ${levelLabel}.`;
  const meterValueText = score === 0 ? "No password entered" : levelLabel;

  const describedBy = [ariaDescribedBy, strengthId, message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalValue(event.currentTarget.value);
    onChange?.(event);
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[7px] text-left",
        // Tokens on the wrapper so the meter, level label and message — siblings
        // of the control — resolve the material's own error / track / meter vars.
        MATERIAL_TOKENS[mat],
        fieldClassName,
      )}
    >
      <label className={LABEL} htmlFor={inputId}>
        {label}
      </label>

      <span className="relative inline-grid w-full">
        <input
          autoComplete="new-password"
          {...rest}
          aria-describedby={describedBy || undefined}
          aria-invalid={isInvalid || undefined}
          className={cn(passwordFieldVariants({ material: mat, variant: vnt, size: sz }), className)}
          data-focus={dataFocus}
          data-material={mat}
          disabled={disabled}
          id={inputId}
          onChange={handleChange}
          placeholder={placeholder}
          type={visible ? "text" : "password"}
          value={currentValue}
        />
        <button
          // Action-button model: the name states what activating does now
          // ("Show password" while hidden, "Hide password" while visible), which
          // conveys both purpose and state without an aria-pressed that would
          // double-announce it. Pick one channel, not both.
          aria-label={visible ? hideLabel : showLabel}
          className={cn(TOGGLE_BASE, BUTTON_SIZE[sz])}
          disabled={disabled}
          onClick={() => setVisible((previous) => !previous)}
          type="button"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className={ICON_SIZE[sz]} />
          ) : (
            <Eye aria-hidden="true" className={ICON_SIZE[sz]} />
          )}
        </button>
      </span>

      <div className={cn("mt-[1px] flex items-center gap-[8px]", METER_TONE[score])}>
        <div
          aria-label="Password strength"
          aria-valuemax={STRENGTH_MAX}
          aria-valuemin={0}
          aria-valuenow={score}
          aria-valuetext={meterValueText}
          className="flex min-w-0 flex-1 items-center gap-[4px]"
          role="meter"
        >
          {[0, 1, 2, 3].map((index) => (
            <span
              className={cn(
                SEGMENT_HEIGHT[sz],
                "relative flex-1 overflow-hidden rounded-full border",
                "border-[var(--mq-brd,rgba(120,80,55,0.30))]",
                "[background-color:var(--mq-track,rgba(120,80,55,0.16))]",
                "forced-colors:border-[CanvasText]",
              )}
              key={index}
            >
              {/*
                The fill scales in from the inline start. `scale-x-*` writes the
                standalone `scale` property, so the transition names `scale`
                literally — never `transform`, which would animate nothing. Under
                reduced motion the travel is dropped but the final fill is kept.
              */}
              <span
                className={cn(
                  "block h-full w-full origin-left rounded-full",
                  "[background-color:var(--mq-meter,#4d7c0f)]",
                  "transition-[scale] duration-300 ease-out motion-reduce:transition-none",
                  index < score ? "scale-x-100" : "scale-x-0",
                  // Forced colours discard author fills; a filled segment is
                  // marked with the system Highlight, an empty one stays scaled
                  // to zero so only its bordered track shows.
                  "forced-colors:[background-color:Highlight]",
                )}
              />
            </span>
          ))}
        </div>
        {/*
          The written level, authoritative. Announced through the aria-live
          region below, so this copy is aria-hidden to avoid a double read; it
          uses --mq-text (the darkest ink) so it clears 4.5:1 without the bar.
        */}
        <span
          aria-hidden="true"
          className="w-[46px] shrink-0 text-end text-[length:11px] font-bold leading-[1.3] text-[color:var(--mq-text,#33261e)] forced-colors:text-[CanvasText]"
        >
          {levelLabel || "—"}
        </span>
      </div>

      <p
        aria-live="polite"
        className="m-0 text-[length:11px] leading-[1.5] text-[color:currentColor]"
        id={strengthId}
      >
        {strengthText}
      </p>

      <p
        aria-live="polite"
        className={cn(
          "m-0 text-[length:11px] leading-[1.5]",
          hasError ? "font-bold text-[color:var(--mq-error,#9c2f22)]" : "text-[color:currentColor]",
        )}
        id={messageId}
      >
        {message}
      </p>
    </div>
  );
}

export { passwordFieldVariants };
