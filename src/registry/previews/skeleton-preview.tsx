"use client";

import { Skeleton } from "@/registry/ui/skeleton";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for the Skeleton.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * The composition doubles as the accessibility demonstration: the region
 * carries `aria-busy` and `role="status"`, while the individual placeholders
 * stay `aria-hidden`. Marking each bar instead would announce "loading" once
 * per bar, which is noise.
 *
 * `focus`, `disabled` and `error` fall through to the default render: a
 * placeholder has none of those states, and inventing them would document
 * something the component cannot do.
 */

type SkeletonVariant = "line" | "circle" | "rect";
type SkeletonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["line", "circle", "rect"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SkeletonVariant {
  return (VARIANTS.includes(value) ? value : "line") as SkeletonVariant;
}

function asSize(value: string): SkeletonSize {
  return (SIZES.includes(value) ? value : "md") as SkeletonSize;
}

export function SkeletonPreview({ material, variant, size }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex w-[min(320px,100%)] flex-col gap-[14px]"
      role="status"
    >
      {/* The accessible name of the busy region. Visually hidden rather than
          omitted: with the placeholders silenced, this is the only thing a
          screen reader has to announce. */}
      <span className="sr-only">Loading content</span>

      <div className="flex items-center gap-[12px]">
        <Skeleton material={material} size={resolvedSize} variant="circle" />
        <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
          <Skeleton material={material} size={resolvedSize} variant="line" />
          <Skeleton className="w-[60%]" material={material} size={resolvedSize} variant="line" />
        </div>
      </div>

      {/* The shape the switcher is pointing at, shown at full width so the
          selected variant is unmistakable. */}
      <Skeleton material={material} size={resolvedSize} variant={resolvedVariant} />
    </div>
  );
}
