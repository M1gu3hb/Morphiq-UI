"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Spotlight Card
 *
 * A semantic content surface with a cursor-following radial light. Pointer
 * coordinates are written to two local custom properties on the card itself;
 * there is no animation library, global stylesheet or shared motion state.
 * Keyboard focus reveals the same light at its safe centred fallback.
 *
 * Local theming knobs:
 *
 *   --mq-body       surface colour
 *   --mq-lit        optional top gradient colour
 *   --mq-text       primary foreground
 *   --mq-muted      secondary foreground inherited by helper content
 *   --mq-brd        visible boundary
 *   --mq-edge       tactile side wall
 *   --mq-spotlight  radial light colour
 *   --mq-ring       focus ring
 *   --mq-x / --mq-y pointer position, local to each instance
 */

const spotlightCardVariants = cva(
  [
    "group relative isolate overflow-hidden border text-left",
    "text-[color:var(--mq-text,#33261e)]",
    "[background-color:var(--mq-body,#f6e7dd)]",
    "[background-image:linear-gradient(180deg,var(--mq-lit,#fff3ea),var(--mq-body,#f6e7dd))]",
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
          "[--mq-brd:#9b6750] [--mq-edge:#d5b8a3] [--mq-spotlight:rgba(255,144,119,0.48)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#9b6750)]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.74),inset_0_-5px_8px_rgba(140,90,60,0.12),0_6px_0_var(--mq-edge,#d5b8a3),0_16px_28px_rgba(90,60,45,0.16)]",
          "hover:shadow-[inset_0_3px_4px_rgba(255,255,255,0.8),inset_0_-5px_8px_rgba(140,90,60,0.13),0_8px_0_var(--mq-edge,#d5b8a3),0_22px_36px_rgba(90,60,45,0.2)]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(255,255,255,0.78)] [--mq-lit:rgba(255,255,255,0.94)] [--mq-text:#1e1e1b] [--mq-muted:#36362f]",
          "[--mq-brd:rgba(23,24,23,0.62)] [--mq-edge:rgba(255,255,255,0.7)] [--mq-spotlight:rgba(158,233,255,0.42)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,rgba(23,24,23,0.62))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_var(--mq-edge,rgba(255,255,255,0.7)),0_16px_38px_rgba(24,20,40,0.2)]",
          "hover:backdrop-blur-[22px] hover:shadow-[inset_0_1px_0_var(--mq-edge,rgba(255,255,255,0.7)),0_22px_48px_rgba(24,20,40,0.26)]",
        ].join(" "),
        skeuo: [
          "[--mq-body:#e6e3da] [--mq-lit:#f6f4ee] [--mq-text:#23231f] [--mq-muted:#4a4943]",
          "[--mq-brd:#77746d] [--mq-edge:#a8a49b] [--mq-spotlight:rgba(255,255,255,0.78)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#77746d)]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-3px_5px_rgba(0,0,0,0.14),0_5px_0_var(--mq-edge,#a8a49b),0_12px_20px_rgba(38,36,31,0.25)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.15),0_7px_0_var(--mq-edge,#a8a49b),0_17px_28px_rgba(38,36,31,0.3)]",
        ].join(" "),
        adaptive: [
          "[--mq-body:#ffffff] [--mq-lit:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
          "[--mq-brd:#76766f] [--mq-edge:transparent] [--mq-spotlight:rgba(74,222,128,0.24)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#76766f)]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.1),0_10px_24px_rgba(20,20,18,0.07)]",
          "hover:shadow-[0_2px_4px_rgba(20,20,18,0.12),0_16px_34px_rgba(20,20,18,0.1)]",
          "dark:[--mq-body:#232327] dark:[--mq-lit:#2d2d32] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
          "dark:[--mq-brd:#a9a8a2] dark:[--mq-spotlight:rgba(111,255,154,0.18)] dark:[--mq-ring:#f1efe9]",
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

const SPOTLIGHT_STYLE = {
  backgroundImage:
    "radial-gradient(circle 190px at var(--mq-x, 50%) var(--mq-y, 50%), var(--mq-spotlight, rgba(255,144,119,0.48)), transparent 72%)",
} as const;

const INITIAL_POSITION = {
  "--mq-x": "50%",
  "--mq-y": "50%",
} as React.CSSProperties;

type SpotlightCardMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type SpotlightCardVariant = "default";
type SpotlightCardSize = "sm" | "md" | "lg";

export type SpotlightCardProps = React.ComponentPropsWithRef<"article"> &
  Omit<VariantProps<typeof spotlightCardVariants>, "material" | "variant" | "size"> & {
    material?: SpotlightCardMaterial;
    variant?: SpotlightCardVariant;
    size?: SpotlightCardSize;
  };

export function SpotlightCard({
  children,
  className,
  material = "clay",
  onMouseLeave,
  onMouseMove,
  size = "md",
  style,
  variant = "default",
  ...props
}: SpotlightCardProps) {
  function updateSpotlight(event: React.MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    event.currentTarget.style.setProperty("--mq-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--mq-y", `${y.toFixed(2)}%`);
  }

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    updateSpotlight(event);
    onMouseMove?.(event);
  }

  function handleMouseLeave(event: React.MouseEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--mq-x", "50%");
    event.currentTarget.style.setProperty("--mq-y", "50%");
    onMouseLeave?.(event);
  }

  return (
    <article
      {...props}
      className={cn(spotlightCardVariants({ material, size, variant }), className)}
      data-material={material}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ ...INITIAL_POSITION, ...style }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0",
          "transition-opacity duration-200 ease-out",
          "group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-within:opacity-100",
          "motion-reduce:!opacity-0 motion-reduce:transition-none",
          "forced-colors:hidden",
        )}
        style={SPOTLIGHT_STYLE}
      />
      <div className="relative z-[1] flex size-full flex-col gap-[10px]">{children}</div>
    </article>
  );
}

export { spotlightCardVariants };
