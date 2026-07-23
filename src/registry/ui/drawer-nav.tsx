"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Drawer Nav
 *
 * A trigger button opens a bounded side panel that slides in from the left or
 * right over a dimming backdrop and holds navigation links. It is DISTINCT from
 * the full-screen Hamburger Menu Overlay: the same modal mechanics (focus trap,
 * Escape, return focus, body-scroll lock, backdrop click) around a smaller panel
 * pinned to one edge instead of a full-bleed sheet.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The only runtime dependency beyond React and `cn`
 * is two lucide glyphs — the trigger's Menu and the panel's close X.
 *
 *   <DrawerNav
 *     items={[
 *       { id: "home", label: "Home", href: "/", icon: <Home />, current: true },
 *       { id: "team", label: "Team", href: "/team", icon: <Users /> },
 *     ]}
 *     material="clay"
 *     size="md"
 *     side="left"
 *     title="Navigation"
 *   />
 *
 * The trigger is a real `<button aria-expanded aria-controls aria-haspopup="dialog">`.
 * The panel is a `role="dialog" aria-modal="true"` surface with an accessible
 * name that traps focus (Tab / Shift+Tab cycle), closes on Escape (returning
 * focus to the trigger), closes when the backdrop or a link is clicked, and locks
 * body scroll while open. Every link is a real `<a href>` (or a `<button>` when no
 * `href` is given), so the browser's own navigation and keyboard handling do the
 * work. The active link carries `aria-current="page"`, a heavier weight AND a
 * reserved left rule, so its state is never signalled by colour alone.
 *
 * Local theming knobs (each read with a literal fallback):
 *
 *   --mq-btn / --mq-btn-grad / --mq-btn-shadow   trigger surface, wash, depth
 *   --mq-edge                                    trigger slab side wall (clay / skeuo)
 *   --mq-icon                                    trigger + close glyph
 *   --mq-scrim / --mq-scrim-blur                 backdrop dim + blur
 *   --mq-panel / --mq-panel-grad / --mq-panel-shadow  panel surface, wash, elevation
 *   --mq-panel-brd / --mq-blur                   panel border + backdrop blur (glass)
 *   --mq-ink / --mq-muted / --mq-accent          link label, eyebrow, active/hover tint
 *   --mq-hover-bg                                link hover + active wash
 *   --mq-ring                                    focus ring
 */

/** Palette per material. Declared on the trigger AND on the overlay layer. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-btn:#efe7db] [--mq-edge:#c9482f] [--mq-icon:#4a1d13]",
    "[--mq-btn-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    // The trigger is a chip that rides proud of the page: a bright bloom on top,
    // a warm inner shade below, the slab's own hard side wall, then a tight cast
    // shadow. Warm brown ink throughout — clay never casts black.
    "[--mq-btn-shadow:inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_4px_9px_rgba(75,40,31,0.24)]",
    "[--mq-scrim:rgba(75,40,31,0.34)] [--mq-scrim-blur:0px]",
    "[--mq-panel:#f4ece0] [--mq-panel-brd:rgba(120,80,55,0.22)] [--mq-blur:0px]",
    "[--mq-panel-grad:linear-gradient(180deg,rgba(255,255,255,0.50),rgba(151,92,58,0.05))]",
    "[--mq-panel-shadow:0_24px_60px_rgba(75,40,31,0.30),0_8px_20px_rgba(75,40,31,0.18)]",
    "[--mq-ink:#33261e] [--mq-muted:#6a5346] [--mq-accent:#c9482f]",
    "[--mq-hover-bg:rgba(201,72,47,0.10)] [--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-btn:rgba(255,255,255,0.62)] [--mq-icon:#1e1e1b]",
    "[--mq-btn-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo over a wide cool cast shadow. No side wall: glass has
    // no extrusion.
    "[--mq-btn-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_6px_18px_rgba(24,20,40,0.14)]",
    "[--mq-scrim:rgba(24,20,40,0.30)] [--mq-scrim-blur:2px]",
    // The panel is a frosted sheet — translucent, but opaque enough that link
    // text stays legible over whatever page sits behind it.
    "[--mq-panel:rgba(244,247,248,0.86)] [--mq-panel-brd:rgba(255,255,255,0.72)] [--mq-blur:18px]",
    "[--mq-panel-grad:linear-gradient(180deg,rgba(255,255,255,0.36),rgba(255,255,255,0))]",
    "[--mq-panel-shadow:0_24px_60px_rgba(24,20,40,0.22),0_8px_22px_rgba(24,20,40,0.14)]",
    "[--mq-ink:#1e1e1b] [--mq-muted:#36362f] [--mq-accent:#171817]",
    "[--mq-hover-bg:rgba(23,24,23,0.06)] [--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-btn:#cfcbc2] [--mq-edge:#a8a49b] [--mq-icon:#23231f]",
    // The surface IS the gradient: lit over body, the moulded-plastic read.
    "[--mq-btn-grad:linear-gradient(180deg,#fbfaf6,#e6e3da)]",
    // A hard 1px bevel of light on top, an achromatic machined shade below, a
    // shallow wall, and a tight cast shadow — the cold counterpart to clay.
    "[--mq-btn-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(0,0,0,0.16),0_2px_0_var(--mq-edge,#a8a49b),0_4px_8px_rgba(38,36,31,0.26)]",
    "[--mq-scrim:rgba(38,36,31,0.36)] [--mq-scrim-blur:0px]",
    // Warm greige — the #e6e3da family — so the panel belongs to the same moulded
    // material as the control that spawned it.
    "[--mq-panel:#e6e3da] [--mq-panel-brd:rgba(25,25,23,0.30)] [--mq-blur:0px]",
    "[--mq-panel-grad:linear-gradient(180deg,#f0ede6,#e6e3da)]",
    "[--mq-panel-shadow:0_24px_58px_rgba(38,36,31,0.34),0_8px_18px_rgba(38,36,31,0.22)]",
    "[--mq-ink:#23231f] [--mq-muted:#4a4943] [--mq-accent:#3f3e39]",
    "[--mq-hover-bg:rgba(255,255,255,0.50)] [--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  // Safe here because every surface it names is opaque (or a plain dim) and flips
  // together with the text that sits on it.
  adaptive: [
    "[--mq-btn:#ffffff] [--mq-icon:#1c1c19]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-btn-grad:none] [--mq-panel-grad:none]",
    // Two layers, not four: adaptive earns its presence from a contact shadow.
    "[--mq-btn-shadow:inset_0_0_0_rgba(20,20,18,0),0_2px_6px_rgba(20,20,18,0.16)]",
    "[--mq-scrim:rgba(20,20,18,0.34)] [--mq-scrim-blur:0px]",
    "[--mq-panel:#ffffff] [--mq-panel-brd:rgba(23,24,23,0.14)] [--mq-blur:0px]",
    "[--mq-panel-shadow:0_22px_54px_rgba(20,20,18,0.18),0_6px_16px_rgba(20,20,18,0.12)]",
    "[--mq-ink:#1c1c19] [--mq-muted:#55554e] [--mq-accent:#171817]",
    "[--mq-hover-bg:rgba(23,24,23,0.06)] [--mq-ring:#171817]",
    "dark:[--mq-btn:#26262a] dark:[--mq-icon:#f1efe9]",
    "dark:[--mq-btn-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_6px_rgba(0,0,0,0.55)]",
    "dark:[--mq-scrim:rgba(0,0,0,0.58)]",
    "dark:[--mq-panel:#1b1b1e] dark:[--mq-panel-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-panel-shadow:0_22px_54px_rgba(0,0,0,0.60),0_6px_16px_rgba(0,0,0,0.45)]",
    "dark:[--mq-ink:#f1efe9] dark:[--mq-muted:#b9b7b0] dark:[--mq-accent:#f1efe9]",
    "dark:[--mq-hover-bg:rgba(255,255,255,0.08)] dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type DrawerNavMaterial = keyof typeof MATERIAL_TOKENS;
type DrawerNavVariant = "default";
type DrawerNavSize = "sm" | "md" | "lg";
type DrawerNavSide = "left" | "right";

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so the docs surface can render the focused look
 * without synthesising a keyboard event. The width/offset/colour together fully
 * replace the UA outline, so it is never reset with `outline-none`.
 */
const FOCUS_RING = [
  "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
  "forced-colors:focus-visible:outline-[Highlight] forced-colors:data-[focus=true]:outline-[Highlight]",
].join(" ");

/**
 * Entrance keyframes, shipped with the component rather than a global sheet.
 * React 19 hoists this `<style>` and dedupes it by `href`, so a page with many
 * drawers emits one rule. Each keyframe's resting (end) state is the component's
 * base style and the animation only adds the travel, so with `animation:none`
 * — `motion-reduce` below — the panel still opens fully at its edge and every
 * link is present; only the movement is dropped. The panel slides on the
 * STANDALONE `translate` property (Tailwind v4 writes translate utilities there),
 * so there is no `transition-[transform]` trap: the keyframe animates `translate`
 * directly.
 */
const DRAWER_KEYFRAMES = `
@keyframes mq-dn-fade{from{opacity:0}to{opacity:1}}
@keyframes mq-dn-in-left{from{translate:-100% 0}to{translate:0 0}}
@keyframes mq-dn-in-right{from{translate:100% 0}to{translate:0 0}}
@keyframes mq-dn-item{from{opacity:0;translate:0 8px}to{opacity:1;translate:0 0}}`;

function DrawerKeyframes() {
  return (
    <style href="mq-drawer-nav" precedence="medium">
      {DRAWER_KEYFRAMES}
    </style>
  );
}

const triggerVariants = cva(
  [
    // `z-[70]` keeps the trigger painting above the `z-[60]` overlay it opens and
    // keeps it clickable to close. This assumes the usual top-level placement (a
    // header or nav bar); dropped inside a lower stacking context, host it above
    // the overlay yourself.
    "relative z-[70] inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center",
    "rounded-[var(--mq-btn-radius,12px)] bg-[var(--mq-btn,#efe7db)] text-[color:var(--mq-icon,#4a1d13)]",
    "[background-image:var(--mq-btn-grad,none)]",
    "shadow-[var(--mq-btn-shadow,inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_4px_9px_rgba(75,40,31,0.24))]",
    // A reserved transparent border so forced-colors can outline the control
    // without shifting the glyph by a pixel.
    "border border-transparent",
    // Only the transform moves: a small lift on hover, pressed flat on active.
    // `transition-transform` is expanded by Tailwind v4 to cover the standalone
    // `translate` those utilities write.
    "transition-transform duration-200 ease-out motion-reduce:transition-none",
    "hover:-translate-y-[1px] active:translate-y-0",
    FOCUS_RING,
    // Fills and shadows are discarded in forced colours; the gradient background
    // image is NOT, so it is cleared by hand, and the reserved border is lit.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:shadow-none",
    "disabled:cursor-not-allowed disabled:opacity-55",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-[36px] [--mq-btn-radius:10px]",
        md: "size-[42px] [--mq-btn-radius:12px]",
        lg: "size-[48px] [--mq-btn-radius:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const itemVariants = cva(
  [
    "group/item relative flex items-center gap-[12px] no-underline",
    "rounded-[10px] font-semibold tracking-[-0.01em] text-[color:var(--mq-ink,#33261e)]",
    // A reserved left rule, transparent until active. It marks the current page —
    // kept in the box model so forced-colors can colour it, and never the only
    // signal (weight + aria-current ride alongside).
    "border-l-[3px] border-l-transparent",
    // The wash, the label colour and a small slide are the only things that move
    // across states; the arbitrary transition names the STANDALONE `translate`
    // explicitly, because an arbitrary transition-[transform] would not cover it.
    "transition-[background-color,color,translate] duration-200 ease-out motion-reduce:transition-none",
    "hover:translate-x-[3px] hover:bg-[var(--mq-hover-bg,rgba(201,72,47,0.10))] hover:text-[color:var(--mq-accent,#c9482f)]",
    "focus-visible:text-[color:var(--mq-accent,#c9482f)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    // Active: weight, colour, the reserved rule AND a wash — state is never colour
    // alone.
    "aria-[current=page]:font-extrabold aria-[current=page]:text-[color:var(--mq-accent,#c9482f)]",
    "aria-[current=page]:border-l-[var(--mq-accent,#c9482f)] aria-[current=page]:bg-[var(--mq-hover-bg,rgba(201,72,47,0.10))]",
    "forced-colors:text-[CanvasText] forced-colors:aria-[current=page]:border-l-[CanvasText]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Staggered reveal. The resting styles are the visible end-state and the fill
    // is `backwards`, so with `animation:none` the link is simply present.
    "animate-[mq-dn-item_320ms_cubic-bezier(0.16,1,0.3,1)_backwards] motion-reduce:animate-none",
  ].join(" "),
  {
    variants: {
      size: {
        // Every size clears the 44px touch-target floor for mobile navigation.
        sm: "min-h-[44px] gap-[10px] px-[10px] text-[length:14px]",
        md: "min-h-[46px] gap-[12px] px-[12px] text-[length:15px]",
        lg: "min-h-[50px] gap-[14px] px-[14px] text-[length:16px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** Trigger glyph size per control size. */
const TRIGGER_ICON: Record<DrawerNavSize, string> = {
  sm: "size-[18px]",
  md: "size-[20px]",
  lg: "size-[22px]",
};

/** Panel width per size — capped to the viewport so it never overflows. */
const PANEL_WIDTH: Record<DrawerNavSize, string> = {
  sm: "w-[min(280px,86vw)]",
  md: "w-[min(320px,90vw)]",
  lg: "w-[min(376px,92vw)]",
};

/** Everything the browser lets a keyboard user land on, for the focus trap. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusables(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
}

export type DrawerNavItem = {
  /** Stable key; also the React list key. */
  id: string;
  label: string;
  /** When present the item is a real `<a href>`; otherwise a `<button>`. */
  href?: string;
  /** Optional leading glyph (a lucide icon element). Decorative; sized by CSS. */
  icon?: React.ReactNode;
  /** Marks the current page. Sets `aria-current="page"` and the active look. */
  current?: boolean;
  /** Called when the item is chosen, before the drawer closes. */
  onSelect?: () => void;
};

type DrawerNavOwnProps = {
  items: DrawerNavItem[];
  material?: DrawerNavMaterial;
  size?: DrawerNavSize;
  variant?: DrawerNavVariant;
  /** Edge the panel is pinned to and slides in from. */
  side?: DrawerNavSide;
  /** Accessible name for the trigger button. */
  buttonLabel?: string;
  /** Accessible name for the dialog, and the text of its eyebrow. */
  title?: string;
  /** Accessible name for the close button. */
  closeLabel?: string;
  /** Disables the trigger; the drawer cannot be opened. */
  disabled?: boolean;
};

/**
 * `Omit` the own props off the native button props so the rest — `className`,
 * `data-*`, `aria-*` — spread straight onto the trigger `<button>`. `ref` is
 * dropped (the component owns the trigger ref for focus return) and `type` and
 * `children` are fixed by the component.
 */
export type DrawerNavProps = DrawerNavOwnProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof DrawerNavOwnProps | "type" | "children">;

export function DrawerNav({
  buttonLabel = "Open menu",
  className,
  closeLabel = "Close menu",
  disabled = false,
  items,
  material = "clay",
  side = "left",
  size = "md",
  title = "Menu",
  variant = "default",
  ...triggerProps
}: DrawerNavProps) {
  const [open, setOpen] = React.useState(false);
  const baseId = React.useId();
  const panelId = `${baseId}-panel`;
  const titleId = `${baseId}-title`;
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);

  const close = React.useCallback(() => {
    setOpen(false);
    // Return focus to the trigger, which is always mounted.
    triggerRef.current?.focus();
  }, []);

  const toggle = React.useCallback(() => {
    setOpen((value) => !value);
  }, []);

  // On open: move focus into the dialog and lock body scroll. Both are external
  // systems, so they belong in an effect; both are undone on close/unmount. No
  // setState runs here, so the react-hooks/set-state-in-effect rule is satisfied.
  React.useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const focusables = getFocusables(dialog);
    (focusables[0] ?? dialog)?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /**
   * Escape closes and hands focus back; Tab is trapped so it cycles within the
   * dialog and Shift+Tab wraps the other way. Enter / Space need no handling —
   * the links and buttons are real elements.
   */
  function handleDialogKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      // Absorb the dismiss key so it does not also close an enclosing
      // Escape-closable ancestor.
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = getFocusables(dialogRef.current);
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    const inside = dialogRef.current?.contains(active as Node) ?? false;
    if (event.shiftKey) {
      if (!inside || active === first) {
        event.preventDefault();
        last.focus();
      }
    } else if (!inside || active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const isLeft = side === "left";

  return (
    <>
      <DrawerKeyframes />
      <button
        {...triggerProps}
        // The overlay is only mounted while open, so only reference it then — a
        // permanent aria-controls would point at a non-existent id when closed.
        aria-controls={open ? panelId : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={buttonLabel}
        className={cn(triggerVariants({ size }), MATERIAL_TOKENS[material], className)}
        data-material={material}
        data-open={open ? "true" : "false"}
        data-variant={variant}
        disabled={disabled}
        onClick={toggle}
        ref={triggerRef}
        type="button"
      >
        <Menu
          aria-hidden="true"
          className={cn(TRIGGER_ICON[size], "shrink-0 forced-colors:text-[CanvasText]")}
        />
      </button>

      {open ? (
        <div
          className={cn("fixed inset-0 z-[60]", MATERIAL_TOKENS[material])}
          data-material={material}
          data-side={side}
        >
          {/*
            The dimming backdrop and the click-to-close target in one. It sits
            behind the panel, so a click on the panel never reaches it.
          */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 bg-[var(--mq-scrim,rgba(75,40,31,0.34))]",
              "backdrop-blur-[var(--mq-scrim-blur,0px)]",
              "animate-[mq-dn-fade_240ms_ease-out_backwards] motion-reduce:animate-none",
              // The dim is decoration; forced colours drops it (and the blur) so
              // the panel's own Canvas surface carries the read.
              "forced-colors:bg-transparent forced-colors:backdrop-blur-none",
            )}
            onClick={close}
          />
          <div
            aria-labelledby={titleId}
            aria-modal="true"
            className={cn(
              "absolute top-0 bottom-0 z-[65] flex flex-col",
              PANEL_WIDTH[size],
              "bg-[var(--mq-panel,#f4ece0)] [background-image:var(--mq-panel-grad,none)]",
              "backdrop-blur-[var(--mq-blur,0px)] text-[color:var(--mq-ink,#33261e)]",
              "shadow-[var(--mq-panel-shadow,0_24px_60px_rgba(75,40,31,0.30),0_8px_20px_rgba(75,40,31,0.18))]",
              "motion-reduce:animate-none",
              isLeft
                ? "left-0 rounded-r-[18px] border-r border-[var(--mq-panel-brd,rgba(120,80,55,0.22))] animate-[mq-dn-in-left_320ms_cubic-bezier(0.22,1,0.36,1)_backwards]"
                : "right-0 rounded-l-[18px] border-l border-[var(--mq-panel-brd,rgba(120,80,55,0.22))] animate-[mq-dn-in-right_320ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
              // Fills, washes and shadows are discarded in forced colours; a real
              // border keeps the panel's bounds and a solid Canvas backs the links.
              "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none",
              "forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
            )}
            id={panelId}
            onKeyDown={handleDialogKeyDown}
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
          >
            <div className="flex items-center justify-between gap-[12px] px-[20px] pt-[20px] pb-[12px]">
              {/*
                The dialog's accessible name via aria-labelledby. A paragraph, not
                a heading, so dropping the drawer into any page never disturbs the
                document's heading outline; the eyebrow styling reads as a label.
              */}
              <p
                className={cn(
                  "m-0 text-[length:12px] font-extrabold uppercase tracking-[0.2em]",
                  "text-[color:var(--mq-muted,#6a5346)] forced-colors:text-[CanvasText]",
                )}
                id={titleId}
              >
                {title}
              </p>
              <button
                aria-label={closeLabel}
                className={cn(
                  "inline-flex size-[34px] shrink-0 cursor-pointer appearance-none items-center justify-center",
                  "rounded-[10px] border border-transparent bg-transparent text-[color:var(--mq-icon,#4a1d13)]",
                  "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
                  "hover:bg-[var(--mq-hover-bg,rgba(201,72,47,0.10))]",
                  "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
                  "forced-colors:text-[CanvasText] forced-colors:focus-visible:outline-[Highlight]",
                )}
                onClick={close}
                type="button"
              >
                <X aria-hidden="true" className="size-[18px] shrink-0 forced-colors:text-[CanvasText]" />
              </button>
            </div>

            <nav
              aria-label={title}
              className="min-h-0 flex-1 overflow-y-auto px-[12px] pb-[20px]"
            >
              <ul className="m-0 flex list-none flex-col gap-[4px] p-0">
                {items.map((item, index) => {
                  const ariaCurrent = item.current ? ("page" as const) : undefined;
                  // Per-index delay derives the stagger from position — no random
                  // or time source, so it is identical on server and client.
                  const style: React.CSSProperties = { animationDelay: `${index * 40}ms` };
                  const glyph =
                    item.icon != null ? (
                      <span
                        aria-hidden="true"
                        className="grid shrink-0 place-items-center [&_svg]:size-[1.1em] [&_svg]:shrink-0"
                      >
                        {item.icon}
                      </span>
                    ) : null;
                  const label = <span className="min-w-0 flex-1 truncate">{item.label}</span>;

                  return (
                    <li key={item.id}>
                      {item.href != null ? (
                        <a
                          aria-current={ariaCurrent}
                          className={cn(itemVariants({ size }))}
                          href={item.href}
                          onClick={() => {
                            item.onSelect?.();
                            close();
                          }}
                          style={style}
                        >
                          {glyph}
                          {label}
                        </a>
                      ) : (
                        <button
                          aria-current={ariaCurrent}
                          className={cn(
                            itemVariants({ size }),
                            "w-full cursor-pointer appearance-none bg-transparent text-left",
                          )}
                          onClick={() => {
                            item.onSelect?.();
                            close();
                          }}
                          style={style}
                          type="button"
                        >
                          {glyph}
                          {label}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}

export type DrawerNavVariantProps = VariantProps<typeof triggerVariants>;

export { triggerVariants, itemVariants };
