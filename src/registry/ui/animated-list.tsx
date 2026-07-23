import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const LIST_KEYFRAMES = `@keyframes mq-animated-list{0%{translate:0 var(--mq-list-shift,12px);opacity:0}100%{translate:0 0;opacity:1}}`;

function ListKeyframes() {
  return <style href="mq-animated-list" precedence="medium">{LIST_KEYFRAMES}</style>;
}

const animatedListVariants = cva(
  [
    "m-0 grid list-none border border-[rgba(244,246,255,0.18)] bg-[#11131a] text-[#f5f7ff]",
    "shadow-[0_18px_48px_rgba(7,9,16,0.28)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        slide: "[--mq-list-shift:14px]",
        fade: "[--mq-list-shift:0px]",
      },
      size: {
        sm: "gap-[7px] rounded-[18px] p-[12px]",
        md: "gap-[9px] rounded-[24px] p-[16px]",
        lg: "gap-[11px] rounded-[30px] p-[20px]",
      },
    },
    defaultVariants: { variant: "slide", size: "md" },
  },
);

type AnimatedListVariant = "slide" | "fade";
type AnimatedListSize = "sm" | "md" | "lg";

export type AnimatedListItem = { id: string; content: React.ReactNode };

export type AnimatedListProps = Omit<React.ComponentPropsWithRef<"ul">, "children"> &
  Omit<VariantProps<typeof animatedListVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: AnimatedListVariant;
    size?: AnimatedListSize;
    items: readonly AnimatedListItem[];
    /** Change to replay the full sequence; newly keyed items animate automatically. */
    animationKey?: string | number;
    stagger?: number;
  };

export function AnimatedList({
  animationKey = 0,
  className,
  items,
  material = "adaptive",
  size = "md",
  stagger = 0.08,
  variant = "slide",
  ...props
}: AnimatedListProps) {
  return (
    <ul
      {...props}
      className={cn(animatedListVariants({ size, variant }), className)}
      data-material={material}
    >
      <ListKeyframes />
      {items.map((item, index) => (
        <li
          className={cn(
            "rounded-[14px] border border-white/10 bg-[#1a1d27] px-[14px] py-[12px] opacity-0",
            "animate-[mq-animated-list_.48s_cubic-bezier(.2,.7,.2,1)_both]",
            "motion-reduce:animate-none motion-reduce:translate-none motion-reduce:opacity-100",
            "forced-colors:animate-none forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:opacity-100",
          )}
          key={`${animationKey}:${item.id}`}
          style={{ animationDelay: `${Math.max(0, stagger) * index}s` }}
        >
          {item.content}
        </li>
      ))}
    </ul>
  );
}

export { animatedListVariants };
