"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Radio Group
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * Real `<input type="radio">` elements sharing a `name` do the work. That one
 * attribute is what gives arrow-key navigation inside the group, a single tab
 * stop for the whole group, and mutual exclusivity — all of it from the
 * browser. None of it is reimplemented here; this file only draws.
 *
 * Composable API:
 *
 *   <RadioGroupField label="Deploy target" defaultValue="staging">
 *     <RadioGroupItem value="staging">Staging</RadioGroupItem>
 *     <RadioGroupItem value="prod">Production</RadioGroupItem>
 *   </RadioGroupField>
 *
 * `RadioGroup` is the bare group; `RadioGroupField` adds the label and the
 * message region, following the same shape as `InputField` and `CheckboxField`.
 *
 * Local theming knobs:
 *
 *   --mq-circle      unselected control surface
 *   --mq-circle-brd  unselected control border
 *   --mq-fill        selected control surface
 *   --mq-fill-brd    selected control border
 *   --mq-dot         the selection dot
 *   --mq-card        card surface for the `card` variant
 *   --mq-card-brd    card border
 *   --mq-ring        focus ring
 *   --mq-error       invalid border and message
 */

/** Palette per material. Applied to the group; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-circle:#fdf6f0] [--mq-circle-brd:rgba(120,80,55,0.70)]",
    "[--mq-fill:#ff9077] [--mq-fill-brd:rgba(120,40,25,0.32)] [--mq-dot:#4a1d13]",
    "[--mq-card:#f6e7dd] [--mq-card-brd:rgba(51,38,30,0.55)]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
  ].join(" "),
  glass: [
    "[--mq-circle:rgba(255,255,255,0.66)] [--mq-circle-brd:rgba(23,24,23,0.65)]",
    "[--mq-fill:rgba(23,24,23,0.82)] [--mq-fill-brd:rgba(255,255,255,0.5)] [--mq-dot:#ffffff]",
    "[--mq-card:rgba(255,255,255,0.58)] [--mq-card-brd:rgba(23,24,23,0.65)]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  skeuo: [
    "[--mq-circle:#e6e3da] [--mq-circle-brd:rgba(25,25,23,0.55)]",
    "[--mq-fill:#2a2a26] [--mq-fill-brd:rgba(0,0,0,0.5)] [--mq-dot:#f6f4ee]",
    "[--mq-card:#ddd9d0] [--mq-card-brd:rgba(25,25,23,0.50)]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour
  // scheme. Safe here because the control and the dot on it flip together.
  adaptive: [
    "[--mq-circle:#ffffff] [--mq-circle-brd:rgba(23,24,23,0.60)]",
    "[--mq-fill:#171817] [--mq-fill-brd:rgba(0,0,0,0.4)] [--mq-dot:#f6f5f1]",
    "[--mq-card:#ffffff] [--mq-card-brd:rgba(23,24,23,0.55)]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
    "dark:[--mq-circle:#232327] dark:[--mq-circle-brd:rgba(255,255,255,0.50)]",
    "dark:[--mq-fill:#f1efe9] dark:[--mq-fill-brd:rgba(255,255,255,0.4)] dark:[--mq-dot:#171817]",
    "dark:[--mq-card:#232327] dark:[--mq-card-brd:rgba(255,255,255,0.45)]",
    "dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
  ].join(" "),
} as const;

type RadioMaterial = keyof typeof MATERIAL_TOKENS;
type RadioVariant = "default" | "card";
type RadioSize = "sm" | "md" | "lg";

type RadioGroupContextValue = {
  disabled: boolean;
  material: RadioMaterial;
  name: string;
  onSelect: (value: string) => void;
  size: RadioSize;
  value: string | undefined;
  variant: RadioVariant;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

function useRadioGroup(part: string) {
  const context = React.useContext(RadioGroupContext);
  if (!context) throw new Error(`<${part}> must be rendered inside <RadioGroup>`);
  return context;
}

const circleVariants = cva(
  [
    "pointer-events-none grid shrink-0 place-items-center rounded-full border",
    "bg-[var(--mq-circle,#fdf6f0)] border-[var(--mq-circle-brd,rgba(120,80,55,0.70))]",
    // Driven by the input's own :checked, so the drawn control can never
    // disagree with the one it stands in for.
    "peer-checked:bg-[var(--mq-fill,#ff9077)] peer-checked:border-[var(--mq-fill-brd,rgba(120,40,25,0.32))]",
    // The dot lives *inside* this circle, so it is not a sibling of the input
    // and `peer-*` (a `~` combinator) can never reach it. The circle is a
    // sibling, so it translates the peer state into an inherited custom
    // property that its descendants can read.
    "[--mq-on:0] peer-checked:[--mq-on:1]",
    // Only the surface and the border move between states — nothing phantom.
    "transition-[background-color,border-color] duration-150 ease-out",
    "motion-reduce:transition-none",
    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[2px]",
    "peer-focus-visible:outline-[var(--mq-ring,#171817)]",
    "peer-data-[focus=true]:outline-2 peer-data-[focus=true]:outline-offset-[2px]",
    "peer-data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:peer-focus-visible:outline-[Highlight]",
    // `aria-invalid` lives on the group, which is an ancestor rather than a
    // sibling, so this reads it with `group-*` (a descendant combinator).
    "group-data-[invalid=true]/radio:border-[var(--mq-error,#9c2f22)]",
    "peer-disabled:opacity-55",
    // Forced colours discard every fill, so a control that signalled "selected"
    // only by its background would read as empty. The border stays a system
    // colour and the dot itself carries the state.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-[16px]",
        md: "size-[18px]",
        lg: "size-[22px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/**
 * The selection dot.
 *
 * `aria-hidden`: the native input already exposes checked, and a second
 * announcement would fight it. Visibility is opacity so the dot keeps its shape
 * in forced-colors mode, where a background-driven indicator would vanish.
 */
const dotVariants = cva(
  [
    "rounded-full bg-[var(--mq-dot,#4a1d13)] opacity-[var(--mq-on,0)]",
    "transition-[opacity] duration-150 ease-out motion-reduce:transition-none",
    "forced-colors:bg-[CanvasText]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-[6px]",
        md: "size-[7px]",
        lg: "size-[9px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const rowVariants = cva("flex cursor-pointer items-center gap-[10px] text-left", {
  variants: {
    variant: {
      default: "",
      // The whole option becomes a surface. `has-[:checked]` rather than
      // `peer-*`: the input is a *descendant* of this label, not a sibling, so
      // only a `:has()` selector can reach up from it.
      card: [
        "rounded-[var(--mq-radius,12px)] border p-[var(--mq-pad,12px)]",
        "border-[var(--mq-card-brd,rgba(51,38,30,0.55))] bg-[var(--mq-card,#f6e7dd)]",
        // Selection *adds* an inset ring in the material's accent rather than
        // recolouring the border. Swapping the border to the accent would make
        // the selected card less visible than an unselected one on the warmer
        // materials (clay's accent measures 1.92:1 against the page, its
        // neutral border 3.46:1), and an outer ring would shift the layout.
        // The authoritative state indicator is the radio itself, which stays
        // compliant; this is reinforcement.
        "has-[:checked]:shadow-[inset_0_0_0_2px_var(--mq-fill,#ff9077)]",
        "transition-[box-shadow] duration-150 ease-out motion-reduce:transition-none",
        "forced-colors:border-[CanvasText]",
      ].join(" "),
    },
    size: {
      sm: "[--mq-radius:10px] [--mq-pad:10px] text-[length:12px]",
      md: "[--mq-radius:12px] [--mq-pad:12px] text-[length:13px]",
      lg: "[--mq-radius:14px] [--mq-pad:14px] text-[length:14px]",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export type RadioGroupProps = Omit<React.ComponentPropsWithRef<"div">, "onChange"> & {
  material?: RadioMaterial;
  variant?: RadioVariant;
  size?: RadioSize;
  /** Shared `name`. Generated when omitted — it is what groups the radios. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Disables every option in the group. */
  disabled?: boolean;
  /** Marks the group invalid. Drives `aria-invalid` and the error styling. */
  invalid?: boolean;
};

/**
 * The group.
 *
 * `role="radiogroup"` on a plain element rather than `<fieldset><legend>`:
 * both are valid, and the fieldset carries a default border and legend
 * placement that has to be undone before it can be styled — with the label
 * wired through `aria-labelledby` the grouping is announced just the same.
 */
export function RadioGroup({
  children,
  className,
  defaultValue,
  disabled = false,
  invalid = false,
  material = "clay",
  name,
  onValueChange,
  size = "md",
  value,
  variant = "default",
  ...props
}: RadioGroupProps) {
  const generatedName = React.useId();
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<string | undefined>(defaultValue);
  const current = controlled ? value : uncontrolled;

  const onSelect = React.useCallback(
    (next: string) => {
      if (!controlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange, setUncontrolled],
  );

  const context = React.useMemo<RadioGroupContextValue>(
    () => ({
      disabled,
      material,
      name: name ?? generatedName,
      onSelect,
      size,
      value: current,
      variant,
    }),
    [current, disabled, generatedName, material, name, onSelect, size, variant],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <div
        {...props}
        aria-invalid={invalid || undefined}
        className={cn(
          "group/radio flex flex-col gap-[var(--mq-gap,10px)]",
          size === "sm" && "[--mq-gap:8px]",
          size === "lg" && "[--mq-gap:12px]",
          MATERIAL_TOKENS[material],
          className,
        )}
        data-invalid={invalid ? "true" : undefined}
        data-material={material}
        role="radiogroup"
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupItemProps = Omit<
  React.ComponentPropsWithRef<"input">,
  "type" | "name" | "size" | "checked" | "onChange"
> & {
  value: string;
  /** Disables this option only. The group can disable all of them at once. */
  disabled?: boolean;
};

export function RadioGroupItem({
  children,
  className,
  disabled = false,
  value,
  ...props
}: RadioGroupItemProps) {
  const group = useRadioGroup("RadioGroupItem");
  const isDisabled = disabled || group.disabled;

  return (
    // A real `<label>` wrapping the input: the association needs no matching
    // ids, and the whole row — text included — becomes a hit target.
    <label
      className={cn(
        rowVariants({ variant: group.variant, size: group.size }),
        isDisabled && "cursor-not-allowed opacity-55",
        className,
      )}
    >
      <span className="relative inline-flex shrink-0">
        <input
          {...props}
          // Transparent and laid exactly over the drawn circle: the real control
          // keeps the hit area, the focus, and the keyboard.
          checked={group.value === value}
          className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          disabled={isDisabled}
          name={group.name}
          onChange={() => group.onSelect(value)}
          type="radio"
          value={value}
        />
        <span aria-hidden="true" className={circleVariants({ size: group.size })}>
          <span className={dotVariants({ size: group.size })} />
        </span>
      </span>
      <span className="min-w-0 font-bold leading-[1.4]">{children}</span>
    </label>
  );
}

export type RadioGroupFieldProps = RadioGroupProps & {
  /** Visible group label, wired through `aria-labelledby`. */
  label: React.ReactNode;
  /** Guidance shown under the group while it is valid. */
  helperText?: React.ReactNode;
  /** Error shown instead of `helperText`. Its presence implies `invalid`. */
  errorText?: React.ReactNode;
  /** Class for the wrapper. `className` still targets the group itself. */
  fieldClassName?: string;
};

/**
 * Group + label + message, wired together.
 *
 * The message region is always rendered, even when empty: an `aria-live` region
 * has to be in the DOM *before* the text arrives for the announcement to be
 * reliable. `aria-describedby` is composed rather than overwritten, so a caller
 * passing their own description keeps it.
 */
export function RadioGroupField({
  errorText,
  fieldClassName,
  helperText,
  invalid = false,
  label,
  material = "clay",
  ...props
}: RadioGroupFieldProps) {
  const generatedId = React.useId();
  const labelId = `${generatedId}-label`;
  const messageId = `${generatedId}-message`;
  const isInvalid = invalid || errorText != null;
  const message = errorText ?? helperText;

  const describedBy = [props["aria-describedby"], message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[8px] text-left",
        // Tokens on the wrapper so the message — a sibling of the group, not a
        // descendant — resolves the material's own `--mq-error`.
        MATERIAL_TOKENS[material],
        fieldClassName,
      )}
    >
      {/* `currentColor`: the label sits on the host's surface, not on one of
          ours, so pinning a colour would be guessing at the page. */}
      <span
        className="text-[color:currentColor] text-[length:12px] leading-[1.3] font-extrabold tracking-[-0.01em]"
        id={labelId}
      >
        {label}
      </span>
      <RadioGroup
        {...props}
        aria-describedby={describedBy || undefined}
        aria-labelledby={labelId}
        invalid={isInvalid}
        material={material}
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

export { circleVariants, rowVariants };
