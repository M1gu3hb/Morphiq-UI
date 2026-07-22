"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Number Stepper
 *
 * A real `<input type="number">` — which the platform already exposes as a
 * spinbutton, with `role`, `aria-valuenow`, `aria-valuemin`/`max` and native
 * arrow-key stepping all for free — flanked by a `−` and a `+` button that add
 * hold-to-repeat on top. Nothing here reimplements the field: the buttons write
 * to the real input through the native value setter and dispatch a genuine
 * `input` event, so React `value`/`onChange` and uncontrolled forms see the
 * change exactly as if it had been typed.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. Copying this file (plus `src/lib/cn.ts`) reproduces
 * the full look.
 *
 * Two exports, mirroring `Input`:
 *
 *   <NumberStepper>       the control group. `className` targets the <input>.
 *   <NumberStepperField>  label + control + message, with the `htmlFor` /
 *                         `aria-describedby` / `aria-invalid` wiring done for you.
 *
 * Local theming knobs (declared on the group wrapper, inherited by the input and
 * both buttons):
 *
 *   --mq-field         input background (default variant)
 *   --mq-field-strong  input background (filled variant) and the buttons' faces
 *   --mq-grad          material lighting over the default surface
 *   --mq-grad-strong   material lighting over the strong surface
 *   --mq-edge          tactile contact edge
 *   --mq-brd           resting border
 *   --mq-brd-focus     border once focused
 *   --mq-text          typed digits + the button glyphs
 *   --mq-placeholder   placeholder text
 *   --mq-ring          focus ring
 *   --mq-error         error border + error message
 *   --mq-radius        corner radius (set by size)
 *
 * Contrast contract: typed digits AND placeholder both measure at or above
 * 4.5:1 against the control's own surface on every material, and the `−`/`+`
 * glyphs are informative controls held to the same 4.5:1 — they inherit
 * `--mq-text`, the typed-digit colour, rather than a decorative grey.
 */

/**
 * Palette per material, as local custom properties only — copied verbatim from
 * `Input` so the two sit together in a form without drifting. Applied to the
 * group *wrapper* rather than the `<input>`, because the buttons are siblings of
 * the control and could never inherit `--mq-field-strong` from it; the field
 * wrapper repeats them for the message, a sibling in turn.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-field:#f7e9de] [--mq-field-strong:#efd9c8] [--mq-edge:#dcc4b2]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.38),rgba(151,92,58,0.06))]",
    "[--mq-grad-strong:linear-gradient(180deg,rgba(255,255,255,0.26),rgba(151,92,58,0.08))]",
    "[--mq-brd:rgba(120,80,55,0.30)] [--mq-brd-focus:#c9482f]",
    "[--mq-text:#33261e] [--mq-placeholder:#6a5346]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
  ].join(" "),
  glass: [
    "[--mq-field:rgba(255,255,255,0.66)] [--mq-field-strong:rgba(255,255,255,0.82)] [--mq-edge:rgba(255,255,255,0.86)]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
    "[--mq-grad-strong:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0))]",
    "[--mq-brd:rgba(255,255,255,0.75)] [--mq-brd-focus:rgba(255,255,255,0.98)]",
    "[--mq-text:#1e1e1b] [--mq-placeholder:#36362f]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  skeuo: [
    "[--mq-field:#e6e3da] [--mq-field-strong:#d7d3c9] [--mq-edge:#a8a49b]",
    "[--mq-grad:linear-gradient(180deg,#f2efe7,#dcd8ce)]",
    "[--mq-grad-strong:linear-gradient(180deg,#e4e0d6,#cec9be)]",
    "[--mq-brd:rgba(25,25,23,0.52)] [--mq-brd-focus:rgba(25,25,23,0.60)]",
    "[--mq-text:#23231f] [--mq-placeholder:#4a4943]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  adaptive: [
    "[--mq-field:#ffffff] [--mq-field-strong:#f1f0ec] [--mq-edge:transparent]",
    "[--mq-grad:none] [--mq-grad-strong:none]",
    "[--mq-brd:rgba(23,24,23,0.22)] [--mq-brd-focus:#171817]",
    "[--mq-text:#1c1c19] [--mq-placeholder:#55554e]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
    "dark:[--mq-field:#232327] dark:[--mq-field-strong:#2b2b31]",
    "dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-brd-focus:#f1efe9]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-placeholder:#b9b7b0]",
    "dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
  ].join(" "),
} as const;

/**
 * Field depth, one recipe per material — copied from `Input`. Every state keeps
 * the same number of shadow layers in the same inset order across rest, hover
 * and focus, so `box-shadow` interpolates the focus well rather than swapping
 * two incompatible lists discretely: the field sits proud at rest, lifts on
 * hover, and presses into a well on focus.
 */
const DEPTH = {
  clay: {
    rest: "shadow-[inset_0_3px_4px_rgba(255,255,255,0.78),inset_0_-4px_7px_rgba(140,90,60,0.14),inset_0_0_0_rgba(120,60,40,0),0_2px_0_var(--mq-edge,#dcc4b2),0_5px_11px_rgba(90,60,45,0.13)]",
    hover:
      "hover:shadow-[inset_0_3px_4px_rgba(255,255,255,0.88),inset_0_-4px_7px_rgba(140,90,60,0.16),inset_0_0_0_rgba(120,60,40,0),0_4px_0_var(--mq-edge,#dcc4b2),0_9px_17px_rgba(90,60,45,0.18)]",
    focus:
      "focus-visible:shadow-[inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_6px_rgba(140,90,60,0.10),inset_0_5px_10px_rgba(120,60,40,0.27),0_1px_0_var(--mq-edge,#dcc4b2),0_2px_4px_rgba(90,60,45,0.10)] " +
      "data-[focus=true]:shadow-[inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_6px_rgba(140,90,60,0.10),inset_0_5px_10px_rgba(120,60,40,0.27),0_1px_0_var(--mq-edge,#dcc4b2),0_2px_4px_rgba(90,60,45,0.10)]",
  },
  glass: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.86),inset_0_-1px_0_rgba(255,255,255,0.22),inset_0_0_0_rgba(24,20,40,0),0_7px_20px_rgba(24,20,40,0.15)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(255,255,255,0.27),inset_0_0_0_rgba(24,20,40,0),0_11px_28px_rgba(24,20,40,0.22)] hover:backdrop-blur-[22px]",
    focus:
      "focus-visible:shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(255,255,255,0.20),inset_0_5px_12px_rgba(24,20,40,0.22),0_2px_6px_rgba(24,20,40,0.12)] " +
      "data-[focus=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(255,255,255,0.20),inset_0_5px_12px_rgba(24,20,40,0.22),0_2px_6px_rgba(24,20,40,0.12)]",
  },
  skeuo: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-3px_5px_rgba(0,0,0,0.15),inset_0_0_0_rgba(0,0,0,0),0_2px_0_var(--mq-edge,#a8a49b),0_5px_10px_rgba(38,36,31,0.20)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.99),inset_0_-3px_5px_rgba(0,0,0,0.17),inset_0_0_0_rgba(0,0,0,0),0_3px_0_var(--mq-edge,#a8a49b),0_8px_15px_rgba(38,36,31,0.25)]",
    focus:
      "focus-visible:shadow-[inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-2px_4px_rgba(0,0,0,0.10),inset_0_5px_11px_rgba(0,0,0,0.32),0_1px_0_var(--mq-edge,#a8a49b),0_2px_3px_rgba(38,36,31,0.15)] " +
      "data-[focus=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-2px_4px_rgba(0,0,0,0.10),inset_0_5px_11px_rgba(0,0,0,0.32),0_1px_0_var(--mq-edge,#a8a49b),0_2px_3px_rgba(38,36,31,0.15)]",
  },
  adaptive: {
    rest: "shadow-[inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.10)]",
    hover: "hover:shadow-[inset_0_0_0_rgba(20,20,18,0),0_6px_16px_rgba(20,20,18,0.16)]",
    focus:
      "focus-visible:shadow-[inset_0_3px_7px_rgba(20,20,18,0.17),0_1px_2px_rgba(20,20,18,0.08)] " +
      "data-[focus=true]:shadow-[inset_0_3px_7px_rgba(20,20,18,0.17),0_1px_2px_rgba(20,20,18,0.08)]",
  },
} as const;

/**
 * Button depth, one recipe per material.
 *
 * The same tactile vocabulary as the field, re-keyed to the button's own
 * lifecycle: proud at rest, lifted on hover, pressed into a well while `:active`.
 * Layer counts and inset order match the field's rest/hover/focus exactly, so a
 * press interpolates instead of snapping. Written out in full — Tailwind scans
 * source text for class names, so a name assembled by interpolating a prefix
 * onto a value would never be seen and its rule never emitted.
 */
const BUTTON_DEPTH = {
  clay: {
    rest: "shadow-[inset_0_3px_4px_rgba(255,255,255,0.78),inset_0_-4px_7px_rgba(140,90,60,0.14),inset_0_0_0_rgba(120,60,40,0),0_2px_0_var(--mq-edge,#dcc4b2),0_5px_11px_rgba(90,60,45,0.13)]",
    hover:
      "hover:shadow-[inset_0_3px_4px_rgba(255,255,255,0.88),inset_0_-4px_7px_rgba(140,90,60,0.16),inset_0_0_0_rgba(120,60,40,0),0_4px_0_var(--mq-edge,#dcc4b2),0_9px_17px_rgba(90,60,45,0.18)]",
    active:
      "active:shadow-[inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_6px_rgba(140,90,60,0.10),inset_0_5px_10px_rgba(120,60,40,0.27),0_1px_0_var(--mq-edge,#dcc4b2),0_2px_4px_rgba(90,60,45,0.10)]",
  },
  glass: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.86),inset_0_-1px_0_rgba(255,255,255,0.22),inset_0_0_0_rgba(24,20,40,0),0_7px_20px_rgba(24,20,40,0.15)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(255,255,255,0.27),inset_0_0_0_rgba(24,20,40,0),0_11px_28px_rgba(24,20,40,0.22)]",
    active:
      "active:shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(255,255,255,0.20),inset_0_5px_12px_rgba(24,20,40,0.22),0_2px_6px_rgba(24,20,40,0.12)]",
  },
  skeuo: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-3px_5px_rgba(0,0,0,0.15),inset_0_0_0_rgba(0,0,0,0),0_2px_0_var(--mq-edge,#a8a49b),0_5px_10px_rgba(38,36,31,0.20)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.99),inset_0_-3px_5px_rgba(0,0,0,0.17),inset_0_0_0_rgba(0,0,0,0),0_3px_0_var(--mq-edge,#a8a49b),0_8px_15px_rgba(38,36,31,0.25)]",
    active:
      "active:shadow-[inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-2px_4px_rgba(0,0,0,0.10),inset_0_5px_11px_rgba(0,0,0,0.32),0_1px_0_var(--mq-edge,#a8a49b),0_2px_3px_rgba(38,36,31,0.15)]",
  },
  adaptive: {
    rest: "shadow-[inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.10)]",
    hover: "hover:shadow-[inset_0_0_0_rgba(20,20,18,0),0_6px_16px_rgba(20,20,18,0.16)]",
    active: "active:shadow-[inset_0_3px_7px_rgba(20,20,18,0.17),0_1px_2px_rgba(20,20,18,0.08)]",
  },
} as const;

const stepperGroupVariants = cva("inline-flex items-stretch", {
  variants: {
    material: {
      clay: MATERIAL_TOKENS.clay,
      glass: MATERIAL_TOKENS.glass,
      skeuo: MATERIAL_TOKENS.skeuo,
      adaptive: MATERIAL_TOKENS.adaptive,
    },
    size: {
      sm: "[--mq-radius:10px] gap-[6px]",
      md: "[--mq-radius:13px] gap-[7px]",
      lg: "[--mq-radius:16px] gap-[8px]",
    },
  },
  defaultVariants: { material: "clay", size: "md" },
});

const stepperInputVariants = cva(
  [
    "block min-w-0 appearance-none border text-center tabular-nums",
    "text-[color:var(--mq-text,#33261e)]",
    "placeholder:text-[color:var(--mq-placeholder,#6a5346)]",
    // We draw our own − / + controls, so the native spin buttons would be a
    // duplicate affordance. Strip them in every engine.
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none",
    "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0",
    // Exactly the properties that change across states — nothing phantom. Border
    // colour moves on hover/focus/error, the shadow on focus, the background on
    // the filled variant, the backdrop on glass hover, and opacity when disabled.
    "transition-[border-color,background-color,box-shadow,backdrop-filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "focus-visible:border-[var(--mq-brd-focus,#c9482f)]",
    "data-[focus=true]:border-[var(--mq-brd-focus,#c9482f)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Forced colours drop every fill and shadow; a system-coloured border keeps
    // the field's bounds — and its invalid state — perceivable.
    "forced-colors:border-[CanvasText] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:backdrop-filter-none",
    "disabled:cursor-not-allowed disabled:opacity-55",
    // `aria-invalid` is the single source of truth for the error look.
    "aria-[invalid=true]:border-[var(--mq-error,#9c2f22)]",
    "aria-[invalid=true]:focus-visible:border-[var(--mq-error,#9c2f22)]",
    "aria-[invalid=true]:data-[focus=true]:border-[var(--mq-error,#9c2f22)]",
    "aria-[invalid=true]:focus-visible:outline-[var(--mq-error,#9c2f22)]",
    "forced-colors:aria-[invalid=true]:border-[Mark]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: `${DEPTH.clay.rest} ${DEPTH.clay.hover} ${DEPTH.clay.focus}`,
        glass: `backdrop-blur-[18px] backdrop-saturate-[170%] ${DEPTH.glass.rest} ${DEPTH.glass.hover} ${DEPTH.glass.focus}`,
        skeuo: `${DEPTH.skeuo.rest} ${DEPTH.skeuo.hover} ${DEPTH.skeuo.focus}`,
        adaptive: `${DEPTH.adaptive.rest} ${DEPTH.adaptive.hover} ${DEPTH.adaptive.focus} pointer-coarse:min-h-[48px]`,
      },
      size: {
        sm: "h-[34px] w-[64px] px-[8px] text-[13px]/[1.3]",
        md: "h-[42px] w-[80px] px-[10px] text-[14px]/[1.3]",
        lg: "h-[50px] w-[96px] px-[12px] text-[15px]/[1.3]",
      },
      // Declared after `size` so the radius the variant sets is not fighting the
      // size axis. The surface is painted as two explicit properties: a material
      // may supply a gradient and a colour at once, and folding both through a
      // single `bg-*` utility lets tailwind-merge drop one.
      variant: {
        default: [
          "rounded-[var(--mq-radius,13px)] border-[var(--mq-brd,rgba(120,80,55,0.30))]",
          "[background-color:var(--mq-field,#f7e9de)]",
          "[background-image:var(--mq-grad,none)]",
        ].join(" "),
        filled: [
          "rounded-[var(--mq-radius,13px)] border-transparent",
          "[background-color:var(--mq-field-strong,#efd9c8)]",
          "[background-image:var(--mq-grad-strong,none)]",
        ].join(" "),
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

const stepperButtonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center select-none touch-manipulation",
    "border border-transparent",
    "text-[color:var(--mq-text,#33261e)]",
    // The buttons' faces are always the strong surface, so on the default
    // variant they read as raised keys against a lighter recessed field, and on
    // the filled variant the whole control reads as one monolithic slab.
    "[background-color:var(--mq-field-strong,#efd9c8)]",
    "[background-image:var(--mq-grad-strong,none)]",
    // Only what a state actually changes: the shadow on hover/press, the 1px
    // physical depression on press, and opacity when disabled. `translate` is
    // the standalone property Tailwind v4 writes for `translate-y-*`, so it is
    // named here literally — never `transform`, which would animate nothing.
    "transition-[box-shadow,translate,opacity] duration-150 ease-out",
    "motion-reduce:transition-none",
    "active:translate-y-[1px]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Forced colours discard fills and shadows: a system border keeps the key's
    // bounds and a system text colour keeps its glyph on screen.
    "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]",
    "forced-colors:shadow-none forced-colors:[background-image:none] forced-colors:backdrop-filter-none",
    "disabled:cursor-not-allowed disabled:opacity-55",
  ].join(" "),
  {
    variants: {
      material: {
        clay: `${BUTTON_DEPTH.clay.rest} ${BUTTON_DEPTH.clay.hover} ${BUTTON_DEPTH.clay.active}`,
        glass: `backdrop-blur-[18px] backdrop-saturate-[170%] ${BUTTON_DEPTH.glass.rest} ${BUTTON_DEPTH.glass.hover} ${BUTTON_DEPTH.glass.active}`,
        skeuo: `${BUTTON_DEPTH.skeuo.rest} ${BUTTON_DEPTH.skeuo.hover} ${BUTTON_DEPTH.skeuo.active}`,
        adaptive: `${BUTTON_DEPTH.adaptive.rest} ${BUTTON_DEPTH.adaptive.hover} ${BUTTON_DEPTH.adaptive.active} pointer-coarse:min-h-[48px] pointer-coarse:min-w-[44px]`,
      },
      size: {
        sm: "size-[34px] rounded-[var(--mq-radius,10px)]",
        md: "size-[42px] rounded-[var(--mq-radius,13px)]",
        lg: "size-[50px] rounded-[var(--mq-radius,16px)]",
      },
    },
    defaultVariants: { material: "clay", size: "md" },
  },
);

/* -- stepping maths ------------------------------------------------------- */

const HOLD_INITIAL_DELAY_MS = 400;
const HOLD_REPEAT_START_MS = 120;
const HOLD_REPEAT_MIN_MS = 40;
const HOLD_REPEAT_ACCEL_MS = 12;

/** Decimal places of a finite number, so a fractional step does not drift. */
function countDecimals(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const text = String(value);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

function toNumberOrNull(value: unknown): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * The next value after one step in `dir` (+1 / -1), clamped to [min, max] and
 * rounded to the step's own precision. Stepping from an empty field lands on the
 * near boundary (min going up, max going down) or 0 when unbounded.
 */
function computeNext(
  currentText: string,
  dir: 1 | -1,
  stepNum: number,
  minNum: number | null,
  maxNum: number | null,
): number {
  const parsed = Number.parseFloat(currentText);
  let raw: number;
  if (Number.isNaN(parsed)) {
    raw = dir > 0 ? (minNum ?? 0) : (maxNum ?? 0);
  } else {
    raw = parsed + dir * stepNum;
  }
  const dp = countDecimals(stepNum);
  let next = dp > 0 ? Number(raw.toFixed(Math.min(dp, 100))) : raw;
  if (minNum !== null && next < minNum) next = minNum;
  if (maxNum !== null && next > maxNum) next = maxNum;
  return next;
}

/**
 * Write to the input through the prototype's own value setter, bypassing the
 * value tracker React installs on the instance, then dispatch a real bubbling
 * `input` event. That is what makes a programmatic step look identical to a
 * keystroke: React fires `onChange`, and an uncontrolled form reads the update.
 */
function setNativeValue(input: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  if (setter) setter.call(input, value);
  else input.value = value;
}

export type NumberStepperProps = Omit<
  React.ComponentPropsWithRef<"input">,
  "size" | "color" | "type"
> &
  VariantProps<typeof stepperInputVariants> & {
    /** Marks the control invalid. Drives `aria-invalid` and the error styling. */
    invalid?: boolean;
    /** Accessible name for the decrement button. */
    decreaseLabel?: string;
    /** Accessible name for the increment button. */
    increaseLabel?: string;
    /** Class for the group wrapper. `className` still targets the <input>. */
    wrapperClassName?: string;
    /** Force the focus-well look for docs/preview. */
    "data-focus"?: "true" | "false";
  };

/**
 * The control group.
 *
 * Uncontrolled by default; pass `value` + `onChange` to control it, exactly as
 * with a plain `<input>`. The buttons drive the same native input either way, so
 * there is no second copy of the value to keep in sync — the small piece of
 * state kept here is only a shadow of the field, read to know when a boundary
 * has been reached so the relevant button can disable.
 */
export function NumberStepper({
  "aria-invalid": ariaInvalid,
  "data-focus": dataFocus,
  className,
  decreaseLabel = "Decrease",
  defaultValue,
  disabled = false,
  id,
  increaseLabel = "Increase",
  inputMode,
  invalid = false,
  material = "clay",
  max,
  min,
  onChange,
  ref,
  size = "md",
  step = 1,
  value,
  variant = "default",
  wrapperClassName,
  ...props
}: NumberStepperProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const holdDelayRef = React.useRef<number | null>(null);
  const holdRepeatRef = React.useRef<number | null>(null);

  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string>(() =>
    defaultValue != null ? String(defaultValue) : "",
  );

  const minNum = toNumberOrNull(min);
  const maxNum = toNumberOrNull(max);
  const stepCandidate = toNumberOrNull(step);
  const stepNum = stepCandidate !== null && stepCandidate > 0 ? stepCandidate : 1;

  const currentText = controlled ? (value != null ? String(value) : "") : internalValue;
  const currentNum = Number.parseFloat(currentText);
  const hasCurrent = !Number.isNaN(currentNum);
  const atMax = hasCurrent && maxNum !== null && currentNum >= maxNum;
  const atMin = hasCurrent && minNum !== null && currentNum <= minNum;
  const decreaseDisabled = disabled || atMin;
  const increaseDisabled = disabled || atMax;

  const assignRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.RefObject<HTMLInputElement | null>).current = node;
    },
    [ref],
  );

  const stopHold = React.useCallback(() => {
    if (holdDelayRef.current !== null) {
      window.clearTimeout(holdDelayRef.current);
      holdDelayRef.current = null;
    }
    if (holdRepeatRef.current !== null) {
      window.clearTimeout(holdRepeatRef.current);
      holdRepeatRef.current = null;
    }
  }, []);

  // Leak-free: any pending timers are cleared when the component unmounts.
  React.useEffect(() => stopHold, [stopHold]);

  /** One step. Returns false when the value could not move (at a boundary). */
  function stepOnce(dir: 1 | -1): boolean {
    const input = inputRef.current;
    if (!input || input.disabled) return false;
    const next = String(computeNext(input.value, dir, stepNum, minNum, maxNum));
    if (next === input.value) return false;
    setNativeValue(input, next);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }

  /** First step now, then — after a short delay — an accelerating repeat. */
  function startHold(dir: 1 | -1): void {
    stopHold();
    if (!stepOnce(dir)) return;
    holdDelayRef.current = window.setTimeout(() => {
      let delay = HOLD_REPEAT_START_MS;
      const tick = () => {
        if (!stepOnce(dir)) {
          stopHold();
          return;
        }
        delay = Math.max(HOLD_REPEAT_MIN_MS, delay - HOLD_REPEAT_ACCEL_MS);
        holdRepeatRef.current = window.setTimeout(tick, delay);
      };
      holdRepeatRef.current = window.setTimeout(tick, delay);
    }, HOLD_INITIAL_DELAY_MS);
  }

  function handlePointerDown(dir: 1 | -1, event: React.PointerEvent<HTMLButtonElement>) {
    // Primary button / touch / pen only; a right-click must not start a repeat.
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startHold(dir);
  }

  function handleKeyDown(dir: 1 | -1, event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== " " && event.key !== "Enter") return;
    // Suppress the native click these keys would synthesise, so activation is
    // driven solely through here and never fires a second, doubled step.
    event.preventDefault();
    if (event.repeat) return; // our own interval owns the repeat cadence
    startHold(dir);
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === " " || event.key === "Enter") stopHold();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!controlled) setInternalValue(event.currentTarget.value);
    onChange?.(event);
  }

  const glyph = size === "sm" ? "size-[15px]" : size === "lg" ? "size-[19px]" : "size-[17px]";
  const resolvedInputMode = inputMode ?? (countDecimals(stepNum) > 0 ? "decimal" : "numeric");

  return (
    <span
      className={cn(stepperGroupVariants({ material, size }), wrapperClassName)}
      data-material={material}
    >
      <button
        aria-label={decreaseLabel}
        className={cn(stepperButtonVariants({ material, size }))}
        disabled={decreaseDisabled}
        onBlur={stopHold}
        onKeyDown={(event) => handleKeyDown(-1, event)}
        onKeyUp={handleKeyUp}
        onPointerCancel={stopHold}
        onPointerDown={(event) => handlePointerDown(-1, event)}
        onPointerLeave={stopHold}
        onPointerUp={stopHold}
        type="button"
      >
        <Minus aria-hidden="true" className={glyph} strokeWidth={2.5} />
      </button>
      <input
        {...props}
        aria-invalid={invalid || ariaInvalid || undefined}
        className={cn(stepperInputVariants({ material, variant, size }), className)}
        data-focus={dataFocus}
        data-material={material}
        defaultValue={controlled ? undefined : defaultValue}
        disabled={disabled}
        id={id}
        inputMode={resolvedInputMode}
        max={max}
        min={min}
        onChange={handleChange}
        ref={assignRef}
        step={step}
        type="number"
        value={controlled ? value : undefined}
      />
      <button
        aria-label={increaseLabel}
        className={cn(stepperButtonVariants({ material, size }))}
        disabled={increaseDisabled}
        onBlur={stopHold}
        onKeyDown={(event) => handleKeyDown(1, event)}
        onKeyUp={handleKeyUp}
        onPointerCancel={stopHold}
        onPointerDown={(event) => handlePointerDown(1, event)}
        onPointerLeave={stopHold}
        onPointerUp={stopHold}
        type="button"
      >
        <Plus aria-hidden="true" className={glyph} strokeWidth={2.5} />
      </button>
    </span>
  );
}

const LABEL =
  // `currentColor`: the label sits on the host's surface, not on one of ours, so
  // pinning a colour would be guessing at the page it lands on.
  "text-[color:currentColor] text-[length:12px] leading-[1.3] font-extrabold tracking-[-0.01em]";

const MESSAGE = "m-0 text-[length:11px] leading-[1.5]";

export type NumberStepperFieldProps = NumberStepperProps & {
  /** Visible label. Rendered as a real `<label htmlFor>`. */
  label: React.ReactNode;
  /** Guidance shown under the control while it is valid. */
  helperText?: React.ReactNode;
  /** Error shown instead of `helperText`. Its presence implies `invalid`. */
  errorText?: React.ReactNode;
  /** Class for the field wrapper. `className` still targets the <input>. */
  fieldClassName?: string;
};

/**
 * Label + control + message, wired together.
 *
 * The message region is always rendered, even when empty: an `aria-live` region
 * has to be in the DOM *before* the text arrives for the announcement to be
 * reliable, so a container that only appeared alongside the error would often be
 * missed by screen readers. `aria-describedby` is composed rather than
 * overwritten, so a caller passing their own description keeps it.
 */
export function NumberStepperField({
  errorText,
  fieldClassName,
  helperText,
  id,
  invalid = false,
  label,
  material = "clay",
  size,
  variant,
  ...props
}: NumberStepperFieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? `${generatedId}-stepper`;
  const messageId = `${generatedId}-message`;
  // `""` means "no error" for form libraries and server actions, so trim before
  // treating a string as present — an empty message must not mark the control
  // invalid or point `aria-describedby` at nothing.
  const hasError = typeof errorText === "string" ? errorText.trim() !== "" : errorText != null;
  const isInvalid = invalid || hasError;
  const message = hasError ? errorText : helperText;

  const describedBy = [props["aria-describedby"], message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-[6px] text-left",
        // Repeated here for the message, a sibling of the control group and so
        // unable to inherit `--mq-error` from it.
        MATERIAL_TOKENS[material ?? "clay"],
        fieldClassName,
      )}
    >
      <label className={LABEL} htmlFor={controlId}>
        {label}
      </label>
      <NumberStepper
        {...props}
        aria-describedby={describedBy || undefined}
        id={controlId}
        invalid={isInvalid}
        material={material}
        size={size}
        variant={variant}
      />
      <p
        aria-live="polite"
        className={cn(
          MESSAGE,
          hasError
            ? "font-bold text-[color:var(--mq-error,#9c2f22)]"
            : "text-[color:currentColor]",
        )}
        id={messageId}
      >
        {message}
      </p>
    </div>
  );
}

export { stepperInputVariants, stepperButtonVariants };
