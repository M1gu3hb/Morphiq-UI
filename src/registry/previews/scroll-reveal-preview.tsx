import { ScrollReveal } from "@/registry/ui/scroll-reveal";
import type { PreviewProps } from "@/registry/schema";

type RevealVariant = "lift" | "soften";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["lift", "soften"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): RevealVariant {
  return (VARIANTS.includes(value) ? value : "lift") as RevealVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function ScrollRevealPreview({ material, size, variant }: PreviewProps) {
  return (
    <ScrollReveal className="w-[min(380px,100%)]" material={material} size={asSize(size)} threshold={0.05} variant={asVariant(variant)}>
      <p className="m-0 text-[11px] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">Viewport aware</p>
      <h3 className="m-0 mt-[8px] text-[23px]/[1.08] font-extrabold tracking-[-0.04em]">Content arrives when it matters</h3>
      <p className="mt-auto mb-0 text-[12px] text-[#c8ccd8]">Visible by default before JavaScript and under reduced motion.</p>
    </ScrollReveal>
  );
}
