"use client";

import { Camera, Pencil, Plus, Share2 } from "lucide-react";
import { Fab, type FabAction } from "@/registry/ui/fab";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the FAB.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * The FAB is meant to be pinned to a viewport corner in real use. Here it is NOT
 * pinned — it sits inside a `position: relative` stage so the speed-dial opens
 * upward *within* the catalog card instead of floating over the whole page.
 */

type FabVariant = "default";
type FabSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FabVariant {
  return (VARIANTS.includes(value) ? value : "default") as FabVariant;
}

function asSize(value: string): FabSize {
  return (SIZES.includes(value) ? value : "md") as FabSize;
}

/** Accessible name for the trigger; differs per material so each does real work. */
const LABEL: Record<StyleSlug, string> = {
  clay: "Compose",
  glass: "Compose",
  skeuo: "Compose",
  adaptive: "Compose",
};

const ACTIONS: FabAction[] = [
  { id: "edit", label: "Write note", icon: <Pencil aria-hidden="true" /> },
  { id: "photo", label: "Add photo", icon: <Camera aria-hidden="true" /> },
  { id: "share", label: "Share", icon: <Share2 aria-hidden="true" /> },
];

export function FabPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="relative flex min-h-[240px] w-full items-end justify-center pb-[8px]">
      <Fab
        actions={ACTIONS}
        aria-label={LABEL[material]}
        data-focus={state === "focus" ? "true" : undefined}
        data-variant={asVariant(variant)}
        disabled={state === "disabled"}
        icon={<Plus aria-hidden="true" />}
        // Reset the open/close state when the material switcher flips materials.
        key={material}
        material={material}
        menuLabel="Compose actions"
        size={asSize(size)}
      />
    </div>
  );
}
