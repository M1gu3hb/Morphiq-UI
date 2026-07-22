"use client";

import { ShimmerButton } from "@/registry/ui/shimmer-button";
import type { PreviewProps } from "@/registry/schema";

type ShimmerButtonVariant = "default";
type ShimmerButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ShimmerButtonVariant {
  return (VARIANTS.includes(value) ? value : "default") as ShimmerButtonVariant;
}

function asSize(value: string): ShimmerButtonSize {
  return (SIZES.includes(value) ? value : "md") as ShimmerButtonSize;
}

export function ShimmerButtonPreview({ material, variant, size, state }: PreviewProps) {
  const loading = state === "loading";

  return (
    <ShimmerButton
      aria-busy={loading || undefined}
      data-focus={state === "focus" ? "true" : undefined}
      disabled={state === "disabled"}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      {loading ? "Launching…" : "Launch project"}
      <svg
        aria-hidden="true"
        className="size-[1.05em] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25"
        viewBox="0 0 24 24"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </ShimmerButton>
  );
}
