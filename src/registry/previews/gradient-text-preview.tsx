"use client";

import { GradientText } from "@/registry/ui/gradient-text";
import type { PreviewProps } from "@/registry/schema";

type GradientTextVariant = "default";
type GradientTextSize = "inherit";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): GradientTextVariant {
  return (VARIANTS.includes(value) ? value : "default") as GradientTextVariant;
}

function asSize(value: string): GradientTextSize {
  return (SIZES.includes(value) ? value : "inherit") as GradientTextSize;
}

export function GradientTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <GradientText
      className="text-[clamp(28px,5vw,52px)]/[1.05] font-black tracking-[-0.045em] text-[#171817] dark:text-[#f1efe9]"
      data-material={material}
      data-size={asSize(size)}
      data-variant={asVariant(variant)}
    >
      {state === "loading" ? "Mixing color…" : "Color in motion"}
    </GradientText>
  );
}
