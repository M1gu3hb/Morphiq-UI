/* eslint-disable @next/next/no-img-element -- distributed open-code media effect is framework agnostic */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const PIXEL_KEYFRAMES = `@keyframes mq-pixel-reveal{0%,18%{opacity:1;scale:1}100%{opacity:0;scale:.72}}`;

function PixelKeyframes() {
  return <style href="mq-pixel-reveal" precedence="medium">{PIXEL_KEYFRAMES}</style>;
}

const pixelRevealVariants = cva(
  [
    "relative isolate m-0 overflow-hidden border border-[rgba(244,246,255,0.18)] bg-[#11131a] text-[#f5f7ff]",
    "shadow-[0_18px_48px_rgba(7,9,16,0.28)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        mosaic: "[--mq-pixel:#171c28]",
        luminous: "[--mq-pixel:#204b58]",
      },
      size: {
        sm: "h-[170px] rounded-[18px]",
        md: "h-[230px] rounded-[24px]",
        lg: "h-[300px] rounded-[30px]",
      },
    },
    defaultVariants: { variant: "mosaic", size: "md" },
  },
);

type PixelRevealVariant = "mosaic" | "luminous";
type PixelRevealSize = "sm" | "md" | "lg";

export type PixelRevealProps = Omit<React.ComponentPropsWithRef<"figure">, "children"> &
  Omit<VariantProps<typeof pixelRevealVariants>, "variant" | "size"> & {
    src: string;
    alt: string;
    caption?: string;
    material?: MaterialSlug;
    variant?: PixelRevealVariant;
    size?: PixelRevealSize;
    columns?: number;
    rows?: number;
    replayKey?: string | number;
  };

export function PixelReveal({
  alt,
  caption,
  className,
  columns = 7,
  material = "adaptive",
  replayKey = 0,
  rows = 5,
  size = "md",
  src,
  variant = "mosaic",
  ...props
}: PixelRevealProps) {
  const safeColumns = Math.max(3, Math.min(10, Math.round(columns)));
  const safeRows = Math.max(3, Math.min(8, Math.round(rows)));
  const total = safeColumns * safeRows;

  return (
    <figure
      {...props}
      className={cn(pixelRevealVariants({ size, variant }), className)}
      data-material={material}
    >
      <PixelKeyframes />
      <img alt={alt} className="size-full object-cover" height={900} src={src} width={1400} />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 grid motion-reduce:hidden forced-colors:hidden"
        key={replayKey}
        style={{ gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: total }, (_, index) => {
          const column = index % safeColumns;
          const row = Math.floor(index / safeColumns);
          const delay = variant === "luminous"
            ? Math.hypot(column - safeColumns / 2, row - safeRows / 2) * 0.055
            : (column + row) * 0.045;
          return (
            <span
              className="bg-[var(--mq-pixel,#171c28)] animate-[mq-pixel-reveal_.58s_cubic-bezier(.2,.7,.2,1)_both]"
              key={`${row}-${column}`}
              style={{ animationDelay: `${delay}s` }}
            />
          );
        })}
      </span>
      {caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 z-20 bg-[linear-gradient(transparent,rgba(0,0,0,.86))] px-[18px] pt-[48px] pb-[15px] text-[13px] font-bold text-white forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export { pixelRevealVariants };
