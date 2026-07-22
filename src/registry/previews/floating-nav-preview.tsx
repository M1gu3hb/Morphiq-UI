"use client";

import * as React from "react";
import { FloatingNav, type FloatingNavItem } from "@/registry/ui/floating-nav";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Floating Nav.
 *
 * The bar only earns its behaviour inside something that scrolls, so it is
 * mounted in a tall `overflow-y-auto` pane whose ref is handed to the
 * component: scroll the pane down and the bar tucks away, scroll back up and it
 * returns. `focus` forces the ring on the first item; the remaining states have
 * no distinct rendering on a nav bar and fall through to the default.
 */

type FloatingNavVariant = "default";
type FloatingNavSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FloatingNavVariant {
  return (VARIANTS.includes(value) ? value : "default") as FloatingNavVariant;
}

function asSize(value: string): FloatingNavSize {
  return (SIZES.includes(value) ? value : "md") as FloatingNavSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const ITEMS: Record<StyleSlug, readonly FloatingNavItem[]> = {
  clay: [
    { id: "home", label: "Home", href: "#home" },
    { id: "work", label: "Work", href: "#work" },
    { id: "studio", label: "Studio", href: "#studio" },
    { id: "journal", label: "Journal", href: "#journal" },
  ],
  glass: [
    { id: "rooms", label: "Rooms", href: "#rooms" },
    { id: "people", label: "People", href: "#people" },
    { id: "shared", label: "Shared", href: "#shared" },
    { id: "settings", label: "Settings", href: "#settings" },
  ],
  skeuo: [
    { id: "mixer", label: "Mixer", href: "#mixer" },
    { id: "routing", label: "Routing", href: "#routing" },
    { id: "effects", label: "Effects", href: "#effects" },
    { id: "output", label: "Output", href: "#output" },
  ],
  adaptive: [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "usage", label: "Usage", href: "#usage" },
    { id: "billing", label: "Billing", href: "#billing" },
    { id: "team", label: "Team", href: "#team" },
  ],
};

const FILLER = [
  "Scroll this pane downward and the bar slides away with the content.",
  "Scroll back up — even a little — and it returns, already in place.",
  "The bar is sticky, so it stays anchored to the top of this surface.",
  "Direction is tracked against the pane's own scroll, not the window's.",
  "Reduced motion keeps the bar visible the whole time, no travel.",
  "Every item is a real link, reachable by Tab with a visible ring.",
];

export function FloatingNavPreview({ material, variant, size, state }: PreviewProps) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const items = ITEMS[material];
  // Reference the coerced variant so the single declared axis is exercised.
  const resolvedVariant = asVariant(variant);

  return (
    <div
      className="relative h-[280px] w-[min(420px,100%)] overflow-y-auto rounded-[18px] border border-[color:rgba(120,120,120,0.22)] bg-[color:rgba(140,140,140,0.06)] [scrollbar-width:thin]"
      ref={scrollRef}
    >
      <FloatingNav
        activeId={items[0].id}
        aria-label="Section navigation"
        focusId={state === "focus" ? items[0].id : undefined}
        items={items}
        // Remounts when the material changes so the imperative hide/show state
        // is rebuilt cleanly against the new recipe.
        key={material}
        material={material}
        scrollContainerRef={scrollRef}
        size={asSize(size)}
        variant={resolvedVariant}
      />

      <div className="flex flex-col gap-[14px] px-[18px] pb-[28px] pt-[18px]">
        {FILLER.map((line, index) => (
          <p
            className="m-0 text-[length:13px] leading-[1.6] text-[color:rgba(90,90,90,0.92)]"
            key={index}
          >
            {line}
          </p>
        ))}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="h-[46px] rounded-[12px] border border-[color:rgba(120,120,120,0.18)] bg-[color:rgba(140,140,140,0.08)]"
            key={`block-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
