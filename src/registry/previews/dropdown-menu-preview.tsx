"use client";

import { Copy, Pencil, Share2, Star, Trash2 } from "lucide-react";
import { DropdownMenu } from "@/registry/ui/dropdown-menu";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Dropdown Menu.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 */

type DropdownMenuVariant = "default";
type DropdownMenuSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): DropdownMenuVariant {
  return (VARIANTS.includes(value) ? value : "default") as DropdownMenuVariant;
}

function asSize(value: string): DropdownMenuSize {
  return (SIZES.includes(value) ? value : "md") as DropdownMenuSize;
}

/** Trigger label differs per material so each recipe is shown doing work. */
const LABEL: Record<StyleSlug, string> = {
  clay: "Actions",
  glass: "Options",
  skeuo: "File",
  adaptive: "Menu",
};

export function DropdownMenuPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="flex flex-col items-start gap-[16px]">
      <DropdownMenu
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        items={[
          { id: "edit", label: "Edit", icon: <Pencil />, onSelect: () => {} },
          { id: "duplicate", label: "Duplicate", icon: <Copy />, onSelect: () => {} },
          { id: "favorite", label: "Add to favorites", icon: <Star />, onSelect: () => {} },
          { id: "share", label: "Share a link", icon: <Share2 />, onSelect: () => {} },
          { id: "sep-1", separator: true },
          { id: "delete", label: "Delete", icon: <Trash2 />, disabled: true, onSelect: () => {} },
        ]}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      >
        {LABEL[material]}
      </DropdownMenu>
    </div>
  );
}
