"use client";

import { FloatingLabelInput } from "@/registry/ui/floating-label-input";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Floating Label Input.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * `focus` forces the ring and floats the label through `data-focus="true"` on
 * the control; `disabled` disables it; `error` fills the field with an invalid
 * value and sets `errorText`, which drives `aria-invalid`. `loading` has no
 * meaning for a text field, so it falls through to the default render.
 */

type FloatingLabelInputVariant = "default" | "filled" | "underline";
type FloatingLabelInputSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "filled", "underline"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FloatingLabelInputVariant {
  return (VARIANTS.includes(value) ? value : "default") as FloatingLabelInputVariant;
}

function asSize(value: string): FloatingLabelInputSize {
  return (SIZES.includes(value) ? value : "md") as FloatingLabelInputSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, { label: string; filled: string; helper: string }> = {
  clay: { label: "Workspace name", filled: "Soft launch", helper: "Shown on every invite." },
  glass: { label: "Session title", filled: "Focus block", helper: "Visible to collaborators." },
  skeuo: { label: "Channel label", filled: "Channel A", helper: "Up to 24 characters." },
  adaptive: { label: "Billing email", filled: "you@example.com", helper: "Invoices go here." },
};

export function FloatingLabelInputPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isError = state === "error";

  return (
    <div className="w-[min(340px,100%)]">
      <FloatingLabelInput
        key={material}
        data-focus={state === "focus" ? "true" : undefined}
        defaultValue={isError ? "not-an-email" : undefined}
        disabled={state === "disabled"}
        errorText={isError ? "Enter a valid email address." : undefined}
        helperText={copy.helper}
        label={copy.label}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
