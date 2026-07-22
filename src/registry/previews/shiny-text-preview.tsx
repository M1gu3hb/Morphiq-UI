"use client";

import { ShinyText } from "@/registry/ui/shiny-text";
import type { PreviewProps } from "@/registry/schema";

type ShinyTextVariant = "default";
type ShinyTextSize = "inherit";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): ShinyTextVariant {
  return (VARIANTS.includes(value) ? value : "default") as ShinyTextVariant;
}

function asSize(value: string): ShinyTextSize {
  return (SIZES.includes(value) ? value : "inherit") as ShinyTextSize;
}

export function ShinyTextPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <ShinyText
      className="text-[clamp(28px,5vw,52px)]/[1.05] font-black tracking-[-0.045em] text-[#171817] dark:text-[#f1efe9]"
      data-material={material}
      data-size={asSize(size)}
      data-variant={asVariant(variant)}
    >
      {state === "loading" ? "Polishing…" : "Light finds the type"}
    </ShinyText>
  );
}
