"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Back To Top
 *
 * A floating disc that stays out of the way until the reader scrolls past a
 * threshold, then rises into the corner. A progress ring traced around its rim
 * fills as the page is read, and a click carries the reader smoothly back to the
 * top. Self-contained by design: all four material recipes live in this file,
 * every local custom property carries a literal fallback, and no class comes from
 * the site's global stylesheet.
 *
 *   <BackToTop material="clay" size="md" />                 // watches the window
 *   <BackToTop scrollContainerRef={panelRef} threshold={80} /> // watches an element
 *
 * The control is a real `<button aria-label="Back to top">`. It stays mounted so
 * its appearance can transition, but while hidden it is `inert` — out of the tab
 * order and the accessibility tree — and pointer-transparent, so it is never a
 * silent tab stop. The ring is `aria-hidden` decoration. A scroll listener,
 * registered inside a guarded effect, updates visibility and progress from its
 * own callback (never synchronously in the effect body). The smooth scroll is
 * dropped to an instant jump under `prefers-reduced-motion`.
 *
 * Local theming knobs (each read with a literal fallback):
 *
 *   --mq-body         disc surface
 *   --mq-body-grad    disc surface wash (`none` if flat)
 *   --mq-body-shadow  disc depth / float stack
 *   --mq-edge         the disc's side wall (clay / skeuo only)
 *   --mq-icon         the arrow glyph
 *   --mq-blur         backdrop blur radius (glass only)
 *   --mq-track        the unfilled progress ring
 *   --mq-progress     the filled progress arc
 *   --mq-ring         focus ring
 */

/** Palette per material. Declared on the button; the ring + glyph inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-body:#efe7db] [--mq-edge:#c9482f] [--mq-icon:#4a1d13]",
    "[--mq-body-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.06))]",
    // A chip that rides proud of the page: a bright bloom on top, a warm inner
    // shade below, its own hard side wall, then a wide float shadow. Warm brown
    // ink throughout — clay never casts black.
    "[--mq-body-shadow:inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_10px_22px_rgba(75,40,31,0.26)]",
    "[--mq-track:rgba(120,40,25,0.16)] [--mq-progress:#c9482f]",
    "[--mq-blur:0px] [--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-body:rgba(255,255,255,0.62)] [--mq-icon:#1e1e1b]",
    "[--mq-body-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo over a wide cool cast shadow. No side wall: glass has
    // no extrusion. The backdrop blur frosts whatever sits behind it.
    "[--mq-body-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_8px_24px_rgba(24,20,40,0.18)]",
    "[--mq-track:rgba(24,20,40,0.14)] [--mq-progress:#3f6fd6]",
    "[--mq-blur:12px] [--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-body:#cfcbc2] [--mq-edge:#a8a49b] [--mq-icon:#23231f]",
    // The surface IS the gradient: lit over warm greige, the moulded-plastic read.
    "[--mq-body-grad:linear-gradient(180deg,#fbfaf6,#e6e3da)]",
    // A hard 1px bevel of light on top, an achromatic machined shade below, a
    // shallower wall than clay's, then a float shadow.
    "[--mq-body-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(0,0,0,0.16),0_2px_0_var(--mq-edge,#a8a49b),0_10px_20px_rgba(38,36,31,0.30)]",
    // A warm amber hardware LED — the indicator light on a piece of gear.
    "[--mq-track:rgba(25,25,23,0.20)] [--mq-progress:#d68c28]",
    "[--mq-blur:0px] [--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  // Safe here because every surface it names is opaque and flips together with
  // the glyph on it.
  adaptive: [
    "[--mq-body:#ffffff] [--mq-icon:#1c1c19]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-body-grad:none]",
    // One float shadow, no finish: adaptive earns its presence from a contact
    // shadow, not from a bevel it never had.
    "[--mq-body-shadow:inset_0_0_0_rgba(20,20,18,0),0_8px_22px_rgba(20,20,18,0.18)]",
    "[--mq-track:rgba(23,24,23,0.12)] [--mq-progress:#171817]",
    "[--mq-blur:0px] [--mq-ring:#171817]",
    "dark:[--mq-body:#26262a] dark:[--mq-icon:#f1efe9]",
    "dark:[--mq-body-shadow:inset_0_0_0_rgba(0,0,0,0),0_8px_22px_rgba(0,0,0,0.55)]",
    "dark:[--mq-track:rgba(255,255,255,0.14)] dark:[--mq-progress:#f1efe9]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type BackToTopMaterial = keyof typeof MATERIAL_TOKENS;
type BackToTopVariant = "default";
type BackToTopSize = "sm" | "md" | "lg";

/** Ring geometry, in the SVG's own 100x100 units so it scales with any size. */
const RING_RADIUS = 45;
const RING_STROKE = 6;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Arrow glyph size per control size. */
const ARROW_SIZE: Record<BackToTopSize, string> = {
  sm: "size-[18px]",
  md: "size-[20px]",
  lg: "size-[24px]",
};

const buttonVariants = cva(
  [
    // Floats in the corner by default; the consumer can re-anchor via className
    // (tailwind-merge lets `absolute`/offsets/z override these cleanly).
    "group/btt fixed z-[var(--mq-btt-z,50)] bottom-[var(--mq-btt-offset,24px)] right-[var(--mq-btt-offset,24px)]",
    "inline-grid shrink-0 cursor-pointer appearance-none place-items-center rounded-full",
    "bg-[var(--mq-body,#efe7db)] [background-image:var(--mq-body-grad,none)]",
    "text-[color:var(--mq-icon,#4a1d13)] backdrop-blur-[var(--mq-blur,0px)]",
    "shadow-[var(--mq-body-shadow,inset_0_2px_2px_rgba(255,255,255,0.62),inset_0_-2px_3px_rgba(120,40,25,0.24),0_2px_0_var(--mq-edge,#c9482f),0_10px_22px_rgba(75,40,31,0.26))]",
    // A reserved transparent border so forced-colors can outline the disc.
    "border border-transparent",
    // Appearance rides on `translate` + `opacity`; the hover swell rides on
    // `scale`. Both `translate` and `scale` are STANDALONE properties in Tailwind
    // v4, so the transition names each one it animates — box-shadow is left out
    // because no state animates it (naming it would be a phantom transition).
    "transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
    // Hidden vs shown. While hidden it also leaves the pointer path; `inert` (set
    // on the element) is what removes it from focus and the accessibility tree.
    "data-[visible=false]:pointer-events-none data-[visible=false]:translate-y-[16px] data-[visible=false]:opacity-0",
    "data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100",
    // Disabled dims only while shown, so it never fights the hidden opacity — the
    // extra modifier gives this rule the higher specificity that lets it win.
    "disabled:data-[visible=true]:opacity-45 disabled:cursor-not-allowed",
    // Hover swells the disc, press taps it back — pure `scale`, so it never
    // collides with the appearance `translate`.
    "hover:data-[visible=true]:scale-[1.06] active:data-[visible=true]:scale-[0.96]",
    // Focus ring: real :focus-visible plus a parallel data-[focus] the docs can
    // force. The width/offset/colour fully replace the UA outline, so it is never
    // removed with outline-none.
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Fills, gradients, shadows and blur are discarded once the OS paints high
    // contrast, so keep a real border for the disc's bounds and clear the rest.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none] forced-colors:shadow-none forced-colors:backdrop-blur-none",
  ].join(" "),
  {
    variants: {
      // One treatment today; kept a real axis so the registry, the docs switcher
      // and a future treatment all have a seam.
      variant: { default: "" },
      size: {
        // Every size clears the 44px minimum touch target.
        sm: "size-[44px] [--mq-btt-offset:16px]",
        md: "size-[52px] [--mq-btt-offset:24px]",
        lg: "size-[60px] [--mq-btt-offset:28px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export type BackToTopProps = Omit<
  React.ComponentPropsWithRef<"button">,
  "children" | "type"
> & {
  material?: BackToTopMaterial;
  variant?: BackToTopVariant;
  size?: BackToTopSize;
  /** Pixels scrolled before the disc appears. */
  threshold?: number;
  /** Accessible name for the button. */
  label?: string;
  /**
   * Element whose scroll drives visibility + progress. Defaults to the window.
   * Pass a ref when the scrollable region is a container rather than the page.
   */
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
};

export function BackToTop({
  "aria-label": ariaLabel,
  className,
  disabled = false,
  label = "Back to top",
  material = "clay",
  onClick,
  ref,
  scrollContainerRef,
  size = "md",
  threshold = 240,
  variant = "default",
  ...props
}: BackToTopProps) {
  const [visible, setVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // The scroll source is an external system, so it belongs in an effect. The
  // state it drives is set from the scroll / resize / rAF callbacks it subscribes
  // to — never synchronously in the effect body — so there is no set-state-in-
  // effect. The rAF gives a correct first reading (a page already scrolled on
  // load shows the disc) without a synchronous setState here.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const el = scrollContainerRef?.current ?? null;
    const target: HTMLElement | Window = el ?? window;

    const onScroll = () => {
      let top: number;
      let max: number;
      if (el) {
        top = el.scrollTop;
        max = el.scrollHeight - el.clientHeight;
      } else {
        const doc = document.documentElement;
        top = window.scrollY;
        max = doc.scrollHeight - window.innerHeight;
      }
      const ratio = max > 0 ? Math.min(1, Math.max(0, top / max)) : 0;
      setProgress(ratio);
      setVisible(top > threshold);
    };

    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const raf = window.requestAnimationFrame(onScroll);
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, [scrollContainerRef, threshold]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    // Respect reduced motion: fall back to an instant jump. matchMedia is only
    // read here, in the handler, and is guarded for SSR safety.
    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
    const el = scrollContainerRef?.current;
    if (el) el.scrollTo({ top: 0, behavior });
    else if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior });
  }

  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <button
      {...props}
      aria-label={ariaLabel ?? label}
      className={cn(MATERIAL_TOKENS[material], buttonVariants({ size, variant }), className)}
      data-material={material}
      data-visible={visible ? "true" : "false"}
      disabled={disabled}
      // Mounted while hidden so the appearance can transition, but inert so it is
      // never a focus stop nor announced until the reader has scrolled.
      inert={!visible || undefined}
      onClick={handleClick}
      ref={ref}
      type="button"
    >
      {/*
        The progress ring is pure decoration — the button's accessible name says
        everything — so it is aria-hidden and never enters the accessibility tree.
        Rotated so 0% sits at 12 o'clock and the arc fills clockwise.
      */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -rotate-90"
        viewBox="0 0 100 100"
      >
        <circle
          className="stroke-[var(--mq-track,rgba(120,40,25,0.16))] forced-colors:stroke-[GrayText]"
          cx="50"
          cy="50"
          fill="none"
          r={RING_RADIUS}
          strokeWidth={RING_STROKE}
        />
        <circle
          className="stroke-[var(--mq-progress,#c9482f)] forced-colors:stroke-[Highlight]"
          cx="50"
          cy="50"
          fill="none"
          r={RING_RADIUS}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth={RING_STROKE}
        />
      </svg>
      <ArrowUp
        aria-hidden="true"
        className={cn("relative shrink-0", ARROW_SIZE[size], "forced-colors:text-[CanvasText]")}
        strokeWidth={2.5}
      />
    </button>
  );
}

export type BackToTopVariantProps = VariantProps<typeof buttonVariants>;

export { buttonVariants };
