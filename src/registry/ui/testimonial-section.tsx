import * as React from "react";
import { Quote } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const testimonialSectionVariants = cva(
  [
    "w-full border bg-[var(--mq-testimonials-bg,#f6f3ec)] text-[color:var(--mq-testimonials-text,#201f1b)]",
    "border-[var(--mq-testimonials-border,#89857b)] [--mq-testimonials-bg:#f6f3ec] [--mq-testimonials-card:#ffffff]",
    "[--mq-testimonials-text:#201f1b] [--mq-testimonials-muted:#555249] [--mq-testimonials-accent:#5731b8]",
    "[--mq-testimonials-border:#89857b] [--mq-testimonials-soft:#e9e0ff]",
    "dark:[--mq-testimonials-bg:#191a1e] dark:[--mq-testimonials-card:#26272c] dark:[--mq-testimonials-text:#f6f3ec]",
    "dark:[--mq-testimonials-muted:#c5c1b8] dark:[--mq-testimonials-accent:#b9a1ff]",
    "dark:[--mq-testimonials-border:#918d84] dark:[--mq-testimonials-soft:#352e49]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        grid: "shadow-[0_22px_58px_rgba(35,31,24,0.11)] forced-colors:shadow-none",
        spotlight: "shadow-none",
      },
      size: {
        sm: "rounded-[22px] p-5 md:p-7",
        md: "rounded-[28px] p-6 md:p-9",
        lg: "rounded-[34px] p-7 md:p-12",
      },
    },
    defaultVariants: { variant: "grid", size: "md" },
  },
);

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarSrc: string;
};

const DEFAULT_TESTIMONIALS: readonly TestimonialItem[] = [
  { id: "maya", quote: "The system gave us enough character to feel distinct and enough discipline to ship without hesitation.", name: "Maya Chen", role: "Design director, Northstar", avatarSrc: "https://picsum.photos/seed/mq-maya/96/96" },
  { id: "jon", quote: "Our team stopped debating tiny interaction details because the defaults were already thoughtful and accessible.", name: "Jon Bell", role: "Product lead, Fieldnote", avatarSrc: "https://picsum.photos/seed/mq-jon/96/96" },
  { id: "sofia", quote: "It behaves like a real product system, not a gallery of disconnected visual experiments.", name: "Sofía Reyes", role: "Founder, Forma", avatarSrc: "https://picsum.photos/seed/mq-sofia/96/96" },
];

export type TestimonialSectionProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof testimonialSectionVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    testimonials?: readonly TestimonialItem[];
  };

export function TestimonialSection({
  className,
  variant,
  size,
  eyebrow = "Trusted in the work",
  heading = "Teams feel the difference",
  testimonials = DEFAULT_TESTIMONIALS,
  ...props
}: TestimonialSectionProps) {
  return (
    <section className={cn(testimonialSectionVariants({ variant, size }), className)} {...props}>
      <div className={cn("max-w-[720px]", variant === "spotlight" && "mx-auto text-center")}>
        <p className="m-0 text-xs font-black tracking-[0.15em] text-[var(--mq-testimonials-accent,#5731b8)] uppercase">{eyebrow}</p>
        <h2 className="mt-3 text-balance text-[clamp(2rem,5vw,3.7rem)]/[1.02] font-black tracking-[-0.055em]">{heading}</h2>
      </div>
      <div className={cn("mt-8 grid gap-4", variant === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "mx-auto max-w-[820px]")}>
        {testimonials.map((testimonial, index) => (
          <figure
            className={cn(
              "m-0 flex min-w-0 flex-col rounded-[20px] border border-[var(--mq-testimonials-border,#89857b)] bg-[var(--mq-testimonials-card,#ffffff)] p-5 shadow-[0_8px_22px_rgba(40,35,27,0.08)] forced-colors:border-[CanvasText] forced-colors:shadow-none",
              variant === "spotlight" && index > 0 && "hidden",
            )}
            key={testimonial.id}
          >
            <Quote aria-hidden="true" className="size-7 text-[var(--mq-testimonials-accent,#5731b8)]" fill="currentColor" />
            <blockquote className="mt-5 flex-1 text-[clamp(1rem,2vw,1.15rem)]/[1.6] font-bold tracking-[-0.015em]">
              <p>“{testimonial.quote}”</p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--mq-testimonials-border,#89857b)] pt-4">
              {/* Native img keeps this copy-and-own component framework-agnostic;
                  the adjacent cite already provides the person's identity. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="size-11 shrink-0 rounded-full border border-[var(--mq-testimonials-border,#89857b)] object-cover forced-colors:border-[CanvasText]" height={44} loading="lazy" src={testimonial.avatarSrc} width={44} />
              <cite className="min-w-0 not-italic">
                <span className="block truncate text-sm font-black">{testimonial.name}</span>
                <span className="block truncate text-xs/[1.5] text-[var(--mq-testimonials-muted,#555249)]">{testimonial.role}</span>
              </cite>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export { testimonialSectionVariants };
