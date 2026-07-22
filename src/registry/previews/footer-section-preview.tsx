import { FooterSection } from "@/registry/ui/footer-section";
import type { PreviewProps } from "@/registry/schema";

type FooterVariant = "light" | "dark";
type FooterSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["light", "dark"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FooterVariant {
  return (VARIANTS.includes(value) ? value : "light") as FooterVariant;
}
function asSize(value: string): FooterSize {
  return (SIZES.includes(value) ? value : "md") as FooterSize;
}

export function FooterSectionPreview({ variant, size, state }: PreviewProps) {
  return (
    <FooterSection
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "pointer-events-none w-full opacity-60" : "w-full"}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
