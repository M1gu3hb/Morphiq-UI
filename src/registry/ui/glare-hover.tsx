import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const glareHoverVariants = cva(
  [
    "group relative isolate overflow-hidden border bg-[#11141b] text-[#f6f8fc]",
    "border-[rgba(244,246,255,0.18)] shadow-[0_18px_48px_rgba(4,7,15,0.3)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#a8ff78]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        silver: "[--mq-glare:rgba(255,255,255,.42)]",
        warm: "[--mq-glare:rgba(255,205,128,.46)]",
      },
      size: {
        sm: "min-h-[120px] rounded-[18px] p-[18px]",
        md: "min-h-[156px] rounded-[24px] p-[24px]",
        lg: "min-h-[196px] rounded-[30px] p-[30px]",
      },
    },
    defaultVariants: { variant: "silver", size: "md" },
  },
);

type GlareHoverVariant = "silver" | "warm";
type GlareHoverSize = "sm" | "md" | "lg";

export type GlareHoverProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof glareHoverVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: GlareHoverVariant;
    size?: GlareHoverSize;
  };

export function GlareHover({
  children,
  className,
  material = "adaptive",
  size = "md",
  variant = "silver",
  ...props
}: GlareHoverProps) {
  return (
    <div
      {...props}
      className={cn(glareHoverVariants({ size, variant }), className)}
      data-material={material}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-y-[45%] left-0 z-10 w-[58%] -skew-x-12 -translate-x-[150%] opacity-0",
          "bg-[linear-gradient(90deg,transparent,var(--mq-glare,rgba(255,255,255,.42)),transparent)] blur-[2px]",
          "transition-[translate,opacity] duration-700 ease-[cubic-bezier(.2,.75,.2,1)]",
          "group-hover:translate-x-[280%] group-hover:opacity-100 group-focus-within:translate-x-[280%] group-focus-within:opacity-100",
          "motion-reduce:translate-x-[72%] motion-reduce:opacity-20 motion-reduce:transition-none forced-colors:hidden",
        )}
      />
      <div className="relative z-0 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { glareHoverVariants };
