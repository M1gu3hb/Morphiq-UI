"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { BarChart3, Check, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const featureTabsVariants = cva(
  [
    "w-full border bg-[var(--mq-ftabs-bg,#f6f3ec)] text-[color:var(--mq-ftabs-text,#201f1b)]",
    "border-[var(--mq-ftabs-border,#89857b)] [--mq-ftabs-bg:#f6f3ec] [--mq-ftabs-card:#ffffff]",
    "[--mq-ftabs-text:#201f1b] [--mq-ftabs-muted:#555249] [--mq-ftabs-accent:#5731b8]",
    "[--mq-ftabs-accent-text:#ffffff] [--mq-ftabs-soft:#e9e0ff] [--mq-ftabs-border:#89857b]",
    "dark:[--mq-ftabs-bg:#191a1e] dark:[--mq-ftabs-card:#26272c] dark:[--mq-ftabs-text:#f6f3ec]",
    "dark:[--mq-ftabs-muted:#c5c1b8] dark:[--mq-ftabs-accent:#b9a1ff]",
    "dark:[--mq-ftabs-accent-text:#17151d] dark:[--mq-ftabs-soft:#352e49] dark:[--mq-ftabs-border:#918d84]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        pills: "",
        underline: "",
      },
      size: {
        sm: "rounded-[22px] p-5 md:p-7",
        md: "rounded-[28px] p-6 md:p-9",
        lg: "rounded-[34px] p-7 md:p-12",
      },
    },
    defaultVariants: { variant: "pills", size: "md" },
  },
);

export type FeatureTabItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: readonly string[];
  icon?: React.ReactNode;
};

const DEFAULT_ITEMS: readonly FeatureTabItem[] = [
  { id: "compose", label: "Compose", title: "Assemble without losing coherence", description: "Responsive blocks share a clear rhythm while keeping their own content and behavior.", bullets: ["Stable layout primitives", "Local visual tokens", "Semantic source order"], icon: <Layers3 /> },
  { id: "protect", label: "Protect", title: "Accessibility stays in the contract", description: "Keyboard paths, focus visibility, contrast, and reduced motion are designed with the component.", bullets: ["Roving keyboard focus", "System-color fallbacks", "Readable state labels"], icon: <ShieldCheck /> },
  { id: "measure", label: "Measure", title: "Make progress easy to understand", description: "Rich visuals stay secondary to the labels and explanations that give them meaning.", bullets: ["Scannable hierarchy", "Stable dimensions", "Clear next actions"], icon: <BarChart3 /> },
];

export type FeatureTabsProps = Omit<React.ComponentPropsWithoutRef<"section">, "defaultValue"> &
  VariantProps<typeof featureTabsVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    items?: readonly FeatureTabItem[];
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
  };

export function FeatureTabs({
  className,
  defaultValue,
  description = "Switch between the capabilities without leaving the context of the section.",
  disabled = false,
  eyebrow = "Explore the system",
  heading = "One surface, several focused stories",
  items = DEFAULT_ITEMS,
  onValueChange,
  size,
  value,
  variant,
  ...props
}: FeatureTabsProps) {
  const headingId = React.useId();
  const fallbackValue = defaultValue ?? items[0]?.id ?? "";
  const [internalValue, setInternalValue] = React.useState(fallbackValue);
  const activeValue = value ?? internalValue;

  const changeValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(featureTabsVariants({ variant, size }), className)}
      {...props}
    >
      <div className="mx-auto max-w-[740px] text-center">
        <p className="text-xs font-black tracking-[0.15em] text-[var(--mq-ftabs-accent,#5731b8)] uppercase">{eyebrow}</p>
        <h2 className="mt-3 text-balance text-[clamp(2rem,5vw,3.6rem)]/[1.02] font-black tracking-[-0.055em]" id={headingId}>{heading}</h2>
        <p className="mx-auto mt-4 max-w-[62ch] text-[15px]/[1.65] text-[var(--mq-ftabs-muted,#555249)]">{description}</p>
      </div>

      <TabsPrimitive.Root className="mt-8" onValueChange={changeValue} value={activeValue}>
        <TabsPrimitive.List
          aria-label="Feature views"
          className={cn(
            "flex w-full gap-2 overflow-x-auto border-[var(--mq-ftabs-border,#89857b)] p-1",
            variant === "pills" ? "rounded-[16px] border bg-[var(--mq-ftabs-card,#ffffff)]" : "border-b",
          )}
        >
          {items.map((item) => (
            <TabsPrimitive.Trigger
              className={cn(
                "min-h-11 flex-1 whitespace-nowrap px-4 text-sm font-extrabold text-[var(--mq-ftabs-muted,#555249)] transition-[background-color,color,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ftabs-accent,#5731b8)] motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50 forced-colors:border-[ButtonText]",
                variant === "pills"
                  ? "rounded-[12px] data-[state=active]:bg-[var(--mq-ftabs-accent,#5731b8)] data-[state=active]:text-[var(--mq-ftabs-accent-text,#ffffff)]"
                  : "border-b-2 border-transparent data-[state=active]:border-[var(--mq-ftabs-accent,#5731b8)] data-[state=active]:text-[var(--mq-ftabs-text,#201f1b)]",
              )}
              disabled={disabled}
              key={item.id}
              tabIndex={item.id === activeValue ? 0 : -1}
              value={item.id}
            >
              {item.label}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>

        {items.map((item, index) => (
          <TabsPrimitive.Content
            className="mt-5 rounded-[22px] border border-[var(--mq-ftabs-border,#89857b)] bg-[var(--mq-ftabs-card,#ffffff)] p-5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-ftabs-accent,#5731b8)] forced-colors:border-[CanvasText]"
            key={item.id}
            value={item.id}
          >
            <div className="grid items-center gap-7 md:grid-cols-[1fr_0.9fr]">
              <div>
                <span aria-hidden="true" className="grid size-12 place-items-center rounded-[15px] bg-[var(--mq-ftabs-soft,#e9e0ff)] text-[var(--mq-ftabs-accent,#5731b8)] forced-colors:border forced-colors:border-[CanvasText] [&>svg]:size-5">
                  {item.icon ?? <Sparkles />}
                </span>
                <h3 className="mt-5 text-[clamp(1.6rem,3.5vw,2.4rem)]/[1.08] font-black tracking-[-0.045em]">{item.title}</h3>
                <p className="mt-3 text-[15px]/[1.7] text-[var(--mq-ftabs-muted,#555249)]">{item.description}</p>
                <ul className="mt-5 grid list-none gap-3 p-0">
                  {item.bullets.map((bullet) => (
                    <li className="flex items-center gap-2.5 text-sm font-bold" key={bullet}>
                      <Check aria-hidden="true" className="size-4 shrink-0 text-[var(--mq-ftabs-accent,#5731b8)]" strokeWidth={3} />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
              <div aria-hidden="true" className="relative min-h-[240px] overflow-hidden rounded-[20px] bg-[var(--mq-ftabs-soft,#e9e0ff)] p-5 forced-colors:border forced-colors:border-[CanvasText]">
                <div className="absolute -right-10 -top-10 size-36 rounded-full bg-[var(--mq-ftabs-accent,#5731b8)] opacity-15 motion-safe:animate-pulse motion-reduce:animate-none forced-colors:hidden" />
                <div className="relative grid h-full grid-cols-2 gap-3">
                  <span className="col-span-2 rounded-[14px] bg-[var(--mq-ftabs-card,#ffffff)] p-4 shadow-[0_10px_24px_rgba(35,31,24,0.12)] forced-colors:shadow-none" />
                  <span className="rounded-[14px] bg-[var(--mq-ftabs-accent,#5731b8)] opacity-85" />
                  <span className="rounded-[14px] border border-[var(--mq-ftabs-border,#89857b)] bg-[var(--mq-ftabs-card,#ffffff)]" />
                  <span className="col-span-2 h-2 self-end rounded-full bg-[var(--mq-ftabs-accent,#5731b8)]" style={{ width: `${58 + index * 14}%` }} />
                </div>
              </div>
            </div>
          </TabsPrimitive.Content>
        ))}
      </TabsPrimitive.Root>
    </section>
  );
}

export { featureTabsVariants };
