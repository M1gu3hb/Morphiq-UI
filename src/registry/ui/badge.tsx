"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Badge
 *
 * A compact label for status and category metadata. Self-contained by design:
 * all four material recipes live here, every local custom property has a
 * literal fallback, and no class comes from the site's global chrome.
 *
 * Tone is deliberately visual only. Meaning belongs to `children` (or to an
 * explicit `aria-label` for an icon-only badge), so success, warning and danger
 * are never communicated by colour alone.
 *
 * Local theming knobs:
 *
 *   --mq-body  surface colour
 *   --mq-lit   top gradient stop for skeuo
 *   --mq-edge  clay lower edge
 *   --mq-text  foreground colour
 *   --mq-brd   border colour
 *   --mq-ring  focus ring colour for an interactive `asChild` target
 */

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Keyframes travel with the component rather than living in a global stylesheet
 * a copier would have to find. React 19 hoists this and deduplicates it by
 * `href`, so a row of badges emits one rule rather than one per pill.
 */
const BADGE_KEYFRAMES = `@keyframes mq-badge-in{from{opacity:0;scale:0.82}to{opacity:1;scale:1}}`;

function BadgeKeyframes() {
  return (
    <style href="mq-badge-in" precedence="medium">
      {BADGE_KEYFRAMES}
    </style>
  );
}

const badgeVariants = cva(
  [
    "relative isolate inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap",
    "rounded-full border font-extrabold tracking-[0.02em]",
    "border-[var(--mq-brd,rgba(82,70,56,0.18))] text-[color:var(--mq-text,#332f2a)]",
    "[&>svg]:pointer-events-none [&>svg]:size-[1em] [&>svg]:shrink-0",
    // Documentation can force these non-interactive states. There is no
    // transition on purpose: status metadata should update immediately.
    "data-[state=loading]:opacity-75 data-[state=disabled]:opacity-55",
    // Signature: a badge pops in rather than blinking into place. Keyframes and
    // not a transition, because a badge is rendered in its final state and a
    // transition has nothing to run from on the frame an element mounts.
    "animate-[mq-badge-in_260ms_cubic-bezier(0.34,1.56,0.64,1)]",
    // Decoration only — the label is the meaning and it is present either way —
    // so reduced motion drops the pop entirely rather than keeping an end state.
    "motion-reduce:animate-none",
    // A badge is metadata, not a control, so the hover cue stays a whisper: the
    // surface brightens very slightly and nothing moves. `filter` is the
    // property Tailwind v4 writes `brightness-*` to, so it is what the
    // transition names.
    "transition-[filter] duration-200 ease-out hover:brightness-[1.04]",
    "motion-reduce:transition-none motion-reduce:hover:brightness-100",
    FOCUS_RING,
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#ece7df)]",
          "shadow-[inset_0_2px_2px_rgba(255,255,255,0.72),inset_0_-2px_3px_rgba(75,50,35,0.12),0_2px_0_var(--mq-edge,#cfc4b6),0_5px_9px_rgba(64,45,34,0.12)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(38,40,45,0.94))]",
          "backdrop-blur-[14px] backdrop-saturate-[145%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_7px_16px_rgba(24,20,40,0.18)]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f4f2ec),var(--mq-body,#c8c4ba))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-2px_3px_rgba(0,0,0,0.16),0_2px_4px_rgba(35,33,29,0.22)]",
        ].join(" "),
        adaptive: [
          "bg-[var(--mq-body,#171817)]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.16)]",
        ].join(" "),
      },
      tone: {
        neutral: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
      },
      size: {
        sm: "min-h-[20px] gap-[4px] px-[7px] py-[2px] text-[10px]/[1]",
        md: "min-h-[24px] gap-[5px] px-[9px] py-[3px] text-[11px]/[1]",
        lg: "min-h-[30px] gap-[6px] px-[12px] py-[5px] text-[12px]/[1]",
      },
    },
    compoundVariants: [
      // ---------------------------------------------------------------- clay
      {
        material: "clay",
        tone: "neutral",
        class:
          "[--mq-body:#ece7df] [--mq-edge:#cfc4b6] [--mq-text:#332f2a] [--mq-brd:rgba(82,70,56,0.18)] [--mq-ring:#171817]",
      },
      {
        material: "clay",
        tone: "success",
        class:
          "[--mq-body:#bfe6c8] [--mq-edge:#92c59f] [--mq-text:#174b2b] [--mq-brd:rgba(23,75,43,0.22)] [--mq-ring:#174b2b]",
      },
      {
        material: "clay",
        tone: "warning",
        class:
          "[--mq-body:#f4d98b] [--mq-edge:#d2b45f] [--mq-text:#5b3b00] [--mq-brd:rgba(91,59,0,0.22)] [--mq-ring:#5b3b00]",
      },
      {
        material: "clay",
        tone: "danger",
        class:
          "[--mq-body:#f5c2bf] [--mq-edge:#d99090] [--mq-text:#6b2027] [--mq-brd:rgba(107,32,39,0.22)] [--mq-ring:#6b2027]",
      },
      {
        material: "clay",
        tone: "info",
        class:
          "[--mq-body:#bdddf5] [--mq-edge:#8ebbdc] [--mq-text:#173f68] [--mq-brd:rgba(23,63,104,0.22)] [--mq-ring:#173f68]",
      },
      // --------------------------------------------------------------- glass
      {
        material: "glass",
        tone: "neutral",
        class:
          "[--mq-body:rgba(38,40,45,0.94)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        tone: "success",
        class:
          "[--mq-body:rgba(18,96,62,0.94)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        tone: "warning",
        class:
          "[--mq-body:rgba(101,67,10,0.94)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        tone: "danger",
        class:
          "[--mq-body:rgba(134,35,45,0.94)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        tone: "info",
        class:
          "[--mq-body:rgba(26,72,130,0.94)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.32)] [--mq-ring:#171817]",
      },
      // --------------------------------------------------------------- skeuo
      {
        material: "skeuo",
        tone: "neutral",
        class:
          "[--mq-lit:#f4f2ec] [--mq-body:#c8c4ba] [--mq-text:#25241f] [--mq-brd:rgba(37,36,31,0.26)] [--mq-ring:#171817]",
      },
      {
        material: "skeuo",
        tone: "success",
        class:
          "[--mq-lit:#dff0df] [--mq-body:#9fc7a8] [--mq-text:#143b23] [--mq-brd:rgba(20,59,35,0.28)] [--mq-ring:#143b23]",
      },
      {
        material: "skeuo",
        tone: "warning",
        class:
          "[--mq-lit:#f6e7b0] [--mq-body:#d3b35e] [--mq-text:#4c3400] [--mq-brd:rgba(76,52,0,0.28)] [--mq-ring:#4c3400]",
      },
      {
        material: "skeuo",
        tone: "danger",
        class:
          "[--mq-lit:#f2d3d0] [--mq-body:#ca8f91] [--mq-text:#5b1a22] [--mq-brd:rgba(91,26,34,0.28)] [--mq-ring:#5b1a22]",
      },
      {
        material: "skeuo",
        tone: "info",
        class:
          "[--mq-lit:#d9e8f4] [--mq-body:#96b8d4] [--mq-text:#153750] [--mq-brd:rgba(21,55,80,0.28)] [--mq-ring:#153750]",
      },
      // ------------------------------------------------------------ adaptive
      {
        material: "adaptive",
        tone: "neutral",
        class:
          "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.40)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(0,0,0,0.40)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        tone: "success",
        class:
          "[--mq-body:#17643d] [--mq-text:#ffffff] [--mq-brd:rgba(0,0,0,0.32)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#a9e7bd] dark:[--mq-text:#123d24] dark:[--mq-brd:rgba(18,61,36,0.30)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        tone: "warning",
        class:
          "[--mq-body:#7a5109] [--mq-text:#ffffff] [--mq-brd:rgba(0,0,0,0.32)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#f0d27a] dark:[--mq-text:#4a3200] dark:[--mq-brd:rgba(74,50,0,0.30)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        tone: "danger",
        class:
          "[--mq-body:#8c2531] [--mq-text:#ffffff] [--mq-brd:rgba(0,0,0,0.32)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#f3b8ba] dark:[--mq-text:#5a1820] dark:[--mq-brd:rgba(90,24,32,0.30)] dark:[--mq-ring:#f1efe9]",
      },
      {
        material: "adaptive",
        tone: "info",
        class:
          "[--mq-body:#24558d] [--mq-text:#ffffff] [--mq-brd:rgba(0,0,0,0.32)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#b9d9f4] dark:[--mq-text:#173a5e] dark:[--mq-brd:rgba(23,58,94,0.30)] dark:[--mq-ring:#f1efe9]",
      },
    ],
    defaultVariants: {
      material: "clay",
      tone: "neutral",
      size: "md",
    },
  },
);

export type BadgeProps = Omit<React.ComponentPropsWithRef<"span">, "color"> &
  VariantProps<typeof badgeVariants> & {
    /** Render the child element instead of the default `<span>`. */
    asChild?: boolean;
    /** Add a decorative leading dot; visible text still carries the meaning. */
    dot?: boolean;
  };

export function Badge({
  asChild = false,
  children,
  className,
  dot = false,
  material,
  size,
  tone,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <>
      <BadgeKeyframes />
      <Comp
          {...props}
        className={cn(badgeVariants({ material, tone, size }), className)}
        data-material={material ?? "clay"}
        data-tone={tone ?? "neutral"}
      >
        {dot ? (
          <span
            aria-hidden="true"
            className="size-[0.55em] shrink-0 rounded-full bg-current"
            data-badge-dot=""
          />
        ) : null}
        <Slottable>{children}</Slottable>
      </Comp>
    </>
  );
}

export { badgeVariants };
