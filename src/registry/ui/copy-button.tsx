"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Copy Button
 *
 * A native `<button>` that writes `value` to the clipboard on click and swaps
 * from an idle look (a Copy glyph + "Copy") to a copied look (a Check glyph +
 * "Copied") for ~1.6s before reverting. The idle/copied distinction is carried
 * by the ICON and the TEXT — never by colour alone — and success is announced in
 * a polite `role="status"` live region so it reaches assistive tech.
 *
 * Self-contained by design: the four material recipes are copied out of the
 * Button so this file plus `src/lib/cn.ts` reproduce the full tactile look with
 * no dependency on any global stylesheet or `:root` custom property. Each
 * material inlines its PRIMARY-intent token values, and every `var()` still
 * carries a literal fallback, so any of the theming knobs below can be
 * overridden from a parent or from `className` to retheme without forking:
 *
 *   --mq-body  surface color
 *   --mq-lit   top highlight color (gradient materials)
 *   --mq-edge  extruded bottom edge / pressed depth color
 *   --mq-text  foreground color
 *   --mq-brd   border color
 *   --mq-ring  focus ring color
 */

/** Local material type — deliberately NOT imported from `@/lib/component-data`. */
type Material = "clay" | "glass" | "skeuo" | "adaptive";

/** Fallback material, single-sourced so the default and `data-material` agree. */
const DEFAULT_MATERIAL: Material = "clay";

/** How long the copied state lingers before reverting to idle, in ms. */
const COPIED_DURATION_MS = 1600;

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so documentation surfaces and visual-regression
 * tests can render the focused look without synthesising a keyboard event. The
 * UA outline is not reset with `outline-none`: width, offset and colour are set
 * together, which fully replaces it on focus, and `forced-colors` swaps in the
 * system Highlight so the ring survives a high-contrast theme.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

const copyButtonVariants = cva(
  [
    "relative isolate inline-flex shrink-0 select-none items-center justify-center",
    "border font-extrabold tracking-[-0.01em]",
    "cursor-pointer appearance-none",
    // `translate`/`filter`/`backdrop-filter` are the STANDALONE properties Tailwind
    // v4 writes for `translate-*` / `brightness-*` / `backdrop-blur-*`, so we name
    // them (never `transform`). Only properties some state actually changes are
    // listed: translate + box-shadow move on hover/press, glass shifts its
    // backdrop-filter on hover, skeuo its filter, and opacity drops when disabled.
    // Nothing changes background-color here, so it is deliberately omitted.
    "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    FOCUS_RING,
    // Bounds survive forced-colors once fills and shadows are discarded.
    "forced-colors:border-[CanvasText]",
    // Copied is the "selected" state: give it a system-coloured mark in forced
    // colors so it is distinguishable from idle without relying on the fill.
    "data-[copied=true]:forced-colors:text-[Highlight]",
    // Disabled look is driven by `data-state` so it is explicit and self-contained.
    "data-[state=disabled]:cursor-not-allowed data-[state=disabled]:opacity-55",
    "data-[state=disabled]:translate-y-0 data-[state=disabled]:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
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
          // Frosted fills vanish in forced colors; keep the bounds only.
          "forced-colors:shadow-none",
        ].join(" "),
        skeuo: [
          "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
          "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] text-[var(--mq-text,#f6f4ee)]",
          "border-[var(--mq-brd,rgba(0,0,0,0.5))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_5px_0_var(--mq-edge,#131311),0_10px_16px_rgba(38,36,31,0.28)]",
          "hover:-translate-y-[1px] hover:brightness-[1.08]",
          "active:translate-y-[4px]",
          "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
        ].join(" "),
        adaptive: [
          "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
          "bg-[var(--mq-body,#171817)] text-[var(--mq-text,#f6f5f1)]",
          "border-[var(--mq-brd,rgba(0,0,0,0.4))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.12)]",
          "hover:shadow-[0_5px_14px_rgba(20,20,18,0.18)]",
          "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
          // Coarse pointers get a comfortable touch target and more air; only
          // ever grows the control, never shrinks the size variant's padding.
          "pointer-coarse:min-h-[48px] pointer-coarse:gap-[10px]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "h-[36px] gap-[6px] rounded-[12px] px-[14px] text-[12px]/[1]",
        md: "h-[44px] gap-[8px] rounded-[15px] px-[20px] text-[13px]/[1]",
        lg: "h-[52px] gap-[10px] rounded-[18px] px-[26px] text-[14px]/[1]",
      },
    },
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

// `ComponentPropsWithRef` (not `...WithoutRef`): React 19 passes `ref` as a
// normal prop, so the public type accepts it without a `forwardRef` wrapper.
// `value` and `children` are re-typed/removed: the text to copy comes from
// `value`, and the visible content is generated from the copied state.
export type CopyButtonProps = Omit<
  React.ComponentPropsWithRef<"button">,
  "value" | "children" | "color"
> &
  VariantProps<typeof copyButtonVariants> & {
    /** The string written to the clipboard on click. */
    value: string;
    /** Idle label. Defaults to "Copy". */
    label?: string;
    /** Copied label. Defaults to "Copied". */
    copiedLabel?: string;
    /** Text announced in the live region on success. Defaults to "Copied to clipboard". */
    announcement?: string;
    /**
     * Render icon-only (no visible text). An accessible name is then required:
     * pass `aria-label`, or the current label text is forwarded as the fallback
     * so the control is never left unnamed.
     */
    iconOnly?: boolean;
  };

function CheckIcon() {
  return <Check aria-hidden="true" className="size-[1.05em] shrink-0" strokeWidth={2.75} />;
}

function CopyIcon() {
  return <Copy aria-hidden="true" className="size-[1.05em] shrink-0" strokeWidth={2.5} />;
}

export function CopyButton({
  "aria-label": ariaLabel,
  announcement = "Copied to clipboard",
  className,
  copiedLabel = "Copied",
  disabled = false,
  iconOnly = false,
  label = "Copy",
  material,
  onClick,
  size,
  type,
  value,
  variant,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear a pending revert on unmount so a late timer never calls setState on an
  // unmounted component.
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);

    // Guard for SSR and browsers without the async Clipboard API — accessed only
    // here, inside the handler, never during render.
    const clipboard =
      typeof navigator !== "undefined" ? navigator.clipboard : undefined;
    if (!clipboard?.writeText) return;

    try {
      await clipboard.writeText(value);
    } catch {
      // Permission denied or an insecure context: leave the idle state intact
      // rather than claiming a copy that did not happen.
      return;
    }

    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), COPIED_DURATION_MS);
  }

  const state = disabled ? "disabled" : "idle";
  // When there is no visible text, guarantee an accessible name: an explicit
  // aria-label wins, otherwise the current label text is forwarded.
  const computedAriaLabel = iconOnly
    ? (ariaLabel ?? (copied ? copiedLabel : label))
    : ariaLabel;

  return (
    <>
      <button
        {...props}
        aria-label={computedAriaLabel}
        className={cn(
          copyButtonVariants({ material, variant, size }),
          iconOnly && "aspect-square px-0",
          className,
        )}
        data-copied={copied || undefined}
        data-material={material ?? DEFAULT_MATERIAL}
        data-state={state}
        disabled={disabled}
        onClick={handleClick}
        type={type ?? "button"}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {iconOnly ? null : (
          // Both labels share one grid cell so the button sizes to the WIDER of
          // "Copy"/"Copied" and never reflows its neighbours on the swap; the
          // inactive one is `invisible` (holds layout, hidden from AT and sight).
          <span className="grid">
            <span className={cn("[grid-area:1/1]", copied && "invisible")}>{label}</span>
            <span className={cn("[grid-area:1/1]", !copied && "invisible")}>{copiedLabel}</span>
          </span>
        )}
      </button>
      {/* Persistent polite live region, kept OUTSIDE the button so its text is
          never folded into the button's accessible name. It stays mounted at all
          times so the content change is what gets announced; sr-only hides it
          visually while leaving it in the accessibility tree. */}
      <span aria-live="polite" className="sr-only" role="status">
        {copied ? announcement : ""}
      </span>
    </>
  );
}

export { copyButtonVariants };
