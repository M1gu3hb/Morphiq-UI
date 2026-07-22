"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const WAVY_KEYFRAMES = `@keyframes mq-wavy-background{0%{translate:0 0}50%{translate:-8% 10px}100%{translate:-16% 0}}`;

function WavyKeyframes() {
  return (
    <style href="mq-wavy-background" precedence="medium">
      {WAVY_KEYFRAMES}
    </style>
  );
}

const wavyBackgroundVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#071827)] text-[color:var(--mq-fg,#f5f9ff)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        calm:
          "[--mq-wave-1:rgba(56,189,248,0.3)] [--mq-wave-2:rgba(45,212,191,0.25)] [--mq-wave-3:rgba(129,140,248,0.22)]",
        vivid:
          "[--mq-wave-1:rgba(34,211,238,0.48)] [--mq-wave-2:rgba(167,139,250,0.4)] [--mq-wave-3:rgba(244,114,182,0.34)]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-[20px]",
        md: "min-h-[280px] rounded-[24px] p-[28px]",
        lg: "min-h-[380px] rounded-[30px] p-[36px]",
      },
    },
    defaultVariants: { variant: "calm", size: "md" },
  },
);

type WavyBackgroundVariant = "calm" | "vivid";
type WavyBackgroundSize = "sm" | "md" | "lg";

export type WavyBackgroundProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof wavyBackgroundVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: WavyBackgroundVariant;
    size?: WavyBackgroundSize;
  };

const WAVE_PATHS = [
  "M-360 98 C-240 18 -120 178 0 98 S240 18 360 98 S600 178 720 98 S960 18 1080 98 S1320 178 1440 98",
  "M-360 166 C-240 86 -120 246 0 166 S240 86 360 166 S600 246 720 166 S960 86 1080 166 S1320 246 1440 166",
  "M-360 234 C-240 154 -120 314 0 234 S240 154 360 234 S600 314 720 234 S960 154 1080 234 S1320 314 1440 234",
] as const;

export function WavyBackground({
  children,
  className,
  material = "adaptive",
  size = "md",
  variant = "calm",
  ...props
}: WavyBackgroundProps) {
  return (
    <div
      {...props}
      className={cn(wavyBackgroundVariants({ size, variant }), className)}
      data-material={material}
    >
      <WavyKeyframes />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 size-full forced-colors:hidden"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 320"
      >
        {WAVE_PATHS.map((path, index) => (
          <path
            className="animate-[mq-wavy-background_15s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
            d={path}
            fill="none"
            key={path}
            opacity={1 - index * 0.16}
            stroke={`var(--mq-wave-${index + 1}, rgba(56,189,248,0.3))`}
            strokeWidth={index === 0 ? 74 : 58}
            style={{ animationDelay: `${-index * 3.5}s`, animationDuration: `${15 + index * 4}s` }}
          />
        ))}
      </svg>
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { wavyBackgroundVariants };
