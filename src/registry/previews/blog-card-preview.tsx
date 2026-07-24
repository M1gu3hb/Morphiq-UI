"use client";

import { BlogCard } from "@/registry/ui/blog-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Blog Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * The artwork is generated as inline SVG data URIs rather than hotlinked: the
 * site is statically generated and a preview must never depend on the network.
 * Both helpers are pure string builders — no clock, no randomness — so the
 * server and the client render byte-identical markup.
 */

type BlogCardVariant = "default";
type BlogCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): BlogCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as BlogCardVariant;
}

function asSize(value: string): BlogCardSize {
  return (SIZES.includes(value) ? value : "md") as BlogCardSize;
}

function dataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Abstract editorial cover at a real 16:10 so the well never shifts. */
function coverArt(from: string, to: string, ink: string): string {
  return dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600">` +
      `<defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
      `</linearGradient></defs>` +
      `<rect width="960" height="600" fill="url(#a)"/>` +
      `<circle cx="738" cy="168" r="146" fill="${ink}" fill-opacity="0.18"/>` +
      `<circle cx="246" cy="486" r="206" fill="${ink}" fill-opacity="0.12"/>` +
      `<path d="M0 436 L296 254 L556 402 L960 158 L960 600 L0 600 Z" fill="${ink}" fill-opacity="0.24"/>` +
      `<rect x="88" y="92" width="232" height="10" rx="5" fill="${ink}" fill-opacity="0.42"/>` +
      `<rect x="88" y="126" width="148" height="10" rx="5" fill="${ink}" fill-opacity="0.28"/>` +
      `</svg>`,
  );
}

/** Square avatar placeholder, so the byline holds its height before load. */
function avatarArt(bg: string, ink: string): string {
  return dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
      `<rect width="96" height="96" fill="${bg}"/>` +
      `<circle cx="48" cy="37" r="17" fill="${ink}"/>` +
      `<path d="M11 96c0-20.4 16.6-37 37-37s37 16.6 37 37z" fill="${ink}"/>` +
      `</svg>`,
  );
}

/** Copy differs per material so each recipe is shown doing real editorial work. */
const COPY: Record<
  StyleSlug,
  {
    category: string;
    title: string;
    excerpt: string;
    cover: string;
    coverAlt: string;
    avatar: string;
    author: string;
    dateIso: string;
    dateLabel: string;
    readingTime: string;
  }
> = {
  clay: {
    category: "Material systems",
    title: "Designing depth that still feels quiet",
    excerpt:
      "Extrusion, contact shadow and a lit top edge do most of the work. Here is how to build tactile hierarchy without turning every surface into decoration.",
    cover: coverArt("#f7ded0", "#e0b79c", "#7a3a1e"),
    coverAlt: "Layered terracotta paper shapes casting soft overlapping shadows",
    avatar: avatarArt("#eed6c6", "#8d2f1c"),
    author: "Nadia Ferrer",
    dateIso: "2026-07-18",
    dateLabel: "July 18, 2026",
    readingTime: "6 min read",
  },
  glass: {
    category: "Interaction",
    title: "Motion as a state change, not a spectacle",
    excerpt:
      "Timing, easing and an honest reduced-motion path turn animation into feedback people can actually read instead of something they have to wait out.",
    cover: coverArt("#e8ecff", "#b8c3f0", "#2a2166"),
    coverAlt: "Translucent blue panes drifting across a pale gradient field",
    avatar: avatarArt("#dfe4fb", "#33257a"),
    author: "Iván Solís",
    dateIso: "2026-07-11",
    dateLabel: "July 11, 2026",
    readingTime: "5 min read",
  },
  skeuo: {
    category: "Craft",
    title: "The quiet return of tactile interfaces",
    excerpt:
      "Bevels and grain fell out of fashion for good reasons. The parts worth keeping are the ones that tell your hand where the control actually is.",
    cover: coverArt("#f4f1e8", "#cfc9ba", "#3d3320"),
    coverAlt: "A machined dial and toggle switch photographed on warm greige felt",
    avatar: avatarArt("#d8d3c6", "#4a3418"),
    author: "Marguerite Hale",
    dateIso: "2026-06-29",
    dateLabel: "June 29, 2026",
    readingTime: "9 min read",
  },
  adaptive: {
    category: "Engineering",
    title: "Why open code changes component ownership",
    excerpt:
      "There is a real difference between borrowing an API and owning the source your product depends on. It shows up the first time you need to change one line.",
    cover: coverArt("#eeeaff", "#c6bcf5", "#241a63"),
    coverAlt: "A workspace with component sketches beside an open code editor",
    avatar: avatarArt("#e7e2fb", "#3d2f9e"),
    author: "Theo Lindqvist",
    dateIso: "2026-07-02",
    dateLabel: "July 2, 2026",
    readingTime: "8 min read",
  },
};

export function BlogCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <div className="flex flex-col items-start gap-[18px]">
      <BlogCard
        authorAvatarSrc={copy.avatar}
        authorName={copy.author}
        category={copy.category}
        className="w-[min(360px,100%)]"
        coverAlt={copy.coverAlt}
        coverSrc={copy.cover}
        data-focus={state === "focus" ? "true" : undefined}
        dateIso={copy.dateIso}
        dateLabel={copy.dateLabel}
        disabled={state === "disabled"}
        excerpt={copy.excerpt}
        href="#post"
        loading={state === "loading"}
        material={material}
        readingTime={copy.readingTime}
        size={asSize(size)}
        title={copy.title}
        variant={asVariant(variant)}
      />
    </div>
  );
}
