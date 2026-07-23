"use client";

import { ParallaxImage } from "@/registry/ui/parallax-image";
import type { PreviewProps } from "@/registry/schema";

type ParallaxVariant = "subtle" | "deep";
type ParallaxSize = "sm" | "md" | "lg";

export function ParallaxImagePreview({ material, variant, size }: PreviewProps) {
  return (
    <ParallaxImage
      alt="Rocky peaks beneath a dramatic sky"
      caption="Scroll the page to shift the landscape subtly."
      className="w-[min(600px,100%)]"
      material={material}
      size={(["sm", "md", "lg"].includes(size) ? size : "md") as ParallaxSize}
      src="https://picsum.photos/id/1018/1200/820"
      variant={(["subtle", "deep"].includes(variant) ? variant : "subtle") as ParallaxVariant}
    />
  );
}
