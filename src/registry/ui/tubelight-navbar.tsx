"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Tubelight Navbar
 *
 * A horizontal navigation where a glowing "tube of light" slides to whichever
 * item is active. The bar is a shallow trough; the indicator that rides in it is
 * a soft lit wash topped by a short, bright lamp bar (the tube) whose box-shadow
 * blooms downward — the light spilling onto the item rather than a raised chip.
 * That top-lamp read is what sets this apart from the sibling Pill Nav, where the
 * whole active item inflates.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * The tube is measured, not guessed. A `<span aria-hidden>` is positioned over
 * the active item from its live geometry (`offsetLeft` / `offsetWidth`) and slid
 * with inline `translate` + `width`, transitioning exactly those two properties.
 * The active item is *also* marked by `aria-current="page"` and a heavier weight,
 * so the state is never carried by the moving glow alone — and it survives with
 * JavaScript off, under reduced motion, and in forced-colors.
 *
 * API:
 *
 *   <TubelightNavbar
 *     items={[{ id: "home", label: "Home", href: "/", icon: <Home /> }, …]}
 *     defaultActive="home"        // uncontrolled
 *     value={active}              // or controlled
 *     onValueChange={setActive}
 *     material="clay" size="md"
 *   />
 *
 * Uncontrolled by default (`defaultActive`, falling back to the first item);
 * controlled when `value` is supplied. Items with an `href` render as anchors,
 * otherwise as buttons. An optional `icon` (any node) renders before the label.
 *
 * Local theming knobs (each use includes a literal fallback):
 *
 *   --mq-nav           bar (trough) surface
 *   --mq-nav-brd       bar border
 *   --mq-nav-grad      bar lighting (recessed)
 *   --mq-nav-shadow    bar depth (recessed)
 *   --mq-idle          inactive item label
 *   --mq-hover-bg      hover wash on an inactive item
 *   --mq-active-bg     lit wash under the active item
 *   --mq-active-text   active item label
 *   --mq-active-shadow lit wash depth
 *   --mq-tube          the bright lamp bar
 *   --mq-tube-glow     the tube's downward glow
 *   --mq-ring          focus ring
 */

/** Palette per material. Declared on the root; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-nav:#efe7db] [--mq-nav-brd:rgba(120,80,55,0.20)]",
    "[--mq-idle:#5b4a3c] [--mq-hover-bg:rgba(255,255,255,0.60)]",
    "[--mq-active-bg:rgba(255,144,119,0.20)] [--mq-active-text:#4a1d13]",
    // The bar is a trough: its gradient runs shaded-at-the-top, which under a top
    // light reads as sunk.
    "[--mq-nav-grad:linear-gradient(180deg,rgba(151,92,58,0.12),rgba(255,255,255,0.34))]",
    "[--mq-nav-shadow:inset_0_2px_4px_rgba(120,60,40,0.18),inset_0_-1px_0_rgba(255,255,255,0.70),0_1px_0_rgba(255,255,255,0.60)]",
    // The wash is not a raised slab — a single lit filo and a faint contact
    // shadow, so the depth reads as "lit from the tube" rather than "extruded".
    "[--mq-active-shadow:inset_0_1px_0_rgba(255,255,255,0.55),0_1px_3px_rgba(120,40,25,0.14)]",
    // Warm coral lamp over a warmer bloom. The glow is offset downward so it
    // spills into the item.
    "[--mq-tube:#ff9077] [--mq-tube-glow:0_0_10px_2px_rgba(255,120,90,0.55),0_7px_18px_rgba(201,72,47,0.42)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-nav:rgba(255,255,255,0.62)] [--mq-nav-brd:rgba(255,255,255,0.75)]",
    "[--mq-idle:#2f2f29] [--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-active-bg:rgba(255,255,255,0.55)] [--mq-active-text:#1b1c1b]",
    "[--mq-nav-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo over a wide cool cast shadow. No side wall: glass has
    // no extrusion.
    "[--mq-nav-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_6px_18px_rgba(24,20,40,0.14)]",
    "[--mq-active-shadow:inset_0_1px_0_rgba(255,255,255,0.90),0_2px_10px_rgba(24,20,40,0.16)]",
    // A cool white filament over a cyan halo — the classic tube-light read.
    "[--mq-tube:#dff1ff] [--mq-tube-glow:0_0_10px_2px_rgba(120,190,255,0.60),0_7px_20px_rgba(90,160,240,0.48)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-nav:#cfcbc2] [--mq-nav-brd:rgba(25,25,23,0.32)]",
    "[--mq-idle:#33322d] [--mq-hover-bg:rgba(255,255,255,0.40)]",
    "[--mq-active-bg:#f6f4ee] [--mq-active-text:#23231f]",
    // The surface IS the gradient: dark-over-light for the trough (sunk).
    "[--mq-nav-grad:linear-gradient(180deg,#c4c0b7,#dbd7ce)]",
    "[--mq-nav-shadow:inset_0_2px_4px_rgba(0,0,0,0.28),inset_0_-1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(255,255,255,0.62)]",
    "[--mq-active-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(0,0,0,0.12),0_2px_6px_rgba(38,36,31,0.22)]",
    // A warm amber hardware LED — the indicator light on a piece of gear.
    "[--mq-tube:#ffd68a] [--mq-tube-glow:0_0_9px_2px_rgba(255,176,74,0.55),0_7px_16px_rgba(214,140,40,0.42)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament, restrained glow. It adapts — the palette follows
  // the colour scheme, and both surfaces flip together with the label on them.
  adaptive: [
    "[--mq-nav:#f1f0ec] [--mq-nav-brd:rgba(23,24,23,0.14)]",
    "[--mq-idle:#55554e] [--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-active-bg:#ffffff] [--mq-active-text:#1c1c19]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-nav-grad:none]",
    "[--mq-nav-shadow:inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.07)]",
    "[--mq-active-shadow:inset_0_0_0_rgba(20,20,18,0),0_2px_6px_rgba(20,20,18,0.16)]",
    // A crisp ink accent bar with a soft same-tone halo — the tube kept honest to
    // adaptive's discipline rather than a saturated neon.
    "[--mq-tube:#1c1c19] [--mq-tube-glow:0_0_8px_1px_rgba(28,28,25,0.22),0_5px_14px_rgba(28,28,25,0.18)]",
    "[--mq-ring:#171817]",
    "dark:[--mq-nav:#26262a] dark:[--mq-nav-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-idle:#b9b7b0] dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-active-bg:#3a3a40] dark:[--mq-active-text:#f1efe9]",
    "dark:[--mq-nav-shadow:inset_0_0_0_rgba(0,0,0,0),0_1px_2px_rgba(0,0,0,0.40)]",
    "dark:[--mq-active-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_6px_rgba(0,0,0,0.55)]",
    // Against the dark bar the light filament genuinely glows.
    "dark:[--mq-tube:#f1efe9] dark:[--mq-tube-glow:0_0_9px_2px_rgba(241,239,233,0.40),0_5px_16px_rgba(241,239,233,0.30)]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type TubelightMaterial = keyof typeof MATERIAL_TOKENS;
type TubelightVariant = "default";
type TubelightSize = "sm" | "md" | "lg";

const navVariants = cva(
  [
    // `relative` makes the bar the offset parent the tube is measured against and
    // absolutely positioned within. `isolate` keeps the z-order of indicator (0)
    // and items (10) contained to this bar. `group/nav` lets an item react to
    // whether the slider has taken over.
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
      // One treatment today: the sliding tube is the identity, so there is no
      // second layout to switch to. It stays a real axis so the registry, the
      // docs switcher and a future treatment all have a seam.
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-nav-radius:14px] [--mq-nav-pad:3px] [--mq-item-radius:11px] [--mq-tube-h:2.5px]",
        md: "[--mq-nav-radius:17px] [--mq-nav-pad:4px] [--mq-item-radius:13px] [--mq-tube-h:3px]",
        lg: "[--mq-nav-radius:21px] [--mq-nav-pad:5px] [--mq-item-radius:16px] [--mq-tube-h:3.5px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const itemVariants = cva(
  [
    // `relative z-10` puts every label above the sliding tube, which sits at
    // `z-0` — z-index needs a positioned element, hence `relative`.
    "relative z-10 inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-[6px]",
    "whitespace-nowrap appearance-none bg-transparent no-underline tracking-[-0.01em]",
    "rounded-[var(--mq-item-radius,13px)] font-medium text-[color:var(--mq-idle,#5b4a3c)]",
    // A top border is always reserved, transparent by default. It mirrors the
    // tube's position and is what forced-colors uses to mark the active item once
    // fills are discarded — so the marking never changes the box model or shifts
    // the row, and it is only ever coloured under forced-colors.
    "border-0 border-t-2 border-t-transparent",
    // Exactly the properties that change across states: the hover wash and the
    // lit fallback fill (background-color) and the label (color). Weight changes
    // instantly and is not animated.
    "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
    // Active label: heavier weight AND its own colour, so the state is never by
    // colour alone.
    "data-[active=true]:font-bold data-[active=true]:text-[color:var(--mq-active-text,#4a1d13)]",
    // Fallback wash for the moment before the tube has measured, and for the
    // no-JavaScript case: the active item paints its own lit surface. Once the
    // slider is live the indicator draws it instead, so the item drops its own —
    // two washes would double up and the slide would leave a copy behind.
    "data-[active=true]:bg-[var(--mq-active-bg,rgba(255,144,119,0.20))]",
    "group-data-[slider=on]/nav:data-[active=true]:bg-transparent",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Fills vanish in forced-colors, so the active item is marked with a system
    // colour on the top border already reserved in the box model.
    "forced-colors:data-[active=true]:border-t-[CanvasText]",
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

/** The sliding indicator: a lit wash the width of the active item. */
const indicatorClass = [
  // Behind the labels and out of the pointer's way. It is decoration: the active
  // item already carries aria-current, and a second announcement would be noise.
  "pointer-events-none absolute left-0 top-0 z-0",
  "rounded-[var(--mq-item-radius,13px)] bg-[var(--mq-active-bg,rgba(255,144,119,0.20))]",
  "shadow-[var(--mq-active-shadow,inset_0_1px_0_rgba(255,255,255,0.55),0_1px_3px_rgba(120,40,25,0.14))]",
  // Motion is OFF until armed, and the attribute that arms it is added a commit
  // after the first measurement. Defaulting to "no transition" means the opening
  // paint can never slide in from the corner, even if arming never runs.
  "transition-none",
  "data-[armed=true]:transition-[translate,width]",
  "data-[armed=true]:duration-[320ms]",
  "data-[armed=true]:ease-[cubic-bezier(0.22,1.25,0.36,1)]",
  // The slide is decoration — the active item is already marked by weight and
  // aria-current — so reduced motion drops the travel and the tube simply appears
  // where it belongs.
  "motion-reduce:data-[armed=true]:transition-none",
  // The wash is a fill; forced-colors neutralises it. Pin it to Canvas so the
  // label above (CanvasText) keeps its contrast, and clear any shadow.
  "forced-colors:bg-[Canvas] forced-colors:shadow-none",
].join(" ");

/** The bright lamp bar plus its downward glow, centred at the top of the item. */
const tubeClass = [
  // Centred horizontally over the item and hugging its top edge; the glow blooms
  // downward into the item. `-translate-x-1/2` writes the standalone `translate`
  // property, but the tube has no transition of its own, so there is no
  // transition-[transform] trap here — only the parent indicator animates.
  "pointer-events-none absolute left-1/2 top-[3px] -translate-x-1/2",
  "h-[var(--mq-tube-h,3px)] w-[52%] rounded-full",
  "bg-[var(--mq-tube,#ff9077)]",
  "shadow-[var(--mq-tube-glow,0_0_10px_2px_rgba(255,120,90,0.55),0_7px_18px_rgba(201,72,47,0.42))]",
  // The lamp is the one part that must stay visible in forced-colors: repaint it
  // with the Highlight system colour and drop the (discarded) glow.
  "forced-colors:bg-[Highlight] forced-colors:shadow-none",
].join(" ");

type TubeRect = { left: number; top: number; width: number; height: number };

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
function useActiveTubeRect(
  navRef: React.RefObject<HTMLElement | null>,
  itemsKey: string,
) {
  const [rect, setRect] = React.useState<TubeRect | null>(null);

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
    for (const item of nav.querySelectorAll("[data-tube-item]")) resize.observe(item);

    return () => {
      mutation.disconnect();
      resize.disconnect();
    };
  }, [navRef, itemsKey]);

  return rect;
}

export type TubelightNavbarItem = {
  /** Stable identity for React, measurement and selection. */
  id: string;
  label: React.ReactNode;
  /** When present the item renders as an anchor; otherwise a button. */
  href?: string;
  /** Optional leading icon (any node); rendered aria-hidden before the label. */
  icon?: React.ReactNode;
};

export type TubelightNavbarProps = Omit<
  React.ComponentPropsWithRef<"nav">,
  "onChange" | "children"
> & {
  items: readonly TubelightNavbarItem[];
  /** Uncontrolled initial active id. Falls back to the first item's id. */
  defaultActive?: string;
  /** Controlled active id. When set, `onValueChange` owns updates. */
  value?: string;
  onValueChange?: (id: string) => void;
  material?: TubelightMaterial;
  variant?: TubelightVariant;
  size?: TubelightSize;
};

export function TubelightNavbar({
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
}: TubelightNavbarProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<string | undefined>(
    () => defaultActive ?? items[0]?.id,
  );
  const active = isControlled ? value : internal;

  const navRef = React.useRef<HTMLElement | null>(null);
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null);
  const itemsKey = items.map((item) => item.id).join("|");
  const rect = useActiveTubeRect(navRef, itemsKey);

  // Arming is a one-way DOM flag rather than React state: it must flip on the
  // commit *after* the tube is first positioned, it never affects what React
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
      // Until the tube has measured — before hydration, or with JavaScript off —
      // this stays "off" and the active item paints its own lit wash. The slider
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
            // utilities to the standalone property, and the transition above
            // names `translate` to match.
            translate: `${rect.left}px ${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          }}
        >
          <span className={tubeClass} />
        </span>
      ) : null}
      {items.map((item) => {
        const isActive = item.id === active;
        const shared = {
          className: itemVariants({ size }),
          "data-active": isActive ? "true" : undefined,
          "data-tube-item": "",
          "aria-current": isActive ? ("page" as const) : undefined,
        };
        const inner = (
          <>
            {item.icon !== undefined ? (
              <span aria-hidden="true" className="inline-flex items-center [&_svg]:size-[1.15em]">
                {item.icon}
              </span>
            ) : null}
            {item.label}
          </>
        );
        return item.href !== undefined ? (
          <a
            {...shared}
            href={item.href}
            key={item.id}
            onClick={() => select(item.id)}
          >
            {inner}
          </a>
        ) : (
          <button
            {...shared}
            key={item.id}
            onClick={() => select(item.id)}
            type="button"
          >
            {inner}
          </button>
        );
      })}
    </nav>
  );
}

export type TubelightNavbarVariantProps = VariantProps<typeof navVariants>;

export { itemVariants, navVariants };
