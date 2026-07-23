"use client";

/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

export type ThumbnailCarouselImage = { id: string; src: string; alt: string; caption?: string };

const thumbnailCarouselVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[var(--mq-body,#f7e7dc)] text-[color:var(--mq-text,#33261e)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: "[--mq-body:#f7e7dc] [--mq-text:#33261e] [--mq-muted:#634b3d] [--mq-brd:rgba(88,51,38,.3)] [--mq-well:#fff4ec] [--mq-ring:#33261e] border-[var(--mq-brd,rgba(88,51,38,.3))] shadow-[inset_0_2px_3px_rgba(255,255,255,.72),0_5px_0_#d2a082,0_15px_28px_rgba(86,48,33,.18)]",
        glass: "[--mq-body:rgba(20,24,31,.94)] [--mq-text:#ffffff] [--mq-muted:#d3d9e5] [--mq-brd:rgba(255,255,255,.44)] [--mq-well:rgba(255,255,255,.14)] [--mq-ring:#ffffff] border-[var(--mq-brd,rgba(255,255,255,.44))] backdrop-blur-[18px] backdrop-saturate-[160%] shadow-[inset_0_1px_0_rgba(255,255,255,.46),0_18px_36px_rgba(12,16,30,.28)]",
        skeuo: "[--mq-body:#e6e3da] [--mq-text:#23231f] [--mq-muted:#555149] [--mq-brd:#97938a] [--mq-well:#f4f1e9] [--mq-ring:#171817] border-[var(--mq-brd,#97938a)] shadow-[inset_0_2px_3px_rgba(255,255,255,.9),inset_0_-4px_6px_rgba(0,0,0,.13),0_5px_0_#a8a49b,0_15px_26px_rgba(38,36,31,.23)]",
        adaptive: "[--mq-body:#171817] [--mq-text:#f7f6f2] [--mq-muted:#c8c6bf] [--mq-brd:#3f403c] [--mq-well:#2b2c29] [--mq-ring:#f7f6f2] border-[var(--mq-brd,#3f403c)] shadow-[0_16px_34px_rgba(20,20,18,.2)]",
      },
      variant: {
        bottom: "flex flex-col",
        side: "flex flex-col sm:grid sm:grid-cols-[1fr_86px]",
      },
      size: {
        sm: "rounded-[18px] p-[8px] [--mq-main-h:220px]",
        md: "rounded-[24px] p-[10px] [--mq-main-h:310px]",
        lg: "rounded-[30px] p-[12px] [--mq-main-h:400px]",
      },
    },
    defaultVariants: { material: "clay", variant: "bottom", size: "md" },
  },
);

export type ThumbnailCarouselProps = Omit<React.ComponentPropsWithRef<"section">, "children"> &
  Omit<VariantProps<typeof thumbnailCarouselVariants>, "material" | "variant" | "size"> & {
    images: readonly ThumbnailCarouselImage[];
    material?: MaterialSlug;
    variant?: "bottom" | "side";
    size?: "sm" | "md" | "lg";
    initialIndex?: number;
    onIndexChange?: (index: number) => void;
  };

export function ThumbnailCarousel({
  "aria-label": ariaLabel = "Thumbnail carousel",
  className,
  images,
  initialIndex = 0,
  material = "clay",
  onIndexChange,
  size = "md",
  variant = "bottom",
  ...props
}: ThumbnailCarouselProps) {
  const [index, setIndex] = React.useState(() => Math.max(0, Math.min(initialIndex, images.length - 1)));
  const activeIndex = images.length ? Math.min(index, images.length - 1) : 0;
  const active = images[activeIndex];

  function select(next: number) {
    const safe = Math.max(0, Math.min(next, images.length - 1));
    setIndex(safe);
    onIndexChange?.(safe);
  }

  return (
    <section {...props} aria-label={ariaLabel} className={cn(thumbnailCarouselVariants({ material, size, variant }), className)} data-material={material}>
      <figure className="relative m-0 h-[var(--mq-main-h,310px)] overflow-hidden rounded-[16px] bg-[#101218] forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]">
        {active ? <img alt={active.alt} className="size-full object-cover" height={720} src={active.src} width={1080} /> : <p className="grid size-full place-items-center text-[14px]">Add images.</p>}
        {active?.caption ? <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(0,0,0,.82))] px-[16px] pt-[42px] pb-[13px] text-[13px] font-bold text-white forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">{active.caption}</figcaption> : null}
      </figure>
      <div
        aria-label="Choose image"
        className={cn("flex gap-[7px] overflow-auto p-[8px]", variant === "side" && "sm:flex-col sm:py-0 sm:pr-0 sm:pl-[8px]")}
        onKeyDown={(event) => {
          const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
          if (!delta || !images.length) return;
          event.preventDefault();
          select((activeIndex + delta + images.length) % images.length);
          event.currentTarget.querySelectorAll<HTMLButtonElement>("button").item((activeIndex + delta + images.length) % images.length).focus();
        }}
        role="listbox"
      >
        {images.map((image, imageIndex) => (
          <button
            aria-current={imageIndex === activeIndex ? "true" : undefined}
            aria-label={`Show ${image.alt}`}
            aria-selected={imageIndex === activeIndex}
            className="h-[58px] w-[76px] shrink-0 overflow-hidden rounded-[10px] border-2 border-transparent bg-[var(--mq-well,#fff4ec)] p-[3px] opacity-70 transition-[opacity,scale,border-color] duration-150 hover:scale-[1.03] hover:opacity-100 aria-current:border-[var(--mq-ring,#33261e)] aria-current:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#33261e)] motion-reduce:transition-none motion-reduce:hover:scale-100 forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace]"
            key={image.id}
            onClick={() => select(imageIndex)}
            role="option"
            type="button"
          >
            <img alt="" className="size-full rounded-[6px] object-cover" height={90} src={image.src} width={120} />
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">Image {images.length ? activeIndex + 1 : 0} of {images.length}</p>
    </section>
  );
}

export { thumbnailCarouselVariants };
