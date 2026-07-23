import type { PreviewProps } from "@/registry/schema";
import { Text3D } from "@/registry/ui/text-3d";

type Text3DVariant = "slab" | "chromatic";
type TextSize = "inherit";
const VARIANTS: readonly string[] = ["slab", "chromatic"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): Text3DVariant {
  return (VARIANTS.includes(value) ? value : "slab") as Text3DVariant;
}

function asSize(value: string): TextSize {
  return (SIZES.includes(value) ? value : "inherit") as TextSize;
}

export function Text3DPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <Text3D
      className={state === "disabled" ? "text-[clamp(32px,8vw,76px)]/[.94] font-black tracking-[-0.07em] text-[#242522] opacity-55 dark:text-[#f1efe9]" : "text-[clamp(32px,8vw,76px)]/[.94] font-black tracking-[-0.07em] text-[#242522] dark:text-[#f1efe9]"}
      data-material={material}
      data-size={asSize(size)}
      variant={asVariant(variant)}
    >
      Deep type
    </Text3D>
  );
}
