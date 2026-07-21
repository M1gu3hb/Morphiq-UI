"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Checkbox
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * A real `<input type="checkbox">` does the work. It is not replaced, only made
 * transparent and laid over the drawn box, so the keyboard, focus, form
 * submission, `:checked` / `:indeterminate` and the label association are the
 * browser's. The visual state is driven by those native pseudo-classes through
 * `peer-*` variants — there is no React state mirroring the input, so nothing
 * can fall out of sync with it.
 *
 * Two exports:
 *
 *   <Checkbox>       the control on its own. Needs a name from somewhere:
 *                    `aria-label`, `aria-labelledby`, or an external
 *                    `<label htmlFor>` matching its `id`.
 *   <CheckboxField>  control + label + message, wired together, following the
 *                    same shape as `InputField`.
 *
 * Local theming knobs:
 *
 *   --mq-box       unchecked box surface
 *   --mq-box-brd   unchecked box border
 *   --mq-fill      checked / indeterminate box surface
 *   --mq-fill-brd  checked box border
 *   --mq-mark      the tick and the dash
 *   --mq-ring      focus ring
 *   --mq-error     invalid border and message
 */

/** Palette per material. Applied to the control and to the field wrapper. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-box:#fdf6f0] [--mq-box-brd:rgba(120,80,55,0.70)]",
    "[--mq-fill:#ff9077] [--mq-fill-brd:rgba(120,40,25,0.32)] [--mq-mark:#4a1d13]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
  ].join(" "),
  glass: [
    "[--mq-box:rgba(255,255,255,0.66)] [--mq-box-brd:rgba(23,24,23,0.65)]",
    "[--mq-fill:rgba(23,24,23,0.82)] [--mq-fill-brd:rgba(255,255,255,0.5)] [--mq-mark:#ffffff]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  skeuo: [
    "[--mq-box:#e6e3da] [--mq-box-brd:rgba(25,25,23,0.55)]",
    "[--mq-fill:#2a2a26] [--mq-fill-brd:rgba(0,0,0,0.5)] [--mq-mark:#f6f4ee]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour
  // scheme. Safe here because both the box and the mark on it flip together.
  adaptive: [
    "[--mq-box:#ffffff] [--mq-box-brd:rgba(23,24,23,0.60)]",
    "[--mq-fill:#171817] [--mq-fill-brd:rgba(0,0,0,0.4)] [--mq-mark:#f6f5f1]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
    "dark:[--mq-box:#232327] dark:[--mq-box-brd:rgba(255,255,255,0.50)]",
    "dark:[--mq-fill:#f1efe9] dark:[--mq-fill-brd:rgba(255,255,255,0.4)] dark:[--mq-mark:#171817]",
    "dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
  ].join(" "),
} as const;

type CheckboxMaterial = keyof typeof MATERIAL_TOKENS;
type CheckboxVariant = "default" | "rounded";
type CheckboxSize = "sm" | "md" | "lg";

const boxVariants = cva(
  [
    "pointer-events-none grid place-items-center border",
    "bg-[var(--mq-box,#fdf6f0)] border-[var(--mq-box-brd,rgba(120,80,55,0.70))]",
    // Driven by the input's own :checked / :indeterminate, so the drawn box can
    // never disagree with the control it stands in for.
    "peer-checked:bg-[var(--mq-fill,#ff9077)] peer-checked:border-[var(--mq-fill-brd,rgba(120,40,25,0.32))]",
    "peer-indeterminate:bg-[var(--mq-fill,#ff9077)] peer-indeterminate:border-[var(--mq-fill-brd,rgba(120,40,25,0.32))]",
    // The tick lives *inside* this box, so it is not a sibling of the input and
    // `peer-*` (a `~` combinator) can never reach it. The box is a sibling, so
    // it translates the peer state into an inherited custom property that its
    // descendants can read.
    "[--mq-tick:0] peer-checked:[--mq-tick:1]",
    // Only the surface and the border move between states — nothing phantom.
    "transition-[background-color,border-color] duration-150 ease-out",
    "motion-reduce:transition-none",
    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[2px]",
    "peer-focus-visible:outline-[var(--mq-ring,#171817)]",
    "peer-data-[focus=true]:outline-2 peer-data-[focus=true]:outline-offset-[2px]",
    "peer-data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:peer-focus-visible:outline-[Highlight]",
    // `aria-invalid` on the input is the single source of the error look, so
    // what is drawn and what assistive tech is told cannot drift apart.
    "peer-aria-[invalid=true]:border-[var(--mq-error,#9c2f22)]",
    "peer-disabled:opacity-55",
    // Forced colours discard every fill, so a box that signalled "checked" only
    // by its background would read as empty. The border stays a system colour
    // and the mark itself carries the state — see `MARK` below.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "rounded-[var(--mq-radius,6px)]",
        rounded: "rounded-full",
      },
      size: {
        sm: "[--mq-radius:5px] size-[16px]",
        md: "[--mq-radius:6px] size-[18px]",
        lg: "[--mq-radius:7px] size-[22px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/**
 * The tick and the dash.
 *
 * `aria-hidden`: the native input already exposes checked / mixed, and a second
 * announcement would fight it. Visibility is opacity so the mark keeps its
 * shape in forced-colors mode, where a background-driven indicator would vanish
 * — `ButtonText` keeps it drawn against whatever the system paints.
 */
const MARK =
  "col-start-1 row-start-1 size-[72%] text-[color:var(--mq-mark,#4a1d13)] " +
  "transition-[opacity] duration-150 ease-out motion-reduce:transition-none " +
  "forced-colors:text-[CanvasText]";

export type CheckboxProps = Omit<React.ComponentPropsWithRef<"input">, "size" | "type"> & {
  material?: CheckboxMaterial;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  /**
   * Renders the mixed state. Not an HTML attribute — `indeterminate` is a DOM
   * property only, so it is applied to the node in an effect rather than in
   * JSX, which is why this prop exists at all.
   */
  indeterminate?: boolean;
  /** Marks the control invalid. Drives `aria-invalid` and the error styling. */
  invalid?: boolean;
};

export function Checkbox({
  className,
  indeterminate = false,
  invalid = false,
  material = "clay",
  ref,
  size = "md",
  variant = "default",
  ...props
}: CheckboxProps) {
  const innerRef = React.useRef<HTMLInputElement | null>(null);

  // `indeterminate` is a property, never an attribute: React cannot set it in
  // JSX, so it is written to the node directly. Re-applied when `checked`
  // changes too, because toggling the box clears the mixed state natively.
  React.useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate, props.checked]);

  return (
    <span className={cn("relative inline-flex shrink-0", MATERIAL_TOKENS[material], className)}>
      <input
        {...props}
        aria-invalid={invalid || undefined}
        // Transparent and laid exactly over the drawn box: the real control
        // keeps the hit area, the focus, and the keyboard.
        className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        data-material={material}
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type="checkbox"
      />
      <span aria-hidden="true" className={boxVariants({ variant, size })}>
        {/*
          Exactly one mark is rendered. Showing both and racing two peer rules
          for priority would depend on the order Tailwind happens to emit them;
          the mixed state is a prop we already know, so the choice is made here
          where it is explicit.
        */}
        {indeterminate ? (
          <svg
            className={cn(MARK, "opacity-100")}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="3.5"
            viewBox="0 0 24 24"
          >
            <path d="M6 12h12" />
          </svg>
        ) : (
          <svg
            className={cn(MARK, "opacity-[var(--mq-tick,0)]")}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.5"
            viewBox="0 0 24 24"
          >
            <path d="m5 13 4.5 4.5L19 7" />
          </svg>
        )}
      </span>
    </span>
  );
}

const LABEL =
  // `currentColor`: the label sits on the host's surface, not on one of ours,
  // so pinning a colour would be guessing at the page it lands on.
  "text-[color:currentColor] leading-[1.4] font-bold";

const labelVariants = cva(LABEL, {
  variants: {
    size: {
      sm: "text-[length:12px]",
      md: "text-[length:13px]",
      lg: "text-[length:14px]",
    },
  },
  defaultVariants: { size: "md" },
});

export type CheckboxFieldProps = CheckboxProps & {
  /** Visible label. The whole row is a `<label>`, so clicking the text toggles. */
  label: React.ReactNode;
  /** Guidance shown under the row while it is valid. */
  helperText?: React.ReactNode;
  /** Error shown instead of `helperText`. Its presence implies `invalid`. */
  errorText?: React.ReactNode;
  /** Class for the wrapper. `className` still targets the control itself. */
  fieldClassName?: string;
};

/**
 * Control + label + message, wired together.
 *
 * The row is a real `<label>` wrapping the input, so the association needs no
 * matching ids and the whole row — text included — is a hit target.
 *
 * The message region is always rendered, even when empty: an `aria-live` region
 * has to be in the DOM *before* the text arrives for the announcement to be
 * reliable, so a container that only appeared alongside the error would often
 * be missed.
 *
 * `aria-describedby` is composed rather than overwritten, so a caller passing
 * their own description keeps it.
 */
export function CheckboxField({
  errorText,
  fieldClassName,
  helperText,
  invalid = false,
  label,
  material = "clay",
  size = "md",
  ...props
}: CheckboxFieldProps) {
  const generatedId = React.useId();
  const messageId = `${generatedId}-message`;
  const isInvalid = invalid || errorText != null;
  const message = errorText ?? helperText;

  const describedBy = [props["aria-describedby"], message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cn(
        "flex flex-col gap-[6px] text-left",
        // Tokens on the wrapper so the message — a sibling of the control, not
        // a descendant — resolves the material's own `--mq-error`.
        MATERIAL_TOKENS[material],
        fieldClassName,
      )}
    >
      <label className="inline-flex cursor-pointer items-start gap-[10px]">
        <Checkbox
          {...props}
          aria-describedby={describedBy || undefined}
          invalid={isInvalid}
          material={material}
          size={size}
        />
        <span className={labelVariants({ size })}>{label}</span>
      </label>
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

export { boxVariants };
