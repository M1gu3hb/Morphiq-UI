import type { PreviewProps } from "@/registry/schema";
import { CircularText } from "@/registry/ui/circular-text";

type CircularVariant = "clockwise" | "counterclockwise";
type TextSize = "inherit";
const VARIANTS: readonly string[] = ["clockwise", "counterclockwise"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): CircularVariant {
  return (VARIANTS.includes(value) ? value : "clockwise") as CircularVariant;
}

function asSize(value: string): TextSize {
  return (SIZES.includes(value) ? value : "inherit") as TextSize;
}

export function CircularTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <CircularText
      className={state === "disabled" ? "text-[15px]/[1] font-extrabold tracking-[0.12em] uppercase text-[#171817] opacity-55 dark:text-[#f1efe9]" : "text-[15px]/[1] font-extrabold tracking-[0.12em] uppercase text-[#171817] dark:text-[#f1efe9]"}
      data-material={material}
      data-size={asSize(size)}
      diameter={190}
      variant={asVariant(variant)}
    >
      Morphiq UI • Motion type •
    </CircularText>
  );
}
