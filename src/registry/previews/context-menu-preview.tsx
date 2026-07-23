"use client";

import { ClipboardPaste, Copy, Download, PenLine, Scissors, Trash2 } from "lucide-react";
import { ContextMenu } from "@/registry/ui/context-menu";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Context Menu.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 */

type ContextMenuVariant = "default";
type ContextMenuSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ContextMenuVariant {
  return (VARIANTS.includes(value) ? value : "default") as ContextMenuVariant;
}

function asSize(value: string): ContextMenuSize {
  return (SIZES.includes(value) ? value : "md") as ContextMenuSize;
}

/** Region heading differs per material so each recipe is shown doing real work. */
const TITLE: Record<StyleSlug, string> = {
  clay: "Layer thumbnail",
  glass: "Media tile",
  skeuo: "Desktop icon",
  adaptive: "Table row",
};

export function ContextMenuPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="flex flex-col items-start gap-[16px]">
      <ContextMenu
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        items={[
          { id: "cut", label: "Cut", icon: <Scissors />, onSelect: () => {} },
          { id: "copy", label: "Copy", icon: <Copy />, onSelect: () => {} },
          { id: "paste", label: "Paste", icon: <ClipboardPaste />, onSelect: () => {} },
          { id: "rename", label: "Rename", icon: <PenLine />, onSelect: () => {} },
          { id: "download", label: "Download", icon: <Download />, onSelect: () => {} },
          { id: "delete", label: "Delete", icon: <Trash2 />, disabled: true, onSelect: () => {} },
        ]}
        material={material}
        menuLabel={`${TITLE[material]} actions`}
        regionLabel={`${TITLE[material]} — right-click, or press Shift+F10, to open the context menu`}
        size={asSize(size)}
        title={TITLE[material]}
        variant={asVariant(variant)}
      />
    </div>
  );
}
