"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type Ripple = { id: number; x: number; y: number };

const RIPPLE_KEYFRAMES = `@keyframes mq-ripple-effect{0%{scale:0;opacity:.55}100%{scale:1;opacity:0}}@keyframes mq-ripple-highlight{0%{scale:.08;opacity:.32}100%{scale:.34;opacity:0}}`;

function RippleKeyframes() {
  return <style href="mq-ripple-effect" precedence="medium">{RIPPLE_KEYFRAMES}</style>;
}

const rippleEffectVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[#11131a] text-[#f5f7ff]",
    "border-[rgba(244,246,255,0.18)] shadow-[0_18px_48px_rgba(7,9,16,0.28)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#a8ff78]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        soft: "[--mq-ripple:rgba(125,211,252,0.48)]",
        vivid: "[--mq-ripple:rgba(196,181,253,0.68)]",
      },
      size: {
        sm: "min-h-[120px] rounded-[18px] p-[18px]",
        md: "min-h-[156px] rounded-[24px] p-[24px]",
        lg: "min-h-[196px] rounded-[30px] p-[30px]",
      },
    },
    defaultVariants: { variant: "soft", size: "md" },
  },
);

type RippleEffectVariant = "soft" | "vivid";
type RippleEffectSize = "sm" | "md" | "lg";

export type RippleEffectProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof rippleEffectVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: RippleEffectVariant;
    size?: RippleEffectSize;
    /** Changing this value emits a centred ripple, allowing programmatic replay. */
    trigger?: string | number;
  };

export function RippleEffect({
  children,
  className,
  material = "adaptive",
  onPointerDown,
  size = "md",
  trigger,
  variant = "soft",
  ...props
}: RippleEffectProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const nextId = React.useRef(0);

  const addRipple = React.useCallback((x: number, y: number) => {
    if (window.matchMedia("(forced-colors: active)").matches) return;
    const ripple = { id: nextId.current++, x, y };
    setRipples((current) => [...current.slice(-5), ripple]);
  }, []);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    addRipple(
      ((event.clientX - bounds.left) / bounds.width) * 100,
      ((event.clientY - bounds.top) / bounds.height) * 100,
    );
    onPointerDown?.(event);
  }

  return (
    <div
      {...props}
      className={cn(rippleEffectVariants({ size, variant }), className)}
      data-material={material}
      data-ripple-count={ripples.length}
      onPointerDown={handlePointerDown}
    >
      <RippleKeyframes />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 forced-colors:hidden">
        {trigger !== undefined && (
          <span
            className={cn(
              "absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full",
              "bg-[radial-gradient(circle,var(--mq-ripple,rgba(125,211,252,0.48))_0%,transparent_68%)]",
              "animate-[mq-ripple-effect_.62s_ease-out_both]",
              "motion-reduce:animate-[mq-ripple-highlight_.16s_ease-out_both]",
            )}
            key={`trigger-${trigger}`}
          />
        )}
        {ripples.map((ripple) => (
          <span
            className={cn(
              "absolute aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full",
              "bg-[radial-gradient(circle,var(--mq-ripple,rgba(125,211,252,0.48))_0%,transparent_68%)]",
              "animate-[mq-ripple-effect_.62s_ease-out_both]",
              "motion-reduce:animate-[mq-ripple-highlight_.16s_ease-out_both]",
            )}
            key={ripple.id}
            onAnimationEnd={() => setRipples((current) => current.filter((item) => item.id !== ripple.id))}
            style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
          />
        ))}
      </span>
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { rippleEffectVariants };
