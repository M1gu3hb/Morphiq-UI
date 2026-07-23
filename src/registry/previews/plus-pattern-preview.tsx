"use client";

import type { PreviewProps } from "@/registry/schema";
import { PlusPattern } from "@/registry/ui/plus-pattern";

type PlusVariant = "drift" | "pulse";
type BackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["drift", "pulse"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): PlusVariant {
  return (VARIANTS.includes(value) ? value : "drift") as PlusVariant;
}

function asSize(value: string): BackgroundSize {
  return (SIZES.includes(value) ? value : "md") as BackgroundSize;
}

export function PlusPatternPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <PlusPattern
      aria-busy={state === "loading"}
      className="w-[min(420px,100%)]"
      data-preview-material={material}
      data-preview-state={state}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="relative mt-auto max-w-[34ch] rounded-[14px] border border-black/15 bg-white/88 p-[14px] text-[#171817] dark:border-white/20 dark:bg-[#050814]/84 dark:text-white forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase opacity-70">Tiled detail</p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">A field of tiny plus marks</h3>
        <p className="m-0 mt-[8px] text-[13px]/[1.5] opacity-75">A compact SVG mask tiles cleanly and fades toward the panel edges.</p>
      </div>
    </PlusPattern>
  );
}
