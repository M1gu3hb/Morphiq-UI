import * as React from "react";
import { ArrowRight, Mail } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const ctaSectionVariants = cva(
  [
    "relative isolate w-full overflow-hidden border text-[color:var(--mq-cta-text,#ffffff)]",
    "border-[var(--mq-cta-border,#2d2452)] [--mq-cta-bg:#2a174f] [--mq-cta-text:#ffffff]",
    "[--mq-cta-muted:#e1d9f3] [--mq-cta-accent:#f3c86a] [--mq-cta-button:#ffffff]",
    "[--mq-cta-button-text:#211b2d] [--mq-cta-border:#7662a3]",
    "dark:[--mq-cta-bg:#17141f] dark:[--mq-cta-text:#f8f5ef] dark:[--mq-cta-muted:#cec6dc]",
    "dark:[--mq-cta-accent:#f3c86a] dark:[--mq-cta-button:#f7f3ea] dark:[--mq-cta-button-text:#211b2d]",
    "dark:[--mq-cta-border:#9182af]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        gradient: "bg-[radial-gradient(circle_at_90%_10%,rgba(127,91,210,0.75),transparent_38%),linear-gradient(135deg,var(--mq-cta-bg,#2a174f),#402178)]",
        solid: "bg-[var(--mq-cta-bg,#2a174f)]",
      },
      size: {
        sm: "rounded-[22px] px-6 py-9 md:px-9",
        md: "rounded-[28px] px-7 py-11 md:px-12 md:py-14",
        lg: "rounded-[34px] px-8 py-14 md:px-16 md:py-18",
      },
    },
    defaultVariants: { variant: "gradient", size: "md" },
  },
);

export type CtaSectionAction = { label: string; href: string };
export type CtaSectionProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof ctaSectionVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    primaryAction?: CtaSectionAction;
    secondaryAction?: CtaSectionAction;
  };

const PRIMARY_ACTION = { label: "Start a project", href: "#start" };
const SECONDARY_ACTION = { label: "Talk to the team", href: "mailto:hello@example.com" };

export function CtaSection({
  className,
  variant,
  size,
  eyebrow = "Ready when you are",
  heading = "Build the next version with more clarity.",
  description = "Bring your system, your team, and your best ideas into one focused workflow.",
  primaryAction = PRIMARY_ACTION,
  secondaryAction = SECONDARY_ACTION,
  ...props
}: CtaSectionProps) {
  return (
    <section className={cn(ctaSectionVariants({ variant, size }), className)} {...props}>
      <div aria-hidden="true" className="absolute -right-20 -top-24 size-72 rounded-full border-[40px] border-[var(--mq-cta-accent,#f3c86a)] opacity-15 motion-safe:animate-pulse motion-reduce:animate-none forced-colors:hidden" />
      <div className="relative z-10 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
        <div className="max-w-[760px]">
          <p className="m-0 text-xs font-black tracking-[0.15em] text-[var(--mq-cta-accent,#f3c86a)] uppercase">{eyebrow}</p>
          <h2 className="mt-3 text-balance text-[clamp(2.1rem,6vw,4.8rem)]/[0.98] font-black tracking-[-0.06em]">{heading}</h2>
          <p className="mt-5 max-w-[58ch] text-[clamp(1rem,2vw,1.16rem)]/[1.6] text-[var(--mq-cta-muted,#e1d9f3)]">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-[var(--mq-cta-button,#ffffff)] bg-[var(--mq-cta-button,#ffffff)] px-6 font-extrabold text-[var(--mq-cta-button-text,#211b2d)] transition-[box-shadow] duration-200 hover:shadow-[0_10px_28px_rgba(0,0,0,0.22)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--mq-cta-accent,#f3c86a)] motion-reduce:transition-none forced-colors:border-[LinkText] forced-colors:bg-[Canvas] forced-colors:text-[LinkText]" href={primaryAction.href}>
            {primaryAction.label}<ArrowRight aria-hidden="true" className="size-4" />
          </a>
          <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-[var(--mq-cta-muted,#e1d9f3)] bg-transparent px-6 font-extrabold text-[var(--mq-cta-text,#ffffff)] transition-[background-color] duration-200 hover:bg-[rgba(255,255,255,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--mq-cta-accent,#f3c86a)] motion-reduce:transition-none forced-colors:border-[LinkText] forced-colors:text-[LinkText]" href={secondaryAction.href}>
            <Mail aria-hidden="true" className="size-4" />{secondaryAction.label}
          </a>
        </div>
      </div>
    </section>
  );
}

export { ctaSectionVariants };
