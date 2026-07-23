"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type ConfettiStyle = React.CSSProperties & Record<"--mq-x" | "--mq-y" | "--mq-rotate", string>;

const CONFETTI_KEYFRAMES = `@keyframes mq-confetti{0%{translate:0 0;rotate:0deg;opacity:0}10%{opacity:1}100%{translate:var(--mq-x,20px) var(--mq-y,-90px);rotate:var(--mq-rotate,180deg);opacity:0}}`;

function ConfettiKeyframes() {
  return <style href="mq-confetti" precedence="medium">{CONFETTI_KEYFRAMES}</style>;
}

const confettiVariants = cva(
  [
    "relative isolate overflow-hidden border border-[rgba(244,246,255,0.18)]",
    "bg-[#11131a] text-[#f5f7ff] shadow-[0_18px_48px_rgba(7,9,16,0.28)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        celebration: "[--mq-c1:#a8ff78] [--mq-c2:#7ddcff] [--mq-c3:#c4b5fd]",
        warm: "[--mq-c1:#fdba74] [--mq-c2:#fda4af] [--mq-c3:#fde68a]",
      },
      size: {
        sm: "min-h-[128px] rounded-[18px] p-[18px]",
        md: "min-h-[164px] rounded-[24px] p-[24px]",
        lg: "min-h-[204px] rounded-[30px] p-[30px]",
      },
    },
    defaultVariants: { variant: "celebration", size: "md" },
  },
);

type ConfettiVariant = "celebration" | "warm";
type ConfettiSize = "sm" | "md" | "lg";

export type ConfettiProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof confettiVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: ConfettiVariant;
    size?: ConfettiSize;
    /** Change this value to fire a new burst. Undefined keeps the effect idle. */
    trigger?: string | number;
    /** Number of pieces, clamped to 8–36. */
    count?: number;
  };

export function Confetti({
  children,
  className,
  count = 24,
  material = "adaptive",
  size = "md",
  trigger,
  variant = "celebration",
  ...props
}: ConfettiProps) {
  const safeCount = Math.min(36, Math.max(8, Math.round(count)));

  return (
    <div
      {...props}
      className={cn(confettiVariants({ size, variant }), className)}
      data-active={trigger === undefined ? "false" : "true"}
      data-material={material}
    >
      <ConfettiKeyframes />
      {trigger !== undefined && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 motion-reduce:hidden forced-colors:hidden">
          {Array.from({ length: safeCount }, (_unused, index) => {
            const angle = (index / safeCount) * Math.PI * 2;
            const distance = 62 + (index % 6) * 13;
            const style: ConfettiStyle = {
              "--mq-rotate": `${150 + (index % 7) * 54}deg`,
              "--mq-x": `${Math.cos(angle) * distance}px`,
              "--mq-y": `${Math.sin(angle) * distance - 38}px`,
              animationDelay: `${(index % 5) * 0.025}s`,
              backgroundColor: `var(--mq-c${(index % 3) + 1}, #a8ff78)`,
              height: `${5 + (index % 3) * 2}px`,
              width: `${3 + (index % 2) * 3}px`,
            };
            return (
              <span
                className="absolute left-1/2 top-1/2 animate-[mq-confetti_1.15s_cubic-bezier(.16,.72,.32,1)_both] rounded-[2px]"
                key={`${trigger}-${index}`}
                style={style}
              />
            );
          })}
        </span>
      )}
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { confettiVariants };
