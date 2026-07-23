"use client";

import * as React from "react";
import { Confetti } from "@/registry/ui/confetti";
import type { PreviewProps } from "@/registry/schema";

type ConfettiVariant = "celebration" | "warm";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["celebration", "warm"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ConfettiVariant {
  return (VARIANTS.includes(value) ? value : "celebration") as ConfettiVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function ConfettiPreview({ material, variant, size }: PreviewProps) {
  const [trigger, setTrigger] = React.useState(0);
  return (
    <Confetti className="w-[min(380px,100%)]" material={material} size={asSize(size)} trigger={trigger} variant={asVariant(variant)}>
      <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">Milestone</p>
      <h3 className="m-0 mt-[8px] text-[21px]/[1.12] font-extrabold tracking-[-0.03em]">A bounded celebration</h3>
      <button className="mt-auto w-fit rounded-full border border-white/20 bg-white/10 px-[13px] py-[8px] text-[12px] font-bold text-white outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#a8ff78]" onClick={() => setTrigger((value) => value + 1)} type="button">
        Celebrate again
      </button>
    </Confetti>
  );
}
