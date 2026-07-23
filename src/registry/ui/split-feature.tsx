import * as React from "react";
import { BarChart3, Check, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const splitFeatureVariants = cva(
  [
    "w-full border bg-[var(--mq-split-bg,#f6f3ec)] text-[color:var(--mq-split-text,#201f1b)]",
    "border-[var(--mq-split-border,#89857b)] [--mq-split-bg:#f6f3ec] [--mq-split-card:#ffffff]",
    "[--mq-split-text:#201f1b] [--mq-split-muted:#555249] [--mq-split-accent:#5731b8]",
    "[--mq-split-soft:#e9e0ff] [--mq-split-border:#89857b]",
    "dark:[--mq-split-bg:#191a1e] dark:[--mq-split-card:#26272c] dark:[--mq-split-text:#f6f3ec]",
    "dark:[--mq-split-muted:#c5c1b8] dark:[--mq-split-accent:#b9a1ff]",
    "dark:[--mq-split-soft:#352e49] dark:[--mq-split-border:#918d84]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        alternating: "",
        stacked: "",
      },
      size: {
        sm: "rounded-[22px] p-5 md:p-7",
        md: "rounded-[28px] p-6 md:p-9",
        lg: "rounded-[34px] p-7 md:p-12",
      },
    },
    defaultVariants: { variant: "alternating", size: "md" },
  },
);

export type SplitFeatureItem = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: readonly string[];
  icon?: React.ReactNode;
};

const DEFAULT_FEATURES: readonly SplitFeatureItem[] = [
  { id: "compose", eyebrow: "Compose", title: "Build from parts that still feel related", description: "Shared rhythm and deliberate hierarchy let teams combine blocks without flattening their identity.", bullets: ["Responsive source order", "Local material tokens", "Clear content hierarchy"], icon: <Layers3 /> },
  { id: "verify", eyebrow: "Verify", title: "Catch structural problems before release", description: "Every registry entry is checked for dependencies, self-containment, source integrity, and static rendering.", bullets: ["Strict TypeScript", "Automated registry contract", "Static route generation"], icon: <ShieldCheck /> },
  { id: "measure", eyebrow: "Understand", title: "Keep the useful signal in view", description: "Focused visuals and readable explanations make progress understandable at a glance.", bullets: ["Accessible labels", "Stable visual dimensions", "Motion-safe feedback"], icon: <BarChart3 /> },
];

export type SplitFeatureProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof splitFeatureVariants> & {
    heading?: React.ReactNode;
    description?: React.ReactNode;
    features?: readonly SplitFeatureItem[];
  };

function FeatureVisual({ feature, index }: { feature: SplitFeatureItem; index: number }) {
  return (
    <div
      aria-hidden="true"
      className="relative min-h-[250px] overflow-hidden rounded-[24px] border border-[var(--mq-split-border,#89857b)] bg-[var(--mq-split-card,#ffffff)] p-6 shadow-[0_18px_38px_rgba(35,31,24,0.12)] forced-colors:shadow-none"
    >
      <div className="absolute -right-12 -top-12 size-44 rounded-full bg-[var(--mq-split-soft,#e9e0ff)] opacity-80 blur-2xl forced-colors:hidden" />
      <div className="relative grid h-full gap-4">
        <div className="flex items-center justify-between">
          <span className="grid size-12 place-items-center rounded-[15px] bg-[var(--mq-split-accent,#5731b8)] text-white forced-colors:border forced-colors:border-[CanvasText]">
            {feature.icon ?? <Sparkles className="size-5" />}
          </span>
          <span className="text-5xl font-black tracking-[-0.08em] text-[var(--mq-split-soft,#e9e0ff)]">0{index + 1}</span>
        </div>
        <div className="mt-auto grid grid-cols-3 items-end gap-3">
          {[46, 72, 58].map((height, barIndex) => (
            <span
              className="rounded-t-[12px] bg-[var(--mq-split-accent,#5731b8)] opacity-85"
              key={height}
              style={{ height: `${height + index * 7 + barIndex * 4}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SplitFeature({
  className,
  description = "Three focused stories, each pairing readable content with a visual that supports rather than interrupts it.",
  features = DEFAULT_FEATURES,
  heading = "A clearer way to explain the system",
  size,
  variant,
  ...props
}: SplitFeatureProps) {
  const headingId = React.useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn(splitFeatureVariants({ variant, size }), className)}
      {...props}
    >
      <div className="mx-auto max-w-[740px] text-center">
        <p className="text-xs font-black tracking-[0.15em] text-[var(--mq-split-accent,#5731b8)] uppercase">Feature stories</p>
        <h2 className="mt-3 text-balance text-[clamp(2rem,5vw,3.6rem)]/[1.02] font-black tracking-[-0.055em]" id={headingId}>{heading}</h2>
        <p className="mx-auto mt-4 max-w-[62ch] text-[15px]/[1.65] text-[var(--mq-split-muted,#555249)]">{description}</p>
      </div>
      <ul className="mt-10 grid list-none gap-10 p-0 md:gap-14">
        {features.map((feature, index) => {
          const reversed = variant === "alternating" && index % 2 === 1;
          return (
            <li className="grid items-center gap-6 md:grid-cols-2 md:gap-10" key={feature.id}>
              <div className={cn(reversed && "md:order-2")}>
                <p className="text-xs font-black tracking-[0.14em] text-[var(--mq-split-accent,#5731b8)] uppercase">{feature.eyebrow}</p>
                <h3 className="mt-3 text-[clamp(1.6rem,3.5vw,2.5rem)]/[1.08] font-black tracking-[-0.045em]">{feature.title}</h3>
                <p className="mt-4 text-[15px]/[1.7] text-[var(--mq-split-muted,#555249)]">{feature.description}</p>
                <ul className="mt-5 grid list-none gap-3 p-0">
                  {feature.bullets.map((bullet) => (
                    <li className="flex items-center gap-2.5 text-sm font-bold" key={bullet}>
                      <Check aria-hidden="true" className="size-4 shrink-0 text-[var(--mq-split-accent,#5731b8)]" strokeWidth={3} />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={cn(reversed && "md:order-1")}>
                <FeatureVisual feature={feature} index={index} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { splitFeatureVariants };
