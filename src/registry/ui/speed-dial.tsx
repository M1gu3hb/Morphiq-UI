"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Speed Dial
 *
 * A floating action button (FAB) that toggles a vertical stack of secondary
 * actions floating above it. The FAB is a real native `<button>` carrying the
 * accessible name, `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`;
 * its plus glyph cross-fades and rotates into a close (x) so the open state is
 * never carried by colour alone. The revealed actions are a `role="menu"` of
 * `role="menuitem"` buttons, each with its own `aria-label`, that animate in with
 * a small staggered rise.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The FAB reuses Button's PRIMARY-intent material
 * recipe (resting shadow, hover lift, an active SINK into a pressed inset well);
 * the action buttons and their labels reuse the split-button menu surface tokens
 * so they read as the same moulded material the FAB spawned.
 *
 *   <SpeedDial
 *     material="clay"
 *     size="md"
 *     label="Create"
 *     actions={[
 *       { id: "edit", label: "Edit", icon: <Pencil />, onSelect: edit },
 *       { id: "share", label: "Share", icon: <Share2 />, onSelect: share },
 *     ]}
 *   />
 *
 * Keyboard: Click/Enter/Space open the menu and focus the action nearest the FAB;
 * ArrowUp opens onto that first action and ArrowDown opens onto the last. Inside
 * the open menu ArrowUp/ArrowDown rove focus between items (focus MOVES to the
 * item, skipping disabled ones), Home/End jump to the ends, Enter/Space activate
 * (the items are real buttons), Escape and Tab close and RETURN focus to the FAB,
 * and a pointer press outside closes.
 *
 * Local theming knobs (override from a parent or `className` to retheme without
 * forking the recipe — each is read with a literal fallback):
 *
 *   --mq-body / --mq-lit / --mq-edge   FAB surface, top highlight, extruded edge
 *   --mq-text / --mq-brd / --mq-ring   FAB glyph, border, focus ring
 *   --mq-accent                        action leading-icon tint
 *   --mq-menu / --mq-menu-brd          action + label surface and border
 *   --mq-menu-ink / --mq-menu-grad     action + label ink and wash
 *   --mq-menu-blur / --mq-menu-shadow  action + label backdrop blur and elevation
 */

type SpeedDialMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type SpeedDialSize = "sm" | "md" | "lg";
type SpeedDialVariant = "default";

/**
 * Palette per material, declared once on the root and inherited through CSS by
 * the FAB, the action buttons and their labels. The FAB values are Button's
 * PRIMARY intent verbatim, so the glyph contrast contract is inherited too
 * (>= 4.5:1 on every material). `adaptive` additionally flips on
 * `prefers-color-scheme` because it names only opaque surfaces that flip
 * together with the ink on them.
 */
const MATERIAL_TOKENS: Record<SpeedDialMaterial, string> = {
  clay: [
    "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817]",
    "[--mq-accent:#c9482f]",
    "[--mq-menu:#f4ece0] [--mq-menu-brd:rgba(120,80,55,0.22)] [--mq-menu-ink:#33261e]",
    "[--mq-menu-blur:0px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.50),rgba(151,92,58,0.05))]",
    "[--mq-menu-shadow:0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14)]",
  ].join(" "),
  glass: [
    "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817]",
    "[--mq-accent:#171817]",
    // A frosted, light action surface so the secondary icons/labels stay legible
    // however dark the FAB reads over its backdrop.
    "[--mq-menu:rgba(244,247,248,0.90)] [--mq-menu-brd:rgba(255,255,255,0.72)] [--mq-menu-ink:#1e1e1b]",
    "[--mq-menu-blur:16px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0))]",
    "[--mq-menu-shadow:0_16px_34px_rgba(24,20,40,0.18),0_4px_12px_rgba(24,20,40,0.12)]",
  ].join(" "),
  skeuo: [
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
    "[--mq-accent:#3f3e39]",
    // Greige, warm — the #e6e3da family — so the actions belong to the same
    // moulded material as the control that spawned them.
    "[--mq-menu:#e6e3da] [--mq-menu-brd:rgba(25,25,23,0.30)] [--mq-menu-ink:#23231f]",
    "[--mq-menu-blur:0px]",
    "[--mq-menu-grad:linear-gradient(180deg,#f0ede6,#e6e3da)]",
    "[--mq-menu-shadow:0_16px_30px_rgba(38,36,31,0.28),0_4px_10px_rgba(38,36,31,0.18)]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  adaptive: [
    "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
    "[--mq-accent:#171817]",
    "[--mq-menu:#ffffff] [--mq-menu-brd:rgba(23,24,23,0.14)] [--mq-menu-ink:#1c1c19]",
    "[--mq-menu-blur:0px]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // wash onto the one material meant to have none.
    "[--mq-menu-grad:none]",
    "[--mq-menu-shadow:0_14px_30px_rgba(20,20,18,0.16),0_3px_8px_rgba(20,20,18,0.10)]",
    "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
    "dark:[--mq-accent:#f1efe9]",
    "dark:[--mq-menu:#26262a] dark:[--mq-menu-brd:rgba(255,255,255,0.16)] dark:[--mq-menu-ink:#f1efe9]",
    "dark:[--mq-menu-shadow:0_14px_30px_rgba(0,0,0,0.55),0_3px_8px_rgba(0,0,0,0.40)]",
  ].join(" "),
};

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so the docs surface can render the focused look
 * without synthesising a keyboard event. Width/offset/colour together fully
 * replace the UA outline, so it is never reset with `outline-none`.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] forced-colors:data-[focus=true]:outline-[Highlight]";

/**
 * Shared FAB chrome. `translate`, not `transform`: Tailwind v4 writes its
 * `translate-*` utilities to the standalone `translate` property, so the
 * transition names `translate` explicitly — every listed property is one some
 * state actually changes, and none is phantom.
 */
const SURFACE_BASE = [
  "relative isolate inline-flex shrink-0 select-none items-center justify-center",
  "border font-extrabold tracking-[-0.01em] cursor-pointer appearance-none",
  "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
  "motion-reduce:transition-none",
  FOCUS_RING,
  "forced-colors:border-[CanvasText]",
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0 disabled:shadow-none",
].join(" ");

/**
 * The four FAB material recipes, PRIMARY-intent values inlined. Press physics
 * per material: clay sinks ~3px into a warm inset well, skeuo ~4px, glass/
 * adaptive ~1px — the hover lift grows the shadow, the active state SINKS into
 * the inset. `motion-reduce` (on the base) drops the travel, but `:active` still
 * applies the inset instantly so the tactile feedback survives without motion.
 */
const MATERIAL_SURFACE: Record<SpeedDialMaterial, string> = {
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
    "pointer-coarse:min-h-[48px]",
  ].join(" "),
};

/** FAB size axis. Font-size drives the em-based plus/x glyph. */
const fabVariants = cva(cn(SURFACE_BASE, "rounded-full"), {
  variants: {
    material: MATERIAL_SURFACE,
    size: {
      sm: "size-[44px] text-[16px]",
      md: "size-[52px] text-[18px]",
      lg: "size-[60px] text-[20px]",
    },
  },
  defaultVariants: { material: "clay", size: "md" },
});

/** Circular action button size axis; font-size drives the em-based leading icon. */
const ACTION_SIZE: Record<SpeedDialSize, string> = {
  sm: "size-[36px] text-[15px]",
  md: "size-[40px] text-[16px]",
  lg: "size-[44px] text-[18px]",
};

const LABEL_SIZE: Record<SpeedDialSize, string> = {
  sm: "text-[11px]/[1] px-[8px] py-[5px]",
  md: "text-[12px]/[1] px-[10px] py-[6px]",
  lg: "text-[13px]/[1] px-[12px] py-[7px]",
};

/** Vertical gap between stacked actions. */
const MENU_GAP: Record<SpeedDialSize, string> = {
  sm: "gap-[10px]",
  md: "gap-[12px]",
  lg: "gap-[14px]",
};

/** Gap between the top of the FAB and the bottom of the stack. */
const MENU_OFFSET: Record<SpeedDialSize, string> = {
  sm: "mb-[10px]",
  md: "mb-[12px]",
  lg: "mb-[14px]",
};

/** Shared surface for the circular action buttons. Only `translate` changes on
 * interaction, so the transition names only `translate` — no phantom entries. */
const ACTION_BUTTON = cn(
  "relative grid shrink-0 place-items-center rounded-full cursor-pointer appearance-none border",
  "bg-[var(--mq-menu,#f4ece0)] border-[var(--mq-menu-brd,rgba(120,80,55,0.22))]",
  "text-[color:var(--mq-menu-ink,#33261e)]",
  "[background-image:var(--mq-menu-grad,none)] backdrop-blur-[var(--mq-menu-blur,0px)]",
  "shadow-[var(--mq-menu-shadow,0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14))]",
  "transition-[translate] duration-200 ease-out motion-reduce:transition-none",
  "hover:-translate-y-[2px] active:translate-y-[1px]",
  // The roving active item receives programmatic focus, which does not reliably
  // trigger `:focus-visible`; so the ring is keyed off real `:focus`, and it
  // fully replaces the UA outline (no `outline-none` needed).
  "focus:z-10 focus:outline-2 focus:outline-offset-[3px] focus:outline-[var(--mq-ring,#171817)]",
  "disabled:cursor-not-allowed disabled:opacity-45 disabled:translate-y-0",
  // Fills, washes and shadows are discarded in forced colours; a real border
  // keeps bounds, the focused item takes a Highlight mark and a Highlight ring.
  "forced-colors:border-[CanvasText] forced-colors:shadow-none",
  "forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
  "forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText] forced-colors:focus:outline-[Highlight]",
);

/** The floating label beside each action. Decorative (aria-hidden): the button
 * carries the accessible name via `aria-label`. Dark ink on a light menu surface
 * keeps its text >= 4.5:1 on every material. */
function labelPill(size: SpeedDialSize): string {
  return cn(
    "pointer-events-none absolute left-full top-1/2 ml-[12px] -translate-y-1/2",
    "whitespace-nowrap select-none rounded-[8px] border font-bold tracking-[-0.01em]",
    "bg-[var(--mq-menu,#f4ece0)] border-[var(--mq-menu-brd,rgba(120,80,55,0.22))]",
    "text-[color:var(--mq-menu-ink,#33261e)]",
    "[background-image:var(--mq-menu-grad,none)] backdrop-blur-[var(--mq-menu-blur,0px)]",
    "shadow-[var(--mq-menu-shadow,0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14))]",
    "forced-colors:border-[CanvasText] forced-colors:shadow-none forced-colors:text-[CanvasText]",
    "forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
    LABEL_SIZE[size],
  );
}

/**
 * Entrance keyframes, shipped with the component instead of a global sheet.
 * React 19 hoists this `<style>` and dedupes it by `href`. The `in` keyframe's
 * resting end-state is the item's base style (opacity 1, no offset). Under
 * `prefers-reduced-motion` the `fade` keyframe is used instead: opacity only,
 * with NO translate rise, so nothing jumps — the item still settles fully open.
 */
const SPEED_DIAL_KEYFRAMES = `
@keyframes mq-speed-dial-in{from{opacity:0;translate:0 8px}to{opacity:1;translate:0 0}}
@keyframes mq-speed-dial-fade{from{opacity:0}to{opacity:1}}`;

function SpeedDialKeyframes() {
  return (
    <style href="mq-speed-dial" precedence="medium">
      {SPEED_DIAL_KEYFRAMES}
    </style>
  );
}

/** A secondary action revealed by the FAB. */
export type SpeedDialAction = {
  /** Stable key; also the React list key. */
  id: string;
  /** Visible floating label AND the button's accessible name. */
  label: string;
  /** Optional leading glyph (a lucide icon element). Decorative; sized by CSS. */
  icon?: React.ReactNode;
  /** Called when the item is chosen, before the menu closes. */
  onSelect?: () => void;
  /** Skipped by roving navigation and non-activatable. */
  disabled?: boolean;
};

type SpeedDialOwnProps = {
  /** Secondary actions revealed above the FAB. */
  actions: SpeedDialAction[];
  material?: SpeedDialMaterial;
  size?: SpeedDialSize;
  /** Single presentation variant; reserved for future tone axes. */
  variant?: SpeedDialVariant;
  /** Accessible name for the FAB and its menu. */
  label?: string;
};

/**
 * `Omit` the own props (plus `type`/`onClick`/`children`, which the FAB owns) off
 * the native button props so the rest — `data-*`, `aria-*`, `id`, `disabled` —
 * spread straight onto the FAB `<button>`. `className` dresses the outer root.
 */
export type SpeedDialProps = SpeedDialOwnProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof SpeedDialOwnProps | "type" | "onClick" | "children">;

export function SpeedDial({
  actions,
  className,
  disabled = false,
  label = "Actions",
  material = "clay",
  size = "md",
  variant = "default",
  ...fabProps
}: SpeedDialProps) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const menuId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const fabRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndices = React.useMemo(
    () => actions.map((action, index) => (action.disabled ? -1 : index)).filter((index) => index >= 0),
    [actions],
  );

  const closeAndFocusFab = React.useCallback(() => {
    setOpen(false);
    fabRef.current?.focus();
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

  // A pointer press anywhere outside the root closes the menu. Registered only
  // while open, and cleaned up on close/unmount.
  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function selectItem(index: number) {
    const action = actions[index];
    if (!action || action.disabled) return;
    action.onSelect?.();
    closeAndFocusFab();
  }

  function handleFabClick() {
    if (disabled) return;
    if (open) setOpen(false);
    else openMenu("first");
  }

  function handleFabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    // The stack expands upward: ArrowUp opens onto the action nearest the FAB
    // (the first, bottom of the stack); ArrowDown opens onto the last (top).
    if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu("first");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu("last");
    }
  }

  // `direction` is an index delta. The list renders bottom-to-top (flex-col-
  // reverse), so a higher index sits visually higher: ArrowUp -> +1, ArrowDown
  // -> -1, both wrapping around the enabled items.
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
      case "ArrowUp":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowDown":
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
        // Escape-closable ancestor (a dialog or menu this sits in).
        event.stopPropagation();
        closeAndFocusFab();
        break;
      case "Tab":
        // Tab leaves the menu; close it and hand focus back to the FAB so the
        // next Tab continues from the control, never from an unmounting item.
        event.preventDefault();
        closeAndFocusFab();
        break;
      default:
        break;
    }
  }

  return (
    <div
      className={cn("relative isolate inline-flex w-fit flex-col items-center align-middle", MATERIAL_TOKENS[material], className)}
      data-material={material}
      data-variant={variant}
      ref={rootRef}
    >
      <SpeedDialKeyframes />

      <button
        {...fabProps}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className={cn("group/fab", fabVariants({ material, size }))}
        data-open={open ? "true" : "false"}
        disabled={disabled}
        onClick={handleFabClick}
        onKeyDown={handleFabKeyDown}
        ref={fabRef}
        type="button"
      >
        <span aria-hidden="true" className="relative grid place-items-center">
          <Plus
            className={cn(
              "[grid-area:1/1] size-[1.15em] shrink-0",
              "transition-[rotate,opacity] duration-200 ease-out motion-reduce:transition-none",
              "group-data-[open=true]/fab:rotate-90 group-data-[open=true]/fab:opacity-0",
              "forced-colors:text-[CanvasText]",
            )}
          />
          <X
            className={cn(
              "[grid-area:1/1] size-[1.15em] shrink-0 -rotate-90 opacity-0",
              "transition-[rotate,opacity] duration-200 ease-out motion-reduce:transition-none",
              "group-data-[open=true]/fab:rotate-0 group-data-[open=true]/fab:opacity-100",
              "forced-colors:text-[CanvasText]",
            )}
          />
        </span>
      </button>

      {open ? (
        <div
          aria-label={label}
          className={cn("absolute bottom-full left-1/2 z-50 -translate-x-1/2", MENU_OFFSET[size])}
          id={menuId}
          onKeyDown={handleMenuKeyDown}
          ref={menuRef}
          role="menu"
          tabIndex={-1}
        >
          <ul className={cn("m-0 flex list-none flex-col-reverse items-center p-0", MENU_GAP[size])} role="none">
            {actions.map((action, index) => (
              <li
                className={cn(
                  "relative flex items-center justify-center",
                  "animate-[mq-speed-dial-in_260ms_cubic-bezier(0.16,1,0.3,1)_var(--mq-sd-delay,0ms)_both]",
                  "motion-reduce:animate-[mq-speed-dial-fade_200ms_ease-out_var(--mq-sd-delay,0ms)_both]",
                )}
                key={action.id}
                role="none"
                style={{ "--mq-sd-delay": `${index * 45}ms` } as React.CSSProperties}
              >
                <button
                  aria-label={action.label}
                  className={cn("group/sdi", ACTION_BUTTON, ACTION_SIZE[size])}
                  disabled={action.disabled}
                  onClick={() => selectItem(index)}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  role="menuitem"
                  tabIndex={index === activeIndex ? 0 : -1}
                  type="button"
                >
                  {action.icon != null ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid place-items-center text-[color:var(--mq-accent,#c9482f)]",
                        "[&_svg]:size-[1.2em] [&_svg]:shrink-0",
                        "forced-colors:text-[CanvasText] forced-colors:group-focus/sdi:text-[HighlightText]",
                      )}
                    >
                      {action.icon}
                    </span>
                  ) : null}
                </button>
                <span aria-hidden="true" className={labelPill(size)}>
                  {action.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export type SpeedDialVariantProps = VariantProps<typeof fabVariants>;

export { fabVariants };
