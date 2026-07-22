import { InfiniteSlider, type InfiniteSliderItem } from "@/registry/ui/infinite-slider";
import type { PreviewProps } from "@/registry/schema";

type InfiniteSliderVariant = "left" | "right";
type InfiniteSliderSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["left", "right"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const ITEMS: readonly InfiniteSliderItem[] = ["Northstar", "Cinder", "Forma", "Arc", "Lumen"].map(
  (label, index) => ({
    id: label.toLowerCase(),
    content: (
      <span className="inline-flex items-center gap-[9px] rounded-full border border-[#444956] bg-[#1b1e27] px-[16px] py-[10px] text-[12px]/none font-extrabold tracking-[0.06em] text-[#f5f7ff] uppercase forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">
        <span aria-hidden="true" className="size-[8px] rounded-full bg-[#8ee7ff] forced-colors:bg-[Highlight]" />
        {label}
        <span aria-hidden="true" className="font-mono text-[#aeb5c4]">
          0{index + 1}
        </span>
      </span>
    ),
  }),
);

function asVariant(value: string): InfiniteSliderVariant {
  return (VARIANTS.includes(value) ? value : "left") as InfiniteSliderVariant;
}

function asSize(value: string): InfiniteSliderSize {
  return (SIZES.includes(value) ? value : "md") as InfiniteSliderSize;
}

export function InfiniteSliderPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <InfiniteSlider
      className="w-[min(560px,100%)]"
      duration={state === "loading" ? 9 : 20}
      items={ITEMS}
      material={material === "adaptive" ? material : "adaptive"}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
