"use client";

import { AvatarCircles, type AvatarCircleItem } from "@/registry/ui/avatar-circles";
import type { PreviewProps } from "@/registry/schema";

type AvatarCirclesVariant = "stacked" | "roomy";
type AvatarCirclesSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["stacked", "roomy"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const AVATARS: readonly AvatarCircleItem[] = [
  { id: "ana", src: "https://i.pravatar.cc/160?img=47", alt: "Ana Torres", name: "Ana Torres" },
  { id: "leo", src: "https://i.pravatar.cc/160?img=12", alt: "Leo Park", name: "Leo Park" },
  { id: "mina", src: "https://i.pravatar.cc/160?img=32", alt: "Mina Shah", name: "Mina Shah" },
  { id: "sam", alt: "Sam Rivera", name: "Sam Rivera" },
  { id: "noa", src: "https://i.pravatar.cc/160?img=5", alt: "Noa Kim", name: "Noa Kim" },
  { id: "kai", src: "https://i.pravatar.cc/160?img=11", alt: "Kai Bell", name: "Kai Bell" },
];

function asVariant(value: string): AvatarCirclesVariant {
  return (VARIANTS.includes(value) ? value : "stacked") as AvatarCirclesVariant;
}

function asSize(value: string): AvatarCirclesSize {
  return (SIZES.includes(value) ? value : "md") as AvatarCirclesSize;
}

export function AvatarCirclesPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <AvatarCircles
      avatars={AVATARS}
      data-focus={state === "focus" ? "true" : undefined}
      material={material === "adaptive" ? material : "adaptive"}
      max={state === "loading" ? 3 : 4}
      size={asSize(size)}
      tabIndex={0}
      variant={asVariant(variant)}
    />
  );
}
