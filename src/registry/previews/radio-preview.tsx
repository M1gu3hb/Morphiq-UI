"use client";

import { RadioGroupField, RadioGroupItem } from "@/registry/ui/radio";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Radio Group.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * `loading` falls through to the default render: a radio group has no loading
 * behaviour, and inventing one would document something the component cannot do.
 */

type RadioVariant = "default" | "card";
type RadioSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "card"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): RadioVariant {
  return (VARIANTS.includes(value) ? value : "default") as RadioVariant;
}

function asSize(value: string): RadioSize {
  return (SIZES.includes(value) ? value : "md") as RadioSize;
}

type Option = { value: string; label: string };

/** Copy differs per material so each recipe is shown doing real work. */
const GROUPS: Record<StyleSlug, { label: string; helper: string; options: Option[] }> = {
  clay: {
    label: "Deploy target",
    helper: "Promotion rules follow the target you pick.",
    options: [
      { value: "preview", label: "Preview" },
      { value: "staging", label: "Staging" },
      { value: "production", label: "Production" },
    ],
  },
  glass: {
    label: "Session visibility",
    helper: "Applies to everyone in the room.",
    options: [
      { value: "private", label: "Private" },
      { value: "team", label: "Team only" },
      { value: "link", label: "Anyone with the link" },
    ],
  },
  skeuo: {
    label: "Input source",
    helper: "Phantom power follows the source.",
    options: [
      { value: "line", label: "Line" },
      { value: "instrument", label: "Instrument" },
      { value: "mic", label: "Microphone" },
    ],
  },
  adaptive: {
    label: "Billing cycle",
    helper: "Changes take effect next period.",
    options: [
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
      { value: "annual", label: "Annual" },
    ],
  },
};

export function RadioPreview({ material, variant, size, state }: PreviewProps) {
  const group = GROUPS[material];
  const isError = state === "error";

  return (
    <div className="w-[min(340px,100%)]">
      <RadioGroupField
        // Each material documents a different set of options, and the group is
        // uncontrolled — without remounting, switching material would leave the
        // previous material's value selected, which matches nothing in the new
        // set, and the group would render with nothing checked.
        key={material}
        defaultValue={group.options[1].value}
        disabled={state === "disabled"}
        errorText={isError ? "Choose a target before deploying." : undefined}
        helperText={group.helper}
        label={group.label}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      >
        {group.options.map((option, index) => (
          <RadioGroupItem
            data-focus={state === "focus" && index === 1 ? "true" : undefined}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </RadioGroupItem>
        ))}
      </RadioGroupField>
    </div>
  );
}
