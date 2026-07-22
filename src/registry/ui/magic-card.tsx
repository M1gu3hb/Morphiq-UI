"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Magic Card
 *
 * A semantic content surface whose border lights up under the pointer. Two local
 * custom properties carry the cursor position; a gradient ring, clipped to the
 * border with a mask, brightens wherever the pointer is. No animation library,
 * no global stylesheet, no shared motion state — the whole effect is CSS driven
 * by `--mq-x` / `--mq-y` written on the element itself.
 *
 * The lit border is decoration on an `aria-hidden` layer: content, reading order
 * and contrast never depend on it, and with no pointer (or reduced motion) the
 * ring settles to an even static gradient.
 *
 * Local theming knobs:
 *
 *   --mq-body       surface colour
 *   --mq-lit        top gradient colour
 *   --mq-text       primary foreground
 *   --mq-muted      secondary foreground inherited by helper content
 *   --mq-brd        visible boundary
 *   --mq-edge       tactile side wall
 *   --mq-magic      the border light's colour
 *   --mq-ring       focus ring
 *   --mq-x / --mq-y pointer position, local to each instance
 */

const magicCardVariants = cva(
  [
    "group relative isolate overflow-hidden border text-left",
    "text-[color:var(--mq-text,#33261e)]",
    "[background-color:var(--mq-body,#f6e7dd)]",
    "[background-image:linear-gradient(180deg,var(--mq-lit,#fff3ea),var(--mq-body,#f6e7dd))]",
    // Only the lift and the depth move on interaction — the border light is a
    // paint-driven radial fed by `--mq-x/--mq-y`, never a transition, so it is
    // deliberately absent here.
    "transition-[translate,box-shadow,backdrop-filter] duration-200 ease-out",
    "hover:-translate-y-[1px]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px]",
    "focus-within:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:bg-[Canvas]",
    "forced-colors:text-[CanvasText] forced-colors:shadow-none",
    "forced-colors:focus-visible:outline-[Highlight] forced-colors:focus-within:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#f6e7dd] [--mq-lit:#fff3ea] [--mq-text:#33261e] [--mq-muted:#6a5346]",
          "[--mq-brd:#9b6750] [--mq-edge:#d5b8a3] [--mq-magic:rgba(255,138,110,0.95)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#9b6750)]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.74),inset_0_-5px_8px_rgba(140,90,60,0.12),0_6px_0_var(--mq-edge,#d5b8a3),0_16px_28px_rgba(90,60,45,0.16)]",
          "hover:shadow-[inset_0_3px_4px_rgba(255,255,255,0.8),inset_0_-5px_8px_rgba(140,90,60,0.13),0_8px_0_var(--mq-edge,#d5b8a3),0_22px_36px_rgba(90,60,45,0.2)]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(255,255,255,0.78)] [--mq-lit:rgba(255,255,255,0.94)] [--mq-text:#1e1e1b] [--mq-muted:#36362f]",
          "[--mq-brd:rgba(23,24,23,0.62)] [--mq-edge:rgba(255,255,255,0.7)] [--mq-magic:rgba(120,214,255,0.95)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,rgba(23,24,23,0.62))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_var(--mq-edge,rgba(255,255,255,0.7)),0_16px_38px_rgba(24,20,40,0.2)]",
          "hover:backdrop-blur-[22px] hover:shadow-[inset_0_1px_0_var(--mq-edge,rgba(255,255,255,0.7)),0_22px_48px_rgba(24,20,40,0.26)]",
        ].join(" "),
        skeuo: [
          "[--mq-body:#e6e3da] [--mq-lit:#f6f4ee] [--mq-text:#23231f] [--mq-muted:#4a4943]",
          "[--mq-brd:#77746d] [--mq-edge:#a8a49b] [--mq-magic:rgba(255,255,255,0.95)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#77746d)]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-3px_5px_rgba(0,0,0,0.14),0_5px_0_var(--mq-edge,#a8a49b),0_12px_20px_rgba(38,36,31,0.25)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.15),0_7px_0_var(--mq-edge,#a8a49b),0_17px_28px_rgba(38,36,31,0.3)]",
        ].join(" "),
        adaptive: [
          "[--mq-body:#ffffff] [--mq-lit:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
          "[--mq-brd:#76766f] [--mq-edge:transparent] [--mq-magic:rgba(120,190,120,0.9)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#76766f)]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.1),0_10px_24px_rgba(20,20,18,0.07)]",
          "hover:shadow-[0_2px_4px_rgba(20,20,18,0.12),0_16px_34px_rgba(20,20,18,0.1)]",
          "dark:[--mq-body:#232327] dark:[--mq-lit:#2d2d32] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
          "dark:[--mq-brd:#a9a8a2] dark:[--mq-magic:rgba(140,255,170,0.85)] dark:[--mq-ring:#f1efe9]",
          "pointer-coarse:min-h-[148px]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "min-h-[128px] rounded-[18px] p-[16px]",
        md: "min-h-[160px] rounded-[24px] p-[22px]",
        lg: "min-h-[196px] rounded-[30px] p-[28px]",
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

/**
 * The lit ring.
 *
 * A radial highlight tracks the pointer through `--mq-x/--mq-y`; a dim base
 * layer keeps the border a visible gradient even before the first move, which
 * is also the static fallback. `mask-composite: exclude` punches out the inner
 * content box, so only the border-thick ring paints — and it follows
 * `border-radius: inherit` exactly, which `border-image` cannot.
 */
const MAGIC_RING_STYLE: React.CSSProperties = {
  padding: "1.5px",
  background:
    "radial-gradient(220px circle at var(--mq-x, 50%) var(--mq-y, 50%), var(--mq-magic, rgba(255,138,110,0.95)), transparent 68%), linear-gradient(var(--mq-brd, #9b6750) 0 0)",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
};

const INITIAL_POSITION = {
  "--mq-x": "50%",
  "--mq-y": "50%",
} as React.CSSProperties;

type MagicCardMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type MagicCardVariant = "default";
type MagicCardSize = "sm" | "md" | "lg";

export type MagicCardProps = React.ComponentPropsWithRef<"article"> &
  Omit<VariantProps<typeof magicCardVariants>, "material" | "variant" | "size"> & {
    material?: MagicCardMaterial;
    variant?: MagicCardVariant;
    size?: MagicCardSize;
  };

export function MagicCard({
  children,
  className,
  material = "clay",
  onPointerLeave,
  onPointerMove,
  size = "md",
  style,
  variant = "default",
  ...props
}: MagicCardProps) {
  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty("--mq-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--mq-y", `${y.toFixed(2)}%`);
    onPointerMove?.(event);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--mq-x", "50%");
    event.currentTarget.style.setProperty("--mq-y", "50%");
    onPointerLeave?.(event);
  }

  return (
    <article
      {...props}
      className={cn(magicCardVariants({ material, size, variant }), className)}
      data-material={material}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{ ...INITIAL_POSITION, ...style }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] rounded-[inherit]",
          // The base border stays visible; a hover just lifts the whole ring's
          // intensity. Reduced motion pins it to the base — the static even ring.
          "opacity-70 transition-opacity duration-200 ease-out",
          "group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-within:opacity-100",
          "motion-reduce:!opacity-70 motion-reduce:transition-none",
          // A gradient is a background image, which forced colours preserve, so
          // it has to be cleared by hand or it would paint over the system border.
          "forced-colors:hidden",
        )}
        style={MAGIC_RING_STYLE}
      />
      <div className="relative z-[2] flex size-full flex-col gap-[10px]">{children}</div>
    </article>
  );
}

export { magicCardVariants };
