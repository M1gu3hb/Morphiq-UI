"use client";

/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

export type CarouselSlide = {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
};

const carouselVariants = cva(
  [
    "group relative isolate overflow-hidden border text-[color:var(--mq-text,#33261e)]",
    "bg-[var(--mq-body,#f7e7dc)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
    "forced-colors:focus-visible:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#f7e7dc] [--mq-text:#33261e] [--mq-muted:#634b3d] [--mq-control:#fff4ec]",
          "[--mq-control-text:#33261e] [--mq-brd:rgba(88,51,38,0.28)] [--mq-accent:#c9482f] [--mq-ring:#33261e]",
          "border-[var(--mq-brd,rgba(88,51,38,0.28))]",
          "shadow-[inset_0_2px_3px_rgba(255,255,255,0.7),inset_0_-3px_5px_rgba(94,55,38,0.12),0_6px_0_#d2a082,0_16px_30px_rgba(86,48,33,0.18)]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(20,24,31,0.92)] [--mq-text:#ffffff] [--mq-muted:#d3d9e5] [--mq-control:rgba(245,247,255,0.16)]",
          "[--mq-control-text:#ffffff] [--mq-brd:rgba(255,255,255,0.42)] [--mq-accent:#8ee7ff] [--mq-ring:#ffffff]",
          "border-[var(--mq-brd,rgba(255,255,255,0.42))] backdrop-blur-[18px] backdrop-saturate-[155%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_18px_38px_rgba(12,16,30,0.28)]",
        ].join(" "),
        skeuo: [
          "[--mq-body:#e6e3da] [--mq-text:#23231f] [--mq-muted:#555149] [--mq-control:#f2efe7]",
          "[--mq-control-text:#23231f] [--mq-brd:#97938a] [--mq-accent:#5b554c] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#97938a)]",
          "shadow-[inset_0_2px_3px_rgba(255,255,255,0.88),inset_0_-4px_6px_rgba(0,0,0,0.14),0_5px_0_#a8a49b,0_15px_26px_rgba(38,36,31,0.24)]",
        ].join(" "),
        adaptive: [
          "[--mq-body:#171817] [--mq-text:#f7f6f2] [--mq-muted:#c8c6bf] [--mq-control:#2b2c29]",
          "[--mq-control-text:#ffffff] [--mq-brd:#3f403c] [--mq-accent:#f7f6f2] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#3f403c)] shadow-[0_16px_34px_rgba(20,20,18,0.2)]",
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-muted:#4c4b46] dark:[--mq-control:#ffffff]",
          "dark:[--mq-control-text:#171817] dark:[--mq-brd:#aaa69d] dark:[--mq-accent:#171817] dark:[--mq-ring:#f1efe9]",
        ].join(" "),
      },
      variant: { slide: "", fade: "" },
      size: {
        sm: "h-[250px] rounded-[18px]",
        md: "h-[330px] rounded-[24px]",
        lg: "h-[420px] rounded-[30px]",
      },
    },
    defaultVariants: { material: "clay", variant: "slide", size: "md" },
  },
);

const controlClass = cn(
  "inline-grid size-[40px] place-items-center rounded-full border",
  "border-[var(--mq-brd,rgba(88,51,38,0.28))] bg-[var(--mq-control,#fff4ec)] text-[color:var(--mq-control-text,#33261e)]",
  "transition-[background-color,scale,opacity] duration-150 ease-out hover:scale-[1.05] active:scale-[0.96]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)]",
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100",
  "motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:focus-visible:outline-[Highlight]",
);

export type CarouselProps = Omit<React.ComponentPropsWithRef<"section">, "children"> &
  Omit<VariantProps<typeof carouselVariants>, "material" | "variant" | "size"> & {
    slides: readonly CarouselSlide[];
    material?: MaterialSlug;
    variant?: "slide" | "fade";
    size?: "sm" | "md" | "lg";
    autoPlay?: boolean;
    intervalMs?: number;
    loop?: boolean;
    initialIndex?: number;
    onIndexChange?: (index: number) => void;
  };

export function Carousel({
  "aria-label": ariaLabel = "Featured media",
  autoPlay = false,
  className,
  initialIndex = 0,
  intervalMs = 5000,
  loop = true,
  material = "clay",
  onIndexChange,
  size = "md",
  slides,
  variant = "slide",
  ...props
}: CarouselProps) {
  const count = slides.length;
  const [index, setIndex] = React.useState(() => Math.max(0, Math.min(initialIndex, count - 1)));
  const [hovered, setHovered] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const pointerStart = React.useRef<number | null>(null);
  const activeIndex = count === 0 ? 0 : Math.min(index, count - 1);
  const paused = hovered || focusWithin;

  const move = React.useCallback(
    (delta: number) => {
      if (count < 2) return;
      const candidate = activeIndex + delta;
      const next = loop ? (candidate + count) % count : Math.max(0, Math.min(candidate, count - 1));
      setIndex(next);
      onIndexChange?.(next);
    },
    [activeIndex, count, loop, onIndexChange],
  );

  const select = React.useCallback(
    (next: number) => {
      const safe = Math.max(0, Math.min(next, count - 1));
      setIndex(safe);
      onIndexChange?.(safe);
    },
    [count, onIndexChange],
  );

  React.useEffect(() => {
    if (!autoPlay || paused || count < 2) return undefined;
    const timer = window.setInterval(() => move(1), Math.max(1500, intervalMs));
    return () => window.clearInterval(timer);
  }, [autoPlay, count, intervalMs, move, paused]);

  return (
    <section
      {...props}
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      className={cn(carouselVariants({ material, size, variant }), className)}
      data-material={material}
      data-variant={variant}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
      }}
      onFocusCapture={() => setFocusWithin(true)}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={props.tabIndex ?? 0}
    >
      <div
        className="absolute inset-[8px] overflow-hidden rounded-[inherit] forced-colors:border forced-colors:border-[CanvasText]"
        data-carousel-viewport=""
        onPointerCancel={(event) => {
          pointerStart.current = null;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerDown={(event) => {
          pointerStart.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = pointerStart.current;
          pointerStart.current = null;
          event.currentTarget.releasePointerCapture(event.pointerId);
          if (start === null) return;
          const distance = event.clientX - start;
          if (Math.abs(distance) >= 44) move(distance > 0 ? -1 : 1);
        }}
      >
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === activeIndex;
          return (
            <article
              aria-hidden={!active}
              className={cn(
                "absolute inset-0 overflow-hidden rounded-[inherit] opacity-0",
                "transition-[opacity,translate] duration-300 ease-out",
                variant === "slide" && "translate-x-[5%]",
                active && "translate-x-0 opacity-100",
                "motion-reduce:transition-none motion-reduce:translate-x-0",
              )}
              data-active={active ? "true" : "false"}
              inert={!active}
              key={slide.id}
            >
              <img alt={slide.alt} className="size-full object-cover" draggable={false} src={slide.src} />
              {slide.title || slide.description ? (
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(0,0,0,0.84))] px-[20px] pt-[54px] pb-[48px] text-white forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]">
                  {slide.title ? <h3 className="m-0 text-[18px]/[1.2] font-extrabold">{slide.title}</h3> : null}
                  {slide.description ? <p className="mt-[5px] mb-0 text-[13px]/[1.45] text-[#f1f1ef]">{slide.description}</p> : null}
                </div>
              ) : null}
            </article>
          );
        })}
        {count === 0 ? (
          <p className="m-0 grid size-full place-items-center px-[24px] text-center text-[14px] text-[color:var(--mq-muted,#634b3d)]">
            Add at least one slide.
          </p>
        ) : null}
      </div>

      <div className="absolute inset-x-[18px] bottom-[16px] z-[2] flex items-center justify-between gap-[12px]">
        <button aria-label="Previous slide" className={controlClass} disabled={count < 2 || (!loop && activeIndex === 0)} onClick={() => move(-1)} type="button">
          <span aria-hidden="true">←</span>
        </button>
        <div aria-label="Choose slide" className="flex items-center justify-center gap-[7px]" role="group">
          {slides.map((slide, slideIndex) => (
            <button
              aria-label={`Go to slide ${slideIndex + 1}`}
              aria-pressed={slideIndex === activeIndex}
              className={cn(
                "size-[10px] rounded-full border border-[var(--mq-control-text,#33261e)] bg-[var(--mq-control,#fff4ec)]",
                "transition-[background-color,scale] duration-150 ease-out hover:scale-[1.2]",
                "aria-pressed:scale-[1.2] aria-pressed:bg-[var(--mq-accent,#c9482f)]",
                "motion-reduce:transition-none motion-reduce:hover:scale-100",
                "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:aria-pressed:bg-[Highlight]",
              )}
              key={slide.id}
              onClick={() => select(slideIndex)}
              type="button"
            />
          ))}
        </div>
        <button aria-label="Next slide" className={controlClass} disabled={count < 2 || (!loop && activeIndex === count - 1)} onClick={() => move(1)} type="button">
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p aria-atomic="true" aria-live={autoPlay ? "off" : "polite"} className="sr-only">
        {count ? `Slide ${activeIndex + 1} of ${count}` : "No slides"}
      </p>
    </section>
  );
}

export { carouselVariants };
