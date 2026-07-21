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
    // Warmer and more saturated than the old near-white box: clay is pigment.
    // The border is strengthened from 0.70 to 0.78 alpha to pay for it — the
    // darker surface would otherwise have cost the unchecked box contrast it
    // cannot spare, since that border is the only thing identifying it.
    "[--mq-box:#f7e9de] [--mq-box-brd:rgba(120,80,55,0.78)]",
    "[--mq-fill:#ff9077] [--mq-fill-brd:rgba(120,40,25,0.32)] [--mq-mark:#4a1d13]",
    "[--mq-box-image:none] [--mq-fill-image:none]",
    // Inflated: a bright bloom along the top, a warm shade pooling at the
    // bottom, the slab's own hard side wall, and a soft cast shadow. The ink is
    // warm brown throughout — clay never casts black.
    "[--mq-box-shadow:inset_0_2px_2px_rgba(255,255,255,0.95),inset_0_-2px_2px_rgba(140,90,60,0.22),0_2px_0_#e6cdb9,0_3px_5px_rgba(90,60,45,0.20)]",
    // Checked keeps the same four layers so the two interpolate; the side wall
    // becomes the coral edge and the whole thing sits a little heavier.
    "[--mq-fill-shadow:inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2px_3px_rgba(120,40,25,0.34),0_2px_0_#c9482f,0_3px_6px_rgba(75,40,31,0.28)]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
  ].join(" "),
  glass: [
    "[--mq-box:rgba(255,255,255,0.66)] [--mq-box-brd:rgba(23,24,23,0.65)]",
    "[--mq-fill:rgba(23,24,23,0.82)] [--mq-fill-brd:rgba(255,255,255,0.5)] [--mq-mark:#ffffff]",
    // A steep wash rather than a flat tint, so the pane reads as a sheet
    // catching the light even at 16px, where a blur alone would not.
    "[--mq-box-image:linear-gradient(180deg,rgba(255,255,255,0.60),rgba(255,255,255,0.04))]",
    "[--mq-fill-image:linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0))]",
    // The bright specular filo is the tell. Its geometry never changes between
    // states — only its intensity. Cool violet-black ink, no side wall: glass
    // has no extruded edge.
    "[--mq-box-shadow:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-1px_0_rgba(255,255,255,0.32),0_1px_0_rgba(255,255,255,0.22),0_2px_6px_rgba(24,20,40,0.22)]",
    "[--mq-fill-shadow:inset_0_1px_0_rgba(255,255,255,0.58),inset_0_-1px_0_rgba(255,255,255,0.14),0_1px_0_rgba(255,255,255,0.10),0_2px_7px_rgba(24,20,40,0.32)]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  skeuo: [
    "[--mq-box:#e6e3da] [--mq-box-brd:rgba(25,25,23,0.62)]",
    "[--mq-fill:#2a2a26] [--mq-fill-brd:rgba(0,0,0,0.5)] [--mq-mark:#f6f4ee]",
    // Unchecked, the gradient runs DARK to LIGHT: a surface lit from above
    // reads as sunk when its top is the shaded part. That inversion is what
    // makes the empty box a machined well rather than another raised pad, and
    // it is the single clearest way to tell skeuo from clay at 16px.
    "[--mq-box-image:linear-gradient(180deg,#dad6cc,#f2efe7)]",
    // Checked, it flips back to lit-over-body: the well fills and rises.
    "[--mq-fill-image:linear-gradient(180deg,#3a3a34,#22221e)]",
    // A hard shaded lip at the top, a light bevel at the far wall, and a light
    // line under the control where the surrounding surface catches the sun.
    // Achromatic ink throughout — the cold counterpart to clay's warm brown.
    "[--mq-box-shadow:inset_0_2px_3px_rgba(0,0,0,0.34),inset_0_-1px_0_rgba(255,255,255,0.92),0_1px_0_rgba(255,255,255,0.75),0_0_0_rgba(0,0,0,0)]",
    "[--mq-fill-shadow:inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-2px_3px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.38),0_2px_4px_rgba(38,36,31,0.35)]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour
  // scheme. Safe here because both the box and the mark on it flip together.
  adaptive: [
    "[--mq-box:#ffffff] [--mq-box-brd:rgba(23,24,23,0.60)]",
    "[--mq-fill:#171817] [--mq-fill-brd:rgba(0,0,0,0.4)] [--mq-mark:#f6f5f1]",
    // Explicitly `none` so the fallback of a shared class cannot leak a
    // gradient onto the one material that is meant to have no ornament.
    "[--mq-box-image:none] [--mq-fill-image:none]",
    // Two layers, not four. Adaptive earns its presence from a contact shadow,
    // not from a finish it never had.
    "[--mq-box-shadow:inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.16)]",
    "[--mq-fill-shadow:inset_0_0_0_rgba(20,20,18,0),0_2px_5px_rgba(20,20,18,0.24)]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
    "dark:[--mq-box:#232327] dark:[--mq-box-brd:rgba(255,255,255,0.50)]",
    "dark:[--mq-fill:#f1efe9] dark:[--mq-fill-brd:rgba(255,255,255,0.4)] dark:[--mq-mark:#171817]",
    "dark:[--mq-box-shadow:inset_0_0_0_rgba(0,0,0,0),0_1px_2px_rgba(0,0,0,0.44)]",
    "dark:[--mq-fill-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_5px_rgba(0,0,0,0.52)]",
    "dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
  ].join(" "),
} as const;

type CheckboxMaterial = keyof typeof MATERIAL_TOKENS;
type CheckboxVariant = "default" | "rounded";
type CheckboxSize = "sm" | "md" | "lg";

const boxVariants = cva(
  [
    "pointer-events-none grid place-items-center border",
    "bg-[var(--mq-box,#f7e9de)] border-[var(--mq-box-brd,rgba(120,80,55,0.78))]",
    // The material's surface treatment and depth, carried as values rather than
    // as class names. That is deliberate: the Select pilot lost a whole focus
    // state to a helper that built class names by interpolation, because
    // Tailwind finds classes by scanning source text and never runs the module.
    // Keeping the varying part in a CSS variable means the scanner only ever has
    // to see these three literal classes.
    "[background-image:var(--mq-box-image,none)]",
    "shadow-[var(--mq-box-shadow,inset_0_2px_2px_rgba(255,255,255,0.95),inset_0_-2px_2px_rgba(140,90,60,0.22),0_2px_0_#e6cdb9,0_3px_5px_rgba(90,60,45,0.20))]",
    // Driven by the input's own :checked / :indeterminate, so the drawn box can
    // never disagree with the control it stands in for.
    "peer-checked:bg-[var(--mq-fill,#ff9077)] peer-checked:border-[var(--mq-fill-brd,rgba(120,40,25,0.32))]",
    "peer-checked:[background-image:var(--mq-fill-image,none)]",
    "peer-checked:shadow-[var(--mq-fill-shadow,inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2px_3px_rgba(120,40,25,0.34),0_2px_0_#c9482f,0_3px_6px_rgba(75,40,31,0.28))]",
    "peer-indeterminate:bg-[var(--mq-fill,#ff9077)] peer-indeterminate:border-[var(--mq-fill-brd,rgba(120,40,25,0.32))]",
    "peer-indeterminate:[background-image:var(--mq-fill-image,none)]",
    "peer-indeterminate:shadow-[var(--mq-fill-shadow,inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2px_3px_rgba(120,40,25,0.34),0_2px_0_#c9482f,0_3px_6px_rgba(75,40,31,0.28))]",
    // The tick lives *inside* this box, so it is not a sibling of the input and
    // `peer-*` (a `~` combinator) can never reach it. The box is a sibling, so
    // it translates the peer state into inherited custom properties that its
    // descendants can read — one for the mark's opacity, one for its scale.
    "[--mq-tick:0] peer-checked:[--mq-tick:1]",
    "[--mq-tick-s:0.4] peer-checked:[--mq-tick-s:1]",
    // Physical feedback, and the cue that reads best at 16px: the box swells
    // under the pointer and squashes when pressed. `scale`, not `transform` —
    // Tailwind v4 writes the scale utilities to the standalone property, so a
    // transition naming `transform` would animate nothing.
    "peer-hover:scale-[1.06] peer-active:scale-[0.92]",
    "transition-[background-color,border-color,box-shadow,scale] duration-150 ease-out",
    // The press is pure feedback rather than a state anyone needs to read, so
    // reduced motion cancels it outright instead of keeping its end state.
    "motion-reduce:transition-none",
    "motion-reduce:peer-hover:scale-100 motion-reduce:peer-active:scale-100",
    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[2px]",
    "peer-focus-visible:outline-[var(--mq-ring,#171817)]",
    "peer-data-[focus=true]:outline-2 peer-data-[focus=true]:outline-offset-[2px]",
    "peer-data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:peer-focus-visible:outline-[Highlight]",
    // `aria-invalid` on the input is the single source of the error look, so
    // what is drawn and what assistive tech is told cannot drift apart.
    "peer-aria-[invalid=true]:border-[var(--mq-error,#9c2f22)]",
    "peer-disabled:opacity-55",
    // Forced colours discard every fill and every shadow, so a box that
    // signalled "checked" only by its background would read as empty. The
    // border stays a system colour and the mark itself carries the state — see
    // `MARK` below. Background *images* are the exception: they survive
    // untouched, so the skeuo gradient and the glass wash have to be cleared by
    // hand or they would sit on a system-coloured surface they never met.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]",
    "forced-colors:[background-image:none] forced-colors:shadow-none",
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
/**
 * Keyframes travel with the component.
 *
 * The tick is always mounted and merely hidden, so it can transition. The mixed
 * dash cannot: it only exists while `indeterminate` is true, and a transition
 * has nothing to run from on the frame an element appears. It gets a mount
 * animation instead. Two mechanisms for two genuinely different lifecycles —
 * which is also why the "exactly one mark is rendered" rule below survives the
 * redesign rather than being traded away for a uniform implementation.
 */
const DASH_KEYFRAMES = `@keyframes mq-check-dash{from{scale:0.4;opacity:0}to{scale:1;opacity:1}}`;

function CheckboxKeyframes() {
  // React 19 hoists this to <head> and deduplicates it by `href`, so a page of
  // checkboxes emits one rule rather than one per instance.
  return (
    <style href="mq-check-dash" precedence="medium">
      {DASH_KEYFRAMES}
    </style>
  );
}

const MARK =
  "col-start-1 row-start-1 size-[72%] text-[color:var(--mq-mark,#4a1d13)] " +
  // The signature move: the tick springs in rather than fading. `scale` is the
  // standalone property in Tailwind v4, so it is named literally here; the
  // overshoot in the curve is what makes it read as a stamp landing rather than
  // a shape growing.
  "transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.22,1.55,0.36,1)] " +
  // Reduced motion drops the travel and keeps the end state: the tick is what
  // says "checked", so unlike the press feedback it must never be cancelled.
  "motion-reduce:transition-none " +
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
      <CheckboxKeyframes />
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
            className={cn(
              MARK,
              "opacity-100",
              "animate-[mq-check-dash_200ms_cubic-bezier(0.22,1.55,0.36,1)]",
              "motion-reduce:animate-none",
            )}
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
            className={cn(MARK, "opacity-[var(--mq-tick,0)] scale-[var(--mq-tick-s,0.4)]")}
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
