"use client";

import { DonutChart } from "@/registry/ui/donut-chart";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Donut Chart.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed, so SSR and the client agree and the drawn ring
 * is identical on both.
 */

type DonutChartVariant = "default";
type DonutChartSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): DonutChartVariant {
  return (VARIANTS.includes(value) ? value : "default") as DonutChartVariant;
}

function asSize(value: string): DonutChartSize {
  return (SIZES.includes(value) ? value : "md") as DonutChartSize;
}

// Deterministic series, so the drawn geometry is identical on server and client.
const TRAFFIC = [
  { label: "Direct", value: 42 },
  { label: "Organic", value: 31 },
  { label: "Referral", value: 18 },
  { label: "Social", value: 9 },
];

export function DonutChartPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;
  const isDisabled = state === "disabled";

  return (
    <div className={isDisabled ? "w-fit opacity-55" : "w-fit"}>
      <DonutChart
        caption="Sessions by acquisition channel"
        centerLabel="Sessions"
        data={TRAFFIC}
        material={resolvedMaterial}
        shareLabel="Share"
        size={resolvedSize}
        unit="k"
        variant={resolvedVariant}
      />
    </div>
  );
}
