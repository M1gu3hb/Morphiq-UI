"use client";

import { TextReveal } from "@/registry/ui/text-reveal";
import type { PreviewProps } from "@/registry/schema";

type TextRevealVariant = "words" | "letters";
type TextRevealSize = "inherit";

const VARIANTS: readonly string[] = ["words", "letters"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): TextRevealVariant {
  return (VARIANTS.includes(value) ? value : "words") as TextRevealVariant;
}

function asSize(value: string): TextRevealSize {
  return (SIZES.includes(value) ? value : "inherit") as TextRevealSize;
}

export function TextRevealPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const copy = state === "loading" ? "Preparing every entrance" : "Make every word arrive with purpose";

  return (
    <TextReveal
      by={resolvedVariant === "letters" ? "letter" : "word"}
      className="max-w-[720px] text-[clamp(27px,4.8vw,50px)]/[1.08] font-black tracking-[-0.045em] text-[#171817] dark:text-[#f1efe9]"
      data-material={material}
      data-size={asSize(size)}
      key={`${resolvedVariant}-${state}`}
    >
      {copy}
    </TextReveal>
  );
}
