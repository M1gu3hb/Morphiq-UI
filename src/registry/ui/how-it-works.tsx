import * as React from "react";
import { CheckCircle2, MousePointer2, PackageCheck, SlidersHorizontal } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const howItWorksVariants = cva(
  [
    "w-full border bg-[var(--mq-how-bg,#f6f3ec)] text-[color:var(--mq-how-text,#201f1b)]",
    "border-[var(--mq-how-border,#89857b)] [--mq-how-bg:#f6f3ec] [--mq-how-card:#ffffff]",
    "[--mq-how-text:#201f1b] [--mq-how-muted:#555249] [--mq-how-accent:#5731b8]",
    "[--mq-how-soft:#e9e0ff] [--mq-how-border:#89857b]",
    "dark:[--mq-how-bg:#191a1e] dark:[--mq-how-card:#26272c] dark:[--mq-how-text:#f6f3ec]",
    "dark:[--mq-how-muted:#c5c1b8] dark:[--mq-how-accent:#b9a1ff]",
    "dark:[--mq-how-soft:#352e49] dark:[--mq-how-border:#918d84]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        horizontal: "",
        vertical: "",
      },
      size: {
        sm: "rounded-[22px] p-5 md:p-7",
        md: "rounded-[28px] p-6 md:p-9",
        lg: "rounded-[34px] p-7 md:p-12",
      },
    },
    defaultVariants: { variant: "horizontal", size: "md" },
  },
);

export type HowItWorksStep = {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

const DEFAULT_STEPS: readonly HowItWorksStep[] = [
  { id: "choose", title: "Choose the pattern", description: "Start from the interaction and content your screen actually needs.", icon: <MousePointer2 /> },
  { id: "shape", title: "Shape the material", description: "Select a tactile recipe, then tune the local tokens without global coupling.", icon: <SlidersHorizontal /> },
  { id: "own", title: "Copy and own it", description: "Bring the open source into your codebase with its accessibility contract intact.", icon: <PackageCheck /> },
  { id: "ship", title: "Verify and ship", description: "Run the gate, review the real route, and publish a stable checkpoint.", icon: <CheckCircle2 /> },
];

export type HowItWorksProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof howItWorksVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    steps?: readonly HowItWorksStep[];
  };

export function HowItWorks({
  className,
  description = "A direct path from a useful idea to source your team can understand and maintain.",
  eyebrow = "The workflow",
  heading = "From pattern to production in four steps",
  size,
  steps = DEFAULT_STEPS,
  variant,
  ...props
}: HowItWorksProps) {
  const headingId = React.useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn(howItWorksVariants({ variant, size }), className)}
      {...props}
    >
      <div className="mx-auto max-w-[740px] text-center">
        <p className="text-xs font-black tracking-[0.15em] text-[var(--mq-how-accent,#5731b8)] uppercase">{eyebrow}</p>
        <h2 className="mt-3 text-balance text-[clamp(2rem,5vw,3.6rem)]/[1.02] font-black tracking-[-0.055em]" id={headingId}>{heading}</h2>
        <p className="mx-auto mt-4 max-w-[62ch] text-[15px]/[1.65] text-[var(--mq-how-muted,#555249)]">{description}</p>
      </div>
      <ol
        className={cn(
          "relative mt-9 grid list-none gap-4 p-0",
          variant === "horizontal" ? "md:grid-cols-2 lg:grid-cols-4" : "mx-auto max-w-[760px]",
        )}
      >
        {steps.map((step, index) => (
          <li
            className={cn(
              "relative rounded-[20px] border border-[var(--mq-how-border,#89857b)] bg-[var(--mq-how-card,#ffffff)] p-5 forced-colors:border-[CanvasText]",
              variant === "vertical" && "grid gap-4 sm:grid-cols-[64px_1fr] sm:items-start",
            )}
            key={step.id}
          >
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bg-[var(--mq-how-border,#89857b)] forced-colors:bg-[CanvasText]",
                  variant === "horizontal" ? "-right-[17px] top-10 hidden h-px w-[18px] lg:block" : "bottom-[-17px] left-9 h-[18px] w-px sm:left-8",
                )}
              />
            ) : null}
            <div className="flex items-center gap-3 sm:block">
              <span
                aria-hidden="true"
                className="grid size-12 shrink-0 place-items-center rounded-[15px] bg-[var(--mq-how-soft,#e9e0ff)] text-[var(--mq-how-accent,#5731b8)] forced-colors:border forced-colors:border-[CanvasText] [&>svg]:size-5"
              >
                {step.icon}
              </span>
              <span className="text-sm font-black text-[var(--mq-how-accent,#5731b8)] sm:mt-4 sm:block">
                Step {index + 1}
              </span>
            </div>
            <div className={variant === "horizontal" ? "mt-4" : ""}>
              <h3 className="text-lg font-black tracking-[-0.025em]">{step.title}</h3>
              <p className="mt-2 text-sm/[1.65] text-[var(--mq-how-muted,#555249)]">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export { howItWorksVariants };
