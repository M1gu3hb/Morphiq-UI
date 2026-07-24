import * as React from "react";
import { cn } from "@/lib/cn";

const NEON_KEYFRAMES =
  "@keyframes mq-neon-flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1;text-shadow:0 0 .08em var(--mq-neon-core,#dffcff),0 0 .22em var(--mq-neon-color,#22d3ee),0 0 .62em var(--mq-neon-color,#22d3ee),0 0 1.1em var(--mq-neon-glow,rgba(34,211,238,.62))}20%,24%,55%{opacity:.82;text-shadow:0 0 .06em var(--mq-neon-core,#dffcff),0 0 .2em var(--mq-neon-color,#22d3ee)}}";

function NeonKeyframes() {
  return (
    <style href="mq-neon-text" precedence="medium">
      {NEON_KEYFRAMES}
    </style>
  );
}

export type NeonTextVariant = "cyan" | "magenta";
export type NeonTextProps = React.ComponentPropsWithRef<"span"> & {
  variant?: NeonTextVariant;
  flicker?: boolean;
  duration?: number;
};

export function NeonText({
  children,
  className,
  duration = 4.8,
  flicker = true,
  style,
  variant = "cyan",
  ...props
}: NeonTextProps) {
  return (
    <>
      <NeonKeyframes />
      <span
        {...props}
        className={cn(
          "inline-block text-inherit [text-shadow:0_0_.08em_var(--mq-neon-core,#dffcff),0_0_.22em_var(--mq-neon-color,#22d3ee),0_0_.62em_var(--mq-neon-color,#22d3ee),0_0_1.1em_var(--mq-neon-glow,rgba(34,211,238,.62))]",
          variant === "cyan"
            ? "[--mq-neon-core:#e6fcff] [--mq-neon-color:#22d3ee] [--mq-neon-glow:rgba(34,211,238,.62)]"
            : "[--mq-neon-core:#fff0fb] [--mq-neon-color:#f472b6] [--mq-neon-glow:rgba(244,114,182,.62)]",
          flicker && "animate-[mq-neon-flicker_4.8s_linear_infinite]",
          "motion-reduce:animate-none forced-colors:animate-none forced-colors:text-[CanvasText] forced-colors:[text-shadow:none]",
          className,
        )}
        style={{ ...style, animationDuration: `${Math.max(1.5, duration)}s` }}
      >
        {children}
      </span>
    </>
  );
}
