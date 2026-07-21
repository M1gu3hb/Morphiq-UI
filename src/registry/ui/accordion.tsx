"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Accordion
 *
 * A disclosure list. Self-contained by design: all four material recipes live
 * in this file, every local custom property carries a literal fallback, and no
 * class comes from the site's global stylesheet. No runtime dependency beyond
 * React and `cn`.
 *
 * Composable API:
 *
 *   <Accordion type="single" collapsible defaultValue="a" material="clay">
 *     <AccordionItem value="a">
 *       <AccordionTrigger>How does billing work?</AccordionTrigger>
 *       <AccordionContent>Monthly, in arrears.</AccordionContent>
 *     </AccordionItem>
 *   </Accordion>
 *
 * `type="single"` keeps one panel open (add `collapsible` to allow closing the
 * last one); `type="multiple"` lets any number be open. Both work controlled
 * (`value` + `onValueChange`) and uncontrolled (`defaultValue`).
 *
 * Local theming knobs:
 *
 *   --mq-panel      item surface
 *   --mq-brd        item / separator border
 *   --mq-head       heading label
 *   --mq-body       panel copy
 *   --mq-hover-bg   hover wash on a header
 *   --mq-open-bg    header wash while its panel is open
 *   --mq-ring       focus ring
 */

/** Palette per material. Declared on the root; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-panel:#f6e7dd] [--mq-brd:rgba(120,80,55,0.22)] [--mq-edge:#dcc4b2]",
    "[--mq-head:#33261e] [--mq-body:#5b4a3c]",
    "[--mq-hover-bg:rgba(255,255,255,0.55)] [--mq-open-bg:rgba(255,255,255,0.42)]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.05))]",
    // Closed: the item sits proud of the page on its own side wall. Warm brown
    // ink throughout — clay never casts black.
    "[--mq-shut:inset_0_3px_4px_rgba(255,255,255,0.76),inset_0_-4px_7px_rgba(140,90,60,0.13),0_2px_0_var(--mq-edge,#dcc4b2),0_5px_11px_rgba(90,60,45,0.14)]",
    // Open: the wall collapses and the ambient shadow spreads — the panel has
    // settled open rather than being held up. Same four layers, so it animates.
    "[--mq-open:inset_0_3px_4px_rgba(255,255,255,0.52),inset_0_-4px_7px_rgba(140,90,60,0.10),0_1px_0_var(--mq-edge,#dcc4b2),0_12px_26px_rgba(90,60,45,0.20)]",
    "[--mq-press:inset_0_3px_6px_rgba(120,60,40,0.20)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-panel:rgba(255,255,255,0.66)] [--mq-brd:rgba(255,255,255,0.75)]",
    "[--mq-head:#1e1e1b] [--mq-body:#36362f]",
    "[--mq-hover-bg:rgba(255,255,255,0.45)] [--mq-open-bg:rgba(255,255,255,0.34)]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
    // A 1px specular filo whose geometry never changes between states, only its
    // intensity. Cool violet-black ink, and no side wall: glass has no extrusion.
    "[--mq-shut:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.24),0_0_0_rgba(24,20,40,0),0_6px_18px_rgba(24,20,40,0.15)]",
    "[--mq-open:inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(255,255,255,0.28),0_0_0_rgba(24,20,40,0),0_16px_38px_rgba(24,20,40,0.24)]",
    "[--mq-press:inset_0_3px_7px_rgba(24,20,40,0.20)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-panel:#ddd9d0] [--mq-brd:rgba(25,25,23,0.30)] [--mq-edge:#a8a49b]",
    "[--mq-head:#23231f] [--mq-body:#43423c]",
    "[--mq-hover-bg:rgba(255,255,255,0.42)] [--mq-open-bg:rgba(255,255,255,0.32)]",
    // The surface IS the gradient: lit over body, the moulded-plastic read.
    "[--mq-grad:linear-gradient(180deg,#eae7df,#d3cec4)]",
    // A hard 1px bevel of light along the top, an achromatic machined shade
    // below, a shallower wall than clay's. The cold counterpart to clay's warm.
    "[--mq-shut:inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-3px_5px_rgba(0,0,0,0.13),0_2px_0_var(--mq-edge,#a8a49b),0_5px_10px_rgba(38,36,31,0.20)]",
    "[--mq-open:inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-3px_5px_rgba(0,0,0,0.10),0_1px_0_var(--mq-edge,#a8a49b),0_13px_26px_rgba(38,36,31,0.26)]",
    "[--mq-press:inset_0_3px_6px_rgba(0,0,0,0.26)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour
  // scheme. Safe here because every surface it names is opaque and flips
  // together with the text that sits on it.
  adaptive: [
    "[--mq-panel:#ffffff] [--mq-brd:rgba(23,24,23,0.14)]",
    "[--mq-head:#1c1c19] [--mq-body:#55554e]",
    "[--mq-hover-bg:rgba(23,24,23,0.05)] [--mq-open-bg:rgba(23,24,23,0.03)]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-grad:none]",
    // Two layers, not four. Adaptive earns its presence from a contact shadow
    // that grows when the item opens, not from a finish it never had.
    "[--mq-shut:inset_0_0_0_rgba(20,20,18,0),0_1px_3px_rgba(20,20,18,0.10)]",
    "[--mq-open:inset_0_0_0_rgba(20,20,18,0),0_10px_24px_rgba(20,20,18,0.14)]",
    "[--mq-press:inset_0_3px_6px_rgba(20,20,18,0.16)]",
    "[--mq-ring:#171817]",
    "dark:[--mq-panel:#232327] dark:[--mq-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-shut:inset_0_0_0_rgba(0,0,0,0),0_1px_3px_rgba(0,0,0,0.46)]",
    "dark:[--mq-open:inset_0_0_0_rgba(0,0,0,0),0_10px_24px_rgba(0,0,0,0.56)]",
    "dark:[--mq-press:inset_0_3px_6px_rgba(0,0,0,0.44)]",
    "dark:[--mq-head:#f1efe9] dark:[--mq-body:#b9b7b0]",
    "dark:[--mq-hover-bg:rgba(255,255,255,0.08)] dark:[--mq-open-bg:rgba(255,255,255,0.05)]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type AccordionMaterial = keyof typeof MATERIAL_TOKENS;
type AccordionVariant = "default" | "separated" | "flush";
type AccordionSize = "sm" | "md" | "lg";

type AccordionContextValue = {
  isOpen: (value: string) => boolean;
  size: AccordionSize;
  toggle: (value: string) => void;
  variant: AccordionVariant;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordion(part: string) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error(`<${part}> must be rendered inside <Accordion>`);
  return context;
}

type ItemContextValue = {
  disabled: boolean;
  open: boolean;
  panelId: string;
  triggerId: string;
  value: string;
};

const ItemContext = React.createContext<ItemContextValue | null>(null);

function useItem(part: string) {
  const context = React.useContext(ItemContext);
  if (!context) throw new Error(`<${part}> must be rendered inside <AccordionItem>`);
  return context;
}

const rootVariants = cva("w-full text-left", {
  variants: {
    variant: {
      default:
        "overflow-hidden rounded-[var(--mq-radius,14px)] border border-[var(--mq-brd,rgba(120,80,55,0.22))] bg-[var(--mq-panel,#f6e7dd)] forced-colors:border-[CanvasText] " +
        "[background-image:var(--mq-grad,none)] shadow-[var(--mq-shut,inset_0_3px_4px_rgba(255,255,255,0.76),inset_0_-4px_7px_rgba(140,90,60,0.13),0_2px_0_var(--mq-edge,#dcc4b2),0_5px_11px_rgba(90,60,45,0.14))] " +
        "forced-colors:[background-image:none] forced-colors:shadow-none",
      separated: "flex flex-col gap-[var(--mq-gap,8px)] bg-transparent",
      // No container at all: only hairlines between rows, and the surface is
      // whatever the page already is.
      flush: "border-t border-[var(--mq-brd,rgba(120,80,55,0.22))] bg-transparent forced-colors:border-[CanvasText]",
    },
    size: {
      sm: "[--mq-radius:11px] [--mq-gap:6px]",
      md: "[--mq-radius:14px] [--mq-gap:8px]",
      lg: "[--mq-radius:18px] [--mq-gap:10px]",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

const itemVariants = cva("", {
  variants: {
    variant: {
      // Hairline between rows rather than around each one, so a stack reads as
      // one object.
      default:
        "border-b border-[var(--mq-brd,rgba(120,80,55,0.22))] last:border-b-0 forced-colors:border-[CanvasText]",
      separated:
        "overflow-hidden rounded-[var(--mq-radius,14px)] border border-[var(--mq-brd,rgba(120,80,55,0.22))] bg-[var(--mq-panel,#f6e7dd)] forced-colors:border-[CanvasText] " +
        "[background-image:var(--mq-grad,none)] " +
        // The signature depth separation: closed, the row rests on its own side
        // wall; open, the wall collapses and the ambient shadow spreads, so an
        // open row reads as having settled rather than being held up. Both
        // recipes declare the same four layers in the same inset order, which is
        // what lets `box-shadow` interpolate instead of swapping discretely.
        "shadow-[var(--mq-shut,inset_0_3px_4px_rgba(255,255,255,0.76),inset_0_-4px_7px_rgba(140,90,60,0.13),0_2px_0_var(--mq-edge,#dcc4b2),0_5px_11px_rgba(90,60,45,0.14))] " +
        "has-[[data-state=open]]:shadow-[var(--mq-open,inset_0_3px_4px_rgba(255,255,255,0.52),inset_0_-4px_7px_rgba(140,90,60,0.10),0_1px_0_var(--mq-edge,#dcc4b2),0_12px_26px_rgba(90,60,45,0.20))] " +
        "transition-[box-shadow] duration-200 ease-out motion-reduce:transition-none " +
        "forced-colors:[background-image:none] forced-colors:shadow-none",
      flush:
        "border-b border-[var(--mq-brd,rgba(120,80,55,0.22))] forced-colors:border-[CanvasText]",
    },
    size: { sm: "", md: "", lg: "" },
  },
  defaultVariants: { variant: "default", size: "md" },
});

const triggerVariants = cva(
  [
    "group/trigger flex w-full cursor-pointer appearance-none items-center justify-between gap-[12px]",
    "bg-transparent text-left font-extrabold tracking-[-0.01em]",
    "text-[color:var(--mq-head,#33261e)]",
    // The wash changes on hover and while open, and the row compresses under a
    // press — nothing phantom in the list.
    "transition-[background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.55))]",
    "data-[state=open]:bg-[var(--mq-open-bg,rgba(255,255,255,0.42))]",
    // Press feedback. A full-width row cannot squash on `scale` without looking
    // like a glitch, so it is pushed *in* instead: an inset shadow along the top
    // edge reads as the row taking the weight of the finger.
    "shadow-[inset_0_0_0_rgba(0,0,0,0)]",
    "active:shadow-[var(--mq-press,inset_0_3px_6px_rgba(120,60,40,0.20))]",
    // The press is pure feedback nobody has to read, so reduced motion cancels
    // it outright rather than keeping its end state.
    "motion-reduce:active:shadow-[inset_0_0_0_rgba(0,0,0,0)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[-2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    "disabled:cursor-not-allowed disabled:opacity-55",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "px-[var(--mq-pad,16px)]",
        separated: "px-[var(--mq-pad,16px)]",
        // Flush has no container, so it does not indent either.
        flush: "px-0",
      },
      size: {
        sm: "[--mq-pad:12px] min-h-[40px] py-[10px] text-[length:12px]",
        md: "[--mq-pad:16px] min-h-[48px] py-[12px] text-[length:13px]",
        lg: "[--mq-pad:20px] min-h-[56px] py-[14px] text-[length:14px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const contentInnerVariants = cva("text-[color:var(--mq-body,#5b4a3c)] leading-[1.65]", {
  variants: {
    variant: {
      default: "px-[var(--mq-pad,16px)] pb-[var(--mq-pad,16px)]",
      separated: "px-[var(--mq-pad,16px)] pb-[var(--mq-pad,16px)]",
      flush: "px-0 pb-[var(--mq-pad,16px)]",
    },
    size: {
      sm: "[--mq-pad:12px] text-[length:12px]",
      md: "[--mq-pad:16px] text-[length:13px]",
      lg: "[--mq-pad:20px] text-[length:14px]",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

/** Values a caller may hand us, normalised to the internal array form. */
function toArray(value: string | string[] | null | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

// `variant` and `size` are declared explicitly rather than pulled from
// `VariantProps`, which widens them to include `null`. The parts need a
// definite value, and a public API that accepts `null` for a presentation axis
// is noise a caller has to think about.
type AccordionBaseProps = Omit<React.ComponentPropsWithRef<"div">, "onChange" | "defaultValue"> & {
  material?: AccordionMaterial;
  variant?: AccordionVariant;
  size?: AccordionSize;
};

export type AccordionProps = AccordionBaseProps &
  (
    | {
        type?: "single";
        value?: string | null;
        defaultValue?: string | null;
        onValueChange?: (value: string | null) => void;
        /** Allow closing the open panel, leaving none open. */
        collapsible?: boolean;
      }
    | {
        type: "multiple";
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
        collapsible?: never;
      }
  );

export function Accordion({
  children,
  className,
  material = "clay",
  size = "md",
  variant = "default",
  ...props
}: AccordionProps) {
  const {
    collapsible = false,
    defaultValue,
    onValueChange,
    type = "single",
    value,
    ...rest
  } = props as AccordionBaseProps & {
    collapsible?: boolean;
    defaultValue?: string | string[] | null;
    onValueChange?: (value: never) => void;
    type?: "single" | "multiple";
    value?: string | string[] | null;
  };

  const multiple = type === "multiple";
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(() => toArray(defaultValue));
  const open = controlled ? toArray(value) : uncontrolled;

  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const commit = React.useCallback(
    (next: string[]) => {
      if (!controlled) setUncontrolled(next);
      const emit = onValueChange as
        | ((value: string[] | string | null) => void)
        | undefined;
      emit?.(multiple ? next : (next[0] ?? null));
    },
    // `setUncontrolled` is listed even though a state setter is stable: the
    // React Compiler lint rule infers it as a dependency and refuses to
    // preserve the memoization when the written list disagrees with the
    // inferred one. Listing it changes nothing at runtime and keeps the
    // component optimizable.
    [controlled, multiple, onValueChange, setUncontrolled],
  );

  const toggle = React.useCallback(
    (itemValue: string) => {
      const isOpen = open.includes(itemValue);
      if (multiple) {
        commit(isOpen ? open.filter((entry) => entry !== itemValue) : [...open, itemValue]);
        return;
      }
      // Single mode: reopening the same panel only closes it when the caller
      // opted into `collapsible`; otherwise one panel always stays open.
      if (isOpen) {
        if (collapsible) commit([]);
        return;
      }
      commit([itemValue]);
    },
    [collapsible, commit, multiple, open],
  );

  /**
   * Up/Down/Home/End move between headers, per the APG disclosure pattern.
   * Enter and Space need no handling: the trigger is a real `<button>`.
   */
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const root = rootRef.current;
    if (!root) return;
    const triggers = [
      ...root.querySelectorAll<HTMLButtonElement>("button[data-accordion-trigger]:not(:disabled)"),
    ];
    const index = triggers.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    const last = triggers.length - 1;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowDown"
            ? (index + 1) % triggers.length
            : (index - 1 + triggers.length) % triggers.length;
    triggers[next]?.focus();
  }

  const context = React.useMemo<AccordionContextValue>(
    () => ({ isOpen: (item) => open.includes(item), size, toggle, variant }),
    [open, size, toggle, variant],
  );

  return (
    <AccordionContext.Provider value={context}>
      <div
        {...rest}
        className={cn(rootVariants({ variant, size }), MATERIAL_TOKENS[material], className)}
        data-material={material}
        onKeyDown={handleKeyDown}
        ref={rootRef}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = React.ComponentPropsWithRef<"div"> & {
  value: string;
  disabled?: boolean;
};

export function AccordionItem({
  className,
  disabled = false,
  value,
  ...props
}: AccordionItemProps) {
  const { isOpen, size, variant } = useAccordion("AccordionItem");
  const id = React.useId();
  const open = isOpen(value);

  const context = React.useMemo<ItemContextValue>(
    () => ({
      disabled,
      open,
      panelId: `${id}-panel`,
      triggerId: `${id}-trigger`,
      value,
    }),
    [disabled, id, open, value],
  );

  return (
    <ItemContext.Provider value={context}>
      <div
        {...props}
        className={cn(itemVariants({ variant, size }), className)}
        data-state={open ? "open" : "closed"}
      />
    </ItemContext.Provider>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "size-[1.15em] shrink-0 text-[color:var(--mq-head,#33261e)]",
        // The rotation is written as an explicit `rotate` property rather than
        // a `rotate-180` utility: Tailwind v4 splits rotation between the
        // standalone `rotate` property and `transform` depending on the
        // utility, and transitioning the wrong one animates nothing.
        "[rotate:0deg] group-data-[state=open]/trigger:[rotate:180deg]",
        "transition-[rotate] duration-200 ease-out motion-reduce:transition-none",
      )}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export type AccordionTriggerProps = React.ComponentPropsWithRef<"button"> & {
  /** Heading rank for the row. Must fit the surrounding document outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

/**
 * The header row.
 *
 * A real `<button>` inside a heading element: the button gives Enter and Space
 * and the tab stop for free, and the heading gives screen-reader users the
 * document outline they navigate by. The rank is a prop because only the page
 * knows what level is correct here.
 */
export function AccordionTrigger({
  children,
  className,
  headingLevel = 3,
  onClick,
  ...props
}: AccordionTriggerProps) {
  const { size, toggle, variant } = useAccordion("AccordionTrigger");
  const { disabled, open, panelId, triggerId, value } = useItem("AccordionTrigger");
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Heading className="m-0 text-[length:inherit] font-[inherit]">
      <button
        {...props}
        aria-controls={panelId}
        aria-expanded={open}
        className={cn(triggerVariants({ variant, size }), className)}
        data-accordion-trigger=""
        data-state={open ? "open" : "closed"}
        disabled={disabled}
        id={triggerId}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggle(value);
        }}
        type="button"
      >
        <span className="min-w-0">{children}</span>
        <Chevron />
      </button>
    </Heading>
  );
}

export type AccordionContentProps = React.ComponentPropsWithRef<"div">;

/**
 * The panel.
 *
 * Height is animated with `grid-template-rows: 0fr -> 1fr` over an
 * `overflow-hidden` wrapper. That is the modern way to animate to a content's
 * natural height: no `max-height` guess that clips tall content or adds dead
 * easing time to short content, and no measuring in JavaScript.
 *
 * While closed the region stays mounted so the transition has something to
 * animate, but it is `inert` — removed from the accessibility tree and from the
 * tab order, so a keyboard user cannot land inside a collapsed panel.
 */
export function AccordionContent({ children, className, ...props }: AccordionContentProps) {
  const { size, variant } = useAccordion("AccordionContent");
  const { open, panelId, triggerId } = useItem("AccordionContent");

  return (
    <div
      {...props}
      aria-labelledby={triggerId}
      className={cn(
        "grid grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]",
        "transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
        className,
      )}
      data-state={open ? "open" : "closed"}
      id={panelId}
      inert={!open || undefined}
      role="region"
    >
      <div className="overflow-hidden">
        <div className={contentInnerVariants({ variant, size })}>{children}</div>
      </div>
    </div>
  );
}

export { rootVariants, triggerVariants };
