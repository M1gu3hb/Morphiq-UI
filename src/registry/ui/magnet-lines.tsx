"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const magnetLinesVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[#0f1219] text-[#f6f8fc]",
    "border-[rgba(244,246,255,0.18)] shadow-[0_18px_48px_rgba(4,7,15,0.3)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#f4d06f]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        field: "[--mq-line:rgba(168,255,120,.72)]",
        compass: "[--mq-line:rgba(125,211,252,.78)]",
      },
      size: {
        sm: "min-h-[150px] rounded-[18px] p-[18px] [--mq-line-length:16px]",
        md: "min-h-[190px] rounded-[24px] p-[24px] [--mq-line-length:21px]",
        lg: "min-h-[240px] rounded-[30px] p-[30px] [--mq-line-length:27px]",
      },
    },
    defaultVariants: { variant: "field", size: "md" },
  },
);

type MagnetLinesVariant = "field" | "compass";
type MagnetLinesSize = "sm" | "md" | "lg";

export type MagnetLinesProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof magnetLinesVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: MagnetLinesVariant;
    size?: MagnetLinesSize;
    columns?: number;
    rows?: number;
  };

export function MagnetLines({
  children,
  className,
  columns = 8,
  material = "adaptive",
  onPointerLeave,
  onPointerMove,
  rows = 6,
  size = "md",
  variant = "field",
  ...props
}: MagnetLinesProps) {
  const lineRefs = React.useRef<Array<HTMLSpanElement | null>>([]);
  const safeColumns = Math.max(4, Math.min(12, Math.round(columns)));
  const safeRows = Math.max(3, Math.min(9, Math.round(rows)));

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "touch" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.matchMedia("(forced-colors: active)").matches
    ) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const pointerX = event.clientX - bounds.left;
      const pointerY = event.clientY - bounds.top;
      lineRefs.current.forEach((line, index) => {
        if (!line) return;
        const column = index % safeColumns;
        const row = Math.floor(index / safeColumns);
        const x = ((column + 0.5) / safeColumns) * bounds.width;
        const y = ((row + 0.5) / safeRows) * bounds.height;
        line.style.rotate = `${Math.atan2(pointerY - y, pointerX - x) * (180 / Math.PI) + 90}deg`;
      });
    }
    onPointerMove?.(event);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    lineRefs.current.forEach((line) => {
      if (line) line.style.rotate = "0deg";
    });
    onPointerLeave?.(event);
  }

  return (
    <div
      {...props}
      className={cn(magnetLinesVariants({ size, variant }), className)}
      data-material={material}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 grid opacity-55 forced-colors:opacity-35"
        style={{ gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: safeColumns * safeRows }, (_, index) => (
          <span className="grid place-items-center" key={index}>
            <span
              className="h-[var(--mq-line-length,21px)] w-[2px] rounded-full bg-[var(--mq-line,rgba(168,255,120,.72))] shadow-[0_0_8px_var(--mq-line,rgba(168,255,120,.72))] transition-[rotate,opacity] duration-200 ease-out motion-reduce:!rotate-0 motion-reduce:transition-none forced-colors:bg-[CanvasText] forced-colors:shadow-none"
              ref={(node) => {
                lineRefs.current[index] = node;
              }}
            />
          </span>
        ))}
      </span>
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { magnetLinesVariants };
