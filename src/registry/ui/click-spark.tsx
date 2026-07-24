"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type SparkBurst = { id: number; x: number; y: number };

const SPARK_KEYFRAMES = `@keyframes mq-click-spark{0%{translate:0 0;scale:.35;opacity:0}18%{opacity:1}100%{translate:var(--mq-spark-x,0px) var(--mq-spark-y,0px);scale:1;opacity:0}}`;

function SparkKeyframes() {
  return <style href="mq-click-spark" precedence="medium">{SPARK_KEYFRAMES}</style>;
}

const clickSparkVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[#10131a] text-[#f7f8fc]",
    "border-[rgba(244,246,255,0.18)] shadow-[0_18px_48px_rgba(4,7,15,0.3)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#9df8cf]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        star: "[--mq-spark:#9df8cf]",
        ember: "[--mq-spark:#ffb86b]",
      },
      size: {
        sm: "min-h-[120px] rounded-[18px] p-[18px]",
        md: "min-h-[156px] rounded-[24px] p-[24px]",
        lg: "min-h-[196px] rounded-[30px] p-[30px]",
      },
    },
    defaultVariants: { variant: "star", size: "md" },
  },
);

type ClickSparkVariant = "star" | "ember";
type ClickSparkSize = "sm" | "md" | "lg";

export type ClickSparkProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof clickSparkVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: ClickSparkVariant;
    size?: ClickSparkSize;
    sparkCount?: number;
  };

export function ClickSpark({
  children,
  className,
  material = "adaptive",
  onPointerDown,
  size = "md",
  sparkCount = 10,
  variant = "star",
  ...props
}: ClickSparkProps) {
  const [bursts, setBursts] = React.useState<SparkBurst[]>([]);
  const nextId = React.useRef(0);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (
      event.button === 0 &&
      !window.matchMedia("(forced-colors: active)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const bounds = event.currentTarget.getBoundingClientRect();
      setBursts((current) => [
        ...current.slice(-3),
        {
          id: nextId.current++,
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        },
      ]);
    }
    onPointerDown?.(event);
  }

  const count = Math.max(6, Math.min(16, Math.round(sparkCount)));

  return (
    <div
      {...props}
      className={cn(clickSparkVariants({ size, variant }), className)}
      data-material={material}
      onPointerDown={handlePointerDown}
    >
      <SparkKeyframes />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 motion-reduce:hidden forced-colors:hidden">
        {bursts.map((burst) => (
          <span
            className="absolute"
            key={burst.id}
            onAnimationEnd={() => setBursts((current) => current.filter((item) => item.id !== burst.id))}
            style={{ left: burst.x, top: burst.y }}
          >
            {Array.from({ length: count }, (_, index) => {
              const angle = (Math.PI * 2 * index) / count;
              const distance = 28 + (index % 3) * 8;
              return (
                <span
                  className="absolute left-[-2px] top-[-2px] size-[4px] rounded-full bg-[var(--mq-spark,#9df8cf)] shadow-[0_0_10px_var(--mq-spark,#9df8cf)] animate-[mq-click-spark_.52s_cubic-bezier(.16,.8,.3,1)_both]"
                  key={index}
                  style={{
                    "--mq-spark-x": `${Math.cos(angle) * distance}px`,
                    "--mq-spark-y": `${Math.sin(angle) * distance}px`,
                  } as React.CSSProperties}
                />
              );
            })}
          </span>
        ))}
      </span>
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { clickSparkVariants };
