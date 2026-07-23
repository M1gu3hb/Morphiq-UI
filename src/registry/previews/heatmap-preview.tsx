"use client";

import { Heatmap } from "@/registry/ui/heatmap";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Heatmap.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed and computed once at import, so SSR and the
 * client agree and the drawn grid is identical on both.
 */

type HeatmapVariant = "default";
type HeatmapSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): HeatmapVariant {
  return (VARIANTS.includes(value) ? value : "default") as HeatmapVariant;
}

function asSize(value: string): HeatmapSize {
  return (SIZES.includes(value) ? value : "md") as HeatmapSize;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKS = 12;

// Deterministic contributions series, arranged column-major (7 rows = weekdays,
// one column per week). The value is a pure function of the index, so the drawn
// geometry and bucketing are identical on server and client.
const CONTRIB = Array.from({ length: WEEKS * 7 }, (_, index) => {
  const week = Math.floor(index / 7);
  const day = index % 7;
  const value = (index * 5 + week * 3 + day * day) % 13;
  return { label: `${WEEKDAYS[day]}, week ${week + 1}`, value };
});

export function HeatmapPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;
  const isDisabled = state === "disabled";

  return (
    <div className={isDisabled ? "w-[min(560px,100%)] opacity-55" : "w-[min(560px,100%)]"}>
      <Heatmap
        caption="Daily contributions over 12 weeks"
        data={CONTRIB}
        labelHeader="Day"
        material={resolvedMaterial}
        rowLabels={WEEKDAYS}
        rows={7}
        size={resolvedSize}
        valueHeader="Contributions"
        variant={resolvedVariant}
      />
    </div>
  );
}
