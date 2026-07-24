import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

const FIREWORK_KEYFRAMES = `@keyframes mq-firework{0%,14%{translate:0 0;scale:.2;opacity:0}20%{opacity:1}58%,100%{translate:var(--mq-fire-x,0px) var(--mq-fire-y,0px);scale:1;opacity:0}}`;

function FireworkKeyframes() {
  return <style href="mq-fireworks" precedence="medium">{FIREWORK_KEYFRAMES}</style>;
}

const fireworksVariants = cva(
  [
    "relative isolate overflow-hidden border bg-[#090c16] text-[#f7f8fc]",
    "border-[rgba(244,246,255,0.18)] shadow-[0_18px_48px_rgba(4,7,15,0.34)]",
    "focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[#f4d06f]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        festival: "[--mq-fire:#a8ff78] [--mq-fire-alt:#7dd3fc]",
        sunset: "[--mq-fire:#ffb86b] [--mq-fire-alt:#e879f9]",
      },
      size: {
        sm: "min-h-[160px] rounded-[18px] p-[18px] [--mq-fire-distance:32]",
        md: "min-h-[210px] rounded-[24px] p-[24px] [--mq-fire-distance:44]",
        lg: "min-h-[270px] rounded-[30px] p-[30px] [--mq-fire-distance:58]",
      },
    },
    defaultVariants: { variant: "festival", size: "md" },
  },
);

type FireworksVariant = "festival" | "sunset";
type FireworksSize = "sm" | "md" | "lg";

const BURSTS = [
  { x: 24, y: 34, delay: 0 },
  { x: 72, y: 28, delay: 0.62 },
  { x: 58, y: 68, delay: 1.18 },
] as const;

export type FireworksProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof fireworksVariants>, "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: FireworksVariant;
    size?: FireworksSize;
    particles?: number;
    duration?: number;
  };

export function Fireworks({
  children,
  className,
  duration = 2.2,
  material = "adaptive",
  particles = 10,
  size = "md",
  variant = "festival",
  ...props
}: FireworksProps) {
  const count = Math.max(6, Math.min(14, Math.round(particles)));
  const safeDuration = Math.max(1.4, Math.min(5, duration));
  const distance = size === "sm" ? 32 : size === "lg" ? 58 : 44;

  return (
    <div
      {...props}
      className={cn(fireworksVariants({ size, variant }), className)}
      data-material={material}
    >
      <FireworkKeyframes />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 motion-reduce:hidden forced-colors:hidden">
        {BURSTS.map((burst, burstIndex) => (
          <span className="absolute" key={`${burst.x}-${burst.y}`} style={{ left: `${burst.x}%`, top: `${burst.y}%` }}>
            {Array.from({ length: count }, (_, index) => {
              const angle = (Math.PI * 2 * index) / count;
              const color = index % 2 === 0 ? "var(--mq-fire,#a8ff78)" : "var(--mq-fire-alt,#7dd3fc)";
              return (
                <span
                  className="absolute left-[-2px] top-[-2px] h-[3px] w-[7px] rounded-full animate-[mq-firework_2.2s_cubic-bezier(.16,.8,.3,1)_infinite_both]"
                  key={index}
                  style={{
                    "--mq-fire-x": `${Math.cos(angle) * distance}px`,
                    "--mq-fire-y": `${Math.sin(angle) * distance}px`,
                    animationDelay: `${burst.delay + burstIndex * 0.04 + index * 0.012}s`,
                    animationDuration: `${safeDuration}s`,
                    backgroundColor: color,
                    boxShadow: `0 0 9px ${color}`,
                    rotate: `${angle * (180 / Math.PI)}deg`,
                  } as React.CSSProperties}
                />
              );
            })}
          </span>
        ))}
      </span>
      <div className="relative z-10 flex size-full flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

export { fireworksVariants };
