"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Expandable Card
 *
 * A disclosure surface: a heading always visible, a real `<button>` that
 * toggles a region open, and an expandable body that grows to its natural
 * height with the CSS grid `0fr`→`1fr` trick — so the reveal animates any
 * amount of content without measuring it in JavaScript.
 *
 * Self-contained by design: the four material recipes below are copied from the
 * Card so this file plus `src/lib/cn.ts` reproduces the full look. It reads no
 * `:root` variables and depends on no global stylesheet class. Every local
 * custom property is used with a literal fallback:
 *
 *   --mq-body    surface color
 *   --mq-lit     top highlight color (skeuo gradient)
 *   --mq-edge    extruded bottom edge color
 *   --mq-text    primary foreground color
 *   --mq-muted   secondary foreground color (summary, chevron)
 *   --mq-rule    hairline color for the reveal divider
 *   --mq-brd     border color
 *   --mq-ring    focus ring color
 *   --mq-pad     inner padding
 *   --mq-gap     vertical rhythm inside the reveal
 *   --mq-radius  corner radius
 *   --mq-title   heading font size
 *
 * Accessibility: the trigger is a native `<button aria-expanded aria-controls>`
 * wrapped by an `<h*>` whose level the caller sets, matching the APG disclosure
 * pattern. Enter/Space toggle natively. When collapsed the region is `inert`, so
 * its content is removed from the tab order and the accessibility tree while the
 * grid animation still runs. The chevron rotates as a shape cue and the state is
 * also carried by `aria-expanded`, never by colour alone. Under
 * `prefers-reduced-motion` the height and chevron transitions become instant
 * while the final open/closed state is preserved.
 *
 * Contrast contract: on every filled material both `--mq-text` and `--mq-muted`
 * stay at or above 4.5:1 against the surface — for glass, against a white and a
 * black backdrop alike, because glass must never borrow its legibility from
 * whatever sits behind it.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type ExpandableCardVariant = "default";
type ExpandableCardSize = "sm" | "md" | "lg";
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const expandableCardVariants = cva(
  [
    // `group/card` lets a doc surface synthesise the focused look on the inner
    // trigger via `data-focus`, so the preview never has to fake a keyboard event.
    "group/card relative isolate flex flex-col",
    "border text-left",
    "p-[var(--mq-pad,22px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    // Shadows and translucency are erased in forced-colors mode, so a system
    // colored border keeps the card's bounds.
    "forced-colors:border-[CanvasText]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#f6e7dd)]",
          "border-[var(--mq-brd,rgba(120,80,55,0.16))]",
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346]",
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(255,255,255,0.66))]",
          "border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          // `--mq-muted` #36362f composites to a legible grey at 0.66 opacity over
          // a black backdrop, where a lighter muted measured only 4.27:1.
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f]",
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)]",
          "forced-colors:[backdrop-filter:none] forced-colors:shadow-none",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943]",
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)]",
          "forced-colors:[background-image:none] forced-colors:bg-[Canvas] forced-colors:shadow-none",
        ].join(" "),
        // Polymorphic: almost no ornament. The palette follows the color scheme,
        // and because the surface is opaque and flips together with the text,
        // reading `prefers-color-scheme` is safe.
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)]",
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9]",
          "dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_10px_24px_rgba(0,0,0,0.4)]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-pad:16px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:15px]",
        md: "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:17px]",
        lg: "[--mq-pad:28px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:20px]",
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

export type ExpandableCardProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "title"
> & {
  material?: MaterialSlug;
  variant?: ExpandableCardVariant;
  size?: ExpandableCardSize;
  /** The always-visible heading text. Also the trigger's accessible name. */
  title: React.ReactNode;
  /**
   * Rank of the heading that wraps the trigger. The correct rank depends on the
   * surrounding document outline, so it is a prop rather than a hardcoded `<h3>`.
   */
  headingLevel?: HeadingLevel;
  /** Optional always-visible summary shown under the heading. */
  summary?: React.ReactNode;
  /** Controlled open state. Omit for uncontrolled with `defaultOpen`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Fires with the next open state on every toggle. */
  onOpenChange?: (open: boolean) => void;
};

export function ExpandableCard({
  children,
  className,
  defaultOpen = false,
  headingLevel = 3,
  material = "clay",
  onOpenChange,
  open,
  size = "md",
  summary,
  title,
  variant = "default",
  ...props
}: ExpandableCardProps) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = isControlled ? open : uncontrolledOpen;

  const reactId = React.useId();
  const regionId = `${reactId}-region`;

  const Heading = `h${headingLevel}` as `h${HeadingLevel}`;

  function toggle() {
    const next = !isOpen;
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  return (
    <div
      {...props}
      className={cn(expandableCardVariants({ material, variant, size }), className)}
      data-material={material}
      data-state={isOpen ? "open" : "closed"}
    >
      <Heading className="m-0">
        <button
          aria-controls={regionId}
          aria-expanded={isOpen}
          className={cn(
            "flex w-full cursor-pointer appearance-none items-center justify-between gap-[12px]",
            "m-0 bg-transparent p-0 text-left",
            "rounded-[10px] font-extrabold tracking-[-0.02em] leading-[1.2]",
            "text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)]",
            "focus-visible:outline-2 focus-visible:outline-offset-[3px]",
            "focus-visible:outline-[var(--mq-ring,#171817)]",
            // Doc-only synthetic focus: `data-focus` on the card outlines the
            // real trigger, so the documented look matches live keyboard focus.
            "group-data-[focus=true]/card:outline-2 group-data-[focus=true]/card:outline-offset-[3px]",
            "group-data-[focus=true]/card:outline-[var(--mq-ring,#171817)]",
            "forced-colors:focus-visible:outline-[Highlight]",
            "forced-colors:group-data-[focus=true]/card:outline-[Highlight]",
          )}
          onClick={toggle}
          type="button"
        >
          <span>{title}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-[1.15em] shrink-0 text-[color:var(--mq-muted,#5c5b55)]",
              // Only `rotate` changes, so the transition names exactly that — a
              // standalone `rotate` property, never `transition-[transform]`
              // beside a rotate utility.
              "transition-[rotate] duration-300 ease-out motion-reduce:transition-none",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </button>
      </Heading>

      {summary != null ? (
        <p className="m-0 mt-[8px] text-[color:var(--mq-muted,#5c5b55)] text-[length:13px] leading-[1.6]">
          {summary}
        </p>
      ) : null}

      {/* The reveal. The wrapper animates `grid-template-rows` between 0fr and
          1fr while the overflow-hidden child clips the content, so any natural
          content height reveals without measuring it. `inert` when closed keeps
          the collapsed content out of the tab order and the accessibility tree
          without breaking the transition. */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        id={regionId}
        inert={isOpen ? undefined : true}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-[var(--mq-gap,14px)]">
            <div
              className={cn(
                "flex flex-col gap-[8px] pt-[var(--mq-gap,14px)]",
                "border-t border-[var(--mq-rule,rgba(23,24,23,0.14))]",
                "text-[color:var(--mq-text,#2b2b26)] text-[length:13px] leading-[1.65]",
                "forced-colors:border-[CanvasText]",
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { expandableCardVariants };
