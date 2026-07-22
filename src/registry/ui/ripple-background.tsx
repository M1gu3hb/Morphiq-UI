"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const RIPPLE_KEYFRAMES = `@keyframes mq-ripple-background{0%{scale:.34;opacity:.5}72%,100%{scale:1;opacity:0}}`;

function RippleKeyframes() {
  return (
    <style href="mq-ripple-background" precedence="medium">
      {RIPPLE_KEYFRAMES}
    </style>
  );
}

const rippleBackgroundVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#f7f4ed)] text-[color:var(--mq-fg,#171817)]",
    "[--mq-ring:rgba(79,70,229,0.34)] dark:[--mq-bg:#10121a] dark:[--mq-fg:#f4f2eb] dark:[--mq-ring:rgba(165,180,252,0.42)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        soft: "[--mq-ring:rgba(79,70,229,0.28)] dark:[--mq-ring:rgba(165,180,252,0.34)]",
        bold: "[--mq-ring:rgba(37,99,235,0.46)] dark:[--mq-ring:rgba(125,211,252,0.52)]",
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

type RippleBackgroundVariant = "soft" | "bold";
type RippleBackgroundSize = "sm" | "md" | "lg";

export type RippleBackgroundProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof rippleBackgroundVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: RippleBackgroundVariant;
    size?: RippleBackgroundSize;
  };

const RINGS = [48, 73, 98, 123] as const;

export function RippleBackground({
  children,
  className,
  material = "adaptive",
  size = "md",
  variant = "soft",
  ...props
}: RippleBackgroundProps) {
  return (
    <div
      {...props}
      className={cn(rippleBackgroundVariants({ size, variant }), className)}
      data-material={material}
    >
      <RippleKeyframes />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 forced-colors:hidden">
        {RINGS.map((diameter, index) => (
          <span
            className={cn(
              "absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full",
              "border border-[color:var(--mq-ring,rgba(79,70,229,0.34))] opacity-0 scale-[0.34]",
              "animate-[mq-ripple-background_4.8s_ease-out_infinite]",
              "motion-reduce:animate-none motion-reduce:scale-100 motion-reduce:opacity-25",
            )}
            key={diameter}
            style={{ animationDelay: `${index * 1.2}s`, width: `${diameter}%` }}
          />
        ))}
      </span>
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { rippleBackgroundVariants };
