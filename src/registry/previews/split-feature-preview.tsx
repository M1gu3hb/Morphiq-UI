import { SplitFeature } from "@/registry/ui/split-feature";
import type { PreviewProps } from "@/registry/schema";

type SplitVariant = "alternating" | "stacked";
type SplitSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["alternating", "stacked"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SplitVariant {
  return (VARIANTS.includes(value) ? value : "alternating") as SplitVariant;
}
function asSize(value: string): SplitSize {
  return (SIZES.includes(value) ? value : "md") as SplitSize;
}

export function SplitFeaturePreview({ variant, size, state }: PreviewProps) {
  return (
    <SplitFeature
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "pointer-events-none w-full opacity-60" : "w-full"}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
