"use client";

import { WordRotate } from "@/registry/ui/word-rotate";
import type { PreviewProps } from "@/registry/schema";

type WordRotateVariant = "vertical";
type WordRotateSize = "inherit";

const VARIANTS: readonly string[] = ["vertical"];
const SIZES: readonly string[] = ["inherit"];
const WORDS = ["tactile", "precise", "alive"] as const;

function asVariant(value: string): WordRotateVariant {
  return (VARIANTS.includes(value) ? value : "vertical") as WordRotateVariant;
}

function asSize(value: string): WordRotateSize {
  return (SIZES.includes(value) ? value : "inherit") as WordRotateSize;
}

export function WordRotatePreview({ material, variant, size, state }: PreviewProps) {
  const words = state === "loading" ? (["thinking", "shaping", "refining"] as const) : WORDS;

  return (
    <p
      className="text-[clamp(28px,4.9vw,52px)]/[1.08] font-black tracking-[-0.045em] text-[#171817] dark:text-[#f1efe9]"
      data-material={material}
      data-size={asSize(size)}
      data-variant={asVariant(variant)}
    >
      Design feels{" "}
      <WordRotate duration={1800} key={state} words={words} />
    </p>
  );
}
