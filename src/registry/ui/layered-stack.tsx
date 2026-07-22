"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export type LayeredStackItem = {
  id: string;
  title: string;
  description?: string;
  content?: React.ReactNode;
};

const layeredStackVariants = cva(
  [
    "relative isolate grid place-items-center overflow-hidden border border-[#3d424e] bg-[#0e1016] text-[#f5f7ff]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#f5f7ff]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] data-[focus=true]:outline-[#f5f7ff]",
    "motion-reduce:scroll-auto forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
    "forced-colors:focus-visible:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      variant: {
        swipe: "cursor-grab active:cursor-grabbing",
        button: "cursor-default",
      },
      size: {
        sm: "h-[280px] rounded-[20px] [--mq-card-w:280px] [--mq-card-h:190px]",
        md: "h-[350px] rounded-[26px] [--mq-card-w:360px] [--mq-card-h:238px]",
        lg: "h-[430px] rounded-[32px] [--mq-card-w:460px] [--mq-card-h:300px]",
      },
    },
    defaultVariants: { variant: "swipe", size: "md" },
  },
);

export type LayeredStackProps = Omit<React.ComponentPropsWithRef<"section">, "children"> &
  Omit<VariantProps<typeof layeredStackVariants>, "variant" | "size"> & {
    items: readonly LayeredStackItem[];
    material?: "adaptive";
    variant?: "swipe" | "button";
    size?: "sm" | "md" | "lg";
    loop?: boolean;
    initialIndex?: number;
    onDiscard?: (item: LayeredStackItem, nextIndex: number) => void;
  };

export function LayeredStack({
  "aria-label": ariaLabel = "Layered media stack",
  className,
  initialIndex = 0,
  items,
  loop = true,
  material = "adaptive",
  onDiscard,
  size = "md",
  variant = "swipe",
  ...props
}: LayeredStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(() => Math.max(0, Math.min(initialIndex, items.length - 1)));
  const [exitDirection, setExitDirection] = React.useState(1);
  const count = items.length;
  const activeIndex = count === 0 ? 0 : Math.min(index, count - 1);
  const active = items[activeIndex];

  const dismiss = React.useCallback(
    (direction = 1) => {
      if (!active || count < 2 || (!loop && activeIndex === count - 1)) return;
      const next = loop ? (activeIndex + 1) % count : Math.min(activeIndex + 1, count - 1);
      setExitDirection(direction >= 0 ? 1 : -1);
      setIndex(next);
      onDiscard?.(active, next);
    },
    [active, activeIndex, count, loop, onDiscard],
  );

  const handleDragEnd = React.useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (Math.abs(info.offset.x) >= 88 || Math.abs(info.velocity.x) >= 520) {
        dismiss(info.offset.x || info.velocity.x);
      }
    },
    [dismiss],
  );

  const beneath = React.useMemo(() => {
    if (count < 2) return [];
    return [1, 2]
      .map((offset) => {
        const candidate = activeIndex + offset;
        if (!loop && candidate >= count) return undefined;
        return items[candidate % count];
      })
      .filter((item): item is LayeredStackItem => Boolean(item));
  }, [activeIndex, count, items, loop]);

  return (
    <section
      {...props}
      aria-label={ariaLabel}
      className={cn(layeredStackVariants({ size, variant }), className)}
      data-material={material}
      tabIndex={props.tabIndex ?? 0}
    >
      <div className="relative h-[var(--mq-card-h,238px)] w-[min(var(--mq-card-w,360px),calc(100%-44px))]">
        {beneath
          .slice()
          .reverse()
          .map((item, reverseIndex) => {
            const depth = beneath.length - reverseIndex;
            return (
              <article
                aria-hidden="true"
                className="absolute inset-0 translate-y-[var(--mq-layer-y,0px)] scale-[var(--mq-layer-scale,1)] overflow-hidden rounded-[22px] border border-[#4c5260] bg-[#20242e] p-[22px] text-[#f5f7ff] shadow-[0_18px_36px_rgba(0,0,0,0.32)] motion-reduce:translate-y-0 motion-reduce:scale-100 forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none"
                inert
                key={item.id}
                style={
                  {
                    "--mq-layer-scale": `${1 - depth * 0.035}`,
                    "--mq-layer-y": `${depth * 13}px`,
                  } as React.CSSProperties
                }
              >
                <h3 className="m-0 text-[20px]/[1.15] font-extrabold">{item.title}</h3>
              </article>
            );
          })}

        <AnimatePresence initial={false} mode="popLayout">
          {active ? (
            <motion.article
              animate={{ opacity: 1, rotate: 0, scale: 1, x: 0, y: 0 }}
              aria-describedby={`${active.id}-layered-description`}
              className="absolute inset-0 touch-pan-y overflow-hidden rounded-[22px] border border-[#565d6d] bg-[#1a1e27] p-[22px] text-[#f5f7ff] shadow-[0_22px_48px_rgba(0,0,0,0.42)] motion-reduce:transform-none forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.72}
              dragListener={!shouldReduceMotion && variant === "swipe"}
              exit={{ opacity: 0, rotate: exitDirection * 8, x: exitDirection * 340 }}
              initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.96, y: shouldReduceMotion ? 0 : 12 }}
              key={active.id}
              onDragEnd={handleDragEnd}
              transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 310, damping: 28, mass: 0.72 }}
            >
              <div className="flex h-full flex-col">
                <span className="font-mono text-[11px]/none tracking-[0.12em] text-[#aeb5c4] uppercase forced-colors:text-[CanvasText]">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
                <h3 className="mt-[18px] mb-0 text-[24px]/[1.08] font-extrabold tracking-[-0.035em]">{active.title}</h3>
                {active.description ? (
                  <p className="mt-[9px] mb-0 text-[13px]/[1.55] text-[#c8ccd8] forced-colors:text-[CanvasText]" id={`${active.id}-layered-description`}>
                    {active.description}
                  </p>
                ) : (
                  <span className="sr-only" id={`${active.id}-layered-description`}>Current card</span>
                )}
                {active.content ? <div className="mt-[14px]">{active.content}</div> : null}
                <button
                  aria-label={`Dismiss ${active.title}`}
                  className="mt-auto self-start rounded-full border border-[#697083] bg-[#292e3a] px-[15px] py-[9px] text-[12px]/none font-extrabold text-[#f5f7ff] transition-[background-color,scale,opacity] duration-150 hover:scale-[1.03] hover:bg-[#353b49] active:scale-[0.97] disabled:opacity-45 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:focus-visible:outline-[Highlight]"
                  disabled={count < 2 || (!loop && activeIndex === count - 1)}
                  onClick={() => dismiss(1)}
                  type="button"
                >
                  Next card <span aria-hidden="true">→</span>
                </button>
              </div>
            </motion.article>
          ) : null}
        </AnimatePresence>
      </div>

      {!active ? <p className="m-0 text-[13px]">Add stack items.</p> : null}
      <p aria-atomic="true" aria-live="polite" className="sr-only">
        {active ? `Showing ${active.title}, card ${activeIndex + 1} of ${count}` : "No cards"}
      </p>
    </section>
  );
}

export { layeredStackVariants };
