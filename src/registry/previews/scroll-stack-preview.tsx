import { ScrollStack, type ScrollStackItem } from "@/registry/ui/scroll-stack";
import type { PreviewProps } from "@/registry/schema";

type ScrollStackVariant = "compact" | "spacious";
type ScrollStackSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["compact", "spacious"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const ITEMS: readonly ScrollStackItem[] = [
  { id: "collect", title: "Collect the signal", description: "Each story remains readable while the next frame approaches." },
  { id: "shape", title: "Shape the sequence", description: "Native sticky positioning creates the stack without a scroll listener." },
  { id: "release", title: "Release the frame", description: "Scroll onward to reveal the final layer in its original document order." },
];

function asVariant(value: string): ScrollStackVariant {
  return (VARIANTS.includes(value) ? value : "spacious") as ScrollStackVariant;
}

function asSize(value: string): ScrollStackSize {
  return (SIZES.includes(value) ? value : "md") as ScrollStackSize;
}

export function ScrollStackPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <ScrollStack
      className="h-[330px] w-[min(560px,100%)] overflow-y-auto rounded-[24px]"
      data-focus={state === "focus" ? "true" : undefined}
      items={ITEMS}
      material={material === "adaptive" ? material : "adaptive"}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
