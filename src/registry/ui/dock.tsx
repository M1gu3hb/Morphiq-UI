"use client";

import * as React from "react";
import { Circle, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Dock
 *
 * A macOS-style dock: a row of icon controls that magnify with the pointer's
 * horizontal proximity — the icon nearest the cursor grows most, its neighbours
 * less, falling off smoothly with distance.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * The magnification is compositor-only and never touches React state per frame,
 * the way the Spotlight Card writes pointer coordinates straight to the element.
 * The bar's `onPointerMove` reads the cursor's viewport X and hands it to each
 * registered icon; the icon measures its own (never-scaled) wrapper, computes
 * `scale = 1 + boost * max(0, 1 - distance / influence)` and writes it to the
 * standalone `scale` property of its control. `onPointerLeave` resets every icon
 * to 1. There is no animation library and no shared motion state.
 *
 * Composable API:
 *
 *   <Dock material="clay" size="md" aria-label="Application dock">
 *     <DockIcon label="Home" icon={House} active />
 *     <DockIcon label="Search" icon={Search} />
 *     <DockIcon label="Docs" icon={Files} href="/docs" />
 *   </Dock>
 *
 * `material`, `size`, `influence` and `boost` are declared once on the root and
 * reach the parts through a tiny context. Each `DockIcon` is a real `<button>`
 * (or an `<a>` when given `href`) with an accessible name, so keyboard and
 * assistive-tech users get a first-class control; the magnification is decoration
 * layered on top of it and is skipped entirely under reduced motion.
 *
 * Local theming knobs:
 *
 *   --mq-bar         bar surface
 *   --mq-bar-brd     bar border
 *   --mq-bar-grad    bar top gradient
 *   --mq-bar-shadow  bar depth
 *   --mq-edge        tactile lower wall (clay / skeuo)
 *   --mq-ink         icon glyph colour, inherited by every control
 *   --mq-hover-bg    hover wash on an icon plate
 *   --mq-tip         tooltip surface
 *   --mq-tip-text    tooltip label
 *   --mq-tip-brd     tooltip border
 *   --mq-ring        focus ring
 */

/**
 * Palette per material. Declared on the bar; the parts inherit it.
 *
 * The values are the library's shared vocabulary (see `tabs.tsx`): a floating
 * dock is a *raised* object, so each recipe takes the lit-at-top gradient and
 * the extruded shadow — the chip half of the two-way depth read — rather than
 * the sunk trough. Warm brown ink for clay, achromatic ink for skeuo, and the
 * adaptive recipe carries its own `dark:` overrides because it has no ornament
 * of its own to lean on.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-bar:#efe7db] [--mq-bar-brd:rgba(120,80,55,0.20)] [--mq-edge:#c9482f]",
    "[--mq-ink:#5b4a3c] [--mq-hover-bg:rgba(255,255,255,0.60)]",
    "[--mq-bar-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    "[--mq-bar-shadow:inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_12px_26px_rgba(75,40,31,0.22)]",
    "[--mq-tip:#3b2117] [--mq-tip-text:#fbeee7] [--mq-tip-brd:rgba(0,0,0,0.25)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-bar:rgba(255,255,255,0.62)] [--mq-bar-brd:rgba(255,255,255,0.75)]",
    "[--mq-ink:#2f2f29] [--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-bar-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_12px_30px_rgba(24,20,40,0.18)]",
    "[--mq-tip:rgba(23,24,23,0.90)] [--mq-tip-text:#ffffff] [--mq-tip-brd:rgba(255,255,255,0.20)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-bar:#dbd7ce] [--mq-bar-brd:rgba(25,25,23,0.32)] [--mq-edge:#a8a49b]",
    "[--mq-ink:#33322d] [--mq-hover-bg:rgba(255,255,255,0.40)]",
    "[--mq-bar-grad:linear-gradient(180deg,#fbfaf6,#e6e3da)]",
    "[--mq-bar-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(0,0,0,0.16),0_2px_0_var(--mq-edge,#a8a49b),0_12px_22px_rgba(38,36,31,0.26)]",
    "[--mq-tip:#23231f] [--mq-tip-text:#f6f4ee] [--mq-tip-brd:rgba(0,0,0,0.30)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  adaptive: [
    "[--mq-bar:#f1f0ec] [--mq-bar-brd:rgba(23,24,23,0.14)]",
    "[--mq-ink:#55554e] [--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-bar-grad:none]",
    "[--mq-bar-shadow:inset_0_0_0_rgba(20,20,18,0),0_2px_6px_rgba(20,20,18,0.10),0_14px_30px_rgba(20,20,18,0.10)]",
    "[--mq-tip:#1c1c19] [--mq-tip-text:#f1efe9] [--mq-tip-brd:rgba(0,0,0,0.30)]",
    "[--mq-ring:#171817]",
    "dark:[--mq-bar:#26262a] dark:[--mq-bar-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-ink:#b9b7b0] dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-bar-shadow:inset_0_0_0_rgba(0,0,0,0),0_2px_6px_rgba(0,0,0,0.45),0_14px_30px_rgba(0,0,0,0.45)]",
    "dark:[--mq-tip:#3a3a40] dark:[--mq-tip-text:#f1efe9] dark:[--mq-tip-brd:rgba(255,255,255,0.14)]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type DockMaterial = keyof typeof MATERIAL_TOKENS;
type DockVariant = "default";
type DockSize = "sm" | "md" | "lg";

/**
 * Magnification defaults per size, in CSS pixels.
 *
 * `influence` is the horizontal reach of the field; `boost` is how much the
 * closest icon grows (scale = 1 + boost). Both scale up with the icon box so the
 * curve keeps the same feel across sizes. A caller can override either on the
 * root without touching the recipe.
 */
const SIZE_MAGNIFY: Record<DockSize, { influence: number; boost: number }> = {
  sm: { influence: 92, boost: 0.42 },
  md: { influence: 116, boost: 0.46 },
  lg: { influence: 140, boost: 0.5 },
};

/** How far above the icon each tooltip floats, clearing the magnified glyph. */
const TOOLTIP_OFFSET: Record<DockSize, string> = {
  sm: "mb-[22px]",
  md: "mb-[26px]",
  lg: "mb-[30px]",
};

/** Called by the bar on every pointer move; `null` means "settle to rest". */
type DockUpdater = (pointerX: number | null) => void;

type DockContextValue = {
  size: DockSize;
  influence: number;
  boost: number;
  register: (updater: DockUpdater) => () => void;
};

/**
 * Carries the size and magnification field from the root to the parts, plus a
 * registration channel the bar uses to drive each icon imperatively. The
 * registry is a ref-held `Set`, never React state, so a pointer move never
 * schedules a render.
 */
const DockContext = React.createContext<DockContextValue>({
  size: "md",
  influence: SIZE_MAGNIFY.md.influence,
  boost: SIZE_MAGNIFY.md.boost,
  register: () => () => {},
});

/** SSR-safe reduced-motion read. Defaults to false until the client confirms. */
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return () => {};
      }
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as { current: T | null }).current = node;
}

const dockBarVariants = cva(
  [
    "relative isolate inline-flex items-end m-0 [list-style:none]",
    "text-[color:var(--mq-ink,#5b4a3c)]",
    "border border-[var(--mq-bar-brd,rgba(120,80,55,0.20))] bg-[var(--mq-bar,#efe7db)]",
    "[background-image:var(--mq-bar-grad,none)]",
    "shadow-[var(--mq-bar-shadow,inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_12px_26px_rgba(75,40,31,0.22))]",
    // Fills, gradients and shadows are all discarded or forced by the OS in
    // forced-colors; clear the gradient by hand (it is not auto-cleared) and let
    // the border carry the boundary on a system colour.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none]",
    "forced-colors:shadow-none forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: { default: "" },
      size: {
        sm: "gap-[4px] rounded-[18px] p-[6px]",
        md: "gap-[6px] rounded-[22px] p-[8px]",
        lg: "gap-[8px] rounded-[26px] p-[10px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export type DockProps = Omit<React.ComponentPropsWithRef<"ul">, "children"> & {
  material?: DockMaterial;
  variant?: DockVariant;
  size?: DockSize;
  /** Horizontal reach of the magnification field, in px. Overrides the size default. */
  influence?: number;
  /** How much the closest icon grows (scale = 1 + boost). Overrides the size default. */
  boost?: number;
  children?: React.ReactNode;
};

/**
 * Root. A `<nav>` landmark wrapping the `<ul>` bar, so assistive tech announces
 * "navigation, list, N items". The bar owns the pointer handlers and the
 * material tokens; the icons inherit the ink and register themselves for
 * magnification.
 */
export function Dock({
  "aria-label": ariaLabel = "Dock",
  boost,
  children,
  className,
  influence,
  material = "clay",
  onPointerLeave,
  onPointerMove,
  ref,
  size = "md",
  variant = "default",
  ...props
}: DockProps) {
  const magnify = SIZE_MAGNIFY[size];
  const resolvedInfluence = influence ?? magnify.influence;
  const resolvedBoost = boost ?? magnify.boost;
  const reducedMotion = usePrefersReducedMotion();
  const updatersRef = React.useRef<Set<DockUpdater>>(new Set());

  const register = React.useCallback((updater: DockUpdater) => {
    const store = updatersRef.current;
    store.add(updater);
    return () => {
      store.delete(updater);
    };
  }, []);

  const contextValue = React.useMemo<DockContextValue>(
    () => ({ size, influence: resolvedInfluence, boost: resolvedBoost, register }),
    [size, resolvedInfluence, resolvedBoost, register],
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    onPointerMove?.(event);
    // Reduced motion turns the magnification OFF entirely: the icons stay at
    // their resting size and the bar is a plain, fully usable row. Reset rather
    // than bail, so that if the OS setting flips to reduce mid-hover any scale a
    // prior move already wrote settles back to 1 instead of freezing magnified.
    if (reducedMotion) {
      updatersRef.current.forEach((update) => update(null));
      return;
    }
    const pointerX = event.clientX;
    updatersRef.current.forEach((update) => update(pointerX));
  };

  const handleReset = (event: React.PointerEvent<HTMLUListElement>) => {
    onPointerLeave?.(event);
    updatersRef.current.forEach((update) => update(null));
  };

  return (
    <DockContext.Provider value={contextValue}>
      <nav aria-label={ariaLabel} className="w-fit">
        <ul
          {...props}
          className={cn(dockBarVariants({ size, variant }), MATERIAL_TOKENS[material], className)}
          data-material={material}
          onPointerLeave={handleReset}
          onPointerMove={handlePointerMove}
          ref={ref}
        >
          {children}
        </ul>
      </nav>
    </DockContext.Provider>
  );
}

const dockIconVariants = cva(
  [
    "relative z-10 inline-flex origin-bottom items-center justify-center",
    "cursor-pointer select-none appearance-none border-0 bg-transparent p-0 text-[color:inherit]",
    // `scale` is written imperatively as an inline standalone property (never a
    // `scale-*` utility), so naming it here is exactly what animates — no
    // Tailwind translate/transform trap is possible. The hover wash rides along
    // on background-color.
    "transition-[scale,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:hover:bg-[Canvas] forced-colors:focus-visible:outline-[Highlight]",
    "disabled:cursor-not-allowed disabled:opacity-45",
    "[&_svg]:pointer-events-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-[38px] rounded-[11px] [&_svg]:size-[18px]",
        md: "size-[46px] rounded-[13px] [&_svg]:size-[21px]",
        lg: "size-[54px] rounded-[15px] [&_svg]:size-[24px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const TOOLTIP_BASE = cn(
  "pointer-events-none absolute bottom-full left-1/2 z-20 -translate-x-1/2",
  "whitespace-nowrap rounded-[8px] px-[9px] py-[4px]",
  "text-[length:11px] font-bold leading-none tracking-[-0.01em]",
  "border border-[var(--mq-tip-brd,rgba(0,0,0,0.25))]",
  "bg-[var(--mq-tip,#3b2117)] text-[color:var(--mq-tip-text,#fbeee7)]",
  "shadow-[0_6px_16px_rgba(20,15,10,0.22)]",
  // Only the fade is motion; the label is already the control's accessible name,
  // so reduced motion simply shows it without the transition.
  "opacity-0 transition-[opacity] duration-150 ease-out motion-reduce:transition-none",
  "group-hover/icon:opacity-100 group-has-[:focus-visible]/icon:opacity-100",
  "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
);

const DOT_CLASS = cn(
  "pointer-events-none absolute bottom-[-3px] left-1/2 z-20 -translate-x-1/2",
  "size-[4px] rounded-full bg-[var(--mq-ink,#5b4a3c)]",
  "forced-colors:bg-[CanvasText]",
);

const WRAPPER_CLASS = "group/icon relative inline-flex items-end justify-center [list-style:none]";

/**
 * The glyph. Wrapped in an aria-hidden span because the control already carries
 * its name through `aria-label`, so the icon is pure decoration. Falls back to a
 * neutral `Circle` when no icon or children are supplied.
 */
function DockIconGlyph({ icon, children }: { icon?: LucideIcon; children?: React.ReactNode }) {
  const IconComponent = icon ?? Circle;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none relative z-10 grid place-items-center [&_svg]:block"
    >
      {children ?? <IconComponent aria-hidden="true" />}
    </span>
  );
}

/**
 * Decorations that must NOT scale with the control: the floating tooltip and the
 * running-app dot. They live in the never-scaled wrapper, so the tooltip stays a
 * fixed-size bubble and the active dot keeps its place on the dock floor.
 */
function DockIconDecorations({
  label,
  active,
  size,
}: {
  label: React.ReactNode;
  active?: boolean;
  size: DockSize;
}) {
  return (
    <>
      <span aria-hidden="true" className={cn(TOOLTIP_BASE, TOOLTIP_OFFSET[size])}>
        {label}
      </span>
      {active ? <span aria-hidden="true" className={DOT_CLASS} /> : null}
    </>
  );
}

type DockIconOwnProps = {
  /** Accessible name for the control and the visible tooltip label. */
  label: string;
  /** Lucide icon component. Falls back to `Circle`; `children` override it. */
  icon?: LucideIcon;
  /** Marks the current destination: adds a running dot and `aria-current="page"`. */
  active?: boolean;
};

type DockIconAnchorProps = DockIconOwnProps & { href: string } & Omit<
    React.ComponentPropsWithRef<"a">,
    keyof DockIconOwnProps
  >;

type DockIconButtonProps = DockIconOwnProps & { href?: undefined } & Omit<
    React.ComponentPropsWithRef<"button">,
    keyof DockIconOwnProps
  >;

export type DockIconProps = DockIconAnchorProps | DockIconButtonProps;

/**
 * One dock item. Renders a real `<a href>` when given `href`, otherwise a real
 * `<button>` — either way a first-class, keyboard-reachable control with an
 * accessible name.
 *
 * The wrapper `<li>` is the layout box and is never scaled, so measuring its
 * centre is stable no matter how large the control has grown; only the control
 * itself takes the imperative `scale`, growing upward from the dock floor.
 */
export function DockIcon(props: DockIconProps) {
  const { register, influence, boost, size } = React.useContext(DockContext);
  const wrapperRef = React.useRef<HTMLLIElement | null>(null);
  const controlRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const update: DockUpdater = (pointerX) => {
      const control = controlRef.current;
      const wrapper = wrapperRef.current;
      if (!control || !wrapper) return;
      // A disabled icon is not an affordance, so it never magnifies — it rests
      // at 1 whatever the cursor does.
      const isDisabled =
        (control as HTMLButtonElement).disabled === true ||
        control.getAttribute("aria-disabled") === "true";
      if (pointerX === null || isDisabled) {
        control.style.setProperty("scale", "1");
        return;
      }
      const rect = wrapper.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(center - pointerX);
      const proximity = Math.max(0, 1 - distance / influence);
      control.style.setProperty("scale", (1 + boost * proximity).toFixed(3));
    };
    return register(update);
  }, [register, influence, boost]);

  if (props.href !== undefined) {
    const { label, icon, active, className, children, href, ref, ...anchorRest } = props;
    return (
      <li className={WRAPPER_CLASS} ref={wrapperRef}>
        <a
          {...anchorRest}
          aria-current={active ? "page" : undefined}
          aria-label={label}
          className={cn(dockIconVariants({ size }), className)}
          href={href}
          ref={(node) => {
            controlRef.current = node;
            assignRef(ref, node);
          }}
        >
          <DockIconGlyph icon={icon}>{children}</DockIconGlyph>
        </a>
        <DockIconDecorations active={active} label={label} size={size} />
      </li>
    );
  }

  const { label, icon, active, className, children, ref, type = "button", ...buttonRest } = props;
  return (
    <li className={WRAPPER_CLASS} ref={wrapperRef}>
      <button
        {...buttonRest}
        aria-current={active ? "page" : undefined}
        aria-label={label}
        className={cn(dockIconVariants({ size }), className)}
        ref={(node) => {
          controlRef.current = node;
          assignRef(ref, node);
        }}
        type={type}
      >
        <DockIconGlyph icon={icon}>{children}</DockIconGlyph>
      </button>
      <DockIconDecorations active={active} label={label} size={size} />
    </li>
  );
}

export type DockVariantProps = VariantProps<typeof dockBarVariants>;

export { dockBarVariants, dockIconVariants };
