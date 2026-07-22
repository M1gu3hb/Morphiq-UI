import { StatsSection } from "@/registry/ui/stats-section";
import type { PreviewProps } from "@/registry/schema";

type StatsVariant = "cards" | "band";
type StatsSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["cards", "band"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): StatsVariant {
  return (VARIANTS.includes(value) ? value : "cards") as StatsVariant;
}
function asSize(value: string): StatsSize {
  return (SIZES.includes(value) ? value : "md") as StatsSize;
}

export function StatsSectionPreview({ variant, size, state }: PreviewProps) {
  return (
    <StatsSection
      animate={state !== "disabled"}
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "w-full opacity-60" : "w-full"}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
