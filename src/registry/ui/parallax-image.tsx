"use client";

/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const parallaxImageVariants = cva(
  [
    "relative isolate m-0 overflow-hidden border border-[#343846] bg-[#11131a] text-[#f5f7ff]",
    "shadow-[0_18px_48px_rgba(4,7,15,.28)] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        subtle: "",
        deep: "",
      },
      size: {
        sm: "h-[220px] rounded-[18px]",
        md: "h-[310px] rounded-[24px]",
        lg: "h-[410px] rounded-[30px]",
      },
    },
    defaultVariants: { variant: "subtle", size: "md" },
  },
);

export type ParallaxImageProps = Omit<React.ComponentPropsWithRef<"figure">, "children"> &
  Omit<VariantProps<typeof parallaxImageVariants>, "variant" | "size"> & {
    src: string;
    alt: string;
    caption?: string;
    material?: MaterialSlug;
    variant?: "subtle" | "deep";
    size?: "sm" | "md" | "lg";
    amplitude?: number;
  };

export function ParallaxImage({
  alt,
  amplitude = 34,
  caption,
  className,
  material = "adaptive",
  size = "md",
  src,
  variant = "subtle",
  ...props
}: ParallaxImageProps) {
  const rootRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const safeAmplitude = Math.max(0, Math.min(amplitude, 72)) * (variant === "deep" ? 1 : 0.55);

    function update() {
      frame = 0;
      if (!root || media.matches) {
        root?.style.setProperty("--mq-shift", "0px");
        return;
      }
      const bounds = root.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = bounds.top + bounds.height / 2;
      const progress = Math.max(-1, Math.min(1, (viewportCenter - elementCenter) / (window.innerHeight / 2 + bounds.height / 2)));
      root.style.setProperty("--mq-shift", `${progress * safeAmplitude}px`);
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
  }, [amplitude, variant]);

  return (
    <figure {...props} className={cn(parallaxImageVariants({ size, variant }), className)} data-material={material} ref={rootRef}>
      <img
        alt={alt}
        className="absolute -inset-y-[12%] inset-x-0 h-[124%] w-full translate-y-[var(--mq-shift,0px)] object-cover motion-reduce:translate-y-0"
        height={900}
        src={src}
        width={1400}
      />
      {caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(0,0,0,.84))] px-[18px] pt-[54px] pb-[16px] text-[13px] font-bold text-white forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export { parallaxImageVariants };
