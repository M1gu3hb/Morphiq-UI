"use client";

import { TestimonialCard } from "@/registry/ui/testimonial-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Testimonial Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * The portraits are inlined SVG data URIs rather than remote images: the site is
 * statically generated, so a preview must never depend on the network to render.
 */

type TestimonialCardVariant = "default";
type TestimonialCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TestimonialCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as TestimonialCardVariant;
}

function asSize(value: string): TestimonialCardSize {
  return (SIZES.includes(value) ? value : "md") as TestimonialCardSize;
}

/** Builds a flat-illustration portrait as a data URI — no network, no layout shift. */
function portrait(background: string, skin: string, hair: string, garment: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <rect width="96" height="96" fill="${background}"/>
      <circle cx="48" cy="38" r="20" fill="${skin}"/>
      <path d="M18 96c3-24 15-36 30-36s27 12 30 36" fill="${garment}"/>
      <path d="M28 33c2-17 32-23 41-3-8-4-14-10-18-16-4 9-12 16-23 19" fill="${hair}"/>
      <circle cx="41" cy="39" r="2" fill="#2c211d"/>
      <circle cx="55" cy="39" r="2" fill="#2c211d"/>
      <path d="M41 48c5 4 10 4 14 0" fill="none" stroke="#5e3e34" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<
  StyleSlug,
  {
    quote: string;
    authorName: string;
    authorRole: string;
    avatarSrc?: string;
    headline?: string;
    href?: string;
    rating: number;
    helpfulCount?: number;
    dateTime: string;
    dateLabel: string;
  }
> = {
  clay: {
    quote:
      "We shipped the whole billing flow in a fortnight. The defaults were already accessible, so nobody had to relitigate focus rings at 2am.",
    authorName: "Maya Chen",
    authorRole: "Design director, Northstar",
    avatarSrc: portrait("#f0dccf", "#c78d68", "#3b2b23", "#8c4a2f"),
    headline: "A fortnight, not a quarter",
    href: "#maya-chen-story",
    rating: 5,
    helpfulCount: 42,
    dateTime: "2026-05-14",
    dateLabel: "May 14, 2026",
  },
  glass: {
    quote:
      "It behaves like a real product system, not a gallery of disconnected visual experiments. Our engineers stopped rewriting components.",
    authorName: "Jonah Bell",
    authorRole: "Product lead, Fieldnote",
    avatarSrc: portrait("#dce7f0", "#a9744f", "#241d1a", "#2f4b6f"),
    href: "#jonah-bell-story",
    rating: 4.5,
    helpfulCount: 18,
    dateTime: "2026-04-02",
    dateLabel: "April 2, 2026",
  },
  skeuo: {
    quote:
      "The tactile surfaces gave our hardware console an identity, and every control still reads perfectly in high-contrast mode.",
    authorName: "Sofía Reyes",
    authorRole: "Founder, Forma Instruments",
    rating: 4,
    dateTime: "2026-03-21",
    dateLabel: "March 21, 2026",
  },
  adaptive: {
    quote:
      "Dark mode was a checkbox instead of a project. The same card looked deliberate on both themes without a single override.",
    authorName: "Priya Raman",
    authorRole: "Staff engineer, Lumen",
    avatarSrc: portrait("#e6e4de", "#8d5a3c", "#1d1a18", "#3d3a52"),
    headline: "Dark mode was a checkbox",
    href: "#priya-raman-story",
    rating: 4.5,
    helpfulCount: 7,
    dateTime: "2026-06-09",
    dateLabel: "June 9, 2026",
  },
};

export function TestimonialCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <div className="flex flex-col items-start gap-[18px]">
      <TestimonialCard
        authorName={copy.authorName}
        authorRole={copy.authorRole}
        avatarSrc={copy.avatarSrc}
        className="w-[min(380px,100%)]"
        data-focus={state === "focus" ? "true" : undefined}
        dateLabel={copy.dateLabel}
        dateTime={copy.dateTime}
        disabled={state === "disabled"}
        headline={copy.headline}
        helpfulCount={copy.helpfulCount}
        href={copy.href}
        material={material}
        quote={copy.quote}
        rating={copy.rating}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
