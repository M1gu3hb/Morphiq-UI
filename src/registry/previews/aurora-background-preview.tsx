"use client";

import { AuroraBackground } from "@/registry/ui/aurora-background";
import type { PreviewProps } from "@/registry/schema";

type AuroraBackgroundVariant = "default";
type AuroraBackgroundSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): AuroraBackgroundVariant {
  return (VARIANTS.includes(value) ? value : "default") as AuroraBackgroundVariant;
}

function asSize(value: string): AuroraBackgroundSize {
  return (SIZES.includes(value) ? value : "md") as AuroraBackgroundSize;
}

export function AuroraBackgroundPreview({ material, variant, size }: PreviewProps) {
  return (
    <AuroraBackground
      className="w-[min(420px,100%)]"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <div className="mt-auto">
        <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] uppercase opacity-80">
          Aurora
        </p>
        <h3 className="m-0 mt-[6px] text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">
          Light that drifts behind the words
        </h3>
        <p className="m-0 mt-[8px] max-w-[36ch] text-[13px]/[1.5] opacity-85">
          Soft bands move on their own; the content sits on top and keeps its contrast.
        </p>
      </div>
    </AuroraBackground>
  );
}
