import { GalleryGrid, type GalleryGridImage } from "@/registry/ui/gallery-grid";
import type { PreviewProps } from "@/registry/schema";

type GridVariant = "cards" | "edge";
type GridSize = "sm" | "md" | "lg";
const IMAGES: readonly GalleryGridImage[] = [
  { id: "one", src: "https://picsum.photos/id/1020/560/420", alt: "Brown bear in a forest", caption: "Wild terrain" },
  { id: "two", src: "https://picsum.photos/id/1039/560/420", alt: "Waterfall between green cliffs", caption: "Deep water" },
  { id: "three", src: "https://picsum.photos/id/1044/560/420", alt: "Rocky coastline at sunset", caption: "Last light" },
  { id: "four", src: "https://picsum.photos/id/1057/560/420", alt: "City buildings against a clear sky", caption: "Urban rhythm" },
  { id: "five", src: "https://picsum.photos/id/1067/560/420", alt: "Sunlit interior with a table", caption: "Soft morning" },
  { id: "six", src: "https://picsum.photos/id/1074/560/420", alt: "Big cat looking toward camera", caption: "Close encounter" },
];

export function GalleryGridPreview({ material, variant, size }: PreviewProps) {
  return <GalleryGrid className="w-[min(620px,100%)]" images={IMAGES} material={material} size={(["sm", "md", "lg"].includes(size) ? size : "md") as GridSize} variant={(["cards", "edge"].includes(variant) ? variant : "cards") as GridVariant} />;
}
