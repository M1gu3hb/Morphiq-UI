"use client";

import { Particles } from "@/registry/ui/particles";
import type { PreviewProps } from "@/registry/schema";

type ParticlesVariant = "soft" | "bright";
type BackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["soft", "bright"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ParticlesVariant {
  return (VARIANTS.includes(value) ? value : "soft") as ParticlesVariant;
}

function asSize(value: string): BackgroundSize {
  return (SIZES.includes(value) ? value : "md") as BackgroundSize;
}

export function ParticlesPreview({ material, variant, size }: PreviewProps) {
  return (
    <Particles
      className="w-[min(420px,100%)]"
      count={22}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto max-w-[34ch] rounded-[14px] bg-[#070b14]/80 p-[14px] text-white">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase text-white/75">Particle field</p>
        <h3 className="m-0 mt-[6px] text-[21px]/[1.12] font-extrabold tracking-[-0.03em]">A small constellation in motion</h3>
        <p className="m-0 mt-[7px] text-[13px]/[1.5] text-white/80">The field is deterministic, configurable and capped at forty nodes.</p>
      </div>
    </Particles>
  );
}
