"use client";

import { VideoPlayer } from "@/registry/ui/video-player";
import type { PreviewProps } from "@/registry/schema";

type VideoVariant = "cinema" | "minimal";
type VideoSize = "sm" | "md" | "lg";

export function VideoPlayerPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <VideoPlayer
      captionsLabel="English"
      captionsSrc="https://interactive-examples.mdn.mozilla.net/media/examples/friday.vtt"
      className="w-[min(620px,100%)]"
      data-focus={state === "focus" ? "true" : undefined}
      material={material}
      poster="https://picsum.photos/id/1069/1280/720"
      size={(["sm", "md", "lg"].includes(size) ? size : "md") as VideoSize}
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      title="Flowers in motion"
      variant={(["cinema", "minimal"].includes(variant) ? variant : "cinema") as VideoVariant}
    />
  );
}
