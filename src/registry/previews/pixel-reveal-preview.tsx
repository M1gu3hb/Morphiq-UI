"use client";

import * as React from "react";
import { PixelReveal } from "@/registry/ui/pixel-reveal";
import type { PreviewProps } from "@/registry/schema";

type PixelVariant = "mosaic" | "luminous";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["mosaic", "luminous"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): PixelVariant {
  return (VARIANTS.includes(value) ? value : "mosaic") as PixelVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function PixelRevealPreview({ material, size, variant }: PreviewProps) {
  const [replayKey, setReplayKey] = React.useState(0);
  return (
    <div className="w-[min(410px,100%)]">
      <button className="mb-[9px] rounded-full border border-[#313644] bg-[#11131a] px-[12px] py-[7px] text-[12px] font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#a8ff78]" onClick={() => setReplayKey((value) => value + 1)} type="button">
        Replay reveal
      </button>
      <PixelReveal
        alt="Green hills beneath a misty sky"
        caption="Accessible image, decorative pixels"
        material={material}
        replayKey={replayKey}
        size={asSize(size)}
        src="https://picsum.photos/seed/mq-pixel-reveal/900/620"
        variant={asVariant(variant)}
      />
    </div>
  );
}
