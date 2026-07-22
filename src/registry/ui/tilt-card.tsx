"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Tilt 3D Card
 *
 * A semantic content surface that tilts toward the pointer in real 3D, with a
 * specular highlight that slides across the face. Four local custom properties
 * carry the state — two rotation angles and the pointer position — and the tilt
 * is a single inline `transform`, so it never fights Tailwind v4's standalone
 * `rotate`/`scale` properties. No animation library: the springy settle is a
 * transition on `transform`, and pure CSS drives everything.
 *
 * The tilt and the highlight are decoration. Content stays flat in reading
 * order, links and buttons inside stay clickable and keyboard-focusable, and
 * `prefers-reduced-motion` removes the tilt entirely — the card sits square.
 *
 * Local theming knobs:
 *
 *   --mq-body        surface colour
 *   --mq-lit         top gradient colour
 *   --mq-text        primary foreground
 *   --mq-muted       secondary foreground inherited by helper content
 *   --mq-brd         visible boundary
 *   --mq-edge        tactile side wall
 *   --mq-spec        specular highlight colour
 *   --mq-ring        focus ring
 *   --mq-rx / --mq-ry tilt angles, local to each instance
 *   --mq-x / --mq-y   pointer position, local to each instance
 */

const tiltCardVariants = cva(
  [
    "group relative isolate overflow-hidden border text-left",
    "text-[color:var(--mq-text,#33261e)]",
    "[background-color:var(--mq-body,#f6e7dd)]",
    "[background-image:linear-gradient(180deg,var(--mq-lit,#fff3ea),var(--mq-body,#f6e7dd))]",
    // The tilt IS the interaction, written as one inline `transform` so it owns
    // the whole property in a single declaration. A springy curve gives the
    // settle-back its overshoot. Only `transform` and the material's own depth
    // change, so the list names exactly those.
    "[transform:perspective(760px)_rotateX(var(--mq-rx,0deg))_rotateY(var(--mq-ry,0deg))]",
    "[transform-style:preserve-3d] will-change-transform",
    "transition-[transform,box-shadow] duration-[220ms] ease-[cubic-bezier(0.22,1.25,0.36,1)]",
    // Reduced motion sits the card square: the class overrides the inline
    // transform because both are classes and the media query wins.
    "motion-reduce:[transform:none] motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px]",
    "focus-within:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:bg-[Canvas]",
    "forced-colors:text-[CanvasText] forced-colors:shadow-none",
    "forced-colors:focus-visible:outline-[Highlight] forced-colors:focus-within:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#f6e7dd] [--mq-lit:#fff3ea] [--mq-text:#33261e] [--mq-muted:#6a5346]",
          "[--mq-brd:#9b6750] [--mq-edge:#d5b8a3] [--mq-spec:rgba(255,255,255,0.5)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#9b6750)]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.74),inset_0_-5px_8px_rgba(140,90,60,0.12),0_6px_0_var(--mq-edge,#d5b8a3),0_16px_28px_rgba(90,60,45,0.16)]",
          "hover:shadow-[inset_0_3px_4px_rgba(255,255,255,0.8),inset_0_-5px_8px_rgba(140,90,60,0.13),0_10px_0_var(--mq-edge,#d5b8a3),0_26px_44px_rgba(90,60,45,0.22)]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(255,255,255,0.78)] [--mq-lit:rgba(255,255,255,0.94)] [--mq-text:#1e1e1b] [--mq-muted:#36362f]",
          "[--mq-brd:rgba(23,24,23,0.62)] [--mq-edge:rgba(255,255,255,0.7)] [--mq-spec:rgba(255,255,255,0.55)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,rgba(23,24,23,0.62))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_var(--mq-edge,rgba(255,255,255,0.7)),0_16px_38px_rgba(24,20,40,0.2)]",
          "hover:shadow-[inset_0_1px_0_var(--mq-edge,rgba(255,255,255,0.7)),0_26px_54px_rgba(24,20,40,0.28)]",
        ].join(" "),
        skeuo: [
          "[--mq-body:#e6e3da] [--mq-lit:#f6f4ee] [--mq-text:#23231f] [--mq-muted:#4a4943]",
          "[--mq-brd:#77746d] [--mq-edge:#a8a49b] [--mq-spec:rgba(255,255,255,0.6)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#77746d)]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-3px_5px_rgba(0,0,0,0.14),0_5px_0_var(--mq-edge,#a8a49b),0_12px_20px_rgba(38,36,31,0.25)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.15),0_8px_0_var(--mq-edge,#a8a49b),0_20px_34px_rgba(38,36,31,0.32)]",
        ].join(" "),
        adaptive: [
          "[--mq-body:#ffffff] [--mq-lit:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
          "[--mq-brd:#76766f] [--mq-edge:transparent] [--mq-spec:rgba(255,255,255,0.45)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#76766f)]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.1),0_10px_24px_rgba(20,20,18,0.07)]",
          "hover:shadow-[0_3px_6px_rgba(20,20,18,0.14),0_20px_40px_rgba(20,20,18,0.12)]",
          "dark:[--mq-body:#232327] dark:[--mq-lit:#2d2d32] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
          "dark:[--mq-brd:#a9a8a2] dark:[--mq-spec:rgba(255,255,255,0.28)] dark:[--mq-ring:#f1efe9]",
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

/** The moving specular. `screen` lifts the surface where the light lands. */
const TILT_SPEC_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(200px circle at var(--mq-x, 50%) var(--mq-y, 50%), var(--mq-spec, rgba(255,255,255,0.5)), transparent 60%)",
  mixBlendMode: "screen",
};

const INITIAL_STATE = {
  "--mq-rx": "0deg",
  "--mq-ry": "0deg",
  "--mq-x": "50%",
  "--mq-y": "50%",
} as React.CSSProperties;

/** Peak tilt in degrees at the card's edges. Kept restrained on purpose. */
const MAX_TILT = 9;

type TiltCardMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type TiltCardVariant = "default";
type TiltCardSize = "sm" | "md" | "lg";

export type TiltCardProps = React.ComponentPropsWithRef<"article"> &
  Omit<VariantProps<typeof tiltCardVariants>, "material" | "variant" | "size"> & {
    material?: TiltCardMaterial;
    variant?: TiltCardVariant;
    size?: TiltCardSize;
  };

export function TiltCard({
  children,
  className,
  material = "clay",
  onPointerLeave,
  onPointerMove,
  size = "md",
  style,
  variant = "default",
  ...props
}: TiltCardProps) {
  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    const target = event.currentTarget.style;
    // Top of the card tilts back, the near side tilts toward the pointer.
    target.setProperty("--mq-rx", `${((0.5 - py) * (MAX_TILT * 2)).toFixed(2)}deg`);
    target.setProperty("--mq-ry", `${((px - 0.5) * (MAX_TILT * 2)).toFixed(2)}deg`);
    target.setProperty("--mq-x", `${(px * 100).toFixed(2)}%`);
    target.setProperty("--mq-y", `${(py * 100).toFixed(2)}%`);
    onPointerMove?.(event);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLElement>) {
    const target = event.currentTarget.style;
    target.setProperty("--mq-rx", "0deg");
    target.setProperty("--mq-ry", "0deg");
    target.setProperty("--mq-x", "50%");
    target.setProperty("--mq-y", "50%");
    onPointerLeave?.(event);
  }

  return (
    <article
      {...props}
      className={cn(tiltCardVariants({ material, size, variant }), className)}
      data-material={material}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{ ...INITIAL_STATE, ...style }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-0",
          "transition-opacity duration-200 ease-out",
          "group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-within:opacity-100",
          "motion-reduce:!opacity-0 motion-reduce:transition-none",
          "forced-colors:hidden",
        )}
        style={TILT_SPEC_STYLE}
      />
      <div className="relative z-[2] flex size-full flex-col gap-[10px]">{children}</div>
    </article>
  );
}

export { tiltCardVariants };
