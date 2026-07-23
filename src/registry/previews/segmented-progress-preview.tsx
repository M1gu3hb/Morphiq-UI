"use client";

import { SegmentedProgress } from "@/registry/ui/segmented-progress";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Segmented Progress.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a reader copies is the component, never the scaffolding
 * used to document it. Every reading is a fixed literal, so the server and the
 * client draw identical segments on a statically generated page.
 *
 * Three rows on purpose — the component's whole state vocabulary is visible at
 * once: a run in progress, a finished run, and one not started yet.
 */

type SegmentedProgressVariant = "default";
type SegmentedProgressSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SegmentedProgressVariant {
  return (VARIANTS.includes(value) ? value : "default") as SegmentedProgressVariant;
}

function asSize(value: string): SegmentedProgressSize {
  return (SIZES.includes(value) ? value : "md") as SegmentedProgressSize;
}

export function SegmentedProgressPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;

  const isDisabled = state === "disabled";
  const isLoading = state === "loading";
  const isError = state === "error";
  const passiveState = isDisabled ? "disabled" : isLoading ? "loading" : undefined;

  return (
    <div className="flex w-full max-w-[520px] flex-col gap-[20px]">
      <SegmentedProgress
        aria-busy={isLoading || undefined}
        data-focus={state === "focus" ? "true" : undefined}
        data-state={passiveState}
        label={
          isError
            ? "Migration halted"
            : isLoading
              ? "Syncing onboarding…"
              : "Onboarding checklist"
        }
        material={resolvedMaterial}
        size={resolvedSize}
        statusLabel={isError ? "Failed at step 3" : undefined}
        total={7}
        unitLabel="Step"
        value={isError ? 2 : 3}
        variant={resolvedVariant}
      />

      <SegmentedProgress
        data-state={passiveState}
        label="Release checks"
        material={resolvedMaterial}
        size={resolvedSize}
        total={5}
        unitLabel="Check"
        value={5}
        variant={resolvedVariant}
      />

      <SegmentedProgress
        data-state={passiveState}
        label="Interview loop"
        material={resolvedMaterial}
        size={resolvedSize}
        total={4}
        unitLabel="Round"
        value={0}
        variant={resolvedVariant}
      />
    </div>
  );
}
