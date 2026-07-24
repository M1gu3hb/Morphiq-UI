import { ImageTrail } from "@/registry/ui/image-trail";
import type { PreviewProps } from "@/registry/schema";

type TrailVariant = "tiles" | "glow";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["tiles", "glow"];
const SIZES: readonly string[] = ["sm", "md", "lg"];
const IMAGES = [
  "https://picsum.photos/seed/mq-trail-one/160/160",
  "https://picsum.photos/seed/mq-trail-two/160/160",
  "https://picsum.photos/seed/mq-trail-three/160/160",
];

function asVariant(value: string): TrailVariant {
  return (VARIANTS.includes(value) ? value : "tiles") as TrailVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function ImageTrailPreview({ material, size, variant }: PreviewProps) {
  return (
    <ImageTrail className="w-[min(400px,100%)]" images={IMAGES} material={material} size={asSize(size)} variant={asVariant(variant)}>
      <p className="m-0 text-[11px] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">Fine pointer effect</p>
      <h3 className="m-0 mt-[8px] max-w-[270px] text-[23px]/[1.08] font-extrabold tracking-[-0.04em]">Move across the gallery surface</h3>
      <p className="mt-auto mb-0 text-[12px] text-[#c8ccd8]">The native cursor and every child remain usable.</p>
    </ImageTrail>
  );
}
