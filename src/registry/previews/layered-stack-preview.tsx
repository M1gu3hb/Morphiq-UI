"use client";

import { LayeredStack, type LayeredStackItem } from "@/registry/ui/layered-stack";
import type { PreviewProps } from "@/registry/schema";

type LayeredStackVariant = "swipe" | "button";
type LayeredStackSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["swipe", "button"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const ITEMS: readonly LayeredStackItem[] = [
  { id: "signal", title: "Signal", description: "Drag this card sideways or use its named Next card button." },
  { id: "texture", title: "Texture", description: "The next layer rises on a spring while source order remains explicit." },
  { id: "rhythm", title: "Rhythm", description: "Reduced motion keeps the same sequence with immediate state changes." },
];

function asVariant(value: string): LayeredStackVariant {
  return (VARIANTS.includes(value) ? value : "swipe") as LayeredStackVariant;
}

function asSize(value: string): LayeredStackSize {
  return (SIZES.includes(value) ? value : "md") as LayeredStackSize;
}

export function LayeredStackPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <LayeredStack
      className="w-[min(560px,100%)]"
      data-focus={state === "focus" ? "true" : undefined}
      items={ITEMS}
      material={material === "adaptive" ? material : "adaptive"}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
