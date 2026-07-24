import { ParallaxScroll, type ParallaxScrollLayer } from "@/registry/ui/parallax-scroll";
import type { PreviewProps } from "@/registry/schema";

type ParallaxVariant = "depth" | "drift";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["depth", "drift"];
const SIZES: readonly string[] = ["sm", "md", "lg"];
const LAYERS: readonly ParallaxScrollLayer[] = [
  {
    id: "sky",
    speed: -18,
    className: "bg-[radial-gradient(circle_at_70%_20%,rgba(78,180,255,.38),transparent_34%),linear-gradient(145deg,#111827,#17223b)] forced-colors:bg-[Canvas]",
    content: null,
  },
  {
    id: "orb",
    speed: 22,
    className: "grid place-items-center",
    content: <span aria-hidden="true" className="size-[116px] rounded-full bg-[linear-gradient(145deg,#a8ff78,#4f9cff)] opacity-70 blur-[1px] forced-colors:hidden" />,
  },
  {
    id: "copy",
    speed: 8,
    className: "flex flex-col justify-end p-[22px]",
    content: <><p className="m-0 text-[11px] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">Scroll-linked layers</p><h3 className="m-0 mt-[7px] max-w-[270px] text-[23px]/[1.08] font-extrabold tracking-[-0.04em]">Depth without hiding the story</h3></>,
  },
];

function asVariant(value: string): ParallaxVariant {
  return (VARIANTS.includes(value) ? value : "depth") as ParallaxVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function ParallaxScrollPreview({ material, size, variant }: PreviewProps) {
  return (
    <ParallaxScroll className="w-[min(410px,100%)]" layers={LAYERS} material={material} size={asSize(size)} variant={asVariant(variant)} />
  );
}
