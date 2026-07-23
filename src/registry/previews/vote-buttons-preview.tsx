"use client";

import { VoteButtons } from "@/registry/ui/vote-buttons";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for Vote Buttons.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 */

type VoteButtonsVariant = "default";
type VoteButtonsSize = "sm" | "md" | "lg";
type VoteDirection = "up" | "down" | null;

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): VoteButtonsVariant {
  return (VARIANTS.includes(value) ? value : "default") as VoteButtonsVariant;
}

function asSize(value: string): VoteButtonsSize {
  return (SIZES.includes(value) ? value : "md") as VoteButtonsSize;
}

/** Sample data differs per material so each recipe is shown doing real work. */
const SAMPLE: Record<StyleSlug, { score: number; vote: VoteDirection }> = {
  clay: { score: 128, vote: "up" },
  glass: { score: 1240, vote: null },
  skeuo: { score: 47, vote: "down" },
  adaptive: { score: 8, vote: null },
};

export function VoteButtonsPreview({ material, variant, size, state }: PreviewProps) {
  const sample = SAMPLE[material];
  return (
    <div className="flex flex-col items-start gap-[16px]">
      <VoteButtons
        data-focus={state === "focus" ? "true" : undefined}
        defaultVote={sample.vote}
        disabled={state === "disabled"}
        material={material}
        score={sample.score}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
