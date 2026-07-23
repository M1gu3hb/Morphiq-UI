import type { PreviewProps } from "@/registry/schema";
import { SplitRevealText } from "@/registry/ui/split-reveal-text";

type SplitRevealVariant = "soft" | "dramatic";
type TextSize = "inherit";
const VARIANTS: readonly string[] = ["soft", "dramatic"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): SplitRevealVariant {
  return (VARIANTS.includes(value) ? value : "soft") as SplitRevealVariant;
}

function asSize(value: string): TextSize {
  return (SIZES.includes(value) ? value : "inherit") as TextSize;
}

export function SplitRevealTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <SplitRevealText
      className={state === "disabled" ? "text-[clamp(28px,7vw,66px)]/[1] font-black tracking-[-0.06em] text-[#171817] opacity-55 dark:text-[#f1efe9]" : "text-[clamp(28px,7vw,66px)]/[1] font-black tracking-[-0.06em] text-[#171817] dark:text-[#f1efe9]"}
      data-material={material}
      data-size={asSize(size)}
      variant={asVariant(variant)}
    >
      Reveal the idea
    </SplitRevealText>
  );
}
