"use client";

import { RainbowButton } from "@/registry/ui/rainbow-button";
import type { PreviewProps } from "@/registry/schema";

type RainbowButtonVariant = "default";
type RainbowButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): RainbowButtonVariant {
  return (VARIANTS.includes(value) ? value : "default") as RainbowButtonVariant;
}

function asSize(value: string): RainbowButtonSize {
  return (SIZES.includes(value) ? value : "md") as RainbowButtonSize;
}

export function RainbowButtonPreview({ material, variant, size, state }: PreviewProps) {
  const loading = state === "loading";

  return (
    <RainbowButton
      aria-busy={loading || undefined}
      data-focus={state === "focus" ? "true" : undefined}
      disabled={state === "disabled"}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      {loading ? "Coloring…" : "Open spectrum"}
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
        <path d="M4 16a8 8 0 0 1 16 0" />
        <path d="M7 16a5 5 0 0 1 10 0M10 16a2 2 0 0 1 4 0" />
      </svg>
    </RainbowButton>
  );
}
