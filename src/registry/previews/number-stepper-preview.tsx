"use client";

import { NumberStepperField } from "@/registry/ui/number-stepper";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Number Stepper.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * `focus` forces the field's well via `data-focus="true"`, `disabled` disables
 * the whole control, and `error` sets an out-of-range value plus `errorText`, so
 * `aria-invalid` — the single source of the error look — is what turns the field
 * red. `loading` has nothing to show on a stepper and falls through to default.
 */

type StepperVariant = "default" | "filled";
type StepperSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "filled"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): StepperVariant {
  return (VARIANTS.includes(value) ? value : "default") as StepperVariant;
}

function asSize(value: string): StepperSize {
  return (SIZES.includes(value) ? value : "md") as StepperSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<
  StyleSlug,
  { label: string; helper: string; min: number; max: number; step: number; value: number }
> = {
  clay: { label: "Guests", helper: "Room seats up to eight.", min: 1, max: 8, step: 1, value: 2 },
  glass: { label: "Focus blocks", helper: "25 minutes each.", min: 0, max: 12, step: 1, value: 4 },
  skeuo: { label: "Copies", helper: "Printed double-sided.", min: 1, max: 50, step: 1, value: 10 },
  adaptive: {
    label: "Budget cap",
    helper: "Adjusts in 0.5 steps.",
    min: 0,
    max: 20,
    step: 0.5,
    value: 5,
  },
};

export function NumberStepperPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isError = state === "error";

  return (
    <div className="w-[min(300px,100%)]">
      <NumberStepperField
        data-focus={state === "focus" ? "true" : undefined}
        defaultValue={isError ? String(copy.max + 5) : String(copy.value)}
        disabled={state === "disabled"}
        errorText={isError ? `Enter a value between ${copy.min} and ${copy.max}.` : undefined}
        helperText={copy.helper}
        key={material}
        label={copy.label}
        material={material}
        max={copy.max}
        min={copy.min}
        size={asSize(size)}
        step={copy.step}
        variant={asVariant(variant)}
      />
    </div>
  );
}
