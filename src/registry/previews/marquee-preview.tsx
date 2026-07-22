"use client";

import { Marquee } from "@/registry/ui/marquee";
import type { PreviewProps } from "@/registry/schema";

type MarqueeVariant = "horizontal" | "vertical";
type MarqueeSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["horizontal", "vertical"];
const SIZES: readonly string[] = ["sm", "md", "lg"];
const ITEMS = ["Motion", "Depth", "Rhythm", "Focus", "Clarity"] as const;

function asVariant(value: string): MarqueeVariant {
  return (VARIANTS.includes(value) ? value : "horizontal") as MarqueeVariant;
}

function asSize(value: string): MarqueeSize {
  return (SIZES.includes(value) ? value : "md") as MarqueeSize;
}

export function MarqueePreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);

  return (
    <Marquee
      className={cnPreviewSize(resolvedVariant)}
      data-state={state}
      duration={state === "loading" ? 9 : 18}
      material={material}
      pauseOnHover
      size={asSize(size)}
      variant={resolvedVariant}
    >
      {ITEMS.map((item, index) => (
        <span
          className="shrink-0 rounded-full border border-white/20 bg-white/10 px-[14px] py-[8px] text-[12px]/none font-extrabold tracking-[0.08em] uppercase"
          key={item}
        >
          <span aria-hidden="true" className="mr-[7px] text-[#a8ff78]">
            0{index + 1}
          </span>
          {item}
        </span>
      ))}
    </Marquee>
  );
}

function cnPreviewSize(variant: MarqueeVariant) {
  return variant === "vertical" ? "h-[280px] w-[min(300px,100%)]" : "w-[min(480px,100%)]";
}
