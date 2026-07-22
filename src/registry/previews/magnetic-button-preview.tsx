"use client";

import { MagneticButton } from "@/registry/ui/magnetic-button";
import type { PreviewProps } from "@/registry/schema";

type MagneticButtonVariant = "default";
type MagneticButtonSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): MagneticButtonVariant {
  return (VARIANTS.includes(value) ? value : "default") as MagneticButtonVariant;
}

function asSize(value: string): MagneticButtonSize {
  return (SIZES.includes(value) ? value : "md") as MagneticButtonSize;
}

export function MagneticButtonPreview({ material, variant, size, state }: PreviewProps) {
  const loading = state === "loading";

  return (
    <MagneticButton
      aria-busy={loading || undefined}
      data-focus={state === "focus" ? "true" : undefined}
      disabled={state === "disabled"}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      {loading ? "Attracting…" : "Move closer"}
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
        <path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8" />
      </svg>
    </MagneticButton>
  );
}
