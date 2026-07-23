"use client";

import { ThumbnailCarousel, type ThumbnailCarouselImage } from "@/registry/ui/thumbnail-carousel";
import type { PreviewProps } from "@/registry/schema";

type ThumbnailVariant = "bottom" | "side";
type ThumbnailSize = "sm" | "md" | "lg";
const IMAGES: readonly ThumbnailCarouselImage[] = [
  { id: "arch", src: "https://picsum.photos/id/1040/900/620", alt: "Castle above a green lake", caption: "Architecture in the valley" },
  { id: "coast", src: "https://picsum.photos/id/1015/900/620", alt: "River through wooded mountains", caption: "A path through blue" },
  { id: "forest", src: "https://picsum.photos/id/1043/900/620", alt: "Dark forest beside a still lake", caption: "Quiet reflections" },
  { id: "desert", src: "https://picsum.photos/id/1002/900/620", alt: "Desert dunes beneath open sky", caption: "Warm horizons" },
];

export function ThumbnailCarouselPreview({ material, variant, size, state }: PreviewProps) {
  return <ThumbnailCarousel className="w-[min(600px,100%)]" data-focus={state === "focus" ? "true" : undefined} images={IMAGES} material={material} size={(["sm", "md", "lg"].includes(size) ? size : "md") as ThumbnailSize} variant={(["bottom", "side"].includes(variant) ? variant : "bottom") as ThumbnailVariant} />;
}
