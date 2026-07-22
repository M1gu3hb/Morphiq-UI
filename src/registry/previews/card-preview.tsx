"use client";

import { Button } from "@/registry/ui/button";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type CardVariant = "default" | "elevated" | "outline";
type CardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "elevated", "outline"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): CardVariant {
  return (VARIANTS.includes(value) ? value : "default") as CardVariant;
}

function asSize(value: string): CardSize {
  return (SIZES.includes(value) ? value : "md") as CardSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, { title: string; description: string; body: string }> = {
  clay: {
    title: "Soft deploy",
    description: "Pushed 4 minutes ago",
    body: "Rolling out to 12% of traffic. Nothing has regressed since the last checkpoint.",
  },
  glass: {
    title: "Focus session",
    description: "Ends at 18:42",
    body: "Notifications are held. Two collaborators are still editing this surface.",
  },
  skeuo: {
    title: "Channel A",
    description: "Input gain −6 dB",
    body: "Signal is clean across the range. The limiter has not engaged this take.",
  },
  adaptive: {
    title: "Monthly summary",
    description: "Updated just now",
    body: "Spend is tracking 8% under plan. Three invoices are awaiting approval.",
  },
};

export function CardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const resolvedVariant = asVariant(variant);

  return (
    <div className="flex flex-col items-start gap-[18px]">
      <Card
        className="w-[min(340px,100%)]"
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        interactive
        loading={state === "loading"}
        material={material}
        size={asSize(size)}
        variant={resolvedVariant}
      >
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardBody>
          <p className="m-0">{copy.body}</p>
        </CardBody>
        <CardFooter divided>
          <Button
            disabled={state === "disabled"}
            intent="primary"
            material={material}
            size="sm"
          >
            Open
          </Button>
          <Button
            disabled={state === "disabled"}
            intent="ghost"
            material={material}
            size="sm"
          >
            Dismiss
          </Button>
        </CardFooter>
      </Card>
      {/* The fifth material, piloted as a fixed specimen: the material switcher
          is driven by `entry.materials`, which stays at four until liquid-glass
          is wired end to end (see docs/reports/0037). It refracts the stage
          backdrop behind it, so it needs no separate context. */}
      <Card
        className="w-[min(340px,100%)]"
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        interactive
        loading={state === "loading"}
        material="liquid-glass"
        size={asSize(size)}
        variant={resolvedVariant}
      >
        <CardHeader>
          <CardTitle>Liquid glass</CardTitle>
          <CardDescription>Refracts the surface behind it</CardDescription>
        </CardHeader>
        <CardBody>
          <p className="m-0">
            A frosted pane that bends the backdrop where the browser supports it,
            and stays legible over any background.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
