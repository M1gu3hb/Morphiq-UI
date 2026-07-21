"use client";

import { SelectField } from "@/registry/ui/select";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Select.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * `loading` falls through to the default render: a select has no loading
 * behaviour, and inventing one would document something the component cannot do.
 */

type SelectVariant = "default" | "filled" | "underline";
type SelectSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "filled", "underline"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SelectVariant {
  return (VARIANTS.includes(value) ? value : "default") as SelectVariant;
}

function asSize(value: string): SelectSize {
  return (SIZES.includes(value) ? value : "md") as SelectSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<
  StyleSlug,
  { label: string; placeholder: string; helper: string; options: readonly string[] }
> = {
  clay: {
    label: "Deploy target",
    placeholder: "Choose an environment",
    helper: "Rollout begins as soon as this is set.",
    options: ["Production", "Staging", "Preview", "Local"],
  },
  glass: {
    label: "Meeting room",
    placeholder: "Pick a room",
    helper: "Only rooms free for the whole slot are listed.",
    options: ["Atrium", "North wing", "Studio 4", "The greenhouse"],
  },
  skeuo: {
    label: "Input channel",
    placeholder: "Select a source",
    helper: "Routed to the monitor bus.",
    options: ["Line 1 / 2", "Mic A", "Mic B", "Digital in"],
  },
  adaptive: {
    label: "Billing cycle",
    placeholder: "Choose a cycle",
    helper: "Changes apply from the next invoice.",
    options: ["Monthly", "Quarterly", "Annual"],
  },
};

export function SelectPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isError = state === "error";

  return (
    <div className="w-[min(320px,100%)]">
      <SelectField
        // Remounts when the material or the state changes. The control is
        // uncontrolled, and `defaultValue` is only read at mount — without the
        // state in the key, switching to `error` would leave the previously
        // chosen option in place instead of returning to the unfilled
        // placeholder that is the whole reason the control is invalid.
        key={`${material}-${state}`}
        data-focus={state === "focus" ? "true" : undefined}
        // The error case leaves the placeholder selected, which is exactly the
        // state a "required" select is invalid in.
        defaultValue={isError ? "" : copy.options[0]}
        disabled={state === "disabled"}
        errorText={isError ? "Pick an option to continue." : undefined}
        helperText={copy.helper}
        label={copy.label}
        material={material}
        placeholder={copy.placeholder}
        size={asSize(size)}
        variant={asVariant(variant)}
      >
        {copy.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </SelectField>
    </div>
  );
}
