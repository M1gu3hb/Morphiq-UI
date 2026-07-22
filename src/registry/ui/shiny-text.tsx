import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Shiny Text
 *
 * The readable text stays as a normal currentColor layer. A second aria-hidden
 * copy carries a translucent, clipped highlight, so animation never replaces
 * the foreground that provides contrast.
 */

const SHINY_TEXT_KEYFRAMES =
  "@keyframes mq-shiny-text-sweep{from{background-position:180% 0}to{background-position:-80% 0}}";

function ShinyTextKeyframes() {
  return (
    <style href="mq-shiny-text-sweep" precedence="medium">
      {SHINY_TEXT_KEYFRAMES}
    </style>
  );
}

export type ShinyTextProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  /** Seconds per highlight pass. */
  duration?: number;
  /** Any CSS color; rendered translucently over the inherited foreground. */
  shineColor?: string;
};

export function ShinyText({
  children,
  className,
  duration = 2.4,
  shineColor = "rgba(255,255,255,0.72)",
  style,
  ...props
}: ShinyTextProps) {
  const safeDuration = Math.max(0.6, duration);
  const overlayStyle = {
    "--mq-shine": shineColor,
    animationDuration: `${safeDuration}s`,
  } as React.CSSProperties;

  return (
    <>
      <ShinyTextKeyframes />
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
            "pointer-events-none absolute inset-0 z-[1] select-none",
            "bg-clip-text text-transparent [-webkit-text-fill-color:transparent]",
            "[background-image:linear-gradient(110deg,transparent_30%,var(--mq-shine,rgba(255,255,255,0.72))_48%,transparent_66%)]",
            "[background-size:260%_100%] [background-repeat:no-repeat]",
            "animate-[mq-shiny-text-sweep_2.4s_ease-in-out_infinite]",
            "motion-reduce:hidden forced-colors:hidden",
          )}
          style={overlayStyle}
        >
          {children}
        </span>
      </span>
    </>
  );
}
