import { BlurInText } from "@/registry/ui/blur-in-text";
import type { PreviewProps } from "@/registry/schema";

type BlurVariant = "soft" | "dramatic";
type BlurSize = "inherit";
const VARIANTS: readonly string[] = ["soft", "dramatic"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): BlurVariant {
  return (VARIANTS.includes(value) ? value : "soft") as BlurVariant;
}
function asSize(value: string): BlurSize {
  return (SIZES.includes(value) ? value : "inherit") as BlurSize;
}

export function BlurInTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <BlurInText
      className="text-[clamp(26px,5vw,54px)]/[1.08] font-black tracking-[-0.05em] text-[#171817] dark:text-[#f1efe9]"
      data-material={material}
      data-size={asSize(size)}
      enabled={state !== "disabled"}
      intensity={asVariant(variant)}
    >
      Clarity comes into focus
    </BlurInText>
  );
}
