"use client";

import { Copy, FileText, Share2, Trash2 } from "lucide-react";
import { SplitButton } from "@/registry/ui/split-button";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Split Button.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 */

type SplitButtonVariant = "default";
type SplitButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SplitButtonVariant {
  return (VARIANTS.includes(value) ? value : "default") as SplitButtonVariant;
}

function asSize(value: string): SplitButtonSize {
  return (SIZES.includes(value) ? value : "md") as SplitButtonSize;
}

/** Primary label copy differs per material so each recipe is shown doing work. */
const LABEL: Record<StyleSlug, string> = {
  clay: "Save",
  glass: "Publish",
  skeuo: "Export",
  adaptive: "Continue",
};

export function SplitButtonPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="flex flex-col items-start gap-[16px]">
      <SplitButton
        actions={[
          { id: "draft", label: "Save as draft", icon: <FileText />, onSelect: () => {} },
          { id: "duplicate", label: "Duplicate", icon: <Copy />, onSelect: () => {} },
          { id: "share", label: "Share a link", icon: <Share2 />, onSelect: () => {} },
          { id: "delete", label: "Delete", icon: <Trash2 />, disabled: true, onSelect: () => {} },
        ]}
        caretLabel="More save options"
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      >
        {LABEL[material]}
      </SplitButton>
    </div>
  );
}
