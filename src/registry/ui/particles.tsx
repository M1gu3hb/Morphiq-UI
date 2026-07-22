"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const PARTICLE_KEYFRAMES = `@keyframes mq-particles{0%{translate:0 12px;opacity:0}18%{opacity:.7}78%{opacity:.46}100%{translate:var(--mq-dx,12px) var(--mq-dy,-42px);opacity:0}}`;

function ParticleKeyframes() {
  return (
    <style href="mq-particles" precedence="medium">
      {PARTICLE_KEYFRAMES}
    </style>
  );
}

const particlesVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#0b1120)] text-[color:var(--mq-fg,#f8fafc)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        soft: "[--mq-particle:#93c5fd] [--mq-particle-glow:rgba(147,197,253,0.42)]",
        bright: "[--mq-particle:#f0abfc] [--mq-particle-glow:rgba(240,171,252,0.58)]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-[20px]",
        md: "min-h-[280px] rounded-[24px] p-[28px]",
        lg: "min-h-[380px] rounded-[30px] p-[36px]",
      },
    },
    defaultVariants: { variant: "soft", size: "md" },
  },
);

type ParticlesVariant = "soft" | "bright";
type ParticlesSize = "sm" | "md" | "lg";
type ParticleStyle = React.CSSProperties & Record<"--mq-dx" | "--mq-dy", string>;

export type ParticlesProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof particlesVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: ParticlesVariant;
    size?: ParticlesSize;
    /** Number of dots. Clamped to 4–40 to keep paint and DOM cost bounded. */
    count?: number;
    /** Relative drift speed. Values below .4 are clamped. */
    speed?: number;
  };

export function Particles({
  children,
  className,
  count = 22,
  material = "adaptive",
  size = "md",
  speed = 1,
  variant = "soft",
  ...props
}: ParticlesProps) {
  const safeCount = Math.min(40, Math.max(4, Math.round(count)));
  const safeSpeed = Math.max(0.4, speed);

  return (
    <div
      {...props}
      className={cn(particlesVariants({ size, variant }), className)}
      data-material={material}
    >
      <ParticleKeyframes />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 forced-colors:hidden">
        {Array.from({ length: safeCount }, (_unused, index) => {
          const diameter = 2 + (index % 4);
          const style: ParticleStyle = {
            "--mq-dx": `${((index * 17) % 37) - 18}px`,
            "--mq-dy": `${-34 - (index % 6) * 9}px`,
            animationDelay: `${-((index * 0.67) % 7)}s`,
            animationDuration: `${(6.5 + (index % 6) * 0.8) / safeSpeed}s`,
            height: `${diameter}px`,
            left: `${(index * 47) % 97}%`,
            top: `${8 + ((index * 31) % 84)}%`,
            width: `${diameter}px`,
          };

          return (
            <span
              className={cn(
                "absolute rounded-full bg-[color:var(--mq-particle,#93c5fd)]",
                "shadow-[0_0_9px_2px_var(--mq-particle-glow,rgba(147,197,253,0.42))]",
                "animate-[mq-particles_8s_ease-in-out_infinite]",
                "motion-reduce:animate-none motion-reduce:opacity-45",
              )}
              key={index}
              style={style}
            />
          );
        })}
      </span>
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { particlesVariants };
