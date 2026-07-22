"use client";

import { StatCard } from "@/registry/ui/stat-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Stat Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it. Every figure below is a fixed literal — no Date.now() or
 * random data — so the render is deterministic and SSR-stable.
 */

type StatVariant = "default";
type StatSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): StatVariant {
  return (VARIANTS.includes(value) ? value : "default") as StatVariant;
}

function asSize(value: string): StatSize {
  return (SIZES.includes(value) ? value : "md") as StatSize;
}

type StatCopy = {
  label: string;
  value: string;
  delta: number;
  deltaCaption: string;
  sparkline: number[];
};

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, StatCopy> = {
  clay: {
    label: "Monthly revenue",
    value: "$48.2k",
    delta: 12.5,
    deltaCaption: "vs last month",
    sparkline: [32, 35, 33, 41, 44, 42, 51, 55, 62],
  },
  glass: {
    label: "Active sessions",
    value: "8,914",
    delta: -3.2,
    deltaCaption: "vs last week",
    sparkline: [61, 58, 60, 54, 52, 55, 49, 47, 44],
  },
  skeuo: {
    label: "Error rate",
    value: "0.42%",
    delta: -18.0,
    deltaCaption: "vs prior release",
    sparkline: [22, 19, 20, 15, 14, 12, 11, 9, 7],
  },
  adaptive: {
    label: "Net new signups",
    value: "1,204",
    delta: 0,
    deltaCaption: "vs last period",
    sparkline: [40, 41, 39, 40, 42, 41, 40, 41, 40],
  },
};

export function StatCardPreview({ material, variant, size }: PreviewProps) {
  const copy = COPY[material];

  return (
    <div className="flex flex-col items-start gap-[18px]">
      <StatCard
        className="w-[min(300px,100%)]"
        material={material}
        variant={asVariant(variant)}
        size={asSize(size)}
        label={copy.label}
        value={copy.value}
        delta={copy.delta}
        deltaUnit="%"
        deltaCaption={copy.deltaCaption}
        sparkline={copy.sparkline}
      />
    </div>
  );
}
