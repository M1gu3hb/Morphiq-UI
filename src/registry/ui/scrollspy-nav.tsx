"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Scrollspy Nav
 *
 * An in-page anchor navigation — a "table of contents" whose current item
 * lights up as the matching section scrolls into view. An IntersectionObserver
 * watches the sections named by `items` and, from its callback, promotes the
 * one occupying the top reading band to `aria-current="true"`. A slim rail runs
 * down the left edge and a lit thumb slides to the active row, so the current
 * section is marked by a moving indicator AND a heavier weight — never by colour
 * alone.
 *
 * This is the material-agnostic member of the navigation family: it ships one
 * restrained recipe (`adaptive`) that follows the colour scheme, so the same
 * component reads correctly on any page. All theming lives in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * The rail thumb is measured, not guessed. The active row exposes
 * `data-active="true"`; a `<span aria-hidden>` is positioned over it from its
 * live geometry (`offsetTop` / `offsetHeight`) and slid with inline `translate`
 * + `height`, transitioning exactly those two properties. It arms only after its
 * first measurement, so it never slides in from the top on first paint.
 *
 * SSR/SSG-safe: the observer, `matchMedia` and every DOM read live inside a
 * client effect or an event handler, each guarded. With JavaScript off the
 * anchors still jump to their sections natively and the initial item stays
 * marked by weight and `aria-current`.
 *
 * API:
 *
 *   <ScrollspyNav
 *     items={[{ id: "intro", label: "Introduction" }, …]}
 *     defaultActive="intro"        // initial highlight
 *     root={scrollContainer}       // observer root; defaults to the viewport
 *     size="md"
 *   />
 *
 * Each `item.id` is both the anchor target (`href="#id"`) and the id of the
 * element observed on the page; missing targets are skipped, so a partial map
 * never throws.
 *
 * Local theming knobs (each use includes a literal fallback):
 *
 *   --mq-idle         inactive item label
 *   --mq-hover-bg     hover wash on an item
 *   --mq-active-text  active item label
 *   --mq-rail         the rail track
 *   --mq-thumb        the sliding rail thumb
 *   --mq-thumb-glow   the thumb's soft halo
 *   --mq-ring         focus ring
 */

/**
 * Palette per material. Agnostic component: one recipe, `adaptive`, which flips
 * with the colour scheme. Kept as an object (read at runtime below) so the
 * component matches the family shape and stays trivially extensible.
 */
const MATERIAL_TOKENS = {
  adaptive: [
    "[--mq-idle:#55554e] [--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-active-text:#1c1c19]",
    "[--mq-rail:rgba(23,24,23,0.14)]",
    // A crisp ink accent kept honest to adaptive's discipline rather than a
    // saturated neon, with a soft same-tone halo so the thumb reads as lit.
    "[--mq-thumb:#1c1c19] [--mq-thumb-glow:0_0_8px_1px_rgba(28,28,25,0.20)]",
    "[--mq-ring:#171817]",
    "dark:[--mq-idle:#b9b7b0] dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-active-text:#f1efe9]",
    "dark:[--mq-rail:rgba(255,255,255,0.16)]",
    // Against a dark page the light filament genuinely glows.
    "dark:[--mq-thumb:#f1efe9] dark:[--mq-thumb-glow:0_0_9px_2px_rgba(241,239,233,0.30)]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type ScrollspyNavMaterial = keyof typeof MATERIAL_TOKENS;
type ScrollspyNavVariant = "default";
type ScrollspyNavSize = "sm" | "md" | "lg";

const rootVariants = cva(
  [
    // The landmark is a plain column: an optional eyebrow over the rail-and-list
    // block. No container box — adaptive earns its presence from the rail, not a
    // finish it never had.
    "flex w-full max-w-full flex-col gap-[10px]",
  ].join(" "),
  {
    variants: {
      // One treatment today: the sliding rail is the identity. It stays a real
      // axis so the registry, the docs switcher and a future treatment all have
      // a seam.
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-rail-w:2px] [--mq-list-pl:14px] [--mq-eyebrow-text:10px]",
        md: "[--mq-rail-w:3px] [--mq-list-pl:16px] [--mq-eyebrow-text:11px]",
        lg: "[--mq-rail-w:3px] [--mq-list-pl:18px] [--mq-eyebrow-text:11px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const itemVariants = cva(
  [
    // `block w-full` so the whole row is the target; the label is the sole
    // accessible name.
    "relative block w-full no-underline tracking-[-0.01em]",
    "rounded-[var(--mq-item-radius,8px)] font-medium text-[color:var(--mq-idle,#55554e)]",
    // A left border is always reserved, transparent by default. It mirrors the
    // rail and is what forced-colors uses to mark the active item once fills are
    // discarded — so the marking never changes the box model or shifts the row,
    // and it is only ever coloured under forced-colors.
    "border-0 border-l-2 border-l-transparent",
    // Exactly the properties that change across states: the hover wash / lit
    // label (background-color, color). Weight changes instantly and is not
    // animated.
    "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(23,24,23,0.05))] hover:text-[color:var(--mq-active-text,#1c1c19)]",
    // Active label: heavier weight AND its own colour, so the state is never
    // signalled by colour alone.
    "data-[active=true]:font-semibold data-[active=true]:text-[color:var(--mq-active-text,#1c1c19)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-2 data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Fills vanish in forced-colors, so the active item is marked with a system
    // colour on the left border already reserved in the box model.
    "forced-colors:data-[active=true]:border-l-[CanvasText]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "rounded-[7px] px-[10px] py-[6px] text-[length:12px]",
        md: "rounded-[8px] px-[12px] py-[8px] text-[length:13px]",
        lg: "rounded-[10px] px-[14px] py-[11px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** Small heading above the list. Reuses the idle token so its contrast is safe. */
const eyebrowClass = [
  "m-0 px-[var(--mq-list-pl,16px)]",
  "text-[length:var(--mq-eyebrow-text,11px)] font-semibold uppercase tracking-[0.08em]",
  "text-[color:var(--mq-idle,#55554e)]",
].join(" ");

/** The rail track: a faint full-height gutter the thumb rides in. */
const trackClass = [
  "pointer-events-none absolute bottom-0 left-0 top-0",
  "w-[var(--mq-rail-w,3px)] rounded-full bg-[var(--mq-rail,rgba(23,24,23,0.14))]",
  // Purely decorative; forced-colors neutralises fills, and the active item's
  // reserved border marks the state instead.
  "forced-colors:hidden",
].join(" ");

/** The lit thumb that slides to the active row. */
const thumbClass = [
  "pointer-events-none absolute left-0 top-0",
  "w-[var(--mq-rail-w,3px)] rounded-full",
  "bg-[var(--mq-thumb,#1c1c19)]",
  "shadow-[var(--mq-thumb-glow,0_0_8px_1px_rgba(28,28,25,0.20))]",
  // Motion is OFF until armed, and the attribute that arms it is added a commit
  // after the first measurement, so the opening paint can never slide in from
  // the top. It names the standalone `translate` and `height` properties —
  // Tailwind v4 writes translate to the standalone property, and an arbitrary
  // transition must name it exactly.
  "transition-none",
  "data-[armed=true]:transition-[translate,height]",
  "data-[armed=true]:duration-[320ms]",
  "data-[armed=true]:ease-[cubic-bezier(0.22,1,0.36,1)]",
  // The slide is decoration — the active row is already marked by weight and
  // aria-current — so reduced motion drops the travel and the thumb appears
  // where it belongs.
  "motion-reduce:data-[armed=true]:transition-none",
  "forced-colors:hidden",
].join(" ");

type RailRect = { top: number; height: number };

/**
 * Geometry of whichever row is currently active.
 *
 * The active row exposes `data-active="true"`, so the attribute is what gets
 * watched. `ResizeObserver` covers the two ways a correct measurement goes
 * stale without any attribute changing — the list reflowing, and a webfont
 * landing after first paint and re-measuring every label. `itemsKey`
 * re-attaches the observers when the set of items itself changes.
 */
function useActiveRailRect(
  hostRef: React.RefObject<HTMLElement | null>,
  itemsKey: string,
) {
  const [rect, setRect] = React.useState<RailRect | null>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const measure = () => {
      const active = host.querySelector<HTMLElement>('[data-active="true"]');
      if (!active) {
        setRect(null);
        return;
      }
      const next = { top: active.offsetTop, height: active.offsetHeight };
      // Bail on an unchanged measurement: both observers fire on things that
      // often do not move the row, and re-setting state each time would churn.
      setRect((prev) =>
        prev && prev.top === next.top && prev.height === next.height ? prev : next,
      );
    };

    measure();

    const mutation = new MutationObserver(measure);
    mutation.observe(host, {
      attributes: true,
      attributeFilter: ["data-active"],
      subtree: true,
    });

    const resize = new ResizeObserver(measure);
    resize.observe(host);
    for (const item of host.querySelectorAll("[data-scrollspy-item]")) resize.observe(item);

    return () => {
      mutation.disconnect();
      resize.disconnect();
    };
  }, [hostRef, itemsKey]);

  return rect;
}

/**
 * Drives the active id from what is on screen.
 *
 * The IntersectionObserver is created only on the client and only when the ids
 * resolve to real elements; it is disconnected on cleanup. `setActive` is
 * called from the observer CALLBACK — an asynchronous subscription, not the
 * effect body — which is exactly the shape the React 19 set-state-in-effect
 * rule permits.
 */
function useScrollspy(
  itemsKey: string,
  setActive: React.Dispatch<React.SetStateAction<string | undefined>>,
  root: Element | null | undefined,
  rootMargin: string | undefined,
) {
  React.useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

    const ids = itemsKey ? itemsKey.split("|") : [];
    if (ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    if (elements.length === 0) return;

    // Last known top of each section still inside the reading band.
    const tops = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) tops.set(entry.target.id, entry.boundingClientRect.top);
          else tops.delete(entry.target.id);
        }
        // The active section is the topmost one currently in the band. When none
        // is in the band (scrolled past the ends) the current item is kept.
        let bestId: string | null = null;
        let bestTop = Number.POSITIVE_INFINITY;
        for (const [id, top] of tops) {
          if (top < bestTop) {
            bestTop = top;
            bestId = id;
          }
        }
        if (bestId !== null) {
          const chosen = bestId;
          setActive((prev) => (prev === chosen ? prev : chosen));
        }
      },
      {
        root: root ?? null,
        // The band is the top third of the root: a section becomes current as
        // its heading reaches that line.
        rootMargin: rootMargin ?? "0px 0px -66% 0px",
        threshold: [0, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [itemsKey, root, rootMargin, setActive]);
}

export type ScrollspyNavItem = {
  /** Stable identity: the anchor target and the id of the observed section. */
  id: string;
  label: React.ReactNode;
};

export type ScrollspyNavProps = Omit<
  React.ComponentPropsWithRef<"nav">,
  "children"
> & {
  items: readonly ScrollspyNavItem[];
  /** Initial highlight. Falls back to the first item's id. */
  defaultActive?: string;
  /** Optional eyebrow label above the list (visual; the landmark uses aria-label). */
  label?: React.ReactNode;
  /**
   * Scroll root for the observer. Defaults to the viewport. Pass the scrollable
   * element when the sections live inside a container.
   */
  root?: Element | null;
  /** Observer rootMargin override. Defaults to a top-third reading band. */
  rootMargin?: string;
  material?: ScrollspyNavMaterial;
  variant?: ScrollspyNavVariant;
  size?: ScrollspyNavSize;
};

export function ScrollspyNav({
  "aria-label": ariaLabel = "On this page",
  className,
  defaultActive,
  items,
  label,
  material = "adaptive",
  ref,
  root,
  rootMargin,
  size = "md",
  variant = "default",
  ...props
}: ScrollspyNavProps) {
  const [active, setActive] = React.useState<string | undefined>(
    () => defaultActive ?? items[0]?.id,
  );

  const hostRef = React.useRef<HTMLElement | null>(null);
  const thumbRef = React.useRef<HTMLSpanElement | null>(null);
  const itemsKey = items.map((item) => item.id).join("|");

  const rect = useActiveRailRect(hostRef, itemsKey);
  useScrollspy(itemsKey, setActive, root, rootMargin);

  // Arming is a one-way DOM flag rather than React state: it must flip on the
  // commit *after* the thumb is first positioned, it never affects what React
  // renders, and setting state here would only buy a second render pass.
  React.useEffect(() => {
    if (rect && thumbRef.current) thumbRef.current.dataset.armed = "true";
  }, [rect]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (typeof document === "undefined") return;
    const target = document.getElementById(id);
    // Missing target: let the native anchor jump handle it.
    if (!target) return;
    event.preventDefault();
    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    setActive(id);
  };

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={cn(MATERIAL_TOKENS[material], rootVariants({ size, variant }), className)}
      data-material={material}
      ref={ref}
    >
      {label !== undefined ? (
        // The landmark's name is already carried by aria-label, so the visible
        // eyebrow is decorative to assistive tech and hidden from it.
        <p aria-hidden="true" className={eyebrowClass}>
          {label}
        </p>
      ) : null}
      <div
        className="relative"
        ref={(node) => {
          hostRef.current = node;
        }}
      >
        <span aria-hidden="true" className={trackClass} />
        {rect ? (
          <span
            aria-hidden="true"
            className={thumbClass}
            ref={thumbRef}
            style={{
              // `translate`, not `transform`: Tailwind v4 writes its translate
              // utilities to the standalone property, and the transition above
              // names `translate` to match.
              translate: `0 ${rect.top}px`,
              height: `${rect.height}px`,
            }}
          />
        ) : null}
        <ul className="relative z-10 m-0 flex list-none flex-col p-0 pl-[var(--mq-list-pl,16px)]">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <a
                  aria-current={isActive ? "true" : undefined}
                  className={itemVariants({ size })}
                  data-active={isActive ? "true" : undefined}
                  data-scrollspy-item=""
                  href={`#${item.id}`}
                  onClick={(event) => handleClick(event, item.id)}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export type ScrollspyNavVariantProps = VariantProps<typeof rootVariants>;

export { itemVariants, rootVariants };
