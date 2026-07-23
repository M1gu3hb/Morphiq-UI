"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const faqSectionVariants = cva(
  [
    "w-full border bg-[var(--mq-faq-bg,#f6f3ec)] text-[color:var(--mq-faq-text,#201f1b)]",
    "border-[var(--mq-faq-border,#89857b)] [--mq-faq-bg:#f6f3ec] [--mq-faq-card:#ffffff]",
    "[--mq-faq-text:#201f1b] [--mq-faq-muted:#555249] [--mq-faq-accent:#5731b8]",
    "[--mq-faq-soft:#e9e0ff] [--mq-faq-border:#89857b]",
    "dark:[--mq-faq-bg:#191a1e] dark:[--mq-faq-card:#26272c] dark:[--mq-faq-text:#f6f3ec]",
    "dark:[--mq-faq-muted:#c5c1b8] dark:[--mq-faq-accent:#b9a1ff]",
    "dark:[--mq-faq-soft:#352e49] dark:[--mq-faq-border:#918d84]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        cards: "shadow-[0_22px_58px_rgba(35,31,24,0.11)] forced-colors:shadow-none",
        divided: "shadow-none",
      },
      size: {
        sm: "rounded-[22px] p-5 md:p-7",
        md: "rounded-[28px] p-6 md:p-9",
        lg: "rounded-[34px] p-7 md:p-12",
      },
    },
    defaultVariants: { variant: "cards", size: "md" },
  },
);

export type FaqItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

const DEFAULT_ITEMS: readonly FaqItem[] = [
  {
    id: "ownership",
    question: "Do I own the component source?",
    answer: "Yes. Copy the source into your project, tune its local tokens, and ship it as part of your own interface.",
  },
  {
    id: "materials",
    question: "Can one component use another material?",
    answer: "Material recipes are colocated with each component, so switching the material prop keeps behavior and accessibility intact.",
  },
  {
    id: "motion",
    question: "What happens when reduced motion is enabled?",
    answer: "Decorative travel and expansion transitions stop while the final content and every control remain available.",
  },
  {
    id: "accessibility",
    question: "Are keyboard interactions included?",
    answer: "Every disclosure is a native button with an expanded state and an explicitly associated answer region.",
  },
];

export type FaqSectionProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof faqSectionVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    items?: readonly FaqItem[];
    defaultOpenIds?: readonly string[];
    allowMultiple?: boolean;
  };

export function FaqSection({
  allowMultiple = false,
  className,
  defaultOpenIds = [DEFAULT_ITEMS[0].id],
  description = "Clear answers, available without leaving the page or losing keyboard position.",
  eyebrow = "Questions, answered",
  heading = "Everything you need to know",
  items = DEFAULT_ITEMS,
  size,
  variant,
  ...props
}: FaqSectionProps) {
  const headingId = React.useId();
  const baseId = React.useId();
  const [openIds, setOpenIds] = React.useState(() => new Set(defaultOpenIds));

  const toggle = (id: string) => {
    setOpenIds((current) => {
      const next = allowMultiple ? new Set(current) : new Set<string>();
      if (!current.has(id)) next.add(id);
      else if (allowMultiple) next.delete(id);
      return next;
    });
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(faqSectionVariants({ variant, size }), className)}
      {...props}
    >
      <div className="mx-auto max-w-[720px] text-center">
        <span
          aria-hidden="true"
          className="mx-auto grid size-11 place-items-center rounded-[14px] bg-[var(--mq-faq-soft,#e9e0ff)] text-[var(--mq-faq-accent,#5731b8)] forced-colors:border forced-colors:border-[CanvasText]"
        >
          <HelpCircle className="size-5" />
        </span>
        <p className="mt-4 text-xs font-black tracking-[0.15em] text-[var(--mq-faq-accent,#5731b8)] uppercase">
          {eyebrow}
        </p>
        <h2
          className="mt-3 text-balance text-[clamp(2rem,5vw,3.6rem)]/[1.02] font-black tracking-[-0.055em]"
          id={headingId}
        >
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-[60ch] text-[15px]/[1.65] text-[var(--mq-faq-muted,#555249)]">
          {description}
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-[820px] gap-3">
        {items.map((item) => {
          const open = openIds.has(item.id);
          const triggerId = `${baseId}-${item.id}-trigger`;
          const panelId = `${baseId}-${item.id}-panel`;
          return (
            <div
              className={cn(
                "overflow-hidden border border-[var(--mq-faq-border,#89857b)] bg-[var(--mq-faq-card,#ffffff)] forced-colors:border-[CanvasText]",
                variant === "cards" ? "rounded-[18px]" : "border-x-0 border-t-0",
              )}
              key={item.id}
            >
              <h3 className="m-0 text-base font-black">
                <button
                  aria-controls={panelId}
                  aria-expanded={open}
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-[var(--mq-faq-text,#201f1b)] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--mq-faq-accent,#5731b8)]"
                  id={triggerId}
                  onClick={() => toggle(item.id)}
                  type="button"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-5 shrink-0 text-[var(--mq-faq-accent,#5731b8)] transition-[rotate] duration-200 motion-reduce:transition-none",
                      open && "rotate-180",
                    )}
                  />
                </button>
              </h3>
              <div
                aria-hidden={!open}
                aria-labelledby={triggerId}
                className={cn(
                  "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
                id={panelId}
                role="region"
              >
                <div className="min-h-0">
                  <div className="border-t border-[var(--mq-faq-border,#89857b)] px-5 py-4 text-sm/[1.7] text-[var(--mq-faq-muted,#555249)]">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { faqSectionVariants };
