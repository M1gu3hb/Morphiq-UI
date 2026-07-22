import * as React from "react";
import { cn } from "@/lib/cn";

const AURORA_KEYFRAMES =
  "@keyframes mq-aurora-text-flow{0%{background-position:0% 50%;filter:hue-rotate(0deg)}50%{background-position:100% 48%;filter:hue-rotate(18deg)}100%{background-position:0% 50%;filter:hue-rotate(0deg)}}";

function AuroraKeyframes() {
  return (
    <style href="mq-aurora-text-flow" precedence="medium">
      {AURORA_KEYFRAMES}
    </style>
  );
}

export type AuroraTextVariant = "ocean" | "sunset";
export type AuroraTextProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
  children: string;
  variant?: AuroraTextVariant;
  duration?: number;
};

export function AuroraText({
  children,
  className,
  duration = 6.5,
  style,
  variant = "ocean",
  ...props
}: AuroraTextProps) {
  const overlayStyle = {
    animationDuration: `${Math.max(1.2, duration)}s`,
  } as React.CSSProperties;

  return (
    <>
      <AuroraKeyframes />
      <span
        {...props}
        className={cn(
          "relative inline-block text-inherit forced-colors:text-[CanvasText]",
          variant === "ocean"
            ? "[--mq-aurora-a:#31d6c8] [--mq-aurora-b:#6978ff] [--mq-aurora-c:#cb6cff]"
            : "[--mq-aurora-a:#ff7657] [--mq-aurora-b:#ffca5c] [--mq-aurora-c:#d95cff]",
          className,
        )}
        style={style}
      >
        <span className="relative z-0">{children}</span>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] select-none opacity-55",
            "bg-clip-text text-transparent [-webkit-text-fill-color:transparent]",
            "[background-image:radial-gradient(circle_at_20%_30%,var(--mq-aurora-a,#31d6c8),transparent_34%),radial-gradient(circle_at_72%_28%,var(--mq-aurora-c,#cb6cff),transparent_38%),linear-gradient(105deg,var(--mq-aurora-b,#6978ff),var(--mq-aurora-a,#31d6c8),var(--mq-aurora-c,#cb6cff))]",
            "[background-size:240%_180%] [background-repeat:no-repeat]",
            "animate-[mq-aurora-text-flow_6.5s_ease-in-out_infinite] motion-reduce:animate-none forced-colors:hidden",
          )}
          style={overlayStyle}
        >
          {children}
        </span>
      </span>
    </>
  );
}
