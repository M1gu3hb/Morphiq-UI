import { FeatureTabs } from "@/registry/ui/feature-tabs";
import type { PreviewProps } from "@/registry/schema";

type TabsVariant = "pills" | "underline";
type TabsSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["pills", "underline"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TabsVariant {
  return (VARIANTS.includes(value) ? value : "pills") as TabsVariant;
}
function asSize(value: string): TabsSize {
  return (SIZES.includes(value) ? value : "md") as TabsSize;
}

export function FeatureTabsPreview({ variant, size, state }: PreviewProps) {
  return (
    <FeatureTabs
      aria-busy={state === "loading" || undefined}
      className="w-full"
      disabled={state === "disabled"}
      size={asSize(size)}
      value={state === "error" ? "protect" : undefined}
      variant={asVariant(variant)}
    />
  );
}
