"use client";

import { HeroVideoDialog } from "@/registry/ui/hero-video-dialog";
import type { PreviewProps } from "@/registry/schema";

type HeroVideoVariant = "cinema" | "editorial";
type HeroVideoSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["cinema", "editorial"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): HeroVideoVariant {
  return (VARIANTS.includes(value) ? value : "cinema") as HeroVideoVariant;
}

function asSize(value: string): HeroVideoSize {
  return (SIZES.includes(value) ? value : "md") as HeroVideoSize;
}

export function HeroVideoDialogPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <HeroVideoDialog
      className="w-[min(560px,100%)]"
      data-focus={state === "focus" ? "true" : undefined}
      description="Open a real modal video player with keyboard-safe focus and Escape dismissal."
      material={material}
      posterSrc="https://picsum.photos/id/1040/1280/720"
      size={asSize(size)}
      thumbnailAlt="White castle above a green valley and lake"
      thumbnailSrc="https://picsum.photos/id/1040/900/620"
      title="Architecture in motion"
      variant={asVariant(variant)}
      videoSrc="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    />
  );
}
