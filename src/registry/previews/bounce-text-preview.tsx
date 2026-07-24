import type { PreviewProps } from "@/registry/schema";
import { BounceText } from "@/registry/ui/bounce-text";

type BounceVariant = "soft" | "elastic";
type TextSize = "inherit";
const VARIANTS: readonly string[] = ["soft", "elastic"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): BounceVariant {
  return (VARIANTS.includes(value) ? value : "soft") as BounceVariant;
}

function asSize(value: string): TextSize {
  return (SIZES.includes(value) ? value : "inherit") as TextSize;
}

export function BounceTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <BounceText
      className={state === "disabled" ? "text-[clamp(30px,7vw,68px)]/[1] font-black tracking-[-0.06em] text-[#171817] opacity-55 dark:text-[#f1efe9]" : "text-[clamp(30px,7vw,68px)]/[1] font-black tracking-[-0.06em] text-[#171817] dark:text-[#f1efe9]"}
      data-material={material}
      data-size={asSize(size)}
      variant={asVariant(variant)}
    >
      Bounce in
    </BounceText>
  );
}
