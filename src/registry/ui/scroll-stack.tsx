import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export type ScrollStackItem = {
  id: string;
  title: string;
  description?: string;
  content?: React.ReactNode;
};

const scrollStackVariants = cva(
  [
    "relative isolate bg-[#0e1016] text-[#f5f7ff] [scrollbar-color:#697083_#171a22]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#f5f7ff]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] data-[focus=true]:outline-[#f5f7ff]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:[scrollbar-color:auto] forced-colors:focus-visible:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      variant: {
        compact: "[--mq-stack-gap:9px] [--mq-stack-space:36vh]",
        spacious: "[--mq-stack-gap:15px] [--mq-stack-space:48vh]",
      },
      size: {
        sm: "[--mq-stack-width:360px] [--mq-stack-pad:12px] [--mq-stack-top:12px]",
        md: "[--mq-stack-width:460px] [--mq-stack-pad:18px] [--mq-stack-top:18px]",
        lg: "[--mq-stack-width:580px] [--mq-stack-pad:24px] [--mq-stack-top:24px]",
      },
    },
    defaultVariants: { variant: "spacious", size: "md" },
  },
);

export type ScrollStackProps = Omit<React.ComponentPropsWithRef<"section">, "children"> &
  Omit<VariantProps<typeof scrollStackVariants>, "variant" | "size"> & {
    items: readonly ScrollStackItem[];
    material?: "adaptive";
    variant?: "compact" | "spacious";
    size?: "sm" | "md" | "lg";
    stickyOffset?: number;
  };

export function ScrollStack({
  "aria-label": ariaLabel = "Scroll stack",
  className,
  items,
  material = "adaptive",
  size = "md",
  stickyOffset = 0,
  style,
  variant = "spacious",
  ...props
}: ScrollStackProps) {
  const gap = variant === "compact" ? 9 : 15;

  return (
    <section
      {...props}
      aria-label={ariaLabel}
      className={cn(scrollStackVariants({ size, variant }), className)}
      data-material={material}
      style={{ "--mq-user-offset": `${Math.max(0, stickyOffset)}px`, ...style } as React.CSSProperties}
      tabIndex={props.tabIndex ?? 0}
    >
      <div className="mx-auto w-[min(var(--mq-stack-width,460px),100%)] px-[var(--mq-stack-pad,18px)] pb-[28vh]" role="list">
        {items.map((item, index) => (
          <div
            className="min-h-[var(--mq-stack-space,48vh)] last:min-h-[62vh]"
            key={item.id}
            role="listitem"
          >
            <article
              className={cn(
                "sticky isolate overflow-hidden rounded-[24px] border border-[#444957] bg-[#181b24] p-[22px]",
                "scale-[var(--mq-card-scale,1)] shadow-[0_18px_44px_rgba(0,0,0,0.34)]",
                "motion-reduce:scale-100 forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
              )}
              data-stack-index={index}
              style={
                {
                  "--mq-card-scale": `${Math.max(0.91, 1 - index * 0.018)}`,
                  top: `calc(var(--mq-stack-top, 18px) + var(--mq-user-offset, 0px) + ${index * gap}px)`,
                } as React.CSSProperties
              }
            >
              <span aria-hidden="true" className="mb-[28px] block font-mono text-[11px]/none tracking-[0.12em] text-[#aeb5c4] uppercase forced-colors:text-[CanvasText]">
                Frame {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="m-0 text-[22px]/[1.12] font-extrabold tracking-[-0.03em]">{item.title}</h3>
              {item.description ? <p className="mt-[9px] mb-0 max-w-[42ch] text-[13px]/[1.55] text-[#c8ccd8] forced-colors:text-[CanvasText]">{item.description}</p> : null}
              {item.content ? <div className="mt-[18px]">{item.content}</div> : null}
            </article>
          </div>
        ))}
        {items.length === 0 ? <p className="m-0 p-[24px] text-center text-[13px]">Add stack items.</p> : null}
      </div>
    </section>
  );
}

export { scrollStackVariants };
