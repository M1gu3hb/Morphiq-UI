"use client";

import * as React from "react";
import { Circle, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Bottom Navigation
 *
 * An app-style bottom bar of 3–5 destinations, each a stacked icon over a short
 * label, with a soft pill that slides to whichever destination is active. Meant
 * to sit fixed at the bottom of a mobile viewport (add `fixed inset-x-0 bottom-0`
 * yourself); it renders in-flow by default so the docs preview and any static
 * placement work without extra positioning.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * The pill is measured, not guessed. A `<span aria-hidden>` is positioned over
 * the active item's icon slot from its live geometry (`getBoundingClientRect`,
 * relative to the bar) and slid with inline `translate` + `width`, transitioning
 * exactly those two properties. The active item is *also* marked by
 * `aria-current="page"`, a heavier label weight and its own colour, and — for
 * forced-colors — a reserved border on the icon slot, so the state is never
 * carried by the moving pill or by colour alone. It survives with JavaScript
 * off, under reduced motion, and in forced-colors.
 *
 * API:
 *
 *   <BottomNavigation
 *     items={[
 *       { id: "home", label: "Home", href: "/", icon: Home },
 *       { id: "search", label: "Search", href: "/search", icon: Search },
 *     ]}
 *     defaultActive="home"     // uncontrolled
 *     value={active}           // or controlled
 *     onValueChange={setActive}
 *     material="clay" size="md"
 *   />
 *
 * Uncontrolled by default (`defaultActive`, falling back to the first item);
 * controlled when `value` is supplied. Items with an `href` render as anchors,
 * otherwise as buttons. The per-item `icon` is a Lucide icon component; a missing
 * one falls back to a neutral dot.
 *
 * Local theming knobs (each use includes a literal fallback):
 *
 *   --mq-bar          bar surface
 *   --mq-bar-brd      bar border
 *   --mq-bar-grad     bar lighting
 *   --mq-bar-shadow   bar depth
 *   --mq-idle         inactive icon + label
 *   --mq-active-text  active icon + label
 *   --mq-hover        hover wash on an inactive item's icon slot
 *   --mq-pill         lit pill under the active item's icon
 *   --mq-pill-shadow  pill depth
 *   --mq-ring         focus ring
 */

/** Palette per material. Declared on the root; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-bar:#efe7db] [--mq-bar-brd:rgba(120,80,55,0.20)]",
    "[--mq-idle:#5b4a3c] [--mq-active-text:#4a1d13]",
    "[--mq-hover:rgba(255,255,255,0.55)] [--mq-pill:rgba(255,144,119,0.22)]",
    // The bar rides proud of the page it floats over: a bright bloom on top, a
    // warm inner shade below, and a soft ambient wash that spills upward the way
    // a docked bar shadows the content it covers. Warm brown ink throughout —
    // clay never casts black.
    "[--mq-bar-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    "[--mq-bar-shadow:inset_0_2px_2px_rgba(255,255,255,0.60),inset_0_-2px_4px_rgba(120,40,25,0.10),0_-6px_18px_rgba(75,40,31,0.10),0_4px_10px_rgba(75,40,31,0.10)]",
    // The pill is a lit filo over a warm contact shadow — the light gathered
    // under the active glyph, not an extruded slab.
    "[--mq-pill-shadow:inset_0_1px_0_rgba(255,255,255,0.55),0_2px_6px_rgba(201,72,47,0.16)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-bar:rgba(255,255,255,0.62)] [--mq-bar-brd:rgba(255,255,255,0.75)]",
    "[--mq-idle:#2f2f29] [--mq-active-text:#1b1c1b]",
    "[--mq-hover:rgba(255,255,255,0.40)] [--mq-pill:rgba(255,255,255,0.55)]",
    "[--mq-bar-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo over a wide cool cast shadow, mirrored above and below
    // so the sheet reads as floating. No side wall: glass has no extrusion.
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.24),0_-6px_20px_rgba(24,20,40,0.10),0_6px_18px_rgba(24,20,40,0.12)]",
    "[--mq-pill-shadow:inset_0_1px_0_rgba(255,255,255,0.90),0_2px_10px_rgba(24,20,40,0.14)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-bar:#e6e3da] [--mq-bar-brd:rgba(25,25,23,0.32)]",
    "[--mq-idle:#33322d] [--mq-active-text:#23231f]",
    "[--mq-hover:rgba(255,255,255,0.42)] [--mq-pill:#f6f4ee]",
    // The surface IS the gradient: lit over body, the moulded-plastic read.
    "[--mq-bar-grad:linear-gradient(180deg,#f0ede6,#ddd9cf)]",
    // A hard 1px bevel of light on top, an achromatic machined shade below, then
    // ambient wash on both faces. The cold counterpart to clay's warm ink.
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-2px_3px_rgba(0,0,0,0.14),0_-5px_16px_rgba(38,36,31,0.12),0_5px_12px_rgba(38,36,31,0.16)]",
    "[--mq-pill-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(0,0,0,0.10),0_2px_6px_rgba(38,36,31,0.20)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament, restrained depth. It adapts — the palette follows
  // the colour scheme, and both surfaces flip together with the glyph and label
  // that sit on them.
  adaptive: [
    "[--mq-bar:#f1f0ec] [--mq-bar-brd:rgba(23,24,23,0.14)]",
    "[--mq-idle:#55554e] [--mq-active-text:#1c1c19]",
    "[--mq-hover:rgba(23,24,23,0.05)] [--mq-pill:#ffffff]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-bar-grad:none]",
    // Two layers, not four: adaptive earns its presence from a contact shadow,
    // not from a finish it never had.
    "[--mq-bar-shadow:inset_0_0_0_rgba(20,20,18,0),0_-4px_14px_rgba(20,20,18,0.06),0_2px_6px_rgba(20,20,18,0.10)]",
    "[--mq-pill-shadow:inset_0_0_0_rgba(20,20,18,0),0_2px_6px_rgba(20,20,18,0.14)]",
    "[--mq-ring:#171817]",
    "dark:[--mq-bar:#26262a] dark:[--mq-bar-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-idle:#b9b7b0] dark:[--mq-active-text:#f1efe9]",
    "dark:[--mq-hover:rgba(255,255,255,0.08)] dark:[--mq-pill:#3a3a40]",
    "dark:[--mq-bar-shadow:inset_0_0_0_rgba(0,0,0,0),0_-4px_14px_rgba(0,0,0,0.40),0_2px_6px_rgba(0,0,0,0.45)]",
    "dark:[--mq-pill-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_6px_rgba(0,0,0,0.50)]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type BottomNavMaterial = keyof typeof MATERIAL_TOKENS;
type BottomNavVariant = "default";
type BottomNavSize = "sm" | "md" | "lg";

const navVariants = cva(
  [
    // `relative` makes the bar the box the pill is measured against and absolutely
    // positioned within. `isolate` contains the z-order of pill (0) and items
    // (10). `group/nav` lets an item react to whether the slider has taken over.
    "group/nav relative isolate flex w-full items-stretch",
    "rounded-[var(--mq-bar-radius,20px)] border border-[var(--mq-bar-brd,rgba(120,80,55,0.20))]",
    "bg-[var(--mq-bar,#efe7db)] p-[var(--mq-bar-pad,6px)] gap-[2px]",
    "[background-image:var(--mq-bar-grad,linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06)))]",
    "shadow-[var(--mq-bar-shadow,inset_0_2px_2px_rgba(255,255,255,0.60),inset_0_-2px_4px_rgba(120,40,25,0.10),0_-6px_18px_rgba(75,40,31,0.10),0_4px_10px_rgba(75,40,31,0.10))]",
    // Fills, gradients and shadows are discarded or meaningless once the OS paints
    // high-contrast, so clear the ornament by hand and keep a real border.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      // One treatment today: the sliding pill is the identity. It stays a real
      // axis so the registry, the docs switcher and a future treatment all have a
      // seam to hang off.
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-bar-radius:16px] [--mq-bar-pad:5px] [--mq-item-radius:13px] [--mq-item-min-h:44px] [--mq-glyph:18px] [--mq-label:10px] [--mq-pill-w:48px] [--mq-pill-h:26px]",
        md: "[--mq-bar-radius:20px] [--mq-bar-pad:6px] [--mq-item-radius:15px] [--mq-item-min-h:52px] [--mq-glyph:22px] [--mq-label:11px] [--mq-pill-w:56px] [--mq-pill-h:30px]",
        lg: "[--mq-bar-radius:24px] [--mq-bar-pad:7px] [--mq-item-radius:17px] [--mq-item-min-h:60px] [--mq-glyph:26px] [--mq-label:12px] [--mq-pill-w:64px] [--mq-pill-h:34px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const itemVariants = cva(
  [
    // `relative z-10` puts the icon + label above the sliding pill (z-0); z-index
    // needs a positioned element, hence `relative`. `flex-1` shares the bar width
    // evenly. `group/item` lets the icon slot react to this item's active state.
    "group/item relative z-10 flex flex-1 shrink-0 select-none flex-col items-center justify-center gap-[3px]",
    // A comfortable touch target on mobile: at least 44px tall, and never narrower
    // than 44px even in a crowded bar.
    "min-h-[var(--mq-item-min-h,52px)] min-w-[44px] px-[6px] py-[4px]",
    "cursor-pointer appearance-none bg-transparent no-underline",
    "rounded-[var(--mq-item-radius,15px)] text-[color:var(--mq-idle,#5b4a3c)] font-medium tracking-[-0.005em]",
    // Only the label colour changes across states; weight flips instantly and is
    // not animated.
    "transition-[color] duration-200 ease-out motion-reduce:transition-none",
    // Active label: heavier weight AND its own colour, so the state is never by
    // colour alone. The glyph, drawn with currentColor, shifts with it.
    "data-[active=true]:font-semibold data-[active=true]:text-[color:var(--mq-active-text,#4a1d13)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    // A parallel data-driven focus look so the docs preview can force the ring.
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // The button form uses :disabled; the anchor form carries aria-disabled — dim
    // and lock both the same way.
    "disabled:cursor-not-allowed disabled:opacity-45",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-45",
  ].join(" "),
);

/**
 * The icon slot: a fixed-size rounded pill area the glyph sits inside. It is what
 * the sliding indicator measures, so its dimensions are pinned per size and never
 * depend on the label.
 */
const iconSlotClass = [
  "relative z-10 grid place-items-center rounded-full",
  "h-[var(--mq-pill-h,30px)] w-[var(--mq-pill-w,56px)]",
  // A reserved transparent border, coloured only under forced-colors to mark the
  // active item once fills are discarded — kept in the box model so the marking
  // never shifts the row.
  "border-2 border-transparent",
  "[&_svg]:size-[var(--mq-glyph,22px)] [&_svg]:shrink-0",
  // The wash changes on hover (inactive) and while active before the pill has
  // measured — nothing phantom named here.
  "transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
  "group-hover/item:bg-[var(--mq-hover,rgba(255,255,255,0.55))]",
  // Fallback pill for the moment before the slider has measured, and for the
  // no-JavaScript case: the active item paints its own lit slot. Once the slider
  // is live the moving pill draws it instead, so the slot drops its own — two
  // washes would double up and the slide would leave a copy behind.
  "group-data-[active=true]/item:bg-[var(--mq-pill,rgba(255,144,119,0.22))]",
  "group-data-[active=true]/item:shadow-[var(--mq-pill-shadow,inset_0_1px_0_rgba(255,255,255,0.55),0_2px_6px_rgba(201,72,47,0.16))]",
  "group-data-[slider=on]/nav:group-data-[active=true]/item:bg-transparent",
  "group-data-[slider=on]/nav:group-data-[active=true]/item:shadow-none",
  // Fills vanish in forced-colors, so the active item is marked with a system
  // colour on the border already reserved above.
  "forced-colors:group-data-[active=true]/item:border-[CanvasText]",
].join(" ");

/** The short label under the glyph. Colour + weight inherit from the item. */
const labelClass =
  "block max-w-full truncate text-[length:var(--mq-label,11px)] leading-[1.1] forced-colors:text-[CanvasText]";

/** The sliding indicator: a lit pill the size of the active item's icon slot. */
const indicatorClass = [
  // Behind the glyphs and out of the pointer's way. It is decoration: the active
  // item already carries aria-current, and a second announcement would be noise.
  "pointer-events-none absolute left-0 top-0 z-0 rounded-full",
  "bg-[var(--mq-pill,rgba(255,144,119,0.22))]",
  "shadow-[var(--mq-pill-shadow,inset_0_1px_0_rgba(255,255,255,0.55),0_2px_6px_rgba(201,72,47,0.16))]",
  // Motion is OFF until armed, and the flag that arms it is added a commit after
  // the first measurement, so the opening paint can never slide in from a corner.
  "transition-none",
  "data-[armed=true]:transition-[translate,width]",
  "data-[armed=true]:duration-[320ms]",
  "data-[armed=true]:ease-[cubic-bezier(0.22,1.25,0.36,1)]",
  // The slide is decoration — the active item is already marked by weight and
  // aria-current — so reduced motion drops the travel and the pill simply appears
  // where it belongs.
  "motion-reduce:data-[armed=true]:transition-none",
  // The wash is a fill; forced-colors neutralises it. Pin it to Canvas so the
  // glyph above (CanvasText) keeps its contrast, and clear any shadow.
  "forced-colors:bg-[Canvas] forced-colors:shadow-none",
].join(" ");

type IndicatorRect = { left: number; top: number; width: number; height: number };

/**
 * Geometry of the active item's icon slot, relative to the bar.
 *
 * The active item exposes `data-active="true"`; the attribute is what gets
 * watched rather than the `value` prop, so the same hook serves the controlled
 * and uncontrolled cases without knowing which it is in. The slot is a grandchild
 * of the bar (not a direct offset child), so it is measured with
 * `getBoundingClientRect` and offset against the bar's own rect and border,
 * rather than `offsetLeft`, which would report a distance from the item instead.
 *
 * `ResizeObserver` covers the two ways a correct measurement goes stale without
 * any attribute changing — the bar reflowing, and a webfont landing after first
 * paint. `itemsKey` re-attaches the observers when the set of items changes.
 */
function useActiveIconRect(
  navRef: React.RefObject<HTMLElement | null>,
  itemsKey: string,
) {
  const [rect, setRect] = React.useState<IndicatorRect | null>(null);

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      const active = nav.querySelector<HTMLElement>('[data-active="true"]');
      const slot = active?.querySelector<HTMLElement>("[data-nav-icon]") ?? null;
      if (!slot) {
        setRect(null);
        return;
      }
      const navBox = nav.getBoundingClientRect();
      const slotBox = slot.getBoundingClientRect();
      // Absolutely positioned children sit against the bar's padding box, so the
      // border width (`clientLeft` / `clientTop`) is subtracted to land the pill
      // exactly over the slot regardless of the bar's border.
      const next = {
        left: slotBox.left - navBox.left - nav.clientLeft,
        top: slotBox.top - navBox.top - nav.clientTop,
        width: slotBox.width,
        height: slotBox.height,
      };
      // Bail on an unchanged measurement: both observers fire on things that often
      // do not move the slot, and re-setting state each time would churn.
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
    for (const item of nav.querySelectorAll("[data-nav-item]")) resize.observe(item);

    return () => {
      mutation.disconnect();
      resize.disconnect();
    };
  }, [navRef, itemsKey]);

  return rect;
}

export type BottomNavigationItem = {
  /** Stable identity for React, measurement and selection. */
  id: string;
  /** Short destination label; also the item's accessible name. */
  label: string;
  /** When present the item renders as an anchor; otherwise a button. */
  href?: string;
  /** Lucide icon component for the destination; falls back to a neutral dot. */
  icon?: LucideIcon;
  /** Disables this single item. */
  disabled?: boolean;
  /** Called when a link-less item is chosen. */
  onSelect?: () => void;
};

export type BottomNavigationProps = Omit<
  React.ComponentPropsWithRef<"nav">,
  "onChange" | "children"
> & {
  items: readonly BottomNavigationItem[];
  /** Uncontrolled initial active id. Falls back to the first item's id. */
  defaultActive?: string;
  /** Controlled active id. When set, `onValueChange` owns updates. */
  value?: string;
  onValueChange?: (id: string) => void;
  material?: BottomNavMaterial;
  variant?: BottomNavVariant;
  size?: BottomNavSize;
};

export function BottomNavigation({
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
}: BottomNavigationProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<string | undefined>(
    () => defaultActive ?? items[0]?.id,
  );
  const active = isControlled ? value : internal;

  const navRef = React.useRef<HTMLElement | null>(null);
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null);
  const itemsKey = items.map((item) => item.id).join("|");
  const rect = useActiveIconRect(navRef, itemsKey);

  // Arming is a one-way DOM flag rather than React state: it must flip on the
  // commit *after* the pill is first positioned, it never affects what React
  // renders, and setting state here would only buy a second render pass.
  React.useEffect(() => {
    if (rect && indicatorRef.current) indicatorRef.current.dataset.armed = "true";
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
      // this stays "off" and the active item paints its own lit slot. The slider
      // only takes over once it can actually be positioned, so the active item is
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
          className={indicatorClass}
          ref={indicatorRef}
          style={{
            // `translate`, not `transform`: Tailwind v4 writes its translate
            // utilities to the standalone property, and the transition above names
            // `translate` to match.
            translate: `${rect.left}px ${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          }}
        />
      ) : null}
      {items.map((item) => {
        const isActive = item.id === active;
        const Icon = item.icon ?? Circle;
        const shared = {
          className: itemVariants(),
          "data-active": isActive ? "true" : undefined,
          "data-nav-item": "",
          "aria-current": isActive ? ("page" as const) : undefined,
        };
        const inner = (
          <>
            <span aria-hidden="true" className={iconSlotClass} data-nav-icon="">
              <Icon />
            </span>
            <span className={labelClass}>{item.label}</span>
          </>
        );
        return item.href !== undefined ? (
          <a
            {...shared}
            aria-disabled={item.disabled || undefined}
            href={item.disabled ? undefined : item.href}
            key={item.id}
            onClick={() => {
              if (item.disabled) return;
              select(item.id);
            }}
            tabIndex={item.disabled ? -1 : undefined}
          >
            {inner}
          </a>
        ) : (
          <button
            {...shared}
            disabled={item.disabled}
            key={item.id}
            onClick={() => {
              select(item.id);
              item.onSelect?.();
            }}
            type="button"
          >
            {inner}
          </button>
        );
      })}
    </nav>
  );
}

export type BottomNavigationVariantProps = VariantProps<typeof navVariants>;

export { itemVariants, navVariants };
