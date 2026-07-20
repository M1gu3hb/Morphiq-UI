"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/registry/ui/button";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Button.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type ButtonIntent = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const INTENTS: readonly string[] = ["primary", "secondary", "ghost"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asIntent(value: string): ButtonIntent {
  return (INTENTS.includes(value) ? value : "primary") as ButtonIntent;
}

function asSize(value: string): ButtonSize {
  return (SIZES.includes(value) ? value : "md") as ButtonSize;
}

/** Label copy differs per material so each recipe is shown doing real work. */
const LABEL: Record<StyleSlug, string> = {
  clay: "Launch it",
  glass: "Open panel",
  skeuo: "Engage",
  adaptive: "Continue",
};

export function ButtonPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <Button
      data-focus={state === "focus" ? "true" : undefined}
      disabled={state === "disabled"}
      intent={asIntent(variant)}
      loading={state === "loading"}
      material={material}
      size={asSize(size)}
    >
      {LABEL[material]}
      <ArrowUpRight aria-hidden="true" className="size-[1.05em] shrink-0" />
    </Button>
  );
}
