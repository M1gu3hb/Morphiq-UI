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
 * Note on the `loading` slot: `PreviewState` is
 * `default | focus | loading | disabled`, and a text field has no loading
 * behaviour — but it very much has an *error* state, which is the one a reader
 * needs to see. So the docs surface reuses that slot to show the invalid field,
 * and the rendered copy says so out loud rather than pretending. Adding an
 * `error` member to `PreviewState` would mean editing the shared
 * `src/registry/schema.ts`, which this round's guardrail forbids; it is written
 * up in the report as a change for the orchestrator to make.
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
  const isError = state === "loading";

  return (
    <div className="w-[min(340px,100%)]">
      <InputField
        data-focus={state === "focus" ? "true" : undefined}
        defaultValue={isError ? "not-an-email" : ""}
        disabled={state === "disabled"}
        errorText={isError ? "Enter a valid address — this is the error state." : undefined}
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
