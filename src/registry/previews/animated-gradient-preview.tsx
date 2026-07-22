"use client";

import { AnimatedGradient } from "@/registry/ui/animated-gradient";
import type { PreviewProps } from "@/registry/schema";

type GradientVariant = "ocean" | "sunset";
type BackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["ocean", "sunset"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): GradientVariant {
  return (VARIANTS.includes(value) ? value : "ocean") as GradientVariant;
}

function asSize(value: string): BackgroundSize {
  return (SIZES.includes(value) ? value : "md") as BackgroundSize;
}

export function AnimatedGradientPreview({ material, variant, size }: PreviewProps) {
  return (
    <AnimatedGradient
      className="w-[min(420px,100%)]"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto max-w-[35ch]">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase text-white/80">Chromatic mesh</p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em] text-white">Colour with a slow current</h3>
        <p className="m-0 mt-[8px] text-[13px]/[1.5] text-white/80">A dark scrim keeps the foreground readable across every gradient position.</p>
      </div>
    </AnimatedGradient>
  );
}
