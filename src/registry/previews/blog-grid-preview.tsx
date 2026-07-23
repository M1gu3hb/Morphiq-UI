import { BlogGrid } from "@/registry/ui/blog-grid";
import type { PreviewProps } from "@/registry/schema";

type SurfaceMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type BlogVariant = "editorial" | "compact";
type BlogSize = "sm" | "md" | "lg";
const MATERIALS: readonly string[] = ["clay", "glass", "skeuo", "adaptive"];
const VARIANTS: readonly string[] = ["editorial", "compact"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asMaterial(value: string): SurfaceMaterial {
  return (MATERIALS.includes(value) ? value : "adaptive") as SurfaceMaterial;
}
function asVariant(value: string): BlogVariant {
  return (VARIANTS.includes(value) ? value : "editorial") as BlogVariant;
}
function asSize(value: string): BlogSize {
  return (SIZES.includes(value) ? value : "md") as BlogSize;
}

export function BlogGridPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <BlogGrid
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "pointer-events-none w-full opacity-60" : "w-full"}
      material={asMaterial(material)}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
