"use client";

import * as React from "react";
import { Search, SearchX } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Command Menu
 *
 * A ⌘K-style command palette. A trigger button reveals a panel — absolutely
 * positioned inside a `relative isolate` wrapper, NOT a global portal — that
 * holds a filter text input above a grouped, scrollable command list. Typing
 * filters the commands in memory (case-insensitive substring over the labels);
 * an empty-state row appears when nothing matches.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The trigger's surface + press physics are Button's
 * PRIMARY recipe inlined; the panel/menu surface is Split Button's menu recipe.
 *
 *   <CommandMenu
 *     material="clay"
 *     size="md"
 *     triggerLabel="Search commands…"
 *     groups={[
 *       { id: "go", heading: "Go to", items: [
 *         { id: "home", label: "Home", icon: <Home />, onSelect: goHome },
 *       ] },
 *     ]}
 *   />
 *
 * ARIA / combobox model: the input is `role="combobox"` with `aria-expanded`,
 * `aria-controls` pointing at the listbox and `aria-activedescendant` pointing
 * at the active option's id. The list is `role="listbox"`; each command is a
 * `role="option"` with a stable id and `aria-selected` on the active one.
 * Groups are `role="group"` + `aria-label`, with an `aria-hidden` visible
 * heading. Selection is VIRTUAL — DOM focus stays in the input the whole time,
 * it is never moved onto an option. A visually-hidden `aria-live="polite"`
 * region announces the result count.
 *
 * Keyboard: the trigger (and a document-level ⌘K / Ctrl+K while the component
 * is mounted) opens the panel and focuses the input. ArrowDown/ArrowUp move
 * `aria-activedescendant` through the visible options (wrapping, skipping
 * disabled), Enter runs the active command, Escape closes and RETURNS focus to
 * the trigger (and stops propagation so it does not also close an enclosing
 * dialog), Tab closes, and a pointer press outside closes.
 *
 * Local theming knobs (override from a parent or `className` to retheme
 * without forking the recipe — each read with a literal fallback):
 *
 *   --mq-body / --mq-lit / --mq-edge   trigger surface, top highlight, edge
 *   --mq-text / --mq-brd / --mq-ring   trigger label, border, focus ring
 *   --mq-accent                        command leading-icon tint
 *   --mq-menu / --mq-menu-brd          panel surface + border
 *   --mq-menu-ink / --mq-menu-hover    panel ink + active-option wash
 *   --mq-menu-grad / --mq-menu-blur    panel wash + backdrop blur
 *   --mq-menu-shadow                   panel elevation
 *   --mq-input / --mq-input-brd        filter input surface + border
 *   --mq-muted                         group headings, placeholder, shortcuts
 */

/**
 * Palette per material. Declared once on the root wrapper; the trigger, the
 * panel, the input and every option inherit it through CSS. The trigger values
 * are Button's PRIMARY intent verbatim (so the label keeps its >= 4.5:1
 * contract) and the panel values are Split Button's menu recipe. `adaptive`
 * additionally flips on `prefers-color-scheme` because it names only opaque
 * surfaces that flip together with the ink on them.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817]",
    "[--mq-accent:#c9482f]",
    "[--mq-menu:#f4ece0] [--mq-menu-brd:rgba(120,80,55,0.22)] [--mq-menu-ink:#33261e]",
    "[--mq-menu-hover:rgba(201,72,47,0.14)] [--mq-menu-blur:0px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.50),rgba(151,92,58,0.05))]",
    "[--mq-menu-shadow:0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14)]",
    "[--mq-input:#fbf6ef] [--mq-input-brd:rgba(120,80,55,0.24)] [--mq-muted:#6a5346]",
  ].join(" "),
  glass: [
    "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817]",
    "[--mq-accent:#1e1e1b]",
    // A frosted, light panel so command labels stay legible however dark the
    // trigger surface reads over its backdrop.
    "[--mq-menu:rgba(244,247,248,0.92)] [--mq-menu-brd:rgba(255,255,255,0.72)] [--mq-menu-ink:#1e1e1b]",
    "[--mq-menu-hover:rgba(23,24,23,0.08)] [--mq-menu-blur:16px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0))]",
    "[--mq-menu-shadow:0_16px_34px_rgba(24,20,40,0.18),0_4px_12px_rgba(24,20,40,0.12)]",
    "[--mq-input:rgba(255,255,255,0.70)] [--mq-input-brd:rgba(23,24,23,0.16)] [--mq-muted:#3a3a33]",
  ].join(" "),
  skeuo: [
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
    "[--mq-accent:#3f3e39]",
    // Greige, warm — the #e6e3da family — so the panel belongs to the same
    // moulded material as the control that spawned it.
    "[--mq-menu:#e6e3da] [--mq-menu-brd:rgba(25,25,23,0.30)] [--mq-menu-ink:#23231f]",
    "[--mq-menu-hover:rgba(255,255,255,0.55)] [--mq-menu-blur:0px]",
    "[--mq-menu-grad:linear-gradient(180deg,#f0ede6,#e6e3da)]",
    "[--mq-menu-shadow:0_16px_30px_rgba(38,36,31,0.28),0_4px_10px_rgba(38,36,31,0.18)]",
    "[--mq-input:#efece4] [--mq-input-brd:rgba(25,25,23,0.28)] [--mq-muted:#4a4943]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  adaptive: [
    "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
    "[--mq-accent:#171817]",
    "[--mq-menu:#ffffff] [--mq-menu-brd:rgba(23,24,23,0.14)] [--mq-menu-ink:#1c1c19]",
    "[--mq-menu-hover:rgba(23,24,23,0.07)] [--mq-menu-blur:0px]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // wash onto the one material meant to have none.
    "[--mq-menu-grad:none]",
    "[--mq-menu-shadow:0_14px_30px_rgba(20,20,18,0.16),0_3px_8px_rgba(20,20,18,0.10)]",
    "[--mq-input:#f6f5f2] [--mq-input-brd:rgba(23,24,23,0.14)] [--mq-muted:#55554e]",
    "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
    "dark:[--mq-accent:#f1efe9]",
    "dark:[--mq-menu:#26262a] dark:[--mq-menu-brd:rgba(255,255,255,0.16)] dark:[--mq-menu-ink:#f1efe9]",
    "dark:[--mq-menu-hover:rgba(255,255,255,0.09)]",
    "dark:[--mq-menu-shadow:0_14px_30px_rgba(0,0,0,0.55),0_3px_8px_rgba(0,0,0,0.40)]",
    "dark:[--mq-input:#1d1d20] dark:[--mq-input-brd:rgba(255,255,255,0.18)] dark:[--mq-muted:#b9b7b0]",
  ].join(" "),
} as const;

type Material = keyof typeof MATERIAL_TOKENS;
type CommandSize = "sm" | "md" | "lg";
type CommandVariant = "default";

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so the docs surface can render the focused look
 * without synthesising a keyboard event. Width/offset/colour together fully
 * replace the UA outline, so it is never reset with `outline-none`.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Trigger surface chrome. `translate`, not `transform`: Tailwind v4 writes its
 * `translate-*` utilities to the standalone `translate` property, so the
 * transition names `translate` explicitly. Every property listed is one some
 * state actually changes — nothing phantom.
 */
const SURFACE_BASE = [
  "relative isolate inline-flex shrink-0 select-none items-center justify-between",
  "border font-extrabold tracking-[-0.01em] cursor-pointer appearance-none",
  "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
  "motion-reduce:transition-none",
  FOCUS_RING,
  "forced-colors:border-[CanvasText]",
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0 disabled:shadow-none",
].join(" ");

/**
 * The four trigger recipes — Button's PRIMARY values inlined. clay sinks ~3px
 * into a warm inset well, skeuo ~4px, glass/adaptive ~1px; the hover lift grows
 * the shadow, the active state SINKS into the inset. `motion-reduce` drops the
 * travel but `:active` still applies the inset instantly, so tactile feedback
 * survives without animation.
 */
const MATERIAL_SURFACE: Record<Material, string> = {
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

const triggerVariants = cva(SURFACE_BASE, {
  variants: {
    material: MATERIAL_SURFACE,
    size: {
      sm: "h-[36px] min-w-[200px] gap-[8px] rounded-[12px] px-[12px] text-[12px]/[1]",
      md: "h-[44px] min-w-[240px] gap-[10px] rounded-[15px] px-[14px] text-[13px]/[1]",
      lg: "h-[52px] min-w-[280px] gap-[12px] rounded-[18px] px-[16px] text-[14px]/[1]",
    },
  },
  defaultVariants: { material: "clay", size: "md" },
});

/** Panel width tracks the size axis; capped so it never overflows a phone. */
const PANEL_WIDTH: Record<CommandSize, string> = {
  sm: "w-[300px] max-w-[90vw]",
  md: "w-[340px] max-w-[90vw]",
  lg: "w-[380px] max-w-[90vw]",
};

/**
 * Panel entrance keyframe, shipped with the component instead of a global sheet.
 * React 19 hoists this `<style>` and dedupes it by `href`. The keyframe's
 * resting end-state is the panel's base style, so `motion-reduce:animate-none`
 * keeps the panel fully open — only the small rise is dropped.
 */
const MENU_KEYFRAMES = `
@keyframes mq-cmdk-in{from{opacity:0;translate:0 -6px}to{opacity:1;translate:0 0}}`;

function MenuKeyframes() {
  return (
    <style href="mq-command-menu" precedence="medium">
      {MENU_KEYFRAMES}
    </style>
  );
}

/** Visually hidden but present in the accessibility tree. Self-contained. */
const VISUALLY_HIDDEN =
  "absolute m-[-1px] h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]";

const OPTION_CLASS = cn(
  "group/opt flex w-full items-center gap-[10px] rounded-[10px] px-[12px] h-[38px]",
  "cursor-pointer select-none text-left text-[13px]/[1] font-bold",
  "text-[color:var(--mq-menu-ink,#33261e)]",
  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
  // The active item is virtual (DOM focus stays in the input), so the wash is
  // keyed off `data-active`, not `:focus`.
  "data-[active=true]:bg-[var(--mq-menu-hover,rgba(201,72,47,0.14))]",
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-45",
  // Fills are discarded in forced colours; the active item takes a system mark.
  "forced-colors:text-[CanvasText]",
  "forced-colors:data-[active=true]:bg-[Highlight] forced-colors:data-[active=true]:text-[HighlightText]",
);

/** A single command shown in the palette. */
export type CommandItem = {
  /** Stable key; also the React list key and the basis of the option id. */
  id: string;
  label: string;
  /** Optional leading glyph (a lucide icon element). Decorative; sized by CSS. */
  icon?: React.ReactNode;
  /** Optional trailing shortcut hint, e.g. "⌘N". Decorative. */
  shortcut?: string;
  /** Called when the command is chosen, before the panel closes. */
  onSelect?: () => void;
  /** Skipped by keyboard navigation and non-activatable. */
  disabled?: boolean;
};

/** A titled cluster of commands. */
export type CommandGroup = {
  id: string;
  /** Visible heading; also the group's accessible name. */
  heading: string;
  items: CommandItem[];
};

type CommandMenuOwnProps = {
  /** Grouped commands. Groups with no matching item are hidden while filtering. */
  groups: CommandGroup[];
  material?: Material;
  size?: CommandSize;
  /** Single presentation variant; reserved for future tone axes. */
  variant?: CommandVariant;
  /** Visible text (and accessible name) of the trigger button. */
  triggerLabel?: string;
  /** Placeholder shown in the filter input. */
  placeholder?: string;
  /** Row shown when nothing matches the filter. */
  emptyText?: string;
  /** Accessible name for the combobox input and its listbox. */
  label?: string;
  /** Decorative keyboard hint rendered in the trigger. */
  shortcutHint?: string;
};

/**
 * `Omit` the own props (and `type`/`onClick`, both owned internally) off the
 * native button props so the rest — `disabled`, `data-*`, `aria-*`, `ref` —
 * spread straight onto the trigger `<button>`. `className` dresses the outer
 * wrapper.
 */
export type CommandMenuProps = CommandMenuOwnProps &
  Omit<React.ComponentPropsWithRef<"button">, keyof CommandMenuOwnProps | "type" | "onClick">;

export function CommandMenu({
  className,
  disabled = false,
  emptyText = "No results found.",
  groups,
  label = "Command menu",
  material = "clay",
  placeholder = "Type a command or search…",
  shortcutHint = "⌘K",
  size = "md",
  triggerLabel = "Search commands…",
  variant = "default",
  ...triggerProps
}: CommandMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const baseId = React.useId();
  const panelId = `${baseId}-panel`;
  const listboxId = `${baseId}-listbox`;
  const optionId = React.useCallback((index: number) => `${baseId}-opt-${index}`, [baseId]);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  // Visible groups: each group filtered to items whose label contains the query
  // (case-insensitive substring), dropping any group left empty.
  const visibleGroups = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .map((group) => ({
        ...group,
        items: q ? group.items.filter((item) => item.label.toLowerCase().includes(q)) : group.items,
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  const flatItems = React.useMemo(
    () => visibleGroups.flatMap((group) => group.items),
    [visibleGroups],
  );

  const enabledIndices = React.useMemo(
    () => flatItems.map((item, index) => (item.disabled ? -1 : index)).filter((index) => index >= 0),
    [flatItems],
  );

  const resultCount = flatItems.length;
  const resultLabel =
    resultCount === 0 ? "No results" : resultCount === 1 ? "1 result" : `${resultCount} results`;
  const activeId = activeIndex >= 0 ? optionId(activeIndex) : undefined;

  const closeAndFocusTrigger = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // The flat, enabled option indices for an ARBITRARY query, so a keystroke
  // handler can seat the active option on the first match of the NEW filter
  // without waiting for a render. Mirrors the `visibleGroups` → `flatItems` →
  // `enabledIndices` derivation above.
  const enabledIndicesFor = React.useCallback(
    (nextQuery: string) => {
      const needle = nextQuery.trim().toLowerCase();
      const flat = groups
        .map((group) => ({
          ...group,
          items: needle
            ? group.items.filter((item) => item.label.toLowerCase().includes(needle))
            : group.items,
        }))
        .filter((group) => group.items.length > 0)
        .flatMap((group) => group.items);
      return flat
        .map((item, index) => (item.disabled ? -1 : index))
        .filter((index) => index >= 0);
    },
    [groups],
  );

  // Opening starts a fresh filter and seats the active option on the first
  // enabled row. State transitions live in the handlers that cause them rather
  // than in an effect, so there is no setState-in-effect cascade.
  const openPanel = React.useCallback(() => {
    setQuery("");
    setActiveIndex(enabledIndicesFor("")[0] ?? -1);
    setOpen(true);
  }, [enabledIndicesFor]);

  // A new filter is reflected at once: update the query and re-seat the active
  // option on the first match of the new set.
  const handleQueryChange = React.useCallback(
    (nextQuery: string) => {
      setQuery(nextQuery);
      setActiveIndex(enabledIndicesFor(nextQuery)[0] ?? -1);
    },
    [enabledIndicesFor],
  );

  // On open, move DOM focus to the input — and keep it there. Selection is
  // virtual (aria-activedescendant); focus is never moved onto an option.
  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the active option scrolled into view as it moves through the list.
  React.useEffect(() => {
    if (open && activeIndex >= 0) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [open, activeIndex]);

  // Document-level ⌘K / Ctrl+K toggles the palette while the component is
  // mounted. Registered in an effect so `document` is only touched on the
  // client, keeping the module SSR-safe for static generation.
  React.useEffect(() => {
    if (disabled) return;
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && (event.key === "k" || event.key === "K")) {
        event.preventDefault();
        if (open) closeAndFocusTrigger();
        else openPanel();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [disabled, open, openPanel, closeAndFocusTrigger]);

  // A pointer press anywhere outside the wrapper closes the panel. Registered
  // only while open, and cleaned up on close/unmount.
  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

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

  function runItem(index: number) {
    const item = flatItems[index];
    if (!item || item.disabled) return;
    item.onSelect?.();
    closeAndFocusTrigger();
  }

  function handleTriggerClick() {
    if (disabled) return;
    if (open) closeAndFocusTrigger();
    else openPanel();
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Enter":
        if (activeIndex >= 0) {
          event.preventDefault();
          runItem(activeIndex);
        }
        break;
      case "Escape":
        event.preventDefault();
        // Absorb the dismiss key so it does not also close an enclosing
        // Escape-closable ancestor (a dialog the palette sits in).
        event.stopPropagation();
        closeAndFocusTrigger();
        break;
      case "Tab":
        // Tab leaves the palette; close it and let focus move on naturally.
        setOpen(false);
        break;
      default:
        break;
    }
  }

  // Running index across the flattened, filtered list — matches `flatItems`
  // order so `aria-activedescendant` and the refs line up.
  let runningIndex = -1;

  return (
    <div
      className={cn("group/cmd relative isolate inline-flex w-fit align-middle", MATERIAL_TOKENS[material], className)}
      data-material={material}
      data-variant={variant}
      ref={rootRef}
    >
      <MenuKeyframes />
      <button
        {...triggerProps}
        aria-controls={open ? panelId : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K"
        className={cn(triggerVariants({ material, size }))}
        disabled={disabled}
        onClick={handleTriggerClick}
        ref={triggerRef}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-[8px]">
          <Search
            aria-hidden="true"
            className="size-[1.05em] shrink-0 opacity-80 forced-colors:text-[CanvasText]"
          />
          <span className="min-w-0 truncate text-left font-bold">{triggerLabel}</span>
        </span>
        <kbd
          aria-hidden="true"
          className={cn(
            "inline-flex shrink-0 items-center rounded-[6px] border border-current/30",
            "px-[6px] py-[2px] text-[0.72em] font-bold opacity-70",
            "forced-colors:border-[CanvasText]",
          )}
        >
          {shortcutHint}
        </kbd>
      </button>

      {open ? (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-[8px] overflow-hidden rounded-[14px] border p-[8px]",
            PANEL_WIDTH[size],
            "bg-[var(--mq-menu,#f4ece0)] border-[var(--mq-menu-brd,rgba(120,80,55,0.22))]",
            "[background-image:var(--mq-menu-grad,none)] backdrop-blur-[var(--mq-menu-blur,0px)]",
            "text-[color:var(--mq-menu-ink,#33261e)]",
            "shadow-[var(--mq-menu-shadow,0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14))]",
            "animate-[mq-cmdk-in_160ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
            // Fills, washes and shadows are discarded in forced colours; a real
            // border keeps the panel's bounds and a solid Canvas backs the rows.
            "forced-colors:border-[CanvasText] forced-colors:shadow-none forced-colors:bg-[Canvas]",
            "forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
          )}
          id={panelId}
        >
          {/* Filter input — the one element that ever holds DOM focus. */}
          <div className="relative flex items-center">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-[12px] size-[16px] text-[color:var(--mq-muted,#6a5346)] forced-colors:text-[CanvasText]"
            />
            <input
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-expanded="true"
              aria-label={label}
              className={cn(
                "h-[40px] w-full appearance-none rounded-[10px] border pl-[38px] pr-[12px]",
                "bg-[color:var(--mq-input,#fbf6ef)] border-[var(--mq-input-brd,rgba(120,80,55,0.24))]",
                "text-[13px]/[1.2] font-bold text-[color:var(--mq-menu-ink,#33261e)]",
                "placeholder:font-medium placeholder:text-[color:var(--mq-muted,#6a5346)]",
                "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
                "forced-colors:border-[CanvasText]",
              )}
              onChange={(event) => handleQueryChange(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={placeholder}
              ref={inputRef}
              role="combobox"
              type="text"
              value={query}
            />
          </div>

          {/* The list. `onMouseDown` is cancelled so clicking a row cannot blur
              the input (the click itself still fires and runs the command). */}
          <div
            aria-label={label}
            className="mt-[8px] max-h-[300px] overflow-y-auto overflow-x-hidden"
            id={listboxId}
            onMouseDown={(event) => event.preventDefault()}
            role="listbox"
          >
            {resultCount > 0 ? (
              visibleGroups.map((group) => (
                <div aria-label={group.heading} key={group.id} role="group">
                  <div
                    aria-hidden="true"
                    className="px-[12px] pt-[10px] pb-[4px] text-[11px] font-extrabold uppercase tracking-[0.06em] text-[color:var(--mq-muted,#6a5346)] forced-colors:text-[CanvasText]"
                  >
                    {group.heading}
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    {group.items.map((item) => {
                      runningIndex += 1;
                      const index = runningIndex;
                      const isActive = index === activeIndex;
                      return (
                        <div
                          aria-disabled={item.disabled || undefined}
                          aria-selected={isActive}
                          className={OPTION_CLASS}
                          data-active={isActive ? "true" : "false"}
                          id={optionId(index)}
                          key={item.id}
                          onClick={() => runItem(index)}
                          onMouseEnter={() => {
                            if (!item.disabled) setActiveIndex(index);
                          }}
                          ref={(node) => {
                            itemRefs.current[index] = node;
                          }}
                          role="option"
                        >
                          {item.icon != null ? (
                            <span
                              aria-hidden="true"
                              className={cn(
                                "grid size-[18px] shrink-0 place-items-center text-[color:var(--mq-accent,#c9482f)]",
                                "[&_svg]:size-[16px] [&_svg]:shrink-0",
                                "forced-colors:text-[CanvasText] forced-colors:group-data-[active=true]/opt:text-[HighlightText]",
                              )}
                            >
                              {item.icon}
                            </span>
                          ) : null}
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.shortcut != null ? (
                            <span
                              aria-hidden="true"
                              className={cn(
                                "shrink-0 text-[11px] font-bold tracking-[0.02em] text-[color:var(--mq-muted,#6a5346)]",
                                "forced-colors:text-[CanvasText] forced-colors:group-data-[active=true]/opt:text-[HighlightText]",
                              )}
                            >
                              {item.shortcut}
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-[10px] px-[12px] py-[16px] text-[13px] font-bold text-[color:var(--mq-muted,#6a5346)] forced-colors:text-[CanvasText]">
                <SearchX aria-hidden="true" className="size-[16px] shrink-0 opacity-70" />
                <span>{emptyText}</span>
              </div>
            )}
          </div>

          {/* Result count, present before the text changes so the announcement
              is reliable. */}
          <span aria-live="polite" className={VISUALLY_HIDDEN} role="status">
            {resultLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export type CommandMenuVariantProps = VariantProps<typeof triggerVariants>;

export { triggerVariants };
