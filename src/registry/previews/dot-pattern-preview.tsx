"use client";

import { DotPattern } from "@/registry/ui/dot-pattern";
import type { PreviewProps } from "@/registry/schema";

type DotPatternVariant = "default" | "faded";
type DotPatternSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "faded"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): DotPatternVariant {
  return (VARIANTS.includes(value) ? value : "default") as DotPatternVariant;
}

function asSize(value: string): DotPatternSize {
  return (SIZES.includes(value) ? value : "md") as DotPatternSize;
}

export function DotPatternPreview({ material, variant, size }: PreviewProps) {
  return (
    <DotPattern
      className="w-[min(420px,100%)]"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase opacity-70">
          Dot pattern
        </p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">
          A quiet grid of dots
        </h3>
        <p className="m-0 mt-[8px] max-w-[36ch] text-[13px]/[1.5] opacity-75">
          The faded variant dissolves the dots toward the edges; content stays sharp.
        </p>
      </div>
    </DotPattern>
  );
}
