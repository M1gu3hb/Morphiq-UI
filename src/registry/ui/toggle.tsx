"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Toggle
 *
 * An on/off switch. Self-contained by design: every material recipe lives in
 * this file. It does not read `:root` custom properties and it does not depend
 * on any class from a global stylesheet, so copying this file (plus
 * `src/lib/cn.ts`) into another project reproduces the full look.
 *
 * Theming knobs are local CSS variables declared on the control itself, each
 * used with a literal fallback. Because custom properties inherit, the track,
 * the thumb and the ON/OFF captions read the same tokens without any context:
 *
 *   --mq-track-off  track fill when unchecked
 *   --mq-track-on   track fill when checked
 *   --mq-track-brd  track border color
 *   --mq-thumb-bg   thumb fill
 *   --mq-thumb-brd  thumb border color
 *   --mq-on-text    caption color over the checked track
 *   --mq-off-text   caption color over the unchecked track
 *   --mq-icon       glyph color inside the thumb (`icon` variant)
 *   --mq-ring       focus ring color
 *   --mq-track-w    track width
 *   --mq-track-h    track height
 *   --mq-thumb      thumb diameter
 *   --mq-pad        inset between thumb and track edge
 *   --mq-travel     thumb travel, derived from the three above
 *
 * Contrast contract: every caption measures at or above 4.5:1 against the track
 * it sits on — for glass, against a white and a black backdrop alike, because
 * glass must never borrow its legibility from whatever sits behind it. The
 * visible text label inherits the host's color, so it stays legible on any
 * surface the switch is placed on.
 */

const toggleVariants = cva(
  [
    "group/toggle relative isolate inline-flex shrink-0 items-center gap-[10px]",
    "cursor-pointer appearance-none bg-transparent p-0 text-left",
    // The visible label inherits the host's text color rather than pinning one:
    // the switch has no surface of its own behind that text, so any fixed value
    // would be a guess about the page it is dropped into.
    "text-[color:currentColor] text-[length:13px] leading-[1.3] font-bold",
    "transition-opacity duration-200 ease-out motion-reduce:transition-none",
    // Travel is derived so a wider track (the `labeled` variant) moves the thumb
    // further without restating the geometry. Underscores are Tailwind's escape
    // for the spaces `calc()` requires around its operators.
    "[--mq-travel:calc(var(--mq-track-w,46px)_-_var(--mq-thumb,20px)_-_calc(var(--mq-pad,3px)_*_2))]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    "disabled:cursor-not-allowed disabled:opacity-55",
    "data-[state-flag=loading]:cursor-progress",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "[--mq-track-off:#e7d9cc] [--mq-track-on:#ff9077]",
          "[--mq-track-brd:rgba(120,60,40,0.20)]",
          "[--mq-thumb-bg:#fffaf6] [--mq-thumb-brd:rgba(120,60,40,0.22)]",
          "[--mq-on-text:#4a1d13] [--mq-off-text:#463a2e] [--mq-icon:#4a1d13] [--mq-ring:#171817]",
        ].join(" "),
        glass: [
          "[--mq-track-off:rgba(255,255,255,0.62)] [--mq-track-on:rgba(23,24,23,0.74)]",
          "[--mq-track-brd:rgba(255,255,255,0.72)]",
          "[--mq-thumb-bg:#ffffff] [--mq-thumb-brd:rgba(255,255,255,0.9)]",
          "[--mq-on-text:#ffffff] [--mq-off-text:#23231f] [--mq-icon:#23231f] [--mq-ring:#171817]",
        ].join(" "),
        skeuo: [
          "[--mq-track-off:#bfbbb2] [--mq-track-on:#c2e05a]",
          "[--mq-track-brd:rgba(25,25,23,0.34)]",
          "[--mq-thumb-bg:#fbfaf6] [--mq-thumb-brd:rgba(25,25,23,0.32)]",
          "[--mq-on-text:#23231f] [--mq-off-text:#23231f] [--mq-icon:#23231f] [--mq-ring:#171817]",
        ].join(" "),
        // Polymorphic: no ornament to speak of. It adapts instead — the palette
        // follows the color scheme. Flipping on `prefers-color-scheme` is safe
        // here because the track is opaque and its caption flips with it.
        adaptive: [
          "[--mq-track-off:#e3e1db] [--mq-track-on:#171817]",
          "[--mq-track-brd:rgba(23,24,23,0.18)]",
          "[--mq-thumb-bg:#ffffff] [--mq-thumb-brd:rgba(23,24,23,0.18)]",
          "[--mq-on-text:#f6f5f1] [--mq-off-text:#2b2b26] [--mq-icon:#171817] [--mq-ring:#171817]",
          "dark:[--mq-track-off:#3a3a40] dark:[--mq-track-on:#f1efe9]",
          "dark:[--mq-track-brd:rgba(255,255,255,0.22)]",
          "dark:[--mq-thumb-bg:#f1efe9] dark:[--mq-thumb-brd:rgba(255,255,255,0.28)]",
          "dark:[--mq-on-text:#171817] dark:[--mq-off-text:#e6e4de] dark:[--mq-ring:#f1efe9]",
          // In dark mode the checked track is near-white, so a near-white thumb
          // would vanish into it. The thumb inverts with the state.
          "dark:data-[state=checked]:[--mq-thumb-bg:#171817]",
          "dark:data-[state=checked]:[--mq-thumb-brd:rgba(0,0,0,0.5)]",
          // …and the glyph inside it has to invert with it.
          "dark:data-[state=checked]:[--mq-icon:#f1efe9]",
        ].join(" "),
      },
      variant: {
        default: "",
        labeled: "",
        icon: "",
      },
      size: {
        sm: "[--mq-track-w:36px] [--mq-track-h:20px] [--mq-thumb:14px] [--mq-pad:3px]",
        md: "[--mq-track-w:46px] [--mq-track-h:26px] [--mq-thumb:20px] [--mq-pad:3px]",
        lg: "[--mq-track-w:58px] [--mq-track-h:32px] [--mq-thumb:26px] [--mq-pad:3px]",
      },
    },
    compoundVariants: [
      // `labeled` only widens the track; `--mq-travel` recomputes itself.
      { variant: "labeled", size: "sm", class: "[--mq-track-w:56px]" },
      { variant: "labeled", size: "md", class: "[--mq-track-w:70px]" },
      { variant: "labeled", size: "lg", class: "[--mq-track-w:86px]" },
    ],
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

/** The track: fixed geometry, fill swapped by `data-state`. */
const TRACK = [
  "relative inline-flex shrink-0 items-center overflow-hidden rounded-full border",
  "w-[var(--mq-track-w,46px)] h-[var(--mq-track-h,26px)] p-[var(--mq-pad,3px)]",
  "border-[var(--mq-track-brd,rgba(120,60,40,0.20))]",
  "bg-[var(--mq-track-off,#e7d9cc)]",
  "data-[state=checked]:bg-[var(--mq-track-on,#ff9077)]",
  "shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)]",
  "transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
  // Forced colors discards the fills, so the track would become an empty
  // outline. System colors keep it a legible container.
  "forced-colors:border-[CanvasText] forced-colors:bg-[ButtonFace]",
].join(" ");

/** The thumb: travels by exactly `--mq-travel` when checked. */
const THUMB = [
  "pointer-events-none z-10 grid place-items-center rounded-full border",
  "size-[var(--mq-thumb,20px)]",
  "border-[var(--mq-thumb-brd,rgba(120,60,40,0.22))] bg-[var(--mq-thumb-bg,#fffaf6)]",
  "shadow-[0_2px_4px_rgba(40,25,18,0.28)]",
  "translate-x-0 data-[state=checked]:translate-x-[var(--mq-travel,20px)]",
  // `translate`, not `transform`: Tailwind v4's translate utilities write the
  // standalone `translate` property, so transitioning `transform` animates
  // nothing and the thumb teleports across the track.
  "transition-[translate,background-color,border-color] duration-200 ease-out",
  "motion-reduce:transition-none",
  "forced-colors:bg-[ButtonText] forced-colors:border-[ButtonText]",
].join(" ");

/**
 * ON/OFF captions for the `labeled` variant.
 *
 * `aria-hidden` on purpose: `role="switch"` + `aria-checked` already convey the
 * state, and exposing the caption too would announce it twice, in conflict with
 * the control's own accessible name.
 */
const CAPTION = [
  "pointer-events-none absolute inset-y-0 grid place-items-center",
  "text-[length:9px] leading-[1] font-extrabold tracking-[0.08em] uppercase",
  "transition-opacity duration-150 motion-reduce:transition-none",
].join(" ");

export type ToggleProps = Omit<
  React.ComponentPropsWithRef<"button">,
  "color" | "onChange" | "value" | "type"
> &
  VariantProps<typeof toggleVariants> & {
    /** Controlled state. Leave undefined to let the switch own its state. */
    checked?: boolean;
    /** Initial state when uncontrolled. */
    defaultChecked?: boolean;
    /** Fires with the next state on every activation. */
    onCheckedChange?: (checked: boolean) => void;
    /** Marks the switch busy: sets `aria-busy` and blocks activation. */
    loading?: boolean;
    /** Caption shown over the checked track in the `labeled` variant. */
    onLabel?: string;
    /** Caption shown over the unchecked track in the `labeled` variant. */
    offLabel?: string;
  };

/**
 * Glyphs use `--mq-icon`, not the track colour: the glyph sits on the *thumb*,
 * so it has to contrast with that. Painting it in the checked-track colour
 * measured 2.13:1 on clay and 1.43:1 on skeuo, both under the 3:1 that
 * WCAG 1.4.11 asks of non-text graphics.
 */
function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[62%]"
      fill="none"
      stroke="var(--mq-icon,#4a1d13)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3.5"
      viewBox="0 0 24 24"
    >
      <path d="M5 13l4.5 4.5L19 7" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[54%]"
      fill="none"
      stroke="var(--mq-icon,#4a1d13)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3.5"
      viewBox="0 0 24 24"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function Toggle({
  checked,
  children,
  className,
  defaultChecked = false,
  disabled = false,
  loading = false,
  material,
  offLabel = "OFF",
  onCheckedChange,
  onClick,
  onLabel = "ON",
  size,
  variant,
  ...props
}: ToggleProps) {
  const isControlled = checked !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(defaultChecked);
  const isOn = isControlled ? checked : uncontrolled;
  const isBlocked = disabled || loading;
  const state = isOn ? "checked" : "unchecked";

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (isBlocked) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!isControlled) setUncontrolled((current) => !current);
    onCheckedChange?.(!isOn);
    onClick?.(event);
  }

  return (
    // A native <button> is the element on purpose: it already answers to both
    // Space and Enter, and it is in the tab order and hit-testable for free.
    // `role="switch"` narrows its semantics; `aria-checked` carries the state.
    //
    // `props` is spread first so the state and accessibility attributes below
    // win over anything a caller passes through.
    <button
      {...props}
      aria-busy={loading || undefined}
      aria-checked={isOn}
      className={cn(toggleVariants({ material, variant, size }), className)}
      data-material={material ?? "clay"}
      data-state={state}
      data-state-flag={disabled ? "disabled" : loading ? "loading" : "idle"}
      disabled={disabled}
      onClick={handleClick}
      role="switch"
      type="button"
    >
      <span className={TRACK} data-state={state}>
        {variant === "labeled" ? (
          <>
            <span
              aria-hidden="true"
              className={cn(
                CAPTION,
                "left-0 w-[calc(var(--mq-track-w,46px)_-_var(--mq-thumb,20px))]",
                "text-[color:var(--mq-on-text,#4a1d13)]",
                "opacity-0 data-[state=checked]:opacity-100",
              )}
              data-state={state}
            >
              {onLabel}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                CAPTION,
                "right-0 w-[calc(var(--mq-track-w,46px)_-_var(--mq-thumb,20px))]",
                "text-[color:var(--mq-off-text,#463a2e)]",
                "opacity-100 data-[state=checked]:opacity-0",
              )}
              data-state={state}
            >
              {offLabel}
            </span>
          </>
        ) : null}
        <span className={THUMB} data-state={state}>
          {variant === "icon" ? (isOn ? <CheckIcon /> : <CrossIcon />) : null}
        </span>
      </span>
      {children}
    </button>
  );
}

export { toggleVariants };
