"use client";

/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const imageComparisonVariants = cva(
  [
    "relative isolate m-0 overflow-hidden border bg-[var(--mq-body,#f7e7dc)] text-[color:var(--mq-text,#33261e)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#f7e7dc] [--mq-text:#33261e] [--mq-brd:rgba(88,51,38,0.3)] [--mq-divider:#fff4ec] [--mq-knob:#c9482f] [--mq-ring:#33261e]",
          "border-[var(--mq-brd,rgba(88,51,38,0.3))] shadow-[inset_0_2px_3px_rgba(255,255,255,0.72),0_5px_0_#d2a082,0_15px_28px_rgba(86,48,33,0.18)]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(20,24,31,0.92)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.44)] [--mq-divider:#ffffff] [--mq-knob:#14212b] [--mq-ring:#ffffff]",
          "border-[var(--mq-brd,rgba(255,255,255,0.44))] backdrop-blur-[18px] backdrop-saturate-[160%] shadow-[inset_0_1px_0_rgba(255,255,255,0.46),0_18px_36px_rgba(12,16,30,0.28)]",
        ].join(" "),
        skeuo: [
          "[--mq-body:#e6e3da] [--mq-text:#23231f] [--mq-brd:#97938a] [--mq-divider:#f7f4ed] [--mq-knob:#555149] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#97938a)] shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-4px_6px_rgba(0,0,0,0.13),0_5px_0_#a8a49b,0_15px_26px_rgba(38,36,31,0.23)]",
        ].join(" "),
        adaptive: [
          "[--mq-body:#171817] [--mq-text:#f7f6f2] [--mq-brd:#3f403c] [--mq-divider:#ffffff] [--mq-knob:#171817] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#3f403c)] shadow-[0_16px_34px_rgba(20,20,18,0.2)]",
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:#aaa69d] dark:[--mq-divider:#171817] dark:[--mq-knob:#ffffff] dark:[--mq-ring:#f1efe9]",
        ].join(" "),
      },
      variant: { labels: "", clean: "" },
      size: {
        sm: "h-[230px] rounded-[18px]",
        md: "h-[320px] rounded-[24px]",
        lg: "h-[410px] rounded-[30px]",
      },
    },
    defaultVariants: { material: "clay", variant: "labels", size: "md" },
  },
);

export type ImageComparisonProps = Omit<React.ComponentPropsWithRef<"figure">, "children"> &
  Omit<VariantProps<typeof imageComparisonVariants>, "material" | "variant" | "size"> & {
    beforeSrc: string;
    beforeAlt: string;
    beforeLabel?: string;
    afterSrc: string;
    afterAlt: string;
    afterLabel?: string;
    initialValue?: number;
    material?: MaterialSlug;
    variant?: "labels" | "clean";
    size?: "sm" | "md" | "lg";
    step?: number;
    onValueChange?: (value: number) => void;
  };

export function ImageComparison({
  "aria-label": ariaLabel = "Before and after image comparison",
  afterAlt,
  afterLabel = "After",
  afterSrc,
  beforeAlt,
  beforeLabel = "Before",
  beforeSrc,
  className,
  initialValue = 50,
  material = "clay",
  onValueChange,
  ref,
  size = "md",
  step = 1,
  variant = "labels",
  ...props
}: ImageComparisonProps) {
  const [value, setValue] = React.useState(() => Math.max(0, Math.min(100, initialValue)));
  const [dragging, setDragging] = React.useState(false);
  const rootRef = React.useRef<HTMLElement | null>(null);

  const setRootRef = React.useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const commit = React.useCallback(
    (next: number) => {
      const safe = Math.max(0, Math.min(100, Math.round(next * 10) / 10));
      setValue(safe);
      onValueChange?.(safe);
    },
    [onValueChange],
  );

  const updateFromClientX = React.useCallback(
    (clientX: number) => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      commit(((clientX - rect.left) / rect.width) * 100);
    },
    [commit],
  );

  return (
    <figure
      {...props}
      aria-label={ariaLabel}
      className={cn(imageComparisonVariants({ material, size, variant }), className)}
      data-material={material}
      ref={setRootRef}
    >
      <div className="absolute inset-[8px] overflow-hidden rounded-[inherit] forced-colors:border forced-colors:border-[CanvasText]">
        <img alt={afterAlt} className="absolute inset-0 size-full object-cover" draggable={false} src={afterSrc} />
        <div
          className={cn(
            "absolute inset-0 overflow-hidden transition-[clip-path] duration-150 ease-out",
            "data-[dragging=true]:transition-none motion-reduce:transition-none",
          )}
          data-dragging={dragging ? "true" : "false"}
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          <img alt={beforeAlt} className="absolute inset-0 size-full max-w-none object-cover" draggable={false} src={beforeSrc} />
        </div>

        {variant === "labels" ? (
          <>
            <span className="absolute top-[14px] left-[14px] rounded-full bg-[rgba(0,0,0,0.74)] px-[10px] py-[6px] text-[11px]/none font-extrabold tracking-[0.08em] text-white uppercase forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">
              {beforeLabel}
            </span>
            <span className="absolute top-[14px] right-[14px] rounded-full bg-[rgba(0,0,0,0.74)] px-[10px] py-[6px] text-[11px]/none font-extrabold tracking-[0.08em] text-white uppercase forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">
              {afterLabel}
            </span>
          </>
        ) : null}

        <div
          aria-label={`Reveal ${beforeLabel} versus ${afterLabel}`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(value)}
          aria-valuetext={`${Math.round(value)}% ${beforeLabel}, ${Math.round(100 - value)}% ${afterLabel}`}
          className={cn(
            "absolute inset-y-0 z-[2] w-[3px] -translate-x-1/2 cursor-ew-resize touch-none bg-[var(--mq-divider,#fff4ec)]",
            "transition-[left] duration-150 ease-out data-[dragging=true]:transition-none motion-reduce:transition-none",
            "focus-visible:outline-2 focus-visible:outline-offset-[4px] focus-visible:outline-[var(--mq-ring,#171817)]",
            "forced-colors:bg-[CanvasText] forced-colors:focus-visible:outline-[Highlight]",
          )}
          data-dragging={dragging ? "true" : "false"}
          onKeyDown={(event) => {
            if (event.key === "Home") commit(0);
            else if (event.key === "End") commit(100);
            else if (event.key === "PageDown") commit(value - step * 10);
            else if (event.key === "PageUp") commit(value + step * 10);
            else if (event.key === "ArrowLeft" || event.key === "ArrowDown") commit(value - step);
            else if (event.key === "ArrowRight" || event.key === "ArrowUp") commit(value + step);
            else return;
            event.preventDefault();
          }}
          onPointerCancel={(event) => {
            setDragging(false);
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerDown={(event) => {
            setDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
            updateFromClientX(event.clientX);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) updateFromClientX(event.clientX);
          }}
          onPointerUp={(event) => {
            updateFromClientX(event.clientX);
            setDragging(false);
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          role="slider"
          style={{ left: `${value}%` }}
          tabIndex={0}
        >
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 grid size-[42px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[var(--mq-divider,#fff4ec)] bg-[var(--mq-knob,#c9482f)] text-[18px] text-[var(--mq-divider,#fff4ec)] shadow-[0_5px_16px_rgba(0,0,0,0.3)] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]"
          >
            ↔
          </span>
        </div>
      </div>
    </figure>
  );
}

export { imageComparisonVariants };
