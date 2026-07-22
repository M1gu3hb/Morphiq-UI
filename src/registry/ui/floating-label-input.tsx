"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Floating Label Input
 *
 * A real `<input>` whose `<label>` starts sitting where a placeholder would and
 * floats up — shrinking as it goes — the moment the field is focused OR holds a
 * value. Self-contained by design: every material recipe lives in this file, no
 * class comes from a global stylesheet, and every local custom property carries
 * a literal fallback, so copying this file (plus `src/lib/cn.ts`) reproduces the
 * whole look.
 *
 * The float is pure CSS, no value-tracking JavaScript. The control carries a
 * single-space `placeholder=" "` and the `peer` class; the label — a sibling
 * that follows it in the DOM — reacts through `peer-focus` (focused) and
 * `peer-[:not(:placeholder-shown)]` (filled). Only compositor-friendly
 * `translate` and `scale` animate, never `font-size`, so the motion never
 * triggers layout. The visible `<label htmlFor>` is the accessible name; the
 * space placeholder is decorative, present only so `:placeholder-shown` can tell
 * empty from filled.
 *
 * Local theming knobs (each used with a literal fallback):
 *
 *   --mq-field         control background
 *   --mq-field-strong  control background for the `filled` variant
 *   --mq-grad          material lighting over the default surface
 *   --mq-grad-strong   material lighting over the filled surface
 *   --mq-edge          tactile contact edge
 *   --mq-brd           resting border
 *   --mq-brd-focus     border once focused
 *   --mq-text          typed text + floated label
 *   --mq-placeholder   resting label (held to the body-text contrast bar)
 *   --mq-ring          focus ring
 *   --mq-error         error border + floated label + message
 *   --mq-radius        corner radius (set by size)
 *
 * Contrast contract, inherited verbatim from `Input`: the resting label uses
 * `--mq-placeholder` and the floated label `--mq-text`, both of which measure at
 * or above 4.5:1 against the control's own surface on every material — a floated
 * label is informative, so it is held to the same bar as body text.
 */

/**
 * Palette per material, as local custom properties only — no layout, no
 * decoration. Copied from `Input` so the two fields read as one system.
 *
 * Applied twice: to the control itself (what makes a bare field self-contained)
 * and to the field wrapper, because the error message is a *sibling* of the
 * control and could never inherit `--mq-error` from it.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-field:#f7e9de] [--mq-field-strong:#efd9c8] [--mq-edge:#dcc4b2]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.38),rgba(151,92,58,0.06))]",
    "[--mq-grad-strong:linear-gradient(180deg,rgba(255,255,255,0.26),rgba(151,92,58,0.08))]",
    "[--mq-brd:rgba(120,80,55,0.30)] [--mq-brd-focus:#c9482f]",
    "[--mq-text:#33261e] [--mq-placeholder:#6a5346]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
  ].join(" "),
  glass: [
    "[--mq-field:rgba(255,255,255,0.66)] [--mq-field-strong:rgba(255,255,255,0.82)] [--mq-edge:rgba(255,255,255,0.86)]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
    "[--mq-grad-strong:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0))]",
    "[--mq-brd:rgba(255,255,255,0.75)] [--mq-brd-focus:rgba(255,255,255,0.98)]",
    "[--mq-text:#1e1e1b] [--mq-placeholder:#36362f]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  skeuo: [
    "[--mq-field:#e6e3da] [--mq-field-strong:#d7d3c9] [--mq-edge:#a8a49b]",
    "[--mq-grad:linear-gradient(180deg,#f2efe7,#dcd8ce)]",
    "[--mq-grad-strong:linear-gradient(180deg,#e4e0d6,#cec9be)]",
    "[--mq-brd:rgba(25,25,23,0.52)] [--mq-brd-focus:rgba(25,25,23,0.60)]",
    "[--mq-text:#23231f] [--mq-placeholder:#4a4943]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  adaptive: [
    "[--mq-field:#ffffff] [--mq-field-strong:#f1f0ec] [--mq-edge:transparent]",
    "[--mq-grad:none] [--mq-grad-strong:none]",
    "[--mq-brd:rgba(23,24,23,0.22)] [--mq-brd-focus:#171817]",
    "[--mq-text:#1c1c19] [--mq-placeholder:#55554e]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
    "dark:[--mq-field:#232327] dark:[--mq-field-strong:#2b2b31]",
    "dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-brd-focus:#f1efe9]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-placeholder:#b9b7b0]",
    "dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
  ].join(" "),
} as const;

type FieldMaterial = keyof typeof MATERIAL_TOKENS;
type FieldVariant = "default" | "filled" | "underline";
type FieldSize = "sm" | "md" | "lg";

/**
 * Tactile depth per material — copied from `Input`.
 *
 * Each recipe keeps the same number of shadow layers, in the same inset order,
 * across rest, hover and focus, so CSS interpolates the focus well rather than
 * swapping two incompatible shadow lists discretely. At rest the field sits
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

/**
 * The control.
 *
 * Taller than a plain `Input` on purpose: the extra top padding is the lane the
 * label floats into, so a filled field shows the label above the value without
 * the two ever colliding. `peer` lets the label follow the control's focus and
 * filled state through the sibling combinator.
 *
 * The transition list names exactly the properties that change across states —
 * border colour on focus/error, `box-shadow` for the well, `backdrop-filter` on
 * glass hover, opacity when disabled — and nothing that does not, so no phantom
 * transition fires on an unchanged value. `background-image` is absent because a
 * gradient does not interpolate against `none`.
 */
const fieldVariants = cva(
  [
    "peer block w-full appearance-none border",
    "text-[color:var(--mq-text,#33261e)]",
    // The real placeholder is a single space, so nothing is drawn here — but the
    // colour is pinned to the same 4.5:1 token anyway, in case a caller's own
    // autofill hint surfaces it.
    "placeholder:text-[color:var(--mq-placeholder,#6a5346)]",
    "transition-[border-color,background-color,box-shadow,backdrop-filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "focus-visible:border-[var(--mq-brd-focus,#c9482f)]",
    "data-[focus=true]:border-[var(--mq-brd-focus,#c9482f)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Forced colours drop every fill and shadow; a system-coloured border keeps
    // the field's bounds — and its invalid state — perceivable.
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
      // Height is generous and vertical padding is asymmetric: the top padding
      // reserves the floated label's lane, the small bottom padding sits the
      // value low so the two never overlap.
      size: {
        sm: "[--mq-radius:10px] h-[48px] pt-[17px] pb-[2px] px-[12px] text-[13px]/[1.2]",
        md: "[--mq-radius:13px] h-[54px] pt-[19px] pb-[2px] px-[14px] text-[14px]/[1.2]",
        lg: "[--mq-radius:16px] h-[62px] pt-[22px] pb-[3px] px-[16px] text-[15px]/[1.2]",
      },
      // Declared after `size` so `underline` can override the box padding the
      // size axis sets — tailwind-merge keeps the later of two conflicting
      // classes, and cva emits axes in declaration order.
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
        underline: [
          "rounded-none border-0 border-b px-[7px]",
          "[background-color:transparent] [background-image:none]",
          "border-b-[var(--mq-brd,rgba(120,80,55,0.30))]",
          "focus-visible:border-b-[var(--mq-brd-focus,#c9482f)]",
          "data-[focus=true]:border-b-[var(--mq-brd-focus,#c9482f)]",
          // No box to press into, so the depth is told on the rule: it thickens
          // into a lit seam and casts a short shadow. Same two-layer structure at
          // rest and focus so it still interpolates.
          "shadow-[inset_0_-1px_0_rgba(255,255,255,0),0_0_0_rgba(90,60,45,0)]",
          "hover:shadow-[inset_0_-2px_0_var(--mq-brd,rgba(120,80,55,0.30)),0_2px_4px_rgba(90,60,45,0.10)]",
          "focus-visible:shadow-[inset_0_-2px_0_var(--mq-brd-focus,#c9482f),0_3px_6px_rgba(90,60,45,0.16)]",
          "data-[focus=true]:shadow-[inset_0_-2px_0_var(--mq-brd-focus,#c9482f),0_3px_6px_rgba(90,60,45,0.16)]",
        ].join(" "),
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

/**
 * The floating label itself.
 *
 * At rest it overlays the value position, reading as a placeholder in
 * `--mq-placeholder`. On focus or fill it rises and shrinks via the standalone
 * `translate` and `scale` properties — Tailwind v4 writes `translate-*`/`scale-*`
 * to those, never to `transform`, so the transition names `translate,scale,color`
 * literally rather than `transform`, which would animate nothing and let the
 * label snap. `origin-left` keeps the label's inline-start edge pinned so the
 * shrink reads as a de-emphasis, not a slide.
 *
 * The three float triggers — `peer-focus` (focused), `peer-[:not(:placeholder-shown)]`
 * (filled), and `peer-data-[focus=true]` (the forced-focus preview state) — all
 * land the same translate/scale, so the label floats for focus, for a value, and
 * for a documentation screenshot alike.
 */
const labelVariants = cva(
  [
    "pointer-events-none absolute origin-left whitespace-nowrap rounded-[4px] px-[5px]",
    "font-semibold tracking-[-0.01em] leading-[1]",
    "text-[color:var(--mq-placeholder,#6a5346)]",
    // Transparent at rest so the label reads directly on the material's own
    // (possibly graded) surface with no flat patch behind it; a solid system
    // chip only appears under forced colours, where it backs the CanvasText.
    "bg-transparent",
    // Shrink + recolour on every float trigger. Scale is constant across sizes;
    // only the rise distance is per-size, below.
    "peer-focus:scale-[.82] peer-[:not(:placeholder-shown)]:scale-[.82] peer-data-[focus=true]:scale-[.82]",
    "peer-focus:text-[color:var(--mq-text,#33261e)]",
    "peer-[:not(:placeholder-shown)]:text-[color:var(--mq-text,#33261e)]",
    "peer-data-[focus=true]:text-[color:var(--mq-text,#33261e)]",
    // The error colour follows the control's own aria-invalid, so label and
    // control never disagree about the state.
    "peer-[[aria-invalid=true]]:text-[color:var(--mq-error,#9c2f22)]",
    // Dim in step with a disabled control.
    "peer-disabled:opacity-55",
    // Only translate/scale/colour move; nothing listed here is left unchanged.
    "transition-[translate,scale,color] duration-200 ease-out",
    // Reduced motion drops the travel, not the signal: the label still ends
    // floated, it just arrives instantly.
    "motion-reduce:transition-none",
    // Forced colours: a solid Canvas chip under CanvasText so the label stays
    // legible where the material surface is discarded.
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
    "forced-colors:peer-[[aria-invalid=true]]:text-[Mark]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "top-[25px] left-[7px] text-[13px] peer-focus:-translate-y-[24px] peer-[:not(:placeholder-shown)]:-translate-y-[24px] peer-data-[focus=true]:-translate-y-[24px]",
        md: "top-[28px] left-[9px] text-[14px] peer-focus:-translate-y-[26px] peer-[:not(:placeholder-shown)]:-translate-y-[26px] peer-data-[focus=true]:-translate-y-[26px]",
        lg: "top-[33px] left-[11px] text-[15px] peer-focus:-translate-y-[30px] peer-[:not(:placeholder-shown)]:-translate-y-[30px] peer-data-[focus=true]:-translate-y-[30px]",
      },
      // Declared after `size` so `underline`'s inline-start offset overrides the
      // box-padding-derived one; tailwind-merge keeps the later class.
      variant: {
        default: "",
        filled: "",
        underline: "left-[2px]",
      },
    },
    defaultVariants: { size: "md", variant: "default" },
  },
);

const MESSAGE = "m-0 text-[length:11px] leading-[1.5]";

export type FloatingLabelInputProps = Omit<
  React.ComponentPropsWithRef<"input">,
  "size" | "color" | "placeholder"
> & {
  material?: FieldMaterial;
  variant?: FieldVariant;
  size?: FieldSize;
  /** Marks the control invalid. Drives `aria-invalid` and the error styling. */
  invalid?: boolean;
  /** Visible label. Rendered as a real `<label htmlFor>` and the accessible name. */
  label: React.ReactNode;
  /** Guidance shown under the control while it is valid. */
  helperText?: React.ReactNode;
  /** Error shown instead of `helperText`. Its presence implies `invalid`. */
  errorText?: React.ReactNode;
  /** Class for the field wrapper. `className` still targets the control itself. */
  fieldClassName?: string;
  /** Forces the focused look for documentation previews. */
  "data-focus"?: "true" | "false";
};

/**
 * Label + control + message, wired together.
 *
 * The label is a real `<label htmlFor>` — floating is purely visual, the
 * association is never left to CSS. `aria-describedby` is composed rather than
 * overwritten, so a caller's own description survives. The message region is
 * always mounted, even empty, because an `aria-live` region has to exist before
 * its text arrives for the announcement to be reliable. Ids come from
 * `React.useId()`, so render is deterministic and SSR-safe.
 */
export function FloatingLabelInput({
  "aria-describedby": ariaDescribedBy,
  "data-focus": dataFocus,
  className,
  errorText,
  fieldClassName,
  helperText,
  id,
  invalid = false,
  label,
  material = "clay",
  size = "md",
  type = "text",
  variant = "default",
  ...props
}: FloatingLabelInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? `${generatedId}-input`;
  const messageId = `${generatedId}-message`;
  // `!= null` is not enough: form libraries hand back `""` for "no error", which
  // would otherwise mark the control invalid and point aria-describedby at an
  // empty message.
  const hasError = typeof errorText === "string" ? errorText.trim() !== "" : errorText != null;
  const isInvalid = invalid || hasError;
  const message = hasError ? errorText : helperText;

  const describedBy = [ariaDescribedBy, message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[6px] text-left",
        // Tokens on the wrapper so the message — a sibling of the control, not a
        // descendant — resolves the material's own `--mq-error`.
        MATERIAL_TOKENS[material],
        fieldClassName,
      )}
    >
      <div className="relative w-full">
        <input
          {...props}
          aria-describedby={describedBy || undefined}
          aria-invalid={isInvalid || undefined}
          className={cn(fieldVariants({ material, variant, size }), className)}
          data-focus={dataFocus}
          data-material={material}
          id={inputId}
          // Decorative single space: the visible label is the accessible name.
          // It exists only so `:placeholder-shown` can tell empty from filled;
          // declared after the spread so a caller can never break the float.
          placeholder=" "
          type={type}
        />
        <label className={cn(labelVariants({ size, variant }))} htmlFor={inputId}>
          {label}
        </label>
      </div>
      <p
        aria-live="polite"
        className={cn(
          MESSAGE,
          hasError
            ? "font-bold text-[color:var(--mq-error,#9c2f22)]"
            : "text-[color:currentColor]",
        )}
        id={messageId}
      >
        {message}
      </p>
    </div>
  );
}

export { fieldVariants as floatingLabelInputVariants, labelVariants as floatingLabelVariants };
