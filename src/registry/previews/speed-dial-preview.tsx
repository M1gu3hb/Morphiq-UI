"use client";

import { Copy, Pencil, Share2, Trash2 } from "lucide-react";
import { SpeedDial } from "@/registry/ui/speed-dial";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Speed Dial.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 */

type SpeedDialVariant = "default";
type SpeedDialSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SpeedDialVariant {
  return (VARIANTS.includes(value) ? value : "default") as SpeedDialVariant;
}

function asSize(value: string): SpeedDialSize {
  return (SIZES.includes(value) ? value : "md") as SpeedDialSize;
}

/** FAB accessible name differs per material so each recipe is shown doing work. */
const FAB_LABEL: Record<StyleSlug, string> = {
  clay: "Create",
  glass: "Compose",
  skeuo: "New file",
  adaptive: "Add",
};

export function SpeedDialPreview({ material, variant, size, state }: PreviewProps) {
  // Room above the FAB so the expanded stack has somewhere to go; the FAB itself
  // is pinned to the bottom of the frame where a floating action button lives.
  return (
    <div className="flex min-h-[260px] flex-col items-start justify-end gap-[16px]">
      <SpeedDial
        actions={[
          { id: "edit", label: "Edit", icon: <Pencil />, onSelect: () => {} },
          { id: "share", label: "Share", icon: <Share2 />, onSelect: () => {} },
          { id: "duplicate", label: "Duplicate", icon: <Copy />, onSelect: () => {} },
          { id: "delete", label: "Delete", icon: <Trash2 />, disabled: true, onSelect: () => {} },
        ]}
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        label={FAB_LABEL[material]}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
