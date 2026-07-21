"use client";

import { InputField } from "@/registry/ui/input";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Input.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * The invalid field is shown under the `error` state, which is a real member of
 * `PreviewState`. It used to borrow the `loading` slot, because no `error` state
 * existed yet and a text field has no loading behaviour to show there — so the
 * switch said "loading" while the field said "invalid". That is fixed: `error`
 * now means error, and `loading` falls through to the default render because
 * this control genuinely has nothing to show for it.
 */

type InputVariant = "default" | "filled" | "underline";
type InputSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "filled", "underline"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): InputVariant {
  return (VARIANTS.includes(value) ? value : "default") as InputVariant;
}

function asSize(value: string): InputSize {
  return (SIZES.includes(value) ? value : "md") as InputSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, { label: string; placeholder: string; helper: string }> = {
  clay: { label: "Workspace name", placeholder: "Soft launch", helper: "Shown on every invite." },
  glass: { label: "Session title", placeholder: "Focus block", helper: "Visible to collaborators." },
  skeuo: { label: "Channel label", placeholder: "Channel A", helper: "Up to 24 characters." },
  adaptive: { label: "Billing email", placeholder: "you@example.com", helper: "Invoices go here." },
};

export function InputPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isError = state === "error";

  return (
    <div className="w-[min(340px,100%)]">
      <InputField
        data-focus={state === "focus" ? "true" : undefined}
        defaultValue={isError ? "not-an-email" : ""}
        disabled={state === "disabled"}
        errorText={isError ? "Enter a valid email address." : undefined}
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
