import { HowItWorks } from "@/registry/ui/how-it-works";
import type { PreviewProps } from "@/registry/schema";

type HowVariant = "horizontal" | "vertical";
type HowSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["horizontal", "vertical"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): HowVariant {
  return (VARIANTS.includes(value) ? value : "horizontal") as HowVariant;
}
function asSize(value: string): HowSize {
  return (SIZES.includes(value) ? value : "md") as HowSize;
}

export function HowItWorksPreview({ variant, size, state }: PreviewProps) {
  return (
    <HowItWorks
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "pointer-events-none w-full opacity-60" : "w-full"}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
