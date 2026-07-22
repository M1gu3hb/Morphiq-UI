"use client";

import { MagicCard } from "@/registry/ui/magic-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

type MagicCardVariant = "default";
type MagicCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): MagicCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as MagicCardVariant;
}

function asSize(value: string): MagicCardSize {
  return (SIZES.includes(value) ? value : "md") as MagicCardSize;
}

const COPY: Record<StyleSlug, { eyebrow: string; title: string; body: string }> = {
  clay: {
    eyebrow: "Featured",
    title: "Trace the warm edge",
    body: "Move across the card and its border catches the light around the pointer.",
  },
  glass: {
    eyebrow: "Live pane",
    title: "A cool rim of light",
    body: "The frame brightens where you hover, without the content leaning on it.",
  },
  skeuo: {
    eyebrow: "Faceplate",
    title: "Machined border glow",
    body: "A bright seam follows the pointer along the warm greige edge.",
  },
  adaptive: {
    eyebrow: "Highlight",
    title: "Restrained by default",
    body: "The lit border follows the scheme and settles to an even ring at rest.",
  },
};

export function MagicCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <MagicCard
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
    </MagicCard>
  );
}
