import { TeamSection } from "@/registry/ui/team-section";
import type { PreviewProps } from "@/registry/schema";

type TeamVariant = "grid" | "compact";
type TeamSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["grid", "compact"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TeamVariant {
  return (VARIANTS.includes(value) ? value : "grid") as TeamVariant;
}
function asSize(value: string): TeamSize {
  return (SIZES.includes(value) ? value : "md") as TeamSize;
}

export function TeamSectionPreview({ variant, size, state }: PreviewProps) {
  return (
    <TeamSection
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "pointer-events-none w-full opacity-60" : "w-full"}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
