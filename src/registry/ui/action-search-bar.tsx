"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { Search, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Action Search Bar
 *
 * A search field that drops an opaque panel of filtered actions on focus and on
 * typing. Self-contained by design: all four material recipes live in this file,
 * every local custom property carries a literal fallback, and no class comes from
 * the site's global stylesheet, so copying this file (plus `src/lib/cn.ts`)
 * reproduces the full look.
 *
 * Why hand-rolled ARIA here, when Input and Select lean on native controls:
 *
 * There is no native element for "a text box that owns a popup list of
 * suggestions you steer with the arrow keys while the caret stays put". That is
 * the ARIA 1.2 combobox pattern, and it has to be built. The rules it must keep,
 * all wired below:
 *
 *   - the text box carries `role="combobox"`, `aria-expanded`, `aria-controls`
 *     pointing at the list, `aria-autocomplete="list"`, and — when a row is
 *     active — `aria-activedescendant` naming that row's id;
 *   - DOM focus never leaves the input. ArrowUp/ArrowDown move a *virtual*
 *     cursor (`aria-activedescendant`), not real focus, so a screen reader reads
 *     the active row while the caret stays where the user is typing;
 *   - Enter activates the active row, Escape dismisses the list (and clears the
 *     query once the list is already closed), a pointer press activates a row,
 *     and blur closes the list;
 *   - the listbox is labelled, the active row is marked with `aria-selected` and
 *     a data attribute (styled, and given a non-colour cue), and a polite live
 *     region announces how many results the query matched.
 *
 * Local theming knobs (declared on the field wrapper so the input, the icon, the
 * panel and every row can read them):
 *
 *   --mq-field         input background
 *   --mq-grad          material lighting over the input surface
 *   --mq-edge          tactile contact edge, drawn as a zero-blur shadow layer
 *   --mq-brd           resting input border
 *   --mq-brd-focus     input border once focused
 *   --mq-text          typed text
 *   --mq-placeholder   placeholder text
 *   --mq-ring          focus ring
 *   --mq-error         error border + error message
 *   --mq-radius        corner radius (set by size)
 *   --mq-surface       OPAQUE panel background — a popup can never be translucent
 *   --mq-panel-brd     panel border
 *   --mq-icon          the search glyph and row icons
 *   --mq-option-text   a resting row's label
 *   --mq-shortcut      a row's shortcut hint (held to the same 4.5:1 as the label)
 *   --mq-active        the active row's background
 *   --mq-active-text   the active row's label
 *   --mq-active-bar    the active row's inline-start accent bar (a non-colour cue)
 *
 * Contrast contract: typed text and placeholder both measure at or above 4.5:1
 * against the input surface on every material; each row's label, its shortcut
 * hint and the search glyph clear 4.5:1 against both the resting panel surface
 * and the active-row background — shortcut hints are held to the body-text bar,
 * not the softer one a decorative grey usually gets. The glass panel uses an
 * opaque stand-in surface, because a translucent popup would fail over a busy
 * backdrop.
 */

/**
 * Palette per material, as local custom properties only — no layout, no
 * decoration. Applied to the field wrapper so both the control and its siblings
 * (the panel, the rows, the message) resolve the same material.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-field:#f7e9de] [--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.38),rgba(151,92,58,0.06))]",
    "[--mq-edge:#dcc4b2] [--mq-brd:rgba(120,80,55,0.30)] [--mq-brd-focus:#c9482f]",
    "[--mq-text:#33261e] [--mq-placeholder:#6a5346] [--mq-ring:#171817] [--mq-error:#9c2f22]",
    "[--mq-surface:#f7e9de] [--mq-panel-brd:rgba(120,80,55,0.30)] [--mq-icon:#5c463a]",
    "[--mq-option-text:#33261e] [--mq-shortcut:#6a5346]",
    "[--mq-active:#ecd6c2] [--mq-active-text:#33261e] [--mq-active-bar:#c9482f]",
  ].join(" "),
  glass: [
    "[--mq-field:rgba(255,255,255,0.66)] [--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
    "[--mq-edge:rgba(255,255,255,0.86)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-brd-focus:rgba(255,255,255,0.98)]",
    "[--mq-text:#1e1e1b] [--mq-placeholder:#36362f] [--mq-ring:#171817] [--mq-error:#8f2a1e]",
    // Opaque stand-in for the popup, which cannot be translucent over anything.
    "[--mq-surface:#f4f7f8] [--mq-panel-brd:rgba(23,24,23,0.18)] [--mq-icon:#2c2c26]",
    "[--mq-option-text:#1e1e1b] [--mq-shortcut:#3a3a33]",
    "[--mq-active:#dde8ec] [--mq-active-text:#1e1e1b] [--mq-active-bar:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-field:#e6e3da] [--mq-grad:linear-gradient(180deg,#f2efe7,#dcd8ce)]",
    "[--mq-edge:#a8a49b] [--mq-brd:rgba(25,25,23,0.52)] [--mq-brd-focus:rgba(25,25,23,0.60)]",
    "[--mq-text:#23231f] [--mq-placeholder:#4a4943] [--mq-ring:#171817] [--mq-error:#8f2a1e]",
    "[--mq-surface:#e6e3da] [--mq-panel-brd:rgba(25,25,23,0.34)] [--mq-icon:#3f3e39]",
    "[--mq-option-text:#23231f] [--mq-shortcut:#4a4943]",
    "[--mq-active:#d3cfc4] [--mq-active-text:#23231f] [--mq-active-bar:#5b5852]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  // Safe here because both the input and the panel are opaque surfaces that flip
  // together with their text.
  adaptive: [
    "[--mq-field:#ffffff] [--mq-grad:none]",
    "[--mq-edge:transparent] [--mq-brd:rgba(23,24,23,0.22)] [--mq-brd-focus:#171817]",
    "[--mq-text:#1c1c19] [--mq-placeholder:#55554e] [--mq-ring:#171817] [--mq-error:#9c2f22]",
    "[--mq-surface:#ffffff] [--mq-panel-brd:rgba(23,24,23,0.18)] [--mq-icon:#494942]",
    "[--mq-option-text:#1c1c19] [--mq-shortcut:#55554e]",
    "[--mq-active:#eceae4] [--mq-active-text:#1c1c19] [--mq-active-bar:#171817]",
    "dark:[--mq-field:#232327] dark:[--mq-surface:#232327] dark:[--mq-panel-brd:rgba(255,255,255,0.20)]",
    "dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-brd-focus:#f1efe9]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-placeholder:#b9b7b0] dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
    "dark:[--mq-icon:#c8c6bf] dark:[--mq-option-text:#f1efe9] dark:[--mq-shortcut:#b9b7b0]",
    "dark:[--mq-active:#33333a] dark:[--mq-active-text:#f1efe9] dark:[--mq-active-bar:#f1efe9]",
  ].join(" "),
} as const;

/**
 * Tactile depth for the input, one recipe per material.
 *
 * Copied verbatim from Input: each recipe keeps the SAME number of shadow layers
 * in the SAME inset order across rest, hover and focus, so `box-shadow`
 * interpolates the focus well rather than swapping two incompatible lists. At
 * rest the field sits proud, hover lifts it, focus presses it into a well.
 * Written out in full — Tailwind scans source text, so a class name produced by
 * interpolation is one it never emits.
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

type SearchMaterial = keyof typeof MATERIAL_TOKENS;
type SearchSize = "sm" | "md" | "lg";

const searchInputVariants = cva(
  [
    "block w-full appearance-none border",
    "rounded-[var(--mq-radius,13px)] border-[var(--mq-brd,rgba(120,80,55,0.30))]",
    "[background-color:var(--mq-field,#f7e9de)] [background-image:var(--mq-grad,none)]",
    "text-[color:var(--mq-text,#33261e)]",
    "placeholder:text-[color:var(--mq-placeholder,#6a5346)]",
    // Exactly the properties that change across states — nothing phantom. The
    // background never moves (there is a single treatment, so it is not listed);
    // border-color moves on focus and error, box-shadow on hover and focus,
    // backdrop-filter on glass hover, opacity when disabled. No `translate` /
    // `transform` here, so the translate trap cannot bite this element; the panel
    // below is where translate lives.
    "transition-[border-color,box-shadow,backdrop-filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "focus-visible:border-[var(--mq-brd-focus,#c9482f)]",
    "data-[focus=true]:border-[var(--mq-brd-focus,#c9482f)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Forced colours drop every fill and shadow; a system border keeps the
    // field's bounds and its invalid state perceivable.
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
        // Inline-start padding reserves the search glyph's lane; logical
        // properties throughout so the whole control mirrors under RTL.
        sm: "[--mq-radius:10px] h-[34px] ps-[32px] pe-[10px] text-[12px]/[1.3]",
        md: "[--mq-radius:13px] h-[42px] ps-[40px] pe-[13px] text-[13px]/[1.3]",
        lg: "[--mq-radius:16px] h-[50px] ps-[46px] pe-[16px] text-[14px]/[1.3]",
      },
    },
    defaultVariants: { material: "clay", size: "md" },
  },
);

const searchIconVariants = cva(
  [
    "pointer-events-none absolute inset-y-0 flex items-center",
    "text-[color:var(--mq-icon,#5c463a)]",
    "forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "start-[10px] [&>svg]:size-[15px]",
        md: "start-[13px] [&>svg]:size-[17px]",
        lg: "start-[16px] [&>svg]:size-[19px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const panelVariants = cva(
  [
    "absolute inset-x-0 top-[calc(100%+6px)] z-50",
    "overflow-hidden border",
    "border-[var(--mq-panel-brd,rgba(120,80,55,0.30))]",
    "[background-color:var(--mq-surface,#f7e9de)]",
    "shadow-[0_12px_30px_rgba(20,20,18,0.18),0_2px_6px_rgba(20,20,18,0.10)]",
    // Opacity and a short slide open the panel. `translate-y-*` writes the
    // standalone `translate` property in Tailwind v4, so the transition names
    // `translate` literally — never `transform`, which would animate nothing.
    // Only the two properties a state actually changes are listed.
    "transition-[opacity,translate] duration-200 ease-out",
    "motion-reduce:transition-none",
    "data-[open=false]:pointer-events-none data-[open=false]:opacity-0 data-[open=false]:-translate-y-[6px]",
    "data-[open=true]:opacity-100 data-[open=true]:translate-y-0",
    // Forced colours discard the fill and the elevation shadow; a system surface
    // and border keep the popup readable and bounded.
    "forced-colors:border-[CanvasText] forced-colors:shadow-none forced-colors:[background-color:Canvas]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "rounded-[10px]",
        md: "rounded-[13px]",
        lg: "rounded-[16px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const optionVariants = cva(
  [
    "group/opt flex w-full items-center gap-[10px] px-[12px]",
    "cursor-pointer select-none rounded-[8px]",
    "text-[color:var(--mq-option-text,#33261e)]",
    "[background-color:transparent]",
    // Only the two properties a state changes: the row background and the
    // accent-bar shadow. The label colour is not listed — it holds across the
    // resting and active rows, so transitioning it would fire on nothing.
    "transition-[background-color,box-shadow] duration-150 ease-out",
    "motion-reduce:transition-none",
    // The active row carries THREE cues, so state is never colour alone: a
    // background, a label colour, and an inline-start accent bar drawn as an
    // inset shadow (a shape/position cue that survives desaturation).
    "data-[active=true]:[background-color:var(--mq-active,#ecd6c2)]",
    "data-[active=true]:text-[color:var(--mq-active-text,#33261e)]",
    "data-[active=true]:shadow-[inset_3px_0_0_var(--mq-active-bar,#c9482f)]",
    // Forced colours: the active row is the OS selection colour; the bar shadow
    // is discarded but Highlight/HighlightText carry the state on their own.
    "forced-colors:data-[active=true]:[background-color:Highlight]",
    "forced-colors:data-[active=true]:text-[HighlightText]",
    "forced-colors:data-[active=true]:shadow-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-[34px] py-[6px] text-[12px]/[1.3]",
        md: "min-h-[40px] py-[8px] text-[13px]/[1.3]",
        lg: "min-h-[46px] py-[10px] text-[14px]/[1.3]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** One selectable action: a stable id, a label, an optional icon and hint. */
export type ActionSearchOption = {
  /** Stable, unique key. Also seeds the row's DOM id. */
  id: string;
  /** Visible, filterable text. */
  label: string;
  /** Optional leading glyph. Inherits the row's colour, so contrast follows it. */
  icon?: LucideIcon;
  /** Optional trailing hint, e.g. a keyboard shortcut. */
  shortcut?: string;
};

/** Case-insensitive substring match, preserving the caller's order. */
function filterOptions(options: readonly ActionSearchOption[], query: string): ActionSearchOption[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") return [...options];
  return options.filter((option) => option.label.toLowerCase().includes(needle));
}

const LABEL =
  "text-[color:currentColor] text-[length:12px] leading-[1.3] font-extrabold tracking-[-0.01em]";

export type ActionSearchBarProps = Omit<
  React.ComponentPropsWithRef<"input">,
  "size" | "value" | "defaultValue" | "type" | "onSelect" | "onChange" | "role"
> & {
  /** The actions to search over. Filtered case-insensitively by their label. */
  options: readonly ActionSearchOption[];
  material?: SearchMaterial;
  size?: SearchSize;
  /** Marks the control invalid. Drives `aria-invalid` and the error styling. */
  invalid?: boolean;
  /** Visible label. Rendered as a real `<label htmlFor>` when provided. */
  label?: React.ReactNode;
  /** Accessible name for the listbox itself. */
  listLabel?: string;
  /** Shown in the panel when the query matches nothing. */
  emptyMessage?: string;
  /** Guidance under the control while valid. */
  helperText?: React.ReactNode;
  /** Error under the control. Its presence implies `invalid`. */
  errorText?: React.ReactNode;
  /** Seeds the query for the uncontrolled input. */
  defaultValue?: string;
  /** Opens the panel on first render (used by docs previews). */
  defaultOpen?: boolean;
  /** Fires when a row is chosen by Enter or by pointer. */
  onSelect?: (option: ActionSearchOption) => void;
  /** Fires whenever the query text changes. */
  onQueryChange?: (query: string) => void;
  /** Class for the field wrapper. `className` still targets the input. */
  fieldClassName?: string;
};

/**
 * The search bar.
 *
 * The query is owned internally (uncontrolled), seeded by `defaultValue`. The
 * component holds only what a combobox genuinely needs: the query, whether the
 * panel is open, and which row is virtually active.
 */
export function ActionSearchBar({
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  className,
  defaultOpen = false,
  defaultValue = "",
  disabled = false,
  emptyMessage = "No matching actions",
  errorText,
  fieldClassName,
  helperText,
  id,
  invalid = false,
  label,
  listLabel = "Actions",
  material = "clay",
  onQueryChange,
  onSelect,
  options,
  placeholder = "Search actions…",
  size = "md",
  ...props
}: ActionSearchBarProps) {
  const generatedId = React.useId();
  const inputId = id ?? `${generatedId}-input`;
  const listId = `${generatedId}-list`;
  const statusId = `${generatedId}-status`;
  const messageId = `${generatedId}-message`;
  const optionDomId = React.useCallback((index: number) => `${listId}-opt-${index}`, [listId]);

  const [query, setQuery] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(defaultOpen);
  const [activeIndex, setActiveIndex] = React.useState(defaultOpen ? 0 : -1);

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const filtered = React.useMemo(() => filterOptions(options, query), [options, query]);

  const hasError = typeof errorText === "string" ? errorText.trim() !== "" : errorText != null;
  const isInvalid = invalid || hasError;
  const message = hasError ? errorText : helperText;
  // `activeValid` gates every read of `activeIndex` (the descendant id below,
  // the scroll effect, and `activate`, which also guards `filtered[index]`), so
  // a cursor left pointing past a shortened list is simply treated as "no active
  // option" until the next keystroke — and typing resets it to -1 in
  // `handleChange` anyway, which is the only path that shrinks `filtered` from
  // user input. That makes a setState-in-effect clamp unnecessary.
  const activeValid = activeIndex >= 0 && activeIndex < filtered.length;
  const activeDescendant = open && activeValid ? optionDomId(activeIndex) : undefined;

  // Scroll the active row into view as the virtual cursor moves. Client-only
  // (effect), so it never runs during SSR.
  React.useEffect(() => {
    if (!open || !activeValid) return;
    const node = document.getElementById(optionDomId(activeIndex));
    node?.scrollIntoView({ block: "nearest" });
  }, [open, activeValid, activeIndex, optionDomId]);

  const statusText = open
    ? filtered.length === 0
      ? emptyMessage
      : `${filtered.length} result${filtered.length === 1 ? "" : "s"} available`
    : "";

  const describedBy = [ariaDescribedBy, message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  const accessibleName = label == null ? (ariaLabel ?? "Search") : undefined;

  function activate(index: number) {
    const option = filtered[index];
    if (!option) return;
    setQuery(option.label);
    onQueryChange?.(option.label);
    onSelect?.(option);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setOpen(true);
    setActiveIndex(-1);
    onQueryChange?.(event.target.value);
  }

  function moveActive(delta: number) {
    if (filtered.length === 0) return;
    setOpen(true);
    setActiveIndex((current) => {
      const base = current < 0 ? (delta > 0 ? -1 : 0) : current;
      return (base + delta + filtered.length) % filtered.length;
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        return;
      case "Home":
        if (open && filtered.length > 0) {
          event.preventDefault();
          setActiveIndex(0);
        }
        return;
      case "End":
        if (open && filtered.length > 0) {
          event.preventDefault();
          setActiveIndex(filtered.length - 1);
        }
        return;
      case "Enter":
        if (open && activeValid) {
          event.preventDefault();
          activate(activeIndex);
        }
        return;
      case "Escape":
        // Dismiss the list if it is showing; once it is closed, a further press
        // clears the query — the APG combobox behaviour.
        event.preventDefault();
        if (open) {
          setOpen(false);
          setActiveIndex(-1);
        } else if (query !== "") {
          setQuery("");
          onQueryChange?.("");
        }
        return;
      default:
        return;
    }
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (wrapperRef.current?.contains(event.relatedTarget as Node | null)) return;
    setOpen(false);
    setActiveIndex(-1);
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[6px] text-left",
        MATERIAL_TOKENS[material],
        fieldClassName,
      )}
      onBlur={handleBlur}
    >
      {label != null ? (
        <label className={LABEL} htmlFor={inputId}>
          {label}
        </label>
      ) : null}

      <div className="relative w-full" ref={wrapperRef}>
        <span aria-hidden="true" className={cn(searchIconVariants({ size }))}>
          <Search />
        </span>

        <input
          {...props}
          aria-activedescendant={activeDescendant}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-describedby={describedBy || undefined}
          aria-expanded={open}
          aria-invalid={isInvalid || undefined}
          aria-label={accessibleName}
          autoComplete="off"
          className={cn(searchInputVariants({ material, size }), className)}
          data-material={material}
          disabled={disabled}
          id={inputId}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          role="combobox"
          type="text"
          value={query}
        />

        <div className={cn(panelVariants({ size }))} data-open={open}>
          <ul
            aria-label={listLabel}
            className="m-0 max-h-[280px] list-none overflow-y-auto overscroll-contain p-[5px]"
            id={listId}
            role="listbox"
          >
            {/*
              Options are rendered only while open. The panel wrapper stays
              mounted for the open/close transition, but leaving the rows in the
              DOM while collapsed would expose a listbox that aria-expanded=false
              says is not there — so a screen reader browsing the page could
              wander into hidden options. An empty listbox when collapsed is the
              honest state.
            */}
            {open &&
              filtered.map((option, index) => {
              const Icon = option.icon;
              const isActive = index === activeIndex;
              return (
                <li
                  aria-selected={isActive}
                  className={cn(optionVariants({ size }))}
                  data-active={isActive || undefined}
                  id={optionDomId(index)}
                  key={option.id}
                  onClick={() => activate(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  // Keep DOM focus in the input: a press on a row must not blur
                  // the field, or the panel would close before the click lands.
                  onMouseDown={(event) => event.preventDefault()}
                  role="option"
                >
                  {Icon ? <Icon aria-hidden="true" className="size-[16px] shrink-0" /> : null}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {option.shortcut ? (
                    <kbd
                      className={cn(
                        "ms-auto shrink-0 [font-family:inherit] text-[length:11px] font-semibold tracking-[0.02em] tabular-nums",
                        "text-[color:var(--mq-shortcut,#6a5346)]",
                        "forced-colors:text-[CanvasText]",
                        "forced-colors:group-data-[active=true]/opt:text-[HighlightText]",
                      )}
                    >
                      {option.shortcut}
                    </kbd>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {open && filtered.length === 0 ? (
            <p className="m-0 px-[14px] py-[12px] text-[length:12px] text-[color:var(--mq-placeholder,#6a5346)]">
              {emptyMessage}
            </p>
          ) : null}
        </div>
      </div>

      {/*
        Two always-mounted live regions. The status counts results for the
        combobox; the message carries helper or error text. Both must exist in
        the DOM before their text arrives for the announcement to be reliable,
        so neither is conditionally rendered.
      */}
      <span aria-live="polite" className="sr-only" id={statusId} role="status">
        {statusText}
      </span>
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

export { searchInputVariants, panelVariants, optionVariants };
