"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Tooltip
 *
 * Behaviour belongs entirely to Radix: hover and keyboard-focus opening,
 * Escape dismissal, aria-describedby wiring, collision handling and placement.
 * These wrappers map onto Provider, Root, Trigger and Content and only add the
 * four Morphiq material recipes plus two presentation axes.
 *
 * Local theming knobs:
 *
 *   --mq-body     bubble and arrow surface
 *   --mq-lit      skeuo gradient highlight
 *   --mq-text     tooltip foreground
 *   --mq-brd      bubble and arrow border
 *   --mq-shadow   material shadow
 *   --mq-enter-x  inline entry offset selected by Radix data-side
 *   --mq-enter-y  block entry offset selected by Radix data-side
 */

type TooltipMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type TooltipVariant = "default" | "inverted";
type TooltipSize = "sm" | "md" | "lg";

/**
 * Motion travels with the component just like its material recipes.
 *
 * CSS animations, rather than a transition on a node Radix is about to
 * unmount, let Radix Presence observe the closing animation and keep Content
 * mounted until it finishes. The individual `scale` and `translate`
 * properties compose without taking over a consumer's `transform`.
 */
const TOOLTIP_KEYFRAMES =
  "@keyframes mq-tooltip-enter{from{opacity:0;scale:.94;translate:var(--mq-enter-x,0px) var(--mq-enter-y,0px)}to{opacity:1;scale:1;translate:0 0}}" +
  "@keyframes mq-tooltip-exit{from{opacity:1;scale:1;translate:0 0}to{opacity:0;scale:.97;translate:var(--mq-enter-x,0px) var(--mq-enter-y,0px)}}";

function TooltipKeyframes() {
  return (
    <style href="mq-tooltip-motion" precedence="medium">
      {TOOLTIP_KEYFRAMES}
    </style>
  );
}

const tooltipContentVariants = cva(
  [
    "z-50 max-w-[min(280px,calc(100vw-24px))] select-none border",
    "rounded-[var(--mq-radius,12px)] bg-[var(--mq-body,#f1e3d4)]",
    "px-[var(--mq-pad-x,11px)] py-[var(--mq-pad-y,7px)]",
    "text-[length:var(--mq-font-size,12px)] leading-[1.45] font-bold",
    "text-[color:var(--mq-text,#3a2b22)] border-[var(--mq-brd,rgba(58,43,34,0.24))]",
    "shadow-[var(--mq-shadow,0_8px_20px_rgba(55,38,27,0.18))]",
    // Radix owns state and side. Delayed and instant opening share the same
    // physical move, while instant-open is shorter so moving between adjacent
    // triggers does not feel sticky. Closing returns toward the trigger.
    "opacity-100 scale-100 translate-x-0 translate-y-0",
    "data-[side=top]:[--mq-enter-y:4px] data-[side=bottom]:[--mq-enter-y:-4px]",
    "data-[side=left]:[--mq-enter-x:4px] data-[side=right]:[--mq-enter-x:-4px]",
    "data-[state=delayed-open]:animate-[mq-tooltip-enter_180ms_cubic-bezier(0.16,1,0.3,1)_both]",
    "data-[state=instant-open]:animate-[mq-tooltip-enter_140ms_cubic-bezier(0.16,1,0.3,1)_both]",
    "data-[state=closed]:animate-[mq-tooltip-exit_120ms_cubic-bezier(0.4,0,1,1)_both]",
    // Motion is ornamental; removing the animation leaves the fully open
    // values above in place and Radix still provides the state change.
    // Important beats the data-state selector's extra attribute specificity.
    // Without it the media query was present but the Radix state animation won.
    "motion-reduce:!animate-none",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
    "forced-colors:[background-image:none] forced-colors:shadow-none forced-colors:backdrop-filter-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-shadow:inset_0_2px_2px_rgba(255,255,255,0.70),inset_0_-2px_3px_rgba(78,50,34,0.12),0_3px_0_#c4aa91,0_10px_22px_rgba(55,38,27,0.18)]",
        ].join(" "),
        glass: [
          "backdrop-blur-[16px] backdrop-saturate-[150%]",
          "[--mq-shadow:inset_0_1px_0_rgba(255,255,255,0.42),0_12px_28px_rgba(22,22,36,0.24)]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f3f0e8),var(--mq-body,#d2cdc2))]",
          "[--mq-shadow:inset_0_1px_0_rgba(255,255,255,0.90),inset_0_-3px_4px_rgba(0,0,0,0.16),0_4px_0_#aaa398,0_11px_22px_rgba(35,33,29,0.24)]",
        ].join(" "),
        adaptive:
          "[--mq-shadow:0_1px_2px_rgba(20,20,18,0.18),0_10px_24px_rgba(20,20,18,0.12)]",
      },
      variant: {
        default: "",
        inverted: "",
      },
      size: {
        sm: "[--mq-radius:9px] [--mq-pad-x:9px] [--mq-pad-y:5px] [--mq-font-size:11px] [--mq-arrow-w:9px] [--mq-arrow-h:4px]",
        md: "[--mq-radius:12px] [--mq-pad-x:11px] [--mq-pad-y:7px] [--mq-font-size:12px] [--mq-arrow-w:11px] [--mq-arrow-h:5px]",
        lg: "[--mq-radius:15px] [--mq-pad-x:14px] [--mq-pad-y:9px] [--mq-font-size:13px] [--mq-arrow-w:13px] [--mq-arrow-h:6px]",
      },
    },
    compoundVariants: [
      {
        material: "clay",
        variant: "default",
        class:
          "[--mq-body:#f1e3d4] [--mq-text:#3a2b22] [--mq-brd:rgba(58,43,34,0.24)]",
      },
      {
        material: "clay",
        variant: "inverted",
        class:
          "[--mq-body:#4a3026] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.26)]",
      },
      {
        material: "glass",
        variant: "default",
        class:
          "[--mq-body:rgba(34,38,48,0.96)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.38)]",
      },
      {
        material: "glass",
        variant: "inverted",
        class:
          "[--mq-body:rgba(248,247,243,0.96)] [--mq-text:#252620] [--mq-brd:rgba(37,38,32,0.24)]",
      },
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f3f0e8] [--mq-body:#d2cdc2] [--mq-text:#29261f] [--mq-brd:rgba(41,38,31,0.28)]",
      },
      {
        material: "skeuo",
        variant: "inverted",
        class:
          "[--mq-lit:#46443e] [--mq-body:#302f2b] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.26)]",
      },
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#171817] [--mq-text:#f7f6f2] [--mq-brd:rgba(0,0,0,0.48)] " +
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(23,24,23,0.34)]",
      },
      {
        material: "adaptive",
        variant: "inverted",
        class:
          "[--mq-body:#f1efe9] [--mq-text:#171817] [--mq-brd:rgba(23,24,23,0.34)] " +
          "dark:[--mq-body:#171817] dark:[--mq-text:#f7f6f2] dark:[--mq-brd:rgba(0,0,0,0.48)]",
      },
    ],
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

export function TooltipProvider(
  props: React.ComponentProps<typeof TooltipPrimitive.Provider>,
) {
  return <TooltipPrimitive.Provider {...props} />;
}

export function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />;
}

export function TooltipTrigger(
  props: React.ComponentPropsWithRef<typeof TooltipPrimitive.Trigger>,
) {
  return <TooltipPrimitive.Trigger {...props} />;
}

export type TooltipContentProps = React.ComponentPropsWithRef<
  typeof TooltipPrimitive.Content
> & {
  material?: TooltipMaterial;
  variant?: TooltipVariant;
  size?: TooltipSize;
  /** Keep the production default portal, or render inline for bounded previews. */
  portalled?: boolean;
  /** Optional target for the Radix Portal when `portalled` is true. */
  portalContainer?: React.ComponentProps<typeof TooltipPrimitive.Portal>["container"];
  /** Style hook for the material arrow. */
  arrowClassName?: string;
};

export function TooltipContent({
  align = "center",
  arrowClassName,
  children,
  className,
  material = "clay",
  portalContainer,
  portalled = true,
  side = "top",
  sideOffset = 8,
  size = "md",
  variant = "default",
  ...props
}: TooltipContentProps) {
  const content = (
    <TooltipPrimitive.Content
      {...props}
      align={align}
      className={cn(tooltipContentVariants({ material, variant, size }), className)}
      data-material={material}
      data-variant={variant}
      side={side}
      sideOffset={sideOffset}
    >
      {children}
      <TooltipPrimitive.Arrow
        className={cn(
          "h-[var(--mq-arrow-h,5px)] w-[var(--mq-arrow-w,11px)]",
          "fill-[var(--mq-body,#f1e3d4)] stroke-[var(--mq-brd,rgba(58,43,34,0.24))] [stroke-width:1px]",
          "forced-colors:fill-[Canvas] forced-colors:stroke-[CanvasText]",
          arrowClassName,
        )}
        data-tooltip-arrow=""
      />
    </TooltipPrimitive.Content>
  );

  return (
    <>
      <TooltipKeyframes />
      {portalled ? (
        <TooltipPrimitive.Portal container={portalContainer}>{content}</TooltipPrimitive.Portal>
      ) : (
        content
      )}
    </>
  );
}

export type TooltipVariantProps = VariantProps<typeof tooltipContentVariants>;

export { tooltipContentVariants };
