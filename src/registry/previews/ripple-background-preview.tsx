"use client";

import { RippleBackground } from "@/registry/ui/ripple-background";
import type { PreviewProps } from "@/registry/schema";

type RippleVariant = "soft" | "bold";
type BackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["soft", "bold"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): RippleVariant {
  return (VARIANTS.includes(value) ? value : "soft") as RippleVariant;
}

function asSize(value: string): BackgroundSize {
  return (SIZES.includes(value) ? value : "md") as BackgroundSize;
}

export function RippleBackgroundPreview({ material, variant, size }: PreviewProps) {
  return (
    <RippleBackground
      className="w-[min(420px,100%)]"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto max-w-[34ch]">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase opacity-70">Signal</p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">Ideas travel outward</h3>
        <p className="m-0 mt-[8px] text-[13px]/[1.5] opacity-75">Concentric rings pulse behind content without changing its layout.</p>
      </div>
    </RippleBackground>
  );
}
