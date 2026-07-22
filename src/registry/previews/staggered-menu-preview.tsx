"use client";

import { StaggeredMenu, type StaggeredMenuItem } from "@/registry/ui/staggered-menu";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Staggered Menu.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * The menu starts closed — its overlay is a viewport-fixed modal, so it belongs
 * behind an explicit open, which the reader performs. `disabled` disables the
 * trigger and `focus` forces its ring; `loading` and `error` fall through to the
 * default render because a menu trigger has neither state.
 */

type StaggeredMenuSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): "default" {
  return (VARIANTS.includes(value) ? value : "default") as "default";
}

function asSize(value: string): StaggeredMenuSize {
  return (SIZES.includes(value) ? value : "md") as StaggeredMenuSize;
}

type MenuConfig = { trigger: string; menu: string; items: StaggeredMenuItem[] };

/** Copy differs per material so each recipe is shown doing real work. */
const MENUS: Record<StyleSlug, MenuConfig> = {
  clay: {
    trigger: "Menu",
    menu: "Workspace",
    items: [
      { id: "overview", label: "Overview", href: "#overview", current: true },
      { id: "deploys", label: "Deploys", href: "#deploys" },
      { id: "activity", label: "Activity", href: "#activity" },
      { id: "settings", label: "Settings", href: "#settings" },
      { id: "archived", label: "Archived", disabled: true },
    ],
  },
  glass: {
    trigger: "Rooms",
    menu: "Session",
    items: [
      { id: "stage", label: "Stage", href: "#stage", current: true },
      { id: "people", label: "People", href: "#people" },
      { id: "notes", label: "Shared notes", href: "#notes" },
      { id: "recordings", label: "Recordings", href: "#recordings" },
    ],
  },
  skeuo: {
    trigger: "Console",
    menu: "Routing",
    items: [
      { id: "channel", label: "Channel A", href: "#channel", current: true },
      { id: "bus", label: "Bus routing", href: "#bus" },
      { id: "meters", label: "Meters", href: "#meters" },
      { id: "presets", label: "Presets", href: "#presets" },
      { id: "calibrate", label: "Calibrate", disabled: true },
    ],
  },
  adaptive: {
    trigger: "Menu",
    menu: "Account",
    items: [
      { id: "summary", label: "Summary", href: "#summary", current: true },
      { id: "invoices", label: "Invoices", href: "#invoices" },
      { id: "team", label: "Team", href: "#team" },
      { id: "billing", label: "Billing", href: "#billing" },
    ],
  },
};

export function StaggeredMenuPreview({ material, variant, size, state }: PreviewProps) {
  const config = MENUS[material];

  return (
    <StaggeredMenu
      // Only one variant exists; the opaque value is still coerced so the axis
      // is validated the same way size is.
      data-variant={asVariant(variant)}
      data-focus={state === "focus" ? "true" : undefined}
      disabled={state === "disabled"}
      items={config.items}
      // Remounts when the material changes, and only then, so the open/closed
      // state does not leak from one recipe into the next.
      key={material}
      material={material}
      menuLabel={config.menu}
      size={asSize(size)}
      triggerLabel={config.trigger}
    />
  );
}
