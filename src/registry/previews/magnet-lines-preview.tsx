import { MagnetLines } from "@/registry/ui/magnet-lines";
import type { PreviewProps } from "@/registry/schema";

type LinesVariant = "field" | "compass";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["field", "compass"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): LinesVariant {
  return (VARIANTS.includes(value) ? value : "field") as LinesVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function MagnetLinesPreview({ material, size, variant }: PreviewProps) {
  return (
    <MagnetLines className="w-[min(400px,100%)]" material={material} size={asSize(size)} variant={asVariant(variant)}>
      <div className="rounded-[16px] border border-white/15 bg-black/60 p-[14px] backdrop-blur-[6px]">
        <p className="m-0 text-[11px] font-extrabold tracking-[0.14em] text-[#f4d06f] uppercase">Directional field</p>
        <h3 className="m-0 mt-[7px] text-[21px]/[1.1] font-extrabold tracking-[-0.03em]">Every line points to you</h3>
      </div>
    </MagnetLines>
  );
}
