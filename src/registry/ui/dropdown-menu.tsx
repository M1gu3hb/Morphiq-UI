"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Dropdown Menu
 *
 * A single trigger button that discloses a menu of actions — Split Button minus
 * the primary action. One real native `<button>` carries the label and a
 * rotating chevron; it declares `aria-haspopup="menu"`, `aria-expanded` and,
 * while the menu is mounted, `aria-controls`. Clicking it (or pressing
 * ArrowDown/ArrowUp on it) opens a `role="menu"` of `role="menuitem"` buttons.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The material recipe is Button's own PRIMARY-intent
 * token values, inlined into a `material` axis, with the same per-material press
 * physics (resting shadow, a hover lift, and an active SINK into a pressed inset
 * well).
 *
 *   <DropdownMenu
 *     material="clay"
 *     size="md"
 *     items={[
 *       { id: "edit", label: "Edit", icon: <Pencil />, onSelect: edit },
 *       { id: "copy", label: "Duplicate", icon: <Copy />, onSelect: duplicate },
 *       { id: "sep", separator: true },
 *       { id: "del", label: "Delete", icon: <Trash2 />, disabled: true },
 *     ]}
 *   >
 *     Actions
 *   </DropdownMenu>
 *
 * Keyboard: Click or ArrowDown/ArrowUp on the closed trigger opens the menu on
 * the first/last item. In the menu ArrowDown/ArrowUp move focus among items
 * (roving — focus MOVES to the item, skipping disabled ones and separators),
 * Home/End jump to the ends, Enter/Space activate (the items are real buttons),
 * Escape and Tab close and RETURN focus to the trigger, and a pointer press
 * outside closes.
 *
 * Local theming knobs (override from a parent or `className` to retheme without
 * forking the recipe — each is read with a literal fallback):
 *
 *   --mq-body / --mq-lit / --mq-edge   surface, top highlight, extruded edge
 *   --mq-text / --mq-brd / --mq-ring   label, border, focus ring
 *   --mq-accent                        menu leading-icon tint
 *   --mq-menu / --mq-menu-brd          menu surface + border
 *   --mq-menu-ink / --mq-menu-hover    menu label + hover/focus wash
 *   --mq-menu-grad / --mq-menu-blur    menu wash + backdrop blur
 *   --mq-menu-shadow                   menu elevation
 */

/**
 * Palette per material. Declared once on the root group; the trigger and the
 * menu inherit it through CSS. The values are Button's PRIMARY intent verbatim,
 * so the label contrast contract is inherited too (>= 4.5:1 on every material).
 * `adaptive` additionally flips on `prefers-color-scheme` because it names only
 * opaque surfaces that flip together with the labels on them. Read at runtime as
 * `MATERIAL_TOKENS[material]`, so it earns its place as a const.
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
    // trigger surface reads over its backdrop.
    "[--mq-menu:rgba(244,247,248,0.90)] [--mq-menu-brd:rgba(255,255,255,0.72)] [--mq-menu-ink:#1e1e1b]",
    "[--mq-menu-hover:rgba(23,24,23,0.06)] [--mq-menu-blur:16px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0))]",
    "[--mq-menu-shadow:0_16px_34px_rgba(24,20,40,0.18),0_4px_12px_rgba(24,20,40,0.12)]",
  ].join(" "),
  skeuo: [
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
    "[--mq-accent:#3f3e39]",
    // Greige, warm — the #e6e3da family — so the menu belongs to the same
    // moulded material as the control that spawned it.
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

type DropdownMenuMaterial = keyof typeof MATERIAL_TOKENS;
type DropdownMenuSize = "sm" | "md" | "lg";
type DropdownMenuVariant = "default";

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so the docs surface can render the focused look
 * without synthesising a keyboard event. The width/offset/colour together fully
 * replace the UA outline, so it is never reset with `outline-none`. Raised to
 * `z-10` so an adjacent open menu never clips the ring.
 */
const FOCUS_RING =
  "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:z-10 data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Shared trigger chrome. `translate`, not `transform`: Tailwind v4 writes its
 * `translate-*` utilities to the standalone `translate` property, so the
 * transition names `translate` explicitly. Every property in the list is one
 * some state actually changes — `background-color` is omitted because no trigger
 * state tints on interaction (listing it would be a phantom transition), and the
 * chevron's `rotate` is transitioned on the icon itself, not here.
 */
const SURFACE_BASE = [
  "group/trigger relative isolate inline-flex shrink-0 select-none items-center justify-center",
  "border font-extrabold tracking-[-0.01em] cursor-pointer appearance-none",
  "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
  "motion-reduce:transition-none",
  FOCUS_RING,
  "forced-colors:border-[CanvasText]",
  // The disabled look is driven by the native attribute; press travel is
  // cancelled but the resting bounds stay.
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0 disabled:shadow-none",
].join(" ");

/**
 * The four material recipes, PRIMARY-intent values inlined. Press physics per
 * material: clay sinks ~3px into a warm inset well, skeuo ~4px, glass/adaptive
 * ~1px — the hover lift grows the shadow, the active state SINKS into the inset.
 * `motion-reduce` (on the base) drops the travel, but `:active` still applies the
 * inset instantly, so the tactile feedback survives even without animation.
 */
const MATERIAL_SURFACE: Record<DropdownMenuMaterial, string> = {
  clay: [
    "bg-[var(--mq-body,#ff9077)] text-[var(--mq-text,#4a1d13)] border-[var(--mq-brd,rgba(120,40,25,0.16))]",
    "shadow-[inset_0_3px_3px_rgba(255,255,255,0.55),inset_0_-4px_6px_rgba(120,40,25,0.18),0_6px_0_var(--mq-edge,#c9482f),0_12px_20px_rgba(75,40,31,0.18)]",
    "hover:-translate-y-[2px]",
    "hover:shadow-[inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(120,40,25,0.18),0_8px_0_var(--mq-edge,#c9482f),0_16px_26px_rgba(75,40,31,0.2)]",
    "active:translate-y-[3px]",
    "active:shadow-[inset_0_3px_7px_rgba(120,40,25,0.32),0_2px_0_var(--mq-edge,#c9482f)]",
  ].join(" "),
  glass: [
    "bg-[var(--mq-body,rgba(23,24,23,0.74))] text-[var(--mq-text,#ffffff)] border-[var(--mq-brd,rgba(255,255,255,0.28))]",
    "backdrop-blur-[14px] backdrop-saturate-[160%]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_26px_rgba(24,20,40,0.2)]",
    "hover:-translate-y-[1px] hover:backdrop-blur-[18px]",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_32px_rgba(24,20,40,0.26)]",
    "active:translate-y-[1px]",
    "active:shadow-[inset_0_2px_7px_rgba(24,20,40,0.3)]",
    "forced-colors:[backdrop-filter:none]",
  ].join(" "),
  skeuo: [
    "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] text-[var(--mq-text,#f6f4ee)] border-[var(--mq-brd,rgba(0,0,0,0.5))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_5px_0_var(--mq-edge,#131311),0_10px_16px_rgba(38,36,31,0.28)]",
    "hover:-translate-y-[1px] hover:brightness-[1.08]",
    "active:translate-y-[4px]",
    "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
  ].join(" "),
  adaptive: [
    "bg-[var(--mq-body,#171817)] text-[var(--mq-text,#f6f5f1)] border-[var(--mq-brd,rgba(0,0,0,0.4))]",
    "shadow-[0_1px_2px_rgba(20,20,18,0.12)]",
    "hover:shadow-[0_5px_14px_rgba(20,20,18,0.18)]",
    "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
    // Coarse pointers get a comfortable touch target; only ever grows the control.
    "pointer-coarse:min-h-[48px]",
  ].join(" "),
};

/**
 * The trigger button. Rounded on all corners (unlike Split Button's joined
 * members) and sized on the same three-step scale as Button.
 */
const triggerVariants = cva(SURFACE_BASE, {
  variants: {
    material: MATERIAL_SURFACE,
    size: {
      sm: "h-[36px] gap-[6px] rounded-[12px] px-[14px] text-[12px]/[1]",
      md: "h-[44px] gap-[8px] rounded-[15px] px-[20px] text-[13px]/[1]",
      lg: "h-[52px] gap-[10px] rounded-[18px] px-[26px] text-[14px]/[1]",
    },
  },
  defaultVariants: { material: "clay", size: "md" },
});

/**
 * Menu entrance keyframe, shipped with the component instead of a global sheet.
 * React 19 hoists this `<style>` and dedupes it by `href`, so a page with many
 * dropdowns emits one rule. The keyframe's resting end-state is the menu's base
 * style, so `motion-reduce:animate-none` keeps the menu fully open — only the
 * small rise is dropped. The `href` is unique to this component.
 */
const MENU_KEYFRAMES = `
@keyframes mq-dm-menu-in{from{opacity:0;translate:0 -6px}to{opacity:1;translate:0 0}}`;

function MenuKeyframes() {
  return (
    <style href="mq-dropdown-menu" precedence="medium">
      {MENU_KEYFRAMES}
    </style>
  );
}

/** A selectable action in the dropdown menu. */
export type DropdownMenuAction = {
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

/** A visual + semantic divider between groups of actions. */
export type DropdownMenuSeparator = {
  id: string;
  separator: true;
};

export type DropdownMenuItem = DropdownMenuAction | DropdownMenuSeparator;

function isSeparator(item: DropdownMenuItem): item is DropdownMenuSeparator {
  return "separator" in item && item.separator === true;
}

type DropdownMenuOwnProps = {
  /** Actions (and optional separators) revealed by the trigger. */
  items: DropdownMenuItem[];
  material?: DropdownMenuMaterial;
  size?: DropdownMenuSize;
  /** Single presentation variant; reserved for future tone axes. */
  variant?: DropdownMenuVariant;
  /** Visible trigger label; also the menu's accessible name. */
  children: React.ReactNode;
};

/**
 * `Omit` the own props off the native button props so the rest — `disabled`,
 * `data-*`, `aria-*`, `ref`, `onClick` — spread straight onto the trigger.
 * `className` dresses the outer wrapper.
 */
export type DropdownMenuProps = DropdownMenuOwnProps &
  Omit<React.ComponentPropsWithRef<"button">, keyof DropdownMenuOwnProps | "type">;

const menuItemClass = cn(
  "group/mi flex w-full items-center gap-[10px] rounded-[10px] px-[12px] h-[36px]",
  "cursor-pointer appearance-none border-0 bg-transparent text-left",
  "font-bold tracking-[-0.01em] text-[13px]/[1] text-[color:var(--mq-menu-ink,#33261e)]",
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

export function DropdownMenu({
  children,
  className,
  disabled = false,
  items,
  material = "clay",
  onClick,
  size = "md",
  variant = "default",
  ...triggerProps
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const triggerId = React.useId();
  const menuId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndices = React.useMemo(
    () =>
      items
        .map((item, index) => (isSeparator(item) || item.disabled ? -1 : index))
        .filter((index) => index >= 0),
    [items],
  );

  const closeAndFocusTrigger = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const openMenu = React.useCallback(
    (edge: "first" | "last") => {
      if (enabledIndices.length === 0) {
        setActiveIndex(-1);
      } else {
        setActiveIndex(edge === "last" ? enabledIndices[enabledIndices.length - 1] : enabledIndices[0]);
      }
      setOpen(true);
    },
    [enabledIndices],
  );

  // On open, move focus into the menu — to the active item, or to the menu
  // surface itself when every item is disabled so keyboard focus is never lost.
  React.useEffect(() => {
    if (!open) return;
    const target = activeIndex >= 0 ? itemRefs.current[activeIndex] : menuRef.current;
    target?.focus();
  }, [open, activeIndex]);

  // A pointer press anywhere outside the wrapper closes the menu. Registered
  // only while open, and cleaned up on close/unmount.
  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function selectItem(index: number) {
    const item = items[index];
    if (!item || isSeparator(item) || item.disabled) return;
    item.onSelect?.();
    closeAndFocusTrigger();
  }

  function handleTriggerClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (disabled) return;
    if (open) setOpen(false);
    else openMenu("first");
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu("first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu("last");
    }
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
        // Escape-closable ancestor (a dialog or menu the dropdown sits in).
        event.stopPropagation();
        closeAndFocusTrigger();
        break;
      case "Tab":
        // Tab leaves the menu; close it and hand focus back to the trigger so
        // the next Tab continues from the control, never from an unmounting item.
        event.preventDefault();
        closeAndFocusTrigger();
        break;
      default:
        break;
    }
  }

  return (
    <div
      className={cn("relative inline-flex w-fit align-middle", MATERIAL_TOKENS[material], className)}
      data-material={material}
      data-variant={variant}
      ref={rootRef}
      role="presentation"
    >
      <MenuKeyframes />
      <button
        {...triggerProps}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(triggerVariants({ material, size }))}
        data-open={open ? "true" : "false"}
        disabled={disabled}
        id={triggerId}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        <span className="min-w-0 truncate">{children}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-[1.05em] shrink-0",
            // `rotate`, not `transform`: Tailwind v4 writes `rotate-*` to the
            // standalone `rotate` property, so the transition must name it or
            // the chevron snaps instead of turning.
            "transition-[rotate] duration-200 ease-out motion-reduce:transition-none",
            "group-data-[open=true]/trigger:rotate-180",
            "forced-colors:text-[CanvasText]",
          )}
        />
      </button>

      {open ? (
        <div
          aria-labelledby={triggerId}
          className={cn(
            "absolute left-0 top-full z-50 mt-[8px] min-w-[220px] max-w-[280px] p-[6px]",
            "rounded-[14px] border bg-[var(--mq-menu,#f4ece0)] border-[var(--mq-menu-brd,rgba(120,80,55,0.22))]",
            "[background-image:var(--mq-menu-grad,none)] backdrop-blur-[var(--mq-menu-blur,0px)]",
            "text-[color:var(--mq-menu-ink,#33261e)]",
            "shadow-[var(--mq-menu-shadow,0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14))]",
            "animate-[mq-dm-menu-in_160ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
            // Fills, washes and shadows are discarded in forced colours; a real
            // border keeps the surface's bounds and a solid Canvas backs the items.
            "forced-colors:border-[CanvasText] forced-colors:shadow-none forced-colors:bg-[Canvas]",
            "forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
          )}
          id={menuId}
          onKeyDown={handleMenuKeyDown}
          ref={menuRef}
          role="menu"
          tabIndex={-1}
        >
          <ul className="m-0 flex list-none flex-col gap-[2px] p-0" role="none">
            {items.map((item, index) =>
              isSeparator(item) ? (
                <li key={item.id} role="none">
                  <hr
                    className={cn(
                      "mx-[6px] my-[4px] h-px border-0",
                      "bg-[var(--mq-menu-brd,rgba(120,80,55,0.22))]",
                      "forced-colors:bg-[CanvasText]",
                    )}
                  />
                </li>
              ) : (
                <li key={item.id} role="none">
                  <button
                    className={menuItemClass}
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
              ),
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export type DropdownMenuVariantProps = VariantProps<typeof triggerVariants>;

export { triggerVariants };
