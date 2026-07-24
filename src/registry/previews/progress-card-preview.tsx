"use client";

import { ProgressCard, type ProgressCardStatus } from "@/registry/ui/progress-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Progress Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * Every number here is a literal and every date arrives as an ISO string plus a
 * pre-formatted display string — no clock, no locale lookup, no randomness — so
 * the statically generated markup and the client render are byte-identical.
 */

type ProgressCardVariant = "default";
type ProgressCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ProgressCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as ProgressCardVariant;
}

function asSize(value: string): ProgressCardSize {
  return (SIZES.includes(value) ? value : "md") as ProgressCardSize;
}

/**
 * Copy differs per material so each recipe is shown tracking a real goal, and
 * the three statuses are spread across the four materials so the reader can see
 * that each one carries its own word AND its own glyph, never colour alone.
 */
const COPY: Record<
  StyleSlug,
  {
    eyebrow: string;
    title: string;
    description: string;
    value: number;
    target: number;
    valueLabel: string;
    targetLabel: string;
    status: ProgressCardStatus;
    remainingLabel: string;
    dueDateIso: string;
    dueDateLabel: string;
    actionLabel: string;
  }
> = {
  clay: {
    eyebrow: "Savings goal",
    title: "Kiln and studio shelving",
    description: "Automatic transfer every second Friday, plus anything left over at month end.",
    value: 3200,
    target: 5000,
    valueLabel: "$3,200",
    targetLabel: "$5,000",
    status: "on-track",
    remainingLabel: "$1,800 to go",
    dueDateIso: "2026-12-31",
    dueDateLabel: "Dec 31, 2026",
    actionLabel: "Add funds",
  },
  glass: {
    eyebrow: "Q3 pipeline",
    title: "New enterprise bookings",
    description: "Weighted by stage. Two deals in legal review are excluded until they close.",
    value: 148000,
    target: 400000,
    valueLabel: "$148K",
    targetLabel: "$400K",
    status: "behind",
    remainingLabel: "$252K to go",
    dueDateIso: "2026-09-30",
    dueDateLabel: "Sep 30, 2026",
    actionLabel: "Review deals",
  },
  skeuo: {
    eyebrow: "Community fundraiser",
    title: "Rebuild the workshop roof",
    description: "Matched two-for-one by the district trust up to the full target amount.",
    value: 24000,
    target: 24000,
    valueLabel: "£24,000",
    targetLabel: "£24,000",
    status: "complete",
    remainingLabel: "Goal reached",
    dueDateIso: "2026-06-15",
    dueDateLabel: "Jun 15, 2026",
    actionLabel: "Share news",
  },
  adaptive: {
    eyebrow: "Sprint 42",
    title: "Story points delivered",
    description: "Counted at review, so anything still in code review lands in the next sprint.",
    value: 34,
    target: 48,
    valueLabel: "34 pts",
    targetLabel: "48 pts",
    status: "on-track",
    remainingLabel: "14 pts remaining",
    dueDateIso: "2026-08-07",
    dueDateLabel: "Aug 7, 2026",
    actionLabel: "Open board",
  },
};

export function ProgressCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <div className="flex flex-col items-start gap-[18px]">
      <ProgressCard
        actionLabel={copy.actionLabel}
        className="w-[min(360px,100%)]"
        data-focus={state === "focus" ? "true" : undefined}
        description={copy.description}
        disabled={state === "disabled"}
        dueDateIso={copy.dueDateIso}
        dueDateLabel={copy.dueDateLabel}
        eyebrow={copy.eyebrow}
        href="#goal"
        material={material}
        remainingLabel={copy.remainingLabel}
        size={asSize(size)}
        status={copy.status}
        target={copy.target}
        targetLabel={copy.targetLabel}
        title={copy.title}
        value={copy.value}
        valueLabel={copy.valueLabel}
        variant={asVariant(variant)}
      />
    </div>
  );
}
