"use client";

import { AudioPlayer } from "@/registry/ui/audio-player";
import type { PreviewProps } from "@/registry/schema";

type AudioVariant = "waveform" | "compact";
type AudioSize = "sm" | "md" | "lg";

export function AudioPlayerPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <AudioPlayer
      artist="Field Notes"
      className="w-[min(560px,100%)]"
      data-focus={state === "focus" ? "true" : undefined}
      material={material}
      size={(["sm", "md", "lg"].includes(size) ? size : "md") as AudioSize}
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
      title="A short field recording"
      variant={(["waveform", "compact"].includes(variant) ? variant : "waveform") as AudioVariant}
    />
  );
}
