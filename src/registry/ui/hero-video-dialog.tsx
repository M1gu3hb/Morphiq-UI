"use client";

/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const VIDEO_DIALOG_KEYFRAMES =
  "@keyframes mq-video-dialog-in{from{opacity:0;scale:.96}to{opacity:1;scale:1}}@keyframes mq-video-backdrop-in{from{opacity:0}to{opacity:1}}";

function VideoDialogKeyframes() {
  return (
    <style href="mq-video-dialog" precedence="medium">
      {VIDEO_DIALOG_KEYFRAMES}
    </style>
  );
}

const heroVideoDialogVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[var(--mq-body,#f7e7dc)] text-[color:var(--mq-text,#33261e)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#f7e7dc] [--mq-text:#33261e] [--mq-muted:#634b3d] [--mq-brd:rgba(88,51,38,0.3)] [--mq-control:#fff4ec] [--mq-control-text:#33261e] [--mq-ring:#33261e]",
          "border-[var(--mq-brd,rgba(88,51,38,0.3))] shadow-[inset_0_2px_3px_rgba(255,255,255,0.72),0_5px_0_#d2a082,0_15px_28px_rgba(86,48,33,0.18)]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(20,24,31,0.94)] [--mq-text:#ffffff] [--mq-muted:#d3d9e5] [--mq-brd:rgba(255,255,255,0.44)] [--mq-control:rgba(255,255,255,0.18)] [--mq-control-text:#ffffff] [--mq-ring:#ffffff]",
          "border-[var(--mq-brd,rgba(255,255,255,0.44))] backdrop-blur-[18px] backdrop-saturate-[160%] shadow-[inset_0_1px_0_rgba(255,255,255,0.46),0_18px_36px_rgba(12,16,30,0.28)]",
        ].join(" "),
        skeuo: [
          "[--mq-body:#e6e3da] [--mq-text:#23231f] [--mq-muted:#555149] [--mq-brd:#97938a] [--mq-control:#f4f1e9] [--mq-control-text:#23231f] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#97938a)] shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-4px_6px_rgba(0,0,0,0.13),0_5px_0_#a8a49b,0_15px_26px_rgba(38,36,31,0.23)]",
        ].join(" "),
        adaptive: [
          "[--mq-body:#171817] [--mq-text:#f7f6f2] [--mq-muted:#c8c6bf] [--mq-brd:#3f403c] [--mq-control:#2b2c29] [--mq-control-text:#ffffff] [--mq-ring:#171817]",
          "border-[var(--mq-brd,#3f403c)] shadow-[0_16px_34px_rgba(20,20,18,0.2)]",
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-muted:#4c4b46] dark:[--mq-brd:#aaa69d] dark:[--mq-control:#ffffff] dark:[--mq-control-text:#171817] dark:[--mq-ring:#f1efe9]",
        ].join(" "),
      },
      variant: {
        cinema: "[--mq-poster-ratio:16/9]",
        editorial: "[--mq-poster-ratio:4/3]",
      },
      size: {
        sm: "rounded-[18px] p-[8px] [--mq-copy-pad:14px]",
        md: "rounded-[24px] p-[10px] [--mq-copy-pad:18px]",
        lg: "rounded-[30px] p-[12px] [--mq-copy-pad:22px]",
      },
    },
    defaultVariants: { material: "clay", variant: "cinema", size: "md" },
  },
);

export type HeroVideoDialogProps = Omit<React.ComponentPropsWithRef<"div">, "children" | "title"> &
  Omit<VariantProps<typeof heroVideoDialogVariants>, "material" | "variant" | "size"> & {
    title: string;
    description?: string;
    thumbnailSrc: string;
    thumbnailAlt: string;
    videoSrc: string;
    posterSrc?: string;
    material?: MaterialSlug;
    variant?: "cinema" | "editorial";
    size?: "sm" | "md" | "lg";
    onOpenChange?: (open: boolean) => void;
  };

export function HeroVideoDialog({
  className,
  description,
  material = "clay",
  onOpenChange,
  posterSrc,
  size = "md",
  thumbnailAlt,
  thumbnailSrc,
  title,
  variant = "cinema",
  videoSrc,
  ...props
}: HeroVideoDialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  const closeDialog = React.useCallback(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
  }, []);

  const openDialog = React.useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    onOpenChange?.(true);
    window.requestAnimationFrame(() => closeRef.current?.focus());
  }, [onOpenChange]);

  return (
    <div
      {...props}
      className={cn(heroVideoDialogVariants({ material, size, variant }), className)}
      data-material={material}
    >
      <VideoDialogKeyframes />
      <div className="relative overflow-hidden rounded-[inherit] bg-[#101218]" style={{ aspectRatio: "var(--mq-poster-ratio,16/9)" }}>
        <img alt={thumbnailAlt} className="size-full object-cover" src={thumbnailSrc} />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.72))] forced-colors:hidden" />
        <button
          aria-haspopup="dialog"
          aria-label={`Play ${title}`}
          className={cn(
            "absolute top-1/2 left-1/2 grid size-[62px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border",
            "border-[var(--mq-brd,rgba(255,255,255,0.5))] bg-[var(--mq-control,#fff4ec)] text-[color:var(--mq-control-text,#33261e)]",
            "shadow-[0_10px_28px_rgba(0,0,0,0.32)] transition-[background-color,scale] duration-180 ease-out hover:scale-[1.07] active:scale-[0.96]",
            "focus-visible:outline-2 focus-visible:outline-offset-[4px] focus-visible:outline-[var(--mq-ring,#171817)]",
            "motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
            "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:shadow-none forced-colors:focus-visible:outline-[Highlight]",
          )}
          onClick={openDialog}
          ref={triggerRef}
          type="button"
        >
          <span aria-hidden="true" className="ml-[3px] text-[23px]/none">▶</span>
        </button>
      </div>

      <div className="px-[var(--mq-copy-pad,18px)] pt-[15px] pb-[var(--mq-copy-pad,18px)]">
        <h3 className="m-0 text-[20px]/[1.15] font-extrabold tracking-[-0.025em]">{title}</h3>
        {description ? <p className="mt-[7px] mb-0 text-[13px]/[1.5] text-[color:var(--mq-muted,#634b3d)]">{description}</p> : null}
      </div>

      <dialog
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          "m-auto w-[min(920px,calc(100vw-32px))] max-w-none overflow-hidden rounded-[24px] border",
          "border-[var(--mq-brd,rgba(255,255,255,0.42))] bg-[var(--mq-body,#171817)] p-0 text-[color:var(--mq-text,#f7f6f2)]",
          "shadow-[0_28px_80px_rgba(0,0,0,0.55)] open:animate-[mq-video-dialog-in_220ms_ease-out_both]",
          "backdrop:bg-[rgba(7,8,12,0.82)] backdrop:backdrop-blur-[6px] backdrop:animate-[mq-video-backdrop-in_180ms_ease-out_both]",
          "motion-reduce:open:animate-none motion-reduce:backdrop:animate-none motion-reduce:backdrop:backdrop-blur-none",
          "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none forced-colors:backdrop:bg-[Canvas]",
        )}
        onCancel={() => videoRef.current?.pause()}
        onClose={() => {
          videoRef.current?.pause();
          onOpenChange?.(false);
          triggerRef.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const focusable = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button:not([disabled]), video[controls], a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
            ),
          );
          const first = focusable[0];
          const last = focusable.at(-1);
          if (!first || !last) return;

          if (event.shiftKey && (document.activeElement === first || !event.currentTarget.contains(document.activeElement))) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        ref={dialogRef}
      >
        <div className="flex items-start justify-between gap-[18px] border-b border-[var(--mq-brd,rgba(255,255,255,0.24))] px-[20px] py-[16px] forced-colors:border-[CanvasText]">
          <div>
            <h2 className="m-0 text-[20px]/[1.15] font-extrabold" id={titleId}>{title}</h2>
            {description ? <p className="mt-[5px] mb-0 text-[13px]/[1.45] text-[color:var(--mq-muted,#c8c6bf)]" id={descriptionId}>{description}</p> : null}
          </div>
          <button
            aria-label="Close video"
            className="grid size-[40px] shrink-0 place-items-center rounded-full border border-[var(--mq-brd,rgba(255,255,255,0.35))] bg-[var(--mq-control,#2b2c29)] text-[color:var(--mq-control-text,#ffffff)] transition-[background-color,scale] duration-150 hover:scale-[1.05] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#ffffff)] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:focus-visible:outline-[Highlight]"
            onClick={closeDialog}
            ref={closeRef}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <video className="block aspect-video w-full bg-black forced-colors:bg-[Canvas]" controls playsInline poster={posterSrc} preload="metadata" ref={videoRef}>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video element.
        </video>
      </dialog>
    </div>
  );
}

export { heroVideoDialogVariants };
