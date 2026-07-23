"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type ScratchPoint = { id: number; x: number; y: number };

const scratchToRevealVariants = cva(
  [
    "relative isolate overflow-hidden border border-[rgba(244,246,255,0.18)]",
    "bg-[#11131a] text-[#f5f7ff] shadow-[0_18px_48px_rgba(7,9,16,0.28)] touch-none",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#a8ff78]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        silver: "[--mq-cover:#7b8190] [--mq-cover-detail:#11131a]",
        violet: "[--mq-cover:#62558d] [--mq-cover-detail:#ddd6fe]",
      },
      size: {
        sm: "min-h-[144px] rounded-[18px] p-[18px]",
        md: "min-h-[184px] rounded-[24px] p-[24px]",
        lg: "min-h-[228px] rounded-[30px] p-[30px]",
      },
    },
    defaultVariants: { variant: "silver", size: "md" },
  },
);

type ScratchToRevealVariant = "silver" | "violet";
type ScratchToRevealSize = "sm" | "md" | "lg";

export type ScratchToRevealProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof scratchToRevealVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: ScratchToRevealVariant;
    size?: ScratchToRevealSize;
    /** Controlled reveal state; omit for internal pointer/button control. */
    revealed?: boolean;
    defaultRevealed?: boolean;
    onReveal?: () => void;
    revealLabel?: string;
  };

export function ScratchToReveal({
  children,
  className,
  defaultRevealed = false,
  material = "adaptive",
  onFocusCapture,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onReveal,
  revealLabel = "Reveal all",
  revealed,
  size = "md",
  variant = "silver",
  ...props
}: ScratchToRevealProps) {
  const [internalRevealed, setInternalRevealed] = React.useState(defaultRevealed);
  const [points, setPoints] = React.useState<ScratchPoint[]>([]);
  const nextId = React.useRef(0);
  const revealButton = React.useRef<HTMLButtonElement>(null);
  const maskId = React.useId().replaceAll(":", "");
  const isRevealed = revealed ?? internalRevealed;

  function revealAll() {
    if (revealed === undefined) setInternalRevealed(true);
    onReveal?.();
  }

  function addPoint(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const point = {
      id: nextId.current++,
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    };
    setPoints((current) => {
      const previous = current.at(-1);
      if (previous && Math.hypot(previous.x - point.x, previous.y - point.y) < 2.2) return current;
      return [...current, point].slice(-80);
    });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!isRevealed && !(event.target as HTMLElement).closest("[data-mq-reveal-button]")) {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      addPoint(event);
    }
    onPointerDown?.(event);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isRevealed && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.preventDefault();
      addPoint(event);
    }
    onPointerMove?.(event);
  }

  function releasePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    releasePointer(event);
    onPointerUp?.(event);
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    releasePointer(event);
    onPointerCancel?.(event);
  }

  function handleFocusCapture(event: React.FocusEvent<HTMLDivElement>) {
    if (!isRevealed && !(event.target as HTMLElement).closest("[data-mq-reveal-button]")) revealAll();
    onFocusCapture?.(event);
  }

  return (
    <div
      {...props}
      className={cn(scratchToRevealVariants({ size, variant }), className)}
      data-material={material}
      data-revealed={isRevealed ? "true" : "false"}
      onFocusCapture={handleFocusCapture}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {!isRevealed && (
        <button
          className={cn(
            "absolute right-[14px] top-[14px] z-30 rounded-full border border-white/35 bg-[#11131a]/90 px-[12px] py-[7px]",
            "text-[12px]/none font-bold text-white outline-none hover:bg-[#1c2030] focus-visible:ring-2 focus-visible:ring-[#a8ff78]",
            "forced-colors:hidden",
          )}
          data-mq-reveal-button="true"
          aria-controls={`${maskId}-content`}
          onClick={revealAll}
          ref={revealButton}
          type="button"
        >
          {revealLabel}
        </button>
      )}
      <div className="relative z-0 flex size-full flex-col" id={`${maskId}-content`}>{children}</div>
      <svg
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-20 size-full transition-[opacity] duration-300",
          isRevealed ? "opacity-0" : "opacity-100",
          "motion-reduce:transition-none forced-colors:hidden",
        )}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <mask id={maskId}>
            <rect fill="white" height="100" width="100" />
            {points.map((point) => <circle cx={point.x} cy={point.y} fill="black" key={point.id} r="7.5" />)}
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          <rect fill="var(--mq-cover, #7b8190)" height="100" width="100" />
          <text fill="var(--mq-cover-detail, #11131a)" fontSize="5" fontWeight="700" textAnchor="middle" x="50" y="53">
            SCRATCH TO REVEAL
          </text>
        </g>
      </svg>
      <span aria-live="polite" className="sr-only">
        {isRevealed ? "Content revealed." : "Content is visually covered. Scratch the surface or use Reveal all."}
      </span>
    </div>
  );
}

export { scratchToRevealVariants };
