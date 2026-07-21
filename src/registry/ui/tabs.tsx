"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Tabs
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * The mechanics are Radix's, not a reimplementation: roving tabindex, arrow /
 * Home / End navigation, `role="tablist" | "tab" | "tabpanel"`, the
 * `aria-controls` ↔ `aria-labelledby` pairing and the focusable panel all come
 * from `@radix-ui/react-tabs`. This file supplies appearance and nothing that
 * would fight that behaviour.
 *
 * Composable API, mapping 1:1 onto the primitives:
 *
 *   <Tabs defaultValue="a" material="clay" variant="pill" size="md">
 *     <TabsList>
 *       <TabsTrigger value="a">Overview</TabsTrigger>
 *       <TabsTrigger value="b">Activity</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="a">…</TabsContent>
 *   </Tabs>
 *
 * `material`, `variant` and `size` are declared once on the root: the tokens
 * inherit through CSS, and the two presentation axes reach the parts through a
 * tiny context. Repeating them on every trigger would be noise a caller could
 * get inconsistently wrong.
 *
 * Radix's own props pass straight through, including `activationMode="manual"`
 * for panels heavy enough that you do not want arrow keys mounting them.
 *
 * Local theming knobs:
 *
 *   --mq-list        list track surface
 *   --mq-list-brd    list track border
 *   --mq-idle        inactive trigger label (only where a track backs it)
 *   --mq-active-bg   active trigger fill
 *   --mq-active-text active trigger label
 *   --mq-hover-bg    hover wash on an inactive trigger
 *   --mq-accent      active indicator for the underline treatment
 *   --mq-ring        focus ring
 */

/** Palette per material. Declared on the root; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-list:#efe7db] [--mq-list-brd:rgba(120,80,55,0.20)] [--mq-edge:#c9482f]",
    "[--mq-idle:#5b4a3c] [--mq-hover-bg:rgba(255,255,255,0.60)]",
    "[--mq-active-bg:#ff9077] [--mq-active-text:#4a1d13]",
    // The track is a trough: its gradient runs shaded-at-the-top, which under a
    // top light reads as sunk. The chip that rides in it runs the other way.
    "[--mq-list-grad:linear-gradient(180deg,rgba(151,92,58,0.12),rgba(255,255,255,0.34))]",
    "[--mq-list-shadow:inset_0_2px_4px_rgba(120,60,40,0.18),inset_0_-1px_0_rgba(255,255,255,0.70),0_1px_0_rgba(255,255,255,0.60)]",
    "[--mq-chip-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    // Inflated, with the slab's own hard side wall. Warm brown ink throughout —
    // clay never casts black.
    "[--mq-chip-shadow:inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_4px_9px_rgba(75,40,31,0.24)]",
    "[--mq-accent:#c9482f] [--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-list:rgba(255,255,255,0.62)] [--mq-list-brd:rgba(255,255,255,0.75)]",
    "[--mq-idle:#2f2f29] [--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-active-bg:rgba(23,24,23,0.80)] [--mq-active-text:#ffffff]",
    "[--mq-list-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo whose geometry never changes, only its intensity, over
    // a wide cool cast shadow. No side wall: glass has no extrusion.
    "[--mq-list-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_6px_18px_rgba(24,20,40,0.14)]",
    "[--mq-chip-grad:linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0))]",
    "[--mq-chip-shadow:inset_0_1px_0_rgba(255,255,255,0.50),inset_0_-1px_0_rgba(255,255,255,0.12),0_0_0_rgba(24,20,40,0),0_3px_10px_rgba(24,20,40,0.30)]",
    "[--mq-accent:#171817] [--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-list:#cfcbc2] [--mq-list-brd:rgba(25,25,23,0.32)] [--mq-edge:#a8a49b]",
    "[--mq-idle:#33322d] [--mq-hover-bg:rgba(255,255,255,0.40)]",
    "[--mq-active-bg:#f6f4ee] [--mq-active-text:#23231f]",
    // The surface IS the gradient. Dark-over-light for the trough (sunk),
    // lit-over-body for the chip (raised) — the same two-way read that
    // distinguishes skeuo elsewhere in the library.
    "[--mq-list-grad:linear-gradient(180deg,#c4c0b7,#dbd7ce)]",
    "[--mq-list-shadow:inset_0_2px_4px_rgba(0,0,0,0.28),inset_0_-1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(255,255,255,0.62)]",
    "[--mq-chip-grad:linear-gradient(180deg,#fbfaf6,#e6e3da)]",
    // Achromatic ink — the cold counterpart to clay's warm brown.
    "[--mq-chip-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(0,0,0,0.16),0_2px_0_var(--mq-edge,#a8a49b),0_4px_8px_rgba(38,36,31,0.26)]",
    "[--mq-accent:#3f3e39] [--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour
  // scheme. Safe here because every surface it names is opaque and flips
  // together with the label that sits on it.
  adaptive: [
    "[--mq-list:#f1f0ec] [--mq-list-brd:rgba(23,24,23,0.14)]",
    "[--mq-idle:#55554e] [--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-active-bg:#ffffff] [--mq-active-text:#1c1c19]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-list-grad:none] [--mq-chip-grad:none]",
    // Two layers, not three or four. Adaptive earns its presence from a contact
    // shadow, not from a finish it never had.
    "[--mq-list-shadow:inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.07)]",
    "[--mq-chip-shadow:inset_0_0_0_rgba(20,20,18,0),0_2px_6px_rgba(20,20,18,0.16)]",
    "[--mq-accent:#171817] [--mq-ring:#171817]",
    "dark:[--mq-list:#26262a] dark:[--mq-list-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-idle:#b9b7b0] dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-active-bg:#3a3a40] dark:[--mq-active-text:#f1efe9]",
    "dark:[--mq-list-shadow:inset_0_0_0_rgba(0,0,0,0),0_1px_2px_rgba(0,0,0,0.40)]",
    "dark:[--mq-chip-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_6px_rgba(0,0,0,0.55)]",
    "dark:[--mq-accent:#f1efe9] dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type TabsVariant = "default" | "pill" | "underline";
type TabsSize = "sm" | "md" | "lg";

/**
 * Carries the two presentation axes from the root to the parts.
 *
 * Radix's own context is scoped and private, so this is the smallest way to let
 * `<TabsList>` and `<TabsTrigger>` stay dumb while `variant` and `size` are
 * still declared exactly once.
 */
const TabsStyleContext = React.createContext<{ size: TabsSize; variant: TabsVariant }>({
  size: "md",
  variant: "default",
});

const listVariants = cva("flex items-center", {
  variants: {
    variant: {
      default:
        "w-fit rounded-[var(--mq-list-radius,14px)] border border-[var(--mq-list-brd,rgba(120,80,55,0.20))] bg-[var(--mq-list,#efe7db)] p-[var(--mq-list-pad,4px)] gap-[2px] forced-colors:border-[CanvasText] " +
        // The track is a trough the chip rides in, so it takes the recessed
        // half of each material's vocabulary.
        "[background-image:var(--mq-list-grad,none)] shadow-[var(--mq-list-shadow,inset_0_2px_4px_rgba(120,60,40,0.18))] " +
        "forced-colors:[background-image:none] forced-colors:shadow-none",
      pill: "w-fit gap-[6px] border-0 bg-transparent p-0",
      underline:
        "w-full gap-[var(--mq-list-pad,4px)] border-0 border-b bg-transparent p-0 border-b-[var(--mq-list-brd,rgba(120,80,55,0.20))] forced-colors:border-b-[CanvasText]",
    },
    size: {
      sm: "[--mq-list-radius:11px] [--mq-list-pad:3px]",
      md: "[--mq-list-radius:14px] [--mq-list-pad:4px]",
      lg: "[--mq-list-radius:17px] [--mq-list-pad:5px]",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

const triggerVariants = cva(
  [
    // `z-10` puts the label above the sliding indicator, which sits at `z-0`.
    "relative z-10 inline-flex shrink-0 cursor-pointer select-none items-center justify-center",
    "whitespace-nowrap font-extrabold tracking-[-0.01em] appearance-none bg-transparent",
    // The bottom border is always reserved, transparent by default. It is what
    // the underline treatment colours when active, and what forced-colors uses
    // to mark the active tab once fills are discarded — so no variant has to
    // change the box model and shift the row.
    "border-0 border-b-2 border-b-transparent",
    // Exactly the properties that change across states, nothing phantom: the
    // fill and hover wash (background-color), the label (color), the raised
    // active chip (box-shadow), the underline indicator (border-color) and the
    // de-emphasis of an inactive underline tab plus the disabled fade
    // (opacity) — the last one applies to every variant, so it is not phantom
    // for the two that never dim an inactive tab.
    "transition-[background-color,color,box-shadow,border-color,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Fills vanish in forced-colors, so the active tab is marked with a system
    // colour on the border that is already in the box model.
    "forced-colors:data-[state=active]:border-b-[Highlight]",
    "disabled:cursor-not-allowed disabled:opacity-45",
  ].join(" "),
  {
    variants: {
      variant: {
        // Backed by the list track, so the inactive label has a known surface
        // to be measured against and can pin its own colour.
        default: [
          "rounded-[var(--mq-trigger-radius,10px)] text-[color:var(--mq-idle,#5b4a3c)]",
          "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
          "data-[state=active]:bg-[var(--mq-active-bg,#ff9077)]",
          "data-[state=active]:text-[color:var(--mq-active-text,#4a1d13)]",
          "data-[state=active]:shadow-[0_1px_2px_rgba(40,25,18,0.18)]",
          // Once the indicator is live it draws the chip, so the trigger stops
          // drawing its own. Two chips would double the shadow and the slide
          // would leave a stationary copy behind.
          "group-data-[slider=on]/list:data-[state=active]:bg-transparent",
          "group-data-[slider=on]/list:data-[state=active]:shadow-none",
        ].join(" "),
        // No track: an inactive label sits directly on the host's surface, so it
        // inherits the host's colour instead of pinning one that would be a
        // guess about the page. The active chip has a fill of its own and can.
        pill: [
          "rounded-full text-[color:currentColor]",
          "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
          "data-[state=active]:bg-[var(--mq-active-bg,#ff9077)]",
          "data-[state=active]:text-[color:var(--mq-active-text,#4a1d13)]",
          "data-[state=active]:shadow-[0_2px_5px_rgba(40,25,18,0.20)]",
          "group-data-[slider=on]/list:data-[state=active]:bg-transparent",
          "group-data-[slider=on]/list:data-[state=active]:shadow-none",
        ].join(" "),
        // Nothing is filled here, so both labels inherit the host's colour and
        // the state is carried by weight plus the accent rule — never by colour
        // alone.
        underline: [
          "rounded-none text-[color:currentColor] font-bold opacity-70",
          "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
          "data-[state=active]:opacity-100 data-[state=active]:font-extrabold",
          "data-[state=active]:border-b-[var(--mq-accent,#c9482f)]",
          // The indicator becomes the rule once it is live. The forced-colors
          // marker below is declared after this and stays in force, so the
          // active tab keeps a system-coloured border where fills are discarded.
          "group-data-[slider=on]/list:data-[state=active]:border-b-transparent",
        ].join(" "),
      },
      size: {
        sm: "[--mq-trigger-radius:8px] h-[28px] px-[10px] text-[length:11px]",
        md: "[--mq-trigger-radius:10px] h-[34px] px-[14px] text-[length:12px]",
        lg: "[--mq-trigger-radius:13px] h-[42px] px-[18px] text-[length:13px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export type TabsProps = React.ComponentPropsWithRef<typeof TabsPrimitive.Root> & {
  material?: keyof typeof MATERIAL_TOKENS;
  variant?: TabsVariant;
  size?: TabsSize;
};

/**
 * Root. Uncontrolled with `defaultValue`, controlled with `value` +
 * `onValueChange` — the state is Radix's, so there is none here to drift.
 */
export function Tabs({
  className,
  material = "clay",
  size = "md",
  variant = "default",
  ...props
}: TabsProps) {
  const style = React.useMemo(() => ({ size, variant }), [size, variant]);
  return (
    <TabsStyleContext.Provider value={style}>
      <TabsPrimitive.Root
        {...props}
        className={cn("flex flex-col gap-[12px]", MATERIAL_TOKENS[material], className)}
        data-material={material}
      />
    </TabsStyleContext.Provider>
  );
}

type IndicatorRect = { left: number; top: number; width: number; height: number };

/**
 * Geometry of whichever tab is currently active.
 *
 * Radix owns the selection and exposes it as `data-state` on the buttons, so the
 * attribute is what gets watched rather than a `value` prop: that works for the
 * controlled and the uncontrolled case alike, without this component needing to
 * know which one it is in.
 *
 * `ResizeObserver` covers the two ways a correct measurement goes stale without
 * any state changing — the container reflowing, and a webfont landing after
 * first paint and re-measuring every label.
 */
function useActiveTabRect(listRef: React.RefObject<HTMLDivElement | null>) {
  const [rect, setRect] = React.useState<IndicatorRect | null>(null);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
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
      // often do not move the tab, and re-setting state each time would churn.
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
    mutation.observe(list, { attributes: true, attributeFilter: ["data-state"], subtree: true });

    const resize = new ResizeObserver(measure);
    resize.observe(list);
    for (const tab of list.querySelectorAll('[role="tab"]')) resize.observe(tab);

    return () => {
      mutation.disconnect();
      resize.disconnect();
    };
  }, [listRef]);

  return rect;
}

const indicatorVariants = cva(
  [
    // Behind the labels and out of the way of the pointer. It is decoration:
    // Radix already tells assistive tech which tab is selected, and a second
    // announcement would be noise.
    "pointer-events-none absolute left-0 top-0 z-0",
    "[background-image:var(--mq-chip-grad,none)]",
    // Motion is OFF until armed, and the attribute that arms it is added a
    // commit after the first measurement. Defaulting to "no transition" rather
    // than "transition unless told otherwise" means the opening paint can never
    // slide in from the corner, even if the arming never runs at all.
    "transition-none",
    "data-[armed=true]:transition-[translate,width]",
    "data-[armed=true]:duration-[320ms]",
    "data-[armed=true]:ease-[cubic-bezier(0.22,1.25,0.36,1)]",
    // The slide is decoration — the active tab is already marked by its label
    // colour and weight — so reduced motion drops the travel entirely and the
    // indicator simply appears where it belongs.
    "motion-reduce:data-[armed=true]:transition-none",
    // Fills and shadows are discarded in forced colours, and background images
    // are NOT, so the wash has to be cleared by hand or it would sit on a
    // system-coloured surface it was never designed against.
    "forced-colors:bg-[Highlight] forced-colors:[background-image:none]",
    "forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--mq-trigger-radius,10px)] bg-[var(--mq-active-bg,#ff9077)] shadow-[var(--mq-chip-shadow,0_2px_6px_rgba(75,40,31,0.24))]",
        pill: "rounded-full bg-[var(--mq-active-bg,#ff9077)] shadow-[var(--mq-chip-shadow,0_2px_6px_rgba(75,40,31,0.24))]",
        // No chip here: the treatment's whole identity is the rule under the
        // label, so the indicator IS that rule and nothing else.
        underline: "rounded-full bg-[var(--mq-accent,#c9482f)] [background-image:none]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

/** How thick the underline treatment's moving rule is, in px. */
const UNDERLINE_BAR = 2;

export function TabsList({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.List>) {
  const { size, variant } = React.useContext(TabsStyleContext);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null);
  const rect = useActiveTabRect(listRef);

  // Arming is a one-way DOM flag rather than React state, and deliberately so:
  // it must flip on the commit *after* the indicator is first positioned, it
  // never affects what React renders, and setting state here would only buy a
  // second render pass. `requestAnimationFrame` would be the obvious
  // alternative and is worse — it is throttled to nothing in a background tab,
  // so an indicator that opened there would never animate again.
  React.useEffect(() => {
    if (rect && indicatorRef.current) indicatorRef.current.dataset.armed = "true";
  }, [rect]);

  return (
    <TabsPrimitive.List
      {...props}
      className={cn("group/list relative", listVariants({ variant, size }), className)}
      // Until the indicator has measured — before hydration, or with JavaScript
      // off entirely — this stays "off" and each trigger keeps drawing its own
      // active chip, exactly as it did before. The slider only takes over once
      // it can actually be positioned, so the active tab is never unmarked.
      data-slider={rect ? "on" : "off"}
      ref={(node) => {
        listRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
    >
      {rect ? (
        <span
          aria-hidden="true"
          className={indicatorVariants({ variant })}
          ref={indicatorRef}
          style={{
            // `translate`, not `transform`: Tailwind v4 writes its translate
            // utilities to the standalone property, and the transition above
            // names `translate` to match. Setting `transform` here would leave
            // the transition animating a property nothing ever changes.
            translate: `${rect.left}px ${
              variant === "underline" ? rect.top + rect.height - UNDERLINE_BAR : rect.top
            }px`,
            width: `${rect.width}px`,
            height: `${variant === "underline" ? UNDERLINE_BAR : rect.height}px`,
          }}
        />
      ) : null}
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.Trigger>) {
  const { size, variant } = React.useContext(TabsStyleContext);
  return (
    <TabsPrimitive.Trigger
      {...props}
      className={cn(triggerVariants({ variant, size }), className)}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      {...props}
      className={cn(
        // Radix makes the panel focusable so a keyboard user can reach content
        // that holds no controls of its own; that focus has to be visible.
        "text-[color:currentColor] text-[length:13px] leading-[1.6]",
        "focus-visible:outline-2 focus-visible:outline-offset-[3px]",
        "focus-visible:outline-[var(--mq-ring,#171817)]",
        "forced-colors:focus-visible:outline-[Highlight]",
        className,
      )}
    />
  );
}

export type TabsVariantProps = VariantProps<typeof triggerVariants>;

export { listVariants, triggerVariants };
