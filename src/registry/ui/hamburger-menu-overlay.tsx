"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Hamburger Menu Overlay
 *
 * A hamburger button whose three lines fold into an X and open a full-screen
 * overlay of navigation links. Self-contained by design: all four material
 * recipes live in this file, every local custom property carries a literal
 * fallback, and no class comes from the site's global stylesheet. No runtime
 * dependency beyond React and `cn`.
 *
 *   <HamburgerMenuOverlay
 *     items={[
 *       { id: "home", label: "Home", href: "/" },
 *       { id: "work", label: "Work", href: "/work", current: true },
 *     ]}
 *     material="clay"
 *     size="md"
 *   />
 *
 * The button is a real `<button aria-expanded aria-controls>`. The overlay is a
 * `role="dialog" aria-modal="true"` surface that traps focus, closes on Escape
 * (returning focus to the button), closes when the backdrop or a link is
 * clicked, and locks body scroll while open. Every link is a real `<a href>` (or
 * a `<button>` when no `href` is given), so the browser's own navigation and
 * keyboard handling do the work.
 *
 * Local theming knobs:
 *
 *   --mq-btn         trigger surface
 *   --mq-btn-grad    trigger surface wash (`none` if flat)
 *   --mq-btn-shadow  trigger depth stack
 *   --mq-edge        the trigger slab's side wall (clay / skeuo only)
 *   --mq-bars        the three hamburger lines
 *   --mq-scrim       full-screen overlay surface
 *   --mq-scrim-grad  overlay surface wash (`none` if flat)
 *   --mq-blur        overlay backdrop blur radius (glass only)
 *   --mq-ink         overlay link label
 *   --mq-muted       overlay index numbers / eyebrow
 *   --mq-accent      hover + active link colour and the active marker rule
 *   --mq-ring        focus ring
 */

/** Palette per material. Declared on the button and on the overlay. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-btn:#efe7db] [--mq-edge:#c9482f] [--mq-bars:#4a1d13]",
    "[--mq-btn-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    // The trigger is a chip that rides proud of the page: a bright bloom on top,
    // a warm inner shade below, the slab's own hard side wall, then a tight cast
    // shadow. Warm brown ink throughout — clay never casts black.
    "[--mq-btn-shadow:inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_4px_9px_rgba(75,40,31,0.24)]",
    "[--mq-scrim:#f4e8dd] [--mq-blur:0px]",
    "[--mq-scrim-grad:linear-gradient(180deg,rgba(255,255,255,0.50),rgba(151,92,58,0.05))]",
    "[--mq-ink:#33261e] [--mq-muted:#6a5346] [--mq-accent:#c9482f] [--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-btn:rgba(255,255,255,0.62)] [--mq-bars:#1e1e1b]",
    "[--mq-btn-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo whose geometry never changes, only its intensity, over
    // a wide cool cast shadow. No side wall: glass has no extrusion.
    "[--mq-btn-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_6px_18px_rgba(24,20,40,0.14)]",
    // The overlay is a frosted sheet — translucent, but opaque enough that link
    // text stays legible over whatever page sits behind it.
    "[--mq-scrim:rgba(244,247,248,0.82)] [--mq-blur:18px]",
    "[--mq-scrim-grad:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
    "[--mq-ink:#1e1e1b] [--mq-muted:#36362f] [--mq-accent:#171817] [--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-btn:#cfcbc2] [--mq-edge:#a8a49b] [--mq-bars:#23231f]",
    // The surface IS the gradient: lit over body, the moulded-plastic read.
    "[--mq-btn-grad:linear-gradient(180deg,#fbfaf6,#e6e3da)]",
    // A hard 1px bevel of light on top, an achromatic machined shade below, a
    // shallower wall than clay's, and a tight cast shadow. The cold counterpart
    // to clay's warm brown ink.
    "[--mq-btn-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(0,0,0,0.16),0_2px_0_var(--mq-edge,#a8a49b),0_4px_8px_rgba(38,36,31,0.26)]",
    "[--mq-scrim:#d7d3ca] [--mq-blur:0px]",
    "[--mq-scrim-grad:linear-gradient(180deg,#e2ded4,#cfcabf)]",
    "[--mq-ink:#23231f] [--mq-muted:#4a4943] [--mq-accent:#3f3e39] [--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  // Safe here because every surface it names is opaque and flips together with
  // the text that sits on it.
  adaptive: [
    "[--mq-btn:#ffffff] [--mq-bars:#1c1c19]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-btn-grad:none] [--mq-scrim-grad:none]",
    // Two layers, not four: adaptive earns its presence from a contact shadow,
    // not from a finish it never had.
    "[--mq-btn-shadow:inset_0_0_0_rgba(20,20,18,0),0_2px_6px_rgba(20,20,18,0.16)]",
    "[--mq-scrim:#ffffff] [--mq-blur:0px]",
    "[--mq-ink:#1c1c19] [--mq-muted:#55554e] [--mq-accent:#171817] [--mq-ring:#171817]",
    "dark:[--mq-btn:#26262a] dark:[--mq-bars:#f1efe9]",
    "dark:[--mq-btn-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_6px_rgba(0,0,0,0.55)]",
    "dark:[--mq-scrim:#1b1b1e]",
    "dark:[--mq-ink:#f1efe9] dark:[--mq-muted:#b9b7b0] dark:[--mq-accent:#f1efe9] dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type HamburgerMaterial = keyof typeof MATERIAL_TOKENS;
type HamburgerSize = "sm" | "md" | "lg";

/**
 * Entrance keyframes, shipped with the component rather than a global sheet.
 * React 19 hoists this and deduplicates it by `href`, so a page with several
 * of these menus emits one rule, not one per instance. Every keyframe's resting
 * (visible) state is the component's base style and the animations only add the
 * travel, so with `animation:none` — `motion-reduce` below — the overlay still
 * opens and every link is still there; only the movement is dropped.
 */
const HAMBURGER_KEYFRAMES = `
@keyframes mq-hmo-fade{from{opacity:0}to{opacity:1}}
@keyframes mq-hmo-rise{from{opacity:0;translate:0 10px}to{opacity:1;translate:0 0}}
@keyframes mq-hmo-item{from{opacity:0;translate:0 12px}to{opacity:1;translate:0 0}}`;

function HamburgerKeyframes() {
  return (
    <style href="mq-hamburger-menu-overlay" precedence="medium">
      {HAMBURGER_KEYFRAMES}
    </style>
  );
}

/**
 * Line geometry per size, written out as literal class strings.
 *
 * Tailwind finds classes by scanning source text — it never runs this module —
 * so a class name assembled by string interpolation is one Tailwind never emits.
 * Each size therefore spells out its own top / centre / bottom offsets and the
 * exact `translate`/`rotate` that folds the outer two lines onto the centre.
 * The state utilities write the STANDALONE `translate` and `rotate` properties,
 * which the line's `transition-transform` (expanded by Tailwind v4 to
 * `transform, translate, scale, rotate`) covers — an arbitrary transition that
 * named only `transform` would animate nothing here and the X would snap.
 */
const BARS = {
  sm: {
    box: "h-[10px] w-[16px]",
    top: "top-0 group-data-[open=true]/hb:translate-y-[4px] group-data-[open=true]/hb:rotate-45",
    mid: "top-[4px]",
    bot: "top-[8px] group-data-[open=true]/hb:-translate-y-[4px] group-data-[open=true]/hb:-rotate-45",
  },
  md: {
    box: "h-[12px] w-[18px]",
    top: "top-0 group-data-[open=true]/hb:translate-y-[5px] group-data-[open=true]/hb:rotate-45",
    mid: "top-[5px]",
    bot: "top-[10px] group-data-[open=true]/hb:-translate-y-[5px] group-data-[open=true]/hb:-rotate-45",
  },
  lg: {
    box: "h-[14px] w-[22px]",
    top: "top-0 group-data-[open=true]/hb:translate-y-[6px] group-data-[open=true]/hb:rotate-45",
    mid: "top-[6px]",
    bot: "top-[12px] group-data-[open=true]/hb:-translate-y-[6px] group-data-[open=true]/hb:-rotate-45",
  },
} as const;

/** Shared line paint. Each line adds its own transition + offset on top. */
const LINE_BASE =
  "absolute left-0 right-0 h-[2px] rounded-full bg-[var(--mq-bars,#4a1d13)] [transform-origin:center] " +
  "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none " +
  // The lines are drawn with a background colour, which forced-colors discards;
  // pinning a system colour keeps the glyph on screen.
  "forced-colors:bg-[CanvasText]";

const triggerVariants = cva(
  [
    // `group/hb` so the three lines can react to the button's own `data-open`.
    // `z-[70]` keeps the trigger — and so the visible fold into an X — painting
    // above the `z-[60]` overlay it opens, and keeps it clickable to close. This
    // assumes the usual top-level placement (a header or nav bar); dropped inside
    // a lower stacking context, host it above the overlay yourself.
    "group/hb relative z-[70] inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center",
    "rounded-[var(--mq-btn-radius,12px)] bg-[var(--mq-btn,#efe7db)]",
    "[background-image:var(--mq-btn-grad,none)]",
    "shadow-[var(--mq-btn-shadow,inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_4px_9px_rgba(75,40,31,0.24))]",
    // A reserved transparent border so forced-colors can outline the control
    // without shifting the lines by a pixel.
    "border border-transparent",
    // Only the transform moves: a small lift on hover, pressed flat on active.
    // `transition-transform` covers the `translate` those utilities write.
    "transition-transform duration-200 ease-out motion-reduce:transition-none",
    "hover:-translate-y-[1px] active:translate-y-0",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    // Fills and shadows are discarded in forced colours; the gradient background
    // image is NOT, so it is cleared by hand, and the reserved border is lit.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:shadow-none",
    "forced-colors:focus-visible:outline-[Highlight]",
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
    "group/item relative flex items-baseline no-underline",
    // A reserved left rule, transparent until active. It is what marks the
    // current page — kept in the box model so forced-colors can colour it, and
    // never the only signal (weight + aria-current ride alongside).
    "border-l-[3px] border-l-transparent",
    "font-bold tracking-[-0.01em] text-[color:var(--mq-ink,#33261e)]",
    // The label slides on hover; the colour shift rides along instantly. Only a
    // `translate` moves, so `transition-transform` is the honest property to name.
    "transition-transform duration-200 ease-out motion-reduce:transition-none",
    "hover:translate-x-[6px] hover:text-[color:var(--mq-accent,#c9482f)]",
    "focus-visible:text-[color:var(--mq-accent,#c9482f)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--mq-ring,#171817)]",
    // Active: weight, colour AND the reserved rule — state is never colour alone.
    "aria-[current=page]:font-extrabold aria-[current=page]:text-[color:var(--mq-accent,#c9482f)]",
    "aria-[current=page]:border-l-[var(--mq-accent,#c9482f)]",
    "forced-colors:text-[CanvasText] forced-colors:aria-[current=page]:border-l-[CanvasText]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Staggered reveal. The resting styles are the visible end-state and the
    // fill is `backwards`, so with `animation:none` the link is simply present.
    "animate-[mq-hmo-item_360ms_cubic-bezier(0.16,1,0.3,1)_backwards]",
    "motion-reduce:animate-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "gap-[10px] pl-[16px] text-[length:20px]",
        md: "gap-[14px] pl-[20px] text-[length:24px]",
        lg: "gap-[16px] pl-[24px] text-[length:30px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

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

export type HamburgerMenuItem = {
  /** Stable key; also the React list key. */
  id: string;
  label: string;
  /** When present the item is a real `<a href>`; otherwise a `<button>`. */
  href?: string;
  /** Marks the current page. Sets `aria-current="page"` and the active look. */
  current?: boolean;
  /** Called when a link-less item is chosen, before the overlay closes. */
  onSelect?: () => void;
};

export type HamburgerMenuOverlayProps = {
  items: HamburgerMenuItem[];
  material?: HamburgerMaterial;
  size?: HamburgerSize;
  /** Accessible name for the trigger button. */
  buttonLabel?: string;
  /** Accessible name for the dialog, and the text of its eyebrow. */
  menuLabel?: string;
  /** Disables the trigger; the menu cannot be opened. */
  disabled?: boolean;
  /** Class for the trigger button. */
  className?: string;
};

export function HamburgerMenuOverlay({
  buttonLabel = "Menu",
  className,
  disabled = false,
  items,
  material = "clay",
  menuLabel = "Main menu",
  size = "md",
}: HamburgerMenuOverlayProps) {
  const [open, setOpen] = React.useState(false);
  const overlayId = React.useId();
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
  // systems, so they belong in an effect; both are undone on close/unmount.
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

  const geometry = BARS[size];

  return (
    <>
      <HamburgerKeyframes />
      <button
        // The overlay is only mounted while open, so only reference it then — a
        // permanent aria-controls would point at a non-existent id when closed.
        aria-controls={open ? overlayId : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={buttonLabel}
        className={cn(triggerVariants({ size }), MATERIAL_TOKENS[material], className)}
        data-material={material}
        data-open={open ? "true" : "false"}
        disabled={disabled}
        onClick={toggle}
        ref={triggerRef}
        type="button"
      >
        <span aria-hidden="true" className={cn("relative block", geometry.box)}>
          <span className={cn(LINE_BASE, "transition-transform", geometry.top)} />
          <span
            className={cn(
              LINE_BASE,
              "transition-opacity group-data-[open=true]/hb:opacity-0",
              geometry.mid,
            )}
          />
          <span className={cn(LINE_BASE, "transition-transform", geometry.bot)} />
        </span>
      </button>

      {open ? (
        <div
          aria-label={menuLabel}
          aria-modal="true"
          className={cn("fixed inset-0 z-[60] flex flex-col", MATERIAL_TOKENS[material])}
          data-material={material}
          id={overlayId}
          onKeyDown={handleDialogKeyDown}
          ref={dialogRef}
          role="dialog"
          tabIndex={-1}
        >
          {/*
            The full-screen surface and the click-to-close target in one. The
            content layer above is pointer-transparent except on the nav, so a
            click on empty space falls through here and closes.
          */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 bg-[var(--mq-scrim,#f4e8dd)] [background-image:var(--mq-scrim-grad,none)]",
              "backdrop-blur-[var(--mq-blur,0px)]",
              "animate-[mq-hmo-fade_260ms_ease-out_backwards] motion-reduce:animate-none",
              // background-image survives forced colours; clear it and paint a
              // solid Canvas so the links have a known surface.
              "forced-colors:bg-[Canvas] forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
            )}
            onClick={close}
          />
          <div
            className={cn(
              "pointer-events-none relative flex min-h-0 flex-1 flex-col justify-center",
              "overflow-y-auto px-[clamp(24px,8vw,120px)] py-[80px]",
              "animate-[mq-hmo-rise_320ms_cubic-bezier(0.16,1,0.3,1)_backwards]",
              "motion-reduce:animate-none",
            )}
          >
            <p
              aria-hidden="true"
              className={cn(
                "m-0 mb-[24px] text-[length:12px] font-extrabold uppercase tracking-[0.22em]",
                "text-[color:var(--mq-muted,#6a5346)] forced-colors:text-[CanvasText]",
              )}
            >
              {menuLabel}
            </p>
            <nav aria-label={menuLabel} className="pointer-events-auto">
              <ul className="m-0 flex list-none flex-col gap-[clamp(8px,2vh,18px)] p-0">
                {items.map((item, index) => {
                  const number = (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "shrink-0 font-semibold tabular-nums text-[0.55em]",
                        "text-[color:var(--mq-muted,#6a5346)] forced-colors:text-[CanvasText]",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  );
                  const label = <span className="min-w-0">{item.label}</span>;
                  // Per-index delay derives the stagger from position — no random
                  // or time source, so it is identical on server and client.
                  const style: React.CSSProperties = { animationDelay: `${index * 45}ms` };
                  const ariaCurrent = item.current ? ("page" as const) : undefined;

                  return (
                    <li key={item.id}>
                      {item.href != null ? (
                        <a
                          aria-current={ariaCurrent}
                          className={cn(itemVariants({ size }))}
                          href={item.href}
                          onClick={close}
                          style={style}
                        >
                          {number}
                          {label}
                        </a>
                      ) : (
                        <button
                          aria-current={ariaCurrent}
                          className={cn(itemVariants({ size }), "cursor-pointer appearance-none bg-transparent text-left")}
                          onClick={() => {
                            item.onSelect?.();
                            close();
                          }}
                          style={style}
                          type="button"
                        >
                          {number}
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

export { triggerVariants, itemVariants };
