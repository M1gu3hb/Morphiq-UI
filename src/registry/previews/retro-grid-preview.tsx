"use client";

import { RetroGrid } from "@/registry/ui/retro-grid";
import type { PreviewProps } from "@/registry/schema";

type RetroGridVariant = "default";
type RetroGridSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): RetroGridVariant {
  return (VARIANTS.includes(value) ? value : "default") as RetroGridVariant;
}

function asSize(value: string): RetroGridSize {
  return (SIZES.includes(value) ? value : "md") as RetroGridSize;
}

export function RetroGridPreview({ material, variant, size }: PreviewProps) {
  return (
    <RetroGrid
      className="w-[min(420px,100%)]"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase opacity-80">
          Retro grid
        </p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">
          A grid that runs to the horizon
        </h3>
        <p className="m-0 mt-[8px] max-w-[36ch] text-[13px]/[1.5] opacity-85">
          The plane scrolls into the distance; the content stays flat and legible.
        </p>
      </div>
    </RetroGrid>
  );
}
