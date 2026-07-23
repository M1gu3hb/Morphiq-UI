"use client";

import { ShareButton } from "@/registry/ui/share-button";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Share Button.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 */

type ShareButtonVariant = "default";
type ShareButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ShareButtonVariant {
  return (VARIANTS.includes(value) ? value : "default") as ShareButtonVariant;
}

function asSize(value: string): ShareButtonSize {
  return (SIZES.includes(value) ? value : "md") as ShareButtonSize;
}

/** Trigger label and shared link differ per material so each recipe does work. */
const LABEL: Record<StyleSlug, string> = {
  clay: "Share",
  glass: "Share link",
  skeuo: "Share file",
  adaptive: "Share page",
};

const SHARE: Record<StyleSlug, { url: string; title: string }> = {
  clay: { url: "https://morphiq.dev/components/share-button", title: "Share Button — Morphiq UI" },
  glass: { url: "https://morphiq.dev/blog/glass-that-stays-legible", title: "Glass that stays legible" },
  skeuo: { url: "https://morphiq.dev/downloads/press-kit.zip", title: "Morphiq press kit" },
  adaptive: { url: "https://morphiq.dev/docs/adaptive-materials", title: "Adaptive materials, explained" },
};

export function ShareButtonPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="flex flex-col items-start gap-[16px]">
      <ShareButton
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        material={material}
        shareTitle={SHARE[material].title}
        size={asSize(size)}
        url={SHARE[material].url}
        variant={asVariant(variant)}
      >
        {LABEL[material]}
      </ShareButton>
    </div>
  );
}
