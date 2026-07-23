"use client";

import * as React from "react";
import { SmilePlus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Reaction Picker
 *
 * A messaging-style emoji reaction control. A single icon trigger discloses a
 * small HORIZONTAL popover of reaction buttons (like, love, laugh, wow, sad,
 * angry); choosing one sets the current reaction and closes. The trigger is a
 * real native `<button>` carrying an accessible name, `aria-haspopup="menu"`,
 * `aria-expanded` and `aria-controls`; the popover is a `role="menu"` of
 * `role="menuitem"` buttons laid out in a row.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The trigger's material recipe and press physics are
 * Button's PRIMARY intent verbatim (resting shadow, a hover lift, and an active
 * SINK into a pressed inset well); the popover reuses Split Button's menu
 * surface tokens so the sheet belongs to the same moulded material.
 *
 *   <ReactionPicker
 *     material="clay"
 *     size="md"
 *     defaultReactionId="love"
 *     onReact={(id) => save(id)}
 *   />
 *
 * Keyboard: Click / Enter / Space open the popover and move focus to the first
 * reaction. ArrowRight / ArrowLeft rove horizontally (focus MOVES to the item),
 * Home / End jump to the ends, Enter / Space activate (the items are real
 * buttons), Escape and Tab close and RETURN focus to the trigger, and a pointer
 * press outside closes. ArrowDown / ArrowRight on the closed trigger open on the
 * first reaction; ArrowUp / ArrowLeft open on the last.
 *
 * Local theming knobs (override from a parent or `className` to retheme without
 * forking the recipe — each is read with a literal fallback):
 *
 *   --mq-body / --mq-lit / --mq-edge   trigger surface, top highlight, edge
 *   --mq-text / --mq-brd / --mq-ring   trigger glyph, border, focus ring
 *   --mq-accent                        selected-reaction ring tint
 *   --mq-menu / --mq-menu-brd          popover surface + border
 *   --mq-menu-ink / --mq-menu-hover    popover ink + hover/focus wash
 *   --mq-menu-grad / --mq-menu-blur    popover wash + backdrop blur
 *   --mq-menu-shadow                   popover elevation
 */

/**
 * Palette per material. Declared once on the root wrapper; the trigger and the
 * popover inherit it through CSS. The values are Button's PRIMARY intent
 * verbatim, so the trigger's glyph contrast contract is inherited too
 * (>= 4.5:1 on every material). `adaptive` additionally flips on
 * `prefers-color-scheme` because it names only opaque surfaces that flip
 * together with the glyphs on them.
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
    // A frosted, light popover so the material stays legible however dark the
    // trigger surface reads over its backdrop.
    "[--mq-menu:rgba(244,247,248,0.90)] [--mq-menu-brd:rgba(255,255,255,0.72)] [--mq-menu-ink:#1e1e1b]",
    "[--mq-menu-hover:rgba(23,24,23,0.06)] [--mq-menu-blur:16px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0))]",
    "[--mq-menu-shadow:0_16px_34px_rgba(24,20,40,0.18),0_4px_12px_rgba(24,20,40,0.12)]",
  ].join(" "),
  skeuo: [
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
    "[--mq-accent:#3f3e39]",
    // Greige, warm — the #e6e3da family — so the popover belongs to the same
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

type ReactionMaterial = keyof typeof MATERIAL_TOKENS;
type ReactionSize = "sm" | "md" | "lg";
type ReactionVariant = "default";

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so the docs surface can render the focused look
 * without synthesising a keyboard event. The width/offset/colour together fully
 * replace the UA outline, so it is never reset with `outline-none`. Raised to
 * `z-10` so the popover never clips the trigger's ring.
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
 * transition names `translate` explicitly — every property in the list is one
 * some state actually changes, and none is phantom.
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
 * The four material recipes, PRIMARY-intent values inlined. Press physics per
 * material: clay sinks ~3px into a warm inset well, skeuo ~4px, glass/adaptive
 * ~1px — the hover lift grows the shadow, the active state SINKS into the inset.
 * `motion-reduce` (on the base) drops the travel, but `:active` still applies
 * the inset instantly, so the tactile feedback survives even without animation.
 */
const MATERIAL_SURFACE: Record<ReactionMaterial, string> = {
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

/** Square icon trigger. */
const triggerVariants = cva(cn(SURFACE_BASE, "rounded-[var(--mq-radius,15px)]"), {
  variants: {
    material: MATERIAL_SURFACE,
    size: {
      sm: "h-[36px] w-[36px] text-[12px]/[1] [--mq-radius:12px]",
      md: "h-[44px] w-[44px] text-[13px]/[1] [--mq-radius:15px]",
      lg: "h-[52px] w-[52px] text-[14px]/[1] [--mq-radius:18px]",
    },
  },
  defaultVariants: { material: "clay", size: "md" },
});

/** Emoji glyph size on the trigger when a reaction is selected. */
const TRIGGER_EMOJI: Record<ReactionSize, string> = {
  sm: "text-[17px]",
  md: "text-[20px]",
  lg: "text-[24px]",
};

/** SmilePlus glyph size on the trigger when nothing is selected. */
const TRIGGER_ICON: Record<ReactionSize, string> = {
  sm: "size-[18px]",
  md: "size-[20px]",
  lg: "size-[24px]",
};

/** Round reaction-button footprint inside the popover. */
const ITEM_SIZE: Record<ReactionSize, string> = {
  sm: "size-[38px]",
  md: "size-[44px]",
  lg: "size-[52px]",
};

/** Emoji glyph size inside a reaction button. */
const ITEM_EMOJI: Record<ReactionSize, string> = {
  sm: "text-[20px]",
  md: "text-[24px]",
  lg: "text-[28px]",
};

/**
 * A reaction button. `scale`, not `transform`: Tailwind v4 writes its
 * `scale-*` utilities to the standalone `scale` property, so the emoji's gentle
 * pop transition (below) names `scale` — `transition-transform` would animate
 * nothing against a standalone scale and the glyph would snap.
 */
const ITEM_BASE = cn(
  "group/ri relative grid shrink-0 place-items-center rounded-full",
  "cursor-pointer appearance-none border-0 bg-transparent",
  "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
  // The focused item is the roving active item, so the wash is keyed off real
  // `:focus` (which programmatic focus triggers) as well as hover.
  "hover:bg-[var(--mq-menu-hover,rgba(201,72,47,0.12))]",
  "focus:bg-[var(--mq-menu-hover,rgba(201,72,47,0.12))]",
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--mq-ring,#171817)]",
  "disabled:cursor-not-allowed disabled:opacity-45",
  // The current reaction wears an accent ring. Not colour alone: its accessible
  // name gains ", current reaction" and it carries `aria-current`.
  "data-[selected=true]:shadow-[inset_0_0_0_2px_var(--mq-accent,#c9482f)]",
  // Washes and shadows are discarded in forced colours; the active item takes a
  // system mark and the current one keeps a real CanvasText border.
  "forced-colors:hover:bg-[Highlight] forced-colors:focus:bg-[Highlight]",
  "forced-colors:focus-visible:outline-[Highlight]",
  "forced-colors:data-[selected=true]:border forced-colors:data-[selected=true]:border-[CanvasText]",
);

/**
 * Popover entrance keyframe, shipped with the component instead of a global
 * sheet. React 19 hoists this `<style>` and dedupes it by `href`, so a page
 * with many pickers emits one rule. The keyframe's resting end-state is the
 * popover's base style, so `motion-reduce:animate-none` keeps it fully open —
 * only the small rise is dropped.
 */
const MENU_KEYFRAMES = `
@keyframes mq-rp-menu-in{from{opacity:0;translate:0 -6px}to{opacity:1;translate:0 0}}`;

function MenuKeyframes() {
  return (
    <style href="mq-reaction-picker" precedence="medium">
      {MENU_KEYFRAMES}
    </style>
  );
}

/** A single reaction offered by the picker. */
export type Reaction = {
  /** Stable key; also the React list key and the value handed to `onReact`. */
  id: string;
  /** The unicode glyph shown. Rendered `aria-hidden`; never the sole carrier. */
  emoji: string;
  /** The accessible name (e.g. "Love"). Supplied via `aria-label` on the item. */
  label: string;
  /** Skipped by roving navigation and non-activatable. */
  disabled?: boolean;
};

/** The default six reactions, in messaging order. */
const DEFAULT_REACTIONS: Reaction[] = [
  { id: "like", emoji: "👍", label: "Like" },
  { id: "love", emoji: "❤️", label: "Love" },
  { id: "laugh", emoji: "😂", label: "Laugh" },
  { id: "wow", emoji: "😮", label: "Wow" },
  { id: "sad", emoji: "😢", label: "Sad" },
  { id: "angry", emoji: "😡", label: "Angry" },
];

type ReactionPickerOwnProps = {
  /** Reactions offered by the popover. Defaults to the six standard ones. */
  reactions?: Reaction[];
  material?: ReactionMaterial;
  size?: ReactionSize;
  /** Single presentation variant; reserved for future tone axes. */
  variant?: ReactionVariant;
  /** Accessible name for the trigger while nothing is selected. */
  triggerLabel?: string;
  /** Accessible name for the popover menu. */
  menuLabel?: string;
  /** Initial current reaction id (uncontrolled). */
  defaultReactionId?: string;
  /** Called with the chosen reaction id, before the popover closes. */
  onReact?: (reactionId: string) => void;
};

/**
 * `Omit` the own props off the native button props so the rest — `disabled`,
 * `data-*`, `aria-*`, `ref` — spread straight onto the trigger `<button>`.
 * `className` dresses the outer wrapper. `children`/`onClick`/`type` are owned
 * by the component and removed from the public surface.
 */
export type ReactionPickerProps = ReactionPickerOwnProps &
  Omit<
    React.ComponentPropsWithRef<"button">,
    keyof ReactionPickerOwnProps | "children" | "onClick" | "type"
  >;

export function ReactionPicker({
  className,
  defaultReactionId,
  disabled = false,
  material = "clay",
  menuLabel = "Choose a reaction",
  onReact,
  reactions = DEFAULT_REACTIONS,
  size = "md",
  triggerLabel = "Add reaction",
  variant = "default",
  ...triggerProps
}: ReactionPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [selectedId, setSelectedId] = React.useState<string | undefined>(defaultReactionId);
  const [announcement, setAnnouncement] = React.useState("");
  const menuId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndices = React.useMemo(
    () =>
      reactions
        .map((reaction, index) => (reaction.disabled ? -1 : index))
        .filter((index) => index >= 0),
    [reactions],
  );

  const selected = React.useMemo(
    () => reactions.find((reaction) => reaction.id === selectedId),
    [reactions, selectedId],
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

  // On open, move focus into the popover — to the active item, or to the menu
  // surface itself when every reaction is disabled so keyboard focus is never lost.
  React.useEffect(() => {
    if (!open) return;
    const target = activeIndex >= 0 ? itemRefs.current[activeIndex] : menuRef.current;
    target?.focus();
  }, [open, activeIndex]);

  // A pointer press anywhere outside the wrapper closes the popover. Registered
  // only while open, and cleaned up on close/unmount.
  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function selectReaction(index: number) {
    const reaction = reactions[index];
    if (!reaction || reaction.disabled) return;
    setSelectedId(reaction.id);
    setAnnouncement(`Reacted with ${reaction.label}`);
    onReact?.(reaction.id);
    closeAndFocusTrigger();
  }

  function handleTriggerClick() {
    if (disabled) return;
    if (open) setOpen(false);
    else openMenu("first");
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      openMenu("first");
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
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
      case "ArrowRight":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowLeft":
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
        // Escape-closable ancestor (a dialog or menu the picker sits in).
        event.stopPropagation();
        closeAndFocusTrigger();
        break;
      case "Tab":
        // Tab leaves the popover; close it and hand focus back to the trigger so
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
    >
      <MenuKeyframes />

      {/*
        Live region, always in the DOM so the confirmation is announced reliably
        the instant it arrives rather than racing a node that only mounts with it.
      */}
      <span aria-live="polite" className="sr-only" role="status">
        {announcement}
      </span>

      <button
        {...triggerProps}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={selected ? `Current reaction: ${selected.label}. Change reaction` : triggerLabel}
        className={cn(triggerVariants({ material, size }))}
        data-open={open ? "true" : "false"}
        disabled={disabled}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        {selected ? (
          <span aria-hidden="true" className={cn("block leading-none", TRIGGER_EMOJI[size])}>
            {selected.emoji}
          </span>
        ) : (
          <SmilePlus
            aria-hidden="true"
            className={cn("shrink-0 forced-colors:text-[CanvasText]", TRIGGER_ICON[size])}
          />
        )}
      </button>

      {open ? (
        <div
          aria-label={menuLabel}
          className={cn(
            "absolute left-0 top-full z-50 mt-[8px] p-[6px]",
            "flex flex-row items-center gap-[2px]",
            "rounded-[16px] border bg-[var(--mq-menu,#f4ece0)] border-[var(--mq-menu-brd,rgba(120,80,55,0.22))]",
            "[background-image:var(--mq-menu-grad,none)] backdrop-blur-[var(--mq-menu-blur,0px)]",
            "text-[color:var(--mq-menu-ink,#33261e)]",
            "shadow-[var(--mq-menu-shadow,0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14))]",
            "animate-[mq-rp-menu-in_160ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
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
          {reactions.map((reaction, index) => {
            const isSelected = reaction.id === selectedId;
            return (
              <button
                aria-current={isSelected ? "true" : undefined}
                aria-label={isSelected ? `${reaction.label}, current reaction` : reaction.label}
                className={cn(ITEM_BASE, ITEM_SIZE[size])}
                data-selected={isSelected ? "true" : "false"}
                disabled={reaction.disabled}
                key={reaction.id}
                onClick={() => selectReaction(index)}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                role="menuitem"
                tabIndex={index === activeIndex ? 0 : -1}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block leading-none select-none",
                    "transition-[scale] duration-150 ease-out motion-reduce:transition-none",
                    "group-hover/ri:scale-[1.28] group-focus/ri:scale-[1.28] group-active/ri:scale-[0.9]",
                    ITEM_EMOJI[size],
                  )}
                >
                  {reaction.emoji}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export type ReactionPickerVariantProps = VariantProps<typeof triggerVariants>;

export { triggerVariants };
