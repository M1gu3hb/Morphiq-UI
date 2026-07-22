"use client";

import { GradientButton } from "@/registry/ui/gradient-button";
import type { PreviewProps } from "@/registry/schema";

type GradientButtonVariant = "default";
type GradientButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): GradientButtonVariant {
  return (VARIANTS.includes(value) ? value : "default") as GradientButtonVariant;
}

function asSize(value: string): GradientButtonSize {
  return (SIZES.includes(value) ? value : "md") as GradientButtonSize;
}

export function GradientButtonPreview({ material, variant, size, state }: PreviewProps) {
  const loading = state === "loading";

  return (
    <GradientButton
      aria-busy={loading || undefined}
      data-focus={state === "focus" ? "true" : undefined}
      disabled={state === "disabled"}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      {loading ? "Blending…" : "Create gradient"}
      <svg
        aria-hidden="true"
        className="size-[1.05em] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        viewBox="0 0 24 24"
      >
        <path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z" />
        <path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
      </svg>
    </GradientButton>
  );
}
