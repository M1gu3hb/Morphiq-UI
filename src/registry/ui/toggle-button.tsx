"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Toggle Button
 *
 * A native `<button>` that flips between an off and an on state, carrying the
 * on state with `aria-pressed`. Pressed is a PERSISTENT sunk-in look — a deeper
 * inset well than the resting surface, keyed on the pressed state rather than on
 * the momentary `:active` press — and it is announced by more than depth: the
 * leading glyph swaps from a hollow Circle (off) to a Check (on), so the state
 * is never carried by colour or depth alone. Enter/Space toggle it for free,
 * because it is a real button.
 *
 * Controlled or uncontrolled: pass `pressed` + `onPressedChange` to drive it, or
 * leave it to manage its own state from `defaultPressed`.
 *
 * Self-contained by design: the four material recipes are copied out of the
 * Button so this file plus `src/lib/cn.ts` reproduce the full tactile look with
 * no dependency on any global stylesheet or `:root` custom property. Each
 * material inlines its PRIMARY-intent token values, and every `var()` still
 * carries a literal fallback, so any theming knob below can be overridden from a
 * parent or from `className` to retheme without forking:
 *
 *   --mq-body  surface color
 *   --mq-lit   top highlight color (gradient materials)
 *   --mq-edge  extruded bottom edge / pressed depth color
 *   --mq-text  foreground / icon color
 *   --mq-brd   border color
 *   --mq-ring  focus ring color
 */

/** Local material type — deliberately NOT imported from `@/lib/component-data`. */
type Material = "clay" | "glass" | "skeuo" | "adaptive";

/** Fallback material, single-sourced so the default and `data-material` agree. */
const DEFAULT_MATERIAL: Material = "clay";

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so documentation surfaces and visual-regression
 * tests can render the focused look without synthesising a keyboard event
 * (a programmatic `.focus()` does not reliably trigger `:focus-visible`). The
 * UA outline is not reset with `outline-none`: width, offset and colour are set
 * together, which fully replaces it on focus, and `forced-colors` swaps in the
 * system Highlight so the ring survives a high-contrast theme.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

const toggleButtonVariants = cva(
  [
    "relative isolate inline-flex shrink-0 select-none items-center justify-center",
    "border font-extrabold tracking-[-0.01em]",
    "cursor-pointer appearance-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // `translate`/`filter`/`backdrop-filter` are the STANDALONE properties
    // Tailwind v4 writes for `translate-*` / `brightness-*` / `backdrop-blur-*`,
    // so we name them (never `transform`). Only properties some state actually
    // changes are listed: translate + box-shadow move on hover/press/pressed,
    // glass shifts its backdrop-filter on hover, skeuo its filter, and opacity
    // drops when disabled. Nothing changes background-color, so it is omitted —
    // listing it would be a phantom transition firing on nothing.
    "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
    // Removes the hover/press TRAVEL: `transition-none` drops the animation, and
    // these zero the translate itself so a reduced-motion user gets no hover/press
    // jump at all. The persistent pressed inset well (`data-[pressed=true]`, a
    // box-shadow rather than a translate) is left intact, so the tactile "on"
    // feedback survives — only the movement is gone.
    "motion-reduce:transition-none",
    "motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
    FOCUS_RING,
    // Bounds survive forced-colors once fills and shadows are discarded.
    "forced-colors:border-[CanvasText]",
    // Pressed is the "on"/selected state: mark it with the system Highlight in
    // forced-colors so it stays distinguishable from off when the well vanishes.
    "data-[pressed=true]:forced-colors:text-[Highlight]",
    // Native :disabled — there is no loading state here, so the attribute carries
    // the correct focus/tab-order semantics for free. Kept minimal (dim + cursor)
    // on purpose, so a disabled toggle still shows its pressed inset well and its
    // Check glyph: the state is never lost, only greyed.
    "disabled:cursor-not-allowed disabled:opacity-55",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817]",
          "bg-[var(--mq-body,#ff9077)] text-[var(--mq-text,#4a1d13)]",
          "border-[var(--mq-brd,rgba(120,40,25,0.16))]",
          "shadow-[inset_0_3px_3px_rgba(255,255,255,0.55),inset_0_-4px_6px_rgba(120,40,25,0.18),0_6px_0_var(--mq-edge,#c9482f),0_12px_20px_rgba(75,40,31,0.18)]",
          "hover:-translate-y-[2px]",
          "hover:shadow-[inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(120,40,25,0.18),0_8px_0_var(--mq-edge,#c9482f),0_16px_26px_rgba(75,40,31,0.2)]",
          "active:translate-y-[3px]",
          "active:shadow-[inset_0_3px_7px_rgba(120,40,25,0.32),0_2px_0_var(--mq-edge,#c9482f)]",
          // Pressed persistent: sunk ~3px into a warm inset well, deeper than the
          // momentary :active dip and held for as long as aria-pressed is true.
          "data-[pressed=true]:translate-y-[3px]",
          "data-[pressed=true]:shadow-[inset_0_4px_8px_rgba(120,40,25,0.38),0_2px_0_var(--mq-edge,#c9482f)]",
          // Keep it sunk on hover-while-pressed — the compound selector's higher
          // specificity reliably beats the plain hover lift regardless of order.
          "data-[pressed=true]:hover:translate-y-[3px]",
          "data-[pressed=true]:hover:shadow-[inset_0_4px_8px_rgba(120,40,25,0.38),0_2px_0_var(--mq-edge,#c9482f)]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817]",
          "bg-[var(--mq-body,rgba(23,24,23,0.74))] text-[var(--mq-text,#ffffff)]",
          "border-[var(--mq-brd,rgba(255,255,255,0.28))]",
          "backdrop-blur-[14px] backdrop-saturate-[160%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_26px_rgba(24,20,40,0.2)]",
          "hover:-translate-y-[1px] hover:backdrop-blur-[18px]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_32px_rgba(24,20,40,0.26)]",
          "active:translate-y-[1px]",
          "active:shadow-[inset_0_2px_7px_rgba(24,20,40,0.3)]",
          // Pressed persistent: a cool ~1px inset, deeper than the resting rim.
          "data-[pressed=true]:translate-y-[1px]",
          "data-[pressed=true]:shadow-[inset_0_3px_9px_rgba(24,20,40,0.36)]",
          "data-[pressed=true]:hover:translate-y-[1px]",
          "data-[pressed=true]:hover:shadow-[inset_0_3px_9px_rgba(24,20,40,0.36)]",
          // Frosted fills vanish in forced colors; keep the bounds only.
          "forced-colors:shadow-none",
        ].join(" "),
        skeuo: [
          "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
          "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] text-[var(--mq-text,#f6f4ee)]",
          "border-[var(--mq-brd,rgba(0,0,0,0.5))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_5px_0_var(--mq-edge,#131311),0_10px_16px_rgba(38,36,31,0.28)]",
          "hover:-translate-y-[1px] hover:brightness-[1.08]",
          "active:translate-y-[4px]",
          "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
          // Pressed persistent: skeuo travels the deepest — ~4px onto a hard
          // inset floor, the most physical of the four "on" wells.
          "data-[pressed=true]:translate-y-[4px]",
          "data-[pressed=true]:shadow-[inset_0_4px_8px_rgba(0,0,0,0.5),0_1px_0_var(--mq-edge,#131311)]",
          "data-[pressed=true]:hover:translate-y-[4px]",
          "data-[pressed=true]:hover:shadow-[inset_0_4px_8px_rgba(0,0,0,0.5),0_1px_0_var(--mq-edge,#131311)]",
        ].join(" "),
        // Polymorphic: no ornament. It adapts instead — on coarse pointers it
        // grows to a comfortable 48px touch target with more air.
        adaptive: [
          "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
          "bg-[var(--mq-body,#171817)] text-[var(--mq-text,#f6f5f1)]",
          "border-[var(--mq-brd,rgba(0,0,0,0.4))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.12)]",
          "hover:shadow-[0_5px_14px_rgba(20,20,18,0.18)]",
          "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
          // Pressed persistent: a restrained ~1px inset — the polymorph stays
          // understated where the others get physical.
          "data-[pressed=true]:translate-y-[1px]",
          "data-[pressed=true]:shadow-[inset_0_3px_6px_rgba(0,0,0,0.26)]",
          "data-[pressed=true]:hover:translate-y-[1px]",
          "data-[pressed=true]:hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.26)]",
          "pointer-coarse:min-h-[48px] pointer-coarse:gap-[10px]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "h-[36px] gap-[6px] rounded-[12px] px-[14px] text-[12px]/[1]",
        md: "h-[44px] gap-[8px] rounded-[15px] px-[20px] text-[13px]/[1]",
        lg: "h-[52px] gap-[10px] rounded-[18px] px-[26px] text-[14px]/[1]",
      },
    },
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

// `ComponentPropsWithRef` (not `...WithoutRef`): React 19 passes `ref` as a
// normal prop, so the public type accepts it without a `forwardRef` wrapper.
// `onClick` is preserved and fires alongside the toggle; the pressed state is
// exposed through the dedicated `pressed`/`onPressedChange` pair instead.
export type ToggleButtonProps = Omit<React.ComponentPropsWithRef<"button">, "color"> &
  VariantProps<typeof toggleButtonVariants> & {
    /** Controlled pressed state. Supply with `onPressedChange` to drive it. */
    pressed?: boolean;
    /** Initial pressed state when uncontrolled. Defaults to false. */
    defaultPressed?: boolean;
    /** Called with the next pressed value on every toggle. */
    onPressedChange?: (pressed: boolean) => void;
  };

/** On indicator: a Check. A shape change (not a colour) that carries the state. */
function CheckIcon() {
  return <Check aria-hidden="true" className="size-[1.05em] shrink-0" strokeWidth={2.75} />;
}

/** Off indicator: a hollow Circle, occupying the same box so nothing reflows. */
function CircleIcon() {
  return <Circle aria-hidden="true" className="size-[1.05em] shrink-0" strokeWidth={2.5} />;
}

export function ToggleButton({
  children,
  className,
  defaultPressed = false,
  disabled = false,
  material,
  onClick,
  onPressedChange,
  pressed,
  size,
  type,
  variant,
  ...props
}: ToggleButtonProps) {
  // Controlled when `pressed` is supplied; otherwise the component owns the
  // state and seeds it from `defaultPressed`.
  const isControlled = pressed !== undefined;
  const [uncontrolledPressed, setUncontrolledPressed] = React.useState(defaultPressed);
  const isPressed = isControlled ? pressed : uncontrolledPressed;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    // A caller can veto the toggle by calling preventDefault in its onClick.
    if (event.defaultPrevented) return;
    const next = !isPressed;
    if (!isControlled) setUncontrolledPressed(next);
    onPressedChange?.(next);
  }

  return (
    // `props` is spread first so a caller's attributes (e.g. an aria-label for an
    // icon-only usage) are present, while the derived state attributes and the
    // controlled `type`/`disabled` below win over anything conflicting.
    <button
      {...props}
      aria-pressed={isPressed}
      className={cn(toggleButtonVariants({ material, variant, size }), className)}
      data-material={material ?? DEFAULT_MATERIAL}
      data-pressed={isPressed || undefined}
      disabled={disabled}
      onClick={handleClick}
      type={type ?? "button"}
    >
      {isPressed ? <CheckIcon /> : <CircleIcon />}
      {children == null ? null : <span>{children}</span>}
    </button>
  );
}

export { toggleButtonVariants };
