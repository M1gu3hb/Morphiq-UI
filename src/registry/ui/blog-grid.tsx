/* eslint-disable @next/next/no-img-element -- distributed open-code block stays framework-agnostic */

import * as React from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const blogGridVariants = cva(
  [
    "w-full border text-[color:var(--mq-blog-text,#33261e)]",
    "bg-[var(--mq-blog-bg,#f6e7dd)] border-[var(--mq-blog-border,rgba(120,80,55,0.24))]",
    "[--mq-blog-bg:#f6e7dd] [--mq-blog-card:#fff8f2] [--mq-blog-text:#33261e]",
    "[--mq-blog-muted:#665044] [--mq-blog-accent:#9f321f] [--mq-blog-soft:#f3d5c3]",
    "[--mq-blog-border:rgba(120,80,55,0.24)] [--mq-blog-ring:#171817]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay:
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.78),inset_0_-6px_10px_rgba(140,90,60,0.12),0_8px_0_#dcc4b2,0_22px_38px_rgba(90,60,45,0.18)]",
        glass:
          "[--mq-blog-bg:rgba(255,255,255,0.72)] [--mq-blog-card:rgba(255,255,255,0.82)] [--mq-blog-text:#1e1e1b] [--mq-blog-muted:#3f3f38] [--mq-blog-accent:#5030a8] [--mq-blog-soft:#e9e0ff] [--mq-blog-border:rgba(255,255,255,0.86)] backdrop-blur-[18px] backdrop-saturate-[170%] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_44px_rgba(24,20,40,0.22)]",
        skeuo:
          "[--mq-blog-bg:#e6e3da] [--mq-blog-card:#f5f2eb] [--mq-blog-text:#23231f] [--mq-blog-muted:#4a4943] [--mq-blog-accent:#65472f] [--mq-blog-soft:#d7d1c5] [--mq-blog-border:rgba(25,25,23,0.3)] bg-[linear-gradient(180deg,#f6f4ee,var(--mq-blog-bg,#e6e3da))] shadow-[inset_0_2px_0_rgba(255,255,255,0.92),inset_0_-4px_7px_rgba(0,0,0,0.14),0_7px_0_#a8a49b,0_18px_28px_rgba(38,36,31,0.25)]",
        adaptive:
          "[--mq-blog-bg:#ffffff] [--mq-blog-card:#f7f6f2] [--mq-blog-text:#1c1c19] [--mq-blog-muted:#55554e] [--mq-blog-accent:#5731b8] [--mq-blog-soft:#e9e0ff] [--mq-blog-border:rgba(23,24,23,0.2)] shadow-[0_2px_4px_rgba(20,20,18,0.08),0_20px_44px_rgba(20,20,18,0.12)] dark:[--mq-blog-bg:#232327] dark:[--mq-blog-card:#2c2d32] dark:[--mq-blog-text:#f1efe9] dark:[--mq-blog-muted:#c1beb6] dark:[--mq-blog-accent:#b9a1ff] dark:[--mq-blog-soft:#352e49] dark:[--mq-blog-border:rgba(255,255,255,0.22)]",
      },
      variant: {
        editorial: "",
        compact: "",
      },
      size: {
        sm: "rounded-[22px] p-5 md:p-7",
        md: "rounded-[28px] p-6 md:p-9",
        lg: "rounded-[34px] p-7 md:p-12",
      },
    },
    defaultVariants: { material: "clay", variant: "editorial", size: "md" },
  },
);

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  dateTime: string;
  readingTime: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

const DEFAULT_POSTS: readonly BlogPost[] = [
  { id: "depth", title: "Designing depth that still feels quiet", excerpt: "A practical way to build tactile hierarchy without turning every surface into decoration.", category: "Material systems", date: "July 18, 2026", dateTime: "2026-07-18", readingTime: "6 min read", href: "#depth", imageSrc: "https://picsum.photos/seed/morphiq-depth/960/600", imageAlt: "Layered warm paper forms casting soft shadows" },
  { id: "motion", title: "Motion as a state change, not a spectacle", excerpt: "How timing and reduced-motion paths make feedback clearer for everyone.", category: "Interaction", date: "July 11, 2026", dateTime: "2026-07-11", readingTime: "5 min read", href: "#motion", imageSrc: "https://picsum.photos/seed/morphiq-motion/960/600", imageAlt: "Abstract violet ribbons moving across a neutral field" },
  { id: "open-code", title: "Why open code changes component ownership", excerpt: "The difference between borrowing an API and owning the source your product depends on.", category: "Engineering", date: "July 2, 2026", dateTime: "2026-07-02", readingTime: "8 min read", href: "#open-code", imageSrc: "https://picsum.photos/seed/morphiq-code/960/600", imageAlt: "Editorial workspace with code and component sketches" },
];

export type BlogGridProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof blogGridVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    posts?: readonly BlogPost[];
  };

export function BlogGrid({
  className,
  description = "Notes on component craft, interaction, and the systems behind durable product interfaces.",
  eyebrow = "From the journal",
  heading = "Ideas for building with intention",
  material,
  posts = DEFAULT_POSTS,
  size,
  variant,
  ...props
}: BlogGridProps) {
  const headingId = React.useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn(blogGridVariants({ material, variant, size }), className)}
      {...props}
    >
      <div className="max-w-[720px]">
        <p className="text-xs font-black tracking-[0.15em] text-[var(--mq-blog-accent,#9f321f)] uppercase">{eyebrow}</p>
        <h2 className="mt-3 text-balance text-[clamp(2rem,5vw,3.6rem)]/[1.02] font-black tracking-[-0.055em]" id={headingId}>{heading}</h2>
        <p className="mt-4 max-w-[62ch] text-[15px]/[1.65] text-[var(--mq-blog-muted,#665044)]">{description}</p>
      </div>
      <div className={cn("mt-8 grid gap-5", variant === "editorial" ? "md:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2")}>
        {posts.map((post, index) => (
          <article
            className={cn(
              "group flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[var(--mq-blog-border,rgba(120,80,55,0.24))] bg-[var(--mq-blog-card,#fff8f2)] transition-[box-shadow] duration-200 hover:shadow-[0_16px_34px_rgba(42,36,27,0.16)] motion-reduce:transition-none forced-colors:border-[CanvasText] forced-colors:shadow-none",
              variant === "editorial" && index === 0 && "md:col-span-2 lg:col-span-1",
            )}
            key={post.id}
          >
            <div className="aspect-[16/10] overflow-hidden border-b border-[var(--mq-blog-border,rgba(120,80,55,0.24))] bg-[var(--mq-blog-soft,#f3d5c3)]">
              <img
                alt={post.imageAlt}
                className="size-full object-cover transition-[scale] duration-300 group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                height={600}
                loading="lazy"
                src={post.imageSrc}
                width={960}
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-black tracking-[0.12em] text-[var(--mq-blog-accent,#9f321f)] uppercase">{post.category}</p>
              <h3 className="mt-3 text-xl/[1.2] font-black tracking-[-0.035em]">
                <a
                  aria-label={`Read ${post.title}`}
                  className="rounded focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-blog-ring,#171817)]"
                  href={post.href}
                >
                  {post.title}
                </a>
              </h3>
              <p className="mt-3 text-sm/[1.65] text-[var(--mq-blog-muted,#665044)]">{post.excerpt}</p>
              <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-5 text-xs font-bold text-[var(--mq-blog-muted,#665044)]">
                <time dateTime={post.dateTime}>{post.date}</time>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 aria-hidden="true" className="size-3.5" />{post.readingTime}</span>
                <ArrowUpRight aria-hidden="true" className="ml-auto size-4 text-[var(--mq-blog-accent,#9f321f)]" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export { blogGridVariants };
