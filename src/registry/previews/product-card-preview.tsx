"use client";

import { ProductCard } from "@/registry/ui/product-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Product Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type ProductCardVariant = "default";
type ProductCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ProductCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as ProductCardVariant;
}

function asSize(value: string): ProductCardSize {
  return (SIZES.includes(value) ? value : "md") as ProductCardSize;
}

/** Copy differs per material so each recipe is shown doing real commerce work. */
const COPY: Record<
  StyleSlug,
  {
    title: string;
    alt: string;
    seed: string;
    price: string;
    compareAtPrice?: string;
    rating: number;
    reviewCount: number;
    badge?: string;
  }
> = {
  clay: {
    title: "Terracotta plant pot",
    alt: "A hand-thrown terracotta plant pot on a warm neutral surface",
    seed: "claypot",
    price: "$48.00",
    compareAtPrice: "$60.00",
    rating: 4.5,
    reviewCount: 128,
    badge: "Sale",
  },
  glass: {
    title: "Frosted carafe set",
    alt: "A frosted glass carafe with two matching tumblers",
    seed: "glasscarafe",
    price: "$72.00",
    rating: 4.8,
    reviewCount: 64,
  },
  skeuo: {
    title: "Field recorder MK II",
    alt: "A portable field audio recorder with metal dials",
    seed: "skeuorecorder",
    price: "$210.00",
    rating: 4.2,
    reviewCount: 341,
  },
  adaptive: {
    title: "Everyday tote bag",
    alt: "A canvas tote bag standing upright against a plain wall",
    seed: "adaptivetote",
    price: "$36.00",
    rating: 4.6,
    reviewCount: 512,
    badge: "New",
  },
};

export function ProductCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <div className="flex flex-col items-start gap-[18px]">
      <ProductCard
        className="w-[min(320px,100%)]"
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        material={material}
        variant={asVariant(variant)}
        size={asSize(size)}
        href="#product"
        imageSrc={`https://picsum.photos/seed/${copy.seed}/640/480`}
        imageAlt={copy.alt}
        title={copy.title}
        badge={copy.badge}
        price={copy.price}
        compareAtPrice={copy.compareAtPrice}
        rating={copy.rating}
        reviewCount={copy.reviewCount}
        addLabel="Add"
      />
    </div>
  );
}
