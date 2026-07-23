"use client";

import { Archive, FilePlus, Link2, Moon, Search, Settings, Sun, UserPlus } from "lucide-react";
import { CommandMenu, type CommandGroup } from "@/registry/ui/command-menu";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Command Menu.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 */

type CommandMenuVariant = "default";
type CommandMenuSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): CommandMenuVariant {
  return (VARIANTS.includes(value) ? value : "default") as CommandMenuVariant;
}

function asSize(value: string): CommandMenuSize {
  return (SIZES.includes(value) ? value : "md") as CommandMenuSize;
}

/** Realistic palette of commands so each material is shown doing real work. */
const GROUPS: CommandGroup[] = [
  {
    id: "suggestions",
    heading: "Suggestions",
    items: [
      { id: "new-file", label: "New File", icon: <FilePlus />, shortcut: "⌘N", onSelect: () => {} },
      { id: "search", label: "Search Files", icon: <Search />, shortcut: "⌘P", onSelect: () => {} },
      { id: "settings", label: "Open Settings", icon: <Settings />, shortcut: "⌘,", onSelect: () => {} },
    ],
  },
  {
    id: "actions",
    heading: "Actions",
    items: [
      { id: "copy-link", label: "Copy Link", icon: <Link2 />, onSelect: () => {} },
      { id: "invite", label: "Invite People", icon: <UserPlus />, onSelect: () => {} },
      { id: "archive", label: "Archive Project", icon: <Archive />, disabled: true, onSelect: () => {} },
    ],
  },
  {
    id: "theme",
    heading: "Theme",
    items: [
      { id: "light", label: "Light Mode", icon: <Sun />, onSelect: () => {} },
      { id: "dark", label: "Dark Mode", icon: <Moon />, onSelect: () => {} },
    ],
  },
];

/** Trigger copy differs per material so each recipe is shown doing work. */
const LABEL: Record<StyleSlug, string> = {
  clay: "Search commands…",
  glass: "Find anything…",
  skeuo: "Jump to…",
  adaptive: "Type a command…",
};

export function CommandMenuPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="flex flex-col items-start gap-[16px]">
      <CommandMenu
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        groups={GROUPS}
        label="Command menu"
        material={material}
        placeholder="Type a command or search…"
        size={asSize(size)}
        triggerLabel={LABEL[material]}
        variant={asVariant(variant)}
      />
    </div>
  );
}
