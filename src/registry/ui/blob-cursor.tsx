"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const blobCursorVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[#0e1118] text-[#f6f8fc]",
    "border-[rgba(244,246,255,0.18)] shadow-[0_18px_48px_rgba(4,7,15,0.3)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#9df8cf]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        aqua: "[--mq-blob:rgba(82,236,194,.68)] [--mq-blob-alt:rgba(79,156,255,.56)]",
        plasma: "[--mq-blob:rgba(221,112,255,.62)] [--mq-blob-alt:rgba(255,142,95,.58)]",
      },
      size: {
        sm: "min-h-[150px] rounded-[18px] p-[18px] [--mq-blob-size:74px]",
        md: "min-h-[190px] rounded-[24px] p-[24px] [--mq-blob-size:96px]",
        lg: "min-h-[240px] rounded-[30px] p-[30px] [--mq-blob-size:122px]",
      },
    },
    defaultVariants: { variant: "aqua", size: "md" },
  },
);

type BlobCursorVariant = "aqua" | "plasma";
type BlobCursorSize = "sm" | "md" | "lg";

export type BlobCursorProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof blobCursorVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: BlobCursorVariant;
    size?: BlobCursorSize;
    stiffness?: number;
  };

export function BlobCursor({
  children,
  className,
  material = "adaptive",
  onPointerLeave,
  onPointerMove,
  size = "md",
  stiffness = 0.16,
  variant = "aqua",
  ...props
}: BlobCursorProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const blobRef = React.useRef<HTMLSpanElement>(null);
  const frameRef = React.useRef(0);
  const current = React.useRef({ x: 0, y: 0 });
  const target = React.useRef({ x: 0, y: 0 });
  const filterId = `mq-blob-${React.useId().replaceAll(":", "")}`;

  const schedule = React.useCallback(() => {
    if (frameRef.current) return;
    function tick() {
      const blob = blobRef.current;
      if (!blob) {
        frameRef.current = 0;
        return;
      }
      const amount = Math.max(0.06, Math.min(0.34, stiffness));
      current.current.x += (target.current.x - current.current.x) * amount;
      current.current.y += (target.current.y - current.current.y) * amount;
      blob.style.translate = `${current.current.x}px ${current.current.y}px`;
      const remaining = Math.hypot(
        target.current.x - current.current.x,
        target.current.y - current.current.y,
      );
      frameRef.current = remaining > 0.15 ? window.requestAnimationFrame(tick) : 0;
    }
    frameRef.current = window.requestAnimationFrame(tick);
  }, [stiffness]);

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
      schedule();
    }
    onPointerMove?.(event);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    target.current = { x: bounds.width / 2, y: bounds.height / 2 };
    schedule();
    onPointerLeave?.(event);
  }

  return (
    <div
      {...props}
      className={cn(blobCursorVariants({ size, variant }), className)}
      data-material={material}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      ref={rootRef}
    >
      <svg aria-hidden="true" className="absolute size-0">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="12" />
            <feColorMatrix
              in="blur"
              result="goo"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            />
          </filter>
        </defs>
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 hidden size-[var(--mq-blob-size,96px)] -translate-x-1/2 -translate-y-1/2 motion-safe:[@media(pointer:fine)]:block motion-reduce:hidden forced-colors:hidden"
        ref={blobRef}
        style={{ filter: `url(#${filterId})` }}
      >
        <span className="absolute inset-[8%] rounded-full bg-[var(--mq-blob,rgba(82,236,194,.68))]" />
        <span className="absolute -right-[18%] bottom-[3%] size-[62%] rounded-full bg-[var(--mq-blob-alt,rgba(79,156,255,.56))]" />
      </span>
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { blobCursorVariants };
