"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const parallaxScrollVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[#0e1118] text-[#f6f8fc]",
    "border-[rgba(244,246,255,0.18)] shadow-[0_18px_48px_rgba(4,7,15,0.3)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#9df8cf]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        depth: "",
        drift: "",
      },
      size: {
        sm: "h-[180px] rounded-[18px]",
        md: "h-[240px] rounded-[24px]",
        lg: "h-[320px] rounded-[30px]",
      },
    },
    defaultVariants: { variant: "depth", size: "md" },
  },
);

type ParallaxScrollVariant = "depth" | "drift";
type ParallaxScrollSize = "sm" | "md" | "lg";

export type ParallaxScrollLayer = {
  id: string;
  content: React.ReactNode;
  speed?: number;
  className?: string;
};

export type ParallaxScrollProps = Omit<React.ComponentPropsWithRef<"div">, "children"> &
  Omit<VariantProps<typeof parallaxScrollVariants>, "variant" | "size"> & {
    layers: readonly ParallaxScrollLayer[];
    material?: MaterialSlug;
    variant?: ParallaxScrollVariant;
    size?: ParallaxScrollSize;
  };

export function ParallaxScroll({
  className,
  layers,
  material = "adaptive",
  size = "md",
  variant = "depth",
  ...props
}: ParallaxScrollProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const layerRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    function update() {
      frame = 0;
      if (!root) return;
      const bounds = root.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = bounds.top + bounds.height / 2;
      const progress = media.matches
        ? 0
        : Math.max(-1, Math.min(1, (viewportCenter - elementCenter) / (window.innerHeight / 2 + bounds.height / 2)));
      layerRefs.current.forEach((layer, index) => {
        if (!layer) return;
        const configured = Math.max(-80, Math.min(80, layers[index]?.speed ?? index * 12));
        const speed = variant === "drift" ? configured * 0.65 : configured;
        layer.style.translate = `0 ${progress * speed}px`;
      });
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, [layers, variant]);

  return (
    <div
      {...props}
      className={cn(parallaxScrollVariants({ size, variant }), className)}
      data-material={material}
      ref={rootRef}
    >
      {layers.map((layer, index) => (
        <div
          className={cn(
            "absolute inset-0 motion-reduce:!translate-y-0 forced-colors:!translate-y-0",
            layer.className,
          )}
          key={layer.id}
          ref={(node) => {
            layerRefs.current[index] = node;
          }}
        >
          {layer.content}
        </div>
      ))}
    </div>
  );
}

export { parallaxScrollVariants };
