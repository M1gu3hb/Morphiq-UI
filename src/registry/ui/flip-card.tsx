"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Flip Card
 *
 * A two-sided surface that turns in real 3D to reveal its back on hover, on
 * keyboard `:focus-within`, and on an explicit tap toggle. Both faces are always
 * in the DOM and never `display:none`, so a control on the hidden face stays in
 * the tab order — tabbing to it flips the card into view via `:focus-within`.
 *
 * Self-contained by design: the four material recipes (clay / glass / skeuo /
 * adaptive) are copied into this file from the Card, so it carries no dependency
 * on `:root` variables or any global stylesheet. Every local custom property is
 * read with a literal fallback.
 *
 * The turn is one inline `transform` driven by a local `--mq-turn` angle, so it
 * never collides with Tailwind v4's standalone `translate`/`rotate` properties.
 * No animation library — pure CSS transition on `transform`.
 *
 *   --mq-body    surface color
 *   --mq-lit     top highlight color (skeuo gradient)
 *   --mq-edge    extruded bottom edge color
 *   --mq-text    primary foreground color
 *   --mq-muted   secondary foreground color
 *   --mq-rule    hairline color
 *   --mq-brd     border color
 *   --mq-ring    focus ring color
 *   --mq-title   title font size
 *   --mq-turn    the turn angle, local to each card
 *
 * Reduced motion: `prefers-reduced-motion` cancels the rotation entirely — the
 * `transform` becomes `none` and the two faces cross-fade with opacity instead,
 * both faces staying fully legible. No looping animation runs in that mode.
 *
 * Forced colors: shadows and the frosted backdrop are discarded, a
 * system-colored border keeps each face's bounds, and the focus ring becomes
 * `Highlight`.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const RADIUS: Record<"sm" | "md" | "lg", string> = {
  sm: "rounded-[18px]",
  md: "rounded-[24px]",
  lg: "rounded-[30px]",
};

/**
 * The perspective host and the interaction group. It never rotates itself; it
 * establishes the 3D scene, owns the focus ring (drawn on `:focus-within` so
 * tabbing a control on either face outlines the whole card, and on
 * `data-focus="true"` so docs can force the look), and carries `data-flipped`
 * which the toggle button drives for touch.
 */
const CONTAINER = [
  "group relative isolate block [perspective:1200px]",
  "[--mq-ring:#171817] dark:[--mq-ring:#f1efe9]",
  "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[var(--mq-ring,#171817)]",
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--mq-ring,#171817)]",
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
  "forced-colors:focus-within:outline-[Highlight] forced-colors:focus-visible:outline-[Highlight]",
  "forced-colors:data-[focus=true]:outline-[Highlight]",
].join(" ");

/**
 * The rotating element. `--mq-turn` is 0deg at rest and 180deg whenever the card
 * is flipped by any of the three triggers; the transform reads it with a literal
 * fallback. Under reduced motion the `transform` is forced to `none` (a later,
 * equal-specificity rule wins), so the angle is set but never applied — the
 * faces cross-fade instead.
 */
const INNER = [
  "grid w-full [transform-style:preserve-3d] will-change-transform",
  "[transform:rotateY(var(--mq-turn,0deg))] [--mq-turn:0deg]",
  "group-hover:[--mq-turn:180deg] group-focus-within:[--mq-turn:180deg] group-data-[flipped=true]:[--mq-turn:180deg]",
  "transition-[transform] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
  "motion-reduce:[transform:none] motion-reduce:transition-none",
].join(" ");

/**
 * The face surface. Material recipes are copied from the Card's `default`
 * intent, folded together with their tokens because Flip Card ships a single
 * `default` variant. Each face is a grid item pinned to the same cell so the
 * card sizes to its taller side without JavaScript, and both faces overlap.
 */
const faceVariants = cva(
  [
    "relative isolate [grid-area:1/1] flex min-w-0 flex-col overflow-hidden",
    "border text-left opacity-100",
    "text-[color:var(--mq-text,#2b2b26)]",
    "[backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
    // The cross-fade replacement for reduced motion. In normal mode neither face
    // changes opacity (the backface-visibility does the hiding), so this is inert
    // there; under reduced motion the faces fade between each other.
    "transition-opacity duration-300 ease-out",
    "forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346]",
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)]",
          "bg-[var(--mq-body,#f6e7dd)] border-[var(--mq-brd,rgba(120,80,55,0.16))]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)]",
        ].join(" "),
        glass: [
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f]",
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)]",
          "bg-[var(--mq-body,rgba(255,255,255,0.66))] border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%] forced-colors:backdrop-blur-none",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)]",
        ].join(" "),
        skeuo: [
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943]",
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)]",
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))] border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)]",
          "forced-colors:[background-image:none] forced-colors:bg-[Canvas]",
        ].join(" "),
        adaptive: [
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)]",
          "bg-[var(--mq-body,#ffffff)] border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)]",
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)]",
          "dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_10px_24px_rgba(0,0,0,0.55)]",
        ].join(" "),
      },
      size: {
        sm: "gap-[10px] p-[16px] rounded-[18px] min-h-[168px] [--mq-title:15px]",
        md: "gap-[14px] p-[22px] rounded-[24px] min-h-[204px] [--mq-title:17px]",
        lg: "gap-[18px] p-[28px] rounded-[30px] min-h-[240px] [--mq-title:20px]",
      },
    },
    defaultVariants: { material: "clay", size: "md" },
  },
);

/**
 * Front face modifiers. It shows at rest, so nothing hides it in normal mode.
 * When the card is flipped it stops intercepting the pointer (so clicks reach
 * the back) and, under reduced motion, fades out.
 */
const FRONT_FACE = [
  "group-hover:[pointer-events:none] group-focus-within:[pointer-events:none] group-data-[flipped=true]:[pointer-events:none]",
  "motion-reduce:group-hover:opacity-0 motion-reduce:group-focus-within:opacity-0 motion-reduce:group-data-[flipped=true]:opacity-0",
].join(" ");

/**
 * Back face modifiers. Pre-rotated a half turn so it reads correctly once the
 * card flips; that rotation is removed under reduced motion where it lies flat
 * on top of the front and is revealed by opacity. It never intercepts the
 * pointer until the card is flipped, and starts hidden in the reduced-motion
 * cross-fade.
 */
const BACK_FACE = [
  "[transform:rotateY(180deg)] motion-reduce:[transform:none]",
  "[pointer-events:none] group-hover:[pointer-events:auto] group-focus-within:[pointer-events:auto] group-data-[flipped=true]:[pointer-events:auto]",
  "motion-reduce:opacity-0 motion-reduce:group-hover:opacity-100 motion-reduce:group-focus-within:opacity-100 motion-reduce:group-data-[flipped=true]:opacity-100",
].join(" ");

/** Decorative loop glyph on the flip control. Inherits the button's color. */
function FlipGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="size-[14px] shrink-0"
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
    >
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

type FlipToggleProps = {
  describedBy: string;
  flipped: boolean;
  label: string;
  onToggle: () => void;
};

/**
 * The tap affordance. A real toggle `<button>` — the persistent flip for touch,
 * where there is no hover to lean on. `aria-pressed` reports whether the card is
 * turned; `aria-describedby` points at the visually-hidden usage hint. It sits
 * at the bottom of its face and stays above the content.
 */
function FlipToggle({ describedBy, flipped, label, onToggle }: FlipToggleProps) {
  return (
    <button
      aria-describedby={describedBy}
      aria-pressed={flipped}
      className={cn(
        "relative z-10 mt-auto inline-flex w-fit items-center gap-[8px] self-start",
        "rounded-full border bg-transparent px-[13px] py-[7px]",
        "text-[length:12px] font-extrabold tracking-[-0.01em]",
        "border-[var(--mq-brd,rgba(23,24,23,0.14))] text-[color:var(--mq-text,#2b2b26)]",
        "shadow-[0_1px_2px_rgba(20,20,18,0.08)]",
        "transition-[box-shadow,border-color] duration-200 ease-out motion-reduce:transition-none",
        "hover:border-[color:var(--mq-text,#2b2b26)] hover:shadow-[0_3px_10px_rgba(20,20,18,0.14)]",
        "active:shadow-[0_1px_2px_rgba(20,20,18,0.10)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)]",
        "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText] forced-colors:shadow-none",
        "forced-colors:focus-visible:outline-[Highlight]",
      )}
      onClick={onToggle}
      type="button"
    >
      <FlipGlyph />
      {label}
    </button>
  );
}

export type FlipCardProps = Omit<React.ComponentPropsWithRef<"section">, "children"> & {
  material?: MaterialSlug;
  /** Reserved axis; the Flip Card ships a single `default` presentation. */
  variant?: "default";
  size?: "sm" | "md" | "lg";
  /** Content shown at rest. Keep it presentational — see the a11y notes. */
  front: React.ReactNode;
  /** Content revealed by the flip. Interactive controls here stay reachable. */
  back: React.ReactNode;
  /** Accessible name of the toggle on the front face. */
  flipToBackLabel?: string;
  /** Accessible name of the toggle on the back face. */
  flipToFrontLabel?: string;
  /** Whether the card starts turned to its back. */
  defaultFlipped?: boolean;
};

export function FlipCard({
  back,
  className,
  defaultFlipped = false,
  flipToBackLabel = "Show details",
  flipToFrontLabel = "Show summary",
  front,
  material = "clay",
  size = "md",
  variant = "default",
  ...props
}: FlipCardProps) {
  const [flipped, setFlipped] = React.useState(defaultFlipped);
  const hintId = React.useId();
  const toggle = React.useCallback(() => setFlipped((value) => !value), []);
  const faceClass = faceVariants({ material, size });

  return (
    <section
      {...props}
      className={cn(CONTAINER, RADIUS[size], className)}
      data-flipped={flipped ? "true" : undefined}
      data-material={material}
      data-variant={variant}
    >
      <p className="sr-only" id={hintId}>
        This card has two sides. Hovering it, moving keyboard focus into it, or
        activating the flip button reveals the other side.
      </p>
      <div className={INNER}>
        <div className={cn(faceClass, FRONT_FACE)}>
          {front}
          <FlipToggle
            describedBy={hintId}
            flipped={flipped}
            label={flipToBackLabel}
            onToggle={toggle}
          />
        </div>
        <div className={cn(faceClass, BACK_FACE)}>
          {back}
          <FlipToggle
            describedBy={hintId}
            // The back toggle's target is the SUMMARY (the front), so its pressed
            // state is the inverse of the card's flipped state: "Show summary" is
            // active precisely when the summary is NOT currently shown.
            flipped={!flipped}
            label={flipToFrontLabel}
            onToggle={toggle}
          />
        </div>
      </div>
    </section>
  );
}

const HEADING_TAGS = { 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const;

export type FlipCardTitleProps = React.ComponentPropsWithoutRef<"h3"> & {
  /**
   * Heading rank. Overridable because the correct level depends on where the
   * card sits in the page outline — the component cannot know that.
   */
  level?: 2 | 3 | 4 | 5 | 6;
};

export function FlipCardTitle({ className, level = 3, ...props }: FlipCardTitleProps) {
  const Tag = HEADING_TAGS[level];
  return (
    <Tag
      {...props}
      className={cn(
        "m-0 font-extrabold tracking-[-0.02em]",
        "text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.2]",
        className,
      )}
    />
  );
}

export function FlipCardDescription({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      {...props}
      className={cn(
        "m-0 text-[color:var(--mq-muted,#5c5b55)] text-[length:12px] leading-[1.65]",
        className,
      )}
    />
  );
}

export { faceVariants as flipCardFaceVariants };
