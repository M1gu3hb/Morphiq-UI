"use client";

import {
  Blocks,
  BookOpen,
  Boxes,
  Code2,
  Compass,
  Gauge,
  LifeBuoy,
  Palette,
  Rocket,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { MegaMenu, type MegaMenuSection } from "@/registry/ui/mega-menu";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Mega Menu.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * Each `PreviewState` handled here maps to something a Mega Menu genuinely has:
 * `focus` forces the ring onto the first trigger, `disabled` dims the whole bar
 * and takes it out of the pointer path. Anything else falls through to the
 * default interactive render — the reader clicks a trigger and the full-width
 * panel drops open. `onClickCapture` cancels the sample anchors' navigation so
 * the docs never jump while a panel is open.
 */

type MegaMenuVariant = "default";
type MegaMenuSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): MegaMenuVariant {
  return (VARIANTS.includes(value) ? value : "default") as MegaMenuVariant;
}

function asSize(value: string): MegaMenuSize {
  return (SIZES.includes(value) ? value : "md") as MegaMenuSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const SECTIONS: Record<StyleSlug, readonly MegaMenuSection[]> = {
  clay: [
    {
      id: "product",
      label: "Product",
      columns: [
        {
          id: "build",
          heading: "Build",
          icon: <Blocks />,
          links: [
            { id: "editor", label: "Visual editor", href: "#editor", description: "Compose surfaces by hand", current: true },
            { id: "blocks", label: "Block library", href: "#blocks", description: "Prebuilt sections" },
            { id: "themes", label: "Theme studio", href: "#themes" },
          ],
        },
        {
          id: "ship",
          heading: "Ship",
          icon: <Rocket />,
          links: [
            { id: "deploy", label: "One-click deploy", href: "#deploy", description: "Push to production" },
            { id: "preview", label: "Preview links", href: "#preview" },
          ],
        },
      ],
    },
    {
      id: "resources",
      label: "Resources",
      columns: [
        {
          id: "learn",
          heading: "Learn",
          icon: <BookOpen />,
          links: [
            { id: "guides", label: "Guides", href: "#guides", description: "Step-by-step walkthroughs" },
            { id: "api", label: "API reference", href: "#api" },
          ],
        },
        {
          id: "help",
          heading: "Help",
          icon: <LifeBuoy />,
          links: [
            { id: "support", label: "Support", href: "#support" },
            { id: "status", label: "System status", href: "#status" },
          ],
        },
      ],
    },
  ],
  glass: [
    {
      id: "platform",
      label: "Platform",
      columns: [
        {
          id: "overview",
          heading: "Overview",
          icon: <Compass />,
          links: [
            { id: "why", label: "Why us", href: "#why", description: "The short pitch" },
            { id: "tour", label: "Product tour", href: "#tour" },
          ],
        },
        {
          id: "capabilities",
          heading: "Capabilities",
          icon: <Sparkles />,
          links: [
            { id: "realtime", label: "Realtime", href: "#realtime", description: "Live collaboration" },
            { id: "insights", label: "Insights", href: "#insights", description: "Usage analytics" },
            { id: "automations", label: "Automations", href: "#automations" },
          ],
        },
      ],
    },
    {
      id: "solutions",
      label: "Solutions",
      columns: [
        {
          id: "teams",
          heading: "By team",
          icon: <Users />,
          links: [
            { id: "design", label: "Design", href: "#design" },
            { id: "eng", label: "Engineering", href: "#eng" },
          ],
        },
      ],
    },
  ],
  skeuo: [
    {
      id: "studio",
      label: "Studio",
      columns: [
        {
          id: "instruments",
          heading: "Instruments",
          icon: <Boxes />,
          links: [
            { id: "mixer", label: "Mixer", href: "#mixer", description: "24-channel desk" },
            { id: "synth", label: "Synth rack", href: "#synth" },
            { id: "sampler", label: "Sampler", href: "#sampler" },
          ],
        },
        {
          id: "utilities",
          heading: "Utilities",
          icon: <Wrench />,
          links: [
            { id: "tuner", label: "Tuner", href: "#tuner" },
            { id: "meter", label: "Loudness meter", href: "#meter", description: "LUFS + true peak" },
          ],
        },
      ],
    },
    {
      id: "library",
      label: "Library",
      columns: [
        {
          id: "packs",
          heading: "Sound packs",
          icon: <Palette />,
          links: [
            { id: "drums", label: "Drum kits", href: "#drums" },
            { id: "keys", label: "Keys & pads", href: "#keys" },
          ],
        },
      ],
    },
  ],
  adaptive: [
    {
      id: "docs",
      label: "Docs",
      columns: [
        {
          id: "start",
          heading: "Get started",
          icon: <Rocket />,
          links: [
            { id: "install", label: "Installation", href: "#install", description: "Add the package" },
            { id: "quickstart", label: "Quickstart", href: "#quickstart", current: true },
          ],
        },
        {
          id: "reference",
          heading: "Reference",
          icon: <Code2 />,
          links: [
            { id: "components", label: "Components", href: "#components" },
            { id: "tokens", label: "Design tokens", href: "#tokens" },
            { id: "cli", label: "CLI", href: "#cli" },
          ],
        },
      ],
    },
    {
      id: "developers",
      label: "Developers",
      columns: [
        {
          id: "perf",
          heading: "Performance",
          icon: <Gauge />,
          links: [
            { id: "budgets", label: "Budgets", href: "#budgets", description: "Core Web Vitals" },
            { id: "profiling", label: "Profiling", href: "#profiling" },
          ],
        },
      ],
    },
  ],
};

export function MegaMenuPreview({ material, variant, size, state }: PreviewProps) {
  const sections = SECTIONS[material];
  const isDisabled = state === "disabled";
  const isFocus = state === "focus";

  return (
    <div className="min-h-[220px]">
      <MegaMenu
        aria-busy={state === "loading" || undefined}
        aria-disabled={isDisabled || undefined}
        aria-label="Marketing"
        className={
          isFocus
            ? // Force the focus ring onto the first trigger without leaving the
              // trigger API — the ring colour is the material's own --mq-ring token.
              "[&_li:first-child_button]:outline-2 [&_li:first-child_button]:outline-offset-[2px] [&_li:first-child_button]:outline-[var(--mq-ring,#171817)]"
            : isDisabled
              ? "pointer-events-none opacity-45"
              : undefined
        }
        disabled={isDisabled}
        // Remounts when the material changes, and only then. Each material names
        // its own sections, so a stale open id can never survive a material swap.
        key={material}
        material={material}
        // The sample anchors point at hashes; cancel their navigation in the
        // capture phase so the docs never scroll, while the link's own click still
        // closes the panel in the bubble phase.
        onClickCapture={(event) => {
          if ((event.target as HTMLElement).closest("a")) event.preventDefault();
        }}
        sections={sections}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
