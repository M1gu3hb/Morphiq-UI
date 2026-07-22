"use client";

import { StatusDot } from "@/registry/ui/status-dot";
import type { StatusDotStatus } from "@/registry/ui/status-dot";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for the Status Dot.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * The catalog `variant` axis is a single "default"; the interesting axis is the
 * `status` prop, so all four presences are rendered at once — that side-by-side
 * is the whole point, because it is what shows the shape *and* the label
 * carrying meaning without relying on colour. `focus`, `disabled`, `loading`
 * and `error` fall through to this same render: a presence dot has none of
 * those states, and inventing them would document something it cannot do.
 */

type StatusDotSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];
const STATUSES: readonly StatusDotStatus[] = ["online", "away", "busy", "offline"];

function asVariant(value: string): string {
  return VARIANTS.includes(value) ? value : "default";
}

function asSize(value: string): StatusDotSize {
  return (SIZES.includes(value) ? value : "md") as StatusDotSize;
}

export function StatusDotPreview({ material, variant, size }: PreviewProps) {
  const resolvedSize = asSize(size);
  const resolvedVariant = asVariant(variant);

  return (
    <div
      className="flex flex-col items-start gap-[14px]"
      data-variant={resolvedVariant}
      key={material}
    >
      {STATUSES.map((status) => (
        <StatusDot
          key={status}
          material={material}
          pulse={status === "online"}
          size={resolvedSize}
          status={status}
        />
      ))}
    </div>
  );
}
