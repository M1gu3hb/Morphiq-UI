"use client";

import { AreaChart } from "@/registry/ui/area-chart";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Area Chart.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed, so SSR and the client agree and the drawn areas
 * are identical on both.
 */

type AreaChartVariant = "default" | "stacked";
type AreaChartSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "stacked"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): AreaChartVariant {
  return (VARIANTS.includes(value) ? value : "default") as AreaChartVariant;
}

function asSize(value: string): AreaChartSize {
  return (SIZES.includes(value) ? value : "md") as AreaChartSize;
}

// Deterministic series, so the drawn geometry is identical on server and client.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const SERIES = [
  { name: "Organic", values: [12, 18, 15, 22, 28, 31] },
  { name: "Referral", values: [8, 11, 9, 14, 17, 19] },
  { name: "Paid", values: [5, 6, 8, 7, 10, 13] },
];

export function AreaChartPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;
  const isDisabled = state === "disabled";

  return (
    <div className={isDisabled ? "w-[min(480px,100%)] opacity-55" : "w-[min(480px,100%)]"}>
      <AreaChart
        caption="Monthly signups by acquisition channel"
        categories={MONTHS}
        data={SERIES}
        material={resolvedMaterial}
        seriesLabel="Channel"
        size={resolvedSize}
        unit="k"
        variant={resolvedVariant}
      />
    </div>
  );
}
