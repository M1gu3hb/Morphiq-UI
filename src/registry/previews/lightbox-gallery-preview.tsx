"use client";

import { LightboxGallery, type LightboxGalleryImage } from "@/registry/ui/lightbox-gallery";
import type { PreviewProps } from "@/registry/schema";

type GalleryVariant = "grid" | "filmstrip";
type GallerySize = "sm" | "md" | "lg";
const VARIANTS = ["grid", "filmstrip"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const IMAGES: readonly LightboxGalleryImage[] = [
  { id: "coast", src: "https://picsum.photos/id/1015/760/620", alt: "River winding through forested mountains", caption: "Follow the current" },
  { id: "ridge", src: "https://picsum.photos/id/1018/760/620", alt: "Mountain ridge above a green valley", caption: "Higher ground" },
  { id: "lake", src: "https://picsum.photos/id/1043/760/620", alt: "Evergreen forest reflected in a lake", caption: "Still water" },
  { id: "desert", src: "https://picsum.photos/id/1002/760/620", alt: "Sand dunes beneath a pale sky", caption: "Soft geometry" },
];

function asVariant(value: string): GalleryVariant { return (VARIANTS.includes(value as GalleryVariant) ? value : "grid") as GalleryVariant; }
function asSize(value: string): GallerySize { return (SIZES.includes(value as GallerySize) ? value : "md") as GallerySize; }

export function LightboxGalleryPreview({ material, variant, size, state }: PreviewProps) {
  return <LightboxGallery className="w-[min(560px,100%)]" data-focus={state === "focus" ? "true" : undefined} images={IMAGES} material={material} size={asSize(size)} variant={asVariant(variant)} />;
}
