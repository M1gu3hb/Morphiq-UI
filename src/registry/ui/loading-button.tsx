"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Loading Button
 *
 * A native <button> that gains a pending state without any layout shift (CLS):
 * the label keeps its box while a spinner is overlaid dead-centre, so the
 * control never changes width between idle and busy.
 *
 * Self-contained by design: the four material recipes (clay / glass / skeuo /
 * adaptive) are copied and owned here from the Button recipe, using its
 * PRIMARY-intent token values. It reads no `:root` custom properties and uses
 * no class from a global stylesheet, so copying this file (plus `src/lib/cn.ts`)
 * reproduces the full look.
 *
 * Local theming knobs, each referenced WITH a literal fallback so nothing ever
 * relies on an inherited value being present:
 *
 *   --mq-body  surface colour
 *   --mq-lit   top highlight colour (gradient materials)
 *   --mq-edge  extruded bottom edge / pressed depth colour
 *   --mq-text  foreground colour
 *   --mq-brd   border colour
 *   --mq-ring  focus ring colour
 */

/**
 * Focus ring — declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so documentation/visual-regression surfaces can
 * render the focused look without synthesising a keyboard event. The UA outline
 * is not reset with `outline-none`: width, offset and colour are set together,
 * fully replacing it on focus.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

const loadingButtonVariants = cva(
  [
    "relative isolate inline-flex shrink-0 select-none items-center justify-center",
    // Line-height folded into the size utility (`text-[13px]/[1]`): tailwind-merge
    // treats font-size as conflicting with `leading-*`, so a bare `leading-none`
    // in the base would be dropped by the later size utility.
    "border font-extrabold tracking-[-0.01em]",
    "cursor-pointer appearance-none",
    // `translate`, not `transform`: Tailwind v4's `translate-*` utilities write
    // the standalone `translate` property, so the hover lift and active sink
    // animate only when `translate` is named. Only properties some material state
    // actually changes are listed — background-color is deliberately absent
    // because no primary material recipe changes it (that would be a phantom
    // transition getAnimations() reports firing on nothing).
    "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    FOCUS_RING,
    // Keep the control's bounds once forced-colors discards fills and shadows.
    "forced-colors:border-[CanvasText]",
    // Disabled uses the native `:disabled` pseudo — a genuinely disabled button.
    // (The busy state below never sets `disabled`; see the component docblock.)
    "disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none disabled:translate-y-0",
    // Busy affordance for the pointer; the control stays focusable while busy.
    "data-[loading=true]:cursor-progress",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#ff9077)] text-[var(--mq-text,#4a1d13)]",
          "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,rgba(120,40,25,0.16))]",
          "shadow-[inset_0_3px_3px_rgba(255,255,255,0.55),inset_0_-4px_6px_rgba(120,40,25,0.18),0_6px_0_var(--mq-edge,#c9482f),0_12px_20px_rgba(75,40,31,0.18)]",
          "hover:-translate-y-[2px]",
          "hover:shadow-[inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(120,40,25,0.18),0_8px_0_var(--mq-edge,#c9482f),0_16px_26px_rgba(75,40,31,0.2)]",
          // Clay sinks ~3px into a warm inset well on press.
          "active:translate-y-[3px]",
          "active:shadow-[inset_0_3px_7px_rgba(120,40,25,0.32),0_2px_0_var(--mq-edge,#c9482f)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(23,24,23,0.74))] text-[var(--mq-text,#ffffff)]",
          "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,rgba(255,255,255,0.28))]",
          "backdrop-blur-[14px] backdrop-saturate-[160%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_26px_rgba(24,20,40,0.2)]",
          "hover:-translate-y-[1px] hover:backdrop-blur-[18px]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_32px_rgba(24,20,40,0.26)]",
          // Glass barely dips (~1px) — it is a pane, not a soft body.
          "active:translate-y-[1px]",
          "active:shadow-[inset_0_2px_7px_rgba(24,20,40,0.3)]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] text-[var(--mq-text,#f6f4ee)]",
          "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
          "border-[var(--mq-brd,rgba(0,0,0,0.5))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_5px_0_var(--mq-edge,#131311),0_10px_16px_rgba(38,36,31,0.28)]",
          "hover:-translate-y-[1px] hover:brightness-[1.08]",
          // Skeuo travels the deepest into its extruded edge (~4px).
          "active:translate-y-[4px]",
          "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
        ].join(" "),
        // Polymorphic: no ornament. Palette follows the color scheme, density
        // follows the pointer type; it dips ~1px on press.
        adaptive: [
          "bg-[var(--mq-body,#171817)] text-[var(--mq-text,#f6f5f1)]",
          "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
          "border-[var(--mq-brd,rgba(0,0,0,0.4))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.12)]",
          "hover:shadow-[0_5px_14px_rgba(20,20,18,0.18)]",
          "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
          // Coarse pointers get a comfortable target and more air; only ever grows.
          "pointer-coarse:min-h-[48px] pointer-coarse:gap-[10px]",
        ].join(" "),
      },
      size: {
        sm: "h-[36px] gap-[6px] rounded-[12px] px-[14px] text-[12px]/[1]",
        md: "h-[44px] gap-[8px] rounded-[15px] px-[20px] text-[13px]/[1]",
        lg: "h-[52px] gap-[10px] rounded-[18px] px-[26px] text-[14px]/[1]",
      },
    },
    defaultVariants: {
      material: "clay",
      size: "md",
    },
  },
);

/** Visual state the preview/documentation surface can force. */
export type LoadingButtonForcedState = "default" | "focus" | "loading" | "disabled";

/**
 * A determinate SVG spinner. `aria-hidden` because the busy state is conveyed by
 * `aria-busy` on the button (plus the optional textual `loadingText`), never by
 * this glyph alone. `motion-reduce:animate-none` freezes the ring under reduced
 * motion — its mere presence still marks the loading state.
 */
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-[1.15em] shrink-0 animate-spin motion-reduce:animate-none", className)}
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.28" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

// `ComponentPropsWithRef` (not `...WithoutRef`): React 19 passes `ref` as a
// normal prop, so the public type accepts it without a `forwardRef` wrapper.
export type LoadingButtonProps = Omit<React.ComponentPropsWithRef<"button">, "color"> &
  VariantProps<typeof loadingButtonVariants> & {
    /**
     * Shows a spinner, sets `aria-busy`, and blocks activation — WITHOUT setting
     * the native `disabled` attribute. A disabled button is dropped from the tab
     * order and blurred by the UA, which would throw focus to `<body>` at the
     * exact moment the busy announcement is meant to be read. The control stays
     * focusable and activation is suppressed in the handlers instead.
     */
    loading?: boolean;
    /**
     * Optional busy label. When set it is shown beside the spinner (visible) and
     * becomes the control's accessible name while busy (the idle label is
     * hidden from AT to avoid a "Save / Saving" double read). When omitted, the
     * idle label stays in the accessibility tree and `aria-busy` carries the
     * state on its own.
     */
    loadingText?: string;
  };

export function LoadingButton({
  children,
  className,
  disabled = false,
  loading = false,
  loadingText,
  material,
  onClick,
  onKeyDown,
  size,
  type,
  ...props
}: LoadingButtonProps) {
  // Activation is suppressed in the handlers, not by the native `disabled`
  // attribute, so the control stays focusable while `aria-busy` is announced.
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (loading && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onKeyDown?.(event);
  }

  const hideLabelFromAt = loading && Boolean(loadingText);

  return (
    // `props` is spread first: the derived accessibility/state attributes below
    // must win over anything a caller passes through.
    <button
      {...props}
      aria-busy={loading || undefined}
      className={cn(loadingButtonVariants({ material, size }), className)}
      data-loading={loading ? "true" : undefined}
      data-material={material ?? "clay"}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type={type ?? "button"}
    >
      {/* The label keeps its box so the button width never changes between
          states (no CLS). While busy it is only hidden visually (opacity-0),
          and hidden from AT only when a `loadingText` supplies the busy name. */}
      <span
        aria-hidden={hideLabelFromAt || undefined}
        className={cn(
          "inline-flex items-center justify-center gap-[inherit]",
          loading && "opacity-0",
        )}
      >
        {children}
      </span>

      {/* Spinner (and optional visible busy text) overlaid dead-centre. Purely
          visual — `aria-hidden` — because the busy state is announced by
          `aria-busy` and, when present, the sr-only `loadingText` below. */}
      {loading ? (
        <span
          aria-hidden="true"
          // `overflow-hidden` + a truncating text span keep a `loadingText` wider
          // than the reserved idle-label box from spilling outside the button's
          // rounded bounds (the overlay is out of flow, so it cannot grow the
          // control); it truncates with an ellipsis instead.
          className="absolute inset-0 inline-flex items-center justify-center gap-[8px] overflow-hidden px-[10px]"
        >
          <Spinner />
          {loadingText ? <span className="min-w-0 truncate">{loadingText}</span> : null}
        </span>
      ) : null}

      {/* Accessible busy name — read by AT in place of the hidden idle label. */}
      {hideLabelFromAt ? <span className="sr-only">{loadingText}</span> : null}
    </button>
  );
}

export { loadingButtonVariants };
