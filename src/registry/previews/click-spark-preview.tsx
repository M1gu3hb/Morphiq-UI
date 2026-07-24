import { ClickSpark } from "@/registry/ui/click-spark";
import type { PreviewProps } from "@/registry/schema";

type SparkVariant = "star" | "ember";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["star", "ember"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SparkVariant {
  return (VARIANTS.includes(value) ? value : "star") as SparkVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function ClickSparkPreview({ material, size, variant }: PreviewProps) {
  return (
    <ClickSpark className="w-[min(380px,100%)]" material={material} size={asSize(size)} variant={asVariant(variant)}>
      <p className="m-0 text-[11px] font-extrabold tracking-[0.14em] text-[#9df8cf] uppercase">Pointer celebration</p>
      <h3 className="m-0 mt-[8px] text-[22px]/[1.1] font-extrabold tracking-[-0.03em]">Click anywhere</h3>
      <button className="mt-auto w-fit rounded-full border border-white/20 bg-white/10 px-[14px] py-[8px] text-[12px] font-bold text-white outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#9df8cf]" type="button">
        Launch spark
      </button>
    </ClickSpark>
  );
}
