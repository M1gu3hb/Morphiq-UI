import type { PreviewProps } from "@/registry/schema";
import { NeonText } from "@/registry/ui/neon-text";

type NeonVariant = "cyan" | "magenta";
type TextSize = "inherit";
const VARIANTS: readonly string[] = ["cyan", "magenta"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): NeonVariant {
  return (VARIANTS.includes(value) ? value : "cyan") as NeonVariant;
}

function asSize(value: string): TextSize {
  return (SIZES.includes(value) ? value : "inherit") as TextSize;
}

export function NeonTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="rounded-[22px] bg-[#070a12] px-7 py-10">
      <NeonText
        className={state === "disabled" ? "text-[clamp(30px,7vw,68px)]/[1] font-black tracking-[-0.055em] text-white opacity-55" : "text-[clamp(30px,7vw,68px)]/[1] font-black tracking-[-0.055em] text-white"}
        data-material={material}
        data-size={asSize(size)}
        variant={asVariant(variant)}
      >
        Open late
      </NeonText>
    </div>
  );
}
