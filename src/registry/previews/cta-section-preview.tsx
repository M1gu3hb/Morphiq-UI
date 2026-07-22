import { CtaSection } from "@/registry/ui/cta-section";
import type { PreviewProps } from "@/registry/schema";

type CtaVariant = "gradient" | "solid";
type CtaSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["gradient", "solid"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): CtaVariant {
  return (VARIANTS.includes(value) ? value : "gradient") as CtaVariant;
}
function asSize(value: string): CtaSize {
  return (SIZES.includes(value) ? value : "md") as CtaSize;
}

export function CtaSectionPreview({ variant, size, state }: PreviewProps) {
  return (
    <CtaSection
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "pointer-events-none w-full opacity-60" : "w-full"}
      heading={state === "error" ? "Turn a setback into the next clear step." : undefined}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
