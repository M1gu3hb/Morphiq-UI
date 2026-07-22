"use client";

import { TiltCard } from "@/registry/ui/tilt-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

type TiltCardVariant = "default";
type TiltCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TiltCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as TiltCardVariant;
}

function asSize(value: string): TiltCardSize {
  return (SIZES.includes(value) ? value : "md") as TiltCardSize;
}

const COPY: Record<StyleSlug, { eyebrow: string; title: string; body: string }> = {
  clay: {
    eyebrow: "Interactive",
    title: "Tilt the clay toward you",
    body: "The surface leans under the pointer and a soft highlight slides across it.",
  },
  glass: {
    eyebrow: "Depth",
    title: "A pane that follows your hand",
    body: "Real 3D rotation with a cool specular sweep, legible over any backdrop.",
  },
  skeuo: {
    eyebrow: "Panel",
    title: "Angle the greige faceplate",
    body: "The plate pitches toward the pointer while the machined sheen tracks it.",
  },
  adaptive: {
    eyebrow: "Motion",
    title: "Springs back when you leave",
    body: "A restrained tilt that eases home, and stays square under reduced motion.",
  },
};

export function TiltCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <TiltCard
      className="w-[min(360px,100%)]"
      data-focus={state === "focus" ? "true" : undefined}
      material={material}
      size={asSize(size)}
      tabIndex={0}
      variant={asVariant(variant)}
    >
      <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.12em] uppercase opacity-75">
        {copy.eyebrow}
      </p>
      <h3 className="m-0 text-[18px]/[1.18] font-extrabold tracking-[-0.025em]">{copy.title}</h3>
      <p className="m-0 text-[13px]/[1.5] text-[color:var(--mq-muted,#6a5346)]">{copy.body}</p>
    </TiltCard>
  );
}
