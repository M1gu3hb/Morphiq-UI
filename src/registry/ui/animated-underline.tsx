import * as React from "react";
import { cn } from "@/lib/cn";

const UNDERLINE_KEYFRAMES =
  "@keyframes mq-underline-enter{from{scale:0 1}to{scale:1 1}}";

function UnderlineKeyframes() {
  return (
    <style href="mq-animated-underline" precedence="medium">
      {UNDERLINE_KEYFRAMES}
    </style>
  );
}

export type AnimatedUnderlineVariant = "interaction" | "entrance";
export type AnimatedUnderlineProps = React.ComponentPropsWithRef<"span"> & {
  variant?: AnimatedUnderlineVariant;
  color?: string;
  thickness?: number;
  focusable?: boolean;
};

type UnderlineStyle = React.CSSProperties & {
  "--mq-underline-color": string;
  "--mq-underline-thickness": string;
};

export function AnimatedUnderline({
  children,
  className,
  color = "currentColor",
  focusable = false,
  style,
  tabIndex,
  thickness = 3,
  variant = "interaction",
  ...props
}: AnimatedUnderlineProps) {
  const underlineStyle: UnderlineStyle = {
    ...style,
    "--mq-underline-color": color,
    "--mq-underline-thickness": `${Math.max(1, thickness)}px`,
  };

  return (
    <>
      <UnderlineKeyframes />
      <span
        {...props}
        className={cn(
          "group/mq-underline relative inline-block text-inherit forced-colors:text-[CanvasText]",
          "focus-visible:rounded-[0.08em] focus-visible:outline-2 focus-visible:outline-offset-[0.16em] focus-visible:outline-current",
          className,
        )}
        style={underlineStyle}
        tabIndex={tabIndex ?? (focusable ? 0 : undefined)}
      >
        {children}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-[-0.12em] h-[var(--mq-underline-thickness,3px)] origin-left rounded-full bg-[var(--mq-underline-color,currentColor)] forced-colors:bg-[CanvasText]",
            variant === "interaction"
              ? "scale-x-0 transition-[scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/mq-underline:scale-x-100 group-focus-visible/mq-underline:scale-x-100 motion-reduce:scale-x-100 motion-reduce:transition-none"
              : "animate-[mq-underline-enter_620ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none motion-reduce:scale-x-100",
          )}
        />
      </span>
    </>
  );
}
