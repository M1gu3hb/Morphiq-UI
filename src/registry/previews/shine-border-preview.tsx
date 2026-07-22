"use client";

import { ShineBorder } from "@/registry/ui/shine-border";
import type { PreviewProps } from "@/registry/schema";

type ShineBorderVariant = "spectrum";
type ShineBorderSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["spectrum"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ShineBorderVariant {
  return (VARIANTS.includes(value) ? value : "spectrum") as ShineBorderVariant;
}

function asSize(value: string): ShineBorderSize {
  return (SIZES.includes(value) ? value : "md") as ShineBorderSize;
}

export function ShineBorderPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <ShineBorder
      className="w-[min(380px,100%)]"
      data-state={state}
      duration={state === "loading" ? 3 : 8}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] text-[#9ee9ff] uppercase">
        Spectrum frame
      </p>
      <h3 className="m-0 mt-[9px] text-[22px]/[1.12] font-extrabold tracking-[-0.035em]">
        A continuous edge of color
      </h3>
      <p className="m-0 mt-[10px] max-w-[36ch] text-[13px]/[1.5] text-[#c8ccd8]">
        The masked conic gradient turns around a solid surface, never through the content.
      </p>
    </ShineBorder>
  );
}
