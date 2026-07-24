"use client";

/* eslint-disable @next/next/no-img-element -- distributed open-code effect is framework agnostic */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type TrailItem = { id: number; src: string; x: number; y: number };

const TRAIL_KEYFRAMES = `@keyframes mq-image-trail{0%{translate:-50% -50%;scale:.72;rotate:-5deg;opacity:0}18%{scale:1;opacity:1}100%{translate:-50% calc(-50% - 34px);scale:.88;rotate:5deg;opacity:0}}`;

function TrailKeyframes() {
  return <style href="mq-image-trail" precedence="medium">{TRAIL_KEYFRAMES}</style>;
}

const imageTrailVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[#10131a] text-[#f7f8fc]",
    "border-[rgba(244,246,255,0.18)] shadow-[0_18px_48px_rgba(4,7,15,0.3)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#a8ff78]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        tiles: "[--mq-trail-radius:14px]",
        glow: "[--mq-trail-radius:999px]",
      },
      size: {
        sm: "min-h-[150px] rounded-[18px] p-[18px] [--mq-trail-size:54px]",
        md: "min-h-[190px] rounded-[24px] p-[24px] [--mq-trail-size:68px]",
        lg: "min-h-[240px] rounded-[30px] p-[30px] [--mq-trail-size:82px]",
      },
    },
    defaultVariants: { variant: "tiles", size: "md" },
  },
);

type ImageTrailVariant = "tiles" | "glow";
type ImageTrailSize = "sm" | "md" | "lg";

export type ImageTrailProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof imageTrailVariants>, "variant" | "size"> & {
    images: readonly string[];
    material?: MaterialSlug;
    variant?: ImageTrailVariant;
    size?: ImageTrailSize;
    spacing?: number;
  };

export function ImageTrail({
  children,
  className,
  images,
  material = "adaptive",
  onPointerLeave,
  onPointerMove,
  size = "md",
  spacing = 30,
  variant = "tiles",
  ...props
}: ImageTrailProps) {
  const [trail, setTrail] = React.useState<TrailItem[]>([]);
  const nextId = React.useRef(0);
  const imageIndex = React.useRef(0);
  const lastPoint = React.useRef<{ x: number; y: number } | null>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (
      images.length > 0 &&
      event.pointerType !== "touch" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.matchMedia("(forced-colors: active)").matches
    ) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      const previous = lastPoint.current;
      const distance = previous ? Math.hypot(point.x - previous.x, point.y - previous.y) : Number.POSITIVE_INFINITY;
      if (distance >= Math.max(16, spacing)) {
        const item = {
          id: nextId.current++,
          src: images[imageIndex.current % images.length],
          ...point,
        };
        imageIndex.current += 1;
        lastPoint.current = point;
        setTrail((current) => [...current.slice(-6), item]);
      }
    }
    onPointerMove?.(event);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    lastPoint.current = null;
    onPointerLeave?.(event);
  }

  return (
    <div
      {...props}
      className={cn(imageTrailVariants({ size, variant }), className)}
      data-material={material}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <TrailKeyframes />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 hidden motion-safe:[@media(pointer:fine)]:block forced-colors:hidden">
        {trail.map((item) => (
          <img
            alt=""
            className="absolute h-[var(--mq-trail-size,68px)] w-[var(--mq-trail-size,68px)] rounded-[var(--mq-trail-radius,14px)] border border-white/25 object-cover shadow-[0_12px_28px_rgba(0,0,0,.38)] animate-[mq-image-trail_.82s_cubic-bezier(.2,.7,.2,1)_both]"
            height={96}
            key={item.id}
            onAnimationEnd={() => setTrail((current) => current.filter((candidate) => candidate.id !== item.id))}
            src={item.src}
            style={{ left: item.x, top: item.y }}
            width={96}
          />
        ))}
      </span>
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { imageTrailVariants };
