"use client";

import type { PreviewProps } from "@/registry/schema";
import { GridBeams } from "@/registry/ui/grid-beams";

type GridBeamsVariant = "violet" | "cyan";
type BackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["violet", "cyan"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): GridBeamsVariant {
  return (VARIANTS.includes(value) ? value : "violet") as GridBeamsVariant;
}

function asSize(value: string): BackgroundSize {
  return (SIZES.includes(value) ? value : "md") as BackgroundSize;
}

export function GridBeamsPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <GridBeams
      aria-busy={state === "loading"}
      className="w-[min(420px,100%)]"
      data-preview-material={material}
      data-preview-state={state}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="relative mt-auto max-w-[34ch] rounded-[14px] border border-white/20 bg-[#050814]/80 p-[14px] text-white forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase text-white/80">Signal grid</p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">Perspective with passing beams</h3>
        <p className="m-0 mt-[8px] text-[13px]/[1.5] text-white/80">A lightweight CSS plane carries three independent streaks of light.</p>
      </div>
    </GridBeams>
  );
}
