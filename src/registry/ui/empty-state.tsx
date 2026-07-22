"use client";

import * as React from "react";
import { Inbox } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Empty State
 *
 * A centred panel for the zero-data moment: a decorative illustration, a real
 * heading, an explanatory paragraph and one caller-supplied action. It is the
 * thing a list, a table or a search result collapses to when it has nothing to
 * show, and its whole job is to say what is missing and how to fix it.
 *
 * Material-agnostic on purpose. An empty state is a layout, not a surface with
 * a clay/glass/skeuo identity to sell, so it ships a single adaptive palette
 * that follows the colour scheme. It still accepts a `material` prop for API
 * symmetry across the library, but that value only lands on `data-material`; it
 * never selects a visual recipe. All four catalog values are accepted so a
 * caller threading a catalog-wide `StyleSlug` through never hits a type error.
 *
 * Self-contained by design: the palette lives in this file, every local custom
 * property carries a literal fallback, and the entrance `@keyframes` ship with
 * the component through React 19's hoisted `<style href precedence>`, which
 * deduplicates by `href` — a page with several empty states still emits one
 * rule of each.
 *
 * Accessibility contract:
 *
 * - The title renders as a genuine heading. Its rank is *overridable*
 *   (`headingLevel`, 1–6) because the correct level depends on the document
 *   outline the panel sits in, which only the page knows — a hardcoded rank
 *   would break that outline half the time.
 * - The illustration is always decorative and carries `aria-hidden`, so meaning
 *   is carried by the heading and description text, never by an icon or colour.
 * - The action is supplied by the caller as a real `<button>`/`<a>`; it brings
 *   its own accessible name and its own focus ring, so this component owns no
 *   focus state and traps nothing.
 * - The panel is static content, not a transient status, so it declares no live
 *   region: a screen reader meets it by navigating headings, the way any empty
 *   view is met.
 *
 * Local theming knobs (all used with a literal fallback):
 *
 *   --mq-body       panel surface
 *   --mq-text       heading and title colour
 *   --mq-muted      description colour
 *   --mq-brd        panel border colour
 *   --mq-icon-bg    illustration well colour
 *   --mq-icon-fg    illustration glyph colour
 *   --mq-icon-box   illustration well size
 *   --mq-icon-radius illustration well radius
 *   --mq-glyph      glyph size
 *   --mq-title-size heading font size
 *   --mq-desc-size  description font size
 *   --mq-max        content max width
 *   --mq-gap        vertical rhythm
 *   --mq-pad        inner padding
 *   --mq-radius     corner radius
 */

/**
 * Keyframes travel with the component. Both animate the standalone properties
 * Tailwind v4's utilities write — `translate`, `scale` and `opacity` — rather
 * than `transform`, so a caller who puts their own `transform` on the wrapper
 * never fights the animation for the same property. There is no `transform`,
 * and no state-scoped `translate-*` utility, anywhere in this file.
 *
 * The resting frame of each is the element's own default (no offset, full size,
 * full opacity), which is exactly what a reduced-motion reader is left with once
 * `animate-none` removes the animation: a fully present, fully legible panel.
 */
const EMPTY_STATE_KEYFRAMES =
  "@keyframes mq-empty-in{from{opacity:0;translate:0 8px}to{opacity:1;translate:0 0}}" +
  "@keyframes mq-empty-icon{0%{opacity:0;scale:0.9}100%{opacity:1;scale:1}}";

function EmptyStateKeyframes() {
  // React 19 hoists this to <head> and deduplicates it by `href`, so rendering
  // several empty states emits one rule of each, not one per instance.
  return (
    <style href="mq-empty-state" precedence="medium">
      {EMPTY_STATE_KEYFRAMES}
    </style>
  );
}

/** The four catalog materials. Accepted for symmetry, reflected only on
 * `data-material`; none of them selects a visual recipe here. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/** Heading rank the title renders at. Overridable because the correct level is
 * a property of the surrounding page, not of this component. */
export type EmptyStateHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

const emptyStateVariants = cva(
  [
    "relative isolate mx-auto flex w-full flex-col items-center text-center",
    "max-w-[var(--mq-max,380px)] gap-[var(--mq-gap,12px)] rounded-[var(--mq-radius,22px)] p-[var(--mq-pad,32px)]",
    "border border-[var(--mq-brd,rgba(23,24,23,0.12))]",
    "bg-[var(--mq-body,#f7f6f2)] text-[color:var(--mq-text,#1c1c19)]",
    "shadow-[0_1px_2px_rgba(20,20,18,0.05),0_12px_30px_rgba(20,20,18,0.05)]",
    // A single adaptive palette: soft warm paper on light, muted charcoal on
    // dark. Set on the panel and read by every child through the cascade, so one
    // declaration themes the whole block.
    "[--mq-body:#f7f6f2] [--mq-text:#1c1c19] [--mq-muted:#55554e] [--mq-brd:rgba(23,24,23,0.12)] [--mq-icon-bg:rgba(23,24,23,0.06)] [--mq-icon-fg:#3a3a34]",
    "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] dark:[--mq-brd:rgba(255,255,255,0.14)] dark:[--mq-icon-bg:rgba(255,255,255,0.08)] dark:[--mq-icon-fg:#d7d5ce]",
    // The panel arrives with a short fade and rise. Keyframes, not a transition:
    // an empty state is mounted in its final state and a transition has nothing
    // to run from on the frame it appears. It is pure decoration — the content
    // is already in the DOM and read by heading navigation — so reduced motion
    // drops the travel outright and leaves the panel simply present.
    "animate-[mq-empty-in_360ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none",
    // Shadows and translucency are erased in forced-colors mode, so the panel
    // would dissolve into the page. A system border keeps its bounds and system
    // colours keep its text legible.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      // A single presentation today; kept as an axis so the catalog's variant
      // switcher has something to bind to and future treatments have a home.
      variant: {
        default: "",
      },
      size: {
        sm: [
          "[--mq-pad:20px] [--mq-gap:10px] [--mq-radius:16px] [--mq-max:320px]",
          "[--mq-icon-box:44px] [--mq-icon-radius:14px] [--mq-glyph:22px]",
          "[--mq-title-size:15px] [--mq-desc-size:12px]",
        ].join(" "),
        md: [
          "[--mq-pad:32px] [--mq-gap:12px] [--mq-radius:22px] [--mq-max:380px]",
          "[--mq-icon-box:56px] [--mq-icon-radius:18px] [--mq-glyph:28px]",
          "[--mq-title-size:18px] [--mq-desc-size:13px]",
        ].join(" "),
        lg: [
          "[--mq-pad:44px] [--mq-gap:14px] [--mq-radius:28px] [--mq-max:440px]",
          "[--mq-icon-box:68px] [--mq-icon-radius:22px] [--mq-glyph:34px]",
          "[--mq-title-size:22px] [--mq-desc-size:15px]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type EmptyStateProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "title"
> &
  VariantProps<typeof emptyStateVariants> & {
    /** Accepted for API symmetry; reflected on `data-material` only, never used
     * to pick a visual recipe. */
    material?: MaterialSlug;
    /** Required heading text describing what is missing. */
    title: React.ReactNode;
    /** Optional paragraph explaining the state or the next step. */
    description?: React.ReactNode;
    /** Optional action, normally a real `<button>` or `<a>` with its own name. */
    action?: React.ReactNode;
    /**
     * Decorative illustration. Defaults to an inbox glyph; pass a custom node,
     * or `false` to render no illustration at all.
     */
    icon?: React.ReactNode;
    /** Heading rank the title renders at, 1–6. Defaults to 2. */
    headingLevel?: EmptyStateHeadingLevel;
    titleClassName?: string;
    descriptionClassName?: string;
    iconClassName?: string;
    actionClassName?: string;
  };

export function EmptyState({
  action,
  actionClassName,
  className,
  description,
  descriptionClassName,
  headingLevel = 2,
  icon,
  iconClassName,
  material = "adaptive",
  size,
  title,
  titleClassName,
  variant,
  ...props
}: EmptyStateProps) {
  // `icon === undefined` means "use the default"; an explicit `false`/`null`
  // renders no illustration, mirroring Alert's `icon={false}` opt-out.
  const resolvedIcon = icon === undefined ? <Inbox /> : icon;
  const HeadingTag = HEADING_TAGS[headingLevel - 1] as React.ElementType;

  return (
    <>
      <EmptyStateKeyframes />
      <div
        {...props}
        className={cn(emptyStateVariants({ variant, size }), className)}
        data-material={material}
        data-variant={variant ?? "default"}
      >
        {resolvedIcon ? (
          <span
            aria-hidden="true"
            className={cn(
              "relative grid shrink-0 place-items-center",
              "size-[var(--mq-icon-box,56px)] rounded-[var(--mq-icon-radius,18px)]",
              "bg-[var(--mq-icon-bg,rgba(23,24,23,0.06))] text-[color:var(--mq-icon-fg,#3a3a34)]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
              "[&>svg]:size-[var(--mq-glyph,28px)]",
              // A beat behind the panel, so the eye settles on the glyph last.
              // Decoration on a node that is already aria-hidden, so reduced
              // motion simply drops it and leaves the glyph at rest.
              "animate-[mq-empty-icon_420ms_cubic-bezier(0.34,1.56,0.64,1)_90ms_both] motion-reduce:animate-none",
              "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
              iconClassName,
            )}
            data-empty-icon=""
          >
            {resolvedIcon}
          </span>
        ) : null}
        <HeadingTag
          className={cn(
            "m-0 text-[length:var(--mq-title-size,18px)] leading-[1.25] font-extrabold tracking-[-0.01em]",
            "text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]",
            titleClassName,
          )}
          data-empty-title=""
        >
          {title}
        </HeadingTag>
        {description ? (
          <p
            className={cn(
              "m-0 max-w-[46ch] text-[length:var(--mq-desc-size,13px)] leading-[1.6] font-medium",
              "text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]",
              descriptionClassName,
            )}
            data-empty-description=""
          >
            {description}
          </p>
        ) : null}
        {action ? (
          <div
            className={cn(
              "mt-[4px] flex flex-wrap items-center justify-center gap-[8px]",
              actionClassName,
            )}
            data-empty-action=""
          >
            {action}
          </div>
        ) : null}
      </div>
    </>
  );
}

export { emptyStateVariants };
