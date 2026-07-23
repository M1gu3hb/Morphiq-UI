"use client";

import {
  Bell,
  Home,
  LayoutGrid,
  Search,
  Settings,
  Sparkles,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Navbar,
  type NavbarCta,
  type NavbarItem,
} from "@/registry/ui/navbar";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Navbar.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * Each `PreviewState` handled here maps to something the Navbar genuinely has:
 * `focus` forces the ring onto the active link (using the material's own
 * --mq-ring token, without leaving the item API), `disabled` dims the whole bar
 * and takes it out of the pointer path. Anything else falls through to the
 * default interactive render. The Navbar's layout is driven by a container query,
 * so it shows the full horizontal bar in a wide docs column and folds to the
 * hamburger + disclosed panel in a narrow one — resize to see the toggle work.
 * `onClickCapture` cancels the sample anchors so the page never jumps.
 */

type NavbarVariant = "default";
type NavbarSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): NavbarVariant {
  return (VARIANTS.includes(value) ? value : "default") as NavbarVariant;
}

function asSize(value: string): NavbarSize {
  return (SIZES.includes(value) ? value : "md") as NavbarSize;
}

const icon = (Icon: LucideIcon) => <Icon aria-hidden="true" strokeWidth={2} />;

/** Brand, items and CTA differ per material so each recipe does real work. */
const BRANDS: Record<StyleSlug, { label: string; mark: LucideIcon }> = {
  clay: { label: "Kiln", mark: Zap },
  glass: { label: "Aurora", mark: Sparkles },
  skeuo: { label: "Console", mark: LayoutGrid },
  adaptive: { label: "Nimbus", mark: Zap },
};

const ITEMS: Record<StyleSlug, readonly NavbarItem[]> = {
  clay: [
    { id: "home", label: "Home", href: "#home", icon: icon(Home), current: true },
    { id: "projects", label: "Projects", href: "#projects", icon: icon(LayoutGrid) },
    { id: "team", label: "Team", href: "#team", icon: icon(User) },
    { id: "settings", label: "Settings", href: "#settings", icon: icon(Settings) },
  ],
  glass: [
    { id: "today", label: "Today", href: "#today", icon: icon(Home) },
    { id: "explore", label: "Explore", href: "#explore", icon: icon(Search), current: true },
    { id: "alerts", label: "Alerts", href: "#alerts", icon: icon(Bell) },
  ],
  skeuo: [
    { id: "mixer", label: "Mixer", href: "#mixer", icon: icon(LayoutGrid), current: true },
    { id: "effects", label: "Effects", href: "#effects", icon: icon(Sparkles) },
    { id: "master", label: "Master", href: "#master", icon: icon(Settings) },
  ],
  adaptive: [
    { id: "overview", label: "Overview", href: "#overview", icon: icon(Home), current: true },
    { id: "usage", label: "Usage", href: "#usage", icon: icon(LayoutGrid) },
    { id: "account", label: "Account", href: "#account", icon: icon(User) },
    { id: "billing", label: "Billing", href: "#billing", icon: icon(Settings) },
  ],
};

const CTAS: Record<StyleSlug, NavbarCta> = {
  clay: { label: "Get started", href: "#start", icon: icon(Zap) },
  glass: { label: "New event", href: "#new", icon: icon(Sparkles) },
  skeuo: { label: "Render", href: "#render", icon: icon(Zap) },
  adaptive: { label: "Upgrade", href: "#upgrade", icon: icon(Sparkles) },
};

export function NavbarPreview({ material, variant, size, state }: PreviewProps) {
  const brand = BRANDS[material];
  const items = ITEMS[material];
  const isDisabled = state === "disabled";
  const isFocus = state === "focus";

  return (
    <Navbar
      aria-busy={state === "loading" || undefined}
      aria-disabled={isDisabled || undefined}
      aria-label="Product sections"
      brand={
        <>
          <brand.mark aria-hidden="true" strokeWidth={2.25} />
          {brand.label}
        </>
      }
      brandHref="#home"
      className={
        isFocus
          ? // Force the focus ring onto the active link without leaving the item
            // API — the ring colour is the material's own --mq-ring token.
            "[&_[aria-current=page]]:outline-2 [&_[aria-current=page]]:outline-offset-[2px] [&_[aria-current=page]]:outline-[var(--mq-ring,#171817)]"
          : isDisabled
            ? "pointer-events-none opacity-45"
            : undefined
      }
      cta={CTAS[material]}
      items={items}
      // Remounts when the material changes: each material names its own brand,
      // items and CTA, so a clean render is simpler than reconciling all three.
      key={material}
      material={material}
      menuLabel="Open navigation"
      // The sample anchors would navigate to their hashes and scroll the docs;
      // cancel that in the capture phase so the bar stays put while the reader
      // hovers, focuses and (in a narrow column) opens the disclosed panel.
      onClickCapture={(event) => {
        if ((event.target as HTMLElement).closest("a")) event.preventDefault();
      }}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
