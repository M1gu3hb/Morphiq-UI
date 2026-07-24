import type { PreviewProps } from "@/registry/schema";
import { WaveText } from "@/registry/ui/wave-text";

type WaveVariant = "gentle" | "tidal";
type TextSize = "inherit";
const VARIANTS: readonly string[] = ["gentle", "tidal"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): WaveVariant {
  return (VARIANTS.includes(value) ? value : "gentle") as WaveVariant;
}

function asSize(value: string): TextSize {
  return (SIZES.includes(value) ? value : "inherit") as TextSize;
}

export function WaveTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <WaveText
      className={state === "disabled" ? "text-[clamp(30px,7vw,68px)]/[1] font-black tracking-[-0.055em] text-[#171817] opacity-55 dark:text-[#f1efe9]" : "text-[clamp(30px,7vw,68px)]/[1] font-black tracking-[-0.055em] text-[#171817] dark:text-[#f1efe9]"}
      data-material={material}
      data-size={asSize(size)}
      variant={asVariant(variant)}
    >
      Make waves
    </WaveText>
  );
}
