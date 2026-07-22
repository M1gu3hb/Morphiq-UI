"use client";

import { Meteors } from "@/registry/ui/meteors";
import type { PreviewProps } from "@/registry/schema";

type MeteorsVariant = "default";
type MeteorsSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): MeteorsVariant {
  return (VARIANTS.includes(value) ? value : "default") as MeteorsVariant;
}

function asSize(value: string): MeteorsSize {
  return (SIZES.includes(value) ? value : "md") as MeteorsSize;
}

export function MeteorsPreview({ material, variant, size }: PreviewProps) {
  return (
    <Meteors
      className="w-[min(420px,100%)]"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase opacity-80">
          Meteors
        </p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">
          Streaks fall across the field
        </h3>
        <p className="m-0 mt-[8px] max-w-[36ch] text-[13px]/[1.5] opacity-85">
          Diagonal meteors drift behind; the content keeps its own contrast on top.
        </p>
      </div>
    </Meteors>
  );
}
