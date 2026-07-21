"use client";

import { Badge } from "@/registry/ui/badge";
import type { PreviewProps } from "@/registry/schema";

/** Documentation preview for the Badge. */

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";
type BadgeSize = "sm" | "md" | "lg";

const TONES: readonly string[] = ["neutral", "success", "warning", "danger", "info"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const LABEL: Record<BadgeTone, string> = {
  neutral: "Draft",
  success: "Live",
  warning: "Needs review",
  danger: "Blocked",
  info: "Beta",
};

function asTone(value: string): BadgeTone {
  return (TONES.includes(value) ? value : "neutral") as BadgeTone;
}

function asSize(value: string): BadgeSize {
  return (SIZES.includes(value) ? value : "md") as BadgeSize;
}

export function BadgePreview({ material, variant, size, state }: PreviewProps) {
  const tone = asTone(variant);
  const label = state === "loading" ? `Updating ${LABEL[tone]}` : LABEL[tone];

  return (
    <Badge
      aria-busy={state === "loading" || undefined}
      aria-disabled={state === "disabled" || undefined}
      data-focus={state === "focus" ? "true" : undefined}
      data-state={state === "loading" || state === "disabled" ? state : "idle"}
      dot
      material={material}
      role="status"
      size={asSize(size)}
      tone={tone}
    >
      {label}
    </Badge>
  );
}
