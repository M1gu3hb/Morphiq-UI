"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Check, X } from "lucide-react";

/**
 * Morphiq Multi Select
 *
 * Multiple selection with removable chips and a filterable options dropdown.
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet, so copying this file (plus `src/lib/cn.ts`) into
 * another project reproduces the full look.
 *
 * Why hand-rolled ARIA, where Select is native:
 *
 * There is no native control for "several values at once, each shown as a
 * removable chip, with a text filter". A `<select multiple>` is a scrolling
 * list box, not a combobox, and it cannot render chips. So this is the one
 * place in the inputs batch where the widget is assembled from ARIA rather than
 * inherited from the platform: a `role="combobox"` text input drives a
 * `role="listbox" aria-multiselectable="true"` of `role="option"` items. Focus
 * never leaves the input — the active option is tracked with
 * `aria-activedescendant`, so arrow keys move a highlight, not the focus ring,
 * exactly as the combobox pattern prescribes.
 *
 * Two exports, mirroring `Input` and `Select`:
 *
 *   <MultiSelect>       the control. `className` targets the control row.
 *   <MultiSelectField>  label + control + message, with the `htmlFor` /
 *                       `aria-describedby` / `aria-invalid` wiring done for you.
 *
 * Local theming knobs (each used with a literal fallback):
 *
 *   --mq-field       control background
 *   --mq-surface     opaque stand-in used to paint the popup
 *   --mq-grad        material lighting over the control surface
 *   --mq-edge        tactile contact edge (a zero-blur shadow layer)
 *   --mq-brd         resting border
 *   --mq-brd-focus   border once focused
 *   --mq-text        typed text, chip and option text
 *   --mq-placeholder placeholder text
 *   --mq-chip        chip background
 *   --mq-chip-brd    chip border
 *   --mq-active      active/hover option and remove-button wash
 *   --mq-check       the selected-option check glyph
 *   --mq-ring        focus ring
 *   --mq-error       error border + error message
 *   --mq-radius      corner radius (set by size)
 *
 * Contrast contract: typed text, placeholder, chip text and option text all
 * measure at or above 4.5:1 against the surface they sit on for every material,
 * and the check glyph — an informative mark rather than decoration — is held to
 * that same 4.5:1. Selection is never colour alone: a selected option carries
 * `aria-selected`, a check icon (shape) and a heavier weight, so it reads
 * without relying on hue.
 */

/**
 * Palette per material, as local custom properties only — no layout, no
 * decoration. Declared on the wrapper so the control row, the chips, the popup
 * and the sibling message region all resolve the same material's tokens.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-field:#f7e9de] [--mq-edge:#dcc4b2] [--mq-surface:#faf1e9]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.38),rgba(151,92,58,0.06))]",
    "[--mq-brd:rgba(120,80,55,0.30)] [--mq-brd-focus:#c9482f]",
    "[--mq-text:#33261e] [--mq-placeholder:#6a5346]",
    "[--mq-chip:#efd9c8] [--mq-chip-brd:rgba(120,80,55,0.34)]",
    "[--mq-active:rgba(120,80,55,0.16)] [--mq-check:#8a3b23]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
  ].join(" "),
  glass: [
    "[--mq-field:rgba(255,255,255,0.66)] [--mq-edge:rgba(255,255,255,0.86)] [--mq-surface:#f4f7f8]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
    "[--mq-brd:rgba(255,255,255,0.75)] [--mq-brd-focus:rgba(255,255,255,0.98)]",
    "[--mq-text:#1e1e1b] [--mq-placeholder:#36362f]",
    "[--mq-chip:rgba(255,255,255,0.90)] [--mq-chip-brd:rgba(23,24,23,0.28)]",
    "[--mq-active:rgba(23,24,23,0.10)] [--mq-check:#2c2c26]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  skeuo: [
    "[--mq-field:#e6e3da] [--mq-edge:#a8a49b] [--mq-surface:#e6e3da]",
    "[--mq-grad:linear-gradient(180deg,#f2efe7,#dcd8ce)]",
    "[--mq-brd:rgba(25,25,23,0.52)] [--mq-brd-focus:rgba(25,25,23,0.60)]",
    "[--mq-text:#23231f] [--mq-placeholder:#4a4943]",
    "[--mq-chip:#d7d3c9] [--mq-chip-brd:rgba(25,25,23,0.40)]",
    "[--mq-active:rgba(25,25,23,0.12)] [--mq-check:#3f3e39]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  adaptive: [
    "[--mq-field:#ffffff] [--mq-edge:transparent] [--mq-surface:#ffffff]",
    "[--mq-grad:none]",
    "[--mq-brd:rgba(23,24,23,0.22)] [--mq-brd-focus:#171817]",
    "[--mq-text:#1c1c19] [--mq-placeholder:#55554e]",
    "[--mq-chip:#f1f0ec] [--mq-chip-brd:rgba(23,24,23,0.24)]",
    "[--mq-active:rgba(23,24,23,0.08)] [--mq-check:#1c1c19]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
    "dark:[--mq-field:#232327] dark:[--mq-surface:#232327]",
    "dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-brd-focus:#f1efe9]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-placeholder:#b9b7b0]",
    "dark:[--mq-chip:#2b2b31] dark:[--mq-chip-brd:rgba(255,255,255,0.26)]",
    "dark:[--mq-active:rgba(255,255,255,0.12)] dark:[--mq-check:#f1efe9]",
    "dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
  ].join(" "),
} as const;

/**
 * Tactile depth per material, copied verbatim from `input.tsx`.
 *
 * Each recipe keeps the same number of shadow layers, in the same inset order,
 * across rest, hover and focus, so `box-shadow` interpolates the focus well
 * instead of swapping two incompatible layer lists discretely. The one change
 * from `input.tsx` is the state prefix: the well presses in on `focus-within`
 * (the input lives inside this row) rather than `focus-visible`, and the
 * `data-[focus=true]` twin lets a preview force the pressed look.
 */
const DEPTH = {
  clay: {
    rest: "shadow-[inset_0_3px_4px_rgba(255,255,255,0.78),inset_0_-4px_7px_rgba(140,90,60,0.14),inset_0_0_0_rgba(120,60,40,0),0_2px_0_var(--mq-edge,#dcc4b2),0_5px_11px_rgba(90,60,45,0.13)]",
    hover:
      "hover:shadow-[inset_0_3px_4px_rgba(255,255,255,0.88),inset_0_-4px_7px_rgba(140,90,60,0.16),inset_0_0_0_rgba(120,60,40,0),0_4px_0_var(--mq-edge,#dcc4b2),0_9px_17px_rgba(90,60,45,0.18)]",
    focus:
      "focus-within:shadow-[inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_6px_rgba(140,90,60,0.10),inset_0_5px_10px_rgba(120,60,40,0.27),0_1px_0_var(--mq-edge,#dcc4b2),0_2px_4px_rgba(90,60,45,0.10)] " +
      "data-[focus=true]:shadow-[inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_6px_rgba(140,90,60,0.10),inset_0_5px_10px_rgba(120,60,40,0.27),0_1px_0_var(--mq-edge,#dcc4b2),0_2px_4px_rgba(90,60,45,0.10)]",
  },
  glass: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.86),inset_0_-1px_0_rgba(255,255,255,0.22),inset_0_0_0_rgba(24,20,40,0),0_7px_20px_rgba(24,20,40,0.15)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(255,255,255,0.27),inset_0_0_0_rgba(24,20,40,0),0_11px_28px_rgba(24,20,40,0.22)] hover:backdrop-blur-[22px]",
    focus:
      "focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(255,255,255,0.20),inset_0_5px_12px_rgba(24,20,40,0.22),0_2px_6px_rgba(24,20,40,0.12)] " +
      "data-[focus=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(255,255,255,0.20),inset_0_5px_12px_rgba(24,20,40,0.22),0_2px_6px_rgba(24,20,40,0.12)]",
  },
  skeuo: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-3px_5px_rgba(0,0,0,0.15),inset_0_0_0_rgba(0,0,0,0),0_2px_0_var(--mq-edge,#a8a49b),0_5px_10px_rgba(38,36,31,0.20)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.99),inset_0_-3px_5px_rgba(0,0,0,0.17),inset_0_0_0_rgba(0,0,0,0),0_3px_0_var(--mq-edge,#a8a49b),0_8px_15px_rgba(38,36,31,0.25)]",
    focus:
      "focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-2px_4px_rgba(0,0,0,0.10),inset_0_5px_11px_rgba(0,0,0,0.32),0_1px_0_var(--mq-edge,#a8a49b),0_2px_3px_rgba(38,36,31,0.15)] " +
      "data-[focus=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-2px_4px_rgba(0,0,0,0.10),inset_0_5px_11px_rgba(0,0,0,0.32),0_1px_0_var(--mq-edge,#a8a49b),0_2px_3px_rgba(38,36,31,0.15)]",
  },
  adaptive: {
    rest: "shadow-[inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.10)]",
    hover: "hover:shadow-[inset_0_0_0_rgba(20,20,18,0),0_6px_16px_rgba(20,20,18,0.16)]",
    focus:
      "focus-within:shadow-[inset_0_3px_7px_rgba(20,20,18,0.17),0_1px_2px_rgba(20,20,18,0.08)] " +
      "data-[focus=true]:shadow-[inset_0_3px_7px_rgba(20,20,18,0.17),0_1px_2px_rgba(20,20,18,0.08)]",
  },
} as const;

type MultiSelectMaterial = keyof typeof MATERIAL_TOKENS;
type MultiSelectVariant = "default";
type MultiSelectSize = "sm" | "md" | "lg";

const controlVariants = cva(
  [
    // A real field: chips + input wrap inside a bordered, lit surface. `cursor-text`
    // because the whole row behaves like an input — clicking it focuses the combobox.
    "relative flex w-full flex-wrap items-center gap-[6px] cursor-text",
    "rounded-[var(--mq-radius,13px)] border",
    "border-[var(--mq-brd,rgba(120,80,55,0.30))]",
    "[background-color:var(--mq-field,#f7e9de)]",
    "[background-image:var(--mq-grad,none)]",
    // Only the properties some state actually changes: the border on focus and
    // error, the well on hover/focus, the glass blur on hover, opacity when
    // disabled. `background-color` is absent — nothing here changes it, so
    // listing it would be a phantom transition.
    "transition-[border-color,box-shadow,backdrop-filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    // The ring lands on the row, not the inner input: a composite widget shows a
    // single focus affordance around the whole control. `has-[:focus-visible]`
    // keeps it keyed to real keyboard/text focus; `data-[focus=true]` lets a
    // preview force it. Text inputs match :focus-visible on click too, so the
    // field shows focus however it was reached.
    "has-[:focus-visible]:border-[var(--mq-brd-focus,#c9482f)]",
    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[2px]",
    "has-[:focus-visible]:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:border-[var(--mq-brd-focus,#c9482f)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:has-[:focus-visible]:outline-[Highlight]",
    // Forced colours drop every fill and shadow, so a row styled only by its
    // background would vanish. A system border keeps its bounds and its invalid
    // state perceivable; the gradient wash is a background-image, which forced
    // colours keep, so it is cleared by hand.
    "forced-colors:border-[CanvasText] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:backdrop-filter-none",
    // `aria-invalid` on the input is the source of truth; the row mirrors it via
    // `data-invalid` so the two can never drift.
    "data-[invalid=true]:border-[var(--mq-error,#9c2f22)]",
    "data-[invalid=true]:has-[:focus-visible]:border-[var(--mq-error,#9c2f22)]",
    "data-[invalid=true]:has-[:focus-visible]:outline-[var(--mq-error,#9c2f22)]",
    "data-[invalid=true]:data-[focus=true]:border-[var(--mq-error,#9c2f22)]",
    "forced-colors:data-[invalid=true]:border-[Mark]",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-55",
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
        sm: "[--mq-radius:10px] min-h-[34px] p-[5px] text-[12px]",
        md: "[--mq-radius:13px] min-h-[42px] p-[6px] text-[13px]",
        lg: "[--mq-radius:16px] min-h-[50px] p-[7px] text-[14px]",
      },
    },
    defaultVariants: { material: "clay", size: "md" },
  },
);

const CHIP_SIZE: Record<MultiSelectSize, string> = {
  sm: "h-[22px] gap-[3px] ps-[8px] pe-[3px] text-[11px] rounded-[7px]",
  md: "h-[26px] gap-[4px] ps-[10px] pe-[4px] text-[12px] rounded-[9px]",
  lg: "h-[30px] gap-[5px] ps-[12px] pe-[5px] text-[13px] rounded-[10px]",
};

const REMOVE_SIZE: Record<MultiSelectSize, string> = {
  sm: "size-[16px]",
  md: "size-[18px]",
  lg: "size-[20px]",
};

const REMOVE_ICON: Record<MultiSelectSize, string> = {
  sm: "size-[10px]",
  md: "size-[12px]",
  lg: "size-[13px]",
};

const PANEL_SIZE: Record<MultiSelectSize, string> = {
  sm: "rounded-[10px] p-[4px]",
  md: "rounded-[13px] p-[5px]",
  lg: "rounded-[16px] p-[6px]",
};

const OPTION_SIZE: Record<MultiSelectSize, string> = {
  sm: "gap-[8px] px-[8px] py-[6px] text-[12px] rounded-[7px]",
  md: "gap-[9px] px-[10px] py-[8px] text-[13px] rounded-[9px]",
  lg: "gap-[10px] px-[12px] py-[9px] text-[14px] rounded-[10px]",
};

const CHECK_SIZE: Record<MultiSelectSize, string> = {
  sm: "size-[13px]",
  md: "size-[15px]",
  lg: "size-[16px]",
};

const chipClass = cn(
  "inline-flex shrink-0 items-center border font-semibold select-none max-w-full",
  "[background-color:var(--mq-chip,#efd9c8)]",
  "border-[var(--mq-chip-brd,rgba(120,80,55,0.34))]",
  "text-[color:var(--mq-text,#33261e)]",
  "forced-colors:border-[CanvasText] forced-colors:[background-image:none]",
);

const removeClass = cn(
  "inline-flex shrink-0 items-center justify-center rounded-full",
  "text-[color:var(--mq-text,#33261e)]",
  "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
  "hover:[background-color:var(--mq-active,rgba(120,80,55,0.16))]",
  "focus-visible:outline-2 focus-visible:outline-offset-[1px] focus-visible:outline-[var(--mq-ring,#171817)]",
  "forced-colors:text-[CanvasText] forced-colors:focus-visible:outline-[Highlight]",
  "disabled:cursor-not-allowed",
);

const panelClass = cn(
  "absolute inset-x-0 top-[calc(100%+6px)] z-50 m-0 list-none",
  "max-h-[240px] overflow-auto border",
  "[background-color:var(--mq-surface,#faf1e9)]",
  "border-[var(--mq-brd,rgba(120,80,55,0.30))]",
  "shadow-[0_14px_34px_rgba(24,20,40,0.22)]",
  // The panel opens: it fades and slides down into place. `translate` is named
  // literally in the transition — Tailwind v4 writes `translate-y-*` to the
  // standalone `translate` property, so naming `transform` in the list here
  // would animate nothing. Reduced motion drops the travel and keeps the open state.
  "transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none",
  // Resting state is "open"; the entrance-from state is expressed with the
  // `starting:` variant (@starting-style), so the closed→open transition has two
  // states to interpolate without a JS `entered` flag (which would mean calling
  // setState synchronously inside an effect). The panel is unmounted on close, so
  // there is no close animation to drive — this matches the previous behaviour.
  "opacity-100 translate-y-0",
  "starting:opacity-0 starting:-translate-y-[6px]",
  "forced-colors:border-[CanvasText] forced-colors:shadow-none forced-colors:[background-image:none]",
);

const optionClass = cn(
  "group relative flex cursor-pointer items-center select-none",
  "text-[color:var(--mq-text,#33261e)]",
  "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
  "data-[active=true]:[background-color:var(--mq-active,rgba(120,80,55,0.16))]",
  "aria-[selected=true]:font-semibold",
  "aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-45",
  "forced-colors:text-[CanvasText]",
  "forced-colors:aria-[selected=true]:font-bold",
  "forced-colors:data-[active=true]:[background-color:Highlight] forced-colors:data-[active=true]:text-[HighlightText]",
);

const checkClass = cn(
  "shrink-0 text-[color:var(--mq-check,#8a3b23)]",
  "forced-colors:text-[CanvasText] forced-colors:group-data-[active=true]:text-[HighlightText]",
);

const SR_ONLY =
  "absolute size-px overflow-hidden whitespace-nowrap border-0 p-0 [margin:-1px] [clip:rect(0,0,0,0)]";

export type MultiSelectOption = {
  /** Submitted/identity value. */
  value: string;
  /** Human-readable label shown in the chip and the option row. */
  label: string;
  disabled?: boolean;
};

export type MultiSelectProps = {
  /** The full set of choices. Filtering is a deterministic case-insensitive substring match on `label`. */
  options: MultiSelectOption[];
  /** Controlled selection (array of `option.value`). Pass with `onValueChange`. */
  value?: string[];
  /** Initial selection for the uncontrolled path. */
  defaultValue?: string[];
  /** Emits the next selection after every add/remove. */
  onValueChange?: (value: string[]) => void;
  material?: MultiSelectMaterial;
  variant?: MultiSelectVariant;
  size?: MultiSelectSize;
  /** Shown in the input while nothing is selected. */
  placeholder?: string;
  disabled?: boolean;
  /** Marks the control invalid. Drives `aria-invalid` and the error styling. */
  invalid?: boolean;
  /** Id for the combobox input; a `<label htmlFor>` should point here. */
  id?: string;
  /** Optional form field name; each selected value is submitted as a hidden input. */
  name?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  /** Forces the focused look for documentation previews. */
  "data-focus"?: "true" | "false";
};

function matches(option: MultiSelectOption, query: string) {
  if (query === "") return true;
  return option.label.toLowerCase().includes(query);
}

/**
 * The control.
 *
 * Uncontrolled by default; pass `value` + `onValueChange` to control the
 * selection. Holds interaction state (query, open, active option) locally, but
 * treats the selection itself the way a native control would: it is either the
 * caller's `value` or a single internal copy, never both.
 */
export function MultiSelect({
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  "data-focus": dataFocus,
  className,
  defaultValue,
  disabled = false,
  id,
  invalid = false,
  material = "clay",
  name,
  onValueChange,
  options,
  placeholder = "Select…",
  size = "md",
  value,
}: MultiSelectProps) {
  const generatedId = React.useId();
  const inputId = id ?? `${generatedId}-input`;
  const listboxId = `${generatedId}-listbox`;
  const liveId = `${generatedId}-live`;

  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] = React.useState<string[]>(() => defaultValue ?? []);
  const selected = isControlled ? value : internalSelected;

  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [announcement, setAnnouncement] = React.useState("");

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = React.useMemo(
    () => options.filter((option) => matches(option, normalizedQuery)),
    [options, normalizedQuery],
  );
  const clampedActive =
    filtered.length === 0 ? -1 : Math.min(Math.max(activeIndex, 0), filtered.length - 1);

  // Close when a pointer lands outside the whole widget.
  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted option in view as the virtual cursor moves — the list
  // scrolls (max-h + overflow-auto), so arrowing past the fold must bring the
  // active row back into view. Client-only (effect), so it never runs during SSR.
  React.useEffect(() => {
    if (!open || clampedActive < 0) return;
    const node = document.getElementById(`${listboxId}-opt-${clampedActive}`);
    node?.scrollIntoView({ block: "nearest" });
  }, [open, clampedActive, listboxId]);

  const labelFor = React.useCallback(
    (optionValue: string) => options.find((option) => option.value === optionValue)?.label ?? optionValue,
    [options],
  );

  const commit = React.useCallback(
    (next: string[], message: string) => {
      if (!isControlled) setInternalSelected(next);
      onValueChange?.(next);
      setAnnouncement(message);
    },
    [isControlled, onValueChange],
  );

  function toggle(optionValue: string) {
    const option = options.find((candidate) => candidate.value === optionValue);
    if (!option || option.disabled || disabled) return;
    const isSelected = selected.includes(optionValue);
    const next = isSelected
      ? selected.filter((current) => current !== optionValue)
      : [...selected, optionValue];
    commit(next, `${option.label} ${isSelected ? "removed" : "added"}. ${next.length} selected.`);
  }

  function removeValue(optionValue: string) {
    if (disabled) return;
    const next = selected.filter((current) => current !== optionValue);
    commit(next, `${labelFor(optionValue)} removed. ${next.length} selected.`);
  }

  function moveActive(direction: 1 | -1) {
    if (filtered.length === 0) return;
    let index = clampedActive < 0 ? -direction : clampedActive;
    for (let step = 0; step < filtered.length; step += 1) {
      index = (index + direction + filtered.length) % filtered.length;
      if (!filtered[index]?.disabled) {
        setActiveIndex(index);
        return;
      }
    }
  }

  function edgeActive(edge: "first" | "last") {
    if (filtered.length === 0) return;
    const order = edge === "first" ? filtered.map((_, i) => i) : filtered.map((_, i) => filtered.length - 1 - i);
    for (const index of order) {
      if (!filtered[index]?.disabled) {
        setActiveIndex(index);
        return;
      }
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) setOpen(true);
        else moveActive(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        if (!open) setOpen(true);
        else moveActive(-1);
        return;
      case "Home":
        if (open) {
          event.preventDefault();
          edgeActive("first");
        }
        return;
      case "End":
        if (open) {
          event.preventDefault();
          edgeActive("last");
        }
        return;
      case "Enter": {
        if (!open || clampedActive < 0) return;
        const option = filtered[clampedActive];
        if (option && !option.disabled) {
          event.preventDefault();
          toggle(option.value);
        }
        return;
      }
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      case "Backspace":
        if (query === "" && selected.length > 0) {
          event.preventDefault();
          removeValue(selected[selected.length - 1]);
        }
        return;
      default:
        return;
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setActiveIndex(0);
    if (!open) setOpen(true);
  }

  const activeDescendant = open && clampedActive >= 0 ? `${listboxId}-opt-${clampedActive}` : undefined;

  return (
    <div
      ref={rootRef}
      className={cn("relative w-full", MATERIAL_TOKENS[material], className)}
      data-material={material}
    >
      <div
        className={cn(controlVariants({ material, size }))}
        data-disabled={disabled ? "true" : undefined}
        data-focus={dataFocus}
        data-invalid={invalid ? "true" : undefined}
        onClick={() => {
          if (disabled) return;
          inputRef.current?.focus();
          setOpen(true);
        }}
      >
        {selected.map((optionValue) => {
          const optionLabel = labelFor(optionValue);
          return (
            <span key={optionValue} className={cn(chipClass, CHIP_SIZE[size])}>
              <span className="min-w-0 truncate">{optionLabel}</span>
              <button
                aria-label={`Remove ${optionLabel}`}
                className={cn(removeClass, REMOVE_SIZE[size])}
                disabled={disabled}
                onClick={(event) => {
                  event.stopPropagation();
                  removeValue(optionValue);
                  inputRef.current?.focus();
                }}
                onMouseDown={(event) => event.preventDefault()}
                tabIndex={disabled ? -1 : 0}
                type="button"
              >
                <X aria-hidden="true" className={REMOVE_ICON[size]} strokeWidth={2.5} />
              </button>
            </span>
          );
        })}

        <input
          ref={inputRef}
          aria-activedescendant={activeDescendant}
          aria-autocomplete="list"
          // The listbox is only in the DOM while open, so only reference it then —
          // a permanent aria-controls would be a dangling IDREF when collapsed.
          aria-controls={open ? listboxId : undefined}
          aria-describedby={ariaDescribedBy}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          autoComplete="off"
          className={cn(
            "min-w-[80px] flex-1 appearance-none border-0 bg-transparent p-0 outline-none",
            "[font-size:inherit] leading-[1.3]",
            "text-[color:var(--mq-text,#33261e)]",
            "placeholder:text-[color:var(--mq-placeholder,#6a5346)]",
            "disabled:cursor-not-allowed",
          )}
          disabled={disabled}
          id={inputId}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? placeholder : ""}
          role="combobox"
          type="text"
          value={query}
        />
      </div>

      {open ? (
        <ul
          aria-label={ariaLabel ?? "Options"}
          aria-multiselectable="true"
          className={cn(panelClass, PANEL_SIZE[size])}
          id={listboxId}
          role="listbox"
        >
          {filtered.length === 0 ? (
            <li
              className={cn(
                "select-none text-[color:var(--mq-placeholder,#6a5346)]",
                OPTION_SIZE[size],
              )}
              role="presentation"
            >
              No matches
            </li>
          ) : (
            filtered.map((option, index) => {
              const isSelected = selected.includes(option.value);
              const isActive = index === clampedActive;
              return (
                <li
                  key={option.value}
                  aria-disabled={option.disabled || undefined}
                  aria-selected={isSelected}
                  className={cn(optionClass, OPTION_SIZE[size])}
                  data-active={isActive ? "true" : undefined}
                  id={`${listboxId}-opt-${index}`}
                  onClick={() => {
                    if (!option.disabled) toggle(option.value);
                  }}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                >
                  <span className={cn("flex shrink-0 items-center justify-center", CHECK_SIZE[size])}>
                    {isSelected ? (
                      <Check aria-hidden="true" className={checkClass} strokeWidth={3} />
                    ) : null}
                  </span>
                  <span className="min-w-0 truncate">{option.label}</span>
                </li>
              );
            })
          )}
        </ul>
      ) : null}

      {/* Selection changes are announced here, so they reach a screen reader even
          when the bare control is used without a field wrapper. */}
      <span aria-live="polite" className={SR_ONLY} id={liveId}>
        {announcement}
      </span>

      {name && !disabled
        ? selected.map((optionValue) => (
            <input key={optionValue} name={name} type="hidden" value={optionValue} />
          ))
        : null}
    </div>
  );
}

const LABEL =
  // `currentColor`: the label sits on the host's surface, not on one of ours, so
  // pinning a colour would be guessing at the page it lands on.
  "text-[color:currentColor] text-[length:12px] leading-[1.3] font-extrabold tracking-[-0.01em]";

export type MultiSelectFieldProps = MultiSelectProps & {
  /** Visible label. Rendered as a real `<label htmlFor>` bound to the combobox. */
  label: React.ReactNode;
  /** Guidance shown under the control while it is valid. */
  helperText?: React.ReactNode;
  /** Error shown instead of `helperText`. Its presence implies `invalid`. */
  errorText?: React.ReactNode;
  /** Class for the field wrapper. `className` still targets the control. */
  fieldClassName?: string;
};

/**
 * Label + control + message, wired together.
 *
 * The message region is always mounted, even when empty: an `aria-live` region
 * has to exist in the DOM before its text arrives for the announcement to be
 * reliable. `aria-describedby` is composed rather than overwritten, so a
 * caller's own description survives.
 */
export function MultiSelectField({
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
}: MultiSelectFieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? `${generatedId}-input`;
  const messageId = `${generatedId}-message`;
  const hasError = typeof errorText === "string" ? errorText.trim() !== "" : errorText != null;
  const isInvalid = invalid || hasError;
  const message = hasError ? errorText : helperText;

  const describedBy = [props["aria-describedby"], message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[6px] text-left",
        // Repeated here for the message, which is a sibling of the control and so
        // cannot inherit `--mq-error` from it.
        MATERIAL_TOKENS[material],
        fieldClassName,
      )}
    >
      <label className={LABEL} htmlFor={controlId}>
        {label}
      </label>
      <MultiSelect
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
          "m-0 text-[length:11px] leading-[1.5]",
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

export { controlVariants };
