"use client";

import * as React from "react";
import { AnimatedList, type AnimatedListItem } from "@/registry/ui/animated-list";
import type { PreviewProps } from "@/registry/schema";

type ListVariant = "slide" | "fade";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["slide", "fade"];
const SIZES: readonly string[] = ["sm", "md", "lg"];
const ITEMS: readonly AnimatedListItem[] = [
  { id: "sync", content: <><strong className="block text-[13px]">Design synced</strong><span className="text-[12px] text-[#c8ccd8]">Components are ready to review.</span></> },
  { id: "build", content: <><strong className="block text-[13px]">Build completed</strong><span className="text-[12px] text-[#c8ccd8]">All static routes generated.</span></> },
  { id: "deploy", content: <><strong className="block text-[13px]">Production ready</strong><span className="text-[12px] text-[#c8ccd8]">No focus or reading order changes.</span></> },
];

function asVariant(value: string): ListVariant {
  return (VARIANTS.includes(value) ? value : "slide") as ListVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function AnimatedListPreview({ material, variant, size }: PreviewProps) {
  const [animationKey, setAnimationKey] = React.useState(0);
  return (
    <div className="relative w-[min(380px,100%)] overflow-hidden">
      <button className="mb-[9px] rounded-full border border-[#313644] bg-[#11131a] px-[12px] py-[7px] text-[12px] font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#a8ff78]" onClick={() => setAnimationKey((value) => value + 1)} type="button">
        Replay sequence
      </button>
      <AnimatedList animationKey={animationKey} aria-label="Recent activity" items={ITEMS} material={material} size={asSize(size)} variant={asVariant(variant)} />
    </div>
  );
}
