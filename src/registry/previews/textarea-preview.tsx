"use client";

import { TextareaField } from "@/registry/ui/textarea";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Textarea.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * `loading` falls through to the default render: a text field has no loading
 * behaviour, and inventing one would document something the component cannot do.
 */

type TextareaVariant = "default" | "filled" | "underline";
type TextareaSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "filled", "underline"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TextareaVariant {
  return (VARIANTS.includes(value) ? value : "default") as TextareaVariant;
}

function asSize(value: string): TextareaSize {
  return (SIZES.includes(value) ? value : "md") as TextareaSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<
  StyleSlug,
  { label: string; placeholder: string; helper: string; text: string }
> = {
  clay: {
    label: "Release notes",
    placeholder: "What changed in this build?",
    helper: "Shown on the deploy timeline.",
    text: "Rolled the new promotion rule out to 12% of traffic. Nothing regressed overnight.",
  },
  glass: {
    label: "Session agenda",
    placeholder: "What are we covering?",
    helper: "Visible to everyone in the room.",
    text: "Walk through the focus-mode rework, then twenty minutes on the handoff format.",
  },
  skeuo: {
    label: "Take notes",
    placeholder: "Anything worth remembering?",
    helper: "Stored with the session file.",
    text: "Channel A ran clean at -6 dB. The limiter never engaged on this take.",
  },
  adaptive: {
    label: "Billing note",
    placeholder: "Add context for finance",
    helper: "Appears on the invoice PDF.",
    text: "Seat count rose to 18 mid-cycle; the difference is prorated on this invoice.",
  },
};

export function TextareaPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isError = state === "error";

  return (
    <div className="w-[min(340px,100%)]">
      <TextareaField
        autoResize
        // Remounts when the material changes so the demo text tracks the copy
        // for that recipe; the control is uncontrolled, so without this the
        // first material's text would stick.
        key={material}
        data-focus={state === "focus" ? "true" : undefined}
        defaultValue={isError ? "aaa" : copy.text}
        disabled={state === "disabled"}
        errorText={isError ? "Add at least twenty characters." : undefined}
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
