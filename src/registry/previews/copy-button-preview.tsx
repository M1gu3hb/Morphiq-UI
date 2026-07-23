"use client";

import { CopyButton } from "@/registry/ui/copy-button";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Copy Button.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type CopyButtonVariant = "default";
type CopyButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): CopyButtonVariant {
  return (VARIANTS.includes(value) ? value : "default") as CopyButtonVariant;
}

function asSize(value: string): CopyButtonSize {
  return (SIZES.includes(value) ? value : "md") as CopyButtonSize;
}

/** The clipboard payload differs per material so each recipe is shown doing real work. */
const VALUE: Record<StyleSlug, string> = {
  clay: "npm i @morphiq/clay",
  glass: "https://morphiq.ui/glass",
  skeuo: "MQ-8F2C-KEY",
  adaptive: "adaptive@latest",
};

export function CopyButtonPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="flex flex-wrap items-center gap-[16px]">
      <CopyButton
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        material={material}
        size={asSize(size)}
        value={VALUE[material]}
        variant={asVariant(variant)}
      />
      {/* Icon-only specimen: no visible text, so an accessible name is supplied. */}
      <CopyButton
        aria-label="Copy value to clipboard"
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        iconOnly
        material={material}
        size={asSize(size)}
        value={VALUE[material]}
        variant={asVariant(variant)}
      />
    </div>
  );
}
