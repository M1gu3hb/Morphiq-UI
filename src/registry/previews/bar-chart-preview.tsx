"use client";

import { BarChart } from "@/registry/ui/bar-chart";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Bar Chart.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed, so SSR and the client agree and the drawn bars
 * are identical on both.
 */

type BarChartVariant = "vertical" | "horizontal";
type BarChartSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["vertical", "horizontal"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): BarChartVariant {
  return (VARIANTS.includes(value) ? value : "vertical") as BarChartVariant;
}

function asSize(value: string): BarChartSize {
  return (SIZES.includes(value) ? value : "md") as BarChartSize;
}

// Deterministic series, so the drawn geometry is identical on server and client.
const TRAFFIC = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 55 },
  { label: "Wed", value: 38 },
  { label: "Thu", value: 61 },
  { label: "Fri", value: 74 },
];

export function BarChartPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;
  const isDisabled = state === "disabled";

  return (
    <div className={isDisabled ? "w-[min(440px,100%)] opacity-55" : "w-[min(440px,100%)]"}>
      <BarChart
        caption="Weekly signups by day"
        data={TRAFFIC}
        material={resolvedMaterial}
        size={resolvedSize}
        unit="k"
        variant={resolvedVariant}
      />
    </div>
  );
}
