"use client";

import { ExpandableCard } from "@/registry/ui/expandable-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Expandable Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type ExpandableCardVariant = "default";
type ExpandableCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ExpandableCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as ExpandableCardVariant;
}

function asSize(value: string): ExpandableCardSize {
  return (SIZES.includes(value) ? value : "md") as ExpandableCardSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<
  StyleSlug,
  { title: string; summary: string; body: string; points: readonly string[] }
> = {
  clay: {
    title: "Release 4.2 rollout",
    summary: "Shipping to production in stages.",
    body: "The canary has held for two hours with no regressions. Expand for the staged plan and the rollback checkpoint.",
    points: ["12% of traffic live", "Rollback pinned to 4.1.9", "Owner: platform team"],
  },
  glass: {
    title: "Focus session details",
    summary: "Notifications are held until 18:42.",
    body: "Two collaborators are still editing this surface. Expand to see who is present and what they last touched.",
    points: ["Ana — editing the header", "Ravi — reviewing tokens", "Auto-save every 30s"],
  },
  skeuo: {
    title: "Channel A signal chain",
    summary: "Input gain −6 dB, limiter idle.",
    body: "The signal is clean across the range on this take. Expand for the full insert order and the metering notes.",
    points: ["High-pass at 40 Hz", "Compressor 2.5:1", "Peak −3.2 dBFS"],
  },
  adaptive: {
    title: "Monthly billing summary",
    summary: "Spend is tracking 8% under plan.",
    body: "Three invoices are awaiting approval before the close. Expand for the line items and their due dates.",
    points: ["Cloud — $4,120", "Tooling — $860", "Contractors — $2,300"],
  },
};

export function ExpandableCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    // `key={material}` resets the uncontrolled open state when the reader
    // switches material, so each recipe starts collapsed.
    <ExpandableCard
      key={material}
      className="w-[min(380px,100%)]"
      data-focus={state === "focus" ? "true" : undefined}
      headingLevel={3}
      material={material}
      size={asSize(size)}
      summary={copy.summary}
      title={copy.title}
      variant={asVariant(variant)}
    >
      <p className="m-0">{copy.body}</p>
      <ul
        className="m-0 flex list-none flex-col gap-[6px] p-0 text-[color:var(--mq-muted,#5c5b55)]"
        role="list"
      >
        {copy.points.map((point) => (
          <li className="flex items-center gap-[8px]" key={point}>
            <span
              aria-hidden="true"
              className="size-[6px] shrink-0 rounded-full bg-[currentColor]"
            />
            {point}
          </li>
        ))}
      </ul>
    </ExpandableCard>
  );
}
