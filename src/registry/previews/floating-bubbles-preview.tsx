"use client";

import type { PreviewProps } from "@/registry/schema";
import { FloatingBubbles } from "@/registry/ui/floating-bubbles";

type BubblesVariant = "soft" | "iridescent";
type BackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["soft", "iridescent"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): BubblesVariant {
  return (VARIANTS.includes(value) ? value : "soft") as BubblesVariant;
}

function asSize(value: string): BackgroundSize {
  return (SIZES.includes(value) ? value : "md") as BackgroundSize;
}

export function FloatingBubblesPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <FloatingBubbles
      aria-busy={state === "loading"}
      className="w-[min(420px,100%)]"
      count={12}
      data-preview-material={material}
      data-preview-state={state}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="relative mt-auto max-w-[34ch] rounded-[14px] border border-white/20 bg-[#050814]/80 p-[14px] text-white forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase text-white/80">Buoyant layer</p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">A calm upward current</h3>
        <p className="m-0 mt-[8px] text-[13px]/[1.5] text-white/80">A bounded set of translucent bubbles rises behind untouched content.</p>
      </div>
    </FloatingBubbles>
  );
}
