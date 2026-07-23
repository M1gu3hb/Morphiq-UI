import { FaqSection } from "@/registry/ui/faq-section";
import type { PreviewProps } from "@/registry/schema";

type FaqVariant = "cards" | "divided";
type FaqSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["cards", "divided"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FaqVariant {
  return (VARIANTS.includes(value) ? value : "cards") as FaqVariant;
}
function asSize(value: string): FaqSize {
  return (SIZES.includes(value) ? value : "md") as FaqSize;
}

export function FaqSectionPreview({ variant, size, state }: PreviewProps) {
  return (
    <FaqSection
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "pointer-events-none w-full opacity-60" : "w-full"}
      defaultOpenIds={state === "error" ? [] : ["ownership"]}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
