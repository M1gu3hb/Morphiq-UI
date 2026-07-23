"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Menubar
 *
 * An application menu bar (File / Edit / View) implementing the full WAI-ARIA
 * menubar pattern by hand. A `role="menubar"` row of `role="menuitem"` buttons,
 * each with `aria-haspopup="menu"` and `aria-expanded`, opens a vertical
 * `role="menu"` of `role="menuitem"` actions. Only one submenu is open at a time.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The submenu reuses Split Button's hand-rolled menu
 * internals (roving focus, disabled-skipping, Escape/Tab, click-outside, focus
 * return); the menubar row adds horizontal roving on top.
 *
 *   <Menubar
 *     aria-label="Document menu"
 *     material="clay"
 *     size="md"
 *     menus={[
 *       { id: "file", label: "File", items: [
 *         { id: "new", label: "New file", icon: <FilePlus />, onSelect: newFile },
 *         { id: "open", label: "Open…", icon: <FolderOpen />, onSelect: open },
 *       ] },
 *       { id: "edit", label: "Edit", items: [ … ] },
 *     ]}
 *   />
 *
 * Keyboard: on the menubar row ArrowLeft/ArrowRight rove among top items
 * (wrapping), Home/End jump to the ends, ArrowDown/Enter/Space open the submenu
 * on its first item and ArrowUp opens it on the last. Inside a submenu
 * ArrowUp/ArrowDown rove (skipping disabled items and wrapping), Home/End jump
 * to the ends, ArrowLeft/ArrowRight move to the adjacent top menu and open it,
 * Enter/Space activate (the items are real buttons), Escape closes and returns
 * focus to the top item, and Tab leaves the menubar entirely. A pointer press
 * outside closes; hovering another top item while a menu is open switches to it.
 *
 * Local theming knobs (each read with a literal fallback):
 *
 *   --mq-bar / --mq-bar-brd            menubar surface + border
 *   --mq-bar-grad / --mq-bar-shadow    menubar lighting + depth (a shallow trough)
 *   --mq-ink                           idle top-item label
 *   --mq-hover-bg                      hover wash on a top item
 *   --mq-open-bg / --mq-open-text      wash + label of a top item whose menu is open
 *   --mq-menu / --mq-menu-brd          submenu surface + border
 *   --mq-menu-ink / --mq-menu-hover    submenu label + hover/focus wash
 *   --mq-menu-grad / --mq-menu-blur    submenu wash + backdrop blur
 *   --mq-menu-shadow                   submenu elevation
 *   --mq-accent                        submenu leading-icon tint
 *   --mq-ring                          focus ring
 */

/**
 * Palette per material. Declared once on the root landmark; the bar, the top
 * items and every submenu inherit it through CSS. The bar takes the recessed
 * (trough) half of each material's vocabulary — a menu bar reads as sunk into
 * the chrome — while the submenu reuses Split Button's menu tokens verbatim, so
 * the label-contrast contract (>= 4.5:1 on every material) is inherited too.
 * `adaptive` additionally flips on `prefers-color-scheme` because it names only
 * opaque surfaces that flip together with the labels on them.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-bar:#efe7db] [--mq-bar-brd:rgba(120,80,55,0.20)]",
    "[--mq-bar-grad:linear-gradient(180deg,rgba(151,92,58,0.12),rgba(255,255,255,0.34))]",
    "[--mq-bar-shadow:inset_0_2px_4px_rgba(120,60,40,0.18),inset_0_-1px_0_rgba(255,255,255,0.70),0_1px_0_rgba(255,255,255,0.60)]",
    "[--mq-ink:#5b4a3c] [--mq-hover-bg:rgba(255,255,255,0.60)]",
    "[--mq-open-bg:rgba(255,144,119,0.20)] [--mq-open-text:#4a1d13]",
    "[--mq-accent:#c9482f]",
    "[--mq-menu:#f4ece0] [--mq-menu-brd:rgba(120,80,55,0.22)] [--mq-menu-ink:#33261e]",
    "[--mq-menu-hover:rgba(201,72,47,0.12)] [--mq-menu-blur:0px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.50),rgba(151,92,58,0.05))]",
    "[--mq-menu-shadow:0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-bar:rgba(255,255,255,0.62)] [--mq-bar-brd:rgba(255,255,255,0.75)]",
    "[--mq-bar-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_6px_18px_rgba(24,20,40,0.14)]",
    "[--mq-ink:#2f2f29] [--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-open-bg:rgba(255,255,255,0.60)] [--mq-open-text:#1b1c1b]",
    "[--mq-accent:#171817]",
    // A frosted, light submenu so the actions stay legible however dark the page
    // behind the bar reads.
    "[--mq-menu:rgba(244,247,248,0.90)] [--mq-menu-brd:rgba(255,255,255,0.72)] [--mq-menu-ink:#1e1e1b]",
    "[--mq-menu-hover:rgba(23,24,23,0.06)] [--mq-menu-blur:16px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0))]",
    "[--mq-menu-shadow:0_16px_34px_rgba(24,20,40,0.18),0_4px_12px_rgba(24,20,40,0.12)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-bar:#cfcbc2] [--mq-bar-brd:rgba(25,25,23,0.32)]",
    "[--mq-bar-grad:linear-gradient(180deg,#c4c0b7,#dbd7ce)]",
    "[--mq-bar-shadow:inset_0_2px_4px_rgba(0,0,0,0.28),inset_0_-1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(255,255,255,0.62)]",
    "[--mq-ink:#33322d] [--mq-hover-bg:rgba(255,255,255,0.40)]",
    "[--mq-open-bg:#f6f4ee] [--mq-open-text:#23231f]",
    "[--mq-accent:#3f3e39]",
    // Warm greige, the #e6e3da family, so the submenu belongs to the same moulded
    // material as the bar that spawned it.
    "[--mq-menu:#e6e3da] [--mq-menu-brd:rgba(25,25,23,0.30)] [--mq-menu-ink:#23231f]",
    "[--mq-menu-hover:rgba(255,255,255,0.50)] [--mq-menu-blur:0px]",
    "[--mq-menu-grad:linear-gradient(180deg,#f0ede6,#e6e3da)]",
    "[--mq-menu-shadow:0_16px_30px_rgba(38,36,31,0.28),0_4px_10px_rgba(38,36,31,0.18)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme,
  // and every surface it names is opaque and flips together with the labels.
  adaptive: [
    "[--mq-bar:#f1f0ec] [--mq-bar-brd:rgba(23,24,23,0.14)]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-bar-grad:none]",
    "[--mq-bar-shadow:inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.07)]",
    "[--mq-ink:#55554e] [--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-open-bg:#ffffff] [--mq-open-text:#1c1c19]",
    "[--mq-accent:#171817]",
    "[--mq-menu:#ffffff] [--mq-menu-brd:rgba(23,24,23,0.14)] [--mq-menu-ink:#1c1c19]",
    "[--mq-menu-hover:rgba(23,24,23,0.06)] [--mq-menu-blur:0px]",
    "[--mq-menu-grad:none]",
    "[--mq-menu-shadow:0_14px_30px_rgba(20,20,18,0.16),0_3px_8px_rgba(20,20,18,0.10)]",
    "[--mq-ring:#171817]",
    "dark:[--mq-bar:#26262a] dark:[--mq-bar-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-bar-shadow:inset_0_0_0_rgba(0,0,0,0),0_1px_2px_rgba(0,0,0,0.40)]",
    "dark:[--mq-ink:#b9b7b0] dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-open-bg:#3a3a40] dark:[--mq-open-text:#f1efe9]",
    "dark:[--mq-accent:#f1efe9]",
    "dark:[--mq-menu:#26262a] dark:[--mq-menu-brd:rgba(255,255,255,0.16)] dark:[--mq-menu-ink:#f1efe9]",
    "dark:[--mq-menu-hover:rgba(255,255,255,0.08)]",
    "dark:[--mq-menu-shadow:0_14px_30px_rgba(0,0,0,0.55),0_3px_8px_rgba(0,0,0,0.40)]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type MenubarMaterial = keyof typeof MATERIAL_TOKENS;
type MenubarVariant = "default";
type MenubarSize = "sm" | "md" | "lg";

/**
 * Submenu entrance keyframe, shipped with the component instead of a global
 * sheet. React 19 hoists this `<style>` and dedupes it by `href`, so a page with
 * many menubars emits one rule. The keyframe's resting end-state is the submenu's
 * base style, so `motion-reduce:animate-none` keeps it fully open — only the
 * small rise is dropped.
 */
const MENUBAR_KEYFRAMES = `
@keyframes mq-menubar-in{from{opacity:0;translate:0 -6px}to{opacity:1;translate:0 0}}`;

function MenubarKeyframes() {
  return (
    <style href="mq-menubar" precedence="medium">
      {MENUBAR_KEYFRAMES}
    </style>
  );
}

const barVariants = cva(
  [
    // `relative` is the offset parent each submenu (absolutely positioned under
    // its own top item) is measured against. A menu bar is a shallow trough: the
    // recessed half of each material's vocabulary.
    "relative inline-flex w-fit max-w-full items-center gap-[2px]",
    "rounded-[var(--mq-bar-radius,14px)] border border-[var(--mq-bar-brd,rgba(120,80,55,0.20))]",
    "bg-[var(--mq-bar,#efe7db)] p-[var(--mq-bar-pad,4px)]",
    "[background-image:var(--mq-bar-grad,linear-gradient(180deg,rgba(151,92,58,0.12),rgba(255,255,255,0.34)))]",
    "shadow-[var(--mq-bar-shadow,inset_0_2px_4px_rgba(120,60,40,0.18),inset_0_-1px_0_rgba(255,255,255,0.70),0_1px_0_rgba(255,255,255,0.60))]",
    // Fills, gradients and shadows are all discarded once the OS paints
    // high-contrast, so clear the ornament by hand and keep a real border.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      // One treatment today; kept a real axis so the registry and docs switcher
      // have a seam for a future one.
      variant: { default: "" },
      size: {
        sm: "[--mq-bar-radius:12px] [--mq-bar-pad:3px]",
        md: "[--mq-bar-radius:14px] [--mq-bar-pad:4px]",
        lg: "[--mq-bar-radius:16px] [--mq-bar-pad:5px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const topItemVariants = cva(
  [
    // `group/top` lets the chevron react to the item's own `data-open`.
    "group/top relative z-10 inline-flex shrink-0 cursor-pointer select-none items-center gap-[6px]",
    "whitespace-nowrap appearance-none bg-transparent no-underline tracking-[-0.01em]",
    "rounded-[var(--mq-top-radius,10px)] font-medium text-[color:var(--mq-ink,#5b4a3c)]",
    // A bottom border is always reserved, transparent by default: it mirrors the
    // open marker and is what forced-colors uses to mark the expanded item once
    // fills are discarded — so the marking never changes the box model.
    "border-0 border-b-2 border-b-transparent",
    // Exactly the properties that change across states: the hover/open wash
    // (background-color) and the label (color). Weight changes instantly.
    "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
    // Open state is never colour alone: a wash AND a heavier weight AND a rotated
    // chevron AND aria-expanded all ride together.
    "data-[open=true]:bg-[var(--mq-open-bg,rgba(255,144,119,0.20))]",
    "data-[open=true]:font-bold data-[open=true]:text-[color:var(--mq-open-text,#4a1d13)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Fills vanish in forced-colors, so the expanded item is marked with a system
    // colour on the bottom border already reserved in the box model.
    "forced-colors:data-[open=true]:border-b-[CanvasText] forced-colors:text-[CanvasText]",
    "disabled:cursor-not-allowed disabled:opacity-45",
    // A comfortable touch target on coarse pointers; only ever grows the control.
    "pointer-coarse:min-h-[44px]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-[32px] px-[10px] text-[length:12px] [--mq-top-radius:9px]",
        md: "h-[38px] px-[13px] text-[length:13px] [--mq-top-radius:10px]",
        lg: "h-[44px] px-[16px] text-[length:14px] [--mq-top-radius:12px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const submenuVariants = cva(
  [
    "absolute left-0 top-full z-50 mt-[6px] p-[6px]",
    "rounded-[14px] border bg-[var(--mq-menu,#f4ece0)] border-[var(--mq-menu-brd,rgba(120,80,55,0.22))]",
    "[background-image:var(--mq-menu-grad,none)] backdrop-blur-[var(--mq-menu-blur,0px)]",
    "text-[color:var(--mq-menu-ink,#33261e)]",
    "shadow-[var(--mq-menu-shadow,0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14))]",
    "animate-[mq-menubar-in_160ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
    // Fills, washes and shadows are discarded in forced colours; a real border
    // keeps the bounds and a solid Canvas backs the items.
    "forced-colors:border-[CanvasText] forced-colors:shadow-none forced-colors:bg-[Canvas]",
    "forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-w-[184px] max-w-[280px]",
        md: "min-w-[204px] max-w-[300px]",
        lg: "min-w-[224px] max-w-[320px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const menuItemVariants = cva(
  [
    "group/mi flex w-full items-center rounded-[10px]",
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
    "pointer-coarse:min-h-[44px]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-[34px] min-h-[34px] gap-[9px] px-[10px] text-[length:12px]",
        md: "h-[38px] min-h-[38px] gap-[10px] px-[12px] text-[length:13px]",
        lg: "h-[42px] min-h-[42px] gap-[11px] px-[14px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** A single action inside a top menu. */
export type MenubarItem = {
  /** Stable key; also the React list key. */
  id: string;
  label: string;
  /** Optional leading glyph (a lucide icon element). Decorative; sized by CSS. */
  icon?: React.ReactNode;
  /** Called when the item is chosen, before the submenu closes. */
  onSelect?: () => void;
  /** Skipped by roving navigation and non-activatable. */
  disabled?: boolean;
};

/** A top-level menu: a label in the bar plus the actions it discloses. */
export type MenubarMenu = {
  /** Stable key; also the React list key. */
  id: string;
  label: string;
  items: readonly MenubarItem[];
  /** Renders the top item inert: it cannot be focused or opened. */
  disabled?: boolean;
};

type MenubarOwnProps = {
  /** The top-level menus, left to right. */
  menus: readonly MenubarMenu[];
  material?: MenubarMaterial;
  variant?: MenubarVariant;
  size?: MenubarSize;
};

export type MenubarProps = MenubarOwnProps &
  Omit<React.ComponentPropsWithRef<"nav">, keyof MenubarOwnProps | "children">;

export function Menubar({
  "aria-label": ariaLabel = "Application menu",
  className,
  material = "clay",
  menus,
  ref,
  size = "md",
  variant = "default",
  ...props
}: MenubarProps) {
  // `openIndex` is the single open submenu (only one at a time); `focusedTop` is
  // the roving tab stop in the menubar row; `activeItem` is the roving item
  // inside the open submenu.
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [focusedTop, setFocusedTop] = React.useState(() => {
    const first = menus.findIndex((menu) => !menu.disabled);
    return first === -1 ? 0 : first;
  });
  const [activeItem, setActiveItem] = React.useState(-1);

  const baseId = React.useId();
  const rootRef = React.useRef<HTMLElement | null>(null);
  const topRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const enabledTopIndices = React.useMemo(
    () => menus.map((menu, index) => (menu.disabled ? -1 : index)).filter((index) => index >= 0),
    [menus],
  );

  const enabledItemsOf = React.useCallback(
    (menu: MenubarMenu | undefined) =>
      menu ? menu.items.map((item, index) => (item.disabled ? -1 : index)).filter((index) => index >= 0) : [],
    [],
  );

  const openTopMenu = React.useCallback(
    (index: number, edge: "first" | "last") => {
      const menu = menus[index];
      if (!menu || menu.disabled) return;
      const enabled = enabledItemsOf(menu);
      setOpenIndex(index);
      setFocusedTop(index);
      setActiveItem(
        enabled.length === 0 ? -1 : edge === "last" ? enabled[enabled.length - 1] : enabled[0],
      );
    },
    [enabledItemsOf, menus],
  );

  // Close the open submenu. When `focusIndex` is given, focus returns to that top
  // item; the caller decides whether to also preventDefault (Escape does, Tab
  // does not, so the browser's own Tab then carries focus out of the menubar).
  const closeMenu = React.useCallback((focusIndex?: number) => {
    setOpenIndex(null);
    setActiveItem(-1);
    if (focusIndex != null) {
      setFocusedTop(focusIndex);
      topRefs.current[focusIndex]?.focus();
    }
  }, []);

  // On open (or when the active item changes), move focus into the submenu — to
  // the active item, or to the surface itself when every item is disabled, so
  // keyboard focus is never lost. This only calls `.focus()`, never setState, so
  // it is a legal effect body.
  React.useEffect(() => {
    if (openIndex == null) return;
    const target = activeItem >= 0 ? itemRefs.current[activeItem] : menuRef.current;
    target?.focus();
  }, [openIndex, activeItem]);

  // A pointer press anywhere outside the menubar closes it. Registered only while
  // a menu is open; the setState lives in the callback, not the effect body.
  React.useEffect(() => {
    if (openIndex == null) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenIndex(null);
        setActiveItem(-1);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openIndex]);

  function focusTopAt(index: number) {
    setFocusedTop(index);
    topRefs.current[index]?.focus();
  }

  function moveTop(direction: 1 | -1) {
    if (enabledTopIndices.length === 0) return;
    const position = enabledTopIndices.indexOf(focusedTop);
    const nextPosition =
      position === -1
        ? direction === 1
          ? 0
          : enabledTopIndices.length - 1
        : (position + direction + enabledTopIndices.length) % enabledTopIndices.length;
    focusTopAt(enabledTopIndices[nextPosition]);
  }

  function handleTopClick(index: number) {
    const menu = menus[index];
    if (!menu || menu.disabled) return;
    if (openIndex === index) closeMenu(index);
    else openTopMenu(index, "first");
  }

  function handleTopPointerEnter(index: number) {
    // Only switch when a menu is already open — the menubar convention where the
    // pointer glides across the row and the open menu follows.
    if (openIndex == null || openIndex === index) return;
    const menu = menus[index];
    if (!menu || menu.disabled) return;
    openTopMenu(index, "first");
  }

  function handleTopKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveTop(1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveTop(-1);
        break;
      case "ArrowDown":
      case "Enter":
      case " ":
      case "Spacebar":
        event.preventDefault();
        openTopMenu(index, "first");
        break;
      case "ArrowUp":
        event.preventDefault();
        openTopMenu(index, "last");
        break;
      case "Home":
        event.preventDefault();
        if (enabledTopIndices.length > 0) focusTopAt(enabledTopIndices[0]);
        break;
      case "End":
        event.preventDefault();
        if (enabledTopIndices.length > 0) focusTopAt(enabledTopIndices[enabledTopIndices.length - 1]);
        break;
      case "Escape":
        if (openIndex != null) {
          event.preventDefault();
          event.stopPropagation();
          closeMenu(index);
        }
        break;
      default:
        break;
    }
  }

  function switchTopMenu(fromIndex: number, direction: 1 | -1) {
    if (enabledTopIndices.length === 0) return;
    const position = enabledTopIndices.indexOf(fromIndex);
    if (position === -1) return;
    const nextPosition = (position + direction + enabledTopIndices.length) % enabledTopIndices.length;
    openTopMenu(enabledTopIndices[nextPosition], "first");
  }

  function moveActive(menu: MenubarMenu, direction: 1 | -1) {
    const enabled = enabledItemsOf(menu);
    if (enabled.length === 0) return;
    const position = enabled.indexOf(activeItem);
    const nextPosition =
      position === -1
        ? direction === 1
          ? 0
          : enabled.length - 1
        : (position + direction + enabled.length) % enabled.length;
    setActiveItem(enabled[nextPosition]);
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>, index: number) {
    const menu = menus[index];
    if (!menu) return;
    const enabled = enabledItemsOf(menu);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(menu, 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(menu, -1);
        break;
      case "Home":
        event.preventDefault();
        if (enabled.length > 0) setActiveItem(enabled[0]);
        break;
      case "End":
        event.preventDefault();
        if (enabled.length > 0) setActiveItem(enabled[enabled.length - 1]);
        break;
      case "ArrowRight":
        event.preventDefault();
        switchTopMenu(index, 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        switchTopMenu(index, -1);
        break;
      case "Escape":
        event.preventDefault();
        // Absorb the dismiss key so it does not also close an Escape-closable
        // ancestor the menubar might sit in.
        event.stopPropagation();
        closeMenu(index);
        break;
      case "Tab":
        // Tab leaves the menubar: close and hand focus to the top item (the
        // single roving tab stop), then let the browser's own Tab continue from
        // there — no preventDefault, so focus moves out to the next element.
        closeMenu(index);
        break;
      default:
        break;
    }
  }

  function selectItem(index: number, itemIndex: number) {
    const item = menus[index]?.items[itemIndex];
    if (!item || item.disabled) return;
    item.onSelect?.();
    closeMenu(index);
  }

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={cn("inline-block max-w-full align-middle", MATERIAL_TOKENS[material], className)}
      data-material={material}
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
    >
      <MenubarKeyframes />
      <div
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className={cn(barVariants({ size, variant }))}
        role="menubar"
      >
        {menus.map((menu, index) => {
          const isOpen = openIndex === index;
          const topId = `${baseId}-t${index}`;
          const menuId = `${baseId}-m${index}`;
          return (
            <div className="relative" key={menu.id} role="none">
              <button
                aria-controls={isOpen ? menuId : undefined}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className={cn(topItemVariants({ size }))}
                data-open={isOpen ? "true" : "false"}
                disabled={menu.disabled}
                id={topId}
                onClick={() => handleTopClick(index)}
                onKeyDown={(event) => handleTopKeyDown(event, index)}
                onPointerEnter={() => handleTopPointerEnter(index)}
                ref={(node) => {
                  topRefs.current[index] = node;
                }}
                role="menuitem"
                tabIndex={index === focusedTop ? 0 : -1}
                type="button"
              >
                {menu.label}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "-mr-[2px] size-[1em] shrink-0 opacity-70",
                    "transition-transform duration-200 ease-out motion-reduce:transition-none",
                    "group-data-[open=true]/top:rotate-180",
                    "forced-colors:text-[CanvasText]",
                  )}
                />
              </button>

              {isOpen ? (
                <div
                  aria-label={menu.label}
                  aria-orientation="vertical"
                  className={cn(submenuVariants({ size }))}
                  id={menuId}
                  onKeyDown={(event) => handleMenuKeyDown(event, index)}
                  ref={menuRef}
                  role="menu"
                  tabIndex={-1}
                >
                  <ul className="m-0 flex list-none flex-col gap-[2px] p-0" role="none">
                    {menu.items.map((item, itemIndex) => (
                      <li key={item.id} role="none">
                        <button
                          className={cn(menuItemVariants({ size }))}
                          disabled={item.disabled}
                          onClick={() => selectItem(index, itemIndex)}
                          ref={(node) => {
                            itemRefs.current[itemIndex] = node;
                          }}
                          role="menuitem"
                          tabIndex={itemIndex === activeItem ? 0 : -1}
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
        })}
      </div>
    </nav>
  );
}

export type MenubarVariantProps = VariantProps<typeof barVariants>;

export { barVariants, topItemVariants };
