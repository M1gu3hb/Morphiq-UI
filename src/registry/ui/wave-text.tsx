import * as React from "react";
import { cn } from "@/lib/cn";

const WAVE_KEYFRAMES =
  "@keyframes mq-wave-text{0%,100%{transform:translate3d(0,0,0) rotate(0deg)}25%{transform:translate3d(0,calc(var(--mq-wave-height,.18em) * -1),0) rotate(-1.5deg)}55%{transform:translate3d(0,var(--mq-wave-height,.18em),0) rotate(1.5deg)}80%{transform:translate3d(0,calc(var(--mq-wave-height,.18em) * -.35),0) rotate(0deg)}}";

function WaveKeyframes() {
  return (
    <style href="mq-wave-text" precedence="medium">
      {WAVE_KEYFRAMES}
    </style>
  );
}

export type WaveTextVariant = "gentle" | "tidal";
export type WaveTextProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  variant?: WaveTextVariant;
  duration?: number;
  stagger?: number;
};

type WaveGlyphStyle = React.CSSProperties & {
  "--mq-wave-height": string;
};

export function WaveText({
  children,
  className,
  duration = 1.8,
  stagger = 70,
  variant = "gentle",
  ...props
}: WaveTextProps) {
  return (
    <>
      <WaveKeyframes />
      <span
        {...props}
        aria-label={children}
        className={cn(
          "inline-block whitespace-pre text-inherit forced-colors:text-[CanvasText]",
          className,
        )}
      >
        <span aria-hidden="true" className="inline-flex whitespace-pre">
          {Array.from(children).map((character, index) => (
            <span
              className="inline-block animate-[mq-wave-text_1.8s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:[transform:none] forced-colors:animate-none forced-colors:[transform:none]"
              key={`${index}-${character}`}
              style={
                {
                  "--mq-wave-height": variant === "tidal" ? ".34em" : ".16em",
                  animationDelay: `${index * Math.max(0, stagger)}ms`,
                  animationDuration: `${Math.max(0.8, duration)}s`,
                } as WaveGlyphStyle
              }
            >
              {character === " " ? "\u00a0" : character}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}
