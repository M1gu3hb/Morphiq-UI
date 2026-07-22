"use client";

import { TagsInputField } from "@/registry/ui/tags-input";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Tags Input.
 *
 * The control holds internal state (the committed tag list plus the text being
 * typed), so it is keyed by material: switching material in the catalog remounts
 * it with that material's sample tags rather than carrying the previous set
 * across. `error` renders the real invalid path — a message plus the red border
 * both keyed off `aria-invalid` — while `loading` falls through to the default,
 * since a tags field has no loading behaviour of its own to show.
 */

type TagsInputVariant = "default";
type TagsInputSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TagsInputVariant {
  return (VARIANTS.includes(value) ? value : "default") as TagsInputVariant;
}

function asSize(value: string): TagsInputSize {
  return (SIZES.includes(value) ? value : "md") as TagsInputSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<
  StyleSlug,
  { label: string; placeholder: string; helper: string; error: string; tags: string[] }
> = {
  clay: {
    label: "Workspace tags",
    placeholder: "Add a tag",
    helper: "Press Enter or comma to add each tag.",
    error: "design is already in the list.",
    tags: ["design", "research"],
  },
  glass: {
    label: "Session topics",
    placeholder: "Add a topic",
    helper: "Collaborators see these topics.",
    error: "Topics can be at most 24 characters.",
    tags: ["focus", "deep work"],
  },
  skeuo: {
    label: "Channel labels",
    placeholder: "Add a label",
    helper: "Up to eight labels per channel.",
    error: "This channel already has eight labels.",
    tags: ["general", "releases"],
  },
  adaptive: {
    label: "Recipient groups",
    placeholder: "Add a group",
    helper: "Invites go to every group.",
    error: "Add at least one recipient group.",
    tags: ["design", "leadership"],
  },
};

export function TagsInputPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isError = state === "error";

  return (
    <div className="w-[min(360px,100%)]">
      <TagsInputField
        key={material}
        data-focus={state === "focus" ? "true" : undefined}
        defaultValue={copy.tags}
        disabled={state === "disabled"}
        errorText={isError ? copy.error : undefined}
        helperText={copy.helper}
        label={copy.label}
        material={material}
        placeholder={copy.placeholder}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
