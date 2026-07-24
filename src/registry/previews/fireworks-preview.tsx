import { Fireworks } from "@/registry/ui/fireworks";
import type { PreviewProps } from "@/registry/schema";

type FireworksVariant = "festival" | "sunset";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["festival", "sunset"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FireworksVariant {
  return (VARIANTS.includes(value) ? value : "festival") as FireworksVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function FireworksPreview({ material, size, variant }: PreviewProps) {
  return (
    <Fireworks className="w-[min(410px,100%)]" material={material} size={asSize(size)} variant={asVariant(variant)}>
      <p className="m-0 text-[11px] font-extrabold tracking-[0.14em] text-[#f4d06f] uppercase">Milestone reached</p>
      <h3 className="m-0 mt-[7px] text-[26px]/[1.05] font-extrabold tracking-[-0.04em]">Celebrate the launch</h3>
      <p className="m-0 mt-[8px] text-[12px] text-[#c8ccd8]">The announcement stays readable without motion.</p>
    </Fireworks>
  );
}
