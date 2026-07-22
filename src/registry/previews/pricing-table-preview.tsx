import { PricingTable } from "@/registry/ui/pricing-table";
import type { PreviewProps } from "@/registry/schema";

type PricingVariant = "standard" | "quiet";
type PricingSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["standard", "quiet"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): PricingVariant {
  return (VARIANTS.includes(value) ? value : "standard") as PricingVariant;
}
function asSize(value: string): PricingSize {
  return (SIZES.includes(value) ? value : "md") as PricingSize;
}

export function PricingTablePreview({ variant, size, state }: PreviewProps) {
  return (
    <PricingTable
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "pointer-events-none w-full opacity-60" : "w-full"}
      defaultPeriod={state === "loading" ? "annual" : "monthly"}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
