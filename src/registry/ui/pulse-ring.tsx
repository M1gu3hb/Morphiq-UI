import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const PULSE_RING_KEYFRAMES = `@keyframes mq-pulse-ring{0%{scale:.72;opacity:.7}80%,100%{scale:1.45;opacity:0}}`;

function PulseRingKeyframes() {
  return <style href="mq-pulse-ring" precedence="medium">{PULSE_RING_KEYFRAMES}</style>;
}

const pulseRingVariants = cva(
  "relative inline-flex flex-col items-center justify-center gap-[10px] text-[#f5f7ff] forced-colors:text-[CanvasText]",
  {
    variants: {
      variant: {
        live: "[--mq-ring:#86efac] [--mq-ring-bg:#14532d]",
        recording: "[--mq-ring:#fda4af] [--mq-ring-bg:#881337]",
      },
      size: {
        sm: "[--mq-target:54px] text-[11px]",
        md: "[--mq-target:70px] text-[12px]",
        lg: "[--mq-target:88px] text-[13px]",
      },
    },
    defaultVariants: { variant: "live", size: "md" },
  },
);

type PulseRingVariant = "live" | "recording";
type PulseRingSize = "sm" | "md" | "lg";

export type PulseRingProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof pulseRingVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: PulseRingVariant;
    size?: PulseRingSize;
    statusLabel?: string;
  };

export function PulseRing({
  children,
  className,
  material = "adaptive",
  size = "md",
  statusLabel = "Live",
  variant = "live",
  ...props
}: PulseRingProps) {
  return (
    <div
      {...props}
      className={cn(pulseRingVariants({ size, variant }), className)}
      data-material={material}
      role="status"
    >
      <PulseRingKeyframes />
      <span className="relative grid size-[var(--mq-target,70px)] place-items-center">
        {[0, 1, 2].map((index) => (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full border-2 border-[color:var(--mq-ring,#86efac)] opacity-0",
              "animate-[mq-pulse-ring_2.6s_ease-out_infinite]",
              "motion-reduce:animate-none motion-reduce:scale-100 motion-reduce:opacity-35",
              "forced-colors:animate-none forced-colors:border-[CanvasText] forced-colors:opacity-35",
            )}
            key={index}
            style={{ animationDelay: `${index * 0.78}s` }}
          />
        ))}
        <span className="relative z-10 grid size-[70%] place-items-center rounded-full border border-white/20 bg-[color:var(--mq-ring-bg,#14532d)] shadow-[0_10px_28px_rgba(0,0,0,0.3)] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none">
          {children}
        </span>
      </span>
      <span className="rounded-full border border-white/15 bg-[#11131a] px-[10px] py-[5px] font-extrabold tracking-[0.12em] uppercase forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]">
        {statusLabel}
      </span>
    </div>
  );
}

export { pulseRingVariants };
