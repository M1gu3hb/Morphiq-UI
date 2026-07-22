import * as React from "react";
import { cn } from "@/lib/cn";

const HIGHLIGHT_KEYFRAMES =
  "@keyframes mq-text-highlight-sweep{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}";

function HighlightKeyframes() {
  return (
    <style href="mq-text-highlight-sweep" precedence="medium">
      {HIGHLIGHT_KEYFRAMES}
    </style>
  );
}

export type TextHighlightVariant = "marker" | "underline";
export type TextHighlightProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  highlights: readonly string[];
  variant?: TextHighlightVariant;
  color?: string;
  duration?: number;
};

function escapePattern(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function TextHighlight({
  children,
  className,
  color = "#f2cf62",
  duration = 620,
  highlights,
  variant = "marker",
  ...props
}: TextHighlightProps) {
  const terms = highlights.filter(Boolean).sort((a, b) => b.length - a.length);
  const normalized = new Set(terms.map((term) => term.toLocaleLowerCase()));
  const parts = terms.length > 0
    ? children.split(new RegExp(`(${terms.map(escapePattern).join("|")})`, "gi"))
    : [children];
  let highlightIndex = 0;

  return (
    <>
      <HighlightKeyframes />
      <span {...props} className={cn("text-inherit forced-colors:text-[CanvasText]", className)}>
        {parts.map((part, index) => {
          if (!normalized.has(part.toLocaleLowerCase())) return <React.Fragment key={`${index}-${part}`}>{part}</React.Fragment>;
          const order = highlightIndex++;
          return (
            <mark
              className="relative isolate bg-transparent text-inherit forced-colors:[text-decoration:underline] forced-colors:decoration-[Highlight]"
              key={`${index}-${part}`}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -z-10 bg-[var(--mq-highlight-color,#f2cf62)] [clip-path:inset(0_0_0_0)] animate-[mq-text-highlight-sweep_620ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none forced-colors:hidden",
                  variant === "marker" ? "inset-x-[-0.08em] bottom-[0.04em] h-[0.72em] -rotate-1 rounded-[0.12em] opacity-80" : "inset-x-0 bottom-[-0.04em] h-[0.16em] rounded-full",
                )}
                style={{
                  "--mq-highlight-color": color,
                  animationDelay: `${order * 110}ms`,
                  animationDuration: `${Math.max(120, duration)}ms`,
                } as React.CSSProperties}
              />
              {part}
            </mark>
          );
        })}
      </span>
    </>
  );
}
