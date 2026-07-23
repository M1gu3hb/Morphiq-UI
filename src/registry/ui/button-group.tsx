"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Button Group
 *
 * A segmented cluster of native <button>s that share one surface, one 1px
 * border and one focus scope — a toolbar. Self-contained by design: every
 * material recipe lives in this file, every local custom property is used with
 * a literal fallback, and nothing comes from a global stylesheet, so copying
 * this file plus `src/lib/cn.ts` reproduces the full look.
 *
 * Composable API:
 *
 *   <ButtonGroup aria-label="Text alignment" material="clay" variant="horizontal">
 *     <ButtonGroupItem aria-label="Align left"><AlignLeft /></ButtonGroupItem>
 *     <ButtonGroupItem aria-label="Align center" aria-pressed><AlignCenter /></ButtonGroupItem>
 *     <ButtonGroupItem aria-label="Align right"><AlignRight /></ButtonGroupItem>
 *   </ButtonGroup>
 *
 * `material`, `variant` and `size` are declared once on the group; the items
 * read them from context so a caller cannot get them inconsistently wrong.
 *
 * Keyboard: the group is a real `role="toolbar"` with a roving tabindex —
 * exactly one member is tabbable, Arrow keys move focus along the axis, Home/
 * End jump to the ends, and disabled members are skipped. Radix is not used;
 * the roving contract is implemented here against the native buttons.
 *
 * Local theming knobs (each used with a fallback, override to retheme):
 *   --mq-body  surface color
 *   --mq-lit   top highlight color (skeuo gradient)
 *   --mq-edge  extruded bottom edge / pressed depth color
 *   --mq-text  foreground color
 *   --mq-brd   shared border color
 *   --mq-ring  focus ring color
 */

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so documentation surfaces and visual-regression
 * tests can render the focused look without synthesising a keyboard event. The
 * UA outline is not reset with `outline-none`: width, offset and colour are set
 * together, which fully replaces it on focus.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Per-material recipe, carrying each material's PRIMARY-intent token VALUES
 * inlined (copied from `button.tsx`) — surface, label, border, the resting
 * shadow, the hover lift with a grown shadow, and the `:active` sink into a
 * pressed inset well. Every member of a group shares one of these, so the whole
 * cluster reads as a single extruded slab. The material type is derived from
 * this object's keys so the file stays free of any `@/lib/component-data`
 * import.
 */
const MATERIAL_TOKENS = {
  // Clay: inflated warm slab. Warm brown ink throughout — clay never casts
  // black — sinking ~3px into a warm inset well on press.
  clay: [
    "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817]",
    "bg-[var(--mq-body,#ff9077)] text-[var(--mq-text,#4a1d13)]",
    "border-[var(--mq-brd,rgba(120,40,25,0.16))]",
    "shadow-[inset_0_3px_3px_rgba(255,255,255,0.55),inset_0_-4px_6px_rgba(120,40,25,0.18),0_6px_0_var(--mq-edge,#c9482f),0_12px_20px_rgba(75,40,31,0.18)]",
    "hover:-translate-y-[2px]",
    "hover:shadow-[inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(120,40,25,0.18),0_8px_0_var(--mq-edge,#c9482f),0_16px_26px_rgba(75,40,31,0.2)]",
    "active:translate-y-[3px]",
    "active:shadow-[inset_0_3px_7px_rgba(120,40,25,0.32),0_2px_0_var(--mq-edge,#c9482f)]",
  ].join(" "),
  // Glass: translucent tinted pane whose blur deepens on hover; a ~1px sink.
  glass: [
    "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817]",
    "bg-[var(--mq-body,rgba(23,24,23,0.74))] text-[var(--mq-text,#ffffff)]",
    "border-[var(--mq-brd,rgba(255,255,255,0.28))]",
    "backdrop-blur-[14px] backdrop-saturate-[160%]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_26px_rgba(24,20,40,0.2)]",
    "hover:-translate-y-[1px] hover:backdrop-blur-[18px]",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_32px_rgba(24,20,40,0.26)]",
    "active:translate-y-[1px]",
    "active:shadow-[inset_0_2px_7px_rgba(24,20,40,0.3)]",
  ].join(" "),
  // Skeuo: molded greige with a hard side wall; ~4px sink into a deep well.
  skeuo: [
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
    "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] text-[var(--mq-text,#f6f4ee)]",
    "border-[var(--mq-brd,rgba(0,0,0,0.5))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_5px_0_var(--mq-edge,#131311),0_10px_16px_rgba(38,36,31,0.28)]",
    "hover:-translate-y-[1px] hover:brightness-[1.08]",
    "active:translate-y-[4px]",
    "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
  ].join(" "),
  // Adaptive: no ornament. It adapts — palette follows the colour scheme,
  // density follows the pointer — with a ~1px contact-shadow sink.
  adaptive: [
    "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
    "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
    "bg-[var(--mq-body,#171817)] text-[var(--mq-text,#f6f5f1)]",
    "border-[var(--mq-brd,rgba(0,0,0,0.4))]",
    "shadow-[0_1px_2px_rgba(20,20,18,0.12)]",
    "hover:shadow-[0_5px_14px_rgba(20,20,18,0.18)]",
    "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
    "pointer-coarse:min-h-[48px] pointer-coarse:gap-[10px]",
  ].join(" "),
} as const;

/** The materials this component ships. Derived so no external type is imported. */
export type ButtonGroupMaterial = keyof typeof MATERIAL_TOKENS;
type ButtonGroupOrientation = "horizontal" | "vertical";
type ButtonGroupSize = "sm" | "md" | "lg";

const itemVariants = cva(
  [
    // `relative` + a base `z-0` so a hovered/focused/pressed member can be
    // raised above its neighbours (the shared border overlaps by a negative
    // margin, so without this the outline would be clipped by the next member).
    "relative z-0 inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap",
    // Line-height is folded into the size utilities (`text-[13px]/[1]`): merge
    // treats font-size as conflicting with `leading-*`, so a base `leading-none`
    // would be silently dropped by the later size utility.
    "border font-extrabold tracking-[-0.01em] cursor-pointer appearance-none",
    // `translate`, not `transform`: Tailwind v4's `translate-*` utilities write
    // the standalone `translate` property, so listing `transform` would animate
    // nothing. Only the properties some state actually changes are named:
    // translate (hover lift / press sink), box-shadow (every state), filter
    // (skeuo hover brightness), backdrop-filter (glass hover blur) and opacity
    // (disabled fade). No phantom entries.
    "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
    // Reduced motion drops the hover/press TRAVEL, but the pressed inset well on
    // `:active` / `aria-pressed` is a static shadow, applied instantly either
    // way, so the tactile feedback is preserved.
    "motion-reduce:transition-none",
    FOCUS_RING,
    "hover:z-10 focus-visible:z-10 data-[focus=true]:z-10 active:z-10 aria-pressed:z-10",
    // Fills and shadows are discarded in forced-colors; a real border keeps the
    // member's bounds once the material is gone.
    "forced-colors:border-[CanvasText]",
    // Opt-in selectable state (aria-pressed). Carried by an inset pressed depth
    // — a shape cue, not colour alone — and, in forced-colors, a system
    // Highlight fill. The attribute-qualified selectors out-specify the resting
    // shadow, so the pressed look wins regardless of source order.
    "aria-pressed:translate-y-[1px] aria-pressed:shadow-[inset_0_3px_7px_rgba(0,0,0,0.26)]",
    "forced-colors:aria-pressed:bg-[Highlight] forced-colors:aria-pressed:text-[HighlightText]",
    // Disabled: never lifted, never shadowed, never floating above siblings.
    "disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none disabled:translate-y-0 disabled:z-0",
  ].join(" "),
  {
    variants: {
      material: MATERIAL_TOKENS,
      // Members share one border: only the two OUTER corners are rounded, the
      // inner corners are squared, and a negative margin collapses adjacent
      // borders so they never double. `first:` resets the margin at the leading
      // edge. The radius comes from a per-size custom property.
      variant: {
        horizontal:
          "rounded-none -ml-px first:ml-0 first:rounded-l-[var(--mq-bg-radius,15px)] last:rounded-r-[var(--mq-bg-radius,15px)]",
        vertical:
          "rounded-none -mt-px first:mt-0 first:rounded-t-[var(--mq-bg-radius,15px)] last:rounded-b-[var(--mq-bg-radius,15px)]",
      },
      size: {
        sm: "h-[36px] gap-[6px] px-[14px] text-[12px]/[1] [--mq-bg-radius:12px]",
        md: "h-[44px] gap-[8px] px-[20px] text-[13px]/[1] [--mq-bg-radius:15px]",
        lg: "h-[52px] gap-[10px] px-[26px] text-[14px]/[1] [--mq-bg-radius:18px]",
      },
    },
    defaultVariants: { material: "clay", variant: "horizontal", size: "md" },
  },
);

const ButtonGroupContext = React.createContext<{
  material: ButtonGroupMaterial;
  variant: ButtonGroupOrientation;
  size: ButtonGroupSize;
}>({
  material: "clay",
  variant: "horizontal",
  size: "md",
});

export type ButtonGroupProps = React.ComponentPropsWithRef<"div"> & {
  material?: ButtonGroupMaterial;
  /** Layout axis and the axis the Arrow keys travel along. */
  variant?: ButtonGroupOrientation;
  size?: ButtonGroupSize;
};

/**
 * The toolbar. Owns the roving tabindex and Arrow / Home / End navigation over
 * its enabled members. `aria-label` (or `aria-labelledby`) is required so the
 * toolbar has an accessible name.
 */
export function ButtonGroup({
  material = "clay",
  variant = "horizontal",
  size = "md",
  className,
  children,
  onFocus,
  onKeyDown,
  ref,
  ...props
}: ButtonGroupProps) {
  // `rovingIndex` is the member index that owns the single tab stop. It follows
  // focus so tabbing out and back returns to the last-focused member.
  const [rovingIndex, setRovingIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const childArray = React.Children.toArray(children).filter(
    React.isValidElement,
  ) as React.ReactElement<{ disabled?: boolean }>[];

  // The tabbable member must be enabled; if the remembered one is disabled (or
  // out of range) fall back to the first enabled member. Computed at render so
  // the very first server-rendered paint already has exactly one tab stop.
  const enabledIndexes = childArray.reduce<number[]>((acc, child, index) => {
    if (!child.props.disabled) acc.push(index);
    return acc;
  }, []);
  const tabbableIndex = enabledIndexes.includes(rovingIndex)
    ? rovingIndex
    : enabledIndexes[0] ?? 0;

  function getEnabledButtons(): HTMLButtonElement[] {
    const root = containerRef.current;
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLButtonElement>("[data-bg-item]")).filter(
      (button) => !button.disabled,
    );
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const isVertical = variant === "vertical";
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
    const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
    if (event.key === nextKey || event.key === prevKey || event.key === "Home" || event.key === "End") {
      const buttons = getEnabledButtons();
      if (buttons.length > 0) {
        event.preventDefault();
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        let target: number;
        if (event.key === "Home") target = 0;
        else if (event.key === "End") target = buttons.length - 1;
        else if (event.key === nextKey) target = current < 0 ? 0 : (current + 1) % buttons.length;
        else target = current < 0 ? buttons.length - 1 : (current - 1 + buttons.length) % buttons.length;
        buttons[target]?.focus();
      }
    }
    onKeyDown?.(event);
  }

  function handleFocus(event: React.FocusEvent<HTMLDivElement>) {
    // `onFocus` bubbles in React (it is wired to focusin), so this fires when
    // any member gains focus; move the tab stop to whichever member that is.
    const raw = event.target.getAttribute?.("data-bg-index");
    if (raw !== null && raw !== undefined) {
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) setRovingIndex(parsed);
    }
    onFocus?.(event);
  }

  const contextValue = React.useMemo(
    () => ({ material, variant, size }),
    [material, variant, size],
  );

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div
        {...props}
        aria-orientation={variant === "vertical" ? "vertical" : "horizontal"}
        className={cn(
          "relative isolate",
          variant === "vertical" ? "inline-flex flex-col" : "inline-flex flex-row",
          className,
        )}
        data-material={material}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="toolbar"
      >
        {childArray.map((child, index) =>
          React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
            key: child.key ?? index,
            tabIndex: index === tabbableIndex ? 0 : -1,
            "data-bg-index": index,
          }),
        )}
      </div>
    </ButtonGroupContext.Provider>
  );
}

export type ButtonGroupItemProps = React.ComponentPropsWithRef<"button">;

/**
 * A single member. A native <button> carrying the shared material press recipe.
 * It reads `material` / `variant` / `size` from the group and receives its tab
 * stop and index from the group's roving controller. Icon-only members must
 * carry an accessible name via `aria-label`.
 */
export function ButtonGroupItem({ className, type, ...props }: ButtonGroupItemProps) {
  const { material, variant, size } = React.useContext(ButtonGroupContext);
  return (
    <button
      {...props}
      className={cn(itemVariants({ material, variant, size }), className)}
      data-bg-item=""
      data-material={material}
      type={type ?? "button"}
    />
  );
}

export type ButtonGroupVariantProps = VariantProps<typeof itemVariants>;

export { itemVariants };
