"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Mega Menu
 *
 * A horizontal bar of triggers; activating a trigger drops a FULL-WIDTH panel of
 * grouped link columns beneath the bar. Hand-rolled (there is no radix
 * navigation-menu in the allowlist): the panel is absolutely positioned inside a
 * `relative`/`isolate` wrapper, so it spans the component's own width with no
 * portal, and only one panel is ever open at a time.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 *   <MegaMenu
 *     aria-label="Main"
 *     material="clay"
 *     size="md"
 *     sections={[
 *       {
 *         id: "product",
 *         label: "Product",
 *         columns: [
 *           {
 *             id: "build",
 *             heading: "Build",
 *             icon: <Layers />,
 *             links: [
 *               { id: "editor", label: "Editor", href: "/editor", description: "Compose visually" },
 *               { id: "cli", label: "CLI", href: "/cli" },
 *             ],
 *           },
 *         ],
 *       },
 *     ]}
 *   />
 *
 * a11y: the bar is a `<nav aria-label>` landmark. Every trigger is a real
 * `<button aria-haspopup="true" aria-expanded>` whose `aria-controls` points at
 * the panel ONLY while it is mounted; its open state is carried by aria-expanded
 * and a rotating caret, never colour alone. The panel is a labelled `role="region"`
 * of columns, each a real heading over a list of real `<a href>` links; a link
 * marked `current` gets `aria-current="page"` plus weight and a reserved rule, so
 * the active item is never signalled by colour alone.
 *
 * Keyboard: Tab reaches every trigger in source order. Enter/Space/ArrowDown open
 * a trigger's panel and move focus to the first link; ArrowUp/ArrowDown rove
 * among the links (focus MOVES, roving tabindex), Home/End jump to the ends,
 * Escape closes and returns focus to the trigger, and Tab or a pointer press
 * outside closes.
 *
 * Local theming knobs (each read with a literal fallback):
 *
 *   --mq-bar / --mq-bar-brd / --mq-bar-grad / --mq-bar-shadow / --mq-bar-blur
 *       menubar surface, border, lighting, depth, backdrop blur
 *   --mq-trigger-ink / --mq-trigger-hover                idle label, hover wash
 *   --mq-trigger-open-bg / --mq-trigger-open-ink         open wash, open label
 *   --mq-panel / --mq-panel-brd / --mq-panel-grad        panel surface, border, wash
 *   --mq-panel-blur / --mq-panel-shadow                  panel backdrop blur, elevation
 *   --mq-heading / --mq-link / --mq-link-desc            column heading, link, sub-copy
 *   --mq-link-hover                                       link hover/focus wash
 *   --mq-accent                                           column-icon + caret tint
 *   --mq-ring                                             focus ring
 */

/** Palette per material. Declared on the nav root; the bar and panel inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-bar:#efe7db] [--mq-bar-brd:rgba(120,80,55,0.20)] [--mq-bar-blur:0px]",
    "[--mq-bar-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    // A chip that rides proud of the page: bright bloom on top, warm inner shade
    // below, its own hard side wall, then a tight cast shadow. Warm brown ink.
    "[--mq-bar-shadow:inset_0_2px_2px_rgba(255,255,255,0.60),inset_0_-2px_3px_rgba(120,40,25,0.16),0_2px_0_rgba(220,196,178,0.9),0_6px_14px_rgba(90,60,45,0.16)]",
    "[--mq-trigger-ink:#5b4a3c] [--mq-trigger-hover:rgba(255,255,255,0.55)]",
    "[--mq-trigger-open-bg:rgba(255,144,119,0.20)] [--mq-trigger-open-ink:#4a1d13]",
    "[--mq-panel:#f4ece0] [--mq-panel-brd:rgba(120,80,55,0.22)] [--mq-panel-blur:0px]",
    "[--mq-panel-grad:linear-gradient(180deg,rgba(255,255,255,0.50),rgba(151,92,58,0.05))]",
    "[--mq-panel-shadow:0_24px_48px_rgba(75,40,31,0.20),0_8px_16px_rgba(75,40,31,0.12)]",
    "[--mq-heading:#6a4632] [--mq-link:#33261e] [--mq-link-desc:#6a5346]",
    "[--mq-link-hover:rgba(201,72,47,0.10)] [--mq-accent:#c9482f] [--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-bar:rgba(255,255,255,0.62)] [--mq-bar-brd:rgba(255,255,255,0.75)] [--mq-bar-blur:16px]",
    "[--mq-bar-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo over a wide cool cast shadow. No side wall: glass has
    // no extrusion.
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_6px_18px_rgba(24,20,40,0.14)]",
    "[--mq-trigger-ink:#2f2f29] [--mq-trigger-hover:rgba(255,255,255,0.45)]",
    "[--mq-trigger-open-bg:rgba(255,255,255,0.55)] [--mq-trigger-open-ink:#1b1c1b]",
    // A frosted, light panel so the link labels stay legible over any backdrop.
    "[--mq-panel:rgba(244,247,248,0.90)] [--mq-panel-brd:rgba(255,255,255,0.72)] [--mq-panel-blur:18px]",
    "[--mq-panel-grad:linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0))]",
    "[--mq-panel-shadow:0_24px_50px_rgba(24,20,40,0.18),0_8px_18px_rgba(24,20,40,0.12)]",
    "[--mq-heading:#3a4657] [--mq-link:#1e1e1b] [--mq-link-desc:#45525e]",
    "[--mq-link-hover:rgba(23,24,23,0.06)] [--mq-accent:#171817] [--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-bar:#cfcbc2] [--mq-bar-brd:rgba(25,25,23,0.32)] [--mq-bar-blur:0px]",
    // The surface IS the gradient: lit over body, the moulded-plastic read.
    "[--mq-bar-grad:linear-gradient(180deg,#e2ded4,#cfcabf)]",
    // Hard 1px bevel of light on top, achromatic machined shade below, a shallow
    // wall and a tight cast shadow. The cold counterpart to clay's warm brown.
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-2px_3px_rgba(0,0,0,0.14),0_2px_0_rgba(168,164,155,0.9),0_5px_12px_rgba(38,36,31,0.24)]",
    "[--mq-trigger-ink:#33322d] [--mq-trigger-hover:rgba(255,255,255,0.42)]",
    "[--mq-trigger-open-bg:rgba(255,255,255,0.58)] [--mq-trigger-open-ink:#23231f]",
    // Warm greige — the #e6e3da family — so the panel belongs to the same moulded
    // material as the bar that spawned it.
    "[--mq-panel:#e6e3da] [--mq-panel-brd:rgba(25,25,23,0.30)] [--mq-panel-blur:0px]",
    "[--mq-panel-grad:linear-gradient(180deg,#f0ede6,#e6e3da)]",
    "[--mq-panel-shadow:0_24px_46px_rgba(38,36,31,0.28),0_8px_16px_rgba(38,36,31,0.18)]",
    "[--mq-heading:#4a4943] [--mq-link:#23231f] [--mq-link-desc:#4a4943]",
    "[--mq-link-hover:rgba(255,255,255,0.50)] [--mq-accent:#3f3e39] [--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme,
  // and both surfaces flip together with the labels on them.
  adaptive: [
    "[--mq-bar:#f1f0ec] [--mq-bar-brd:rgba(23,24,23,0.14)] [--mq-bar-blur:0px]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-bar-grad:none] [--mq-panel-grad:none] [--mq-panel-blur:0px]",
    "[--mq-bar-shadow:inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.07)]",
    "[--mq-trigger-ink:#55554e] [--mq-trigger-hover:rgba(23,24,23,0.05)]",
    "[--mq-trigger-open-bg:rgba(23,24,23,0.06)] [--mq-trigger-open-ink:#1c1c19]",
    "[--mq-panel:#ffffff] [--mq-panel-brd:rgba(23,24,23,0.14)]",
    "[--mq-panel-shadow:0_22px_44px_rgba(20,20,18,0.14),0_6px_14px_rgba(20,20,18,0.10)]",
    "[--mq-heading:#55554e] [--mq-link:#1c1c19] [--mq-link-desc:#55554e]",
    "[--mq-link-hover:rgba(23,24,23,0.05)] [--mq-accent:#171817] [--mq-ring:#171817]",
    "dark:[--mq-bar:#26262a] dark:[--mq-bar-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-bar-shadow:inset_0_0_0_rgba(0,0,0,0),0_1px_2px_rgba(0,0,0,0.40)]",
    "dark:[--mq-trigger-ink:#b9b7b0] dark:[--mq-trigger-hover:rgba(255,255,255,0.08)]",
    "dark:[--mq-trigger-open-bg:rgba(255,255,255,0.10)] dark:[--mq-trigger-open-ink:#f1efe9]",
    "dark:[--mq-panel:#26262a] dark:[--mq-panel-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-panel-shadow:0_22px_44px_rgba(0,0,0,0.55),0_6px_14px_rgba(0,0,0,0.40)]",
    "dark:[--mq-heading:#b9b7b0] dark:[--mq-link:#f1efe9] dark:[--mq-link-desc:#b9b7b0]",
    "dark:[--mq-link-hover:rgba(255,255,255,0.08)] dark:[--mq-accent:#f1efe9] dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type MegaMenuMaterial = keyof typeof MATERIAL_TOKENS;
type MegaMenuVariant = "default";
type MegaMenuSize = "sm" | "md" | "lg";

/**
 * Panel entrance keyframe, shipped with the component rather than a global sheet.
 * React 19 hoists this `<style>` and dedupes it by `href`, so a page with many
 * mega menus emits one rule. The keyframe's resting end-state is the panel's open
 * style (opacity 1, no offset), so `motion-reduce:animate-none` keeps the panel
 * fully open — only the small drop is dropped.
 */
const MEGA_KEYFRAMES = `
@keyframes mq-mm-panel-in{from{opacity:0;translate:0 -8px}to{opacity:1;translate:0 0}}`;

function MegaMenuKeyframes() {
  return (
    <style href="mq-mega-menu" precedence="medium">
      {MEGA_KEYFRAMES}
    </style>
  );
}

const navVariants = cva("group/mm relative isolate w-full", {
  variants: {
    // One treatment today: the drop-panel bar is the identity. It stays a real
    // axis so the registry, the docs switcher and a future treatment have a seam.
    variant: { default: "" },
    size: {
      sm: "[--mq-bar-radius:14px] [--mq-bar-pad:3px] [--mq-trigger-radius:11px] [--mq-panel-radius:14px] [--mq-panel-pad:16px] [--mq-col-gap:8px]",
      md: "[--mq-bar-radius:17px] [--mq-bar-pad:4px] [--mq-trigger-radius:13px] [--mq-panel-radius:18px] [--mq-panel-pad:20px] [--mq-col-gap:10px]",
      lg: "[--mq-bar-radius:21px] [--mq-bar-pad:5px] [--mq-trigger-radius:16px] [--mq-panel-radius:22px] [--mq-panel-pad:26px] [--mq-col-gap:12px]",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

const barClass = [
  "relative z-20 m-0 inline-flex w-fit max-w-full list-none items-center gap-[2px]",
  "rounded-[var(--mq-bar-radius,17px)] border border-[var(--mq-bar-brd,rgba(120,80,55,0.20))]",
  "bg-[var(--mq-bar,#efe7db)] p-[var(--mq-bar-pad,4px)]",
  "[background-image:var(--mq-bar-grad,linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06)))]",
  "backdrop-blur-[var(--mq-bar-blur,0px)]",
  "shadow-[var(--mq-bar-shadow,inset_0_2px_2px_rgba(255,255,255,0.60),inset_0_-2px_3px_rgba(120,40,25,0.16),0_2px_0_rgba(220,196,178,0.9),0_6px_14px_rgba(90,60,45,0.16))]",
  // Fills, gradients, blur and shadows are discarded or meaningless once the OS
  // paints high-contrast; clear the ornament and keep a real border.
  "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:shadow-none forced-colors:backdrop-blur-none",
].join(" ");

const triggerVariants = cva(
  [
    // `group/mmtrigger` lets the caret react to this trigger's own `data-open`.
    "group/mmtrigger relative z-10 inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-[6px]",
    "whitespace-nowrap appearance-none bg-transparent tracking-[-0.01em]",
    "rounded-[var(--mq-trigger-radius,13px)] font-semibold text-[color:var(--mq-trigger-ink,#5b4a3c)]",
    // A top border is always reserved, transparent by default; it is what
    // forced-colors uses to mark the open trigger once fills are discarded, so
    // the marking never changes the box model or shifts the row.
    "border-0 border-t-2 border-t-transparent",
    // Exactly the two properties that change across states: the hover/open wash
    // and the label colour. Weight snaps and is not animated.
    "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-trigger-hover,rgba(255,255,255,0.55))]",
    // Open trigger: heavier weight AND its own colour, so state is never colour
    // alone (the caret rotation carries it too).
    "data-[open=true]:font-bold data-[open=true]:text-[color:var(--mq-trigger-open-ink,#4a1d13)]",
    "data-[open=true]:bg-[var(--mq-trigger-open-bg,rgba(255,144,119,0.20))]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    "forced-colors:data-[open=true]:border-t-[CanvasText]",
    "disabled:cursor-not-allowed disabled:opacity-45",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-[40px] px-[12px] text-[length:12px]",
        md: "min-h-[44px] px-[16px] text-[length:13px]",
        lg: "min-h-[48px] px-[20px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const panelClass = [
  // Absolutely positioned full-width within the `relative isolate` nav — no
  // portal. `top-full` drops it to the bar's bottom edge; `left-0 right-0` spans
  // the component's own width.
  "absolute left-0 right-0 top-full z-10 mt-[8px] overflow-hidden",
  "rounded-[var(--mq-panel-radius,18px)] border bg-[var(--mq-panel,#f4ece0)] border-[var(--mq-panel-brd,rgba(120,80,55,0.22))]",
  "[background-image:var(--mq-panel-grad,none)] backdrop-blur-[var(--mq-panel-blur,0px)]",
  "shadow-[var(--mq-panel-shadow,0_24px_48px_rgba(75,40,31,0.20),0_8px_16px_rgba(75,40,31,0.12))]",
  "animate-[mq-mm-panel-in_200ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
  // Fills, washes, blur and shadows are discarded in forced colours; a real
  // border keeps the surface's bounds and a solid Canvas backs the links.
  "forced-colors:border-[CanvasText] forced-colors:shadow-none forced-colors:bg-[Canvas] forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
].join(" ");

const HEADING_TEXT: Record<MegaMenuSize, string> = {
  sm: "text-[length:10px]",
  md: "text-[length:11px]",
  lg: "text-[length:12px]",
};
const LABEL_TEXT: Record<MegaMenuSize, string> = {
  sm: "text-[length:12px]",
  md: "text-[length:13px]",
  lg: "text-[length:14px]",
};
const DESC_TEXT: Record<MegaMenuSize, string> = {
  sm: "text-[length:11px]",
  md: "text-[length:12px]",
  lg: "text-[length:13px]",
};

/** A single destination in a column. A real anchor with an accessible name. */
export type MegaMenuLink = {
  /** Stable key; also the React list key. */
  id: string;
  label: string;
  href: string;
  /** Optional supporting copy shown under the label. */
  description?: string;
  /** Marks the current page: sets aria-current="page" plus weight and a rule. */
  current?: boolean;
};

/** A titled group of links inside a section's panel. */
export type MegaMenuColumn = {
  /** Stable key; also the React list key. */
  id: string;
  heading: string;
  /** Optional leading glyph for the heading (a lucide icon element). Decorative. */
  icon?: React.ReactNode;
  links: MegaMenuLink[];
};

/** A top-level trigger and the panel of columns it discloses. */
export type MegaMenuSection = {
  /** Stable key; also the React list key and the open-state identity. */
  id: string;
  label: string;
  columns: MegaMenuColumn[];
};

export type MegaMenuProps = Omit<
  React.ComponentPropsWithRef<"nav">,
  "onChange" | "children"
> & {
  sections: readonly MegaMenuSection[];
  material?: MegaMenuMaterial;
  variant?: MegaMenuVariant;
  size?: MegaMenuSize;
  /** Disables every trigger; no panel can be opened. */
  disabled?: boolean;
  /** Heading rank for the column titles. Must fit the surrounding outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

export function MegaMenu({
  "aria-label": ariaLabel = "Main",
  className,
  disabled = false,
  headingLevel = 3,
  material = "clay",
  ref,
  sections,
  size = "md",
  variant = "default",
  ...props
}: MegaMenuProps) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  // Roving index within the open section's flattened link list. -1 means focus
  // has not been moved into the panel (it is still on the trigger).
  const [activeLink, setActiveLink] = React.useState(-1);
  const baseId = React.useId();

  const rootRef = React.useRef<HTMLElement | null>(null);
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const linkRefs = React.useRef<Array<HTMLAnchorElement | null>>([]);

  const panelId = `${baseId}-panel`;
  const triggerId = (id: string) => `${baseId}-trigger-${id}`;

  const openSection = React.useMemo(
    () => sections.find((section) => section.id === openId) ?? null,
    [openId, sections],
  );
  const flatLinks = React.useMemo(
    () => (openSection ? openSection.columns.flatMap((column) => column.links) : []),
    [openSection],
  );
  // Flat index of each column's FIRST link. `flatLinks` is the columns' links
  // concatenated in order, so a link's roving index is its column's offset plus
  // its own position. Derived here rather than by incrementing a cursor across
  // the nested maps below: a render-scoped variable reassigned from inside a
  // callback is exactly what the React compiler rejects, and the accumulator is
  // local to this memo, never escaping into a child closure.
  const columnOffsets = React.useMemo(() => {
    const offsets: number[] = [];
    let total = 0;
    for (const column of openSection?.columns ?? []) {
      offsets.push(total);
      total += column.links.length;
    }
    return offsets;
  }, [openSection]);
  // When focus has not been driven into the panel the first link stays tabbable,
  // so a pointer user who opened the panel can still Tab into it.
  const rovingIndex = activeLink >= 0 ? activeLink : 0;

  const openPanel = (id: string, focusFirst: boolean) => {
    setOpenId(id);
    setActiveLink(focusFirst ? 0 : -1);
  };

  const close = (returnFocus: boolean) => {
    if (returnFocus && openId) triggerRefs.current[openId]?.focus();
    setOpenId(null);
    setActiveLink(-1);
  };

  // Move focus to whichever link is the roving-active one. Only calls focus() —
  // never setState — so it is a legal effect body; the state that positions the
  // roving index lives in the handlers that cause the move.
  React.useEffect(() => {
    if (openId == null || activeLink < 0) return;
    linkRefs.current[activeLink]?.focus();
  }, [openId, activeLink]);

  // A pointer press anywhere outside the component closes the open panel.
  // Registered only while open; the setState runs in the listener callback (not
  // the effect body), which the React 19 set-state-in-effect rule allows.
  React.useEffect(() => {
    if (openId == null) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenId(null);
        setActiveLink(-1);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openId]);

  function moveActive(direction: 1 | -1) {
    const count = flatLinks.length;
    if (count === 0) return;
    setActiveLink((prev) => {
      if (prev < 0) return direction === 1 ? 0 : count - 1;
      return (prev + direction + count) % count;
    });
  }

  function handleTriggerClick(event: React.MouseEvent<HTMLButtonElement>, id: string) {
    if (disabled) return;
    // A keyboard-driven activation (Enter/Space) reports detail 0; a mouse click
    // reports >= 1. So Enter/Space open AND drive focus to the first link, while
    // a mouse click just opens with focus left on the trigger — and no keydown
    // interception is needed, so there is no Space keyup double-fire to fight.
    const keyboard = event.detail === 0;
    if (openId === id) close(keyboard);
    else openPanel(id, keyboard);
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, id: string) {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (openId === id) setActiveLink(0);
      else openPanel(id, true);
    } else if (event.key === "Escape" && openId === id) {
      event.preventDefault();
      close(true);
    }
  }

  function handlePanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
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
        if (flatLinks.length > 0) setActiveLink(0);
        break;
      case "End":
        event.preventDefault();
        if (flatLinks.length > 0) setActiveLink(flatLinks.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        // Absorb the dismiss key so it does not also close an Escape-closable
        // ancestor (a dialog or menu the mega menu sits inside).
        event.stopPropagation();
        close(true);
        break;
      case "Tab":
        // Tab leaves the panel: close it and hand focus back to the trigger so the
        // next Tab continues from the bar, never from an unmounting link.
        event.preventDefault();
        close(true);
        break;
      default:
        break;
    }
  }

  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={cn(navVariants({ size, variant }), MATERIAL_TOKENS[material], className)}
      data-material={material}
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
    >
      <MegaMenuKeyframes />
      <ul className={barClass}>
        {sections.map((section) => {
          const isOpen = section.id === openId;
          return (
            <li className="inline-flex" key={section.id}>
              <button
                aria-controls={isOpen ? panelId : undefined}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={triggerVariants({ size })}
                data-mm-trigger=""
                data-open={isOpen ? "true" : "false"}
                disabled={disabled}
                id={triggerId(section.id)}
                onClick={(event) => handleTriggerClick(event, section.id)}
                onKeyDown={(event) => handleTriggerKeyDown(event, section.id)}
                ref={(node) => {
                  triggerRefs.current[section.id] = node;
                }}
                type="button"
              >
                {section.label}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-[1.05em] shrink-0",
                    "transition-transform duration-200 ease-out motion-reduce:transition-none",
                    "group-data-[open=true]/mmtrigger:rotate-180",
                    "forced-colors:text-[CanvasText]",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {openSection ? (
        <div
          aria-labelledby={triggerId(openSection.id)}
          className={panelClass}
          id={panelId}
          onKeyDown={handlePanelKeyDown}
          role="region"
        >
          <div
            className="grid gap-[var(--mq-col-gap,10px)] p-[var(--mq-panel-pad,20px)] [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]"
          >
            {openSection.columns.map((column, columnIndex) => {
              const headingId = `${baseId}-${openSection.id}-${column.id}`;
              return (
                <div className="flex min-w-0 flex-col gap-[6px]" key={column.id}>
                  <Heading
                    className={cn(
                      "m-0 flex items-center gap-[8px] font-extrabold uppercase tracking-[0.14em]",
                      "text-[color:var(--mq-heading,#6a4632)] forced-colors:text-[CanvasText]",
                      HEADING_TEXT[size],
                    )}
                    id={headingId}
                  >
                    {column.icon != null ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid shrink-0 place-items-center text-[color:var(--mq-accent,#c9482f)]",
                          "[&_svg]:size-[1.15em] [&_svg]:shrink-0 forced-colors:text-[CanvasText]",
                        )}
                      >
                        {column.icon}
                      </span>
                    ) : null}
                    <span className="min-w-0">{column.heading}</span>
                  </Heading>
                  <ul aria-labelledby={headingId} className="m-0 flex list-none flex-col gap-[2px] p-0">
                    {column.links.map((link, linkIndex) => {
                      const index = columnOffsets[columnIndex] + linkIndex;
                      return (
                        <li key={link.id}>
                          <a
                            aria-current={link.current ? "page" : undefined}
                            className={cn(
                              "group/mmlink flex flex-col justify-center gap-[2px] rounded-[10px] px-[10px] py-[8px]",
                              "min-h-[40px] no-underline",
                              // A reserved left rule, transparent until current —
                              // kept in the box model so forced-colors can colour
                              // it, and never the only signal (weight rides along).
                              "border-l-2 border-l-transparent",
                              "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                              "text-[color:var(--mq-link,#33261e)]",
                              "hover:bg-[var(--mq-link-hover,rgba(201,72,47,0.10))]",
                              "focus:bg-[var(--mq-link-hover,rgba(201,72,47,0.10))]",
                              "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--mq-ring,#171817)]",
                              "aria-[current=page]:font-bold aria-[current=page]:border-l-[var(--mq-accent,#c9482f)]",
                              "forced-colors:focus-visible:outline-[Highlight]",
                              "forced-colors:hover:bg-[Highlight] forced-colors:hover:text-[HighlightText]",
                              "forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText]",
                              "forced-colors:aria-[current=page]:border-l-[CanvasText]",
                            )}
                            href={link.href}
                            onClick={() => close(false)}
                            ref={(node) => {
                              linkRefs.current[index] = node;
                            }}
                            tabIndex={index === rovingIndex ? 0 : -1}
                          >
                            <span className={cn("font-semibold tracking-[-0.01em]", LABEL_TEXT[size])}>
                              {link.label}
                            </span>
                            {link.description != null ? (
                              <span
                                className={cn(
                                  "text-[color:var(--mq-link-desc,#6a5346)] forced-colors:text-[CanvasText]",
                                  DESC_TEXT[size],
                                )}
                              >
                                {link.description}
                              </span>
                            ) : null}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </nav>
  );
}

export type MegaMenuVariantProps = VariantProps<typeof triggerVariants>;

export { navVariants, triggerVariants };
