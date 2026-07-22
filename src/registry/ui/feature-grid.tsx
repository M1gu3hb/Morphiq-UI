import * as React from "react";
import { Gauge, Layers3, ShieldCheck, Sparkles, Workflow, Zap } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const featureGridVariants = cva(
  [
    "w-full border bg-[var(--mq-features-bg,#f6f3ec)] text-[color:var(--mq-features-text,#201f1b)]",
    "border-[var(--mq-features-border,#89857b)] [--mq-features-bg:#f6f3ec] [--mq-features-card:#ffffff]",
    "[--mq-features-text:#201f1b] [--mq-features-muted:#555249] [--mq-features-accent:#5731b8]",
    "[--mq-features-border:#89857b] [--mq-features-soft:#e9e0ff]",
    "dark:[--mq-features-bg:#191a1e] dark:[--mq-features-card:#26272c] dark:[--mq-features-text:#f6f3ec]",
    "dark:[--mq-features-muted:#c5c1b8] dark:[--mq-features-accent:#b9a1ff]",
    "dark:[--mq-features-border:#918d84] dark:[--mq-features-soft:#352e49]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        bento: "shadow-[0_22px_58px_rgba(35,31,24,0.11)] forced-colors:shadow-none",
        equal: "shadow-none",
      },
      size: {
        sm: "rounded-[22px] p-5 md:p-7",
        md: "rounded-[28px] p-6 md:p-9",
        lg: "rounded-[34px] p-7 md:p-12",
      },
    },
    defaultVariants: { variant: "bento", size: "md" },
  },
);

export type FeatureGridItem = {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

const DEFAULT_FEATURES: readonly FeatureGridItem[] = [
  { id: "fast", title: "Instant feedback", description: "Every interaction responds with deliberate timing and a clear visual result.", icon: <Zap /> },
  { id: "layers", title: "Composable layers", description: "Arrange flexible primitives without losing spacing, rhythm, or ownership.", icon: <Layers3 /> },
  { id: "safe", title: "Accessible defaults", description: "Semantic markup, keyboard paths, and resilient contrast ship from the start.", icon: <ShieldCheck /> },
  { id: "flow", title: "Connected workflow", description: "Move from exploration to a production-ready pattern without a rewrite.", icon: <Workflow /> },
  { id: "measure", title: "Useful signals", description: "Surface the metrics that matter while keeping supporting detail calm.", icon: <Gauge /> },
  { id: "polish", title: "Tactile polish", description: "Depth and restraint make the system memorable without distracting from content.", icon: <Sparkles /> },
];

export type FeatureGridProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof featureGridVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    features?: readonly FeatureGridItem[];
  };

export function FeatureGrid({
  className,
  variant,
  size,
  eyebrow = "Built as a system",
  heading = "Everything needed to move with confidence",
  description = "A responsive feature section that keeps every benefit scannable from phone to wide desktop.",
  features = DEFAULT_FEATURES,
  ...props
}: FeatureGridProps) {
  return (
    <section className={cn(featureGridVariants({ variant, size }), className)} {...props}>
      <div className="max-w-[720px]">
        <p className="m-0 text-xs font-black tracking-[0.15em] text-[var(--mq-features-accent,#5731b8)] uppercase">{eyebrow}</p>
        <h2 className="mt-3 text-balance text-[clamp(2rem,5vw,3.7rem)]/[1.02] font-black tracking-[-0.055em]">{heading}</h2>
        <p className="mt-4 max-w-[62ch] text-[15px]/[1.65] text-[var(--mq-features-muted,#555249)]">{description}</p>
      </div>
      <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <li
            className={cn(
              "min-w-0 rounded-[20px] border border-[var(--mq-features-border,#89857b)] bg-[var(--mq-features-card,#ffffff)] p-5 transition-[box-shadow,border-color] duration-200 hover:border-[var(--mq-features-accent,#5731b8)] hover:shadow-[0_12px_28px_rgba(42,36,27,0.13)] motion-reduce:transition-none forced-colors:border-[CanvasText] forced-colors:shadow-none",
              variant === "bento" && index === 0 && "sm:col-span-2 lg:col-span-1",
              variant === "bento" && index === 3 && "lg:col-span-2",
            )}
            key={feature.id}
          >
            <span aria-hidden="true" className="grid size-11 place-items-center rounded-[13px] bg-[var(--mq-features-soft,#e9e0ff)] text-[var(--mq-features-accent,#5731b8)] [&>svg]:size-5">
              {feature.icon ?? <Sparkles />}
            </span>
            <h3 className="mt-5 text-lg font-black tracking-[-0.025em]">{feature.title}</h3>
            <p className="mt-2 text-sm/[1.6] text-[var(--mq-features-muted,#555249)]">{feature.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { featureGridVariants };
