"use client";

import * as React from "react";
import {
  EllipsisVertical,
  File as FileGlyph,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq File Card
 *
 * One file in a list: a type glyph (or a real thumbnail), the file name as a
 * semantic heading, its type / size / modified date as REAL TEXT, and an
 * icon-only actions menu (Download / Rename / Delete).
 *
 * Self-contained by design — the four material recipes (clay / glass / skeuo /
 * adaptive) are copied and owned here, straight from `card.tsx`, so dropping
 * this file plus `src/lib/cn.ts` into another project reproduces the full
 * tactile look with no global stylesheet and no `:root` custom properties.
 * Every `var()` carries a literal fallback.
 *
 * Local theming knobs (custom properties declared on the card, inherited down):
 *
 *   --mq-body      surface colour
 *   --mq-lit       top highlight (skeuo gradient)
 *   --mq-edge      extruded bottom edge colour
 *   --mq-text      primary foreground
 *   --mq-muted     secondary foreground (type / size / date)
 *   --mq-well      thumbnail + trigger well wash
 *   --mq-glyph     decorative type-glyph colour
 *   --mq-brd       border colour
 *   --mq-ring      focus ring colour
 *   --mq-danger    destructive marker ink
 *   --mq-menu      menu surface            --mq-menu-brd   menu border
 *   --mq-menu-ink  menu label              --mq-menu-hover menu hover/focus wash
 *   --mq-menu-grad menu wash               --mq-menu-blur  menu backdrop blur
 *   --mq-menu-shadow menu elevation
 *   --mq-pad       inner padding           --mq-gap        column rhythm
 *   --mq-radius    corner radius           --mq-title      file-name font size
 *   --mq-meta      meta-line font size     --mq-thumb      thumbnail edge
 *   --mq-trigger   actions-button edge
 *
 * Time is never computed during render: `modifiedIso` and `modifiedLabel` both
 * arrive as props, so a statically generated page and the browser agree.
 * `formatFileSize` below is a pure, timezone- and locale-stable helper callers
 * may use to build the `fileSize` string ahead of time.
 *
 * Whole-card link: when `href` is set the file NAME renders as a single <a>
 * whose `::after` overlay stretches across the card, making the entire surface
 * one link WITHOUT nesting the actions button inside it. The actions cluster is
 * raised on `relative z-10` so it stays independently clickable and focusable.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type FileCardVariant = "default";
type FileCardSize = "sm" | "md" | "lg";

/**
 * Decorative glyph per file kind. The kind is ALSO stated in text through the
 * `fileType` prop, so nothing is carried by the picture alone.
 */
const KIND_GLYPHS = {
  archive: FileArchive,
  audio: FileAudio,
  code: FileCode,
  doc: FileText,
  generic: FileGlyph,
  image: FileImage,
  pdf: FileText,
  sheet: FileSpreadsheet,
  video: FileVideo,
} as const;

export type FileKind = keyof typeof KIND_GLYPHS;

const FILE_SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

/**
 * Pure byte formatter. Deterministic and locale-independent (no `Intl`, no
 * `toLocaleString`), so the server and the client render the same string and a
 * statically generated page never hydrates with a mismatch.
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < FILE_SIZE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = unit === 0 ? String(Math.round(value)) : value.toFixed(value < 10 ? 1 : 0);
  return `${rounded} ${FILE_SIZE_UNITS[unit]}`;
}

/**
 * Focus ring. Declared for real `:focus-visible` and identically for a
 * `data-focus="true"` attribute so documentation surfaces and visual-regression
 * tests can render the focused look without synthesising a keyboard event.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * `:focus-within` is scoped to the LINKED card only: tabbing to the name link
 * or to the actions trigger outlines the whole card, so the stretched link
 * never loses its visible focus. An inert file card skips this — outlining the
 * card as well as the button it merely contains double-rings one focus.
 */
const FOCUS_WITHIN_RING =
  "focus-within:outline-2 focus-within:outline-offset-[3px] " +
  "focus-within:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-within:outline-[Highlight]";

/**
 * Hover lift + press sink for a card that leads somewhere.
 *
 * `translate`, not `transform`: Tailwind v4's `translate-*` utilities write the
 * standalone `translate` property, so the transition NAMES `translate` (with
 * `box-shadow`, which also changes). Both listed properties really change, so
 * there is no phantom transition. Reduced motion cancels the travel outright
 * because the card is already a link — nothing is communicated by the movement.
 */
const INTERACTIVE_LIFT =
  "cursor-pointer transition-[translate,box-shadow] duration-200 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[2px] motion-reduce:hover:translate-y-0 " +
  "hover:shadow-[var(--mq-shadow-hover,0_14px_35px_rgba(20,20,18,0.12))] " +
  "active:translate-y-[1px] active:shadow-[var(--mq-shadow-press,0_4px_10px_rgba(20,20,18,0.09))] " +
  "motion-reduce:active:translate-y-0";

/**
 * Stretched link: a single <a> whose transparent `::after` covers the card (the
 * nearest positioned ancestor). Everything the reader must still reach
 * independently — the actions trigger and its menu — sits on a higher
 * `z-index`, so it stays clickable while the rest of the surface routes to the
 * file link. The <a> drops its own outline; the card's `:focus-within` ring is
 * what shows the focus.
 */
const STRETCHED_LINK =
  "text-inherit no-underline outline-none " +
  "[&::after]:absolute [&::after]:inset-0 [&::after]:z-[1] [&::after]:content-['']";

/**
 * Icon-only actions trigger. Raised above the stretched-link overlay and given
 * a comfortable 44px target on coarse pointers — the variant prefix keeps it a
 * separate `tailwind-merge` group from the base size, so both survive.
 */
const ACTIONS_TRIGGER =
  "relative z-10 inline-flex shrink-0 items-center justify-center appearance-none cursor-pointer " +
  "size-[var(--mq-trigger,34px)] pointer-coarse:size-[44px] rounded-full " +
  "border border-[var(--mq-brd,rgba(120,80,55,0.16))] bg-[var(--mq-well,#efd9cb)] " +
  "text-[color:var(--mq-glyph,#7a3f22)] " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] " +
  "transition-[translate,box-shadow] duration-150 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[1px] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_5px_12px_rgba(20,20,18,0.16)] " +
  "motion-reduce:hover:translate-y-0 " +
  "active:translate-y-0 active:shadow-[inset_0_2px_5px_rgba(20,20,18,0.24)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] " +
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 " +
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] " +
  "forced-colors:shadow-none forced-colors:focus-visible:outline-[Highlight]";

const fileCardVariants = cva(
  [
    "group/fc relative isolate flex items-center text-left border",
    "gap-[var(--mq-gap,14px)] p-[var(--mq-pad,18px)] rounded-[var(--mq-radius,22px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    // Shadows and translucency are erased in forced-colors mode, so the card
    // would dissolve into the page. A system-coloured border keeps its bounds.
    "forced-colors:border-[CanvasText]",
    "data-[state=disabled]:opacity-60",
    FOCUS_RING,
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#f6e7dd)]",
          "border-[var(--mq-brd,rgba(120,80,55,0.16))]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)] [--mq-shadow-hover:inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_10px_0_var(--mq-edge,#dcc4b2),0_26px_44px_rgba(90,60,45,0.189)] [--mq-shadow-press:inset_0_3px_4px_rgba(255,255,255,0.938),inset_0_-5px_8px_rgba(140,90,60,0.15),0_3px_0_var(--mq-edge,#dcc4b2),0_7px_12px_rgba(90,60,45,0.136)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(255,255,255,0.66))]",
          "border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.85),0_23px_55px_rgba(24,20,40,0.236)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),0_6px_15px_rgba(24,20,40,0.17)]",
          "forced-colors:[backdrop-filter:none]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_9px_0_var(--mq-edge,#a8a49b),0_20px_32px_rgba(38,36,31,0.283)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.175),0_2px_0_var(--mq-edge,#a8a49b),0_6px_9px_rgba(38,36,31,0.204)]",
        ].join(" "),
        // Polymorphic: almost no ornament. It adapts instead — the palette
        // follows the colour scheme, the rhythm follows the pointer type.
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)] [--mq-shadow-hover:0_1px_3px_rgba(20,20,18,0.118),0_14px_35px_rgba(20,20,18,0.071)] [--mq-shadow-press:0_0px_1px_rgba(20,20,18,0.085),0_4px_10px_rgba(20,20,18,0.051)]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-pad:12px] [--mq-gap:10px] [--mq-radius:16px] [--mq-title:14px] [--mq-meta:11px] [--mq-thumb:38px] [--mq-trigger:30px]",
        md: "[--mq-pad:18px] [--mq-gap:14px] [--mq-radius:22px] [--mq-title:16px] [--mq-meta:12px] [--mq-thumb:48px] [--mq-trigger:34px]",
        lg: "[--mq-pad:24px] [--mq-gap:18px] [--mq-radius:28px] [--mq-title:19px] [--mq-meta:13px] [--mq-thumb:60px] [--mq-trigger:40px]",
      },
    },
    compoundVariants: [
      // ----------------------------------------------------------------- clay
      {
        material: "clay",
        variant: "default",
        class:
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817] " +
          "[--mq-well:#efd9cb] [--mq-glyph:#7a3f22] [--mq-danger:#8f2417] " +
          "[--mq-menu:#f4ece0] [--mq-menu-brd:rgba(120,80,55,0.22)] [--mq-menu-ink:#33261e] " +
          "[--mq-menu-hover:rgba(201,72,47,0.12)] [--mq-menu-blur:0px] " +
          "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.50),rgba(151,92,58,0.05))] " +
          "[--mq-menu-shadow:0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14)]",
      },
      // ---------------------------------------------------------------- glass
      {
        material: "glass",
        variant: "default",
        // --mq-muted #36362f (not a lighter grey) holds 5.14:1 over a black
        // backdrop at 0.66 opacity, where a lighter muted measured only 4.27:1.
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817] " +
          "[--mq-well:rgba(255,255,255,0.72)] [--mq-glyph:#24313a] [--mq-danger:#8a2015] " +
          "[--mq-menu:rgba(244,247,248,0.92)] [--mq-menu-brd:rgba(255,255,255,0.72)] [--mq-menu-ink:#1e1e1b] " +
          "[--mq-menu-hover:rgba(23,24,23,0.08)] [--mq-menu-blur:16px] " +
          "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0))] " +
          "[--mq-menu-shadow:0_16px_34px_rgba(24,20,40,0.18),0_4px_12px_rgba(24,20,40,0.12)]",
      },
      // ---------------------------------------------------------------- skeuo
      {
        material: "skeuo",
        variant: "default",
        // The menu is the warm greige #e6e3da family, so the popup belongs to
        // the same moulded material as the card that spawned it.
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817] " +
          "[--mq-well:#cbc7bc] [--mq-glyph:#2e2b24] [--mq-danger:#7d2116] " +
          "[--mq-menu:#e6e3da] [--mq-menu-brd:rgba(25,25,23,0.30)] [--mq-menu-ink:#23231f] " +
          "[--mq-menu-hover:rgba(255,255,255,0.55)] [--mq-menu-blur:0px] " +
          "[--mq-menu-grad:linear-gradient(180deg,#f0ede6,#e6e3da)] " +
          "[--mq-menu-shadow:0_16px_30px_rgba(38,36,31,0.28),0_4px_10px_rgba(38,36,31,0.18)]",
      },
      // ------------------------------------------------------------- adaptive
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817] " +
          "[--mq-well:#eeeeec] [--mq-glyph:#2b2b28] [--mq-danger:#a3241a] " +
          "[--mq-menu:#ffffff] [--mq-menu-brd:rgba(23,24,23,0.14)] [--mq-menu-ink:#1c1c19] " +
          "[--mq-menu-hover:rgba(23,24,23,0.06)] [--mq-menu-blur:0px] [--mq-menu-grad:none] " +
          "[--mq-menu-shadow:0_14px_30px_rgba(20,20,18,0.16),0_3px_8px_rgba(20,20,18,0.10)] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9] " +
          "dark:[--mq-well:#2f2f34] dark:[--mq-glyph:#dcdad3] dark:[--mq-danger:#ff9e90] " +
          "dark:[--mq-menu:#26262a] dark:[--mq-menu-brd:rgba(255,255,255,0.16)] dark:[--mq-menu-ink:#f1efe9] " +
          "dark:[--mq-menu-hover:rgba(255,255,255,0.08)] " +
          "dark:[--mq-menu-shadow:0_14px_30px_rgba(0,0,0,0.55),0_3px_8px_rgba(0,0,0,0.40)] " +
          "dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_14px_30px_rgba(0,0,0,0.55)] dark:[--mq-shadow-hover:0_3px_6px_rgba(0,0,0,0.59),0_20px_44px_rgba(0,0,0,0.62)] dark:[--mq-shadow-press:0_1px_2px_rgba(0,0,0,0.45),0_6px_12px_rgba(0,0,0,0.5)]",
      },
    ],
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

/**
 * Menu entrance keyframe, shipped with the component instead of a global sheet.
 * React 19 hoists this `<style>` and dedupes it by `href`, so a list of a
 * hundred file cards emits one rule. The keyframe's END state is exactly the
 * menu's resting style, so `motion-reduce:animate-none` leaves the menu fully
 * open and correctly placed — only the small rise is dropped.
 */
const FILE_CARD_KEYFRAMES = `
@keyframes mq-file-card-menu-in{from{opacity:0;translate:0 -6px}to{opacity:1;translate:0 0}}`;

const menuItemClass = cn(
  "flex w-full items-center gap-[10px] rounded-[10px] px-[12px] min-h-[36px] py-[7px]",
  "cursor-pointer appearance-none border-0 bg-transparent text-left",
  "font-bold tracking-[-0.01em] text-[length:13px] leading-[1.3] text-[color:var(--mq-menu-ink,#33261e)]",
  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
  // The focused item IS the roving active item, so the wash is keyed off real
  // `:focus` (which programmatic focus triggers) as well as hover.
  "hover:bg-[var(--mq-menu-hover,rgba(201,72,47,0.12))]",
  "focus:bg-[var(--mq-menu-hover,rgba(201,72,47,0.12))]",
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--mq-ring,#171817)]",
  "disabled:cursor-not-allowed disabled:opacity-45",
  // Fills are discarded in forced colours; the active item takes a system mark.
  "forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText]",
  "forced-colors:hover:bg-[Highlight] forced-colors:hover:text-[HighlightText]",
  "forced-colors:focus-visible:outline-[Highlight]",
);

/** One entry in the actions menu. */
export type FileCardAction = {
  /** Stable key; also the React list key. */
  id: string;
  /** Visible label, e.g. "Download". */
  label: string;
  /** Optional leading glyph. Decorative — hidden from assistive tech. */
  icon?: React.ReactNode;
  /** Called when the item is chosen, before the menu closes. */
  onSelect?: () => void;
  /** Skipped by roving navigation and non-activatable. */
  disabled?: boolean;
  /**
   * Marks an irreversible action (Delete). Rendered as a TEXT marker beside the
   * label as well as a tinted ink, so the warning never rests on colour alone.
   */
  destructive?: boolean;
  /** Overrides the polite announcement made after the item is chosen. */
  announcement?: string;
};

type FileCardOwnProps = {
  material?: MaterialSlug;
  variant?: FileCardVariant;
  size?: FileCardSize;
  /** File name — the card's heading and, when `href` is set, the link text. */
  name: string;
  /** Human-readable type, e.g. "PDF document". Always rendered as text. */
  fileType: string;
  /** Pre-formatted size, e.g. "2.4 MB". Build it with `formatFileSize`. */
  fileSize: string;
  /** Machine-readable modified timestamp for `<time dateTime>`. */
  modifiedIso: string;
  /** Display string for the same instant. Supplied, never computed at render. */
  modifiedLabel: string;
  /** Picks the decorative glyph. The type is stated in `fileType` regardless. */
  kind?: FileKind;
  /**
   * Heading rank for the file name. The correct level depends on the
   * surrounding document outline, so it is overridable rather than hardcoded.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** When set, the whole card becomes one link via the stretched-link pattern. */
  href?: string;
  /** Optional real thumbnail. Fills the fixed square well, so nothing shifts. */
  thumbnailSrc?: string;
  /** Alt text for `thumbnailSrc`. Use "" only when genuinely decorative. */
  thumbnailAlt?: string;
  /** Actions revealed by the trigger, e.g. Download / Rename / Delete. */
  actions?: FileCardAction[];
  /** Accessible name for the trigger. Defaults to `Actions for <name>`. */
  actionsLabel?: string;
  /** Visible text marker appended to destructive items. */
  destructiveLabel?: string;
  /** Prefix read before the modified date. */
  modifiedPrefix?: string;
  /** Dims the card, drops the stretched link and disables the actions trigger. */
  disabled?: boolean;
  headingClassName?: string;
};

/**
 * `Omit` the own props off the native article props so the rest — `id`,
 * `data-*`, `aria-*`, `ref`, `className` — spreads straight onto the <article>.
 */
export type FileCardProps = FileCardOwnProps &
  Omit<VariantProps<typeof fileCardVariants>, "material" | "variant" | "size"> &
  Omit<React.ComponentPropsWithRef<"article">, keyof FileCardOwnProps | "children">;

export function FileCard({
  actions = [],
  actionsLabel,
  className,
  destructiveLabel = "Permanent",
  disabled = false,
  fileSize,
  fileType,
  headingClassName,
  headingLevel = 3,
  href,
  kind = "generic",
  material = "clay",
  modifiedIso,
  modifiedLabel,
  modifiedPrefix = "Modified",
  name,
  size = "md",
  thumbnailAlt = "",
  thumbnailSrc,
  variant = "default",
  ...props
}: FileCardProps) {
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
  const Glyph = KIND_GLYPHS[kind];
  const triggerName = actionsLabel ?? `Actions for ${name}`;
  const isLinked = Boolean(href) && !disabled;

  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [announcement, setAnnouncement] = React.useState("");
  const menuId = React.useId();
  const menuRootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndices = React.useMemo(
    () =>
      actions
        .map((action, index) => (action.disabled ? -1 : index))
        .filter((index) => index >= 0),
    [actions],
  );

  const closeAndFocusTrigger = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const openMenu = React.useCallback(
    (edge: "first" | "last") => {
      if (enabledIndices.length === 0) {
        setActiveIndex(-1);
      } else {
        setActiveIndex(
          edge === "last" ? enabledIndices[enabledIndices.length - 1] : enabledIndices[0],
        );
      }
      setOpen(true);
    },
    [enabledIndices],
  );

  // On open, move focus into the menu — to the active item, or to the menu
  // surface itself when every item is disabled so keyboard focus is never lost.
  React.useEffect(() => {
    if (!open) return;
    const target = activeIndex >= 0 ? itemRefs.current[activeIndex] : menuRef.current;
    target?.focus();
  }, [open, activeIndex]);

  // A pointer press anywhere outside the actions cluster closes the menu.
  // Registered only while open, and cleaned up on close/unmount. `setOpen` here
  // runs inside a subscribed listener, never synchronously in an effect body.
  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!menuRootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function selectItem(index: number) {
    const action = actions[index];
    if (!action || action.disabled) return;
    action.onSelect?.();
    setAnnouncement(action.announcement ?? `${action.label}: ${name}`);
    closeAndFocusTrigger();
  }

  function handleTriggerClick() {
    if (disabled) return;
    if (open) setOpen(false);
    else openMenu("first");
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu("first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu("last");
    }
  }

  function moveActive(direction: 1 | -1) {
    if (enabledIndices.length === 0) return;
    const position = enabledIndices.indexOf(activeIndex);
    const nextPosition =
      position === -1
        ? direction === 1
          ? 0
          : enabledIndices.length - 1
        : (position + direction + enabledIndices.length) % enabledIndices.length;
    setActiveIndex(enabledIndices[nextPosition]);
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        if (enabledIndices.length > 0) setActiveIndex(enabledIndices[0]);
        break;
      case "End":
        event.preventDefault();
        if (enabledIndices.length > 0) setActiveIndex(enabledIndices[enabledIndices.length - 1]);
        break;
      case "Escape":
        event.preventDefault();
        // Absorb the dismiss key so it does not also close an enclosing
        // Escape-closable ancestor (a dialog or drawer the list sits in).
        event.stopPropagation();
        closeAndFocusTrigger();
        break;
      case "Tab":
        // Tab leaves the menu; close it and hand focus back to the trigger so
        // the next Tab continues from the control, never from an unmounting item.
        event.preventDefault();
        closeAndFocusTrigger();
        break;
      default:
        break;
    }
  }

  return (
    <>
      {/*
        `href` + `precedence` so React 19 hoists this and deduplicates it: a
        bare <style> would emit one identical copy per file card on the page.
      */}
      <style href="mq-file-card" precedence="medium">
        {FILE_CARD_KEYFRAMES}
      </style>
      <article
        {...props}
        className={cn(
          fileCardVariants({ material, variant, size }),
          isLinked && INTERACTIVE_LIFT,
          isLinked && FOCUS_WITHIN_RING,
          className,
        )}
        data-material={material}
        data-state={disabled ? "disabled" : "idle"}
      >
        {/* Fixed square well: the thumbnail and the glyph occupy identical
            space, so a late-loading image cannot shift the row. That is the
            CLS guarantee — the well never depends on what lands inside it. */}
        <div
          className={cn(
            "relative grid shrink-0 place-items-center overflow-hidden",
            "aspect-square w-[var(--mq-thumb,48px)] rounded-[calc(var(--mq-radius,22px)_-_10px)]",
            "border border-[var(--mq-brd,rgba(120,80,55,0.16))]",
            "bg-[var(--mq-well,#efd9cb)] text-[color:var(--mq-glyph,#7a3f22)]",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
            "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
            "forced-colors:shadow-none",
          )}
        >
          {thumbnailSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- copy-and-own component stays framework-agnostic
            <img
              src={thumbnailSrc}
              alt={thumbnailAlt}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          ) : (
            <Glyph aria-hidden="true" className="size-[52%]" strokeWidth={1.75} />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <HeadingTag
            className={cn(
              "m-0 font-extrabold tracking-[-0.02em] break-words",
              "text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,16px)] leading-[1.25]",
              headingClassName,
            )}
          >
            {isLinked ? (
              <a href={href} className={STRETCHED_LINK}>
                {name}
              </a>
            ) : (
              name
            )}
          </HeadingTag>

          <p
            className={cn(
              "m-0 flex flex-wrap items-center gap-x-[6px] gap-y-[2px]",
              "text-[color:var(--mq-muted,#5c5b55)] text-[length:var(--mq-meta,12px)] leading-[1.5]",
            )}
          >
            <span>{fileType}</span>
            <span aria-hidden="true">·</span>
            <span>{fileSize}</span>
            <span aria-hidden="true">·</span>
            <span>
              <span className="sr-only">{`${modifiedPrefix} `}</span>
              <time dateTime={modifiedIso}>{modifiedLabel}</time>
            </span>
          </p>
        </div>

        {/* Raised above the stretched-link overlay so the trigger and its menu
            stay independently clickable and focusable. No <button> is ever
            nested inside the title <a>; they are siblings. */}
        {actions.length > 0 ? (
          <div className="relative z-10 shrink-0" ref={menuRootRef}>
            <button
              aria-controls={open ? menuId : undefined}
              aria-expanded={open}
              aria-haspopup="menu"
              aria-label={triggerName}
              className={ACTIONS_TRIGGER}
              data-open={open ? "true" : "false"}
              disabled={disabled}
              onClick={handleTriggerClick}
              onKeyDown={handleTriggerKeyDown}
              ref={triggerRef}
              type="button"
            >
              <EllipsisVertical aria-hidden="true" className="size-[18px]" strokeWidth={2} />
            </button>

            {open ? (
              <div
                aria-label={triggerName}
                className={cn(
                  "absolute right-0 top-full z-50 mt-[8px] min-w-[212px] max-w-[288px] p-[6px]",
                  "rounded-[14px] border bg-[var(--mq-menu,#f4ece0)] border-[var(--mq-menu-brd,rgba(120,80,55,0.22))]",
                  "[background-image:var(--mq-menu-grad,none)] backdrop-blur-[var(--mq-menu-blur,0px)]",
                  "text-[color:var(--mq-menu-ink,#33261e)]",
                  "shadow-[var(--mq-menu-shadow,0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14))]",
                  "animate-[mq-file-card-menu-in_160ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
                  // Fills, washes and shadows are discarded in forced colours; a
                  // real border keeps the bounds and Canvas backs the items.
                  "forced-colors:border-[CanvasText] forced-colors:shadow-none forced-colors:bg-[Canvas]",
                  "forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
                )}
                id={menuId}
                onKeyDown={handleMenuKeyDown}
                ref={menuRef}
                role="menu"
                tabIndex={-1}
              >
                <ul className="m-0 flex list-none flex-col gap-[2px] p-0" role="none">
                  {actions.map((action, index) => (
                    <li key={action.id} role="none">
                      <button
                        className={cn(
                          menuItemClass,
                          action.destructive && "text-[color:var(--mq-danger,#8f2417)]",
                        )}
                        disabled={action.disabled}
                        onClick={() => selectItem(index)}
                        ref={(node) => {
                          itemRefs.current[index] = node;
                        }}
                        role="menuitem"
                        tabIndex={index === activeIndex ? 0 : -1}
                        type="button"
                      >
                        {action.icon != null ? (
                          <span
                            aria-hidden="true"
                            // No forced-colors override here on purpose: the
                            // glyph inherits `currentColor`, which the system
                            // already flips to HighlightText on the active row.
                            className="grid shrink-0 place-items-center [&_svg]:size-[16px] [&_svg]:shrink-0"
                          >
                            {action.icon}
                          </span>
                        ) : null}
                        <span className="min-w-0 flex-1">{action.label}</span>
                        {action.destructive ? (
                          // Real TEXT, so the warning survives greyscale,
                          // colour blindness and forced colours alike.
                          <span
                            className={cn(
                              "shrink-0 rounded-full border border-current px-[7px] py-[1px]",
                              "text-[length:10px] font-extrabold uppercase tracking-[0.04em] leading-[1.6]",
                            )}
                          >
                            {destructiveLabel}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Present in the DOM before any text arrives, so the first chosen
            action is announced rather than swallowed by a live region that
            only appears at the same moment as its own message. */}
        <span aria-live="polite" className="sr-only">
          {announcement}
        </span>
      </article>
    </>
  );
}

export type FileCardVariantProps = VariantProps<typeof fileCardVariants>;

export { fileCardVariants };
