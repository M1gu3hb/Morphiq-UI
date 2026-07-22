import { SparklesText } from "@/registry/ui/sparkles-text";
import type { PreviewProps } from "@/registry/schema";

type SparklesVariant = "subtle" | "dense";
type SparklesSize = "inherit";
const VARIANTS: readonly string[] = ["subtle", "dense"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): SparklesVariant {
  return (VARIANTS.includes(value) ? value : "subtle") as SparklesVariant;
}
function asSize(value: string): SparklesSize {
  return (SIZES.includes(value) ? value : "inherit") as SparklesSize;
}

export function SparklesTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <SparklesText
      className={state === "disabled" ? "text-[clamp(26px,5vw,54px)]/[1.08] font-black tracking-[-0.05em] text-[#171817] opacity-60 dark:text-[#f1efe9]" : "text-[clamp(26px,5vw,54px)]/[1.08] font-black tracking-[-0.05em] text-[#171817] dark:text-[#f1efe9]"}
      data-material={material}
      data-size={asSize(size)}
      density={asVariant(variant)}
    >
      Make it remarkable
    </SparklesText>
  );
}
