"use client";

import { LoadingDots } from "@/registry/ui/loading-dots";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for Loading Dots.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * Both forms are shown at once — bare and labelled — because the difference
 * between them is an accessibility decision, not a decorative one: the bare
 * indicator falls back to a visually hidden name, the labelled one reuses the
 * visible text so the region is not announced twice.
 *
 * `focus`, `disabled` and `error` fall through to the default render: a loading
 * indicator has none of those states, and inventing them would document
 * something the component cannot do.
 */

type LoadingDotsVariant = "bounce" | "pulse";
type LoadingDotsSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["bounce", "pulse"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): LoadingDotsVariant {
  return (VARIANTS.includes(value) ? value : "bounce") as LoadingDotsVariant;
}

function asSize(value: string): LoadingDotsSize {
  return (SIZES.includes(value) ? value : "md") as LoadingDotsSize;
}

export function LoadingDotsPreview({ material, variant, size }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  // Material is agnostic here, so it only threads through to `data-material`.
  const resolvedMaterial: StyleSlug = material;

  return (
    <div className="flex flex-col items-start gap-[18px]">
      <LoadingDots
        material={resolvedMaterial}
        size={resolvedSize}
        srLabel="Loading results"
        variant={resolvedVariant}
      />
      <LoadingDots
        label="Thinking…"
        material={resolvedMaterial}
        size={resolvedSize}
        variant={resolvedVariant}
      />
    </div>
  );
}
