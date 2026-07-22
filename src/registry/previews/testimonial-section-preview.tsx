import { TestimonialSection } from "@/registry/ui/testimonial-section";
import type { PreviewProps } from "@/registry/schema";

type TestimonialVariant = "grid" | "spotlight";
type TestimonialSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["grid", "spotlight"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TestimonialVariant {
  return (VARIANTS.includes(value) ? value : "grid") as TestimonialVariant;
}
function asSize(value: string): TestimonialSize {
  return (SIZES.includes(value) ? value : "md") as TestimonialSize;
}

export function TestimonialSectionPreview({ variant, size, state }: PreviewProps) {
  return (
    <TestimonialSection
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "w-full opacity-60" : "w-full"}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
