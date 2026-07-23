import type { PreviewProps } from "@/registry/schema";
import { MorphWeightText } from "@/registry/ui/morph-weight-text";

type MorphWeightVariant = "interactive" | "entrance";
type TextSize = "inherit";
const VARIANTS: readonly string[] = ["interactive", "entrance"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): MorphWeightVariant {
  return (VARIANTS.includes(value) ? value : "interactive") as MorphWeightVariant;
}

function asSize(value: string): TextSize {
  return (SIZES.includes(value) ? value : "inherit") as TextSize;
}

export function MorphWeightTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <MorphWeightText
      className={state === "disabled" ? "text-[clamp(30px,7vw,70px)]/[.98] tracking-[-0.065em] text-[#171817] opacity-55 dark:text-[#f1efe9]" : "text-[clamp(30px,7vw,70px)]/[.98] tracking-[-0.065em] text-[#171817] dark:text-[#f1efe9]"}
      data-material={material}
      data-size={asSize(size)}
      focusable={state === "focus"}
      from={360}
      to={850}
      variant={asVariant(variant)}
    >
      Variable voice
    </MorphWeightText>
  );
}
