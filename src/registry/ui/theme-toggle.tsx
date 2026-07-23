"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Theme Toggle
 *
 * A light/dark switch rendered as a single native `<button role="switch">`. A
 * raised thumb slides across a recessed track; on the thumb a sun and a moon
 * icon crossfade (opacity + rotate) so the STATE is marked by icon SHAPE, never
 * by colour alone. The control keeps its state in memory (uncontrolled
 * `defaultChecked`) or under the caller's control (`checked` + `onCheckedChange`)
 * — it never writes localStorage and never mutates the document, so it is safe
 * to render statically.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The thumb reuses Button's PRIMARY-intent token
 * values and the same per-material press physics (a resting raised shadow that
 * SINKS into a pressed inset well); the track is the recessed counterpart.
 *
 *   <ThemeToggle
 *     material="clay"
 *     size="md"
 *     defaultChecked={false}
 *     onCheckedChange={(dark) => applyTheme(dark)}
 *   />
 *
 * Keyboard: it is a real button, so Enter/Space toggle it natively. Focus shows
 * a 2px offset ring on `:focus-visible` (and a parallel `data-focus` hook for
 * docs) that is never removed with `outline-none`.
 *
 * Local theming knobs (override from a parent or `className` to retheme without
 * forking the recipe — each is read with a literal fallback):
 *
 *   --mq-track / --mq-track-on / --mq-track-brd   off + on track fill, border
 *   --mq-body / --mq-lit / --mq-edge              thumb surface, highlight, edge
 *   --mq-text / --mq-brd / --mq-ring              glyph, thumb border, focus ring
 *   --mq-thumb / --mq-travel / --mq-icon          thumb size, slide distance, glyph size
 */

type Material = "clay" | "glass" | "skeuo" | "adaptive";
type ThemeToggleSize = "sm" | "md" | "lg";
type ThemeToggleVariant = "default";

/**
 * Palette per material. Declared once on the switch root; the track paints from
 * it directly and the thumb + glyphs inherit it through CSS. The thumb values
 * are Button's PRIMARY intent verbatim, so the glyph contrast contract is
 * inherited too (>= 4.5:1 on every material). `adaptive` additionally flips on
 * `prefers-color-scheme` because it names only opaque surfaces that flip
 * together with the glyphs on them. Read at runtime via `MATERIAL_TOKENS[material]`.
 */
const MATERIAL_TOKENS: Record<Material, string> = {
  clay: [
    "[--mq-track:#efe7db] [--mq-track-on:#7a2f1e] [--mq-track-brd:rgba(120,40,25,0.18)]",
    "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-track:rgba(255,255,255,0.45)] [--mq-track-on:rgba(23,24,23,0.55)] [--mq-track-brd:rgba(255,255,255,0.6)]",
    // An opaque-enough thumb so the white glyph keeps its measured >= 4.5:1
    // contrast however dark or light the backdrop behind the switch reads.
    "[--mq-body:rgba(23,24,23,0.84)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.4)] [--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-track:#d8d4c8] [--mq-track-on:#26251f] [--mq-track-brd:rgba(25,25,23,0.30)]",
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  adaptive: [
    "[--mq-track:#e6e3dd] [--mq-track-on:#2b2b30] [--mq-track-brd:rgba(23,24,23,0.16)]",
    "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
    "dark:[--mq-track:#26262a] dark:[--mq-track-on:#4a4a52] dark:[--mq-track-brd:rgba(255,255,255,0.18)]",
    "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
  ].join(" "),
};

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so the docs surface can render the focused look
 * without synthesising a keyboard event. The width/offset/colour together fully
 * replace the UA outline, so it is never reset with `outline-none`.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Recessed track base shared by every material. `translate`, not `transform`:
 * Tailwind v4 writes its `translate-*`/`brightness` utilities to standalone
 * `translate` / `filter`, so the transition names them explicitly — and
 * `background-color` because the fill crossfades between the off and on tokens
 * as the switch flips. Every listed property is one some state actually changes.
 */
const TRACK_BASE = cn(
  "group/switch relative inline-flex shrink-0 select-none items-center align-middle",
  "rounded-full border cursor-pointer appearance-none",
  "bg-[var(--mq-track,#efe7db)] border-[var(--mq-track-brd,rgba(120,40,25,0.18))]",
  "data-[checked=true]:bg-[var(--mq-track-on,#7a2f1e)]",
  "transition-[translate,box-shadow,background-color,backdrop-filter,filter,opacity] duration-200 ease-out",
  "motion-reduce:transition-none",
  FOCUS_RING,
  // Fills, washes and shadows are discarded in forced colours; a real border
  // keeps the switch's bounds on a system Canvas.
  "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]",
  "forced-colors:[background-image:none] forced-colors:shadow-none",
  // The disabled look is driven by the native attribute; press travel is
  // cancelled but the resting bounds stay.
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0 disabled:shadow-none",
);

/**
 * The four track recipes: a recessed well per material whose depth grows on
 * hover and deepens on `:active`. `motion-reduce` (on the base) drops the
 * travel, but `:active` still applies the deeper inset instantly, so the
 * tactile feedback survives even without animation.
 */
const MATERIAL_TRACK: Record<Material, string> = {
  clay: [
    "shadow-[inset_0_2px_4px_rgba(120,40,25,0.22),inset_0_-1px_0_rgba(255,255,255,0.55)]",
    "hover:shadow-[inset_0_2px_5px_rgba(120,40,25,0.26),inset_0_-1px_0_rgba(255,255,255,0.6),0_2px_10px_rgba(75,40,31,0.12)]",
    "active:translate-y-[1px] active:shadow-[inset_0_3px_7px_rgba(120,40,25,0.32)]",
  ].join(" "),
  glass: [
    "backdrop-blur-[10px] backdrop-saturate-[150%]",
    "shadow-[inset_0_1px_2px_rgba(24,20,40,0.18),inset_0_-1px_0_rgba(255,255,255,0.4)]",
    "hover:backdrop-blur-[14px] hover:shadow-[inset_0_1px_3px_rgba(24,20,40,0.22),inset_0_-1px_0_rgba(255,255,255,0.5)]",
    "active:translate-y-[1px] active:shadow-[inset_0_2px_5px_rgba(24,20,40,0.3)]",
    "forced-colors:[backdrop-filter:none]",
  ].join(" "),
  skeuo: [
    "shadow-[inset_0_2px_4px_rgba(0,0,0,0.42),inset_0_-1px_0_rgba(255,255,255,0.12)]",
    "hover:brightness-[1.04]",
    "active:translate-y-[1px] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.5)]",
  ].join(" "),
  adaptive: [
    "shadow-[inset_0_1px_3px_rgba(20,20,18,0.16)]",
    "hover:shadow-[inset_0_1px_4px_rgba(20,20,18,0.2)]",
    "active:translate-y-[1px] active:shadow-[inset_0_2px_5px_rgba(20,20,18,0.24)]",
    "dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]",
    "dark:hover:shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)]",
  ].join(" "),
};

/**
 * Raised thumb base. Its horizontal position is the only thing that moves — a
 * `translate-x` driven by the switch's `data-checked` — so the transition names
 * `translate` (the standalone property Tailwind writes) plus `box-shadow` for
 * the pressed sink. The resting end-state of that slide IS the open position, so
 * `motion-reduce:animate-none`/`transition-none` still lands the thumb correctly.
 */
const THUMB_BASE = cn(
  "pointer-events-none relative z-10 grid place-items-center shrink-0 rounded-full",
  "size-[var(--mq-thumb,28px)]",
  "translate-x-0 group-data-[checked=true]/switch:translate-x-[var(--mq-travel,28px)]",
  "transition-[translate,box-shadow] duration-200 ease-out motion-reduce:transition-none",
  // Discarded in forced colours; the thumb becomes a solid system mark so its
  // position (and thus the state) stays visible without any fill or shadow.
  "forced-colors:bg-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  "forced-colors:[background-image:none] forced-colors:[backdrop-filter:none]",
);

/**
 * The four thumb recipes, PRIMARY-intent values inlined. Each rests raised and
 * SINKS (shadow collapses) while the switch is pressed via `group-active`.
 */
const MATERIAL_THUMB: Record<Material, string> = {
  clay: [
    "border bg-[var(--mq-body,#ff9077)] border-[var(--mq-brd,rgba(120,40,25,0.16))]",
    "shadow-[inset_0_2px_2px_rgba(255,255,255,0.6),inset_0_-2px_3px_rgba(120,40,25,0.2),0_2px_0_var(--mq-edge,#c9482f),0_4px_8px_rgba(75,40,31,0.28)]",
    "group-active/switch:shadow-[inset_0_2px_3px_rgba(120,40,25,0.28),0_1px_0_var(--mq-edge,#c9482f)]",
  ].join(" "),
  glass: [
    "border bg-[var(--mq-body,rgba(23,24,23,0.84))] border-[var(--mq-brd,rgba(255,255,255,0.4))]",
    "backdrop-blur-[6px]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_2px_6px_rgba(24,20,40,0.3)]",
    "group-active/switch:shadow-[inset_0_1px_3px_rgba(24,20,40,0.35)]",
  ].join(" "),
  skeuo: [
    "border bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] border-[var(--mq-brd,rgba(0,0,0,0.5))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_0_var(--mq-edge,#131311),0_4px_7px_rgba(38,36,31,0.32)]",
    "group-active/switch:shadow-[inset_0_2px_4px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
  ].join(" "),
  adaptive: [
    "border bg-[var(--mq-body,#171817)] border-[var(--mq-brd,rgba(0,0,0,0.4))]",
    "shadow-[0_2px_5px_rgba(20,20,18,0.28)]",
    "group-active/switch:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
    "dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]",
  ].join(" "),
};

const trackVariants = cva(TRACK_BASE, {
  variants: {
    material: MATERIAL_TRACK,
    size: {
      sm: "h-[30px] w-[54px] px-[3px] [--mq-thumb:24px] [--mq-travel:24px] [--mq-icon:15px]",
      md: "h-[36px] w-[64px] px-[4px] [--mq-thumb:28px] [--mq-travel:28px] [--mq-icon:17px]",
      lg: "h-[42px] w-[76px] px-[4px] [--mq-thumb:34px] [--mq-travel:34px] [--mq-icon:20px]",
    },
  },
  defaultVariants: { material: "clay", size: "md" },
});

const thumbVariants = cva(THUMB_BASE, {
  variants: { material: MATERIAL_THUMB },
  defaultVariants: { material: "clay" },
});

/**
 * The two glyphs crossfade in place. `rotate`, not `transform`: Tailwind v4
 * writes `rotate-*` to the standalone `rotate` property, so the transition names
 * `[opacity,rotate]` — naming `transform` would animate nothing and the swap
 * would snap. Both glyphs use `--mq-text`, the thumb's measured foreground, so
 * whichever is visible keeps >= 4.5:1 on its surface.
 */
const ICON_BASE = cn(
  "pointer-events-none absolute inset-0 size-full",
  "text-[color:var(--mq-text,#4a1d13)] forced-colors:text-[Canvas]",
  "transition-[opacity,rotate] duration-300 ease-out motion-reduce:transition-none",
);
const SUN_GLYPH = cn(
  ICON_BASE,
  "rotate-0 opacity-100",
  "group-data-[checked=true]/switch:opacity-0 group-data-[checked=true]/switch:rotate-90",
);
const MOON_GLYPH = cn(
  ICON_BASE,
  "-rotate-90 opacity-0",
  "group-data-[checked=true]/switch:rotate-0 group-data-[checked=true]/switch:opacity-100",
);

/** Visually hidden but exposed to assistive tech — self-contained, no global class. */
const SR_ONLY =
  "absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]";

type ThemeToggleOwnProps = {
  /** Controlled dark-mode state. Omit to run uncontrolled. */
  checked?: boolean;
  /** Initial dark-mode state when uncontrolled. */
  defaultChecked?: boolean;
  /** Fired with the next dark-mode state on each toggle. */
  onCheckedChange?: (checked: boolean) => void;
  material?: Material;
  size?: ThemeToggleSize;
  /** Single presentation variant; reserved for future tone axes. */
  variant?: ThemeToggleVariant;
};

/**
 * `Omit` the own props (and the attributes this component owns outright) off the
 * native button props so the rest — `className`, `disabled`, `ref`, `data-*`,
 * `aria-label` — spread straight onto the `<button>`.
 */
export type ThemeToggleProps = ThemeToggleOwnProps &
  Omit<
    React.ComponentPropsWithRef<"button">,
    keyof ThemeToggleOwnProps | "type" | "role" | "aria-checked" | "onClick" | "onChange"
  >;

export function ThemeToggle({
  checked,
  defaultChecked = false,
  onCheckedChange,
  material = "clay",
  size = "md",
  variant = "default",
  disabled = false,
  className,
  "aria-label": ariaLabel = "Dark mode",
  ...rest
}: ThemeToggleProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const isDark = isControlled ? checked : internal;

  // Mounted empty so the polite live region exists in the DOM before any text
  // arrives; the initial mount is silent and only user toggles are announced.
  const [message, setMessage] = React.useState("");

  function handleToggle() {
    if (disabled) return;
    const next = !isDark;
    if (!isControlled) setInternal(next);
    setMessage(next ? "Dark mode on" : "Dark mode off");
    onCheckedChange?.(next);
  }

  return (
    <>
      <button
        {...rest}
        aria-checked={isDark}
        aria-label={ariaLabel}
        className={cn(trackVariants({ material, size }), MATERIAL_TOKENS[material], className)}
        data-checked={isDark ? "true" : "false"}
        data-material={material}
        data-variant={variant}
        disabled={disabled}
        onClick={handleToggle}
        role="switch"
        type="button"
      >
        <span className={cn(thumbVariants({ material }))}>
          <span className="pointer-events-none relative block size-[var(--mq-icon,17px)]">
            <Sun aria-hidden="true" className={SUN_GLYPH} strokeWidth={2} />
            <Moon aria-hidden="true" className={MOON_GLYPH} strokeWidth={2} />
          </span>
        </span>
      </button>
      <span aria-live="polite" className={SR_ONLY}>
        {message}
      </span>
    </>
  );
}

export type ThemeToggleVariantProps = VariantProps<typeof trackVariants>;

export { trackVariants, thumbVariants };
