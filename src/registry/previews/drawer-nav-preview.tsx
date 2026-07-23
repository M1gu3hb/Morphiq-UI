"use client";

import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Folder,
  Home,
  LayoutGrid,
  Music,
  Settings,
  Sliders,
  Users,
} from "lucide-react";
import { DrawerNav, type DrawerNavItem } from "@/registry/ui/drawer-nav";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Drawer Nav.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * The trigger is shown in a small mock top bar so the reader sees it in situ — a
 * wordmark on one side, the drawer trigger on the other, the way a real site
 * header places it. Opening it reveals the bounded side panel doing exactly what
 * it does in production.
 *
 * `variant` and `size` arrive as opaque strings and are narrowed to this
 * component's own unions. `focus` forces the ring on the trigger via `data-focus`;
 * `disabled` renders a trigger that cannot be opened; every other state falls
 * through to the default render, where the live panel shows its own focus rings.
 */

type DrawerNavVariant = "default";
type DrawerNavSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): DrawerNavVariant {
  return (VARIANTS.includes(value) ? value : "default") as DrawerNavVariant;
}

function asSize(value: string): DrawerNavSize {
  return (SIZES.includes(value) ? value : "md") as DrawerNavSize;
}

/** Nav content differs per material so each recipe is shown doing real work. */
const NAV: Record<StyleSlug, DrawerNavItem[]> = {
  clay: [
    { id: "home", label: "Home", href: "#home", icon: <Home /> },
    { id: "projects", label: "Projects", href: "#projects", icon: <LayoutGrid />, current: true },
    { id: "team", label: "Team", href: "#team", icon: <Users /> },
    { id: "files", label: "Files", href: "#files", icon: <Folder /> },
    { id: "settings", label: "Settings", href: "#settings", icon: <Settings /> },
  ],
  glass: [
    { id: "today", label: "Today", href: "#today", icon: <Calendar />, current: true },
    { id: "inbox", label: "Inbox", href: "#inbox", icon: <Bell /> },
    { id: "people", label: "People", href: "#people", icon: <Users /> },
    { id: "settings", label: "Settings", href: "#settings", icon: <Settings /> },
  ],
  skeuo: [
    { id: "mixer", label: "Mixer", href: "#mixer", icon: <Sliders /> },
    { id: "library", label: "Library", href: "#library", icon: <Music />, current: true },
    { id: "presets", label: "Presets", href: "#presets", icon: <Folder /> },
    { id: "notes", label: "Notes", href: "#notes", icon: <FileText /> },
    { id: "settings", label: "Settings", href: "#settings", icon: <Settings /> },
  ],
  adaptive: [
    { id: "overview", label: "Overview", href: "#overview", icon: <LayoutGrid /> },
    { id: "billing", label: "Billing", href: "#billing", icon: <CreditCard />, current: true },
    { id: "team", label: "Team", href: "#team", icon: <Users /> },
    { id: "settings", label: "Settings", href: "#settings", icon: <Settings /> },
  ],
};

/** Copy + slide direction differ per material so both edges are demonstrated. */
const CONFIG: Record<StyleSlug, { title: string; side: "left" | "right" }> = {
  clay: { title: "Navigation", side: "left" },
  glass: { title: "Menu", side: "right" },
  skeuo: { title: "Console", side: "left" },
  adaptive: { title: "Workspace", side: "right" },
};

export function DrawerNavPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const isDisabled = state === "disabled";
  const isFocus = state === "focus";
  const config = CONFIG[material];

  return (
    <div
      className="flex w-[min(360px,100%)] items-center justify-between rounded-[16px] border border-black/10 px-[18px] py-[12px] dark:border-white/15"
      data-variant={resolvedVariant}
    >
      <span className="text-[length:15px] font-extrabold tracking-[-0.02em] text-[color:currentColor]">
        Morphiq
      </span>
      <DrawerNav
        buttonLabel="Open navigation"
        // Force the focus ring on the trigger without leaving the item API — the
        // ring colour is the material's own --mq-ring token.
        data-focus={isFocus ? "true" : undefined}
        disabled={isDisabled}
        items={NAV[material]}
        // Resets the internal open state when the material changes, so switching
        // recipes never leaves a stale panel mounted.
        key={material}
        material={material}
        side={config.side}
        size={asSize(size)}
        title={config.title}
        variant={resolvedVariant}
      />
    </div>
  );
}
