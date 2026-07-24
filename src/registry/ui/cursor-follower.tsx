"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const cursorFollowerVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[#0f1219] text-[#f6f8fc]",
    "border-[rgba(244,246,255,0.18)] shadow-[0_18px_48px_rgba(4,7,15,0.3)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#a8ff78]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        ring: "[--mq-cursor:#a8ff78]",
        crosshair: "[--mq-cursor:#7dd3fc]",
      },
      size: {
        sm: "min-h-[150px] rounded-[18px] p-[18px] [--mq-ring-size:28px]",
        md: "min-h-[190px] rounded-[24px] p-[24px] [--mq-ring-size:38px]",
        lg: "min-h-[240px] rounded-[30px] p-[30px] [--mq-ring-size:50px]",
      },
    },
    defaultVariants: { variant: "ring", size: "md" },
  },
);

type CursorFollowerVariant = "ring" | "crosshair";
type CursorFollowerSize = "sm" | "md" | "lg";

export type CursorFollowerProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof cursorFollowerVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: CursorFollowerVariant;
    size?: CursorFollowerSize;
    lag?: number;
  };

export function CursorFollower({
  children,
  className,
  lag = 0.14,
  material = "adaptive",
  onPointerLeave,
  onPointerMove,
  size = "md",
  variant = "ring",
  ...props
}: CursorFollowerProps) {
  const dotRef = React.useRef<HTMLSpanElement>(null);
  const ringRef = React.useRef<HTMLSpanElement>(null);
  const frameRef = React.useRef(0);
  const current = React.useRef({ x: 0, y: 0 });
  const target = React.useRef({ x: 0, y: 0 });

  const schedule = React.useCallback(() => {
    if (frameRef.current) return;
    function tick() {
      const ring = ringRef.current;
      if (!ring) {
        frameRef.current = 0;
        return;
      }
      const amount = Math.max(0.06, Math.min(0.4, lag));
      current.current.x += (target.current.x - current.current.x) * amount;
      current.current.y += (target.current.y - current.current.y) * amount;
      ring.style.translate = `${current.current.x}px ${current.current.y}px`;
      const remaining = Math.hypot(
        target.current.x - current.current.x,
        target.current.y - current.current.y,
      );
      frameRef.current = remaining > 0.12 ? window.requestAnimationFrame(tick) : 0;
    }
    frameRef.current = window.requestAnimationFrame(tick);
  }, [lag]);

  React.useEffect(() => () => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "touch" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.matchMedia("(forced-colors: active)").matches
    ) {
      const bounds = event.currentTarget.getBoundingClientRect();
      target.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      if (dotRef.current) {
        dotRef.current.style.translate = `${target.current.x}px ${target.current.y}px`;
        dotRef.current.style.opacity = "1";
      }
      if (ringRef.current) ringRef.current.style.opacity = "1";
      schedule();
    }
    onPointerMove?.(event);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    if (dotRef.current) dotRef.current.style.opacity = "0";
    if (ringRef.current) ringRef.current.style.opacity = "0";
    onPointerLeave?.(event);
  }

  return (
    <div
      {...props}
      className={cn(cursorFollowerVariants({ size, variant }), className)}
      data-material={material}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 hidden motion-safe:[@media(pointer:fine)]:block motion-reduce:hidden forced-colors:hidden">
        <span
          className={cn(
            "absolute left-0 top-0 size-[var(--mq-ring-size,38px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--mq-cursor,#a8ff78)] opacity-0",
            "shadow-[0_0_18px_var(--mq-cursor,#a8ff78)] transition-opacity duration-200",
            variant === "crosshair" && "rounded-none border-x-0",
          )}
          ref={ringRef}
        />
        <span
          className="absolute left-0 top-0 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--mq-cursor,#a8ff78)] opacity-0 shadow-[0_0_10px_var(--mq-cursor,#a8ff78)] transition-opacity duration-150"
          ref={dotRef}
        />
      </span>
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { cursorFollowerVariants };
