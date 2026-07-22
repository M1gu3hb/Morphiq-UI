"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Pill Nav
 *
 * A horizontal navigation where a single filled "pill" slides behind whichever
 * item is active. The bar itself is a shallow trough; the pill is the raised
 * chip that rides in it — the same two-way material read the rest of the library
 * uses (troughs shaded-at-top read as sunk, chips lit-at-top read as raised).
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * The pill is measured, not guessed. A `<span aria-hidden>` is positioned over
 * the active item from its live geometry (`offsetLeft` / `offsetWidth`) and slid
 * with inline `translate` + `width`, transitioning exactly those two properties.
 * The active item is *also* marked by `aria-current="page"` and a heavier weight,
 * so the state is never carried by the moving fill alone — and it survives with
 * JavaScript off, under reduced motion, and in forced-colors.
 *
 * API:
 *
 *   <PillNav
 *     items={[{ id: "home", label: "Home", href: "/" }, …]}
 *     defaultActive="home"        // uncontrolled
 *     value={active}              // or controlled
 *     onValueChange={setActive}
 *     material="clay" size="md"
 *   />
 *
 * Uncontrolled by default (`defaultActive`, falling back to the first item);
 * controlled when `value` is supplied. Items with an `href` render as anchors,
 * otherwise as buttons.
 *
 * Local theming knobs (each use includes a literal fallback):
 *
 *   --mq-nav          bar (trough) surface
 *   --mq-nav-brd      bar border
 *   --mq-nav-grad     bar lighting (recessed)
 *   --mq-nav-shadow   bar depth (recessed)
 *   --mq-idle         inactive item label
 *   --mq-hover-bg     hover wash on an inactive item
 *   --mq-pill-bg      pill fill / active surface
 *   --mq-pill-text    active item label
 *   --mq-pill-grad    pill lighting (raised)
 *   --mq-pill-shadow  pill depth (raised)
 *   --mq-edge         pill's hard side wall
 *   --mq-ring         focus ring
 */

/** Palette per material. Declared on the root; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-nav:#efe7db] [--mq-nav-brd:rgba(120,80,55,0.20)] [--mq-edge:#c9482f]",
    "[--mq-idle:#5b4a3c] [--mq-hover-bg:rgba(255,255,255,0.60)]",
    "[--mq-pill-bg:#ff9077] [--mq-pill-text:#4a1d13]",
    // The bar is a trough: its gradient runs shaded-at-the-top, which under a top
    // light reads as sunk. The pill that rides in it runs the other way.
    "[--mq-nav-grad:linear-gradient(180deg,rgba(151,92,58,0.12),rgba(255,255,255,0.34))]",
    "[--mq-nav-shadow:inset_0_2px_4px_rgba(120,60,40,0.18),inset_0_-1px_0_rgba(255,255,255,0.70),0_1px_0_rgba(255,255,255,0.60)]",
    "[--mq-pill-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    // Inflated, with the slab's own hard side wall. Warm brown ink throughout —
    // clay never casts black.
    "[--mq-pill-shadow:inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_4px_9px_rgba(75,40,31,0.24)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-nav:rgba(255,255,255,0.62)] [--mq-nav-brd:rgba(255,255,255,0.75)]",
    "[--mq-idle:#2f2f29] [--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-pill-bg:rgba(23,24,23,0.80)] [--mq-pill-text:#ffffff]",
    "[--mq-nav-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo whose geometry never changes, only its intensity, over
    // a wide cool cast shadow. No side wall: glass has no extrusion.
    "[--mq-nav-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_6px_18px_rgba(24,20,40,0.14)]",
    "[--mq-pill-grad:linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0))]",
    "[--mq-pill-shadow:inset_0_1px_0_rgba(255,255,255,0.50),inset_0_-1px_0_rgba(255,255,255,0.12),0_0_0_rgba(24,20,40,0),0_3px_10px_rgba(24,20,40,0.30)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-nav:#cfcbc2] [--mq-nav-brd:rgba(25,25,23,0.32)] [--mq-edge:#a8a49b]",
    "[--mq-idle:#33322d] [--mq-hover-bg:rgba(255,255,255,0.40)]",
    "[--mq-pill-bg:#f6f4ee] [--mq-pill-text:#23231f]",
    // The surface IS the gradient. Dark-over-light for the trough (sunk),
    // lit-over-body for the pill (raised) — the same two-way read that
    // distinguishes skeuo elsewhere in the library.
    "[--mq-nav-grad:linear-gradient(180deg,#c4c0b7,#dbd7ce)]",
    "[--mq-nav-shadow:inset_0_2px_4px_rgba(0,0,0,0.28),inset_0_-1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(255,255,255,0.62)]",
    "[--mq-pill-grad:linear-gradient(180deg,#fbfaf6,#e6e3da)]",
    // Achromatic ink — the cold counterpart to clay's warm brown.
    "[--mq-pill-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(0,0,0,0.16),0_2px_0_var(--mq-edge,#a8a49b),0_4px_8px_rgba(38,36,31,0.26)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  // Safe here because every surface it names is opaque and flips together with
  // the label that sits on it.
  adaptive: [
    "[--mq-nav:#f1f0ec] [--mq-nav-brd:rgba(23,24,23,0.14)]",
    "[--mq-idle:#55554e] [--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-pill-bg:#ffffff] [--mq-pill-text:#1c1c19]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-nav-grad:none] [--mq-pill-grad:none]",
    // Two layers, not three or four. Adaptive earns its presence from a contact
    // shadow, not from a finish it never had.
    "[--mq-nav-shadow:inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.07)]",
    "[--mq-pill-shadow:inset_0_0_0_rgba(20,20,18,0),0_2px_6px_rgba(20,20,18,0.16)]",
    "[--mq-ring:#171817]",
    "dark:[--mq-nav:#26262a] dark:[--mq-nav-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-idle:#b9b7b0] dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-pill-bg:#3a3a40] dark:[--mq-pill-text:#f1efe9]",
    "dark:[--mq-nav-shadow:inset_0_0_0_rgba(0,0,0,0),0_1px_2px_rgba(0,0,0,0.40)]",
    "dark:[--mq-pill-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_6px_rgba(0,0,0,0.55)]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type PillNavMaterial = keyof typeof MATERIAL_TOKENS;
type PillNavVariant = "default";
type PillNavSize = "sm" | "md" | "lg";

const navVariants = cva(
  [
    // `relative` makes the bar the offset parent the pill is measured against and
    // absolutely positioned within. `isolate` keeps the z-order of pill (0) and
    // items (10) contained to this bar. `group/nav` lets an item react to whether
    // the slider has taken over.
    "group/nav relative isolate inline-flex w-fit max-w-full items-center",
    "rounded-[var(--mq-nav-radius,17px)] border border-[var(--mq-nav-brd,rgba(120,80,55,0.20))]",
    "bg-[var(--mq-nav,#efe7db)] p-[var(--mq-nav-pad,4px)] gap-[2px]",
    // The bar takes the recessed half of each material's vocabulary.
    "[background-image:var(--mq-nav-grad,linear-gradient(180deg,rgba(151,92,58,0.12),rgba(255,255,255,0.34)))]",
    "shadow-[var(--mq-nav-shadow,inset_0_2px_4px_rgba(120,60,40,0.18),inset_0_-1px_0_rgba(255,255,255,0.70),0_1px_0_rgba(255,255,255,0.60))]",
    // Fills, gradients and shadows are all discarded or meaningless once the OS
    // paints high-contrast, so clear the ornament by hand and keep a real border.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      // One treatment today: the pill-behind-the-active-item is the identity, so
      // there is no second layout to switch to. It stays a real axis so the
      // registry, the docs switcher and a future treatment all have a seam.
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-nav-radius:14px] [--mq-nav-pad:3px] [--mq-item-radius:11px]",
        md: "[--mq-nav-radius:17px] [--mq-nav-pad:4px] [--mq-item-radius:13px]",
        lg: "[--mq-nav-radius:21px] [--mq-nav-pad:5px] [--mq-item-radius:16px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const itemVariants = cva(
  [
    // `relative z-10` puts every label above the sliding pill, which sits at
    // `z-0` — z-index needs a positioned element, hence `relative`.
    "relative z-10 inline-flex shrink-0 cursor-pointer select-none items-center justify-center",
    "whitespace-nowrap appearance-none bg-transparent no-underline tracking-[-0.01em]",
    "rounded-[var(--mq-item-radius,13px)] font-semibold text-[color:var(--mq-idle,#5b4a3c)]",
    // A bottom border is always reserved, transparent by default. It is what
    // forced-colors uses to mark the active item once fills are discarded — so
    // the marking never changes the box model and shifts the row.
    "border-0 border-b-2 border-b-transparent",
    // Exactly the properties that change across states: the hover wash and active
    // fill (background-color) and the label (color). Weight changes instantly and
    // is not animated.
    "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
    // Active label: heavier weight AND its own colour, so the state is never by
    // colour alone.
    "data-[active=true]:font-extrabold data-[active=true]:text-[color:var(--mq-pill-text,#4a1d13)]",
    // Fallback fill for the moment before the pill has measured, and for the
    // no-JavaScript case: the active item paints its own chip. Once the slider is
    // live it draws the pill instead, so the item's own fill is dropped — two
    // chips would double the shadow and the slide would leave a copy behind.
    "data-[active=true]:bg-[var(--mq-pill-bg,#ff9077)]",
    "data-[active=true]:shadow-[0_1px_2px_rgba(40,25,18,0.18)]",
    "group-data-[slider=on]/nav:data-[active=true]:bg-transparent",
    "group-data-[slider=on]/nav:data-[active=true]:shadow-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Fills vanish in forced-colors, so the active item is marked with a system
    // colour on the border already in the box model, and — only while the
    // Highlight pill is actually behind it — its label pairs with HighlightText.
    "forced-colors:data-[active=true]:border-b-[CanvasText]",
    "group-data-[slider=on]/nav:forced-colors:data-[active=true]:text-[HighlightText]",
    "disabled:cursor-not-allowed disabled:opacity-45",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-[30px] px-[12px] text-[length:12px]",
        md: "h-[38px] px-[16px] text-[length:13px]",
        lg: "h-[46px] px-[20px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const pillClass = [
  // Behind the labels and out of the pointer's way. It is decoration: the active
  // item already carries aria-current, and a second announcement would be noise.
  "pointer-events-none absolute left-0 top-0 z-0",
  "rounded-[var(--mq-item-radius,13px)] bg-[var(--mq-pill-bg,#ff9077)]",
  "[background-image:var(--mq-pill-grad,none)]",
  "shadow-[var(--mq-pill-shadow,inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_#c9482f,0_4px_9px_rgba(75,40,31,0.24))]",
  // Motion is OFF until armed, and the attribute that arms it is added a commit
  // after the first measurement. Defaulting to "no transition" means the opening
  // paint can never slide in from the corner, even if arming never runs.
  "transition-none",
  "data-[armed=true]:transition-[translate,width]",
  "data-[armed=true]:duration-[320ms]",
  "data-[armed=true]:ease-[cubic-bezier(0.22,1.25,0.36,1)]",
  // The slide is decoration — the active item is already marked by weight and
  // aria-current — so reduced motion drops the travel and the pill simply appears
  // where it belongs.
  "motion-reduce:data-[armed=true]:transition-none",
  // Fills and shadows are discarded in forced-colors and background-image is NOT,
  // so clear the wash by hand and mark the pill with a system colour.
  "forced-colors:bg-[Highlight] forced-colors:[background-image:none] forced-colors:shadow-none",
].join(" ");

type PillRect = { left: number; top: number; width: number; height: number };

/**
 * Geometry of whichever item is currently active.
 *
 * The active item exposes `data-active="true"`, so the attribute is what gets
 * watched rather than the `value` prop — that works for the controlled and the
 * uncontrolled case alike without this hook needing to know which one it is in.
 *
 * `ResizeObserver` covers the two ways a correct measurement goes stale without
 * any attribute changing — the bar reflowing, and a webfont landing after first
 * paint and re-measuring every label. `itemsKey` re-attaches the observers when
 * the set of items itself changes.
 */
function useActivePillRect(
  navRef: React.RefObject<HTMLElement | null>,
  itemsKey: string,
) {
  const [rect, setRect] = React.useState<PillRect | null>(null);

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      const active = nav.querySelector<HTMLElement>('[data-active="true"]');
      if (!active) {
        setRect(null);
        return;
      }
      const next = {
        left: active.offsetLeft,
        top: active.offsetTop,
        width: active.offsetWidth,
        height: active.offsetHeight,
      };
      // Bail on an unchanged measurement: both observers fire on things that
      // often do not move the item, and re-setting state each time would churn.
      setRect((prev) =>
        prev &&
        prev.left === next.left &&
        prev.top === next.top &&
        prev.width === next.width &&
        prev.height === next.height
          ? prev
          : next,
      );
    };

    measure();

    const mutation = new MutationObserver(measure);
    mutation.observe(nav, {
      attributes: true,
      attributeFilter: ["data-active"],
      subtree: true,
    });

    const resize = new ResizeObserver(measure);
    resize.observe(nav);
    for (const item of nav.querySelectorAll("[data-pill-item]")) resize.observe(item);

    return () => {
      mutation.disconnect();
      resize.disconnect();
    };
  }, [navRef, itemsKey]);

  return rect;
}

export type PillNavItem = {
  /** Stable identity for React, measurement and selection. */
  id: string;
  label: React.ReactNode;
  /** When present the item renders as an anchor; otherwise a button. */
  href?: string;
};

export type PillNavProps = Omit<
  React.ComponentPropsWithRef<"nav">,
  "onChange" | "children"
> & {
  items: readonly PillNavItem[];
  /** Uncontrolled initial active id. Falls back to the first item's id. */
  defaultActive?: string;
  /** Controlled active id. When set, `onValueChange` owns updates. */
  value?: string;
  onValueChange?: (id: string) => void;
  material?: PillNavMaterial;
  variant?: PillNavVariant;
  size?: PillNavSize;
};

export function PillNav({
  "aria-label": ariaLabel = "Primary",
  className,
  defaultActive,
  items,
  material = "clay",
  onValueChange,
  ref,
  size = "md",
  value,
  variant = "default",
  ...props
}: PillNavProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<string | undefined>(
    () => defaultActive ?? items[0]?.id,
  );
  const active = isControlled ? value : internal;

  const navRef = React.useRef<HTMLElement | null>(null);
  const pillRef = React.useRef<HTMLSpanElement | null>(null);
  const itemsKey = items.map((item) => item.id).join("|");
  const rect = useActivePillRect(navRef, itemsKey);

  // Arming is a one-way DOM flag rather than React state: it must flip on the
  // commit *after* the pill is first positioned, it never affects what React
  // renders, and setting state here would only buy a second render pass.
  React.useEffect(() => {
    if (rect && pillRef.current) pillRef.current.dataset.armed = "true";
  }, [rect]);

  const select = (id: string) => {
    if (!isControlled) setInternal(id);
    onValueChange?.(id);
  };

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={cn(MATERIAL_TOKENS[material], navVariants({ size, variant }), className)}
      data-material={material}
      // Until the pill has measured — before hydration, or with JavaScript off —
      // this stays "off" and the active item paints its own chip. The slider only
      // takes over once it can actually be positioned, so the active item is
      // never left unmarked.
      data-slider={rect ? "on" : "off"}
      ref={(node) => {
        navRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
    >
      {rect ? (
        <span
          aria-hidden="true"
          className={pillClass}
          ref={pillRef}
          style={{
            // `translate`, not `transform`: Tailwind v4 writes its translate
            // utilities to the standalone property, and the transition above
            // names `translate` to match.
            translate: `${rect.left}px ${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          }}
        />
      ) : null}
      {items.map((item) => {
        const isActive = item.id === active;
        const shared = {
          className: itemVariants({ size }),
          "data-active": isActive ? "true" : undefined,
          "data-pill-item": "",
          "aria-current": isActive ? ("page" as const) : undefined,
        };
        return item.href !== undefined ? (
          <a
            {...shared}
            href={item.href}
            key={item.id}
            onClick={() => select(item.id)}
          >
            {item.label}
          </a>
        ) : (
          <button
            {...shared}
            key={item.id}
            onClick={() => select(item.id)}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export type PillNavVariantProps = VariantProps<typeof navVariants>;

export { itemVariants, navVariants };
