"use client";

import {
  FlipCard,
  FlipCardDescription,
  FlipCardTitle,
} from "@/registry/ui/flip-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Flip Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it. `key={material}` resets the internal flip state whenever
 * the material switches, so a card never stays turned across a material change.
 */

type FlipCardVariant = "default";
type FlipCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FlipCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as FlipCardVariant;
}

function asSize(value: string): FlipCardSize {
  return (SIZES.includes(value) ? value : "md") as FlipCardSize;
}

type FlipCopy = {
  seed: string;
  cover: string;
  eyebrow: string;
  title: string;
  description: string;
  metaLabel: string;
  dateTime: string;
  dateText: string;
  features: readonly string[];
  linkLabel: string;
};

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, FlipCopy> = {
  clay: {
    seed: "clay-kiln",
    cover: "A row of hand-thrown clay vessels drying on a workshop shelf.",
    eyebrow: "Ceramics",
    title: "Kiln schedule",
    description: "Bisque firing queued for the east chamber.",
    metaLabel: "Loaded",
    dateTime: "2026-07-22T09:00",
    dateText: "Jul 22, 09:00",
    features: ["Ramp to 980 °C over six hours", "Hold, then cool overnight", "Glaze pass follows on Thursday"],
    linkLabel: "Open firing log",
  },
  glass: {
    seed: "glass-atrium",
    cover: "Sunlight passing through a curved glass atrium roof.",
    eyebrow: "Focus",
    title: "Deep work block",
    description: "Notifications are paused until the session ends.",
    metaLabel: "Ends",
    dateTime: "2026-07-22T18:42",
    dateText: "Today, 18:42",
    features: ["Two collaborators still editing", "Auto-summary on completion", "Calendar held clear until then"],
    linkLabel: "View session",
  },
  skeuo: {
    seed: "skeuo-console",
    cover: "Close-up of a mixing console with backlit channel faders.",
    eyebrow: "Channel A",
    title: "Signal chain",
    description: "Input gain trimmed to minus six decibels.",
    metaLabel: "Checked",
    dateTime: "2026-07-22T14:10",
    dateText: "Jul 22, 14:10",
    features: ["Limiter has not engaged this take", "Headroom holding near six dB", "Clean across the full range"],
    linkLabel: "Open patchbay",
  },
  adaptive: {
    seed: "adaptive-ledger",
    cover: "A tidy desk with a laptop showing a monthly finance summary.",
    eyebrow: "Finance",
    title: "Monthly summary",
    description: "Spend is tracking eight percent under plan.",
    metaLabel: "Updated",
    dateTime: "2026-07-22T11:30",
    dateText: "Today, 11:30",
    features: ["Three invoices awaiting approval", "No category over budget", "Forecast refreshed this morning"],
    linkLabel: "Open the ledger",
  },
};

export function FlipCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <FlipCard
      className="w-[min(340px,100%)]"
      data-focus={state === "focus" ? "true" : undefined}
      key={material}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
      front={
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- preview demo image; the component is framework-agnostic */}
          <img
            alt={copy.cover}
            className="h-[116px] w-full rounded-[12px] object-cover"
            height={232}
            src={`https://picsum.photos/seed/${copy.seed}/480/232`}
            width={480}
          />
          <span className="text-[length:10px] font-black uppercase tracking-[0.12em] text-[color:var(--mq-muted,#5c5b55)]">
            {copy.eyebrow}
          </span>
          <FlipCardTitle level={3}>{copy.title}</FlipCardTitle>
          <FlipCardDescription>{copy.description}</FlipCardDescription>
        </>
      }
      back={
        <>
          <FlipCardTitle level={3}>Details</FlipCardTitle>
          <p className="m-0 flex items-baseline gap-[6px] text-[length:12px] text-[color:var(--mq-muted,#5c5b55)]">
            <span className="font-extrabold text-[color:var(--mq-text,#2b2b26)]">{copy.metaLabel}</span>
            <time dateTime={copy.dateTime}>{copy.dateText}</time>
          </p>
          <ul className="m-0 flex list-none flex-col gap-[6px] p-0 text-[length:12px] leading-[1.5] text-[color:var(--mq-text,#2b2b26)]">
            {copy.features.map((feature) => (
              <li className="flex items-start gap-[8px]" key={feature}>
                <span aria-hidden="true" className="mt-[6px] size-[5px] shrink-0 rounded-full bg-current" />
                {feature}
              </li>
            ))}
          </ul>
          <a
            className="relative z-10 w-fit text-[length:12px] font-extrabold text-[color:var(--mq-text,#2b2b26)] underline decoration-2 underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] forced-colors:text-[LinkText]"
            href="https://example.com/docs"
          >
            {copy.linkLabel}
          </a>
        </>
      }
    />
  );
}
