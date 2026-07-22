"use client";

import { TypewriterText } from "@/registry/ui/typewriter-text";
import type { PreviewProps } from "@/registry/schema";

type TypewriterTextVariant = "loop" | "once";
type TypewriterTextSize = "inherit";

const VARIANTS: readonly string[] = ["loop", "once"];
const SIZES: readonly string[] = ["inherit"];
const PHRASES = ["Build with rhythm", "Ship with clarity", "Own every detail"] as const;

function asVariant(value: string): TypewriterTextVariant {
  return (VARIANTS.includes(value) ? value : "loop") as TypewriterTextVariant;
}

function asSize(value: string): TypewriterTextSize {
  return (SIZES.includes(value) ? value : "inherit") as TypewriterTextSize;
}

export function TypewriterTextPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const phrases = state === "loading" ? (["Preparing the next line…"] as const) : PHRASES;

  return (
    <TypewriterText
      className="text-[clamp(25px,4.5vw,46px)]/[1.08] font-black tracking-[-0.04em] text-[#171817] dark:text-[#f1efe9]"
      data-material={material}
      data-size={asSize(size)}
      loop={resolvedVariant === "loop"}
      phrases={phrases}
    />
  );
}
