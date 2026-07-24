import { BlobCursor } from "@/registry/ui/blob-cursor";
import type { PreviewProps } from "@/registry/schema";

type BlobVariant = "aqua" | "plasma";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["aqua", "plasma"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): BlobVariant {
  return (VARIANTS.includes(value) ? value : "aqua") as BlobVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function BlobCursorPreview({ material, size, variant }: PreviewProps) {
  return (
    <BlobCursor className="w-[min(400px,100%)]" material={material} size={asSize(size)} variant={asVariant(variant)}>
      <p className="m-0 text-[11px] font-extrabold tracking-[0.14em] text-[#9df8cf] uppercase">Gooey pointer field</p>
      <h3 className="m-0 mt-[8px] max-w-[280px] text-[23px]/[1.08] font-extrabold tracking-[-0.04em]">A soft blob follows without replacing your cursor</h3>
      <button className="mt-auto w-fit rounded-full border border-white/20 bg-black/25 px-[14px] py-[8px] text-[12px] font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#9df8cf]" type="button">
        Focus stays native
      </button>
    </BlobCursor>
  );
}
