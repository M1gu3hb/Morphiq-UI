"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const spotlightVariants = cva(
  [
    "relative isolate overflow-hidden border border-[rgba(244,246,255,0.18)]",
    "bg-[#0d1018] text-[#f5f7ff] shadow-[0_18px_48px_rgba(7,9,16,0.3)]",
    "motion-reduce:![--mq-x:50%] motion-reduce:![--mq-y:50%]",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#a8ff78]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        cool: "[--mq-spot:rgba(125,211,252,0.42)]",
        warm: "[--mq-spot:rgba(253,186,116,0.42)]",
      },
      size: {
        sm: "min-h-[128px] rounded-[18px] p-[18px]",
        md: "min-h-[164px] rounded-[24px] p-[24px]",
        lg: "min-h-[204px] rounded-[30px] p-[30px]",
      },
    },
    defaultVariants: { variant: "cool", size: "md" },
  },
);

type SpotlightVariant = "cool" | "warm";
type SpotlightSize = "sm" | "md" | "lg";

export type SpotlightProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof spotlightVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: SpotlightVariant;
    size?: SpotlightSize;
    radius?: number;
    intensity?: number;
  };

export function Spotlight({
  children,
  className,
  intensity = 0.9,
  material = "adaptive",
  onPointerLeave,
  onPointerMove,
  radius = 150,
  size = "md",
  style,
  variant = "cool",
  ...props
}: SpotlightProps) {
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const bounds = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--mq-x", `${(((event.clientX - bounds.left) / bounds.width) * 100).toFixed(2)}%`);
      event.currentTarget.style.setProperty("--mq-y", `${(((event.clientY - bounds.top) / bounds.height) * 100).toFixed(2)}%`);
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
      className={cn(spotlightVariants({ size, variant }), className)}
      data-material={material}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{ "--mq-x": "50%", "--mq-y": "50%", ...style } as React.CSSProperties}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 forced-colors:hidden"
        style={{
          backgroundImage: `radial-gradient(circle ${Math.max(72, radius)}px at var(--mq-x, 50%) var(--mq-y, 50%), var(--mq-spot, rgba(125,211,252,0.42)), transparent 72%)`,
          opacity: Math.min(1, Math.max(0.2, intensity)),
        }}
      />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { spotlightVariants };
