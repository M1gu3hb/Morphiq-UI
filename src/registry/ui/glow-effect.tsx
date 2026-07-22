"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const GLOW_KEYFRAMES = `@keyframes mq-glow-pulse{0%,100%{opacity:.42;transform:scale(.94)}50%{opacity:.82;transform:scale(1.05)}}`;

function GlowKeyframes() {
  return (
    <style href="mq-glow-pulse" precedence="medium">
      {GLOW_KEYFRAMES}
    </style>
  );
}

const glowEffectVariants = cva(
  [
    "group relative isolate",
    "motion-reduce:![--mq-x:50%] motion-reduce:![--mq-y:50%]",
    "forced-colors:[--mq-x:50%] forced-colors:[--mq-y:50%]",
  ].join(" "),
  {
    variants: {
      variant: {
        follow: "",
        pulse: "",
      },
      size: {
        sm: "min-h-[128px] rounded-[18px]",
        md: "min-h-[164px] rounded-[24px]",
        lg: "min-h-[204px] rounded-[30px]",
      },
    },
    defaultVariants: { variant: "follow", size: "md" },
  },
);

const SURFACE_SIZE = {
  sm: "rounded-[18px] p-[18px]",
  md: "rounded-[24px] p-[24px]",
  lg: "rounded-[30px] p-[30px]",
} as const;

type GlowEffectVariant = "follow" | "pulse";
type GlowEffectSize = "sm" | "md" | "lg";

export type GlowEffectProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof glowEffectVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: GlowEffectVariant;
    size?: GlowEffectSize;
    glowColor?: string;
    radius?: number;
    intensity?: number;
  };

export function GlowEffect({
  children,
  className,
  glowColor = "rgba(120,255,176,0.86)",
  intensity = 0.78,
  material = "adaptive",
  onPointerLeave,
  onPointerMove,
  radius = 170,
  size = "md",
  style,
  variant = "follow",
  ...props
}: GlowEffectProps) {
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (
      variant === "follow" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      event.currentTarget.style.setProperty("--mq-x", `${x.toFixed(2)}%`);
      event.currentTarget.style.setProperty("--mq-y", `${y.toFixed(2)}%`);
    }
    onPointerMove?.(event);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--mq-x", "50%");
    event.currentTarget.style.setProperty("--mq-y", "50%");
    onPointerLeave?.(event);
  }

  return (
    <div
      {...props}
      className={cn(glowEffectVariants({ size, variant }), className)}
      data-material={material}
      data-variant={variant}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{ "--mq-x": "50%", "--mq-y": "50%", ...style } as React.CSSProperties}
    >
      <GlowKeyframes />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-[22px] z-0 rounded-[inherit] blur-[24px]",
          variant === "pulse" && "animate-[mq-glow-pulse_4.6s_ease-in-out_infinite]",
          "motion-reduce:animate-none motion-reduce:![transform:none]",
          "forced-colors:hidden",
        )}
        style={{
          backgroundImage: `radial-gradient(circle ${Math.max(70, radius)}px at var(--mq-x, 50%) var(--mq-y, 50%), ${glowColor}, transparent 72%)`,
          opacity: Math.min(1, Math.max(0.15, intensity)),
        }}
      />
      <div
        className={cn(
          "relative z-10 flex size-full flex-col border border-white/20 bg-[#11131a] text-[#f5f7ff]",
          "shadow-[0_18px_48px_rgba(7,9,16,0.34)]",
          "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#a8ff78]",
          "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
          "forced-colors:focus-within:outline-[Highlight]",
          SURFACE_SIZE[size],
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { glowEffectVariants };
