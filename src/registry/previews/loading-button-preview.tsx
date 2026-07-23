"use client";

import { LoadingButton } from "@/registry/ui/loading-button";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Loading Button.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type LoadingButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): "default" {
  return (VARIANTS.includes(value) ? value : "default") as "default";
}

function asSize(value: string): LoadingButtonSize {
  return (SIZES.includes(value) ? value : "md") as LoadingButtonSize;
}

/** Label copy differs per material so each recipe is shown doing real work. */
const LABEL: Record<StyleSlug, string> = {
  clay: "Save changes",
  glass: "Publish post",
  skeuo: "Sync now",
  adaptive: "Continue",
};

/** Visible + accessible busy label used when the loading state is forced. */
const LOADING_TEXT: Record<StyleSlug, string> = {
  clay: "Saving…",
  glass: "Publishing…",
  skeuo: "Syncing…",
  adaptive: "Working…",
};

export function LoadingButtonPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="flex flex-col items-start gap-[16px]">
      <LoadingButton
        key={material}
        data-focus={state === "focus" ? "true" : undefined}
        data-variant={asVariant(variant)}
        disabled={state === "disabled"}
        loading={state === "loading"}
        loadingText={LOADING_TEXT[material]}
        material={material}
        size={asSize(size)}
      >
        {LABEL[material]}
      </LoadingButton>
    </div>
  );
}
