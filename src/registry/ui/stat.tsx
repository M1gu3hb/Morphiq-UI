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
    "[--mq-stat-grad:linear-gradient(180deg,rgba(255,255,255,0.46),rgba(151,92,58,0.05))]",
    "[--mq-stat-edge:#e0bcac]",
    // The side wall is declared in BOTH states so the two lists keep the same
    // layer count and the same inset order — that is what lets `box-shadow`
    // interpolate on hover instead of swapping discretely. Warm ink throughout;
    // clay never casts black.
    "[--mq-stat-shadow:inset_0_1px_0_rgba(255,255,255,0.82),0_3px_0_var(--mq-stat-edge,#e0bcac),0_8px_20px_rgba(92,48,36,0.12)]",
    "[--mq-stat-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.88),0_5px_0_var(--mq-stat-edge,#e0bcac),0_16px_32px_rgba(92,48,36,0.20)]",
  ].join(" "),
  glass: [
    "[--mq-stat-surface:rgba(245,251,252,0.96)] [--mq-stat-text:#17343b] [--mq-stat-muted:#466068]",
    "[--mq-stat-positive:#145c3d] [--mq-stat-negative:#8a2f2a] [--mq-stat-neutral:#466068]",
    "[--mq-stat-border:#75969d] [--mq-stat-border-strong:#527881] [--mq-stat-border-hover:#315f69]",
    "[--mq-stat-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0))]",
    // A 1px specular filo whose geometry never changes between states, only its
    // intensity, over a wide cool cast shadow. No side wall: glass has none.
    "[--mq-stat-shadow:inset_0_1px_0_rgba(255,255,255,0.94),0_10px_24px_rgba(14,54,63,0.14)]",
    "[--mq-stat-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.98),0_18px_38px_rgba(14,54,63,0.22)]",
  ].join(" "),
  skeuo: [
    "[--mq-stat-surface:#ece9e1] [--mq-stat-text:#292925] [--mq-stat-muted:#55534d]",
    "[--mq-stat-positive:#24583a] [--mq-stat-negative:#852b25] [--mq-stat-neutral:#56554f]",
    "[--mq-stat-border:#8f8b82] [--mq-stat-border-strong:#6b6962] [--mq-stat-border-hover:#4d4c47]",
    // Warm greige with achromatic ink — the select/tabs convention. The surface
    // IS the gradient, lit over body.
    "[--mq-stat-grad:linear-gradient(180deg,#f2efe7,#dcd8ce)]",
    "[--mq-stat-edge:#a8a49b]",
    "[--mq-stat-shadow:inset_0_2px_1px_rgba(255,255,255,0.86),inset_0_-3px_5px_rgba(0,0,0,0.12),0_3px_0_var(--mq-stat-edge,#a8a49b),0_7px_16px_rgba(37,36,31,0.15)]",
    "[--mq-stat-shadow-hover:inset_0_2px_1px_rgba(255,255,255,0.92),inset_0_-3px_5px_rgba(0,0,0,0.14),0_5px_0_var(--mq-stat-edge,#a8a49b),0_14px_28px_rgba(37,36,31,0.23)]",
  ].join(" "),
  adaptive: [
    "[--mq-stat-surface:#ffffff] [--mq-stat-text:#171817] [--mq-stat-muted:#565851]",
    "[--mq-stat-positive:#1f643c] [--mq-stat-negative:#8b2e27] [--mq-stat-neutral:#565851]",
    "[--mq-stat-border:#8b8d87] [--mq-stat-border-strong:#666862] [--mq-stat-border-hover:#343632]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-stat-grad:none]",
    "[--mq-stat-shadow:0_8px_20px_rgba(23,24,23,0.10)] [--mq-stat-shadow-hover:0_16px_34px_rgba(23,24,23,0.18)]",
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
    // The material's surface wash, as an explicit property rather than a `bg-*`
    // utility: a colour and a gradient put through the same utility land in one
    // `tailwind-merge` group where one silently drops the other.
    "[background-image:var(--mq-stat-grad,none)]",
    // `translate` is named literally — Tailwind v4 writes its translate
    // utilities to that standalone property, so a transition naming `transform`
    // would leave the lift snapping instead of moving.
    "transition-[box-shadow,border-color,translate] duration-200 ease-out motion-reduce:transition-none",
    // Signature: the card lifts under the pointer and its contact shadow grows
    // with it, so the movement and the depth tell the same story.
    "hover:-translate-y-[3px]",
    "hover:border-[var(--mq-stat-border-hover,#7d3c32)] hover:shadow-[var(--mq-stat-shadow-hover,0_13px_28px_rgba(92,48,36,0.18))]",
    // The lift is pure feedback nobody has to read, so reduced motion cancels it
    // outright rather than keeping its end state.
    "motion-reduce:hover:translate-y-0",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
    "forced-colors:[background-image:none]",
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

/**
 * Keyframes travel with the component rather than living in a global stylesheet
 * a copier would have to find. React 19 hoists this and deduplicates it by
 * `href`, so a dashboard of Stats emits one rule, not one per card.
 */
const STAT_KEYFRAMES = `@keyframes mq-stat-delta{from{opacity:0;translate:0 4px}to{opacity:1;translate:0 0}}`;

function StatKeyframes() {
  return (
    <style href="mq-stat-delta" precedence="medium">
      {STAT_KEYFRAMES}
    </style>
  );
}

const deltaVariants = cva(
  [
    "inline-flex items-center gap-[4px] font-extrabold tabular-nums forced-colors:text-[CanvasText]",
    // Signature: the delta rises into place rather than simply being there. A
    // keyframe rather than a transition, because the figure is rendered in its
    // final state on mount and a transition would have nothing to run from.
    "animate-[mq-stat-delta_360ms_cubic-bezier(0.22,1.25,0.36,1)]",
    // Decoration only: the trend is already carried by the visually hidden
    // label beside it, never by the movement or the colour. Reduced motion
    // drops the entrance and the figure is simply present.
    "motion-reduce:animate-none",
  ].join(" "),
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
    <>
      <StatKeyframes />
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
    </>
  );
}

export { statVariants };
