import { NewsletterSignup } from "@/registry/ui/newsletter-signup";
import type { PreviewProps } from "@/registry/schema";

type SurfaceMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type NewsletterVariant = "stacked" | "inline";
type NewsletterSize = "sm" | "md" | "lg";
const MATERIALS: readonly string[] = ["clay", "glass", "skeuo", "adaptive"];
const VARIANTS: readonly string[] = ["stacked", "inline"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asMaterial(value: string): SurfaceMaterial {
  return (MATERIALS.includes(value) ? value : "adaptive") as SurfaceMaterial;
}
function asVariant(value: string): NewsletterVariant {
  return (VARIANTS.includes(value) ? value : "stacked") as NewsletterVariant;
}
function asSize(value: string): NewsletterSize {
  return (SIZES.includes(value) ? value : "md") as NewsletterSize;
}

export function NewsletterSignupPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <NewsletterSignup
      className="w-full"
      disabled={state === "disabled"}
      material={asMaterial(material)}
      size={asSize(size)}
      status={state === "loading" ? "sending" : state === "error" ? "error" : "idle"}
      variant={asVariant(variant)}
    />
  );
}
