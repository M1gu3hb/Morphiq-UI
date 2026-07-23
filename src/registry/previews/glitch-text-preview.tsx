import type { PreviewProps } from "@/registry/schema";
import { GlitchText } from "@/registry/ui/glitch-text";

type GlitchVariant = "signal" | "burst";
type TextSize = "inherit";
const VARIANTS: readonly string[] = ["signal", "burst"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): GlitchVariant {
  return (VARIANTS.includes(value) ? value : "signal") as GlitchVariant;
}

function asSize(value: string): TextSize {
  return (SIZES.includes(value) ? value : "inherit") as TextSize;
}

export function GlitchTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <GlitchText
      className={state === "disabled" ? "text-[clamp(30px,7vw,68px)]/[1] font-black tracking-[-0.06em] text-[#171817] opacity-55 dark:text-[#f1efe9]" : "text-[clamp(30px,7vw,68px)]/[1] font-black tracking-[-0.06em] text-[#171817] dark:text-[#f1efe9]"}
      data-material={material}
      data-size={asSize(size)}
      variant={asVariant(variant)}
    >
      Signal lost
    </GlitchText>
  );
}
