import * as React from "react";
import { cn } from "@/lib/cn";

const GLITCH_KEYFRAMES = [
  "@keyframes mq-glitch-a{0%,86%,100%{clip-path:inset(0 0 100% 0);transform:translate3d(0,0,0)}88%{clip-path:inset(12% 0 62% 0);transform:translate3d(calc(var(--mq-glitch-shift,3px) * -1),0,0)}91%{clip-path:inset(58% 0 18% 0);transform:translate3d(var(--mq-glitch-shift,3px),0,0)}94%{clip-path:inset(30% 0 48% 0);transform:translate3d(0,0,0)}}",
  "@keyframes mq-glitch-b{0%,82%,100%{clip-path:inset(100% 0 0 0);transform:translate3d(0,0,0)}84%{clip-path:inset(68% 0 8% 0);transform:translate3d(var(--mq-glitch-shift,3px),0,0)}88%{clip-path:inset(22% 0 56% 0);transform:translate3d(calc(var(--mq-glitch-shift,3px) * -1),0,0)}92%{clip-path:inset(46% 0 32% 0);transform:translate3d(0,0,0)}}",
].join("");

function GlitchKeyframes() {
  return (
    <style href="mq-glitch-text" precedence="medium">
      {GLITCH_KEYFRAMES}
    </style>
  );
}

export type GlitchTextVariant = "signal" | "burst";
export type GlitchTextProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  variant?: GlitchTextVariant;
  intensity?: number;
  duration?: number;
};

type GlitchStyle = React.CSSProperties & {
  "--mq-glitch-shift": string;
};

export function GlitchText({
  children,
  className,
  duration = 2.8,
  intensity = 1,
  style,
  variant = "signal",
  ...props
}: GlitchTextProps) {
  const safeIntensity = Math.min(2, Math.max(0.45, intensity));
  const effectStyle: GlitchStyle = {
    ...style,
    "--mq-glitch-shift": `${3 * safeIntensity}px`,
  };
  const layerStyle = { animationDuration: `${Math.max(1.2, duration)}s` };

  return (
    <>
      <GlitchKeyframes />
      <span
        {...props}
        aria-label={children}
        className={cn(
          "relative inline-block whitespace-pre text-inherit forced-colors:text-[CanvasText]",
          variant === "signal"
            ? "[--mq-glitch-a:#22d3ee] [--mq-glitch-b:#fb7185]"
            : "[--mq-glitch-a:#a78bfa] [--mq-glitch-b:#facc15]",
          className,
        )}
        style={effectStyle}
      >
        <span aria-hidden="true" className="relative z-[1]">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] select-none text-[var(--mq-glitch-a,#22d3ee)] mix-blend-screen animate-[mq-glitch-a_2.8s_steps(1,end)_infinite] motion-reduce:hidden forced-colors:hidden"
          style={layerStyle}
        >
          {children}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] select-none text-[var(--mq-glitch-b,#fb7185)] mix-blend-screen animate-[mq-glitch-b_2.8s_steps(1,end)_infinite] motion-reduce:hidden forced-colors:hidden"
          style={layerStyle}
        >
          {children}
        </span>
      </span>
    </>
  );
}
