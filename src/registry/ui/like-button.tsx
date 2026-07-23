"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Like Button
 *
 * A single native <button> that toggles a "liked" state and keeps a live count
 * beside a heart glyph. Uncontrolled by default (it owns `liked` + `count`),
 * fully controllable via the `liked` / `count` props with `onLikeChange`.
 * Clicking flips `liked` and adjusts the count by one; on a *like* a small,
 * decorative heart burst plays.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The material recipe is Button's own PRIMARY-intent
 * tokens, inlined into a `material` axis, with the same per-material press
 * physics (resting shadow, a hover lift, and an active SINK into a pressed
 * inset well), plus a per-material `--mq-heart` tint for the filled heart.
 *
 *   <LikeButton material="clay" size="md" defaultCount={128} />
 *   <LikeButton liked={liked} count={count} onLikeChange={(l, c) => …} />
 *
 * Accessibility: the button carries `aria-pressed` and a dynamic accessible
 * name ("Like" when off, "Unlike" when on). The count is real text, and the
 * liked/unliked distinction is the heart *shape* (filled vs outline), never
 * colour alone. A polite live region announces "Liked, 24 likes" /
 * "Removed like, 23 likes" after each toggle.
 *
 * Local theming knobs (override from a parent or `className` to retheme without
 * forking the recipe — each is read with a literal fallback):
 *
 *   --mq-body / --mq-lit / --mq-edge   surface, top highlight, extruded edge
 *   --mq-text / --mq-brd / --mq-ring   label, border, focus ring
 *   --mq-heart                         filled-heart tint (>= 4.5:1 on surface)
 */

type LikeMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type LikeSize = "sm" | "md" | "lg";
type LikeVariant = "default";

/**
 * Palette per material. Declared once on the button; the surface, label, heart
 * and burst inherit it through CSS. Surface values are Button's PRIMARY intent
 * verbatim (so the label keeps its measured >= 4.5:1 contract), plus a
 * `--mq-heart` chosen to clear 4.5:1 against that same surface. `adaptive`
 * additionally flips on `prefers-color-scheme` because it names only opaque
 * surfaces that flip together with the glyphs on them.
 */
const MATERIAL_TOKENS: Record<LikeMaterial, string> = {
  clay:
    "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817] [--mq-heart:#7a0b1c]",
  glass:
    "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817] [--mq-heart:#ffc2d4]",
  skeuo:
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817] [--mq-heart:#ffa8a8]",
  adaptive:
    "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817] [--mq-heart:#ff6b8a] " +
    "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9] dark:[--mq-heart:#b3123a]",
};

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so the docs surface can render the focused look
 * without synthesising a keyboard event. Width/offset/colour together fully
 * replace the UA outline, so it is never reset with `outline-none`.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] forced-colors:data-[focus=true]:outline-[Highlight]";

/**
 * Shared surface chrome. `translate`, not `transform`: Tailwind v4 writes its
 * `translate-*` utilities to the standalone `translate` property, so the
 * transition names `translate` explicitly. `filter` covers skeuo's hover
 * brightness and `backdrop-filter` covers glass's hover frost — every property
 * in the list is one some state actually changes, and none is phantom.
 * `background-color` is omitted: no surface state tints, so listing it would
 * fire on nothing.
 */
const SURFACE_BASE = [
  "relative isolate inline-flex shrink-0 select-none items-center justify-center align-middle",
  "border font-extrabold tracking-[-0.01em] cursor-pointer appearance-none",
  "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
  "motion-reduce:transition-none",
  FOCUS_RING,
  "forced-colors:border-[CanvasText]",
  // Native `disabled` drives the faded look; press travel is cancelled but the
  // resting bounds stay.
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0 disabled:shadow-none",
].join(" ");

/**
 * The four material recipes, PRIMARY-intent values inlined. Press physics per
 * material: clay sinks ~3px into a warm inset well, skeuo ~4px, glass/adaptive
 * ~1px — the hover lift grows the shadow, the active state SINKS into the inset.
 * `motion-reduce` (on the base) drops the travel, but `:active` still applies
 * the inset instantly, so the tactile feedback survives without animation.
 */
const MATERIAL_SURFACE: Record<LikeMaterial, string> = {
  clay: [
    "bg-[var(--mq-body,#ff9077)] text-[var(--mq-text,#4a1d13)] border-[var(--mq-brd,rgba(120,40,25,0.16))]",
    "shadow-[inset_0_3px_3px_rgba(255,255,255,0.55),inset_0_-4px_6px_rgba(120,40,25,0.18),0_6px_0_var(--mq-edge,#c9482f),0_12px_20px_rgba(75,40,31,0.18)]",
    "hover:-translate-y-[2px]",
    "hover:shadow-[inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(120,40,25,0.18),0_8px_0_var(--mq-edge,#c9482f),0_16px_26px_rgba(75,40,31,0.2)]",
    "active:translate-y-[3px]",
    "active:shadow-[inset_0_3px_7px_rgba(120,40,25,0.32),0_2px_0_var(--mq-edge,#c9482f)]",
  ].join(" "),
  glass: [
    "bg-[var(--mq-body,rgba(23,24,23,0.74))] text-[var(--mq-text,#ffffff)] border-[var(--mq-brd,rgba(255,255,255,0.28))]",
    "backdrop-blur-[14px] backdrop-saturate-[160%]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_26px_rgba(24,20,40,0.2)]",
    "hover:-translate-y-[1px] hover:backdrop-blur-[18px]",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_32px_rgba(24,20,40,0.26)]",
    "active:translate-y-[1px]",
    "active:shadow-[inset_0_2px_7px_rgba(24,20,40,0.3)]",
    "forced-colors:[backdrop-filter:none]",
  ].join(" "),
  skeuo: [
    "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] text-[var(--mq-text,#f6f4ee)] border-[var(--mq-brd,rgba(0,0,0,0.5))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_5px_0_var(--mq-edge,#131311),0_10px_16px_rgba(38,36,31,0.28)]",
    "hover:-translate-y-[1px] hover:brightness-[1.08]",
    "active:translate-y-[4px]",
    "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
  ].join(" "),
  adaptive: [
    "bg-[var(--mq-body,#171817)] text-[var(--mq-text,#f6f5f1)] border-[var(--mq-brd,rgba(0,0,0,0.4))]",
    "shadow-[0_1px_2px_rgba(20,20,18,0.12)]",
    "hover:shadow-[0_5px_14px_rgba(20,20,18,0.18)]",
    "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
    // Coarse pointers get a comfortable touch target; only ever grows the control.
    "pointer-coarse:min-h-[48px]",
  ].join(" "),
};

const likeVariants = cva(cn(SURFACE_BASE, "rounded-[var(--mq-radius,15px)]"), {
  variants: {
    material: MATERIAL_SURFACE,
    size: {
      sm: "h-[36px] gap-[7px] px-[13px] text-[12px]/[1] [--mq-radius:12px]",
      md: "h-[44px] gap-[9px] px-[17px] text-[13px]/[1] [--mq-radius:15px]",
      lg: "h-[52px] gap-[11px] px-[21px] text-[14px]/[1] [--mq-radius:18px]",
    },
  },
  defaultVariants: { material: "clay", size: "md" },
});

/**
 * Motion, shipped with the component instead of a global sheet. React 19 hoists
 * this `<style>` and dedupes it by `href`, so a page with many like buttons
 * emits one rule. Both keyframes REST at their natural neutral state (the heart
 * pop ends at scale 1, the burst ends invisible), so `motion-reduce:animate-none`
 * / `motion-reduce:hidden` leave the resting appearance intact — only the travel
 * is dropped, never the count update or the fill change.
 */
const LIKE_KEYFRAMES = `
@keyframes mq-like-pop{0%{scale:1}35%{scale:1.32}70%{scale:0.94}100%{scale:1}}
@keyframes mq-like-burst{0%{opacity:0;translate:0 0;scale:0.2}25%{opacity:1}100%{opacity:0;translate:var(--mq-bx,0px) var(--mq-by,0px);scale:1}}`;

function LikeKeyframes() {
  return (
    <style href="mq-like-button" precedence="medium">
      {LIKE_KEYFRAMES}
    </style>
  );
}

/** Outward vectors for the six burst motes (kept small; fine at every size). */
const BURST_MOTES: ReadonlyArray<{ x: string; y: string }> = [
  { x: "0px", y: "-17px" },
  { x: "15px", y: "-9px" },
  { x: "15px", y: "9px" },
  { x: "0px", y: "17px" },
  { x: "-15px", y: "9px" },
  { x: "-15px", y: "-9px" },
];

/** Visually hidden but present in the a11y tree — the classic sr-only, inlined
 * as utilities so nothing depends on a global `.sr-only` class. */
const VISUALLY_HIDDEN =
  "absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]";

/** Deterministic, locale-free compact formatter (SSR-safe for SSG). */
function stripTrailingZero(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

function formatCount(value: number): string {
  const sign = value < 0 ? "-" : "";
  const magnitude = Math.abs(value);
  if (magnitude < 1000) return `${value}`;
  if (magnitude < 1_000_000) return `${sign}${stripTrailingZero(magnitude / 1000)}K`;
  return `${sign}${stripTrailingZero(magnitude / 1_000_000)}M`;
}

type LikeButtonOwnProps = {
  /** Controlled liked state. Omit for uncontrolled (owns its own state). */
  liked?: boolean;
  /** Initial liked state when uncontrolled. */
  defaultLiked?: boolean;
  /** Controlled count. Omit for uncontrolled. */
  count?: number;
  /** Initial count when uncontrolled. */
  defaultCount?: number;
  /** Fired after a toggle with the next liked state and count. */
  onLikeChange?: (liked: boolean, count: number) => void;
  material?: LikeMaterial;
  size?: LikeSize;
  /** Single presentation variant; reserved for future tone axes. */
  variant?: LikeVariant;
};

/**
 * `Omit` the own props (and the generated `children` / native `type`) off the
 * native button props so the rest — `onClick`, `disabled`, `data-*`, `aria-*`,
 * `ref` (a normal prop in React 19) — spread straight onto the `<button>`.
 */
export type LikeButtonProps = LikeButtonOwnProps &
  Omit<React.ComponentPropsWithRef<"button">, keyof LikeButtonOwnProps | "type" | "children">;

export function LikeButton({
  className,
  count,
  defaultCount = 0,
  defaultLiked = false,
  disabled = false,
  liked,
  material = "clay",
  onClick,
  onLikeChange,
  size = "md",
  variant = "default",
  ...rest
}: LikeButtonProps) {
  const isLikedControlled = liked !== undefined;
  const isCountControlled = count !== undefined;
  const [internalLiked, setInternalLiked] = React.useState(defaultLiked);
  const [internalCount, setInternalCount] = React.useState(defaultCount);

  const currentLiked = isLikedControlled ? liked : internalLiked;
  const currentCount = isCountControlled ? (count as number) : internalCount;

  // `pulse` remounts the pop/burst so their CSS animations replay on each click;
  // it starts at 0 so nothing animates on first paint (SSR-stable). `burstOn`
  // records whether the last toggle was a *like*, gating the celebratory burst.
  const [pulse, setPulse] = React.useState(0);
  const [burstOn, setBurstOn] = React.useState(false);
  const [message, setMessage] = React.useState("");

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (disabled) return;

    const nextLiked = !currentLiked;
    const nextCount = currentCount + (nextLiked ? 1 : -1);

    if (!isLikedControlled) setInternalLiked(nextLiked);
    if (!isCountControlled) setInternalCount(nextCount);

    setPulse((value) => value + 1);
    setBurstOn(nextLiked);

    const noun = nextCount === 1 ? "like" : "likes";
    setMessage(`${nextLiked ? "Liked" : "Removed like"}, ${formatCount(nextCount)} ${noun}`);

    onLikeChange?.(nextLiked, nextCount);
  }

  const heartTone = currentLiked
    ? "text-[var(--mq-heart,#7a0b1c)]"
    : "text-[var(--mq-text,#4a1d13)]";

  return (
    <>
      <LikeKeyframes />
      <button
        {...rest}
        aria-label={currentLiked ? "Unlike" : "Like"}
        aria-pressed={currentLiked}
        className={cn(likeVariants({ material, size }), MATERIAL_TOKENS[material], className)}
        data-liked={currentLiked ? "true" : "false"}
        data-material={material}
        data-variant={variant}
        disabled={disabled}
        onClick={handleClick}
        type="button"
      >
        <span className="relative grid shrink-0 place-items-center">
          {/* Decorative burst: fully removed under reduced-motion and forced
              colours, keyed by `pulse` so it replays on every like. */}
          {pulse > 0 && burstOn ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 motion-reduce:hidden forced-colors:hidden"
              key={pulse}
            >
              {BURST_MOTES.map((mote, index) => (
                <span
                  className="absolute left-1/2 top-1/2 block size-[5px] rounded-full bg-[var(--mq-heart,#7a0b1c)] animate-[mq-like-burst_540ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
                  key={index}
                  style={{ "--mq-bx": mote.x, "--mq-by": mote.y } as React.CSSProperties}
                />
              ))}
            </span>
          ) : null}
          {/* Heart glyph: fill (shape), not colour alone, marks the state. The
              pop replays via the `pulse` key; reduced motion drops it but the
              fill still flips instantly. */}
          <span
            className={cn(
              "relative z-10 grid place-items-center",
              pulse > 0 && "animate-[mq-like-pop_360ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
            )}
            key={`heart-${pulse}`}
          >
            <Heart
              aria-hidden="true"
              className={cn("size-[1.15em] shrink-0", heartTone, "forced-colors:text-[CanvasText]")}
              fill={currentLiked ? "currentColor" : "none"}
              strokeWidth={2.25}
            />
          </span>
        </span>
        <span className="[font-variant-numeric:tabular-nums]">{formatCount(currentCount)}</span>
      </button>
      {/* Present before any text arrives so the toggle result is announced. */}
      <span aria-atomic="true" aria-live="polite" className={VISUALLY_HIDDEN}>
        {message}
      </span>
    </>
  );
}

export type LikeButtonVariantProps = VariantProps<typeof likeVariants>;

export { likeVariants };
