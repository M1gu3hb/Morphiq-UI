import * as React from "react";
import { cn } from "@/lib/cn";

const SPARKLES_KEYFRAMES =
  "@keyframes mq-sparkles-text-pop{0%,100%{opacity:0;scale:.35;rotate:-18deg}38%{opacity:1;scale:1;rotate:0deg}62%{opacity:.72;scale:.82;rotate:14deg}}";

function SparklesKeyframes() {
  return (
    <style href="mq-sparkles-text-pop" precedence="medium">
      {SPARKLES_KEYFRAMES}
    </style>
  );
}

const POSITIONS = [
  ["2%", "8%", "0s", "1.9s"],
  ["18%", "-18%", "-.8s", "2.4s"],
  ["38%", "12%", "-1.4s", "2.1s"],
  ["58%", "-22%", "-.3s", "2.6s"],
  ["78%", "16%", "-1.1s", "2.2s"],
  ["96%", "-5%", "-.6s", "1.8s"],
  ["10%", "82%", "-1.6s", "2.5s"],
  ["27%", "105%", "-.5s", "2s"],
  ["47%", "88%", "-1.2s", "2.7s"],
  ["66%", "110%", "-.2s", "2.1s"],
  ["84%", "86%", "-1.5s", "2.4s"],
  ["101%", "96%", "-.9s", "2.2s"],
] as const;

export type SparklesTextDensity = "subtle" | "dense";
export type SparklesTextProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  density?: SparklesTextDensity;
  sparkleColor?: string;
};

export function SparklesText({
  children,
  className,
  density = "subtle",
  sparkleColor = "#8f6cff",
  style,
  ...props
}: SparklesTextProps) {
  const positions = density === "dense" ? POSITIONS : POSITIONS.slice(0, 6);

  return (
    <>
      <SparklesKeyframes />
      <span
        {...props}
        className={cn("relative inline-block text-inherit forced-colors:text-[CanvasText]", className)}
        style={style}
      >
        {children}
        <span aria-hidden="true" className="pointer-events-none absolute inset-[-0.42em] select-none motion-reduce:hidden forced-colors:hidden">
          {positions.map(([left, top, delay, duration], index) => (
            <span
              className="absolute text-[0.24em] leading-none text-[var(--mq-sparkle-color,#8f6cff)] animate-[mq-sparkles-text-pop_2.2s_ease-in-out_infinite]"
              key={`${left}-${top}`}
              style={{
                "--mq-sparkle-color": sparkleColor,
                animationDelay: delay,
                animationDuration: duration,
                left,
                top,
              } as React.CSSProperties}
            >
              {index % 3 === 0 ? "✦" : "✧"}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}
