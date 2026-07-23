import type { PreviewProps } from "@/registry/schema";
import { AnimatedUnderline } from "@/registry/ui/animated-underline";

type UnderlineVariant = "interaction" | "entrance";
type TextSize = "inherit";
const VARIANTS: readonly string[] = ["interaction", "entrance"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): UnderlineVariant {
  return (VARIANTS.includes(value) ? value : "interaction") as UnderlineVariant;
}

function asSize(value: string): TextSize {
  return (SIZES.includes(value) ? value : "inherit") as TextSize;
}

export function AnimatedUnderlinePreview({ material, variant, size, state }: PreviewProps) {
  return (
    <AnimatedUnderline
      className={state === "disabled" ? "text-[clamp(28px,6vw,62px)]/[1.05] font-black tracking-[-0.055em] text-[#171817] opacity-55 dark:text-[#f1efe9]" : "text-[clamp(28px,6vw,62px)]/[1.05] font-black tracking-[-0.055em] text-[#171817] dark:text-[#f1efe9]"}
      color="#7c3aed"
      data-material={material}
      data-size={asSize(size)}
      focusable={state === "focus"}
      variant={asVariant(variant)}
    >
      Follow the line
    </AnimatedUnderline>
  );
}
