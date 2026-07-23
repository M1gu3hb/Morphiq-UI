/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

export type MasonryGalleryImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

const masonryGalleryVariants = cva(
  "w-full text-[#f5f7ff] forced-colors:text-[CanvasText]",
  {
    variants: {
      variant: {
        balanced: "columns-1 sm:columns-2 lg:columns-3",
        editorial: "columns-2 lg:columns-3",
      },
      size: {
        sm: "[column-gap:8px] [&>figure]:mb-[8px]",
        md: "[column-gap:12px] [&>figure]:mb-[12px]",
        lg: "[column-gap:16px] [&>figure]:mb-[16px]",
      },
    },
    defaultVariants: { variant: "balanced", size: "md" },
  },
);

export type MasonryGalleryProps = Omit<React.ComponentPropsWithRef<"section">, "children"> &
  Omit<VariantProps<typeof masonryGalleryVariants>, "variant" | "size"> & {
    images: readonly MasonryGalleryImage[];
    material?: MaterialSlug;
    variant?: "balanced" | "editorial";
    size?: "sm" | "md" | "lg";
  };

export function MasonryGallery({
  "aria-label": ariaLabel = "Masonry image gallery",
  className,
  images,
  material = "adaptive",
  size = "md",
  variant = "balanced",
  ...props
}: MasonryGalleryProps) {
  return (
    <section {...props} aria-label={ariaLabel} className={cn(masonryGalleryVariants({ size, variant }), className)} data-material={material}>
      {images.map((image) => (
        <figure className="relative inline-block w-full break-inside-avoid overflow-hidden rounded-[16px] border border-white/16 bg-[#151923] shadow-[0_10px_28px_rgba(4,7,14,.22)] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none" key={image.id}>
          <img alt={image.alt} className="block h-auto w-full object-cover" height={image.height} loading="lazy" src={image.src} width={image.width} />
          {image.caption ? <figcaption className="bg-[#11131a] px-[12px] py-[9px] text-[12px]/[1.4] text-[#f5f7ff] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">{image.caption}</figcaption> : null}
        </figure>
      ))}
    </section>
  );
}

export { masonryGalleryVariants };
