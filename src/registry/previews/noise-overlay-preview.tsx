"use client";

import { NoiseOverlay } from "@/registry/ui/noise-overlay";
import type { PreviewProps } from "@/registry/schema";

type NoiseVariant = "fine" | "coarse";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["fine", "coarse"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): NoiseVariant {
  return (VARIANTS.includes(value) ? value : "fine") as NoiseVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function NoiseOverlayPreview({ material, variant, size }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  return (
    <NoiseOverlay className="w-[min(380px,100%)]" material={material} opacity={resolvedVariant === "fine" ? 0.12 : 0.2} size={asSize(size)} variant={resolvedVariant}>
      <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">Texture layer</p>
      <h3 className="m-0 mt-[8px] text-[21px]/[1.12] font-extrabold tracking-[-0.03em]">Grain without visual noise</h3>
      <p className="m-0 mt-[9px] max-w-[34ch] text-[13px]/[1.5] text-[#c8ccd8]">A single data-URI sits above the panel while text and controls remain untouched.</p>
    </NoiseOverlay>
  );
}
