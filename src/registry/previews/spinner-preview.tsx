"use client";

import { Spinner } from "@/registry/ui/spinner";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for the Spinner.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * Both forms are shown at once — bare and labelled — because the difference
 * between them is an accessibility decision, not a decorative one: the bare
 * spinner falls back to a visually hidden name, the labelled one reuses the
 * visible text so the region is not announced twice.
 *
 * `focus`, `disabled` and `error` fall through to the default render: a
 * loading indicator has none of those states, and inventing them would document
 * something the component cannot do.
 */

type SpinnerVariant = "arc" | "ring";
type SpinnerSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["arc", "ring"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SpinnerVariant {
  return (VARIANTS.includes(value) ? value : "arc") as SpinnerVariant;
}

function asSize(value: string): SpinnerSize {
  return (SIZES.includes(value) ? value : "md") as SpinnerSize;
}

export function SpinnerPreview({ material, variant, size }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);

  return (
    <div className="flex flex-col items-start gap-[18px]">
      <Spinner
        material={material}
        size={resolvedSize}
        srLabel="Loading results"
        variant={resolvedVariant}
      />
      <Spinner
        label="Publishing…"
        material={material}
        size={resolvedSize}
        variant={resolvedVariant}
      />
    </div>
  );
}
