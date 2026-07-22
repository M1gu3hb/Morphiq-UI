"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type InteractiveStyle = React.CSSProperties & Record<"--mq-x" | "--mq-y", string>;

const interactiveGridVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#f7f4ed)] text-[color:var(--mq-fg,#171817)]",
    "dark:[--mq-bg:#0f1118] dark:[--mq-fg:#f5f3ec]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        cool:
          "[--mq-grid:rgba(79,70,229,0.22)] [--mq-grid-hot:rgba(37,99,235,0.72)] dark:[--mq-grid:rgba(165,180,252,0.2)] dark:[--mq-grid-hot:rgba(125,211,252,0.72)]",
        warm:
          "[--mq-grid:rgba(190,24,93,0.2)] [--mq-grid-hot:rgba(234,88,12,0.7)] dark:[--mq-grid:rgba(251,113,133,0.2)] dark:[--mq-grid-hot:rgba(253,186,116,0.72)]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-[20px]",
        md: "min-h-[280px] rounded-[24px] p-[28px]",
        lg: "min-h-[380px] rounded-[30px] p-[36px]",
      },
    },
    defaultVariants: { variant: "cool", size: "md" },
  },
);

const GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(var(--mq-grid, rgba(79,70,229,0.22)) 1px, transparent 1px), linear-gradient(90deg, var(--mq-grid, rgba(79,70,229,0.22)) 1px, transparent 1px)",
  backgroundSize: "30px 30px",
};

const INTERACTIVE_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(var(--mq-grid-hot, rgba(37,99,235,0.72)) 1px, transparent 1px), linear-gradient(90deg, var(--mq-grid-hot, rgba(37,99,235,0.72)) 1px, transparent 1px), radial-gradient(circle at var(--mq-x, 50%) var(--mq-y, 50%), var(--mq-grid-hot, rgba(37,99,235,0.72)), transparent 38%)",
  backgroundSize: "30px 30px, 30px 30px, 100% 100%",
  maskImage: "radial-gradient(160px circle at var(--mq-x, 50%) var(--mq-y, 50%), #000 12%, transparent 72%)",
  WebkitMaskImage:
    "radial-gradient(160px circle at var(--mq-x, 50%) var(--mq-y, 50%), #000 12%, transparent 72%)",
};

const STATIC_HIGHLIGHT_STYLE: React.CSSProperties = {
  ...INTERACTIVE_STYLE,
  maskImage: "radial-gradient(150px circle at 50% 50%, #000 12%, transparent 72%)",
  WebkitMaskImage: "radial-gradient(150px circle at 50% 50%, #000 12%, transparent 72%)",
};

type InteractiveGridVariant = "cool" | "warm";
type InteractiveGridSize = "sm" | "md" | "lg";

export type InteractiveGridProps = Omit<React.ComponentPropsWithRef<"div">, "onPointerMove" | "onPointerLeave"> &
  Omit<VariantProps<typeof interactiveGridVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: InteractiveGridVariant;
    size?: InteractiveGridSize;
    onPointerMove?: React.PointerEventHandler<HTMLDivElement>;
    onPointerLeave?: React.PointerEventHandler<HTMLDivElement>;
  };

export function InteractiveGrid({
  children,
  className,
  material = "adaptive",
  onPointerLeave,
  onPointerMove,
  size = "md",
  style,
  variant = "cool",
  ...props
}: InteractiveGridProps) {
  const rootStyle: InteractiveStyle = { "--mq-x": "50%", "--mq-y": "50%", ...style };

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty("--mq-x", `${x}%`);
    event.currentTarget.style.setProperty("--mq-y", `${y}%`);
    onPointerMove?.(event);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--mq-x", "50%");
    event.currentTarget.style.setProperty("--mq-y", "50%");
    onPointerLeave?.(event);
  }

  return (
    <div
      {...props}
      className={cn(interactiveGridVariants({ size, variant }), className)}
      data-material={material}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={rootStyle}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-55 forced-colors:hidden"
        style={GRID_STYLE}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 motion-reduce:hidden forced-colors:hidden"
        style={INTERACTIVE_STYLE}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden motion-reduce:block forced-colors:hidden"
        style={STATIC_HIGHLIGHT_STYLE}
      />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { interactiveGridVariants };
