"use client";

import { GlowEffect } from "@/registry/ui/glow-effect";
import type { PreviewProps } from "@/registry/schema";

type GlowEffectVariant = "follow" | "pulse";
type GlowEffectSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["follow", "pulse"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): GlowEffectVariant {
  return (VARIANTS.includes(value) ? value : "follow") as GlowEffectVariant;
}

function asSize(value: string): GlowEffectSize {
  return (SIZES.includes(value) ? value : "md") as GlowEffectSize;
}

export function GlowEffectPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);

  return (
    <GlowEffect
      className="w-[min(370px,calc(100%_-_30px))]"
      data-state={state}
      glowColor={resolvedVariant === "pulse" ? "rgba(167,139,250,0.88)" : undefined}
      material={material}
      size={asSize(size)}
      variant={resolvedVariant}
    >
      <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">
        Responsive glow
      </p>
      <h3 className="m-0 mt-[9px] text-[22px]/[1.12] font-extrabold tracking-[-0.035em]">
        {resolvedVariant === "follow" ? "Move through the light" : "A calm pulse behind the card"}
      </h3>
      <p className="m-0 mt-[10px] max-w-[36ch] text-[13px]/[1.5] text-[#c8ccd8]">
        The color lives behind this opaque panel, so the message always remains legible.
      </p>
    </GlowEffect>
  );
}
