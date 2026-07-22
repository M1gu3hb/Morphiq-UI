"use client";

import { TextScramble } from "@/registry/ui/text-scramble";
import type { PreviewProps } from "@/registry/schema";

type ScrambleVariant = "letters" | "symbols";
type ScrambleSize = "inherit";
const VARIANTS: readonly string[] = ["letters", "symbols"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): ScrambleVariant {
  return (VARIANTS.includes(value) ? value : "letters") as ScrambleVariant;
}
function asSize(value: string): ScrambleSize {
  return (SIZES.includes(value) ? value : "inherit") as ScrambleSize;
}

export function TextScramblePreview({ material, variant, size, state }: PreviewProps) {
  return (
    <TextScramble
      className="text-[clamp(25px,5vw,52px)]/[1.08] font-black tracking-[-0.045em] text-[#171817] dark:text-[#f1efe9]"
      data-material={material}
      data-size={asSize(size)}
      mode={asVariant(variant)}
      play={state !== "disabled"}
    >
      {state === "loading" ? "Resolving signal" : "Decode the future"}
    </TextScramble>
  );
}
