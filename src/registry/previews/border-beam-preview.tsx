"use client";

import { BorderBeam } from "@/registry/ui/border-beam";
import type { PreviewProps } from "@/registry/schema";

type BorderBeamVariant = "forward" | "reverse";
type BorderBeamSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["forward", "reverse"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): BorderBeamVariant {
  return (VARIANTS.includes(value) ? value : "forward") as BorderBeamVariant;
}

function asSize(value: string): BorderBeamSize {
  return (SIZES.includes(value) ? value : "md") as BorderBeamSize;
}

export function BorderBeamPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <BorderBeam
      className="w-[min(380px,100%)]"
      data-state={state}
      duration={state === "loading" ? 2.6 : 6}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">
        Live boundary
      </p>
      <h3 className="m-0 mt-[9px] text-[22px]/[1.12] font-extrabold tracking-[-0.035em]">
        Light follows the perimeter
      </h3>
      <p className="m-0 mt-[10px] max-w-[36ch] text-[13px]/[1.5] text-[#c8ccd8]">
        The beam travels only through the masked border; this copy stays on an opaque surface.
      </p>
    </BorderBeam>
  );
}
