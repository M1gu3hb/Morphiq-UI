import * as React from "react";
import { cn } from "@/lib/cn";

export type RollingTextVariant = "together" | "staggered";
export type RollingTextProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  variant?: RollingTextVariant;
  focusable?: boolean;
};

export function RollingText({
  children,
  className,
  focusable = false,
  tabIndex,
  variant = "staggered",
  ...props
}: RollingTextProps) {
  return (
    <span
      {...props}
      aria-label={children}
      className={cn(
        "group/mq-roll inline-block whitespace-pre text-inherit [perspective:600px] forced-colors:text-[CanvasText]",
        "focus-visible:rounded-[0.08em] focus-visible:outline-2 focus-visible:outline-offset-[0.14em] focus-visible:outline-current",
        className,
      )}
      tabIndex={tabIndex ?? (focusable ? 0 : undefined)}
    >
      <span aria-hidden="true" className="inline-flex whitespace-pre">
        {Array.from(children).map((character, index) => {
          const glyph = character === " " ? "\u00a0" : character;
          return (
            <span
              className="inline-block h-[1em] overflow-hidden align-[-0.08em] [perspective:4em]"
              key={`${index}-${character}`}
            >
              <span
                className={cn(
                  "flex h-[2em] flex-col [transform-style:preserve-3d] transition-[transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "group-hover/mq-roll:[transform:translateY(-50%)_rotateX(-90deg)] group-focus-visible/mq-roll:[transform:translateY(-50%)_rotateX(-90deg)]",
                  "motion-reduce:![transform:none] motion-reduce:transition-none forced-colors:![transform:none]",
                )}
                style={{ transitionDelay: variant === "staggered" ? `${index * 32}ms` : "0ms" }}
              >
                <span className="h-[1em] leading-[1em] [backface-visibility:hidden]">{glyph}</span>
                <span className="h-[1em] leading-[1em] [backface-visibility:hidden] [transform:rotateX(90deg)]">{glyph}</span>
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
