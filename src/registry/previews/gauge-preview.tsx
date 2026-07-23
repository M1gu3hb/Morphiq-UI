"use client";

import { Gauge, type GaugeZone } from "@/registry/ui/gauge";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Gauge.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed, so SSR and the client agree and the drawn arc,
 * needle and zones are identical on both.
 */

type GaugeVariant = "default";
type GaugeSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): GaugeVariant {
  return (VARIANTS.includes(value) ? value : "default") as GaugeVariant;
}

function asSize(value: string): GaugeSize {
  return (SIZES.includes(value) ? value : "md") as GaugeSize;
}

// Deterministic reading + zones, so the drawn geometry is identical on server
// and client. 72 lands in the "Critical" zone.
const ZONES: GaugeZone[] = [
  { upTo: 40, label: "Healthy", tone: "ok" },
  { upTo: 70, label: "Elevated", tone: "low" },
  { upTo: 100, label: "Critical", tone: "high" },
];

export function GaugePreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;
  const isDisabled = state === "disabled";

  return (
    <div className={isDisabled ? "opacity-55" : undefined}>
      <Gauge
        label="CPU load"
        material={resolvedMaterial}
        max={100}
        min={0}
        size={resolvedSize}
        unit="%"
        value={72}
        variant={resolvedVariant}
        zones={ZONES}
      />
    </div>
  );
}
