"use client";

import {
  HamburgerMenuOverlay,
  type HamburgerMenuItem,
} from "@/registry/ui/hamburger-menu-overlay";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Hamburger Menu Overlay.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * The trigger is shown in a small mock top bar so the reader sees it in situ —
 * a wordmark on the left, the hamburger on the right, the way a real site header
 * places it. Opening it reveals the full-screen overlay, which is the component
 * doing exactly what it does in production.
 *
 * `variant` and `size` arrive as opaque strings and are narrowed to this
 * component's own unions. Of the deterministic states only `disabled` maps onto
 * something the menu really has — a trigger that cannot be opened; the rest fall
 * through to the default render, where the live button shows its own focus ring.
 */

type HamburgerVariant = "default";
type HamburgerSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): HamburgerVariant {
  return (VARIANTS.includes(value) ? value : "default") as HamburgerVariant;
}

function asSize(value: string): HamburgerSize {
  return (SIZES.includes(value) ? value : "md") as HamburgerSize;
}

/** Nav content differs per material so each recipe is shown doing real work. */
const NAV: Record<StyleSlug, HamburgerMenuItem[]> = {
  clay: [
    { id: "home", label: "Home", href: "#home" },
    { id: "work", label: "Work", href: "#work", current: true },
    { id: "studio", label: "Studio", href: "#studio" },
    { id: "journal", label: "Journal", href: "#journal" },
    { id: "contact", label: "Contact", href: "#contact" },
  ],
  glass: [
    { id: "today", label: "Today", href: "#today", current: true },
    { id: "spaces", label: "Spaces", href: "#spaces" },
    { id: "people", label: "People", href: "#people" },
    { id: "settings", label: "Settings", href: "#settings" },
  ],
  skeuo: [
    { id: "mixer", label: "Mixer", href: "#mixer" },
    { id: "library", label: "Library", href: "#library", current: true },
    { id: "routing", label: "Routing", href: "#routing" },
    { id: "presets", label: "Presets", href: "#presets" },
    { id: "about", label: "About", href: "#about" },
  ],
  adaptive: [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "billing", label: "Billing", href: "#billing", current: true },
    { id: "team", label: "Team", href: "#team" },
    { id: "usage", label: "Usage", href: "#usage" },
  ],
};

export function HamburgerMenuOverlayPreview({ material, variant, size, state }: PreviewProps) {
  // The component ships a single "default" variant, so the coercion narrows the
  // opaque string and is surfaced as a data attribute rather than branched on.
  const resolvedVariant = asVariant(variant);
  const isDisabled = state === "disabled";

  return (
    <div
      className="flex w-[min(360px,100%)] items-center justify-between rounded-[16px] border border-black/10 px-[18px] py-[12px] dark:border-white/15"
      data-variant={resolvedVariant}
    >
      <span className="text-[length:15px] font-extrabold tracking-[-0.02em] text-[color:currentColor]">
        Morphiq
      </span>
      <HamburgerMenuOverlay
        buttonLabel="Menu"
        disabled={isDisabled}
        // Resets the internal open state when the material changes, so switching
        // recipes never leaves a stale overlay mounted.
        key={material}
        items={NAV[material]}
        material={material}
        menuLabel="Main menu"
        size={asSize(size)}
      />
    </div>
  );
}
