"use client";

import { OrbitingCircles } from "@/registry/ui/orbiting-circles";
import type { PreviewProps } from "@/registry/schema";

type OrbitingCirclesVariant = "clockwise" | "counterclockwise";
type OrbitingCirclesSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["clockwise", "counterclockwise"];
const SIZES: readonly string[] = ["sm", "md", "lg"];
const ORBIT_ITEMS = [
  { label: "Design", mark: "D" },
  { label: "Code", mark: "C" },
  { label: "Motion", mark: "M" },
  { label: "Ship", mark: "S" },
] as const;

function asVariant(value: string): OrbitingCirclesVariant {
  return (VARIANTS.includes(value) ? value : "clockwise") as OrbitingCirclesVariant;
}

function asSize(value: string): OrbitingCirclesSize {
  return (SIZES.includes(value) ? value : "md") as OrbitingCirclesSize;
}

export function OrbitingCirclesPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <OrbitingCircles
      center={
        <>
          <strong className="text-[16px]/none tracking-[-0.025em]">Morphiq</strong>
          <span className="mt-[6px] text-[10px]/[1.2] text-[#bcc2d2]">One shared orbit</span>
        </>
      }
      data-state={state}
      material={material}
      size={asSize(size)}
      speed={state === "loading" ? 1.7 : 1}
      variant={asVariant(variant)}
    >
      {ORBIT_ITEMS.map((item) => (
        <span aria-label={item.label} className="text-[12px]/none font-black" key={item.label}>
          {item.mark}
        </span>
      ))}
    </OrbitingCircles>
  );
}
