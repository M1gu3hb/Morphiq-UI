"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Input
 *
 * A text field. Self-contained by design: every material recipe lives in this
 * file. It does not read `:root` custom properties and it does not depend on any
 * class from a global stylesheet, so copying this file (plus `src/lib/cn.ts`)
 * into another project reproduces the full look.
 *
 * Two exports, on purpose:
 *
 *   <Input>       the bare control. `className` targets the <input> itself, so
 *                 it behaves the way a component called "Input" is expected to.
 *   <InputField>  the composed field: label + control + message, with the
 *                 `htmlFor` / `aria-describedby` / `aria-invalid` wiring done
 *                 for you. Associating a label is the part teams get wrong, so
 *                 the library does it rather than documenting it.
 *
 * Theming knobs are local CSS variables declared on the control, each used with
 * a literal fallback:
 *
 *   --mq-field         control background
 *   --mq-field-strong  control background for the `filled` variant
 *   --mq-brd           resting border
 *   --mq-brd-focus     border once focused
 *   --mq-text          typed text
 *   --mq-placeholder   placeholder text
 *   --mq-ring          focus ring
 *   --mq-error         error border + error message
 *   --mq-radius        corner radius (set by size)
 *
 * Contrast contract: typed text AND placeholder both measure at or above 4.5:1
 * against the control's own surface on every material — placeholders are held to
 * the same bar as body text, not the 3:1 that decorative grey usually gets away
 * with. The glass recipe carries its own tint so that holds over a white and a
 * black backdrop alike. The label and helper text sit on the host's surface, not
 * on one of ours, so they inherit `currentColor` rather than pinning a value
 * that would be a guess about the page they land on.
 */

/**
 * Palette per material, as local custom properties only — no layout, no
 * decoration.
 *
 * Kept separate so it can be applied twice: to the control itself (which is
 * what makes a bare `<Input>` self-contained) and to `InputField`'s wrapper.
 * The error message is a *sibling* of the control, not a descendant, so it
 * could never inherit `--mq-error` from the input; declaring the tokens on the
 * wrapper is what lets the message use the material's real error colour instead
 * of silently falling back to the literal default.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-field:#fdf6f0] [--mq-field-strong:#f4e7db]",
    "[--mq-brd:rgba(120,80,55,0.30)] [--mq-brd-focus:#c9482f]",
    "[--mq-text:#33261e] [--mq-placeholder:#6a5346]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
  ].join(" "),
  glass: [
    "[--mq-field:rgba(255,255,255,0.66)] [--mq-field-strong:rgba(255,255,255,0.82)]",
    "[--mq-brd:rgba(255,255,255,0.75)] [--mq-brd-focus:rgba(255,255,255,0.98)]",
    "[--mq-text:#1e1e1b] [--mq-placeholder:#36362f]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  skeuo: [
    "[--mq-field:#e6e3da] [--mq-field-strong:#d7d3c9]",
    "[--mq-brd:rgba(25,25,23,0.34)] [--mq-brd-focus:rgba(25,25,23,0.6)]",
    "[--mq-text:#23231f] [--mq-placeholder:#4a4943]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  adaptive: [
    "[--mq-field:#ffffff] [--mq-field-strong:#f1f0ec]",
    "[--mq-brd:rgba(23,24,23,0.22)] [--mq-brd-focus:#171817]",
    "[--mq-text:#1c1c19] [--mq-placeholder:#55554e]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
    "dark:[--mq-field:#232327] dark:[--mq-field-strong:#2b2b31]",
    "dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-brd-focus:#f1efe9]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-placeholder:#b9b7b0]",
    "dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
  ].join(" "),
} as const;

const inputVariants = cva(
  [
    "block w-full appearance-none border bg-[var(--mq-field,#fdf6f0)]",
    "text-[color:var(--mq-text,#33261e)]",
    "placeholder:text-[color:var(--mq-placeholder,#6a5346)]",
    // Exactly the properties that change across states — nothing phantom.
    // Border colour moves on hover/focus/error, the shadow on focus, the
    // background on the filled variant, and opacity when disabled.
    "transition-[border-color,box-shadow,background-color,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Forced colours drop every fill and shadow, so an input styled only by its
    // background would vanish into the page. A system-coloured border keeps the
    // field's bounds — and its invalid state — perceivable.
    "forced-colors:border-[CanvasText]",
    "disabled:cursor-not-allowed disabled:opacity-55",
    // `aria-invalid` is the single source of truth for the error look: no
    // separate prop can drift out of sync with what assistive tech is told.
    "aria-[invalid=true]:border-[var(--mq-error,#9c2f22)]",
    "aria-[invalid=true]:focus-visible:outline-[var(--mq-error,#9c2f22)]",
    "forced-colors:aria-[invalid=true]:border-[Mark]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: `${MATERIAL_TOKENS.clay} shadow-[inset_0_2px_4px_rgba(120,80,55,0.14)]`,
        glass: `${MATERIAL_TOKENS.glass} backdrop-blur-[16px] backdrop-saturate-[170%] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]`,
        // A text field is a recess, not a raised panel: the light falls in from
        // the top edge rather than lifting the surface.
        skeuo: `${MATERIAL_TOKENS.skeuo} shadow-[inset_0_2px_4px_rgba(0,0,0,0.22),inset_0_-1px_0_rgba(255,255,255,0.7)]`,
        // Polymorphic: no ornament. It adapts — the palette follows the colour
        // scheme. Safe here because the control has an opaque surface that flips
        // together with its text.
        adaptive: `${MATERIAL_TOKENS.adaptive} shadow-[0_1px_2px_rgba(20,20,18,0.06)]`,
      },
      size: {
        sm: "[--mq-radius:10px] h-[34px] px-[10px] text-[length:12px]",
        md: "[--mq-radius:13px] h-[42px] px-[13px] text-[length:13px]",
        lg: "[--mq-radius:16px] h-[50px] px-[16px] text-[length:14px]",
      },
      // Declared after `size` so `underline` can drop the padding and radius the
      // size axis sets.
      variant: {
        default: "rounded-[var(--mq-radius,13px)] border-[var(--mq-brd,rgba(120,80,55,0.30))]",
        filled: [
          "rounded-[var(--mq-radius,13px)] border-transparent",
          "bg-[var(--mq-field-strong,#f4e7db)]",
          "focus-visible:border-[var(--mq-brd-focus,#c9482f)]",
        ].join(" "),
        underline: [
          "rounded-none border-0 border-b bg-transparent px-[2px] shadow-none",
          "border-b-[var(--mq-brd,rgba(120,80,55,0.30))]",
          "focus-visible:border-b-[var(--mq-brd-focus,#c9482f)]",
        ].join(" "),
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

export type InputProps = Omit<React.ComponentPropsWithRef<"input">, "size" | "color"> &
  VariantProps<typeof inputVariants> & {
    /** Marks the control invalid. Drives `aria-invalid` and the error styling. */
    invalid?: boolean;
  };

/**
 * The bare control. Uncontrolled by default; pass `value` + `onChange` to
 * control it, exactly as with a plain `<input>` — this component adds no state
 * of its own, so there is nothing to get out of sync.
 */
export function Input({
  className,
  invalid = false,
  material,
  size,
  type = "text",
  variant,
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(inputVariants({ material, variant, size }), className)}
      data-material={material ?? "clay"}
      type={type}
    />
  );
}

const LABEL =
  // `currentColor`: the label sits on the host's surface, not on one of ours, so
  // pinning a colour would be guessing at the page it lands on.
  "text-[color:currentColor] text-[length:12px] leading-[1.3] font-extrabold tracking-[-0.01em]";

const MESSAGE = "m-0 text-[length:11px] leading-[1.5]";

export type InputFieldProps = InputProps & {
  /** Visible label. Rendered as a real `<label htmlFor>`. */
  label: React.ReactNode;
  /** Guidance shown under the control while it is valid. */
  helperText?: React.ReactNode;
  /** Error shown instead of `helperText`. Its presence implies `invalid`. */
  errorText?: React.ReactNode;
  /** Class for the wrapper. `className` still targets the control itself. */
  fieldClassName?: string;
};

/**
 * Label + control + message, wired together.
 *
 * The message region is always rendered, even when empty. That is deliberate:
 * an `aria-live` region has to be in the DOM *before* the text arrives for the
 * announcement to be reliable, so a container that only appears alongside the
 * error would frequently be missed by screen readers.
 *
 * `aria-describedby` is composed rather than overwritten, so a caller passing
 * their own description keeps it.
 */
export function InputField({
  errorText,
  fieldClassName,
  helperText,
  id,
  invalid = false,
  label,
  material,
  size,
  variant,
  ...props
}: InputFieldProps) {
  const generatedId = React.useId();
  const inputId = id ?? `${generatedId}-input`;
  const messageId = `${generatedId}-message`;
  const isInvalid = invalid || errorText != null;
  const message = errorText ?? helperText;

  const describedBy = [props["aria-describedby"], message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[6px] text-left",
        // Tokens on the wrapper so the message — a sibling of the control, not a
        // descendant — resolves the material's own `--mq-error`.
        MATERIAL_TOKENS[material ?? "clay"],
        fieldClassName,
      )}
    >
      <label className={LABEL} htmlFor={inputId}>
        {label}
      </label>
      <Input
        {...props}
        aria-describedby={describedBy || undefined}
        id={inputId}
        invalid={isInvalid}
        material={material}
        size={size}
        variant={variant}
      />
      <p
        aria-live="polite"
        className={cn(
          MESSAGE,
          errorText != null
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

export { inputVariants };
