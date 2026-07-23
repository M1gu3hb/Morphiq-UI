"use client";

import { PricingCard } from "@/registry/ui/pricing-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Pricing Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 */

type PricingCardVariant = "default" | "featured";
type PricingCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "featured"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): PricingCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as PricingCardVariant;
}

function asSize(value: string): PricingCardSize {
  return (SIZES.includes(value) ? value : "md") as PricingCardSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<
  StyleSlug,
  {
    planName: string;
    planDescription: string;
    price: string;
    period: string;
    features: readonly string[];
    ctaLabel: string;
  }
> = {
  clay: {
    planName: "Studio",
    planDescription: "For small teams shipping weekly.",
    price: "$29",
    period: "/mo",
    features: [
      "Up to 10 projects",
      "Unlimited collaborators",
      "Version history for 90 days",
      "Email and chat support",
    ],
    ctaLabel: "Start free trial",
  },
  glass: {
    planName: "Focus",
    planDescription: "For makers who work in deep sessions.",
    price: "$12",
    period: "/mo",
    features: [
      "Distraction-free workspace",
      "Two synced devices",
      "Weekly summary reports",
      "Priority sync",
    ],
    ctaLabel: "Choose Focus",
  },
  skeuo: {
    planName: "Console",
    planDescription: "For engineers who live in the mixer.",
    price: "$48",
    period: "/mo",
    features: [
      "16 channels of routing",
      "Lossless export presets",
      "Hardware controller support",
      "Nightly session backups",
    ],
    ctaLabel: "Get Console",
  },
  adaptive: {
    planName: "Business",
    planDescription: "For companies that need controls.",
    price: "$96",
    period: "/mo",
    features: [
      "SSO and SCIM provisioning",
      "Role-based access control",
      "Audit log export",
      "99.9% uptime SLA",
    ],
    ctaLabel: "Talk to sales",
  },
};

export function PricingCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const resolvedVariant = asVariant(variant);
  const isDisabled = state === "disabled";

  return (
    <div className="flex items-start justify-center p-[8px]">
      <PricingCard
        className="w-[min(320px,100%)]"
        ctaLabel={copy.ctaLabel}
        data-focus={state === "focus" ? "true" : undefined}
        disabled={isDisabled}
        features={copy.features}
        headingLevel={3}
        material={material}
        period={copy.period}
        planDescription={copy.planDescription}
        planName={copy.planName}
        price={copy.price}
        size={asSize(size)}
        variant={resolvedVariant}
      />
    </div>
  );
}
