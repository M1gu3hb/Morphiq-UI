"use client";

import * as React from "react";
import { ArrowRight, Megaphone, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const announcementBannerVariants = cva(
  [
    "w-full border text-[color:var(--mq-announce-text,#33261e)]",
    "bg-[var(--mq-announce-bg,#f6e7dd)] border-[var(--mq-announce-border,rgba(120,80,55,0.28))]",
    "[--mq-announce-bg:#f6e7dd] [--mq-announce-text:#33261e] [--mq-announce-muted:#665044]",
    "[--mq-announce-accent:#9f321f] [--mq-announce-accent-text:#ffffff]",
    "[--mq-announce-border:rgba(120,80,55,0.28)] [--mq-announce-ring:#171817]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay:
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.78),inset_0_-5px_9px_rgba(140,90,60,0.12),0_5px_0_#dcc4b2,0_14px_26px_rgba(90,60,45,0.17)]",
        glass:
          "[--mq-announce-bg:rgba(255,255,255,0.78)] [--mq-announce-text:#1e1e1b] [--mq-announce-muted:#3f3f38] [--mq-announce-accent:#5030a8] [--mq-announce-border:rgba(255,255,255,0.86)] backdrop-blur-[18px] backdrop-saturate-[170%] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_16px_34px_rgba(24,20,40,0.2)]",
        skeuo:
          "[--mq-announce-bg:#e6e3da] [--mq-announce-text:#23231f] [--mq-announce-muted:#4a4943] [--mq-announce-accent:#65472f] [--mq-announce-border:rgba(25,25,23,0.3)] bg-[linear-gradient(180deg,#f6f4ee,var(--mq-announce-bg,#e6e3da))] shadow-[inset_0_2px_0_rgba(255,255,255,0.92),inset_0_-4px_7px_rgba(0,0,0,0.14),0_5px_0_#a8a49b,0_14px_24px_rgba(38,36,31,0.24)]",
        adaptive:
          "[--mq-announce-bg:#ffffff] [--mq-announce-text:#1c1c19] [--mq-announce-muted:#55554e] [--mq-announce-accent:#5731b8] [--mq-announce-border:rgba(23,24,23,0.2)] shadow-[0_2px_4px_rgba(20,20,18,0.08),0_14px_30px_rgba(20,20,18,0.1)] dark:[--mq-announce-bg:#232327] dark:[--mq-announce-text:#f1efe9] dark:[--mq-announce-muted:#c1beb6] dark:[--mq-announce-accent:#b9a1ff] dark:[--mq-announce-accent-text:#17151d] dark:[--mq-announce-border:rgba(255,255,255,0.22)]",
      },
      variant: {
        inline: "",
        floating: "",
      },
      size: {
        sm: "rounded-[16px] px-4 py-3",
        md: "rounded-[20px] px-5 py-4",
        lg: "rounded-[24px] px-6 py-5",
      },
    },
    defaultVariants: { material: "clay", variant: "inline", size: "md" },
  },
);

export type AnnouncementBannerProps = React.ComponentPropsWithoutRef<"aside"> &
  VariantProps<typeof announcementBannerVariants> & {
    label?: string;
    message?: React.ReactNode;
    ctaLabel?: string;
    ctaHref?: string;
    dismissible?: boolean;
    defaultOpen?: boolean;
    focusAfterDismissRef?: React.RefObject<HTMLElement | null>;
    onDismiss?: () => void;
  };

export function AnnouncementBanner({
  className,
  ctaHref = "#announcement",
  ctaLabel = "Read the update",
  defaultOpen = true,
  dismissible = true,
  focusAfterDismissRef,
  label = "New release",
  material,
  message = "The latest tactile components are ready to explore.",
  onDismiss,
  size,
  variant,
  ...props
}: AnnouncementBannerProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const dismiss = () => {
    setOpen(false);
    onDismiss?.();
    queueMicrotask(() => focusAfterDismissRef?.current?.focus());
  };

  if (!open) return null;

  return (
    <aside
      aria-label="Announcement"
      className={cn(
        announcementBannerVariants({ material, variant, size }),
        variant === "floating" && "mx-auto max-w-[980px]",
        className,
      )}
      role="region"
      {...props}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-[var(--mq-announce-accent,#9f321f)] text-[var(--mq-announce-accent-text,#ffffff)] forced-colors:border forced-colors:border-[CanvasText]"
        >
          <Megaphone className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black tracking-[0.13em] text-[var(--mq-announce-accent,#9f321f)] uppercase">{label}</p>
          <p className="mt-1 text-sm/[1.55] font-bold text-[var(--mq-announce-text,#33261e)]">{message}</p>
        </div>
        <a
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-[12px] border border-[var(--mq-announce-border,rgba(120,80,55,0.28))] px-4 text-sm font-extrabold transition-[background-color] duration-200 hover:bg-[var(--mq-announce-accent,#9f321f)] hover:text-[var(--mq-announce-accent-text,#ffffff)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-announce-ring,#171817)] motion-reduce:transition-none forced-colors:border-[LinkText]"
          href={ctaHref}
        >
          {ctaLabel}
          <ArrowRight aria-hidden="true" className="size-4" />
        </a>
        {dismissible ? (
          <button
            aria-label="Dismiss announcement"
            className="grid size-10 shrink-0 place-items-center rounded-full text-[var(--mq-announce-muted,#665044)] transition-[background-color,color] duration-200 hover:bg-[var(--mq-announce-accent,#9f321f)] hover:text-[var(--mq-announce-accent-text,#ffffff)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-announce-ring,#171817)] motion-reduce:transition-none forced-colors:border forced-colors:border-[ButtonText]"
            onClick={dismiss}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>
    </aside>
  );
}

export { announcementBannerVariants };
