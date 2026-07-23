"use client";

import { Bell, Heart, Plus, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { IconButton } from "@/registry/ui/icon-button";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Icon Button.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type IconButtonVariant = "square" | "circle";
type IconButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["square", "circle"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): IconButtonVariant {
  return (VARIANTS.includes(value) ? value : "square") as IconButtonVariant;
}

function asSize(value: string): IconButtonSize {
  return (SIZES.includes(value) ? value : "md") as IconButtonSize;
}

/** Icon + accessible name differ per material so each recipe is shown doing
 *  real work with a genuine, spoken label rather than a decorative glyph. */
const ICON: Record<StyleSlug, LucideIcon> = {
  clay: Heart,
  glass: Settings,
  skeuo: Plus,
  adaptive: Bell,
};

const LABEL: Record<StyleSlug, string> = {
  clay: "Add to favorites",
  glass: "Open settings",
  skeuo: "Create new",
  adaptive: "Notifications",
};

export function IconButtonPreview({ material, variant, size, state }: PreviewProps) {
  const Icon = ICON[material];

  return (
    <div className="flex flex-col items-start gap-[16px]">
      <IconButton
        aria-label={LABEL[material]}
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      >
        <Icon aria-hidden="true" />
      </IconButton>
    </div>
  );
}
