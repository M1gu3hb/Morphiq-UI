import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Gradient Text
 *
 * A low-opacity animated gradient is clipped to an aria-hidden copy while the
 * original currentColor text remains underneath. The host keeps ownership of
 * typography and contrast; this component contributes only the tint in motion.
 */

const GRADIENT_TEXT_KEYFRAMES =
  "@keyframes mq-gradient-text-flow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}";

function GradientTextKeyframes() {
  return (
    <style href="mq-gradient-text-flow" precedence="medium">
      {GRADIENT_TEXT_KEYFRAMES}
    </style>
  );
}

export type GradientTextProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  duration?: number;
  from?: string;
  via?: string;
  to?: string;
};

export function GradientText({
  children,
  className,
  duration = 4.8,
  from = "#ff6b8a",
  style,
  to = "#66d9b7",
  via = "#8f7cff",
  ...props
}: GradientTextProps) {
  const safeDuration = Math.max(1, duration);
  const overlayStyle = {
    "--mq-gradient-from": from,
    "--mq-gradient-via": via,
    "--mq-gradient-to": to,
    animationDuration: `${safeDuration}s`,
  } as React.CSSProperties;

  return (
    <>
      <GradientTextKeyframes />
      <span
        {...props}
        className={cn(
          "relative inline-block text-inherit forced-colors:text-[CanvasText]",
          className,
        )}
        style={style}
      >
        <span className="relative z-0">{children}</span>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] select-none opacity-[0.42]",
            "bg-clip-text text-transparent [-webkit-text-fill-color:transparent]",
            "[background-image:linear-gradient(100deg,var(--mq-gradient-from,#ff6b8a),var(--mq-gradient-via,#8f7cff),var(--mq-gradient-to,#66d9b7),var(--mq-gradient-from,#ff6b8a))]",
            "[background-size:240%_100%] [background-repeat:no-repeat]",
            "animate-[mq-gradient-text-flow_4.8s_ease-in-out_infinite]",
            "motion-reduce:animate-none motion-reduce:opacity-30 forced-colors:hidden",
          )}
          style={overlayStyle}
        >
          {children}
        </span>
      </span>
    </>
  );
}
