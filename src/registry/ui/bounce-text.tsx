import * as React from "react";
import { cn } from "@/lib/cn";

const BOUNCE_KEYFRAMES =
  "@keyframes mq-bounce-text{0%{opacity:0;transform:translate3d(0,var(--mq-bounce-height,.8em),0) scale(.72)}52%{opacity:1;transform:translate3d(0,calc(var(--mq-bounce-height,.8em) * -.28),0) scale(1.08)}72%{transform:translate3d(0,calc(var(--mq-bounce-height,.8em) * .12),0) scale(.98)}86%{transform:translate3d(0,calc(var(--mq-bounce-height,.8em) * -.04),0) scale(1.01)}100%{opacity:1;transform:translate3d(0,0,0) scale(1)}}";

function BounceKeyframes() {
  return (
    <style href="mq-bounce-text" precedence="medium">
      {BOUNCE_KEYFRAMES}
    </style>
  );
}

export type BounceTextVariant = "soft" | "elastic";
export type BounceTextProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  variant?: BounceTextVariant;
  duration?: number;
  stagger?: number;
};

type BounceGlyphStyle = React.CSSProperties & {
  "--mq-bounce-height": string;
};

export function BounceText({
  children,
  className,
  duration = 760,
  stagger = 48,
  variant = "soft",
  ...props
}: BounceTextProps) {
  return (
    <>
      <BounceKeyframes />
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
              className="inline-block animate-[mq-bounce-text_760ms_linear_both] motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:[transform:none] forced-colors:animate-none forced-colors:opacity-100 forced-colors:[transform:none]"
              key={`${index}-${character}`}
              style={
                {
                  "--mq-bounce-height": variant === "elastic" ? "1.15em" : ".65em",
                  animationDelay: `${index * Math.max(0, stagger)}ms`,
                  animationDuration: `${Math.max(260, duration)}ms`,
                  animationTimingFunction:
                    variant === "elastic"
                      ? "cubic-bezier(.34,1.56,.64,1)"
                      : "cubic-bezier(.22,1,.36,1)",
                } as BounceGlyphStyle
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
