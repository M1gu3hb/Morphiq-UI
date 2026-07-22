"use client";

import {
  Calendar,
  Camera,
  Compass,
  Files,
  Folder,
  House,
  Image,
  Mail,
  MessageSquare,
  Music,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Dock, DockIcon } from "@/registry/ui/dock";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Dock.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * Every `PreviewState` maps to something a Dock genuinely has: `focus` forces
 * the ring on the first icon, `disabled` disables every control. The remaining
 * states fall through to the default render, because magnification is a
 * pointer-only affordance a static preview cannot enter.
 */

type DockVariant = "default";
type DockSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): DockVariant {
  return (VARIANTS.includes(value) ? value : "default") as DockVariant;
}

function asSize(value: string): DockSize {
  return (SIZES.includes(value) ? value : "md") as DockSize;
}

type DockItem = { label: string; icon: LucideIcon; active?: boolean };

/** A distinct, believable set of destinations per material. */
const ITEMS: Record<StyleSlug, DockItem[]> = {
  clay: [
    { label: "Home", icon: House, active: true },
    { label: "Search", icon: Search },
    { label: "Messages", icon: MessageSquare },
    { label: "Music", icon: Music },
    { label: "Settings", icon: Settings },
  ],
  glass: [
    { label: "Files", icon: Files, active: true },
    { label: "Photos", icon: Image },
    { label: "Camera", icon: Camera },
    { label: "Mail", icon: Mail },
    { label: "Settings", icon: Settings },
  ],
  skeuo: [
    { label: "Finder", icon: Folder, active: true },
    { label: "Calendar", icon: Calendar },
    { label: "Music", icon: Music },
    { label: "Maps", icon: Compass },
    { label: "Settings", icon: Settings },
  ],
  adaptive: [
    { label: "Overview", icon: House, active: true },
    { label: "Search", icon: Search },
    { label: "Inbox", icon: Mail },
    { label: "Files", icon: Files },
    { label: "Settings", icon: Settings },
  ],
};

export function DockPreview({ material, variant, size, state }: PreviewProps) {
  const items = ITEMS[material];
  const isDisabled = state === "disabled";

  return (
    <Dock
      aria-label="Application dock"
      // Remounts when the material changes, and only then. Each material names
      // its own destinations, so a stale registry of icon updaters can never
      // outlive the icons it was measuring.
      key={material}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      {items.map((item, index) => (
        <DockIcon
          active={item.active}
          data-focus={state === "focus" && index === 0 ? "true" : undefined}
          disabled={isDisabled}
          icon={item.icon}
          key={item.label}
          label={item.label}
        />
      ))}
    </Dock>
  );
}
