"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Staggered Menu
 *
 * A trigger button that opens a modal overlay whose items enter in a staggered
 * cascade. Self-contained by design: all four material recipes live in this
 * file, every local custom property carries a literal fallback, and no class
 * comes from the site's global stylesheet. No runtime dependency beyond React
 * and `cn`.
 *
 *   <StaggeredMenu
 *     triggerLabel="Menu"
 *     menuLabel="Main navigation"
 *     material="clay"
 *     size="md"
 *     items={[
 *       { id: "home", label: "Home", href: "/", current: true },
 *       { id: "work", label: "Work", href: "/work" },
 *       { id: "about", label: "About", href: "/about" },
 *     ]}
 *   />
 *
 * The overlay is a real dialog: opening it moves focus inside, Tab and
 * Shift+Tab cycle within the panel, Escape (or a backdrop click) closes it and
 * returns focus to the trigger. The cascade is pure CSS — one hoisted keyframe
 * plus a per-item `animationDelay` — so reduced motion drops the travel while
 * leaving every item at its visible resting state.
 *
 * Local theming knobs:
 *
 *   --mq-trigger-bg / --mq-trigger-text   trigger fill and label
 *   --mq-trigger-grad / --mq-trigger-shadow / --mq-trigger-press
 *   --mq-panel / --mq-panel-brd           overlay surface and border
 *   --mq-panel-grad / --mq-panel-shadow / --mq-panel-blur
 *   --mq-label / --mq-sub                 item label and secondary text
 *   --mq-hover-bg                         item hover wash
 *   --mq-item-active                      active (aria-current) accent
 *   --mq-backdrop                         dim behind the panel
 *   --mq-ring                             focus ring
 */

/** Palette per material. Declared on the root; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-trigger-bg:#ff9077] [--mq-trigger-text:#4a1d13] [--mq-edge:#c9482f]",
    "[--mq-trigger-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    // Inflated chip with the slab's own hard side wall. Warm brown ink
    // throughout — clay never casts black.
    "[--mq-trigger-shadow:inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_4px_9px_rgba(75,40,31,0.24)]",
    "[--mq-trigger-press:inset_0_2px_5px_rgba(120,40,25,0.30),0_1px_0_var(--mq-edge,#c9482f)]",
    "[--mq-panel:#f6e7dd] [--mq-panel-brd:rgba(120,80,55,0.22)] [--mq-panel-edge:#dcc4b2] [--mq-panel-blur:none]",
    "[--mq-panel-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.05))]",
    // A floating slab: bright bloom on top, warm inner shade, its own side wall,
    // and a wide warm cast so it reads lifted off the page.
    "[--mq-panel-shadow:inset_0_3px_4px_rgba(255,255,255,0.60),inset_0_-4px_7px_rgba(140,90,60,0.10),0_2px_0_var(--mq-panel-edge,#dcc4b2),0_28px_60px_rgba(75,40,31,0.30)]",
    "[--mq-label:#33261e] [--mq-sub:#5b4a3c] [--mq-hover-bg:rgba(255,255,255,0.55)]",
    "[--mq-item-active:#c9482f] [--mq-backdrop:rgba(58,26,15,0.42)] [--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-trigger-bg:rgba(23,24,23,0.80)] [--mq-trigger-text:#ffffff]",
    "[--mq-trigger-grad:linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0))]",
    // A 1px specular filo over a cool cast. No side wall: glass has no extrusion.
    "[--mq-trigger-shadow:inset_0_1px_0_rgba(255,255,255,0.50),inset_0_-1px_0_rgba(255,255,255,0.12),0_3px_10px_rgba(24,20,40,0.30)]",
    "[--mq-trigger-press:inset_0_2px_6px_rgba(24,20,40,0.30)]",
    "[--mq-panel:rgba(255,255,255,0.72)] [--mq-panel-brd:rgba(255,255,255,0.78)] [--mq-panel-blur:blur(18px)_saturate(1.4)]",
    "[--mq-panel-grad:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
    "[--mq-panel-shadow:inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(255,255,255,0.28),0_28px_58px_rgba(24,20,40,0.30)]",
    "[--mq-label:#1e1e1b] [--mq-sub:#36362f] [--mq-hover-bg:rgba(255,255,255,0.50)]",
    "[--mq-item-active:#171817] [--mq-backdrop:rgba(24,20,40,0.34)] [--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-trigger-bg:#f6f4ee] [--mq-trigger-text:#23231f] [--mq-edge:#a8a49b]",
    "[--mq-trigger-grad:linear-gradient(180deg,#fbfaf6,#e6e3da)]",
    // Achromatic ink — the cold counterpart to clay's warm brown.
    "[--mq-trigger-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(0,0,0,0.16),0_2px_0_var(--mq-edge,#a8a49b),0_4px_8px_rgba(38,36,31,0.26)]",
    "[--mq-trigger-press:inset_0_2px_5px_rgba(0,0,0,0.24),0_1px_0_var(--mq-edge,#a8a49b)]",
    "[--mq-panel:#ddd9d0] [--mq-panel-brd:rgba(25,25,23,0.30)] [--mq-panel-edge:#a8a49b] [--mq-panel-blur:none]",
    "[--mq-panel-grad:linear-gradient(180deg,#eae7df,#d3cec4)]",
    "[--mq-panel-shadow:inset_0_1px_0_rgba(255,255,255,0.80),inset_0_-3px_5px_rgba(0,0,0,0.10),0_2px_0_var(--mq-panel-edge,#a8a49b),0_26px_52px_rgba(38,36,31,0.34)]",
    "[--mq-label:#23231f] [--mq-sub:#43423c] [--mq-hover-bg:rgba(255,255,255,0.42)]",
    "[--mq-item-active:#3f3e39] [--mq-backdrop:rgba(25,25,23,0.38)] [--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour
  // scheme. Safe here because every surface it names is opaque and flips
  // together with the text that sits on it.
  adaptive: [
    "[--mq-trigger-bg:#ffffff] [--mq-trigger-text:#1c1c19]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-trigger-grad:none] [--mq-panel-grad:none] [--mq-panel-blur:none]",
    "[--mq-trigger-shadow:inset_0_0_0_rgba(20,20,18,0),0_2px_6px_rgba(20,20,18,0.16)]",
    "[--mq-trigger-press:inset_0_2px_5px_rgba(20,20,18,0.18)]",
    "[--mq-panel:#ffffff] [--mq-panel-brd:rgba(23,24,23,0.14)]",
    // Two layers, not four. Adaptive earns its presence from a contact shadow,
    // not from a finish it never had.
    "[--mq-panel-shadow:0_28px_58px_rgba(20,20,18,0.22)]",
    "[--mq-label:#1c1c19] [--mq-sub:#55554e] [--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-item-active:#171817] [--mq-backdrop:rgba(20,20,18,0.36)] [--mq-ring:#171817]",
    "dark:[--mq-trigger-bg:#3a3a40] dark:[--mq-trigger-text:#f1efe9]",
    "dark:[--mq-trigger-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_6px_rgba(0,0,0,0.55)]",
    "dark:[--mq-trigger-press:inset_0_2px_5px_rgba(0,0,0,0.50)]",
    "dark:[--mq-panel:#232327] dark:[--mq-panel-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-panel-shadow:0_28px_58px_rgba(0,0,0,0.60)]",
    "dark:[--mq-label:#f1efe9] dark:[--mq-sub:#b9b7b0] dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-item-active:#f1efe9] dark:[--mq-backdrop:rgba(0,0,0,0.55)] dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type StaggeredMenuMaterial = keyof typeof MATERIAL_TOKENS;
type StaggeredMenuSize = "sm" | "md" | "lg";

/**
 * Keyframes travel with the component rather than living in a global stylesheet
 * a copier would have to find. React 19 hoists this and deduplicates it by
 * `href`, so a page of menus emits one rule set rather than one per instance.
 *
 * Each item's base (resting) styles are already the visible end state; the
 * cascade keyframe runs hidden -> visible with `animation-fill-mode: backwards`
 * so it is held hidden during its delay but, under `animation: none` (reduced
 * motion), simply sits visible. The final state is never lost.
 */
const KEYFRAMES = `
@keyframes mq-stagger-in{from{opacity:0;translate:0 10px}to{opacity:1;translate:0 0}}
@keyframes mq-panel-in{from{opacity:0;translate:0 14px;scale:0.97}to{opacity:1;translate:0 0;scale:1}}
@keyframes mq-overlay-in{from{opacity:0}to{opacity:1}}
`;

function StaggeredMenuKeyframes() {
  return (
    <style href="mq-staggered-menu" precedence="medium">
      {KEYFRAMES}
    </style>
  );
}

/** Per-item cascade step, in milliseconds. */
const STAGGER_STEP_MS = 45;

/** Elements the focus trap treats as tabbable inside the panel. */
const FOCUSABLE_SELECTOR = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

const triggerVariants = cva(
  [
    "group/trigger relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center",
    "appearance-none whitespace-nowrap font-extrabold tracking-[-0.01em]",
    "rounded-[var(--mq-trigger-radius,13px)]",
    "border border-transparent",
    "bg-[var(--mq-trigger-bg,#ff9077)] text-[color:var(--mq-trigger-text,#4a1d13)]",
    "[background-image:var(--mq-trigger-grad,none)]",
    "shadow-[var(--mq-trigger-shadow,0_4px_9px_rgba(75,40,31,0.24))]",
    // Exactly the properties that move: the hover lift and press settle
    // (translate) and the press shadow. `translate` is named explicitly because
    // Tailwind v4 writes translate utilities to the standalone property, not to
    // `transform`. No state changes the trigger's fill, so background-color is
    // deliberately absent — listing it would be a transition over a dead prop.
    "transition-[translate,box-shadow] duration-200 ease-out motion-reduce:transition-none",
    "hover:-translate-y-[1px]",
    "active:translate-y-[1px] active:shadow-[var(--mq-trigger-press,inset_0_2px_5px_rgba(120,40,25,0.30))]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Fills, gradients and shadows are discarded in forced colours, so the
    // trigger falls back to a plain system-coloured button.
    "forced-colors:[background-image:none] forced-colors:shadow-none forced-colors:border-[ButtonText] forced-colors:text-[ButtonText]",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "[--mq-trigger-radius:11px] h-[34px] gap-[7px] px-[13px] text-[length:12px]",
        md: "[--mq-trigger-radius:13px] h-[40px] gap-[8px] px-[16px] text-[length:13px]",
        lg: "[--mq-trigger-radius:15px] h-[48px] gap-[9px] px-[20px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const panelVariants = cva(
  [
    "relative z-[1] m-0 flex max-h-[80vh] flex-col overflow-y-auto overscroll-contain",
    "w-[min(var(--mq-panel-w,344px),calc(100vw-32px))]",
    "rounded-[var(--mq-panel-radius,20px)] border border-[var(--mq-panel-brd,rgba(120,80,55,0.22))]",
    "bg-[var(--mq-panel,#f6e7dd)] text-[color:var(--mq-label,#33261e)]",
    "[background-image:var(--mq-panel-grad,none)]",
    "[backdrop-filter:var(--mq-panel-blur,none)] [-webkit-backdrop-filter:var(--mq-panel-blur,none)]",
    "shadow-[var(--mq-panel-shadow,0_28px_60px_rgba(75,40,31,0.30))]",
    // The panel rises and fades in. Its base is the visible resting state and
    // the keyframe carries `backwards` fill, so reduced motion drops the rise
    // and the panel is simply present.
    "animate-[mq-panel-in_360ms_cubic-bezier(0.22,1,0.36,1)_backwards] motion-reduce:animate-none",
    "forced-colors:[background-image:none] forced-colors:shadow-none forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "[--mq-panel-w:300px] [--mq-panel-radius:16px] [--mq-item-radius:9px] [--mq-item-gap:3px] p-[10px]",
        md: "[--mq-panel-w:344px] [--mq-panel-radius:20px] [--mq-item-radius:11px] [--mq-item-gap:4px] p-[12px]",
        lg: "[--mq-panel-w:384px] [--mq-panel-radius:24px] [--mq-item-radius:13px] [--mq-item-gap:5px] p-[14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const itemVariants = cva(
  [
    "group/item relative flex w-full min-w-0 cursor-pointer appearance-none items-center no-underline text-left",
    "border-0 border-l-2 border-l-transparent bg-transparent",
    "rounded-[var(--mq-item-radius,11px)] font-bold text-[color:var(--mq-label,#33261e)]",
    // The wash and the nudge on hover; `translate` is named so the utility
    // actually animates.
    "transition-[background-color,translate] duration-150 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.55))] hover:translate-x-[2px]",
    // The cascade. Delay is applied per-item inline; the keyframe's `backwards`
    // fill holds each item hidden until its turn, and reduced motion cancels the
    // whole thing so the items are visible at once.
    "animate-[mq-stagger-in_340ms_cubic-bezier(0.22,1,0.36,1)_backwards] motion-reduce:animate-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight] forced-colors:text-[CanvasText]",
    // Active is never colour alone: it pairs a heavier weight and aria-current
    // with a reserved left rule that takes a system colour where fills are
    // discarded.
    "aria-[current=page]:font-black aria-[current=page]:border-l-[var(--mq-item-active,#c9482f)]",
    "forced-colors:aria-[current=page]:border-l-[CanvasText]",
    "aria-disabled:pointer-events-none aria-disabled:opacity-45",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-[38px] gap-[8px] px-[10px] text-[length:13px]",
        md: "min-h-[44px] gap-[10px] px-[12px] text-[length:14px]",
        lg: "min-h-[52px] gap-[12px] px-[14px] text-[length:15px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

function MenuGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="size-[1.15em] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2.2"
      viewBox="0 0 20 20"
    >
      <path d="M3 6h14" />
      <path d="M3 10h14" />
      <path d="M3 14h14" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="size-[1.1em] shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none group-hover/close:rotate-90"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2.2"
      viewBox="0 0 20 20"
    >
      <path d="m5 5 10 10M15 5 5 15" />
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="ml-auto size-[1em] shrink-0 text-[color:var(--mq-sub,#5b4a3c)] transition-transform duration-150 ease-out motion-reduce:transition-none group-hover/item:translate-x-[3px] forced-colors:text-[CanvasText]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 20 20"
    >
      <path d="M7 4l6 6-6 6" />
    </svg>
  );
}

export type StaggeredMenuItem = {
  /** Stable identity used as the React key. */
  id: string;
  label: React.ReactNode;
  /** When present the row is a real link; otherwise it is a `<button>`. */
  href?: string;
  /** Marks the row for the current page (adds `aria-current="page"`). */
  current?: boolean;
  disabled?: boolean;
  /** Fired when a non-link row is activated. */
  onSelect?: () => void;
};

export type StaggeredMenuProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "children"
> & {
  items: readonly StaggeredMenuItem[];
  /** Content of the trigger button. */
  triggerLabel?: React.ReactNode;
  /** Accessible name for the overlay and its title. */
  menuLabel?: string;
  material?: StaggeredMenuMaterial;
  size?: StaggeredMenuSize;
};

export function StaggeredMenu({
  className,
  disabled,
  items,
  material = "clay",
  menuLabel = "Menu",
  onClick,
  size = "md",
  triggerLabel = "Menu",
  ...rest
}: StaggeredMenuProps) {
  const [open, setOpen] = React.useState(false);
  const reactId = React.useId();
  const panelId = `${reactId}-panel`;
  const titleId = `${reactId}-title`;
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  const close = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // On open, move focus into the panel and lock body scroll behind the modal.
  // Both are client-only effects, so nothing here runs during SSR.
  React.useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const firstItem = panel.querySelector<HTMLElement>("[data-menu-item]:is(a,button)");
    (firstItem ?? panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR))?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function getFocusable(): HTMLElement[] {
    const panel = panelRef.current;
    if (!panel) return [];
    return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  }

  function handleDialogKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = getFocusable();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    const panel = panelRef.current;
    const outside = !panel || !panel.contains(active);

    if (event.shiftKey) {
      if (active === first || outside) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last || outside) {
      event.preventDefault();
      first.focus();
    }
  }

  const itemClassName = itemVariants({ size });

  return (
    <div
      className={cn("relative inline-block", MATERIAL_TOKENS[material], className)}
      data-material={material}
    >
      <StaggeredMenuKeyframes />

      <button
        {...rest}
        // The overlay is only in the DOM while open, so only point at it then —
        // a permanent aria-controls would dangle at a non-existent id when closed.
        aria-controls={open ? panelId : undefined}
        aria-expanded={open}
        // The popup is a role="dialog" (aria-modal), not a role="menu" of
        // menuitems, so announce it as a dialog rather than promising arrow-key
        // menu semantics the overlay does not implement.
        aria-haspopup="dialog"
        className={triggerVariants({ size })}
        disabled={disabled}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setOpen((value) => !value);
        }}
        ref={triggerRef}
        type="button"
      >
        <MenuGlyph />
        <span className="whitespace-nowrap">{triggerLabel}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-[16px] pt-[12vh]">
          {/* Backdrop: click to dismiss. It fades in but its resting state is
              opaque-enough dim, so reduced motion just shows it. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[var(--mq-backdrop,rgba(58,26,15,0.42))] animate-[mq-overlay-in_240ms_ease-out_backwards] motion-reduce:animate-none forced-colors:bg-[Canvas]"
            onClick={close}
          />

          <div
            aria-labelledby={titleId}
            aria-modal="true"
            className={panelVariants({ size })}
            id={panelId}
            onKeyDown={handleDialogKeyDown}
            ref={panelRef}
            role="dialog"
          >
            <div className="mb-[10px] flex items-center justify-between gap-[12px] px-[6px] pt-[2px]">
              <span
                className="text-[length:11px] font-black uppercase tracking-[0.14em] text-[color:var(--mq-sub,#5b4a3c)] forced-colors:text-[CanvasText]"
                id={titleId}
              >
                {menuLabel}
              </span>
              <button
                aria-label="Close menu"
                className="group/close inline-flex size-[30px] shrink-0 cursor-pointer appearance-none items-center justify-center rounded-full border border-transparent bg-transparent text-[color:var(--mq-sub,#5b4a3c)] transition-[background-color] duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.55))] focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)] forced-colors:border-[CanvasText] forced-colors:text-[CanvasText] forced-colors:focus-visible:outline-[Highlight]"
                onClick={close}
                type="button"
              >
                <CloseGlyph />
              </button>
            </div>

            <nav aria-label={menuLabel}>
              <ul className="m-0 flex list-none flex-col gap-[var(--mq-item-gap,4px)] p-0">
                {items.map((item, index) => {
                  const delayStyle: React.CSSProperties = {
                    animationDelay: `${index * STAGGER_STEP_MS}ms`,
                  };

                  if (item.disabled) {
                    return (
                      <li className="min-w-0" key={item.id}>
                        <span
                          aria-disabled="true"
                          className={itemClassName}
                          data-menu-item=""
                          style={delayStyle}
                        >
                          <span className="min-w-0 truncate">{item.label}</span>
                        </span>
                      </li>
                    );
                  }

                  const body = (
                    <>
                      <span className="min-w-0 truncate">{item.label}</span>
                      <ArrowGlyph />
                    </>
                  );

                  return (
                    <li className="min-w-0" key={item.id}>
                      {item.href ? (
                        <a
                          aria-current={item.current ? "page" : undefined}
                          className={itemClassName}
                          data-menu-item=""
                          href={item.href}
                          onClick={() => {
                            item.onSelect?.();
                            close();
                          }}
                          style={delayStyle}
                        >
                          {body}
                        </a>
                      ) : (
                        <button
                          aria-current={item.current ? "page" : undefined}
                          className={itemClassName}
                          data-menu-item=""
                          onClick={() => {
                            item.onSelect?.();
                            close();
                          }}
                          style={delayStyle}
                          type="button"
                        >
                          {body}
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
    </div>
  );
}

export { triggerVariants };
