"use client";

import { Avatar } from "@/registry/ui/avatar";
import type { PreviewProps } from "@/registry/schema";

/** Documentation preview for the Avatar. */

type AvatarShape = "circle" | "rounded" | "squircle";
type AvatarSize = "sm" | "md" | "lg";

const SHAPES: readonly string[] = ["circle", "rounded", "squircle"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const PORTRAIT_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
    <rect width="96" height="96" fill="#c9d9ef"/>
    <circle cx="48" cy="39" r="21" fill="#805b49"/>
    <path d="M17 96c3-25 15-37 31-37s28 12 31 37" fill="#294b6f"/>
    <path d="M28 34c3-18 33-24 42-3-8-4-14-10-18-17-4 10-12 17-24 20" fill="#2f2726"/>
    <circle cx="41" cy="40" r="2" fill="#2c211d"/>
    <circle cx="56" cy="40" r="2" fill="#2c211d"/>
    <path d="M41 49c5 4 10 4 15 0" fill="none" stroke="#5e3e34" stroke-width="2" stroke-linecap="round"/>
  </svg>
`;
const PORTRAIT_SRC = `data:image/svg+xml,${encodeURIComponent(PORTRAIT_SVG)}`;

function asShape(value: string): AvatarShape {
  return (SHAPES.includes(value) ? value : "circle") as AvatarShape;
}

function asSize(value: string): AvatarSize {
  return (SIZES.includes(value) ? value : "md") as AvatarSize;
}

export function AvatarPreview({ material, variant, size, state }: PreviewProps) {
  const sharedState = {
    "aria-busy": state === "loading" || undefined,
    "aria-disabled": state === "disabled" || undefined,
    "data-focus": state === "focus" ? "true" : undefined,
    "data-state": state === "loading" || state === "disabled" ? state : "idle",
  } as const;
  const avatarSize = asSize(size);
  const shape = asShape(variant);

  return (
    <div className="flex items-end justify-center gap-4" data-avatar-preview="">
      <Avatar
        {...sharedState}
        alt="Illustrated portrait of Avery Morgan"
        material={material}
        name="Avery Morgan"
        shape={shape}
        size={avatarSize}
        src={PORTRAIT_SRC}
      />
      <Avatar
        {...sharedState}
        alt="Morgan Chen"
        material={material}
        name="Morgan Chen"
        shape={shape}
        size={avatarSize}
      />
    </div>
  );
}
