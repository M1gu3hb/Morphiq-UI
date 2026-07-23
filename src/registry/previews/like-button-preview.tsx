"use client";

import { LikeButton } from "@/registry/ui/like-button";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Like Button.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 */

type LikeButtonVariant = "default";
type LikeButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): LikeButtonVariant {
  return (VARIANTS.includes(value) ? value : "default") as LikeButtonVariant;
}

function asSize(value: string): LikeButtonSize {
  return (SIZES.includes(value) ? value : "md") as LikeButtonSize;
}

/**
 * Realistic sample data per material so each recipe is shown doing real work:
 * counts of different magnitudes and a mix of already-liked / not-yet-liked so
 * both the filled and outline heart are on display across the gallery.
 */
const SAMPLE: Record<StyleSlug, { count: number; liked: boolean }> = {
  clay: { count: 128, liked: false },
  glass: { count: 2438, liked: true },
  skeuo: { count: 47, liked: false },
  adaptive: { count: 1_200_000, liked: true },
};

export function LikeButtonPreview({ material, variant, size, state }: PreviewProps) {
  const sample = SAMPLE[material];
  return (
    <div className="flex flex-col items-start gap-[16px]">
      <LikeButton
        data-focus={state === "focus" ? "true" : undefined}
        defaultCount={sample.count}
        defaultLiked={sample.liked}
        disabled={state === "disabled"}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
