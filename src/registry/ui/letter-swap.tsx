import * as React from "react";
import { cn } from "@/lib/cn";

export type LetterSwapVariant = "smooth" | "staggered";
export type LetterSwapProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  variant?: LetterSwapVariant;
  focusable?: boolean;
};

export function LetterSwap({
  children,
  className,
  focusable = false,
  tabIndex,
  variant = "staggered",
  ...props
}: LetterSwapProps) {
  return (
    <span
      {...props}
      className={cn(
        "group/mq-letter relative inline-block whitespace-pre text-inherit forced-colors:text-[CanvasText]",
        "focus-visible:rounded-[0.08em] focus-visible:outline-2 focus-visible:outline-offset-[0.12em] focus-visible:outline-current",
        className,
      )}
      tabIndex={tabIndex ?? (focusable ? 0 : undefined)}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="inline-flex whitespace-pre">
        {Array.from(children).map((character, index) => {
          const glyph = character === " " ? "\u00a0" : character;
          return (
            <span className="inline-block h-[1em] overflow-hidden align-[-0.08em]" key={`${index}-${character}`}>
              <span
                className={cn(
                  "flex flex-col transition-[translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "group-hover/mq-letter:-translate-y-1/2 group-focus-visible/mq-letter:-translate-y-1/2",
                  "motion-reduce:!translate-y-0 motion-reduce:transition-none forced-colors:!translate-y-0",
                )}
                style={{ transitionDelay: variant === "staggered" ? `${index * 24}ms` : "0ms" }}
              >
                <span className="h-[1em] leading-[1em]">{glyph}</span>
                <span className="h-[1em] leading-[1em]">{glyph}</span>
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
