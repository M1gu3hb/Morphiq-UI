import { LetterSwap } from "@/registry/ui/letter-swap";
import type { PreviewProps } from "@/registry/schema";

type LetterSwapVariant = "smooth" | "staggered";
type LetterSwapSize = "inherit";
const VARIANTS: readonly string[] = ["smooth", "staggered"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): LetterSwapVariant {
  return (VARIANTS.includes(value) ? value : "staggered") as LetterSwapVariant;
}
function asSize(value: string): LetterSwapSize {
  return (SIZES.includes(value) ? value : "inherit") as LetterSwapSize;
}

export function LetterSwapPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <LetterSwap
      className="text-[clamp(28px,6vw,60px)]/[1] font-black tracking-[-0.055em] text-[#171817] dark:text-[#f1efe9]"
      data-material={material}
      data-size={asSize(size)}
      focusable={state === "focus"}
      variant={asVariant(variant)}
    >
      Rollover
    </LetterSwap>
  );
}
