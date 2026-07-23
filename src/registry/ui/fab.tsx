"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq FAB (Floating Action Button)
 *
 * A circular, prominently elevated action control with an optional speed-dial.
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The material recipes are the button's — its
 * per-material PRESS PHYSICS (resting shadow, a hover lift with a grown shadow,
 * an active SINK into a pressed inset well) — inlined here with the button's
 * primary-intent token VALUES, only deepened so the FAB reads as more elevated.
 *
 *   // plain, icon-only action
 *   <Fab aria-label="Compose" material="clay" onClick={compose} />
 *
 *   // speed-dial: a stacked column of smaller labelled actions above the FAB
 *   <Fab
 *     aria-label="Compose"
 *     material="clay"
 *     actions={[
 *       { id: "edit",  label: "Edit",   icon: <Pencil aria-hidden="true" />, onSelect: edit },
 *       { id: "photo", label: "Photo",  icon: <Camera aria-hidden="true" />, onSelect: photo },
 *     ]}
 *   />
 *
 * The trigger is a real `<button>`, so focus, keyboard activation and the
 * `:disabled` look come for free. Because it is icon-only, an accessible name is
 * REQUIRED: `aria-label` is a required prop. With `actions`, the button becomes a
 * menu button (`aria-haspopup="menu"` + `aria-expanded` + `aria-controls`) that
 * opens a `role="menu"` of `role="menuitem"` buttons — arrow / Home / End move
 * the roving focus, Escape closes and returns focus to the FAB, an outside click
 * or a selection closes it too. The reveal is a staggered, self-hosted keyframe.
 *
 * Positioning is the caller's job: pass `className` (e.g. `fixed bottom-6 right-6`)
 * and the speed-dial anchors to it. The class lands on the wrapper so the menu can
 * be absolutely positioned above the button.
 *
 * Local theming knobs, each used with a literal fallback:
 *
 *   --mq-body  surface colour
 *   --mq-lit   top of the skeuo gradient
 *   --mq-edge  extruded bottom edge / pressed depth colour (clay + skeuo)
 *   --mq-text  foreground colour
 *   --mq-brd   border colour
 *   --mq-ring  focus ring colour
 */

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so documentation surfaces and visual-regression
 * tests can render the focused look without synthesising a keyboard event. The
 * UA outline is not reset with `outline-none`: these declarations set width,
 * offset and colour together, which fully replaces it on focus.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Palette + press physics per material, the button's primary-intent recipe
 * inlined and deepened for the FAB's extra elevation. Declared as a standalone
 * object so the material type can be `keyof typeof MATERIAL_TOKENS` and so the
 * circular FAB and the pill speed-dial actions share one source of truth.
 *
 * Each recipe names only the properties some state actually changes — a resting
 * shadow, a `hover` lift with a grown shadow, an `active` SINK into a pressed
 * inset well. Clay sinks ~3px into a warm inset, skeuo ~4px, glass/adaptive ~1px.
 * Skeuo greige stays warm (dark primary, edge #131311). Every `var()` carries a
 * literal fallback so the recipe survives being copied out on its own.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817]",
    "bg-[var(--mq-body,#ff9077)] text-[var(--mq-text,#4a1d13)] border-[var(--mq-brd,rgba(120,40,25,0.16))]",
    "shadow-[inset_0_3px_3px_rgba(255,255,255,0.55),inset_0_-4px_6px_rgba(120,40,25,0.18),0_7px_0_var(--mq-edge,#c9482f),0_16px_28px_rgba(75,40,31,0.22)]",
    "hover:-translate-y-[2px]",
    "hover:shadow-[inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(120,40,25,0.18),0_9px_0_var(--mq-edge,#c9482f),0_22px_36px_rgba(75,40,31,0.26)]",
    "active:translate-y-[3px]",
    "active:shadow-[inset_0_3px_7px_rgba(120,40,25,0.32),0_2px_0_var(--mq-edge,#c9482f)]",
  ].join(" "),
  glass: [
    "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817]",
    "bg-[var(--mq-body,rgba(23,24,23,0.74))] text-[var(--mq-text,#ffffff)] border-[var(--mq-brd,rgba(255,255,255,0.28))]",
    "backdrop-blur-[14px] backdrop-saturate-[160%]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_14px_34px_rgba(24,20,40,0.28)]",
    "hover:-translate-y-[1px] hover:backdrop-blur-[18px]",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_20px_44px_rgba(24,20,40,0.34)]",
    "active:translate-y-[1px]",
    "active:shadow-[inset_0_2px_7px_rgba(24,20,40,0.3)]",
  ].join(" "),
  skeuo: [
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
    "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] text-[var(--mq-text,#f6f4ee)] border-[var(--mq-brd,rgba(0,0,0,0.5))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_6px_0_var(--mq-edge,#131311),0_14px_24px_rgba(38,36,31,0.34)]",
    "hover:-translate-y-[1px] hover:brightness-[1.08]",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_8px_0_var(--mq-edge,#131311),0_20px_32px_rgba(38,36,31,0.4)]",
    "active:translate-y-[4px]",
    "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  // Safe here because every surface it names is opaque and flips together with
  // the glyph that sits on it.
  adaptive: [
    "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
    "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
    "bg-[var(--mq-body,#171817)] text-[var(--mq-text,#f6f5f1)] border-[var(--mq-brd,rgba(0,0,0,0.4))]",
    "shadow-[0_6px_16px_rgba(20,20,18,0.22)]",
    "hover:-translate-y-[1px] hover:shadow-[0_12px_26px_rgba(20,20,18,0.28)]",
    "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
  ].join(" "),
};

export type FabMaterial = keyof typeof MATERIAL_TOKENS;
type FabSize = "sm" | "md" | "lg";

/**
 * Shared paint for the circular trigger and the pill actions. `translate`, not
 * `transform`: Tailwind v4's `translate-*`/`rotate-*` utilities write the
 * standalone properties, so the transition names them exactly. The list carries
 * only properties some material/state changes — `translate` (every lift/sink),
 * `box-shadow` (every material), `backdrop-filter` (glass hover blur), `filter`
 * (skeuo hover brightness) and `opacity` (the disabled fade). No `transform`,
 * no phantom `background-color`.
 */
const TACTILE_BASE =
  "border font-extrabold cursor-pointer appearance-none select-none " +
  "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out " +
  "motion-reduce:transition-none " +
  FOCUS_RING +
  " forced-colors:border-[CanvasText]";

const fabVariants = cva(
  [
    "relative isolate inline-flex shrink-0 items-center justify-center aspect-square rounded-full",
    TACTILE_BASE,
    // The disabled look is native (`:disabled`): the FAB has no busy state, so
    // there is no reason to keep it focusable the way the loading button must.
    "disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0 disabled:shadow-none",
  ].join(" "),
  {
    variants: {
      material: MATERIAL_TOKENS,
      size: {
        sm: "size-[44px]",
        md: "size-[56px]",
        lg: "size-[68px]",
      },
    },
    defaultVariants: { material: "clay", size: "md" },
  },
);

/** The pill speed-dial actions share the material recipe, at a smaller shape. */
const actionVariants = cva(
  [
    "relative inline-flex shrink-0 items-center gap-[8px] rounded-full whitespace-nowrap",
    TACTILE_BASE,
    "disabled:cursor-not-allowed disabled:opacity-55",
  ].join(" "),
  {
    variants: {
      material: MATERIAL_TOKENS,
      size: {
        sm: "h-[36px] px-[12px] text-[12px]/[1]",
        md: "h-[40px] px-[14px] text-[13px]/[1]",
        lg: "h-[46px] px-[16px] text-[14px]/[1]",
      },
    },
    defaultVariants: { material: "clay", size: "md" },
  },
);

/** Glyph box size per FAB size. Sizes the default or a caller-supplied icon. */
const ICON_BOX: Record<FabSize, string> = {
  sm: "[&_svg]:size-[18px]",
  md: "[&_svg]:size-[22px]",
  lg: "[&_svg]:size-[26px]",
};

/**
 * Staggered entrance for the speed-dial, shipped with the component rather than a
 * global sheet. React 19 hoists this and deduplicates by `href`, so a page with
 * several FABs emits one rule. The keyframe's resting (visible) state is each
 * action's base style with `backwards` fill, so `animation:none` — the
 * `motion-reduce` rule on each item — leaves every action present, only dropping
 * the travel.
 */
const FAB_KEYFRAMES = `
@keyframes mq-fab-item{from{opacity:0;translate:0 8px}to{opacity:1;translate:0 0}}`;

function FabKeyframes() {
  return (
    <style href="mq-fab" precedence="medium">
      {FAB_KEYFRAMES}
    </style>
  );
}

/** One entry in the speed-dial. */
export type FabAction = {
  /** Stable key; also the React list key. */
  id: string;
  /** Visible label and the action's accessible name. */
  label: string;
  /** Leading glyph. Mark it `aria-hidden` — the label already names the action. */
  icon: React.ReactNode;
  /** Called when the action is chosen, before the dial closes. */
  onSelect?: () => void;
};

export type FabProps = Omit<React.ComponentPropsWithRef<"button">, "color"> &
  Omit<VariantProps<typeof fabVariants>, "material"> & {
    /** Material recipe. Typed locally as the keys of the recipe map. */
    material?: FabMaterial;
    /**
     * Accessible name for the icon-only trigger. Required: without it the button
     * announces nothing.
     */
    "aria-label": string;
    /** The trigger glyph. Defaults to a plus. May also be passed as children. */
    icon?: React.ReactNode;
    /** When present and non-empty, the FAB becomes a speed-dial menu button. */
    actions?: FabAction[];
    /** Accessible name for the speed-dial `role="menu"`. */
    menuLabel?: string;
  };

export function Fab({
  actions,
  children,
  className,
  disabled = false,
  icon,
  material,
  menuLabel = "Actions",
  onClick,
  onKeyDown,
  ref,
  size,
  type,
  ...props
}: FabProps) {
  const isSpeedDial = Array.isArray(actions) && actions.length > 0;
  const [open, setOpen] = React.useState(false);
  const menuId = React.useId();

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  // Whether the next open should land focus on the first or the last item —
  // ArrowDown opens to the first, ArrowUp to the last (the menu-button pattern).
  const pendingFocusRef = React.useRef<"first" | "last">("first");

  const resolvedSize: FabSize = size ?? "md";

  function setButtonRef(node: HTMLButtonElement | null) {
    buttonRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }

  const close = React.useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  // On open, move the roving focus into the menu. It is an external system
  // (the DOM's active element), so it belongs in an effect.
  React.useEffect(() => {
    if (!open || !isSpeedDial) return;
    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (!items || items.length === 0) return;
    const target = pendingFocusRef.current === "last" ? items[items.length - 1] : items[0];
    target?.focus();
    pendingFocusRef.current = "first";
  }, [open, isSpeedDial]);

  // A pointer press outside the whole widget dismisses the dial without stealing
  // focus. Registered only while open, and torn down on close/unmount.
  React.useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (isSpeedDial) setOpen((value) => !value);
    onClick?.(event);
  }

  function handleButtonKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (isSpeedDial && !open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      pendingFocusRef.current = event.key === "ArrowUp" ? "last" : "first";
      setOpen(true);
    }
    onKeyDown?.(event);
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const items = [...(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
    if (items.length === 0) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[(currentIndex + 1 + items.length) % items.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        event.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "Tab":
        // Dismiss and hand focus back to the FAB deterministically. Letting the
        // default Tab run would compute its target from a menuitem this same
        // event is about to unmount, which can drop focus to <body>.
        event.preventDefault();
        close(true);
        break;
      default:
        break;
    }
  }

  const glyph = icon ?? children ?? <Plus aria-hidden="true" />;
  const dataOpen = isSpeedDial ? (open ? "true" : "false") : undefined;

  return (
    <div className={cn("relative inline-flex", className)} ref={wrapperRef}>
      {isSpeedDial ? <FabKeyframes /> : null}
      {isSpeedDial && open ? (
        <div
          aria-label={menuLabel}
          className="absolute bottom-full right-0 mb-[14px] flex flex-col items-end gap-[10px]"
          id={menuId}
          onKeyDown={handleMenuKeyDown}
          ref={menuRef}
          role="menu"
        >
          {actions.map((action, index) => (
            <button
              className={cn(
                actionVariants({ material, size }),
                "animate-[mq-fab-item_240ms_cubic-bezier(0.16,1,0.3,1)_backwards] motion-reduce:animate-none",
              )}
              data-material={material ?? "clay"}
              key={action.id}
              onClick={() => {
                action.onSelect?.();
                close(true);
              }}
              role="menuitem"
              // The item nearest the FAB (last in the column) reveals first, so
              // the stack unrolls upward out of the button.
              style={{ animationDelay: `${(actions.length - 1 - index) * 40}ms` }}
              tabIndex={index === 0 ? 0 : -1}
              type="button"
            >
              <span aria-hidden="true" className="inline-flex [&_svg]:size-[18px] [&_svg]:shrink-0">
                {action.icon}
              </span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      ) : null}
      {/* `props` is spread first: the ARIA/state attributes below derive from
          `actions`/`open` and must win over anything a caller passes through. */}
      <button
        {...props}
        aria-controls={isSpeedDial && open ? menuId : undefined}
        aria-expanded={isSpeedDial ? open : undefined}
        aria-haspopup={isSpeedDial ? "menu" : undefined}
        className={cn(fabVariants({ material, size }))}
        data-material={material ?? "clay"}
        data-open={dataOpen}
        disabled={disabled}
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
        ref={setButtonRef}
        type={type ?? "button"}
      >
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center [&_svg]:shrink-0",
            ICON_BOX[resolvedSize],
            // State is never colour alone: when the dial is open the glyph folds
            // 45° into a cross. The rotate applies instantly under reduced motion
            // (only the travel is dropped), and `aria-expanded` carries it to AT.
            isSpeedDial &&
              "transition-[rotate] duration-200 ease-out motion-reduce:transition-none data-[open=true]:rotate-45",
          )}
          data-open={dataOpen}
        >
          {glyph}
        </span>
      </button>
    </div>
  );
}

export { fabVariants, actionVariants };
