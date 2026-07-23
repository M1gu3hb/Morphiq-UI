"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Loading Overlay
 *
 * A scrim that covers ONE SECTION of a page while it loads — never a global
 * portal. It renders its children inside a `relative isolate` wrapper and lays
 * a translucent veil, a hand-rolled spinner and an optional message on top of
 * them, so the busy state stays scoped to the region that is actually busy.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, no `:root` variable and no
 * global stylesheet class is read, and the keyframes ship with the component
 * through React 19's hoisted `<style href precedence>` (deduplicated by `href`,
 * so a page with ten overlays still emits one rule).
 *
 * Accessibility contract — the part that makes this component worth copying:
 *
 * - While busy the COVERED CONTENT wrapper carries `aria-busy="true"` and the
 *   `inert` attribute. `inert` is what genuinely removes the covered subtree
 *   from the tab order, from the accessibility tree and from the pointer path,
 *   so a keyboard user cannot land on a control they cannot see behind the
 *   scrim. Visually hiding content without inerting it is the classic version
 *   of this bug: the veil looks right and focus disappears behind it.
 * - The overlay itself is a `role="status"` live region with an explicit
 *   `aria-live="polite"` and `aria-atomic="true"`, and it contains REAL TEXT —
 *   either the visible `message` (plus optional `detail`) or a visually hidden
 *   fallback. A live region is announced by its contents, not by its name, so
 *   `aria-label` on a region whose only child is `aria-hidden` would pass a
 *   static audit and then say nothing at all. Polite, not assertive: waiting is
 *   not an error, and it must not interrupt whatever is being read.
 * - The busy state is NEVER colour alone. It is carried by the message text (or
 *   the sr-only fallback), by `aria-busy`, by the spinner's shape — a gapped
 *   ring, not a full circle — and by the panel physically occupying the region.
 *   A reader who cannot separate the hues gets the identical information.
 * - When `loading` is false the overlay is unmounted and `inert` / `aria-busy`
 *   are removed entirely: nothing of the busy state is left behind.
 * - `prefers-reduced-motion` drops the veil fade, the panel rise and the
 *   rotation. The end state of every keyframe IS the resting visual state, so
 *   a reduced-motion reader still sees the fully painted veil, the fully
 *   painted panel and a still two-tone ring — the busy state survives, only the
 *   movement goes. A slow substitute pulse was deliberately not used: the
 *   preference asks for motion to stop, and the text is what carries meaning.
 * - `forced-colors` clears the backdrop filter and every background image,
 *   repaints the veil to `Canvas` (still opaque enough to read as a cover), the
 *   panel border to `CanvasText`, the spinner track to `GrayText` and its arc to
 *   `CanvasText`, and all glyphs to `CanvasText`.
 *
 * SSR/SSG safety: no timers, no `Date.now()`, no `window`, no state at all. The
 * component is fully controlled by the `loading` prop, so the server and the
 * client always render the same tree.
 *
 * Local theming knobs (each used with a literal fallback):
 *
 *   --mq-veil          scrim colour
 *   --mq-veil-grad     scrim wash (radial/linear light over the covered region)
 *   --mq-veil-blur     scrim backdrop blur radius
 *   --mq-veil-sat      scrim backdrop saturation
 *   --mq-panel         panel surface colour
 *   --mq-panel-grad    panel light (skeuo's gradient, clay's top bloom)
 *   --mq-panel-lit     top gradient stop for skeuo
 *   --mq-edge          extruded lower edge of the panel
 *   --mq-panel-shadow  panel depth
 *   --mq-brd           panel border colour
 *   --mq-text          message colour
 *   --mq-muted         detail colour
 *   --mq-track         spinner track
 *   --mq-arc           spinner arc
 *   --mq-ring          focus ring colour
 *   --mq-gap / --mq-pad-x / --mq-pad-y / --mq-radius / --mq-inset
 *   --mq-spinner / --mq-stroke / --mq-font / --mq-detail
 */

/**
 * sr-only, inlined. The component owns no global class, so copying this file
 * plus `src/lib/cn.ts` reproduces the whole behaviour. Clip-rect rather than
 * `display:none`, which would take the text out of the accessibility tree and
 * silence the live region.
 */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

/**
 * Focus ring. The overlay owns no focusable control of its own — the entire
 * point is that focus cannot reach the covered content — but a caller who moves
 * focus to the busy region (`tabIndex={-1}`) must still get a visible ring, and
 * the docs preview forces the same look through `data-focus="true"` rather than
 * synthesising a keyboard event.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] " +
  "forced-colors:data-[focus=true]:outline-[Highlight]";

/**
 * Keyframes travel with the component.
 *
 * Every `to` block is the RESTING visual state — full opacity, no offset, unit
 * scale, zero rotation — so `motion-reduce:animate-none` leaves the overlay
 * fully rendered instead of stranded mid-entrance.
 *
 * `translate`, `scale` and `rotate` are the standalone properties Tailwind v4
 * writes its utilities to; nothing in this file sets `transform`, so there is
 * nothing for these to fight with.
 */
const OVERLAY_KEYFRAMES = `@keyframes mq-loading-overlay-veil{from{opacity:0}to{opacity:1}}@keyframes mq-loading-overlay-panel{from{opacity:0;translate:0 12px;scale:0.94}to{opacity:1;translate:0 0;scale:1}}@keyframes mq-loading-overlay-spin{from{rotate:0deg}to{rotate:360deg}}`;

function OverlayKeyframes() {
  return (
    <style href="mq-loading-overlay" precedence="medium">
      {OVERLAY_KEYFRAMES}
    </style>
  );
}

/**
 * Per-material token blocks, declared once on the root and inherited by the
 * veil, the panel and the spinner — custom properties inherit, so there is no
 * React context and no prop drilling.
 *
 * Contrast contract: `--mq-text` and `--mq-muted` clear 4.5:1 against their own
 * panel on every material (for glass, over a white AND a black backdrop, since
 * glass must never borrow legibility from whatever sits behind it), and the
 * spinner arc clears 3:1 against its own track — WCAG 1.4.11 applies, because
 * the ring is the only graphic saying the region is still alive.
 */
const MATERIAL_TOKENS = {
  // Inflated and warm. The veil is a milky terracotta wash; the panel keeps
  // clay's broad top bloom, earthen inner shade, short extruded edge and
  // diffuse brown contact shadow. Clay never casts black.
  clay: [
    "[--mq-veil:rgba(246,231,221,0.84)]",
    "[--mq-veil-grad:radial-gradient(120%_88%_at_50%_38%,rgba(255,255,255,0.55),rgba(255,255,255,0)_72%)]",
    "[--mq-veil-blur:3px] [--mq-veil-sat:118%]",
    "[--mq-panel:#f6e7dd] [--mq-panel-lit:#fff3ea]",
    "[--mq-panel-grad:linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0)_62%)]",
    "[--mq-edge:#dcc4b2] [--mq-brd:rgba(120,80,55,0.18)]",
    "[--mq-text:#33261e] [--mq-muted:#6a5346]",
    "[--mq-track:#f0dcd0] [--mq-arc:#9f2f23] [--mq-ring:#171817]",
    "[--mq-panel-shadow:inset_0_3px_4px_rgba(255,255,255,0.78),inset_0_-5px_8px_rgba(140,90,60,0.13),0_5px_0_var(--mq-edge,#dcc4b2),0_16px_28px_rgba(90,60,45,0.18)]",
  ].join(" "),
  // Translucent throughout: the veil frosts the covered region rather than
  // hiding it, and the panel is a brighter pane floating on that frost. The
  // arc is deep teal so it holds over anything the frost lets through.
  glass: [
    "[--mq-veil:rgba(255,255,255,0.42)]",
    "[--mq-veil-grad:radial-gradient(120%_90%_at_50%_34%,rgba(255,255,255,0.44),rgba(255,255,255,0)_74%)]",
    "[--mq-veil-blur:12px] [--mq-veil-sat:165%]",
    "[--mq-panel:rgba(255,255,255,0.78)] [--mq-panel-lit:rgba(255,255,255,0.92)]",
    "[--mq-panel-grad:linear-gradient(180deg,rgba(255,255,255,0.46),rgba(255,255,255,0)_58%)]",
    "[--mq-edge:transparent] [--mq-brd:rgba(255,255,255,0.82)]",
    // #36362f rather than a lighter grey: at 0.78 opacity the panel composites
    // to #c7c7c7 over black, where a lighter muted measured under 4.5:1.
    "[--mq-text:#1e1e1b] [--mq-muted:#36362f]",
    "[--mq-track:rgba(11,63,76,0.24)] [--mq-arc:#0b3f4c] [--mq-ring:#171817]",
    "[--mq-panel-shadow:inset_0_1px_0_rgba(255,255,255,0.92),0_18px_40px_rgba(24,20,40,0.22)]",
  ].join(" "),
  // Machined: warm greige body, hard top bevel, achromatic inner shade, a short
  // side wall and a tight contact shadow. The veil is nearly opaque, the way a
  // modal sheet over a physical panel would be.
  skeuo: [
    "[--mq-veil:rgba(230,227,218,0.88)]",
    "[--mq-veil-grad:linear-gradient(180deg,rgba(255,255,255,0.46),rgba(0,0,0,0.07))]",
    "[--mq-veil-blur:2px] [--mq-veil-sat:104%]",
    "[--mq-panel:#e6e3da] [--mq-panel-lit:#f7f5ef]",
    "[--mq-panel-grad:linear-gradient(180deg,var(--mq-panel-lit,#f7f5ef),var(--mq-panel,#e6e3da))]",
    "[--mq-edge:#a8a49b] [--mq-brd:rgba(25,25,23,0.30)]",
    "[--mq-text:#23231f] [--mq-muted:#4a4943]",
    "[--mq-track:#d6d0c4] [--mq-arc:#3f4641] [--mq-ring:#171817]",
    "[--mq-panel-shadow:inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-3px_5px_rgba(0,0,0,0.16),0_5px_0_var(--mq-edge,#a8a49b),0_14px_24px_rgba(38,36,31,0.26)]",
  ].join(" "),
  // Polymorphic: almost no ornament. It adapts instead — the whole palette,
  // including the veil, flips with the colour scheme so a dark page is covered
  // by a dark scrim rather than a white flash.
  adaptive: [
    "[--mq-veil:rgba(255,255,255,0.80)] [--mq-veil-grad:none]",
    "[--mq-veil-blur:4px] [--mq-veil-sat:110%]",
    "[--mq-panel:#ffffff] [--mq-panel-lit:#ffffff] [--mq-panel-grad:none]",
    "[--mq-edge:transparent] [--mq-brd:rgba(23,24,23,0.14)]",
    "[--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-track:#d8dad5] [--mq-arc:#171817] [--mq-ring:#171817]",
    "[--mq-panel-shadow:0_1px_2px_rgba(20,20,18,0.10),0_16px_34px_rgba(20,20,18,0.12)]",
    "dark:[--mq-veil:rgba(20,21,20,0.82)]",
    "dark:[--mq-panel:#232327] dark:[--mq-panel-lit:#232327] dark:[--mq-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-track:#42443f] dark:[--mq-arc:#f5f3ee] dark:[--mq-ring:#f1efe9]",
    "dark:[--mq-panel-shadow:0_1px_2px_rgba(0,0,0,0.55),0_16px_34px_rgba(0,0,0,0.55)]",
  ].join(" "),
} as const;

type LoadingOverlayMaterial = keyof typeof MATERIAL_TOKENS;
type LoadingOverlaySize = "sm" | "md" | "lg";

const rootVariants = cva(
  [
    // `relative` positions the scrim over the children and `isolate` creates the
    // stacking context that keeps it there, so the overlay never escapes into
    // the page the way a portal would.
    "relative isolate",
    FOCUS_RING,
  ].join(" "),
  {
    variants: {
      material: MATERIAL_TOKENS,
      // A single composition: an overlay has one shape. `default` exists so the
      // registry can list a variant and the preview can coerce an incoming one.
      variant: { default: "" },
      size: {
        sm: [
          "[--mq-gap:9px] [--mq-pad-x:13px] [--mq-pad-y:10px] [--mq-radius:14px] [--mq-inset:10px]",
          "[--mq-spinner:18px] [--mq-stroke:3.4] [--mq-font:11px] [--mq-detail:10px]",
        ].join(" "),
        md: [
          "[--mq-gap:12px] [--mq-pad-x:17px] [--mq-pad-y:13px] [--mq-radius:18px] [--mq-inset:14px]",
          "[--mq-spinner:24px] [--mq-stroke:3.2] [--mq-font:12px] [--mq-detail:11px]",
        ].join(" "),
        lg: [
          "[--mq-gap:14px] [--mq-pad-x:22px] [--mq-pad-y:17px] [--mq-radius:22px] [--mq-inset:18px]",
          "[--mq-spinner:32px] [--mq-stroke:3] [--mq-font:13px] [--mq-detail:12px]",
        ].join(" "),
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

const veilVariants = cva(
  [
    "absolute inset-0 z-10 grid place-items-center overflow-hidden rounded-[inherit]",
    "p-[var(--mq-inset,14px)]",
    // Colour and wash are separate declarations: routed through one `bg-*`
    // utility, `tailwind-merge` reads them as one conflicting group and drops
    // the first silently.
    "[background-color:var(--mq-veil,rgba(246,231,221,0.84))]",
    "[background-image:var(--mq-veil-grad,none)]",
    "[backdrop-filter:blur(var(--mq-veil-blur,3px))_saturate(var(--mq-veil-sat,118%))]",
    "[-webkit-backdrop-filter:blur(var(--mq-veil-blur,3px))_saturate(var(--mq-veil-sat,118%))]",
    // The veil arrives rather than appearing. Keyframes, not a transition: the
    // scrim is mounted in its final state and a transition has nothing to run
    // from on the frame an element appears.
    "animate-[mq-loading-overlay-veil_220ms_ease-out]",
    // Decoration only — the wait is already announced by the live region below
    // — so reduced motion drops the fade and the veil is simply present.
    "motion-reduce:animate-none",
    // Forced colours discard translucency and shadows but NOT background
    // images or backdrop filters, so both are cleared by hand; `Canvas` keeps
    // the veil opaque enough to still read as a cover.
    "forced-colors:bg-[Canvas] forced-colors:[background-image:none]",
    "forced-colors:[backdrop-filter:none] forced-colors:[-webkit-backdrop-filter:none]",
  ].join(" "),
);

const panelVariants = cva(
  [
    "relative inline-flex max-w-full items-center border text-left",
    "gap-[var(--mq-gap,12px)] rounded-[var(--mq-radius,18px)]",
    "px-[var(--mq-pad-x,17px)] py-[var(--mq-pad-y,13px)]",
    "border-[var(--mq-brd,rgba(120,80,55,0.18))]",
    "[background-color:var(--mq-panel,#f6e7dd)]",
    "[background-image:var(--mq-panel-grad,none)]",
    "[box-shadow:var(--mq-panel-shadow,0_16px_28px_rgba(90,60,45,0.18))]",
    "text-[color:var(--mq-text,#33261e)]",
    // A beat behind the veil, so the eye lands on the message last. `both`
    // holds the entrance's first frame through the delay instead of flashing
    // the panel at full opacity and then animating it.
    "animate-[mq-loading-overlay-panel_320ms_cubic-bezier(0.22,1.25,0.36,1)_60ms_both]",
    "motion-reduce:animate-none",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
    "forced-colors:[background-image:none] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: "",
        // Only glass refracts what is behind the panel; the others are opaque
        // surfaces and a blur there would cost a compositor layer for nothing.
        glass: "backdrop-blur-[16px] backdrop-saturate-[170%] forced-colors:backdrop-filter-none",
        skeuo: "",
        adaptive: "",
      },
    },
    defaultVariants: { material: "clay" },
  },
);

/**
 * Hand-rolled spinner: two concentric SVG circles, the second dashed to 28% of
 * its own path length so it reads as an arc travelling a track. No icon
 * package, no mask, no gradient — which is why this component declares no
 * `lucide-react` dependency.
 *
 * `pathLength={100}` normalises the circumference, so the dash pair is a plain
 * percentage rather than a number that has to be recomputed whenever the radius
 * changes. The rotation uses the standalone `rotate` property (not
 * `transform: rotate(...)`), so a caller's own transform cannot fight it.
 *
 * Decorative and `aria-hidden`: the message text beside it is what the live
 * region announces. The gapped ring is nonetheless a real SHAPE difference from
 * a plain circle, which is what keeps the busy state off colour alone once the
 * rotation stops under reduced motion.
 */
function OverlaySpinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("block size-[var(--mq-spinner,24px)] shrink-0", className)}
      focusable="false"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={cn(
          "[stroke:var(--mq-track,#f0dcd0)] [stroke-width:var(--mq-stroke,3.2)]",
          // GrayText for the track, CanvasText for the arc: two distinct system
          // colours, so the two tones stay separable when hues are discarded.
          "forced-colors:[stroke:GrayText]",
        )}
        cx={16}
        cy={16}
        fill="none"
        r={13}
      />
      <g
        className={cn(
          "[rotate:0deg]",
          "animate-[mq-loading-overlay-spin_900ms_linear_infinite]",
          // Reduced motion stops the rotation outright and leaves a still,
          // gapped two-tone ring. Deliberately not swapped for a slow pulse:
          // the preference asks for movement to stop, and the busy state is
          // carried by the message text and `aria-busy`, which never move.
          "motion-reduce:animate-none",
        )}
        style={{ transformBox: "view-box", transformOrigin: "16px 16px" }}
      >
        <circle
          className={cn(
            "[stroke:var(--mq-arc,#9f2f23)] [stroke-width:var(--mq-stroke,3.2)]",
            "forced-colors:[stroke:CanvasText]",
          )}
          cx={16}
          cy={16}
          fill="none"
          pathLength={100}
          r={13}
          strokeDasharray="28 72"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/**
 * Whether a node would actually put text on the page.
 *
 * `message != null` is not good enough: a live region is announced by its
 * contents, so a message that renders to nothing — `""` from a missed i18n
 * lookup, or the `false` a `cond && text` expression collapses to — would take
 * the "has a message" path and produce a region with no text at all. Silent to
 * a screen reader, correct on screen, and passing a static audit.
 */
function rendersText(node: React.ReactNode): boolean {
  if (node == null || typeof node === "boolean") return false;
  if (typeof node === "string") return node.trim() !== "";
  return true;
}

export type LoadingOverlayProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-busy" | "aria-live" | "children" | "role"
> &
  Omit<VariantProps<typeof rootVariants>, "material" | "size" | "variant"> & {
    /** Whether the region is busy. Drives the scrim, `aria-busy` and `inert`. */
    loading?: boolean;
    /** The content being covered. Always rendered; inerted while loading. */
    children: React.ReactNode;
    /** Visible message inside the live region, e.g. "Syncing 3 of 12 files". */
    message?: React.ReactNode;
    /** Optional muted second line under the message. */
    detail?: React.ReactNode;
    /**
     * Announced when no visible `message` renders. A visually hidden text node
     * inside the live region — not `aria-label`, which a live region does not
     * read. Defaults to "Loading".
     */
    srMessage?: string;
    material?: LoadingOverlayMaterial;
    variant?: "default";
    size?: LoadingOverlaySize;
    /** Class applied to the wrapper around the covered children. */
    contentClassName?: string;
    /** Class applied to the scrim. */
    veilClassName?: string;
    /** Class applied to the panel holding the spinner and message. */
    panelClassName?: string;
    /** Class applied to the spinner SVG. */
    spinnerClassName?: string;
  };

export function LoadingOverlay({
  children,
  className,
  contentClassName,
  detail,
  loading = false,
  material = "clay",
  message,
  panelClassName,
  size = "md",
  spinnerClassName,
  srMessage = "Loading",
  variant = "default",
  veilClassName,
  ...props
}: LoadingOverlayProps) {
  const hasMessage = rendersText(message);
  const hasDetail = rendersText(detail);
  // A default parameter only fills in for `undefined`, so an explicit `""`
  // would otherwise reach the DOM as an empty announcement.
  const announced = srMessage.trim() === "" ? "Loading" : srMessage;

  return (
    <>
      <OverlayKeyframes />
      <div
        {...props}
        className={cn(rootVariants({ material, size, variant }), className)}
        data-loading={loading ? "true" : undefined}
        data-material={material}
        data-size={size}
      >
        {/*
          The covered content. `inert` is the load-bearing attribute: it removes
          this subtree from the tab order, the accessibility tree and the
          pointer path, so nobody can reach a control hidden behind the scrim.
          `aria-busy` states WHY it is unreachable. Both disappear completely
          when `loading` is false — `false || undefined` omits the attribute
          rather than serialising `inert="false"`, which the HTML boolean
          attribute would still treat as present.

          `relative z-0` gives the children their own stacking context beneath
          the scrim's `z-10`, so a positioned descendant with its own z-index
          cannot paint through the veil.
        */}
        <div
          aria-busy={loading || undefined}
          className={cn("relative z-0", contentClassName)}
          data-loading-overlay-content=""
          inert={loading || undefined}
        >
          {children}
        </div>

        {loading ? (
          <div
            aria-atomic="true"
            aria-live="polite"
            className={cn(veilVariants(), veilClassName)}
            data-loading-overlay-veil=""
            // Polite, never assertive: a wait is not an error and must not
            // interrupt whatever is currently being read. `role="status"`
            // already implies both live attributes, but they are restated so a
            // reader of this file (and any older AT mapping) sees the policy.
            role="status"
          >
            <div
              className={cn(panelVariants({ material }), panelClassName)}
              data-loading-overlay-panel=""
            >
              <OverlaySpinner className={spinnerClassName} />
              {hasMessage || hasDetail ? (
                <span className="flex min-w-0 flex-col gap-[3px]">
                  {hasMessage ? (
                    <span
                      className={cn(
                        "text-[color:var(--mq-text,#33261e)] text-[length:var(--mq-font,12px)]",
                        "leading-[1.35] font-bold tracking-[-0.01em]",
                        "forced-colors:text-[CanvasText]",
                      )}
                      data-loading-overlay-message=""
                    >
                      {message}
                    </span>
                  ) : (
                    // The panel shows only a detail line, so the region still
                    // needs a primary announcement of its own.
                    <span className={SR_ONLY}>{announced}</span>
                  )}
                  {hasDetail ? (
                    <span
                      className={cn(
                        "text-[color:var(--mq-muted,#6a5346)] text-[length:var(--mq-detail,11px)]",
                        "leading-[1.45] font-medium",
                        "forced-colors:text-[CanvasText]",
                      )}
                      data-loading-overlay-detail=""
                    >
                      {detail}
                    </span>
                  ) : null}
                </span>
              ) : (
                // Real text, not `aria-label`: the region is announced by what
                // it contains. Clip-rect keeps it out of the visual layout
                // while leaving it in the accessibility tree.
                <span className={SR_ONLY}>{announced}</span>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export { panelVariants, rootVariants, veilVariants };
