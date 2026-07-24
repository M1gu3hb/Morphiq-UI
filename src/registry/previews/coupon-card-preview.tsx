"use client";

import { CouponCard } from "@/registry/ui/coupon-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Coupon Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * There is no artwork to load — the ticket silhouette is a CSS mask, so the
 * preview needs neither a network image nor a data URI. Every expiry is passed
 * as an ISO literal plus its display string; the clock is never read, so the
 * server and the client render byte-identical markup.
 */

type CouponCardVariant = "default";
type CouponCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): CouponCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as CouponCardVariant;
}

function asSize(value: string): CouponCardSize {
  return (SIZES.includes(value) ? value : "md") as CouponCardSize;
}

type CouponCopy = {
  kicker: string;
  value: string;
  title: string;
  terms: string;
  code: string;
  codeLabel: string;
  /** Half the materials start hidden, so both code states are documented. */
  revealable: boolean;
  status?: string;
  expiresOn: string;
  expiresLabel: string;
};

/** Copy differs per material so each recipe is shown doing real voucher work. */
const COPY: Record<StyleSlug, CouponCopy> = {
  clay: {
    kicker: "Spring sale",
    value: "25% OFF",
    title: "Hand-thrown stoneware, site-wide",
    terms:
      "One use per customer. Applies to full-price pottery only; excludes gift cards, kiln services and clearance.",
    code: "CLAY25",
    codeLabel: "Promo code",
    revealable: false,
    expiresOn: "2026-08-31",
    expiresLabel: "August 31, 2026",
  },
  glass: {
    kicker: "Weekend only",
    value: "$15 OFF",
    title: "Mouth-blown carafes and tumblers",
    terms:
      "Minimum spend of $60 before tax. Cannot be combined with other offers or with studio credit.",
    code: "GLASS15WKND",
    codeLabel: "Voucher code",
    revealable: true,
    status: "New",
    expiresOn: "2026-07-27",
    expiresLabel: "July 27, 2026",
  },
  skeuo: {
    kicker: "Studio clearance",
    value: "2 FOR 1",
    title: "Field recorders and boom kits",
    terms:
      "The lower-priced item is free. Limited to two redemptions per account while stock lasts; in-store and online.",
    code: "SKEUO2FOR1",
    codeLabel: "Promo code",
    revealable: false,
    status: "Last day",
    expiresOn: "2026-07-24",
    expiresLabel: "July 24, 2026",
  },
  adaptive: {
    kicker: "Members only",
    value: "40% OFF",
    title: "First year of the workshop plan",
    terms:
      "New subscriptions only. Renews at the standard rate after the first year; cancel any time from your account.",
    code: "MEMBER40",
    codeLabel: "Member code",
    revealable: true,
    expiresOn: "2026-09-15",
    expiresLabel: "September 15, 2026",
  },
};

export function CouponCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <div className="flex flex-col items-start gap-[18px]">
      <CouponCard
        className="w-[min(360px,100%)]"
        code={copy.code}
        codeLabel={copy.codeLabel}
        copiedLabel="Copied"
        copyLabel="Copy"
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        expiresLabel={copy.expiresLabel}
        expiresOn={copy.expiresOn}
        href="#offer"
        kicker={copy.kicker}
        material={material}
        revealable={copy.revealable}
        size={asSize(size)}
        status={copy.status}
        terms={copy.terms}
        title={copy.title}
        value={copy.value}
        variant={asVariant(variant)}
      />
    </div>
  );
}
