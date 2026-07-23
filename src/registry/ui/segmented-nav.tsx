"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Segmented Nav
 *
 * A single-select segmented control: one shallow trough holding a row of flush
 * segments, with a raised chip that SLIDES to whichever segment is selected.
 * Where the sibling Tubelight Navbar lights a lamp bar over the active item and
 * the Navbar links out to destinations, this switches the view in place — the
 * segments are state, not places, so they are real `<button>`s in a
 * `role="tablist"` rather than anchors in a `<nav>` landmark. A hairline divider
 * sits between neighbours and retracts around the chip, the way a physical
 * segmented switch loses its seam where the slider covers it.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * The chip is measured, not guessed. A `<span aria-hidden>` is positioned over
 * the selected segment from its live geometry (`offsetLeft` / `offsetWidth`) and
 * slid with inline `translate` + `width`, transitioning exactly those two
 * properties. The selected segment is *also* marked by `aria-selected`, a heavier
 * weight and a reserved rule, so the state is never carried by the moving chip
 * alone — it survives before hydration, under reduced motion, and in
 * forced-colors.
 *
 * API:
 *
 *   <SegmentedNav
 *     aria-label="Board views"
 *     items={[
 *       { id: "board", label: "Board", controls: "board-panel" },
 *       { id: "list", label: "List", controls: "list-panel" },
 *     ]}
 *     defaultValue="board"       // uncontrolled
 *     value={view}               // or controlled
 *     onValueChange={setView}
 *     material="clay" size="md"
 *   />
 *
 * Uncontrolled by default (`defaultValue`, falling back to the first enabled
 * item); controlled when `value` is supplied. `controls` is optional: pass the id
 * of the `role="tabpanel"` a segment reveals and it is wired as `aria-controls`
 * — only ever pass it while that panel is actually mounted. Without it the
 * control is a plain view switcher, which `role="tab"` also permits. An optional
 * `icon` (any node) renders before the label — the caller supplies the element,
 * so no icon package is imported here and the dependency list stays at `cva`
 * plus `cn`.
 *
 * Local theming knobs (each use includes a literal fallback):
 *
 *   --mq-track          trough surface
 *   --mq-track-brd      trough border
 *   --mq-track-grad     trough lighting (recessed)
 *   --mq-track-shadow   trough depth (recessed)
 *   --mq-track-blur     trough backdrop blur (glass only)
 *   --mq-divider        hairline seam between segments
 *   --mq-idle           unselected segment label
 *   --mq-hover-bg       hover wash on an unselected segment
 *   --mq-chip           selected chip surface
 *   --mq-chip-grad      selected chip lighting (raised)
 *   --mq-chip-shadow    selected chip depth (raised)
 *   --mq-edge           the chip's hard side wall
 *   --mq-active-text    selected segment label
 *   --mq-ring           focus ring
 */

/** Palette per material. Declared on the root; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-track:#efe7db] [--mq-track-brd:rgba(120,80,55,0.20)] [--mq-track-blur:0px]",
    // The trough runs shaded-at-the-top, which under a top light reads as sunk.
    // The chip that rides in it runs the other way, so the two never read alike.
    "[--mq-track-grad:linear-gradient(180deg,rgba(151,92,58,0.12),rgba(255,255,255,0.34))]",
    "[--mq-track-shadow:inset_0_2px_4px_rgba(120,60,40,0.18),inset_0_-1px_0_rgba(255,255,255,0.70),0_1px_0_rgba(255,255,255,0.60)]",
    "[--mq-divider:rgba(120,80,55,0.26)]",
    "[--mq-idle:#5b4a3c] [--mq-hover-bg:rgba(255,255,255,0.60)]",
    "[--mq-chip:#ff9077] [--mq-active-text:#4a1d13] [--mq-edge:#c9482f]",
    "[--mq-chip-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    // Inflated, with the slab's own hard side wall. Warm brown ink throughout —
    // clay never casts black.
    "[--mq-chip-shadow:inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_4px_9px_rgba(75,40,31,0.24)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-track:rgba(255,255,255,0.62)] [--mq-track-brd:rgba(255,255,255,0.75)] [--mq-track-blur:14px]",
    "[--mq-track-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo over a wide cool cast shadow. No side wall: glass has
    // no extrusion.
    "[--mq-track-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_6px_18px_rgba(24,20,40,0.14)]",
    "[--mq-divider:rgba(23,24,23,0.18)]",
    "[--mq-idle:#2f2f29] [--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-chip:rgba(23,24,23,0.82)] [--mq-active-text:#ffffff]",
    "[--mq-chip-grad:linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0))]",
    "[--mq-chip-shadow:inset_0_1px_0_rgba(255,255,255,0.50),inset_0_-1px_0_rgba(255,255,255,0.12),0_3px_10px_rgba(24,20,40,0.30)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    // Warm greige throughout — the #e6e3da family, moulded rather than printed.
    "[--mq-track:#d5d1c8] [--mq-track-brd:rgba(25,25,23,0.32)] [--mq-track-blur:0px]",
    // The surface IS the gradient: dark-over-light for the trough (sunk),
    // lit-over-body for the chip (raised).
    "[--mq-track-grad:linear-gradient(180deg,#c9c5bc,#e0ddd4)]",
    "[--mq-track-shadow:inset_0_2px_4px_rgba(0,0,0,0.28),inset_0_-1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(255,255,255,0.62)]",
    "[--mq-divider:rgba(25,25,23,0.28)]",
    "[--mq-idle:#33322d] [--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-chip:#f6f4ee] [--mq-active-text:#23231f] [--mq-edge:#a8a49b]",
    "[--mq-chip-grad:linear-gradient(180deg,#fbfaf6,#e6e3da)]",
    // Achromatic ink — the cold counterpart to clay's warm brown.
    "[--mq-chip-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(0,0,0,0.16),0_2px_0_var(--mq-edge,#a8a49b),0_4px_8px_rgba(38,36,31,0.26)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme,
  // and every surface it names is opaque, so both flip together with the label
  // sitting on them.
  adaptive: [
    "[--mq-track:#f1f0ec] [--mq-track-brd:rgba(23,24,23,0.14)] [--mq-track-blur:0px]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-track-grad:none] [--mq-chip-grad:none]",
    // Two layers, not four. Adaptive earns its presence from a contact shadow,
    // not from a finish it never had.
    "[--mq-track-shadow:inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.07)]",
    "[--mq-divider:rgba(23,24,23,0.16)]",
    "[--mq-idle:#55554e] [--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-chip:#ffffff] [--mq-active-text:#1c1c19]",
    "[--mq-chip-shadow:inset_0_0_0_rgba(20,20,18,0),0_2px_6px_rgba(20,20,18,0.16)]",
    "[--mq-ring:#171817]",
    "dark:[--mq-track:#26262a] dark:[--mq-track-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-track-shadow:inset_0_0_0_rgba(0,0,0,0),0_1px_2px_rgba(0,0,0,0.40)]",
    "dark:[--mq-divider:rgba(255,255,255,0.18)]",
    "dark:[--mq-idle:#b9b7b0] dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-chip:#3a3a40] dark:[--mq-active-text:#f1efe9]",
    "dark:[--mq-chip-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_6px_rgba(0,0,0,0.55)]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type SegmentedNavMaterial = keyof typeof MATERIAL_TOKENS;
type SegmentedNavVariant = "default";
type SegmentedNavSize = "sm" | "md" | "lg";

const trackVariants = cva(
  [
    // `relative` makes the track the offset parent the chip is measured against
    // and absolutely positioned within. `isolate` keeps the z-order of chip (0)
    // and segments (10) contained. `group/seg` lets a segment react to whether
    // the slider has taken over, to the forced-focus hook and to the group-wide
    // disabled flag.
    "group/seg relative isolate inline-flex w-fit max-w-full items-center",
    "rounded-[var(--mq-track-radius,15px)] border border-[var(--mq-track-brd,rgba(120,80,55,0.20))]",
    "bg-[var(--mq-track,#efe7db)] p-[var(--mq-track-pad,4px)]",
    // The track takes the recessed half of each material's vocabulary.
    "[background-image:var(--mq-track-grad,linear-gradient(180deg,rgba(151,92,58,0.12),rgba(255,255,255,0.34)))]",
    "backdrop-blur-[var(--mq-track-blur,0px)]",
    "shadow-[var(--mq-track-shadow,inset_0_2px_4px_rgba(120,60,40,0.18),inset_0_-1px_0_rgba(255,255,255,0.70),0_1px_0_rgba(255,255,255,0.60))]",
    // Fills, gradients, blur and shadows are all discarded or meaningless once
    // the OS paints high-contrast, so clear the ornament by hand and keep a real
    // border so the control still has bounds.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none]",
    "forced-colors:shadow-none forced-colors:backdrop-blur-none",
  ].join(" "),
  {
    variants: {
      // One treatment today: the sliding chip in its trough is the identity, so
      // there is no second layout to switch to. It stays a real axis so the
      // registry, the docs switcher and a future treatment all have a seam.
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-track-radius:12px] [--mq-track-pad:3px] [--mq-seg-radius:9px]",
        md: "[--mq-track-radius:15px] [--mq-track-pad:4px] [--mq-seg-radius:11px]",
        lg: "[--mq-track-radius:19px] [--mq-track-pad:5px] [--mq-seg-radius:14px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const segmentVariants = cva(
  [
    // `relative z-10` puts every label above the sliding chip, which sits at
    // `z-0` — z-index needs a positioned element, and the divider pseudo needs a
    // positioned host too.
    "relative z-10 inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-[6px]",
    "whitespace-nowrap appearance-none bg-transparent tracking-[-0.01em]",
    "rounded-[var(--mq-seg-radius,11px)] font-medium text-[color:var(--mq-idle,#5b4a3c)]",
    // A bottom rule is always reserved, transparent by default. It is what
    // forced-colors uses to mark the selected segment once fills are discarded,
    // so the marking never changes the box model or shifts the row, and it is
    // only ever coloured under forced-colors.
    "border-0 border-b-2 border-b-transparent",
    // The hairline seam between neighbours. It is decoration on a pseudo-element,
    // never in the accessibility tree, and it retracts around the chip: the
    // component clears `data-divider` on the selected segment and on the one
    // after it, so the slider never crosses a visible seam.
    "before:pointer-events-none before:absolute before:left-0 before:top-[24%]",
    "before:h-[52%] before:w-px before:rounded-full before:content-['']",
    "before:bg-[var(--mq-divider,rgba(120,80,55,0.26))] before:opacity-0",
    "before:transition-opacity before:duration-200 before:ease-out",
    "motion-reduce:before:transition-none",
    "data-[divider=true]:before:opacity-100",
    "forced-colors:before:bg-[CanvasText]",
    // Exactly the properties that change across states: the hover wash and the
    // pre-hydration chip fill (background-color), the label (color) and that
    // chip's depth (box-shadow). Weight changes instantly and is not animated,
    // and no translate/scale/rotate is ever written here, so there is no
    // Tailwind v4 standalone-transform trap to cover.
    "transition-[background-color,color,box-shadow] duration-200 ease-out",
    "motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
    // Selected label: heavier weight AND its own colour, so the state is never
    // carried by colour alone.
    "data-[active=true]:font-bold data-[active=true]:text-[color:var(--mq-active-text,#4a1d13)]",
    // Fallback chip for the moment before the slider has measured, and for the
    // no-JavaScript case: the selected segment paints its own raised surface.
    // Once the slider is live the indicator draws it instead, so the segment
    // drops its own — two chips would double up and the slide would leave a
    // stationary copy behind.
    "data-[active=true]:bg-[var(--mq-chip,#ff9077)]",
    "data-[active=true]:[background-image:var(--mq-chip-grad,none)]",
    "data-[active=true]:shadow-[var(--mq-chip-shadow,0_2px_6px_rgba(75,40,31,0.24))]",
    "group-data-[slider=on]/seg:data-[active=true]:bg-transparent",
    "group-data-[slider=on]/seg:data-[active=true]:[background-image:none]",
    "group-data-[slider=on]/seg:data-[active=true]:shadow-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    // The docs surface sets `data-focus` on the track to render the focused look
    // without synthesising a keyboard event; it lands on the selected segment,
    // which is the one roving focus would actually be on.
    "group-data-[focus=true]/seg:data-[active=true]:outline-2",
    "group-data-[focus=true]/seg:data-[active=true]:outline-offset-[2px]",
    "group-data-[focus=true]/seg:data-[active=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Fills vanish in forced-colors, so the selected segment is marked with a
    // system colour on the rule already reserved in the box model.
    "forced-colors:data-[active=true]:border-b-[CanvasText]",
    "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent",
    // Coarse pointers get a comfortable touch target; this only ever grows the
    // segment, and the chip follows because it is measured from the live box.
    "pointer-coarse:min-h-[44px]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-[30px] px-[14px] text-[length:12px]",
        md: "h-[36px] px-[18px] text-[length:13px]",
        lg: "h-[44px] px-[24px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** The sliding indicator: a raised chip the exact size of the selected segment. */
const indicatorClass = [
  // Behind the labels and out of the pointer's way. It is decoration: the
  // selected segment already carries aria-selected, and a second announcement
  // would be noise.
  "pointer-events-none absolute left-0 top-0 z-0",
  "rounded-[var(--mq-seg-radius,11px)] bg-[var(--mq-chip,#ff9077)]",
  "[background-image:var(--mq-chip-grad,none)]",
  "shadow-[var(--mq-chip-shadow,0_2px_6px_rgba(75,40,31,0.24))]",
  // Motion is OFF until armed, and the attribute that arms it is added a commit
  // after the first measurement. Defaulting to "no transition" means the opening
  // paint can never slide in from the corner, even if arming never runs.
  "transition-none",
  "data-[armed=true]:transition-[translate,width]",
  "data-[armed=true]:duration-[340ms]",
  "data-[armed=true]:ease-[cubic-bezier(0.22,1.25,0.36,1)]",
  // The slide is decoration — the selected segment is already marked by weight,
  // colour and aria-selected — so reduced motion drops the travel and the chip
  // simply appears where it belongs.
  "motion-reduce:data-[armed=true]:transition-none",
  // The chip is a fill; forced-colors neutralises it. Pin it to Canvas so the
  // label above (CanvasText) keeps its contrast, and clear wash and shadow.
  "forced-colors:bg-[Canvas] forced-colors:[background-image:none]",
  "forced-colors:shadow-none",
  // A group-wide disabled control dims its chip with the labels; opacity is not
  // in any transition list here, so this is an instant, non-phantom change.
  "group-data-[disabled=true]/seg:opacity-45",
].join(" ");

type SegmentRect = { left: number; top: number; width: number; height: number };

/**
 * Geometry of whichever segment is currently selected.
 *
 * The selected segment exposes `data-active="true"`, so the attribute is what
 * gets watched rather than the `value` prop — that works for the controlled and
 * the uncontrolled case alike without this hook needing to know which one it is
 * in.
 *
 * `ResizeObserver` covers the two ways a correct measurement goes stale without
 * any attribute changing — the track reflowing, and a webfont landing after
 * first paint and re-measuring every label. `itemsKey` re-attaches the observers
 * when the set of segments itself changes.
 */
function useActiveSegmentRect(
  trackRef: React.RefObject<HTMLDivElement | null>,
  itemsKey: string,
) {
  const [rect, setRect] = React.useState<SegmentRect | null>(null);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const active = track.querySelector<HTMLElement>('[data-active="true"]');
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
      // often do not move the segment, and re-setting state each time would
      // churn.
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
    mutation.observe(track, {
      attributes: true,
      attributeFilter: ["data-active"],
      subtree: true,
    });

    const resize = new ResizeObserver(measure);
    resize.observe(track);
    for (const segment of track.querySelectorAll("[data-segment]")) resize.observe(segment);

    return () => {
      mutation.disconnect();
      resize.disconnect();
    };
  }, [trackRef, itemsKey]);

  return rect;
}

export type SegmentedNavItem = {
  /** Stable identity for React, measurement and selection. */
  id: string;
  label: React.ReactNode;
  /**
   * Id of the `role="tabpanel"` this segment reveals, wired as `aria-controls`.
   * Pass it ONLY while that panel is mounted; omit it and the control is a plain
   * view switcher, which `role="tab"` also permits.
   */
  controls?: string;
  /** Optional leading icon (any node); rendered aria-hidden before the label. */
  icon?: React.ReactNode;
  /** Skipped by roving navigation and not selectable. */
  disabled?: boolean;
};

export type SegmentedNavProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "onChange" | "children"
> & {
  items: readonly SegmentedNavItem[];
  /** Uncontrolled initial selection. Falls back to the first enabled item. */
  defaultValue?: string;
  /** Controlled selection. When set, `onValueChange` owns updates. */
  value?: string;
  onValueChange?: (id: string) => void;
  /** Disables every segment at once (and dims the chip with them). */
  disabled?: boolean;
  material?: SegmentedNavMaterial;
  variant?: SegmentedNavVariant;
  size?: SegmentedNavSize;
};

export function SegmentedNav({
  "aria-label": ariaLabel = "Views",
  className,
  defaultValue,
  disabled = false,
  items,
  material = "clay",
  onKeyDown,
  onValueChange,
  ref,
  size = "md",
  value,
  variant = "default",
  ...props
}: SegmentedNavProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<string | undefined>(
    () => defaultValue ?? items.find((item) => !item.disabled)?.id,
  );
  const active = isControlled ? value : internal;

  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null);
  const segmentRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const itemsKey = items.map((item) => item.id).join("|");
  const rect = useActiveSegmentRect(trackRef, itemsKey);

  // Arming is a one-way DOM flag rather than React state: it must flip on the
  // commit *after* the chip is first positioned, it never affects what React
  // renders, and setting state here would only buy a second render pass.
  React.useEffect(() => {
    if (rect && indicatorRef.current) indicatorRef.current.dataset.armed = "true";
  }, [rect]);

  const activeIndex = items.findIndex((item) => item.id === active);

  const enabledIndices = React.useMemo(
    () => items.map((item, index) => (item.disabled ? -1 : index)).filter((index) => index >= 0),
    [items],
  );

  // Exactly one segment is in the tab order (the roving contract). It is the
  // selected one; if nothing is selected — every id unknown, the list empty, or
  // the selected segment itself disabled — the first enabled segment takes the
  // entry stop, so the control is never left unreachable by keyboard. When every
  // segment is disabled there is deliberately nothing to reach.
  const rovingIndex =
    activeIndex >= 0 && !items[activeIndex].disabled
      ? activeIndex
      : (enabledIndices[0] ?? 0);

  const select = (id: string) => {
    if (!isControlled) setInternal(id);
    onValueChange?.(id);
  };

  /**
   * Selects the segment at `index` and MOVES focus onto it, which is the roving
   * contract for a tablist with automatic activation. Focus is moved right here
   * in the handler that caused the change — never from an effect — so React 19's
   * set-state-in-effect rule has nothing to complain about and the two never
   * drift apart.
   */
  const selectAndFocus = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    select(item.id);
    segmentRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || enabledIndices.length === 0) return;
    // Position of the current selection *within the enabled subset*, so a
    // disabled segment is stepped over rather than landed on.
    const position = enabledIndices.indexOf(activeIndex);
    switch (event.key) {
      case "ArrowRight": {
        event.preventDefault();
        const next = position === -1 ? 0 : (position + 1) % enabledIndices.length;
        selectAndFocus(enabledIndices[next]);
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        const next =
          position === -1
            ? enabledIndices.length - 1
            : (position - 1 + enabledIndices.length) % enabledIndices.length;
        selectAndFocus(enabledIndices[next]);
        break;
      }
      case "Home":
        event.preventDefault();
        selectAndFocus(enabledIndices[0]);
        break;
      case "End":
        event.preventDefault();
        selectAndFocus(enabledIndices[enabledIndices.length - 1]);
        break;
      default:
        // Enter and Space are deliberately absent: the segments are real
        // `<button>`s, so the browser already activates them and synthesising a
        // second path would double-fire.
        break;
    }
  };

  return (
    <div
      {...props}
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className={cn(MATERIAL_TOKENS[material], trackVariants({ size, variant }), className)}
      data-disabled={disabled ? "true" : undefined}
      data-material={material}
      // Until the chip has measured — before hydration, or with JavaScript off —
      // this stays "off" and the selected segment paints its own raised chip.
      // The slider only takes over once it can actually be positioned, so the
      // selection is never left unmarked.
      data-slider={rect ? "on" : "off"}
      onKeyDown={handleKeyDown}
      ref={(node) => {
        trackRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      role="tablist"
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
        />
      ) : null}
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        // The seam retracts around the chip: no divider on the selected segment
        // and none on the segment straight after it, so the slider never has to
        // cross a visible line.
        const showDivider = index > 0 && index !== activeIndex && index - 1 !== activeIndex;
        return (
          <button
            aria-controls={item.controls}
            aria-selected={isActive}
            className={segmentVariants({ size })}
            data-active={isActive ? "true" : undefined}
            data-divider={showDivider ? "true" : "false"}
            data-segment=""
            disabled={disabled || item.disabled}
            key={item.id}
            onClick={() => select(item.id)}
            ref={(node) => {
              segmentRefs.current[index] = node;
            }}
            role="tab"
            tabIndex={index === rovingIndex ? 0 : -1}
            type="button"
          >
            {item.icon !== undefined ? (
              <span aria-hidden="true" className="inline-flex items-center [&_svg]:size-[1.15em]">
                {item.icon}
              </span>
            ) : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export type SegmentedNavVariantProps = VariantProps<typeof trackVariants>;

export { segmentVariants, trackVariants };
