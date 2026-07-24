"use client";

import type { ReactNode } from "react";
import { Gauge, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { FeatureCard } from "@/registry/ui/feature-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Feature Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * Two cards are shown side by side because the component has two legitimate
 * link shapes and they are not interchangeable: the first is one big stretched
 * link (whole surface clickable, visible "Learn more" is decoration), the second
 * keeps the card inert and puts the only real link in the footer.
 */

type FeatureCardVariant = "default";
type FeatureCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FeatureCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as FeatureCardVariant;
}

function asSize(value: string): FeatureCardSize {
  return (SIZES.includes(value) ? value : "md") as FeatureCardSize;
}

/** Copy differs per material so each recipe is shown doing real product work. */
const COPY: Record<
  StyleSlug,
  {
    icon: ReactNode;
    eyebrow: string;
    title: string;
    description: string;
    secondEyebrow: string;
    secondTitle: string;
    secondDescription: string;
  }
> = {
  clay: {
    icon: <Sparkles strokeWidth={1.75} />,
    eyebrow: "Craft",
    title: "Hand-thrown surfaces",
    description:
      "Every panel carries a soft inner light and an extruded base edge, so depth reads before a single word does.",
    secondEyebrow: "Rhythm",
    secondTitle: "Spacing that breathes",
    secondDescription:
      "Padding, gap and radius move together on one size axis, so a card never looks cramped at one scale and hollow at another.",
  },
  glass: {
    icon: <Layers3 strokeWidth={1.75} />,
    eyebrow: "Depth",
    title: "Layered translucency",
    description:
      "A frosted pane that borrows colour from whatever sits behind it, while its text keeps its own measured contrast.",
    secondEyebrow: "Legibility",
    secondTitle: "Contrast that never leans",
    secondDescription:
      "The glass tokens are tinted so body and muted copy clear 4.5:1 over a white backdrop and a black one alike.",
  },
  skeuo: {
    icon: <Gauge strokeWidth={1.75} />,
    eyebrow: "Precision",
    title: "Machined controls",
    description:
      "A milled recess holds the glyph while the panel above it stays lit, the way a real instrument face is assembled.",
    secondEyebrow: "Feedback",
    secondTitle: "Travel you can feel",
    secondDescription:
      "The card lifts on hover and sinks under a press, and both are cancelled outright when the reader asks for less motion.",
  },
  adaptive: {
    icon: <ShieldCheck strokeWidth={1.75} />,
    eyebrow: "Resilience",
    title: "Accessible by default",
    description:
      "Semantic markup, a configurable heading rank and a real link ship with the component — not as a later retrofit.",
    secondEyebrow: "Theme",
    secondTitle: "One card, both schemes",
    secondDescription:
      "Surface, text, accent and shadow all flip on the dark class, so neither light nor dark looks like an afterthought.",
  },
};

export function FeatureCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);

  return (
    <div className="flex flex-wrap items-stretch gap-[18px]">
      <FeatureCard
        className="w-[min(300px,100%)]"
        // The forced focus look belongs on the stretched card, where the ring
        // really does outline the whole surface.
        data-focus={state === "focus" ? "true" : undefined}
        description={copy.description}
        disabled={state === "disabled"}
        eyebrow={copy.eyebrow}
        href="#feature"
        icon={copy.icon}
        loading={state === "loading"}
        material={material}
        size={resolvedSize}
        title={copy.title}
        variant={resolvedVariant}
      />
      <FeatureCard
        className="w-[min(300px,100%)]"
        description={copy.secondDescription}
        disabled={state === "disabled"}
        eyebrow={copy.secondEyebrow}
        href="#feature-detail"
        linkLabel="Read the guide"
        loading={state === "loading"}
        material={material}
        size={resolvedSize}
        // Inert card: the footer link is the only interactive thing, and it
        // carries its own focus ring rather than borrowing the card's.
        stretchLink={false}
        title={copy.secondTitle}
        variant={resolvedVariant}
      />
    </div>
  );
}
