"use client";

import * as React from "react";
import { AnimatedBeam } from "@/registry/ui/animated-beam";
import type { PreviewProps } from "@/registry/schema";

type AnimatedBeamVariant = "curved" | "straight";
type AnimatedBeamSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["curved", "straight"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): AnimatedBeamVariant {
  return (VARIANTS.includes(value) ? value : "curved") as AnimatedBeamVariant;
}

function asSize(value: string): AnimatedBeamSize {
  return (SIZES.includes(value) ? value : "md") as AnimatedBeamSize;
}

export function AnimatedBeamPreview({ material, variant, size, state }: PreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fromRef = React.useRef<HTMLDivElement>(null);
  const toRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative h-[230px] w-[min(430px,100%)] overflow-hidden rounded-[26px] border border-white/15 bg-[#0e1016] text-[#f4f6ff] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]"
      ref={containerRef}
    >
      <AnimatedBeam
        containerRef={containerRef}
        duration={state === "loading" ? 1.8 : 3.8}
        fromRef={fromRef}
        material={material}
        size={asSize(size)}
        toRef={toRef}
        variant={asVariant(variant)}
      />
      <div
        className="absolute left-[28px] top-[132px] z-10 grid size-[62px] place-items-center rounded-[18px] border border-white/20 bg-[#1c202b] text-[12px]/none font-black shadow-[0_10px_26px_rgba(0,0,0,0.32)] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]"
        ref={fromRef}
      >
        Input
      </div>
      <div
        className="absolute right-[28px] top-[62px] z-10 grid size-[62px] place-items-center rounded-[18px] border border-white/20 bg-[#1c202b] text-[12px]/none font-black shadow-[0_10px_26px_rgba(0,0,0,0.32)] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]"
        ref={toRef}
      >
        Output
      </div>
      <p className="absolute bottom-[18px] left-1/2 z-10 m-0 -translate-x-1/2 whitespace-nowrap text-[11px]/none font-bold tracking-[0.12em] text-[#c8ccd8] uppercase motion-reduce:translate-x-[-50%]">
        Geometry follows both refs
      </p>
    </div>
  );
}
