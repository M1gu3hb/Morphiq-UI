import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.78' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.72'/%3E%3C/svg%3E\")";

const noiseOverlayVariants = cva(
  [
    "relative isolate overflow-hidden border border-[rgba(244,246,255,0.18)]",
    "bg-[#11131a] text-[#f5f7ff] shadow-[0_18px_48px_rgba(7,9,16,0.28)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        fine: "",
        coarse: "",
      },
      size: {
        sm: "min-h-[120px] rounded-[18px] p-[18px]",
        md: "min-h-[156px] rounded-[24px] p-[24px]",
        lg: "min-h-[196px] rounded-[30px] p-[30px]",
      },
    },
    defaultVariants: { variant: "fine", size: "md" },
  },
);

type NoiseOverlayVariant = "fine" | "coarse";
type NoiseOverlaySize = "sm" | "md" | "lg";

export type NoiseOverlayProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof noiseOverlayVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: NoiseOverlayVariant;
    size?: NoiseOverlaySize;
    opacity?: number;
  };

export function NoiseOverlay({
  children,
  className,
  material = "adaptive",
  opacity = 0.12,
  size = "md",
  variant = "fine",
  ...props
}: NoiseOverlayProps) {
  return (
    <div
      {...props}
      className={cn(noiseOverlayVariants({ size, variant }), className)}
      data-material={material}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 forced-colors:hidden"
        style={{
          backgroundImage: NOISE_URI,
          backgroundSize: variant === "fine" ? "150px 150px" : "76px 76px",
          mixBlendMode: variant === "fine" ? "soft-light" : "overlay",
          opacity: Math.min(0.32, Math.max(0, opacity)),
        }}
      />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { noiseOverlayVariants };
