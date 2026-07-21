"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Tabs
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * The mechanics are Radix's, not a reimplementation: roving tabindex, arrow /
 * Home / End navigation, `role="tablist" | "tab" | "tabpanel"`, the
 * `aria-controls` ↔ `aria-labelledby` pairing and the focusable panel all come
 * from `@radix-ui/react-tabs`. This file supplies appearance and nothing that
 * would fight that behaviour.
 *
 * Composable API, mapping 1:1 onto the primitives:
 *
 *   <Tabs defaultValue="a" material="clay" variant="pill" size="md">
 *     <TabsList>
 *       <TabsTrigger value="a">Overview</TabsTrigger>
 *       <TabsTrigger value="b">Activity</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="a">…</TabsContent>
 *   </Tabs>
 *
 * `material`, `variant` and `size` are declared once on the root: the tokens
 * inherit through CSS, and the two presentation axes reach the parts through a
 * tiny context. Repeating them on every trigger would be noise a caller could
 * get inconsistently wrong.
 *
 * Radix's own props pass straight through, including `activationMode="manual"`
 * for panels heavy enough that you do not want arrow keys mounting them.
 *
 * Local theming knobs:
 *
 *   --mq-list        list track surface
 *   --mq-list-brd    list track border
 *   --mq-idle        inactive trigger label (only where a track backs it)
 *   --mq-active-bg   active trigger fill
 *   --mq-active-text active trigger label
 *   --mq-hover-bg    hover wash on an inactive trigger
 *   --mq-accent      active indicator for the underline treatment
 *   --mq-ring        focus ring
 */

/** Palette per material. Declared on the root; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-list:#efe7db] [--mq-list-brd:rgba(120,80,55,0.20)]",
    "[--mq-idle:#5b4a3c] [--mq-hover-bg:rgba(255,255,255,0.60)]",
    "[--mq-active-bg:#ff9077] [--mq-active-text:#4a1d13]",
    "[--mq-accent:#c9482f] [--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-list:rgba(255,255,255,0.62)] [--mq-list-brd:rgba(255,255,255,0.75)]",
    "[--mq-idle:#2f2f29] [--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-active-bg:rgba(23,24,23,0.80)] [--mq-active-text:#ffffff]",
    "[--mq-accent:#171817] [--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-list:#cfcbc2] [--mq-list-brd:rgba(25,25,23,0.32)]",
    "[--mq-idle:#33322d] [--mq-hover-bg:rgba(255,255,255,0.40)]",
    "[--mq-active-bg:#f6f4ee] [--mq-active-text:#23231f]",
    "[--mq-accent:#3f3e39] [--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour
  // scheme. Safe here because every surface it names is opaque and flips
  // together with the label that sits on it.
  adaptive: [
    "[--mq-list:#f1f0ec] [--mq-list-brd:rgba(23,24,23,0.14)]",
    "[--mq-idle:#55554e] [--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-active-bg:#ffffff] [--mq-active-text:#1c1c19]",
    "[--mq-accent:#171817] [--mq-ring:#171817]",
    "dark:[--mq-list:#26262a] dark:[--mq-list-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-idle:#b9b7b0] dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-active-bg:#3a3a40] dark:[--mq-active-text:#f1efe9]",
    "dark:[--mq-accent:#f1efe9] dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type TabsVariant = "default" | "pill" | "underline";
type TabsSize = "sm" | "md" | "lg";

/**
 * Carries the two presentation axes from the root to the parts.
 *
 * Radix's own context is scoped and private, so this is the smallest way to let
 * `<TabsList>` and `<TabsTrigger>` stay dumb while `variant` and `size` are
 * still declared exactly once.
 */
const TabsStyleContext = React.createContext<{ size: TabsSize; variant: TabsVariant }>({
  size: "md",
  variant: "default",
});

const listVariants = cva("flex items-center", {
  variants: {
    variant: {
      default:
        "w-fit rounded-[var(--mq-list-radius,14px)] border border-[var(--mq-list-brd,rgba(120,80,55,0.20))] bg-[var(--mq-list,#efe7db)] p-[var(--mq-list-pad,4px)] gap-[2px] forced-colors:border-[CanvasText]",
      pill: "w-fit gap-[6px] border-0 bg-transparent p-0",
      underline:
        "w-full gap-[var(--mq-list-pad,4px)] border-0 border-b bg-transparent p-0 border-b-[var(--mq-list-brd,rgba(120,80,55,0.20))] forced-colors:border-b-[CanvasText]",
    },
    size: {
      sm: "[--mq-list-radius:11px] [--mq-list-pad:3px]",
      md: "[--mq-list-radius:14px] [--mq-list-pad:4px]",
      lg: "[--mq-list-radius:17px] [--mq-list-pad:5px]",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

const triggerVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center",
    "whitespace-nowrap font-extrabold tracking-[-0.01em] appearance-none bg-transparent",
    // The bottom border is always reserved, transparent by default. It is what
    // the underline treatment colours when active, and what forced-colors uses
    // to mark the active tab once fills are discarded — so no variant has to
    // change the box model and shift the row.
    "border-0 border-b-2 border-b-transparent",
    // Exactly the properties that change across states, nothing phantom: the
    // fill and hover wash (background-color), the label (color), the raised
    // active chip (box-shadow), the underline indicator (border-color) and the
    // de-emphasis of an inactive underline tab plus the disabled fade
    // (opacity) — the last one applies to every variant, so it is not phantom
    // for the two that never dim an inactive tab.
    "transition-[background-color,color,box-shadow,border-color,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight]",
    // Fills vanish in forced-colors, so the active tab is marked with a system
    // colour on the border that is already in the box model.
    "forced-colors:data-[state=active]:border-b-[Highlight]",
    "disabled:cursor-not-allowed disabled:opacity-45",
  ].join(" "),
  {
    variants: {
      variant: {
        // Backed by the list track, so the inactive label has a known surface
        // to be measured against and can pin its own colour.
        default: [
          "rounded-[var(--mq-trigger-radius,10px)] text-[color:var(--mq-idle,#5b4a3c)]",
          "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
          "data-[state=active]:bg-[var(--mq-active-bg,#ff9077)]",
          "data-[state=active]:text-[color:var(--mq-active-text,#4a1d13)]",
          "data-[state=active]:shadow-[0_1px_2px_rgba(40,25,18,0.18)]",
        ].join(" "),
        // No track: an inactive label sits directly on the host's surface, so it
        // inherits the host's colour instead of pinning one that would be a
        // guess about the page. The active chip has a fill of its own and can.
        pill: [
          "rounded-full text-[color:currentColor]",
          "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
          "data-[state=active]:bg-[var(--mq-active-bg,#ff9077)]",
          "data-[state=active]:text-[color:var(--mq-active-text,#4a1d13)]",
          "data-[state=active]:shadow-[0_2px_5px_rgba(40,25,18,0.20)]",
        ].join(" "),
        // Nothing is filled here, so both labels inherit the host's colour and
        // the state is carried by weight plus the accent rule — never by colour
        // alone.
        underline: [
          "rounded-none text-[color:currentColor] font-bold opacity-70",
          "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.60))]",
          "data-[state=active]:opacity-100 data-[state=active]:font-extrabold",
          "data-[state=active]:border-b-[var(--mq-accent,#c9482f)]",
        ].join(" "),
      },
      size: {
        sm: "[--mq-trigger-radius:8px] h-[28px] px-[10px] text-[length:11px]",
        md: "[--mq-trigger-radius:10px] h-[34px] px-[14px] text-[length:12px]",
        lg: "[--mq-trigger-radius:13px] h-[42px] px-[18px] text-[length:13px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export type TabsProps = React.ComponentPropsWithRef<typeof TabsPrimitive.Root> & {
  material?: keyof typeof MATERIAL_TOKENS;
  variant?: TabsVariant;
  size?: TabsSize;
};

/**
 * Root. Uncontrolled with `defaultValue`, controlled with `value` +
 * `onValueChange` — the state is Radix's, so there is none here to drift.
 */
export function Tabs({
  className,
  material = "clay",
  size = "md",
  variant = "default",
  ...props
}: TabsProps) {
  const style = React.useMemo(() => ({ size, variant }), [size, variant]);
  return (
    <TabsStyleContext.Provider value={style}>
      <TabsPrimitive.Root
        {...props}
        className={cn("flex flex-col gap-[12px]", MATERIAL_TOKENS[material], className)}
        data-material={material}
      />
    </TabsStyleContext.Provider>
  );
}

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.List>) {
  const { size, variant } = React.useContext(TabsStyleContext);
  return (
    <TabsPrimitive.List {...props} className={cn(listVariants({ variant, size }), className)} />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.Trigger>) {
  const { size, variant } = React.useContext(TabsStyleContext);
  return (
    <TabsPrimitive.Trigger
      {...props}
      className={cn(triggerVariants({ variant, size }), className)}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      {...props}
      className={cn(
        // Radix makes the panel focusable so a keyboard user can reach content
        // that holds no controls of its own; that focus has to be visible.
        "text-[color:currentColor] text-[length:13px] leading-[1.6]",
        "focus-visible:outline-2 focus-visible:outline-offset-[3px]",
        "focus-visible:outline-[var(--mq-ring,#171817)]",
        "forced-colors:focus-visible:outline-[Highlight]",
        className,
      )}
    />
  );
}

export type TabsVariantProps = VariantProps<typeof triggerVariants>;

export { listVariants, triggerVariants };
