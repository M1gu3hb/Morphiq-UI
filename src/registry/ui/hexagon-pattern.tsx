"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const hexagonPatternVariants = cva(
  [
    "relative isolate overflow-hidden",
    "[background-color:var(--mq-bg,#f7f4ed)] text-[color:var(--mq-fg,#171817)]",
    "[--mq-hex:rgba(79,70,229,0.2)] dark:[--mq-bg:#101118] dark:[--mq-fg:#f4f2eb] dark:[--mq-hex:rgba(165,180,252,0.22)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        solid: "",
        faded: "",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-[20px]",
        md: "min-h-[280px] rounded-[24px] p-[28px]",
        lg: "min-h-[380px] rounded-[30px] p-[36px]",
      },
    },
    defaultVariants: { variant: "faded", size: "md" },
  },
);

const HEXAGON_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(30deg, var(--mq-hex, rgba(79,70,229,0.2)) 12%, transparent 12.5%, transparent 87%, var(--mq-hex, rgba(79,70,229,0.2)) 87.5%, var(--mq-hex, rgba(79,70,229,0.2))), linear-gradient(150deg, var(--mq-hex, rgba(79,70,229,0.2)) 12%, transparent 12.5%, transparent 87%, var(--mq-hex, rgba(79,70,229,0.2)) 87.5%, var(--mq-hex, rgba(79,70,229,0.2))), linear-gradient(30deg, var(--mq-hex, rgba(79,70,229,0.2)) 12%, transparent 12.5%, transparent 87%, var(--mq-hex, rgba(79,70,229,0.2)) 87.5%, var(--mq-hex, rgba(79,70,229,0.2))), linear-gradient(150deg, var(--mq-hex, rgba(79,70,229,0.2)) 12%, transparent 12.5%, transparent 87%, var(--mq-hex, rgba(79,70,229,0.2)) 87.5%, var(--mq-hex, rgba(79,70,229,0.2))), linear-gradient(60deg, var(--mq-hex, rgba(79,70,229,0.2)) 25%, transparent 25.5%, transparent 75%, var(--mq-hex, rgba(79,70,229,0.2)) 75%, var(--mq-hex, rgba(79,70,229,0.2)))",
  backgroundPosition: "0 0, 0 0, 22px 38px, 22px 38px, 0 0",
  backgroundSize: "44px 76px",
};

type HexagonPatternVariant = "solid" | "faded";
type HexagonPatternSize = "sm" | "md" | "lg";

export type HexagonPatternProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof hexagonPatternVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: HexagonPatternVariant;
    size?: HexagonPatternSize;
  };

export function HexagonPattern({
  children,
  className,
  material = "adaptive",
  size = "md",
  variant = "faded",
  ...props
}: HexagonPatternProps) {
  return (
    <div
      {...props}
      className={cn(hexagonPatternVariants({ size, variant }), className)}
      data-material={material}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-0 forced-colors:hidden",
          variant === "faded" &&
            "[mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_82%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_82%)]",
        )}
        style={HEXAGON_STYLE}
      />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { hexagonPatternVariants };
