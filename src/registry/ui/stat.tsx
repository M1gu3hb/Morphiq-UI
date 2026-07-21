import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Stat
 *
 * A compact KPI definition list. Material recipes, semantic trend tokens and
 * hover motion all live in this file; every custom property read includes a
 * literal fallback so consumers do not inherit dependencies on the site theme.
 */

const MATERIAL_TOKENS = {
  clay: [
    "[--mq-stat-surface:#fff4eb] [--mq-stat-text:#4a1d13] [--mq-stat-muted:#684b40]",
    "[--mq-stat-positive:#1f5f39] [--mq-stat-negative:#8b2924] [--mq-stat-neutral:#624f47]",
    "[--mq-stat-border:#c28f7c] [--mq-stat-border-strong:#9b5c4d] [--mq-stat-border-hover:#7d3c32]",
    "[--mq-stat-shadow:inset_0_1px_0_rgba(255,255,255,0.82),0_8px_20px_rgba(92,48,36,0.12)]",
    "[--mq-stat-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.88),0_13px_28px_rgba(92,48,36,0.18)]",
  ].join(" "),
  glass: [
    "[--mq-stat-surface:rgba(245,251,252,0.96)] [--mq-stat-text:#17343b] [--mq-stat-muted:#466068]",
    "[--mq-stat-positive:#145c3d] [--mq-stat-negative:#8a2f2a] [--mq-stat-neutral:#466068]",
    "[--mq-stat-border:#75969d] [--mq-stat-border-strong:#527881] [--mq-stat-border-hover:#315f69]",
    "[--mq-stat-shadow:inset_0_1px_0_rgba(255,255,255,0.94),0_10px_24px_rgba(14,54,63,0.14)]",
    "[--mq-stat-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.98),0_15px_32px_rgba(14,54,63,0.20)]",
  ].join(" "),
  skeuo: [
    "[--mq-stat-surface:#ece9e1] [--mq-stat-text:#292925] [--mq-stat-muted:#55534d]",
    "[--mq-stat-positive:#24583a] [--mq-stat-negative:#852b25] [--mq-stat-neutral:#56554f]",
    "[--mq-stat-border:#8f8b82] [--mq-stat-border-strong:#6b6962] [--mq-stat-border-hover:#4d4c47]",
    "[--mq-stat-shadow:inset_0_2px_1px_rgba(255,255,255,0.86),inset_0_-3px_5px_rgba(37,36,31,0.12),0_7px_16px_rgba(37,36,31,0.15)]",
    "[--mq-stat-shadow-hover:inset_0_2px_1px_rgba(255,255,255,0.92),inset_0_-3px_5px_rgba(37,36,31,0.14),0_12px_24px_rgba(37,36,31,0.21)]",
  ].join(" "),
  adaptive: [
    "[--mq-stat-surface:#ffffff] [--mq-stat-text:#171817] [--mq-stat-muted:#565851]",
    "[--mq-stat-positive:#1f643c] [--mq-stat-negative:#8b2e27] [--mq-stat-neutral:#565851]",
    "[--mq-stat-border:#8b8d87] [--mq-stat-border-strong:#666862] [--mq-stat-border-hover:#343632]",
    "[--mq-stat-shadow:0_8px_20px_rgba(23,24,23,0.10)] [--mq-stat-shadow-hover:0_14px_30px_rgba(23,24,23,0.16)]",
    "dark:[--mq-stat-surface:#242428] dark:[--mq-stat-text:#f5f3ee] dark:[--mq-stat-muted:#bebcb5]",
    "dark:[--mq-stat-positive:#9ad5ae] dark:[--mq-stat-negative:#ffaaa0] dark:[--mq-stat-neutral:#c1bfb8]",
    "dark:[--mq-stat-border:#8c8b85] dark:[--mq-stat-border-strong:#aaa8a2] dark:[--mq-stat-border-hover:#f5f3ee]",
    "dark:[--mq-stat-shadow:0_8px_20px_rgba(0,0,0,0.28)] dark:[--mq-stat-shadow-hover:0_14px_30px_rgba(0,0,0,0.42)]",
  ].join(" "),
} as const;

export type StatTrend = "positive" | "negative" | "neutral";
export type StatVariant = "default" | "outline";
export type StatSize = "sm" | "md" | "lg";

const statVariants = cva(
  [
    "relative isolate w-full border",
    "bg-[var(--mq-stat-surface,#fff4eb)] text-[color:var(--mq-stat-text,#4a1d13)]",
    "transition-[box-shadow,border-color] duration-200 ease-out motion-reduce:transition-none",
    "hover:border-[var(--mq-stat-border-hover,#7d3c32)] hover:shadow-[var(--mq-stat-shadow-hover,0_13px_28px_rgba(92,48,36,0.18))]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
    "forced-colors:hover:border-[Highlight] forced-colors:hover:shadow-none",
  ].join(" "),
  {
    variants: {
      material: MATERIAL_TOKENS,
      variant: {
        default:
          "border-[var(--mq-stat-border,#c28f7c)] shadow-[var(--mq-stat-shadow,0_8px_20px_rgba(92,48,36,0.12))]",
        outline:
          "border-2 border-[var(--mq-stat-border-strong,#9b5c4d)] shadow-none",
      },
      size: {
        sm: "rounded-[12px] p-[14px]",
        md: "rounded-[16px] p-[18px]",
        lg: "rounded-[20px] p-[22px]",
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

const labelVariants = cva(
  "m-0 font-bold uppercase tracking-[0.08em] text-[color:var(--mq-stat-muted,#684b40)] forced-colors:text-[CanvasText]",
  {
    variants: {
      size: {
        sm: "text-[10px] leading-[1.35]",
        md: "text-[11px] leading-[1.4]",
        lg: "text-[12px] leading-[1.4]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const valueVariants = cva(
  "block font-black leading-none tracking-[-0.045em] text-[color:var(--mq-stat-text,#4a1d13)] forced-colors:text-[CanvasText]",
  {
    variants: {
      size: {
        sm: "mt-[8px] text-[24px]",
        md: "mt-[10px] text-[34px]",
        lg: "mt-[12px] text-[44px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const deltaVariants = cva(
  "inline-flex items-center gap-[4px] font-extrabold tabular-nums forced-colors:text-[CanvasText]",
  {
    variants: {
      trend: {
        positive: "text-[color:var(--mq-stat-positive,#1f5f39)]",
        negative: "text-[color:var(--mq-stat-negative,#8b2924)]",
        neutral: "text-[color:var(--mq-stat-neutral,#624f47)]",
      },
      size: {
        sm: "text-[10px]",
        md: "text-[11px]",
        lg: "text-[12px]",
      },
    },
    defaultVariants: { trend: "neutral", size: "md" },
  },
);

const TREND_LABELS: Record<StatTrend, string> = {
  positive: "Increase",
  negative: "Decrease",
  neutral: "No change",
};

export type StatProps = Omit<React.ComponentPropsWithRef<"dl">, "children"> &
  VariantProps<typeof statVariants> & {
    label: React.ReactNode;
    value: React.ReactNode;
    caption?: React.ReactNode;
    delta?: React.ReactNode;
    icon?: React.ReactNode;
    trend?: StatTrend;
    /** Localized accessible word placed before the visible delta. */
    trendLabel?: string;
  };

function TrendArrow({ trend }: { trend: StatTrend }) {
  if (trend === "neutral") {
    return (
      <svg aria-hidden="true" className="size-[1em]" fill="none" viewBox="0 0 16 16">
        <path d="M3 8h10" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-[1em]" fill="none" viewBox="0 0 16 16">
      <path
        d={trend === "positive" ? "M3.5 10.5 10.5 3.5M6 3.5h4.5V8" : "M3.5 5.5l7 7M6 12.5h4.5V8"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function Stat({
  caption,
  className,
  delta,
  icon,
  label,
  material,
  size = "md",
  trend = "neutral",
  trendLabel,
  value,
  variant,
  ...props
}: StatProps) {
  return (
    <dl
      {...props}
      className={cn(statVariants({ material, size, variant }), className)}
      data-material={material ?? "clay"}
      data-trend={trend}
    >
      <div className="min-w-0">
        <dt className={cn(labelVariants({ size }), icon && "flex items-center gap-[12px]")}>
          {icon ? (
            <span
              aria-hidden="true"
              className="inline-flex size-[2.15em] shrink-0 items-center justify-center rounded-[10px] border border-[var(--mq-stat-border,#c28f7c)] text-[color:var(--mq-stat-text,#4a1d13)] [&>svg]:size-[1.1em] forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]"
              data-stat-icon=""
            >
              {icon}
            </span>
          ) : null}
          <span>{label}</span>
        </dt>
        <dd className={cn("m-0 min-w-0", icon && "pl-[calc(2.15em_+_12px)]")}>
          <span className={valueVariants({ size })} data-stat-value="">
            {value}
          </span>

          {delta || caption ? (
            <span className="mt-[10px] flex flex-wrap items-center gap-x-[9px] gap-y-[4px]">
              {delta ? (
                <span className={deltaVariants({ size, trend })} data-stat-delta={trend}>
                  <TrendArrow trend={trend} />
                  <span className="sr-only">{trendLabel ?? TREND_LABELS[trend]}: </span>
                  <span>{delta}</span>
                </span>
              ) : null}

              {caption ? (
                <span className="text-[0.72em] font-semibold leading-[1.45] text-[color:var(--mq-stat-muted,#684b40)] forced-colors:text-[CanvasText]">
                  {caption}
                </span>
              ) : null}
            </span>
          ) : null}
        </dd>
      </div>
    </dl>
  );
}

export { statVariants };
