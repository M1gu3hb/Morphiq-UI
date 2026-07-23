"use client";

import { PulseRing } from "@/registry/ui/pulse-ring";
import type { PreviewProps } from "@/registry/schema";

type PulseVariant = "live" | "recording";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["live", "recording"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): PulseVariant {
  return (VARIANTS.includes(value) ? value : "live") as PulseVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function PulseRingPreview({ material, variant, size }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  return (
    <div className="relative grid w-[min(360px,100%)] place-items-center overflow-hidden rounded-[24px] bg-[#11131a] p-[42px]">
      <PulseRing material={material} size={asSize(size)} statusLabel={resolvedVariant === "live" ? "Live now" : "Recording"} variant={resolvedVariant}>
        <span aria-hidden="true" className="size-[15px] rounded-full bg-[color:var(--mq-ring,#86efac)]" />
      </PulseRing>
    </div>
  );
}
