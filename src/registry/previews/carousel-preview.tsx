"use client";

import { Carousel, type CarouselSlide } from "@/registry/ui/carousel";
import type { PreviewProps } from "@/registry/schema";

type CarouselVariant = "slide" | "fade";
type CarouselSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["slide", "fade"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const SLIDES: readonly CarouselSlide[] = [
  {
    id: "ridge",
    src: "https://picsum.photos/id/1018/900/620",
    alt: "Mountain ridge above a green valley",
    title: "Find the high ground",
    description: "A tactile frame for editorial photography.",
  },
  {
    id: "coast",
    src: "https://picsum.photos/id/1015/900/620",
    alt: "River winding between wooded mountains",
    title: "Follow the current",
    description: "Swipe, use the arrows, or choose a position.",
  },
  {
    id: "forest",
    src: "https://picsum.photos/id/1043/900/620",
    alt: "Dark evergreen forest beside a lake",
    title: "Pause in the quiet",
    description: "Autoplay stops while the carousel has focus.",
  },
];

function asVariant(value: string): CarouselVariant {
  return (VARIANTS.includes(value) ? value : "slide") as CarouselVariant;
}

function asSize(value: string): CarouselSize {
  return (SIZES.includes(value) ? value : "md") as CarouselSize;
}

export function CarouselPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <Carousel
      autoPlay={state === "loading"}
      className="w-[min(560px,100%)]"
      data-focus={state === "focus" ? "true" : undefined}
      material={material}
      size={asSize(size)}
      slides={SLIDES}
      variant={asVariant(variant)}
    />
  );
}
