import { GlareHover } from "@/registry/ui/glare-hover";
import type { PreviewProps } from "@/registry/schema";

type GlareVariant = "silver" | "warm";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["silver", "warm"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): GlareVariant {
  return (VARIANTS.includes(value) ? value : "silver") as GlareVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function GlareHoverPreview({ material, size, variant }: PreviewProps) {
  return (
    <GlareHover className="w-[min(380px,100%)]" material={material} size={asSize(size)} variant={asVariant(variant)}>
      <p className="m-0 text-[11px] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">Hover or focus</p>
      <h3 className="m-0 mt-[8px] text-[23px]/[1.08] font-extrabold tracking-[-0.04em]">A crisp diagonal reflection</h3>
      <button className="mt-auto w-fit rounded-full border border-white/20 bg-white/10 px-[14px] py-[8px] text-[12px] font-bold text-white outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#a8ff78]" type="button">
        Focus the surface
      </button>
    </GlareHover>
  );
}
