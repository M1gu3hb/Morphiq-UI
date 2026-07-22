"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const statsSectionVariants = cva(
  [
    "w-full border bg-[var(--mq-stats-bg,#f5f2eb)] text-[color:var(--mq-stats-text,#201f1b)]",
    "border-[var(--mq-stats-border,#89857b)] [--mq-stats-bg:#f5f2eb] [--mq-stats-card:#ffffff]",
    "[--mq-stats-text:#201f1b] [--mq-stats-muted:#555249] [--mq-stats-accent:#5731b8]",
    "[--mq-stats-border:#89857b] [--mq-stats-soft:#e9e0ff]",
    "dark:[--mq-stats-bg:#191a1e] dark:[--mq-stats-card:#26272c] dark:[--mq-stats-text:#f6f3ec]",
    "dark:[--mq-stats-muted:#c5c1b8] dark:[--mq-stats-accent:#b9a1ff]",
    "dark:[--mq-stats-border:#918d84] dark:[--mq-stats-soft:#352e49]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        cards: "shadow-[0_20px_52px_rgba(35,31,24,0.1)] forced-colors:shadow-none",
        band: "shadow-none",
      },
      size: {
        sm: "rounded-[20px] p-5 md:p-7",
        md: "rounded-[26px] p-6 md:p-9",
        lg: "rounded-[32px] p-7 md:p-12",
      },
    },
    defaultVariants: { variant: "cards", size: "md" },
  },
);

export type StatsSectionItem = {
  id: string;
  value: number;
  label: string;
  detail?: string;
  prefix?: string;
  suffix?: string;
};

const DEFAULT_STATS: readonly StatsSectionItem[] = [
  { id: "teams", value: 240, suffix: "+", label: "Teams shipping", detail: "Across 18 countries" },
  { id: "uptime", value: 99, suffix: "%", label: "Workflow uptime", detail: "Over the last 12 months" },
  { id: "hours", value: 14, suffix: "h", label: "Saved each week", detail: "Per product squad" },
  { id: "score", value: 4, suffix: ".9", label: "Average rating", detail: "From verified teams" },
];

function AnimatedValue({ item, animate }: { item: StatsSectionItem; animate: boolean }) {
  const [display, setDisplay] = React.useState(() => (animate ? 0 : item.value));

  React.useEffect(() => {
    let frame = 0;
    if (!animate) {
      frame = window.requestAnimationFrame(() => setDisplay(item.value));
      return () => window.cancelAnimationFrame(frame);
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      frame = window.requestAnimationFrame(() => setDisplay(item.value));
      return () => window.cancelAnimationFrame(frame);
    }

    const duration = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(item.value * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [animate, item.value]);

  const finalText = `${item.prefix ?? ""}${item.value}${item.suffix ?? ""}`;
  return (
    <data aria-label={finalText} value={item.value}>
      <span aria-hidden="true">{item.prefix}{display}{item.suffix}</span>
    </data>
  );
}

export type StatsSectionProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof statsSectionVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    stats?: readonly StatsSectionItem[];
    animate?: boolean;
  };

export function StatsSection({
  className,
  variant,
  size,
  eyebrow = "Measured momentum",
  heading = "Progress you can point to",
  stats = DEFAULT_STATS,
  animate = true,
  ...props
}: StatsSectionProps) {
  return (
    <section className={cn(statsSectionVariants({ variant, size }), className)} {...props}>
      <div className="max-w-[720px]">
        <p className="m-0 text-xs font-black tracking-[0.15em] text-[var(--mq-stats-accent,#5731b8)] uppercase">{eyebrow}</p>
        <h2 className="mt-3 text-balance text-[clamp(2rem,5vw,3.7rem)]/[1.02] font-black tracking-[-0.055em]">{heading}</h2>
      </div>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div className={cn("min-w-0 rounded-[18px] border border-[var(--mq-stats-border,#89857b)] p-5", variant === "cards" ? "bg-[var(--mq-stats-card,#ffffff)] shadow-[0_8px_20px_rgba(40,35,27,0.07)] forced-colors:shadow-none" : "bg-[var(--mq-stats-soft,#e9e0ff)]")} key={item.id}>
            <dt className="text-sm font-extrabold text-[var(--mq-stats-muted,#555249)]">{item.label}</dt>
            <dd className="mt-3 text-[clamp(2.2rem,6vw,4rem)]/[0.95] font-black tracking-[-0.065em] text-[var(--mq-stats-text,#201f1b)]">
              <AnimatedValue animate={animate} item={item} />
            </dd>
            {item.detail ? <dd className="mt-3 text-xs/[1.5] text-[var(--mq-stats-muted,#555249)]">{item.detail}</dd> : null}
          </div>
        ))}
      </dl>
    </section>
  );
}

export { statsSectionVariants };
