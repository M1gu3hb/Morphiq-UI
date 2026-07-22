import { TextHighlight } from "@/registry/ui/text-highlight";
import type { PreviewProps } from "@/registry/schema";

type HighlightVariant = "marker" | "underline";
type HighlightSize = "inherit";
const VARIANTS: readonly string[] = ["marker", "underline"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): HighlightVariant {
  return (VARIANTS.includes(value) ? value : "marker") as HighlightVariant;
}
function asSize(value: string): HighlightSize {
  return (SIZES.includes(value) ? value : "inherit") as HighlightSize;
}

export function TextHighlightPreview({ material, variant, size }: PreviewProps) {
  return (
    <TextHighlight
      className="max-w-[18ch] text-[clamp(25px,5vw,52px)]/[1.15] font-black tracking-[-0.05em] text-[#171817] dark:text-[#f1efe9]"
      data-material={material}
      data-size={asSize(size)}
      highlights={["important words", "attention"]}
      variant={asVariant(variant)}
    >
      Give important words the right attention
    </TextHighlight>
  );
}
