"use client";

import { Timeline, type TimelineItem } from "@/registry/ui/timeline";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for the Timeline.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding.
 */

type TimelineVariant = "default";
type TimelineSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TimelineVariant {
  return (VARIANTS.includes(value) ? value : "default") as TimelineVariant;
}

function asSize(value: string): TimelineSize {
  return (SIZES.includes(value) ? value : "md") as TimelineSize;
}

/** Fixed, deterministic events — no Date.now()/random, so SSR is stable. */
const ITEMS: readonly TimelineItem[] = [
  {
    id: "spec",
    dateTime: "2026-06-02",
    time: "Jun 2",
    title: "Spec approved",
    description: "Scope, success metrics and the rollout plan signed off by the team.",
    status: "done",
  },
  {
    id: "build",
    dateTime: "2026-06-18",
    time: "Jun 18",
    title: "Implementation",
    description: "Components merged behind a flag and covered by tests.",
    status: "done",
  },
  {
    id: "beta",
    dateTime: "2026-07-22",
    time: "Jul 22",
    title: "Beta rollout",
    description: "Live for 12% of traffic while we watch the dashboards.",
    status: "current",
  },
  {
    id: "ga",
    dateTime: "2026-08-05",
    time: "Aug 5",
    title: "General availability",
    description: "Flag removed once the beta cohort holds steady.",
    status: "upcoming",
  },
];

export function TimelinePreview({ material, variant, size }: PreviewProps) {
  return (
    <Timeline
      className="w-[min(420px,100%)]"
      items={ITEMS}
      key={material}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
