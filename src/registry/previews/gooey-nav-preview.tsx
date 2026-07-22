"use client";

import { GooeyNav, type GooeyNavItem } from "@/registry/ui/gooey-nav";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Gooey Nav.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * Every `PreviewState` handled here maps to something a Gooey Nav genuinely has:
 * `focus` forces the ring on the active item, `disabled` dims the whole bar and
 * takes it out of the pointer path. Anything else falls through to the default
 * interactive render. The demo lets the reader click through the items live and
 * watch the blob stretch between them — `onClickCapture` cancels the anchors'
 * navigation so the page never jumps while the internal active state updates.
 */

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

type GooeyNavVariant = "default";
type GooeyNavSize = "sm" | "md" | "lg";

function asVariant(value: string): GooeyNavVariant {
  return (VARIANTS.includes(value) ? value : "default") as GooeyNavVariant;
}

function asSize(value: string): GooeyNavSize {
  return (SIZES.includes(value) ? value : "md") as GooeyNavSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const ITEMS: Record<StyleSlug, readonly GooeyNavItem[]> = {
  clay: [
    { id: "home", label: "Home", href: "#home" },
    { id: "projects", label: "Projects", href: "#projects" },
    { id: "team", label: "Team", href: "#team" },
    { id: "settings", label: "Settings", href: "#settings" },
  ],
  glass: [
    { id: "today", label: "Today", href: "#today" },
    { id: "upcoming", label: "Upcoming", href: "#upcoming" },
    { id: "calendar", label: "Calendar", href: "#calendar" },
  ],
  skeuo: [
    { id: "mixer", label: "Mixer", href: "#mixer" },
    { id: "effects", label: "Effects", href: "#effects" },
    { id: "master", label: "Master", href: "#master" },
  ],
  adaptive: [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "usage", label: "Usage", href: "#usage" },
    { id: "billing", label: "Billing", href: "#billing" },
    { id: "team", label: "Team", href: "#team" },
  ],
};

export function GooeyNavPreview({ material, variant, size, state }: PreviewProps) {
  const items = ITEMS[material];
  const isDisabled = state === "disabled";
  const isFocus = state === "focus";

  return (
    <GooeyNav
      aria-busy={state === "loading" || undefined}
      aria-disabled={isDisabled || undefined}
      aria-label="Workspace sections"
      className={
        isFocus
          ? // Force the focus ring onto the active item without leaving the item
            // API — the ring colour is the material's own --mq-ring token.
            "[&_[aria-current=page]]:outline-2 [&_[aria-current=page]]:outline-offset-[2px] [&_[aria-current=page]]:outline-[var(--mq-ring,#171817)]"
          : isDisabled
            ? "pointer-events-none opacity-45"
            : undefined
      }
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
  );
}
