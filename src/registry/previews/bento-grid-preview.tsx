import { BentoGrid } from "@/registry/ui/bento-grid";
import type { PreviewProps } from "@/registry/schema";

type SurfaceMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type BentoVariant = "asymmetric" | "balanced";
type BentoSize = "sm" | "md" | "lg";
const MATERIALS: readonly string[] = ["clay", "glass", "skeuo", "adaptive"];
const VARIANTS: readonly string[] = ["asymmetric", "balanced"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asMaterial(value: string): SurfaceMaterial {
  return (MATERIALS.includes(value) ? value : "adaptive") as SurfaceMaterial;
}
function asVariant(value: string): BentoVariant {
  return (VARIANTS.includes(value) ? value : "asymmetric") as BentoVariant;
}
function asSize(value: string): BentoSize {
  return (SIZES.includes(value) ? value : "md") as BentoSize;
}

export function BentoGridPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <BentoGrid
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "pointer-events-none w-full opacity-60" : "w-full"}
      material={asMaterial(material)}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
