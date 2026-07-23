"use client";

import { ProgressBarGroup, type ProgressBarItem } from "@/registry/ui/progress-bar";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Progress Bar Group.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed, so SSR and the client agree and the drawn bars
 * are identical on both.
 */

type ProgressBarVariant = "default";
type ProgressBarSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ProgressBarVariant {
  return (VARIANTS.includes(value) ? value : "default") as ProgressBarVariant;
}

function asSize(value: string): ProgressBarSize {
  return (SIZES.includes(value) ? value : "md") as ProgressBarSize;
}

// Deterministic metrics, so the drawn geometry is identical on server and client.
// The tone reinforces the value; the numeric reading carries the meaning.
const RESOURCES: ProgressBarItem[] = [
  { label: "CPU", value: 72, max: 100, unit: "%", tone: "accent" },
  { label: "Memory", value: 11.4, max: 16, unit: "GB", tone: "warning" },
  { label: "Disk", value: 214, max: 512, unit: "GB", tone: "positive" },
  { label: "Bandwidth", value: 94, max: 100, unit: "%", tone: "critical" },
];

export function ProgressBarGroupPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;
  const isDisabled = state === "disabled";

  return (
    <div className={isDisabled ? "w-[min(440px,100%)] opacity-55" : "w-[min(440px,100%)]"}>
      <ProgressBarGroup
        caption="System resource usage"
        items={RESOURCES}
        material={resolvedMaterial}
        size={resolvedSize}
        variant={resolvedVariant}
      />
    </div>
  );
}
