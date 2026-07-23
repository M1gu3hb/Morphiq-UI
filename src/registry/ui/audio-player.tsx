"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const AUDIO_WAVE_KEYFRAMES = "@keyframes mq-audio-wave{0%,100%{scale:1 .35}50%{scale:1 1}}";
const WAVE_HEIGHTS = [18, 28, 38, 24, 44, 32, 20, 40, 30, 46, 26, 36, 22, 42, 34, 18, 38, 28, 44, 24, 34, 20, 40, 30] as const;

const audioPlayerVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[var(--mq-body,#f7e7dc)] text-[color:var(--mq-text,#33261e)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: "[--mq-body:#f7e7dc] [--mq-text:#33261e] [--mq-muted:#634b3d] [--mq-brd:rgba(88,51,38,.3)] [--mq-control:#fff4ec] [--mq-accent:#c9482f] [--mq-ring:#33261e] border-[var(--mq-brd,rgba(88,51,38,.3))] shadow-[inset_0_2px_3px_rgba(255,255,255,.72),0_5px_0_#d2a082,0_15px_28px_rgba(86,48,33,.18)]",
        glass: "[--mq-body:rgba(20,24,31,.94)] [--mq-text:#ffffff] [--mq-muted:#d3d9e5] [--mq-brd:rgba(255,255,255,.44)] [--mq-control:rgba(255,255,255,.16)] [--mq-accent:#8ee7ff] [--mq-ring:#ffffff] border-[var(--mq-brd,rgba(255,255,255,.44))] backdrop-blur-[18px] backdrop-saturate-[160%] shadow-[inset_0_1px_0_rgba(255,255,255,.46),0_18px_36px_rgba(12,16,30,.28)]",
        skeuo: "[--mq-body:#e6e3da] [--mq-text:#23231f] [--mq-muted:#555149] [--mq-brd:#97938a] [--mq-control:#f4f1e9] [--mq-accent:#5b554c] [--mq-ring:#171817] border-[var(--mq-brd,#97938a)] shadow-[inset_0_2px_3px_rgba(255,255,255,.9),inset_0_-4px_6px_rgba(0,0,0,.13),0_5px_0_#a8a49b,0_15px_26px_rgba(38,36,31,.23)]",
        adaptive: "[--mq-body:#171817] [--mq-text:#f7f6f2] [--mq-muted:#c8c6bf] [--mq-brd:#3f403c] [--mq-control:#2b2c29] [--mq-accent:#a8ff78] [--mq-ring:#f7f6f2] border-[var(--mq-brd,#3f403c)] shadow-[0_16px_34px_rgba(20,20,18,.2)]",
      },
      variant: {
        waveform: "",
        compact: "[&_[data-wave]]:hidden",
      },
      size: {
        sm: "rounded-[18px] p-[12px] text-[11px]",
        md: "rounded-[24px] p-[16px] text-[12px]",
        lg: "rounded-[30px] p-[20px] text-[13px]",
      },
    },
    defaultVariants: { material: "clay", variant: "waveform", size: "md" },
  },
);

function formatAudioTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  return `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
}

export type AudioPlayerProps = Omit<React.ComponentPropsWithRef<"section">, "children"> &
  Omit<VariantProps<typeof audioPlayerVariants>, "material" | "variant" | "size"> & {
    src: string;
    title: string;
    artist?: string;
    material?: MaterialSlug;
    variant?: "waveform" | "compact";
    size?: "sm" | "md" | "lg";
  };

export function AudioPlayer({
  artist,
  className,
  material = "clay",
  size = "md",
  src,
  title,
  variant = "waveform",
  ...props
}: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(0.8);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
      }
    } else audio.pause();
  }

  return (
    <section
      {...props}
      aria-label={`${title} audio player`}
      className={cn(audioPlayerVariants({ material, size, variant }), className)}
      data-material={material}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.target instanceof HTMLInputElement) return;
        if (event.key === " ") {
          event.preventDefault();
          void togglePlayback();
        } else if (event.key === "ArrowLeft" && audioRef.current) {
          event.preventDefault();
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
        } else if (event.key === "ArrowRight" && audioRef.current) {
          event.preventDefault();
          audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
        } else if (event.key.toLowerCase() === "m" && audioRef.current) {
          audioRef.current.muted = !audioRef.current.muted;
        }
      }}
      tabIndex={props.tabIndex ?? 0}
    >
      <style href="mq-audio-player" precedence="medium">{AUDIO_WAVE_KEYFRAMES}</style>
      <audio
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        preload="metadata"
        ref={audioRef}
        src={src}
      >
        Your browser does not support the audio element.
      </audio>
      <div className="flex items-start justify-between gap-[14px]">
        <div>
          <h3 className="m-0 text-[17px]/[1.2] font-extrabold">{title}</h3>
          {artist ? <p className="mt-[4px] mb-0 text-[color:var(--mq-muted,#634b3d)]">{artist}</p> : null}
        </div>
        <span className="rounded-full border border-[var(--mq-brd,rgba(88,51,38,.3))] bg-[var(--mq-control,#fff4ec)] px-[9px] py-[5px] font-mono text-[10px] font-bold forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]">
          {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
        </span>
      </div>
      <div aria-hidden="true" className="mt-[14px] flex h-[48px] items-center gap-[3px] overflow-hidden rounded-[12px] bg-[var(--mq-control,#fff4ec)] px-[10px] forced-colors:hidden" data-wave="">
        {WAVE_HEIGHTS.map((height, index) => (
          <span
            className="h-[var(--mq-bar-h,20px)] min-w-[2px] flex-1 origin-center rounded-full bg-[var(--mq-accent,#c9482f)] animate-[mq-audio-wave_900ms_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:scale-100"
            key={`${height}-${index}`}
            style={{
              "--mq-bar-h": `${height}px`,
              animationDelay: `${index * -48}ms`,
              animationPlayState: playing ? "running" : "paused",
            } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="mt-[13px] flex items-center gap-[9px]">
        <button
          aria-label={playing ? "Pause audio" : "Play audio"}
          className="grid size-[42px] shrink-0 place-items-center rounded-full border border-[var(--mq-brd,rgba(88,51,38,.3))] bg-[var(--mq-control,#fff4ec)] text-[color:var(--mq-text,#33261e)] transition-[background-color,scale] duration-150 hover:scale-[1.05] active:scale-[.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]"
          onClick={() => void togglePlayback()}
          type="button"
        >
          <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
        </button>
        <label className="flex min-w-0 flex-1 items-center">
          <span className="sr-only">Audio progress</span>
          <input
            aria-label="Audio progress"
            className="w-full accent-[var(--mq-accent,#c9482f)]"
            max={duration || 0}
            min={0}
            onChange={(event) => {
              const next = Number(event.currentTarget.value);
              if (audioRef.current) audioRef.current.currentTime = next;
              setCurrentTime(next);
            }}
            step={0.1}
            type="range"
            value={Math.min(currentTime, duration || 0)}
          />
        </label>
        <label className="flex items-center gap-[4px]">
          <span aria-hidden="true">🔊</span>
          <span className="sr-only">Volume</span>
          <input
            aria-label="Volume"
            className="w-[68px] accent-[var(--mq-accent,#c9482f)]"
            max={1}
            min={0}
            onChange={(event) => {
              const next = Number(event.currentTarget.value);
              setVolume(next);
              if (audioRef.current) audioRef.current.volume = next;
            }}
            step={0.05}
            type="range"
            value={volume}
          />
        </label>
      </div>
      <p aria-live="polite" className="sr-only">{playing ? "Playing" : "Paused"}</p>
    </section>
  );
}

export { audioPlayerVariants };
