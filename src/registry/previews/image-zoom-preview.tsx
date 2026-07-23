"use client";

import { ImageZoom } from "@/registry/ui/image-zoom";
import type { PreviewProps } from "@/registry/schema";

type ZoomVariant = "inline" | "lens";
type ZoomSize = "sm" | "md" | "lg";

export function ImageZoomPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <ImageZoom
      alt="White lighthouse above a blue sea"
      caption="Focus or click to inspect the lighthouse."
      className="w-[min(560px,100%)]"
      data-focus={state === "focus" ? "true" : undefined}
      material={material}
      size={(["sm", "md", "lg"].includes(size) ? size : "md") as ZoomSize}
      src="https://picsum.photos/id/1011/900/620"
      variant={(["inline", "lens"].includes(variant) ? variant : "inline") as ZoomVariant}
    />
  );
}
