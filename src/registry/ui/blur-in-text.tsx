import * as React from "react";
import { cn } from "@/lib/cn";

const BLUR_IN_KEYFRAMES =
  "@keyframes mq-blur-in-text{from{opacity:0;filter:blur(var(--mq-blur-in-radius,8px));translate:0 var(--mq-blur-in-rise,.35em)}to{opacity:1;filter:blur(0);translate:0 0}}";

function BlurInKeyframes() {
  return (
    <style href="mq-blur-in-text" precedence="medium">
      {BLUR_IN_KEYFRAMES}
    </style>
  );
}

export type BlurInTextIntensity = "soft" | "dramatic";
export type BlurInTextProps = React.ComponentPropsWithRef<"span"> & {
  intensity?: BlurInTextIntensity;
  duration?: number;
  delay?: number;
  enabled?: boolean;
};

export function BlurInText({
  children,
  className,
  delay = 0,
  duration = 680,
  enabled = true,
  intensity = "soft",
  style,
  ...props
}: BlurInTextProps) {
  const effectStyle = {
    "--mq-blur-in-radius": intensity === "dramatic" ? "14px" : "7px",
    "--mq-blur-in-rise": intensity === "dramatic" ? ".7em" : ".3em",
    animationDelay: `${Math.max(0, delay)}ms`,
    animationDuration: `${Math.max(120, duration)}ms`,
    ...style,
  } as React.CSSProperties;

  return (
    <>
      <BlurInKeyframes />
      <span
        {...props}
        className={cn(
          "inline-block text-inherit forced-colors:text-[CanvasText]",
          enabled && "animate-[mq-blur-in-text_680ms_cubic-bezier(0.22,1,0.36,1)_both]",
          "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:[filter:none] motion-reduce:[translate:none]",
          "forced-colors:animate-none forced-colors:opacity-100 forced-colors:[filter:none] forced-colors:[translate:none]",
          className,
        )}
        style={effectStyle}
      >
        {children}
      </span>
    </>
  );
}
