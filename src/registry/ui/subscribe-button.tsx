"use client";

import * as React from "react";
import { Bell, BellRing, Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Subscribe Button
 *
 * A single native `<button>` that toggles between "Subscribe" and "Subscribed".
 * It is uncontrolled by default (owns its own state) and fully controllable via
 * `subscribed` + `onSubscribedChange`. The subscribed state is never carried by
 * colour alone: the visible LABEL changes ("Subscribe" -> "Subscribed"), the
 * leading glyph swaps Bell -> BellRing, a trailing Check confirmation appears,
 * `aria-pressed` reflects the state, and an `aria-live="polite"` region announces
 * "Subscribed" / "Unsubscribed" the moment it flips. The surface itself SETTLES
 * from a prominent, extruded call-to-action into a calmer, flatter material.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The token values are Button's measured primary
 * (call-to-action) and secondary (settled) intents, so the >= 4.5:1 label
 * contract is inherited on every material and in both states.
 *
 *   <SubscribeButton material="clay" size="md" onSubscribedChange={setBell} />
 *
 * Keyboard: it is a real `<button>`, so Enter/Space toggle it natively. Focus is
 * shown with a 2px offset ring on `:focus-visible` (and a parallel
 * `data-focus="true"` hook the docs surface can force) and is never removed.
 *
 * Local theming knobs (override from a parent or `className` — each read with a
 * literal fallback):
 *
 *   --mq-body / --mq-lit / --mq-edge         CTA surface, top highlight, edge
 *   --mq-text / --mq-brd / --mq-ring         CTA label, border, focus ring
 *   --mq-body-set / --mq-lit-set / --mq-edge-set   settled surface + edge
 *   --mq-text-set / --mq-brd-set             settled label + border
 */

type SubscribeMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type SubscribeSize = "sm" | "md" | "lg";
type SubscribeVariant = "default";

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so the docs surface can render the focused look
 * without synthesising a keyboard event. Width/offset/colour together fully
 * replace the UA outline, so it is never reset with `outline-none`. Raised to
 * `z-10` (the base sets `isolate`) so the ring is never clipped by a neighbour.
 */
const FOCUS_RING =
  "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:z-10 data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Shared surface chrome. `translate`, not `transform`: Tailwind v4 writes its
 * `translate-*` / hover-lift utilities to the standalone `translate` property,
 * so the transition names `translate` explicitly. `filter` covers skeuo's hover
 * brightness, `backdrop-filter` glass's hover blur, and `background-color` +
 * `color` the CTA -> settled toggle. Every property listed is one some state
 * actually changes; none is phantom.
 */
const SURFACE_BASE = [
  "relative isolate inline-flex shrink-0 select-none items-center justify-center",
  "border font-extrabold tracking-[-0.01em] cursor-pointer appearance-none",
  "transition-[translate,box-shadow,background-color,color,backdrop-filter,filter,opacity] duration-200 ease-out",
  "motion-reduce:transition-none",
  FOCUS_RING,
  "forced-colors:border-[CanvasText]",
  // Native `disabled` drives the faded look; press travel is cancelled but the
  // resting bounds stay.
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0 disabled:shadow-none",
].join(" ");

/**
 * Per-material palette. Two token sets each: the unsubscribed CTA (`--mq-*`,
 * Button's PRIMARY intent) and the settled subscribed surface (`--mq-*-set`,
 * Button's SECONDARY intent). `adaptive` additionally flips both sets on
 * `prefers-color-scheme` because it names only opaque surfaces.
 */
const MATERIAL_TOKENS: Record<SubscribeMaterial, string> = {
  clay:
    "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817] " +
    "[--mq-body-set:#efe7db] [--mq-edge-set:#c0b3a1] [--mq-text-set:#2c2721] [--mq-brd-set:rgba(70,55,40,0.18)]",
  glass:
    "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817] " +
    "[--mq-body-set:rgba(255,255,255,0.72)] [--mq-text-set:#23231f] [--mq-brd-set:rgba(255,255,255,0.78)]",
  skeuo:
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817] " +
    "[--mq-lit-set:#f4f2ec] [--mq-body-set:#cbc7bd] [--mq-edge-set:#98948c] [--mq-text-set:#23231f] [--mq-brd-set:rgba(25,25,23,0.3)]",
  adaptive:
    "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817] " +
    "[--mq-body-set:#ffffff] [--mq-text-set:#23231f] [--mq-brd-set:rgba(23,24,23,0.18)] " +
    "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9] " +
    "dark:[--mq-body-set:#26262a] dark:[--mq-text-set:#f1efe9] dark:[--mq-brd-set:rgba(255,255,255,0.18)]",
};

/**
 * Unsubscribed = the CTA surface (Button's primary press physics: resting
 * shadow, a hover lift via `-translate-y`, an active SINK into a pressed inset
 * well). `motion-reduce` on the base drops the travel, but `:active` still
 * applies the inset instantly so the tactile feedback survives.
 */
const MATERIAL_ACTIVE: Record<SubscribeMaterial, string> = {
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
    "forced-colors:[background-image:none]",
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

/**
 * Subscribed = the settled surface (Button's secondary tokens). The extruded
 * edge shrinks and the elevation drops, so the control visibly "sits down" once
 * the deed is done. Same hover/active grammar, gentler travel.
 */
const MATERIAL_SETTLED: Record<SubscribeMaterial, string> = {
  clay: [
    "bg-[var(--mq-body-set,#efe7db)] text-[var(--mq-text-set,#2c2721)] border-[var(--mq-brd-set,rgba(70,55,40,0.18))]",
    "shadow-[inset_0_2px_2px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(70,55,40,0.14),0_2px_0_var(--mq-edge-set,#c0b3a1),0_5px_12px_rgba(75,40,31,0.12)]",
    "hover:-translate-y-[1px]",
    "hover:shadow-[inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2px_4px_rgba(70,55,40,0.14),0_3px_0_var(--mq-edge-set,#c0b3a1),0_8px_16px_rgba(75,40,31,0.14)]",
    "active:translate-y-[2px]",
    "active:shadow-[inset_0_2px_5px_rgba(70,55,40,0.22),0_1px_0_var(--mq-edge-set,#c0b3a1)]",
  ].join(" "),
  glass: [
    "bg-[var(--mq-body-set,rgba(255,255,255,0.72))] text-[var(--mq-text-set,#23231f)] border-[var(--mq-brd-set,rgba(255,255,255,0.78))]",
    "backdrop-blur-[14px] backdrop-saturate-[160%]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_16px_rgba(24,20,40,0.12)]",
    "hover:-translate-y-[1px]",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_9px_22px_rgba(24,20,40,0.16)]",
    "active:translate-y-[1px]",
    "active:shadow-[inset_0_2px_6px_rgba(24,20,40,0.22)]",
    "forced-colors:[backdrop-filter:none]",
  ].join(" "),
  skeuo: [
    "bg-[linear-gradient(180deg,var(--mq-lit-set,#f4f2ec),var(--mq-body-set,#cbc7bd))] text-[var(--mq-text-set,#23231f)] border-[var(--mq-brd-set,rgba(25,25,23,0.3))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-2px_3px_rgba(0,0,0,0.18),0_2px_0_var(--mq-edge-set,#98948c),0_6px_12px_rgba(38,36,31,0.18)]",
    "hover:-translate-y-[1px] hover:brightness-[1.03]",
    "active:translate-y-[2px]",
    "active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.28),0_1px_0_var(--mq-edge-set,#98948c)]",
    "forced-colors:[background-image:none]",
  ].join(" "),
  adaptive: [
    "bg-[var(--mq-body-set,#ffffff)] text-[var(--mq-text-set,#23231f)] border-[var(--mq-brd-set,rgba(23,24,23,0.18))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(20,20,18,0.1)]",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_10px_rgba(20,20,18,0.14)]",
    "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.16)]",
    "pointer-coarse:min-h-[48px]",
  ].join(" "),
};

const subscribeButtonVariants = cva(SURFACE_BASE, {
  variants: {
    material: MATERIAL_TOKENS,
    tone: { active: "", settled: "" },
    size: {
      sm: "h-[36px] gap-[6px] rounded-[12px] px-[14px] text-[12px]/[1]",
      md: "h-[44px] gap-[8px] rounded-[15px] px-[20px] text-[13px]/[1]",
      lg: "h-[52px] gap-[10px] rounded-[18px] px-[26px] text-[14px]/[1]",
    },
  },
  compoundVariants: [
    { material: "clay", tone: "active", class: MATERIAL_ACTIVE.clay },
    { material: "clay", tone: "settled", class: MATERIAL_SETTLED.clay },
    { material: "glass", tone: "active", class: MATERIAL_ACTIVE.glass },
    { material: "glass", tone: "settled", class: MATERIAL_SETTLED.glass },
    { material: "skeuo", tone: "active", class: MATERIAL_ACTIVE.skeuo },
    { material: "skeuo", tone: "settled", class: MATERIAL_SETTLED.skeuo },
    { material: "adaptive", tone: "active", class: MATERIAL_ACTIVE.adaptive },
    { material: "adaptive", tone: "settled", class: MATERIAL_SETTLED.adaptive },
  ],
  defaultVariants: { material: "clay", tone: "active", size: "md" },
});

/**
 * Settle keyframe, shipped with the component instead of a global sheet. React
 * 19 hoists this `<style>` and dedupes it by `href`, so a page with many
 * subscribe buttons emits one rule. The keyframe's RESTING end-state is the
 * icon's natural `scale:1;opacity:1`, so `motion-reduce:animate-none` leaves the
 * BellRing and the Check fully settled — only the brief pop is dropped.
 */
const SETTLE_KEYFRAMES = `
@keyframes mq-subscribe-settle{0%{scale:0.55;opacity:0}58%{scale:1.14;opacity:1}100%{scale:1;opacity:1}}`;

function SettleKeyframes() {
  return (
    <style href="mq-subscribe-button" precedence="medium">
      {SETTLE_KEYFRAMES}
    </style>
  );
}

const ICON_BASE = "size-[1.05em] shrink-0 forced-colors:text-[CanvasText]";
// Applied only to the subscribed glyphs, and only after a real user toggle, so
// the pop never fires on first paint of an already-subscribed control.
const SETTLE_ANIM =
  "animate-[mq-subscribe-settle_320ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none";

type SubscribeButtonOwnProps = {
  material?: SubscribeMaterial;
  size?: SubscribeSize;
  /** Single presentation variant; reserved for future tone axes. */
  variant?: SubscribeVariant;
  /** Controlled subscribed value. Omit for the uncontrolled default. */
  subscribed?: boolean;
  /** Uncontrolled initial value. Ignored once `subscribed` is provided. */
  defaultSubscribed?: boolean;
  /** Fires with the next value on every toggle (controlled or not). */
  onSubscribedChange?: (next: boolean) => void;
  /** Visible label while not subscribed. */
  subscribeLabel?: string;
  /** Visible label while subscribed. */
  subscribedLabel?: string;
  /** Live-region text announced on subscribe. */
  subscribeAnnouncement?: string;
  /** Live-region text announced on unsubscribe. */
  unsubscribeAnnouncement?: string;
};

/**
 * `Omit` the own props (plus `type`/`children`, which the component owns) off the
 * native button props so the rest — `disabled`, `data-*`, `aria-*`, `ref`,
 * `className` — spread straight onto the `<button>`.
 */
export type SubscribeButtonProps = SubscribeButtonOwnProps &
  Omit<React.ComponentPropsWithRef<"button">, keyof SubscribeButtonOwnProps | "type" | "children">;

export function SubscribeButton({
  className,
  defaultSubscribed = false,
  disabled = false,
  material = "clay",
  onClick,
  onSubscribedChange,
  size = "md",
  subscribeAnnouncement,
  subscribeLabel = "Subscribe",
  subscribedLabel = "Subscribed",
  subscribed,
  unsubscribeAnnouncement = "Unsubscribed",
  variant = "default",
  ...buttonProps
}: SubscribeButtonProps) {
  const isControlled = subscribed !== undefined;
  const [internal, setInternal] = React.useState(defaultSubscribed);
  const value = isControlled ? subscribed : internal;

  // Gate the settle pop on a real interaction so an initially-subscribed control
  // does not animate on first paint (and so SSR markup matches first client
  // render, where this is always `false`).
  const [pulse, setPulse] = React.useState(false);
  const [live, setLive] = React.useState("");

  const confirmSubscribed = subscribeAnnouncement ?? subscribedLabel;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const next = !value;
    if (!isControlled) setInternal(next);
    setPulse(true);
    setLive(next ? confirmSubscribed : unsubscribeAnnouncement);
    onSubscribedChange?.(next);
  }

  const tone = value ? "settled" : "active";
  const animate = pulse ? SETTLE_ANIM : "";

  return (
    <>
      <SettleKeyframes />
      <button
        {...buttonProps}
        aria-pressed={value}
        className={cn(subscribeButtonVariants({ material, tone, size }), className)}
        data-material={material}
        data-subscribed={value ? "true" : "false"}
        data-variant={variant}
        disabled={disabled}
        onClick={handleClick}
        type="button"
      >
        {value ? (
          <BellRing aria-hidden="true" className={cn(ICON_BASE, animate)} />
        ) : (
          <Bell aria-hidden="true" className={ICON_BASE} />
        )}
        <span>{value ? subscribedLabel : subscribeLabel}</span>
        {value ? <Check aria-hidden="true" className={cn(ICON_BASE, animate)} /> : null}
      </button>
      {/* In the DOM before any text arrives; kept out of the button so it never
          pollutes the button's accessible name. */}
      <span aria-atomic="true" aria-live="polite" className="sr-only">
        {live}
      </span>
    </>
  );
}

export type SubscribeButtonVariantProps = VariantProps<typeof subscribeButtonVariants>;

export { subscribeButtonVariants };
