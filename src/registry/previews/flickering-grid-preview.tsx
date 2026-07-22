"use client";

import { FlickeringGrid } from "@/registry/ui/flickering-grid";
import type { PreviewProps } from "@/registry/schema";

type FlickerVariant = "subtle" | "dense";
type BackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["subtle", "dense"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FlickerVariant {
  return (VARIANTS.includes(value) ? value : "subtle") as FlickerVariant;
}

function asSize(value: string): BackgroundSize {
  return (SIZES.includes(value) ? value : "md") as BackgroundSize;
}

export function FlickeringGridPreview({ material, variant, size }: PreviewProps) {
  return (
    <FlickeringGrid
      className="w-[min(420px,100%)]"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto max-w-[34ch] rounded-[14px] bg-[#080b13]/75 p-[14px] text-white shadow-[0_12px_36px_rgba(0,0,0,0.22)]">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase text-white/75">Live matrix</p>
        <h3 className="m-0 mt-[6px] text-[21px]/[1.12] font-extrabold tracking-[-0.03em]">Quiet activity, bounded cost</h3>
        <p className="m-0 mt-[7px] text-[13px]/[1.5] text-white/80">A deterministic set of cells flickers without random hydration.</p>
      </div>
    </FlickeringGrid>
  );
}
