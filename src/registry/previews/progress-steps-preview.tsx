"use client";

import { ProgressSteps, type ProgressStep } from "@/registry/ui/progress-steps";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/** Documentation preview for Progress Steps. */

type ProgressStepsVariant = "default";
type ProgressStepsSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const SAMPLE_STEPS: readonly ProgressStep[] = [
  { id: "account", label: "Account", description: "Verified", state: "completed" },
  { id: "profile", label: "Profile", description: "Saved", state: "completed" },
  { id: "billing", label: "Billing", description: "In review", state: "current" },
  { id: "review", label: "Review", description: "Not started", state: "pending" },
];

function asVariant(value: string): ProgressStepsVariant {
  return (VARIANTS.includes(value) ? value : "default") as ProgressStepsVariant;
}

function asSize(value: string): ProgressStepsSize {
  return (SIZES.includes(value) ? value : "md") as ProgressStepsSize;
}

function cnState(state: PreviewProps["state"]): string | undefined {
  if (state === "disabled") return "opacity-60";
  if (state === "loading") return "cursor-wait";
  return undefined;
}

export function ProgressStepsPreview({ material, variant, size, state }: PreviewProps) {
  const materialSlug: StyleSlug = material;

  return (
    <ProgressSteps
      aria-busy={state === "loading" || undefined}
      aria-disabled={state === "disabled" || undefined}
      aria-label="Account setup progress"
      className={cnState(state)}
      material={materialSlug}
      size={asSize(size)}
      steps={SAMPLE_STEPS}
      variant={asVariant(variant)}
    />
  );
}
