"use client";

import * as React from "react";
import { ScrollspyNav } from "@/registry/ui/scrollspy-nav";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Scrollspy Nav.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * Scrollspy needs real sections to do real work, so the preview renders the nav
 * beside a bounded scroll region full of sections and hands that region to the
 * component as the observer `root`. Scrolling the region live-updates the active
 * item and slides the rail thumb. Section ids are salted with `useId` so two
 * previews mounted at once (catalog card + detail page) never collide on a
 * global getElementById.
 *
 * `focus` forces the ring onto the active item; `disabled` dims the whole nav
 * and takes it out of the pointer path. Anything else falls through to the
 * default interactive render. Only `adaptive` is declared in the entry, but the
 * copy is keyed by the incoming material so the preview renders fine whatever it
 * receives.
 */

type ScrollspyVariant = "default";
type ScrollspySize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ScrollspyVariant {
  return (VARIANTS.includes(value) ? value : "default") as ScrollspyVariant;
}

function asSize(value: string): ScrollspySize {
  return (SIZES.includes(value) ? value : "md") as ScrollspySize;
}

type Section = { key: string; label: string; heading: string; body: string };

/** Copy differs per material so each recipe is shown doing real work. */
const SECTIONS: Record<StyleSlug, readonly Section[]> = {
  clay: [
    { key: "intro", label: "Introduction", heading: "Introduction", body: "Soft, inflated geometry with nested light. Start here for the core idea behind the clay recipe." },
    { key: "materials", label: "Materials", heading: "Materials", body: "How the surface, edge and ambient shadow combine to read as pressed from a single warm slab." },
    { key: "tokens", label: "Design tokens", heading: "Design tokens", body: "Every colour, radius and shadow travels as a custom property so a copy stays self-contained." },
    { key: "motion", label: "Motion", heading: "Motion", body: "Presses push in, releases settle out. Reduced-motion callers keep the end state without the travel." },
  ],
  glass: [
    { key: "overview", label: "Overview", heading: "Overview", body: "Translucent layers over real backdrop context, with a specular filo and controlled diffusion." },
    { key: "layers", label: "Layers", heading: "Layers", body: "Stacking rules that keep text legible as the panel floats over saturated content beneath it." },
    { key: "backdrop", label: "Backdrop", heading: "Backdrop", body: "Where blur is safe, where it is dropped, and how forced-colors falls back to an opaque surface." },
    { key: "contrast", label: "Contrast", heading: "Contrast", body: "Holding at least 4.5:1 for every label regardless of what scrolls behind the glass." },
  ],
  skeuo: [
    { key: "panel", label: "Panel", heading: "Panel", body: "A moulded plastic face lit from above, the cold machined counterpart to clay's warmth." },
    { key: "controls", label: "Controls", heading: "Controls", body: "Hardware affordances — bevels, LEDs and shade — that tell you where to push before you push." },
    { key: "texture", label: "Texture", heading: "Texture", body: "Fine grain and a hard specular bevel sell the material without tipping into nostalgia cosplay." },
    { key: "wiring", label: "Wiring", heading: "Wiring", body: "How state maps to the amber indicator so the current section reads like a lit panel light." },
  ],
  adaptive: [
    { key: "overview", label: "Overview", heading: "Overview", body: "A restrained recipe that follows the colour scheme, so the same nav reads correctly on any page." },
    { key: "installation", label: "Installation", heading: "Installation", body: "Copy the component and the cn helper; the three npm packages are cva, clsx and tailwind-merge." },
    { key: "usage", label: "Usage", heading: "Usage", body: "Pass an items array of section ids and labels. The observer promotes whichever section is in view." },
    { key: "accessibility", label: "Accessibility", heading: "Accessibility", body: "Real anchors, aria-current on the active item, a reserved rule for forced-colors, and a focus ring." },
  ],
};

export function ScrollspyNavPreview({ material, variant, size, state }: PreviewProps) {
  // Salt ids per instance so a globally-scoped getElementById never collides.
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const [rootEl, setRootEl] = React.useState<HTMLElement | null>(null);

  const sections = SECTIONS[material];
  const items = sections.map((section) => ({
    id: `${uid}-${section.key}`,
    label: section.label,
  }));

  const isDisabled = state === "disabled";
  const isFocus = state === "focus";

  return (
    <div className="flex w-full max-w-full gap-[24px]">
      <div className="w-[172px] shrink-0">
        <div className="sticky top-0">
          <ScrollspyNav
            aria-busy={state === "loading" || undefined}
            aria-disabled={isDisabled || undefined}
            aria-label="On this page"
            className={
              isFocus
                ? // Force the focus ring onto the active item without leaving the
                  // item API — the ring colour is the material's own --mq-ring.
                  "[&_[aria-current=true]]:outline-2 [&_[aria-current=true]]:outline-offset-2 [&_[aria-current=true]]:outline-[var(--mq-ring,#171817)]"
                : isDisabled
                  ? "pointer-events-none opacity-45"
                  : undefined
            }
            defaultActive={items[0].id}
            items={items}
            // Remounts when the material changes, and only then. Each material
            // names its own sections, so without this the nav keeps a
            // defaultActive that matches none of the new ids.
            key={material}
            label="On this page"
            material="adaptive"
            root={rootEl}
            size={asSize(size)}
            variant={asVariant(variant)}
          />
        </div>
      </div>
      <div
        className="h-[264px] w-full overflow-y-auto rounded-[14px] border border-black/10 bg-black/[0.015] dark:border-white/15 dark:bg-white/[0.03]"
        ref={(node) => {
          setRootEl(node);
        }}
      >
        {sections.map((section) => (
          <section
            aria-labelledby={`${uid}-${section.key}-h`}
            className="scroll-mt-[12px] border-b border-black/5 px-[18px] py-[20px] last:border-b-0 dark:border-white/5"
            id={`${uid}-${section.key}`}
            key={section.key}
          >
            <h3
              className="m-0 mb-[6px] text-[15px] font-semibold text-black dark:text-white"
              id={`${uid}-${section.key}-h`}
            >
              {section.heading}
            </h3>
            <p className="m-0 min-h-[68px] max-w-[42ch] text-[13px] leading-[1.6] text-black/60 dark:text-white/55">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
