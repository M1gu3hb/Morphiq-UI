"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SYMBOLS = "#%&*+-=<>?/\\{}[]";

export type TextScrambleMode = "letters" | "symbols";
export type TextScrambleProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  mode?: TextScrambleMode;
  speed?: number;
  play?: boolean;
};

function scramble(text: string, resolved: number, charset: string) {
  return Array.from(text)
    .map((character, index) => {
      if (/\s/.test(character) || index < resolved) return character;
      return charset[(index * 11 + resolved * 7) % charset.length] ?? character;
    })
    .join("");
}

export function TextScramble({
  children,
  className,
  mode = "letters",
  play = true,
  speed = 42,
  ...props
}: TextScrambleProps) {
  const glyphs = Array.from(children);
  const [resolved, setResolved] = React.useState(0);
  const charset = mode === "symbols" ? SYMBOLS : LETTERS;

  React.useEffect(() => {
    let interval = 0;
    let resetFrame = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!play || reduced) {
      resetFrame = window.requestAnimationFrame(() => setResolved(glyphs.length));
      return () => window.cancelAnimationFrame(resetFrame);
    }

    resetFrame = window.requestAnimationFrame(() => setResolved(0));
    interval = window.setInterval(
      () =>
        setResolved((current) => {
          if (current >= glyphs.length) {
            window.clearInterval(interval);
            return glyphs.length;
          }
          return current + 1;
        }),
      Math.max(20, speed),
    );
    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.clearInterval(interval);
    };
  }, [children, glyphs.length, play, speed]);

  return (
    <span
      {...props}
      className={cn(
        "relative inline-grid whitespace-pre text-inherit forced-colors:text-[CanvasText]",
        className,
      )}
      data-resolved={resolved >= glyphs.length ? "true" : "false"}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {children}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1 font-mono motion-reduce:hidden forced-colors:hidden">
        {scramble(children, resolved, charset)}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1 hidden motion-reduce:inline forced-colors:inline">
        {children}
      </span>
    </span>
  );
}
