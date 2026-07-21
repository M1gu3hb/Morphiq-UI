"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Select
 *
 * A dropdown built on a native `<select>`. Self-contained by design: all four
 * material recipes live in this file, every local custom property carries a
 * literal fallback, and no class comes from the site's global stylesheet.
 *
 * Two exports, mirroring `Input` and `Textarea`:
 *
 *   <Select>       the control. `className` targets the <select> itself.
 *   <SelectField>  label + control + message, with the `htmlFor` /
 *                  `aria-describedby` / `aria-invalid` wiring done for you.
 *
 * Why native, and what that costs:
 *
 * Only the *closed* control is styled here — the box, the border, the text and
 * a chevron we draw ourselves. The open list is drawn by the operating system
 * and is deliberately left alone: it cannot be restyled portably, and trying
 * would mean reimplementing a listbox in JavaScript, which buys a worse
 * component. The native element already carries keyboard navigation, type-ahead
 * jumping, screen-reader semantics, form participation and — the part no
 * reimplementation gets right — the platform's own picker on touch devices.
 * A rendering we do not control is a fair price for behaviour we cannot match.
 *
 * Local theming knobs:
 *
 *   --mq-field         control background
 *   --mq-field-strong  control background for the `filled` variant
 *   --mq-brd           resting border
 *   --mq-brd-focus     border once focused
 *   --mq-text          the selected option's text
 *   --mq-placeholder   text while the empty placeholder option is selected
 *   --mq-chevron       the drawn chevron
 *   --mq-ring          focus ring
 *   --mq-error         error border + error message
 *   --mq-radius        corner radius (set by size)
 *
 * Contrast contract: option text measures at or above 4.5:1 against the
 * control's own surface on every material, and the chevron — an informative
 * glyph rather than decoration — is held to the same 4.5:1 rather than the
 * 3:1 that WCAG 1.4.11 would allow it.
 */

/**
 * Palette per material, as local custom properties only.
 *
 * Applied to the control *wrapper* rather than the `<select>`, because the
 * chevron is a sibling of the control and could never inherit `--mq-chevron`
 * from it — the same reason `TextareaField` puts its tokens on the field. The
 * field wrapper repeats them for the message, which is a sibling in turn.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-field:#fdf6f0] [--mq-field-strong:#f4e7db] [--mq-surface:#fdf6f0]",
    "[--mq-brd:rgba(120,80,55,0.30)] [--mq-brd-focus:#c9482f]",
    "[--mq-text:#33261e] [--mq-placeholder:#6a5346] [--mq-chevron:#5c463a]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
  ].join(" "),
  glass: [
    "[--mq-field:rgba(255,255,255,0.66)] [--mq-field-strong:rgba(255,255,255,0.82)]",
    // Opaque stand-in for the popup, which cannot be translucent over anything.
    "[--mq-surface:#f4f7f8]",
    "[--mq-brd:rgba(255,255,255,0.75)] [--mq-brd-focus:rgba(255,255,255,0.98)]",
    "[--mq-text:#1e1e1b] [--mq-placeholder:#36362f] [--mq-chevron:#2c2c26]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  skeuo: [
    "[--mq-field:#e6e3da] [--mq-field-strong:#d7d3c9] [--mq-surface:#e6e3da]",
    "[--mq-brd:rgba(25,25,23,0.34)] [--mq-brd-focus:rgba(25,25,23,0.6)]",
    "[--mq-text:#23231f] [--mq-placeholder:#4a4943] [--mq-chevron:#3f3e39]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour
  // scheme. Safe here because the control has an opaque surface that flips
  // together with its text.
  adaptive: [
    "[--mq-field:#ffffff] [--mq-field-strong:#f1f0ec] [--mq-surface:#ffffff]",
    "[--mq-brd:rgba(23,24,23,0.22)] [--mq-brd-focus:#171817]",
    "[--mq-text:#1c1c19] [--mq-placeholder:#55554e] [--mq-chevron:#494942]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
    "dark:[--mq-field:#232327] dark:[--mq-field-strong:#2b2b31] dark:[--mq-surface:#232327]",
    "dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-brd-focus:#f1efe9]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-placeholder:#b9b7b0] dark:[--mq-chevron:#c8c6bf]",
    "dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
  ].join(" "),
} as const;

type SelectMaterial = keyof typeof MATERIAL_TOKENS;
type SelectVariant = "default" | "filled" | "underline";
type SelectSize = "sm" | "md" | "lg";

const selectVariants = cva(
  [
    // `peer` so the chevron, which follows the control, can react to :disabled.
    // A sibling combinator is the only reach available: the chevron cannot be a
    // child of a <select>.
    "peer block w-full appearance-none border bg-[var(--mq-field,#fdf6f0)]",
    "text-[color:var(--mq-text,#33261e)]",
    // The empty-value option is the placeholder, so the control reads as unset
    // exactly when its value is empty. `aria-invalid` is used for the error
    // look rather than `:invalid`, which would match on first paint and render
    // every untouched required control in red.
    "[&:has(option[value='']:checked)]:text-[color:var(--mq-placeholder,#6a5346)]",
    // Firefox paints the open list from the control's own colours. The
    // `underline` treatment is transparent and `glass` is translucent, so
    // without this the popup can come out unreadable — the one place where
    // styling the closed control leaks into the part the OS draws. Colouring
    // the options directly is honoured where it matters and ignored elsewhere.
    "[&>option]:bg-[var(--mq-surface,#fdf6f0)] [&>option]:text-[color:var(--mq-text,#33261e)]",
    // Exactly the properties that change — nothing phantom. Border colour moves
    // on focus and on error, background colour when the material or treatment
    // changes, and opacity when disabled. `outline` is deliberately absent: a
    // focus ring has to be there the instant focus lands, not fade in.
    "transition-[border-color,background-color,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Forced colours drop every fill, so a control styled only by its
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
        clay: "",
        glass: "backdrop-blur-[16px] backdrop-saturate-[170%]",
        skeuo: "",
        adaptive: "",
      },
      size: {
        // Height is explicit and vertical padding is zero, rather than the
        // padding-driven sizing the other fields use. Safari normalises
        // `padding-block` on a `<select>` and centres the selected text itself,
        // while Chrome and Firefox honour it — symmetric padding therefore
        // produces a different control height per engine. A fixed height and
        // the engine's own centring agree everywhere.
        //
        // The inline-end padding reserves the chevron's lane so a long option
        // label runs out of room before it runs underneath the glyph. Logical
        // properties throughout, so the whole control mirrors under RTL.
        //
        // The line-height rides along on the font-size class rather than as a
        // separate `leading-*`: `tailwind-merge` treats a later `text-[…]` as
        // conflicting with an earlier `leading-*` and drops it, so a standalone
        // one declared in the base would silently never apply. `normal` rather
        // than a ratio because it is inherited otherwise, and a control whose
        // text shifts with the host page's line-height is not self-contained.
        sm: "[--mq-radius:10px] h-[34px] py-0 ps-[10px] pe-[30px] text-[12px]/[normal]",
        md: "[--mq-radius:13px] h-[40px] py-0 ps-[13px] pe-[36px] text-[13px]/[normal]",
        lg: "[--mq-radius:16px] h-[46px] py-0 ps-[16px] pe-[42px] text-[14px]/[normal]",
      },
      // Declared after `size` so `underline`'s `ps-[2px]` beats the inline-start
      // padding the size axis sets — `tailwind-merge` keeps the last of two
      // conflicting classes, and cva emits axes in declaration order.
      //
      // Padding is the pair that actually depends on this, not the radius: the
      // size axis sets `--mq-radius` as a custom property, which tailwind-merge
      // does not consider to conflict with `rounded-none`, and the two radius
      // classes live on the same mutually exclusive axis anyway. Reorder these
      // and the corners will look fine while every `underline` control quietly
      // regains the box's inline-start padding.
      variant: {
        default: "rounded-[var(--mq-radius,13px)] border-[var(--mq-brd,rgba(120,80,55,0.30))]",
        filled: [
          "rounded-[var(--mq-radius,13px)] border-transparent",
          "bg-[var(--mq-field-strong,#f4e7db)]",
          "focus-visible:border-[var(--mq-brd-focus,#c9482f)]",
        ].join(" "),
        underline: [
          "rounded-none border-0 border-b bg-transparent ps-[2px] shadow-none",
          "border-b-[var(--mq-brd,rgba(120,80,55,0.30))]",
          "focus-visible:border-b-[var(--mq-brd-focus,#c9482f)]",
        ].join(" "),
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

/**
 * The chevron's lane, matched to the control's right padding.
 *
 * Placed with grid rather than absolute positioning so nothing has to be
 * translated: Tailwind v4 writes `translate-*` to the standalone `translate`
 * property, and keeping it out of the file entirely means there is no
 * transform/translate mismatch to get wrong later.
 */
const chevronVariants = cva(
  [
    "[grid-area:1/1] pointer-events-none self-center justify-self-end",
    "text-[color:var(--mq-chevron,#5c463a)]",
    // Dim in step with the control it belongs to. `peer-*` reaches a sibling,
    // which is exactly the relationship here.
    "peer-disabled:opacity-55",
    "transition-[opacity] duration-200 ease-out motion-reduce:transition-none",
    // Forced colours discard `currentColor` fills from author styles; naming a
    // system colour keeps the glyph on screen.
    "forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "me-[10px] size-[14px]",
        md: "me-[13px] size-[16px]",
        lg: "me-[16px] size-[18px]",
      },
      variant: {
        default: "",
        filled: "",
        // The underline treatment has no box, so the glyph sits flush with the
        // inline-end edge of the text.
        underline: "me-0",
      },
    },
    defaultVariants: { size: "md", variant: "default" },
  },
);

export type SelectProps = Omit<React.ComponentPropsWithRef<"select">, "size"> & {
  material?: SelectMaterial;
  variant?: SelectVariant;
  size?: SelectSize;
  /** Marks the control invalid. Drives `aria-invalid` and the error styling. */
  invalid?: boolean;
  /**
   * Text for a leading empty option. Rendered `disabled` and `hidden`, so it
   * shows while nothing is chosen but cannot be chosen again afterwards.
   */
  placeholder?: string;
  /** Class for the positioning wrapper. `className` still targets the control. */
  wrapperClassName?: string;
};

/**
 * The control.
 *
 * Uncontrolled by default; pass `value` + `onChange` to control it, exactly as
 * with a plain `<select>` — this component adds no state of its own, so there
 * is nothing to get out of sync.
 *
 * Note the prop list omits the native `size` attribute. On a `<select>` that
 * attribute means "how many rows to show at once", which would turn the control
 * into a list box; here `size` is the visual scale axis every Morphiq component
 * has. Trying to serve both from one name would silently break the control, so
 * the native one is dropped rather than quietly shadowed.
 */
export function Select({
  "aria-invalid": ariaInvalid,
  children,
  className,
  defaultValue,
  invalid = false,
  material = "clay",
  placeholder,
  size = "md",
  value,
  variant = "default",
  wrapperClassName,
  ...props
}: SelectProps) {
  // The placeholder option is `disabled`, and the browser's own "reset" step
  // picks the first option that is *not* disabled — so left alone it skips the
  // placeholder and silently selects the first real option, meaning a caller
  // who passes a placeholder and nothing else would never see it. Starting the
  // control on the empty value is what makes the placeholder actually appear,
  // and it is also the state `required` needs in order to count as unfilled.
  // Only applied when the caller has not said what should be selected.
  const startsEmpty = placeholder != null && value === undefined && defaultValue === undefined;

  return (
    <span
      className={cn(
        "relative inline-grid w-full",
        // Tokens live here so both the control and the chevron can read them.
        MATERIAL_TOKENS[material],
        wrapperClassName,
      )}
    >
      <select
        {...props}
        // Composed, not overwritten — the same courtesy `aria-describedby` gets.
        // Destructured out of `props` above, because leaving it in the spread
        // and then re-declaring it here would let this attribute win with
        // `undefined` and silently erase a value the caller set deliberately,
        // taking the error styling down with it.
        aria-invalid={invalid || ariaInvalid || undefined}
        className={cn(selectVariants({ material, variant, size }), "[grid-area:1/1]", className)}
        data-material={material}
        defaultValue={startsEmpty ? "" : defaultValue}
        value={value}
      >
        {placeholder != null ? (
          <option disabled hidden value="">
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      {/*
        Decorative: the native control already announces itself as a combo box,
        and the platform draws its own affordance in the open list. A second
        announcement here would be noise.
      */}
      <svg
        aria-hidden="true"
        // Through `cn()`, like every other cva output here: without the
        // tailwind-merge pass the `underline` treatment's `me-0` and the size
        // axis's `me-[13px]` would both survive into the class list and the
        // stylesheet's own ordering would decide the winner.
        className={cn(chevronVariants({ size, variant }))}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}

const LABEL =
  // `currentColor`: the label sits on the host's surface, not on one of ours,
  // so pinning a colour would be guessing at the page it lands on.
  "text-[color:currentColor] text-[length:12px] leading-[1.3] font-extrabold tracking-[-0.01em]";

export type SelectFieldProps = SelectProps & {
  /** Visible label. Rendered as a real `<label htmlFor>`. */
  label: React.ReactNode;
  /** Guidance shown under the control while it is valid. */
  helperText?: React.ReactNode;
  /** Error shown instead of `helperText`. Its presence implies `invalid`. */
  errorText?: React.ReactNode;
  /** Class for the field wrapper. `className` still targets the control. */
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
export function SelectField({
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
}: SelectFieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? `${generatedId}-select`;
  const messageId = `${generatedId}-message`;
  // `!= null` is not the right test: form libraries and server actions routinely
  // hand back `""` for "no error", which would otherwise mark the control
  // invalid and point `aria-describedby` at an empty message — an error state
  // with nothing to read.
  const hasError = typeof errorText === "string" ? errorText.trim() !== "" : errorText != null;
  const isInvalid = invalid || hasError;
  const message = hasError ? errorText : helperText;

  const describedBy = [props["aria-describedby"], message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[6px] text-left",
        // Repeated here for the message, which is a sibling of the control
        // wrapper and so cannot inherit `--mq-error` from it.
        MATERIAL_TOKENS[material],
        fieldClassName,
      )}
    >
      <label className={LABEL} htmlFor={controlId}>
        {label}
      </label>
      <Select
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

export { selectVariants };
