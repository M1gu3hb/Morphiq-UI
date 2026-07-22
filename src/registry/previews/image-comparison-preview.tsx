"use client";

import { ImageComparison } from "@/registry/ui/image-comparison";
import type { PreviewProps } from "@/registry/schema";

type ComparisonVariant = "labels" | "clean";
type ComparisonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["labels", "clean"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ComparisonVariant {
  return (VARIANTS.includes(value) ? value : "labels") as ComparisonVariant;
}

function asSize(value: string): ComparisonSize {
  return (SIZES.includes(value) ? value : "md") as ComparisonSize;
}

export function ImageComparisonPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <ImageComparison
      afterAlt="Restored alpine lake with vivid colour and contrast"
      afterSrc="https://picsum.photos/id/1039/900/620"
      beforeAlt="Muted monochrome alpine lake before restoration"
      beforeSrc="https://picsum.photos/id/1039/900/620?grayscale"
      className="w-[min(560px,100%)]"
      initialValue={state === "loading" ? 68 : 46}
      key={`${variant}-${size}-${state}`}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
