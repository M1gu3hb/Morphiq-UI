"use client";

import { WavyBackground } from "@/registry/ui/wavy-background";
import type { PreviewProps } from "@/registry/schema";

type WavyVariant = "calm" | "vivid";
type BackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["calm", "vivid"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): WavyVariant {
  return (VARIANTS.includes(value) ? value : "calm") as WavyVariant;
}

function asSize(value: string): BackgroundSize {
  return (SIZES.includes(value) ? value : "md") as BackgroundSize;
}

export function WavyBackgroundPreview({ material, variant, size }: PreviewProps) {
  return (
    <WavyBackground
      className="w-[min(420px,100%)]"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto max-w-[34ch] rounded-[14px] bg-[#04111d]/80 p-[14px] text-white">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase text-white/75">Flow field</p>
        <h3 className="m-0 mt-[6px] text-[21px]/[1.12] font-extrabold tracking-[-0.03em]">Layers that move like water</h3>
        <p className="m-0 mt-[7px] text-[13px]/[1.5] text-white/80">Three SVG curves drift slowly behind a stable content surface.</p>
      </div>
    </WavyBackground>
  );
}
