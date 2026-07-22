"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Tags Input
 *
 * A field that collects a list of short tokens. Type and press Enter or comma
 * to add a chip, press Backspace on an empty input to delete the last chip, or
 * paste a comma-separated list to add several at once. Self-contained by design:
 * all four material recipes live in this file, every local custom property
 * carries a literal fallback, and no class comes from the site's global
 * stylesheet — copying this file plus `src/lib/cn.ts` reproduces the full look.
 *
 * Two exports, mirroring Input and Select:
 *
 *   <TagsInput>       the control: the field-like container that holds the
 *                     chips and a real <input>. `className` targets the <input>.
 *   <TagsInputField>  label + control, with the `htmlFor` wiring done for you.
 *
 * Why native at the core: the thing you type into is a real <input>, so caret
 * movement, selection, IME composition, autofill suppression and the mobile
 * keyboard are the browser's, not a reimplementation. Only the surrounding
 * chrome — the chips, their remove buttons and the field surface — is drawn
 * here, and each removable chip is a real <button> so it is reachable and
 * operable from the keyboard.
 *
 * Local theming knobs (same vocabulary as Input, so the two sit together):
 *
 *   --mq-field         container background
 *   --mq-field-strong  chip background (a chip sits slightly proud of the field)
 *   --mq-grad          material lighting over the container surface
 *   --mq-grad-strong   material lighting over a chip
 *   --mq-edge          tactile contact edge
 *   --mq-brd           resting border
 *   --mq-brd-focus     border once focused
 *   --mq-text          typed text and chip text
 *   --mq-placeholder   placeholder text
 *   --mq-ring          focus ring
 *   --mq-error         error border + error message
 *   --mq-radius        corner radius (set by size)
 *
 * Contrast contract: typed text, placeholder and chip text all measure at or
 * above 4.5:1 against the surface they sit on, on every material — the same
 * values Input uses, which meet that bar. The remove glyph is informative, so it
 * inherits the same text colour rather than the softer grey decoration gets.
 */

/**
 * Palette per material, as local custom properties only — no layout, no
 * decoration. Copied verbatim from Input so the two fields are visually of a
 * piece and a Tags Input dropped next to a text field reads as the same
 * material. Declared on the outer wrapper so the message — a sibling of the
 * container, not a descendant — can still resolve the material's `--mq-error`.
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
 * Tactile depth per material, reused from Input's focus-well story.
 *
 * Each recipe keeps the same number of shadow layers, in the same inset order,
 * across rest, hover and focus, so `box-shadow` interpolates the well rather
 * than swapping two incompatible lists discretely. The one change from Input is
 * the trigger: focus lives on the inner <input>, not on the surface, so the well
 * is driven by `focus-within` (and by `data-[focus=true]` when a preview forces
 * it) instead of `focus-visible`. The literal shadow values are Input's own.
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

type TagsInputMaterial = keyof typeof MATERIAL_TOKENS;
type TagsInputVariant = "default";
type TagsInputSize = "sm" | "md" | "lg";

const containerVariants = cva(
  [
    "flex w-full flex-wrap items-center border cursor-text",
    "rounded-[var(--mq-radius,13px)] border-[var(--mq-brd,rgba(120,80,55,0.30))]",
    "[background-color:var(--mq-field,#f7e9de)]",
    "[background-image:var(--mq-grad,none)]",
    // Exactly the properties that change across states — nothing phantom. The
    // border colour moves on focus and on error, the shadow on hover and focus,
    // the backdrop filter on glass hover, and opacity when disabled. The
    // background never changes on the container (only chips supply the strong
    // surface), so it is deliberately absent from the list.
    "transition-[border-color,box-shadow,backdrop-filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    // The surface's own reaction to focus: border to the focus colour plus the
    // material well from DEPTH. `focus-within` because focus lands on the inner
    // input; `data-[focus=true]` lets a preview force the same look.
    "focus-within:border-[var(--mq-brd-focus,#c9482f)]",
    "data-[focus=true]:border-[var(--mq-brd-focus,#c9482f)]",
    // The keyboard affordance of record: a 2px outline drawn only when the text
    // input itself is `:focus-visible`, so tabbing onto a chip's remove button
    // shows that button's own ring without also ringing the whole field. Never
    // removed — it is scoped, not suppressed.
    "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-[2px]",
    "has-[input:focus-visible]:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:has-[input:focus-visible]:outline-[Highlight]",
    "forced-colors:data-[focus=true]:outline-[Highlight]",
    // Forced colours drop every fill and shadow, so a field styled only by its
    // background would vanish. A system-coloured border keeps the bounds, and
    // the material gradient is cleared by hand because background *images* are
    // preserved untouched.
    "forced-colors:border-[CanvasText] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:backdrop-filter-none",
    // `aria-invalid` is the single source of truth for the error look: the same
    // computed invalidity is placed on this container and on the input, so what
    // is shown and what assistive tech is told cannot drift apart.
    "aria-[invalid=true]:border-[var(--mq-error,#9c2f22)]",
    "aria-[invalid=true]:has-[input:focus-visible]:outline-[var(--mq-error,#9c2f22)]",
    "aria-[invalid=true]:data-[focus=true]:outline-[var(--mq-error,#9c2f22)]",
    "forced-colors:aria-[invalid=true]:border-[Mark]",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-55",
  ].join(" "),
  {
    variants: {
      material: {
        clay: `${MATERIAL_TOKENS.clay} ${DEPTH.clay.rest} ${DEPTH.clay.hover} ${DEPTH.clay.focus}`,
        glass: `${MATERIAL_TOKENS.glass} backdrop-blur-[18px] backdrop-saturate-[170%] ${DEPTH.glass.rest} ${DEPTH.glass.hover} ${DEPTH.glass.focus}`,
        skeuo: `${MATERIAL_TOKENS.skeuo} ${DEPTH.skeuo.rest} ${DEPTH.skeuo.hover} ${DEPTH.skeuo.focus}`,
        adaptive: `${MATERIAL_TOKENS.adaptive} ${DEPTH.adaptive.rest} ${DEPTH.adaptive.hover} ${DEPTH.adaptive.focus} pointer-coarse:min-h-[48px]`,
      },
      size: {
        sm: "[--mq-radius:10px] min-h-[34px] gap-[4px] p-[4px] ps-[6px]",
        md: "[--mq-radius:13px] min-h-[42px] gap-[5px] p-[5px] ps-[8px]",
        lg: "[--mq-radius:16px] min-h-[50px] gap-[6px] p-[7px] ps-[10px]",
      },
      variant: {
        default: "",
      },
    },
    defaultVariants: { material: "clay", size: "md", variant: "default" },
  },
);

const chipVariants = cva(
  [
    "inline-flex max-w-full items-center border",
    "rounded-[calc(var(--mq-radius,13px)-4px)]",
    "border-[var(--mq-brd,rgba(120,80,55,0.30))]",
    "[background-color:var(--mq-field-strong,#efd9c8)]",
    "[background-image:var(--mq-grad-strong,none)]",
    "text-[color:var(--mq-text,#33261e)] font-semibold",
    "shadow-[0_1px_0_rgba(255,255,255,0.35),0_1px_2px_rgba(20,20,18,0.10)]",
    // Chip entrance: `@starting-style` (Tailwind's `starting:` variant) gives a
    // newly inserted chip a from-state the browser transitions out of, with no
    // JavaScript timers or mount flags — so it is SSR-safe and, if the variant
    // is unsupported, the chip simply appears at its final state. The transition
    // names `translate` (not `transform`): Tailwind v4 writes `translate-*` to
    // the standalone `translate` property, so naming `transform` would animate
    // nothing. reduced-motion removes the travel; the chip still appears.
    "translate-y-0 opacity-100",
    "starting:translate-y-[3px] starting:opacity-0",
    "transition-[opacity,translate] duration-200 ease-out",
    "motion-reduce:transition-none",
    "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]",
    "forced-colors:[background-image:none] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "gap-[3px] px-[6px] py-[2px] text-[11px]/[1.3]",
        md: "gap-[4px] px-[8px] py-[3px] text-[12px]/[1.3]",
        lg: "gap-[5px] px-[10px] py-[4px] text-[13px]/[1.3]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const removeButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-full",
    "text-[color:var(--mq-text,#33261e)]",
    "transition-[background-color,color] duration-150 ease-out",
    "motion-reduce:transition-none",
    "hover:[background-color:var(--mq-error,#9c2f22)] hover:text-[color:#ffffff]",
    "focus-visible:outline-2 focus-visible:outline-offset-[1px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "focus-visible:[background-color:var(--mq-error,#9c2f22)] focus-visible:text-[color:#ffffff]",
    "disabled:cursor-not-allowed disabled:opacity-55",
    "forced-colors:text-[CanvasText] forced-colors:focus-visible:outline-[Highlight]",
    "forced-colors:hover:text-[Highlight]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-[15px] pointer-coarse:size-[22px]",
        md: "size-[17px] pointer-coarse:size-[24px]",
        lg: "size-[19px] pointer-coarse:size-[26px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const inputControlVariants = cva(
  [
    "min-w-[80px] flex-1 appearance-none border-0 bg-transparent p-0 outline-none",
    "text-[color:var(--mq-text,#33261e)]",
    "placeholder:text-[color:var(--mq-placeholder,#6a5346)]",
    "disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-[24px] text-[12px]/[1.3]",
        md: "min-h-[28px] text-[13px]/[1.3]",
        lg: "min-h-[32px] text-[14px]/[1.3]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const REMOVE_GLYPH = {
  sm: "size-[11px]",
  md: "size-[13px]",
  lg: "size-[15px]",
} as const;

const LABEL =
  // `currentColor`: the label sits on the host's surface, not on one of ours,
  // so pinning a colour would be guessing at the page it lands on.
  "text-[color:currentColor] text-[length:12px] leading-[1.3] font-extrabold tracking-[-0.01em]";

const MESSAGE = "m-0 text-[length:11px] leading-[1.5]";

const VISUALLY_HIDDEN =
  "absolute -m-px h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0,0,0,0)]";

/** Trim, drop empties, and dedupe while preserving first-seen order. */
function normalizeTags(tags: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of tags) {
    const tag = raw.trim();
    if (tag.length === 0 || seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }
  return result;
}

export type TagsInputProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  // `onKeyDown`/`onPaste` are the component's own behaviour (Enter/comma to add,
  // Backspace to remove, paste to split), so they are omitted rather than left
  // in the contract where a caller-supplied handler would be silently dropped.
  "size" | "value" | "defaultValue" | "onChange" | "children" | "onKeyDown" | "onPaste"
> & {
  material?: TagsInputMaterial;
  variant?: TagsInputVariant;
  size?: TagsInputSize;
  /** Marks the field invalid. Drives `aria-invalid` and the error styling. */
  invalid?: boolean;
  /** Controlled tag list. Pass with `onTagsChange` to own the value. */
  value?: string[];
  /** Initial tags for the uncontrolled path. Normalised on mount. */
  defaultValue?: string[];
  /** Fires with the next tag list after every add or remove. */
  onTagsChange?: (tags: string[]) => void;
  /** Upper bound on the number of tags. Further additions are rejected. */
  maxTags?: number;
  /** Guidance under the field while valid. */
  helperText?: React.ReactNode;
  /** Error shown instead of `helperText`. Its presence implies invalid. */
  errorText?: React.ReactNode;
  /** Class for the container. `className` still targets the inner <input>. */
  containerClassName?: string;
  /** Forces the focused look (well + ring) for documentation previews. */
  "data-focus"?: "true" | "false";
};

/**
 * The control.
 *
 * Uncontrolled by default: it seeds itself from `defaultValue` and owns the
 * list thereafter. Pass `value` + `onTagsChange` to control it instead. The
 * typed text is always internal state, kept separate from the committed tags.
 */
export function TagsInput({
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  "data-focus": dataFocus,
  className,
  containerClassName,
  defaultValue,
  disabled = false,
  errorText,
  helperText,
  id,
  invalid = false,
  material = "clay",
  maxTags,
  name,
  onTagsChange,
  placeholder,
  size = "md",
  value,
  variant = "default",
  ...rest
}: TagsInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? `${generatedId}-input`;
  const guidanceId = `${generatedId}-guidance`;
  const messageId = `${generatedId}-message`;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const controlled = value !== undefined;
  const [uncontrolledTags, setUncontrolledTags] = React.useState<string[]>(() =>
    normalizeTags(defaultValue ?? []),
  );
  // `?? ` rather than `controlled ? value : …` so `tags` narrows to `string[]`;
  // a controlled empty array is still honoured, since `??` only falls back on
  // null/undefined.
  const tags = value ?? uncontrolledTags;

  const [text, setText] = React.useState("");
  const [announcement, setAnnouncement] = React.useState("");
  const [rejection, setRejection] = React.useState<string | null>(null);

  const hasFieldError =
    typeof errorText === "string" ? errorText.trim() !== "" : errorText != null;
  const isInvalid = invalid || hasFieldError || rejection != null;
  const message = hasFieldError ? errorText : (rejection ?? helperText);

  const describedBy = [ariaDescribedBy, guidanceId, message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  function commit(next: string[]) {
    if (!controlled) setUncontrolledTags(next);
    onTagsChange?.(next);
  }

  function addFrom(raw: string) {
    const candidates = raw
      .split(/[,\n]/)
      .map((candidate) => candidate.trim())
      .filter(Boolean);
    if (candidates.length === 0) return;

    const next = [...tags];
    const added: string[] = [];
    let blocked: "duplicate" | "limit" | null = null;

    for (const candidate of candidates) {
      if (next.includes(candidate)) {
        blocked = blocked ?? "duplicate";
        continue;
      }
      if (maxTags !== undefined && next.length >= maxTags) {
        blocked = "limit";
        continue;
      }
      next.push(candidate);
      added.push(candidate);
    }

    if (added.length > 0) {
      commit(next);
      setRejection(null);
      setAnnouncement(
        added.length === 1 ? `Added ${added[0]}.` : `Added ${added.length} tags.`,
      );
      return;
    }

    // Nothing was added — surface why as the transient invalid message, which is
    // itself an aria-live region, so it announces the rejection as text (not by
    // colour alone) without the status region repeating it.
    if (blocked === "limit") {
      setRejection(`You can add up to ${maxTags} tags.`);
    } else if (blocked === "duplicate") {
      const duplicate = candidates.find((candidate) => tags.includes(candidate));
      setRejection(duplicate ? `${duplicate} is already added.` : "That tag is already added.");
    }
  }

  function removeAt(index: number) {
    const removed = tags[index];
    if (removed === undefined) return;
    const next = tags.filter((_, position) => position !== index);
    commit(next);
    setRejection(null);
    setAnnouncement(`Removed ${removed}.`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addFrom(text);
      setText("");
      return;
    }
    if (event.key === "Backspace" && text === "" && tags.length > 0) {
      event.preventDefault();
      removeAt(tags.length - 1);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = event.currentTarget.value;
    // A comma reaching the value (mobile keyboards, IME, programmatic input)
    // commits every completed token and keeps the trailing fragment being typed.
    if (raw.includes(",")) {
      const segments = raw.split(",");
      const remainder = segments.pop() ?? "";
      addFrom(segments.join(","));
      setText(remainder);
      return;
    }
    if (rejection != null) setRejection(null);
    setText(raw);
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text");
    if (!pasted.includes(",") && !pasted.includes("\n")) return;
    event.preventDefault();
    addFrom(pasted);
    setText("");
  }

  function focusInput() {
    if (disabled) return;
    inputRef.current?.focus();
  }

  function handleContainerPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    const target = event.target as HTMLElement;
    // Clicks on a chip's remove button or on the input keep their native
    // behaviour; clicks anywhere else in the field route focus to the input.
    if (target.closest("button") || target === inputRef.current) return;
    event.preventDefault();
    focusInput();
  }

  return (
    <div className={cn("flex w-full flex-col gap-[6px] text-left", MATERIAL_TOKENS[material])}>
      <div
        aria-invalid={isInvalid || undefined}
        className={cn(containerVariants({ material, size, variant }), containerClassName)}
        data-disabled={disabled || undefined}
        data-focus={dataFocus}
        data-material={material}
        onPointerDown={handleContainerPointerDown}
      >
        {tags.length > 0 ? (
          <ul className="contents" role="list">
            {tags.map((tag, index) => (
              <li className={cn(chipVariants({ size }))} key={`${index}-${tag}`} role="listitem">
                <span className="min-w-0 truncate">{tag}</span>
                <button
                  aria-label={`Remove ${tag}`}
                  className={cn(removeButtonVariants({ size }))}
                  disabled={disabled}
                  onClick={() => {
                    removeAt(index);
                    focusInput();
                  }}
                  tabIndex={disabled ? -1 : 0}
                  type="button"
                >
                  <X aria-hidden="true" className={REMOVE_GLYPH[size]} strokeWidth={2.5} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <input
          {...rest}
          aria-describedby={describedBy || undefined}
          aria-invalid={isInvalid || undefined}
          aria-label={ariaLabel}
          autoComplete="off"
          className={cn(inputControlVariants({ size }), className)}
          disabled={disabled}
          id={inputId}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={tags.length === 0 ? placeholder : undefined}
          ref={inputRef}
          type="text"
          value={text}
        />

        {/* Native form participation: one hidden input per tag, submitted under
            the shared `name`, so a server receives the list as repeated values. */}
        {name
          ? tags.map((tag, index) => (
              <input disabled={disabled} key={`hidden-${index}-${tag}`} name={name} type="hidden" value={tag} />
            ))
          : null}
      </div>

      {/* Always-referenced keyboard guidance for the input. */}
      <span className={VISUALLY_HIDDEN} id={guidanceId}>
        Press Enter or comma to add a tag. Press Backspace on an empty field to remove the last tag.
      </span>

      {/* The validation / helper message. Always mounted so the aria-live region
          exists before its text arrives; only styled red while the field is in
          error, and driven by the same invalidity the border keys off. */}
      <p
        aria-live="polite"
        className={cn(
          MESSAGE,
          isInvalid && message != null
            ? "font-bold text-[color:var(--mq-error,#9c2f22)]"
            : "text-[color:currentColor]",
        )}
        id={messageId}
      >
        {message}
      </p>

      {/* Status channel: announces each add and remove without disturbing the
          validation message above. */}
      <span aria-live="polite" className={VISUALLY_HIDDEN} role="status">
        {announcement}
      </span>
    </div>
  );
}

export type TagsInputFieldProps = TagsInputProps & {
  /** Visible label. Rendered as a real `<label htmlFor>`. */
  label: React.ReactNode;
  /** Class for the field wrapper. `className` still targets the inner <input>. */
  fieldClassName?: string;
};

/**
 * Label + control, wired together.
 *
 * The control already owns its message region and live announcements, so the
 * field's only job is to render a real `<label htmlFor>` bound to the input and
 * forward the rest. `errorText` on the field implies invalid, exactly as it does
 * on the control.
 */
export function TagsInputField({
  errorText,
  fieldClassName,
  id,
  invalid = false,
  label,
  material = "clay",
  ...props
}: TagsInputFieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? `${generatedId}-tags`;
  const hasError =
    typeof errorText === "string" ? errorText.trim() !== "" : errorText != null;

  return (
    <div className={cn("flex w-full flex-col gap-[6px] text-left", fieldClassName)}>
      <label className={LABEL} htmlFor={controlId}>
        {label}
      </label>
      <TagsInput
        {...props}
        errorText={errorText}
        id={controlId}
        invalid={invalid || hasError}
        material={material}
      />
    </div>
  );
}

export { containerVariants, chipVariants };
