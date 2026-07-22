"use client";

import { NeonGradientCard } from "@/registry/ui/neon-gradient-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

type NeonCardVariant = "default";
type NeonCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): NeonCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as NeonCardVariant;
}

function asSize(value: string): NeonCardSize {
  return (SIZES.includes(value) ? value : "md") as NeonCardSize;
}

const COPY: Record<StyleSlug, { eyebrow: string; title: string; body: string }> = {
  clay: {
    eyebrow: "Launch",
    title: "A warm neon frame",
    body: "The glow rotates around the card while the content rests on solid clay.",
  },
  glass: {
    eyebrow: "Broadcast",
    title: "Cool light on the rim",
    body: "The pane keeps its contrast; the neon lives only in the frame around it.",
  },
  skeuo: {
    eyebrow: "Console",
    title: "Signal ring active",
    body: "A tinted glow circles the warm greige plate without touching the text.",
  },
  adaptive: {
    eyebrow: "Status",
    title: "Neon that follows the scheme",
    body: "The frame animates in each colour scheme and freezes under reduced motion.",
  },
};

export function NeonGradientCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <NeonGradientCard
      className="w-[min(360px,100%)]"
      data-focus={state === "focus" ? "true" : undefined}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <p className="m-0 text-[11px]/[1.2] font-extrabold tracking-[0.12em] uppercase opacity-75">
        {copy.eyebrow}
      </p>
      <h3 className="m-0 text-[18px]/[1.18] font-extrabold tracking-[-0.025em]">{copy.title}</h3>
      <p className="m-0 text-[13px]/[1.5] text-[color:var(--mq-muted,#6a5346)]">{copy.body}</p>
    </NeonGradientCard>
  );
}
