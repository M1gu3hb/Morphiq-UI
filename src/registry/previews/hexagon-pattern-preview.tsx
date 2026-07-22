"use client";

import { HexagonPattern } from "@/registry/ui/hexagon-pattern";
import type { PreviewProps } from "@/registry/schema";

type HexagonVariant = "solid" | "faded";
type BackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["solid", "faded"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): HexagonVariant {
  return (VARIANTS.includes(value) ? value : "faded") as HexagonVariant;
}

function asSize(value: string): BackgroundSize {
  return (SIZES.includes(value) ? value : "md") as BackgroundSize;
}

export function HexagonPatternPreview({ material, variant, size }: PreviewProps) {
  return (
    <HexagonPattern
      className="w-[min(420px,100%)]"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto max-w-[34ch]">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase opacity-65">Geometry</p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">A seamless hexagonal field</h3>
        <p className="m-0 mt-[8px] text-[13px]/[1.5] opacity-75">Five gradient layers create the tessellation without extra DOM nodes.</p>
      </div>
    </HexagonPattern>
  );
}
