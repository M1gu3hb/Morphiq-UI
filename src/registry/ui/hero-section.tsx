import * as React from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const heroSectionVariants = cva(
  [
    "relative isolate grid w-full overflow-hidden border",
    "bg-[var(--mq-hero-bg,#f7f4ed)] text-[color:var(--mq-hero-text,#1f1e1a)]",
    "border-[var(--mq-hero-border,#8b877d)] shadow-[0_24px_70px_rgba(38,34,25,0.14)]",
    "[--mq-hero-bg:#f7f4ed] [--mq-hero-panel:#ffffff] [--mq-hero-text:#1f1e1a]",
    "[--mq-hero-muted:#555249] [--mq-hero-accent:#5731b8] [--mq-hero-accent-text:#ffffff]",
    "[--mq-hero-border:#8b877d] [--mq-hero-soft:#e7ddff]",
    "dark:[--mq-hero-bg:#18191d] dark:[--mq-hero-panel:#25262b] dark:[--mq-hero-text:#f7f4ed]",
    "dark:[--mq-hero-muted:#c5c1b8] dark:[--mq-hero-accent:#b9a1ff] dark:[--mq-hero-accent-text:#17151d]",
    "dark:[--mq-hero-border:#8f8b82] dark:[--mq-hero-soft:#342c4a]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        split: "items-center lg:grid-cols-[1.05fr_0.95fr]",
        centered: "grid-cols-1 text-center",
      },
      size: {
        sm: "gap-7 rounded-[24px] p-6 md:p-8",
        md: "gap-9 rounded-[30px] p-7 md:p-10 lg:p-12",
        lg: "gap-12 rounded-[36px] p-8 md:p-12 lg:p-16",
      },
    },
    defaultVariants: { variant: "split", size: "md" },
  },
);

export type HeroSectionAction = { label: string; href: string };

export type HeroSectionProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof heroSectionVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    primaryAction?: HeroSectionAction;
    secondaryAction?: HeroSectionAction;
    visual?: React.ReactNode;
    headingAs?: "h1" | "h2";
  };

const DEFAULT_PRIMARY = { label: "Start building", href: "#start" };
const DEFAULT_SECONDARY = { label: "Watch overview", href: "#overview" };

function DefaultHeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-[26px] border border-[var(--mq-hero-border,#8b877d)] bg-[var(--mq-hero-panel,#ffffff)] p-5 shadow-[0_20px_45px_rgba(39,32,23,0.18)] forced-colors:shadow-none"
    >
      <div className="absolute -right-[15%] -top-[22%] size-[65%] rounded-full bg-[var(--mq-hero-soft,#e7ddff)] opacity-90 blur-2xl motion-safe:animate-pulse motion-reduce:animate-none forced-colors:hidden" />
      <div className="relative grid h-full grid-cols-[0.7fr_1fr] gap-4">
        <div className="rounded-[18px] bg-[var(--mq-hero-accent,#5731b8)] p-4 text-[var(--mq-hero-accent-text,#ffffff)]">
          <div className="mb-8 h-2 w-16 rounded-full bg-current opacity-65" />
          <div className="mt-auto text-4xl font-black tracking-[-0.06em]">84%</div>
          <div className="mt-2 text-xs font-bold opacity-85">Weekly momentum</div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[18px] border border-[var(--mq-hero-border,#8b877d)] p-4">
            <div className="h-2 w-20 rounded-full bg-[var(--mq-hero-muted,#555249)] opacity-45" />
            <div className="mt-5 h-3 w-4/5 rounded-full bg-[var(--mq-hero-text,#1f1e1a)] opacity-80" />
            <div className="mt-2 h-3 w-3/5 rounded-full bg-[var(--mq-hero-text,#1f1e1a)] opacity-35" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[16px] bg-[var(--mq-hero-soft,#e7ddff)] p-3" />
            <div className="rounded-[16px] border border-[var(--mq-hero-border,#8b877d)] p-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({
  className,
  variant,
  size,
  eyebrow = "Designed for momentum",
  heading = "Turn ambitious ideas into polished experiences.",
  description = "A responsive launch surface with clear hierarchy, two deliberate actions, and a visual that earns its space.",
  primaryAction = DEFAULT_PRIMARY,
  secondaryAction = DEFAULT_SECONDARY,
  visual,
  headingAs = "h2",
  ...props
}: HeroSectionProps) {
  const Heading = headingAs;
  const centered = variant === "centered";

  return (
    <section className={cn(heroSectionVariants({ variant, size }), className)} {...props}>
      <div className={cn("relative z-10", centered && "mx-auto max-w-[780px]")}>
        <p className="mb-4 text-xs font-black tracking-[0.16em] text-[var(--mq-hero-accent,#5731b8)] uppercase">
          {eyebrow}
        </p>
        <Heading className="m-0 text-balance text-[clamp(2.35rem,6vw,5.6rem)]/[0.96] font-black tracking-[-0.065em]">
          {heading}
        </Heading>
        <p className={cn("mt-6 max-w-[64ch] text-[clamp(1rem,2vw,1.2rem)]/[1.6] text-[var(--mq-hero-muted,#555249)]", centered && "mx-auto")}>
          {description}
        </p>
        <div className={cn("mt-8 flex flex-col gap-3 sm:flex-row", centered && "justify-center")}>
          <a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-[var(--mq-hero-accent,#5731b8)] bg-[var(--mq-hero-accent,#5731b8)] px-6 font-extrabold text-[var(--mq-hero-accent-text,#ffffff)] transition-[box-shadow] duration-200 hover:shadow-[0_8px_22px_rgba(87,49,184,0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--mq-hero-accent,#5731b8)] motion-reduce:transition-none forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]"
            href={primaryAction.href}
          >
            {primaryAction.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
          <a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-[var(--mq-hero-border,#8b877d)] bg-[var(--mq-hero-panel,#ffffff)] px-6 font-extrabold text-[var(--mq-hero-text,#1f1e1a)] transition-[background-color] duration-200 hover:bg-[var(--mq-hero-soft,#e7ddff)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--mq-hero-accent,#5731b8)] motion-reduce:transition-none forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]"
            href={secondaryAction.href}
          >
            <PlayCircle aria-hidden="true" className="size-4" />
            {secondaryAction.label}
          </a>
        </div>
      </div>
      <div className={cn("relative z-10", centered && "mx-auto w-full max-w-[720px]")}>
        {visual ?? <DefaultHeroVisual />}
      </div>
    </section>
  );
}

export { heroSectionVariants };
