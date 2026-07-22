"use client";

import { EmptyState } from "@/registry/ui/empty-state";
import { Button } from "@/registry/ui/button";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/** Documentation preview for the Empty State. */

type EmptyStateVariant = "default";
type EmptyStateSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): EmptyStateVariant {
  return (VARIANTS.includes(value) ? value : "default") as EmptyStateVariant;
}

function asSize(value: string): EmptyStateSize {
  return (SIZES.includes(value) ? value : "md") as EmptyStateSize;
}

export function EmptyStatePreview({ material, variant, size, state }: PreviewProps) {
  // Empty State has no busy/invalid state of its own; the only thing those
  // preview states can meaningfully touch is the caller's action, so a
  // loading/disabled state simply disables the demo action.
  const isBlocked = state === "loading" || state === "disabled";
  const resolvedMaterial: StyleSlug = material;

  return (
    <EmptyState
      action={
        <Button
          disabled={isBlocked}
          intent="primary"
          material={resolvedMaterial}
          size="sm"
          type="button"
        >
          New project
        </Button>
      }
      headingLevel={2}
      material={resolvedMaterial}
      size={asSize(size)}
      title="No projects yet"
      description="Create your first project to get started. Everything you build lives in this workspace, ready whenever you are."
      variant={asVariant(variant)}
    />
  );
}
