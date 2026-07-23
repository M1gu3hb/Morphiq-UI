"use client";

/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

export type LightboxGalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

const LIGHTBOX_KEYFRAMES =
  "@keyframes mq-lightbox-in{from{opacity:0;scale:.96}to{opacity:1;scale:1}}@keyframes mq-lightbox-backdrop{from{opacity:0}to{opacity:1}}";

const lightboxGalleryVariants = cva(
  [
    "relative isolate overflow-hidden border border-[#343846] bg-[#11131a] text-[#f5f7ff]",
    "shadow-[0_18px_54px_rgba(4,7,15,0.3)] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        grid: "grid grid-cols-2",
        filmstrip: "grid grid-cols-3",
      },
      size: {
        sm: "gap-[6px] rounded-[18px] p-[6px]",
        md: "gap-[8px] rounded-[24px] p-[8px]",
        lg: "gap-[10px] rounded-[30px] p-[10px]",
      },
    },
    defaultVariants: { variant: "grid", size: "md" },
  },
);

export type LightboxGalleryProps = Omit<React.ComponentPropsWithRef<"section">, "children"> &
  Omit<VariantProps<typeof lightboxGalleryVariants>, "variant" | "size"> & {
    images: readonly LightboxGalleryImage[];
    material?: MaterialSlug;
    variant?: "grid" | "filmstrip";
    size?: "sm" | "md" | "lg";
    initialIndex?: number;
  };

export function LightboxGallery({
  "aria-label": ariaLabel = "Image gallery",
  className,
  images,
  initialIndex = 0,
  material = "adaptive",
  size = "md",
  variant = "grid",
  ...props
}: LightboxGalleryProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const returnFocusRef = React.useRef<HTMLButtonElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(() => Math.max(0, Math.min(initialIndex, images.length - 1)));
  const titleId = React.useId();
  const count = images.length;
  const active = count ? images[Math.min(activeIndex, count - 1)] : undefined;

  function move(delta: number) {
    if (count < 2) return;
    setActiveIndex((current) => (current + delta + count) % count);
  }

  function open(index: number, trigger: HTMLButtonElement) {
    setActiveIndex(index);
    returnFocusRef.current = trigger;
    dialogRef.current?.showModal();
    window.requestAnimationFrame(() => closeRef.current?.focus());
  }

  return (
    <section
      {...props}
      aria-label={ariaLabel}
      className={cn(lightboxGalleryVariants({ size, variant }), className)}
      data-material={material}
    >
      <style href="mq-lightbox-gallery" precedence="medium">{LIGHTBOX_KEYFRAMES}</style>
      {images.map((image, index) => (
        <button
          aria-label={`Open ${image.alt}`}
          className={cn(
            "group relative min-h-[96px] overflow-hidden rounded-[14px] border border-white/15 bg-[#1b1f2a]",
            "transition-[scale,filter] duration-180 ease-out hover:scale-[1.015] hover:brightness-[1.08] active:scale-[.985]",
            "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5f7ff]",
            "motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
            "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:focus-visible:outline-[Highlight]",
            variant === "grid" && index === 0 && "row-span-2",
          )}
          key={image.id}
          onClick={(event) => open(index, event.currentTarget)}
          type="button"
        >
          <img alt="" className="size-full min-h-[inherit] object-cover" height={360} loading="lazy" src={image.src} width={520} />
          <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,.62))] forced-colors:hidden" />
          <span className="absolute right-[9px] bottom-[8px] rounded-full bg-black/72 px-[8px] py-[4px] text-[10px] font-bold text-white forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]">
            {index + 1}/{count}
          </span>
        </button>
      ))}
      {!count ? <p className="col-span-full m-0 p-[24px] text-center text-[14px]">Add at least one image.</p> : null}

      <dialog
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          "m-auto w-[min(1040px,calc(100vw-28px))] max-w-none overflow-hidden rounded-[24px] border border-white/28 bg-[#0c0f16] p-0 text-[#f5f7ff]",
          "shadow-[0_30px_90px_rgba(0,0,0,.68)] open:animate-[mq-lightbox-in_220ms_ease-out_both]",
          "backdrop:bg-black/80 backdrop:animate-[mq-lightbox-backdrop_180ms_ease-out_both]",
          "motion-reduce:open:animate-none motion-reduce:backdrop:animate-none",
          "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none forced-colors:backdrop:bg-[Canvas]",
        )}
        onClose={() => returnFocusRef.current?.focus()}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          } else if (event.key === "Tab") {
            const controls = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
            const first = controls[0];
            const last = controls.at(-1);
            if (!first || !last) return;
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
        ref={dialogRef}
      >
        <div className="flex items-center justify-between gap-[14px] border-b border-white/15 px-[16px] py-[13px] forced-colors:border-[CanvasText]">
          <div>
            <h2 className="m-0 text-[16px]/[1.2] font-extrabold" id={titleId}>{active?.caption ?? active?.alt ?? "Gallery image"}</h2>
            <p aria-live="polite" className="mt-[3px] mb-0 text-[12px] text-[#c9ceda] forced-colors:text-[CanvasText]">Image {count ? activeIndex + 1 : 0} of {count}</p>
          </div>
          <button
            aria-label="Close gallery"
            className="grid size-[40px] place-items-center rounded-full border border-white/25 bg-white/10 text-[22px] transition-[background-color,scale] duration-150 hover:scale-[1.05] hover:bg-white/18 active:scale-[.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]"
            onClick={() => dialogRef.current?.close()}
            ref={closeRef}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="relative grid min-h-[280px] place-items-center bg-black forced-colors:bg-[Canvas]">
          {active ? <img alt={active.alt} className="max-h-[min(72vh,760px)] w-full object-contain" height={760} src={active.src} width={1040} /> : null}
          <button aria-label="Previous image" className="absolute left-[14px] grid size-[44px] place-items-center rounded-full border border-white/30 bg-black/70 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]" disabled={count < 2} onClick={() => move(-1)} type="button">←</button>
          <button aria-label="Next image" className="absolute right-[14px] grid size-[44px] place-items-center rounded-full border border-white/30 bg-black/70 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]" disabled={count < 2} onClick={() => move(1)} type="button">→</button>
        </div>
      </dialog>
    </section>
  );
}

export { lightboxGalleryVariants };
