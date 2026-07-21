"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Button
 *
 * Self-contained by design: every material recipe lives in this file. It does
 * not read `:root` custom properties and it does not depend on any class from
 * a global stylesheet, so copying this file (plus `src/lib/cn.ts`) into another
 * project reproduces the full look.
 *
 * Theming knobs are local CSS variables declared on the element itself, each
 * used with a literal fallback. Override any of them from a parent or from
 * `className` to retheme a material without forking the recipe:
 *
 *   --mq-body  surface color
 *   --mq-lit   top highlight color (gradient materials)
 *   --mq-edge  extruded bottom edge / pressed depth color
 *   --mq-text  foreground color
 *   --mq-brd   border color
 *   --mq-ring  focus ring color
 *
 * Contrast contract: the glass recipes ship an opaque-enough tint that label
 * contrast stays >= 4.5:1 against both a white and a black backdrop. Glass must
 * never borrow its legibility from whatever happens to sit behind it.
 */

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so documentation surfaces and visual-regression
 * tests can render the focused look without synthesising a keyboard event
 * (a programmatic `.focus()` does not reliably trigger `:focus-visible`).
 *
 * We do not reset the UA outline with `outline-none`: these declarations set
 * width, offset and color together, which fully replaces it on focus.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

const buttonVariants = cva(
  [
    "relative isolate inline-flex shrink-0 select-none items-center justify-center",
    // Line-height is folded into the size utilities (`text-[13px]/[1]`) rather
    // than declared here: `tailwind-merge` treats font-size as conflicting with
    // `leading-*`, so a bare `leading-none` in the base would be silently
    // dropped by the later size utility.
    "border font-extrabold tracking-[-0.01em]",
    "cursor-pointer appearance-none",
    // `translate`, not `transform`: Tailwind v4's `translate-*` utilities write
    // the standalone `translate` property (`.translate-x-0{translate:var(...)}`),
    // so listing `transform` here animated nothing and the hover lift and the
    // active press snapped instead of moving. Nothing in this file sets
    // `transform` — no rotate, scale, skew or arbitrary transform — so it is
    // dropped rather than kept alongside.
    "transition-[translate,box-shadow,background-color,backdrop-filter,filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    FOCUS_RING,
    // Non-interactive states. Driven by `data-state` (not `:disabled`) so the
    // loading look never inherits the faded disabled look.
    "data-[state=disabled]:cursor-not-allowed data-[state=disabled]:opacity-55",
    "data-[state=disabled]:translate-y-0 data-[state=disabled]:shadow-none",
    "data-[state=loading]:cursor-progress",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#ff9077)] text-[var(--mq-text,#4a1d13)]",
          "border-[var(--mq-brd,rgba(120,40,25,0.16))]",
          "shadow-[inset_0_3px_3px_rgba(255,255,255,0.55),inset_0_-4px_6px_rgba(120,40,25,0.18),0_6px_0_var(--mq-edge,#c9482f),0_12px_20px_rgba(75,40,31,0.18)]",
          "hover:-translate-y-[2px]",
          "hover:shadow-[inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(120,40,25,0.18),0_8px_0_var(--mq-edge,#c9482f),0_16px_26px_rgba(75,40,31,0.2)]",
          "active:translate-y-[3px]",
          "active:shadow-[inset_0_3px_7px_rgba(120,40,25,0.32),0_2px_0_var(--mq-edge,#c9482f)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(23,24,23,0.74))] text-[var(--mq-text,#ffffff)]",
          "border-[var(--mq-brd,rgba(255,255,255,0.28))]",
          "backdrop-blur-[14px] backdrop-saturate-[160%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_26px_rgba(24,20,40,0.2)]",
          "hover:-translate-y-[1px] hover:backdrop-blur-[18px]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_32px_rgba(24,20,40,0.26)]",
          "active:translate-y-[1px]",
          "active:shadow-[inset_0_2px_7px_rgba(24,20,40,0.3)]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] text-[var(--mq-text,#f6f4ee)]",
          "border-[var(--mq-brd,rgba(0,0,0,0.5))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_5px_0_var(--mq-edge,#131311),0_10px_16px_rgba(38,36,31,0.28)]",
          "hover:-translate-y-[1px] hover:brightness-[1.08]",
          "active:translate-y-[4px]",
          "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
        ].join(" "),
        // Polymorphic: no ornament to speak of. It adapts instead — density
        // follows the pointer type, palette follows the color scheme.
        adaptive: [
          "bg-[var(--mq-body,#171817)] text-[var(--mq-text,#f6f5f1)]",
          "border-[var(--mq-brd,rgba(0,0,0,0.4))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.12)]",
          "hover:shadow-[0_5px_14px_rgba(20,20,18,0.18)]",
          "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
          // Coarse pointers get a comfortable touch target and more air.
          // Only ever *grows* the control: horizontal padding stays owned by
          // the size variant, so this cannot shrink `lg` on a touch device.
          "pointer-coarse:min-h-[48px] pointer-coarse:gap-[10px]",
        ].join(" "),
      },
      intent: {
        primary: "",
        secondary: "",
        ghost: "",
      },
      size: {
        sm: "h-[36px] gap-[6px] rounded-[12px] px-[14px] text-[12px]/[1]",
        md: "h-[44px] gap-[8px] rounded-[15px] px-[20px] text-[13px]/[1]",
        lg: "h-[52px] gap-[10px] rounded-[18px] px-[26px] text-[14px]/[1]",
      },
    },
    compoundVariants: [
      // ---------------------------------------------------------------- clay
      {
        material: "clay",
        intent: "primary",
        class:
          "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817]",
      },
      {
        material: "clay",
        intent: "secondary",
        class:
          "[--mq-body:#efe7db] [--mq-edge:#c0b3a1] [--mq-text:#2c2721] [--mq-brd:rgba(70,55,40,0.18)] [--mq-ring:#171817]",
      },
      {
        material: "clay",
        intent: "ghost",
        class:
          "[--mq-body:transparent] [--mq-edge:transparent] [--mq-text:#463a2e] [--mq-brd:rgba(70,55,40,0.24)] [--mq-ring:#171817] " +
          "shadow-none hover:shadow-none hover:bg-[rgba(239,231,219,0.75)] active:shadow-none",
      },
      // --------------------------------------------------------------- glass
      {
        material: "glass",
        intent: "primary",
        class:
          "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        intent: "secondary",
        class:
          "[--mq-body:rgba(255,255,255,0.72)] [--mq-text:#23231f] [--mq-brd:rgba(255,255,255,0.78)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        intent: "ghost",
        class:
          "[--mq-body:rgba(255,255,255,0.55)] [--mq-text:#23231f] [--mq-brd:rgba(255,255,255,0.5)] [--mq-ring:#171817]",
      },
      // --------------------------------------------------------------- skeuo
      {
        material: "skeuo",
        intent: "primary",
        class:
          "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
      },
      {
        material: "skeuo",
        intent: "secondary",
        class:
          "[--mq-lit:#f4f2ec] [--mq-body:#cbc7bd] [--mq-edge:#98948c] [--mq-text:#23231f] [--mq-brd:rgba(25,25,23,0.3)] [--mq-ring:#171817]",
      },
      {
        material: "skeuo",
        intent: "ghost",
        class:
          "[--mq-lit:transparent] [--mq-body:transparent] [--mq-edge:transparent] [--mq-text:#33322d] [--mq-brd:rgba(25,25,23,0.3)] [--mq-ring:#171817] " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] hover:brightness-100 hover:bg-[rgba(203,199,189,0.45)] " +
          "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
      },
      // ------------------------------------------------------------ adaptive
      {
        material: "adaptive",
        intent: "primary",
        class:
          "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        intent: "secondary",
        class:
          "[--mq-body:#ffffff] [--mq-text:#23231f] [--mq-brd:rgba(23,24,23,0.18)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#26262a] dark:[--mq-text:#f1efe9] dark:[--mq-brd:rgba(255,255,255,0.18)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        intent: "ghost",
        // Ghost has no surface of its own, so it inherits the host's text
        // colour instead of flipping on `prefers-color-scheme`. That preference
        // describes the *OS*, not the surface actually behind the button: a
        // light page on a machine set to dark mode would otherwise paint pale
        // text straight onto pale background (measured 1.30:1). Inheriting
        // keeps the label legible wherever the host itself is legible.
        // The hover tint is a neutral grey for the same reason — it reads on
        // both a light and a dark surface.
        // `currentColor`, not `inherit`: a CSS-wide keyword written into a
        // custom property is resolved as that property inheriting its parent's
        // (unset) value, which makes it invalid and silently drops the button
        // back to the material's light fallback. `color: currentColor` is the
        // construct that genuinely resolves to the inherited colour.
        class:
          "[--mq-body:transparent] [--mq-text:currentColor] [--mq-brd:transparent] [--mq-ring:currentColor] " +
          "shadow-none hover:shadow-none hover:bg-[rgba(125,125,120,0.16)] active:shadow-none",
      },
    ],
    defaultVariants: {
      material: "clay",
      intent: "primary",
      size: "md",
    },
  },
);

/** Visual state the preview/documentation surface can force. */
export type ButtonForcedState = "default" | "focus" | "loading" | "disabled";

// `ComponentPropsWithRef` (not `...WithoutRef`): React 19 passes `ref` as a
// normal prop, so the public type must accept it without a `forwardRef` wrapper.
export type ButtonProps = Omit<React.ComponentPropsWithRef<"button">, "color"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element instead of a `<button>`, merging props onto it. */
    asChild?: boolean;
    /**
     * Shows a spinner, sets `aria-busy`, and blocks activation.
     *
     * Deliberately does NOT set the native `disabled` attribute: a disabled
     * button is removed from the tab order and blurred by the UA, which would
     * throw focus to `<body>` at the exact moment the `aria-busy` announcement
     * is meant to be read. The control stays focusable and activation is
     * suppressed in the handlers instead.
     */
    loading?: boolean;
  };

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-[1.05em] shrink-0 animate-spin motion-reduce:animate-none", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.28" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

export function Button({
  asChild = false,
  children,
  className,
  disabled = false,
  intent,
  loading = false,
  material,
  onClick,
  onKeyDown,
  size,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || loading;
  const state = disabled ? "disabled" : loading ? "loading" : "idle";

  // Activation is suppressed here rather than by the native `disabled`
  // attribute. That covers three cases the attribute cannot: `loading` (which
  // must stay focusable so `aria-busy` is reachable), `asChild` (where the
  // slotted element may be an anchor, on which `disabled` means nothing and
  // `aria-disabled` is advisory only), and keyboard activation of that anchor.
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (isDisabled && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onKeyDown?.(event);
  }

  return (
    // `props` is spread first on purpose: the accessibility and state
    // attributes below are derived from `loading`/`disabled` and must win over
    // anything a caller passes through.
    <Comp
      {...props}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      className={cn(buttonVariants({ material, intent, size }), className)}
      data-material={material ?? "clay"}
      data-state={state}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      // `disabled` and `type` are valid on <button> only. `disabled` is driven
      // by the `disabled` prop alone — see the `loading` docs above for why the
      // busy state must not use it. When `asChild` swaps in another element,
      // `type` is forwarded only if the caller actually supplied one.
      {...(asChild
        ? type !== undefined
          ? { type }
          : {}
        : { disabled, type: type ?? "button" })}
    >
      {loading ? <Spinner /> : null}
      <Slottable>{children}</Slottable>
    </Comp>
  );
}

export { buttonVariants };
