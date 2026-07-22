"use client";

import { SpotlightCard } from "@/registry/ui/spotlight-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

type SpotlightCardVariant = "default";
type SpotlightCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SpotlightCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as SpotlightCardVariant;
}

function asSize(value: string): SpotlightCardSize {
  return (SIZES.includes(value) ? value : "md") as SpotlightCardSize;
}

const COPY: Record<StyleSlug, { eyebrow: string; title: string; body: string }> = {
  clay: {
    eyebrow: "New workspace",
    title: "Make the surface yours",
    body: "Move across the card to reveal the warm light held inside the clay.",
  },
  glass: {
    eyebrow: "Live presence",
    title: "Three people are here",
    body: "The pane catches a cool flare without borrowing its legibility from the backdrop.",
  },
  skeuo: {
    eyebrow: "Channel strip",
    title: "Input A is armed",
    body: "A machined highlight follows the pointer across the warm greige faceplate.",
  },
  adaptive: {
    eyebrow: "Quick insight",
    title: "Conversion is up 18%",
    body: "The surface follows the active colour scheme and keeps the interaction restrained.",
  },
};

export function SpotlightCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <SpotlightCard
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
      <h3 className="m-0 text-[18px]/[1.18] font-extrabold tracking-[-0.025em]">
        {copy.title}
      </h3>
      <p className="m-0 text-[13px]/[1.5] text-[color:var(--mq-muted,#6a5346)]">
        {copy.body}
      </p>
    </SpotlightCard>
  );
}
