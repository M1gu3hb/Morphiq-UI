/* eslint-disable @next/next/no-img-element -- distributed open-code block stays framework-agnostic */

import * as React from "react";
import { Globe2, Link2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const teamSectionVariants = cva(
  [
    "w-full border bg-[var(--mq-team-bg,#f6f3ec)] text-[color:var(--mq-team-text,#201f1b)]",
    "border-[var(--mq-team-border,#89857b)] [--mq-team-bg:#f6f3ec] [--mq-team-card:#ffffff]",
    "[--mq-team-text:#201f1b] [--mq-team-muted:#555249] [--mq-team-accent:#5731b8]",
    "[--mq-team-soft:#e9e0ff] [--mq-team-border:#89857b]",
    "dark:[--mq-team-bg:#191a1e] dark:[--mq-team-card:#26272c] dark:[--mq-team-text:#f6f3ec]",
    "dark:[--mq-team-muted:#c5c1b8] dark:[--mq-team-accent:#b9a1ff]",
    "dark:[--mq-team-soft:#352e49] dark:[--mq-team-border:#918d84]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        grid: "",
        compact: "",
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

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatarSrc: string;
  links?: readonly { label: string; href: string; type?: "linkedin" | "website" }[];
};

const DEFAULT_MEMBERS: readonly TeamMember[] = [
  { id: "maya", name: "Maya Chen", role: "Product design", bio: "Turns complex workflows into calm, tactile systems.", avatarSrc: "https://picsum.photos/seed/morphiq-maya/320/320", links: [{ label: "Maya Chen on LinkedIn", href: "#maya-linkedin", type: "linkedin" }, { label: "Maya Chen website", href: "#maya-site", type: "website" }] },
  { id: "leo", name: "Leo Ramos", role: "Frontend systems", bio: "Builds durable component APIs and resilient interaction paths.", avatarSrc: "https://picsum.photos/seed/morphiq-leo/320/320", links: [{ label: "Leo Ramos on LinkedIn", href: "#leo-linkedin", type: "linkedin" }] },
  { id: "amira", name: "Amira Okafor", role: "Accessibility", bio: "Keeps semantics, contrast, and keyboard behavior in the first draft.", avatarSrc: "https://picsum.photos/seed/morphiq-amira/320/320", links: [{ label: "Amira Okafor website", href: "#amira-site", type: "website" }] },
  { id: "noah", name: "Noah Silva", role: "Motion direction", bio: "Uses movement to clarify state without stealing attention.", avatarSrc: "https://picsum.photos/seed/morphiq-noah/320/320", links: [{ label: "Noah Silva on LinkedIn", href: "#noah-linkedin", type: "linkedin" }] },
];

export type TeamSectionProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof teamSectionVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    members?: readonly TeamMember[];
  };

export function TeamSection({
  className,
  description = "A cross-functional group that treats accessibility, systems, and visual craft as one product problem.",
  eyebrow = "The people",
  heading = "Small team, deep ownership",
  members = DEFAULT_MEMBERS,
  size,
  variant,
  ...props
}: TeamSectionProps) {
  const headingId = React.useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn(teamSectionVariants({ variant, size }), className)}
      {...props}
    >
      <div className="max-w-[720px]">
        <p className="text-xs font-black tracking-[0.15em] text-[var(--mq-team-accent,#5731b8)] uppercase">{eyebrow}</p>
        <h2 className="mt-3 text-balance text-[clamp(2rem,5vw,3.6rem)]/[1.02] font-black tracking-[-0.055em]" id={headingId}>{heading}</h2>
        <p className="mt-4 max-w-[62ch] text-[15px]/[1.65] text-[var(--mq-team-muted,#555249)]">{description}</p>
      </div>
      <ul
        className={cn(
          "mt-8 grid list-none gap-4 p-0",
          variant === "grid" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2",
        )}
      >
        {members.map((member) => (
          <li key={member.id}>
            <article
              className={cn(
                "h-full rounded-[20px] border border-[var(--mq-team-border,#89857b)] bg-[var(--mq-team-card,#ffffff)] p-4 transition-[border-color,box-shadow] duration-200 hover:border-[var(--mq-team-accent,#5731b8)] hover:shadow-[0_14px_30px_rgba(35,31,24,0.13)] motion-reduce:transition-none forced-colors:border-[CanvasText] forced-colors:shadow-none",
                variant === "compact" && "grid grid-cols-[72px_1fr] items-start gap-4",
              )}
            >
              <img
                alt={`${member.name}, ${member.role}`}
                className={cn("aspect-square w-full rounded-[16px] border border-[var(--mq-team-border,#89857b)] object-cover forced-colors:border-[CanvasText]", variant === "compact" && "size-[72px]")}
                height={320}
                loading="lazy"
                src={member.avatarSrc}
                width={320}
              />
              <div className={variant === "grid" ? "mt-4" : ""}>
                <h3 className="text-lg font-black tracking-[-0.025em]">{member.name}</h3>
                <p className="mt-1 text-sm font-extrabold text-[var(--mq-team-accent,#5731b8)]">{member.role}</p>
                {member.bio ? <p className="mt-3 text-sm/[1.6] text-[var(--mq-team-muted,#555249)]">{member.bio}</p> : null}
                {member.links?.length ? (
                  <ul aria-label={`${member.name} links`} className="mt-4 flex list-none gap-2 p-0">
                    {member.links.map((link) => (
                      <li key={link.label}>
                        <a
                          aria-label={link.label}
                          className="grid size-9 place-items-center rounded-full border border-[var(--mq-team-border,#89857b)] text-[var(--mq-team-text,#201f1b)] transition-[background-color,color] duration-200 hover:bg-[var(--mq-team-accent,#5731b8)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-team-accent,#5731b8)] motion-reduce:transition-none forced-colors:border-[LinkText]"
                          href={link.href}
                        >
                          {link.type === "linkedin" ? <Link2 aria-hidden="true" className="size-4" /> : <Globe2 aria-hidden="true" className="size-4" />}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { teamSectionVariants };
