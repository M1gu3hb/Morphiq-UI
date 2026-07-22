import { HeroSection } from "@/registry/ui/hero-section";
import type { PreviewProps } from "@/registry/schema";

type HeroVariant = "split" | "centered";
type HeroSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["split", "centered"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): HeroVariant {
  return (VARIANTS.includes(value) ? value : "split") as HeroVariant;
}
function asSize(value: string): HeroSize {
  return (SIZES.includes(value) ? value : "md") as HeroSize;
}

export function HeroSectionPreview({ variant, size, state }: PreviewProps) {
  return (
    <HeroSection
      aria-busy={state === "loading" || undefined}
      aria-disabled={state === "disabled" || undefined}
      className={state === "disabled" ? "pointer-events-none w-full opacity-60" : "w-full"}
      description="A complete responsive hero with deliberate hierarchy and actions."
      eyebrow="Launch surface"
      heading={state === "error" ? "Make the recovery path obvious." : "Build a product people can feel."}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
