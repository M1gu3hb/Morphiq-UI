"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Navbar
 *
 * A responsive top navigation bar: a brand slot, a horizontal row of links, an
 * optional call-to-action, and — below the bar's container breakpoint — a
 * hamburger toggle that discloses the same links (plus the CTA) in a stacked
 * panel dropped beneath the bar. The bar adapts to the width of ITS OWN
 * container (a `@container` query), not the viewport, so it flips to the mobile
 * layout inside any narrow column, card or split pane without a media query.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The one runtime dependency beyond React and `cn` is
 * lucide-react, for the Menu / X glyphs on the toggle.
 *
 *   <Navbar
 *     brand="Kiln"
 *     brandHref="/"
 *     items={[
 *       { id: "home", label: "Home", href: "/", current: true },
 *       { id: "work", label: "Work", href: "/work" },
 *     ]}
 *     cta={{ label: "Get started", href: "/signup" }}
 *     material="clay"
 *     size="md"
 *   />
 *
 * The mobile toggle is a real `<button aria-expanded aria-controls>`; the panel
 * it discloses is a plain (non-modal) region, so focus is NOT trapped — Escape
 * closes it and returns focus to the toggle, a pointer press outside closes it,
 * and Tab flows on through the page as usual. Every navigation item is a real
 * `<a href>` (a `<button>` when it carries no `href`), so the browser owns
 * keyboard activation, middle-click and open-in-new-tab. The active item is
 * marked with `aria-current="page"`, a heavier weight AND a reserved rule that
 * only colours when active — never by colour alone.
 *
 * Local theming knobs (each read with a literal fallback):
 *
 *   --mq-bar / --mq-bar-brd        bar surface + border
 *   --mq-bar-grad / --mq-bar-shadow bar wash + depth
 *   --mq-blur                      glass backdrop blur (0 elsewhere)
 *   --mq-ink / --mq-hover-bg       idle link label + hover wash
 *   --mq-active-text / --mq-accent active label + reserved-rule colour
 *   --mq-brand                     brand wordmark + toggle glyph
 *   --mq-cta / --mq-cta-edge       CTA surface + extruded edge (clay / skeuo)
 *   --mq-cta-grad / --mq-cta-shadow CTA wash + press physics
 *   --mq-cta-text                  CTA label
 *   --mq-panel / --mq-panel-brd    disclosed mobile panel surface + border
 *   --mq-ring                      focus ring
 */

/** Palette per material. Declared on the root nav; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-bar:#efe7db] [--mq-bar-brd:rgba(120,80,55,0.20)] [--mq-blur:0px]",
    // A bar that rides proud of the page: bright bloom on top, warm shade below,
    // a soft ambient cast. Warm brown ink throughout — clay never casts black.
    "[--mq-bar-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-1px_0_rgba(120,60,40,0.10),0_6px_16px_rgba(90,60,45,0.14)]",
    "[--mq-ink:#5b4a3c] [--mq-hover-bg:rgba(255,255,255,0.55)]",
    "[--mq-active-text:#4a1d13] [--mq-accent:#c9482f] [--mq-brand:#33261e]",
    // The CTA is Button's clay PRIMARY intent, inlined: coral slab on its own
    // side wall with a warm inset well.
    "[--mq-cta:#ff9077] [--mq-cta-edge:#c9482f] [--mq-cta-text:#4a1d13]",
    "[--mq-cta-grad:linear-gradient(180deg,rgba(255,255,255,0.45),rgba(151,92,58,0.05))]",
    "[--mq-cta-shadow:inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2px_3px_rgba(120,40,25,0.20),0_2px_0_var(--mq-cta-edge,#c9482f),0_6px_12px_rgba(75,40,31,0.20)]",
    "[--mq-panel:#f4ece0] [--mq-panel-brd:rgba(120,80,55,0.20)] [--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-bar:rgba(255,255,255,0.62)] [--mq-bar-brd:rgba(255,255,255,0.72)] [--mq-blur:18px]",
    "[--mq-bar-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo over a wide cool cast shadow. No side wall: glass has
    // no extrusion.
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_6px_18px_rgba(24,20,40,0.14)]",
    "[--mq-ink:#2f2f29] [--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-active-text:#1b1c1b] [--mq-accent:#171817] [--mq-brand:#1e1e1b]",
    // A dark translucent CTA so its white label stays legible however bright the
    // page behind the frosted bar reads.
    "[--mq-cta:rgba(23,24,23,0.82)] [--mq-cta-text:#ffffff]",
    "[--mq-cta-grad:linear-gradient(180deg,rgba(255,255,255,0.20),rgba(255,255,255,0))]",
    "[--mq-cta-shadow:inset_0_1px_0_rgba(255,255,255,0.35),0_8px_20px_rgba(24,20,40,0.22)]",
    "[--mq-panel:rgba(244,247,248,0.92)] [--mq-panel-brd:rgba(255,255,255,0.72)] [--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-bar:#cfcbc2] [--mq-bar-brd:rgba(25,25,23,0.32)] [--mq-blur:0px]",
    // The surface IS the gradient: lit over body, the moulded-plastic read.
    "[--mq-bar-grad:linear-gradient(180deg,#e0dcd3,#c4c0b7)]",
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-2px_3px_rgba(0,0,0,0.14),0_6px_14px_rgba(38,36,31,0.22)]",
    "[--mq-ink:#33322d] [--mq-hover-bg:rgba(255,255,255,0.40)]",
    "[--mq-active-text:#23231f] [--mq-accent:#3f3e39] [--mq-brand:#23231f]",
    // A dark machined CTA with a lit gradient face and a hard black side wall —
    // the warm greige #e6e3da family carries the disclosed panel.
    "[--mq-cta:#2a2a26] [--mq-cta-edge:#131311] [--mq-cta-text:#f6f4ee]",
    "[--mq-cta-grad:linear-gradient(180deg,#4a4a44,#2a2a26)]",
    "[--mq-cta-shadow:inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.30),0_2px_0_var(--mq-cta-edge,#131311),0_6px_12px_rgba(38,36,31,0.26)]",
    "[--mq-panel:#e6e3da] [--mq-panel-brd:rgba(25,25,23,0.30)] [--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme,
  // and both surfaces flip together with the labels on them.
  adaptive: [
    "[--mq-bar:#f5f4f0] [--mq-bar-brd:rgba(23,24,23,0.12)] [--mq-blur:0px]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-bar-grad:none]",
    "[--mq-bar-shadow:inset_0_0_0_rgba(20,20,18,0),0_4px_12px_rgba(20,20,18,0.08)]",
    "[--mq-ink:#55554e] [--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-active-text:#1c1c19] [--mq-accent:#1c1c19] [--mq-brand:#1c1c19]",
    "[--mq-cta:#171817] [--mq-cta-text:#f6f5f1] [--mq-cta-grad:none]",
    "[--mq-cta-shadow:0_2px_6px_rgba(20,20,18,0.16)]",
    "[--mq-panel:#ffffff] [--mq-panel-brd:rgba(23,24,23,0.12)] [--mq-ring:#171817]",
    "dark:[--mq-bar:#232327] dark:[--mq-bar-brd:rgba(255,255,255,0.14)]",
    "dark:[--mq-bar-shadow:inset_0_0_0_rgba(0,0,0,0),0_4px_12px_rgba(0,0,0,0.45)]",
    "dark:[--mq-ink:#b9b7b0] dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-active-text:#f1efe9] dark:[--mq-accent:#f1efe9] dark:[--mq-brand:#f1efe9]",
    "dark:[--mq-cta:#f1efe9] dark:[--mq-cta-text:#171817]",
    "dark:[--mq-cta-shadow:0_2px_6px_rgba(0,0,0,0.55)]",
    "dark:[--mq-panel:#1b1b1e] dark:[--mq-panel-brd:rgba(255,255,255,0.14)] dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type NavbarMaterial = keyof typeof MATERIAL_TOKENS;
type NavbarVariant = "default";
type NavbarSize = "sm" | "md" | "lg";

/**
 * Entrance keyframes for the disclosed panel and its rows, shipped with the
 * component rather than a global sheet. React 19 hoists this `<style>` and
 * dedupes it by `href`, so a page with several navbars emits one rule. Each
 * keyframe's resting end-state is the panel's / row's visible base style and the
 * fill is `backwards`, so under `animation:none` (motion-reduce below) the panel
 * still drops open and every link is still present — only the travel is dropped.
 */
const NAVBAR_KEYFRAMES = `
@keyframes mq-navbar-panel{from{opacity:0;translate:0 -8px}to{opacity:1;translate:0 0}}
@keyframes mq-navbar-item{from{opacity:0;translate:0 -6px}to{opacity:1;translate:0 0}}`;

function NavbarKeyframes() {
  return (
    <style href="mq-navbar" precedence="medium">
      {NAVBAR_KEYFRAMES}
    </style>
  );
}

/**
 * The bar itself. `@container/navbar` makes it the query context its own row
 * measures against, so the desktop/mobile swap keys off the bar's width, not the
 * viewport. `relative isolate` makes it the containing block and stacking root
 * for the absolutely positioned disclosed panel.
 */
const navVariants = cva(
  [
    "@container/navbar group/nav relative isolate w-full",
    "rounded-[var(--mq-bar-radius,16px)] border border-[var(--mq-bar-brd,rgba(120,80,55,0.20))]",
    "bg-[var(--mq-bar,#efe7db)] [background-image:var(--mq-bar-grad,none)]",
    "backdrop-blur-[var(--mq-blur,0px)]",
    "shadow-[var(--mq-bar-shadow,inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-1px_0_rgba(120,60,40,0.10),0_6px_16px_rgba(90,60,45,0.14))]",
    // Fills, washes, blur and shadows are discarded or meaningless once the OS
    // paints high-contrast, so clear the ornament by hand and keep a real border.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:shadow-none forced-colors:backdrop-blur-none",
  ].join(" "),
  {
    variants: {
      // One treatment today: a real axis so the registry, the docs switcher and a
      // future treatment all have a seam.
      variant: { default: "" },
      size: {
        sm: "[--mq-bar-radius:13px] [--mq-bar-h:52px] [--mq-bar-px:12px] [--mq-link-radius:8px] [--mq-cta-radius:10px]",
        md: "[--mq-bar-radius:16px] [--mq-bar-h:60px] [--mq-bar-px:16px] [--mq-link-radius:10px] [--mq-cta-radius:12px]",
        lg: "[--mq-bar-radius:20px] [--mq-bar-h:68px] [--mq-bar-px:20px] [--mq-link-radius:12px] [--mq-cta-radius:14px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** A desktop nav link. Idle wash on hover; the active state is a reserved rule. */
const linkVariants = cva(
  [
    "group/nl relative inline-flex shrink-0 items-center justify-center gap-[6px]",
    "whitespace-nowrap no-underline font-medium tracking-[-0.01em]",
    "rounded-[var(--mq-link-radius,10px)] text-[color:var(--mq-ink,#5b4a3c)]",
    // A bottom rule always reserved in the box model, transparent by default. It
    // is what forced-colors uses to mark the active item once fills are discarded,
    // so the marking never changes the box model or shifts the row.
    "border-0 border-b-2 border-b-transparent",
    // Exactly the properties that change across states: the hover/active wash and
    // the label. Weight changes instantly and is not animated.
    "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.55))] hover:text-[color:var(--mq-active-text,#4a1d13)]",
    // Active: heavier weight, its own colour AND the reserved rule — never colour
    // alone.
    "aria-[current=page]:font-bold aria-[current=page]:text-[color:var(--mq-active-text,#4a1d13)]",
    "aria-[current=page]:border-b-[var(--mq-accent,#c9482f)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:text-[CanvasText] forced-colors:aria-[current=page]:border-b-[CanvasText]",
    "forced-colors:focus-visible:outline-[Highlight]",
    "disabled:cursor-not-allowed disabled:opacity-45",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-[32px] px-[10px] text-[length:12px]",
        md: "h-[38px] px-[12px] text-[length:13px]",
        lg: "h-[44px] px-[14px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/**
 * The call-to-action. Its material recipe is Button's PRIMARY intent, inlined:
 * a hover LIFT and an active press, both on the standalone `translate` property.
 * `transition-[translate]` names exactly that — every property in the list is one
 * a state changes, and none is phantom.
 */
const ctaVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center gap-[6px]",
    "cursor-pointer appearance-none whitespace-nowrap no-underline",
    "rounded-[var(--mq-cta-radius,12px)] border border-transparent",
    "font-extrabold tracking-[-0.01em] text-[color:var(--mq-cta-text,#4a1d13)]",
    "bg-[var(--mq-cta,#ff9077)] [background-image:var(--mq-cta-grad,none)]",
    "shadow-[var(--mq-cta-shadow,inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2px_3px_rgba(120,40,25,0.20),0_2px_0_var(--mq-cta-edge,#c9482f),0_6px_12px_rgba(75,40,31,0.20))]",
    "transition-[translate] duration-200 ease-out motion-reduce:transition-none",
    "hover:-translate-y-[1px] active:translate-y-0",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    // Fills, washes and shadows are discarded in forced colours; the reserved
    // border keeps the bounds and a system-colour label keeps the text.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:shadow-none",
    "forced-colors:text-[CanvasText] forced-colors:focus-visible:outline-[Highlight]",
    "disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-[32px] px-[14px] text-[length:12px]",
        md: "h-[38px] px-[18px] text-[length:13px]",
        lg: "h-[44px] px-[22px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/**
 * A row in the disclosed mobile panel. Full-width, >= 44px high for a comfortable
 * touch target, with a reserved LEFT rule (mirroring the desktop bottom rule)
 * that colours only when active. Staggered in via `mq-navbar-item`.
 */
const mobileLinkClass = cn(
  "group/ml relative flex w-full items-center gap-[10px] min-h-[44px] rounded-[10px] px-[12px]",
  "cursor-pointer appearance-none border-0 bg-transparent text-left no-underline",
  "font-semibold tracking-[-0.01em] text-[length:15px] text-[color:var(--mq-ink,#5b4a3c)]",
  "border-l-[3px] border-l-transparent",
  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
  "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.55))] hover:text-[color:var(--mq-active-text,#4a1d13)]",
  "aria-[current=page]:font-extrabold aria-[current=page]:text-[color:var(--mq-active-text,#4a1d13)]",
  "aria-[current=page]:border-l-[var(--mq-accent,#c9482f)]",
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--mq-ring,#171817)]",
  "forced-colors:text-[CanvasText] forced-colors:aria-[current=page]:border-l-[CanvasText]",
  "forced-colors:focus-visible:outline-[Highlight]",
  "animate-[mq-navbar-item_260ms_cubic-bezier(0.16,1,0.3,1)_backwards] motion-reduce:animate-none",
);

/** The hamburger toggle: a subtle chip whose Menu / X glyphs cross-fade + turn. */
const toggleClass = cn(
  "group/tgl relative grid size-[44px] shrink-0 place-items-center @[38rem]/navbar:hidden",
  "cursor-pointer appearance-none rounded-[10px] border border-transparent bg-transparent",
  "text-[color:var(--mq-brand,#33261e)]",
  "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
  "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.55))]",
  "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
  "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText] forced-colors:focus-visible:outline-[Highlight]",
  "disabled:cursor-not-allowed disabled:opacity-55",
);

/**
 * Menu and X share one grid cell and swap on `data-open`. The state utilities
 * write the STANDALONE `rotate` property, so the transition names `[opacity,rotate]`
 * — a `transition-transform` written as an arbitrary `[transform]` would animate
 * nothing here and the glyph would snap.
 */
const glyphBase =
  "col-start-1 row-start-1 size-[20px] transition-[opacity,rotate] duration-200 " +
  "ease-out motion-reduce:transition-none forced-colors:text-[CanvasText]";

export type NavbarItem = {
  /** Stable identity; also the React list key. */
  id: string;
  label: React.ReactNode;
  /** When present the item renders as an anchor; otherwise a button. */
  href?: string;
  /** Optional leading icon (any node); rendered aria-hidden before the label. */
  icon?: React.ReactNode;
  /** Marks the current page. Sets `aria-current="page"` and the active look. */
  current?: boolean;
  /** Called when a link-less item is chosen. */
  onSelect?: () => void;
};

export type NavbarCta = {
  label: React.ReactNode;
  /** When present the CTA is an anchor; otherwise a button. */
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export type NavbarProps = Omit<
  React.ComponentPropsWithRef<"nav">,
  "children" | "onChange"
> & {
  items: readonly NavbarItem[];
  /** Brand / logo slot rendered at the bar's start. Any node. */
  brand?: React.ReactNode;
  /** When present the brand becomes a link (usually to home). */
  brandHref?: string;
  /** Optional call-to-action at the bar's end and the panel's foot. */
  cta?: NavbarCta;
  material?: NavbarMaterial;
  variant?: NavbarVariant;
  size?: NavbarSize;
  /** Accessible name for the hamburger toggle. */
  menuLabel?: string;
};

export function Navbar({
  "aria-label": ariaLabel = "Primary",
  brand = "Brand",
  brandHref,
  className,
  cta,
  items,
  material = "clay",
  menuLabel = "Menu",
  ref,
  size = "md",
  variant = "default",
  ...props
}: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();
  const rootRef = React.useRef<HTMLElement | null>(null);
  const toggleRef = React.useRef<HTMLButtonElement | null>(null);

  const toggle = React.useCallback(() => setOpen((value) => !value), []);

  // Escape closes and hands focus back to the toggle, which is always mounted.
  const closeAndFocusToggle = React.useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // A pointer press anywhere outside the bar dismisses the disclosed panel.
  // Registered only while open; the setState lives in the callback (not the
  // effect body), so it clears the react-hooks/set-state-in-effect rule.
  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      // Absorb the dismiss key so it does not also close an Escape-closable
      // ancestor the navbar might sit inside.
      event.stopPropagation();
      closeAndFocusToggle();
    }
  }

  const renderCta = (place: "bar" | "panel") => {
    if (!cta) return null;
    const classes = cn(ctaVariants({ size }), place === "panel" && "w-full");
    const inner = (
      <>
        {cta.icon != null ? (
          <span aria-hidden="true" className="inline-flex items-center [&_svg]:size-[1.1em]">
            {cta.icon}
          </span>
        ) : null}
        {cta.label}
      </>
    );
    // In the panel, choosing the CTA closes the disclosure first.
    const onClick =
      place === "panel"
        ? () => {
            cta.onClick?.();
            setOpen(false);
          }
        : cta.onClick;
    return cta.href != null && !cta.disabled ? (
      <a className={classes} href={cta.href} onClick={onClick}>
        {inner}
      </a>
    ) : (
      <button className={classes} disabled={cta.disabled} onClick={onClick} type="button">
        {inner}
      </button>
    );
  };

  const brandClass = cn(
    "inline-flex shrink-0 items-center gap-[8px] no-underline [&_svg]:size-[1.2em]",
    "rounded-[8px] font-extrabold tracking-[-0.02em] text-[color:var(--mq-brand,#33261e)]",
    size === "sm" ? "text-[length:14px]" : size === "lg" ? "text-[length:17px]" : "text-[length:15px]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "forced-colors:text-[CanvasText] forced-colors:focus-visible:outline-[Highlight]",
  );

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={cn(MATERIAL_TOKENS[material], navVariants({ size, variant }), className)}
      data-material={material}
      onKeyDown={handleKeyDown}
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
    >
      <NavbarKeyframes />
      <div className="flex items-center justify-between gap-[16px] h-[var(--mq-bar-h,60px)] px-[var(--mq-bar-px,16px)]">
        {/* Brand + desktop links share the start of the bar. */}
        <div className="flex min-w-0 items-center gap-[clamp(12px,3cqi,28px)]">
          {brandHref != null ? (
            <a className={brandClass} href={brandHref}>
              {brand}
            </a>
          ) : (
            <span className={brandClass}>{brand}</span>
          )}
          <ul className="m-0 hidden list-none items-center gap-[2px] p-0 @[38rem]/navbar:flex" role="list">
            {items.map((item) => {
              const shared = {
                className: linkVariants({ size }),
                "aria-current": item.current ? ("page" as const) : undefined,
              };
              const inner = (
                <>
                  {item.icon != null ? (
                    <span aria-hidden="true" className="inline-flex items-center [&_svg]:size-[1.1em]">
                      {item.icon}
                    </span>
                  ) : null}
                  {item.label}
                </>
              );
              return (
                <li className="list-none" key={item.id}>
                  {item.href != null ? (
                    <a {...shared} href={item.href}>
                      {inner}
                    </a>
                  ) : (
                    <button {...shared} onClick={item.onSelect} type="button">
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* CTA (desktop) + hamburger toggle (mobile) share the end of the bar. */}
        <div className="flex shrink-0 items-center gap-[8px]">
          {cta ? (
            <div className="hidden @[38rem]/navbar:block">{renderCta("bar")}</div>
          ) : null}
          <button
            aria-controls={open ? panelId : undefined}
            aria-expanded={open}
            aria-label={menuLabel}
            className={toggleClass}
            data-open={open ? "true" : "false"}
            onClick={toggle}
            ref={toggleRef}
            type="button"
          >
            <span aria-hidden="true" className="relative grid size-[20px] place-items-center">
              <Menu
                className={cn(
                  glyphBase,
                  "group-data-[open=true]/tgl:rotate-90 group-data-[open=true]/tgl:opacity-0",
                )}
              />
              <X
                className={cn(
                  glyphBase,
                  "rotate-[-90deg] opacity-0",
                  "group-data-[open=true]/tgl:rotate-0 group-data-[open=true]/tgl:opacity-100",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          className={cn(
            "absolute left-0 right-0 top-full z-50 mt-[8px] p-[10px] @[38rem]/navbar:hidden",
            "overflow-hidden rounded-[var(--mq-bar-radius,16px)] border border-[var(--mq-panel-brd,rgba(120,80,55,0.20))]",
            "bg-[var(--mq-panel,#f4ece0)] [background-image:var(--mq-bar-grad,none)] backdrop-blur-[var(--mq-blur,0px)]",
            "shadow-[var(--mq-bar-shadow,inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-1px_0_rgba(120,60,40,0.10),0_6px_16px_rgba(90,60,45,0.14))]",
            "animate-[mq-navbar-panel_240ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
            "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:[background-image:none]",
            "forced-colors:shadow-none forced-colors:backdrop-blur-none",
          )}
          id={panelId}
        >
          <ul className="m-0 flex list-none flex-col gap-[2px] p-0" role="list">
            {items.map((item, index) => {
              const ariaCurrent = item.current ? ("page" as const) : undefined;
              const style: React.CSSProperties = { animationDelay: `${index * 40}ms` };
              const inner = (
                <>
                  {item.icon != null ? (
                    <span
                      aria-hidden="true"
                      className="grid size-[1.3em] shrink-0 place-items-center [&_svg]:size-[1.15em] text-[color:var(--mq-accent,#c9482f)] forced-colors:text-[CanvasText]"
                    >
                      {item.icon}
                    </span>
                  ) : null}
                  <span className="min-w-0">{item.label}</span>
                </>
              );
              return (
                <li className="list-none" key={item.id}>
                  {item.href != null ? (
                    <a
                      aria-current={ariaCurrent}
                      className={mobileLinkClass}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      style={style}
                    >
                      {inner}
                    </a>
                  ) : (
                    <button
                      aria-current={ariaCurrent}
                      className={mobileLinkClass}
                      onClick={() => {
                        item.onSelect?.();
                        setOpen(false);
                      }}
                      style={style}
                      type="button"
                    >
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          {cta ? <div className="mt-[10px] px-[2px] pb-[2px]">{renderCta("panel")}</div> : null}
        </div>
      ) : null}
    </nav>
  );
}

export type NavbarVariantProps = VariantProps<typeof navVariants>;

export { ctaVariants, linkVariants, navVariants };
