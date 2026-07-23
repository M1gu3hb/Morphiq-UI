"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Icon Button
 *
 * A compact, fixed-footprint control that holds a single icon — square or
 * circular — with the tactile 4-material press recipe (clay / glass / skeuo /
 * adaptive) carried straight over from the Button, using each material's
 * PRIMARY-intent token values inlined onto a single `material` axis.
 *
 * Self-contained by design: every material recipe lives in this file. It does
 * not read `:root` custom properties and does not depend on any class from a
 * global stylesheet, so copying this file (plus `src/lib/cn.ts`) into another
 * project reproduces the full look.
 *
 * Theming knobs are local CSS variables, each used with a literal fallback so a
 * missing declaration never leaves a property empty:
 *
 *   --mq-body  surface color
 *   --mq-lit   top highlight color (gradient materials)
 *   --mq-edge  extruded bottom edge / pressed depth color
 *   --mq-text  foreground / icon color
 *   --mq-brd   border color
 *   --mq-ring  focus ring color
 *
 * Accessible-name contract: an icon has no text, so `aria-label` is REQUIRED in
 * the props type. An icon-only control with no name is the classic failure this
 * component refuses to let you ship.
 */

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so documentation surfaces and visual-regression
 * tests can render the focused look without synthesising a keyboard event
 * (a programmatic `.focus()` does not reliably trigger `:focus-visible`).
 *
 * The UA outline is not reset with `outline-none`: these declarations set width,
 * offset and color together, which fully replaces it on focus.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

const iconButtonVariants = cva(
  [
    "relative isolate inline-flex shrink-0 select-none items-center justify-center",
    // Fixed box: padding is zeroed so the icon centers inside the size-driven
    // square rather than being pushed around by intrinsic padding.
    "border p-0",
    "cursor-pointer appearance-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // `translate`, not `transform`: Tailwind v4's `translate-*`/`scale-*`
    // utilities write the standalone `translate`/`scale` properties, and
    // `brightness-*`/`backdrop-blur-*` write `filter`/`backdrop-filter`. Listing
    // `transform` would animate nothing. Only properties some state actually
    // changes are named here — no `background-color`, because no material tints
    // its surface on hover/active; listing it would be a phantom transition.
    "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
    // Removes the hover/press TRAVEL but leaves the `:active` inset well applied
    // instantly, so the tactile pressed feedback survives reduced-motion.
    "motion-reduce:transition-none",
    FOCUS_RING,
    // Forced colours discard fills and shadows; a real border keeps the bounds.
    "forced-colors:border-[CanvasText]",
    // Native `:disabled` — no loading state here, so the attribute is free to
    // use and carries the correct focus/tab-order semantics for us.
    "disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0 disabled:shadow-none",
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
          // Clay sinks ~3px into a warm inset well.
          "active:translate-y-[3px]",
          "active:shadow-[inset_0_3px_7px_rgba(120,40,25,0.32),0_2px_0_var(--mq-edge,#c9482f)]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817]",
          "bg-[var(--mq-body,rgba(23,24,23,0.74))] text-[var(--mq-text,#ffffff)]",
          "border-[var(--mq-brd,rgba(255,255,255,0.28))]",
          "backdrop-blur-[14px] backdrop-saturate-[160%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_26px_rgba(24,20,40,0.2)]",
          "hover:-translate-y-[1px] hover:backdrop-blur-[18px]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_32px_rgba(24,20,40,0.26)]",
          // Glass barely dips ~1px into a cool inset.
          "active:translate-y-[1px]",
          "active:shadow-[inset_0_2px_7px_rgba(24,20,40,0.3)]",
        ].join(" "),
        skeuo: [
          "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
          "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] text-[var(--mq-text,#f6f4ee)]",
          "border-[var(--mq-brd,rgba(0,0,0,0.5))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_5px_0_var(--mq-edge,#131311),0_10px_16px_rgba(38,36,31,0.28)]",
          "hover:-translate-y-[1px] hover:brightness-[1.08]",
          // Skeuo travels the deepest — ~4px down into a hard inset floor.
          "active:translate-y-[4px]",
          "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
        ].join(" "),
        // Polymorphic: no ornament. It adapts instead — on coarse pointers it
        // grows to a comfortable 48px touch target, staying square (both min-w
        // and min-h) so the h == w footprint is never broken.
        adaptive: [
          "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
          "bg-[var(--mq-body,#171817)] text-[var(--mq-text,#f6f5f1)]",
          "border-[var(--mq-brd,rgba(0,0,0,0.4))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.12)]",
          "hover:shadow-[0_5px_14px_rgba(20,20,18,0.18)]",
          "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
          "pointer-coarse:min-h-[48px] pointer-coarse:min-w-[48px]",
        ].join(" "),
      },
      // The variant chooses the shape. `square` gets a size-tuned radius from the
      // compound variants below; `circle` is fully rounded.
      variant: {
        square: "",
        circle: "rounded-full",
      },
      // Fixed square footprint: h == w at every size (32 / 40 / 48px), with the
      // child icon scaled to match.
      size: {
        sm: "h-[32px] w-[32px] [&_svg]:size-[16px]",
        md: "h-[40px] w-[40px] [&_svg]:size-[18px]",
        lg: "h-[48px] w-[48px] [&_svg]:size-[20px]",
      },
    },
    compoundVariants: [
      { variant: "square", size: "sm", class: "rounded-[9px]" },
      { variant: "square", size: "md", class: "rounded-[11px]" },
      { variant: "square", size: "lg", class: "rounded-[13px]" },
    ],
    defaultVariants: {
      material: "clay",
      variant: "square",
      size: "md",
    },
  },
);

// `ComponentPropsWithRef` (not `...WithoutRef`): React 19 passes `ref` as a
// normal prop, so the public type accepts it without a `forwardRef` wrapper.
// `aria-label` is intersected back in as REQUIRED — an icon-only button with no
// accessible name is the failure this type prevents at compile time.
export type IconButtonProps = Omit<React.ComponentPropsWithRef<"button">, "color"> &
  VariantProps<typeof iconButtonVariants> & {
    /** Required accessible name — the icon carries no text of its own. */
    "aria-label": string;
  };

/**
 * A native `<button>` holding a single centered icon (passed as `children`).
 * All keyboard, focus and `:disabled` behaviour comes free from the element.
 */
export function IconButton({
  children,
  className,
  material,
  size,
  type,
  variant,
  ...props
}: IconButtonProps) {
  return (
    // `props` is spread first so the required `aria-label` (and any other
    // caller attributes) are present, while the styling and controlled `type`
    // below win over anything conflicting.
    <button
      {...props}
      type={type ?? "button"}
      data-material={material ?? "clay"}
      className={cn(iconButtonVariants({ material, variant, size }), className)}
    >
      {children}
    </button>
  );
}

export { iconButtonVariants };
