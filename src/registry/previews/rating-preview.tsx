"use client";

import { useState } from "react";
import { Rating } from "@/registry/ui/rating";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for the Rating.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a reader copies is the component, never the scaffolding
 * used to document it. Two ratings do real work side by side — a controlled,
 * half-step review control the reader can click and tab into, and the passive
 * read-only average underneath it — so both ARIA modes are visible at once.
 *
 * Every figure is a literal, so the server and the client render the same stars
 * and there is no hydration mismatch on the statically generated docs page.
 */

type RatingVariant = "default";
type RatingSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): RatingVariant {
  return (VARIANTS.includes(value) ? value : "default") as RatingVariant;
}

function asSize(value: string): RatingSize {
  return (SIZES.includes(value) ? value : "md") as RatingSize;
}

export function RatingPreview({ material, variant, size, state }: PreviewProps) {
  const [score, setScore] = useState(3.5);
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);

  return (
    <div className="flex flex-col items-start gap-[22px]">
      <Rating
        allowHalf
        busy={state === "loading"}
        busyLabel="Saving your review"
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        error={state === "error" ? "Choose at least one star before submitting." : undefined}
        label="Rate this template"
        material={material}
        onValueChange={setScore}
        size={resolvedSize}
        value={score}
        variant={resolvedVariant}
      />
      <Rating
        allowHalf
        label="Community average, 1,284 reviews"
        material={material}
        readOnly
        size={resolvedSize}
        value={4.5}
        variant={resolvedVariant}
      />
    </div>
  );
}
