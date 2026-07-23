"use client";

import { Spotlight } from "@/registry/ui/spotlight";
import type { PreviewProps } from "@/registry/schema";

type SpotlightVariant = "cool" | "warm";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["cool", "warm"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SpotlightVariant {
  return (VARIANTS.includes(value) ? value : "cool") as SpotlightVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function SpotlightPreview({ material, variant, size }: PreviewProps) {
  return (
    <Spotlight className="w-[min(380px,100%)]" material={material} size={asSize(size)} variant={asVariant(variant)}>
      <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">Focused light</p>
      <h3 className="m-0 mt-[8px] text-[21px]/[1.12] font-extrabold tracking-[-0.03em]">Move across the panel</h3>
      <button className="mt-auto w-fit rounded-full border border-white/20 bg-[#11131a]/85 px-[13px] py-[8px] text-[12px] font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#a8ff78]" type="button">
        Content stays interactive
      </button>
    </Spotlight>
  );
}
