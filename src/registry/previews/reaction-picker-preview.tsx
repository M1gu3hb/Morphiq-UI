"use client";

import { ReactionPicker } from "@/registry/ui/reaction-picker";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Reaction Picker.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 */

type ReactionPickerVariant = "default";
type ReactionPickerSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ReactionPickerVariant {
  return (VARIANTS.includes(value) ? value : "default") as ReactionPickerVariant;
}

function asSize(value: string): ReactionPickerSize {
  return (SIZES.includes(value) ? value : "md") as ReactionPickerSize;
}

/**
 * A pre-selected reaction on two materials shows the "current reaction" state
 * (the glyph rides on the trigger); the other two open on the neutral
 * SmilePlus, so each recipe is shown doing real work in a distinct state.
 */
const SELECTED: Partial<Record<StyleSlug, string>> = {
  clay: "love",
  skeuo: "laugh",
};

export function ReactionPickerPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="flex flex-col items-start gap-[16px]">
      <ReactionPicker
        data-focus={state === "focus" ? "true" : undefined}
        defaultReactionId={SELECTED[material]}
        disabled={state === "disabled"}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
