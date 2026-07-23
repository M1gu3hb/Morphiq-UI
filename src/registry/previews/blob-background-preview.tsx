"use client";

import type { PreviewProps } from "@/registry/schema";
import { BlobBackground } from "@/registry/ui/blob-background";

type BlobVariant = "pastel" | "neon";
type BackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["pastel", "neon"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): BlobVariant {
  return (VARIANTS.includes(value) ? value : "pastel") as BlobVariant;
}

function asSize(value: string): BackgroundSize {
  return (SIZES.includes(value) ? value : "md") as BackgroundSize;
}

export function BlobBackgroundPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <BlobBackground
      aria-busy={state === "loading"}
      className="w-[min(420px,100%)]"
      data-preview-material={material}
      data-preview-state={state}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="relative mt-auto max-w-[34ch] rounded-[14px] border border-white/20 bg-[#050814]/80 p-[14px] text-white forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase text-white/80">Soft geometry</p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">Colour that drifts, not distracts</h3>
        <p className="m-0 mt-[8px] text-[13px]/[1.5] text-white/80">Three blurred forms trade places beneath an opaque content layer.</p>
      </div>
    </BlobBackground>
  );
}
