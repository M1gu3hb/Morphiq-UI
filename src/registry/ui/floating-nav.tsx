"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Floating Nav
 *
 * A rounded, elevated bar that rides at the top of a scroll surface and gets
 * out of the way on the way down, then returns the moment the reader scrolls
 * back up. Self-contained by design: all four material recipes live in this
 * file, every local custom property carries a literal fallback, and no class
 * comes from the site's global stylesheet. No runtime dependency beyond React
 * and `cn`.
 *
 *   <FloatingNav
 *     aria-label="Primary"
 *     activeId="home"
 *     items={[
 *       { id: "home", label: "Home", href: "#home" },
 *       { id: "work", label: "Work", href: "#work" },
 *     ]}
 *     material="clay"
 *     size="md"
 *   />
 *
 * The bar is `position: sticky`, so it works both against the window and inside
 * a scrollable pane — pass `scrollContainerRef` for the latter and the
 * hide/show reads that element's scroll instead of the page's.
 *
 * Hiding is a compositor-only move: the direction is tracked in a ref, and the
 * only thing that changes per scroll is a `data-hidden` attribute set
 * imperatively on the bar — no React state churns on the scroll frame. Under
 * `prefers-reduced-motion` the effect is skipped entirely and the bar simply
 * stays put, so the final (visible) state is always preserved.
 *
 * Local theming knobs:
 *
 *   --mq-bar          bar surface
 *   --mq-bar-brd      bar border
 *   --mq-bar-grad     bar surface finish
 *   --mq-bar-shadow   bar elevation
 *   --mq-ink          idle link label
 *   --mq-ink-active   active link label
 *   --mq-hover-bg     hover wash on a link
 *   --mq-active-bg    active link chip fill
 *   --mq-chip-grad    active link chip finish
 *   --mq-chip-shadow  active link chip depth
 *   --mq-ring         focus ring
 */

/** Palette per material. Declared on the root; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-bar:#efe7db] [--mq-bar-brd:rgba(120,80,55,0.20)] [--mq-edge:#dcc4b2]",
    "[--mq-ink:#5b4a3c] [--mq-ink-active:#4a1d13] [--mq-hover-bg:rgba(255,255,255,0.60)]",
    "[--mq-active-bg:#ff9077]",
    // The bar is a raised, floating slab: lit-at-the-top gradient over its own
    // hard side wall and a wide ambient cast — it reads as hovering above the
    // page. Warm brown ink throughout; clay never casts black.
    "[--mq-bar-grad:linear-gradient(180deg,rgba(255,255,255,0.46),rgba(151,92,58,0.06))]",
    "[--mq-bar-shadow:inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.16),0_2px_0_var(--mq-edge,#dcc4b2),0_16px_32px_rgba(75,40,31,0.22)]",
    // The active chip is a smaller raised slab riding in the bar.
    "[--mq-chip-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    "[--mq-chip-shadow:inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_1px_2px_rgba(75,40,31,0.24)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-bar:rgba(255,255,255,0.62)] [--mq-bar-brd:rgba(255,255,255,0.75)]",
    "[--mq-ink:#2f2f29] [--mq-ink-active:#ffffff] [--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-active-bg:rgba(23,24,23,0.82)]",
    // A 1px specular filo whose geometry never changes, only its intensity, over
    // a wide cool cast shadow. No side wall: glass has no extrusion.
    "[--mq-bar-grad:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_16px_38px_rgba(24,20,40,0.22)]",
    "[--mq-chip-grad:linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0))]",
    "[--mq-chip-shadow:inset_0_1px_0_rgba(255,255,255,0.40),0_2px_8px_rgba(24,20,40,0.30)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-bar:#cfcbc2] [--mq-bar-brd:rgba(25,25,23,0.32)] [--mq-edge:#a8a49b]",
    "[--mq-ink:#33322d] [--mq-ink-active:#23231f] [--mq-hover-bg:rgba(255,255,255,0.40)]",
    "[--mq-active-bg:#f6f4ee]",
    // The surface IS the gradient, lit over body — the moulded read. Achromatic
    // ink, the cold counterpart to clay's warm brown.
    "[--mq-bar-grad:linear-gradient(180deg,#dbd7ce,#c4c0b7)]",
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-2px_3px_rgba(0,0,0,0.14),0_2px_0_var(--mq-edge,#a8a49b),0_16px_30px_rgba(38,36,31,0.26)]",
    "[--mq-chip-grad:linear-gradient(180deg,#fbfaf6,#e6e3da)]",
    "[--mq-chip-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(0,0,0,0.16),0_1px_2px_rgba(38,36,31,0.26)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour
  // scheme. Safe here because every surface it names is opaque and flips
  // together with the label that sits on it.
  adaptive: [
    "[--mq-bar:#f1f0ec] [--mq-bar-brd:rgba(23,24,23,0.14)]",
    "[--mq-ink:#55554e] [--mq-ink-active:#1c1c19] [--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-active-bg:#ffffff]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-bar-grad:none] [--mq-chip-grad:none]",
    // Two layers, not four. Adaptive earns its float from an elevation contact
    // shadow, not from a finish it never had.
    "[--mq-bar-shadow:inset_0_0_0_rgba(20,20,18,0),0_12px_28px_rgba(20,20,18,0.16)]",
    "[--mq-chip-shadow:inset_0_0_0_rgba(20,20,18,0),0_2px_6px_rgba(20,20,18,0.16)]",
    "[--mq-ring:#171817]",
    "dark:[--mq-bar:#26262a] dark:[--mq-bar-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-ink:#b9b7b0] dark:[--mq-ink-active:#f1efe9] dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-active-bg:#3a3a40]",
    "dark:[--mq-bar-shadow:inset_0_0_0_rgba(0,0,0,0),0_12px_28px_rgba(0,0,0,0.55)]",
    "dark:[--mq-chip-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_6px_rgba(0,0,0,0.55)]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type FloatingNavMaterial = keyof typeof MATERIAL_TOKENS;
type FloatingNavVariant = "default";
type FloatingNavSize = "sm" | "md" | "lg";

/** Pixels of net travel before the bar reacts — absorbs pointer/trackpad jitter. */
const SCROLL_THRESHOLD = 6;
/** Within this many pixels of the top the bar is always shown, whatever the delta. */
const SHOW_NEAR_TOP = 12;

const barVariants = cva(
  [
    // Sticky, not fixed: it pins to the top of whichever scroll context it is
    // dropped into — the window, or the pane whose ref is handed in.
    "sticky z-50 mx-auto flex w-fit items-center top-[var(--mq-bar-top,16px)]",
    "rounded-full border border-[var(--mq-bar-brd,rgba(120,80,55,0.20))]",
    "bg-[var(--mq-bar,#efe7db)] [background-image:var(--mq-bar-grad,none)]",
    "shadow-[var(--mq-bar-shadow,inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.16),0_2px_0_#dcc4b2,0_16px_32px_rgba(75,40,31,0.22))]",
    // The hide is a slide plus a fade. `translate-y-*` writes to the standalone
    // `translate` property in Tailwind v4, and the transition names `translate`
    // (never `transform`, which would animate nothing) alongside `opacity`.
    "transition-[translate,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    // Reduced motion drops the slide; the JS effect is also skipped so the bar
    // never leaves its resting, visible state.
    "motion-reduce:transition-none",
    "data-[hidden=true]:translate-y-[calc(-100%_-_40px)] data-[hidden=true]:opacity-0",
    // Fills, finishes and shadows are discarded in forced colours; the bar keeps
    // its outline through the border, which that mode paints with a system hue.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "[--mq-bar-top:12px] [--mq-bar-gap:2px] p-[4px]",
        md: "[--mq-bar-top:16px] [--mq-bar-gap:3px] p-[5px]",
        lg: "[--mq-bar-top:20px] [--mq-bar-gap:4px] p-[6px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const linkVariants = cva(
  [
    "relative inline-flex select-none items-center justify-center whitespace-nowrap",
    "cursor-pointer appearance-none rounded-full bg-transparent tracking-[-0.01em]",
    // A bottom border reserved transparent in every state: it is what marks the
    // active item once forced colours discard the chip fill, so the box model
    // never shifts between active and idle.
    "border-0 border-b-2 border-b-transparent",
    // Exactly the properties that change across states — nothing phantom.
    "transition-[background-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    // A data hook so the docs can pin the focus ring deterministically; a real
    // keyboard focus uses :focus-visible above and looks identical.
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight] forced-colors:data-[focus=true]:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      active: {
        // State is carried by weight and aria-current, never by colour alone.
        // In forced colours the chip vanishes, so the reserved bottom border is
        // painted with a system hue to keep the current item legible.
        true: [
          "font-extrabold text-[color:var(--mq-ink-active,#4a1d13)]",
          "bg-[var(--mq-active-bg,#ff9077)] [background-image:var(--mq-chip-grad,none)]",
          "shadow-[var(--mq-chip-shadow,inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_1px_2px_rgba(75,40,31,0.24))]",
          "forced-colors:border-b-[CanvasText] forced-colors:[background-image:none] forced-colors:shadow-none",
        ].join(" "),
        false: "font-semibold text-[color:var(--mq-ink,#5b4a3c)]",
      },
      size: {
        sm: "h-[30px] px-[12px] text-[length:11px]",
        md: "h-[36px] px-[15px] text-[length:12px]",
        lg: "h-[44px] px-[19px] text-[length:13px]",
      },
    },
    defaultVariants: { active: false, size: "md" },
  },
);

export type FloatingNavItem = {
  /** Stable identity, used as the React key and matched against `activeId`. */
  id: string;
  label: React.ReactNode;
  /** Rendered as an `<a href>` when present, otherwise a real `<button>`. */
  href?: string;
};

export type FloatingNavProps = Omit<React.ComponentPropsWithRef<"nav">, "children"> & {
  items: readonly FloatingNavItem[];
  /** Id of the item that carries `aria-current="page"` and the active chip. */
  activeId?: string;
  /**
   * Scroll surface to watch. Defaults to the window; pass a pane's ref to make
   * the bar hide/show against that element's scroll instead.
   */
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  material?: FloatingNavMaterial;
  variant?: FloatingNavVariant;
  size?: FloatingNavSize;
  /** Docs-only hook to pin the focus ring on one item; leave unset in real use. */
  focusId?: string;
};

/**
 * Reads the reduced-motion preference and stays in sync with it.
 *
 * SSR-safe: starts `false` and only consults `matchMedia` inside an effect, so
 * the server and the first client paint agree.
 */
function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return () => {};
      }
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function FloatingNav({
  "aria-label": ariaLabel = "Primary",
  activeId,
  className,
  focusId,
  items,
  material = "clay",
  ref,
  scrollContainerRef,
  size = "md",
  variant = "default",
  ...props
}: FloatingNavProps) {
  const navRef = React.useRef<HTMLElement | null>(null);
  const lastScrollY = React.useRef(0);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Reduced motion: the bar stays where it is. Its resting state is visible,
    // so nothing here has to run to preserve the final state.
    if (reduced) {
      nav.dataset.hidden = "false";
      return;
    }

    const target: HTMLElement | Window = scrollContainerRef?.current ?? window;
    const readScrollY = () =>
      target === window ? window.scrollY : (target as HTMLElement).scrollTop;

    lastScrollY.current = readScrollY();
    let frame = 0;

    const update = () => {
      frame = 0;
      const current = readScrollY();

      // Always reveal near the very top, whatever the last delta was.
      if (current <= SHOW_NEAR_TOP) {
        nav.dataset.hidden = "false";
        lastScrollY.current = current;
        return;
      }

      const delta = current - lastScrollY.current;
      // Ignore sub-threshold jitter without resetting the baseline, so small
      // wobbles accumulate rather than flip-flopping the bar.
      if (Math.abs(delta) < SCROLL_THRESHOLD) return;

      nav.dataset.hidden = delta > 0 ? "true" : "false";
      lastScrollY.current = current;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced, scrollContainerRef]);

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={cn(barVariants({ size }), MATERIAL_TOKENS[material], className)}
      data-material={material}
      data-variant={variant}
      ref={(node) => {
        navRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
    >
      <ul className="m-0 flex list-none items-center gap-[var(--mq-bar-gap,3px)] p-0">
        {items.map((item) => {
          const isActive = activeId != null && item.id === activeId;
          const isFocus = focusId != null && item.id === focusId;
          const linkClass = linkVariants({ active: isActive, size });
          return (
            <li key={item.id}>
              {item.href ? (
                <a
                  aria-current={isActive ? "page" : undefined}
                  className={linkClass}
                  data-focus={isFocus ? "true" : undefined}
                  href={item.href}
                >
                  <span className="min-w-0">{item.label}</span>
                </a>
              ) : (
                <button
                  aria-current={isActive ? "page" : undefined}
                  className={linkClass}
                  data-focus={isFocus ? "true" : undefined}
                  type="button"
                >
                  <span className="min-w-0">{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { barVariants, linkVariants };
