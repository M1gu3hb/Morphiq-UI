"use client";

import { MultiSelectField, type MultiSelectOption } from "@/registry/ui/multi-select";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Multi Select.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * `key={material}` remounts the field when the material switches, so the
 * internal (uncontrolled) selection resets to the new material's preset rather
 * than carrying values that belong to a different set of options.
 */

type MultiSelectVariant = "default";
type MultiSelectSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): MultiSelectVariant {
  return (VARIANTS.includes(value) ? value : "default") as MultiSelectVariant;
}

function asSize(value: string): MultiSelectSize {
  return (SIZES.includes(value) ? value : "md") as MultiSelectSize;
}

type MaterialCopy = {
  label: string;
  placeholder: string;
  helper: string;
  options: MultiSelectOption[];
  preset: string[];
};

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, MaterialCopy> = {
  clay: {
    label: "Workspace tags",
    placeholder: "Add a tag",
    helper: "Tags group related projects.",
    options: [
      { value: "design", label: "Design" },
      { value: "research", label: "Research" },
      { value: "growth", label: "Growth" },
      { value: "ops", label: "Operations" },
      { value: "legacy", label: "Legacy", disabled: true },
    ],
    preset: ["design", "research"],
  },
  glass: {
    label: "Session collaborators",
    placeholder: "Invite someone",
    helper: "Everyone here can edit the block.",
    options: [
      { value: "ada", label: "Ada Lovelace" },
      { value: "grace", label: "Grace Hopper" },
      { value: "alan", label: "Alan Turing" },
      { value: "katherine", label: "Katherine Johnson" },
    ],
    preset: ["ada"],
  },
  skeuo: {
    label: "Channel labels",
    placeholder: "Attach a label",
    helper: "Up to eight labels per channel.",
    options: [
      { value: "urgent", label: "Urgent" },
      { value: "backlog", label: "Backlog" },
      { value: "shipped", label: "Shipped" },
      { value: "archived", label: "Archived", disabled: true },
    ],
    preset: ["urgent", "backlog"],
  },
  adaptive: {
    label: "Notify channels",
    placeholder: "Choose a channel",
    helper: "Alerts fan out to each channel.",
    options: [
      { value: "email", label: "Email" },
      { value: "slack", label: "Slack" },
      { value: "sms", label: "SMS" },
      { value: "webhook", label: "Webhook" },
    ],
    preset: ["email", "slack"],
  },
};

export function MultiSelectPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isError = state === "error";

  return (
    <div className="w-[min(360px,100%)]">
      <MultiSelectField
        key={material}
        data-focus={state === "focus" ? "true" : undefined}
        defaultValue={copy.preset}
        disabled={state === "disabled"}
        errorText={isError ? "Pick at least one option." : undefined}
        helperText={copy.helper}
        label={copy.label}
        material={material}
        options={copy.options}
        placeholder={copy.placeholder}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
