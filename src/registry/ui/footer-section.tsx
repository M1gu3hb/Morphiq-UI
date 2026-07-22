import * as React from "react";
import { Code2, Globe2, Network, Sparkles } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const footerSectionVariants = cva(
  [
    "w-full border bg-[var(--mq-footer-bg,#f4f1ea)] text-[color:var(--mq-footer-text,#201f1b)]",
    "border-[var(--mq-footer-border,#89857b)] [--mq-footer-bg:#f4f1ea] [--mq-footer-text:#201f1b]",
    "[--mq-footer-muted:#555249] [--mq-footer-accent:#5731b8] [--mq-footer-border:#89857b]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        light: "[--mq-footer-bg:#f4f1ea] [--mq-footer-text:#201f1b] [--mq-footer-muted:#555249] [--mq-footer-accent:#5731b8] [--mq-footer-border:#89857b]",
        dark: "[--mq-footer-bg:#18191d] [--mq-footer-text:#f6f3ec] [--mq-footer-muted:#c5c1b8] [--mq-footer-accent:#b9a1ff] [--mq-footer-border:#918d84]",
      },
      size: {
        sm: "rounded-[20px] p-6 md:p-8",
        md: "rounded-[26px] p-7 md:p-10",
        lg: "rounded-[32px] p-8 md:p-12",
      },
    },
    defaultVariants: { variant: "light", size: "md" },
  },
);

export type FooterLink = { label: string; href: string };
export type FooterLinkGroup = { title: string; links: readonly FooterLink[] };
export type FooterSocialLink = FooterLink & { icon: React.ReactNode };

const DEFAULT_GROUPS: readonly FooterLinkGroup[] = [
  { title: "Product", links: [{ label: "Components", href: "#components" }, { label: "Templates", href: "#templates" }, { label: "Changelog", href: "#changelog" }] },
  { title: "Company", links: [{ label: "About", href: "#about" }, { label: "Journal", href: "#journal" }, { label: "Careers", href: "#careers" }] },
  { title: "Resources", links: [{ label: "Documentation", href: "#docs" }, { label: "Accessibility", href: "#accessibility" }, { label: "Support", href: "#support" }] },
];

const DEFAULT_SOCIALS: readonly FooterSocialLink[] = [
  { label: "GitHub", href: "#github", icon: <Code2 /> },
  { label: "LinkedIn", href: "#linkedin", icon: <Network /> },
  { label: "Dribbble", href: "#dribbble", icon: <Globe2 /> },
];

export type FooterSectionProps = React.ComponentPropsWithoutRef<"footer"> &
  VariantProps<typeof footerSectionVariants> & {
    brandName?: string;
    tagline?: React.ReactNode;
    groups?: readonly FooterLinkGroup[];
    socialLinks?: readonly FooterSocialLink[];
    legalLinks?: readonly FooterLink[];
    copyright?: string;
  };

export function FooterSection({
  className,
  variant,
  size,
  brandName = "Morphiq",
  tagline = "Tactile building blocks for teams that care about the details.",
  groups = DEFAULT_GROUPS,
  socialLinks = DEFAULT_SOCIALS,
  legalLinks = [{ label: "Privacy", href: "#privacy" }, { label: "Terms", href: "#terms" }],
  copyright = "© 2026 Morphiq. All rights reserved.",
  ...props
}: FooterSectionProps) {
  return (
    <footer className={cn(footerSectionVariants({ variant, size }), className)} {...props}>
      <div className="grid gap-10 md:grid-cols-[minmax(220px,1.2fr)_2fr] lg:gap-16">
        <div className="max-w-[320px]">
          <a className="inline-flex items-center gap-2 rounded-md text-xl font-black tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--mq-footer-accent,#5731b8)]" href="#top">
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-[11px] bg-[var(--mq-footer-accent,#5731b8)] text-white forced-colors:bg-[ButtonText] forced-colors:text-[ButtonFace]"><Sparkles className="size-4" /></span>
            {brandName}
          </a>
          <p className="mt-4 text-sm/[1.65] text-[var(--mq-footer-muted,#555249)]">{tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <nav aria-label={`${group.title} links`} key={group.title}>
              <h2 className="text-sm font-black">{group.title}</h2>
              <ul className="mt-4 grid list-none gap-3 p-0">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a className="rounded text-sm text-[var(--mq-footer-muted,#555249)] transition-[color] duration-200 hover:text-[var(--mq-footer-text,#201f1b)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-footer-accent,#5731b8)] motion-reduce:transition-none" href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-5 border-t border-[var(--mq-footer-border,#89857b)] pt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-xs/[1.5] text-[var(--mq-footer-muted,#555249)]">{copyright}</p>
        <div className="flex flex-wrap items-center gap-4">
          <nav aria-label="Legal">
            <ul className="flex list-none flex-wrap gap-4 p-0">
              {legalLinks.map((link) => <li key={link.label}><a className="rounded text-xs text-[var(--mq-footer-muted,#555249)] hover:text-[var(--mq-footer-text,#201f1b)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-footer-accent,#5731b8)]" href={link.href}>{link.label}</a></li>)}
            </ul>
          </nav>
          <nav aria-label="Social media">
            <ul className="flex list-none gap-2 p-0">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a aria-label={link.label} className="grid size-9 place-items-center rounded-full border border-[var(--mq-footer-border,#89857b)] text-[var(--mq-footer-text,#201f1b)] transition-[background-color,color] duration-200 hover:bg-[var(--mq-footer-accent,#5731b8)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-footer-accent,#5731b8)] motion-reduce:transition-none forced-colors:border-[LinkText] [&>svg]:size-4" href={link.href}>
                    {link.icon}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export { footerSectionVariants };
