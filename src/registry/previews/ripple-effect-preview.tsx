"use client";

import { RippleEffect } from "@/registry/ui/ripple-effect";
import type { PreviewProps } from "@/registry/schema";

type RippleVariant = "soft" | "vivid";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["soft", "vivid"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): RippleVariant {
  return (VARIANTS.includes(value) ? value : "soft") as RippleVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function RippleEffectPreview({ material, variant, size }: PreviewProps) {
  return (
    <RippleEffect className="w-[min(380px,100%)]" material={material} size={asSize(size)} variant={asVariant(variant)}>
      <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">Pointer ripple</p>
      <h3 className="m-0 mt-[8px] text-[21px]/[1.12] font-extrabold tracking-[-0.03em]">Press anywhere on the surface</h3>
      <button className="mt-auto w-fit rounded-full border border-white/20 bg-white/10 px-[13px] py-[8px] text-[12px] font-bold text-white outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#a8ff78]" type="button">
        Create ripple
      </button>
    </RippleEffect>
  );
}
