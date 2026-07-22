"use client";

import { InteractiveGrid } from "@/registry/ui/interactive-grid";
import type { PreviewProps } from "@/registry/schema";

type GridVariant = "cool" | "warm";
type BackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["cool", "warm"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): GridVariant {
  return (VARIANTS.includes(value) ? value : "cool") as GridVariant;
}

function asSize(value: string): BackgroundSize {
  return (SIZES.includes(value) ? value : "md") as BackgroundSize;
}

export function InteractiveGridPreview({ material, variant, size }: PreviewProps) {
  return (
    <InteractiveGrid
      className="w-[min(420px,100%)]"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto max-w-[34ch] rounded-[14px] border border-black/10 bg-[#fbfaf7]/90 p-[14px] text-[#171817] shadow-[0_12px_36px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#11131b]/90 dark:text-[#f5f3ec]">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase opacity-65">Pointer field</p>
        <h3 className="m-0 mt-[6px] text-[21px]/[1.12] font-extrabold tracking-[-0.03em]">Move near the grid</h3>
        <p className="m-0 mt-[7px] text-[13px]/[1.5] opacity-75">A radial mask reveals brighter cells while content remains untouched.</p>
      </div>
    </InteractiveGrid>
  );
}
