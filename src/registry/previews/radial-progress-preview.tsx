"use client";

import { RadialProgress } from "@/registry/ui/radial-progress";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Radial Progress gauge.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it. Data is deterministic — fixed values per material — so
 * there is no Date.now()/random and the render is server-safe.
 */

type RadialVariant = "default";
type RadialSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): RadialVariant {
  return (VARIANTS.includes(value) ? value : "default") as RadialVariant;
}

function asSize(value: string): RadialSize {
  return (SIZES.includes(value) ? value : "md") as RadialSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, { value: number; label: string }> = {
  clay: { value: 72, label: "Deploy health" },
  glass: { value: 46, label: "Focus session" },
  skeuo: { value: 88, label: "Signal level" },
  adaptive: { value: 61, label: "Monthly spend" },
};

export function RadialProgressPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isDisabled = state === "disabled";
  const isError = state === "error";

  return (
    <RadialProgress
      aria-disabled={isDisabled || undefined}
      className={isDisabled ? "opacity-55" : undefined}
      data-preview-state={state}
      label={isError ? "Sync stalled" : copy.label}
      material={material}
      size={asSize(size)}
      value={isError ? 27 : copy.value}
      variant={asVariant(variant)}
    />
  );
}
