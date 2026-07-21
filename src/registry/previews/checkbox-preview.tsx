"use client";

import { Checkbox, CheckboxField } from "@/registry/ui/checkbox";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Checkbox.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * `loading` falls through to the default render: a checkbox has no loading
 * behaviour, and inventing one would document something the component cannot do.
 */

type CheckboxVariant = "default" | "rounded";
type CheckboxSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "rounded"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): CheckboxVariant {
  return (VARIANTS.includes(value) ? value : "default") as CheckboxVariant;
}

function asSize(value: string): CheckboxSize {
  return (SIZES.includes(value) ? value : "md") as CheckboxSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, { label: string; helper: string; mixed: string }> = {
  clay: {
    label: "Auto-promote builds",
    helper: "Promotes once a build holds for thirty minutes.",
    mixed: "Some environments enabled",
  },
  glass: {
    label: "Hold notifications",
    helper: "Stays on until the focus block ends.",
    mixed: "Some channels muted",
  },
  skeuo: {
    label: "Phantom power",
    helper: "Required by condenser microphones.",
    mixed: "Some channels powered",
  },
  adaptive: {
    label: "Email invoices",
    helper: "Sent to the billing address each month.",
    mixed: "Some members subscribed",
  },
};

export function CheckboxPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isError = state === "error";
  const isDisabled = state === "disabled";
  const resolvedSize = asSize(size);
  const resolvedVariant = asVariant(variant);

  return (
    <div className="flex w-[min(340px,100%)] flex-col gap-[14px]">
      <CheckboxField
        data-focus={state === "focus" ? "true" : undefined}
        defaultChecked
        disabled={isDisabled}
        errorText={isError ? "Pick at least one environment." : undefined}
        helperText={copy.helper}
        label={copy.label}
        material={material}
        size={resolvedSize}
        variant={resolvedVariant}
      />
      {/* The mixed state has no equivalent in `PreviewState`, so it is shown
          alongside rather than replacing the main specimen. */}
      <label className="inline-flex cursor-pointer items-center gap-[10px]">
        <Checkbox
          disabled={isDisabled}
          indeterminate
          material={material}
          size={resolvedSize}
          variant={resolvedVariant}
        />
        <span className="text-[length:12px] leading-[1.4] font-bold opacity-80">
          {copy.mixed}
        </span>
      </label>
    </div>
  );
}
