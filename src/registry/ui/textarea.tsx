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
 *   --mq-grad          material lighting over the default surface
 *   --mq-grad-strong   material lighting over the filled surface
 *   --mq-edge          tactile contact edge
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
  // Polymorphic: no ornament. It adapts — the palette follows the colour
  // scheme. Safe here because the control has an opaque surface that flips
  // together with its text.
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

/**
 * Multi-line depth uses broader layers than Input, but the interpolation rule
 * is identical: every state retains the same layer count and inset order.
 * Shadows never affect layout, scrollHeight or the native resize handle.
 */
const DEPTH = {
  clay: {
    rest: "shadow-[inset_0_4px_6px_rgba(255,255,255,0.76),inset_0_-6px_10px_rgba(140,90,60,0.13),inset_0_0_0_rgba(120,60,40,0),0_3px_0_var(--mq-edge,#dcc4b2),0_8px_18px_rgba(90,60,45,0.14)]",
    hover:
      "hover:shadow-[inset_0_4px_6px_rgba(255,255,255,0.86),inset_0_-6px_10px_rgba(140,90,60,0.16),inset_0_0_0_rgba(120,60,40,0),0_5px_0_var(--mq-edge,#dcc4b2),0_12px_24px_rgba(90,60,45,0.19)]",
    focus:
      "focus-visible:shadow-[inset_0_3px_5px_rgba(255,255,255,0.54),inset_0_-4px_8px_rgba(140,90,60,0.09),inset_0_8px_16px_rgba(120,60,40,0.25),0_1px_0_var(--mq-edge,#dcc4b2),0_3px_6px_rgba(90,60,45,0.10)] " +
      "data-[focus=true]:shadow-[inset_0_3px_5px_rgba(255,255,255,0.54),inset_0_-4px_8px_rgba(140,90,60,0.09),inset_0_8px_16px_rgba(120,60,40,0.25),0_1px_0_var(--mq-edge,#dcc4b2),0_3px_6px_rgba(90,60,45,0.10)]",
  },
  glass: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.86),inset_0_-1px_0_rgba(255,255,255,0.22),inset_0_0_0_rgba(24,20,40,0),0_10px_28px_rgba(24,20,40,0.16)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(255,255,255,0.27),inset_0_0_0_rgba(24,20,40,0),0_15px_36px_rgba(24,20,40,0.23)] hover:backdrop-blur-[22px]",
    focus:
      "focus-visible:shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(255,255,255,0.20),inset_0_8px_18px_rgba(24,20,40,0.22),0_3px_8px_rgba(24,20,40,0.12)] " +
      "data-[focus=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(255,255,255,0.20),inset_0_8px_18px_rgba(24,20,40,0.22),0_3px_8px_rgba(24,20,40,0.12)]",
  },
  skeuo: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-5px_8px_rgba(0,0,0,0.15),inset_0_0_0_rgba(0,0,0,0),0_3px_0_var(--mq-edge,#a8a49b),0_7px_16px_rgba(38,36,31,0.22)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.99),inset_0_-5px_8px_rgba(0,0,0,0.17),inset_0_0_0_rgba(0,0,0,0),0_4px_0_var(--mq-edge,#a8a49b),0_11px_22px_rgba(38,36,31,0.27)]",
    focus:
      "focus-visible:shadow-[inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-3px_6px_rgba(0,0,0,0.10),inset_0_8px_17px_rgba(0,0,0,0.30),0_1px_0_var(--mq-edge,#a8a49b),0_3px_5px_rgba(38,36,31,0.15)] " +
      "data-[focus=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-3px_6px_rgba(0,0,0,0.10),inset_0_8px_17px_rgba(0,0,0,0.30),0_1px_0_var(--mq-edge,#a8a49b),0_3px_5px_rgba(38,36,31,0.15)]",
  },
  adaptive: {
    rest: "shadow-[inset_0_0_0_rgba(20,20,18,0),0_2px_5px_rgba(20,20,18,0.10)]",
    hover: "hover:shadow-[inset_0_0_0_rgba(20,20,18,0),0_9px_22px_rgba(20,20,18,0.16)]",
    focus:
      "focus-visible:shadow-[inset_0_5px_12px_rgba(20,20,18,0.17),0_2px_4px_rgba(20,20,18,0.08)] " +
      "data-[focus=true]:shadow-[inset_0_5px_12px_rgba(20,20,18,0.17),0_2px_4px_rgba(20,20,18,0.08)]",
  },
} as const;

type TextareaMaterial = keyof typeof MATERIAL_TOKENS;
type TextareaVariant = "default" | "filled" | "underline";
type TextareaSize = "sm" | "md" | "lg";

const textareaVariants = cva(
  [
    "block w-full appearance-none border",
    "text-[color:var(--mq-text,#33261e)]",
    "placeholder:text-[color:var(--mq-placeholder,#6a5346)]",
    // Exactly the properties that change — nothing phantom. Border colour moves
    // on focus and on error, background colour when the material or treatment
    // changes, box-shadow on hover/focus, backdrop-filter on glass hover and
    // opacity when disabled. `outline` is deliberately absent: the focus ring
    // has to appear the instant focus lands, not fade in over 200ms.
    "transition-[border-color,background-color,box-shadow,backdrop-filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "focus-visible:border-[var(--mq-brd-focus,#c9482f)]",
    "data-[focus=true]:border-[var(--mq-brd-focus,#c9482f)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Forced colours drop every fill and shadow, so a field styled only by its
    // background would vanish into the page.
    "forced-colors:border-[CanvasText] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:backdrop-filter-none",
    "disabled:cursor-not-allowed disabled:opacity-55",
    // `aria-invalid` is the single source of truth for the error look: no
    // separate prop can drift out of sync with what assistive tech is told.
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
        adaptive: `${MATERIAL_TOKENS.adaptive} ${DEPTH.adaptive.rest} ${DEPTH.adaptive.hover} ${DEPTH.adaptive.focus} pointer-coarse:min-h-[120px]`,
      },
      size: {
        sm: "[--mq-radius:10px] px-[10px] py-[8px] text-[12px]/[1.55]",
        md: "[--mq-radius:13px] px-[13px] py-[10px] text-[13px]/[1.6]",
        lg: "[--mq-radius:16px] px-[16px] py-[12px] text-[14px]/[1.65]",
      },
      // Declared after `size` so `underline` can drop the padding and radius the
      // size axis sets.
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
          "rounded-none border-0 border-b px-[2px]",
          "[background-color:transparent] [background-image:none]",
          "border-b-[var(--mq-brd,rgba(120,80,55,0.30))]",
          "focus-visible:border-b-[var(--mq-brd-focus,#c9482f)]",
          "data-[focus=true]:border-b-[var(--mq-brd-focus,#c9482f)]",
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
