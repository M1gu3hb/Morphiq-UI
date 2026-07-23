"use client";

import { ComparisonTable } from "@/registry/ui/comparison-table";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Comparison Table.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed, so SSR and the client agree.
 */

type ComparisonTableVariant = "default";
type ComparisonTableSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ComparisonTableVariant {
  return (VARIANTS.includes(value) ? value : "default") as ComparisonTableVariant;
}

function asSize(value: string): ComparisonTableSize {
  return (SIZES.includes(value) ? value : "md") as ComparisonTableSize;
}

// Deterministic plans and features, so server and client render identically.
const PLANS = [
  { id: "starter", name: "Starter", note: "$0 / mo" },
  { id: "pro", name: "Pro", note: "$29 / mo", highlighted: true },
  { id: "scale", name: "Scale", note: "$99 / mo" },
];

const FEATURES = [
  {
    id: "seats",
    label: "Team seats",
    description: "Members per workspace",
    cells: ["3", "25", "Unlimited"],
  },
  {
    id: "history",
    label: "Version history",
    cells: ["7 days", "1 year", "Forever"],
  },
  { id: "analytics", label: "Advanced analytics", cells: [false, true, true] },
  { id: "sso", label: "SSO & SAML", cells: [false, false, true] },
  { id: "support", label: "Priority support", cells: [false, true, true] },
  { id: "audit", label: "Audit log export", cells: [false, false, true] },
];

export function ComparisonTablePreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;
  const isDisabled = state === "disabled";

  return (
    <div className={isDisabled ? "w-[min(560px,100%)] opacity-55" : "w-[min(560px,100%)]"}>
      <ComparisonTable
        caption="Plan comparison across Starter, Pro and Scale"
        features={FEATURES}
        material={resolvedMaterial}
        plans={PLANS}
        size={resolvedSize}
        variant={resolvedVariant}
        zebra
      />
    </div>
  );
}
