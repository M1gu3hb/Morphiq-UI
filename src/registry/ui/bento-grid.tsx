import * as React from "react";
import { ArrowUpRight, Gauge, Layers3, ShieldCheck, Sparkles, Workflow, Zap } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const bentoGridVariants = cva(
  [
    "w-full border text-[color:var(--mq-bento-text,#33261e)]",
    "bg-[var(--mq-bento-bg,#f6e7dd)] border-[var(--mq-bento-border,rgba(120,80,55,0.24))]",
    "[--mq-bento-bg:#f6e7dd] [--mq-bento-cell:#fff8f2] [--mq-bento-text:#33261e]",
    "[--mq-bento-muted:#665044] [--mq-bento-accent:#9f321f] [--mq-bento-soft:#f3d5c3]",
    "[--mq-bento-border:rgba(120,80,55,0.24)] [--mq-bento-ring:#171817]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay:
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.78),inset_0_-6px_10px_rgba(140,90,60,0.12),0_8px_0_#dcc4b2,0_22px_38px_rgba(90,60,45,0.18)]",
        glass:
          "[--mq-bento-bg:rgba(255,255,255,0.72)] [--mq-bento-cell:rgba(255,255,255,0.78)] [--mq-bento-text:#1e1e1b] [--mq-bento-muted:#3f3f38] [--mq-bento-accent:#5030a8] [--mq-bento-soft:#e9e0ff] [--mq-bento-border:rgba(255,255,255,0.86)] backdrop-blur-[18px] backdrop-saturate-[170%] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_44px_rgba(24,20,40,0.22)]",
        skeuo:
          "[--mq-bento-bg:#e6e3da] [--mq-bento-cell:#f5f2eb] [--mq-bento-text:#23231f] [--mq-bento-muted:#4a4943] [--mq-bento-accent:#65472f] [--mq-bento-soft:#d7d1c5] [--mq-bento-border:rgba(25,25,23,0.3)] bg-[linear-gradient(180deg,#f6f4ee,var(--mq-bento-bg,#e6e3da))] shadow-[inset_0_2px_0_rgba(255,255,255,0.92),inset_0_-4px_7px_rgba(0,0,0,0.14),0_7px_0_#a8a49b,0_18px_28px_rgba(38,36,31,0.25)]",
        adaptive:
          "[--mq-bento-bg:#ffffff] [--mq-bento-cell:#f7f6f2] [--mq-bento-text:#1c1c19] [--mq-bento-muted:#55554e] [--mq-bento-accent:#5731b8] [--mq-bento-soft:#e9e0ff] [--mq-bento-border:rgba(23,24,23,0.2)] shadow-[0_2px_4px_rgba(20,20,18,0.08),0_20px_44px_rgba(20,20,18,0.12)] dark:[--mq-bento-bg:#232327] dark:[--mq-bento-cell:#2c2d32] dark:[--mq-bento-text:#f1efe9] dark:[--mq-bento-muted:#c1beb6] dark:[--mq-bento-accent:#b9a1ff] dark:[--mq-bento-soft:#352e49] dark:[--mq-bento-border:rgba(255,255,255,0.22)]",
      },
      variant: {
        asymmetric: "",
        balanced: "",
      },
      size: {
        sm: "rounded-[22px] p-5 md:p-7",
        md: "rounded-[28px] p-6 md:p-9",
        lg: "rounded-[34px] p-7 md:p-12",
      },
    },
    defaultVariants: { material: "clay", variant: "asymmetric", size: "md" },
  },
);

export type BentoGridItem = {
  id: string;
  title: string;
  description: string;
  eyebrow?: string;
  icon?: React.ReactNode;
  href?: string;
  span?: "standard" | "wide" | "tall";
};

const DEFAULT_ITEMS: readonly BentoGridItem[] = [
  { id: "speed", title: "Fast by default", description: "A lean foundation keeps the interface responsive as the product grows.", eyebrow: "Performance", icon: <Zap />, href: "#performance", span: "wide" },
  { id: "system", title: "One coherent system", description: "Tokens, behavior, and documentation stay connected.", eyebrow: "Foundation", icon: <Layers3 /> },
  { id: "safe", title: "Accessible paths", description: "Keyboard and assistive technology are part of the component contract.", eyebrow: "Inclusive", icon: <ShieldCheck />, span: "tall" },
  { id: "flow", title: "Visible workflow", description: "Move from first draft to a production checkpoint without losing context.", eyebrow: "Delivery", icon: <Workflow />, href: "#workflow", span: "wide" },
  { id: "signals", title: "Useful signals", description: "Surface the information that changes the next decision.", eyebrow: "Clarity", icon: <Gauge /> },
];

export type BentoGridProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof bentoGridVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    items?: readonly BentoGridItem[];
  };

function BentoCell({
  item,
  variant,
}: {
  item: BentoGridItem;
  variant: "asymmetric" | "balanced" | null | undefined;
}) {
  const cellClass = cn(
    "group relative flex min-h-[190px] min-w-0 flex-col overflow-hidden rounded-[20px] border border-[var(--mq-bento-border,rgba(120,80,55,0.24))] bg-[var(--mq-bento-cell,#fff8f2)] p-5 text-[var(--mq-bento-text,#33261e)] forced-colors:border-[CanvasText]",
    item.href && "transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(42,36,27,0.16)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-bento-ring,#171817)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 forced-colors:shadow-none",
    variant === "asymmetric" && item.span === "wide" && "sm:col-span-2",
    variant === "asymmetric" && item.span === "tall" && "sm:row-span-2 sm:min-h-[396px]",
  );
  const content = (
    <>
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center rounded-[14px] bg-[var(--mq-bento-soft,#f3d5c3)] text-[var(--mq-bento-accent,#9f321f)] forced-colors:border forced-colors:border-[CanvasText] [&>svg]:size-5"
      >
        {item.icon ?? <Sparkles />}
      </span>
      <div className="mt-auto pt-8">
        <p className="text-xs font-black tracking-[0.14em] text-[var(--mq-bento-accent,#9f321f)] uppercase">
          {item.eyebrow}
        </p>
        <h3 className="mt-2 text-xl/[1.15] font-black tracking-[-0.035em]">{item.title}</h3>
        <p className="mt-2 max-w-[48ch] text-sm/[1.6] text-[var(--mq-bento-muted,#665044)]">
          {item.description}
        </p>
      </div>
      {item.href ? (
        <ArrowUpRight
          aria-hidden="true"
          className="absolute right-5 top-5 size-4 text-[var(--mq-bento-accent,#9f321f)]"
        />
      ) : null}
    </>
  );

  return item.href ? (
    <a className={cellClass} href={item.href}>
      {content}
    </a>
  ) : (
    <article className={cellClass}>{content}</article>
  );
}

export function BentoGrid({
  className,
  description = "A mixed-span layout gives every feature the space its message deserves.",
  eyebrow = "System overview",
  heading = "A flexible grid with real hierarchy",
  items = DEFAULT_ITEMS,
  material,
  size,
  variant,
  ...props
}: BentoGridProps) {
  const headingId = React.useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn(bentoGridVariants({ material, variant, size }), className)}
      {...props}
    >
      <div className="max-w-[720px]">
        <p className="text-xs font-black tracking-[0.15em] text-[var(--mq-bento-accent,#9f321f)] uppercase">
          {eyebrow}
        </p>
        <h2
          className="mt-3 text-balance text-[clamp(2rem,5vw,3.6rem)]/[1.02] font-black tracking-[-0.055em]"
          id={headingId}
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-[62ch] text-[15px]/[1.65] text-[var(--mq-bento-muted,#665044)]">
          {description}
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <BentoCell item={item} key={item.id} variant={variant} />
        ))}
      </div>
    </section>
  );
}

export { bentoGridVariants };
