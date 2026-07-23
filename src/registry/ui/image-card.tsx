"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Image Card
 *
 * A photo framed by one of the four tactile materials, with a semantic title
 * and caption set over the image on a gradient SCRIM. The scrim — not the photo
 * — is what guarantees the overlay text's legibility: the text is near-white and
 * always sits over a dark backing strong enough that contrast never depends on
 * whatever colours happen to be in the picture.
 *
 * Self-contained by design: every material recipe lives in this file, copied and
 * owned from the base Card. It reads no `:root` custom property and depends on no
 * global stylesheet class, so copying this file plus `src/lib/cn.ts` reproduces
 * the full look. Local theming knobs (each referenced with a literal fallback):
 *
 *   --mq-body          surface colour of the matte frame
 *   --mq-lit           top highlight colour (skeuo gradient)
 *   --mq-edge          extruded bottom edge colour (clay / skeuo)
 *   --mq-brd           frame border colour
 *   --mq-ring          focus ring colour
 *   --mq-radius        outer corner radius
 *   --mq-inner-radius  image-well corner radius
 *   --mq-frame         matte frame thickness (padding)
 *   --mq-pad           overlay inner padding
 *   --mq-title         title font size
 *   --mq-eyebrow       eyebrow font size
 *   --mq-caption       caption font size
 *   --mq-shadow-hover  resting→hover shadow (interpolates)
 *   --mq-shadow-press  resting→press shadow (interpolates)
 *
 * The 4-material recipe (clay / glass / skeuo / adaptive) frames the photo; its
 * body colour reads as the matte around the picture and its shadow gives the
 * card real elevation and a tactile side wall.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type ImageCardVariant = "default";
type ImageCardSize = "sm" | "md" | "lg";

/**
 * Focus is drawn on the whole card via `:focus-within` (the stretched link is
 * the focusable element, so tabbing to it must outline the card), on
 * `:focus-visible` for completeness, and identically on a `data-focus="true"`
 * attribute so documentation surfaces can render the focused look without
 * synthesising a keyboard event. `forced-colors` swaps to the system Highlight.
 */
const FOCUS_RING =
  "focus-within:outline-2 focus-within:outline-offset-[3px] " +
  "focus-within:outline-[var(--mq-ring,#171817)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-within:outline-[Highlight] forced-colors:focus-visible:outline-[Highlight]";

const imageCardVariants = cva(
  [
    "group relative isolate flex flex-col text-left",
    "border p-[var(--mq-frame,7px)] rounded-[var(--mq-radius,22px)]",
    // `translate`, not `transform`: Tailwind v4's `-translate-y-*` utility writes
    // the standalone `translate` property, so the transition must name
    // `translate`. Only `translate` and `box-shadow` change on hover/active, so
    // nothing phantom is listed.
    "transition-[translate,box-shadow] duration-200 ease-out",
    "motion-reduce:transition-none",
    // Shadows and translucency are discarded in forced-colors mode; a
    // system-coloured border keeps the card's bounds.
    "forced-colors:border-[CanvasText]",
    FOCUS_RING,
    "data-[state=disabled]:opacity-55 data-[state=disabled]:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#f6e7dd)]",
          "border-[var(--mq-brd,rgba(120,80,55,0.16))]",
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)]",
          "[--mq-shadow-hover:inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_10px_0_var(--mq-edge,#dcc4b2),0_26px_44px_rgba(90,60,45,0.19)]",
          "[--mq-shadow-press:inset_0_3px_4px_rgba(255,255,255,0.94),inset_0_-5px_8px_rgba(140,90,60,0.15),0_3px_0_var(--mq-edge,#dcc4b2),0_7px_12px_rgba(90,60,45,0.14)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(255,255,255,0.66))]",
          "border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)]",
          "[--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.85),0_23px_55px_rgba(24,20,40,0.24)]",
          "[--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),0_6px_15px_rgba(24,20,40,0.17)]",
          "forced-colors:backdrop-blur-none",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#e6e3da))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "[--mq-lit:#f6f4ee] [--mq-body:#e6e3da] [--mq-edge:#a8a49b] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)]",
          "[--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_9px_0_var(--mq-edge,#a8a49b),0_20px_32px_rgba(38,36,31,0.28)]",
          "[--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.175),0_2px_0_var(--mq-edge,#a8a49b),0_6px_9px_rgba(38,36,31,0.20)]",
        ].join(" "),
        // Polymorphic: its palette follows the colour scheme. The surface is
        // opaque and flips together with the frame, so `dark:` is safe here.
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "[--mq-body:#ffffff] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)]",
          "[--mq-shadow-hover:0_1px_3px_rgba(20,20,18,0.12),0_14px_35px_rgba(20,20,18,0.07)]",
          "[--mq-shadow-press:0_0px_1px_rgba(20,20,18,0.085),0_4px_10px_rgba(20,20,18,0.05)]",
          "dark:[--mq-body:#232327] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9]",
          "dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_16px_40px_rgba(0,0,0,0.55)]",
          "dark:[--mq-shadow-hover:0_3px_6px_rgba(0,0,0,0.59),0_22px_50px_rgba(0,0,0,0.64)]",
          "dark:[--mq-shadow-press:0_1px_2px_rgba(0,0,0,0.42),0_9px_18px_rgba(0,0,0,0.47)]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-radius:16px] [--mq-inner-radius:12px] [--mq-frame:5px] [--mq-pad:12px] [--mq-title:15px] [--mq-eyebrow:10px] [--mq-caption:12px]",
        md: "[--mq-radius:22px] [--mq-inner-radius:16px] [--mq-frame:7px] [--mq-pad:16px] [--mq-title:19px] [--mq-eyebrow:11px] [--mq-caption:13px]",
        lg: "[--mq-radius:28px] [--mq-inner-radius:20px] [--mq-frame:9px] [--mq-pad:20px] [--mq-title:23px] [--mq-eyebrow:12px] [--mq-caption:14px]",
      },
      /**
       * Applied when the whole card is one link. It raises the card on hover and
       * its contact shadow grows with it, then collapses on press — the same
       * language the base Card and Button use. Pure feedback, so reduced motion
       * cancels it outright.
       */
      interactive: {
        true:
          "cursor-pointer hover:-translate-y-[3px] motion-reduce:hover:translate-y-0 " +
          "hover:shadow-[var(--mq-shadow-hover,0_14px_35px_rgba(20,20,18,0.12))] " +
          "active:translate-y-[1px] motion-reduce:active:translate-y-0 " +
          "active:shadow-[var(--mq-shadow-press,0_4px_10px_rgba(20,20,18,0.09))]",
        false: "",
      },
    },
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
      interactive: false,
    },
  },
);

export type ImageCardProps = Omit<
  React.ComponentPropsWithRef<"article">,
  "title" | "children"
> &
  Omit<VariantProps<typeof imageCardVariants>, "material" | "variant" | "size" | "interactive"> & {
    /** Image source. In the docs preview this is a picsum URL. */
    src: string;
    /** Real, descriptive alternative text for the photo. Required. */
    alt: string;
    /** Overlay title. Rendered inside a real heading. */
    title: React.ReactNode;
    /** Optional supporting line under the title. */
    caption?: React.ReactNode;
    /** Optional short label above the title (a category, say). */
    eyebrow?: React.ReactNode;
    /** Machine-readable timestamp; renders a `<time dateTime>` when set. */
    dateTime?: string;
    /** Human-readable timestamp label paired with `dateTime`. */
    dateLabel?: React.ReactNode;
    /**
     * When set, the whole card becomes one link (stretched-link pattern). The
     * link's accessible name is the title, via `aria-labelledby`.
     */
    href?: string;
    /**
     * Heading rank for the title. Overridable because the correct level depends
     * on the surrounding document outline. Defaults to `<h3>`.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    /** CSS `aspect-ratio` for the image well. Defaults to `4 / 3`. */
    ratio?: string;
    /** Intrinsic pixel dimensions, forwarded to the `<img>` to avoid CLS. */
    imgWidth?: number;
    imgHeight?: number;
    /** Native lazy/eager loading hint for the photo. Defaults to `lazy`. */
    imgLoading?: "eager" | "lazy";
    material?: MaterialSlug;
    variant?: ImageCardVariant;
    size?: ImageCardSize;
    /** Fades the card and removes the link affordance. */
    disabled?: boolean;
    /** Marks the card busy: sets `aria-busy` and washes the photo with a pulse. */
    busy?: boolean;
  };

export function ImageCard({
  alt,
  busy = false,
  caption,
  className,
  dateLabel,
  dateTime,
  disabled = false,
  eyebrow,
  headingLevel = 3,
  href,
  imgHeight,
  imgLoading = "lazy",
  imgWidth,
  material = "clay",
  ratio = "4 / 3",
  size = "md",
  src,
  title,
  variant = "default",
  ...props
}: ImageCardProps) {
  const headingId = React.useId();
  const isLink = Boolean(href) && !disabled;
  const Heading = `h${headingLevel}` as React.ElementType;
  const state = disabled ? "disabled" : busy ? "busy" : "idle";

  return (
    <article
      {...props}
      aria-busy={busy || undefined}
      className={cn(
        imageCardVariants({ material, variant, size, interactive: isLink }),
        className,
      )}
      data-material={material}
      data-state={state}
    >
      {/* Image well: clips the photo, scrim and overlay to the inner radius. */}
      <div
        className="relative isolate w-full overflow-hidden rounded-[var(--mq-inner-radius,16px)]"
        style={{ aspectRatio: ratio }}
      >
        {/* The photo. A gentle zoom on hover only when the card leads somewhere;
            it animates `scale` (a standalone property), so the transition names
            `scale`, never `transform`. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- self-contained copy-and-own component stays framework-agnostic (no next/image coupling) */}
        <img
          alt={alt}
          className={cn(
            "absolute inset-0 z-0 block size-full object-cover",
            isLink &&
              // `will-change` names the property that actually animates (`scale`,
              // a standalone property, not `transform`) and is scoped to hover so
              // it is not a permanent compositor hint on every linked card's image.
              "transition-[scale] duration-[600ms] ease-out group-hover:[will-change:scale] " +
                "group-hover:scale-[1.05] motion-reduce:group-hover:scale-100 motion-reduce:transition-none",
          )}
          height={imgHeight}
          loading={imgLoading}
          src={src}
          width={imgWidth}
        />

        {/* Decorative soft scrim: blends the plate up into the photo. Purely
            aesthetic and discarded under forced colours. */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-10",
            "bg-[linear-gradient(to_top,rgba(8,8,10,0.55)_0%,rgba(8,8,10,0.12)_42%,transparent_70%)]",
            "forced-colors:hidden",
          )}
        />

        {/* Inner frame highlight — a hairline that makes the matte read as a
            real edge. Removed in forced colours. */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-10 rounded-[inherit]",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_0_0_1px_rgba(0,0,0,0.16)]",
            "forced-colors:hidden",
          )}
        />

        {/* Overlay plate. Its OWN gradient tracks the text box, so every text
            pixel sits over >= ~0.64 black — near-white overlay text clears
            4.5:1 regardless of the photo. Under forced colours the gradient is
            replaced by a solid Canvas backing so the CanvasText survives. */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-20 flex flex-col gap-[4px]",
            "p-[var(--mq-pad,16px)] pt-[calc(var(--mq-pad,16px)_+_12px)]",
            "bg-[linear-gradient(to_top,rgba(8,8,10,0.90)_0%,rgba(8,8,10,0.64)_100%)]",
            "forced-colors:[background-image:none] forced-colors:bg-[Canvas]",
          )}
        >
          {eyebrow ? (
            <p className="m-0 text-[length:var(--mq-eyebrow,11px)] font-semibold uppercase tracking-[0.14em] text-white/85 forced-colors:text-[CanvasText]">
              {eyebrow}
            </p>
          ) : null}

          <Heading
            className="m-0 text-[length:var(--mq-title,19px)] font-extrabold leading-[1.2] tracking-[-0.01em] text-white forced-colors:text-[CanvasText]"
            id={headingId}
          >
            {title}
          </Heading>

          {caption ? (
            <p className="m-0 line-clamp-2 text-[length:var(--mq-caption,13px)] leading-[1.5] text-white/90 forced-colors:text-[CanvasText]">
              {caption}
            </p>
          ) : null}

          {dateTime ? (
            <time
              className="text-[length:var(--mq-eyebrow,11px)] font-medium text-white/75 forced-colors:text-[CanvasText]"
              dateTime={dateTime}
            >
              {dateLabel ?? dateTime}
            </time>
          ) : null}
        </div>
      </div>

      {/*
        Stretched link. A single `<a>` covering the whole card, named by the
        title via `aria-labelledby` — so there is exactly one link, it is never
        nested inside another link/button, and any future inner control would
        stay clickable by sitting on `relative z-30` above this z-20 overlay.
        Its own outline is suppressed; the card's `:focus-within` ring draws the
        visible focus. Transparent, so forced colours leave it be.
      */}
      {isLink ? (
        <a
          aria-labelledby={headingId}
          className="absolute inset-0 z-20 rounded-[var(--mq-radius,22px)] outline-none"
          href={href}
        />
      ) : null}

      {/* Busy wash. Inert and hidden from assistive tech — `aria-busy` on the
          card carries the meaning. Reduced motion stops the pulse but keeps a
          static wash so the state stays visible. */}
      {busy ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[var(--mq-frame,7px)] z-30 rounded-[var(--mq-inner-radius,16px)] bg-[rgba(255,255,255,0.32)] animate-pulse motion-reduce:animate-none"
        />
      ) : null}
    </article>
  );
}

export { imageCardVariants };
