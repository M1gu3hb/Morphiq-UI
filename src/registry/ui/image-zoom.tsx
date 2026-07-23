"use client";

/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const imageZoomVariants = cva(
  [
    "group relative isolate overflow-hidden border border-[#343846] bg-[#11131a] text-[#f5f7ff]",
    "shadow-[0_18px_48px_rgba(4,7,15,.28)] focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#f5f7ff]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: { inline: "", lens: "" },
      size: {
        sm: "h-[220px] rounded-[18px]",
        md: "h-[310px] rounded-[24px]",
        lg: "h-[400px] rounded-[30px]",
      },
    },
    defaultVariants: { variant: "inline", size: "md" },
  },
);

export type ImageZoomProps = Omit<React.ComponentPropsWithRef<"figure">, "children"> &
  Omit<VariantProps<typeof imageZoomVariants>, "variant" | "size"> & {
    src: string;
    alt: string;
    caption?: string;
    material?: MaterialSlug;
    variant?: "inline" | "lens";
    size?: "sm" | "md" | "lg";
    zoom?: number;
  };

export function ImageZoom({
  alt,
  caption,
  className,
  material = "adaptive",
  size = "md",
  src,
  variant = "inline",
  zoom = 1.8,
  ...props
}: ImageZoomProps) {
  const rootRef = React.useRef<HTMLElement>(null);
  const [active, setActive] = React.useState(false);
  const safeZoom = Math.max(1.2, Math.min(zoom, 3));

  function updateOrigin(event: React.PointerEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
    rootRef.current?.style.setProperty("--mq-x", `${x}%`);
    rootRef.current?.style.setProperty("--mq-y", `${y}%`);
  }

  return (
    <figure
      {...props}
      className={cn(imageZoomVariants({ size, variant }), className)}
      data-active={active ? "true" : "false"}
      data-material={material}
      ref={rootRef}
      style={{ "--mq-zoom": safeZoom } as React.CSSProperties}
    >
      <button
        aria-label={`${active ? "Reset" : "Zoom"} ${alt}`}
        aria-pressed={active}
        className="relative size-full cursor-zoom-in overflow-hidden border-0 bg-transparent p-0 text-left data-[active=true]:cursor-zoom-out"
        data-active={active ? "true" : "false"}
        onBlur={() => setActive(false)}
        onClick={() => setActive((current) => !current)}
        onFocus={() => setActive(true)}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
        onPointerMove={updateOrigin}
        type="button"
      >
        <img
          alt={alt}
          className={cn(
            "size-full object-cover transition-[scale] duration-300 ease-out",
            active && variant === "inline" && "scale-[var(--mq-zoom,1.8)]",
            "motion-reduce:transition-none motion-reduce:scale-100",
          )}
          height={720}
          src={src}
          style={{ transformOrigin: "var(--mq-x,50%) var(--mq-y,50%)" }}
          width={1080}
        />
        {variant === "lens" && active ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute size-[132px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-no-repeat shadow-[0_12px_32px_rgba(0,0,0,.45)] motion-reduce:hidden forced-colors:hidden"
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: "var(--mq-x,50%) var(--mq-y,50%)",
              backgroundSize: `${safeZoom * 100}%`,
              left: "var(--mq-x,50%)",
              top: "var(--mq-y,50%)",
            }}
          />
        ) : null}
        <span className="absolute right-[12px] bottom-[12px] rounded-full bg-black/75 px-[10px] py-[6px] text-[11px] font-bold text-white forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]">
          {active ? "Zoom active" : "Click or focus to zoom"}
        </span>
      </button>
      {caption ? <figcaption className="sr-only">{caption}</figcaption> : null}
    </figure>
  );
}

export { imageZoomVariants };
