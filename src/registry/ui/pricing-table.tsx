"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const pricingTableVariants = cva(
  [
    "w-full border bg-[var(--mq-price-bg,#f5f2eb)] text-[color:var(--mq-price-text,#1f1e1a)]",
    "border-[var(--mq-price-border,#8a867c)] [--mq-price-bg:#f5f2eb] [--mq-price-card:#ffffff]",
    "[--mq-price-text:#1f1e1a] [--mq-price-muted:#56534b] [--mq-price-accent:#5731b8]",
    "[--mq-price-accent-text:#ffffff] [--mq-price-border:#8a867c] [--mq-price-soft:#e9e0ff]",
    "dark:[--mq-price-bg:#18191d] dark:[--mq-price-card:#25262b] dark:[--mq-price-text:#f7f4ed]",
    "dark:[--mq-price-muted:#c4c0b7] dark:[--mq-price-accent:#b9a1ff] dark:[--mq-price-accent-text:#17151d]",
    "dark:[--mq-price-border:#918d84] dark:[--mq-price-soft:#352e49]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        standard: "shadow-[0_22px_60px_rgba(35,31,24,0.12)] forced-colors:shadow-none",
        quiet: "shadow-none",
      },
      size: {
        sm: "rounded-[22px] p-5 md:p-7",
        md: "rounded-[28px] p-6 md:p-9",
        lg: "rounded-[34px] p-7 md:p-12",
      },
    },
    defaultVariants: { variant: "standard", size: "md" },
  },
);

export type PricingPeriod = "monthly" | "annual";
export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
};

const DEFAULT_PLANS: readonly PricingPlan[] = [
  { id: "starter", name: "Starter", description: "For focused personal work.", monthlyPrice: 12, annualPrice: 9, features: ["3 active projects", "Core analytics", "Community support"], ctaLabel: "Choose Starter", ctaHref: "#starter" },
  { id: "studio", name: "Studio", description: "For teams shipping every week.", monthlyPrice: 32, annualPrice: 25, features: ["Unlimited projects", "Advanced analytics", "Priority support", "Shared libraries"], ctaLabel: "Choose Studio", ctaHref: "#studio", featured: true },
  { id: "scale", name: "Scale", description: "For growing product organizations.", monthlyPrice: 68, annualPrice: 54, features: ["Everything in Studio", "Audit history", "SAML SSO", "Success manager"], ctaLabel: "Talk to sales", ctaHref: "#scale" },
];

export type PricingTableProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof pricingTableVariants> & {
    heading?: React.ReactNode;
    description?: React.ReactNode;
    plans?: readonly PricingPlan[];
    defaultPeriod?: PricingPeriod;
  };

export function PricingTable({
  className,
  variant,
  size,
  heading = "Pricing that grows with the work",
  description = "Start small, switch whenever you need, and save with annual billing.",
  plans = DEFAULT_PLANS,
  defaultPeriod = "monthly",
  ...props
}: PricingTableProps) {
  const [period, setPeriod] = React.useState<PricingPeriod>(defaultPeriod);
  const annual = period === "annual";

  return (
    <section className={cn(pricingTableVariants({ variant, size }), className)} {...props}>
      <div className="mx-auto max-w-[720px] text-center">
        <p className="m-0 text-xs font-black tracking-[0.15em] text-[var(--mq-price-accent,#5731b8)] uppercase">Plans</p>
        <h2 className="mt-3 text-balance text-[clamp(2rem,5vw,3.6rem)]/[1] font-black tracking-[-0.055em]">{heading}</h2>
        <p className="mx-auto mt-4 max-w-[58ch] text-[15px]/[1.6] text-[var(--mq-price-muted,#56534b)]">{description}</p>
        <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-[var(--mq-price-border,#8a867c)] bg-[var(--mq-price-card,#ffffff)] p-1.5">
          <span className={cn("px-2 text-sm font-bold", annual && "text-[var(--mq-price-muted,#56534b)]")}>Monthly</span>
          <button
            aria-checked={annual}
            aria-label="Use annual billing"
            className="relative h-7 w-12 rounded-full border border-[var(--mq-price-border,#8a867c)] bg-[var(--mq-price-soft,#e9e0ff)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-price-accent,#5731b8)] forced-colors:border-[ButtonText]"
            onClick={() => setPeriod((current) => (current === "monthly" ? "annual" : "monthly"))}
            role="switch"
            type="button"
          >
            <span className={cn("absolute left-[3px] top-[3px] size-5 rounded-full bg-[var(--mq-price-accent,#5731b8)] transition-[translate] duration-200 motion-reduce:transition-none forced-colors:bg-[ButtonText]", annual && "translate-x-5")} />
          </button>
          <span className={cn("px-2 text-sm font-bold", !annual && "text-[var(--mq-price-muted,#56534b)]")}>Annual <span className="sr-only">billing</span></span>
        </div>
      </div>

      <ul className="mt-9 grid list-none gap-5 p-0 lg:grid-cols-3 lg:items-stretch">
        {plans.map((plan) => (
          <li
            className={cn(
              "relative flex min-w-0 flex-col rounded-[22px] border border-[var(--mq-price-border,#8a867c)] bg-[var(--mq-price-card,#ffffff)] p-6 forced-colors:border-[CanvasText]",
              plan.featured && "border-[var(--mq-price-accent,#5731b8)] shadow-[0_18px_40px_rgba(87,49,184,0.18)] lg:-my-2 lg:py-8 forced-colors:shadow-none",
            )}
            key={plan.id}
          >
            {plan.featured ? <span className="mb-4 w-fit rounded-full bg-[var(--mq-price-accent,#5731b8)] px-3 py-1 text-xs font-black text-[var(--mq-price-accent-text,#ffffff)]">Most popular</span> : null}
            <h3 className="text-xl font-black tracking-[-0.025em]">{plan.name}</h3>
            <p className="mt-2 min-h-[3rem] text-sm/[1.5] text-[var(--mq-price-muted,#56534b)]">{plan.description}</p>
            <p className="mt-6 flex items-end gap-1">
              <span className="text-4xl font-black tracking-[-0.06em]">${annual ? plan.annualPrice : plan.monthlyPrice}</span>
              <span className="pb-1 text-sm text-[var(--mq-price-muted,#56534b)]">/ month</span>
            </p>
            {annual ? <p className="mt-1 text-xs font-bold text-[var(--mq-price-accent,#5731b8)]">Billed annually</p> : <div className="h-5" />}
            <ul className="my-6 grid list-none gap-3 p-0">
              {plan.features.map((feature) => (
                <li className="flex gap-2.5 text-sm/[1.45]" key={feature}>
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--mq-price-accent,#5731b8)]" strokeWidth={3} />
                  {feature}
                </li>
              ))}
            </ul>
            <a className={cn("mt-auto inline-flex min-h-11 items-center justify-center rounded-[12px] border px-4 text-sm font-extrabold focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-price-accent,#5731b8)] forced-colors:border-[LinkText]", plan.featured ? "border-[var(--mq-price-accent,#5731b8)] bg-[var(--mq-price-accent,#5731b8)] text-[var(--mq-price-accent-text,#ffffff)]" : "border-[var(--mq-price-border,#8a867c)] text-[var(--mq-price-text,#1f1e1a)] transition-[background-color] duration-200 hover:bg-[var(--mq-price-soft,#e9e0ff)] motion-reduce:transition-none")} href={plan.ctaHref}>
              {plan.ctaLabel}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { pricingTableVariants };
