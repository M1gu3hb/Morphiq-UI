"use client";

import * as React from "react";
import { MousePointerClick } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Context Menu
 *
 * A right-click (or keyboard-invoked) menu over a target region. On the
 * `contextmenu` event the region cancels the platform menu and opens its own
 * `role="menu"` at the pointer, positioned absolutely inside a `relative
 * isolate` wrapper and CLAMPED so it can never spill past the wrapper's edges.
 * The same menu can be summoned from the keyboard — Shift+F10 or the dedicated
 * ContextMenu key while the region is focused — in which case it opens at the
 * region's centre.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The region surface is Button's PRIMARY-intent
 * material verbatim (resting shadow, a hover lift, an active SINK into a pressed
 * inset well); the menu is Split Button's menu recipe verbatim.
 *
 *   <ContextMenu
 *     material="clay"
 *     size="md"
 *     title="Project canvas"
 *     items={[
 *       { id: "cut", label: "Cut", icon: <Scissors />, onSelect: cut },
 *       { id: "copy", label: "Copy", icon: <Copy />, onSelect: copy },
 *       { id: "paste", label: "Paste", icon: <ClipboardPaste />, onSelect: paste },
 *     ]}
 *   />
 *
 * Keyboard (menu): ArrowDown/ArrowUp move focus among items (roving — focus
 * MOVES to the item, skipping disabled ones), Home/End jump to the ends,
 * Enter/Space activate (the items are real buttons), Escape closes and RETURNS
 * focus to the region, Tab closes, and a pointer press outside closes.
 *
 * Local theming knobs (override from a parent or `className` to retheme without
 * forking the recipe — each is read with a literal fallback):
 *
 *   --mq-body / --mq-lit / --mq-edge   region surface, top highlight, extruded edge
 *   --mq-text / --mq-brd / --mq-ring   region label, border, focus ring
 *   --mq-accent                        menu leading-icon tint
 *   --mq-menu / --mq-menu-brd          menu surface + border
 *   --mq-menu-ink / --mq-menu-hover    menu label + hover/focus wash
 *   --mq-menu-grad / --mq-menu-blur    menu wash + backdrop blur
 *   --mq-menu-shadow                   menu elevation
 */

/**
 * Palette per material. Declared once on the region (which is also the
 * positioning wrapper); the region surface and the menu inherit it through CSS.
 * The values are Button's PRIMARY intent verbatim, so the region label contrast
 * contract is inherited too (>= 4.5:1 on every material). `adaptive`
 * additionally flips on `prefers-color-scheme` because it names only opaque
 * surfaces that flip together with the labels on them.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817]",
    "[--mq-accent:#c9482f]",
    "[--mq-menu:#f4ece0] [--mq-menu-brd:rgba(120,80,55,0.22)] [--mq-menu-ink:#33261e]",
    "[--mq-menu-hover:rgba(201,72,47,0.12)] [--mq-menu-blur:0px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.50),rgba(151,92,58,0.05))]",
    "[--mq-menu-shadow:0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14)]",
  ].join(" "),
  glass: [
    "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817]",
    "[--mq-accent:#171817]",
    // A frosted, light menu so the item labels stay legible however dark the
    // region surface reads over its backdrop.
    "[--mq-menu:rgba(244,247,248,0.90)] [--mq-menu-brd:rgba(255,255,255,0.72)] [--mq-menu-ink:#1e1e1b]",
    "[--mq-menu-hover:rgba(23,24,23,0.06)] [--mq-menu-blur:16px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0))]",
    "[--mq-menu-shadow:0_16px_34px_rgba(24,20,40,0.18),0_4px_12px_rgba(24,20,40,0.12)]",
  ].join(" "),
  skeuo: [
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
    "[--mq-accent:#3f3e39]",
    // Greige, warm — the #e6e3da family — so the menu belongs to the same moulded
    // material as the region that spawned it.
    "[--mq-menu:#e6e3da] [--mq-menu-brd:rgba(25,25,23,0.30)] [--mq-menu-ink:#23231f]",
    "[--mq-menu-hover:rgba(255,255,255,0.50)] [--mq-menu-blur:0px]",
    "[--mq-menu-grad:linear-gradient(180deg,#f0ede6,#e6e3da)]",
    "[--mq-menu-shadow:0_16px_30px_rgba(38,36,31,0.28),0_4px_10px_rgba(38,36,31,0.18)]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  adaptive: [
    "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
    "[--mq-accent:#171817]",
    "[--mq-menu:#ffffff] [--mq-menu-brd:rgba(23,24,23,0.14)] [--mq-menu-ink:#1c1c19]",
    "[--mq-menu-hover:rgba(23,24,23,0.06)] [--mq-menu-blur:0px]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // wash onto the one material meant to have none.
    "[--mq-menu-grad:none]",
    "[--mq-menu-shadow:0_14px_30px_rgba(20,20,18,0.16),0_3px_8px_rgba(20,20,18,0.10)]",
    "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
    "dark:[--mq-accent:#f1efe9]",
    "dark:[--mq-menu:#26262a] dark:[--mq-menu-brd:rgba(255,255,255,0.16)] dark:[--mq-menu-ink:#f1efe9]",
    "dark:[--mq-menu-hover:rgba(255,255,255,0.08)]",
    "dark:[--mq-menu-shadow:0_14px_30px_rgba(0,0,0,0.55),0_3px_8px_rgba(0,0,0,0.40)]",
  ].join(" "),
} as const;

type ContextMenuMaterial = keyof typeof MATERIAL_TOKENS;
type ContextMenuSize = "sm" | "md" | "lg";
type ContextMenuVariant = "default";

/** Padding kept between the menu and the wrapper's inner edges when clamping. */
const CLAMP_PADDING = 8;

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so the docs surface can render the focused look
 * without synthesising a keyboard event. The width/offset/colour together fully
 * replace the UA outline, so it is never reset with `outline-none`.
 */
const FOCUS_RING =
  "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:z-10 data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Shared region chrome. `translate`, not `transform`: Tailwind v4 writes its
 * `translate-*` utilities to the standalone `translate` property, so the
 * transition names `translate` explicitly — every property in the list is one
 * some state actually changes, and none is phantom. The disabled look is driven
 * by `data-disabled` (a `<div>` cannot carry the native `:disabled` state);
 * press travel is cancelled but the resting bounds stay.
 */
const REGION_BASE = [
  "relative isolate flex select-none flex-col items-center justify-center text-center",
  "border font-bold tracking-[-0.01em] cursor-context-menu",
  "text-[color:var(--mq-text,#4a1d13)] forced-colors:text-[CanvasText]",
  "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
  "motion-reduce:transition-none",
  FOCUS_RING,
  "forced-colors:border-[CanvasText]",
  "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-55",
  "data-[disabled=true]:translate-y-0 data-[disabled=true]:shadow-none",
].join(" ");

/**
 * The four material recipes, PRIMARY-intent values inlined. Press physics per
 * material: clay sinks ~3px into a warm inset well, skeuo ~4px, glass/adaptive
 * ~1px — the hover lift grows the shadow, the active state SINKS into the inset.
 * `motion-reduce` (on the base) drops the travel, but `:active` still applies the
 * inset instantly, so the tactile feedback survives even without animation.
 */
const MATERIAL_SURFACE: Record<ContextMenuMaterial, string> = {
  clay: [
    "bg-[var(--mq-body,#ff9077)] border-[var(--mq-brd,rgba(120,40,25,0.16))]",
    "shadow-[inset_0_3px_3px_rgba(255,255,255,0.55),inset_0_-4px_6px_rgba(120,40,25,0.18),0_6px_0_var(--mq-edge,#c9482f),0_12px_20px_rgba(75,40,31,0.18)]",
    "hover:-translate-y-[2px]",
    "hover:shadow-[inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(120,40,25,0.18),0_8px_0_var(--mq-edge,#c9482f),0_16px_26px_rgba(75,40,31,0.2)]",
    "active:translate-y-[3px]",
    "active:shadow-[inset_0_3px_7px_rgba(120,40,25,0.32),0_2px_0_var(--mq-edge,#c9482f)]",
  ].join(" "),
  glass: [
    "bg-[var(--mq-body,rgba(23,24,23,0.74))] border-[var(--mq-brd,rgba(255,255,255,0.28))]",
    "backdrop-blur-[14px] backdrop-saturate-[160%]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_26px_rgba(24,20,40,0.2)]",
    "hover:-translate-y-[1px] hover:backdrop-blur-[18px]",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_32px_rgba(24,20,40,0.26)]",
    "active:translate-y-[1px]",
    "active:shadow-[inset_0_2px_7px_rgba(24,20,40,0.3)]",
    "forced-colors:[backdrop-filter:none]",
  ].join(" "),
  skeuo: [
    "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] border-[var(--mq-brd,rgba(0,0,0,0.5))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_5px_0_var(--mq-edge,#131311),0_10px_16px_rgba(38,36,31,0.28)]",
    "hover:-translate-y-[1px] hover:brightness-[1.08]",
    "active:translate-y-[4px]",
    "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
  ].join(" "),
  adaptive: [
    "bg-[var(--mq-body,#171817)] border-[var(--mq-brd,rgba(0,0,0,0.4))]",
    "shadow-[0_1px_2px_rgba(20,20,18,0.12)]",
    "hover:shadow-[0_5px_14px_rgba(20,20,18,0.18)]",
    "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
    // Coarse pointers get a comfortable touch target; only ever grows the region.
    "pointer-coarse:min-h-[48px]",
  ].join(" "),
};

/** The target region: material surface + size, with local `--mq-radius`. */
const regionVariants = cva(cn(REGION_BASE, "rounded-[var(--mq-radius,16px)]"), {
  variants: {
    material: MATERIAL_SURFACE,
    size: {
      sm: "min-h-[120px] min-w-[220px] gap-[8px] px-[20px] py-[18px] text-[12px]/[1.4] [--mq-radius:14px]",
      md: "min-h-[148px] min-w-[280px] gap-[10px] px-[26px] py-[22px] text-[13px]/[1.45] [--mq-radius:16px]",
      lg: "min-h-[176px] min-w-[340px] gap-[12px] px-[32px] py-[26px] text-[14px]/[1.5] [--mq-radius:20px]",
    },
  },
  defaultVariants: { material: "clay", size: "md" },
});

/** The region's cue glyph, scaled with the region size. */
const ICON_SIZE: Record<ContextMenuSize, string> = {
  sm: "size-[26px]",
  md: "size-[30px]",
  lg: "size-[34px]",
};

/** Menu width band per size. */
const MENU_WIDTH: Record<ContextMenuSize, string> = {
  sm: "min-w-[180px] max-w-[240px]",
  md: "min-w-[204px] max-w-[280px]",
  lg: "min-w-[228px] max-w-[320px]",
};

/** Menu-item box per size. */
const MENU_ITEM_SIZE: Record<ContextMenuSize, string> = {
  sm: "h-[32px] px-[10px] text-[12px]/[1]",
  md: "h-[36px] px-[12px] text-[13px]/[1]",
  lg: "h-[40px] px-[14px] text-[14px]/[1]",
};

/**
 * Menu entrance keyframe, shipped with the component instead of a global sheet.
 * React 19 hoists this `<style>` and dedupes it by `href`, so a page with many
 * context menus emits one rule. The keyframe's resting end-state is the menu's
 * base style, so `motion-reduce:animate-none` keeps the menu fully open — only
 * the small rise is dropped. A UNIQUE href per component.
 */
const MENU_KEYFRAMES = `
@keyframes mq-cm-menu-in{from{opacity:0;translate:0 -6px}to{opacity:1;translate:0 0}}`;

function MenuKeyframes() {
  return (
    <style href="mq-context-menu" precedence="medium">
      {MENU_KEYFRAMES}
    </style>
  );
}

/** A single action in the context menu. */
export type ContextMenuItem = {
  /** Stable key; also the React list key. */
  id: string;
  label: string;
  /** Optional leading glyph (a lucide icon element). Decorative; sized by CSS. */
  icon?: React.ReactNode;
  /** Called when the item is chosen, before the menu closes. */
  onSelect?: () => void;
  /** Skipped by roving navigation and non-activatable. */
  disabled?: boolean;
};

type ContextMenuOwnProps = {
  /** Actions revealed by right-click / keyboard invocation. */
  items: ContextMenuItem[];
  material?: ContextMenuMaterial;
  size?: ContextMenuSize;
  /** Single presentation variant; reserved for future tone axes. */
  variant?: ContextMenuVariant;
  /** Optional visible heading shown above the hint inside the region. */
  title?: React.ReactNode;
  /** Visible hint text. Also the region's cue that a context menu exists. */
  hint?: React.ReactNode;
  /** Accessible name for the region. */
  regionLabel?: string;
  /** Accessible name for the menu. */
  menuLabel?: string;
  /** Inert region: no menu opens, and the region leaves the tab order. */
  disabled?: boolean;
};

/**
 * `Omit` the own props off the native div props so the rest — `data-*`,
 * `aria-*`, extra `className` handling — behaves as expected. `ComponentProps
 * WithoutRef` because the region needs its own internal ref for positioning and
 * focus return, so a caller ref has nowhere to live here.
 */
export type ContextMenuProps = ContextMenuOwnProps &
  Omit<React.ComponentPropsWithoutRef<"div">, keyof ContextMenuOwnProps>;

const MENU_ITEM_BASE = cn(
  "group/cmi flex w-full items-center gap-[10px] rounded-[10px]",
  "cursor-pointer appearance-none border-0 bg-transparent text-left",
  "font-bold tracking-[-0.01em] text-[color:var(--mq-menu-ink,#33261e)]",
  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
  // The focused item is the roving active item, so the wash is keyed off real
  // `:focus` (which programmatic focus triggers) as well as hover.
  "hover:bg-[var(--mq-menu-hover,rgba(201,72,47,0.12))]",
  "focus:bg-[var(--mq-menu-hover,rgba(201,72,47,0.12))]",
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--mq-ring,#171817)]",
  "disabled:cursor-not-allowed disabled:opacity-45",
  // Fills are discarded in forced colours; the active item takes a system mark.
  "forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText]",
  "forced-colors:hover:bg-[Highlight] forced-colors:hover:text-[HighlightText]",
  "forced-colors:focus-visible:outline-[Highlight]",
);

export function ContextMenu({
  className,
  disabled = false,
  hint = "Right-click to open the menu",
  items,
  material = "clay",
  menuLabel = "Context menu",
  regionLabel = "Interactive region — right-click, or press Shift+F10, to open the context menu",
  size = "md",
  title,
  variant = "default",
  ...rest
}: ContextMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [coords, setCoords] = React.useState<{ x: number; y: number } | null>(null);
  // `placed` gates the reveal: the menu is mounted invisible at its raw pointer
  // coordinates so it can be measured, then clamped, then faded in — so an
  // edge-hugging open never flashes at an unclamped position, even with the
  // entrance animation switched off under prefers-reduced-motion.
  const [placed, setPlaced] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const menuId = React.useId();
  const regionRef = React.useRef<HTMLDivElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndices = React.useMemo(
    () => items.map((item, index) => (item.disabled ? -1 : index)).filter((index) => index >= 0),
    [items],
  );

  const closeAndFocusRegion = React.useCallback(() => {
    setOpen(false);
    regionRef.current?.focus();
  }, []);

  const openAt = React.useCallback(
    (x: number, y: number, edge: "first" | "last") => {
      setCoords({ x, y });
      setPlaced(false);
      if (enabledIndices.length === 0) {
        setActiveIndex(-1);
      } else {
        setActiveIndex(edge === "last" ? enabledIndices[enabledIndices.length - 1] : enabledIndices[0]);
      }
      setOpen(true);
    },
    [enabledIndices],
  );

  // Clamp the menu inside the wrapper once it has a measurable size, then reveal.
  // Clamping is idempotent — clamp(clamp(x)) === clamp(x) — so setting the
  // clamped value and re-running converges after one adjustment; once stable we
  // flip `placed`. A plain effect (not `useLayoutEffect`) keeps this SSR-clean;
  // the pre-clamp frame is hidden by `placed` rather than by layout timing.
  React.useEffect(() => {
    if (!open || !coords) return;
    const region = regionRef.current;
    const menu = menuRef.current;
    if (!region || !menu) return;
    const r = region.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    const maxX = Math.max(CLAMP_PADDING, r.width - m.width - CLAMP_PADDING);
    const maxY = Math.max(CLAMP_PADDING, r.height - m.height - CLAMP_PADDING);
    const nextX = Math.min(Math.max(coords.x, CLAMP_PADDING), maxX);
    const nextY = Math.min(Math.max(coords.y, CLAMP_PADDING), maxY);
    if (nextX !== coords.x || nextY !== coords.y) {
      setCoords({ x: nextX, y: nextY });
    } else {
      setPlaced(true);
    }
  }, [open, coords]);

  // On open, move focus into the menu — to the active item, or to the menu
  // surface itself when every item is disabled so keyboard focus is never lost.
  React.useEffect(() => {
    if (!open) return;
    const target = activeIndex >= 0 ? itemRefs.current[activeIndex] : menuRef.current;
    target?.focus();
  }, [open, activeIndex]);

  // A pointer press anywhere outside the wrapper closes the menu. Registered only
  // while open, and cleaned up on close/unmount.
  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!regionRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function selectItem(index: number) {
    const item = items[index];
    if (!item || item.disabled) return;
    item.onSelect?.();
    closeAndFocusRegion();
  }

  function handleContextMenu(event: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    // Cancel the platform menu and open ours at the pointer, relative to the
    // wrapper's own box.
    event.preventDefault();
    const rect = regionRef.current?.getBoundingClientRect();
    if (!rect) return;
    openAt(event.clientX - rect.left, event.clientY - rect.top, "first");
  }

  function handleRegionKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const isContextInvoke = event.key === "ContextMenu" || (event.shiftKey && event.key === "F10");
    if (!isContextInvoke) return;
    // Keyboard summons the menu at the region's centre.
    event.preventDefault();
    const rect = regionRef.current?.getBoundingClientRect();
    openAt(rect ? rect.width / 2 : 0, rect ? rect.height / 2 : 0, "first");
  }

  function moveActive(direction: 1 | -1) {
    if (enabledIndices.length === 0) return;
    const position = enabledIndices.indexOf(activeIndex);
    const nextPosition =
      position === -1
        ? direction === 1
          ? 0
          : enabledIndices.length - 1
        : (position + direction + enabledIndices.length) % enabledIndices.length;
    setActiveIndex(enabledIndices[nextPosition]);
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        if (enabledIndices.length > 0) setActiveIndex(enabledIndices[0]);
        break;
      case "End":
        event.preventDefault();
        if (enabledIndices.length > 0) setActiveIndex(enabledIndices[enabledIndices.length - 1]);
        break;
      case "Escape":
        event.preventDefault();
        // Absorb the dismiss key so it does not also close an enclosing
        // Escape-closable ancestor (a dialog or menu the region sits in).
        event.stopPropagation();
        closeAndFocusRegion();
        break;
      case "Tab":
        // Tab leaves the menu; close it and hand focus back to the region so the
        // next Tab continues from the region, never from an unmounting item.
        event.preventDefault();
        closeAndFocusRegion();
        break;
      default:
        break;
    }
  }

  return (
    <div
      {...rest}
      aria-controls={open ? menuId : undefined}
      aria-disabled={disabled || undefined}
      aria-haspopup="menu"
      aria-label={regionLabel}
      className={cn(regionVariants({ material, size }), MATERIAL_TOKENS[material], className)}
      data-disabled={disabled ? "true" : undefined}
      data-material={material}
      data-variant={variant}
      onContextMenu={handleContextMenu}
      onKeyDown={handleRegionKeyDown}
      ref={regionRef}
      tabIndex={disabled ? -1 : 0}
    >
      <MenuKeyframes />
      <MousePointerClick
        aria-hidden="true"
        className={cn(ICON_SIZE[size], "shrink-0 opacity-90 forced-colors:text-[CanvasText]")}
      />
      {title != null ? (
        <span className="font-extrabold leading-[1.15] text-[1.15em]">{title}</span>
      ) : null}
      <span className="font-semibold leading-[1.3] opacity-90">{hint}</span>

      {open && coords ? (
        <div
          aria-label={menuLabel}
          className={cn(
            "absolute z-50 p-[6px]",
            MENU_WIDTH[size],
            "rounded-[14px] border bg-[var(--mq-menu,#f4ece0)] border-[var(--mq-menu-brd,rgba(120,80,55,0.22))]",
            "[background-image:var(--mq-menu-grad,none)] backdrop-blur-[var(--mq-menu-blur,0px)]",
            "text-[color:var(--mq-menu-ink,#33261e)]",
            "shadow-[var(--mq-menu-shadow,0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14))]",
            // Invisible until measured + clamped; then fade/rise in. The resting
            // end-state equals the base style, so `motion-reduce:animate-none`
            // leaves the menu fully open.
            placed
              ? "animate-[mq-cm-menu-in_150ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none"
              : "opacity-0",
            // Fills, washes and shadows are discarded in forced colours; a real
            // border keeps the surface's bounds and a solid Canvas backs the items.
            "forced-colors:border-[CanvasText] forced-colors:shadow-none forced-colors:bg-[Canvas]",
            "forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
          )}
          id={menuId}
          onContextMenu={(event) => {
            // A right-click on the open menu must not bubble to the region and
            // reposition the menu out from under the pointer.
            event.preventDefault();
            event.stopPropagation();
          }}
          onKeyDown={handleMenuKeyDown}
          ref={menuRef}
          role="menu"
          style={{ left: coords.x, top: coords.y }}
          tabIndex={-1}
        >
          <ul className="m-0 flex list-none flex-col gap-[2px] p-0" role="none">
            {items.map((item, index) => (
              <li key={item.id} role="none">
                <button
                  className={cn(MENU_ITEM_BASE, MENU_ITEM_SIZE[size])}
                  disabled={item.disabled}
                  onClick={() => selectItem(index)}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  role="menuitem"
                  tabIndex={index === activeIndex ? 0 : -1}
                  type="button"
                >
                  {item.icon != null ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid shrink-0 place-items-center text-[color:var(--mq-accent,#c9482f)]",
                        "[&_svg]:size-[1.05em] [&_svg]:shrink-0 forced-colors:text-[CanvasText]",
                      )}
                    >
                      {item.icon}
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export type ContextMenuVariantProps = VariantProps<typeof regionVariants>;

export { regionVariants };
