"use client";

import { LineChart } from "@/registry/ui/line-chart";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Line Chart.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed, so SSR and the client agree and the drawn
 * polylines are identical on both.
 */

type LineChartVariant = "default";
type LineChartSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): LineChartVariant {
  return (VARIANTS.includes(value) ? value : "default") as LineChartVariant;
}

function asSize(value: string): LineChartSize {
  return (SIZES.includes(value) ? value : "md") as LineChartSize;
}

// Deterministic series, so the drawn geometry is identical on server and client.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const SERIES = [
  { name: "Desktop", data: [32, 40, 38, 50, 61, 72] },
  { name: "Mobile", data: [20, 28, 34, 30, 44, 58] },
  { name: "Tablet", data: [8, 12, 10, 16, 14, 22] },
];

export function LineChartPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;
  const isDisabled = state === "disabled";

  return (
    <div className={isDisabled ? "w-[min(480px,100%)] opacity-55" : "w-[min(480px,100%)]"}>
      <LineChart
        caption="Monthly active users by platform"
        labels={MONTHS}
        material={resolvedMaterial}
        series={SERIES}
        seriesLabel="Platform"
        size={resolvedSize}
        unit="k"
        variant={resolvedVariant}
      />
    </div>
  );
}
