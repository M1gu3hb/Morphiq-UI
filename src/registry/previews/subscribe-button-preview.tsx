"use client";

import { SubscribeButton } from "@/registry/ui/subscribe-button";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Subscribe Button.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. The control is uncontrolled here so the reader can toggle it
 * live and watch the surface settle.
 */

type SubscribeButtonVariant = "default";
type SubscribeButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SubscribeButtonVariant {
  return (VARIANTS.includes(value) ? value : "default") as SubscribeButtonVariant;
}

function asSize(value: string): SubscribeButtonSize {
  return (SIZES.includes(value) ? value : "md") as SubscribeButtonSize;
}

/**
 * Half the materials open already subscribed so browsing the switcher shows both
 * the prominent call-to-action surface and the calmer settled one at a glance —
 * the reader can still toggle either.
 */
const INITIAL: Record<StyleSlug, boolean> = {
  clay: false,
  glass: true,
  skeuo: false,
  adaptive: true,
};

export function SubscribeButtonPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <div className="flex flex-col items-start gap-[16px]">
      <SubscribeButton
        data-focus={state === "focus" ? "true" : undefined}
        defaultSubscribed={INITIAL[material]}
        disabled={state === "disabled"}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
