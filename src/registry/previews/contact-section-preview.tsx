import { ContactSection } from "@/registry/ui/contact-section";
import type { PreviewProps } from "@/registry/schema";

type ContactVariant = "split" | "stacked";
type ContactSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["split", "stacked"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ContactVariant {
  return (VARIANTS.includes(value) ? value : "split") as ContactVariant;
}
function asSize(value: string): ContactSize {
  return (SIZES.includes(value) ? value : "md") as ContactSize;
}

export function ContactSectionPreview({ variant, size, state }: PreviewProps) {
  return (
    <ContactSection
      aria-busy={state === "loading" || undefined}
      className="w-full"
      disabled={state === "disabled" || state === "loading"}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
