import { FeatureGrid } from "@/registry/ui/feature-grid";
import type { PreviewProps } from "@/registry/schema";

type FeatureVariant = "bento" | "equal";
type FeatureSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["bento", "equal"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FeatureVariant {
  return (VARIANTS.includes(value) ? value : "bento") as FeatureVariant;
}
function asSize(value: string): FeatureSize {
  return (SIZES.includes(value) ? value : "md") as FeatureSize;
}

export function FeatureGridPreview({ variant, size, state }: PreviewProps) {
  return (
    <FeatureGrid
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "w-full opacity-60" : "w-full"}
      heading={state === "error" ? "Resilient by design" : undefined}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
