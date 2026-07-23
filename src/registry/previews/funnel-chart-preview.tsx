"use client";

import { FunnelChart } from "@/registry/ui/funnel-chart";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Funnel Chart.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed, so SSR and the client agree and the drawn funnel
 * is identical on both.
 */

type FunnelChartVariant = "default";
type FunnelChartSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FunnelChartVariant {
  return (VARIANTS.includes(value) ? value : "default") as FunnelChartVariant;
}

function asSize(value: string): FunnelChartSize {
  return (SIZES.includes(value) ? value : "md") as FunnelChartSize;
}

// Deterministic pipeline, so the drawn geometry is identical on server and client.
const PIPELINE = [
  { label: "Visitors", value: 12000 },
  { label: "Sign-ups", value: 5040 },
  { label: "Activated", value: 2830 },
  { label: "Paid", value: 940 },
];

export function FunnelChartPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;
  const isDisabled = state === "disabled";

  return (
    <div className={isDisabled ? "w-[min(440px,100%)] opacity-55" : "w-[min(440px,100%)]"}>
      <FunnelChart
        caption="Onboarding funnel by stage"
        material={resolvedMaterial}
        size={resolvedSize}
        stages={PIPELINE}
        variant={resolvedVariant}
      />
    </div>
  );
}
