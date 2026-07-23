"use client";

import {
  Bell,
  CalendarDays,
  Compass,
  CreditCard,
  Home,
  LayoutGrid,
  Library,
  ListMusic,
  Search,
  Settings,
  Sliders,
  User,
} from "lucide-react";
import {
  BottomNavigation,
  type BottomNavigationItem,
} from "@/registry/ui/bottom-navigation";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Bottom Navigation.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * Every `PreviewState` handled here maps to something a Bottom Navigation
 * genuinely has: `focus` forces the ring onto the active item, `disabled` dims
 * the whole bar and takes it out of the pointer path. Anything else falls through
 * to the default interactive render. The demo lets the reader tap through the
 * items and watch the pill slide — `onClickCapture` cancels the anchors'
 * navigation so the page never jumps while the internal active state updates.
 */

type BottomNavVariant = "default";
type BottomNavSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): BottomNavVariant {
  return (VARIANTS.includes(value) ? value : "default") as BottomNavVariant;
}

function asSize(value: string): BottomNavSize {
  return (SIZES.includes(value) ? value : "md") as BottomNavSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const ITEMS: Record<StyleSlug, readonly BottomNavigationItem[]> = {
  clay: [
    { id: "home", label: "Home", href: "#home", icon: Home },
    { id: "search", label: "Search", href: "#search", icon: Search },
    { id: "alerts", label: "Alerts", href: "#alerts", icon: Bell },
    { id: "profile", label: "Profile", href: "#profile", icon: User },
  ],
  glass: [
    { id: "today", label: "Today", href: "#today", icon: CalendarDays },
    { id: "explore", label: "Explore", href: "#explore", icon: Compass },
    { id: "spaces", label: "Spaces", href: "#spaces", icon: LayoutGrid },
  ],
  skeuo: [
    { id: "library", label: "Library", href: "#library", icon: Library },
    { id: "browse", label: "Browse", href: "#browse", icon: ListMusic },
    { id: "mix", label: "Mix", href: "#mix", icon: Sliders },
    { id: "account", label: "Account", href: "#account", icon: User },
  ],
  adaptive: [
    { id: "overview", label: "Overview", href: "#overview", icon: Home },
    { id: "billing", label: "Billing", href: "#billing", icon: CreditCard },
    { id: "alerts", label: "Alerts", href: "#alerts", icon: Bell },
    { id: "settings", label: "Settings", href: "#settings", icon: Settings },
  ],
};

export function BottomNavigationPreview({ material, variant, size, state }: PreviewProps) {
  const items = ITEMS[material];
  const isDisabled = state === "disabled";
  const isFocus = state === "focus";

  return (
    <div className="w-full max-w-[420px]">
      <BottomNavigation
        aria-busy={state === "loading" || undefined}
        aria-disabled={isDisabled || undefined}
        aria-label="App sections"
        className={
          isFocus
            ? // Force the focus ring onto the active item without leaving the item
              // API — the ring colour is the material's own --mq-ring token.
              "[&_[aria-current=page]]:outline-2 [&_[aria-current=page]]:outline-offset-[2px] [&_[aria-current=page]]:outline-[var(--mq-ring,#171817)]"
            : isDisabled
              ? "pointer-events-none opacity-45"
              : undefined
        }
        // Uncontrolled: start on the second item so the pill has somewhere to
        // slide from as the reader taps around.
        defaultActive={items[1].id}
        items={items}
        // Remounts when the material changes, and only then. Each material names
        // its own items, so without this the bar keeps a `defaultActive` that
        // matches none of the new ids and renders with no active item at all.
        key={material}
        material={material}
        // Anchors would navigate to their hashes and scroll the docs; cancel that
        // in the capture phase while the item's own click still updates the active
        // state in the bubble phase.
        onClickCapture={(event) => {
          if ((event.target as HTMLElement).closest("a")) event.preventDefault();
        }}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
