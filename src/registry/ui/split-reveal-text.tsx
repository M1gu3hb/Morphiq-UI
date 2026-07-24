import * as React from "react";
import { cn } from "@/lib/cn";

const SPLIT_REVEAL_KEYFRAMES =
  "@keyframes mq-split-reveal{from{opacity:0;clip-path:inset(100% 0 0 0);transform:translate3d(0,var(--mq-split-offset,.72em),0)}to{opacity:1;clip-path:inset(0 0 0 0);transform:translate3d(0,0,0)}}";

function SplitRevealKeyframes() {
  return (
    <style href="mq-split-reveal-text" precedence="medium">
      {SPLIT_REVEAL_KEYFRAMES}
    </style>
  );
}

export type SplitRevealVariant = "soft" | "dramatic";
export type SplitRevealTextProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  variant?: SplitRevealVariant;
  duration?: number;
  stagger?: number;
};

type RevealGlyphStyle = React.CSSProperties & {
  "--mq-split-offset": string;
};

export function SplitRevealText({
  children,
  className,
  duration = 620,
  stagger = 38,
  variant = "soft",
  ...props
}: SplitRevealTextProps) {
  return (
    <>
      <SplitRevealKeyframes />
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
            <span className="inline-block overflow-hidden" key={`${index}-${character}`}>
              <span
                className="inline-block animate-[mq-split-reveal_620ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:[clip-path:none] motion-reduce:[transform:none] forced-colors:animate-none forced-colors:opacity-100 forced-colors:[clip-path:none] forced-colors:[transform:none]"
                style={
                  {
                    "--mq-split-offset": variant === "dramatic" ? "1.1em" : ".58em",
                    animationDelay: `${index * Math.max(0, stagger)}ms`,
                    animationDuration: `${Math.max(160, duration)}ms`,
                  } as RevealGlyphStyle
                }
              >
                {character === " " ? "\u00a0" : character}
              </span>
            </span>
          ))}
        </span>
      </span>
    </>
  );
}
