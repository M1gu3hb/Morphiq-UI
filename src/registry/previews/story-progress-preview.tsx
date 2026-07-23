"use client";

import { StoryProgress, type StoryProgressItem } from "@/registry/ui/story-progress";
import type { PreviewProps } from "@/registry/schema";

type StoryVariant = "bars" | "blocks";
type StorySize = "sm" | "md" | "lg";
const STORIES: readonly StoryProgressItem[] = [
  { id: "arrival", label: "Arrival" },
  { id: "workshop", label: "Workshop" },
  { id: "result", label: "Final reveal" },
  { id: "credits", label: "Credits" },
];

export function StoryProgressPreview({ material, variant, size, state }: PreviewProps) {
  return <StoryProgress autoAdvance={state !== "disabled"} className="w-[min(560px,100%)]" intervalMs={3600} material={material} size={(["sm", "md", "lg"].includes(size) ? size : "md") as StorySize} stories={STORIES} variant={(["bars", "blocks"].includes(variant) ? variant : "bars") as StoryVariant} />;
}
