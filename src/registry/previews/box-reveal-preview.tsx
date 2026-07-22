"use client";

import { BoxReveal } from "@/registry/ui/box-reveal";
import type { PreviewProps } from "@/registry/schema";

type BoxRevealVariant = "left" | "right";
type BoxRevealSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["left", "right"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): BoxRevealVariant {
  return (VARIANTS.includes(value) ? value : "left") as BoxRevealVariant;
}

function asSize(value: string): BoxRevealSize {
  return (SIZES.includes(value) ? value : "md") as BoxRevealSize;
}

export function BoxRevealPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);

  return (
    <BoxReveal
      className="w-[min(390px,100%)]"
      data-state={state}
      duration={state === "loading" ? 2.1 : 1.25}
      key={`${resolvedVariant}-${state}`}
      material={material}
      revealColor={resolvedVariant === "right" ? "#9ee9ff" : "#a8ff78"}
      size={asSize(size)}
      variant={resolvedVariant}
    >
      <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">
        Box reveal
      </p>
      <h3 className="m-0 mt-[9px] text-[22px]/[1.12] font-extrabold tracking-[-0.035em]">
        The message arrives after the sweep
      </h3>
      <p className="m-0 mt-[10px] max-w-[36ch] text-[13px]/[1.5] text-[#c8ccd8]">
        The color block leaves completely; this semantic content never moves in the DOM.
      </p>
    </BoxReveal>
  );
}
