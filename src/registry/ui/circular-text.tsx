import * as React from "react";
import { cn } from "@/lib/cn";

const CIRCULAR_KEYFRAMES =
  "@keyframes mq-circular-text{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";

function CircularKeyframes() {
  return (
    <style href="mq-circular-text" precedence="medium">
      {CIRCULAR_KEYFRAMES}
    </style>
  );
}

export type CircularTextVariant = "clockwise" | "counterclockwise";
export type CircularTextProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  variant?: CircularTextVariant;
  diameter?: number;
  duration?: number;
};

export function CircularText({
  children,
  className,
  diameter = 180,
  duration = 14,
  style,
  variant = "clockwise",
  ...props
}: CircularTextProps) {
  const glyphs = Array.from(children);
  const safeDiameter = Math.min(320, Math.max(96, diameter));
  const radius = safeDiameter * 0.4;

  return (
    <>
      <CircularKeyframes />
      <span
        {...props}
        aria-label={children}
        className={cn(
          "relative inline-grid place-items-center text-inherit forced-colors:text-[CanvasText]",
          className,
        )}
        style={{ ...style, width: safeDiameter, height: safeDiameter }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-[mq-circular-text_14s_linear_infinite] motion-reduce:animate-none forced-colors:animate-none"
          style={{
            animationDirection: variant === "counterclockwise" ? "reverse" : "normal",
            animationDuration: `${Math.max(3, duration)}s`,
          }}
        >
          {glyphs.map((character, index) => {
            const angle = glyphs.length > 0 ? (index / glyphs.length) * 360 : 0;
            return (
              <span
                className="absolute left-1/2 top-1/2 inline-block origin-[0_0] whitespace-pre"
                key={`${index}-${character}`}
                style={{ transform: `rotate(${angle}deg) translateY(-${radius}px)` }}
              >
                {character === " " ? "\u00a0" : character}
              </span>
            );
          })}
        </span>
        <span aria-hidden="true" className="size-[0.42em] rounded-full bg-current opacity-45 forced-colors:opacity-100" />
      </span>
    </>
  );
}
