"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const scrollRevealVariants = cva(
  [
    "relative border border-[rgba(244,246,255,0.18)] bg-[#11131a] text-[#f5f7ff]",
    "shadow-[0_18px_48px_rgba(7,9,16,0.28)] transition-[opacity,translate,filter] duration-700 ease-[cubic-bezier(.2,.7,.2,1)]",
    "motion-reduce:translate-none motion-reduce:opacity-100 motion-reduce:[filter:none] motion-reduce:transition-none",
    "forced-colors:translate-none forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:opacity-100 forced-colors:[filter:none] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        lift: "",
        soften: "",
      },
      size: {
        sm: "min-h-[120px] rounded-[18px] p-[18px]",
        md: "min-h-[156px] rounded-[24px] p-[24px]",
        lg: "min-h-[196px] rounded-[30px] p-[30px]",
      },
    },
    defaultVariants: { variant: "lift", size: "md" },
  },
);

type ScrollRevealVariant = "lift" | "soften";
type ScrollRevealSize = "sm" | "md" | "lg";

export type ScrollRevealProps = React.ComponentPropsWithoutRef<"div"> &
  Omit<VariantProps<typeof scrollRevealVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: ScrollRevealVariant;
    size?: ScrollRevealSize;
    once?: boolean;
    threshold?: number;
  };

export function ScrollReveal({
  children,
  className,
  material = "adaptive",
  once = true,
  size = "md",
  threshold = 0.24,
  variant = "lift",
  ...props
}: ScrollRevealProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { threshold: Math.max(0, Math.min(1, threshold)) },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <div
      {...props}
      className={cn(
        scrollRevealVariants({ size, variant }),
        !isVisible && variant === "lift" && "translate-y-[22px] opacity-0",
        !isVisible && variant === "soften" && "translate-y-[10px] opacity-0 blur-[8px]",
        className,
      )}
      data-material={material}
      data-visible={isVisible}
      ref={rootRef}
    >
      {children}
    </div>
  );
}

export { scrollRevealVariants };
