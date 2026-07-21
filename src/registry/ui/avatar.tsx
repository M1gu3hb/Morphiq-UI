"use client";

/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { UserRound } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Avatar
 *
 * A self-contained identity image with four material frames. The fallback stays
 * visible underneath the image until that exact `src` fires `onLoad`; errors
 * keep the fallback in place. Swapping `src` therefore cannot reveal a broken
 * image or one stale loaded frame.
 *
 * Local theming knobs:
 *
 *   --mq-frame-bg  frame surface
 *   --mq-fill      initials/icon fallback surface
 *   --mq-text      fallback foreground
 *   --mq-brd       frame border
 *   --mq-ring      focus ring for an interactive wrapper
 *   --mq-frame     frame thickness
 */

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

const avatarVariants = cva(
  [
    "relative isolate inline-grid shrink-0 place-items-center border box-border",
    "size-[var(--mq-size,48px)] p-[var(--mq-frame,3px)]",
    "border-[var(--mq-brd,rgba(74,57,42,0.24))] bg-[var(--mq-frame-bg,#d9bfa3)]",
    "text-[color:var(--mq-text,#3b2c23)]",
    "data-[state=disabled]:opacity-55 data-[state=loading]:cursor-progress",
    FOCUS_RING,
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-frame-bg:#d9bfa3] [--mq-fill:#f1e3d3] [--mq-text:#3b2c23]",
          "[--mq-brd:rgba(74,57,42,0.24)] [--mq-ring:#3b2c23]",
          "shadow-[inset_0_2px_3px_rgba(255,255,255,0.74),inset_0_-3px_4px_rgba(80,53,35,0.14),0_3px_0_#b89878,0_8px_16px_rgba(74,48,30,0.16)]",
        ].join(" "),
        glass: [
          "[--mq-frame-bg:rgba(37,43,54,0.94)] [--mq-fill:rgba(55,63,78,0.96)] [--mq-text:#ffffff]",
          "[--mq-brd:rgba(255,255,255,0.40)] [--mq-ring:#171817]",
          "backdrop-blur-[14px] backdrop-saturate-[150%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.46),0_10px_24px_rgba(22,22,36,0.22)]",
        ].join(" "),
        skeuo: [
          "[--mq-fill:#d1ccc0] [--mq-text:#29261f] [--mq-brd:rgba(41,38,31,0.30)] [--mq-ring:#171817]",
          "bg-[linear-gradient(145deg,#f4f1e9,#aaa498)]",
          "shadow-[inset_1px_1px_1px_rgba(255,255,255,0.92),inset_-2px_-2px_3px_rgba(0,0,0,0.20),0_4px_7px_rgba(35,33,29,0.24)]",
        ].join(" "),
        adaptive: [
          "[--mq-frame-bg:#171817] [--mq-fill:#252624] [--mq-text:#f7f6f2]",
          "[--mq-brd:rgba(0,0,0,0.44)] [--mq-ring:#171817]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.18),0_8px_18px_rgba(20,20,18,0.10)]",
          "dark:[--mq-frame-bg:#f1efe9] dark:[--mq-fill:#ddd9cf] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(23,24,23,0.42)] dark:[--mq-ring:#f1efe9]",
        ].join(" "),
      },
      shape: {
        circle: "rounded-full",
        rounded: "rounded-[var(--mq-radius,14px)]",
        squircle: "rounded-[32%]",
      },
      size: {
        sm: "[--mq-size:36px] [--mq-frame:2px] [--mq-radius:10px] [--mq-glyph:15px] text-[11px]",
        md: "[--mq-size:48px] [--mq-frame:3px] [--mq-radius:14px] [--mq-glyph:19px] text-[14px]",
        lg: "[--mq-size:64px] [--mq-frame:4px] [--mq-radius:18px] [--mq-glyph:25px] text-[18px]",
      },
    },
    defaultVariants: {
      material: "clay",
      shape: "circle",
      size: "md",
    },
  },
);

function getInitials(name: string | undefined) {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (words.length === 0) return "";

  const first = Array.from(words[0])[0] ?? "";
  const secondWord = words.length > 1 ? words.at(-1) : undefined;
  const second = secondWord ? (Array.from(secondWord)[0] ?? "") : (Array.from(words[0])[1] ?? "");

  return `${first}${second}`.toLocaleUpperCase();
}

type AvatarImageProps = Omit<
  React.ComponentPropsWithRef<"img">,
  "alt" | "children" | "src"
>;

export type AvatarProps = Omit<React.ComponentPropsWithRef<"span">, "children"> &
  VariantProps<typeof avatarVariants> & {
    /** Image source. Omit it to render the fallback immediately. */
    src?: string;
    /** Meaningful image alternative, or an empty string for a decorative avatar. */
    alt: string;
    /** Full name used for initials and the accessible fallback label. */
    name?: string;
    /** Replace generated initials or the generic user icon. */
    fallback?: React.ReactNode;
    /** Native image props; load/error handlers are composed with internal state. */
    imageProps?: AvatarImageProps;
  };

export function Avatar({
  alt,
  "aria-busy": ariaBusy,
  className,
  fallback,
  imageProps,
  material,
  name,
  shape,
  size,
  src,
  ...props
}: AvatarProps) {
  const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null);
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const {
    className: imageClassName,
    loading = "lazy",
    onError,
    onLoad,
    ref: imageRef,
    ...nativeImageProps
  } = imageProps ?? {};
  const imageNodeRef = React.useRef<HTMLImageElement | null>(null);
  React.useImperativeHandle(imageRef, () => imageNodeRef.current as HTMLImageElement);

  const imageState = !src
    ? "fallback"
    : failedSrc === src
      ? "error"
      : loadedSrc === src
        ? "loaded"
        : "loading";
  const showImage = imageState === "loaded";
  const decorative = alt === "";
  const initials = getInitials(name);
  const fallbackLabel = name?.trim() || alt;
  const handleImageRef = React.useCallback(
    (node: HTMLImageElement | null) => {
      imageNodeRef.current = node;

      if (node?.complete && src) {
        if (node.naturalWidth > 0) {
          setLoadedSrc(src);
          setFailedSrc((current) => (current === src ? null : current));
        } else {
          setFailedSrc(src);
          setLoadedSrc((current) => (current === src ? null : current));
        }
      }
    },
    [src],
  );

  return (
    <span
      {...props}
      aria-busy={ariaBusy ?? (!decorative && imageState === "loading" ? true : undefined)}
      className={cn(avatarVariants({ material, shape, size }), className)}
      data-image-state={imageState}
      data-material={material ?? "clay"}
      data-shape={shape ?? "circle"}
    >
      <span
        className={cn(
          "relative grid size-full overflow-hidden rounded-[inherit]",
          "place-items-center bg-[var(--mq-fill,#f1e3d3)] font-extrabold tracking-[0.02em]",
          "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
        )}
        data-avatar-viewport=""
      >
        <span
          aria-hidden={decorative || showImage ? true : undefined}
          aria-label={!decorative && !showImage ? fallbackLabel : undefined}
          className="absolute inset-0 grid place-items-center"
          data-avatar-fallback=""
          role={!decorative && !showImage ? "img" : undefined}
        >
          {fallback ??
            (initials ? (
              <span aria-hidden="true" data-avatar-initials="">
                {initials}
              </span>
            ) : (
              <UserRound
                aria-hidden="true"
                className="size-[var(--mq-glyph,19px)]"
                data-avatar-icon=""
              />
            ))}
        </span>

        {src ? (
          <img
            {...nativeImageProps}
            alt={alt}
            aria-hidden={!showImage ? true : undefined}
            className={cn(
              "absolute inset-0 size-full object-cover",
              showImage ? "opacity-100" : "opacity-0",
              imageClassName,
            )}
            data-avatar-image=""
            loading={loading}
            onError={(event) => {
              setFailedSrc(src);
              setLoadedSrc((current) => (current === src ? null : current));
              onError?.(event);
            }}
            onLoad={(event) => {
              if (event.currentTarget.naturalWidth > 0) {
                setLoadedSrc(src);
                setFailedSrc((current) => (current === src ? null : current));
              }
              onLoad?.(event);
            }}
            ref={handleImageRef}
            src={src}
          />
        ) : null}
      </span>
    </span>
  );
}

export { avatarVariants };
