"use client";

import { GridPattern } from "@/registry/ui/grid-pattern";
import type { PreviewProps } from "@/registry/schema";

type GridPatternVariant = "default" | "faded";
type GridPatternSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "faded"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): GridPatternVariant {
  return (VARIANTS.includes(value) ? value : "default") as GridPatternVariant;
}

function asSize(value: string): GridPatternSize {
  return (SIZES.includes(value) ? value : "md") as GridPatternSize;
}

export function GridPatternPreview({ material, variant, size }: PreviewProps) {
  return (
    <GridPattern
      className="w-[min(420px,100%)]"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase opacity-70">
          Grid pattern
        </p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">
          A fine ruled backdrop
        </h3>
        <p className="m-0 mt-[8px] max-w-[36ch] text-[13px]/[1.5] opacity-75">
          The faded variant vignettes the grid toward the edges; content stays sharp.
        </p>
      </div>
    </GridPattern>
  );
}
