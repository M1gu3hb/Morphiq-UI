/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

export type GalleryGridImage = {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
};

const galleryGridVariants = cva(
  "grid w-full text-[#f5f7ff] forced-colors:text-[CanvasText]",
  {
    variants: {
      variant: {
        cards: "[&>figure]:rounded-[16px] [&>figure]:border [&>figure]:border-white/15 [&>figure]:bg-[#151923] [&>figure]:p-[6px] [&>figure]:shadow-[0_10px_28px_rgba(4,7,14,.2)]",
        edge: "[&>figure]:rounded-[12px]",
      },
      size: {
        sm: "grid-cols-2 gap-[7px]",
        md: "grid-cols-2 gap-[10px] sm:grid-cols-3",
        lg: "grid-cols-2 gap-[14px] sm:grid-cols-3 lg:grid-cols-4",
      },
    },
    defaultVariants: { variant: "cards", size: "md" },
  },
);

export type GalleryGridProps = Omit<React.ComponentPropsWithRef<"section">, "children"> &
  Omit<VariantProps<typeof galleryGridVariants>, "variant" | "size"> & {
    images: readonly GalleryGridImage[];
    material?: MaterialSlug;
    variant?: "cards" | "edge";
    size?: "sm" | "md" | "lg";
  };

export function GalleryGrid({
  "aria-label": ariaLabel = "Image gallery",
  className,
  images,
  material = "adaptive",
  size = "md",
  variant = "cards",
  ...props
}: GalleryGridProps) {
  return (
    <section {...props} aria-label={ariaLabel} className={cn(galleryGridVariants({ size, variant }), className)} data-material={material}>
      {images.map((image) => (
        <figure className="m-0 overflow-hidden forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none" key={image.id}>
          <img
            alt={image.alt}
            className="aspect-[4/3] w-full rounded-[10px] object-cover"
            height={image.height ?? 420}
            loading="lazy"
            src={image.src}
            width={image.width ?? 560}
          />
          {image.caption ? <figcaption className="px-[7px] py-[8px] text-[12px]/[1.4] text-[#f5f7ff] forced-colors:text-[CanvasText]">{image.caption}</figcaption> : null}
        </figure>
      ))}
    </section>
  );
}

export { galleryGridVariants };
