import type { PreviewProps } from "@/registry/schema";
import { RollingText } from "@/registry/ui/rolling-text";

type RollingVariant = "together" | "staggered";
type TextSize = "inherit";
const VARIANTS: readonly string[] = ["together", "staggered"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): RollingVariant {
  return (VARIANTS.includes(value) ? value : "staggered") as RollingVariant;
}

function asSize(value: string): TextSize {
  return (SIZES.includes(value) ? value : "inherit") as TextSize;
}

export function RollingTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <RollingText
      className={state === "disabled" ? "text-[clamp(30px,7vw,68px)]/[1] font-black tracking-[-0.06em] text-[#171817] opacity-55 dark:text-[#f1efe9]" : "text-[clamp(30px,7vw,68px)]/[1] font-black tracking-[-0.06em] text-[#171817] dark:text-[#f1efe9]"}
      data-material={material}
      data-size={asSize(size)}
      focusable={state === "focus"}
      variant={asVariant(variant)}
    >
      Roll forward
    </RollingText>
  );
}
