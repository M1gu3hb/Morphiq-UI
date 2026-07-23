"use client";

import { ToggleButton } from "@/registry/ui/toggle-button";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Toggle Button.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type ToggleButtonVariant = "default";
type ToggleButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ToggleButtonVariant {
  return (VARIANTS.includes(value) ? value : "default") as ToggleButtonVariant;
}

function asSize(value: string): ToggleButtonSize {
  return (SIZES.includes(value) ? value : "md") as ToggleButtonSize;
}

/** The toggled action differs per material so each recipe is shown doing real work. */
const LABEL: Record<StyleSlug, string> = {
  clay: "Notify me",
  glass: "Live preview",
  skeuo: "Metronome",
  adaptive: "Auto-sync",
};

export function ToggleButtonPreview({ material, variant, size, state }: PreviewProps) {
  // `key={material}` remounts the pair when the material switches, so each
  // uncontrolled toggle resets to its seeded off/on state instead of carrying a
  // click made under the previous material.
  return (
    <div className="flex flex-wrap items-center gap-[16px]" key={material}>
      {/* Off specimen — starts unpressed. */}
      <ToggleButton
        data-focus={state === "focus" ? "true" : undefined}
        defaultPressed={false}
        disabled={state === "disabled"}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      >
        {LABEL[material]}
      </ToggleButton>
      {/* On specimen — starts pressed, so the persistent inset well and the Check
          glyph are both visible side by side with the off state. */}
      <ToggleButton
        data-focus={state === "focus" ? "true" : undefined}
        defaultPressed
        disabled={state === "disabled"}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      >
        {LABEL[material]}
      </ToggleButton>
    </div>
  );
}
