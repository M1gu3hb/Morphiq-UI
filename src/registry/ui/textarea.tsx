"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Textarea
 *
 * A multi-line text field. Self-contained by design: all four material recipes
 * live in this file, every local custom property carries a literal fallback,
 * and no class comes from the site's global stylesheet.
 *
 * Two exports, mirroring `Input`:
 *
 *   <Textarea>       the bare control. `className` targets the <textarea>.
 *   <TextareaField>  label + control + message, with the `htmlFor` /
 *                    `aria-describedby` / `aria-invalid` wiring done for you.
 *
 * Local theming knobs:
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
 * against the control's own surface on every material — placeholders are held
 * to the same bar as body text. The glass recipe carries its own tint so that
 * holds over a white and a black backdrop alike.
 */

/**
 * Palette per material, as local custom properties only.
 *
 * Applied twice: to the control (which is what makes a bare `<Textarea>`
 * self-contained) and to `TextareaField`'s wrapper, because the error message
 * is a *sibling* of the control and could never inherit `--mq-error` from it.
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
  // Polymorphic: no ornament. It adapts — the palette follows the colour
  // scheme. Safe here because the control has an opaque surface that flips
  // together with its text.
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

type TextareaMaterial = keyof typeof MATERIAL_TOKENS;
type TextareaVariant = "default" | "filled" | "underline";
type TextareaSize = "sm" | "md" | "lg";

const textareaVariants = cva(
  [
    "block w-full appearance-none border bg-[var(--mq-field,#fdf6f0)]",
    "text-[color:var(--mq-text,#33261e)]",
    "placeholder:text-[color:var(--mq-placeholder,#6a5346)]",
    // Exactly the properties that change — nothing phantom. Border colour moves
    // on focus and on error, background colour when the material or the
    // treatment changes, and opacity when disabled. `box-shadow` is
    // deliberately absent: nothing here ever sets one, so listing it would
    // animate a property that never moves. `outline` is absent too, but for the
    // opposite reason — a focus ring has to be there the instant focus lands,
    // not fade in over 200ms.
    "transition-[border-color,background-color,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Forced colours drop every fill and shadow, so a field styled only by its
    // background would vanish into the page.
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
        clay: MATERIAL_TOKENS.clay,
        glass: `${MATERIAL_TOKENS.glass} backdrop-blur-[16px] backdrop-saturate-[170%]`,
        skeuo: MATERIAL_TOKENS.skeuo,
        adaptive: MATERIAL_TOKENS.adaptive,
      },
      size: {
        sm: "[--mq-radius:10px] px-[10px] py-[8px] text-[length:12px] leading-[1.55]",
        md: "[--mq-radius:13px] px-[13px] py-[10px] text-[length:13px] leading-[1.6]",
        lg: "[--mq-radius:16px] px-[16px] py-[12px] text-[length:14px] leading-[1.65]",
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

/** Grows the control to its content without leaving a scrollbar behind. */
function fitToContent(element: HTMLTextAreaElement) {
  // Reset first: without it the height only ever ratchets upward, because
  // `scrollHeight` can never report less than the height already set.
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
}

export type TextareaProps = Omit<React.ComponentPropsWithRef<"textarea">, "size"> & {
  material?: TextareaMaterial;
  variant?: TextareaVariant;
  size?: TextareaSize;
  /** Marks the control invalid. Drives `aria-invalid` and the error styling. */
  invalid?: boolean;
  /**
   * Grows with its content instead of scrolling. `rows` still sets the floor,
   * so the field never starts smaller than the space you reserved for it.
   */
  autoResize?: boolean;
};

/**
 * The bare control. Uncontrolled by default; pass `value` + `onChange` to
 * control it, exactly as with a plain `<textarea>` — this component adds no
 * state of its own, so there is nothing to get out of sync.
 */
export function Textarea({
  autoResize = false,
  className,
  invalid = false,
  material = "clay",
  onInput,
  ref,
  rows = 3,
  size = "md",
  variant = "default",
  ...props
}: TextareaProps) {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Runs on mount and whenever a controlled `value` changes, so a field that is
  // populated programmatically is sized correctly before the user ever types.
  React.useEffect(() => {
    if (autoResize && innerRef.current) fitToContent(innerRef.current);
  }, [autoResize, props.value, rows]);

  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        textareaVariants({ material, variant, size }),
        // With auto-resize the drag handle would fight the measured height, so
        // it is removed; otherwise vertical resizing stays available.
        autoResize ? "resize-none overflow-hidden" : "resize-y",
        className,
      )}
      data-material={material}
      onInput={(event) => {
        onInput?.(event);
        if (autoResize) fitToContent(event.currentTarget);
      }}
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      rows={rows}
    />
  );
}

const LABEL =
  // `currentColor`: the label sits on the host's surface, not on one of ours,
  // so pinning a colour would be guessing at the page it lands on.
  "text-[color:currentColor] text-[length:12px] leading-[1.3] font-extrabold tracking-[-0.01em]";

export type TextareaFieldProps = TextareaProps & {
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
 * The message region is always rendered, even when empty: an `aria-live` region
 * has to be in the DOM *before* the text arrives for the announcement to be
 * reliable, so a container that only appeared alongside the error would often
 * be missed by screen readers.
 *
 * `aria-describedby` is composed rather than overwritten, so a caller passing
 * their own description keeps it.
 */
export function TextareaField({
  errorText,
  fieldClassName,
  helperText,
  id,
  invalid = false,
  label,
  material = "clay",
  size,
  variant,
  ...props
}: TextareaFieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? `${generatedId}-textarea`;
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
        MATERIAL_TOKENS[material],
        fieldClassName,
      )}
    >
      <label className={LABEL} htmlFor={controlId}>
        {label}
      </label>
      <Textarea
        {...props}
        aria-describedby={describedBy || undefined}
        id={controlId}
        invalid={isInvalid}
        material={material}
        size={size}
        variant={variant}
      />
      <p
        aria-live="polite"
        className={cn(
          "m-0 text-[length:11px] leading-[1.5]",
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

export { textareaVariants };
