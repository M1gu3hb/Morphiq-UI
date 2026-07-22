import { AuroraText } from "@/registry/ui/aurora-text";
import type { PreviewProps } from "@/registry/schema";

type AuroraVariant = "ocean" | "sunset";
type AuroraSize = "inherit";
const VARIANTS: readonly string[] = ["ocean", "sunset"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): AuroraVariant {
  return (VARIANTS.includes(value) ? value : "ocean") as AuroraVariant;
}
function asSize(value: string): AuroraSize {
  return (SIZES.includes(value) ? value : "inherit") as AuroraSize;
}

export function AuroraTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <AuroraText
      className={state === "disabled" ? "text-[clamp(28px,6vw,62px)]/[1] font-black tracking-[-0.06em] text-[#171817] opacity-60 dark:text-[#f1efe9]" : "text-[clamp(28px,6vw,62px)]/[1] font-black tracking-[-0.06em] text-[#171817] dark:text-[#f1efe9]"}
      data-material={material}
      data-size={asSize(size)}
      variant={asVariant(variant)}
    >
      Aurora signal
    </AuroraText>
  );
}
