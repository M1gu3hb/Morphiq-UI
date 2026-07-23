"use client";

import { ScratchToReveal } from "@/registry/ui/scratch-to-reveal";
import type { PreviewProps } from "@/registry/schema";

type ScratchVariant = "silver" | "violet";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["silver", "violet"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ScratchVariant {
  return (VARIANTS.includes(value) ? value : "silver") as ScratchVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function ScratchToRevealPreview({ material, variant, size }: PreviewProps) {
  return (
    <ScratchToReveal className="w-[min(380px,100%)]" key={`${variant}-${size}`} material={material} size={asSize(size)} variant={asVariant(variant)}>
      <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">Always accessible</p>
      <h3 className="m-0 mt-[8px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">You uncovered 25% off</h3>
      <p className="m-0 mt-[9px] text-[13px]/[1.5] text-[#c8ccd8]">Code: MORPHIQ25</p>
    </ScratchToReveal>
  );
}
