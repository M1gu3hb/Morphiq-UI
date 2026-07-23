"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const videoPlayerVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[var(--mq-body,#f7e7dc)] text-[color:var(--mq-text,#33261e)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: "[--mq-body:#f7e7dc] [--mq-text:#33261e] [--mq-muted:#634b3d] [--mq-brd:rgba(88,51,38,.3)] [--mq-control:#fff4ec] [--mq-ring:#33261e] border-[var(--mq-brd,rgba(88,51,38,.3))] shadow-[inset_0_2px_3px_rgba(255,255,255,.72),0_5px_0_#d2a082,0_15px_28px_rgba(86,48,33,.18)]",
        glass: "[--mq-body:rgba(20,24,31,.94)] [--mq-text:#ffffff] [--mq-muted:#d3d9e5] [--mq-brd:rgba(255,255,255,.44)] [--mq-control:rgba(255,255,255,.16)] [--mq-ring:#ffffff] border-[var(--mq-brd,rgba(255,255,255,.44))] backdrop-blur-[18px] backdrop-saturate-[160%] shadow-[inset_0_1px_0_rgba(255,255,255,.46),0_18px_36px_rgba(12,16,30,.28)]",
        skeuo: "[--mq-body:#e6e3da] [--mq-text:#23231f] [--mq-muted:#555149] [--mq-brd:#97938a] [--mq-control:#f4f1e9] [--mq-ring:#171817] border-[var(--mq-brd,#97938a)] shadow-[inset_0_2px_3px_rgba(255,255,255,.9),inset_0_-4px_6px_rgba(0,0,0,.13),0_5px_0_#a8a49b,0_15px_26px_rgba(38,36,31,.23)]",
        adaptive: "[--mq-body:#171817] [--mq-text:#f7f6f2] [--mq-muted:#c8c6bf] [--mq-brd:#3f403c] [--mq-control:#2b2c29] [--mq-ring:#f7f6f2] border-[var(--mq-brd,#3f403c)] shadow-[0_16px_34px_rgba(20,20,18,.2)]",
      },
      variant: { cinema: "", minimal: "" },
      size: {
        sm: "rounded-[18px] p-[8px] text-[11px]",
        md: "rounded-[24px] p-[10px] text-[12px]",
        lg: "rounded-[30px] p-[12px] text-[13px]",
      },
    },
    defaultVariants: { material: "clay", variant: "cinema", size: "md" },
  },
);

const mediaButtonClass = "grid size-[38px] shrink-0 place-items-center rounded-full border border-[var(--mq-brd,rgba(88,51,38,.3))] bg-[var(--mq-control,#fff4ec)] text-[color:var(--mq-text,#33261e)] transition-[background-color,scale,opacity] duration-150 hover:scale-[1.05] active:scale-[.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] disabled:opacity-40 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]";

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export type VideoPlayerProps = Omit<React.ComponentPropsWithRef<"section">, "children"> &
  Omit<VariantProps<typeof videoPlayerVariants>, "material" | "variant" | "size"> & {
    src: string;
    title: string;
    poster?: string;
    captionsSrc?: string;
    captionsLabel?: string;
    material?: MaterialSlug;
    variant?: "cinema" | "minimal";
    size?: "sm" | "md" | "lg";
  };

export function VideoPlayer({
  captionsLabel = "English captions",
  captionsSrc,
  className,
  material = "clay",
  poster,
  size = "md",
  src,
  title,
  variant = "cinema",
  ...props
}: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(0.8);
  const [captionsOn, setCaptionsOn] = React.useState(false);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
      } catch {
        setPlaying(false);
      }
    } else video.pause();
  }

  function toggleCaptions() {
    const track = videoRef.current?.textTracks[0];
    const next = !captionsOn;
    if (track) track.mode = next ? "showing" : "hidden";
    setCaptionsOn(next);
  }

  return (
    <section
      {...props}
      aria-label={`${title} video player`}
      className={cn(videoPlayerVariants({ material, size, variant }), className)}
      data-material={material}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.target instanceof HTMLInputElement) return;
        if (event.key === " " || event.key.toLowerCase() === "k") {
          event.preventDefault();
          void togglePlayback();
        } else if (event.key === "ArrowLeft" && videoRef.current) {
          event.preventDefault();
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
        } else if (event.key === "ArrowRight" && videoRef.current) {
          event.preventDefault();
          videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
        } else if (event.key.toLowerCase() === "m" && videoRef.current) {
          videoRef.current.muted = !videoRef.current.muted;
        } else if (event.key.toLowerCase() === "c" && captionsSrc) toggleCaptions();
      }}
      tabIndex={props.tabIndex ?? 0}
    >
      <video
        aria-label={title}
        className="block aspect-video w-full rounded-[calc(inherit-5px)] bg-black object-cover forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]"
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        playsInline
        poster={poster}
        preload="metadata"
        ref={videoRef}
      >
        <source src={src} type="video/mp4" />
        {captionsSrc ? <track kind="captions" label={captionsLabel} src={captionsSrc} srcLang="en" /> : null}
        Your browser does not support the video element.
      </video>
      <div className={cn("flex flex-wrap items-center gap-[8px] px-[4px] pt-[10px]", variant === "minimal" && "justify-center")}>
        <button aria-label={playing ? "Pause video" : "Play video"} className={mediaButtonClass} onClick={() => void togglePlayback()} type="button"><span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span></button>
        <label className="flex min-w-[130px] flex-1 items-center gap-[8px]">
          <span className="sr-only">Video progress</span>
          <input
            aria-label="Video progress"
            className="h-[22px] min-w-0 flex-1 accent-[var(--mq-text,#33261e)]"
            max={duration || 0}
            min={0}
            onChange={(event) => {
              const next = Number(event.currentTarget.value);
              if (videoRef.current) videoRef.current.currentTime = next;
              setCurrentTime(next);
            }}
            step={0.1}
            type="range"
            value={Math.min(currentTime, duration || 0)}
          />
        </label>
        <span aria-label={`${formatTime(currentTime)} elapsed, ${formatTime(duration)} total`} className="min-w-[78px] font-mono text-[color:var(--mq-muted,#634b3d)]">{formatTime(currentTime)} / {formatTime(duration)}</span>
        <label className="flex items-center gap-[5px]">
          <span aria-hidden="true">🔊</span>
          <span className="sr-only">Volume</span>
          <input
            aria-label="Volume"
            className="w-[70px] accent-[var(--mq-text,#33261e)]"
            max={1}
            min={0}
            onChange={(event) => {
              const next = Number(event.currentTarget.value);
              setVolume(next);
              if (videoRef.current) videoRef.current.volume = next;
            }}
            step={0.05}
            type="range"
            value={volume}
          />
        </label>
        <button aria-label={`${captionsOn ? "Hide" : "Show"} captions`} aria-pressed={captionsOn} className={mediaButtonClass} disabled={!captionsSrc} onClick={toggleCaptions} type="button"><span aria-hidden="true" className="text-[10px] font-black">CC</span></button>
      </div>
      <p aria-live="polite" className="sr-only">{playing ? "Playing" : "Paused"}. Captions {captionsOn ? "on" : "off"}.</p>
    </section>
  );
}

export { videoPlayerVariants };
