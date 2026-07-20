"use client";

import { Toggle } from "@/registry/ui/toggle";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Toggle.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type ToggleVariant = "default" | "labeled" | "icon";
type ToggleSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "labeled", "icon"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ToggleVariant {
  return (VARIANTS.includes(value) ? value : "default") as ToggleVariant;
}

function asSize(value: string): ToggleSize {
  return (SIZES.includes(value) ? value : "md") as ToggleSize;
}

/** Label copy differs per material so each recipe is shown doing real work. */
const LABEL: Record<StyleSlug, string> = {
  clay: "Haptics",
  glass: "Focus mode",
  skeuo: "Phantom power",
  adaptive: "Sync on cellular",
};

export function TogglePreview({ material, variant, size, state }: PreviewProps) {
  return (
    <Toggle
      // Starts on so the checked recipe — the one carrying the material's
      // colour — is what a reader sees first. It stays interactive: the switch
      // owns its state, so hovering and flipping it in the docs is real.
      defaultChecked
      data-focus={state === "focus" ? "true" : undefined}
      disabled={state === "disabled"}
      loading={state === "loading"}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      {LABEL[material]}
    </Toggle>
  );
}
