import { MasonryGallery, type MasonryGalleryImage } from "@/registry/ui/masonry-gallery";
import type { PreviewProps } from "@/registry/schema";

type MasonryVariant = "balanced" | "editorial";
type MasonrySize = "sm" | "md" | "lg";
const IMAGES: readonly MasonryGalleryImage[] = [
  { id: "one", src: "https://picsum.photos/id/1025/520/680", alt: "Dog wrapped in a blanket", width: 520, height: 680, caption: "Portrait study" },
  { id: "two", src: "https://picsum.photos/id/1039/520/390", alt: "Waterfall between mossy cliffs", width: 520, height: 390, caption: "Falling water" },
  { id: "three", src: "https://picsum.photos/id/1050/520/760", alt: "Harbor beneath cloudy mountains", width: 520, height: 760, caption: "Northern harbor" },
  { id: "four", src: "https://picsum.photos/id/1067/520/460", alt: "Sunlit table beside a window", width: 520, height: 460, caption: "Morning light" },
  { id: "five", src: "https://picsum.photos/id/1011/520/620", alt: "Person on a misty mountain path", width: 520, height: 620, caption: "Into the mist" },
];

export function MasonryGalleryPreview({ material, variant, size }: PreviewProps) {
  return <MasonryGallery className="w-[min(560px,100%)]" images={IMAGES} material={material} size={(["sm", "md", "lg"].includes(size) ? size : "md") as MasonrySize} variant={(["balanced", "editorial"].includes(variant) ? variant : "balanced") as MasonryVariant} />;
}
