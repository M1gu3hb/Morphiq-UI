"use client";

/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export type AvatarCircleItem = {
  id: string;
  src?: string;
  alt: string;
  name: string;
};

const avatarCirclesVariants = cva(
  [
    "m-0 flex list-none items-center p-0 text-[#f7f6f2]",
    "focus-visible:outline-2 focus-visible:outline-offset-[4px] focus-visible:outline-[#171817]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[4px] data-[focus=true]:outline-[#171817]",
    "forced-colors:text-[CanvasText] forced-colors:focus-visible:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      variant: {
        stacked: "[--mq-overlap:-12px]",
        roomy: "[--mq-overlap:-7px]",
      },
      size: {
        sm: "[--mq-avatar-size:34px] [--mq-avatar-text:10px] [--mq-overlap-adjust:3px]",
        md: "[--mq-avatar-size:46px] [--mq-avatar-text:12px] [--mq-overlap-adjust:0px]",
        lg: "[--mq-avatar-size:60px] [--mq-avatar-text:15px] [--mq-overlap-adjust:-2px]",
      },
    },
    defaultVariants: { variant: "stacked", size: "md" },
  },
);

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = Array.from(words[0])[0] ?? "";
  const last = words.length > 1 ? (Array.from(words.at(-1) ?? "")[0] ?? "") : (Array.from(words[0])[1] ?? "");
  return `${first}${last}`.toLocaleUpperCase();
}

export type AvatarCirclesProps = Omit<React.ComponentPropsWithRef<"ul">, "children"> &
  Omit<VariantProps<typeof avatarCirclesVariants>, "variant" | "size"> & {
    avatars: readonly AvatarCircleItem[];
    material?: "adaptive";
    variant?: "stacked" | "roomy";
    size?: "sm" | "md" | "lg";
    max?: number;
  };

export function AvatarCircles({
  "aria-label": ariaLabel = "People",
  avatars,
  className,
  material = "adaptive",
  max = 5,
  size = "md",
  variant = "stacked",
  ...props
}: AvatarCirclesProps) {
  const [failed, setFailed] = React.useState<ReadonlySet<string>>(() => new Set());
  const safeMax = Math.max(1, Math.floor(max));
  const visible = avatars.slice(0, safeMax);
  const overflow = Math.max(0, avatars.length - visible.length);

  return (
    <ul
      {...props}
      aria-label={ariaLabel}
      className={cn(avatarCirclesVariants({ size, variant }), className)}
      data-material={material}
      role="list"
      tabIndex={props.tabIndex}
    >
      {visible.map((avatar, index) => {
        const showFallback = !avatar.src || failed.has(avatar.id);
        return (
          <li
            className={cn(
              "relative grid size-[var(--mq-avatar-size,46px)] shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#f7f6f2] bg-[#272a31]",
              "text-[length:var(--mq-avatar-text,12px)] font-extrabold tracking-[0.02em] shadow-[0_5px_12px_rgba(20,20,18,0.2)]",
              "transition-[translate,box-shadow] duration-150 ease-out hover:z-[20] hover:-translate-y-[3px] hover:shadow-[0_9px_18px_rgba(20,20,18,0.28)]",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
              index > 0 && "ml-[calc(var(--mq-overlap,-12px)+var(--mq-overlap-adjust,0px))]",
            )}
            key={avatar.id}
          >
            {showFallback ? (
              <span aria-label={avatar.name || avatar.alt} className="grid size-full place-items-center" role="img">
                <span aria-hidden="true">{initials(avatar.name)}</span>
              </span>
            ) : (
              <img
                alt={avatar.alt}
                className="size-full object-cover"
                loading="lazy"
                onError={() => {
                  setFailed((current) => new Set(current).add(avatar.id));
                }}
                src={avatar.src}
              />
            )}
          </li>
        );
      })}

      {overflow > 0 ? (
        <li
          aria-label={`${overflow} more people`}
          className={cn(
            "relative grid size-[var(--mq-avatar-size,46px)] shrink-0 place-items-center rounded-full border-2 border-[#f7f6f2] bg-[#171817]",
            "ml-[calc(var(--mq-overlap,-12px)+var(--mq-overlap-adjust,0px))] text-[length:var(--mq-avatar-text,12px)] font-extrabold text-[#f7f6f2]",
            "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
          )}
          data-avatar-overflow=""
        >
          <span aria-hidden="true">+{overflow}</span>
        </li>
      ) : null}
    </ul>
  );
}

export { avatarCirclesVariants };
