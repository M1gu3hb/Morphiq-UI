"use client";

import { ThemeToggle } from "@/registry/ui/theme-toggle";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Theme Toggle.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 */

type ThemeToggleVariant = "default";
type ThemeToggleSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ThemeToggleVariant {
  return (VARIANTS.includes(value) ? value : "default") as ThemeToggleVariant;
}

function asSize(value: string): ThemeToggleSize {
  return (SIZES.includes(value) ? value : "md") as ThemeToggleSize;
}

/**
 * Initial state differs per material so each recipe is shown doing real work —
 * two resting in light (sun), two already flipped to dark (moon).
 */
const DEFAULT_ON: Record<StyleSlug, boolean> = {
  clay: false,
  glass: true,
  skeuo: false,
  adaptive: true,
};

export function ThemeTogglePreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="flex flex-col items-start gap-[16px]">
      <ThemeToggle
        data-focus={state === "focus" ? "true" : undefined}
        defaultChecked={DEFAULT_ON[material]}
        disabled={state === "disabled"}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
