"use client";

import { ImageCard } from "@/registry/ui/image-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Image Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it. Demo photos come from picsum with a per-material seed so
 * each material is shown framing a real, different image.
 */

type ImageCardVariant = "default";
type ImageCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ImageCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as ImageCardVariant;
}

function asSize(value: string): ImageCardSize {
  return (SIZES.includes(value) ? value : "md") as ImageCardSize;
}

/** Copy and a distinct photo per material, so each recipe does real work. */
const COPY: Record<
  StyleSlug,
  { seed: string; eyebrow: string; title: string; caption: string; alt: string }
> = {
  clay: {
    seed: "clay-dunes",
    eyebrow: "Field notes",
    title: "Red dunes at first light",
    caption: "Wind-carved ridgelines catch the low sun across the basin.",
    alt: "Rippled red sand dunes under a pale dawn sky",
  },
  glass: {
    seed: "glass-harbor",
    eyebrow: "City guide",
    title: "Harbour after the rain",
    caption: "Reflections pool along the quay while the ferries reset.",
    alt: "A rain-slicked harbour promenade lit by evening lamps",
  },
  skeuo: {
    seed: "skeuo-studio",
    eyebrow: "Workshop",
    title: "The corner bench",
    caption: "Hand tools laid out for a morning of quiet, careful joinery.",
    alt: "A woodworking bench with hand tools arranged on it",
  },
  adaptive: {
    seed: "adaptive-peak",
    eyebrow: "Route log",
    title: "North ridge traverse",
    caption: "A clean line above the cloud deck before the weather turns.",
    alt: "A snow-covered mountain ridge rising above low clouds",
  },
};

export function ImageCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <div className="flex w-full flex-col items-start gap-[18px]">
      <ImageCard
        alt={copy.alt}
        busy={state === "loading"}
        caption={copy.caption}
        className="w-[min(340px,100%)]"
        data-focus={state === "focus" ? "true" : undefined}
        dateLabel="Updated Jul 22, 2026"
        dateTime="2026-07-22"
        disabled={state === "disabled"}
        eyebrow={copy.eyebrow}
        headingLevel={3}
        href="#image-card-demo"
        imgHeight={600}
        imgWidth={800}
        material={material}
        ratio="4 / 3"
        size={asSize(size)}
        src={`https://picsum.photos/seed/${copy.seed}/800/600`}
        title={copy.title}
        variant={asVariant(variant)}
      />
    </div>
  );
}
